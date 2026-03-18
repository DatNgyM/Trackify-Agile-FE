"use client";

import { useState, useId, useEffect } from "react";
import { subscribeKanban } from "@/lib/socket";
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { motion } from "framer-motion";
import { Card } from "@/components/ui";

type TaskType = "Bug" | "Feature";
type Status = "todo" | "in_process" | "done";

interface TaskItem {
  id: string;
  type: TaskType;
  title: string;
  date: string;
  progress: string;
  status: Status;
}

const initialTasks: TaskItem[] = [
  { id: "1", type: "Bug", title: "Fix login issues.", date: "Jan, 21, 2026", progress: "✔ 0/1", status: "todo" },
  { id: "2", type: "Bug", title: "Update Help Center", date: "Jan, 21, 2026", progress: "✔ 0/1", status: "todo" },
  { id: "3", type: "Bug", title: "API Login 500 error on wrong password", date: "Jan, 21, 2026", progress: "✔ 0/1", status: "todo" },
  { id: "4", type: "Feature", title: "Test chat on Website", date: "Jan, 21, 2026", progress: "✔ 0/1", status: "in_process" },
  { id: "5", type: "Bug", title: "Fix login issues.", date: "Jan, 21, 2026", progress: "✔ 0/1", status: "in_process" },
  { id: "6", type: "Bug", title: "Update Help Center", date: "Jan, 21, 2026", progress: "✔ 0/1", status: "in_process" },
  { id: "7", type: "Bug", title: "API Login 500 error", date: "Jan, 21, 2026", progress: "✔ 0/1", status: "done" },
  { id: "8", type: "Bug", title: "Fix login issues.", date: "Jan, 21, 2026", progress: "✔ 0/1", status: "done" },
  { id: "9", type: "Bug", title: "Update Help Center", date: "Jan, 21, 2026", progress: "✔ 1/1", status: "done" },
];

const columns: { key: Status; label: string }[] = [
  { key: "todo", label: "To do" },
  { key: "in_process", label: "In process" },
  { key: "done", label: "Done" },
];

const typeStyles: Record<TaskType, string> = {
  Bug: "bg-destructive/15 text-destructive",
  Feature: "bg-primary/15 text-primary",
};

function DroppableColumn({
  id,
  label,
  tasks,
  onCardClick,
}: {
  id: Status;
  label: string;
  tasks: TaskItem[];
  onCardClick?: (task: TaskItem) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-w-[280px] flex flex-col rounded-xl border-2 transition-colors ${
        isOver ? "border-primary bg-primary/5" : "border-transparent bg-muted/80"
      }`}
    >
      <div className="px-4 py-3 border-b border-border rounded-t-xl">
        <h2 className="text-sm font-semibold text-foreground">{label}</h2>
      </div>
      <div className="flex-1 p-3 flex flex-col gap-3 overflow-y-auto min-h-[200px]">
        {tasks.map((task) => (
          <DraggableCard key={task.id} task={task} onCardClick={onCardClick} />
        ))}
      </div>
    </div>
  );
}

function DraggableCard({ task, onCardClick }: { task: TaskItem; onCardClick?: (task: TaskItem) => void }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
    data: { task },
  });
  const tagClass = task.status === "done" ? "bg-primary/15 text-primary" : typeStyles[task.type];
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={isDragging ? "opacity-50" : ""}
    >
      <Card
        className="p-4 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
        onClick={() => onCardClick?.(task)}
      >
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${tagClass}`}>
          <BugIcon className="w-3.5 h-3.5" />
          {task.type}
        </span>
        <p className="mt-2 text-sm text-foreground leading-snug">{task.title}</p>
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-foreground font-medium">
              ?
            </div>
            <span>{task.date}</span>
          </div>
          <span>{task.progress}</span>
        </div>
      </Card>
    </div>
  );
}

function BugIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6 14h12M7 18h10M6 8V6a4 4 0 018 0v2M16 8V6a4 4 0 01-8 0v2" />
    </svg>
  );
}

export default function TasksBoardPage() {
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const droppableId = useId();

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;

  // Socket: nhận cập nhật Kanban từ BE (tự động cập nhật không cần F5)
  useEffect(() => {
    const unsub = subscribeKanban((data: unknown) => {
      const payload = data as { tasks?: TaskItem[] };
      if (Array.isArray(payload.tasks)) setTasks(payload.tasks);
    });
    return () => {
      if (unsub) unsub();
    };
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const newStatus = over.id as Status;
    if (!columns.some((c) => c.key === newStatus)) return;
    setTasks((prev) =>
      prev.map((t) => (t.id === active.id ? { ...t, status: newStatus } : t))
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Card className="min-h-[500px] p-6">
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {columns.map((col) => (
              <DroppableColumn
                key={col.key}
                id={col.key}
                label={col.label}
                tasks={tasks.filter((t) => t.status === col.key)}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTask ? (
              <Card className="p-4 shadow-lg cursor-grabbing w-[280px]">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    typeStyles[activeTask.type]
                  }`}
                >
                  <BugIcon className="w-3.5 h-3.5" />
                  {activeTask.type}
                </span>
                <p className="mt-2 text-sm text-foreground leading-snug">{activeTask.title}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{activeTask.date}</span>
                  <span>{activeTask.progress}</span>
                </div>
              </Card>
            ) : null}
          </DragOverlay>
        </DndContext>
      </Card>
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui";

type TaskType = "Bug" | "Feature";
type Status = "todo" | "in_process" | "done";

interface TaskCard {
  id: string;
  type: TaskType;
  title: string;
  date: string;
  progress: string;
  status: Status;
}

const mockTasks: TaskCard[] = [
  { id: "1", type: "Bug", title: "Fix login issues.", date: "Jan, 21, 2026", progress: "✔ 0/1", status: "todo" },
  { id: "2", type: "Bug", title: "Update Help Center", date: "Jan, 21, 2026", progress: "✔ 0/1", status: "todo" },
  { id: "3", type: "Bug", title: "The API Login returns a 500 error when the password is incorrect.", date: "Jan, 21, 2026", progress: "✔ 0/1", status: "todo" },
  { id: "4", type: "Feature", title: "Test chat on Website", date: "Jan, 21, 2026", progress: "✔ 0/1", status: "in_process" },
  { id: "5", type: "Bug", title: "Fix login issues.", date: "Jan, 21, 2026", progress: "✔ 0/1", status: "in_process" },
  { id: "6", type: "Bug", title: "Update Help Center", date: "Jan, 21, 2026", progress: "✔ 0/1", status: "in_process" },
  { id: "7", type: "Bug", title: "The API Login returns a 500 error when the password is incorrect.", date: "Jan, 21, 2026", progress: "✔ 0/1", status: "done" },
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

export default function ProjectBoardPage() {
  return (
    <Card className="min-h-[500px] p-6">
      <div className="flex gap-4 overflow-x-auto pb-2 h-full">
        {columns.map((col, colIndex) => {
          const tasks = mockTasks.filter((t) => t.status === col.key);
          return (
            <motion.div
              key={col.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: colIndex * 0.05, ease: "easeOut" }}
              className="flex-1 min-w-[300px]"
            >
              <Card variant="muted" className="flex flex-col h-full overflow-hidden border-0 bg-muted/80">
                <div className="px-4 py-3 bg-muted border-b border-border">
                  <h2 className="text-sm font-semibold text-foreground">{col.label}</h2>
                </div>
                <div className="flex-1 p-3 flex flex-col gap-3 overflow-y-auto min-h-[200px]">
                  {tasks.map((task, i) => (
                    <TaskCard key={task.id} task={task} index={i} />
                  ))}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}

function TaskCard({ task, index }: { task: TaskCard; index: number }) {
  const tagClass = task.status === "done" ? "bg-primary/15 text-primary" : typeStyles[task.type];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, delay: index * 0.03, ease: "easeOut" }}
    >
      <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
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
    </motion.div>
  );
}

function BugIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6 14h12M7 18h10M6 8V6a4 4 0 018 0v2M16 8V6a4 4 0 01-8 0v2" />
    </svg>
  );
}

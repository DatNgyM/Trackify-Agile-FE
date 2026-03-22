"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button, Card } from "@/components/ui";
import { getApiErrorMessage } from "@/lib/api";
import { fetchIssueBoard, fetchProject, fetchProjectSprints, reorderIssue } from "@/lib/projects-issues-api";
import type { BoardIssue, IssueStatusBE, Sprint } from "@/lib/types/issues";
import { isNestBackendConfigured } from "@/lib/aggregate-my-dashboard";
import { joinProject, leaveProject, subscribeKanban } from "@/lib/socket";
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";

const COLUMN_ORDER: { status: IssueStatusBE; label: string }[] = [
  { status: "BACKLOG", label: "Backlog" },
  { status: "TODO", label: "To do" },
  { status: "IN_PROGRESS", label: "In progress" },
  { status: "IN_REVIEW", label: "In review" },
  { status: "DONE", label: "Done" },
  { status: "CANCELLED", label: "Cancelled" },
];

export default function ProjectBoardPage() {
  const params = useParams();
  const projectId = String(params.projectId ?? "");

  const [projectName, setProjectName] = React.useState("");
  const [board, setBoard] = React.useState<Record<IssueStatusBE, BoardIssue[]> | null>(null);
  const [sprints, setSprints] = React.useState<Sprint[]>([]);
  const [selectedSprintId, setSelectedSprintId] = React.useState<string>("");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [activeIssue, setActiveIssue] = React.useState<BoardIssue | null>(null);

  const load = React.useCallback(async () => {
    if (!projectId || !isNestBackendConfigured()) return;
    setLoading(true);
    setError(null);
    try {
      const [proj, sp, b] = await Promise.all([
        fetchProject(projectId),
        fetchProjectSprints(projectId),
        fetchIssueBoard(projectId, selectedSprintId || undefined)
      ]);
      setProjectName(proj.name);
      setSprints(sp);
      setBoard(b);
    } catch (e) {
      setError(getApiErrorMessage(e, "Không tải được board."));
      setBoard(null);
    } finally {
      setLoading(false);
    }
  }, [projectId, selectedSprintId]);

  React.useEffect(() => {
    void load();
  }, [load]);

  React.useEffect(() => {
    if (!projectId || !isNestBackendConfigured()) return;
    joinProject(projectId);
    const off = subscribeKanban(() => {
      void load();
    });
    return () => {
      leaveProject(projectId);
      if (typeof off === "function") off();
    };
  }, [projectId, load]);

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    setActiveId(active.id as string);
    if (board) {
      for (const col of Object.values(board)) {
        const found = col.find((i) => i.issueKey === active.id);
        if (found) {
          setActiveIssue(found);
          break;
        }
      }
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    setActiveIssue(null);
    const { active, over } = event;
    if (!over || !board) return;

    const issueKey = active.id as string;
    const newStatus = over.id as IssueStatusBE;

    let oldStatus: IssueStatusBE | null = null;
    let issue: BoardIssue | null = null;
    for (const [status, issues] of Object.entries(board)) {
      const found = issues.find((i) => i.issueKey === issueKey);
      if (found) {
        oldStatus = status as IssueStatusBE;
        issue = found;
        break;
      }
    }

    if (!issue || !oldStatus) return;

    const newBoard = { ...board };
    newBoard[oldStatus] = newBoard[oldStatus].filter((i) => i.issueKey !== issueKey);
    const updatedIssue = { ...issue, status: newStatus };
    newBoard[newStatus] = [...newBoard[newStatus], updatedIssue];
    setBoard(newBoard);

    try {
      const position = newBoard[newStatus].findIndex((i) => i.issueKey === issueKey);
      if (position < 0) {
        await load();
        return;
      }
      await reorderIssue(projectId, issueKey, newStatus, position);
      await load();
    } catch (e) {
      setError(getApiErrorMessage(e, "Không cập nhật được vị trí / trạng thái trên board."));
      await load();
    }
  }

  if (!isNestBackendConfigured()) {
    return (
      <Card className="p-6">
        <p className="text-sm text-muted-foreground">
          Đặt NEXT_PUBLIC_API_URL trỏ Nest và đăng nhập để xem board.
        </p>
        <Link href="/dashboard/projects" className="text-primary text-sm mt-2 inline-block">
          ← Danh sách project
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/dashboard/projects" className="text-sm text-muted-foreground hover:text-foreground">
            ← Projects
          </Link>
          <h1 className="text-xl font-semibold text-foreground mt-1">
            Board{projectName ? `: ${projectName}` : ""}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={selectedSprintId}
            onChange={(e) => setSelectedSprintId(e.target.value)}
            className="h-9 rounded-md border border-border bg-background px-3 text-sm"
          >
            <option value="">Tất cả (Backlog + Sprints)</option>
            {sprints.map((s) => (
              <option key={s.id} value={s.id}>{s.name} ({s.status})</option>
            ))}
          </select>
          <div className="flex gap-2">
            <Link href={`/dashboard/projects/${projectId}/issues/new`}>
              <Button size="sm" variant="primary">
                Tạo issue
              </Button>
            </Link>
            <Link href={`/dashboard/projects/${projectId}/issues`}>
              <Button size="sm" variant="outline">
                Tìm issue
              </Button>
            </Link>
            <Link href={`/dashboard/projects/${projectId}/backlog`}>
              <Button size="sm" variant="outline">
                Backlog
              </Button>
            </Link>
            <Link href={`/dashboard/projects/${projectId}/settings`}>
              <Button size="sm" variant="outline">
                Cài đặt
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {loading && !board ? (
        <p className="text-sm text-muted-foreground">Đang tải board…</p>
      ) : board ? (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex gap-3 overflow-x-auto pb-2 min-h-[420px]">
            {COLUMN_ORDER.map((col, colIndex) => {
              const issues = board[col.status] ?? [];
              return (
                <motion.div
                  key={col.status}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: colIndex * 0.03, ease: "easeOut" }}
                  className="flex-1 min-w-[260px] max-w-[320px]"
                >
                  <DroppableColumn status={col.status} label={col.label} issues={issues} projectId={projectId} />
                </motion.div>
              );
            })}
          </div>
          <DragOverlay>
            {activeId && activeIssue ? (
              <IssueCard issue={activeIssue} projectId={projectId} isOverlay />
            ) : null}
          </DragOverlay>
        </DndContext>
      ) : null}
    </div>
  );
}

function DroppableColumn({ status, label, issues, projectId }: { status: IssueStatusBE; label: string; issues: BoardIssue[]; projectId: string }) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <Card variant="muted" className={`flex flex-col h-full overflow-hidden border transition-colors ${isOver ? "bg-muted border-primary/50" : "bg-muted/80"}`}>
      <div className="px-3 py-2 border-b border-border bg-muted/50">
        <h2 className="text-sm font-semibold text-foreground">
          {label} <span className="text-muted-foreground font-normal">({issues.length})</span>
        </h2>
      </div>
      <div ref={setNodeRef} className="flex-1 p-2 flex flex-col gap-2 overflow-y-auto max-h-[70vh] min-h-[150px]">
        {issues.map((issue) => (
          <DraggableIssue key={issue.issueKey} issue={issue} projectId={projectId} />
        ))}
      </div>
    </Card>
  );
}

function DraggableIssue({ issue, projectId }: { issue: BoardIssue; projectId: string }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: issue.issueKey,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.5 : 1,
  } : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing">
      <IssueCard issue={issue} projectId={projectId} />
    </div>
  );
}

function IssueCard({ issue, projectId, isOverlay }: { issue: BoardIssue; projectId: string; isOverlay?: boolean }) {
  return (
    <Card className={`p-3 shadow-sm ${isOverlay ? "shadow-lg rotate-2 scale-105" : ""}`}>
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/dashboard/projects/${projectId}/issues/${encodeURIComponent(issue.issueKey)}`}
          className="text-sm font-medium text-foreground hover:underline leading-snug min-w-0"
          onPointerDown={(e) => e.stopPropagation()} // Prevent drag when clicking link
        >
          {issue.issueKey}
        </Link>
        <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-background border border-border shrink-0">
          {issue.type}
        </span>
      </div>
      <p className="text-xs text-muted-foreground mt-1 line-clamp-3">{issue.title}</p>
      {issue.assignee && (
        <p className="text-[11px] text-muted-foreground mt-2 truncate">
          {issue.assignee.fullName}
        </p>
      )}
    </Card>
  );
}

"use client";

import * as React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button, Card, Input, Label } from "@/components/ui";
import { getApiErrorMessage } from "@/lib/api";
import { fetchAllProjectSummaries, createIssue } from "@/lib/projects-issues-api";
import { isNestBackendConfigured } from "@/lib/aggregate-my-dashboard";
import type { IssuePriorityBE, IssueTypeBE } from "@/lib/types/issues";
import type { ProjectSummary } from "@/lib/types/issues";

const TYPES: IssueTypeBE[] = ["TASK", "BUG", "STORY", "EPIC", "SUBTASK"];
const PRIORITIES: IssuePriorityBE[] = ["LOWEST", "LOW", "MEDIUM", "HIGH", "HIGHEST"];

function CreateIssueFromTasksInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialProjectId = searchParams.get("projectId") ?? "";

  const [projects, setProjects] = React.useState<ProjectSummary[]>([]);
  const [projectId, setProjectId] = React.useState(initialProjectId);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [type, setType] = React.useState<IssueTypeBE>("TASK");
  const [priority, setPriority] = React.useState<IssuePriorityBE>("MEDIUM");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loadErr, setLoadErr] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!isNestBackendConfigured()) {
      setLoadErr("Cần NEXT_PUBLIC_API_URL trỏ Nest.");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const list = await fetchAllProjectSummaries();
        if (cancelled) return;
        setProjects(list);
        setProjectId((prev) => {
          if (prev) return prev;
          if (initialProjectId && list.some((p) => p.id === initialProjectId)) return initialProjectId;
          return list[0]?.id ?? "";
        });
        setLoadErr(null);
      } catch (e) {
        if (!cancelled) setLoadErr(getApiErrorMessage(e, "Không tải được project."));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [initialProjectId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!projectId) {
      setError("Chọn project.");
      return;
    }
    setSubmitting(true);
    try {
      const created = await createIssue(projectId, {
        title: title.trim(),
        description: description.trim() || undefined,
        type,
        priority,
      });
      const key = String(created.issueKey ?? "");
      if (key) {
        router.push(`/dashboard/projects/${projectId}/issues/${encodeURIComponent(key)}`);
      } else {
        router.push(`/dashboard/projects/${projectId}/board`);
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "Không tạo được issue."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Card className="p-6 max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard/tasks">
            <Button type="button" variant="ghost" size="icon" aria-label="Quay lại">
              <ArrowLeftIcon className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold text-foreground">Tạo issue</h1>
        </div>

        {(loadErr || error) && (
          <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2 mb-4">
            {error ?? loadErr}
          </p>
        )}

        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="project">Project</Label>
            <select
              id="project"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="flex h-9 w-full rounded-md border border-border bg-background px-3 text-sm"
              required
            >
              {projects.length === 0 ? (
                <option value="">— Chưa có project —</option>
              ) : (
                projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.key})
                  </option>
                ))
              )}
            </select>
            <p className="text-xs text-muted-foreground">
              Cần project trước — tạo tại{" "}
              <Link href="/dashboard/projects/new" className="text-primary hover:underline">
                Tạo project
              </Link>
              .
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="issue-title">
              Tiêu đề <span className="text-destructive">*</span>
            </Label>
            <Input
              id="issue-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="issue-desc">Mô tả</Label>
            <textarea
              id="issue-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              maxLength={5000}
              className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issue-type">Loại</Label>
              <select
                id="issue-type"
                value={type}
                onChange={(e) => setType(e.target.value as IssueTypeBE)}
                className="flex h-9 w-full rounded-md border border-border bg-background px-3 text-sm"
              >
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="issue-priority">Độ ưu tiên</Label>
              <select
                id="issue-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as IssuePriorityBE)}
                className="flex h-9 w-full rounded-md border border-border bg-background px-3 text-sm"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={submitting || !projects.length}>
              {submitting ? "Đang tạo…" : "Tạo issue"}
            </Button>
            <Link href="/dashboard/tasks">
              <Button type="button" variant="outline">
                Hủy
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </motion.div>
  );
}

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  );
}

export default function CreateIssueFromTasksPage() {
  return (
    <Suspense
      fallback={
        <Card className="p-6 max-w-2xl">
          <p className="text-sm text-muted-foreground">Đang tải…</p>
        </Card>
      }
    >
      <CreateIssueFromTasksInner />
    </Suspense>
  );
}

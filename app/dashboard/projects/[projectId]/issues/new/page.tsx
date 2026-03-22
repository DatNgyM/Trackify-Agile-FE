"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button, Card, Input, Label } from "@/components/ui";
import { getApiErrorMessage } from "@/lib/api";
import {
  createIssue,
  fetchProject,
  fetchProjectMembersPage,
  fetchProjectLabels,
} from "@/lib/projects-issues-api";
import { isNestBackendConfigured } from "@/lib/aggregate-my-dashboard";
import type { IssuePriorityBE, IssueTypeBE, Label as ProjectLabel } from "@/lib/types/issues";

const TYPES: IssueTypeBE[] = ["TASK", "BUG", "STORY", "EPIC", "SUBTASK"];
const PRIORITIES: IssuePriorityBE[] = ["LOWEST", "LOW", "MEDIUM", "HIGH", "HIGHEST"];

export default function NewIssuePage() {
  const params = useParams();
  const router = useRouter();
  const projectId = String(params.projectId ?? "");

  const [projectName, setProjectName] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [type, setType] = React.useState<IssueTypeBE>("TASK");
  const [priority, setPriority] = React.useState<IssuePriorityBE>("MEDIUM");
  const [assigneeId, setAssigneeId] = React.useState("");
  const [members, setMembers] = React.useState<{ id: string; name: string }[]>([]);
  const [projectLabels, setProjectLabels] = React.useState<ProjectLabel[]>([]);
  const [selectedLabelIds, setSelectedLabelIds] = React.useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!projectId || !isNestBackendConfigured()) return;
    let cancelled = false;
    (async () => {
      try {
        const [p, memPage, labPage] = await Promise.all([
          fetchProject(projectId),
          fetchProjectMembersPage(projectId, 1, 100),
          fetchProjectLabels(projectId, 1, 100),
        ]);
        if (cancelled) return;
        setProjectName(p.name);
        setMembers(memPage.data.map((m) => ({ id: m.userId, name: m.user?.fullName ?? m.userId })));
        setProjectLabels(labPage.data);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  function toggleLabel(id: string) {
    setSelectedLabelIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!isNestBackendConfigured()) {
      setError("Cần NEXT_PUBLIC_API_URL trỏ Nest.");
      return;
    }
    setSubmitting(true);
    try {
      const labelIds = Array.from(selectedLabelIds);
      const created = await createIssue(projectId, {
        title: title.trim(),
        description: description.trim() || undefined,
        type,
        priority,
        ...(assigneeId ? { assigneeId } : {}),
        ...(labelIds.length > 0 ? { labelIds } : {}),
      });
      const issueKey = String(created.issueKey ?? "");
      if (issueKey) {
        router.push(`/dashboard/projects/${projectId}/issues/${encodeURIComponent(issueKey)}`);
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
          <Link href={`/dashboard/projects/${projectId}/board`}>
            <Button type="button" variant="ghost" size="icon" aria-label="Quay lại">
              <ArrowLeftIcon className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Tạo issue</h1>
            {projectName && <p className="text-sm text-muted-foreground">{projectName}</p>}
          </div>
        </div>

        {error && (
          <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="issue-title" required>
              Tiêu đề
            </Label>
            <Input
              id="issue-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={200}
              placeholder="Mô tả ngắn công việc"
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

          <div className="space-y-2">
            <Label htmlFor="issue-assignee">Người phụ trách (tuỳ chọn)</Label>
            <select
              id="issue-assignee"
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="flex h-9 w-full rounded-md border border-border bg-background px-3 text-sm"
            >
              <option value="">— Không gán —</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {projectLabels.length > 0 && (
            <div className="space-y-2">
              <Label>Nhãn (tuỳ chọn)</Label>
              <div className="flex flex-wrap gap-2 border border-border rounded-lg p-3 bg-muted/20">
                {projectLabels.map((l) => (
                  <label key={l.id} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedLabelIds.has(l.id)}
                      onChange={() => toggleLabel(l.id)}
                      className="rounded border-border text-primary"
                    />
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: l.color }} />
                    {l.name}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Đang tạo…" : "Tạo issue"}
            </Button>
            <Link href={`/dashboard/projects/${projectId}/board`}>
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

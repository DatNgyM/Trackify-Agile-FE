"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button, Input, Card } from "@/components/ui";
import { fetchMe, getApiErrorMessage } from "@/lib/api";
import { fetchMyAssignedIssues, type AssignedIssueRow } from "@/lib/my-assigned-issues";
import { isNestBackendConfigured } from "@/lib/aggregate-my-dashboard";

type Filter = "All" | "Open" | "Done";

function isDone(status: string) {
  return status === "DONE" || status === "CANCELLED";
}

export default function MyTasksListPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [rows, setRows] = useState<AssignedIssueRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isNestBackendConfigured()) {
      setLoading(false);
      setError("Đặt NEXT_PUBLIC_API_URL trỏ Nest để xem issue được gán cho bạn.");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const me = await fetchMe();
        const list = await fetchMyAssignedIssues(me.id);
        if (!cancelled) {
          setRows(list);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) setError(getApiErrorMessage(e, "Không tải được danh sách issue."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    let out = rows;
    if (filter === "Open") out = out.filter((r) => !isDone(r.status));
    if (filter === "Done") out = out.filter((r) => isDone(r.status));
    const q = search.trim().toLowerCase();
    if (q) {
      out = out.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.issueKey.toLowerCase().includes(q) ||
          r.projectName.toLowerCase().includes(q)
      );
    }
    return out;
  }, [rows, filter, search]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Card className="p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <span className="inline-block px-5 py-2 rounded-full bg-muted text-foreground font-medium text-sm">
            Issue được gán cho tôi
          </span>
          <Link href="/dashboard/tasks/new">
            <Button type="button" variant="primary" size="sm">
              Tạo issue
            </Button>
          </Link>
        </div>

        {error && (
          <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Tìm theo tiêu đề, key, project…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 pl-4 pr-12 rounded-xl"
            />
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full pointer-events-none"
              aria-hidden
            >
              <SearchIcon className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
            <span className="text-sm text-muted-foreground sm:mr-2">Lọc:</span>
            <div className="flex gap-2 flex-wrap">
              {(["All", "Open", "Done"] as const).map((f) => (
                <Button
                  key={f}
                  type="button"
                  variant={filter === f ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setFilter(f)}
                  className="rounded-full"
                >
                  {f === "All" ? "Tất cả" : f === "Open" ? "Đang mở" : "Hoàn thành / Hủy"}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground">Đang tải…</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="bg-muted text-left text-sm font-semibold text-foreground">
                  <th className="px-4 py-3 rounded-tl-xl">Key / Tiêu đề</th>
                  <th className="px-4 py-3">Project</th>
                  <th className="px-4 py-3">Loại</th>
                  <th className="px-4 py-3">Ưu tiên</th>
                  <th className="px-4 py-3 rounded-tr-xl">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((task, i) => (
                  <motion.tr
                    key={`${task.projectId}-${task.issueKey}`}
                    className="border-t border-border bg-muted/30 hover:bg-muted/50 transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(i * 0.02, 0.3) }}
                  >
                    <td className="px-4 py-4">
                      <Link
                        href={`/dashboard/projects/${task.projectId}/issues/${encodeURIComponent(task.issueKey)}`}
                        className="font-medium text-foreground hover:underline"
                      >
                        <span className="font-mono text-primary">{task.issueKey}</span>
                        <p className="text-sm font-normal mt-0.5 line-clamp-2">{task.title}</p>
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-foreground">{task.projectName}</td>
                    <td className="px-4 py-4 text-xs font-mono">{task.type}</td>
                    <td className="px-4 py-4 text-xs">{task.priority}</td>
                    <td className="px-4 py-4">
                      <span className="inline-block px-3 py-1 rounded-full bg-muted text-foreground text-xs">
                        {task.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <p className="text-sm text-muted-foreground p-6 text-center">Không có issue nào khớp.</p>
            )}
          </div>
        )}
      </Card>
    </motion.div>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button, Card } from "@/components/ui";
import { getApiErrorMessage } from "@/lib/api";
import { fetchProjectsPage } from "@/lib/projects-issues-api";
import type { ProjectSummary } from "@/lib/types/issues";
import { isNestBackendConfigured } from "@/lib/aggregate-my-dashboard";

export default function ProjectsPage() {
  const [projects, setProjects] = React.useState<ProjectSummary[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!isNestBackendConfigured()) {
      setLoading(false);
      setError("Đặt NEXT_PUBLIC_API_URL trỏ Nest (vd: http://localhost:4000/api) để tải danh sách project.");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const paginated = await fetchProjectsPage(1, 100);
        if (cancelled) return;
        setProjects(paginated.data);
        setError(null);
      } catch (e) {
        if (!cancelled) setError(getApiErrorMessage(e, "Không tải được danh sách project."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h1 className="text-xl font-semibold text-foreground">Danh sách project</h1>
          <div className="flex gap-2 flex-wrap">
            <Link href="/dashboard/projects/new">
              <Button variant="primary">+ Tạo project</Button>
            </Link>
          </div>
        </div>
        <p className="text-muted-foreground text-sm mb-4">
          Mỗi project có key (vd. TRK) để tạo issue key (TRK-1, TRK-2). Board Kanban theo từng project.
        </p>

        {error && (
          <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2 mb-4">
            {error}
          </p>
        )}

        {loading ? (
          <p className="text-sm text-muted-foreground">Đang tải…</p>
        ) : projects.length === 0 && !error ? (
          <p className="text-sm text-muted-foreground">Chưa có project. Tạo project mới để bắt đầu.</p>
        ) : (
          <ul className="space-y-2">
            {projects.map((project) => (
              <li
                key={project.id}
                className="flex flex-wrap items-center justify-between gap-3 border border-border rounded-lg px-4 py-3 bg-muted/20 hover:bg-muted/40 transition-colors"
              >
                <div className="min-w-0">
                  <p className="font-medium text-foreground truncate">{project.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Key: <span className="font-mono">{project.key}</span>
                    {project.description ? ` · ${project.description}` : ""}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Link href={`/dashboard/projects/${project.id}/board`}>
                    <Button type="button" variant="secondary" size="sm">
                      Board
                    </Button>
                  </Link>
                  <Link href={`/dashboard/projects/${project.id}/issues/new`}>
                    <Button type="button" variant="outline" size="sm">
                      Tạo issue
                    </Button>
                  </Link>
                  <Link href={`/dashboard/projects/${project.id}/issues`}>
                    <Button type="button" variant="outline" size="sm">
                      Tìm issue
                    </Button>
                  </Link>
                  <Link href={`/dashboard/projects/${project.id}/settings`}>
                    <Button type="button" variant="ghost" size="sm">
                      Cài đặt
                    </Button>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </motion.div>
  );
}

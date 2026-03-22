"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle>Danh sách project</CardTitle>
            <CardDescription>
              Mỗi project có key (vd. TRK) để tạo issue key (TRK-1, TRK-2). Board Kanban theo từng project.
            </CardDescription>
          </div>
          <Link href="/dashboard/projects/new">
            <Button>+ Tạo project</Button>
          </Link>
        </CardHeader>
        <CardContent>
          {error && (
            <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2 mb-4 mt-4">
              {error}
            </p>
          )}

          {loading ? (
            <div className="py-8 text-center text-sm text-muted-foreground">Đang tải…</div>
          ) : projects.length === 0 && !error ? (
            <div className="py-8 text-center text-sm text-muted-foreground">Chưa có project. Tạo project mới để bắt đầu.</div>
          ) : (
            <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Card key={project.id} className="flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg truncate">{project.name}</CardTitle>
                      <Badge variant="secondary" className="font-mono">{project.key}</Badge>
                    </div>
                    {project.description && (
                      <CardDescription className="line-clamp-2 mt-1">
                        {project.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="mt-auto pt-0 pb-4">
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/dashboard/projects/${project.id}/board`} className="flex-1">
                        <Button variant="default" size="sm" className="w-full">Board</Button>
                      </Link>
                      <Link href={`/dashboard/projects/${project.id}/issues`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">Issues</Button>
                      </Link>
                      <Link href={`/dashboard/projects/${project.id}/settings`}>
                        <Button variant="ghost" size="sm" className="px-2" title="Cài đặt">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

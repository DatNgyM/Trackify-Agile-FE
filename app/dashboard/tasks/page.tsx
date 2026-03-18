"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button, Input, Card } from "@/components/ui";

const mockTasks = [
  { id: "TSK-01", name: "Fix login bug", project: "E-commerce App", priority: "2m 15s", deadline: "Jan 25, 2026", status: "In Progress" },
  { id: "TSK-02", name: "Fix login bug", project: "E-commerce App", priority: "2m 15s", deadline: "Jan 25, 2026", status: "In Progress" },
  { id: "TSK-03", name: "Fix login bug", project: "E-commerce App", priority: "2m 15s", deadline: "Jan 25, 2026", status: "In Progress" },
];

type Filter = "All" | "To do" | "Done";

export default function MyTasksListPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("All");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Card className="p-6">
        <div className="mb-6">
          <span className="inline-block px-5 py-2 rounded-full bg-muted text-foreground font-medium text-sm">
            My task list
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Tìm kiếm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 pl-4 pr-12 rounded-xl"
            />
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full"
              aria-label="Tìm kiếm"
            >
              <SearchIcon className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
            <span className="text-sm text-muted-foreground sm:mr-2">Bộ lọc:</span>
            <div className="flex gap-2 flex-wrap">
              {(["All", "To do", "Done"] as const).map((f) => (
                <Button
                  key={f}
                  type="button"
                  variant={filter === f ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setFilter(f)}
                  className="rounded-full"
                >
                  {f}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Link href="/dashboard/tasks/new">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="w-10 h-10 rounded-lg border-2 border-dashed"
              aria-label="Thêm task"
            >
              <PlusIcon className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/dashboard/tasks/new" className="text-sm text-muted-foreground hover:text-foreground">
            Thêm task mới
          </Link>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-muted text-left text-sm font-semibold text-foreground">
                <th className="px-4 py-3 rounded-tl-xl">Task Name</th>
                <th className="px-4 py-3">Project</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Deadline</th>
                <th className="px-4 py-3 rounded-tr-xl">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockTasks.map((task, i) => (
                <motion.tr
                  key={task.id}
                  className="border-t border-border bg-muted/30 hover:bg-muted/50 transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium text-foreground">{task.name}</p>
                      <p className="text-xs text-muted-foreground">#{task.id}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-foreground">{task.project}</td>
                  <td className="px-4 py-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-muted text-foreground text-sm">
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-foreground">{task.deadline}</td>
                  <td className="px-4 py-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-muted text-foreground text-sm">
                      {task.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
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

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

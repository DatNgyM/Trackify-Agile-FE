"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button, Card, Input, Label } from "@/components/ui";

const mockProjects = [
  { id: "proj-1", name: "E-commerce App" },
  { id: "proj-2", name: "Backend API" },
  { id: "proj-3", name: "Frontend Web" },
  { id: "proj-4", name: "Trackify Agile" },
];

const statusOptions = [
  { value: "todo", label: "To do" },
  { value: "in_process", label: "In process" },
  { value: "done", label: "Done" },
];

export default function CreateNewTaskPage() {
  const router = useRouter();
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [projectId, setProjectId] = React.useState("");
  const [status, setStatus] = React.useState("todo");
  const [deadline, setDeadline] = React.useState("");
  const [priority, setPriority] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // BE sẽ nhận: title, description, projectId, status, deadline?, priority?
    console.log({ title, description, projectId, status, deadline, priority });
    router.push("/dashboard/tasks");
  };

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
          <h1 className="text-xl font-semibold text-foreground">Thêm task mới</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="task-title" required>Tiêu đề task</Label>
            <Input
              id="task-title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề task"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-description">Mô tả</Label>
            <textarea
              id="task-description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả chi tiết (tùy chọn)"
              rows={3}
              className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-project">Project</Label>
            <select
              id="task-project"
              name="projectId"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">-- Chọn project --</option>
              {mockProjects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="task-status">Trạng thái</Label>
              <select
                id="task-status"
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {statusOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-deadline">Deadline</Label>
              <Input
                id="task-deadline"
                name="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-priority">Độ ưu tiên (ghi chú)</Label>
            <Input
              id="task-priority"
              name="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              placeholder="Ví dụ: Cao, Trung bình"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit">Tạo task</Button>
            <Link href="/dashboard/tasks">
              <Button type="button" variant="outline">Hủy</Button>
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

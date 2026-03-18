"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button, Card, Input, Label } from "@/components/ui";

const mockParentProjects = [
  { id: "", name: "— Không (project gốc) —" },
  { id: "proj-1", name: "E-commerce App" },
  { id: "proj-4", name: "Trackify Agile" },
];

export default function CreateProjectPage() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [parentProjectId, setParentProjectId] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // BE sẽ nhận: name, description, parentProjectId (optional)
    console.log({ name, description, parentProjectId: parentProjectId || null });
    router.push("/dashboard/projects");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Card className="p-6 max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard/projects">
            <Button type="button" variant="ghost" size="icon" aria-label="Quay lại">
              <ArrowLeftIcon className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold text-foreground">Tạo project mới</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="project-name" required>Tên project</Label>
            <Input
              id="project-name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên project"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-description">Mô tả</Label>
            <textarea
              id="project-description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả ngắn (tùy chọn)"
              rows={3}
              className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-parent">Project cha (tùy chọn)</Label>
            <select
              id="project-parent"
              name="parentProjectId"
              value={parentProjectId}
              onChange={(e) => setParentProjectId(e.target.value)}
              className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {mockParentProjects.map((p) => (
                <option key={p.id || "root"} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit">Tạo project</Button>
            <Link href="/dashboard/projects">
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

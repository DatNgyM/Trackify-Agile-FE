"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button, Card, Input, Label } from "@/components/ui";
import { getApiErrorMessage } from "@/lib/api";
import { createProject } from "@/lib/projects-issues-api";
import { isNestBackendConfigured } from "@/lib/aggregate-my-dashboard";

export default function CreateProjectPage() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [key, setKey] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isNestBackendConfigured()) {
      setError("Cần NEXT_PUBLIC_API_URL trỏ Nest (vd: http://localhost:4000/api).");
      return;
    }
    const normalizedKey = key.trim().toUpperCase();
    if (normalizedKey.length < 2 || normalizedKey.length > 10) {
      setError("Key: 2–10 ký tự, bắt đầu bằng chữ cái, chỉ chữ in hoa và số.");
      return;
    }
    if (!/^[A-Z][A-Z0-9]*$/.test(normalizedKey)) {
      setError("Key phải bắt đầu bằng chữ cái và chỉ gồm chữ in hoa, số.");
      return;
    }
    setSubmitting(true);
    try {
      const project = await createProject({
        name: name.trim(),
        key: normalizedKey,
        description: description.trim() || undefined,
      });
      router.push(`/dashboard/projects/${project.id}/board`);
    } catch (err) {
      setError(getApiErrorMessage(err, "Không tạo được project."));
    } finally {
      setSubmitting(false);
    }
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

        {error && (
          <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="project-name">
              Tên project <span className="text-destructive">*</span>
            </Label>
            <Input
              id="project-name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Trackify Agile"
              required
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-key">
              Key (mã viết tắt) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="project-key"
              name="key"
              value={key}
              onChange={(e) => setKey(e.target.value.toUpperCase())}
              placeholder="VD: TRK"
              required
              maxLength={10}
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Dùng cho issue key (TRK-1, TRK-2). 2–10 ký tự, bắt đầu bằng chữ cái.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-description">Mô tả</Label>
            <textarea
              id="project-description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tùy chọn, tối đa 500 ký tự"
              rows={3}
              maxLength={500}
              className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Đang tạo…" : "Tạo project"}
            </Button>
            <Link href="/dashboard/projects">
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

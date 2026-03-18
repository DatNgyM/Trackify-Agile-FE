"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { Card, Button } from "@/components/ui";
import { CreateSubTaskModal, CreateSubTaskFormValues } from "@/components/forms/CreateSubTaskModal";
import { subscribeComments } from "@/lib/socket";

// Mock data for the main task
const mockTask = {
  id: "TSK-01",
  title: "Fix login bug",
  description: "Người dùng không thể đăng nhập bằng tài khoản Google. Cần kiểm tra lại cấu hình NextAuth và callback URL.",
  status: "In Progress",
  priority: "High",
  assignee: "Nguyễn Văn A",
  dueDate: "Jan 25, 2026",
  project: "E-commerce App"
};

// Mock data for subtasks
const initialSubtasks = [
  { id: "SUB-1", title: "Kiểm tra Google Cloud Console", status: "Done" },
  { id: "SUB-2", title: "Cập nhật callback URL trong .env", status: "In Progress" },
];

export default function TaskDetailPage() {
  const [subtasks, setSubtasks] = useState(initialSubtasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [comments, setComments] = useState<{ id: string; author: string; text: string }[]>([
    { id: "c1", author: "Nguyễn Văn A", text: "Đã kiểm tra Google Console, callback URL đúng." },
  ]);

  useEffect(() => {
    const unsub = subscribeComments(mockTask.id, (data: unknown) => {
      const payload = data as { id?: string; author?: string; text?: string };
      if (payload?.text) {
        setComments((prev) => [
          ...prev,
          {
            id: payload.id ?? `c-${Date.now()}`,
            author: payload.author ?? "User",
            text: payload.text,
          },
        ]);
      }
    });
    return () => {
      if (unsub) unsub();
    };
  }, []);

  const onDropFiles = useCallback((acceptedFiles: File[]) => {
    setAttachments((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: onDropFiles,
    multiple: true,
  });

  const handleUploadAttachments = () => {
    if (attachments.length === 0) return;
    const formData = new FormData();
    formData.append("taskId", mockTask.id);
    attachments.forEach((file) => formData.append("files", file));
    console.log("Upload attachments FormData:", formData.getAll("files"));
    setAttachments([]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateSubtask = (values: CreateSubTaskFormValues) => {
    const newSubtask = {
      id: `SUB-${Date.now()}`,
      title: values.title,
      status: "To do",
    };
    setSubtasks([...subtasks, newSubtask]);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* Task Info Card */}
      <Card className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-medium text-muted-foreground">{mockTask.id}</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {mockTask.status}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                {mockTask.priority}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">{mockTask.title}</h1>
          </div>
          <Button variant="outline">Chỉnh sửa</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Mô tả</h3>
              <p className="text-foreground">{mockTask.description}</p>
            </div>
          </div>
          
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Dự án</h3>
              <p className="text-sm font-medium">{mockTask.project}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Người thực hiện</h3>
              <p className="text-sm font-medium">{mockTask.assignee}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Hạn chót</h3>
              <p className="text-sm font-medium">{mockTask.dueDate}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Subtasks Card */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-foreground">Task con ({subtasks.length})</h2>
          <Button onClick={() => setIsModalOpen(true)} size="sm">
            + Thêm task con
          </Button>
        </div>

        {subtasks.length > 0 ? (
          <div className="space-y-3">
            {subtasks.map((subtask) => (
              <div 
                key={subtask.id} 
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={subtask.status === "Done"}
                    readOnly
                  />
                  <span className={`text-sm font-medium ${subtask.status === "Done" ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {subtask.title}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded-md">
                  {subtask.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground text-sm border-2 border-dashed rounded-lg">
            Chưa có task con nào.
          </div>
        )}
      </Card>

      {/* File đính kèm */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">File đính kèm</h2>
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
        >
          <input {...getInputProps()} />
          <p className="text-sm text-muted-foreground">
            Kéo thả file vào đây hoặc bấm để chọn (nhiều file)
          </p>
        </div>
        {attachments.length > 0 && (
          <div className="mt-4 space-y-2">
            {attachments.map((file, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-lg text-sm"
              >
                <span className="text-foreground truncate">{file.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAttachment(i)}
                >
                  Xóa
                </Button>
              </div>
            ))}
            <Button type="button" size="sm" onClick={handleUploadAttachments}>
              Tải lên ({attachments.length} file)
            </Button>
          </div>
        )}
      </Card>

      {/* Bình luận (real-time qua Socket) */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Bình luận</h2>
        <ul className="space-y-3">
          {comments.map((c) => (
            <li key={c.id} className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs font-medium text-muted-foreground">{c.author}</p>
              <p className="text-sm text-foreground mt-0.5">{c.text}</p>
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground mt-3">
          Bình luận mới từ BE sẽ tự động hiển thị (Socket).
        </p>
      </Card>

      <CreateSubTaskModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        parentTaskName={mockTask.title}
        onSubmit={handleCreateSubtask}
      />
    </motion.div>
  );
}

"use client";

import * as React from "react";
import { Modal, Button, Input, Label } from "@/components/ui";

export interface CreateSubTaskFormValues {
  title: string;
  description: string;
}

interface CreateSubTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentTaskName?: string;
  onSubmit?: (values: CreateSubTaskFormValues) => void;
}

export function CreateSubTaskModal({
  open,
  onOpenChange,
  parentTaskName,
  onSubmit,
}: CreateSubTaskModalProps) {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({
      title: title.trim(),
      description: description.trim(),
    });
    setTitle("");
    setDescription("");
    onOpenChange(false);
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    onOpenChange(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Thêm task con"
      footer={
        <>
          <Button type="button" variant="outline" onClick={handleClose}>
            Hủy
          </Button>
          <Button type="submit" form="create-subtask-form">
            Thêm task con
          </Button>
        </>
      }
    >
      <form id="create-subtask-form" onSubmit={handleSubmit} className="space-y-4">
        {parentTaskName && (
          <p className="text-sm text-muted-foreground">
            Task cha: <span className="font-medium text-foreground">{parentTaskName}</span>
          </p>
        )}
        <div className="space-y-2">
          <Label htmlFor="subtask-title" required>Tiêu đề task con</Label>
          <Input
            id="subtask-title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nhập tiêu đề"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subtask-description">Mô tả</Label>
          <Input
            id="subtask-description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mô tả (tùy chọn)"
          />
        </div>
      </form>
    </Modal>
  );
}

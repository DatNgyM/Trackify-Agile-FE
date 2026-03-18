"use client";

import * as React from "react";
import { Modal, Button, Input, Label } from "@/components/ui";

export interface CreateChildProjectFormValues {
  name: string;
  description: string;
  parentProjectId: string;
}

interface CreateChildProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentProject?: { id: string; name: string } | null;
  onSubmit?: (values: CreateChildProjectFormValues) => void;
}

export function CreateChildProjectModal({
  open,
  onOpenChange,
  parentProject = null,
  onSubmit,
}: CreateChildProjectModalProps) {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({
      name: name.trim(),
      description: description.trim(),
      parentProjectId: parentProject?.id ?? "",
    });
    setName("");
    setDescription("");
    onOpenChange(false);
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    onOpenChange(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={parentProject ? "Tạo project con" : "Tạo project (hoặc project con)"}
      footer={
        <>
          <Button type="button" variant="outline" onClick={handleClose}>
            Hủy
          </Button>
          <Button type="submit" form="create-child-project-form">
            Tạo
          </Button>
        </>
      }
    >
      <form id="create-child-project-form" onSubmit={handleSubmit} className="space-y-4">
        {parentProject && (
          <p className="text-sm text-muted-foreground">
            Project cha: <span className="font-medium text-foreground">{parentProject.name}</span>
          </p>
        )}
        <div className="space-y-2">
          <Label htmlFor="child-project-name" required>Tên project</Label>
          <Input
            id="child-project-name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập tên project"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="child-project-description">Mô tả</Label>
          <Input
            id="child-project-description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mô tả ngắn (tùy chọn)"
          />
        </div>
        {parentProject && (
          <input type="hidden" name="parentProjectId" value={parentProject.id} />
        )}
      </form>
    </Modal>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button, Card } from "@/components/ui";
import { CreateChildProjectModal } from "@/components/forms/CreateChildProjectModal";
import type { CreateChildProjectFormValues } from "@/components/forms/CreateChildProjectModal";

interface MockProject {
  id: string;
  name: string;
  description?: string;
  parentId: string | null;
}

const mockProjects: MockProject[] = [
  { id: "proj-1", name: "E-commerce App", description: "Ứng dụng bán hàng", parentId: null },
  { id: "proj-2", name: "Backend API", description: "API cho E-commerce", parentId: "proj-1" },
  { id: "proj-3", name: "Frontend Web", description: "Giao diện khách hàng", parentId: "proj-1" },
  { id: "proj-4", name: "Trackify Agile", description: "Quản lý dự án nội bộ", parentId: null },
];

export default function ProjectsPage() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [parentForModal, setParentForModal] = React.useState<{ id: string; name: string } | null>(null);
  const [projects, setProjects] = React.useState<MockProject[]>(mockProjects);

  const handleOpenCreateChild = (parent: { id: string; name: string } | null) => {
    setParentForModal(parent);
    setModalOpen(true);
  };

  const handleSubmitChildProject = (values: CreateChildProjectFormValues) => {
    const newProject: MockProject = {
      id: `proj-${Date.now()}`,
      name: values.name,
      description: values.description || undefined,
      parentId: values.parentProjectId || null,
    };
    setProjects((prev) => [...prev, newProject]);
  };

  const rootProjects = projects.filter((p) => !p.parentId);
  const getChildren = (parentId: string) => projects.filter((p) => p.parentId === parentId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h1 className="text-xl font-semibold text-foreground">Project list</h1>
          <div className="flex gap-2">
            <Link href="/dashboard/projects/new">
              <Button variant="primary">+ Tạo project</Button>
            </Link>
            <Button variant="secondary" onClick={() => handleOpenCreateChild(null)} aria-label="Tạo project nhanh (modal)">
              + Tạo project (modal)
            </Button>
            <Link href="/dashboard/projects/board">
              <Button variant="secondary">Mở Project Board</Button>
            </Link>
          </div>
        </div>
        <p className="text-muted-foreground text-sm mb-4">
          Danh sách dự án. Bấm &quot;Tạo project con&quot; để thêm project con bên dưới project cha.
        </p>

        <ul className="space-y-1">
          {rootProjects.map((project) => (
            <ProjectRow
              key={project.id}
              project={project}
              children={getChildren(project.id)}
              onAddChild={() => handleOpenCreateChild({ id: project.id, name: project.name })}
            />
          ))}
        </ul>
      </Card>

      <CreateChildProjectModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        parentProject={parentForModal}
        onSubmit={handleSubmitChildProject}
      />
    </motion.div>
  );
}

function ProjectRow({
  project,
  children,
  onAddChild,
}: {
  project: MockProject;
  children: MockProject[];
  onAddChild: () => void;
}) {
  return (
    <li className="border border-border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between gap-2 px-4 py-3 bg-muted/30 hover:bg-muted/50">
        <div className="min-w-0">
          <p className="font-medium text-foreground truncate">{project.name}</p>
          {project.description && (
            <p className="text-xs text-muted-foreground truncate">{project.description}</p>
          )}
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={onAddChild}>
          Tạo project con
        </Button>
      </div>
      {children.length > 0 && (
        <ul className="border-t border-border bg-background pl-6">
          {children.map((child) => (
            <li
              key={child.id}
              className="flex items-center justify-between gap-2 px-4 py-2 border-b border-border last:border-b-0 text-sm"
            >
              <span className="text-muted-foreground">↳</span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground truncate">{child.name}</p>
                {child.description && (
                  <p className="text-xs text-muted-foreground truncate">{child.description}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

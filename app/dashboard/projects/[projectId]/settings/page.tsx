"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button, Card, Input, Label } from "@/components/ui";
import { getApiErrorMessage } from "@/lib/api";
import {
  fetchProject,
  updateProject,
  deleteProject,
  fetchProjectMembersPage,
  addProjectMember,
  updateProjectMemberRole,
  removeProjectMember,
  leaveProject,
  fetchProjectLabels,
  createProjectLabel,
  updateProjectLabel,
  deleteProjectLabel,
  fetchProjectSprints,
  createSprint,
  updateSprint,
  deleteSprint,
  startSprint,
  completeSprint,
} from "@/lib/projects-issues-api";
import type { ProjectMemberRow } from "@/lib/projects-issues-api";
import type { Label as ProjectLabel, Sprint } from "@/lib/types/issues";
import { isNestBackendConfigured } from "@/lib/aggregate-my-dashboard";
import { fetchMe } from "@/lib/api";
import {
  canCreateOrEditLabel,
  canDeleteLabel,
  canManageMembers,
  canManageProjectDanger,
  canManageSprints,
} from "@/lib/project-role";

type Tab = "general" | "members" | "labels" | "sprints";

export default function ProjectSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = String(params.projectId ?? "");

  const [activeTab, setActiveTab] = React.useState<Tab>("general");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // General
  const [name, setName] = React.useState("");
  const [key, setKey] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [savingGeneral, setSavingGeneral] = React.useState(false);

  // Members
  const [members, setMembers] = React.useState<ProjectMemberRow[]>([]);
  const [myUserId, setMyUserId] = React.useState("");
  const [newMemberId, setNewMemberId] = React.useState("");
  const [newMemberRole, setNewMemberRole] = React.useState("MEMBER");

  // Labels
  const [labels, setLabels] = React.useState<ProjectLabel[]>([]);
  const [newLabelName, setNewLabelName] = React.useState("");
  const [newLabelColor, setNewLabelColor] = React.useState("#000000");
  const [editingLabelId, setEditingLabelId] = React.useState<string | null>(null);
  const [editLabelName, setEditLabelName] = React.useState("");
  const [editLabelColor, setEditLabelColor] = React.useState("#000000");

  // Sprints
  const [sprints, setSprints] = React.useState<Sprint[]>([]);
  const [newSprintName, setNewSprintName] = React.useState("");
  const [newSprintGoal, setNewSprintGoal] = React.useState("");
  const [newSprintStart, setNewSprintStart] = React.useState("");
  const [newSprintEnd, setNewSprintEnd] = React.useState("");
  const [editingSprintId, setEditingSprintId] = React.useState<string | null>(null);
  const [editSprintName, setEditSprintName] = React.useState("");
  const [editSprintGoal, setEditSprintGoal] = React.useState("");
  const [editSprintStart, setEditSprintStart] = React.useState("");
  const [editSprintEnd, setEditSprintEnd] = React.useState("");

  const loadAll = React.useCallback(async () => {
    if (!projectId || !isNestBackendConfigured()) {
      setLoading(false);
      if (!isNestBackendConfigured()) setError("Cần NEXT_PUBLIC_API_URL trỏ Nest.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [proj, memPage, labPage, sp, me] = await Promise.all([
        fetchProject(projectId),
        fetchProjectMembersPage(projectId, 1, 100),
        fetchProjectLabels(projectId, 1, 100),
        fetchProjectSprints(projectId),
        fetchMe(),
      ]);
      setName(proj.name);
      setKey(proj.key);
      setDescription(proj.description ?? "");
      setMembers(memPage.data);
      setLabels(labPage.data);
      setSprints(sp);
      setMyUserId(me.id);
    } catch (e) {
      setError(getApiErrorMessage(e, "Không tải được project."));
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  React.useEffect(() => {
    void loadAll();
  }, [loadAll]);

  const myRole = React.useMemo(
    () => members.find((m) => m.userId === myUserId)?.role ?? "",
    [members, myUserId]
  );

  // --- General Actions ---
  async function handleUpdateProject(e: React.FormEvent) {
    e.preventDefault();
    setSavingGeneral(true);
    try {
      await updateProject(projectId, { name, description });
      alert("Cập nhật thành công!");
    } catch (err) {
      alert(getApiErrorMessage(err, "Không cập nhật được."));
    } finally {
      setSavingGeneral(false);
    }
  }

  async function handleDeleteProject() {
    if (!confirm("Bạn có chắc chắn muốn xóa project này? Hành động này không thể hoàn tác.")) return;
    try {
      await deleteProject(projectId);
      router.push("/dashboard/projects");
    } catch (err) {
      alert(getApiErrorMessage(err, "Không xóa được project."));
    }
  }

  // --- Member Actions ---
  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault();
    if (!newMemberId.trim()) return;
    try {
      await addProjectMember(projectId, newMemberId.trim(), newMemberRole);
      setNewMemberId("");
      await loadAll();
    } catch (err) {
      alert(getApiErrorMessage(err, "Không thêm được thành viên."));
    }
  }

  async function handleUpdateRole(userId: string, role: string) {
    try {
      await updateProjectMemberRole(projectId, userId, role);
      await loadAll();
    } catch (err) {
      alert(getApiErrorMessage(err, "Không đổi được vai trò."));
    }
  }

  async function handleRemoveMember(userId: string) {
    if (!confirm("Xóa thành viên này?")) return;
    try {
      await removeProjectMember(projectId, userId);
      await loadAll();
    } catch (err) {
      alert(getApiErrorMessage(err, "Không xóa được."));
    }
  }

  async function handleLeaveProject() {
    if (!confirm("Rời khỏi project này?")) return;
    try {
      await leaveProject(projectId);
      router.push("/dashboard/projects");
    } catch (err) {
      alert(getApiErrorMessage(err, "Không rời được."));
    }
  }

  // --- Label Actions ---
  async function handleAddLabel(e: React.FormEvent) {
    e.preventDefault();
    if (!newLabelName.trim()) return;
    try {
      await createProjectLabel(projectId, { name: newLabelName.trim(), color: newLabelColor });
      setNewLabelName("");
      setNewLabelColor("#000000");
      await loadAll();
    } catch (err) {
      alert(getApiErrorMessage(err, "Không tạo được nhãn."));
    }
  }

  async function handleDeleteLabel(labelId: string) {
    if (!confirm("Xóa nhãn này?")) return;
    try {
      await deleteProjectLabel(projectId, labelId);
      if (editingLabelId === labelId) setEditingLabelId(null);
      await loadAll();
    } catch (err) {
      alert(getApiErrorMessage(err, "Không xóa được."));
    }
  }

  async function handleSaveLabelEdit(e: React.FormEvent, labelId: string) {
    e.preventDefault();
    if (!editLabelName.trim()) return;
    try {
      await updateProjectLabel(projectId, labelId, { name: editLabelName.trim(), color: editLabelColor });
      setEditingLabelId(null);
      await loadAll();
    } catch (err) {
      alert(getApiErrorMessage(err, "Không cập nhật được nhãn."));
    }
  }

  // --- Sprint Actions ---
  async function handleAddSprint(e: React.FormEvent) {
    e.preventDefault();
    if (!newSprintName.trim()) return;
    try {
      await createSprint(projectId, {
        name: newSprintName.trim(),
        goal: newSprintGoal.trim() || undefined,
        startDate: newSprintStart ? new Date(newSprintStart).toISOString() : undefined,
        endDate: newSprintEnd ? new Date(newSprintEnd).toISOString() : undefined,
      });
      setNewSprintName("");
      setNewSprintGoal("");
      setNewSprintStart("");
      setNewSprintEnd("");
      await loadAll();
    } catch (err) {
      alert(getApiErrorMessage(err, "Không tạo được sprint."));
    }
  }

  async function handleDeleteSprint(sprintId: string) {
    if (!confirm("Xóa sprint này?")) return;
    try {
      await deleteSprint(projectId, sprintId);
      await loadAll();
    } catch (err) {
      alert(getApiErrorMessage(err, "Không xóa được."));
    }
  }

  async function handleStartSprint(sprintId: string) {
    try {
      await startSprint(projectId, sprintId);
      await loadAll();
    } catch (err) {
      alert(getApiErrorMessage(err, "Không bắt đầu sprint được."));
    }
  }

  async function handleCompleteSprint(sprintId: string) {
    if (!confirm("Hoàn thành sprint này? Các issue chưa xong sẽ chuyển về backlog.")) return;
    try {
      await completeSprint(projectId, sprintId);
      await loadAll();
    } catch (err) {
      alert(getApiErrorMessage(err, "Không hoàn thành sprint được."));
    }
  }

  async function handleSaveSprintEdit(e: React.FormEvent, sprintId: string) {
    e.preventDefault();
    if (!editSprintName.trim()) return;
    try {
      await updateSprint(projectId, sprintId, {
        name: editSprintName.trim(),
        goal: editSprintGoal.trim() || undefined,
        startDate: editSprintStart ? new Date(editSprintStart).toISOString() : undefined,
        endDate: editSprintEnd ? new Date(editSprintEnd).toISOString() : undefined,
      });
      setEditingSprintId(null);
      await loadAll();
    } catch (err) {
      alert(getApiErrorMessage(err, "Không cập nhật được sprint."));
    }
  }

  if (loading) {
    return <div className="p-6 text-sm text-muted-foreground">Đang tải…</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="max-w-4xl"
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <Link href="/dashboard/projects" className="text-sm text-muted-foreground hover:text-foreground">
            ← Projects
          </Link>
          <Link href={`/dashboard/projects/${projectId}/board`} className="text-sm text-primary hover:underline ml-4">
            Board
          </Link>
          <Link href={`/dashboard/projects/${projectId}/backlog`} className="text-sm text-primary hover:underline ml-4">
            Backlog
          </Link>
        </div>
      </div>

      <h1 className="text-2xl font-semibold text-foreground mb-6">Cài đặt: {name}</h1>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2 mb-4">
          {error}
        </p>
      )}

      <div className="flex gap-4 border-b border-border mb-6">
        {(["general", "members", "labels", "sprints"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "general" ? "Chung" : t === "members" ? "Thành viên" : t === "labels" ? "Nhãn (Labels)" : "Sprints"}
          </button>
        ))}
      </div>

      {activeTab === "general" && (
        <Card className="p-6 space-y-6">
          {canManageProjectDanger(myRole) ? (
            <form onSubmit={(e) => void handleUpdateProject(e)} className="space-y-4">
              <div className="space-y-2">
                <Label>Key (Không thể đổi)</Label>
                <Input value={key} disabled className="bg-muted font-mono" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="proj-name">
                  Tên project <span className="text-destructive">*</span>
                </Label>
                <Input id="proj-name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="proj-desc">Mô tả</Label>
                <textarea
                  id="proj-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
              </div>
              <Button type="submit" disabled={savingGeneral}>
                {savingGeneral ? "Đang lưu…" : "Lưu thay đổi"}
              </Button>
            </form>
          ) : (
            <p className="text-sm text-muted-foreground">
              Chỉ <strong>OWNER</strong> mới chỉnh tên / mô tả project.
            </p>
          )}

          {canManageProjectDanger(myRole) && (
            <div className="pt-6 border-t border-border">
              <h3 className="text-lg font-medium text-destructive mb-2">Xóa Project</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Hành động này sẽ xóa toàn bộ issue, comment, và dữ liệu liên quan. Chỉ OWNER mới có quyền này.
              </p>
              <Button variant="destructive" onClick={() => void handleDeleteProject()}>
                Xóa Project
              </Button>
            </div>
          )}
        </Card>
      )}

      {activeTab === "members" && (
        <Card className="p-6 space-y-6">
          {canManageMembers(myRole) && (
            <div>
              <h3 className="text-lg font-medium mb-4">Thêm thành viên</h3>
              <form onSubmit={(e) => void handleAddMember(e)} className="flex gap-3 items-end flex-wrap">
                <div className="flex-1 min-w-[200px] space-y-2">
                  <Label htmlFor="new-member-id">User ID (UUID)</Label>
                  <Input
                    id="new-member-id"
                    value={newMemberId}
                    onChange={(e) => setNewMemberId(e.target.value)}
                    placeholder="Nhập ID người dùng..."
                    required
                  />
                </div>
                <div className="w-32 space-y-2">
                  <Label>Vai trò</Label>
                  <select
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-border bg-background px-3 text-sm"
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="MEMBER">MEMBER</option>
                    <option value="VIEWER">VIEWER</option>
                  </select>
                </div>
                <Button type="submit">Thêm</Button>
              </form>
            </div>
          )}

          <div>
            <h3 className="text-lg font-medium mb-4">Danh sách thành viên</h3>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 text-left">
                    <th className="px-3 py-2 font-medium">Người dùng</th>
                    <th className="px-3 py-2 font-medium">Vai trò</th>
                    <th className="px-3 py-2 font-medium text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((m) => {
                    const isMe = m.userId === myUserId;
                    return (
                      <tr key={m.userId} className="border-t border-border">
                        <td className="px-3 py-2">
                          <div className="font-medium">{m.user?.fullName ?? "—"} {isMe && "(Bạn)"}</div>
                          <div className="text-xs text-muted-foreground">{m.user?.email ?? "—"}</div>
                        </td>
                        <td className="px-3 py-2">
                          {canManageMembers(myRole) ? (
                            <select
                              value={m.role}
                              onChange={(e) => void handleUpdateRole(m.userId, e.target.value)}
                              disabled={m.role === "OWNER" && isMe}
                              className="h-8 rounded-md border border-border bg-background px-2 text-xs"
                            >
                              <option value="OWNER">OWNER</option>
                              <option value="ADMIN">ADMIN</option>
                              <option value="MEMBER">MEMBER</option>
                              <option value="VIEWER">VIEWER</option>
                            </select>
                          ) : (
                            <span className="text-xs font-medium">{m.role}</span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-right">
                          {isMe ? (
                            <Button variant="outline" size="sm" onClick={() => void handleLeaveProject()}>
                              Rời nhóm
                            </Button>
                          ) : canManageMembers(myRole) ? (
                            <Button variant="destructive" size="sm" onClick={() => void handleRemoveMember(m.userId)}>
                              Xóa
                            </Button>
                          ) : null}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}

      {activeTab === "labels" && (
        <Card className="p-6 space-y-6">
          {canCreateOrEditLabel(myRole) && (
            <div>
              <h3 className="text-lg font-medium mb-4">Tạo nhãn mới</h3>
              <form onSubmit={(e) => void handleAddLabel(e)} className="flex gap-3 items-end flex-wrap">
                <div className="flex-1 min-w-[200px] space-y-2">
                  <Label htmlFor="new-label-name">Tên nhãn</Label>
                  <Input
                    id="new-label-name"
                    value={newLabelName}
                    onChange={(e) => setNewLabelName(e.target.value)}
                    placeholder="VD: bug, feature..."
                    required
                  />
                </div>
                <div className="w-24 space-y-2">
                  <Label htmlFor="new-label-color">Màu sắc</Label>
                  <Input
                    id="new-label-color"
                    type="color"
                    value={newLabelColor}
                    onChange={(e) => setNewLabelColor(e.target.value)}
                    className="h-9 p-1"
                  />
                </div>
                <Button type="submit">Tạo</Button>
              </form>
            </div>
          )}
          {!canCreateOrEditLabel(myRole) && (
            <p className="text-sm text-muted-foreground">
              Vai trò <strong>VIEWER</strong> chỉ xem nhãn; tạo/sửa cần MEMBER trở lên; xóa nhãn cần ADMIN/OWNER.
            </p>
          )}

          <div>
            <h3 className="text-lg font-medium mb-4">Danh sách nhãn</h3>
            {labels.length === 0 ? (
              <p className="text-sm text-muted-foreground">Chưa có nhãn nào.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {labels.map((l) =>
                  editingLabelId === l.id ? (
                    <form
                      key={l.id}
                      onSubmit={(e) => void handleSaveLabelEdit(e, l.id)}
                      className="flex flex-wrap items-end gap-2 border border-border rounded-lg p-3 bg-muted/20"
                    >
                      <div className="flex-1 min-w-[140px] space-y-1">
                        <Label className="text-xs">Tên</Label>
                        <Input value={editLabelName} onChange={(e) => setEditLabelName(e.target.value)} required />
                      </div>
                      <div className="w-24 space-y-1">
                        <Label className="text-xs">Màu</Label>
                        <Input type="color" value={editLabelColor} onChange={(e) => setEditLabelColor(e.target.value)} className="h-9 p-1" />
                      </div>
                      <Button type="submit" size="sm">Lưu</Button>
                      <Button type="button" size="sm" variant="outline" onClick={() => setEditingLabelId(null)}>
                        Hủy
                      </Button>
                    </form>
                  ) : (
                    <div key={l.id} className="flex items-center gap-2 border border-border rounded-full pl-3 pr-1 py-1 bg-muted/30 w-fit max-w-full">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: l.color }} />
                      <span className="text-sm font-medium truncate">{l.name}</span>
                      {canCreateOrEditLabel(myRole) && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingLabelId(l.id);
                            setEditLabelName(l.name);
                            setEditLabelColor(l.color);
                          }}
                          className="text-xs px-2 py-0.5 rounded-full hover:bg-primary/10 text-primary"
                        >
                          Sửa
                        </button>
                      )}
                      {canDeleteLabel(myRole) && (
                        <button
                          type="button"
                          onClick={() => void handleDeleteLabel(l.id)}
                          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                          title="Xóa nhãn"
                        >
                          &times;
                        </button>
                      )}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </Card>
      )}
      {activeTab === "sprints" && (
        <Card className="p-6 space-y-6">
          {canManageSprints(myRole) && (
          <div>
            <h3 className="text-lg font-medium mb-4">Tạo Sprint mới</h3>
            <form onSubmit={(e) => void handleAddSprint(e)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-sprint-name">
                  Tên Sprint <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="new-sprint-name"
                  value={newSprintName}
                  onChange={(e) => setNewSprintName(e.target.value)}
                  placeholder="VD: Sprint 1"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-sprint-goal">Mục tiêu (Goal)</Label>
                <Input
                  id="new-sprint-goal"
                  value={newSprintGoal}
                  onChange={(e) => setNewSprintGoal(e.target.value)}
                  placeholder="Hoàn thành tính năng..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-sprint-start">Ngày bắt đầu</Label>
                <Input
                  id="new-sprint-start"
                  type="datetime-local"
                  value={newSprintStart}
                  onChange={(e) => setNewSprintStart(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-sprint-end">Ngày kết thúc</Label>
                <Input
                  id="new-sprint-end"
                  type="datetime-local"
                  value={newSprintEnd}
                  onChange={(e) => setNewSprintEnd(e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit">Tạo Sprint</Button>
              </div>
            </form>
          </div>
          )}
          {!canManageSprints(myRole) && (
            <p className="text-sm text-muted-foreground mb-4">
              Tạo / sửa / bắt đầu / hoàn thành sprint cần vai trò <strong>ADMIN</strong> hoặc <strong>OWNER</strong>.
            </p>
          )}

          <div>
            <h3 className="text-lg font-medium mb-4">Danh sách Sprint</h3>
            {sprints.length === 0 ? (
              <p className="text-sm text-muted-foreground">Chưa có sprint nào.</p>
            ) : (
              <div className="space-y-4">
                {sprints.map((s) => (
                  <div key={s.id} className="border border-border rounded-lg p-4 bg-muted/20">
                    {editingSprintId === s.id && s.status === "PLANNING" && canManageSprints(myRole) ? (
                      <form onSubmit={(e) => void handleSaveSprintEdit(e, s.id)} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Tên sprint</Label>
                            <Input value={editSprintName} onChange={(e) => setEditSprintName(e.target.value)} required />
                          </div>
                          <div className="space-y-2">
                            <Label>Mục tiêu</Label>
                            <Input value={editSprintGoal} onChange={(e) => setEditSprintGoal(e.target.value)} />
                          </div>
                          <div className="space-y-2">
                            <Label>Ngày bắt đầu</Label>
                            <Input type="datetime-local" value={editSprintStart} onChange={(e) => setEditSprintStart(e.target.value)} />
                          </div>
                          <div className="space-y-2">
                            <Label>Ngày kết thúc</Label>
                            <Input type="datetime-local" value={editSprintEnd} onChange={(e) => setEditSprintEnd(e.target.value)} />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button type="submit" size="sm">Lưu</Button>
                          <Button type="button" size="sm" variant="outline" onClick={() => setEditingSprintId(null)}>
                            Hủy
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold text-foreground">{s.name}</h4>
                            <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                              s.status === "ACTIVE" ? "bg-primary/15 text-primary" :
                              s.status === "COMPLETED" ? "bg-green-500/15 text-green-600" :
                              "bg-muted text-muted-foreground"
                            }`}>
                              {s.status}
                            </span>
                            <Link
                              href={`/dashboard/projects/${projectId}/sprints/${s.id}`}
                              className="text-xs text-primary hover:underline"
                            >
                              Chi tiết
                            </Link>
                          </div>
                          {s.goal && <p className="text-sm text-muted-foreground mt-1">{s.goal}</p>}
                          <p className="text-xs text-muted-foreground mt-2">
                            {s.startDate ? new Date(s.startDate).toLocaleDateString() : "Chưa có"} -{" "}
                            {s.endDate ? new Date(s.endDate).toLocaleDateString() : "Chưa có"}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {canManageSprints(myRole) && s.status === "PLANNING" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingSprintId(s.id);
                                  setEditSprintName(s.name);
                                  setEditSprintGoal(s.goal ?? "");
                                  setEditSprintStart(
                                    s.startDate ? new Date(s.startDate).toISOString().slice(0, 16) : ""
                                  );
                                  setEditSprintEnd(
                                    s.endDate ? new Date(s.endDate).toISOString().slice(0, 16) : ""
                                  );
                                }}
                              >
                                Sửa
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => void handleStartSprint(s.id)}>
                                Bắt đầu
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => void handleDeleteSprint(s.id)}>
                                Xóa
                              </Button>
                            </>
                          )}
                          {canManageSprints(myRole) && s.status === "ACTIVE" && (
                            <Button size="sm" variant="default" onClick={() => void handleCompleteSprint(s.id)}>
                              Hoàn thành
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}
    </motion.div>
  );
}

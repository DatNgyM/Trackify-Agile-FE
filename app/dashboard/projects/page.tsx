import Link from "next/link";

export default function ProjectsPage() {
  return (
    <div className="bg-background rounded-2xl p-6 shadow-md">
      <h1 className="text-xl font-semibold text-foreground mb-4">Project list</h1>
      <p className="text-muted-foreground text-sm mb-4">Danh sách dự án. Mở Kanban board để xem và kéo thả công việc.</p>
      <Link
        href="/dashboard/projects/board"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-muted text-foreground font-medium hover:bg-muted/80 transition-colors"
      >
        Mở Project Board
      </Link>
    </div>
  );
}

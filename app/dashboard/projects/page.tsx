import Link from "next/link";
import { Button, Card, CardHeader, CardTitle, CardContent } from "@/components/ui";

export default function ProjectsPage() {
  return (
    <Card className="p-6">
      <h1 className="text-xl font-semibold text-foreground mb-4">Project list</h1>
      <p className="text-muted-foreground text-sm mb-4">Danh sách dự án. Mở Kanban board để xem và kéo thả công việc.</p>
      <Link href="/dashboard/projects/board">
        <Button variant="secondary">Mở Project Board</Button>
      </Link>
    </Card>
  );
}

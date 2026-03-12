import { Card } from "@/components/ui";

export default function CreateNewTaskPage() {
  return (
    <Card className="p-6">
      <h1 className="text-xl font-semibold text-foreground mb-4">Create New Tasks</h1>
      <p className="text-muted-foreground text-sm">Form tạo task mới — nội dung sẽ bổ sung.</p>
    </Card>
  );
}

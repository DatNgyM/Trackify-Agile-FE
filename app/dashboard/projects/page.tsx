"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button, Card } from "@/components/ui";

export default function ProjectsPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6">
        <h1 className="text-xl font-semibold text-foreground mb-4">Project list</h1>
        <p className="text-muted-foreground text-sm mb-4">Danh sách dự án. Mở Kanban board để xem và kéo thả công việc.</p>
        <Link href="/dashboard/projects/board">
          <Button variant="secondary">Mở Project Board</Button>
        </Link>
      </Card>
    </motion.div>
  );
}

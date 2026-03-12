"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui";

export default function TaskDetailPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Card className="p-6">
        <h1 className="text-xl font-semibold text-foreground mb-4">Task Detail</h1>
        <p className="text-muted-foreground text-sm">Chi tiết task — nội dung sẽ bổ sung.</p>
      </Card>
    </motion.div>
  );
}

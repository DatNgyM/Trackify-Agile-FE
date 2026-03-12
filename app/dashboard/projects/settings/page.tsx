"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui";

export default function ProjectSettingsPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6">
        <h1 className="text-xl font-semibold text-foreground mb-4">Project Settings</h1>
        <p className="text-muted-foreground text-sm">Cấu hình dự án — nội dung sẽ bổ sung.</p>
      </Card>
    </motion.div>
  );
}

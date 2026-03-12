"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function ProjectsPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl p-6 shadow-sm"
    >
      <h1 className="text-xl font-semibold text-gray-900 mb-4">Project list</h1>
      <p className="text-gray-500 text-sm mb-4">Danh sách dự án. Mở Kanban board để xem và kéo thả công việc.</p>
      <Link
        href="/dashboard/projects/board"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition-colors"
      >
        Mở Project Board
      </Link>
    </motion.div>
  );
}

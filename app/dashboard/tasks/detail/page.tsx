"use client";

import { motion } from "framer-motion";

export default function TaskDetailPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl p-6 shadow-sm"
    >
      <h1 className="text-xl font-semibold text-gray-900 mb-4">Task Detail</h1>
      <p className="text-gray-500 text-sm">Chi tiết task — nội dung sẽ bổ sung.</p>
    </motion.div>
  );
}

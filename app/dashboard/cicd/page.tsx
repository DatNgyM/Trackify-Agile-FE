"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";

const metrics = [
  { label: "Total Builds", value: "156" },
  { label: "Success Rate", value: "92%" },
  { label: "Avg. Duration", value: "2m 15s" },
];

const recentBuilds = [
  {
    id: 205,
    title: "Update Landing Page",
    commit: "a1b2c",
    branch: "main",
    duration: "2m 15s",
    time: "Just now",
    status: "Success" as const,
  },
  {
    id: 204,
    title: "Fix API Login",
    commit: "d4e5f",
    branch: "feature/auth",
    duration: "45s",
    time: "1 hour ago",
    status: "Failed" as const,
  },
  {
    id: 206,
    title: "Add Payment Gateway",
    commit: null,
    branch: "dev",
    duration: "Running...",
    time: "...",
    status: "In Progress" as const,
  },
];

const statusStyles = {
  Success: "bg-primary/15 text-primary",
  Failed: "bg-destructive/15 text-destructive",
  "In Progress": "bg-amber-100 text-amber-800",
};

export default function CicdPage() {
  return (
    <div className="space-y-6">
      {/* Summary metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Card variant="muted" className="p-6">
              <p className="text-sm font-medium text-muted-foreground mb-1">{m.label}</p>
              <p className="text-3xl font-bold text-foreground">{m.value}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent build activities */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
      >
        <Card variant="muted" className="overflow-hidden">
          <CardHeader className="border-b border-border">
            <CardTitle>Recent Build Activities</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-muted text-left text-sm font-semibold text-foreground">
                <th className="px-6 py-3">Build / Commit</th>
                <th className="px-6 py-3">Branch</th>
                <th className="px-6 py-3">Duration</th>
                <th className="px-6 py-3">Time</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBuilds.map((build, i) => (
                <motion.tr
                  key={build.id}
                  className="border-t border-border bg-background/50 hover:bg-background transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-foreground">
                        Build #{build.id}: {build.title}
                      </p>
                      {build.commit && (
                        <p className="text-xs text-muted-foreground">#{build.commit}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-foreground">{build.branch}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-muted text-foreground text-sm">
                      {build.duration}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-foreground">{build.time}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusStyles[build.status]}`}
                    >
                      {build.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

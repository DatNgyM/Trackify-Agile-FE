"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent, Button } from "@/components/ui";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">Trang chủ</h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-xl">
          Ứng dụng gắn với API Nest: project, issue (Kanban), bình luận và thông báo. Chọn mục bên dưới để
          làm việc.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05, ease: "easeOut" }}
        >
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-base">Projects</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-3">
              <p className="text-sm text-muted-foreground">Tạo project (có key), mở board theo từng project.</p>
              <div className="flex flex-wrap gap-2 mt-auto">
                <Link href="/dashboard/projects">
                  <Button size="sm" variant="outline">
                    Danh sách
                  </Button>
                </Link>
                <Link href="/dashboard/projects/new">
                  <Button size="sm" variant="default">
                    Tạo project
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1, ease: "easeOut" }}
        >
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-base">Issues</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-3">
              <p className="text-sm text-muted-foreground">Issue được gán cho bạn trên mọi project.</p>
              <div className="flex flex-wrap gap-2 mt-auto">
                <Link href="/dashboard/tasks">
                  <Button size="sm" variant="outline">
                    Được gán cho tôi
                  </Button>
                </Link>
                <Link href="/dashboard/tasks/new">
                  <Button size="sm" variant="default">
                    Tạo issue
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.15, ease: "easeOut" }}
        >
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-base">Hồ sơ</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-3">
              <p className="text-sm text-muted-foreground">Cập nhật tên, email, avatar; xem thống kê từ API.</p>
              <Link href="/dashboard/profile" className="mt-auto">
                <Button size="sm" variant="default">
                  Mở profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

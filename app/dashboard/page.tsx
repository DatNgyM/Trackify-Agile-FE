"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Button,
  Modal,
  Input,
  Label,
} from "@/components/ui";

export default function DashboardPage() {
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [meetingNote, setMeetingNote] = useState("");
  const [savedNote, setSavedNote] = useState<string | null>(null);

  const handleSaveNote = () => {
    if (meetingNote.trim()) setSavedNote(meetingNote.trim());
    setMeetingNote("");
    setNoteModalOpen(false);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <Card className="min-h-[200px] p-5">
            <BarChartPlaceholder />
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05, ease: "easeOut" }}
        >
          <Card className="min-h-[200px] p-5">
            <AreaChartPlaceholder />
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1, ease: "easeOut" }}
        >
          <Card className="min-h-[200px] flex items-center justify-center p-5">
            <span className="text-5xl font-bold text-foreground">55%</span>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.15, ease: "easeOut" }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Follow meeting</CardTitle>
            </CardHeader>
            <CardContent>
              {savedNote ? (
                <p className="text-foreground">{savedNote}</p>
              ) : (
                <p>Nội dung meeting sẽ hiển thị tại đây.</p>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={() => setNoteModalOpen(true)}>
                Thêm ghi chú
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.2, ease: "easeOut" }}
        >
          <Card variant="muted">
            <CardHeader>
              <CardTitle>Ongoing project</CardTitle>
            </CardHeader>
            <CardContent>
              Các dự án đang thực hiện sẽ hiển thị tại đây.
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Modal
        open={noteModalOpen}
        onOpenChange={setNoteModalOpen}
        title="Thêm ghi chú meeting"
        footer={
          <>
            <Button variant="outline" onClick={() => setNoteModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveNote} disabled={!meetingNote.trim()}>
              Lưu
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="meeting-note">Ghi chú</Label>
            <Input
              id="meeting-note"
              placeholder="Nhập nội dung ghi chú..."
              value={meetingNote}
              onChange={(e) => setMeetingNote(e.target.value)}
              className="mt-2"
            />
          </div>
        </div>
      </Modal>
    </>
  );
}

function BarChartPlaceholder() {
  const values = [40, 65, 45, 80, 55, 70, 50];
  const max = Math.max(...values);
  return (
    <div className="h-[140px] flex items-end gap-1.5 px-1">
      {values.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center justify-end">
          <div
            className="w-full rounded-t bg-foreground/80 min-h-[6px]"
            style={{ height: `${(v / max) * 100}%`, maxHeight: 120 }}
          />
        </div>
      ))}
    </div>
  );
}

function AreaChartPlaceholder() {
  const points = [20, 35, 30, 50, 45, 65, 70];
  const w = 100;
  const h = 60;
  const pad = 5;
  const xs = points.map((_, i) => pad + (i / (points.length - 1)) * (w - 2 * pad));
  const maxP = Math.max(...points);
  const minP = Math.min(...points);
  const range = maxP - minP || 1;
  const ys = points.map((p) => h - pad - ((p - minP) / range) * (h - 2 * pad));
  const pathD = xs.map((x, i) => `${i === 0 ? "M" : "L"} ${x} ${ys[i]}`).join(" ");
  const areaD = `${pathD} L ${xs[xs.length - 1]} ${h - pad} L ${xs[0]} ${h - pad} Z`;
  return (
    <div className="h-[140px] flex items-center">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full text-muted-foreground" preserveAspectRatio="xMidYMid meet">
        <path d={areaD} fill="currentColor" opacity={0.3} />
        <path d={pathD} fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
        {points.map((_, i) => (
          <circle key={i} cx={xs[i]} cy={ys[i]} r={1.2} fill="currentColor" />
        ))}
      </svg>
    </div>
  );
}

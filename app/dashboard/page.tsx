"use client";

import { motion } from "framer-motion";

export default function DashboardPage() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <motion.div
          className="bg-white rounded-2xl p-4 shadow-sm min-h-[200px]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <BarChartPlaceholder />
        </motion.div>
        <motion.div
          className="bg-white rounded-2xl p-4 shadow-sm min-h-[200px]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <AreaChartPlaceholder />
        </motion.div>
        <motion.div
          className="bg-white rounded-2xl p-4 shadow-sm min-h-[200px] flex items-center justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <span className="text-5xl font-bold text-black">55%</span>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <motion.div
          className="bg-white rounded-2xl p-5 shadow-sm min-h-[220px]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Follow meeting
          </h2>
          <div className="text-gray-400 text-sm">
            Nội dung meeting sẽ hiển thị tại đây.
          </div>
        </motion.div>
        <motion.div
          className="bg-white rounded-2xl p-5 shadow-sm min-h-[220px]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Ongoing project
          </h2>
          <div className="text-gray-400 text-sm">
            Các dự án đang thực hiện sẽ hiển thị tại đây.
          </div>
        </motion.div>
      </div>
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
            className="w-full rounded-t bg-gray-600 min-h-[6px]"
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
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full text-gray-600" preserveAspectRatio="xMidYMid meet">
        <path d={areaD} fill="currentColor" opacity={0.3} />
        <path d={pathD} fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
        {points.map((_, i) => (
          <circle key={i} cx={xs[i]} cy={ys[i]} r={1.2} fill="currentColor" />
        ))}
      </svg>
    </div>
  );
}

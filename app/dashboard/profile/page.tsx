"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent, Button } from "@/components/ui";

export default function ProfilePage() {
  const [emailNotif, setEmailNotif] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const onDropAvatar = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps: getAvatarRootProps, getInputProps: getAvatarInputProps } = useDropzone({
    onDrop: onDropAvatar,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"] },
    maxFiles: 1,
    multiple: false,
  });

  const handleUploadAvatar = () => {
    if (!avatarFile) return;
    const formData = new FormData();
    formData.append("avatar", avatarFile);
    // Gửi lên BE: fetch("/api/profile/avatar", { method: "POST", body: formData })
    console.log("Upload avatar FormData:", formData.get("avatar"));
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  return (
    <div className="space-y-6">
      {/* Avatar + name + Upload Avatar */}
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-4">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Avatar preview"
              className="w-20 h-20 rounded-full object-cover border border-border shrink-0"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-2xl font-semibold text-muted-foreground shrink-0 border border-border">
              J
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-foreground">Jecica</h1>
            <div className="flex items-center gap-2 mt-2">
              <div
                {...getAvatarRootProps()}
                className="cursor-pointer text-sm text-primary hover:underline"
              >
                <input {...getAvatarInputProps()} />
                Chọn ảnh đại diện
              </div>
              {avatarFile && (
                <Button type="button" size="sm" onClick={handleUploadAvatar}>
                  Tải lên
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Row: Contact info + Overview Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <Card variant="muted" className="h-full">
            <CardHeader>
              <CardTitle>Contact information</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-foreground">
                  <EnvelopeIcon className="w-5 h-5 text-muted-foreground shrink-0" />
                  <a href="mailto:email@example.com" className="hover:underline">email@example.com</a>
                </li>
                <li className="flex items-center gap-3 text-foreground">
                  <PhoneIcon className="w-5 h-5 text-muted-foreground shrink-0" />
                  <span>0909 123 456</span>
                </li>
                <li className="flex items-center gap-3 text-foreground">
                  <GitHubIcon className="w-5 h-5 text-muted-foreground shrink-0" />
                  <a href="https://github.com/jecica878" target="_blank" rel="noopener noreferrer" className="hover:underline">
                    github.com/jecica878
                  </a>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        <div className="lg:col-span-2">
          <h2 className="text-base font-semibold text-foreground mb-3 px-1">Overview Stats</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: "Tasks Done", value: "45" },
              { label: "Bugs Fixed", value: "12" },
              { label: "Hours Logged", value: "120h" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.05 + i * 0.05, ease: "easeOut" }}
              >
                <Card className="p-4 flex flex-col justify-center h-full">
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{stat.label}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Row: Activity Chart + Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.15, ease: "easeOut" }}
        >
          <Card variant="muted" className="h-full">
            <CardHeader>
              <CardTitle>Activity Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityChart />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.2, ease: "easeOut" }}
        >
          <Card variant="muted" className="h-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <GearIcon className="w-5 h-5 text-muted-foreground" />
                <CardTitle>Settings</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ToggleRow
                  label="Email Notifications"
                  checked={emailNotif}
                  onChange={setEmailNotif}
                />
                <ToggleRow label="Dark Mode" checked={darkMode} onChange={setDarkMode} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-foreground">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
          checked ? "bg-primary" : "bg-muted-foreground/30"
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 rounded-full bg-background shadow transition-transform ${
            checked ? "left-[24px]" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

function ActivityChart() {
  const w = 100;
  const h = 50;
  const pad = 6;
  const pts1 = [15, 35, 25, 45, 40, 30, 55, 50];
  const pts2 = [25, 45, 35, 55, 50, 40, 65, 55];
  const toPath = (pts: number[]) => {
    const max = Math.max(...pts);
    const min = Math.min(...pts);
    const range = max - min || 1;
    const xs = pts.map((_, i) => pad + (i / (pts.length - 1)) * (w - 2 * pad));
    const ys = pts.map((p) => h - pad - ((p - min) / range) * (h - 2 * pad));
    const pathD = xs.map((x, i) => `${i === 0 ? "M" : "L"} ${x} ${ys[i]}`).join(" ");
    return `${pathD} L ${xs[xs.length - 1]} ${h - pad} L ${pad} ${h - pad} Z`;
  };
  return (
    <div className="h-[180px]">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full text-muted-foreground" preserveAspectRatio="xMidYMid meet">
        <path d={toPath(pts1)} fill="currentColor" opacity={0.4} />
        <path d={toPath(pts2)} fill="currentColor" opacity={0.25} />
      </svg>
    </div>
  );
}

function EnvelopeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function GearIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Đăng ký tài khoản",
  description: "Trang đăng ký tài khoản mới",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}

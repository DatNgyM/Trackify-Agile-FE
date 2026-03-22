import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeHydration } from "@/components/theme/ThemeHydration";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: { default: "Trackify Agile", template: "%s | Trackify Agile" },
  description: "Ứng dụng quản lý dự án Agile — đăng nhập, đăng ký và làm việc với project & issue.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={cn("font-sans", inter.variable)}>
      <body className="min-h-screen bg-background-subtle text-foreground font-sans antialiased">
        <ThemeHydration />
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}

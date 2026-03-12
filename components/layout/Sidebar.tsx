"use client";

import Link from "next/link";
import { Nav, NavItem } from "./Nav";

interface SidebarProps {
  items: NavItem[];
}

export function Sidebar({ items }: SidebarProps) {
  return (
    <aside className="w-64 shrink-0 bg-background flex flex-col py-6 border-r border-border h-full overflow-y-auto shadow-sm flex">
      <div className="px-6 mb-8">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg leading-none">T</span>
          </div>
          <span className="text-xl font-bold text-foreground tracking-tight">Trackify</span>
        </Link>
      </div>
      
      <Nav items={items} />

      <div className="px-4 pt-4 mt-auto border-t border-border mx-2">
        <Link
          href="/login"
          className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <LogoutIcon className="w-5 h-5 shrink-0" />
          <span className="font-medium">Logout</span>
        </Link>
      </div>
    </aside>
  );
}

function LogoutIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v3.75M15.75 9L12 12.75m0 0L8.25 9m3.75 3.75V21" />
    </svg>
  );
}

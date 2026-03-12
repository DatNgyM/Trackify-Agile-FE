"use client";

import Link from "next/link";
import { Button, Dropdown, DropdownItem } from "@/components/ui";

export function Header({ title }: { title?: string }) {
  return (
    <header className="h-16 bg-background border-b border-border flex items-center justify-between px-6 shrink-0 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Mobile menu button could go here */}
        <h2 className="text-lg font-semibold text-foreground hidden sm:block capitalize">
          {title || "Dashboard"}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <BellIcon className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-background" />
        </Button>

        <Dropdown
          trigger={
            <button className="flex items-center gap-2 hover:bg-muted p-1 pr-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring" aria-haspopup="menu">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium text-sm border border-primary/20">
                J
              </div>
              <span className="text-sm font-medium text-foreground hidden sm:block">Jecica</span>
              <ChevronDownIcon className="w-4 h-4 text-muted-foreground hidden sm:block" />
            </button>
          }
          align="right"
          contentClassName="min-w-[220px]"
        >
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-medium text-foreground">Jecica</p>
            <p className="text-xs text-muted-foreground mt-0.5">email@example.com</p>
          </div>
          <div className="py-1 flex flex-col">
            <DropdownItem>
              <Link href="/dashboard/profile" className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors">
                <UserIcon className="w-4 h-4 shrink-0 text-muted-foreground" />
                <span>Profile</span>
              </Link>
            </DropdownItem>
            <DropdownItem>
              <Link href="/dashboard/profile" className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors">
                <GearIcon className="w-4 h-4 shrink-0 text-muted-foreground" />
                <span>Settings</span>
              </Link>
            </DropdownItem>
            <div className="h-px bg-border my-1" />
            <DropdownItem>
              <Link href="/login" className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors">
                <LogoutIcon className="w-4 h-4 shrink-0" />
                <span>Logout</span>
              </Link>
            </DropdownItem>
          </div>
        </Dropdown>
      </div>
    </header>
  );
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
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

function LogoutIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v3.75M15.75 9L12 12.75m0 0L8.25 9m3.75 3.75V21" />
    </svg>
  );
}

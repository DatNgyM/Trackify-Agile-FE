"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const activeLink = "bg-white text-black font-medium rounded-xl";
const inactiveLink = "text-white/70 hover:bg-white/10 hover:text-white rounded-xl";

export interface NavItem {
  href: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: { href: string; label: string }[];
}

interface NavProps {
  items: NavItem[];
}

export function Nav({ items }: NavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 px-3 flex-1">
      {items.map((item) => (
        <NavItemComponent key={item.href} item={item} pathname={pathname} />
      ))}
    </nav>
  );
}

function NavItemComponent({ item, pathname }: { item: NavItem; pathname: string }) {
  const basePath = item.href.split('/').slice(0, 3).join('/');
  const isParentActive = pathname === item.href || (item.children && pathname.startsWith(basePath));
  const [isOpen, setIsOpen] = useState(isParentActive);

  // Mở dropdown khi đang ở trang con (vd: đang ở Project Board thì Project dropdown mở)
  useEffect(() => {
    if (isParentActive) setIsOpen(true);
  }, [isParentActive]);

  if (item.children) {
    return (
      <div className="flex flex-col">
        <Link
          href={item.href}
          onClick={() => setIsOpen(true)}
          className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors w-full text-left ${
            isParentActive ? activeLink : inactiveLink
          }`}
        >
          <div className="flex items-center gap-3">
            {item.icon && <item.icon className="w-5 h-5 shrink-0" />}
            <span>{item.label}</span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            className="p-1 -mr-1 rounded-md hover:bg-muted/50 transition-colors"
          >
            <ChevronIcon className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
          </button>
        </Link>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="ml-6 mt-1 flex flex-col gap-1 pl-2">
                {item.children.map((sub) => {
                  const isSubActive = pathname === sub.href;
                  return (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      className={`block px-3 py-2.5 rounded-lg text-sm transition-colors relative cursor-pointer ${
                        isSubActive ? activeLink : inactiveLink
                      }`}
                    >
                      {isSubActive && (
                        <motion.div
                          layoutId="activeSubNav"
                          className="absolute left-[-9px] top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-white"
                        />
                      )}
                      {sub.label}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  const isActive = pathname === item.href;
  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors relative ${
        isActive ? activeLink : inactiveLink
      }`}
    >
      {item.icon && <item.icon className="w-5 h-5 shrink-0" />}
      <span>{item.label}</span>
    </Link>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

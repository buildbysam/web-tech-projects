"use client";

import { cx } from "@/lib/utils";
import { CodeXml, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Button from "./button";
import ThemeToggleBtn from "./theme-toggle-btn";

const nav_links = [
  { title: "Home", href: "/" },
  { title: "Projects", href: "/projects" },
  { title: "About", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [showMobileNavbar, setShowMobileNavbar] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm">
      <div className="border-b border-border">
        <div className="flex-between w-full max-w-7xl mx-auto pr-2 pl-4 md:px-4 py-2 lg:py-3">
          <Link href={"/"} className="flex-center gap-1.5 lg:gap-2.5">
            <CodeXml className="text-primary size-6" />
            <p className="text-foreground font-medium text-base lg:text-xl">Web Tech Projects</p>
          </Link>
          <div className="flex-between md:gap-4 lg:gap-6">
            <ul className="hidden md:flex justify-between items-center gap-3.5 lg:gap-5">
              {nav_links.map((link, idx) => {
                const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/");
                return (
                  <li
                    key={idx}
                    className={cx(
                      "hover:text-foreground text-sm lg:text-[15px] hover:font-medium",
                      isActive ? "text-foreground font-medium" : "text-muted-foreground font-normal"
                    )}
                  >
                    <Link href={link.href}>{link.title}</Link>
                  </li>
                );
              })}
            </ul>
            <ThemeToggleBtn />
            <Button variant="icon" className="block md:hidden" onClick={() => setShowMobileNavbar((prev) => !prev)}>
              {showMobileNavbar ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>
      {showMobileNavbar ? (
        <div className="border-b border-border block md:hidden">
          <ul className="space-y-1 p-3 pt-3.5">
            {nav_links.map((link, idx) => {
              const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/");
              return (
                <li
                  key={idx}
                  className={cx(
                    "hover:text-foreground text-sm rounded-sm",
                    isActive ? "text-foreground bg-primary/25 font-medium" : "text-muted-foreground font-normal"
                  )}
                >
                  <Link href={link.href} className="block py-2.5 px-3.5">
                    {link.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </header>
  );
}

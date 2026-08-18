"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { NAV_ITEMS } from "@/lib/constants";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NavLinks } from "./nav-links";
import { UserMenu } from "./user-menu";
import { ModeToggle } from "./mode-toggle";

function useCurrentTitle() {
  const pathname = usePathname();
  const match = NAV_ITEMS.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
  return match?.title ?? "Dashboard";
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const title = useCurrentTitle();

  return (
    <header className="bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 flex h-16 items-center gap-3 border-b px-4 backdrop-blur sm:px-6">
      {/* Mobile navigation trigger */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
            aria-label="Open navigation"
          >
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="border-b">
            <SheetTitle asChild>
              <span>
                <Logo />
              </span>
            </SheetTitle>
            <SheetDescription className="sr-only">
              Main navigation
            </SheetDescription>
          </SheetHeader>
          <div className="p-4">
            <NavLinks onNavigate={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      <Link href="/dashboard" className="lg:hidden">
        <Logo showText={false} />
      </Link>

      <h1 className="hidden text-lg font-semibold tracking-tight lg:block">
        {title}
      </h1>

      <div className="ml-auto flex items-center gap-1">
        <ModeToggle />
        <UserMenu />
      </div>
    </header>
  );
}

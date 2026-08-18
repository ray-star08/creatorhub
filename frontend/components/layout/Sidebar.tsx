import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { NavLinks } from "./nav-links";
import { SidebarUser } from "./sidebar-user";

export function AppSidebar() {
  return (
    <aside className="bg-sidebar text-sidebar-foreground border-sidebar-border sticky top-0 hidden h-svh w-64 shrink-0 flex-col border-r lg:flex">
      <div className="border-sidebar-border flex h-16 items-center border-b px-6">
        <Link href="/dashboard">
          <Logo />
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <NavLinks />
      </div>
      <div className="border-sidebar-border border-t p-3">
        <SidebarUser />
      </div>
    </aside>
  );
}

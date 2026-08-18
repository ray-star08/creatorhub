"use client";

import { useAuthStore } from "@/stores/useAuthStore";
import { getInitials } from "@/lib/format";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function SidebarUser() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex items-center gap-3 rounded-lg px-2 py-1.5">
      <Avatar className="size-9">
        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
          {getInitials(user?.name)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{user?.name ?? "Creator"}</p>
        <p className="text-muted-foreground truncate text-xs">
          {user?.email ?? "Welcome"}
        </p>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export const metadata: Metadata = {
  title: "Set up your profile",
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="from-background to-muted/40 flex min-h-svh flex-1 flex-col bg-gradient-to-b">
      <header className="flex items-center justify-center p-6">
        <Link href="/">
          <Logo />
        </Link>
      </header>
      <main className="flex flex-1 items-start justify-center px-4 pb-16 sm:items-center">
        <div className="w-full max-w-xl">{children}</div>
      </main>
    </div>
  );
}

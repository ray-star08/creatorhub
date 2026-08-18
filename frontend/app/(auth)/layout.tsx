import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/brand/logo";

const HIGHLIGHTS = [
  "AI idea generator tuned to your niche",
  "One-click scripts with hooks & CTAs",
  "Kanban + calendar to ship on schedule",
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-svh flex-1 lg:grid-cols-2">
      {/* Marketing / brand panel */}
      <div className="bg-primary text-primary-foreground relative hidden flex-col justify-between overflow-hidden p-10 lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30 [background:radial-gradient(60%_60%_at_20%_10%,white,transparent),radial-gradient(50%_50%_at_90%_90%,white,transparent)]"
        />
        <Link href="/" className="relative">
          <Logo className="text-primary-foreground" markClassName="bg-white/15" />
        </Link>

        <div className="relative space-y-6">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight">
            The operating system for modern creators.
          </h1>
          <p className="text-primary-foreground/80 max-w-md text-sm leading-relaxed">
            &ldquo;Masuk, Buat, Beres.&rdquo; Turn a raw topic into a
            ready-to-record script, then plan and publish — all in one place.
          </p>
          <ul className="space-y-3">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="size-5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-primary-foreground/60 relative text-xs">
          © {new Date().getFullYear()} CreatorHub. All rights reserved.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="mb-6 flex justify-center lg:hidden">
            <Link href="/">
              <Logo />
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

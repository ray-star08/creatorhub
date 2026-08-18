import Link from "next/link";
import { BriefcaseBusiness, Camera, Video } from "lucide-react";

import { Logo } from "@/components/brand/logo";

const FOOTER_LINKS = [
  {
    title: "Product",
    links: [
      ["Features", "#features"],
      ["Pricing", "#pricing"],
      ["Dashboard", "/dashboard"],
      ["AI Script Writer", "/scripts/generate"],
    ],
  },
  {
    title: "Company",
    links: [
      ["Community", "#community"],
      ["About", "#showcase"],
      ["Contact", "mailto:hello@creatorhub.com"],
      ["Privacy", "#"],
    ],
  },
] as const;

export function LandingFooter() {
  return (
    <footer className="border-t border-slate-200/70 bg-[#F8FAFC] dark:border-white/10 dark:bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 sm:px-8 md:grid-cols-[1.2fr_1fr] lg:grid-cols-[1.5fr_1fr_1fr]">
        <div className="max-w-sm">
          <Link href="/" aria-label="CreatorHub home">
            <Logo markClassName="bg-gradient-to-br from-[#635BFF] to-[#C084FC] text-white" className="text-slate-950 dark:text-white" />
          </Link>
          <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
            The AI-powered operating system that helps modern creators plan, create, and publish without the chaos.
          </p>
          <div className="mt-5 flex gap-2">
            {[
              [Camera, "Instagram", "https://instagram.com"],
              [Video, "YouTube", "https://youtube.com"],
              [BriefcaseBusiness, "LinkedIn", "https://linkedin.com"],
            ].map(([Icon, label, href]) => {
              const SocialIcon = Icon as typeof Camera;
              return (
                <a
                  key={label as string}
                  href={href as string}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label as string}
                  className="flex size-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#635BFF]/30 hover:text-[#635BFF] dark:border-white/10 dark:bg-white/5 dark:text-slate-400"
                >
                  <SocialIcon className="size-4" />
                </a>
              );
            })}
          </div>
        </div>

        {FOOTER_LINKS.map((group) => (
          <div key={group.title}>
            <h3 className="text-sm font-semibold text-slate-950 dark:text-white">{group.title}</h3>
            <ul className="mt-4 space-y-3">
              {group.links.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-slate-500 transition-colors hover:text-[#635BFF] dark:text-slate-400 dark:hover:text-violet-300">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-3 border-t border-slate-200/70 px-5 py-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-8 dark:border-white/10">
        <p>© {new Date().getFullYear()} CreatorHub. All rights reserved.</p>
        <p>Made for creators who choose momentum over burnout.</p>
      </div>
    </footer>
  );
}

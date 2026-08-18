import type { Metadata } from "next";

import { LandingCta } from "@/components/landing/cta";
import { Features } from "@/components/landing/features";
import { LandingFooter } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { LandingNavbar } from "@/components/landing/navbar";
import { Pricing } from "@/components/landing/pricing";
import { Showcase } from "@/components/landing/showcase";

export const metadata: Metadata = {
  title: "CreatorHub — Build Content, Not Burnout",
  description:
    "The AI-powered operating system for modern creators. Plan, script, and manage your content empire from one dashboard.",
};

export default function Home() {
  return (
    <div className="min-h-svh overflow-x-clip bg-[#F8FAFC] text-[#0F172A] selection:bg-[#635BFF]/20 selection:text-[#4F46E5] dark:bg-slate-950 dark:text-slate-50">
      <LandingNavbar />
      <main>
        <Hero />
        <Features />
        <Showcase />
        <Pricing />
        <LandingCta />
      </main>
      <LandingFooter />
    </div>
  );
}

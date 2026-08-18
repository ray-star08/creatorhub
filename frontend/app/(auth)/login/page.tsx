import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const redirect = params.redirect;
  // Only allow internal redirects to avoid open-redirect abuse.
  const redirectTo =
    typeof redirect === "string" && redirect.startsWith("/")
      ? redirect
      : "/dashboard";

  return <LoginForm redirectTo={redirectTo} />;
}

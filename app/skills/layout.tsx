import { AppShell } from "@/components/layouts/AppShell";

export default function SkillsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}

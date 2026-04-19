import { AppShell } from "@/components/layouts/AppShell";

export default function MentorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}

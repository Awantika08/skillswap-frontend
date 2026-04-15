export const runtime = 'edge';

import ResetPasswordFormClient from "./ResetPasswordFormClient";

export const metadata = {
  title: "Reset Password - SkillSwap",
  description: "Set a new password for your SkillSwap account",
};

interface ResetPasswordPageProps {
  params: Promise<{ token: string }>;
}

export default async function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const { token } = await params;

  return <ResetPasswordFormClient token={token} />;
}

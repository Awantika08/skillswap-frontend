interface MentorAvatarProps {
  initials: string;
  color: string;
  size?: "sm" | "md" | "lg";
}

export default function MentorAvatar({
  initials,
  color,
  size = "md",
}: MentorAvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };

  const colorClasses: { [key: string]: string } = {
    blue: "bg-blue-200 text-blue-800",
    green: "bg-green-200 text-green-800",
    purple: "bg-purple-200 text-purple-800",
    pink: "bg-pink-200 text-pink-800",
    amber: "bg-amber-200 text-amber-800",
    teal: "bg-teal-200 text-teal-800",
    indigo: "bg-indigo-200 text-indigo-800",
    rose: "bg-rose-200 text-rose-800",
  };

  return (
    <div
      className={`${sizeClasses[size]} ${colorClasses[color] || colorClasses["blue"]} rounded-full flex items-center justify-center font-semibold flex-shrink-0`}
    >
      {initials.toUpperCase()}
    </div>
  );
}

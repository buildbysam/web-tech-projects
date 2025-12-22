import { cx } from "@/lib/utils";

const techColors: Record<string, { bg: string; text: string }> = {
  html: { bg: "bg-orange-100 dark:bg-orange-950", text: "text-orange-700 dark:text-orange-300" },
  css: { bg: "bg-blue-100 dark:bg-blue-950", text: "text-blue-700 dark:text-blue-300" },
  javascript: { bg: "bg-yellow-100 dark:bg-yellow-950", text: "text-yellow-700 dark:text-yellow-300" },
  typescript: { bg: "bg-blue-100 dark:bg-blue-950", text: "text-blue-700 dark:text-blue-300" },
  php: { bg: "bg-indigo-100 dark:bg-indigo-950", text: "text-indigo-700 dark:text-indigo-300" },
  python: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-600 dark:text-blue-400" },
  react: { bg: "bg-cyan-100 dark:bg-cyan-950", text: "text-cyan-700 dark:text-cyan-300" },
  nextjs: { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-800 dark:text-gray-200" },
  tailwind: { bg: "bg-teal-100 dark:bg-teal-950", text: "text-teal-700 dark:text-teal-300" },
  sass: { bg: "bg-pink-100 dark:bg-pink-950", text: "text-pink-700 dark:text-pink-300" },
  nodejs: { bg: "bg-green-100 dark:bg-green-950", text: "text-green-700 dark:text-green-300" },
  mysql: { bg: "bg-sky-100 dark:bg-sky-950", text: "text-sky-700 dark:text-sky-300" },
  postgresql: { bg: "bg-indigo-100 dark:bg-indigo-950", text: "text-indigo-700 dark:text-indigo-300" },
  mongodb: { bg: "bg-emerald-100 dark:bg-emerald-950", text: "text-emerald-700 dark:text-emerald-300" },
  firebase: { bg: "bg-amber-100 dark:bg-amber-950", text: "text-amber-700 dark:text-amber-300" },
  api: { bg: "bg-purple-100 dark:bg-purple-950", text: "text-purple-700 dark:text-purple-300" },
  git: { bg: "bg-red-100 dark:bg-red-950", text: "text-red-700 dark:text-red-300" },
};

interface Props {
  tech: string;
  className?: string;
}

export default function TechBadge({ tech, className = "" }: Props) {
  const colors = techColors[tech.toLowerCase()] || { bg: "bg-badge", text: "text-badge-foreground" };

  return (
    <span className={cx("rounded-xs text-xs font-medium py-0.5 px-2.5", colors.bg, colors.text, className)}>
      {tech}
    </span>
  );
}

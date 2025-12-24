import { cx, getTechStyle } from "@/lib/utils";

interface Props {
  tech: string;
  className?: string;
}

export default function TechBadge({ tech, className = "" }: Props) {
  const colors = getTechStyle(tech.toLowerCase());

  return (
    <span className={cx("rounded-xs text-xs font-medium py-0.5 px-2.5", colors.bg, colors.text, className)}>
      {tech}
    </span>
  );
}

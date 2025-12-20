import { icons } from "lucide-react";

type Props = {
  name: keyof typeof icons;
  className?: string;
};

export default function Icon({ name, className, ...props }: Props) {
  const LucideIcon = icons[name as keyof typeof icons];
  return <LucideIcon className={className} {...props} />;
}

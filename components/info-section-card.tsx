import { icons } from "lucide-react";
import Icon from "./icon";

interface Props {
  icon: keyof typeof icons;
  title: string;
  children: React.ReactNode;
}

export default function InfoSectionCard({ title, icon, children }: Props) {
  return (
    <section className="card p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-lg bg-muted">
          <Icon name={icon} className="size-5 text-primary" />
        </div>
        <h2 className="text-lg font-medium">{title}</h2>
      </div>
      {children}
    </section>
  );
}

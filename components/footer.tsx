import { CodeXml, Github } from "lucide-react";
import Link from "next/link";
import Button from "./button";

export default function Footer() {
  return (
    <footer className="border-t border-border py-4 mt-auto">
      <div className="section-container py-0 text-muted-foreground flex-between">
        <p className="text-base">Web Technology Class Project Showcase</p>
        <Link href={"https://github.com/buildbysam/web-tech-projects/"}>
          <Button
            variant="icon"
            title="Github Link"
            className="[&>svg]:text-muted-foreground [&>svg]:hover:text-primary"
          >
            <Github />
          </Button>
        </Link>
      </div>
    </footer>
  );
}

import { ubuntu } from "@/lib/fonts";
import { getAllProjects, getTechnologiesUsed } from "@/lib/projects";
import { ChevronRight, House } from "lucide-react";
import Link from "next/link";
import FilterProjects from "./_components/filter-projects";
import ProjectCardGrid from "@/components/project-card-grid";

export default function AllProjectsPage() {
  const projects = getAllProjects();
  const technologies = getTechnologiesUsed();

  return (
    <main className="section-container">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href={"/"} className="flex items-center gap-1 hover:text-foreground">
          <House className="size-3.5" /> Home
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">Projects</span>
      </nav>
      <div className="space-y-4 max-w-3xl mb-10">
        <h1 className={`${ubuntu.className} page-title`}>All Projects</h1>
        <p className="section-description">
          Browse through all the projects completed during the Web Technology course. Each project includes source code,
          documentation, and live demos.
        </p>
      </div>
      <FilterProjects technologies={technologies} />
      <ProjectCardGrid projects={projects} />
    </main>
  );
}

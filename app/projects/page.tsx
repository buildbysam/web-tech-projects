import ProjectCardGrid from "@/components/project-card-grid";
import { ubuntu } from "@/lib/fonts";
import { getProjects, getProjectsCount, getTechnologiesUsed } from "@/lib/projects";
import { ChevronRight, House } from "lucide-react";
import Link from "next/link";
import FilterProjects from "./_components/filter-projects";
import { SortOptions } from "@/types/projects.types";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ tech?: string; sort?: string }>;
}) {
  const filters = await searchParams;
  const projects = getProjects(filters.tech, filters.sort as SortOptions);
  const totalProjects = getProjectsCount();
  const allTech = getTechnologiesUsed();

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
      <FilterProjects activeTech={filters.tech} activeSort={filters.sort} allTech={["All", ...allTech]} />
      <ProjectCardGrid projects={projects} />
      <div className="text-center mt-8 text-sm text-muted-foreground">
        Showing {projects.length} of {totalProjects} projects
      </div>
    </main>
  );
}

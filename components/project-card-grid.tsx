import { ubuntu } from "@/lib/fonts";
import { formatDate } from "@/lib/utils";
import { IProjectListItem } from "@/types/projects.types";
import { ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";
import ProjectThumbnail from "./project-thumbnail";
import TechBadge from "./tech-badge";

interface Props {
  projects: IProjectListItem[];
}

export default function ProjectCardGrid({ projects }: Props) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto max-w-md sm:max-w-full">
      {projects.map((project, idx) => (
        <Link
          key={project.slug}
          href={`/projects/${project.slug}`}
          style={{ animationDelay: `${idx}00ms` }}
          className="animate__animated animate__fadeIn hover:-translate-y-1 group card block overflow-hidden shadow-xs hover:shadow-sm"
        >
          <div className="aspect-video overflow-hidden bg-muted">
            <ProjectThumbnail src={project.thumbnail.src} alt={project.thumbnail.alt} />
          </div>
          <div className="p-5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
              <span className="text-primary">Task {project.index}</span>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <Calendar className="size-3" />
                {formatDate(project.date_created)}
              </span>
            </div>
            <h3 className={`${ubuntu.className} text-lg mb-2 group-hover:text-primary`}>{project.title}</h3>
            <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tech_stack.map((tech) => (
                <TechBadge key={tech} tech={tech} />
              ))}
            </div>
            <p className="flex items-center text-sm font-medium text-primary">
              View Details <ArrowRight className="ml-1 size-4 group-hover:translate-x-1" />
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

import { firacode, ubuntu } from "@/lib/fonts";
import { formatDate } from "@/lib/utils";
import { IProjectListItem, IScreenshot } from "@/types/projects.types";
import { ArrowRight, Calendar, SearchX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import TechBadge from "./tech-badge";

async function ProjectThumbnail({ src, alt }: IScreenshot) {
  const pathSnippet = src.replace("/projects/", "").replace(".png", "");
  try {
    const { default: imageAsset } = await import(`../projects/${pathSnippet}.png`);
    return <Image className="object-cover size-full group-hover:scale-105" src={imageAsset} alt={alt} />;
  } catch (err) {
    return (
      <div className="size-full flex-center text-destructive gap-2">
        <SearchX className="size-6" />
        <p className={`${firacode.className} text-lg font-medium`}>Image missing</p>
      </div>
    );
  }
}

function ProjectCard({ project }: { project: IProjectListItem }) {
  return (
    <Link href={`/projects/${project.slug}`} className="group card block overflow-hidden shadow-xs hover:shadow-sm">
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
        <h3 className={`${ubuntu.className} font-semibold text-lg mb-2 group-hover:text-primary`}>{project.title}</h3>
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
  );
}

export default function ProjectCardGrid({ projects }: { projects: IProjectListItem[] }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto max-w-md sm:max-w-full">
      {projects.map(async (project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </div>
  );
}

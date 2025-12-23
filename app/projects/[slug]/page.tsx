import Button from "@/components/button";
import InfoSectionCard from "@/components/info-section-card";
import ProjectThumbnail from "@/components/project-thumbnail";
import TechBadge from "@/components/tech-badge";
import { ubuntu } from "@/lib/fonts";
import { getAllProjectSlugs, getProjectMetadata, getSingleProject } from "@/lib/projects";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Copy, Dot, ExternalLink, Github } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export function generateStaticParams() {
  const slugs = getAllProjectSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectMetadata(slug);
  return {
    title: `Project ${project.title}`,
    description: project.description || "",
  };
}

export default async function SingleProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getSingleProject(slug);

  return (
    <main>
      <section className="border-b border-border">
        <div className="section-container">
          <Link
            href={"/projects"}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="size-4 mr-2" />
            Back to Projects
          </Link>
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
            <span className="text-primary font-medium">Task {project.index}</span>
            <span>&bull;</span>
            <span>{formatDate(project.date_created)}</span>
          </div>
          <div className="space-y-4 max-w-3xl mb-6">
            <h1 className={`${ubuntu.className} page-title`}>{project.title}</h1>
            <p className="section-description">{project.description}</p>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tech_stack.map((tech) => (
              <TechBadge className="py-1 text-sm" key={tech} tech={tech} />
            ))}
          </div>
          <div className="flex items-center flex-wrap gap-3">
            {project.github_url ? (
              <Link target="_blank" href={project.github_url}>
                <Button variant="primary" className="flex-center">
                  <Github className="size-4 mr-2" />
                  View on Github
                </Button>
              </Link>
            ) : null}
            {project.live_demo_url ? (
              <Link target="_blank" href={project.live_demo_url}>
                <Button variant="outline" className="flex-center">
                  <ExternalLink className="size-4 mr-2" />
                  Live Demo
                </Button>
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="section-container">
          <h2 className="section-title mb-4">Screenshots</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.screenshots.map((screenshot, idx) => (
              <div
                key={idx}
                className="group relative aspect-video rounded-lg overflow-hidden border border-border hover:shadow-sm hover:border-primary/60"
              >
                <ProjectThumbnail src={screenshot.src} alt={screenshot.alt} />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="absolute bottom-2 w-full px-5 text-center font-medium text-sm text-white capitalize">
                    {screenshot.alt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/30 border-b border-border">
        <div className="section-container grid md:grid-cols-2 gap-5 lg:gap-7">
          <div className="inline-grid gap-5 lg:gap-y-8">
            <InfoSectionCard icon="Target" title="Objectives">
              <p className="text-sm text-muted-foreground">{project.objective}</p>
            </InfoSectionCard>
            <InfoSectionCard icon="CircleCheck" title="Key Features">
              <ul className="space-y-2">
                {project.key_features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-muted-foreground list-none">
                    <Dot className="size-4 mt-0.5 text-primary shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </InfoSectionCard>
          </div>
          <div className="inline-grid gap-5 lg:gap-y-8">
            <InfoSectionCard icon="Lightbulb" title="Concepts Learned">
              <ul className="space-y-2">
                {project.concepts_learned.map((concept, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-muted-foreground list-none">
                    <Dot className="size-4 mt-0.5 text-primary shrink-0" />
                    <span className="text-sm">{concept}</span>
                  </li>
                ))}
              </ul>
            </InfoSectionCard>
            <InfoSectionCard icon="Wrench" title="Tools & Technologies">
              <div className="flex flex-wrap gap-x-2 gap-y-2.5">
                {project.tools_technologies.map((tool) => (
                  <span key={tool} className="py-1 px-2.5 rounded-md text-sm bg-badge text-badge-foreground">
                    {tool}
                  </span>
                ))}
              </div>
            </InfoSectionCard>
          </div>
        </div>
      </section>

      <section className={project.github_url ? "border-b border-border" : ""}>
        <div className="section-container">
          <h2 className="section-title mb-4">Source Code</h2>
        </div>
      </section>

      {project.github_url ? (
        <section className="section-container">
          <div className="card flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 gap-4">
            <div>
              <h3 className="font-medium text-foreground text-lg mb-1">Repository</h3>
              <p className="text-muted-foreground break-all">{project.github_url}</p>
            </div>
            <div className="flex gap-2 shrink-0 items-center">
              <Button variant="outline" className="flex-center">
                <Copy className="size-4 mr-2" />
                Copy
              </Button>
              <Link target="_blank" href={project.github_url}>
                <Button variant="primary" className="flex-center">
                  <Github className="size-4 mr-2" />
                  View on Github
                </Button>
              </Link>
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}

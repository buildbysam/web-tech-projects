import Icon from "@/components/icon";
import { ubuntu } from "@/lib/fonts";
import { getAllProjects } from "@/lib/projects";
import { CodeXml, icons } from "lucide-react";
import Image from "next/image";

const hero_section_card_list = [
  { value: "4", title: "projects" },
  { value: "5+", title: "technologies" },
  { value: "4", title: "semester" },
];

const features_section_card_list = [
  { icon: "CodeXml", title: "Clean Code", description: "Well-structured and documented code following best practices" },
  { icon: "Layers", title: "Modern Stack", description: "Built with current industry-standard technologies" },
  {
    icon: "BookOpen",
    title: "Learning Focused",
    description: "Each project teaches specific web development concepts",
  },
];

export default function HomePage() {
  const projects = getAllProjects();

  return (
    <main>
      <section className="section-container text-center">
        <div className="space-y-5">
          <div className="text-accent-foreground bg-accent inline-flex justify-center items-center gap-1.5 py-2 px-3.5 text-sm rounded-full">
            <CodeXml className="size-5" />
            <p className={`${ubuntu.className} capitalize`}>web technology class</p>
          </div>
          <h1 className={`${ubuntu.className} page-title`}>Project Showcase</h1>
          <p className="section-description max-w-4xl mx-auto">
            A curated collection of web development projects completed throughout the Web Technology course. Each
            project demonstrates practical skills in modern web technologies.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-8 max-w-2xl mx-auto mt-12">
          {hero_section_card_list.map((item, idx) => (
            <div key={idx} className="card p-2 md:p-4 text-center">
              <p className="text-2xl md:text-3xl font-bold text-foreground">{item.value}</p>
              <p className="text-sm text-muted-foreground mt-1 capitalize">{item.title}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-muted/30">
        <div className="section-container grid sm:grid-cols-3 gap-4 lg:gap-6">
          {features_section_card_list.map((item, idx) => (
            <div
              key={idx}
              className="card max-w-sm mx-auto w-full sm:max-w-full rounded-xl p-4 gap-2 lg:gap-4 flex items-start flex-col lg:flex-row"
            >
              <div className="bg-accent rounded-lg p-2.5">
                <Icon name={item.icon as keyof typeof icons} className="text-accent-foreground size-5" />
              </div>
              <div>
                <h3 className={`${ubuntu.className} md:text-lg font-medium mb-0.5`}>{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-container">
        <div className="flex-between mb-5">
          <h2 className={`${ubuntu.className} section-title`}>All Projects</h2>
          <p className="text-muted-foreground text-sm md:text-base">4 Projects</p>
        </div>
        <div>
          {projects.map((project, idx) => (
            <div key={project.slug}>
              <Image src={project.thumbnail.src} alt={project.thumbnail.alt} width={100} height={100} />
              {project.title}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

import Icon from "@/components/icon";
import InfoSectionCard from "@/components/info-section-card";
import { ubuntu } from "@/lib/fonts";
import { ChevronRight, House, icons } from "lucide-react";
import Link from "next/link";

const key_features_list = [
  {
    icon: "Target",
    title: "Project Documentation",
    description: "Comprehensive documentation for each project with code exploration and screenshots.",
  },
  {
    icon: "CodeXml",
    title: "Source Code Viewer",
    description: "Browse project source files with syntax highlighting and folder navigation.",
  },
  {
    icon: "Layers",
    title: "Tech Stack Display",
    description: "Clear visibility of technologies used in each project assignment.",
  },
  {
    icon: "Lightbulb",
    title: "Learning Progress",
    description: "Projects ordered by complexity showing skill development over time.",
  },
];

const skills_list = [
  "HTML5 & Semantic Markup",
  "CSS3 & Modern Layouts",
  "JavaScript ES6+",
  "React & TypeScript",
  "Responsive Design",
  "Version Control (Git)",
  "REST APIs",
  "UI/UX Principles",
];

const goals_list = [
  "Master fundamental web technologies (HTML, CSS, JavaScript)",
  "Build responsive and accessible user interfaces",
  "Implement modern React patterns and best practices",
  "Understand version control and collaborative workflows",
  "Apply UI/UX principles to create user-friendly designs",
  "Develop clean, maintainable, and well-documented code",
];

export default function About() {
  return (
    <main className="section-container">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href={"/"} className="flex items-center gap-1 hover:text-foreground">
          <House className="size-3.5" /> Home
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">About</span>
      </nav>

      <div className="space-y-4 max-w-3xl mb-10">
        <h1 className={`${ubuntu.className} page-title`}>About This Showcase</h1>
        <p className="section-description">
          This website serves as a comprehensive portfolio of all projects completed during the Web Technology course.
          It demonstrates practical application of modern web development concepts and best practices.
        </p>
      </div>

      <div className="space-y-8 mb-8">
        <InfoSectionCard icon="BookOpen" title="Project Overview">
          <p className="text-muted-foreground leading-relaxed">
            This showcase website is designed as a personal academic project portfolio, combining elements of a
            portfolio and a simplified GitHub-like code explorer. Each project includes detailed documentation, source
            code viewing, and visual demonstrations. The projects progress from fundamental HTML/CSS layouts to complex
            React applications, building a strong foundation in modern web development practices and tools.
          </p>
        </InfoSectionCard>

        <section>
          <h2 className="section-title mb-4">Key Features</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {key_features_list.map((item) => (
              <div key={item.title} className="p-5 card hover:border-primary/20">
                <div className="p-2.5 rounded-lg bg-muted w-fit mb-3">
                  <Icon name={item.icon as keyof typeof icons} className="size-5 text-primary" />
                </div>
                <h3 className="font-medium mb-1.5">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <InfoSectionCard icon="Sparkles" title="Skill Demostrated">
          <div className="flex flex-wrap gap-x-2 gap-y-2.5">
            {skills_list.map((skill) => (
              <span key={skill} className="py-1 px-2.5 rounded-md text-sm bg-badge text-badge-foreground">
                {skill}
              </span>
            ))}
          </div>
        </InfoSectionCard>

        <InfoSectionCard icon="Target" title="Learning Goals">
          <ul className="space-y-2">
            {goals_list.map((goal, idx) => (
              <li key={idx} className="flex items-start gap-2 text-muted-foreground list-none">
                <ChevronRight className="size-4 mt-0.5 text-primary shrink-0" />
                <span className="text-sm">{goal}</span>
              </li>
            ))}
          </ul>
        </InfoSectionCard>
      </div>

      <div className="p-4 rounded-xl bg-muted/50 border border-border text-center">
        <p className="text-sm text-muted-foreground">
          This is an academic project showcase created for educational purposes. All code is original work completed as
          part of course assignments.
        </p>
      </div>
    </main>
  );
}

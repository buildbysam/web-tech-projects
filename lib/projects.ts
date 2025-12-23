import { IProject, IProjectListItem, IProjectMetadata, IScreenshot } from "@/types/projects.types";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import fs from "node:fs";
import path from "node:path";
import { slugify } from "./utils";

const PROJECTS_ROOT = path.join(process.cwd(), "projects");
let PROJECT_REGISTRY = new Map<string, { path: string; index: number }>();
const projectsDir = fs
  .readdirSync(PROJECTS_ROOT, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

function getProjectDescription(content: string): string {
  const descriptionRegex = /^#\s+.+?\n+([\s\S]+?)(?=\n#{1,6}\s|$)/m;
  const match = content.match(descriptionRegex);
  if (match && match[1]) {
    return match[1].trim();
  }
  return "";
}

function getProjectTitle(content: string): string {
  const titleRegex = /^#\s+(.+)$/m;
  const match = content.match(titleRegex);
  if (match) {
    return match[1].trim();
  }
  return "";
}

function parseMarkdownList(items: string | string[]): string[] {
  if (Array.isArray(items)) {
    return items;
  }
  if (typeof items === "string") {
    return items
      .split("\n")
      .map((item) => item.replace(/[-\s",]/g, "").trim())
      .filter((item) => item.length > 0);
  }
  return [];
}

function getMarkdownSection(markdown: string, title: string): string | null {
  const lines = markdown.split(/\r?\n/);
  const sectionLines: string[] = [];
  let isInsideSection = false;
  let sectionLevel = 0;

  for (const line of lines) {
    const headerMatch = line.match(/^(#{2,3})\s+(.+)$/i);
    if (headerMatch) {
      const currentTitle = headerMatch[2].trim();
      const currentLevel = headerMatch[1].length;
      if (currentTitle.toLowerCase() === title.toLowerCase()) {
        isInsideSection = true;
        sectionLevel = currentLevel;
        continue;
      }
      if (isInsideSection && currentLevel <= sectionLevel) {
        break;
      }
    }
    if (isInsideSection) {
      sectionLines.push(line);
    }
  }
  return sectionLines.length > 0 ? sectionLines.join("\n").trim() : null;
}

function getMarkdownList(markdown: string, title: string): string[] {
  const sectionContent = getMarkdownSection(markdown, title);
  if (!sectionContent) return [];
  return sectionContent
    .split(/\r?\n/)
    .filter((line) => /^[-*+]\s+/.test(line.trim()))
    .map((line) =>
      line
        .trim()
        .replace(/^[-*+]\s+/, "")
        .replace(/\*\*(.*?)\*\*/g, "$1")
    )
    .filter((item) => item.length > 0);
}

function getProjectScreenshots(content: string, dirPath: string): IScreenshot[] {
  const mdImageRegex = /!\[(.*?)\]\((.*?\.(?:png|jpg|jpeg|webp|gif|svg))\)/gi;
  const screenshots: IScreenshot[] = [];
  let match;
  while ((match = mdImageRegex.exec(content)) !== null) {
    const [_, alt, src] = match;
    const isScreenshot =
      alt.toLowerCase().includes("screenshot") ||
      src.toLowerCase().includes("screenshot") ||
      alt.toLowerCase().includes("preview");
    if (isScreenshot) {
      screenshots.push({
        alt: alt || "Project screenshot",
        src: path.join(dirPath, src),
      });
    }
  }
  return screenshots;
}

function buildProjectRegistry(): typeof PROJECT_REGISTRY {
  const registry = new Map<string, { path: string; index: number }>();
  const projectData = [];

  for (const dir of projectsDir) {
    const dirPath = path.join(PROJECTS_ROOT, dir);
    const files = fs.readdirSync(dirPath);
    if (!files.includes("README.md")) {
      continue;
    }

    const filePath = path.join(dirPath, "README.md");
    const fileContents = fs.readFileSync(filePath, "utf-8");
    const { data: rawMetadata, content: rawContent } = matter(fileContents);

    const projectTitle: string | null = rawMetadata.title ?? getProjectTitle(rawContent);
    if (!projectTitle) {
      continue;
    }

    projectData.push({
      path: dirPath,
      slug: slugify(projectTitle),
      order: rawMetadata.order ?? 999,
      date_created: rawMetadata.date_created ?? 0,
    });
  }

  projectData
    .sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      return new Date(b.date_created).getTime() - new Date(a.date_created).getTime();
    })
    .map((data, idx) =>
      registry.set(data.slug, {
        path: data.path,
        index: idx + 1,
      })
    );

  return registry;
}

export function getAllProjectSlugs(): string[] {
  if (!PROJECT_REGISTRY.size) {
    PROJECT_REGISTRY = buildProjectRegistry();
  }
  return Array.from(PROJECT_REGISTRY.keys());
}

export function getProjectMetadata(slug: string): IProjectMetadata {
  if (!PROJECT_REGISTRY.size) {
    PROJECT_REGISTRY = buildProjectRegistry();
  }
  const project = PROJECT_REGISTRY.get(slug);
  if (!project) {
    return notFound();
  }
  const filePath = path.join(project.path, "README.md");
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const { data: rawMetadata, content: rawContent } = matter(fileContents);
  const title: string = rawMetadata.title ?? getProjectTitle(rawContent);
  const description = getProjectDescription(rawContent);
  return { title, description };
}

export function getSingleProject(slug: string): IProject {
  if (!PROJECT_REGISTRY.size) {
    PROJECT_REGISTRY = buildProjectRegistry();
  }
  const project = PROJECT_REGISTRY.get(slug);
  if (!project) {
    return notFound();
  }
  const files = fs.readdirSync(project.path);
  if (!files.includes("README.md")) {
    return notFound();
  }
  const filePath = path.join(project.path, "README.md");
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const { data: rawMetadata, content: rawContent } = matter(fileContents);
  const projectTitle = rawMetadata.title ?? getProjectTitle(rawContent);
  if (!projectTitle) {
    return notFound();
  }
  const imagePath = path.join("/projects", project.path.replace(PROJECTS_ROOT, ""));

  return {
    index: project.index,
    title: projectTitle,
    slug: slugify(projectTitle),
    description: getProjectDescription(rawContent),
    screenshots: getProjectScreenshots(rawContent, imagePath),
    tech_stack: parseMarkdownList(rawMetadata.tech_stack),
    date_created: new Date(rawMetadata.date_created ?? 0),
    github_url: rawMetadata.github_url,
    live_demo_url: rawMetadata.live_demo_url,
    objective: getMarkdownSection(rawContent, "Objectives"),
    key_features: getMarkdownList(rawContent, "Key Features")!,
    concepts_learned: getMarkdownList(rawContent, "Concepts Learned"),
    tools_technologies: getMarkdownList(rawContent, "Tools and Technologies Used"),
  };
}

// export function getProjectFiles() {}

export function getProjectsCount(): number {
  if (!PROJECT_REGISTRY.size) {
    PROJECT_REGISTRY = buildProjectRegistry();
  }
  return PROJECT_REGISTRY.size;
}

export function getTechnologiesUsed(): string[] {
  if (!PROJECT_REGISTRY.size) {
    PROJECT_REGISTRY = buildProjectRegistry();
  }
  const techUsedList = new Set<string>();
  PROJECT_REGISTRY.forEach((project) => {
    const files = fs.readdirSync(project.path);
    if (!files.includes("README.md")) {
      return;
    }
    const filePath = path.join(project.path, "README.md");
    const fileContents = fs.readFileSync(filePath, "utf-8");
    const { data: rawMetadata, content: rawContent } = matter(fileContents);
    const projectTitle = rawMetadata.title ?? getProjectTitle(rawContent);
    if (!projectTitle) {
      return;
    }
    parseMarkdownList(rawMetadata.tech_stack).forEach((tech) => techUsedList.add(tech));
  });
  return Array.from(techUsedList);
}

export function getTechnologiesUsedCount(): number {
  return getTechnologiesUsed().length;
}

export function getAllProjects(): IProjectListItem[] {
  if (!PROJECT_REGISTRY.size) {
    PROJECT_REGISTRY = buildProjectRegistry();
  }
  const projectsList: IProjectListItem[] = [];

  PROJECT_REGISTRY.forEach((project) => {
    const files = fs.readdirSync(project.path);
    if (!files.includes("README.md")) {
      return;
    }
    const filePath = path.join(project.path, "README.md");
    const fileContents = fs.readFileSync(filePath, "utf-8");
    const { data: rawMetadata, content: rawContent } = matter(fileContents);
    const projectTitle = rawMetadata.title ?? getProjectTitle(rawContent);
    if (!projectTitle) {
      return;
    }
    const imagePath = path.join("/projects", project.path.replace(PROJECTS_ROOT, ""));
    projectsList.push({
      index: project.index,
      title: projectTitle,
      slug: slugify(projectTitle),
      description: getProjectDescription(rawContent),
      thumbnail: getProjectScreenshots(rawContent, imagePath)[0],
      tech_stack: parseMarkdownList(rawMetadata.tech_stack),
      date_created: new Date(rawMetadata.date_created ?? 0),
    });
  });

  return projectsList;
}

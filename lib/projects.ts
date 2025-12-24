import {
  IProject,
  IProjectListItem,
  IProjectMetadata,
  IRegistryItem,
  IScreenshot,
  SortOptions,
  TParsedData,
} from "@/types/projects.types";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import fs from "node:fs";
import path from "node:path";
import { slugify } from "./utils";

const PROJECTS_ROOT = path.join(process.cwd(), "projects");
let PROJECT_REGISTRY = new Map<string, IRegistryItem>();
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
        return b.order - a.order;
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

function ensureRegistry() {
  if (!PROJECT_REGISTRY.size) {
    PROJECT_REGISTRY = buildProjectRegistry();
  }
}

export function getAllProjectSlugs(): string[] {
  ensureRegistry();
  return Array.from(PROJECT_REGISTRY.keys());
}

function parseProject(project: IRegistryItem, fullDetail: true): TParsedData<IProject> | null;
function parseProject(project: IRegistryItem, fullDetail: false): TParsedData<IProjectListItem> | null;
function parseProject(
  project: IRegistryItem,
  fullDetail: boolean = false
): TParsedData<IProjectListItem | IProject> | null {
  const filePath = path.join(project.path, "README.md");
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContents);
  const title = data.title ?? getProjectTitle(content);
  if (!title) {
    return null;
  }
  const imageBase = path.join("/projects", project.path.replace(PROJECTS_ROOT, ""));
  const base = {
    index: project.index,
    title,
    slug: slugify(title),
    description: getProjectDescription(content),
    thumbnail: getProjectScreenshots(content, imageBase)[0],
    tech_stack: parseMarkdownList(data.tech_stack),
    date_created: new Date(data.date_created ?? 0),
    isFeatured: !!data.featured,
  };
  if (!fullDetail) {
    return base;
  }
  return {
    ...base,
    screenshots: getProjectScreenshots(content, imageBase),
    github_url: data.github_url,
    live_demo_url: data.live_demo_url,
    objective: getMarkdownSection(content, "Objectives"),
    key_features: getMarkdownList(content, "Key Features") || [],
    concepts_learned: getMarkdownList(content, "Concepts Learned"),
    tools_technologies: getMarkdownList(content, "Tools and Technologies Used"),
  };
}

export function getProjectMetadata(slug: string): IProjectMetadata {
  ensureRegistry();
  const projectEntry = PROJECT_REGISTRY.get(slug);
  const project = projectEntry ? parseProject(projectEntry, false) : null;
  if (!project) {
    return notFound();
  }
  return {
    title: project.title,
    description: project.description,
  };
}

export function getSingleProject(slug: string): IProject {
  ensureRegistry();
  const project = PROJECT_REGISTRY.get(slug);
  const data = project ? parseProject(project, true) : null;
  if (!data) {
    return notFound();
  }
  return data as IProject;
}

export function getProjectsCount(): number {
  ensureRegistry();
  return PROJECT_REGISTRY.size;
}

export function getTechnologiesUsed(): string[] {
  const allProjects = getAllProjects();
  const techUsedList = new Set<string>();
  allProjects.forEach((project) => {
    project.tech_stack.forEach((tech) => techUsedList.add(tech));
  });
  return Array.from(techUsedList);
}

export function getTechnologiesUsedCount(): number {
  return getTechnologiesUsed().length;
}

function getAllProjects(): IProjectListItem[] {
  ensureRegistry();
  const list: IProjectListItem[] = [];
  PROJECT_REGISTRY.forEach((p) => {
    const data = parseProject(p, false);
    if (data) {
      list.push(data);
    }
  });
  return list;
}

export function getFeaturedProject(): IProjectListItem[] {
  return getAllProjects()
    .filter((p) => (p as TParsedData<IProjectListItem>).isFeatured)
    .slice(0, 6);
}

export function getProjects(tech?: string, sort?: SortOptions): IProjectListItem[] {
  let projects = getAllProjects();
  if (tech) {
    projects = projects.filter((p) => {
      return p.tech_stack.some((t) => t.toLowerCase() === tech.toLowerCase());
    });
  }
  if (sort && sort === "date-asc") {
    projects.sort((a, b) => {
      return new Date(a.date_created).getTime() - new Date(b.date_created).getTime();
    });
  }
  return projects;
}

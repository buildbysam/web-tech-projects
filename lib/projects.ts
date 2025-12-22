import { IProject, IProjectListItem, IProjectMetadata, IScreenshot, Screenshot } from "@/types/projects.types";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import fs from "node:fs";
import path from "node:path";
import { slugify } from "./utils";

const PROJECTS_ROOT = path.join(process.cwd(), "projects");
let PROJECT_REGISTRY = new Map<string, string>();
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

export function getListFromSection(content: string, sectionName: string): string[] {
  const regex = new RegExp(`### ${sectionName}\\n([\\s\\S]*?)(?=\\n###|$)`, "i");
  const match = content.match(regex);
  if (!match) {
    return [];
  }
  return match[1]
    .split("\n")
    .map((line) => line.replace(/^[-*]\s+/, "").trim())
    .filter((line) => line.length > 0);
}

export function getProjectScreenshots(content: string, dirPath: string): IScreenshot[] {
  const mdImageRegex = /!\[(.*?)\]\((.*?\.(?:png|jpg|jpeg|webp|gif|svg))\)/gi;
  const screenshots: Screenshot[] = [];
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
  const registry = new Map<string, string>();
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
    .map((data) => registry.set(data.slug, data.path));

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
  const dirPath = PROJECT_REGISTRY.get(slug);
  if (!dirPath) {
    return notFound();
  }
  const filePath = path.join(dirPath, "README.md");
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const { data: rawMetadata, content: rawContent } = matter(fileContents);
  const title: string = rawMetadata.title ?? getProjectTitle(rawContent);
  const description = getProjectDescription(rawContent);
  return { title, description };
}

export function getProjectContent(): IProject {
  return {};
}

export function getProjectFiles() {}

export function getProjectsCount() {
  if (!PROJECT_REGISTRY.size) {
    PROJECT_REGISTRY = buildProjectRegistry();
  }
  return PROJECT_REGISTRY.size;
}

export function getAllProjects(): IProjectListItem[] {
  if (!PROJECT_REGISTRY.size) {
    PROJECT_REGISTRY = buildProjectRegistry();
  }
  const projectsList: IProjectListItem[] = [];

  PROJECT_REGISTRY.values().forEach((projectDirPath, idx) => {
    const files = fs.readdirSync(projectDirPath);
    if (!files.includes("README.md")) {
      return;
    }
    const filePath = path.join(projectDirPath, "README.md");
    const fileContents = fs.readFileSync(filePath, "utf-8");
    const { data: rawMetadata, content: rawContent } = matter(fileContents);
    const projectTitle = rawMetadata.title ?? getProjectTitle(rawContent);
    if (!projectTitle) {
      return;
    }
    const imagePath = path.join("/projects", projectDirPath.replace(PROJECTS_ROOT, ""));
    projectsList.push({
      index: idx + 1,
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

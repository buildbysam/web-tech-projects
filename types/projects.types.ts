export interface IScreenshot {
  src: string;
  alt: string;
}

export interface IProjectMetadata {
  title: string;
  description: string;
}

export interface IProjectAttributes extends IProjectMetadata {
  index: number;
  slug: string;
  date_created: Date;
  tech_stack: string[];
}

export interface IProject extends IProjectAttributes {
  github_url?: string;
  live_demo_url?: string;
  screenshots: IScreenshot[];
  objective: string | null;
  key_features: string[];
  concepts_learned: string[];
  tools_technologies: string[];
}

export interface IProjectListItem extends IProjectAttributes {
  thumbnail: IScreenshot;
}

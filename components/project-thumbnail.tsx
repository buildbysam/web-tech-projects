import { firacode } from "@/lib/fonts";
import { IScreenshot } from "@/types/projects.types";
import { SearchX } from "lucide-react";
import Image from "next/image";

export default async function ProjectThumbnail({ src, alt }: IScreenshot) {
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

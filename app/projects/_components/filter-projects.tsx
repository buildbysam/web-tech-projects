"use client";

import Button from "@/components/button";
import Dropdown from "@/components/dropdown";

interface Props {
  technologies: string[];
}

export default function FilterProjects({ technologies }: Props) {
  return (
    <>
      <div className="mb-8 px-4 py-3 card flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-medium text-muted-foreground mr-1">Filter:</span>
          <Button variant="outline" className="rounded-md text-sm py-1! px-2! bg-primary! text-primary-foreground!">
            All
          </Button>
          {technologies.map((tech) => (
            <Button key={tech} variant="outline" className="rounded-md text-sm py-1! px-2!">
              {tech}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <span className="font-medium text-muted-foreground mr-1">Sort:</span>
          <Dropdown
            dropdown_items={[
              { title: "Newest", value: "newest" },
              { title: "Oldest", value: "oldest" },
            ]}
            handleChange={(value) => console.log(value)}
          />
        </div>
      </div>
    </>
  );
}

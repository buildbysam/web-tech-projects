import { getAllProjects } from "@/lib/projects";

export default function AllProjectsPage() {
  const projects = getAllProjects();
  console.log(projects);

  return (
    <main className="py-6">
      <h1 className="text-primary text-lg">All Projects Page</h1>
    </main>
  );
}

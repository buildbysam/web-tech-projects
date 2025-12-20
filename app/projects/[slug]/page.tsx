import { getAllProjectSlugs, getProjectMetadata } from "@/lib/projects";

export default async function SingleProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectMetadata(slug);
  const slugs = getAllProjectSlugs();
  console.log(project);
  console.log(slugs);

  return (
    <main className="py-6">
      <h1 className="text-primary text-lg">{slug}</h1>
    </main>
  );
}

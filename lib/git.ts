import "server-only";

export async function getCommitCount(): Promise<number> {
  const res = await fetch(`https://api.github.com/repos/buildbysam/web-tech-projects/commits?per_page=1`);
  const link = res.headers.get("link");
  if (link) {
    const match = link.match(/page=(\d+)>; rel="last"/);
    return match ? parseInt(match[1]) : 1;
  }
  return 1;
}

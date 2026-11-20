/** Cover images for known blog posts (from the original Tactyqal blog). */
const COVERS: Record<string, string> = {
  "elevator-pitch-for-entrepreneurs": "/images/blog-elevator.jpg",
  "how-to-build-a-tech-startup-team": "/images/blog-team.jpg",
  "11-reasons-startups-fail-at-idea-stage": "/images/blog-fail.jpg",
  "50-no-code-startup-app-ideas": "/images/blog-nocode.webp",
  "30-startup-ideas-food-waste": "/images/blog-foodwaste.jpg",
  "50-startup-ideas-gen-z": "/images/blog-genz.jpg",
};

export function coverFor(slug: string): string | null {
  return COVERS[slug] ?? null;
}

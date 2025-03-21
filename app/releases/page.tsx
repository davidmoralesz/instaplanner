import { Documentation } from "@/components/docs/documentation"

export const metadata = {
  title: "Release Notes | InstaPlanner",
  description: "InstaPlanner Terms of Service",
}

/**
 * Release Notes page component for InstaPlanner.
 * @returns The Release Notes page component.
 */
export default function ReleasesPage() {
  return <Documentation title="Release Notes" fetch="releases" />
}

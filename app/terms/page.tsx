import { Documentation } from "@/components/docs/documentation"

export const metadata = {
  title: "Terms of Service | InstaPlanner",
  description: "InstaPlanner Terms of Service",
}

/**
 * Terms of Service page component for InstaPlanner.
 * @returns The ToS page component.
 */
export default function TermsPage() {
  return <Documentation title="Release Notes" fetch="terms" />
}

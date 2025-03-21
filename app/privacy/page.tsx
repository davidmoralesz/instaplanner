import { Documentation } from "@/components/docs/documentation"

export const metadata = {
  title: "Privacy Policy | InstaPlanner",
  description: "InstaPlanner Terms of Service",
}

/**
 * Privacy Policy page component for InstaPlanner.
 * @returns The privacy policy page component.
 */
export default function PrivacyPage() {
  return <Documentation title="Privacy Policy" fetch="privacy" />
}

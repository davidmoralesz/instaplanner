import { getRequestContext } from "@cloudflare/next-on-pages"

export const runtime = "edge"

/**
 * Handles a GET request to retrieve the maintenance mode status.
 * Fetches the "is_active" flag from the KV storage and returns its value.
 * @returns A Response object containing the maintenance mode status.
 */
export async function GET() {
  const BUILD_CONFIG = getRequestContext().env.BUILD_CONFIG
  const isMaintenanceMode = await BUILD_CONFIG.get("maintenance_mode")
  return new Response(isMaintenanceMode)
}

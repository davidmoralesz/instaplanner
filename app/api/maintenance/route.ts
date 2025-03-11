import { getRequestContext } from "@cloudflare/next-on-pages"

export const runtime = "edge"

export async function GET() {
  const KV = getRequestContext().env.maintenance_mode
  const isActive = await KV.get("is_active")
  return new Response(`is_active: ${isActive}!`)
}

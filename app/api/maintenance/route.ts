export async function GET(
  _request: Request,
  {
    env = { MAINTENANCE_KV: { get: async () => null } },
  }: {
    env?: { MAINTENANCE_KV: { get: (key: string) => Promise<string | null> } }
  }
) {
  const maintenanceFlag = await env.MAINTENANCE_KV.get(
    "MOBILE_MAINTENANCE_MODE"
  )
  const maintenanceMode = maintenanceFlag === "true"

  return new Response(JSON.stringify({ maintenanceMode }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
}

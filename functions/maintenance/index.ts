interface Env {
  maintenance_mode: KVNamespace
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  console.log(
    `[LOGGING FROM /maintenance]: Request came from ${context.request.url}`
  )
  const res = await context.env.maintenance_mode.get("is_active")
  return new Response(res)
}

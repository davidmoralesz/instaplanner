import { getRequestContext } from "@cloudflare/next-on-pages"
import { computeHash } from "@/lib/utils"

export const runtime = "edge"

/**
 * Handles the GET request to fetch and return a document from an external source.
 * If the document has been updated, it updates the stored version and hash in DOCS_STORE.
 * If the content is the same as the stored version, it returns the cached content.
 * @param req - The incoming request object
 * @param context - The context object containing the document key (doc)
 * @returns A Response object containing the document content or an error message.
 */
export async function GET(req: Request, context: { params: { doc: string } }) {
  const { doc: docKey } = await context.params

  if (!docKey) return new Response("Missing doc parameter", { status: 400 })

  const DOCS_STORE = getRequestContext().env.DOCS_STORE

  try {
    const res = await fetch(
      `${new URL(req.url).origin}/docs/${docKey.toUpperCase()}.md`
    )
    if (!res.ok) throw new Error(`Failed to fetch document: ${res.statusText}`)

    const latestContent = await res.text()
    const latestHash = await computeHash(latestContent)

    const storedHash = await DOCS_STORE.get(`${docKey}_hash`)
    const storedContent = await DOCS_STORE.get(docKey)

    if (storedHash === latestHash && storedContent) {
      return new Response(storedContent, {
        headers: { "Content-Type": "text/markdown" },
      })
    }

    await DOCS_STORE.put(docKey, latestContent)
    await DOCS_STORE.put(`${docKey}_hash`, latestHash)

    return new Response(latestContent, {
      headers: { "Content-Type": "text/markdown" },
    })
  } catch (error) {
    console.error("Error fetching document:", error)
    return new Response("Error loading document", { status: 500 })
  }
}

/**
 * Handles the POST request to clear the cache of a document in DOCS_STORE.
 * It checks the authorization header to ensure only authorized users can clear the cache.
 * @param req - The incoming request object
 * @returns A Response object indicating the success or failure of the cache clearing process.
 */
export async function POST(req: Request) {
  const { searchParams } = new URL(req.url)
  const docKey = searchParams.get("doc")
  if (!docKey) return new Response("Missing doc parameter", { status: 400 })

  const DOCS_STORE = getRequestContext().env.DOCS_STORE

  const authHeader = req.headers.get("Authorization")
  const KV_INVALIDATION_SECRET = process.env.KV_INVALIDATION_SECRET
  if (authHeader !== `Bearer ${KV_INVALIDATION_SECRET}`) {
    return new Response("Unauthorized", { status: 403 })
  }

  try {
    await DOCS_STORE.delete(docKey)
    await DOCS_STORE.delete(`${docKey}_hash`)
    return new Response(`Cache cleared for ${docKey}`, { status: 200 })
  } catch (error) {
    console.error("Error clearing cache:", error)
    return new Response("Error clearing cache", { status: 500 })
  }
}

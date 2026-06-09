export async function GET() {
    return new Response(null, {
        status: 302,
        headers: {
          Location: import.meta.env.OAUTH2_URL
        }
    })
}
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
    context.cookies.set("authToken", '', {
      httpOnly: true,
      secure: import.meta.env.PROD === true,
      path: "/",
      expires: new Date(0)
    });

    return new Response(null, {
        status: 302,
        headers: {
          Location: '/'
        }
    })
}
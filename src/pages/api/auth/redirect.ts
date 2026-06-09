import type { APIContext } from "astro";
import { generateToken } from "@utils/auth";
import { exchangeCodeForToken } from "@utils/discord";
import { getOrCreateUser } from "@utils/prisma";

export async function GET(context: APIContext) {
  try {
    if (context.cookies.has('authToken'))
      return new Response("Already logged in", { status: 400 });

    const code = context.url.searchParams.get("code");
    if (!code) {
      return new Response("No code provided", { status: 400 });
    }

    const tokenResponse = await exchangeCodeForToken(code);
    const profile = await getOrCreateUser(tokenResponse.access_token);
    const token = await generateToken(profile);

    context.cookies.set("authToken", token, {
      httpOnly: true,
      secure: import.meta.env.PROD === true,
      path: "/",
      expires: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
    });
    
    return new Response(null, {
      status: 302,
      headers: { Location: import.meta.env.URL },
    });
  } catch (error: any) {
    console.error(error);
    return new Response(error.message, { status: 500 });
  }
}

import { prisma } from "@utils/prisma";
import type { APIContext } from "astro";
import { validateToken } from "@utils/auth";

export async function GET(context: APIContext) {
  try {
    const user = await validateToken(context.cookies.get("authToken")?.value, true);

    const { slug } = context.params;
    if (!slug || isNaN(Number(slug))) return new Response("Invalid ID", { status: 400 });

    const post = await prisma.post.findUnique({ where: { id: Number(slug) } });
    if (!post) return new Response("Post not found", { status: 404 });
    if (post.authorId !== Number(user.id)) return new Response("Unauthorized", { status: 401 });

    await prisma.post.delete({
      where: { id: Number(slug) }
    });

    return new Response(null, {
        status: 302,
        headers: {
          Location: '/'
        }
    })
  } catch (e: any) {
    return new Response(e.message, { status: 500 });
  }
}

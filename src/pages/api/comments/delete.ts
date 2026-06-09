import { prisma } from "@utils/prisma";
import type { APIContext } from "astro";
import { validateToken } from "@utils/auth";

export async function GET(context: APIContext) {
  try {
    const authToken = context.cookies.get("authToken");
    const user = await validateToken(authToken?.value, false);

    const id = context.url.searchParams.get("id") as string;

    const comment = await prisma.comment.findUnique({
      where: {
        id: Number(id)
      }
    });

    if (!comment) return new Response("Comment not found", { status: 404 });

    if (comment.authorId !== Number(user.id) && user.canPost === false) {
        return new Response("Unauthorized", { status: 401 });}

    await prisma.comment.delete({
      where: {
        id: Number(id)
      }
    });

    return new Response(null, {
        status: 302,
        headers: {
          Location: '/post/' + comment.postId
        }
    })
  } catch (e: any) {
    return new Response(e.message, { status: 500 });
  }
}

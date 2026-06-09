import { prisma } from "@utils/prisma";
import type { APIContext } from "astro";
import { validateToken } from "@utils/auth";

export async function POST(context: APIContext) {
  try {
    const authToken = context.cookies.get("authToken");

    const user = await validateToken(authToken?.value, true);

    const data = await context.request.formData();
    const id = Number(data.get("id"));
    const title = data.get("title") as string;
    const content = data.get("content") as string;

    if (isNaN(id)) return new Response("Invalid ID", { status: 400 });
    if (!title) return new Response("Title is required", { status: 400 });
    if (!content) return new Response("Content is required", { status: 400 });

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return new Response("Post not found", { status: 404 });

    if (post.authorId !== Number(user.id)) return new Response("Unauthorized", { status: 401 });


    await prisma.post.update({
      where: { id },
      data: { title, content },
    });

    return new Response(null, {
        status: 302,
        headers: {
          Location: '/post/' + id
        }
    })
  } catch (e: any) {
    return new Response(e.message, { status: 500 });
  }
}

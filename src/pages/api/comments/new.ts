import { prisma } from "@utils/prisma";
import type { APIContext } from "astro";
import { validateToken } from "@utils/auth";
import { rateLimit } from "@utils/helpers";

export async function POST(context: APIContext) {
  try {
    const authToken = context.cookies.get("authToken");
    const user = await validateToken(authToken?.value, false);


    await rateLimit(user.id);

    const data = await context.request.formData();

    const id = data.get("postId") as string;
    const content = data.get("content") as string;

    if (!content || content.length > 500) return new Response("Content is required and must be less than 500 characters", { status: 400 });


    const post = await prisma.post.findUnique({
      where: {
        id: Number(id)
      }
    });

    if (!post) return new Response("Post not found", { status: 404 });

    await prisma.comment.create({
      data: {
        content,
        authorId: Number(user.id),
        postId: Number(id)
      }
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

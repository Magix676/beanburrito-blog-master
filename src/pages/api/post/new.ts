import { prisma } from "@utils/prisma";
import type { APIContext } from "astro";
import { validateToken } from "@utils/auth";

export async function POST(context: APIContext) {
  try {
    const authToken = context.cookies.get("authToken");
    const user = await validateToken(authToken?.value, true);

    const data = await context.request.formData();
    const title = data.get("title") as string;
    const content = data.get("content") as string;

    if (!title) return new Response("Title is required", { status: 400 });
    if (!content) return new Response("Content is required", { status: 400 });

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: Number(user.id)
      }
    });

    return new Response(null, {
        status: 302,
        headers: {
          Location: '/post/' + post.id
        }
    })
  } catch (e: any) {
    return new Response(e.message, { status: 500 });
  }
}

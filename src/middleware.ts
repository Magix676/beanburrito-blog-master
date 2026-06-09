import type { APIContext, MiddlewareNext } from "astro";
import { validateToken } from "@utils/auth";

export async function onRequest(context: APIContext, next: MiddlewareNext) {
  try {
    const user = await validateToken(context.cookies.get("authToken")?.value, false);
    context.locals.user = user;
  } catch (e: any) {
    context.locals.user = null;
  }

  return next();
}

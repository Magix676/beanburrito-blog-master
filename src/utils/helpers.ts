import { RateLimiterMemory } from "rate-limiter-flexible";

export function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const opts = {
  points: 1, // 1 points
  duration: 60, // Per second
};

const rateLimiter = new RateLimiterMemory(opts);

export async function rateLimit(key: string) {
  try {
    await rateLimiter.consume(key);
  } catch (rejRes: any) {
    const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
    throw new Error("Too many requests, please try again in " + secs + " second(s).");
  }
}

export async function getFirstImage(content: string | Promise<string>) {
  const resolvedContent = await content;

  const regex = /<img.*?src="(.*?)"/;
  const match = regex.exec(resolvedContent);

  if (match && match[1].startsWith("/")) 
    match[1] = "https://blog.beanburrito.tech" + match[1];


  return match ? match[1] : null;
}
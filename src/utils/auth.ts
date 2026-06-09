import jwt from "jsonwebtoken";
import type { UserToken } from "src/types/UserToken";

export async function generateToken(user: {
  id: number;
  discordId: string;
  email: string;
  name: string;
  profile: string;
  canPost: boolean;
}) {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      canPost: user.canPost,
    },
    import.meta.env.SECRET,
    { expiresIn: "1h" }
  );
}

export async function validateToken(
  cookie: string | undefined,
  checkCanPost: boolean
): Promise<UserToken> {
  if (!cookie || !jwt.verify(cookie, import.meta.env.SECRET)) throw new Error("Unauthorized");

  const user = jwt.decode(cookie) as UserToken;

  if (!user || (checkCanPost && !user.canPost)) throw new Error("Unauthorized");

  return user;
}

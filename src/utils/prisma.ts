import { PrismaClient } from "@prisma/client";
import type { DiscordUser } from "../types/Discord";
import { getUser } from "@utils/discord";

export const prisma = new PrismaClient();

export async function getOrCreateUser(accessToken: string) {
  const user = await getUser(accessToken);
  if (!user || !user.verified) {
    throw new Error("Error, make sure your email is verified.");
  }

  let profile = await prisma.user.findUnique({
    where: { discordId: user.id },
  });

  if (!profile) {
    profile = await createUser(user);
  }

  await updateUser(profile.id, user);
  return profile;
}

export async function createUser(profile: DiscordUser) {
  return prisma.user.create({
    data: {
      discordId: profile.id,
      email: profile.email,
      name: profile.global_name ?? profile.username,
      profile: profile.avatar,
    },
  });
}

export async function updateUser(id: number, profile: DiscordUser) {
  return prisma.user.update({
    where: {
      id,
    },
    data: {
      email: profile.email,
      name: profile.global_name ?? profile.username,
      username: profile.username,
      profile: profile.avatar,
    },
  });
}

export async function getAllPosts() {
  return prisma.post.findMany({
    select: {
      id: true,
      title: true,
      createdAt: true,
      author: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    }
  });
}

export async function getPost(id: number) {
  return prisma.post.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          name: true,
          profile: true,
          discordId: true,
        },
      }
    },
  });
}

export async function getComments(postId: number) {
  return prisma.comment.findMany({
    where: { postId },
    include: {
      author: {
        select: {
          profile: true,
          discordId: true,
          username: true,
          name: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  })
}
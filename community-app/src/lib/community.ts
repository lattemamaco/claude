import type { User } from "@/generated/prisma/client";

export function authorLabel(
  post: { isAnonymous: boolean; author: { displayName: string } },
  viewer: User
) {
  if (!post.isAnonymous) return post.author.displayName;
  if (viewer.role === "ADMIN") return `Anonymous (${post.author.displayName})`;
  return "Anonymous";
}

import { prisma } from "../lib/prisma";

export const listUsers = async () => {
  return prisma.user.findMany();
};

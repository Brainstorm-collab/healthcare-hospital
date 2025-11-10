// Example service layer. Keep controllers thin by delegating to services.
import { prisma } from "../lib/prisma";

export const listUsers = async () => {
  return prisma.user.findMany();
};

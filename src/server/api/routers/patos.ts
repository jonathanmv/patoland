import { customAlphabet } from "nanoid";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz", 6);
export const patosRouter = createTRPCRouter({
  findById: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.patosWithoutUser.findUnique({
      where: { id: input },
    });
  }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.patosWithoutUser.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),

  add: publicProcedure
    .input(z.object({ name: z.string(), imageUrl: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.patosWithoutUser.create({
        data: {
          id: nanoid(),
          name: input.name,
          imageUrl: input.imageUrl,
        },
      });
    }),

  addLove: publicProcedure
    .input(z.object({ id: z.string(), love: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.patosWithoutUser.update({
        where: { id: input.id },
        data: {
          love: { increment: input.love },
        },
      });
    }),
});

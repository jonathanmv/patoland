import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

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
          name: input.name,
          imageUrl: input.imageUrl,
        },
      });
    }),
});

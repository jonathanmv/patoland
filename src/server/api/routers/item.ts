import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const itemRouter = createTRPCRouter({
  findAllByUserId: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.item.findMany({
      where: {
        userId: input,
      },
    });
  }),

  add: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        imageUrl: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const item = await ctx.prisma.item.create({
        data: {
          userId: ctx.session.user.id,
          name: input.name,
          description: input.description,
          imageUrl: input.imageUrl,
        },
      });

      return item;
    }),

  update: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const item = await ctx.prisma.item.update({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        data: {
          name: input.name,
        },
      });
      return item;
    }),

  remove: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const item = await ctx.prisma.item.delete({
        where: {
          id: input,
          userId: ctx.session.user.id,
        },
      });

      return item;
    }),
});

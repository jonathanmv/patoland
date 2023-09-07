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

  findById: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.item.findUnique({
      where: {
        id: input,
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
      const { id, name, username } = ctx.session.user;
      const item = await ctx.prisma.item.create({
        data: {
          userId: id,
          username: username || name || id,
          name: input.name,
          description: input.description,
          imageUrl: input.imageUrl,
        },
      });

      return item;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string().optional(),
      })
    )
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

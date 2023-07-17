import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const patosRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.patosWithoutUser.findMany();
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

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});

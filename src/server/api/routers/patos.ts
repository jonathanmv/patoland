import { PatosWithoutUser } from "@prisma/client";
import { customAlphabet } from "nanoid";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { removeImageBackground } from "~/server/replicate";

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
    .mutation(async ({ ctx, input }) => {
      const pato = await ctx.prisma.patosWithoutUser.create({
        data: {
          id: nanoid(),
          name: input.name,
          imageUrl: input.imageUrl,
        },
      });

      await requestBackgroundRemoval(pato);

      return pato;
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

async function requestBackgroundRemoval(pato: PatosWithoutUser) {
  try {
    const prediction = await removeImageBackground(pato.imageUrl);
    await prisma.patoPrediction.create({
      data: {
        id: prediction.id,
        version: prediction.version,
        status: prediction.status,
        created_at: prediction.created_at,
        error: prediction.error,
        patoId: pato.id,
      },
    });
  } catch (e) {
    console.error("Error removing background", e);
  }
}

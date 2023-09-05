import { type Pato } from "@prisma/client";
import { customAlphabet } from "nanoid";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { removeImageBackground } from "~/server/replicate";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz", 6);
export const patosRouter = createTRPCRouter({
  findById: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.pato.findUnique({
      where: { id: input },
    });
  }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.pato.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),

  add: protectedProcedure
    .input(z.object({ name: z.string(), imageUrl: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const pato = await ctx.prisma.pato.create({
        data: {
          id: nanoid(),
          userId: ctx.session.user.id,
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
      return ctx.prisma.pato.update({
        where: { id: input.id },
        data: {
          love: { increment: input.love },
        },
      });
    }),
});

async function requestBackgroundRemoval(pato: Pato) {
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

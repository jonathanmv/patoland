import * as argon2 from "argon2";
import { customAlphabet } from "nanoid";
import { z } from "zod";
import { env } from "~/env.mjs";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz", 6);
export const authRouter = createTRPCRouter({
  signUp: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.prisma.user.findUnique({
        where: { username: input.username },
      });

      if (existingUser) {
        return { success: false, message: "User already exists", user: null };
      }

      const hashedPassword = await argon2.hash(input.password, {
        secret: Buffer.from(env.PASSWORD_HASH_SECRET),
      });

      const user = await ctx.prisma.user.create({
        data: {
          id: nanoid(),
          username: input.username,
          password: hashedPassword,
        },
      });

      return {
        success: true,
        message: "User created successfully",
        user: { id: user.id, username: user.username },
      };
    }),
});

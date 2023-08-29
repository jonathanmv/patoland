import * as argon2 from "argon2";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";

const signupSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(6).max(50),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ success: false, message: "Invalid method" });
    return;
  }
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: "Invalid body" });
    return;
  }
  const { username, password } = parsed.data;

  // Check if user exists
  const userExists = await prisma.user.findUnique({ where: { username } });

  if (userExists) {
    res.status(422).json({
      success: false,
      message: "A user with the same email already exists!",
    });
    return;
  }

  // Hash Password
  const hashedPassword = await argon2.hash(password, {
    secret: Buffer.from(env.PASSWORD_HASH_SECRET),
  });

  // Store new user
  await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
    },
  });

  res
    .status(201)
    .json({ success: true, message: "User signed up successfuly" });
}

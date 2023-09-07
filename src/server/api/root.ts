import { patosRouter } from "~/server/api/routers/patos";
import { createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "./routers/auth";
import { itemRouter } from "./routers/item";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  patos: patosRouter,
  auth: authRouter,
  item: itemRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

import { clerkClient, withClerkMiddleware } from "@clerk/nextjs/server";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { filterUserForClient } from "~/server/helpers/filterUserForClients";

export const profileRouter = createTRPCRouter({
  getUserByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {

        const [user] = await clerkClient.users.getUserList({
            username: [input.username],
        })
        if (!user){
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "User not found",
            })
        }
        return filterUserForClient(user);
    }),
});

import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

const userParseSchema = z.object({
    id: z.string(),
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    username: z.string().nullable(),
    imageUrl: z.string(),
    gender: z.string(),
    createdAt: z.number(),
    updatedAt: z.number(),
});

export const userRouter = createTRPCRouter({
    getUser: publicProcedure
        .input(z.object({ userId: z.string() }))
        .query(async ({ input }) => {
            const { userId } = input;

            const user = await clerkClient.users.getUser(userId);
            if (!user) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User not found",
                });
            }

            const parsedUser = userParseSchema.parse(user);

            return {
                user: parsedUser,
            };
        }),
});

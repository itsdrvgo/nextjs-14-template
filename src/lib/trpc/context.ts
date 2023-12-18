import {
    auth as clerkAuth,
    SignedInAuthObject,
    SignedOutAuthObject,
} from "@clerk/nextjs/server";
import { inferAsyncReturnType } from "@trpc/server";
import { db } from "../drizzle";

type CreateContextOptions = {
    auth: SignedInAuthObject | SignedOutAuthObject | null;
};

export const createContextInner = async ({ auth }: CreateContextOptions) => {
    return {
        auth,
        db,
    };
};

export const createContext = async () => {
    const auth = clerkAuth();

    return await createContextInner({
        auth,
    });
};

export type Context = inferAsyncReturnType<typeof createContextInner>;

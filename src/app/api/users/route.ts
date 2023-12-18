import { env } from "@/env.mjs";
import { db } from "@/src/lib/drizzle";
import { users } from "@/src/lib/drizzle/schema";
import {
    addUsernameToCache,
    addUserToCache,
    deleteUserFromCache,
    deleteUsernameFromCache,
    getUserFromCache,
    updateUserInCache,
    updateUsernameInCache,
} from "@/src/lib/redis/methods/user";
import { CResponse, handleError } from "@/src/lib/utils";
import {
    userCreateWebhookSchema,
    userDeleteWebhookSchema,
    userUpdateWebhookSchema,
    WebhookData,
    webhookSchema,
} from "@/src/lib/validation/webhook";
import { SvixHeaders } from "@/src/types";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { Webhook } from "svix";

export async function POST(req: NextRequest) {
    const payload = await req.json();

    const headers: SvixHeaders = {
        "svix-id": req.headers.get("svix-id")!,
        "svix-timestamp": req.headers.get("svix-timestamp")!,
        "svix-signature": req.headers.get("svix-signature")!,
    };

    const wh = new Webhook(env.SVIX_SECRET);
    let body: WebhookData;

    try {
        body = wh.verify(JSON.stringify(payload), headers) as WebhookData;
    } catch (err) {
        return CResponse({
            message: "BAD_REQUEST",
            longMessage: "Invalid webhook signature",
        });
    }

    const { type, data } = webhookSchema.parse(body);

    switch (type) {
        case "user.created": {
            try {
                const {
                    id,
                    email_addresses,
                    first_name: firstName,
                    last_name: lastName,
                    image_url: image,
                    username,
                    primary_email_address_id,
                } = userCreateWebhookSchema.parse(data);

                const email =
                    email_addresses.find(
                        (email) => email.id === primary_email_address_id
                    )?.email_address ?? email_addresses[0].email_address;

                await Promise.all([
                    db.insert(users).values({
                        firstName,
                        lastName,
                        username,
                        id,
                        image,
                        email,
                    }),
                    addUserToCache({
                        id,
                        username,
                        firstName,
                        lastName,
                        image,
                        email,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    }),
                    addUsernameToCache(username),
                ]);

                return CResponse({
                    message: "CREATED",
                    longMessage: "User created successfully",
                });
            } catch (err) {
                return handleError(err);
            }
        }

        case "user.updated": {
            try {
                const {
                    id,
                    email_addresses,
                    image_url: image,
                    first_name: firstName,
                    last_name: lastName,
                    primary_email_address_id,
                    username,
                } = userUpdateWebhookSchema.parse(data);

                const existingUser = await db.query.users.findFirst({
                    where: eq(users.id, id),
                    with: {
                        details: true,
                    },
                });
                if (!existingUser)
                    return CResponse({
                        message: "NOT_FOUND",
                        longMessage: "User not found",
                    });

                const email =
                    email_addresses.find(
                        (email) => email.id === primary_email_address_id
                    )?.email_address ?? email_addresses[0].email_address;

                await Promise.all([
                    db
                        .update(users)
                        .set({
                            firstName,
                            lastName,
                            username,
                            image,
                            email,
                            updatedAt: new Date(),
                        })
                        .where(eq(users.id, existingUser.id)),
                    updateUserInCache({
                        id,
                        username,
                        firstName,
                        lastName,
                        image,
                        email,
                        createdAt: existingUser.createdAt.toISOString(),
                        updatedAt: new Date().toISOString(),
                    }),
                    manageUsernameChange(username, existingUser.username),
                ]);

                return CResponse({
                    message: "OK",
                    longMessage: "User updated successfully",
                });
            } catch (err) {
                return handleError(err);
            }
        }

        case "user.deleted": {
            try {
                const { id } = userDeleteWebhookSchema.parse(data);

                const existingUser = await getUserFromCache(id);
                if (!existingUser)
                    return CResponse({
                        message: "NOT_FOUND",
                        longMessage: "User not found",
                    });

                await Promise.all([
                    db.delete(users).where(eq(users.id, id)),
                    deleteUserFromCache(id),
                    deleteUsernameFromCache(existingUser.username),
                ]);

                return CResponse({
                    message: "OK",
                    longMessage: "User deleted successfully",
                    data: id,
                });
            } catch (err) {
                return handleError(err);
            }
        }

        default: {
            return CResponse({
                message: "BAD_REQUEST",
                longMessage: "Invalid webhook type",
            });
        }
    }
}

async function manageUsernameChange(username: string, prevUsername: string) {
    await updateUsernameInCache(prevUsername, username);
}

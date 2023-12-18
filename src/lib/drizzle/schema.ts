import { DEFAULT_PROFILE_IMAGE_URL } from "@/src/config/const";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

// SCHEMAS

export const users = pgTable(
    "users",
    {
        id: text("id").notNull().unique().primaryKey(),
        firstName: text("first_name").notNull(),
        lastName: text("last_name").notNull(),
        username: text("username").notNull().unique(),
        email: text("email").notNull().unique(),
        image: text("image").notNull().default(DEFAULT_PROFILE_IMAGE_URL),
        createdAt: timestamp("created_at", { withTimezone: true })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp("updated_at", { withTimezone: true })
            .notNull()
            .defaultNow(),
    },
    (table) => {
        return {
            emailIdx: uniqueIndex("email_idx").on(table.email),
            usernameIdx: uniqueIndex("username_idx").on(table.username),
        };
    }
);

// TYPES

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

// ZOD SCHEMA

export const insertUserSchema = createInsertSchema(users);

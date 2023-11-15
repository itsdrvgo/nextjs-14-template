import {
    InferInsertModel,
    InferSelectModel,
    relations,
    sql,
} from "drizzle-orm";
import {
    int,
    json,
    mysqlTable,
    timestamp,
    uniqueIndex,
    varchar,
} from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";

// SCHEMAS

export const users = mysqlTable(
    "users",
    {
        id: varchar("id", { length: 191 }).notNull().primaryKey(),
        username: varchar("username", { length: 191 }).unique().notNull(),
        email: varchar("email", { length: 191 }).notNull().unique(),
        image: varchar("image", { length: 191 }),
        createdAt: timestamp("created_at")
            .notNull()
            .default(sql`current_timestamp()`),
        updatedAt: timestamp("updated_at")
            .notNull()
            .default(sql`current_timestamp()`)
            .onUpdateNow(),
    },
    (user) => ({
        emailIndex: uniqueIndex("email_idx").on(user.email),
        usernameIndex: uniqueIndex("name_idx").on(user.username),
    })
);

export const accounts = mysqlTable("accounts", {
    id: varchar("id", { length: 191 }).notNull().primaryKey(),
    roles: json("roles").$type<string[]>().notNull().default(["user"]),
    strikes: int("strikes").notNull().default(0),
    permissions: int("permissions").notNull().default(1),
});

export const roles = mysqlTable(
    "roles",
    {
        id: varchar("id", { length: 191 }).notNull().primaryKey(),
        name: varchar("name", { length: 191 }).notNull().unique(),
        key: varchar("key", { length: 191 }).notNull().unique(),
        position: int("position").notNull().default(0),
        permissions: int("permissions").notNull().default(1),
        createdAt: timestamp("created_at")
            .default(sql`current_timestamp()`)
            .notNull(),
        updatedAt: timestamp("updated_at")
            .default(sql`current_timestamp()`)
            .notNull()
            .onUpdateNow(),
    },
    (role) => ({
        nameIndex: uniqueIndex("name_idx").on(role.name),
    })
);

// RELATIONS

export const usersRelations = relations(users, ({ one }) => ({
    account: one(accounts, {
        fields: [users.id],
        references: [accounts.id],
    }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
    user: one(users, {
        fields: [accounts.id],
        references: [users.id],
    }),
}));

// TYPES

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type Account = InferSelectModel<typeof accounts>;
export type NewAccount = InferInsertModel<typeof accounts>;

export type Role = InferSelectModel<typeof roles>;
export type NewRole = InferInsertModel<typeof roles>;

// ZOD SCHEMA

export const insertUserSchema = createInsertSchema(users);

export const insertAccountSchema = createInsertSchema(accounts);

export const insertRoleSchema = createInsertSchema(roles);

import { clsx, type ClassValue } from "clsx";
import { DrizzleError } from "drizzle-orm";
import { NextResponse } from "next/server";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";
import { BitFieldPermissions } from "../config/const";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

export function hasPermission(
    userPermissions: number,
    requiredPermissions: number
) {
    if (userPermissions & BitFieldPermissions.Administrator) return true;
    return (userPermissions & requiredPermissions) === requiredPermissions;
}

export function handleError(err: unknown) {
    console.error(err);
    if (err instanceof ZodError)
        return NextResponse.json({
            code: 422,
            message: err.issues.map((x) => x.message).join(", "),
        });
    else if (err instanceof DrizzleError)
        return NextResponse.json({
            code: 500,
            message: err.message,
        });
    else
        return NextResponse.json({
            code: 500,
            message: "Internal Server Error!",
        });
}

export function getTheme() {
    if (typeof window === "undefined" || typeof localStorage === "undefined")
        return "light";
    return (localStorage.getItem("theme") as "dark" | "light") ?? "light";
}

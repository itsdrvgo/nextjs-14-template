"use client";

import useThemeStore from "@/src/lib/store/theme";
import { trpc } from "@/src/lib/trpc/client";
import { cn, getTheme } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { httpBatchLink, loggerLink } from "@trpc/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import superjson from "superjson";

const getBaseUrl = () => {
    if (typeof window !== "undefined") return "";
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return `http://localhost:${process.env.PORT ?? 3000}`;
};

function ClientProvider({ children, className, ...props }: DefaultProps) {
    const router = useRouter();
    const [queryClient] = useState(() => new QueryClient());

    const localTheme = getTheme();
    const storeTheme = useThemeStore((state) => state.theme);
    const setStoreTheme = useThemeStore((state) => state.setTheme);

    const [trpcClient] = useState(() =>
        trpc.createClient({
            transformer: superjson,
            links: [
                httpBatchLink({
                    url: `${getBaseUrl()}/api/trpc`,
                }),
                loggerLink({
                    enabled: (opts) =>
                        process.env.NODE_ENV === "development" ||
                        (opts.direction === "down" &&
                            opts.result instanceof Error),
                }),
            ],
        })
    );

    useEffect(() => {
        setStoreTheme(localTheme);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <NextUIProvider navigate={router.push}>
            <trpc.Provider client={trpcClient} queryClient={queryClient}>
                <QueryClientProvider client={queryClient}>
                    <body className={cn(storeTheme, className)} {...props}>
                        {children}
                    </body>
                    <ReactQueryDevtools />
                </QueryClientProvider>
            </trpc.Provider>
        </NextUIProvider>
    );
}

export default ClientProvider;

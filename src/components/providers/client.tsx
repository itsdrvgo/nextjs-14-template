"use client";

import useThemeStore from "@/src/lib/store/theme";
import { cn, getTheme } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function ClientProvider({ children, className, ...props }: DefaultProps) {
    const router = useRouter();
    const [queryClient] = useState(() => new QueryClient());

    const localTheme = getTheme();
    const storeTheme = useThemeStore((state) => state.theme);
    const setStoreTheme = useThemeStore((state) => state.setTheme);

    useEffect(() => {
        setStoreTheme(localTheme);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <NextUIProvider navigate={router.push}>
            <QueryClientProvider client={queryClient}>
                <body className={cn(storeTheme, className)} {...props}>
                    {children}
                </body>
                <ReactQueryDevtools initialIsOpen={true} />
            </QueryClientProvider>
        </NextUIProvider>
    );
}

export default ClientProvider;

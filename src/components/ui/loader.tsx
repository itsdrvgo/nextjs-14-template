"use client";

import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { Spinner } from "@nextui-org/react";

function Loader({ className, ...props }: DefaultProps) {
    return (
        <div
            className={cn("flex w-full justify-center p-5", className)}
            {...props}
        >
            <Spinner />
        </div>
    );
}

export default Loader;

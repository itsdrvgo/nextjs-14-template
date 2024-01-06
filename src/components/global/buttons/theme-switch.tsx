"use client";

import { cn } from "@/src/lib/utils";
import { SwitchProps, useSwitch, VisuallyHidden } from "@nextui-org/react";
import { useEffect } from "react";
import { Icons } from "../../icons/icons";
import { useTheme } from "../../providers/theme";

function ThemeSwitch({ className, ...props }: SwitchProps) {
    const {
        Component,
        slots,
        isPressed,
        getBaseProps,
        getInputProps,
        getWrapperProps,
    } = useSwitch(props);

    const [theme, setTheme] = useTheme();

    useEffect(() => {
        if (isPressed) {
            setTheme(theme === "dark" ? "light" : "dark");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPressed]);

    return (
        <div className={cn("flex flex-col gap-2", className)}>
            <Component {...getBaseProps()} {...props}>
                <VisuallyHidden>
                    <input {...getInputProps()} />
                </VisuallyHidden>

                <div
                    {...getWrapperProps()}
                    className={slots.wrapper({
                        class: [
                            "mr-0 h-7 w-7",
                            "flex items-center justify-center",
                            "bg-transparent text-foreground group-data-[selected=true]:bg-transparent",
                        ],
                    })}
                >
                    {theme === "dark" ? <Icons.sun /> : <Icons.moon />}
                </div>
            </Component>
        </div>
    );
}

export default ThemeSwitch;

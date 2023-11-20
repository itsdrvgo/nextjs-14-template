import { cn } from "@/src/lib/utils";
import { DetailedHTMLProps, HTMLAttributes } from "react";
import Vercel from "../svgs/Vercel";

function Footer({
    className,
    ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>) {
    return (
        <footer
            className={cn(
                "w-full border-t bg-gray-900 py-5 light:border-gray-300 dark:border-gray-800 dark:bg-background",
                className
            )}
            {...props}
        >
            <div className="container flex max-w-4xl flex-col-reverse items-center justify-between gap-3 text-sm font-light md:flex-row 2xl:max-w-6xl">
                <p className="text-gray-500">
                    © 2021 PeerAmp. All rights reserved.
                </p>

                <div className="flex items-center gap-2 text-white">
                    <p>Powered by</p>
                    <Vercel width={70.75} height={16} />
                </div>
            </div>
        </footer>
    );
}

export default Footer;

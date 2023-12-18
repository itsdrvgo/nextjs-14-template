import { RootLayoutProps } from "@/src/types";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Home",
};

function Layout({ children }: RootLayoutProps) {
    return (
        <div className="flex h-screen flex-col justify-between overflow-x-hidden">
            <main>{children}</main>
        </div>
    );
}

export default Layout;

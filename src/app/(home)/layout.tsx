import { RootLayoutProps } from "@/src/types";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Home",
};

function Layout({ children }: RootLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col overflow-x-hidden">
            <main className="relative flex-1">{children}</main>
        </div>
    );
}

export default Layout;

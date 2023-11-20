import Footer from "@/src/components/global/footer/footer";
import NavBar from "@/src/components/global/navbar/navbar";
import { RootLayoutProps } from "@/src/types";

function Layout({ children }: RootLayoutProps) {
    return (
        <div className="flex h-screen flex-col justify-between overflow-x-hidden">
            <NavBar />
            <main>{children}</main>
            <Footer />
        </div>
    );
}

export default Layout;

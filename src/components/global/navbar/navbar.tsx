"use client";

import { menuConfig } from "@/src/config/menu";
import { siteConfig } from "@/src/config/site";
import {
    Link,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle,
    NavbarProps,
} from "@nextui-org/react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LoginButton from "../buttons/login-button";
import ThemeSwitch from "../buttons/theme-button";
import PeerAmp from "../svgs/PeerAmp";

function NavBar({ ...props }: NavbarProps) {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <Navbar
            onMenuOpenChange={setIsMenuOpen}
            shouldHideOnScroll
            classNames={{
                wrapper: "max-w-4xl 2xl:max-w-6xl",
                base: "bg-gray-200 py-2 dark:bg-background",
                menu: "bg-gray-200 pt-4 dark:bg-background",
            }}
            {...props}
        >
            <NavbarContent justify="start">
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden"
                />
                <NavbarBrand>
                    <button
                        className="flex cursor-pointer items-center gap-2"
                        onClick={() => router.push("/")}
                    >
                        <PeerAmp />
                        <p className="text-accent text-xl font-bold">
                            {siteConfig.name}
                        </p>
                    </button>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent justify="end" className="gap-2 md:gap-7">
                <div className="hidden items-center gap-4 sm:flex">
                    {menuConfig.map((item, index) => (
                        <NavbarItem key={index}>
                            <Link
                                href={item.href}
                                as={NextLink}
                                className="font-medium text-foreground"
                            >
                                {item.title}
                            </Link>
                        </NavbarItem>
                    ))}
                </div>

                <ThemeSwitch />
                <LoginButton className="h-8" />
            </NavbarContent>

            <NavbarMenu>
                {menuConfig.map((item, index) => (
                    <NavbarMenuItem
                        key={index}
                        onClick={() => router.push(item.href)}
                    >
                        <Link
                            href={item.href}
                            size="lg"
                            className="text-foreground"
                        >
                            {item.title}
                        </Link>
                    </NavbarMenuItem>
                ))}
            </NavbarMenu>
        </Navbar>
    );
}

export default NavBar;

import { IncomingHttpHeaders } from "http";
import { HTMLAttributes, ReactNode } from "react";
import { WebhookRequiredHeaders } from "svix";
import { Icons } from "../components/icons/icons";

export type SiteConfig = {
    name: string;
    description: string;
    topLevelDomain: string;
    url: string;
    ogImage: string;
    keywords: string[];
    links: {
        youtube: string;
        instagram: string;
        twitter: string;
        github: string;
        discord: string;
    };
};

export type SvixHeaders = IncomingHttpHeaders & WebhookRequiredHeaders;
export type DefaultProps = HTMLAttributes<HTMLElement>;
export interface RootLayoutProps {
    children: ReactNode;
}

declare global {
    interface UserPrivateMetadata {
        roles: string[];
        permissions: number;
        strikes: number;
    }
}

export type CachedUser = {
    id: string;
    username: string;
    image: string | null;
    email: string;
    permissions: number;
    roles: string[];
    strikes: number;
    createdAt: string;
    updatedAt: string;
};

export type CachedRole = {
    id: string;
    name: string;
    key: string;
    position: number;
    permissions: number;
    createdAt: string;
    updatedAt: string;
};

export type NavItem = {
    title: string;
    description?: string;
    href: string;
    disabled?: boolean;
    icon?: keyof typeof Icons;
};

export type MenuConfig = NavItem[];

import { IncomingHttpHeaders } from "http";
import { ReactNode } from "react";
import { WebhookRequiredHeaders } from "svix";

export type SiteConfig = {
    name: string;
    description: string;
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

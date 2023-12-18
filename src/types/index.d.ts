import { IncomingHttpHeaders } from "http";
import { HTMLAttributes, ReactNode } from "react";
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

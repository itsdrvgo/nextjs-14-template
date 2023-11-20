"use client";

import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { Avatar } from "@nextui-org/react";
import { DetailedHTMLProps, HTMLAttributes } from "react";
import LoginButton from "../global/buttons/login-button";

interface Review {
    reviewerName: string;
    reviewText: string;
    reviewerImage: string;
}

const reviews: Review[] = [
    {
        reviewerName: "Jake Paul",
        reviewText: "I love this website! It's so cool!",
        reviewerImage: "https://xsgames.co/randomusers/avatar.php?g=male",
    },
    {
        reviewerName: "Ivan Ivanov",
        reviewText: "I'm so glad I found this website!",
        reviewerImage: "https://xsgames.co/randomusers/avatar.php?g=male",
    },
    {
        reviewerName: "Hannah Montana",
        reviewText: "This website is so cool!",
        reviewerImage: "https://xsgames.co/randomusers/avatar.php?g=female",
    },
    {
        reviewerName: "PewDiePie",
        reviewText: "If you don't use this website, you're missing out!",
        reviewerImage: "https://xsgames.co/randomusers/avatar.php?g=male",
    },
    {
        reviewerName: "John Doe",
        reviewText: "This website is a game changer!",
        reviewerImage: "https://xsgames.co/randomusers/avatar.php?g=male",
    },
    {
        reviewerName: "Jane Smith",
        reviewText: "I've never seen anything like this before!",
        reviewerImage: "https://xsgames.co/randomusers/avatar.php?g=female",
    },
    {
        reviewerName: "Bob Johnson",
        reviewText: "I'm recommending this to all my friends!",
        reviewerImage: "https://xsgames.co/randomusers/avatar.php?g=male",
    },
    {
        reviewerName: "Alice Williams",
        reviewText: "I can't believe how much this website has helped me!",
        reviewerImage: "https://xsgames.co/randomusers/avatar.php?g=female",
    },
    {
        reviewerName: "Charlie Brown",
        reviewText: "This is the best website I've ever used!",
        reviewerImage: "https://xsgames.co/randomusers/avatar.php?g=male",
    },
    {
        reviewerName: "Emily Davis",
        reviewText: "I wish I had found this website sooner!",
        reviewerImage: "https://xsgames.co/randomusers/avatar.php?g=female",
    },
];

function Hero({ className, ...props }: DefaultProps) {
    return (
        <section
            className={cn(
                "flex w-full flex-col items-center gap-20",
                className
            )}
            {...props}
        >
            <div className="absolute left-1/3 top-0 z-50 dark:shadow-dark-glow" />

            <div className="container flex h-full flex-col items-center justify-center gap-10">
                <div className="z-10 space-y-3 text-center">
                    <p className="bg-gradient-to-r from-red-600 via-blue-500 to-lime-500 bg-clip-text text-5xl font-bold text-transparent md:text-7xl">
                        <span>Collaborate. </span>
                        <span>Grow. </span>
                        <span>Thrive. </span>
                    </p>

                    <p className="text-base font-light dark:text-gray-400 md:text-lg">
                        Where Collaboration Transforms into Amplified Success.
                    </p>
                </div>

                <LoginButton
                    text="Join Now!"
                    size="lg"
                    className="bg-secondary text-base dark:text-white"
                    color="secondary"
                />
            </div>

            <div className="pointer-events-none relative w-full overflow-hidden whitespace-nowrap">
                <div className="flex w-full items-center overflow-hidden whitespace-nowrap before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-20 before:bg-gradient-to-r before:from-background before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-20 after:bg-gradient-to-l after:from-background after:to-transparent md:before:w-36 md:after:w-36">
                    <InfiniteSlider className="infinite-slide-left" />
                    <InfiniteSlider className="infinite-slide-left" />
                </div>

                <div className="flex w-full items-center overflow-hidden whitespace-nowrap">
                    <InfiniteSlider className="infinite-slide-right" />
                    <InfiniteSlider className="infinite-slide-right" />
                </div>
            </div>
        </section>
    );
}

export default Hero;

function InfiniteSlider({
    className,
    ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>) {
    return (
        <ul
            className={cn("inline-block whitespace-nowrap py-4", className)}
            {...props}
        >
            {reviews.map((review, index) => (
                <li
                    key={index}
                    className="mx-2 inline-block w-72 rounded-lg bg-default-50 px-3 py-2 shadow-lg dark:shadow-gray-800"
                >
                    <div className="flex items-center gap-4">
                        <div>
                            <Avatar
                                src={review.reviewerImage}
                                alt={review.reviewerName}
                                radius="full"
                                size="sm"
                            />
                        </div>

                        <div>
                            <p className="text-sm font-bold text-gray-700 dark:text-gray-300 md:text-base">
                                {review.reviewerName}
                            </p>
                            <p className="text-xs font-light dark:text-gray-400 md:text-sm">
                                {review.reviewText.length > 30
                                    ? review.reviewText.slice(0, 30) + "..."
                                    : review.reviewText}
                            </p>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
}

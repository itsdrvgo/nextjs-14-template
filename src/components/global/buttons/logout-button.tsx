"use client";

import { cn } from "@/src/lib/utils";
import { useClerk } from "@clerk/nextjs";
import { Button, ButtonProps } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Icons } from "../../icons/icons";

function LogoutButton({ className, ...props }: ButtonProps) {
    const router = useRouter();
    const { signOut } = useClerk();

    const handleLogout = () => {
        const toastId = toast.loading("Logging out...");

        signOut()
            .then(() => {
                toast.success("See you soon!", {
                    id: toastId,
                });
                router.push("/");
            })
            .catch((err) => {
                console.error(err);
                toast.error("An error occurred while logging out!", {
                    id: toastId,
                });
            });
    };

    return (
        <Button
            className={cn("text-sm font-semibold", className)}
            variant="light"
            isIconOnly
            onPress={handleLogout}
            startContent={<Icons.logout className="h-5 w-5" />}
            {...props}
        />
    );
}

export default LogoutButton;

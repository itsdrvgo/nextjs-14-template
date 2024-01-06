"use client";

import { DEFAULT_ERROR_MESSAGE } from "@/src/config/const";
import { handleClientError } from "@/src/lib/utils";
import { EmailData, emailSchema } from "@/src/lib/validation/auth";
import { isClerkAPIResponseError, useSignIn } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";

function ResetPasswordS1Form() {
    const router = useRouter();

    const { signIn, isLoaded } = useSignIn();

    const form = useForm<EmailData>({
        resolver: zodResolver(emailSchema),
        defaultValues: {
            email: "",
        },
    });

    const { mutate: onSubmit, isLoading } = useMutation({
        onMutate: () => {
            const toastId = toast.loading("Validating, please wait...");
            return { toastId };
        },
        mutationFn: async (data: EmailData) => {
            if (!isLoaded)
                throw new Error("Authentication service is not loaded!");

            const res = await signIn.create({
                strategy: "reset_password_email_code",
                identifier: data.email,
            });

            return res;
        },
        onSuccess: (data, _, ctx) => {
            switch (data.status) {
                case "needs_first_factor":
                    {
                        toast.success(
                            "Verification code sent to your email, " +
                                data.userData.firstName +
                                "!",
                            {
                                id: ctx?.toastId,
                            }
                        );
                        router.push("/signin/reset-password/step2");
                    }
                    break;

                default:
                    console.log(JSON.stringify(data, null, 2));
                    break;
            }
        },
        onError: (err, _, ctx) => {
            isClerkAPIResponseError(err)
                ? toast.error(
                      err.errors[0]?.longMessage ?? DEFAULT_ERROR_MESSAGE,
                      {
                          id: ctx?.toastId,
                      }
                  )
                : handleClientError(err, ctx?.toastId);
        },
    });

    return (
        <Form {...form}>
            <form
                className="grid gap-4"
                onSubmit={(...args) =>
                    form.handleSubmit((data) => onSubmit(data))(...args)
                }
            >
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    inputMode="email"
                                    size="sm"
                                    radius="sm"
                                    placeholder="ryomensukuna@jjk.jp"
                                    isDisabled={isLoading}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    className="bg-default-700 font-semibold text-white dark:bg-primary-900 dark:text-black"
                    type="submit"
                    radius="sm"
                    isDisabled={isLoading}
                    isLoading={isLoading}
                >
                    {isLoading ? "Validating..." : "Send Code"}
                </Button>
            </form>
        </Form>
    );
}

export default ResetPasswordS1Form;

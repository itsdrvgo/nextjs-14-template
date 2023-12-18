"use client";

import { DEFAULT_ERROR_MESSAGE } from "@/src/config/const";
import { handleClientError } from "@/src/lib/utils";
import {
    ResetPasswordData,
    resetPasswordSchema,
} from "@/src/lib/validation/auth";
import { isClerkAPIResponseError, useSignIn } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Icons } from "../icons/icons";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";

function ResetPasswordS2Form() {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [value, setValue] = useState("");
    const { signIn, isLoaded, setActive } = useSignIn();

    const form = useForm<ResetPasswordData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
            verificationCode: "",
        },
    });

    const onSubmit = async (data: ResetPasswordData) => {
        if (!isLoaded)
            return toast.error("Authentication service is not loaded!");

        setIsLoading(true);
        const toastId = toast.loading("Validating, please wait...");

        try {
            const res = await signIn.attemptFirstFactor({
                strategy: "reset_password_email_code",
                code: data.verificationCode,
                password: data.password,
            });

            switch (res.status) {
                case "complete":
                    {
                        toast.success(
                            "Your password has been reset, " +
                                res.userData.firstName +
                                "!",
                            {
                                id: toastId,
                            }
                        );
                        await setActive({
                            session: res.createdSessionId,
                        });
                        router.push("/profile");
                    }
                    break;

                default:
                    console.log(JSON.stringify(res, null, 2));
                    break;
            }
        } catch (err) {
            isClerkAPIResponseError(err)
                ? toast.error(
                      err.errors[0]?.longMessage ?? DEFAULT_ERROR_MESSAGE,
                      {
                          id: toastId,
                      }
                  )
                : handleClientError(err, toastId);

            return;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form
                className="grid gap-4"
                onSubmit={(...args) => form.handleSubmit(onSubmit)(...args)}
            >
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                                <Input
                                    size="sm"
                                    radius="sm"
                                    placeholder="********"
                                    type={isVisible ? "text" : "password"}
                                    isDisabled={isLoading}
                                    endContent={
                                        <button
                                            type="button"
                                            className="focus:outline-none"
                                            onClick={() =>
                                                setIsVisible(!isVisible)
                                            }
                                        >
                                            {isVisible ? (
                                                <Icons.hide className="h-5 w-5 opacity-80" />
                                            ) : (
                                                <Icons.view className="h-5 w-5 opacity-80" />
                                            )}
                                        </button>
                                    }
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                                <Input
                                    size="sm"
                                    radius="sm"
                                    placeholder="********"
                                    type="password"
                                    isDisabled={isLoading}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="verificationCode"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Code</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    inputMode="numeric"
                                    size="sm"
                                    radius="sm"
                                    placeholder="132748"
                                    isDisabled={isLoading}
                                    {...field}
                                    value={value}
                                    onValueChange={(val) => {
                                        if (val.match(/^[0-9]*$/))
                                            setValue(val);
                                    }}
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
                    {isLoading ? "Validating..." : "Reset Password"}
                </Button>
            </form>
        </Form>
    );
}

export default ResetPasswordS2Form;

"use client";

import { DEFAULT_ERROR_MESSAGE } from "@/src/config/const";
import { handleClientError } from "@/src/lib/utils";
import { SignUpData, signupSchema } from "@/src/lib/validation/auth";
import { isClerkAPIResponseError, useSignUp } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Checkbox, Input, Link } from "@nextui-org/react";
import NextLink from "next/link";
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

function SignUpForm() {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    const { signUp, isLoaded } = useSignUp();

    const form = useForm<SignUpData>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            email: "",
            username: "",
            firstName: "",
            lastName: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: SignUpData) => {
        if (!isLoaded)
            return toast.error("Authentication service is not loaded!");
        if (!isChecked) return toast.error("Please agree to the TOS!");

        setIsLoading(true);

        const toastId = toast.loading("Signing up, please wait...");

        try {
            await signUp.create({
                emailAddress: data.email,
                username: data.username,
                firstName: data.firstName,
                lastName: data.lastName,
                password: data.password,
            });

            await signUp.prepareEmailAddressVerification({
                strategy: "email_code",
            });

            toast.success("Please check your email for a verification code!", {
                id: toastId,
            });

            router.push("/signup/verify");
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
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    size="sm"
                                    radius="sm"
                                    placeholder="ryomensukuna"
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

                <div className="flex justify-between gap-2">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        size="sm"
                                        radius="sm"
                                        placeholder="Ryomen"
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
                        name="lastName"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        size="sm"
                                        radius="sm"
                                        placeholder="Sukuna"
                                        isDisabled={isLoading}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
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
                            <FormLabel>Confirm Password</FormLabel>
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

                <div className="space-y-2">
                    <p>
                        <span className="text-sm opacity-80">
                            By signing up, you agree to the processing of your
                            personal data as described in our{" "}
                        </span>
                        <Link
                            as={NextLink}
                            href="/legal/privacy"
                            className="text-sm font-semibold"
                        >
                            Privacy Policy.
                        </Link>
                    </p>

                    <Checkbox
                        color="secondary"
                        isSelected={isChecked}
                        onValueChange={setIsChecked}
                    >
                        <span>
                            I&apos;ve read and agree to the{" "}
                            <Link
                                as={NextLink}
                                href="/legal/terms"
                                className="font-semibold"
                            >
                                Terms of Service
                            </Link>
                            .
                        </span>
                    </Checkbox>
                </div>

                <Button
                    className="bg-default-700 font-semibold text-white dark:bg-primary-900 dark:text-black"
                    type="submit"
                    radius="sm"
                    isDisabled={isLoading}
                    isLoading={isLoading}
                >
                    {isLoading ? <>Signing Up</> : <>Sign Up</>}
                </Button>
            </form>
        </Form>
    );
}

export default SignUpForm;

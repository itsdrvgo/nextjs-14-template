"use client";

import { DEFAULT_ERROR_MESSAGE } from "@/src/config/const";
import { handleClientError } from "@/src/lib/utils";
import { SignUpData, signupSchema } from "@/src/lib/validation/auth";
import { isClerkAPIResponseError, useSignUp } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Checkbox, Input, Link } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import PasswordInput from "../ui/password-input";

function SignUpForm() {
    const router = useRouter();

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

    const { mutate: onSubmit, isLoading } = useMutation({
        onMutate: () => {
            const toastId = toast.loading("Signing up, please wait...");
            return { toastId };
        },
        mutationFn: async (data: SignUpData) => {
            if (!isLoaded)
                throw new Error("Authentication service is not loaded!");
            if (!isChecked) throw new Error("Please agree to the TOS!");

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
        },
        onSuccess: (_, __, ctx) => {
            toast.success("Please check your email for a verification code!", {
                id: ctx?.toastId,
            });

            router.push("/signup/verify");
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
                                <PasswordInput
                                    size="sm"
                                    radius="sm"
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
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <PasswordInput
                                    size="sm"
                                    radius="sm"
                                    isDisabled={isLoading}
                                    isToggleable={false}
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
                    {isLoading ? "Signing Up" : "Sign Up"}
                </Button>
            </form>
        </Form>
    );
}

export default SignUpForm;

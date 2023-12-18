"use client";

import { DEFAULT_ERROR_MESSAGE } from "@/src/config/const";
import { handleClientError, wait } from "@/src/lib/utils";
import {
    VerificationCodeData,
    verificationCodeSchema,
} from "@/src/lib/validation/auth";
import { isClerkAPIResponseError, useSignUp } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
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

function VerifyForm() {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const { signUp, isLoaded, setActive } = useSignUp();
    const [value, setValue] = useState("");

    const form = useForm<VerificationCodeData>({
        resolver: zodResolver(verificationCodeSchema),
        defaultValues: {
            verificationCode: "",
        },
    });

    const onSubmit = async (data: VerificationCodeData) => {
        if (!isLoaded)
            return toast.error("Authentication service is not loaded!");

        setIsLoading(true);
        const toastId = toast.loading("Verifying, please wait...");

        try {
            const res = await signUp.attemptEmailAddressVerification({
                code: data.verificationCode,
            });

            switch (res.status) {
                case "complete":
                    {
                        toast.success(
                            "Welcome to Vercel, " + res.firstName + "!",
                            {
                                id: toastId,
                            }
                        );
                        await setActive({
                            session: res.createdSessionId,
                        });
                        await wait(1000);
                        router.push("/profile/edit?new=true");
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
                    {isLoading ? <>Verifying</> : <>Submit</>}
                </Button>
            </form>
        </Form>
    );
}

export default VerifyForm;

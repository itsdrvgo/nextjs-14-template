"use client";

import { Input, InputProps } from "@nextui-org/react";
import { useState } from "react";
import { Icons } from "../icons/icons";

export interface PasswordInputProps extends InputProps {
    isToggleable?: boolean;
}

function PasswordInput({ isToggleable = true, ...props }: PasswordInputProps) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <Input
            placeholder="********"
            type={isVisible ? "text" : "password"}
            endContent={
                isToggleable && (
                    <button
                        type="button"
                        className="focus:outline-none"
                        onClick={() => setIsVisible(!isVisible)}
                    >
                        {isVisible ? (
                            <Icons.hide className="h-5 w-5 opacity-80" />
                        ) : (
                            <Icons.view className="h-5 w-5 opacity-80" />
                        )}
                    </button>
                )
            }
            {...props}
        />
    );
}

export default PasswordInput;

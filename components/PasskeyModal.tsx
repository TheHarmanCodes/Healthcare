"use client";
import React, {useEffect, useState} from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp";

import {Button} from "@/components/ui/button";
import Image from "next/image";
import {usePathname, useRouter} from "next/navigation";
import {decodeKey, encodeKey} from "@/lib/utils";

const PasskeyModal = () => {
    const router = useRouter();
    const path = usePathname();
    const [open, setOpen] = useState(true);
    const [passkey, setPasskey] = useState("");
    const [error, setError] = useState("");

    const closeModal = () => {
        setOpen(false);
        router.push("/");
    };

    const encryptedKey = typeof window !== 'undefined' ? window.localStorage.getItem("accessKey") : null;

    useEffect(() => {
        // if we're on the path where the passkey need to be entered then we can try to log in
        const accessKey = encryptedKey && decodeKey(encryptedKey);

        if (path) {
            if (accessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
                setOpen(false);
                router.push("/admin");
            } else {
                setOpen(true);
            }
        }
    }, [encryptedKey]);

    const validatePasskey = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
        e.preventDefault(); // to prevent the default browser even i.e reload
        if (passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
            const encryptedKey = encodeKey(passkey);

            localStorage.setItem("accessKey", encryptedKey);
            setOpen(false);
        } else {
            setError("Invalid passkey. Please try again.");
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent
                className="w-[95vw] max-w-sm sm:max-w-md lg:min-w-lg lg:max-w-none 2xl:min-w-xl space-y-5 bg-dark-400 border-0 p-5 sm:p-6 lg:p-8 shadow-none  outline-none ring-0
  "
            >
                <AlertDialogHeader>
                    <button
                        type="button"
                        onClick={closeModal}
                        aria-label="Close"
                        className="absolute right-3 top-3 rounded-sm p-2 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus-visible:ring-offset-2 sm:right-5 sm:top-5"
                    >
                        <Image
                            src="/assets/icons/close.svg"
                            alt=""
                            width={20}
                            height={20}
                            className="h-4 w-4 sm:h-5 sm:w-5 cursor-pointer"
                        />
                    </button>
                    <div className="flex items-start justify-between">
                        <AlertDialogTitle className="text-base sm:text-lg xl:text-2xl">
                            Admin Access Verification
                        </AlertDialogTitle>
                    </div>

                    <AlertDialogDescription className="text-xs sm:text-sm">
                        To access the admin page, please enter the passkey.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div>
                    <InputOTP
                        maxLength={6}
                        value={passkey}
                        onChange={(value) => setPasskey(value)}
                    >
                        <InputOTPGroup className="shad-otp">
                            <InputOTPSlot className="shad-otp-slot" index={0}/>
                            <InputOTPSlot className="shad-otp-slot" index={1}/>
                            <InputOTPSlot className="shad-otp-slot" index={2}/>
                            <InputOTPSlot className="shad-otp-slot" index={3}/>
                            <InputOTPSlot className="shad-otp-slot" index={4}/>
                            <InputOTPSlot className="shad-otp-slot" index={5}/>
                        </InputOTPGroup>{" "}
                    </InputOTP>
                    {error && (
                        <p className="text-14-regular mt-4 flex justify-center text-red-500">{error}</p>
                    )}
                </div>

                <AlertDialogFooter className="border-t-0 bg-transparent px-0 pt-2">
                    <AlertDialogAction
                        onClick={(e) => validatePasskey(e)}
                        className="shad-primary-btn cursor-pointer "
                    >
                        Enter Admin Passkey
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
export default PasskeyModal;

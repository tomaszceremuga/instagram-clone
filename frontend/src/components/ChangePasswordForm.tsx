import { useEffect, useRef, useState } from "react"
import { CircleAlert, EyeOff } from "lucide-react"

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"

import FormInput from "./FormInput"
import { toast } from "./ui/toast"

const ChangePasswordForm = () => {
    const [oldPassword, setOldPassword] = useState("")
    const [password, setPassword] = useState("")
    const [isPasswordCorrect, setIsPasswordCorrect] = useState<boolean | undefined>(undefined)
    const [isOldPasswordEntered, setIsOldPasswordEntered] = useState<boolean | undefined>(undefined)
    const [areInputsCorrect, setAreInputsCorrect] = useState(false)

    const closeButtonRef = useRef<HTMLButtonElement>(null)

    const handlePasswordChange = async () => {
        closeButtonRef.current?.click()

        try {
            const res = await api.post("/change-password", {
                oldPassword,
                newPassword: password,
            })
            console.log(res)
            toast.add({
                title: "Your password has been changed",
            })
            closeButtonRef.current?.click()
        } catch (error) {
            console.error(error)
        }
    }

    const checkOldPassword = () => {
        const result = oldPassword !== ""
        setIsOldPasswordEntered(result)
        return result
    }

    const checkPassword = () => {
        const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{6,}$/
        const result = regex.test(password)

        setIsPasswordCorrect(result)

        return result
    }

    useEffect(
        () => setAreInputsCorrect((isOldPasswordEntered && isPasswordCorrect) === true),
        [isOldPasswordEntered, isPasswordCorrect],
    )

    return (
        <AlertDialog>
            <AlertDialogTrigger
                nativeButton={false}
                render={
                    <div className="relative mb-3 ">
                        <input
                            readOnly={true}
                            type="password"
                            id="password"
                            placeholder=" "
                            className={
                                "border-gray-300 hover:border-gray-500 peer h-15 w-full rounded-2xl border px-5 pt-5 pb-1 outline-none"
                            }
                            value={"******"}
                        />
                        <label
                            className="text-gray-500 absolute top-1/2 left-5 -translate-y-1/2 cursor-text transition-all peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:translate-y-0 peer-not-placeholder-shown:text-xs peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <p className="absolute top-1/2 right-5 -mr-2 -translate-y-1/2 rounded-full p-2 hover:bg-gray-100">
                            <EyeOff size={20} />
                        </p>
                    </div>
                }
            >
                Show Dialog
            </AlertDialogTrigger>
            <AlertDialogContent className={"rounded-2xl p-0"}>
                <p className="w-full p-6 border-b text-center font-medium text-xl">
                    Change password
                </p>

                <div className="h-full border-b p-6 text-left">
                    <p className="mt-3 mb-2 font-medium">Old password</p>
                    <FormInput
                        label="Password"
                        name="old-password"
                        type="password"
                        value={oldPassword}
                        onChange={setOldPassword}
                        blurHandler={checkOldPassword}
                        isInvalid={isOldPasswordEntered === false}
                    />
                    {isOldPasswordEntered === false && (
                        <div className="-mt-1 mb-1 flex gap-2 text-red-700">
                            <CircleAlert size={16} className="mt-0.5 shrink-0 text-[16px]" />
                            <p className="text-sm">Enter old password.</p>
                        </div>
                    )}

                    <p className="mt-6 mb-2 font-medium">New password</p>
                    <FormInput
                        label="Password"
                        name="new-password"
                        type="password"
                        value={password}
                        onChange={setPassword}
                        changeHandler={checkPassword}
                        isInvalid={isPasswordCorrect === false}
                    />
                    {isPasswordCorrect === false && (
                        <div className="-mt-1 mb-1 flex gap-2 text-red-700">
                            <CircleAlert size={16} className="mt-0.5 shrink-0 text-[16px]" />
                            <p className="text-sm">
                                Enter a combination of at least six numbers, letters and punctuation
                                marks (like ! and &).
                            </p>
                        </div>
                    )}
                </div>

                <button
                    className={cn(
                        areInputsCorrect
                            ? "text-blue-500 cursor-pointer"
                            : "text-gray-500 cursor-not-allowed",
                        "w-full p-4 border-b  hover:bg-gray-100",
                    )}
                    onClick={handlePasswordChange}
                >
                    Submit
                </button>
                <AlertDialogCancel ref={closeButtonRef} />
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ChangePasswordForm

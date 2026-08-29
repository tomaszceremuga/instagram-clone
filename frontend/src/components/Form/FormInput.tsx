import { Dispatch, SetStateAction, useState } from "react"
import { CacheHandler } from "next/dist/server/lib/incremental-cache"
import { CircleCheck, Eye, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"

type Props = {
    name: string
    label: string
    type?: string
    value: string
    onChange: Dispatch<SetStateAction<string>>
    isInvalid?: boolean
    isAvailable?: boolean
    blurHandler?: () => void
    changeHandler?: () => void
    className?: string
}

const FormInput = (props: Props) => {
    const [isShown, setIsShown] = useState(false)
    return (
        <div className={cn("relative mb-3 " + props.className)}>
            <input
                type={
                    props.type === "password"
                        ? isShown
                            ? "text"
                            : "password"
                        : (props.type ?? "text")
                }
                id={props.name}
                placeholder=" "
                className={`${props.isInvalid ? "border-red-700" : "border-gray-300 hover:border-gray-500"} peer h-15 w-full rounded-2xl border px-5 pt-5 pb-1 outline-none`}
                value={props.value}
                onChange={(e) => {
                    props.onChange(e.target.value)
                    if (props.changeHandler) {
                        props.changeHandler()
                    }
                }}
                onBlur={props.blurHandler}
                spellCheck={!["name", "username", "email"].includes(props.name)}
            />
            <label
                className={` ${props.isInvalid ? "text-red-700" : "text-gray-500"} absolute top-1/2 left-5 -translate-y-1/2 cursor-text transition-all peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:translate-y-0 peer-not-placeholder-shown:text-xs peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs`}
                htmlFor={props.name}
            >
                {props.label}
            </label>
            {props.type === "password" && (
                <button
                    className="absolute top-1/2 right-5 -mr-2 -translate-y-1/2 rounded-full p-2 hover:bg-gray-100"
                    onClick={() => setIsShown(!isShown)}
                >
                    {isShown ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
            )}
            {props.name === "username" && !props.isInvalid && props.isAvailable && (
                <CircleCheck
                    className="absolute top-1/2 right-5 -translate-y-1/2 text-green-700"
                    size={20}
                />
            )}
        </div>
    )
}

export default FormInput

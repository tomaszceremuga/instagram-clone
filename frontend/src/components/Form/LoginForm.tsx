"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { api } from "@/lib/api"
import { cn } from "@/lib/utils"

import FormInput from "./FormInput"

const LoginForm = () => {
    const router = useRouter()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const isFormCorrect = Boolean(username && password.length >= 6)
    const [isFailed, setIsFailed] = useState(false)

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault()

        if (!isFormCorrect) {
            return
        }

        try {
            const res = await api.post("/login", { username, password })
            console.log(res.data)
            router.push("/")
        } catch (err) {
            setIsFailed(true)
            setPassword("")
            console.error(err)
        }
    }

    return (
        <form onSubmit={handleLogin}>
            <p className="mb-5 w-full text-left text-xl font-medium">Log into Instagram</p>

            <FormInput name="username" label="Username" value={username} onChange={setUsername} />

            <FormInput
                name="password"
                label="Password"
                value={password}
                type="password"
                onChange={setPassword}
            />

            <button
                type="submit"
                className={`${isFormCorrect ? "cursor-pointer bg-blue-700" : "cursor-not-allowed bg-blue-300"} mt-2 h-11 w-full rounded-[22px] text-white`}
            >
                Log in
            </button>

            <p
                className={cn(
                    "text-red-500 font-medium text-center mt-4",
                    !isFailed && "invisible",
                )}
            >
                Failed to log in.
            </p>
            <Link href={"/register"}>
                <button
                    type="button"
                    className="mt-3 h-11 w-full cursor-pointer rounded-[22px] border border-blue-700 text-blue-700 md:mt-16"
                >
                    Create new account
                </button>
            </Link>
        </form>
    )
}

export default LoginForm

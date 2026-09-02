"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { api } from "@/lib/api"

import FormInput from "./FormInput"

const LoginForm = () => {
    const router = useRouter()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const isFormCorrect = Boolean(username && password.length >= 8)
    const [isUsernameLoading, setIsUsernameLoading] = useState(false)

    const handleLogin = async () => {
        try {
            const res = await api.post("/login", { username, password })
            console.log(res.data)
            router.push("/")
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="">
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
                onClick={handleLogin}
            >
                Log in
            </button>
            <Link href={"/register"}>
                <button className="mt-3 h-11 w-full cursor-pointer rounded-[22px] border border-blue-700 text-blue-700 md:mt-24">
                    Create new account
                </button>
            </Link>
        </div>
    )
}

export default LoginForm

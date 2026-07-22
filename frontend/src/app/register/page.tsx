"use client"

import { useState } from "react"
import Link from "next/link"
import { CircleAlert, CircleQuestionMark } from "lucide-react"

import FormInput from "@/components/FormInput"
import PickDateForm from "@/components/PickDateForm"
import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTrigger,
} from "@/components/ui/popover"
import { api } from "@/lib/api"

const page = () => {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [date, setDate] = useState<Date | undefined>(undefined)
    const [isFormCorrect, setIsFormCorrect] = useState(true)

    const handleSend = async () => {
        try {
            const res = await api.post("/register", {
                username,
                email,
                password,
            })
            console.log(res.data)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="flex w-screen justify-center">
            <div className="w-full max-w-160 p-12 md:py-25">
                <h1 className="mb-2 text-3xl font-semibold">
                    Get started on Instagram
                </h1>
                <h2 className="mb-5 text-sm">
                    Sign up to see photos and videos from your friends.
                </h2>
                <p className="mb-1">Email</p>
                <FormInput
                    label="Email"
                    name="email"
                    setter={setEmail}
                    value={email}
                    type="email"
                    isInvalid={true}
                />
                <div className="-mt-1 mb-1 flex gap-2 text-sm text-red-700">
                    <CircleAlert size={16} className="mt-0.5" />
                    <p>Please enter a valid email address.</p>
                </div>
                <p className="text-sm">
                    You may receive notifications from us.{" "}
                    <a className="text-blue-700" href="#">
                        Learn why we ask for your contact information
                    </a>
                </p>
                <p className="mt-3 mb-1">Password</p>
                <FormInput
                    label="Password"
                    name="password"
                    type="password"
                    setter={setPassword}
                    value={password}
                />
                <div className="-mt-1 mb-1 flex gap-2 text-red-700">
                    <CircleAlert
                        size={16}
                        className="mt-0.5 shrink-0 text-[16px]"
                    />
                    <p className="text-sm">
                        Enter a combination of at least six numbers, letters and
                        punctuation marks (like ! and &).
                    </p>
                </div>

                <p className="mt-3 mb-1 flex gap-2">
                    Birthday{" "}
                    <Popover>
                        <PopoverTrigger
                            render={
                                <button className="-m-2 cursor-pointer rounded-full p-2 hover:bg-gray-100">
                                    <CircleQuestionMark size={18} />
                                </button>
                            }>
                            Open Popover
                        </PopoverTrigger>
                        <PopoverContent>
                            <PopoverHeader>
                                <PopoverDescription>
                                    Providing your birthday improves the
                                    features and ads you see, and helps to keep
                                    the Instagram community safe. You can find
                                    your birthday in your account settings.{" "}
                                </PopoverDescription>
                            </PopoverHeader>
                        </PopoverContent>
                    </Popover>
                </p>
                <PickDateForm value={date} setter={setDate} />
                <p className="mt-1 mb-1">Name</p>
                <FormInput
                    value={name}
                    label="Full name"
                    setter={setName}
                    name="name"
                    type="name"
                />
                <p className="mt-5 mb-1">Username</p>
                <FormInput
                    value={username}
                    label="Username"
                    setter={setUsername}
                    name="username"
                />
                <div className="flex gap-2 text-sm text-red-700">
                    <CircleAlert size={16} className="mt-0.5" />
                    <p>error message</p>
                </div>

                <p className="mt-7 text-sm">
                    People who use our service may have uploaded your contact
                    information to Instagram.{" "}
                    <a href="#" className="text-blue-700">
                        Learn more
                    </a>
                    .
                    <br /> <br />
                    By tapping Submit, you agree to create an account and to
                    Instagram's{" "}
                    <a href="#" className="text-blue-700">
                        Terms
                    </a>
                    . Learn how we collect, use and share your data in our{" "}
                    <a href="#" className="text-blue-700">
                        Privacy Policy
                    </a>{" "}
                    and how we use cookies and similar technology in our{" "}
                    <a href="#" className="text-blue-700">
                        Cookies Policy
                    </a>
                    .
                    <br />
                    <br />
                    The{" "}
                    <a href="#" className="text-blue-700">
                        Privacy Policy
                    </a>{" "}
                    describes the ways we can use the information we collect
                    when you create an account. For example, we use this
                    information to provide, personalize and improve our
                    products, including ads.
                </p>
                <button
                    type="submit"
                    className={`${isFormCorrect ? "cursor-pointer bg-blue-700 hover:bg-blue-800" : "cursor-not-allowed bg-blue-300 hover:bg-blue-400"} mt-8 h-11 w-full rounded-[22px] text-white`}
                    onClick={handleSend}>
                    Submit
                </button>

                <Link href={"/login"}>
                    <button className="mt-3 h-11 w-full cursor-pointer rounded-[22px] border hover:bg-gray-100">
                        I already have an account
                    </button>
                </Link>
            </div>
        </div>
    )
}

export default page

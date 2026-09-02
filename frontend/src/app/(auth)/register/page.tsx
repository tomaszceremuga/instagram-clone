"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CircleAlert, CircleQuestionMark } from "lucide-react"

import FormInput from "@/components/Form/FormInput"
import PickDateForm from "@/components/Form/PickDateForm"
import Loading from "@/components/Loading"
import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useAuth } from "@/hooks/useAuth"
import { api } from "@/lib/api"

const page = () => {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [birthDate, setBirthDate] = useState<Date | undefined>(undefined)
    const [isEmailCorrect, setIsEmailCorrect] = useState<boolean | undefined>(undefined)
    const [isPasswordCorrect, setIsPasswordCorrect] = useState<boolean | undefined>(undefined)
    const [isBirthDateCorrect, setIsBirthDateCorrect] = useState<boolean | undefined>(undefined)
    const [isNameCorrect, setIsNameCorrect] = useState<boolean | undefined>(undefined)
    const [isUsernameCorrect, setIsUsernameCorrect] = useState<boolean | undefined>(undefined)
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(false)

    const emailLabelRef = useRef<HTMLParagraphElement>(null)
    const passwordLabelRef = useRef<HTMLParagraphElement>(null)
    const nameLabelRef = useRef<HTMLParagraphElement>(null)
    const usernameLabelRef = useRef<HTMLParagraphElement>(null)
    const birthDateLabelRef = useRef<HTMLParagraphElement>(null)

    const [usernameErrorMessage, setUsernameErrorMessage] = useState<string | null>(null)

    const router = useRouter()
    const { user, isLoading } = useAuth()

    useEffect(() => {
        if (!isLoading && user) {
            router.push("/")
        }
    }, [isLoading, user, router])

    if (isLoading) {
        return <Loading screen={true} />
    }

    const checkEmail = () => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        const result = regex.test(email)

        setIsEmailCorrect(result)

        return result
    }

    const checkPassword = () => {
        const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{6,}$/
        const result = regex.test(password)

        setIsPasswordCorrect(result)

        return result
    }

    const checkBirthDate = (selectedDate: Date | undefined) => {
        const result = selectedDate !== undefined

        setIsBirthDateCorrect(result)

        return result
    }

    const checkName = () => {
        const result = Boolean(name.trim()) && name.length <= 30

        setIsNameCorrect(result)

        return result
    }

    const checkUsername = async () => {
        const regex = /^\S+$/
        setIsUsernameAvailable(false)

        if (!regex.test(username)) {
            setIsUsernameCorrect(false)
            setUsernameErrorMessage(
                "Usernames can only include numbers, letters, underscores and periods. Try again.",
            )
            return false
        }

        try {
            const res = await api.get(`check-username/${username}`)

            setIsUsernameAvailable(res.data.available)

            if (!res.data.available) {
                setUsernameErrorMessage(`The username ${username} is not available.`)
                setIsUsernameCorrect(false)
                return false
            }

            setUsernameErrorMessage(null)
            setIsUsernameCorrect(true)

            return true
        } catch (error) {
            console.error(error)
            return false
        }
    }

    const handleSend = async () => {
        const validations = [
            { isValid: checkEmail(), ref: emailLabelRef },
            { isValid: checkPassword(), ref: passwordLabelRef },
            { isValid: checkBirthDate(birthDate), ref: birthDateLabelRef },
            { isValid: checkName(), ref: nameLabelRef },
        ]

        const firstInvalid = validations.find((field) => !field.isValid)
        const usernameCorrect = await checkUsername()

        if (firstInvalid) {
            firstInvalid.ref.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            })
            return
        }

        if (!usernameCorrect) {
            usernameLabelRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            })
            return
        }

        try {
            const registerRes = await api.post("/register", {
                username,
                email,
                password,
                name,
                birthDate,
            })
            console.log(registerRes.data)

            const loginRes = await api.post("/login", { username, password })
            console.log(loginRes.data)

            router.push("/")
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="flex w-screen justify-center">
            <div className="w-full max-w-160 p-12 md:py-25">
                <h1 className="mb-2 text-3xl font-semibold">Get started on Instagram</h1>
                <h2 className="mb-5 text-sm">
                    Sign up to see photos and videos from your friends.
                </h2>
                <p className="mb-1" ref={emailLabelRef}>
                    Email
                </p>
                <FormInput
                    label="Email"
                    name="email"
                    onChange={setEmail}
                    value={email}
                    type="email"
                    blurHandler={checkEmail}
                    isInvalid={isEmailCorrect === false}
                />
                {isEmailCorrect === false && (
                    <div className="-mt-1 mb-1 flex gap-2 text-sm text-red-700">
                        <CircleAlert size={16} className="mt-0.5" />
                        <p>Please enter a valid email address.</p>
                    </div>
                )}
                <p className="text-sm">
                    You may receive notifications from us.{" "}
                    <a className="text-blue-700" href="#">
                        Learn why we ask for your contact information
                    </a>
                </p>
                <p className="mt-3 mb-1" ref={passwordLabelRef}>
                    Password
                </p>
                <FormInput
                    label="Password"
                    name="password"
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

                <p className="mt-3 mb-1 flex gap-2" ref={birthDateLabelRef}>
                    Birthday{" "}
                    <Popover>
                        <PopoverTrigger
                            render={
                                <button className="-m-2 cursor-pointer rounded-full p-2 hover:bg-gray-100">
                                    <CircleQuestionMark size={18} />
                                </button>
                            }
                        >
                            Open Popover
                        </PopoverTrigger>
                        <PopoverContent className={"w-full max-w-[400]"}>
                            <PopoverHeader>
                                <PopoverDescription>
                                    Providing your birthday improves the features and ads you see,
                                    and helps to keep the Instagram community safe. You can find
                                    your birthday in your account settings.{" "}
                                    <a href="#" className="text-blue-700 hover:underline">
                                        Learn more about how we use your info in our Privacy Policy.
                                    </a>
                                </PopoverDescription>
                            </PopoverHeader>
                        </PopoverContent>
                    </Popover>
                </p>
                <PickDateForm
                    value={birthDate}
                    onChange={setBirthDate}
                    isInvalid={isBirthDateCorrect === false}
                    onSelect={checkBirthDate}
                />

                {isBirthDateCorrect === false && (
                    <div className="-mt-1 mb-1 flex gap-2 text-sm text-red-700">
                        <CircleAlert size={16} className="mt-0.5" />
                        <p>Please enter a valid email address.</p>
                    </div>
                )}

                <p className="mt-1 mb-1" ref={nameLabelRef}>
                    Name
                </p>
                <FormInput
                    value={name}
                    label="Full name"
                    onChange={setName}
                    name="name"
                    type="text"
                    isInvalid={isNameCorrect === false}
                    blurHandler={checkName}
                />
                {isNameCorrect === false && (
                    <div className="-mt-1 mb-1 flex gap-2 text-red-700">
                        <CircleAlert size={16} className="mt-0.5 shrink-0 text-[16px]" />
                        <p className="text-sm">Enter your full name. Up to 30 characters.</p>
                    </div>
                )}

                <p className="mt-5 mb-1" ref={usernameLabelRef}>
                    Username
                </p>
                <FormInput
                    value={username}
                    label="Username"
                    onChange={setUsername}
                    name="username"
                    isInvalid={isUsernameCorrect === false}
                    isAvailable={isUsernameAvailable}
                    blurHandler={checkUsername}
                />
                {usernameErrorMessage !== null && (
                    <div className="-mt-1 mb-1 flex gap-2 text-red-700">
                        <CircleAlert size={16} className="mt-0.5 shrink-0 text-[16px]" />
                        <p className="text-sm">{usernameErrorMessage}</p>
                    </div>
                )}

                <p className="mt-7 text-sm">
                    People who use our service may have uploaded your contact information to
                    Instagram.{" "}
                    <a href="#" className="text-blue-700">
                        Learn more
                    </a>
                    .
                    <br /> <br />
                    By tapping Submit, you agree to create an account and to Instagram's{" "}
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
                    describes the ways we can use the information we collect when you create an
                    account. For example, we use this information to provide, personalize and
                    improve our products, including ads.
                </p>
                <button
                    type="submit"
                    className="cursor-pointer bg-blue-700 hover:bg-blue-800 mt-8 h-11 w-full rounded-[22px] text-white"
                    onClick={handleSend}
                >
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

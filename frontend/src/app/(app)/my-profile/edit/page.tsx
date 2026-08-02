"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/context/AuthContext"
import { CircleAlert, CircleQuestionMark, Pencil, UserPen } from "lucide-react"
import { FadeLoader } from "react-spinners"

import FormInput from "@/components/FormInput"
import NotaAvailable from "@/components/NotaAvailable"
import PickDateForm from "@/components/PickDateForm"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTrigger,
} from "@/components/ui/popover"
import { api } from "@/lib/api"

type Profile = {
    username: string
    name: string
    avatar: string
    bio: string | null
    postsCount: number
    followersCount: number
    followingCount: number
}

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
    const [profile, setProfile] = useState<Profile | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)

    const emailLabelRef = useRef<HTMLParagraphElement>(null)
    const passwordLabelRef = useRef<HTMLParagraphElement>(null)
    const nameLabelRef = useRef<HTMLParagraphElement>(null)
    const usernameLabelRef = useRef<HTMLParagraphElement>(null)
    const birthDateLabelRef = useRef<HTMLParagraphElement>(null)

    const [usernameErrorMessage, setUsernameErrorMessage] = useState<string | null>(null)

    const router = useRouter()
    const { user, isReady } = useAuthContext()

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true)

            try {
                const res = await api.get(`/get-profile/${user?.username}`)
                setProfile(res.data)
                setUsername(res.data.username)
                setName(res.data.name)
            } catch (error) {
                console.log(error)
                setProfile(null)
            } finally {
                setIsLoading(false)
            }
        }

        fetchProfile()
    }, [user?.username])

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

    if (!isReady || isLoading) {
        return <FadeLoader color="#707070" height={7} margin={-10} radius={8} width={2} />
    }

    if (!profile) {
        return <NotaAvailable />
    }

    return (
        <div className="flex w-screen justify-center">
            <div className="w-full max-w-160 p-5 md:py-25">
                <h1 className="mb-2 text-xl font-semibold">Edit profile</h1>

                <div
                    className="w-full bg-gray-100 hover:bg-gray-200 my-6 h-min text-left cursor-pointer rounded-2xl p-6 flex relative"
                    onClick={() => setIsEditing(true)}
                >
                    {!isEditing && <Pencil className="size-4 absolute top-8 right-8" />}

                    <div className="h-full flex flex-col mr-2">
                        <div className="relative rounded-full size-18 md:size-24 overflow-hidden border border-gray-300 shrink-0">
                            <img
                                src={profile.avatar}
                                className="w-full h-full object-cover object-center"
                            />

                            {isEditing && (
                                <Link
                                    href={"/my-profile/edit"}
                                    className="absolute inset-0 cursor-alias flex items-center justify-center bg-black/50"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="size-10 fill-white opacity-100"
                                    >
                                        <path d="M12 9.652a3.54 3.54 0 1 0 3.54 3.539A3.543 3.543 0 0 0 12 9.65zm6.59-5.187h-.52a1.107 1.107 0 0 1-1.032-.762 3.103 3.103 0 0 0-3.127-1.961H10.09a3.103 3.103 0 0 0-3.127 1.96 1.107 1.107 0 0 1-1.032.763h-.52A4.414 4.414 0 0 0 1 8.874v9.092a4.413 4.413 0 0 0 4.408 4.408h13.184A4.413 4.413 0 0 0 23 17.966V8.874a4.414 4.414 0 0 0-4.41-4.41zM12 18.73a5.54 5.54 0 1 1 5.54-5.54A5.545 5.545 0 0 1 12 18.73z"></path>
                                    </svg>
                                </Link>
                            )}
                        </div>
                        {isEditing && (
                            <Button size={"sm"} className={"mt-2"}>
                                Upload
                            </Button>
                        )}
                    </div>

                    <div className=" w-full flex flex-col h-full">
                        {isEditing ? (
                            <div className="ml-2">
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
                                    <div className="-mt-1 flex gap-2 text-red-700">
                                        <CircleAlert
                                            size={16}
                                            className="mt-0.5 shrink-0 text-[16px]"
                                        />
                                        <p className="text-sm">{usernameErrorMessage}</p>
                                    </div>
                                )}

                                <FormInput
                                    value={name}
                                    label="Full name"
                                    onChange={setName}
                                    name="name"
                                    type="text"
                                    isInvalid={isNameCorrect === false}
                                    blurHandler={checkName}
                                    className="mt-4 mb-0"
                                />
                                {isNameCorrect === false && (
                                    <div className="mt-2 flex gap-2 text-red-700">
                                        <CircleAlert
                                            size={16}
                                            className="mt-0.5 shrink-0 text-[16px]"
                                        />
                                        <p className="text-sm">
                                            Enter your full name. Up to 30 characters.
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div>
                                <div className="relative ">
                                    <p className=" h-12 w-full rounded-2xl px-4 pt-5">
                                        {profile.username}
                                        <span className="text-gray-500 absolute top-1 left-4 translate-y-0 text-xs">
                                            Username
                                        </span>
                                    </p>
                                </div>
                                <div className="relative">
                                    <p className="h-12 w-full rounded-2xl px-4 pt-5 ">
                                        {profile.name}
                                        <span className="text-gray-500 absolute top-1 left-4 translate-y-0 text-xs">
                                            Name
                                        </span>
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

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
                <p className="mt-3 mb-1" ref={passwordLabelRef}>
                    Password
                </p>
                <FormInput
                    label="Password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={setPassword}
                    blurHandler={checkPassword}
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

                {/* <p className="mt-1 mb-1" ref={nameLabelRef}> */}
                {/*     Name */}
                {/* </p> */}
                {/* <FormInput */}
                {/*     value={name} */}
                {/*     label="Full name" */}
                {/*     onChange={setName} */}
                {/*     name="name" */}
                {/*     type="text" */}
                {/*     isInvalid={isNameCorrect === false} */}
                {/*     blurHandler={checkName} */}
                {/* /> */}
                {/* {isNameCorrect === false && ( */}
                {/*     <div className="-mt-1 mb-1 flex gap-2 text-red-700"> */}
                {/*         <CircleAlert size={16} className="mt-0.5 shrink-0 text-[16px]" /> */}
                {/*         <p className="text-sm">Enter your full name. Up to 30 characters.</p> */}
                {/*     </div> */}
                {/* )} */}
                {/**/}
                {/* <p className="mt-5 mb-1" ref={usernameLabelRef}> */}
                {/*     Username */}
                {/* </p> */}
                {/* <FormInput */}
                {/*     value={username} */}
                {/*     label="Username" */}
                {/*     onChange={setUsername} */}
                {/*     name="username" */}
                {/*     isInvalid={isUsernameCorrect === false} */}
                {/*     isAvailable={isUsernameAvailable} */}
                {/*     blurHandler={checkUsername} */}
                {/* /> */}
                {/* {usernameErrorMessage !== null && ( */}
                {/*     <div className="-mt-1 mb-1 flex gap-2 text-red-700"> */}
                {/*         <CircleAlert size={16} className="mt-0.5 shrink-0 text-[16px]" /> */}
                {/*         <p className="text-sm">{usernameErrorMessage}</p> */}
                {/*     </div> */}
                {/* )} */}

                <button
                    type="submit"
                    className="cursor-pointer bg-blue-700 hover:bg-blue-800 mt-8 h-11 w-full rounded-[22px] text-white"
                    onClick={handleSend}
                >
                    Submit
                </button>
            </div>
        </div>
    )
}

export default page

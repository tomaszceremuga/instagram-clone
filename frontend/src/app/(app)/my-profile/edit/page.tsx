"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/context/AuthContext"
import { CircleAlert, CircleQuestionMark, Pencil } from "lucide-react"
import { FadeLoader } from "react-spinners"

import ChangePasswordForm from "@/components/ChangePasswordForm"
import FormInput from "@/components/FormInput"
import NotaAvailable from "@/components/NotaAvailable"
import PickDateForm from "@/components/PickDateForm"
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/toast"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"

type UserData = {
    username: string
    name: string
    email: string
    avatar: string
    bio: string | null
    birthDate: Date
    isPrivate: boolean
}

const page = () => {
    const [username, setUsername] = useState("")
    const [name, setName] = useState("")
    const [bio, setBio] = useState("")
    const [isPrivate, setIsPrivate] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [birthDate, setBirthDate] = useState<Date | undefined>(undefined)
    const [isEmailCorrect, setIsEmailCorrect] = useState<boolean | undefined>(undefined)
    // const [isPasswordCorrect, setIsPasswordCorrect] = useState<boolean | undefined>(undefined)
    const [isBirthDateCorrect, setIsBirthDateCorrect] = useState<boolean | undefined>(undefined)
    const [isNameCorrect, setIsNameCorrect] = useState<boolean | undefined>(undefined)
    const [isUsernameCorrect, setIsUsernameCorrect] = useState<boolean | undefined>(undefined)
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(false)
    const [userData, setUserData] = useState<UserData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)

    const fileInputRef = useRef<HTMLInputElement>(null)
    const emailLabelRef = useRef<HTMLParagraphElement>(null)
    // const passwordLabelRef = useRef<HTMLParagraphElement>(null)
    const nameLabelRef = useRef<HTMLParagraphElement>(null)
    const usernameLabelRef = useRef<HTMLParagraphElement>(null)
    const birthDateLabelRef = useRef<HTMLParagraphElement>(null)

    const [usernameErrorMessage, setUsernameErrorMessage] = useState<string | null>(null)

    const router = useRouter()
    const { user, isReady } = useAuthContext()

    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true)

            try {
                const res = await api.get("/get-user-data")

                setUserData(res.data)
                console.log(res.data)
                setUsername(res.data.username)
                setName(res.data.name)
                setEmail(res.data.email)
                setBirthDate(res.data.birthDate)
                setBio(res.data.bio)
                setIsPrivate(res.data.isPrivate)
            } catch (error) {
                console.log(error)
                setUserData(null)
            } finally {
                setIsLoading(false)
            }
        }

        fetchUserData()
    }, [user?.username])

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]

        if (!file) {
            return
        }

        const formData = new FormData()
        formData.append("avatar", file)

        try {
            const res = await api.post("/upload/avatar", formData)
            setUserData((prev) => (prev ? { ...prev, avatar: res.data.avatar } : prev))
            toast.add({
                title: "Your avatar has been changed",
            })
        } catch (error) {
            console.error(error)
        }
    }

    const handleAvatarRemove = async () => {
        try {
            const res = await api.post("/delete/avatar")
            setUserData((prev) => (prev ? { ...prev, avatar: res.data.avatar } : prev))
            toast.add({
                title: "Your avatar has been removed",
            })
        } catch (error) {
            console.error(error)
        }
    }

    const checkEmail = () => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        const result = regex.test(email)

        setIsEmailCorrect(result)

        return result
    }

    // const checkPassword = () => {
    //     const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{6,}$/
    //     const result = regex.test(password)
    //
    //     setIsPasswordCorrect(result)
    //
    //     return result
    // }

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
        if (username === userData?.username) {
            setIsUsernameCorrect(true)
            setIsUsernameAvailable(false)
            return true
        }

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
            // { isValid: checkPassword(), ref: passwordLabelRef },
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

    if (!userData) {
        return <NotaAvailable />
    }

    return (
        <div className="flex w-full justify-center">
            <div className="w-full max-w-160 p-5 md:py-15">
                <h1 className="mb-2 text-xl font-semibold">Edit profile</h1>
                <div
                    className={cn(
                        !isEditing && "hover:bg-gray-200 cursor-pointer ",
                        "w-full bg-gray-100 my-6 h-min text-left rounded-2xl p-6 flex relative",
                    )}
                    onClick={() => setIsEditing(true)}
                >
                    {!isEditing && <Pencil className="size-4 absolute top-8 right-8" />}

                    <div className="h-full flex flex-col mr-4">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/png, image/jpeg"
                            onChange={handleAvatarChange}
                            className="hidden"
                        />

                        <div className="relative rounded-full size-18 md:size-24 overflow-hidden border-gray-300 border shrink-0">
                            <img
                                src={userData.avatar}
                                className="w-full h-full object-cover object-center"
                            />
                        </div>
                        {isEditing && (
                            <AlertDialog>
                                <AlertDialogTrigger
                                    render={
                                        <Button size={"sm"} className={"mt-2 w-full"}>
                                            Change
                                        </Button>
                                    }
                                />

                                <AlertDialogContent className={"rounded-2xl p-0"}>
                                    <p className="w-full p-6 border-b text-center font-medium text-xl">
                                        Change avatar
                                    </p>

                                    <button
                                        className="w-full p-4 border-b  cursor-pointer hover:bg-gray-100  text-blue-500"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        Upload
                                    </button>
                                    <button
                                        className="w-full p-4 border-b cursor-pointer hover:bg-gray-100   text-red-500"
                                        onClick={handleAvatarRemove}
                                    >
                                        Remove
                                    </button>
                                    <AlertDialogCancel />
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </div>

                    <div className=" w-full flex flex-col h-full">
                        {isEditing ? (
                            <div className="ml-2 sm:pl-4 sm:border-l">
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
                                        {userData.username}
                                        <span className="text-gray-500 absolute top-1 left-4 translate-y-0 text-xs">
                                            Username
                                        </span>
                                    </p>
                                </div>
                                <div className="relative">
                                    <p className="h-12 w-full rounded-2xl px-4 pt-5 ">
                                        {userData.name}
                                        <span className="text-gray-500 absolute top-1 left-4 translate-y-0 text-xs">
                                            Name
                                        </span>
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <p className="mb-2">Bio</p>
                <div
                    className={cn(
                        bio.length > 150
                            ? "border-red-700"
                            : "border-gray-300 hover:border-gray-500 ",
                        "relative mb-3 p-5 w-full rounded-2xl border flex justify-between",
                    )}
                >
                    <textarea
                        id="bio"
                        placeholder="Bio"
                        className="outline-none w-full field-sizing-content resize-none"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    />
                    <p
                        className={cn(
                            bio.length > 150 ? "text-red-700" : "text-gray-500",
                            "ml-5 flex items-end text-sm",
                        )}
                    >
                        {bio.length}/150
                    </p>
                </div>
                {bio.length > 150 && (
                    <div className="-mt-1 mb-1 flex gap-2 text-sm text-red-700">
                        <CircleAlert size={16} className="mt-0.5" />
                        <p>Bio is too long.</p>
                    </div>
                )}

                <p className="mb-2 mt-5" ref={emailLabelRef}>
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

                <p className="mt-5 mb-2">Password</p>
                <ChangePasswordForm />

                <p className="mt-5 mb-2 flex gap-2" ref={birthDateLabelRef}>
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

                <p className="mt-3 mb-2">Account privacy</p>
                <div className="relative p-5 cursor-pointer w-full rounded-2xl border-gray-300 hover:border-gray-500 border flex justify-between">
                    <label
                        htmlFor="is-private"
                        className="outline-none select-none w-full cursor-pointer field-sizing-content resize-none"
                    >
                        Private account
                    </label>
                    <Switch id="is-private" />
                </div>
                <div className="flex flex-col gap-2 text-sm text-gray-500 border-l pl-3 py-1 mt-4">
                    <p>
                        When your account is public, your profile and posts can be seen by anyone.
                    </p>
                    <p>
                        When your account is private, only the followers you approve can see what
                        you share, including your photos or videos, and your followers and following
                        lists.
                    </p>
                    <p>
                        Certain info on your profile, like your profile picture and username, is
                        visible to everyone on and off Instagram.
                    </p>
                </div>

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

"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuthContext } from "@/context/AuthContext"

import { cn } from "@/lib/utils"

import CreateNewPost from "./CreateNewPost/CreateNewPost"
import { Button } from "./ui/button"

type Props = {}

const DesktopNav = (props: Props) => {
    const { user, isReady } = useAuthContext()
    const [isExpanded, setIsExpanded] = useState(false)

    const pathname = usePathname()
    const router = useRouter()

    const isActive = (href: string | string[]) =>
        Array.isArray(href) ? href.includes(pathname) : href === pathname

    if (!isReady) {
        return <p>Loading...</p>
    }

    return (
        <nav
            className={cn(
                isExpanded ? "w-52" : "w-18",
                "z-50 transition-all duration-200 bg-white h-screen fixed flex flex-col justify-between p-4 py-10",
            )}
            onMouseOver={() => setIsExpanded(true)}
            onMouseOut={() => setIsExpanded(false)}
        >
            <Button variant="desktop-nav">
                <svg
                    className="size-6"
                    aria-label="Instagram"
                    fill="currentColor"
                    height="24"
                    role="img"
                    viewBox="0 0 24 24"
                    width="24"
                >
                    <title>Instagram</title>
                    <path d="M12 2.982c2.937 0 3.285.011 4.445.064a6.087 6.087 0 0 1 2.042.379 3.408 3.408 0 0 1 1.265.823 3.408 3.408 0 0 1 .823 1.265 6.087 6.087 0 0 1 .379 2.042c.053 1.16.064 1.508.064 4.445s-.011 3.285-.064 4.445a6.087 6.087 0 0 1-.379 2.042 3.643 3.643 0 0 1-2.088 2.088 6.087 6.087 0 0 1-2.042.379c-1.16.053-1.508.064-4.445.064s-3.285-.011-4.445-.064a6.087 6.087 0 0 1-2.043-.379 3.408 3.408 0 0 1-1.264-.823 3.408 3.408 0 0 1-.823-1.265 6.087 6.087 0 0 1-.379-2.042c-.053-1.16-.064-1.508-.064-4.445s.011-3.285.064-4.445a6.087 6.087 0 0 1 .379-2.042 3.408 3.408 0 0 1 .823-1.265 3.408 3.408 0 0 1 1.265-.823 6.087 6.087 0 0 1 2.042-.379c1.16-.053 1.508-.064 4.445-.064M12 1c-2.987 0-3.362.013-4.535.066a8.074 8.074 0 0 0-2.67.511 5.392 5.392 0 0 0-1.949 1.27 5.392 5.392 0 0 0-1.269 1.948 8.074 8.074 0 0 0-.51 2.67C1.012 8.638 1 9.013 1 12s.013 3.362.066 4.535a8.074 8.074 0 0 0 .511 2.67 5.392 5.392 0 0 0 1.27 1.949 5.392 5.392 0 0 0 1.948 1.269 8.074 8.074 0 0 0 2.67.51C8.638 22.988 9.013 23 12 23s3.362-.013 4.535-.066a8.074 8.074 0 0 0 2.67-.511 5.625 5.625 0 0 0 3.218-3.218 8.074 8.074 0 0 0 .51-2.67C22.988 15.362 23 14.987 23 12s-.013-3.362-.066-4.535a8.074 8.074 0 0 0-.511-2.67 5.392 5.392 0 0 0-1.27-1.949 5.392 5.392 0 0 0-1.948-1.269 8.074 8.074 0 0 0-2.67-.51C15.362 1.012 14.987 1 12 1Zm0 5.351A5.649 5.649 0 1 0 17.649 12 5.649 5.649 0 0 0 12 6.351Zm0 9.316A3.667 3.667 0 1 1 15.667 12 3.667 3.667 0 0 1 12 15.667Zm5.872-10.859a1.32 1.32 0 1 0 1.32 1.32 1.32 1.32 0 0 0-1.32-1.32Z"></path>
                </svg>
            </Button>

            <div className="flex flex-col gap-2">
                <Link href={"/"}>
                    <Button
                        variant={"desktop-nav"}
                        className={cn(isActive(["/"]) && "font-semibold", "w-full flex")}
                        onClick={() => router.push("/")}
                    >
                        {isActive(["/"]) ? (
                            <svg
                                className="size-6"

                                aria-label="Home"
                                fill="currentColor"
                                height="24"
                                role="img"
                                viewBox="0 0 24 24"
                                width="24"
                            >
                                <title>Home</title>
                                <path d="m21.762 8.786-7-6.68a3.994 3.994 0 0 0-5.524 0l-7 6.681A4.017 4.017 0 0 0 1 11.68V19c0 2.206 1.794 4 4 4h3.005a1 1 0 0 0 1-1v-7.003a2.997 2.997 0 0 1 5.994 0V22a1 1 0 0 0 1 1H19c2.206 0 4-1.794 4-4v-7.32a4.02 4.02 0 0 0-1.238-2.894Z"></path>
                            </svg>
                        ) : (
                            <svg
                                aria-label="Home"
                                className="size-6 "
                                fill="currentColor"
                                height="24"
                                role="img"
                                viewBox="0 0 24 24"
                                width="24"
                            >
                                <title>Home</title>
                                <path d="m21.762 8.786-7-6.68C13.266.68 10.734.68 9.238 2.106l-7 6.681A4.017 4.017 0 0 0 1 11.68V20c0 1.654 1.346 3 3 3h5.005a1 1 0 0 0 1-1L10 15c0-1.103.897-2 2-2 1.09 0 1.98.877 2 1.962L13.999 22a1 1 0 0 0 1 1H20c1.654 0 3-1.346 3-3v-8.32a4.021 4.021 0 0 0-1.238-2.894ZM21 20a1 1 0 0 1-1 1h-4.001L16 15c0-2.206-1.794-4-4-4s-4 1.794-4 4l.005 6H4a1 1 0 0 1-1-1v-8.32c0-.543.226-1.07.62-1.447l7-6.68c.747-.714 2.013-.714 2.76 0l7 6.68c.394.376.62.904.62 1.448V20Z"></path>
                            </svg>
                        )}
                        <p
                            className={cn(
                                "whitespace-nowrap transition-all duration-100",
                                isExpanded
                                    ? "opacity-100 translate-x-0"
                                    : "opacity-0 -translate-x-2",
                            )}
                        >
                            Home
                        </p>
                    </Button>
                </Link>

                <Link href={"/messages"}>
                    <Button
                        variant={"desktop-nav"}
                        className={cn(isActive(["/messages"]) && "font-semibold", "w-full flex")}
                    >
                        {isActive(["/messages"]) ? (
                            <svg
                                aria-label="Messages"
                                className="size-6"
                                fill="currentColor"
                                height="24"
                                role="img"
                                viewBox="0 0 24 24"
                                width="24"
                            >
                                <title>Messages</title>
                                <path d="M22.513 3.576C21.826 2.552 20.617 2 19.384 2H4.621c-1.474 0-2.878.818-3.46 2.173-.6 1.398-.297 2.935.784 3.997l3.359 3.295a1 1 0 0 0 1.195.156l8.522-4.849a1 1 0 1 1 .988 1.738l-8.526 4.851a1 1 0 0 0-.477 1.104l1.218 5.038c.343 1.418 1.487 2.534 2.927 2.766.208.034.412.051.616.051 1.26 0 2.401-.644 3.066-1.763l7.796-13.118a3.572 3.572 0 0 0-.116-3.863Z"></path>
                            </svg>
                        ) : (
                            <svg
                                aria-label="Messages"
                                className="size-6"
                                fill="currentColor"
                                height="24"
                                role="img"
                                viewBox="0 0 24 24"
                                width="24"
                            >
                                <title>Messages</title>
                                <path
                                    d="M13.973 20.046 21.77 6.928C22.8 5.195 21.55 3 19.535 3H4.466C2.138 3 .984 5.825 2.646 7.456l4.842 4.752 1.723 7.121c.548 2.266 3.571 2.721 4.762.717Z"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                ></path>
                                <line
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    x1="7.488"
                                    x2="15.515"
                                    y1="12.208"
                                    y2="7.641"
                                ></line>
                            </svg>
                        )}
                        <p
                            className={cn(
                                "whitespace-nowrap transition-all duration-100",
                                isExpanded
                                    ? "opacity-100 translate-x-0"
                                    : "opacity-0 -translate-x-2",
                            )}
                        >
                            Messages
                        </p>
                    </Button>
                </Link>

                <Link href={"/search"}>
                    <Button
                        variant={"desktop-nav"}
                        className={cn(isActive(["/search"]) && "font-semibold", "w-full flex")}
                    >
                        {isActive(["/search"]) ? (
                            <svg
                                aria-label="search"
                                className="size-6"
                                fill="currentColor"
                                height="24"
                                role="img"
                                viewBox="0 0 24 24"
                                width="24"
                            >
                                <title>search</title>
                                <path
                                    d="M18.5 10.5a8 8 0 1 1-8-8 8 8 0 0 1 8 8Z"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="3"
                                ></path>
                                <line
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="3"
                                    x1="16.511"
                                    x2="21.643"
                                    y1="16.511"
                                    y2="21.643"
                                ></line>
                            </svg>
                        ) : (
                            <svg
                                aria-label="search"
                                className="size-6"
                                fill="currentColor"
                                height="24"
                                role="img"
                                viewBox="0 0 24 24"
                                width="24"
                            >
                                <title>search</title>
                                <path
                                    d="M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 8.5 8.5Z"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                ></path>
                                <line
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    x1="16.511"
                                    x2="22"
                                    y1="16.511"
                                    y2="22"
                                ></line>
                            </svg>
                        )}
                        <p
                            className={cn(
                                "whitespace-nowrap transition-all duration-100",
                                isExpanded
                                    ? "opacity-100 translate-x-0"
                                    : "opacity-0 -translate-x-2",
                            )}
                        >
                            Search
                        </p>
                    </Button>
                </Link>

                <Button variant={"desktop-nav"} className={"w-full"}>
                    <svg
                        aria-label="Notifications"
                        className="size-6"
                        fill="currentColor"
                        height="24"
                        role="img"
                        viewBox="0 0 24 24"
                        width="24"
                    >
                        <title>Notifications</title>
                        <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path>
                    </svg>
                    <p
                        className={cn(
                            "whitespace-nowrap transition-all duration-100",
                            isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2",
                        )}
                    >
                        Notifications
                    </p>
                </Button>

                <CreateNewPost>
                    <Button variant={"desktop-nav"} className={"w-full"}>
                        <svg
                            aria-label="New post"
                            className="size-6"
                            fill="currentColor"
                            height="24"
                            role="img"
                            viewBox="0 0 24 24"
                            width="24"
                        >
                            <title>New post</title>
                            <path d="M21 11h-8V3a1 1 0 1 0-2 0v8H3a1 1 0 1 0 0 2h8v8a1 1 0 1 0 2 0v-8h8a1 1 0 1 0 0-2Z"></path>
                        </svg>
                        <p
                            className={cn(
                                "whitespace-nowrap transition-all duration-100",
                                isExpanded
                                    ? "opacity-100 translate-x-0"
                                    : "opacity-0 -translate-x-2",
                            )}
                        >
                            Create
                        </p>
                    </Button>
                </CreateNewPost>

                <Link href={"/my-profile"}>
                    <Button
                        variant={"desktop-nav"}
                        className={cn(isActive(["/my-profile"]) && "font-semibold", "w-full flex")}
                    >
                        <img
                            src={user?.avatar}
                            className={cn(
                                isActive(["/my-profile"])
                                    ? "border-2 border-black"
                                    : "border border-gray-300",
                                "max-w-none size-6 rounded-full  shrink-0",
                            )}
                        />
                        <p
                            className={cn(
                                "whitespace-nowrap transition-all duration-100",
                                isExpanded
                                    ? "opacity-100 translate-x-0"
                                    : "opacity-0 -translate-x-2",
                            )}
                        >
                            Profile
                        </p>
                    </Button>
                </Link>
            </div>

            <Button variant={"desktop-nav"} className={"w-full"}>
                <svg
                    className="size-6"

                    aria-label="Settings"
                    fill="currentColor"
                    height="24"
                    role="img"
                    viewBox="0 0 24 24"
                    width="24"
                >
                    <title>Settings</title>
                    <line
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        x1="3"
                        x2="21"
                        y1="4"
                        y2="4"
                    ></line>
                    <line
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        x1="3"
                        x2="21"
                        y1="12"
                        y2="12"
                    ></line>
                    <line
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        x1="3"
                        x2="21"
                        y1="20"
                        y2="20"
                    ></line>
                </svg>
                <p
                    className={cn(
                        "whitespace-nowrap transition-all duration-100",
                        isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2",
                    )}
                >
                    More
                </p>
            </Button>
        </nav>
    )
}

export default DesktopNav

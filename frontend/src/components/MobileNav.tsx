"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuthContext } from "@/context/AuthContext"

import { cn } from "@/lib/utils"

import { Button } from "./ui/button"

type Props = {}

const MobileNav = (props: Props) => {
    const { user } = useAuthContext()
    const pathname = usePathname()
    const router = useRouter()

    const isActive = (href: string | string[]) =>
        Array.isArray(href) ? href.includes(pathname) : href === pathname

    return (
        <nav className="flex justify-around fixed bottom-0 w-full bg-white">
            <Link href={"/"}>
                <Button
                    variant={"desktop-nav"}
                    className={cn(isActive(["/"]) && "font-semibold", "w-full flex")}
                    onClick={() => router.push("/")}>
                    {isActive(["/"]) ? (
                        <svg
                            className="size-6"

                            aria-label="Home"
                            fill="currentColor"
                            height="24"
                            role="img"
                            viewBox="0 0 24 24"
                            width="24">
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
                            width="24">
                            <title>Home</title>
                            <path d="m21.762 8.786-7-6.68C13.266.68 10.734.68 9.238 2.106l-7 6.681A4.017 4.017 0 0 0 1 11.68V20c0 1.654 1.346 3 3 3h5.005a1 1 0 0 0 1-1L10 15c0-1.103.897-2 2-2 1.09 0 1.98.877 2 1.962L13.999 22a1 1 0 0 0 1 1H20c1.654 0 3-1.346 3-3v-8.32a4.021 4.021 0 0 0-1.238-2.894ZM21 20a1 1 0 0 1-1 1h-4.001L16 15c0-2.206-1.794-4-4-4s-4 1.794-4 4l.005 6H4a1 1 0 0 1-1-1v-8.32c0-.543.226-1.07.62-1.447l7-6.68c.747-.714 2.013-.714 2.76 0l7 6.68c.394.376.62.904.62 1.448V20Z"></path>
                        </svg>
                    )}
                </Button>
            </Link>

            <Link href={"/search"}>
                <Button
                    variant={"desktop-nav"}
                    className={cn(isActive(["/search"]) && "font-semibold", "w-full flex")}>
                    {isActive(["/search"]) ? (
                        <svg
                            aria-label="search"
                            className="size-6"
                            fill="currentColor"
                            height="24"
                            role="img"
                            viewBox="0 0 24 24"
                            width="24">
                            <title>search</title>
                            <path
                                d="M18.5 10.5a8 8 0 1 1-8-8 8 8 0 0 1 8 8Z"
                                fill="none"
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="3"></path>
                            <line
                                fill="none"
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="3"
                                x1="16.511"
                                x2="21.643"
                                y1="16.511"
                                y2="21.643"></line>
                        </svg>
                    ) : (
                        <svg
                            aria-label="search"
                            className="size-6"
                            fill="currentColor"
                            height="24"
                            role="img"
                            viewBox="0 0 24 24"
                            width="24">
                            <title>search</title>
                            <path
                                d="M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 8.5 8.5Z"
                                fill="none"
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"></path>
                            <line
                                fill="none"
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                x1="16.511"
                                x2="22"
                                y1="16.511"
                                y2="22"></line>
                        </svg>
                    )}
                </Button>
            </Link>

            <Link href={"/messages"}>
                <Button
                    variant={"desktop-nav"}
                    className={cn(isActive(["/messages"]) && "font-semibold", "w-full flex")}>
                    {isActive(["/messages"]) ? (
                        <svg
                            aria-label="Messages"
                            className="size-6"
                            fill="currentColor"
                            height="24"
                            role="img"
                            viewBox="0 0 24 24"
                            width="24">
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
                            width="24">
                            <title>Messages</title>
                            <path
                                d="M13.973 20.046 21.77 6.928C22.8 5.195 21.55 3 19.535 3H4.466C2.138 3 .984 5.825 2.646 7.456l4.842 4.752 1.723 7.121c.548 2.266 3.571 2.721 4.762.717Z"
                                fill="none"
                                stroke="currentColor"
                                strokeLinejoin="round"
                                strokeWidth="2"></path>
                            <line
                                fill="none"
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                x1="7.488"
                                x2="15.515"
                                y1="12.208"
                                y2="7.641"></line>
                        </svg>
                    )}
                </Button>
            </Link>

            <Link href={"/profile"}>
                <Button
                    variant={"desktop-nav"}
                    className={cn(isActive(["/profile"]) && "font-semibold", "w-full flex")}>
                    <img
                        src={user?.avatar}
                        className="size-6 rounded-full border border-gray-300"
                    />
                </Button>
            </Link>
        </nav>
    )
}

export default MobileNav

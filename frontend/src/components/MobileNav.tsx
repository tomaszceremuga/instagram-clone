"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuthContext } from "@/context/AuthContext"

import { cn } from "@/lib/utils"

import CreateNewPost from "./CreateNewPost/CreateNewPost"
import { Button } from "./ui/button"

const MobileNav = () => {
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
                </Button>
            </Link>

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
                </Button>
            </CreateNewPost>

            <Link href={"/my-profile"}>
                <Button variant={"desktop-nav"}>
                    <img
                        src={user?.avatar}
                        className={cn(
                            isActive(["/my-profile"])
                                ? "border-2 border-black"
                                : "border border-gray-300",
                            "size-6 rounded-full ",
                        )}
                    />
                </Button>
            </Link>
        </nav>
    )
}

export default MobileNav

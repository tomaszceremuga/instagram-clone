import { useEffect, useState } from "react"
import Link from "next/link"
import { useNotifications } from "@/context/NotificationsContext"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
} from "@/components/ui/select"
import { useAuth } from "@/hooks/useAuth"

import Loading from "../Loading"
import { Button } from "../ui/button"
import PostsList from "./PostsList"
import ProfilesList from "./ProfilesList"

const MainMobile = () => {
    const { user, isLoading } = useAuth()
    const [currentView, setCurrentView] = useState<"for you" | "following">("for you")
    const { checkNotifications, hasUnreadNotifications } = useNotifications()

    useEffect(() => {
        checkNotifications()
    }, [])

    if (isLoading) {
        return <Loading size="screen" />
    }

    const items = [
        { label: "For you", value: "for you" },
        { label: "Following", value: "following" },
    ]

    return (
        <div className="w-full ">
            <div className="w-full px-1 flex z-980 items-center justify-between bg-white fixed h-12">
                <Select
                    items={items}
                    value={currentView}
                    onValueChange={(value) => setCurrentView(value as "for you" | "following")}
                >
                    <SelectTrigger>
                        <p className="text-xl font-semibold">
                            {items.find((item) => item.value === currentView)?.label}
                        </p>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {items.map((item) => (
                                <SelectItem key={item.value} value={item.value}>
                                    {item.label}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <Link className="relative p-3" href={"/notifications"}>
                    <svg
                        aria-label="Notifications"
                        className="size-6 relative"
                        fill="currentColor"
                        height="24"
                        role="img"
                        viewBox="0 0 24 24"
                        width="24"
                    >
                        <title>Notifications</title>
                        <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path>
                    </svg>
                    {hasUnreadNotifications && (
                        <div className="bg-red-500 rounded-full size-2.5  absolute -top-0.5 -right-1 border-white border"></div>
                    )}
                </Link>
            </div>
            <ProfilesList
                currentView={currentView}
                userName={user?.username ?? ""}
                className="w-full pt-10 "
            />

            <PostsList
                currentView={currentView}
                userName={user?.username ?? ""}
                className="w-full"
            />
        </div>
    )
}

export default MainMobile

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, X } from "lucide-react"

import useIsMobile from "@/hooks/useIsMobile"
import { api } from "@/lib/api"
import { cn, formatShortDate } from "@/lib/utils"
import { Notification } from "@/types"

type Props = {
    className?: string
    setIsViewShown?: Dispatch<SetStateAction<boolean>>
}

const NotificationsView = (props: Props) => {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [nextCursor, setNextCursor] = useState<number | null>(null)
    const hasFetchedRef = useRef(false)
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const isMobile = useIsMobile()
    const router = useRouter()

    const fetchNotifications = async (cursorOverride?: number | null) => {
        setIsLoading(true)

        try {
            const cursorToUse = cursorOverride !== undefined ? cursorOverride : nextCursor

            const res = await api.get("/notifications", {
                params: cursorToUse ? { cursor: cursorToUse } : undefined,
            })

            console.log(res)

            setNotifications((prev) => [...prev, ...res.data.notifications])
            setNextCursor(res.data.nextCursor)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (hasFetchedRef.current) return
        hasFetchedRef.current = true

        fetchNotifications(null)
    }, [])

    useEffect(() => {
        const handleScroll = (e: Event) => {
            const element = e.target as HTMLDivElement

            if (element.scrollHeight - element.scrollTop <= element.clientHeight + 100) {
                if (!isLoading && nextCursor) {
                    fetchNotifications()
                }
            }
        }

        scrollContainerRef.current?.addEventListener("scroll", handleScroll)

        return () => scrollContainerRef.current?.removeEventListener("scroll", handleScroll)
    }, [isLoading, nextCursor])

    return (
        <div className={cn("w-full h-full  md:p-6 ", props.className)}>
            {isMobile ? (
                <div className="w-full flex items-center justify-center mb-2 h-12">
                    <button className=" left-5 absolute" onClick={() => router.back()}>
                        <ChevronLeft size={"24"} />
                    </button>
                    <p>Notifications</p>
                </div>
            ) : (
                <div className="w-full flex justify-between items-center mb-6">
                    <p className="text-2xl font-semibold ">Notifications</p>
                    {props.setIsViewShown && (
                        <button
                            onClick={() => props.setIsViewShown?.(false)}
                            className="p-2 cursor-pointer hover:bg-gray-100 rounded-full"
                        >
                            <X />
                        </button>
                    )}
                </div>
            )}

            <div
                className={cn(
                    "overflow-y-scroll px-4 md:px-0  scrollbar-thin h-9/10 flex flex-col min-w-0",
                    notifications.length < 9 ? "scrollbar-none" : "scrollbar-thin",
                )}
                ref={scrollContainerRef}
            >
                {notifications.map((notification) => {
                    return (
                        <Link
                            key={notification.id}
                            href={notification.url}
                            className="flex w-full hover:bg-gray-100 rounded-xl p-3 cursor-pointer"
                            onClick={() => props.setIsViewShown?.(false)}
                        >
                            <div className="rounded-full size-12 overflow-hidden border border-gray-300  mr-3  shrink-0">
                                <img
                                    src={notification.avatar}
                                    className="w-full h-full object-cover object-center"
                                />
                            </div>
                            <div className="h-12 flex flex-col items-start py-0.5 min-w-0 flex-1">
                                <p className="font-medium truncate w-full">
                                    {notification.content}
                                </p>
                                <p className="text-gray-500 text-sm">
                                    {formatShortDate(notification.date)}
                                </p>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

export default NotificationsView

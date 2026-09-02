import { useEffect, useRef, useState } from "react"

import { api } from "@/lib/api"

type Props = {}

const NotificationsView = (props: Props) => {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [nextCursor, setNextCursor] = useState<number | null>(null)
    const hasFetchedRef = useRef(false)
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    const fetchNotifications = async (cursorOverride?: number | null) => {
        setIsLoading(true)

        try {
            const cursorToUse = cursorOverride !== undefined ? cursorOverride : nextCursor

            const res = await api.get("/notifications", {
                params: cursorToUse ? { cursor: cursorToUse } : undefined,
            })

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
        <div className=" w-full h-full ">
            <p className="text-2xl">Notifications</p>
            <div className="overflow-y-scroll" ref={scrollContainerRef}>
                <div className="flex w-full">
                    <div></div>
                </div>

                {notifications.map((notification) => {
                    return (
                        <div className="flex w-full">
                            <div></div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default NotificationsView

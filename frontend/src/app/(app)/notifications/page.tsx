"use client"

import NotificationsView from "@/components/ViewNotifications/NotificationsView"

type Props = {}

const page = (props: Props) => {
    return (
        <div className="flex items-center justify-center  w-full h-screen">
            <div className="w-100  border h-screen ">
                <NotificationsView />
            </div>
        </div>
    )
}

export default page

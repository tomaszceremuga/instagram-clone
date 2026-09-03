"use client"

import NotificationsView from "@/components/ViewNotifications/NotificationsView"

const page = () => {
    return (
        <div className="flex items-center justify-center  w-full h-screen -mb-9">
            <div className="w-full max-w-130 h-full md:pt-5">
                <NotificationsView />
            </div>
        </div>
    )
}

export default page

import { ReactElement, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import useIsMobile from "@/hooks/useIsMobile"

import NotificationsView from "./NotificationsView"

type Props = {
    children: ReactElement
}

const NotificationsViewTrigger = (props: Props) => {
    const [isViewShown, setIsViewShown] = useState(false)
    const router = useRouter()
    const isMobile = useIsMobile()

    // useEffect(() => {
    //     if (isMobile) {
    //
    //         router.push("/notifications")
    //     }
    // }, [isMobile])

    return (
        <div>
            <div onClick={() => setIsViewShown(true)}>{props.children}</div>
            {isViewShown && (
                <NotificationsView
                    className=" fixed top-0 left-0 h-screen w-120 z-200 border-r bg-white "
                    setIsViewShown={setIsViewShown}
                />
            )}
        </div>
    )
}

export default NotificationsViewTrigger

import { ReactElement, useState } from "react"

import NotificationsView from "./NotificationsView"

type Props = {
    children: ReactElement
    checkNotifications: () => Promise<void>
}

const NotificationsViewTrigger = (props: Props) => {
    const [isViewShown, setIsViewShown] = useState(false)
    return (
        <div>
            <div onClick={() => setIsViewShown(true)}>{props.children}</div>
            {isViewShown && (
                <NotificationsView
                    className=" fixed top-0 left-0 h-screen w-130 z-200 border-r bg-white "
                    setIsViewShown={setIsViewShown}
                    checkNotifications={props.checkNotifications}
                />
            )}
        </div>
    )
}

export default NotificationsViewTrigger

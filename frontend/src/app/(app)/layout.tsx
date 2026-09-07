"use client"

import { ReactNode } from "react"
import { AuthProvider } from "@/context/AuthContext"
import { NotificationsProvider } from "@/context/NotificationsContext"

import DesktopNav from "@/components/DesktopNav"
import Loading from "@/components/Loading"
import MobileNav from "@/components/MobileNav"
import useIsMobile from "@/hooks/useIsMobile"
import { useRequireAuth } from "@/hooks/useRequireAuth"

type Props = {
    children: ReactNode
}

const LayoutContent = (props: Props) => {
    const { isReady } = useRequireAuth()
    const isMobile = useIsMobile()

    if (!isReady) {
        return <Loading size="screen" />
    }

    if (isMobile) {
        return (
            <div className="pb-9">
                {props.children}
                <MobileNav />
            </div>
        )
    } else {
        return (
            <>
                <DesktopNav />
                {props.children}
            </>
        )
    }
}

const AppLayout = (props: Props) => {
    return (
        <AuthProvider>
            <NotificationsProvider>
                <LayoutContent>{props.children}</LayoutContent>
            </NotificationsProvider>
        </AuthProvider>
    )
}

export default AppLayout

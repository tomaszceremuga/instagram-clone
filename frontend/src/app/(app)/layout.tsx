"use client"

import { ReactNode, useEffect, useState } from "react"
import { AuthProvider } from "@/context/AuthContext"

import DesktopNav from "@/components/DesktopNav"
import MobileNav from "@/components/MobileNav"
import useIsMobile from "@/hooks/useIsMobile"
import { useRequireAuth } from "@/hooks/useRequireAuth"

type Props = {
    children: ReactNode
}

const LayoutContent = (props: Props) => {
    const { user, isReady } = useRequireAuth()
    const isMobile = useIsMobile()

    if (!isReady) {
        return <p>Loading...</p>
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
            <LayoutContent>{props.children}</LayoutContent>
        </AuthProvider>
    )
}

export default AppLayout

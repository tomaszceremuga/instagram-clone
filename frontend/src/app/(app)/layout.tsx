"use client"

import { ReactNode, useEffect, useState } from "react"

import DesktopNav from "@/components/DesktopNav"
import MobileNav from "@/components/MobileNav"

type Props = {
    children: ReactNode
}

const layout = (props: Props) => {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768)

        check()

        window.addEventListener("resize", check)
        return () => window.removeEventListener("resize", check)
    }, [])

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

export default layout

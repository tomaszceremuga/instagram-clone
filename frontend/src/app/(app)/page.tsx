"use client"

import { useRouter } from "next/navigation"

import Loading from "@/components/Loading"
import MainDesktop from "@/components/MainPage/MainDesktop"
import MainMobile from "@/components/MainPage/MainMobile"
import useIsMobile from "@/hooks/useIsMobile"
import { useRequireAuth } from "@/hooks/useRequireAuth"
import { api } from "@/lib/api"

const Home = () => {
    const router = useRouter()
    const { user, isReady } = useRequireAuth()
    const isMobile = useIsMobile()

    if (!isReady) {
        return <Loading size="screen" />
    }

    if (isMobile) {
        return <MainMobile />
    } else {
        return <MainDesktop />
    }
}

export default Home

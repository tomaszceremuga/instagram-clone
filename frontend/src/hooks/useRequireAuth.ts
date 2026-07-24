"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { useAuth } from "@/hooks/useAuth"

export const useRequireAuth = (redirectTo: string = "/login") => {
    const { user, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && !user) {
            router.push(redirectTo)
        }
    }, [isLoading, user, router, redirectTo])

    const isReady = !isLoading && Boolean(user)

    return { user, isReady }
}

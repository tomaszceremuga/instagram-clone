"use client"

import { createContext, ReactNode, useContext, useState } from "react"

import { api } from "@/lib/api"

type NotificationsContextValue = {
    hasUnreadNotifications: boolean
    checkNotifications: () => Promise<void>
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null)

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
    const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false)

    const checkNotifications = async () => {
        try {
            const res = await api.get("/check-notifications")
            setHasUnreadNotifications(res.data.hasUnreadNotifications)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <NotificationsContext.Provider value={{ hasUnreadNotifications, checkNotifications }}>
            {children}
        </NotificationsContext.Provider>
    )
}

export const useNotifications = () => {
    const context = useContext(NotificationsContext)

    if (!context) {
        throw new Error("useNotifications must be used within a NotificationsProvider")
    }

    return context
}

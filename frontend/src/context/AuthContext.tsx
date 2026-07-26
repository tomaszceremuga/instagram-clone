import { createContext, ReactNode, useContext } from "react"

import { useAuth } from "@/hooks/useAuth"

type User = {
    id: number
    username: string
    avatar: string
}

type AuthContextType = {
    user: User | null
    isReady: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { user, isLoading } = useAuth()

    const isReady = !isLoading

    return <AuthContext.Provider value={{ user, isReady }}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error("useAuthContext must be used within AuthProvider")
    }

    return context
}

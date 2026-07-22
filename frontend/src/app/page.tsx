"use client"

import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { api } from "@/lib/api"

const Home = () => {
    const router = useRouter()
    const { user, isLoading } = useAuth()

    const handleLogout = async () => {
        try {
            const res = await api.post("/logout")
            console.log(res.data)
            router.push("/login")
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login")
        }
    }, [isLoading, user, router])

    if (isLoading) {
        return <p>Loading...</p>
    }

    return (
        <div>
            <p className="font-instagram-condensed text-4xl">
                hello {user ? user.username : "?"}
            </p>
            <button className="bg-red-400 p-3" onClick={handleLogout}>
                logout
            </button>
        </div>
    )
}

export default Home

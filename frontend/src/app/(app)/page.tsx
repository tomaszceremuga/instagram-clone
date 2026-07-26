"use client"

import { useRouter } from "next/navigation"

import { useRequireAuth } from "@/hooks/useRequireAuth"
import { api } from "@/lib/api"

const Home = () => {
    const router = useRouter()
    const { user, isReady } = useRequireAuth()

    if (!isReady) {
        return <p>Loading...</p>
    }

    const handleLogout = async () => {
        try {
            const res = await api.post("/logout")
            console.log(res.data)
            router.push("/login")
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div>
            <p className="font-instagram-condensed text-4xl">hello {user ? user.username : "?"}</p>
            <p>some change</p>
            <button className="bg-red-400 p-3" onClick={handleLogout}>
                logout
            </button>
        </div>
    )
}

export default Home

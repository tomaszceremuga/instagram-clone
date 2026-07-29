"use client"

import { useRouter } from "next/navigation"
import { FadeLoader } from "react-spinners"

import { useRequireAuth } from "@/hooks/useRequireAuth"
import { api } from "@/lib/api"

const Home = () => {
    const router = useRouter()
    const { user, isReady } = useRequireAuth()

    if (!isReady) {
        return <FadeLoader color="#707070" height={7} margin={-10} radius={8} width={2} />
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

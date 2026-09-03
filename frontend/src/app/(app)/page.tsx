"use client"

import { useRouter } from "next/navigation"
import { FadeLoader } from "react-spinners"

import CreateNewPost from "@/components/CreateNewPost/CreateNewPost"
import Loading from "@/components/Loading"
import { Button } from "@/components/ui/button"
import { useRequireAuth } from "@/hooks/useRequireAuth"
import { api } from "@/lib/api"

const Home = () => {
    const router = useRouter()
    const { user, isReady } = useRequireAuth()

    if (!isReady) {
        return <Loading size="screen" />
    }

    // const handleLogout = async () => {
    //     try {
    //         const res = await api.post("/logout")
    //         console.log(res.data)
    //         router.push("/login")
    //     } catch (err) {
    //         console.error(err)
    //     }
    // }

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center">
            <p className="font-instagram-condensed text-4xl">hello {user ? user.username : "?"}</p>
            {/* <div className=" border-4 border-purple-500 border-dashed w-200 h-100 "> */}
            {/*     <Loading /> */}
            {/* </div> */}
        </div>
    )
}

export default Home

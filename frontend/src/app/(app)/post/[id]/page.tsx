"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { FadeLoader } from "react-spinners"

import Loading from "@/components/Loading"
import NotaAvailable from "@/components/NotaAvailable"
import PostItemDesktop from "@/components/ViewPost/PostItemDesktop"
import PostItemMobile from "@/components/ViewPost/PostItemMobile"
import useIsMobile from "@/hooks/useIsMobile"
import { api } from "@/lib/api"
import { Post } from "@/types"

const page = () => {
    const params = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [post, setPost] = useState<Post | null>(null)
    const idParam = params.id as string
    const isMobile = useIsMobile()

    useEffect(() => {
        const fetchPost = async () => {
            setIsLoading(true)
            try {
                const res = await api.get(`/post/${idParam}`)
                setPost(res.data.result)
            } catch (error) {
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchPost()
    }, [idParam])

    if (isLoading) {
        return <Loading size="screen" />
    }

    if (!post) {
        return <NotaAvailable />
    }

    if (isMobile) {
        return <PostItemMobile post={post} />
    } else {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <PostItemDesktop className="border" post={post} />
            </div>
        )
    }
}

export default page

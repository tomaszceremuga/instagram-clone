"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { FadeLoader } from "react-spinners"

import NotaAvailable from "@/components/NotaAvailable"
import PostItemDesktop from "@/components/ViewPost/PostItemDesktop"
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
        return (
            <div className="w-full h-full flex items-center justify-center">
                <FadeLoader color="#707070" height={7} margin={-10} radius={8} width={2} />
            </div>
        )
    }

    if (!post) {
        console.log(post)
        return <NotaAvailable />
    }

    if (isMobile) {
        return (
            <div className="pb-9">
                <p>mobile</p>
            </div>
        )
    } else {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <PostItemDesktop post={post} />
            </div>
        )
    }
}

export default page

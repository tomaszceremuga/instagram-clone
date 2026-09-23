import { useEffect, useRef, useState } from "react"

import { api } from "@/lib/api"
import { cn } from "@/lib/utils"
import { Post } from "@/types"

import Loading from "../Loading"
import PostItem from "./PostItem"

type Props = {
    userName: string
    currentView: "for you" | "following"
    className: string
}

const PostsList = (props: Props) => {
    const [isLoading, setIsLoading] = useState(false)
    const [posts, setPosts] = useState<Post[]>([])
    const isFetchingRef = useRef(false)
    const requestIdRef = useRef(0)
    const nextCursorRef = useRef<number | null>(null)

    const fetchPosts = async (cursorOverride?: number | null) => {
        const myRequestId = ++requestIdRef.current
        isFetchingRef.current = true
        setIsLoading(true)

        try {
            const cursorToUse =
                cursorOverride !== undefined ? cursorOverride : nextCursorRef.current
            const url = props.currentView === "for you" ? "/posts" : "/followed-posts"

            const res = await api.get(url, {
                params: cursorToUse ? { cursor: cursorToUse } : undefined,
            })

            if (myRequestId !== requestIdRef.current) {
                return
            }

            if (cursorToUse) {
                setPosts((prev) => [...prev, ...(res.data.result ?? [])])
            } else {
                setPosts(res.data.result ?? [])
            }

            nextCursorRef.current = res.data.nextCursor ?? null
        } catch (error) {
            console.log(error)
        } finally {
            if (myRequestId === requestIdRef.current) {
                setIsLoading(false)
                isFetchingRef.current = false
            }
        }
    }

    useEffect(() => {
        nextCursorRef.current = null
        fetchPosts(null)
    }, [props.currentView])

    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY + window.innerHeight
            const fullHeight = document.body.scrollHeight

            if (fullHeight - scrolled <= 100 && !isFetchingRef.current && nextCursorRef.current) {
                fetchPosts()
            }
        }

        window.addEventListener("scroll", handleScroll)

        return () => window.removeEventListener("scroll", handleScroll)
    }, [props.currentView])

    return (
        <div className={cn("mb-20 min-w-0", props.className)}>
            {posts.map((post) => (
                <PostItem post={post} key={post.id} />
            ))}
            {isLoading && <Loading size="width" className="pt-6" />}
        </div>
    )
}

export default PostsList

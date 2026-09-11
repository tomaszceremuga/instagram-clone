import { useEffect, useRef, useState } from "react"

import { api } from "@/lib/api"
import { cn } from "@/lib/utils"
import { Post, SearchedProfile } from "@/types"

import Loading from "../Loading"
import MiniProfileTrigger from "../MiniProfileTrigger"
import ToggleFollowButton from "../ToggleFollowButton"
import RoundedAvatar from "../ui/rounded-avatar"
import ViewPost from "../ViewPost/ViewPost"

type Props = {
    userName: string
    currentView: "for you" | "following"
    className: string
}

const PostsList = (props: Props) => {
    const [isLoading, setIsLoading] = useState(false)
    const [posts, setPosts] = useState<Post[]>([])
    const [nextCursor, setNextCursor] = useState<number | null>(null)

    const fetchPosts = async (cursorOverride?: number | null) => {
        setIsLoading(true)

        try {
            const cursorToUse = cursorOverride !== undefined ? cursorOverride : nextCursor
            const url = props.currentView === "for you" ? "/posts" : "/followed-posts"

            const res = await api.get(url, {
                params: cursorToUse ? { cursor: cursorToUse } : undefined,
            })

            if (cursorToUse) {
                setPosts((prev) => [...prev, ...(res.data.result ?? [])])
            } else {
                setPosts(res.data.result ?? [])
            }

            setNextCursor(res.data.nextCursor)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        setNextCursor(null)
        fetchPosts(null)
    }, [props.currentView])

    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY + window.innerHeight
            const fullHeight = document.body.scrollHeight

            if (fullHeight - scrolled <= 100 && !isLoading && nextCursor) {
                fetchPosts()
            }
        }

        window.addEventListener("scroll", handleScroll)

        return () => window.removeEventListener("scroll", handleScroll)
    }, [isLoading, nextCursor])

    return (
        <div className={props.className}>
            {isLoading && <Loading size="width" className="h-50" />}
            {posts.map((post) => (
                <ViewPost key={post.id} post={post}>
                    <p>{post.id}</p>
                </ViewPost>
            ))}
        </div>
    )
}

export default PostsList

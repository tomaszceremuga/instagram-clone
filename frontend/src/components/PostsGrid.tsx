import { useEffect, useState } from "react"

import { api } from "@/lib/api"
import { Post } from "@/types"

import ViewPostDesktop from "./ViewPost/ViewPostDesktop"

type Props = {
    username: string
    className?: string
}

const PostsGrid = (props: Props) => {
    const [isLoading, setIsLoading] = useState(true)
    const [posts, setPosts] = useState<Post[] | null>(null)
    const [nextCursor, setNextCursor] = useState<number | null>(null)

    const fetchPosts = async (cursorOverride?: number | null) => {
        console.log("fetch dla " + props.username)
        setIsLoading(true)

        try {
            const cursorToUse = cursorOverride !== undefined ? cursorOverride : nextCursor

            const res = await api.get(`/user-posts/${props.username}`, {
                params: { cursor: cursorToUse },
            })

            console.log(res)
            setPosts((prevPosts) => [...(prevPosts ?? []), ...(res.data.result ?? [])])
            setNextCursor(res.data.nextCursor)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const handleScroll = () => {
            const scrolledToBottom =
                window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 100

            if (scrolledToBottom && !isLoading && nextCursor) {
                fetchPosts()
            }
        }

        window.addEventListener("scroll", handleScroll)

        return () => window.removeEventListener("scroll", handleScroll)
    }, [isLoading, nextCursor])

    useEffect(() => {
        fetchPosts(null)
    }, [])

    return (
        <div className={"grid grid-cols-3 gap-0.5 lg:grid-cols-4" + " " + props.className}>
            {posts &&
                posts.map((post) => (
                    <ViewPostDesktop key={post.id} post={post}>
                        <div className="cursor-pointer relative group">
                            <div className="size-full font-semibold text-sm text-white z-50 invisible group-hover:visible bg-black/50 absolute flex justify-center items-center">
                                {/* {post.likesCount}{" "} */}
                                3213
                                <svg
                                    className="size-5 fill-white ml-1 mr-6"
                                    aria-label="Like"
                                    fill="currentColor"
                                    height="24"
                                    role="img"
                                    viewBox="0 0 24 24"
                                    width="24"
                                >
                                    <title>Like</title>
                                    <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path>
                                </svg>
                                {/* {post.commentsCount} */}
                                123
                                <svg
                                    className="size-5 fill-white ml-1"
                                    aria-label="Comment"
                                    fill="currentColor"
                                    height="24"
                                    role="img"
                                    viewBox="0 0 24 24"
                                    width="24"
                                >
                                    <title>Comment</title>
                                    <path
                                        d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                    ></path>
                                </svg>
                            </div>
                            <img src={post.media[0]} alt="" />
                        </div>
                    </ViewPostDesktop>
                ))}
        </div>
    )
}

export default PostsGrid

import { useEffect, useState } from "react"

import { api } from "@/lib/api"
import { cn } from "@/lib/utils"
import { Post } from "@/types"

import CreateNewPost from "./CreateNewPost/CreateNewPost"
import ViewPost from "./ViewPost/ViewPost"

type Props = {
    username: string
    isPrivate: boolean
    isAutor?: boolean
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

    if (props.isPrivate && !props.isAutor) {
        return (
            <div
                className={cn(
                    "flex flex-col items-center justify-center gap-4 p-10 text-center border-t w-full ",
                    props.className,
                )}
            >
                <svg
                    aria-label=""
                    fill="currentColor"
                    className="size-15.5"
                    height="48"
                    role="img"
                    viewBox="0 0 96 96"
                    width="48"
                >
                    <title></title>
                    <circle
                        cx="48"
                        cy="48"
                        fill="none"
                        r="47"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                    ></circle>
                    <path
                        d="M60.931 70.001H35.065a5.036 5.036 0 0 1-5.068-5.004V46.005A5.036 5.036 0 0 1 35.065 41H60.93a5.035 5.035 0 0 1 5.066 5.004v18.992A5.035 5.035 0 0 1 60.93 70ZM37.999 39.996v-6.998a10 10 0 0 1 20 0v6.998"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                    ></path>
                </svg>
                <p className="text-[1.6rem] font-bold">This profile is private</p>
                <p className="text-gray-500"> Follow to see their photos and videos.</p>
            </div>
        )
    }

    if (posts?.length === 0) {
        return (
            <div
                className={cn(
                    "flex flex-col items-center justify-center gap-4 p-10 text-center border-t w-full ",
                    props.className,
                )}
            >
                <svg
                    aria-label="When you share photos, they will appear on your profile."
                    fill="currentColor"
                    height="62"
                    role="img"
                    viewBox="0 0 96 96"
                    width="62"
                >
                    <title>When you share photos, they will appear on your profile.</title>
                    <circle
                        cx="48"
                        cy="48"
                        fill="none"
                        r="47"
                        stroke="currentColor"
                        strokeMiterlimit="10"
                        strokeWidth="2"
                    ></circle>
                    <ellipse
                        cx="48.002"
                        cy="49.524"
                        fill="none"
                        rx="10.444"
                        ry="10.476"
                        stroke="currentColor"
                        strokeLinejoin="round"
                        strokeWidth="2.095"
                    ></ellipse>
                    <path
                        d="M63.994 69A8.02 8.02 0 0 0 72 60.968V39.456a8.023 8.023 0 0 0-8.01-8.035h-1.749a4.953 4.953 0 0 1-4.591-3.242C56.61 25.696 54.859 25 52.469 25h-8.983c-2.39 0-4.141.695-5.181 3.178a4.954 4.954 0 0 1-4.592 3.242H32.01a8.024 8.024 0 0 0-8.012 8.035v21.512A8.02 8.02 0 0 0 32.007 69Z"
                        fill="none"
                        stroke="currentColor"
                        strokeLinejoin="round"
                        strokeWidth="2"
                    ></path>
                </svg>
                <p className="text-[1.6rem] font-bold">
                    {props.isAutor ? "Share photos" : "No posts yet"}
                </p>
                {props.isAutor && (
                    <div>
                        <p> When you share photos, they will appear on your profile.</p>
                        <CreateNewPost>
                            <button className="cursor-pointer text-blue-600 hover:underline">
                                Share your first photo
                            </button>
                        </CreateNewPost>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className={"grid mb-20 grid-cols-3 gap-0.5 lg:grid-cols-4" + " " + props.className}>
            {posts &&
                posts.map((post) => (
                    <ViewPost key={post.id} post={post}>
                        <div className="cursor-pointer relative group">
                            <div className="size-full font-semibold text-sm text-white z-50 invisible group-hover:visible bg-black/50 absolute flex justify-center items-center">
                                {post.likesCount}{" "}
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
                                {post.commentsCount}
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
                            <img src={post.media[0]} alt="" className="aspect-square size-full" />
                        </div>
                    </ViewPost>
                ))}
        </div>
    )
}

export default PostsGrid

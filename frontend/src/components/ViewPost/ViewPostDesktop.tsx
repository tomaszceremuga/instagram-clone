import { ReactNode, useState } from "react"
import Link from "next/link"
import { formatDistanceToNowStrict } from "date-fns"
import { X } from "lucide-react"

import { Comment, Post } from "@/types"

import AddComment from "./AddComment"

type Props = {
    children: ReactNode
    post: Post
}

const ViewPostDesktop = (props: Props) => {
    const [isShown, setIsShown] = useState(false)
    const [curImageIndex, setCurImageIndex] = useState(0)
    const [comments, setComments] = useState<Comment[]>([
        {
            id: 123,
            likesCount: 12,
            username: "Miśka",
            content: "dog milentis",
            avatar: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi1.sndcdn.com%2Fartworks-000620864602-3yjijs-t1080x1080.jpg&f=1&nofb=1&ipt=ee7d99b1f5deb48705fb3423c654ca5f7772a8d98f6a5827d8c2202d07711054",
            replies: [],
            repliesCount: 0,
            date: new Date(),
        },
    ])
    return (
        <>
            <div onClick={() => setIsShown(true)}>{props.children}</div>
            {isShown && (
                <div
                    onClick={() => setIsShown(false)}
                    className=" absolute w-full h-full flex justify-center items-center bg-black/70 z-50 top-0 left-0 p-20"
                >
                    <button
                        className="p-2 absolute top-4 right-4 text-white cursor-pointer"
                        onClick={() => setIsShown(false)}
                    >
                        <X size={26} />
                    </button>

                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-xl h-full w-fit flex"
                    >
                        <img
                            className="h-full aspect-square rounded-l-xl"
                            src={props.post.media[curImageIndex]}
                        />
                        <div className="w-100 h-full flex flex-col">
                            <div className="border-b h-14 flex items-center gap-2 p-4 shrink-0">
                                <img
                                    src={props.post.avatar}
                                    className=" size-8 rounded-full  border border-gray-300 shrink-0"
                                />
                                <Link
                                    href={`/${props.post.username}`}
                                    className="cursor-pointer font-medium"
                                >
                                    {props.post.username}
                                </Link>
                            </div>
                            <div className="flex-1 min-h-0 overflow-y-auto p-4 border-b">
                                {comments.map((comment) => (
                                    <div className="w-full" key={comment.id}>
                                        <div className="w-full flex items-center">
                                            <img
                                                src={comment.avatar}
                                                className=" size-8  mr-3  rounded-full  border border-gray-300 shrink-0"
                                            />
                                            <div className="w-full">
                                                <p className="text-sm ">
                                                    <span className="font-medium">
                                                        {comment.username}
                                                    </span>{" "}
                                                    {comment.content}
                                                </p>
                                                <div className="flex gap-2">
                                                    <p className="text-gray-500 text-xs">
                                                        {formatDistanceToNowStrict(
                                                            new Date(comment.date),
                                                        )}
                                                    </p>
                                                    <button className="text-gray-500 text-xs cursor-pointer font-bold">
                                                        Reply
                                                    </button>
                                                </div>
                                            </div>
                                            <button className="p-2">
                                                <svg
                                                    aria-label="Like"
                                                    fill="currentColor"
                                                    height="12"
                                                    role="img"
                                                    viewBox="0 0 24 24"
                                                    width="12"
                                                >
                                                    <title>Like</title>
                                                    <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="border-b h-14 p-3 flex gap-2 items-center shrink-0">
                                <button className="p-1 ">
                                    <svg
                                        className="size-6 "
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
                                </button>
                                <button className="p-1">
                                    <svg
                                        className="size-6 "
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
                                </button>
                                <p className="font-medium ml-2">{props.post.likesCount} likes</p>
                            </div>
                            <AddComment postId={props.post.id} />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ViewPostDesktop

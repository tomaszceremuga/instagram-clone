import { ReactNode, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { X } from "lucide-react"

import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
import { Comment, Post } from "@/types"

import AddComment from "./AddComment"
import CommentItem from "./CommentItem"
import Comments from "./CommentsSection"
import CommentsSection from "./CommentsSection"

type Props = {
    children: ReactNode
    post: Post
}

const ViewPostDesktop = (props: Props) => {
    const [isShown, setIsShown] = useState(false)
    const [replyingTo, setReplyingTo] = useState<{ username: string; id: number } | null>(null)
    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)
    const [comments, setComments] = useState<Comment[]>([])

    useEffect(() => {
        if (!api) {
            return
        }

        setCurrent(api.selectedScrollSnap() + 1)

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1)
        })
    }, [api])

    return (
        <>
            <div onClick={() => setIsShown(true)}>{props.children}</div>
            {isShown && (
                <div
                    onClick={() => setIsShown(false)}
                    className=" absolute w-full h-full flex justify-center items-center bg-black/70 z-50 top-0 left-0"
                >
                    <button
                        className="p-2 absolute top-4 right-4 text-white cursor-pointer"
                        onClick={() => setIsShown(false)}
                    >
                        <X size={26} />
                    </button>

                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-2xl w-full m-10 xl:w-3/5 max-h-[90vh] relative flex"
                    >
                        <div className="w-2/3 relative  aspect-square object-cover ">
                            <Carousel setApi={setApi}>
                                <CarouselContent>
                                    {props.post.media.map((img, index) => (
                                        <CarouselItem key={index}>
                                            <img className="size-full rounded-l-2xl" src={img} />
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <div className="size-full flex items-center justify-between p-16 absolute z-51 top-0 left-0">
                                    <CarouselPrevious className={"relative size-10"} />
                                    <CarouselNext className={"relative"} />
                                </div>
                            </Carousel>
                            <div className="w-full h-full top-0 left-0 absolute flex justify-center items-end p-3 ">
                                <div className="absolute z-50 flex gap-1.5 bg-black/50 hover:bg-black/70 p-3 rounded-full">
                                    {Array.from({ length: props.post.media.length }, (_, index) => (
                                        <div
                                            key={index}
                                            className={cn(
                                                index + 1 === current
                                                    ? "bg-blue-500"
                                                    : "bg-gray-400",
                                                "size-1.5 rounded-full",
                                            )}
                                        ></div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="absolute inset-y-0 right-0 w-1/3 flex flex-col">
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
                            <CommentsSection
                                comments={comments}
                                setComments={setComments}
                                replyingTo={replyingTo}
                                setReplyingTo={setReplyingTo}
                                postId={props.post.id}
                                descriptionComment={{
                                    id: -1,
                                    username: props.post.username,
                                    content: props.post.description,
                                    avatar: props.post.avatar,
                                }}
                            />
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
                                <p className="ml-2">{props.post.likesCount} likes</p>
                            </div>
                            <AddComment
                                replyingTo={replyingTo}
                                setReplyingTo={setReplyingTo}
                                postId={props.post.id}
                                setComments={setComments}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ViewPostDesktop

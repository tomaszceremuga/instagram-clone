import { useEffect, useRef, useState } from "react"
import Link from "next/link"

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
import CommentsSection from "./CommentsSection"
import LikeButton from "./LikeButton"

type Props = {
    post: Post
    className?: string
}

const PostItemDesktop = (props: Props) => {
    const [carouselApi, setCarouselApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)
    const [comments, setComments] = useState<Comment[]>([])
    const [replyingTo, setReplyingTo] = useState<{ username: string; id: number } | null>(null)

    const commentTextareaRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        if (!carouselApi) {
            return
        }

        setCurrent(carouselApi.selectedScrollSnap() + 1)

        carouselApi.on("select", () => {
            setCurrent(carouselApi.selectedScrollSnap() + 1)
        })
    }, [carouselApi])

    console.log(props.post.media.length)

    return (
        <div
            onClick={(e) => e.stopPropagation()}
            className={cn(
                "bg-white rounded-2xl w-4/5 m-10 xl:w-3/5 max-h-[90vh] relative flex",
                props.className,
            )}
        >
            <div className="w-2/3 relative aspect-square">
                <Carousel setApi={setCarouselApi}>
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
                {props.post.media.length > 1 && (
                    <div className="w-full h-full top-0 left-0 absolute flex justify-center items-end p-3 ">
                        <div className="absolute z-50 flex gap-1.5 bg-black/50 hover:bg-black/70 p-3 rounded-full">
                            {Array.from({ length: props.post.media.length }, (_, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        index + 1 === current ? "bg-blue-500" : "bg-gray-400",
                                        "size-1.5 rounded-full",
                                    )}
                                ></div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="absolute inset-y-0 right-0 w-1/3 flex flex-col">
                <div className="border-b h-14 flex items-center gap-2 p-4 shrink-0">
                    <img
                        src={props.post.avatar}
                        className=" size-8 rounded-full  border border-gray-300 shrink-0"
                    />
                    <Link href={`/${props.post.username}`} className="cursor-pointer font-medium">
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
                        likesCount: 0,
                        isLiked: false,
                    }}
                />
                <div className="border-b h-14 p-3 flex gap-2 items-center shrink-0">
                    <LikeButton isLikedInitial={props.post.isLiked} postId={props.post.id} />
                    {props.post.likesCount > 0 && (
                        <p className="font-medium">{props.post.likesCount}</p>
                    )}
                    <button
                        onClick={() => commentTextareaRef.current?.focus()}
                        className="p-1 button-hover"
                    >
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
                    {props.post.commentsCount > 0 && (
                        <p className="font-medium">{props.post.commentsCount}</p>
                    )}
                </div>
                <AddComment
                    replyingTo={replyingTo}
                    setReplyingTo={setReplyingTo}
                    postId={props.post.id}
                    setComments={setComments}
                    commentTextareaRef={commentTextareaRef}
                />
            </div>
        </div>
    )
}

export default PostItemDesktop

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { formatDistanceToNowStrict } from "date-fns"
import { ChevronLeft } from "lucide-react"

import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
import { Comment, Post } from "@/types"

import ToggleFollowButton from "../ToggleFollowButton"
import AddComment from "./AddComment"
import CommentsSection from "./CommentsSection"
import LikeButton from "./LikeButton"

type Props = {
    post: Post
    className?: string
}

const PostItemMobile = (props: Props) => {
    const [carouselApi, setCarouselApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)
    const [comments, setComments] = useState<Comment[]>([])
    const [replyingTo, setReplyingTo] = useState<{ username: string; id: number } | null>(null)
    const [areCommentsShown, setAreCommentsShown] = useState(false)

    const commentTextareaRef = useRef<HTMLTextAreaElement>(null)

    const router = useRouter()

    useEffect(() => {
        if (!carouselApi) {
            return
        }

        setCurrent(carouselApi.selectedScrollSnap() + 1)

        carouselApi.on("select", () => {
            setCurrent(carouselApi.selectedScrollSnap() + 1)
        })
    }, [carouselApi])

    return (
        <>
            <div
                className={cn(
                    "absolute z-999 top-0 left-0 bg-white h-full w-full",
                    areCommentsShown ? "block" : "hidden",
                )}
            >
                <div className="w-full flex items-center justify-center text-black bg-white fixed h-12 z-50">
                    <button className=" left-5 absolute" onClick={() => setAreCommentsShown(false)}>
                        <ChevronLeft size={24} />
                    </button>
                    <p>Comments</p>
                </div>
                <div className="pt-12 h-screen flex flex-col">
                    <CommentsSection
                        comments={comments}
                        setComments={setComments}
                        replyingTo={replyingTo}
                        setReplyingTo={setReplyingTo}
                        postId={props.post.id}
                    />
                    <AddComment
                        replyingTo={replyingTo}
                        setReplyingTo={setReplyingTo}
                        postId={props.post.id}
                        setComments={setComments}
                        commentTextareaRef={commentTextareaRef}
                    />
                </div>
            </div>

            <div
                onClick={(e) => e.stopPropagation()}
                className={cn("w-full", areCommentsShown && "hidden", props.className)}
            >
                <div className="w-full flex items-center justify-center text-black  bg-white fixed h-12 z-50">
                    <button className=" left-5 absolute" onClick={() => router.back()}>
                        <ChevronLeft size={24} />
                    </button>
                    <p>Post</p>
                </div>
                <div className="pt-12">
                    <div className="flex items-center gap-2 p-5 h-12">
                        <img
                            src={props.post.avatar}
                            className=" size-8 rounded-full  border border-gray-300"
                        />
                        <Link
                            href={`/${props.post.username}`}
                            className="cursor-pointer font-medium"
                        >
                            {props.post.username}
                        </Link>
                        <ToggleFollowButton
                            isFollowedInitial={props.post.isFollowed}
                            usernameToFollow={props.post.username}
                            isTypeGhost={true}
                        />
                    </div>

                    <div className="w-full aspect-square">
                        <div className="w-full aspect-square relative">
                            <p className=" w-min text-white bg-black/50 rounded-full p-1 px-2 absolute right-4 top-4 z-50 text-xs">
                                {current}/{props.post.media.length}
                            </p>
                            <Carousel setApi={setCarouselApi}>
                                <CarouselContent>
                                    {props.post.media.map((img, index) => (
                                        <CarouselItem key={index}>
                                            <img className="size-full" src={img} />
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                            </Carousel>
                        </div>
                        {props.post.media.length > 1 && (
                            <div className="w-full flex justify-center items-end mt-1">
                                <div className=" flex gap-1.5 p-2 rounded-full">
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
                        )}
                    </div>

                    <div className="w-full px-5">
                        <div className="flex gap-2 my-1 h-12  items-center">
                            <LikeButton
                                isLikedInitial={props.post.isLiked}
                                postId={props.post.id}
                            />
                            {props.post.likesCount > 0 && (
                                <p className="font-medium">{props.post.likesCount}</p>
                            )}
                            <button
                                onClick={() => {
                                    setAreCommentsShown(true)
                                    commentTextareaRef.current?.focus()
                                }}
                                className="p-1 button-hover"
                            >
                                <svg
                                    className="size-6"
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
                        <p className="w-4/5">
                            <Link className="font-medium" href={`/profile/${props.post.username}`}>
                                {props.post.username}
                            </Link>{" "}
                            {props.post.description}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            {formatDistanceToNowStrict(new Date(props.post.date))}
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PostItemMobile

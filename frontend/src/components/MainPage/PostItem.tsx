import { memo, useEffect, useState } from "react"
import { formatDistanceToNowStrict } from "date-fns"

import { cn } from "@/lib/utils"
import { Post } from "@/types"

import LikeButton from "../LikeButton"
import MiniProfileTrigger from "../MiniProfileTrigger"
import ToggleFollowButton from "../ToggleFollowButton"
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../ui/carousel"
import ViewPost from "../ViewPost/ViewPost"

type Props = {
    post: Post
}

const PostItem = memo((props: Props) => {
    const [carouselApi, setCarouselApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)

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
        <div className="mb-3">
            <div className="flex items-center justify-between py-3 pl-2 ">
                <MiniProfileTrigger username={props.post.username}>
                    <div className="flex items-center gap-3 ">
                        <img
                            src={props.post.avatar}
                            className=" size-8 rounded-full  border border-gray-300"
                        />
                        <p className="cursor-pointer font-medium h-8 flex items-center">
                            {props.post.username}
                        </p>
                    </div>
                </MiniProfileTrigger>
                <ToggleFollowButton
                    isFollowedInitial={props.post.isFollowed}
                    usernameToFollow={props.post.username}
                    isTypeGhost={true}
                />
            </div>
            <div className="w-full aspect-square">
                <div className="w-full aspect-square relative">
                    {props.post.media.length > 1 && (
                        <p className=" w-min text-white bg-black/50 rounded-full p-1 px-2 absolute right-4 top-4 z-50 text-xs">
                            {current}/{props.post.media.length}
                        </p>
                    )}
                    <Carousel setApi={setCarouselApi}>
                        <CarouselContent>
                            {props.post.media.map((img, index) => (
                                <CarouselItem key={index}>
                                    <img className="size-full rounded-lg border " src={img} />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <div className="size-full flex items-center justify-between p-16 absolute z-51 top-0 left-0">
                            <CarouselPrevious className={"relative"} />
                            <CarouselNext className={"relative"} />
                        </div>
                    </Carousel>
                </div>
                {props.post.media.length > 1 && (
                    <div className="w-full flex justify-center items-end mt-1">
                        <div className=" flex gap-1.5 p-2 rounded-full">
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
                <div className="w-full pl-2">
                    <div
                        className={cn(
                            "flex items-center mb-2 ",
                            props.post.media.length <= 1 && "mt-3",
                        )}
                    >
                        <LikeButton postId={props.post.id} className="mr-2" />
                        <div className="h-full flex pt-0.5 items-center ">
                            <ViewPost post={props.post}>
                                <button className=" p-1 mr-0.5 button-hover h-full">
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
                            </ViewPost>
                            <p className="font-medium h-full">{props.post.commentsCount}</p>
                        </div>
                    </div>
                    <p className="w-4/5 ">
                        <MiniProfileTrigger username={props.post.username}>
                            <span className="font-semibold mr-1">{props.post.username}</span>
                        </MiniProfileTrigger>
                        {props.post.description}
                    </p>
                    <p className="text-sm text-gray-500 h-8 flex items-center">
                        {formatDistanceToNowStrict(new Date(props.post.date))}
                    </p>
                </div>
            </div>
        </div>
    )
})

export default PostItem

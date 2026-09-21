import { Dispatch, memo, SetStateAction, useState } from "react"

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { api } from "@/lib/api"
import { cn, formatShortDate } from "@/lib/utils"
import { Comment } from "@/types"

import CommentLikeButton from "../CommentLikeButton"
import MiniProfileTrigger from "../MiniProfileTrigger"
import MiniProfileView from "../MiniProfileView"
import RoundedAvatar from "../ui/rounded-avatar"

type Props = {
    comment: Comment
    replyingTo: { username: string; id: number } | null
    setReplyingTo: Dispatch<SetStateAction<{ username: string; id: number } | null>>
    isDescription?: boolean
}

const CommentItem = memo((props: Props) => {
    const [isRepliesLoading, setIsRepliesLoading] = useState(false)
    const [nextCursor, setNextCursor] = useState<number | null>(null)
    const [areRepliesShown, setAreRepliesShown] = useState(false)
    const [replies, setReplies] = useState<Comment[]>([])
    const [isLiked, setIsLiked] = useState(props.comment.isLiked)
    const [likesCount, setLikesCount] = useState(props.comment.likesCount)

    const fetchReplies = async (cursorOverride?: number | null) => {
        setIsRepliesLoading(true)

        try {
            const cursorToUse = cursorOverride !== undefined ? cursorOverride : nextCursor

            const res = await api.get(`/replies/${props.comment.id}`, {
                params: { cursor: cursorToUse },
            })

            const newComments: Comment[] = res.data.result

            setReplies((prevComments) => [...prevComments, ...newComments])
            setNextCursor(res.data.nextCursor)
        } catch (error) {
            console.error(error)
        } finally {
            setIsRepliesLoading(false)
        }
    }

    return (
        <div
            className={cn("w-full flex flex-col justify-start my-2 min-w-0")}
            key={props.comment.id}
        >
            <div
                className={cn(
                    props.replyingTo?.id === props.comment.id && "bg-blue-50",
                    "w-full flex items-start p-2 rounded-xl ",
                )}
            >
                <MiniProfileTrigger username={props.comment.username}>
                    <RoundedAvatar className="size-8 mt-0.5" src={props.comment.avatar} />
                </MiniProfileTrigger>

                <div className="w-full ml-2 min-w-0 ">
                    <HoverCard>
                        <p
                            className={cn(
                                "text-sm wrap-break-word",
                                props.isDescription && " -ml-1 pt-2",
                            )}
                        >
                            <HoverCardTrigger>
                                <span className="font-medium cursor-pointer hover:underline">
                                    {props.comment.username}
                                </span>
                            </HoverCardTrigger>{" "}
                            {props.comment.content}
                        </p>
                        <HoverCardContent>
                            <MiniProfileView username={props.comment.username} />
                        </HoverCardContent>
                    </HoverCard>
                    <div className="mt-1 flex text-gray-500 text-xs gap-2">
                        <p>{props.comment.date && formatShortDate(props.comment.date)}</p>

                        {(likesCount ?? 0) > 0 && (
                            <p>
                                {likesCount} {likesCount === 1 ? "like" : "likes"}
                            </p>
                        )}

                        {props.comment.id !== -1 && (
                            <button
                                onClick={() =>
                                    props.setReplyingTo({
                                        username: props.comment.username,
                                        id: props.comment.id,
                                    })
                                }
                                className="cursor-pointer font-bold"
                            >
                                Reply
                            </button>
                        )}
                    </div>
                </div>
                {props.comment.id !== -1 && (
                    <CommentLikeButton
                        commentId={props.comment.id}
                        isLiked={isLiked}
                        setIsLiked={setIsLiked}
                        setLikesCount={setLikesCount}
                    />
                )}
            </div>
            {props.comment.repliesCount && props.comment.repliesCount > 0 ? (
                areRepliesShown ? (
                    <div className="flex-1 ml-5 min-h-0 pl-4">
                        {replies.map((comment) => (
                            <CommentItem
                                replyingTo={props.replyingTo}
                                setReplyingTo={props.setReplyingTo}
                                comment={comment}
                                key={comment.id}
                            />
                        ))}
                        {isRepliesLoading ? (
                            <div className="text-gray-500 text-xs w-full mt-5 flex items-center">
                                Loading...
                            </div>
                        ) : (
                            props.comment.repliesCount - replies.length > 0 && (
                                <button
                                    onClick={() => fetchReplies()}
                                    className="hover:cursor-pointer text-gray-500 text-xs w-full mt-5 flex items-center"
                                >
                                    <div className="w-6 mr-3 h-px bg-gray-500"></div>
                                    View more replies ({props.comment.repliesCount - replies.length}
                                    )
                                </button>
                            )
                        )}
                    </div>
                ) : isRepliesLoading ? (
                    <div className="text-gray-500 text-xs w-full pl-5 mt-2 mb-4 flex items-center">
                        Loading...
                    </div>
                ) : (
                    <button
                        onClick={() => {
                            setAreRepliesShown(true)
                            fetchReplies()
                        }}
                        className="hover:cursor-pointer text-gray-500 text-xs w-full pl-5 mt-2 mb-4 flex items-center"
                    >
                        <div className="w-6 mr-3 h-px bg-gray-500"></div>
                        View replies ({props.comment.repliesCount})
                    </button>
                )
            ) : null}
        </div>
    )
})

CommentItem.displayName = "CommentItem"

export default CommentItem

import { Dispatch, memo, SetStateAction, useEffect, useState } from "react"
import { formatDistanceToNowStrict } from "date-fns"

import { api } from "@/lib/api"
import { cn } from "@/lib/utils"
import { Comment } from "@/types"

type Props = {
    comment: Comment
    replyingTo: { username: string; id: number } | null
    setReplyingTo: Dispatch<SetStateAction<{ username: string; id: number } | null>>
}

const CommentItem = memo((props: Props) => {
    const [isLoading, setIsLoading] = useState(true)
    const [nextCursor, setNextCursor] = useState<number | null>(null)
    const [areRepliesShown, setAreRepliesShown] = useState(false)
    const [replies, setReplies] = useState<Comment[]>([])

    const fetchReplies = async (cursorOverride?: number | null) => {
        setIsLoading(true)

        try {
            const cursorToUse = cursorOverride !== undefined ? cursorOverride : nextCursor

            const res = await api.get(`/replies/${props.comment.id}`, {
                params: { cursor: cursorToUse },
            })

            const newComments: Comment[] = res.data.result.map((comment: Comment) => ({
                ...comment,
                likesCount: 0,
                replies: [],
            }))

            setReplies((prevComments) => [...prevComments, ...newComments])
            setNextCursor(res.data.nextCursor)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={cn("w-full flex flex-col justify-start my-2")} key={props.comment.id}>
            <div
                className={cn(
                    props.replyingTo?.id === props.comment.id && "bg-blue-50",
                    "w-full flex items-start p-2 rounded-xl ",
                )}
            >
                <img
                    src={props.comment.avatar}
                    className=" size-8  mr-3  rounded-full  border border-gray-300 shrink-0"
                />
                <div className="w-full">
                    <p className="text-sm ">
                        <span className="font-medium">{props.comment.username}</span>{" "}
                        {props.comment.content}
                    </p>
                    <div className="mt-1 flex gap-2">
                        <p className="text-gray-500 text-xs">
                            {props.comment.date &&
                                formatDistanceToNowStrict(new Date(props.comment.date))}
                        </p>
                        {props.comment.id !== -1 && (
                            <button
                                onClick={() =>
                                    props.setReplyingTo({
                                        username: props.comment.username,
                                        id: props.comment.id,
                                    })
                                }
                                className="text-gray-500 text-xs cursor-pointer font-bold"
                            >
                                Reply
                            </button>
                        )}
                    </div>
                </div>
                {props.comment.id !== -1 && (
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
                        {props.comment.repliesCount - replies.length > 0 && (
                            <button
                                onClick={() => fetchReplies()}
                                className="hover:cursor-pointer text-gray-500 text-xs w-full mt-5 flex items-center"
                            >
                                <div className="w-6 mr-3 h-px bg-gray-500"></div>
                                View more replies ({props.comment.repliesCount - replies.length})
                            </button>
                        )}
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

export default CommentItem

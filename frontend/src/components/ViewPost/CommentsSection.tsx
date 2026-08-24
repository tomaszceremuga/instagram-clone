import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { FadeLoader } from "react-spinners"

import { api } from "@/lib/api"
import { Comment } from "@/types"

import CommentItem from "./CommentItem"

type Props = {
    comments: Comment[]
    setComments: Dispatch<SetStateAction<Comment[]>>
    replyingTo: { username: string; id: number } | null
    setReplyingTo: Dispatch<SetStateAction<{ username: string; id: number } | null>>
    postId: number
    descriptionComment: Comment
}

const CommentsSection = (props: Props) => {
    const [isLoading, setIsLoading] = useState(true)
    const [nextCursor, setNextCursor] = useState<number | null>(null)
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    const hasFetchedRef = useRef(false)

    const fetchComments = async (cursorOverride?: number | null) => {
        setIsLoading(true)

        try {
            const cursorToUse = cursorOverride !== undefined ? cursorOverride : nextCursor

            const res = await api.get(`/comments/${props.postId}`, {
                params: { cursor: cursorToUse },
            })

            const newComments: Comment[] = res.data.result

            props.setComments((prevComments) => [...prevComments, ...newComments])
            setNextCursor(res.data.nextCursor)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (hasFetchedRef.current || props.comments.length > 0) {
            setIsLoading(false)
            return
        }
        hasFetchedRef.current = true
        fetchComments(null)
    }, [])

    useEffect(() => {
        const handleScroll = (e: Event) => {
            const element = e.target as HTMLDivElement

            if (element.scrollHeight - element.scrollTop <= element.clientHeight + 100) {
                if (!isLoading && nextCursor) {
                    fetchComments()
                }
            }
        }

        scrollContainerRef.current?.addEventListener("scroll", handleScroll)

        return () => scrollContainerRef.current?.removeEventListener("scroll", handleScroll)
    }, [isLoading, nextCursor])

    return (
        <div className="flex-1 min-h-0 overflow-y-scroll px-4 border-b" ref={scrollContainerRef}>
            {props.descriptionComment.content !== "" && (
                <CommentItem
                    comment={props.descriptionComment}
                    replyingTo={props.replyingTo}
                    setReplyingTo={props.setReplyingTo}
                />
            )}
            {props.comments.map((comment) => (
                <CommentItem
                    comment={comment}
                    key={comment.id}
                    replyingTo={props.replyingTo}
                    setReplyingTo={props.setReplyingTo}
                />
            ))}
            {isLoading && (
                <div className="p-6 flex justify-center w-full">
                    <FadeLoader color="#707070" height={7} margin={-10} radius={8} width={2} />
                </div>
            )}
        </div>
    )
}

export default CommentsSection

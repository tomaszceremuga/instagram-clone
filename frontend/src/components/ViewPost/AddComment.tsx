import { Dispatch, SetStateAction, useRef, useState } from "react"
import EmojiPicker, { EmojiClickData } from "emoji-picker-react"
import { DivideCircle, Reply, X } from "lucide-react"

import { cn } from "@/lib/utils"

type Props = {
    postId: number

    replyingTo: { username: string; id: number } | null
    setReplyingTo: Dispatch<SetStateAction<{ username: string; id: number } | null>>
}

const AddComment = (props: Props) => {
    const [textAreaVal, setTextAreaVal] = useState("")
    const [isEmojiPickerShown, setIsEmojiPickerShown] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const cursorPositionRef = useRef(0)

    const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
        cursorPositionRef.current = e.currentTarget.selectionStart ?? 0
    }

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTextAreaVal(e.target.value)
        cursorPositionRef.current = e.target.selectionStart ?? 0
    }

    const handleEmojiClick = (emojiObject: EmojiClickData) => {
        const position = cursorPositionRef.current
        const emoji = emojiObject.emoji

        setTextAreaVal((prevVal) => prevVal.slice(0, position) + emoji + prevVal.slice(position))

        setTimeout(() => {
            const newPosition = position + emoji.length
            textareaRef.current?.focus()
            textareaRef.current?.setSelectionRange(newPosition, newPosition)
            cursorPositionRef.current = newPosition
        }, 0)
    }

    return (
        <div className="w-full">
            {props.replyingTo && (
                <div className="w-full pt-4 pl-4  text-sm text-gray-500">
                    <button
                        onClick={() => props.setReplyingTo(null)}
                        className="flex cursor-pointer rounded-2xl py-1 px-3 bg-blue-50  items-center justify-center"
                    >
                        <p>Replying to {props.replyingTo?.username}</p>
                        <div className="text-blue-50 bg-gray-500 rounded-full p-0.5  flex ml-2 items-center justify-center ">
                            <X size={8} />
                        </div>
                    </button>
                </div>
            )}

            <div className="w-full flex relative items-start">
                <div className="relative py-2">
                    <EmojiPicker
                        open={isEmojiPickerShown}
                        onEmojiClick={handleEmojiClick}
                        style={{
                            position: "absolute",
                            zIndex: 9999,
                            bottom: "100%",
                        }}
                        width={300}
                        height={400}
                        searchDisabled={false}
                        skinTonesDisabled={true}
                        previewConfig={{ showPreview: false }}
                    />
                    <button
                        className="rounded-full p-2 pl-4 cursor-pointer"
                        onClick={() => setIsEmojiPickerShown(!isEmojiPickerShown)}
                    >
                        <svg
                            className="size-6"
                            aria-label="Emoji"
                            fill="currentColor"
                            height="20"
                            role="img"
                            viewBox="0 0 24 24"
                            width="20"
                        >
                            <title>Emoji</title>
                            <path d="M15.83 10.997a1.167 1.167 0 1 0 1.167 1.167 1.167 1.167 0 0 0-1.167-1.167Zm-6.5 1.167a1.167 1.167 0 1 0-1.166 1.167 1.167 1.167 0 0 0 1.166-1.167Zm5.163 3.24a3.406 3.406 0 0 1-4.982.007 1 1 0 1 0-1.557 1.256 5.397 5.397 0 0 0 8.09 0 1 1 0 0 0-1.55-1.263ZM12 .503a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12 .503Zm0 21a9.5 9.5 0 1 1 9.5-9.5 9.51 9.51 0 0 1-9.5 9.5Z"></path>
                        </svg>
                    </button>
                </div>

                <textarea
                    ref={textareaRef}
                    value={textAreaVal}
                    onChange={handleChange}
                    onSelect={handleSelect}
                    placeholder="Add comment..."
                    className={cn(
                        textAreaVal.length > 150 && "text-red-700",
                        "text-sm lg:text-base outline-none w-full resize-none field-sizing-content p-4 pl-2 max-h-[4lh] pb-0 mb-4",
                    )}
                />
                <button
                    className={cn(
                        textAreaVal !== ""
                            ? "text-blue-500 cursor-pointer"
                            : "text-blue-300 cursor-not-allowed",
                        "p-4  pr-6 ",
                    )}
                >
                    Post
                </button>
            </div>
        </div>
    )
}

export default AddComment

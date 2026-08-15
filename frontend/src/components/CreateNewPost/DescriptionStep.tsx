import { Dispatch, SetStateAction, useRef, useState } from "react"
import EmojiPicker, { EmojiClickData } from "emoji-picker-react"
import { CircleAlert } from "lucide-react"

import { cn } from "@/lib/utils"

import { AlertDialogTitle } from "../ui/alert-dialog"

type Props = {
    description: string
    setDescription: Dispatch<SetStateAction<string>>
}

const DescriptionStep = (props: Props) => {
    const [isEmojiPickerShown, setIsEmojiPickerShown] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const cursorPositionRef = useRef(0)

    const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
        cursorPositionRef.current = e.currentTarget.selectionStart ?? 0
    }

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        props.setDescription(e.target.value)
        cursorPositionRef.current = e.target.selectionStart ?? 0
    }

    const handleEmojiClick = (emojiObject: EmojiClickData) => {
        const position = cursorPositionRef.current
        const emoji = emojiObject.emoji

        props.setDescription(
            (prevDescription) =>
                prevDescription.slice(0, position) + emoji + prevDescription.slice(position),
        )

        setTimeout(() => {
            const newPosition = position + emoji.length
            textareaRef.current?.focus()
            textareaRef.current?.setSelectionRange(newPosition, newPosition)
            cursorPositionRef.current = newPosition
        }, 0)
    }
    return (
        <>
            <AlertDialogTitle>Add description</AlertDialogTitle>
            <div className={cn("px-5 pt-5 relative w-ful ")}>
                <textarea
                    ref={textareaRef}
                    value={props.description}
                    onChange={handleChange}
                    onSelect={handleSelect}
                    placeholder="Enter description or leave this field empty."
                    className={cn(
                        props.description.length > 150 && "text-red-700",
                        "outline-none w-full h-24 resize-none",
                    )}
                />
                <EmojiPicker
                    open={isEmojiPickerShown}
                    onEmojiClick={handleEmojiClick}
                    className="absolute z-50"
                    style={{ position: "absolute", zIndex: 9999, left: "60px" }}
                    width={300}
                    height={400}
                    searchDisabled={false}
                    skinTonesDisabled={true}
                    previewConfig={{ showPreview: false }}
                />

                <div className="w-full flex justify-between items-center -mb-2 -ml-2">
                    <button
                        className="invisible md:visible rounded-full hover:bg-gray-200 p-2 cursor-pointer text-gray-500"
                        onClick={() => setIsEmojiPickerShown(!isEmojiPickerShown)}
                    >
                        <svg
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
                    <p
                        className={cn(
                            props.description.length > 150 ? "text-red-700" : "text-gray-500",
                            "text-sm",
                        )}
                    >
                        {props.description.length}/150
                    </p>
                </div>
            </div>
            {props.description.length <= 150 && (
                <button className="w-full p-4 border-t-2 border-border  cursor-pointer hover:bg-gray-100 mt-5 text-blue-500 z-50">
                    Share
                </button>
            )}
        </>
    )
}

export default DescriptionStep

import { useState } from "react"

type Props = {
    text?: string | null
    maxLength: number
}

const ExpandedText = (props: Props) => {
    const [isTextExpanded, setIsTextExpanded] = useState(false)

    const text = props.text ? props.text : " "
    const newlineIndex = text.indexOf("\n")
    const condition = text.length > props.maxLength || newlineIndex !== -1
    const rawCutAt = newlineIndex === -1 ? props.maxLength : Math.min(newlineIndex, props.maxLength)

    let cutAt = rawCutAt
    if (rawCutAt === props.maxLength && text[rawCutAt] !== " ") {
        const lastSpace = text.lastIndexOf(" ", rawCutAt)
        if (lastSpace > 0) {
            cutAt = lastSpace
        }
    }

    const shortText = condition ? text.slice(0, cutAt) + "..." : text

    return (
        <span>
            {isTextExpanded ? text : shortText}{" "}
            {!isTextExpanded && condition && (
                <span
                    onClick={() => setIsTextExpanded(true)}
                    className="text-gray-500 hover:underline cursor-pointer"
                >
                    more
                </span>
            )}
        </span>
    )
}

export default ExpandedText

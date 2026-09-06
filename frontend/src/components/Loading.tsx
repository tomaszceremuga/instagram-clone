import { FadeLoader } from "react-spinners"

import { cn } from "@/lib/utils"

type Props = {
    size?: "screen" | "width" | "small"
    className?: string
}

const Loading = (props: Props) => {
    return (
        <div
            className={cn(
                "size-full flex relative items-center justify-center",
                props.size === "screen" && "h-screen w-screen",
                props.size === "width" && "h-min w-full",
                props.size === "small" && "w-min",
                props.className,
            )}
        >
            <div className="pl-10">
                <FadeLoader
                    color="#707070"
                    height={8}
                    margin={-8}
                    radius={4}
                    width={3}
                    cssOverride={{ transform: "translate(4px, 3px)" }}
                />
            </div>
        </div>
    )
}

export default Loading

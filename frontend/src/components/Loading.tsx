import { FadeLoader } from "react-spinners"

import { cn } from "@/lib/utils"

type Props = {
    screen?: boolean
}

const Loading = (props: Props) => {
    return (
        <div
            className={cn(
                "size-full flex relative items-center justify-center",
                props.screen && "h-screen w-screen",
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

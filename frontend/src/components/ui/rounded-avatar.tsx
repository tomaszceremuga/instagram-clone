import { cn } from "@/lib/utils"

type Props = {
    src: string
    className?: string
}

const RoundedAvatar = (props: Props) => {
    return (
        <div
            className={cn(
                "rounded-full size-12 overflow-hidden border border-gray-300  mr-3  shrink-0",
                props.className,
            )}
        >
            <img src={props.src} className="w-full h-full object-cover object-center" />
        </div>
    )
}

export default RoundedAvatar

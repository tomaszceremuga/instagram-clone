import { ReactElement } from "react"
import { useRouter } from "next/navigation"

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

import MiniProfileView from "./MiniProfileView"

type Props = {
    children: ReactElement
    username: string
}

const MiniProfileTrigger = (props: Props) => {
    const router = useRouter()

    return (
        <HoverCard>
            <HoverCardTrigger onClick={() => router.push(`/${props.username}`)}>
                {props.children}
            </HoverCardTrigger>
            <HoverCardContent>
                <MiniProfileView username={props.username} />
            </HoverCardContent>
        </HoverCard>
    )
}

export default MiniProfileTrigger

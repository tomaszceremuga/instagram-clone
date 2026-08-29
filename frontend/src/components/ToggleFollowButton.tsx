import { useState } from "react"
import { useAuthContext } from "@/context/AuthContext"

import { api } from "@/lib/api"
import { cn } from "@/lib/utils"

import { Button } from "./ui/button"

type Props = {
    isFollowedInitial: boolean
    usernameToFollow: string
    className?: string
    isTypeGhost?: boolean
}

const ToggleFollowButton = (props: Props) => {
    const [isFollowed, setIsFollowed] = useState(props.isFollowedInitial)
    const { user } = useAuthContext()

    const handleToggleFollow = async () => {
        try {
            const url = `/${isFollowed ? "unfollow" : "follow"}/${props.usernameToFollow}`
            const res = await api.post(url)
            setIsFollowed(res.data.isFollowed)
        } catch (error) {
            console.error(error)
        }
    }

    if (user?.username === props.usernameToFollow) {
        return
    }

    if (props.isTypeGhost) {
        return (
            <Button
                variant={"ghost"}
                className={cn(
                    isFollowed && "invisible",
                    "w-min px-4 text-sm md:text-md md:font-semibold text-blue-500",
                    props.className,
                )}
                size={"sm"}
                onClick={handleToggleFollow}
            >
                Follow
            </Button>
        )
    } else {
        return (
            <Button
                variant={isFollowed ? "secondary" : "default"}
                className={cn("w-min px-4 text-sm md:text-md md:font-semibold", props.className)}
                size={"sm"}
                onClick={handleToggleFollow}
            >
                {isFollowed ? "Following" : "Follow"}
            </Button>
        )
    }
}

export default ToggleFollowButton

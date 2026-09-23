import { useState } from "react"
import { useAuthContext } from "@/context/AuthContext"

import { api } from "@/lib/api"
import { cn } from "@/lib/utils"

import { Button } from "./ui/button"

type Props = {
    isFollowedInitial: boolean
    isPendingInitial: boolean
    usernameToFollow: string
    className?: string
    isTypeGhost?: boolean
    onFollowStateChange?: (state: boolean | "pending") => void
}

const ToggleFollowButton = (props: Props) => {
    const [isFollowed, setIsFollowed] = useState<boolean | "pending">(
        props.isPendingInitial ? "pending" : props.isFollowedInitial,
    )
    const { user } = useAuthContext()

    const handleToggleFollow = async () => {
        try {
            const res = await api.post(`/toggle-follow/${props.usernameToFollow}`, {
                ...(props.isTypeGhost === true && { setTo: "followed" }),
            })

            const newState: boolean | "pending" = res.data.isPending
                ? "pending"
                : res.data.isFollowed

            setIsFollowed(newState)
            props.onFollowStateChange?.(newState)
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
                    (isFollowed === true || isFollowed === "pending") && "hidden",
                    "w-min px-4 text-sm md:text-md md:font-semibold text-blue-500",
                    props.className,
                )}
                size={"sm"}
                onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleToggleFollow()
                }}
            >
                Follow
            </Button>
        )
    } else {
        return (
            <Button
                variant={isFollowed === false ? "default" : "secondary"}
                className={cn("w-min px-4 text-sm md:text-md md:font-semibold", props.className)}
                size={"sm"}
                onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleToggleFollow()
                }}
            >
                {isFollowed === "pending" ? "Requested follow" : isFollowed ? "Unfollow" : "Follow"}
            </Button>
        )
    }
}

export default ToggleFollowButton

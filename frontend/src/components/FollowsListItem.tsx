import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/context/AuthContext"

import { api } from "@/lib/api"

import { Button } from "./ui/button"

type Props = {
    username: string
    name: string
    avatar: string
    isFollowedInitial: boolean
}

const FollowsListItem = (props: Props) => {
    const [isFollowed, setIsFollowed] = useState(props.isFollowedInitial)
    const router = useRouter()
    const { user, isReady } = useAuthContext()

    const handleToggleFollow = async () => {
        try {
            if (isFollowed) {
                await api.post(`/unfollow/${props.username}`)
                setIsFollowed(false)
            } else {
                await api.post(`/follow/${props.username}`)
                setIsFollowed(true)
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Link
            href={`${props.username}`}
            className="flex rounded justify-between w-full items-center">
            <div className="flex">
                <div className="rounded-full size-10 overflow-hidden border border-gray-300 mr-3  shrink-0">
                    <img src={props.avatar} className="w-full h-full object-cover object-center" />
                </div>
                <div className="h-full text-xs md:text-sm flex flex-col justify-between">
                    <p className="font-semibold">{props.username}</p>
                    <p className="text-gray-500">{props.name}</p>
                </div>
            </div>
            {user?.username !== props.username && (
                <Button
                    variant={isFollowed ? "secondary" : "default"}
                    className={"flex-1 max-w-24 font-semibold"}
                    size={"sm"}
                    onClick={handleToggleFollow}>
                    {isFollowed ? "Following" : "Follow"}
                </Button>
            )}
        </Link>
    )
}

export default FollowsListItem

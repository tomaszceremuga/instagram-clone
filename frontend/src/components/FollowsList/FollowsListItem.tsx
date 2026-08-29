import { memo } from "react"
import Link from "next/link"

import ToggleFollowButton from "../ToggleFollowButton"

type Props = {
    username: string
    name: string
    avatar: string
    isFollowedInitial: boolean
}

const FollowsListItem = memo((props: Props) => {
    return (
        <div className="flex rounded justify-between w-full items-center">
            <Link href={`${props.username}`} className="flex">
                <div className="rounded-full size-10 overflow-hidden border border-gray-300 mr-3  shrink-0">
                    <img src={props.avatar} className="w-full h-full object-cover object-center" />
                </div>
                <div className="h-full text-xs md:text-sm flex flex-col justify-between">
                    <p className="font-semibold">{props.username}</p>
                    <p className="text-gray-500">{props.name}</p>
                </div>
            </Link>
            <ToggleFollowButton
                usernameToFollow={props.username}
                isFollowedInitial={props.isFollowedInitial}
            />
        </div>
    )
})

export default FollowsListItem

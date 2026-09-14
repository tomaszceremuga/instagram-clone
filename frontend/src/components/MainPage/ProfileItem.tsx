import { memo } from "react"

import { SearchedProfile } from "@/types"

import MiniProfileTrigger from "../MiniProfileTrigger"
import ToggleFollowButton from "../ToggleFollowButton"
import RoundedAvatar from "../ui/rounded-avatar"

type Props = {
    profile: SearchedProfile
}

const ProfileItem = memo((props: Props) => {
    return (
        <MiniProfileTrigger username={props.profile.username}>
            <div className="flex items-center p-3 rounded-xl hover:bg-gray-100 text-[0.95rem]">
                <RoundedAvatar src={props.profile.avatar} className="size-12 mr-4" />
                <div className="flex flex-col justify-between h-full w-full">
                    <p className="font-semibold">{props.profile.username}</p>
                    <p className="text-gray-500">{props.profile.name}</p>
                </div>
                <ToggleFollowButton
                    className="text-sm"
                    usernameToFollow={props.profile.username}
                    isTypeGhost={true}
                    isFollowedInitial={props.profile.isFollowed ?? true}
                />
            </div>
        </MiniProfileTrigger>
    )
})

export default ProfileItem

import { memo } from "react"
import Link from "next/link"

import useIsMobile from "@/hooks/useIsMobile"
import { SearchedProfile } from "@/types"

import MiniProfileTrigger from "../MiniProfileTrigger"
import ToggleFollowButton from "../ToggleFollowButton"
import RoundedAvatar from "../ui/rounded-avatar"

type Props = {
    profile: SearchedProfile
}

const ProfileItem = memo((props: Props) => {
    const isMobile = useIsMobile()

    if (isMobile) {
        return (
            <Link
                className=" pt-2  pr-2 flex flex-col items-center justify-center h-full w-1/4 text-center "
                href={`/${props.profile.username}`}
            >
                <RoundedAvatar src={props.profile.avatar} className="size-14 mr-0 mb-2" />
                <p className="text-sm">
                    {props.profile.username.length > 8
                        ? `${props.profile.username.slice(0, 8)}...`
                        : props.profile.username}
                </p>
            </Link>
        )
    } else {
        return (
            <MiniProfileTrigger username={props.profile.username}>
                <div className="flex items-center p-3 rounded-xl hover:bg-gray-100 text-[0.95rem] cursor-pointer">
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
                        isPendingInitial={props.profile.isPending}
                    />
                </div>
            </MiniProfileTrigger>
        )
    }
})

export default ProfileItem

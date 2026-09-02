import { useEffect, useState } from "react"

import { useAuth } from "@/hooks/useAuth"
import { getMiniProfile } from "@/lib/miniProfileCache"
import { cn } from "@/lib/utils"
import { MiniProfile } from "@/types"

import ToggleFollowButton from "./ToggleFollowButton"

type Props = {
    username: string
}

const MiniProfileView = (props: Props) => {
    const [miniProfile, setMiniProfile] = useState<MiniProfile | null>(null)
    const { user } = useAuth()

    useEffect(() => {
        getMiniProfile(props.username).then(setMiniProfile)
    }, [])

    return (
        <div className="w-90">
            <div className="flex p-4 pb-0">
                <img
                    src={miniProfile?.avatar}
                    className=" size-16 mt-0.5 mr-4 cursor-pointer rounded-full  border border-gray-300 shrink-0"
                />
                <div>
                    <p className="font-bold text-base my-1 ">{miniProfile?.username}</p>
                    <p className="text-gray-500">{miniProfile?.name}</p>
                </div>
            </div>
            <div className="px-4 py-6  flex font-semibold items-center justify-center gap-10">
                <div className="flex-1 text-center">
                    {miniProfile?.postsCount}
                    <p>posts</p>
                </div>

                <div className="flex-1 text-center">
                    {miniProfile?.followersCount}
                    <p>followers</p>
                </div>

                <div className="flex-1 text-center">
                    {miniProfile?.followingCount}
                    <p>following</p>
                </div>
            </div>
            {miniProfile?.isPrivate ? (
                <div className="p-8 border-y flex gap-2 flex-col text-center  items-center">
                    <svg
                        aria-label=""
                        fill="currentColor"
                        className="size-14"
                        height="48"
                        role="img"
                        viewBox="0 0 96 96"
                        width="48"
                    >
                        <title></title>
                        <circle
                            cx="48"
                            cy="48"
                            fill="none"
                            r="47"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                        ></circle>
                        <path
                            d="M60.931 70.001H35.065a5.036 5.036 0 0 1-5.068-5.004V46.005A5.036 5.036 0 0 1 35.065 41H60.93a5.035 5.035 0 0 1 5.066 5.004v18.992A5.035 5.035 0 0 1 60.93 70ZM37.999 39.996v-6.998a10 10 0 0 1 20 0v6.998"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                        ></path>
                    </svg>
                    <p className="font-semibold">This profile is private</p>
                    <p className="text-gray-500">Follow to see their photos and videos.</p>
                </div>
            ) : miniProfile?.recentPostThumbnails &&
              miniProfile?.recentPostThumbnails.length > 0 ? (
                <div className="flex">
                    <div className="w-1/3 aspect-square">
                        <img src={miniProfile?.recentPostThumbnails[0]} />
                    </div>
                    <div className="w-1/3 aspect-square">
                        <img src={miniProfile?.recentPostThumbnails[1]} />
                    </div>
                    <div className="w-1/3 aspect-square">
                        <img src={miniProfile?.recentPostThumbnails[2]} />
                    </div>
                </div>
            ) : (
                <div className="p-8 border-y flex gap-2 flex-col text-center  items-center">
                    <svg
                        className="size-14"
                        aria-label="Camera"
                        fill="currentColor"
                        height="62"
                        role="img"
                        viewBox="0 0 96 96"
                        width="62"
                    >
                        <title>Camera</title>
                        <circle
                            cx="48"
                            cy="48"
                            fill="none"
                            r="47"
                            stroke="currentColor"
                            strokeMiterlimit="10"
                            strokeWidth="2"
                        ></circle>
                        <ellipse
                            cx="48.002"
                            cy="49.524"
                            fill="none"
                            rx="10.444"
                            ry="10.476"
                            stroke="currentColor"
                            strokeLinejoin="round"
                            strokeWidth="2.095"
                        ></ellipse>
                        <path
                            d="M63.994 69A8.02 8.02 0 0 0 72 60.968V39.456a8.023 8.023 0 0 0-8.01-8.035h-1.749a4.953 4.953 0 0 1-4.591-3.242C56.61 25.696 54.859 25 52.469 25h-8.983c-2.39 0-4.141.695-5.181 3.178a4.954 4.954 0 0 1-4.592 3.242H32.01a8.024 8.024 0 0 0-8.012 8.035v21.512A8.02 8.02 0 0 0 32.007 69Z"
                            fill="none"
                            stroke="currentColor"
                            strokeLinejoin="round"
                            strokeWidth="2"
                        ></path>
                    </svg>
                    <p className="font-semibold">No posts yet</p>
                    <p className="text-gray-500">
                        When {miniProfile?.username} shares photos, you'll see them here.
                    </p>
                </div>
            )}
            <div className="pb-5">
                <ToggleFollowButton
                    className="w-full"

                    isFollowedInitial={miniProfile?.isFollowed ?? false}
                    usernameToFollow={miniProfile?.username ?? ""}
                />
            </div>
        </div>
    )
}

export default MiniProfileView

import { useEffect, useRef, useState } from "react"

import { api } from "@/lib/api"
import { cn } from "@/lib/utils"
import { SearchedProfile } from "@/types"

import Loading from "../Loading"
import MiniProfileTrigger from "../MiniProfileTrigger"
import ToggleFollowButton from "../ToggleFollowButton"
import RoundedAvatar from "../ui/rounded-avatar"

type Props = {
    userName: string
    currentView: "for you" | "following"
    className: string
}

const ProfilesList = (props: Props) => {
    const [isLoading, setIsLoading] = useState(false)
    const [profiles, setProfiles] = useState<SearchedProfile[]>([])
    const [nextCursor, setNextCursor] = useState<number | null>(null)
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const delayRef = useRef(0)

    const fetchSuggestedProfiles = async () => {
        setIsLoading(true)
        try {
            const res = await api.get("/random-profiles")
            setProfiles(res.data.result)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const fetchFollowedProfiles = async (cursoerOverride?: number | null) => {
        setIsLoading(true)

        try {
            let url = `/users/${props.userName}/following`
            const cursorToUse = cursoerOverride !== undefined ? cursoerOverride : nextCursor

            if (cursorToUse) {
                url += `?cursor=${cursorToUse}`
            }

            const res = await api.get(url)
            if (cursorToUse) {
                setProfiles((prev) => [...prev, ...(res.data.users ?? [])])
            } else {
                setProfiles(res.data.users ?? [])
            }
            setNextCursor(res.data.nextCursor)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
            delayRef.current = 500
        }
    }

    useEffect(() => {
        if (props.currentView === "for you") {
            fetchSuggestedProfiles()
        } else {
            setNextCursor(null)
            fetchFollowedProfiles(null)
        }
    }, [props.currentView])

    return (
        <div className={props.className}>
            <p className="font-semibold pt-6 pb-3">
                {props.currentView === "for you" ? "Suggested for you" : "Following"}
            </p>
            {isLoading ? (
                <Loading size="width" className="h-100" />
            ) : (
                <div
                    className={cn(
                        props.currentView === "following" &&
                            profiles?.length > 5 &&
                            "overflow-y-scroll h-100",
                    )}
                    ref={scrollContainerRef}
                >
                    {profiles.map((profile) => (
                        <MiniProfileTrigger username={profile.username} key={profile.id}>
                            <div className="flex items-center p-3 rounded-xl hover:bg-gray-100 text-[0.95rem]">
                                <RoundedAvatar src={profile.avatar} className="size-12 mr-4" />
                                <div className="flex flex-col justify-between h-full w-full">
                                    <p className="font-semibold">{profile.username}</p>
                                    <p className="text-gray-500">{profile.name}</p>
                                </div>
                                <ToggleFollowButton
                                    className="text-sm"
                                    usernameToFollow={profile.username}
                                    isTypeGhost={true}
                                    isFollowedInitial={profile.isFollowed ?? true}
                                />
                            </div>
                        </MiniProfileTrigger>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ProfilesList

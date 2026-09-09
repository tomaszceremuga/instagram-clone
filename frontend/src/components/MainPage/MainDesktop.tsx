import { useEffect, useRef, useState } from "react"

import { useAuth } from "@/hooks/useAuth"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"
import { SearchedProfile } from "@/types"

import Loading from "../Loading"
import MiniProfileTrigger from "../MiniProfileTrigger"
import ToggleFollowButton from "../ToggleFollowButton"
import RoundedAvatar from "../ui/rounded-avatar"

type Props = {}

const MainDesktop = (props: Props) => {
    const { user } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [areProfilesLading, setAreProfilesLading] = useState(false)
    const [currentView, setCurrentView] = useState<"for you" | "following">("for you")
    const [profilesToShow, setProfilesToShow] = useState<SearchedProfile[] | null>(null)
    const [profilesNextCursor, setProfilesNextCursor] = useState<number | null>(null)
    const profilesScrollContainerRef = useRef<HTMLDivElement>(null)
    const profilesTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const profilesDelayRef = useRef(0)

    if (isLoading) {
        return <Loading size="screen" />
    }

    const fetchSuggestedProfiles = async () => {
        setAreProfilesLading(true)
        try {
            const res = await api.get("/random-profiles")
            console.log(res.data.result)
            setProfilesToShow(res.data.result)
        } catch (error) {
            console.error(error)
        } finally {
            setAreProfilesLading(false)
        }
    }

    const fetchFollowedProfiles = async (cursoerOverride?: number | null) => {
        setAreProfilesLading(true)

        try {
            let url = `/users/${user?.username}`
            const cursorToUse = cursoerOverride !== undefined ? cursoerOverride : profilesNextCursor

            if (cursorToUse) {
                url += `/cursor=${cursorToUse}`
            }

            url += "/following"

            const res = await api.get(url)
            console.log("fetch + " + url)
            console.log(res.data.users)

            setProfilesToShow(res.data.users ?? [])
            setProfilesNextCursor(res.data.nextCursor)
        } catch (error) {
            console.log(error)
        } finally {
            setAreProfilesLading(false)
            profilesDelayRef.current = 500
        }
    }

    const setForYou = async () => {
        setCurrentView("for you")
        fetchSuggestedProfiles()
    }
    const setFollowing = async () => {
        setCurrentView("following")
        fetchFollowedProfiles()
    }

    useEffect(() => {
        setForYou()
    }, [])

    return (
        <div className="w-full flex flex-col items-center px-30 ">
            <div className="w-full max-w-200 pb-0 p-0 pt-15 ">
                <div className="w-full border-b">
                    <button
                        className={cn(
                            currentView === "following" && "text-gray-500",
                            "text-lg font-semibold cursor-pointer hover:underline p-3",
                        )}
                        onClick={setForYou}
                    >
                        For you
                    </button>

                    <button
                        className={cn(
                            currentView === "for you" && "text-gray-500",
                            "text-lg font-semibold cursor-pointer hover:underline p-3",
                        )}
                        onClick={setFollowing}
                    >
                        Following
                    </button>
                </div>
                <div className="flex">
                    <div className="w-6/10 h-500 "></div>
                    <div className="w-4/10 h-500 ">
                        <p className="font-semibold pt-6 pb-3">
                            {currentView === "for you" ? "Suggested for you" : "Following"}
                        </p>
                        {areProfilesLading && <Loading size="width" className="h-100" />}
                        <div
                            className={cn(currentView === "following" && "overflow-y-scroll h-100")}
                            ref={profilesScrollContainerRef}
                        >
                            {profilesToShow &&
                                profilesToShow.map((profile) => (
                                    <MiniProfileTrigger
                                        username={profile.username}
                                        key={profile.id}
                                    >
                                        <div className="flex items-center p-3 rounded-xl hover:bg-gray-100 text-[0.95rem]">
                                            <RoundedAvatar
                                                src={profile.avatar}
                                                className="size-12 mr-4"
                                            />
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
                    </div>
                </div>
            </div>
            <div className="flex"></div>
        </div>
    )
}

export default MainDesktop

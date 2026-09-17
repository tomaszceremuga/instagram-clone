import { useEffect, useRef, useState } from "react"

import { api } from "@/lib/api"
import { cn } from "@/lib/utils"
import { SearchedProfile } from "@/types"

import Loading from "../Loading"
import ProfileItem from "./ProfileItem"

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
            <p className="font-semibold pt-6 pb-3 hidden md:block">
                {props.currentView === "for you" ? "Suggested for you" : "Following"}
            </p>
            {isLoading ? (
                <Loading size="width" className="h-100" />
            ) : (
                <div
                    className={cn(
                        "flex md:flex-col md:h-100 p-2  md:py-0",

                        props.currentView === "following" &&
                            profiles?.length > 5 &&
                            "md:h-100 md:overflow-x-visible md:overflow-y-scroll",
                        profiles?.length > 4 &&
                            "overflow-x-scroll md:flex-col md:h-100 md:overflow-x-visible md:overflow-y-scroll",
                    )}
                    ref={scrollContainerRef}
                >
                    {profiles.map((profile) => (
                        <ProfileItem profile={profile} key={profile.id} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default ProfilesList

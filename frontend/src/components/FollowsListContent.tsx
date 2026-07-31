import { useEffect, useRef, useState } from "react"
import { FadeLoader } from "react-spinners"

import { api } from "@/lib/api"

import FollowsListItem from "./FollowsListItem"
import SearchInput from "./ui/search-input"

type Props = {
    type: "followers" | "following"
    username: string
}

type Profile = {
    id: number
    username: string
    avatar: string
    name: string
    isFollowed: boolean
}

const FollowsListContent = (props: Props) => {
    const [inputValue, setInputValue] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [profiles, setProfiles] = useState<Profile[] | null>(null)
    const [nextCursor, setNextCursor] = useState<number | null>(null)
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const delayRef = useRef(0)

    const fetchFollows = async (cursoerOverride?: number | null) => {
        setIsLoading(true)

        try {
            let url = `/users/${props.username}/${props.type}`

            const cursorToUse = cursoerOverride !== undefined ? cursoerOverride : nextCursor

            if (inputValue) {
                url += `?searchValue=${inputValue}`
            }

            if (cursorToUse) {
                url += `${inputValue ? "&" : "?"}cursor=${cursorToUse}`
            }

            console.log("fetch " + url)
            const res = await api.get(url)

            setProfiles(res.data.users ?? [])

            setNextCursor(res.data.nextCursor)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
            delayRef.current = 500
        }
    }

    useEffect(() => {
        const handleScroll = (e: Event) => {
            const element = e.target as HTMLDivElement

            if (element.scrollHeight - element.scrollTop <= element.clientHeight + 100) {
                if (!isLoading && nextCursor) {
                    fetchFollows()
                }
            }
        }

        scrollContainerRef.current?.addEventListener("scroll", handleScroll)

        return () => scrollContainerRef.current?.removeEventListener("scroll", handleScroll)
    }, [isLoading, nextCursor])

    useEffect(() => {
        setNextCursor(null)

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => fetchFollows(null), delayRef.current)

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [inputValue])

    return (
        <div className=" py-4 w-full mb-4">
            <div className="px-4">
                <SearchInput value={inputValue} setValue={setInputValue} />
            </div>
            <div
                ref={scrollContainerRef}
                className="w-full flex flex-col gap-4 mt-5 overflow-y-scroll scrollbar-gutter-stable h-84 pr-4 pb-4 pl-4"
            >
                {profiles?.map((profile, index) => (
                    <FollowsListItem
                        name={profile.name}
                        username={profile.username}
                        avatar={profile.avatar}
                        isFollowedInitial={profile.isFollowed}
                        key={`${index}-${profile.id}`}
                    />
                ))}
                {isLoading && (
                    <div className="w-full flex justify-center pt-5 pl-10">
                        <FadeLoader color="#707070" height={7} margin={-10} radius={8} width={2} />
                    </div>
                )}
            </div>
        </div>
    )
}

export default FollowsListContent

import { useEffect, useState } from "react"

import { api } from "@/lib/api"
import { cn } from "@/lib/utils"
import { SearchedProfile } from "@/types"

import Loading from "../Loading"
import RoundedAvatar from "../ui/rounded-avatar"

type Props = {}

const MainDesktop = (props: Props) => {
    const [isLoading, setIsLoading] = useState(false)
    const [areSuggestedLading, setAreSuggestedLading] = useState(false)
    const [activePage, setActivePage] = useState<"for you" | "following">("for you")
    const [suggestedProfiles, setSuggestedProfiles] = useState<SearchedProfile[] | null>(null)

    if (isLoading) {
        return <Loading size="screen" />
    }

    useEffect(() => {
        const fetchSuggested = async () => {
            setAreSuggestedLading(true)
            try {
                const res = await api.get("/random-profiles")
                setSuggestedProfiles(res.data.result)
            } catch (error) {
                console.error(error)
            } finally {
                setAreSuggestedLading(false)
            }
        }
        fetchSuggested()
    }, [])

    return (
        <div className="w-full flex flex-col items-center px-30 ">
            <div className="w-full max-w-200 pb-0 p-0 pt-15 ">
                <div className="w-full border-b">
                    <button
                        className={cn(
                            activePage === "following" && "text-gray-500",
                            "text-lg font-semibold cursor-pointer hover:underline p-3",
                        )}
                        onClick={() => setActivePage("for you")}
                    >
                        For you
                    </button>
                    <button
                        className={cn(
                            activePage === "for you" && "text-gray-500",
                            "text-lg font-semibold cursor-pointer hover:underline p-3",
                        )}
                        onClick={() => setActivePage("following")}
                    >
                        Following
                    </button>
                </div>
                <div className="flex">
                    <div className="w-2/3 h-500 bg-red-500"></div>
                    <div className="w-1/3 h-500 bg-blue-500">
                        <p>Suggested for you</p>
                        {areSuggestedLading && <Loading size="width" className="h-full" />}
                        <div>
                            {suggestedProfiles &&
                                suggestedProfiles.map((suggestedProfile) => (
                                    <div className="flex" key={suggestedProfile.id}>
                                        <RoundedAvatar src={suggestedProfile.avatar} />
                                    </div>
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

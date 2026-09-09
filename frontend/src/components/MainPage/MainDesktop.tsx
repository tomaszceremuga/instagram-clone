import { useState } from "react"

import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"

import Loading from "../Loading"
import ProfilesList from "./ProfilesList"

type Props = {}

const MainDesktop = (props: Props) => {
    const { user, isLoading } = useAuth()
    const [currentView, setCurrentView] = useState<"for you" | "following">("for you")

    if (isLoading) {
        return <Loading size="screen" />
    }

    return (
        <div className="w-full flex flex-col items-center px-30 ">
            <div className="w-full max-w-200 pb-0 p-0 pt-15 ">
                <div className="w-full border-b">
                    <button
                        className={cn(
                            currentView === "following" && "text-gray-500",
                            "text-lg font-semibold cursor-pointer hover:underline p-3",
                        )}
                        onClick={() => setCurrentView("for you")}
                    >
                        For you
                    </button>

                    <button
                        className={cn(
                            currentView === "for you" && "text-gray-500",
                            "text-lg font-semibold cursor-pointer hover:underline p-3",
                        )}
                        onClick={() => setCurrentView("following")}
                    >
                        Following
                    </button>
                </div>
                <div className="flex">
                    <div className="w-6/10 h-500 "></div>
                    <ProfilesList currentView={currentView} userName={user?.username ?? ""} />
                </div>
            </div>
        </div>
    )
}

export default MainDesktop

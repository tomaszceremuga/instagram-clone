import { ReactElement, useState } from "react"
import { X } from "lucide-react"
import { FadeLoader } from "react-spinners"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog"
import { api } from "@/lib/api"

import FollowsListItem from "./FollowsListItem"
import SearchInput from "./ui/search-input"

type Props = {
    children: ReactElement
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

const FollowsList = (props: Props) => {
    const [inputValue, seInputValue] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [profiles, setProfiles] = useState<Profile[] | null>(null)

    const fetchFollows = async () => {
        setIsLoading(true)

        try {
            const res = await api.get(`/users/${props.username}/${props.type}`)
            console.log(res.data)
            setProfiles((prevProfiles) => [...(prevProfiles ?? []), ...(res.data.users ?? [])])
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            <Dialog>
                <DialogTrigger render={props.children} />
                <DialogContent className="sm:max-w-md" showCloseButton={false}>
                    <DialogHeader>
                        <p className="w-full text-center font-semibold text-base border-b p-3  border-gray-300">
                            {props.type === "followers"
                                ? "Followers"
                                : props.type === "following" && "Following"}
                        </p>
                        <DialogClose
                            className={"absolute right-3 top-3"}
                            render={
                                <button className="cursor-pointer">
                                    <X />
                                </button>
                            }
                        />
                    </DialogHeader>
                    <div className=" py-4 w-full mb-4">
                        <div className="px-4">
                            <SearchInput value={inputValue} setValue={seInputValue} />
                        </div>
                        <div className="w-full flex flex-col gap-4 mt-5 overflow-y-scroll scrollbar-gutter-stable h-80 pr-4 pb-5 pl-4">
                            {profiles?.map((profile, index) => (
                                <FollowsListItem
                                    name={profile.name}
                                    username={profile.username}
                                    avatar={profile.avatar}
                                    isFollowedInitial={profile.isFollowed}
                                    key={`${index}-${profile.id}`}
                                />
                            ))}
                            <p onClick={fetchFollows} className="text-center bg-purple-400">
                                load more
                            </p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default FollowsList

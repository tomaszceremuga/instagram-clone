"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"

import Loading from "@/components/Loading"
import RoundedAvatar from "@/components/ui/rounded-avatar"
import SearchInput from "@/components/ui/search-input"
import useIsMobile from "@/hooks/useIsMobile"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"
import { SearchedProfile } from "@/types"

type Props = {}

const page = (props: Props) => {
    const [inputValue, setInputValue] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [searchedProfiles, setSearchedProfiles] = useState<SearchedProfile[] | null>(null)
    const [nextCursor, setNextCursor] = useState<number | null>(null)
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const delayRef = useRef(0)
    const isMobile = useIsMobile()
    const router = useRouter()

    const fetchUsers = async (cursoerOverride?: number | null) => {
        setIsLoading(true)

        try {
            const cursorToUse = cursoerOverride !== undefined ? cursoerOverride : nextCursor

            if (!inputValue) {
                setSearchedProfiles(null)
                return
            }

            const res = await api.get("/search", {
                params: {
                    searchValue: inputValue,
                    ...(cursorToUse && { cursor: cursorToUse }),
                },
            })

            setSearchedProfiles(res.data.users ?? [])
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
                    fetchUsers()
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

        timeoutRef.current = setTimeout(() => fetchUsers(null), delayRef.current)

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [inputValue])

    return (
        <div className="w-full flex flex-col items-center md:px-30">
            {isMobile && (
                <div className="md:invisible w-full flex items-center justify-center bg-white fixed h-12">
                    <button className=" left-5 absolute" onClick={() => router.back()}>
                        <ChevronLeft size={"24"} />
                    </button>
                    <p>Search</p>
                </div>
            )}
            <div className="w-full md:max-w-175 p-5 pt-15 pb-0 md:p-0 md:pt-15 ">
                <SearchInput
                    className="h-11 rounded-full bg-gray-100 gap-2 px-4"
                    setValue={setInputValue}
                    value={inputValue}
                />
                <div className={cn("w-full h-20 py-4")} ref={scrollContainerRef}>
                    {searchedProfiles?.length === 0 && (
                        <p className="text-gray-500 text-center mt-2">No results found.</p>
                    )}
                    {searchedProfiles?.map((profile) => (
                        <Link
                            href={`/${profile.username}`}
                            className="w-full flex justify-between items-center cursor-pointer rounded-lg hover:bg-gray-100 p-4"
                            key={profile.id}
                        >
                            <div className="flex items-center">
                                <RoundedAvatar src={profile.avatar} />
                                <div className="flex flex-col ml-1 justify-between">
                                    <p className="font-semibold">{profile.username}</p>
                                    <p className="text-gray-500 text-sm">{profile.name}</p>
                                </div>
                            </div>
                            <ChevronRight className="text-gray-500" />
                        </Link>
                    ))}
                    {}
                    {isLoading && <Loading size="width" className="mt-5" />}
                </div>
            </div>
        </div>
    )
}

export default page

"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuthContext } from "@/context/AuthContext"
import { ChevronLeft } from "lucide-react"
import { FadeLoader } from "react-spinners"

import FollowsList from "@/components/FollowsList/FollowsList"
import NotaAvailable from "@/components/NotaAvailable"
import PostsGrid from "@/components/PostsGrid"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { Profile } from "@/types"

const ProfilePage = () => {
    const router = useRouter()
    const params = useParams()
    const { user, isReady } = useAuthContext()
    const profileUsername = params.username as string
    const [isLoading, setIsLoading] = useState(true)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [isFollowed, setIsFollowed] = useState(false)

    const [isBioExpanded, setIsBioExpanded] = useState(false)

    const handleToggleFollow = async () => {
        try {
            if (isFollowed) {
                await api.post(`/unfollow/${profileUsername}`)
                setIsFollowed(false)
            } else {
                await api.post(`/follow/${profileUsername}`)
                setIsFollowed(true)
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (isReady && profileUsername === user?.username) {
            router.push("/my-profile")
        }
    }, [isReady, profileUsername, user, router])

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true)

            try {
                const res = await api.get(`/profile/${profileUsername}`)
                setProfile(res.data)
            } catch (error) {
                console.log(error)
                setProfile(null)
            } finally {
                setIsLoading(false)
            }
        }

        fetchProfile()
    }, [profileUsername])

    useEffect(() => {
        const fetchIsFollowed = async () => {
            setIsLoading(true)

            try {
                const res = await api.get(`/check-follow/${profileUsername}`)
                console.log(res.data)
                setIsFollowed(res.data.isFollowed)
            } catch (error) {
                console.log(error)
                setIsFollowed(false)
            } finally {
                setIsLoading(false)
            }
        }
        fetchIsFollowed()
    }, [])

    if (!isReady || isLoading) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <FadeLoader color="#707070" height={7} margin={-10} radius={8} width={2} />
            </div>
        )
    }

    if (!profile) {
        return <NotaAvailable />
    }

    const bio = profile.bio ? profile.bio : " "

    const shortBio =
        profile.bio && profile?.bio.length > 120 ? profile.bio.slice(0, 120) + "..." : profile.bio

    return (
        <div className="w-full flex flex-col items-center md:px-30 ">
            <div className="md:invisible w-full flex items-center justify-center bg-white fixed h-12">
                <button className=" left-5 absolute" onClick={() => router.back()}>
                    <ChevronLeft size={"24"} />
                </button>
                <p>{profile.username}</p>
            </div>
            <div className="w-full md:max-w-175 p-5 pt-15 pb-0 md:p-0 md:pt-15 ">
                <div className="flex lg:pb-5">
                    <div className="rounded-full size-24 md:size-34 overflow-hidden border border-gray-300 mr-5 md:mr-8 shrink-0">
                        <img
                            src={profile.avatar}
                            className="w-full h-full object-cover object-center"
                        />
                    </div>
                    <div className="w-full h-24 md:h-34 p-1 flex flex-col lg:gap-2 ">
                        <div>
                            <div className="flex gap-2 text-2xl font-semibold items-center ">
                                <p className="mb-1">{profile.username}</p>
                            </div>
                            <p className="hidden md:block">{profile.name}</p>
                        </div>

                        <div className="flex w-full md:max-w-2/3 h-full items-center text-xs sm:text-sm">
                            <button className="md:flex mr-5">
                                <p className="font-bold md:mr-1 ">{profile.postsCount}</p>
                                <p>posts</p>
                            </button>

                            {profile.followersCount === 0 ? (
                                <button className="md:flex mr-5 hover:cursor-pointer hover:underline">
                                    <p className="font-bold md:mr-1">{profile.followersCount}</p>
                                    <p>followers</p>
                                </button>
                            ) : (
                                <FollowsList username={profileUsername} type="followers">
                                    <button className="md:flex mr-5 hover:cursor-pointer hover:underline">
                                        <p className="font-bold md:mr-1">
                                            {profile.followersCount}
                                        </p>
                                        <p>followers</p>
                                    </button>
                                </FollowsList>
                            )}

                            {profile.followingCount === 0 ? (
                                <button className="md:flex  hover:cursor-pointer hover:underline">
                                    <p className="font-bold md:mr-1">{profile.followingCount}</p>
                                    <p>following</p>
                                </button>
                            ) : (
                                <FollowsList username={profileUsername} type="following">
                                    <button className="md:flex  hover:cursor-pointer hover:underline">
                                        <p className="font-bold md:mr-1">
                                            {profile.followingCount}
                                        </p>
                                        <p>following</p>
                                    </button>
                                </FollowsList>
                            )}
                        </div>
                        <div className="w-9/10 text-sm hidden lg:block lg:mt-1">
                            <p>
                                {isBioExpanded ? bio : shortBio}{" "}
                                {!isBioExpanded && bio.length > 120 && (
                                    <span
                                        onClick={() => setIsBioExpanded(true)}
                                        className="text-gray-500 hover:underline cursor-pointer"
                                    >
                                        more
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
                <p className="md:hidden md:h-0 max-w-2/3 font-semibold my-4 md:mt-4">name</p>
                <div className="w-2/3 text-sm md:mt-5 lg:hidden">
                    <p>
                        {isBioExpanded ? bio : shortBio}{" "}
                        {!isBioExpanded && bio.length > 120 && (
                            <span
                                onClick={() => setIsBioExpanded(true)}
                                className="text-gray-500 hover:underline cursor-pointer"
                            >
                                more
                            </span>
                        )}
                    </p>
                </div>
                <div className="flex w-full md:mt-10 md:mb-15 gap-2 my-6">
                    <Button
                        variant={isFollowed ? "secondary" : "default"}
                        className={"flex-1"}
                        size={"lg"}
                        onClick={handleToggleFollow}
                    >
                        {isFollowed ? "Following" : "Follow"}
                    </Button>
                    <Button variant="secondary" className={"flex-1"} size={"lg"}>
                        Message
                    </Button>
                </div>
            </div>
            <PostsGrid className="xl:max-w-2/3" username={profileUsername} />
        </div>
    )
}

export default ProfilePage

"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/context/AuthContext"
import { Avatar } from "@base-ui/react"
import { ChevronLeft } from "lucide-react"

import ChangeAvatar from "@/components/ChangeAvatar"
import CreateNewPost from "@/components/CreateNewPost/CreateNewPost"
import FollowsList from "@/components/FollowsList/FollowsList"
import Loading from "@/components/Loading"
import NotaAvailable from "@/components/NotaAvailable"
import PostsGrid from "@/components/PostsGrid"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { api } from "@/lib/api"
import { Profile } from "@/types"

const ProfilePage = () => {
    const router = useRouter()
    const { user, isReady } = useAuthContext()
    const [profile, setProfile] = useState<Profile | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isBioExpanded, setIsBioExpanded] = useState(false)

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true)

            try {
                const res = await api.get(`/profile/${user?.username}`)
                setProfile(res.data)
            } catch (error) {
                console.log(error)
                setProfile(null)
            } finally {
                setIsLoading(false)
            }
        }

        fetchProfile()
    }, [user?.username])

    if (!isReady || isLoading) {
        return <Loading size="screen" />
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
                <div className="flex items-center lg:pb-5">
                    <div className="aspect-square size-20 md:size-32 mr-4 md:mr-6 ">
                        <ChangeAvatar initialAvatar={profile.avatar} />
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

                            {profile.followersCount === 0 || !user?.username ? (
                                <button className="md:flex mr-5 hover:cursor-pointer hover:underline">
                                    <p className="font-bold md:mr-1">{profile.followersCount}</p>
                                    <p>followers</p>
                                </button>
                            ) : (
                                <FollowsList username={user.username} type="followers">
                                    <button className="md:flex mr-5 hover:cursor-pointer hover:underline">
                                        <p className="font-bold md:mr-1">
                                            {profile.followersCount}
                                        </p>
                                        <p>followers</p>
                                    </button>
                                </FollowsList>
                            )}

                            {profile.followingCount === 0 || !user?.username ? (
                                <button className="md:flex  hover:cursor-pointer hover:underline">
                                    <p className="font-bold md:mr-1">{profile.followingCount}</p>
                                    <p>following</p>
                                </button>
                            ) : (
                                <FollowsList username={user.username} type="following">
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
                <p className="md:hidden md:h-0 max-w-2/3 font-semibold my-2 md:mt-4">name</p>
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
                <div className="flex w-full md:mt-10 md:mb-15 gap-2 my-6 mt-4 ">
                    <div className="w-1/2">
                        <CreateNewPost>
                            <Button variant="default" className={"w-full"} size={"lg"}>
                                New post
                            </Button>
                        </CreateNewPost>
                    </div>
                    <Link href={"/my-profile/edit"} className="w-1/2">
                        <Button variant={"secondary"} size={"lg"} className={"w-full"}>
                            Edit profile
                        </Button>
                    </Link>
                </div>
            </div>
            <PostsGrid
                className="xl:max-w-2/3"
                username={profile.username ?? ""}
                isAutor={true}
                isPrivate={profile.isPrivate}
                isFollowed={true}
            />
        </div>
    )
}

export default ProfilePage

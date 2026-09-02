"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/context/AuthContext"
import { ChevronLeft } from "lucide-react"
import { FadeLoader } from "react-spinners"

import CreateNewPost from "@/components/CreateNewPost/CreateNewPost"
import FollowsList from "@/components/FollowsList/FollowsList"
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
    const fileInputRef = useRef<HTMLInputElement>(null)

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

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]

        if (!file) {
            return
        }

        const formData = new FormData()
        formData.append("avatar", file)

        try {
            const res = await api.post("/upload/avatar", formData)
            setProfile((prev) => (prev ? { ...prev, avatar: res.data.avatar } : prev))
            toast.add({
                title: "Your avatar has been changed",
            })
        } catch (error) {
            console.error(error)
        }
    }

    if (!isReady || isLoading) {
        return <FadeLoader color="#707070" height={7} margin={-10} radius={8} width={2} />
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
                    <div>
                        <div className="rounded-full size-24 md:size-34 overflow-hidden border border-gray-300 mr-5 md:mr-8 shrink-0">
                            <img
                                src={profile.avatar}
                                className="w-full h-full object-cover object-center"
                            />
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/png, image/jpeg"
                            onChange={handleAvatarChange}
                            className="hidden"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className=" absolute top-15 cursor-alias flex items-center justify-center bg-black/50 rounded-full size-24 md:size-34 overflow-hidden border border-gray-300 mr-5 md:mr-8 shrink-0 "
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="size-10 fill-white opacity-100"
                            >
                                <path d="M12 9.652a3.54 3.54 0 1 0 3.54 3.539A3.543 3.543 0 0 0 12 9.65zm6.59-5.187h-.52a1.107 1.107 0 0 1-1.032-.762 3.103 3.103 0 0 0-3.127-1.961H10.09a3.103 3.103 0 0 0-3.127 1.96 1.107 1.107 0 0 1-1.032.763h-.52A4.414 4.414 0 0 0 1 8.874v9.092a4.413 4.413 0 0 0 4.408 4.408h13.184A4.413 4.413 0 0 0 23 17.966V8.874a4.414 4.414 0 0 0-4.41-4.41zM12 18.73a5.54 5.54 0 1 1 5.54-5.54A5.545 5.545 0 0 1 12 18.73z"></path>
                            </svg>
                        </button>
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
            />
        </div>
    )
}

export default ProfilePage

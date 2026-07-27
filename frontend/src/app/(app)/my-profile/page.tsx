"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuthContext } from "@/context/AuthContext"
import { ChevronLeft } from "lucide-react"

import PostsGrid from "@/components/PostsGrid"
import { Button } from "@/components/ui/button"

const ProfilePage = () => {
    const [isBioExpanded, setIsBioExpanded] = useState(false)
    const router = useRouter()
    const params = useParams()
    const profileUsername = params.username as string

    const bio =
        "Polski twórca internetowy, streamer i YouTuber, który zyskał rozpoznawalność dzięki transmisjom na żywo. Pochodzi z Pabianic, gdzie mieszka ze swoim tatą, panem Ryszardem."

    const shortBio = bio.length > 120 ? bio.slice(0, 120) + "..." : bio

    return (
        <div className="w-full flex flex-col   items-center ">
            <div className="md:invisible w-full flex items-center justify-center bg-white fixed h-12">
                <button className=" left-5 absolute" onClick={() => router.back()}>
                    <ChevronLeft size={"24"} />
                </button>
                <p>{profileUsername}</p>
            </div>
            <div className="w-full md:max-w-175 p-5 pt-15 pb-0 md:p-0 md:pt-15 ">
                <div className="flex lg:pb-5">
                    <img
                        src={"https://picsum.photos/400/400"}
                        className="rounded-full h-24 w-24 md:w-34 md:h-34 md:mr-8 border  border-gray-300 mr-5"
                    />
                    <div className="w-full h-24 md:h-34 p-1 flex flex-col lg:gap-2 ">
                        <div>
                            <div className="flex gap-2 text-2xl font-semibold items-center ">
                                <p>{profileUsername}</p>
                                <svg
                                    aria-label="Verified"
                                    fill="rgb(0, 149, 246)"
                                    height="18"
                                    role="img"
                                    viewBox="0 0 40 40"
                                    width="18">
                                    <title>Verified</title>
                                    <path
                                        d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z"
                                        fillRule="evenodd"></path>
                                </svg>
                            </div>
                            <p className="hidden md:block">name</p>
                        </div>
                        <div className="flex w-full md:max-w-2/3 h-full items-center text-sm">
                            <button className="md:flex mr-5">
                                <p className="font-bold md:mr-1 ">88</p>
                                <p>posts</p>
                            </button>

                            <button className="md:flex mr-5 hover:cursor-pointer hover:underline">
                                <p className="font-bold md:mr-1">11.2K</p>
                                <p>followers</p>
                            </button>

                            <button className="md:flex  hover:cursor-pointer hover:underline">
                                <p className="font-bold md:mr-1">134</p>
                                <p>following</p>
                            </button>
                        </div>
                        <div className="w-9/10 text-sm hidden lg:block lg:mt-1">
                            <p>
                                {isBioExpanded ? bio : shortBio}{" "}
                                {!isBioExpanded && bio.length > 120 && (
                                    <span
                                        onClick={() => setIsBioExpanded(true)}
                                        className="text-gray-500 hover:underline cursor-pointer">
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
                                className="text-gray-500 hover:underline cursor-pointer">
                                more
                            </span>
                        )}
                    </p>
                </div>
                <div className="flex w-full md:mt-10 md:mb-15 gap-2 my-6">
                    <Button variant="default" className={"flex-1"} size={"lg"}>
                        Follow
                    </Button>{" "}
                    <Button variant="secondary" className={"flex-1"} size={"lg"}>
                        Message
                    </Button>{" "}
                </div>
            </div>
            <PostsGrid className="lg:max-w-2/3" />
        </div>
    )
}

export default ProfilePage

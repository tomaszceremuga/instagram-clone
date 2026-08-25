import { ReactNode, useState } from "react"
import { useRouter } from "next/navigation"
import { View, X } from "lucide-react"

import useIsMobile from "@/hooks/useIsMobile"
import { Comment, Post } from "@/types"

import PostItemDesktop from "./PostItemDesktop"

type Props = {
    children: ReactNode
    post: Post
}

const ViewPost = (props: Props) => {
    const [isShown, setIsShown] = useState(false)
    const isMobile = useIsMobile()
    const router = useRouter()

    const handleView = () => {
        if (isMobile) {
            router.push(`/post/${props.post.id}`)
        } else {
            setIsShown(true)
        }
    }

    return (
        <>
            <div onClick={handleView}>{props.children}</div>
            {isShown && (
                <div>
                    <div
                        onClick={() => setIsShown(false)}
                        className="  invisible md:visible absolute  w-full h-full flex justify-center items-center bg-black/70 z-50 top-0 left-0"
                    >
                        <button
                            className="p-2 absolute top-4 right-4 text-white cursor-pointer"
                            onClick={() => setIsShown(false)}
                        >
                            <X size={26} />
                        </button>
                        <PostItemDesktop post={props.post} />

                        <div className="visible md:invisible">tel</div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ViewPost

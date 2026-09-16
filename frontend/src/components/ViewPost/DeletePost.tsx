import { useRef } from "react"
import { useRouter } from "next/navigation"
import { Trash } from "lucide-react"

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useAuth } from "@/hooks/useAuth"
import { api } from "@/lib/api"

import { toast } from "../ui/toast"

type Props = {
    id: number
    username: string
}

const DeletePost = (props: Props) => {
    const closeButtonRef = useRef<HTMLButtonElement>(null)
    const router = useRouter()
    const { user } = useAuth()

    const handlePostDelete = async () => {
        try {
            await api.delete(`/post/${props.id}`)

            toast.add({
                title: "Post has been deleted",
            })

            closeButtonRef.current?.click()
            router.push(`/${props.username}`)
        } catch (error) {
            console.error(error)
        }
    }

    if (user?.username !== props.username) {
        return
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger
                nativeButton={false}
                render={
                    <div className="cursor-pointer hover:bg-gray-100 p-2 rounded-full ">
                        <Trash className="size-5 " />
                    </div>
                }
            >
                Show Dialog
            </AlertDialogTrigger>
            <AlertDialogContent className={"rounded-2xl p-0"}>
                <AlertDialogTitle>Are you sure you want to delete this post?</AlertDialogTitle>
                <button
                    className="w-full p-4 h-min text-red-500 cursor-pointer hover:bg-gray-200"
                    onClick={handlePostDelete}
                >
                    Delete
                </button>
                <AlertDialogCancel ref={closeButtonRef} />
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeletePost

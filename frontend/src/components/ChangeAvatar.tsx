import { ChangeEvent, useRef, useState } from "react"
import type { Point } from "react-easy-crop"

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { api } from "@/lib/api"
import { Image } from "@/types"

import ImageCropper from "./CreateNewPost/ImageCropper"
import { createImage, getCenterCroppedImg } from "./CreateNewPost/utils"
import RoundedAvatar from "./ui/rounded-avatar"
import { toast } from "./ui/toast"

type Props = {
    initialAvatar: string
}

const ChangeAvatar = (props: Props) => {
    const closeButtonRef = useRef<HTMLButtonElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [image, setImage] = useState<Image | null>(null)

    const handleFileSelected = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        e.target.value = ""

        if (!file) {
            return
        }

        const fileUrl = URL.createObjectURL(file)
        await createImage(fileUrl)
        const outputUrl = await getCenterCroppedImg(fileUrl)

        setImage({
            fileUrl,
            outputUrl: outputUrl ?? fileUrl,
            zoom: 1,
            crop: { x: 0, y: 0 },
        })
        setIsDialogOpen(true)
    }

    const handleCropDone = (crop: Point, zoom: number, outputUrl: string) => {
        setImage((prev) => (prev ? { ...prev, crop, zoom, outputUrl } : prev))
    }

    const handleSubmit = async () => {
        if (!image) {
            return
        }

        try {
            const blob = await fetch(image.outputUrl).then((res) => res.blob())
            const formData = new FormData()
            formData.append("avatar", blob, "avatar.jpg")

            await api.post("/upload/avatar", formData)

            toast.add({ title: "Your avatar has been changed" })
            closeButtonRef.current?.click()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <div className="relative">
                <RoundedAvatar src={props.initialAvatar} className="size-24 md:size-34" />
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleFileSelected}
                    className="hidden"
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute top-0   cursor-alias flex items-center justify-center bg-black/50 rounded-full size-24 md:size-34 overflow-hidden border border-gray-300 mr-5 md:mr-8 shrink-0"
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

            <AlertDialogContent className={"rounded-2xl p-0"}>
                <AlertDialogTitle>Change avatar</AlertDialogTitle>

                {image && (
                    <div className="aspect-square relative w-full">
                        <ImageCropper image={image} isActive onCropDone={handleCropDone} />
                    </div>
                )}

                <button
                    className="text-blue-500 cursor-pointer w-full p-4 hover:bg-gray-100"
                    onClick={handleSubmit}
                >
                    Next
                </button>
                <AlertDialogCancel ref={closeButtonRef} />
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ChangeAvatar

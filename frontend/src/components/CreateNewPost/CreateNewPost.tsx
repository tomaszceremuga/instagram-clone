import { ReactElement, useRef, useState } from "react"
import { Point } from "react-easy-crop"

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { api } from "@/lib/api"

import { toast } from "../ui/toast"
import CropStep from "./CropStep"
import DescriptionStep from "./DescriptionStep"
import UploadStep from "./UploadStep"

type Props = {
    children: ReactElement
}

type Image = {
    fileUrl: string
    outputUrl: string
    zoom: number
    crop: Point
}

const CreateNewPost = (props: Props) => {
    const [currentStep, setCurrentStep] = useState(1)
    const [images, setImages] = useState<Image[]>([])
    const [description, setDescription] = useState("")
    const closeButtonRef = useRef<HTMLButtonElement>(null)

    const handleSend = async () => {
        try {
            const newPost = await api.post("/create-post", {
                media: images.map((image) => image.outputUrl),
                description,
            })

            console.log(newPost)
            closeButtonRef.current?.click()
            toast.add({
                title: "Post has been created",
            })
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger render={props.children} />
            <AlertDialogContent className={"max-w-140"}>
                {currentStep === 1 && (
                    <UploadStep setImages={setImages} handleChangeStep={() => setCurrentStep(2)} />
                )}

                {currentStep === 2 && (
                    <CropStep
                        images={images}
                        setImages={setImages}
                        handleChangeStep={() => setCurrentStep(3)}
                    />
                )}

                {currentStep === 3 && (
                    <DescriptionStep
                        handleSend={handleSend}
                        description={description}
                        setDescription={setDescription}
                    />
                )}

                <AlertDialogCancel ref={closeButtonRef} />
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default CreateNewPost

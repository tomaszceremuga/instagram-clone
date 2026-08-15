import { ReactElement, useRef, useState } from "react"

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import CropStep from "./CropStep"
import DescriptionStep from "./DescriptionStep"
import UploadStep from "./UploadStep"

type Props = {
    children: ReactElement
}

const CreateNewPost = (props: Props) => {
    const [currentStep, setCurrentStep] = useState(1)
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [croppedImages, setCroppedImages] = useState<string[]>([])
    const [description, setDescription] = useState("")
    const closeButtonRef = useRef<HTMLButtonElement>(null)

    return (
        <AlertDialog>
            <AlertDialogTrigger render={props.children} />
            <AlertDialogContent className={"max-w-140"}>
                {currentStep === 1 && (
                    <UploadStep
                        setSelectedFiles={setSelectedFiles}
                        handleChangeStep={() => setCurrentStep(2)}
                    />
                )}

                {currentStep === 2 && (
                    <CropStep
                        files={selectedFiles}
                        croppedImages={croppedImages}
                        setCroppedImages={setCroppedImages}
                        setSelectedFiles={setSelectedFiles}
                        handleChangeStep={() => setCurrentStep(3)}
                    />
                )}

                {currentStep === 3 && (
                    <DescriptionStep description={description} setDescription={setDescription} />
                )}

                <AlertDialogCancel ref={closeButtonRef} />
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default CreateNewPost

import { ReactElement, useRef, useState } from "react"

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import CropStep from "./CropStep"
import UploadStep from "./UploadStep"

type Props = {
    children: ReactElement
}

const CreateNewPost = (props: Props) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [croppedImages, setCroppedImages] = useState<string[]>([])
    const closeButtonRef = useRef<HTMLButtonElement>(null)

    return (
        <AlertDialog>
            <AlertDialogTrigger render={props.children} />
            <AlertDialogContent className={"max-w-140"}>
                {/* <UploadStep setSelectedFiles={setSelectedFiles} /> */}
                <CropStep
                    files={selectedFiles}
                    croppedImages={croppedImages}
                    setCroppedImages={setCroppedImages}
                />
                <AlertDialogCancel ref={closeButtonRef} />
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default CreateNewPost

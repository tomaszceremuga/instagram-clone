import { useState } from "react"
import Cropper, { Area, Point } from "react-easy-crop"

import { cn } from "@/lib/utils"
import { Image } from "@/types"

import { getCroppedImg } from "./utils"

type ImageCropperProps = {
    image: Image
    isActive: boolean
    onCropDone: (crop: Point, zoom: number, outputUrl: string) => void
}

const ImageCropper = ({ image, isActive, onCropDone }: ImageCropperProps) => {
    const [crop, setCrop] = useState(image.crop)
    const [zoom, setZoom] = useState(image.zoom)

    const handleCropComplete = async (_: Area, croppedPixels: Area) => {
        const croppedImage = await getCroppedImg(image.fileUrl, croppedPixels)

        if (!croppedImage) {
            return
        }

        onCropDone(crop, zoom, croppedImage)
    }

    return (
        <div
            className={cn(
                "absolute inset-0",
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none",
            )}
        >
            <Cropper
                objectFit="cover"
                restrictPosition
                roundCropAreaPixels={false}
                aspect={1}
                image={image.fileUrl}
                crop={crop}
                zoom={zoom}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
            />
        </div>
    )
}

export default ImageCropper

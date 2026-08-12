import { useState } from "react"
import type { Area, Point } from "react-easy-crop"
import Cropper from "react-easy-crop"

import { AlertDialogTitle } from "../ui/alert-dialog"

import "react-easy-crop/react-easy-crop.css"

type Props = {}

type OutputExampleProps = {
    image: string
}

const CropStep = (props: Props) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)

    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
    const [croppedImage, setCroppedImage] = useState<string | null>(null)

    function onCropComplete(_: Area, croppedPixels: Area) {
        setCroppedAreaPixels(croppedPixels)
    }

    async function showCroppedImage() {
        if (!croppedAreaPixels) {
            return
        }

        setCroppedImage(await getCroppedImg(photo, croppedAreaPixels))
    }

    async function getCroppedImg(
        imageSrc: string,
        pixelCrop: Area,
        rotation = 0,
        flip = { horizontal: false, vertical: false },
    ) {
        const image = await createImage(imageSrc)
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        if (!ctx) {
            return null
        }

        const rotRad = getRadianAngle(rotation)
        const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
            image.width,
            image.height,
            rotation,
        )

        canvas.width = bBoxWidth
        canvas.height = bBoxHeight

        ctx.translate(bBoxWidth / 2, bBoxHeight / 2)
        ctx.rotate(rotRad)
        ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1)
        ctx.translate(-image.width / 2, -image.height / 2)
        ctx.drawImage(image, 0, 0)

        const croppedCanvas = document.createElement("canvas")
        const croppedCtx = croppedCanvas.getContext("2d")

        if (!croppedCtx) {
            return null
        }

        croppedCanvas.width = pixelCrop.width
        croppedCanvas.height = pixelCrop.height

        croppedCtx.drawImage(
            canvas,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height,
        )

        return new Promise<string | null>((resolve) => {
            croppedCanvas.toBlob((file) => {
                resolve(file ? URL.createObjectURL(file) : null)
            }, "image/jpeg")
        })
    }

    function getRadianAngle(degreeValue: number) {
        return (degreeValue * Math.PI) / 180
    }

    function rotateSize(width: number, height: number, rotation: number) {
        const rotRad = getRadianAngle(rotation)

        return {
            width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
            height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
        }
    }

    function createImage(url: string) {
        return new Promise<HTMLImageElement>((resolve, reject) => {
            const image = new Image()
            image.addEventListener("load", () => resolve(image))
            image.addEventListener("error", reject)
            image.setAttribute("crossOrigin", "anonymous")
            image.src = url
        })
    }

    const photo = "/ricky.jpg"
    return (
        <>
            <AlertDialogTitle>Crop</AlertDialogTitle>
            <div className="w-full">
                {/* <img src={photo} className="size-full" /> */}
                <div className="aspect-square relative w-full">
                    <Cropper
                        objectFit={"cover"}
                        restrictPosition={true}
                        roundCropAreaPixels={false}
                        image={"/ricky.jpg"}
                        crop={crop}
                        zoom={zoom}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        aspect={1}
                        onZoomChange={setZoom}
                    />
                </div>

                <button className="w-full p-4 border-b  cursor-pointer hover:bg-gray-100  text-blue-500">
                    Next
                </button>
                {/* <button onClick={showCroppedImage} className="z-50 p-2 bg-red-500 text-white"> */}
                {/*     crop */}
                {/* </button> */}

                {/* {croppedImage ? <img src={croppedImage} alt="Cropped result" className="" /> : null} */}
            </div>
        </>
    )
}

export default CropStep

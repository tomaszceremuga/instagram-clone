import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import type { Area, Point } from "react-easy-crop"
import { Reorder } from "framer-motion"
import { Plus, X } from "lucide-react"
import { image } from "motion/react-client"
import Cropper from "react-easy-crop"
import { FadeLoader } from "react-spinners"

import { cn } from "@/lib/utils"

import { AlertDialogTitle } from "../ui/alert-dialog"

type Props = {
    files: File[]
    croppedImages: string[]
    setCroppedImages: Dispatch<SetStateAction<string[]>>
    setSelectedFiles: Dispatch<SetStateAction<File[]>>
}

type Image = {
    file: string
    output: string
    zoom: number
    crop: Point
    croppedAreaPixels: Area | null
}

const CropStep = (props: Props) => {
    const [curImage, setCurImage] = useState(0)
    const [lastDragged, setLastDragged] = useState(0)
    const [isMoving, setIsMoving] = useState(false)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
    const [isReorderShown, setIsReorderShown] = useState(false)

    const fileInputRef = useRef<HTMLInputElement>(null)

    const filesTest = [
        "/ricky.jpg",
        "/img2.png",
        "/img3.png",
        "/img4.png",
        "/img5.png",
        "/img6.png",
        "/img7.png",
    ]
    const [images, setImages] = useState<Image[]>(
        filesTest.map((file) => ({
            file: file,
            output: file,
            zoom: 1,
            crop: { x: 0, y: 0 },
            croppedAreaPixels: null,
        })),
    )

    function onCropComplete(_: Area, croppedPixels: Area) {
        setCroppedAreaPixels(croppedPixels)
    }

    // async function showCroppedImage() {
    //     if (!croppedAreaPixels) {
    //         return
    //     }
    //
    //     const newCroppedImage = await getCroppedImg(photo, croppedAreaPixels)
    //
    //     if (!newCroppedImage) {
    //         return
    //     }
    //
    //     setCroppedImages((prevImages) => [...prevImages, newCroppedImage])
    // }

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

    const handleCropChange = (e: Point) => {
        setImages((prevImages) =>
            prevImages.map((image, index) => (index === curImage ? { ...image, crop: e } : image)),
        )
    }

    const handleZoomChange = (e: number) => {
        setImages((prevImages) =>
            prevImages.map((image, index) => (index === curImage ? { ...image, zoom: e } : image)),
        )
    }

    const handleCropComplete = async (_: Area, croppedPixels: Area) => {
        setImages((prevImages) =>
            prevImages.map((image, index) =>
                index === curImage ? { ...image, croppedAreaPixels: croppedPixels } : image,
            ),
        )

        const currentImage = images[curImage]

        if (!currentImage.file) {
            return
        }

        const croppedImage = await getCroppedImg(currentImage.file, croppedPixels)

        if (!croppedImage) {
            return
        }

        props.setCroppedImages((prevImages) =>
            prevImages.map((image, index) => (index === curImage ? croppedImage : image)),
        )
    }

    const handleReorder = (newOrder: string[]) => {
        const newImages = newOrder.map((img) => images[props.croppedImages.indexOf(img)])
        setImages(newImages)
        props.setCroppedImages(newOrder)
        setCurImage(lastDragged)
    }

    const handleDeleteItem = (indexParam: number) => {
        setImages((prevImages) => prevImages.filter((_, index) => index !== indexParam))
        props.setCroppedImages((prevImages) =>
            prevImages.filter((_, index) => index !== indexParam),
        )
        setCurImage((prev) => Math.max(0, Math.min(prev, images.length - 2)))
    }

    const addFiles = (files: FileList | null) => {
        if (!files || files.length === 0) return

        const newImages = Array.from(files).map((file) => ({
            file: URL.createObjectURL(file),
            output: URL.createObjectURL(file),
            zoom: 1,
            crop: { x: 0, y: 0 },
            croppedAreaPixels: null,
        }))

        setImages((prevImages) => [...prevImages, ...newImages])
        props.setCroppedImages((prevImages) => [
            ...prevImages,
            ...newImages.map((image) => image.output),
        ])
    }

    // const images: Image[] = props.files.map((file) => ({
    //     file: URL.createObjectURL(file),
    //     output: URL.createObjectURL(file),
    //     zoom: 1,
    //     crop: { x: 0, y: 0 },
    // }))

    useEffect(() => {
        const filesTest = [
            "/ricky.jpg",
            "/img2.png",
            "/img3.png",
            "/img4.png",
            "/img5.png",
            "/img6.png",
            "/img7.png",
        ]
        setImages(
            filesTest.map((file) => ({
                file: file,
                output: file,
                zoom: 1,
                crop: { x: 0, y: 0 },
                croppedAreaPixels: null,
            })),
        )
    }, [])

    useEffect(() => {
        props.setCroppedImages(images.map((image) => image.output))
    }, [])

    useEffect(() => {
        if (!images[curImage]) {
            setCurImage(images.length - 1)
        }
    }, [curImage])

    return (
        <>
            <AlertDialogTitle>Crop</AlertDialogTitle>
            <div className="w-full">
                {/* <img src={photo} className="size-full" /> */}
                <div className=" aspect-square relative w-full ">
                    <div
                        className={cn(
                            isReorderShown && "w-full",
                            "absolute p-3 gap-1 w-full z-50 bottom-0 right-0 items-end flex flex-col",
                        )}
                    >
                        {isReorderShown && (
                            <div className="h-30 w-full flex bg-black/50 p-3 rounded-2xl hover:bg-black/70 items-center">
                                <Reorder.Group
                                    axis="x"
                                    onReorder={handleReorder}
                                    values={props.croppedImages}
                                    className="flex gap-3 h-full overflow-x-scroll scrollbar-thumb-white/70 pb-1 "
                                >
                                    {props.croppedImages.map((image, index) => (
                                        <Reorder.Item
                                            key={image}
                                            value={image}
                                            className="h-full aspect-square relative"
                                            onTap={() => setCurImage(index)}
                                        >
                                            <img
                                                src={image}
                                                draggable={false}
                                                className="h-full aspect-square object-cover cursor-grab"
                                            />
                                            {images.length > 1 && (
                                                <button
                                                    onClick={() => handleDeleteItem(index)}
                                                    className="absolute cursor-pointer top-1 right-1 p-1 bg-white/70 hover:bg-white rounded-full"
                                                >
                                                    <X size={14} />
                                                </button>
                                            )}
                                        </Reorder.Item>
                                    ))}
                                </Reorder.Group>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/png, image/jpeg, video/mp4"
                                    multiple
                                    className="hidden"
                                    onChange={(e) => addFiles(e.target.files)}
                                />

                                <button
                                    className=" p-3 bg-white/70 rounded-full ml-3 cursor-pointer hover:bg-white"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Plus size={24} />
                                </button>
                            </div>
                        )}
                        <button
                            onClick={() => setIsReorderShown(!isReorderShown)}
                            className=" p-3 size-fit rounded-full  z-50 cursor-pointer hover:bg-black/70 text-white bg-black/50"
                        >
                            <svg
                                aria-label="Open media gallery"
                                fill="currentColor"
                                height="16"
                                role="img"
                                viewBox="0 0 24 24"
                                width="16"
                            >
                                <title>Open media gallery</title>
                                <path
                                    d="M17 10c0-1.776-.005-2.368-.025-2.938l-.025-.606c-.04-.855-.184-1.294-.29-1.566a2.5 2.5 0 0 0-.61-.94h-.002a2.49 2.49 0 0 0-.936-.61c-.239-.093-.606-.215-1.267-.27l-.3-.02C12.63 3.01 12.367 3 10 3c-1.776 0-2.368.005-2.938.025l-.606.026c-.64.03-1.048.117-1.327.204l-.239.085a2.518 2.518 0 0 0-.94.61c-.215.216-.366.42-.492.671l-.118.269c-.092.238-.215.604-.27 1.264l-.019.302c-.04.913-.05 1.177-.05 3.544s.01 2.631.05 3.544l.019.3c.04.473.113.795.185 1.027l.085.24c.112.288.238.51.415.725l.197.214c.286.287.552.461.937.61.272.106.713.25 1.567.29l.606.025c.57.02 1.162.025 2.938.025 2.368 0 2.631-.01 3.544-.05l.301-.02c.661-.056 1.027-.177 1.266-.27a2.5 2.5 0 0 0 .94-.611l.196-.214c.177-.214.302-.436.414-.725l.084-.239c.087-.278.175-.686.205-1.327l.025-.606c.02-.57.025-1.162.025-2.938Zm2 0c0 1.783-.005 2.396-.026 2.996l-.026.639c-.05 1.083-.243 1.736-.423 2.199a4.495 4.495 0 0 1-1.06 1.627 4.487 4.487 0 0 1-1.632 1.064c-.406.157-.955.324-1.811.397l-.387.025C12.677 18.99 12.377 19 10 19c-1.782 0-2.396-.006-2.996-.026l-.638-.027c-1.083-.05-1.736-.243-2.199-.423a4.481 4.481 0 0 1-1.63-1.06 4.49 4.49 0 0 1-1.062-1.631l.001-.001c-.157-.405-.325-.954-.397-1.81l-.026-.387C1.01 12.676 1 12.377 1 10s.01-2.676.053-3.635l.026-.386c.072-.858.24-1.408.397-1.813a4.5 4.5 0 0 1 1.06-1.63 4.5 4.5 0 0 1 1.63-1.06c.463-.18 1.116-.374 2.2-.423l.638-.027C7.604 1.006 8.218 1 10 1c2.377 0 2.677.01 3.635.053l.387.025c.856.073 1.405.24 1.81.398l.001-.001a4.48 4.48 0 0 1 1.631 1.061c.486.485.813.987 1.062 1.631.18.463.372 1.115.422 2.198l.026.639c.02.6.026 1.214.026 2.996Z"
                                    fill="currentColor"
                                ></path>
                                <path
                                    d="M21 10V8a1 1 0 1 1 2 0v2c0 2.473-.01 2.79-.056 3.818-.078 1.698-.427 2.785-.69 3.463a8.48 8.48 0 0 1-1.956 3.006 8.438 8.438 0 0 1-3.015 1.966v-.001c-.68.264-1.764.613-3.466.691a81.17 81.17 0 0 1-2.303.046l-1.062.009-.327.001-.09.001H8a1 1 0 1 1 0-2h2.027l.088-.001.325-.001 1.053-.009a80.5 80.5 0 0 0 2.233-.044l.515-.035c1.143-.102 1.866-.345 2.319-.521l.002-.001a6.436 6.436 0 0 0 2.319-1.513 6.484 6.484 0 0 0 1.509-2.317c.201-.52.49-1.39.556-2.831.045-.983.054-1.265.054-3.727Z"
                                    fill="currentColor"
                                ></path>
                            </svg>
                        </button>
                    </div>

                    <div className="w-full h-full absolute flex justify-center items-end p-3 ">
                        <div className="absolute z-50 flex gap-1.5 bg-black/50 hover:bg-black/70 p-3 rounded-full">
                            {images.map((_, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        index === curImage ? "bg-blue-500" : "bg-gray-400",
                                        "size-1.5 rounded-full",
                                    )}
                                ></div>
                            ))}
                        </div>
                    </div>

                    {images[curImage] && (
                        <Cropper
                            objectFit={"cover"}
                            restrictPosition={true}
                            roundCropAreaPixels={false}
                            aspect={1}
                            image={images[curImage].file}
                            crop={images[curImage].crop}
                            zoom={images[curImage].zoom}
                            onCropChange={handleCropChange}
                            onZoomChange={handleZoomChange}
                            onCropComplete={handleCropComplete}
                        />
                    )}
                    <div className="w-full h-full flex justify-between items-center p-3 ">
                        <button
                            onClick={() => setCurImage(curImage - 1)}
                            className={cn(
                                curImage <= 0 && "invisible",
                                " p-3 size-fit rounded-full  z-50 cursor-pointer hover:bg-black/70 text-white bg-black/50",
                            )}
                        >
                            <svg
                                aria-label="Left chevron"
                                fill="currentColor"
                                height="16"
                                role="img"
                                viewBox="0 0 24 24"
                                width="16"
                            >
                                <title>Left chevron</title>
                                <polyline
                                    fill="none"
                                    points="16.502 3 7.498 12 16.502 21"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                ></polyline>
                            </svg>
                        </button>
                        <button
                            onClick={() => setCurImage(curImage + 1)}
                            className={cn(
                                curImage >= images.length - 1 && "invisible",
                                " p-3 size-fit rounded-full  z-50 cursor-pointer hover:bg-black/70 text-white bg-black/50",
                            )}
                        >
                            <svg
                                aria-label="Right chevron"
                                fill="white"
                                height="16"
                                role="img"
                                viewBox="0 0 24 24"
                                width="16"
                            >
                                <title>Right chevron</title>
                                <polyline
                                    fill="none"
                                    points="8 3 17.004 12 8 21"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                ></polyline>
                            </svg>
                        </button>
                    </div>
                </div>

                <button className="w-full p-4 border-t-2 border-border  cursor-pointer hover:bg-gray-100  text-blue-500 z-50">
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

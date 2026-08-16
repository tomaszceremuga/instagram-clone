import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import type { Image } from "./utils"
import type { Area, Point } from "react-easy-crop"
import { Reorder } from "framer-motion"
import { Images, Plus, X } from "lucide-react"
import { image, img, output } from "motion/react-client"

import { cn } from "@/lib/utils"

import { AlertDialogTitle } from "../ui/alert-dialog"
import ImageCropper from "./ImageCropper"
import { createImage, getCroppedImg } from "./utils"

type Props = {
    images: Image[]
    setImages: Dispatch<SetStateAction<Image[]>>
    handleChangeStep: VoidFunction
}

const CropStep = (props: Props) => {
    const [curIndex, setCurIndex] = useState(0)
    const [isReorderShown, setIsReorderShown] = useState(false)

    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleCropDone = (index: number, crop: Point, zoom: number, outputUrl: string) => {
        props.setImages((prevImages) =>
            prevImages.map((image, i) =>
                i === index ? { ...image, crop, zoom, outputUrl } : image,
            ),
        )
    }

    const handleReorder = (newOrder: string[]) => {
        console.log("reorder")
        //     const newImages = newOrder.map((img) => images[props.croppedImages.indexOf(img)])
        //     setImages(newImages)
        //     props.setCroppedImages(newOrder)
        // }
        //
        // const handleDeleteItem = (indexParam: number) => {
        //     setImages((prevImages) => prevImages.filter((_, index) => index !== indexParam))
        //     props.setCroppedImages((prevImages) =>
        //         prevImages.filter((_, index) => index !== indexParam),
        //     )
        //     setCurIndex((prev) => Math.max(0, Math.min(prev, images.length - 2)))
    }

    const addFiles = (files: FileList | null) => {
        console.log("add files")

        // if (!files || files.length === 0) return
        //
        // const newImages = Array.from(files).map((file) => ({
        //     fileUrl: URL.createObjectURL(file),
        //     outputUrl: URL.createObjectURL(file),
        //     zoom: 1,
        //     crop: { x: 0, y: 0 },
        // }))
        //
        // setImages((prevImages) => [...prevImages, ...newImages])
        // props.setCroppedImages((prevImages) => [
        //     ...prevImages,
        //     ...newImages.map((image) => image.outputUrl),
        // ])
    }

    // useEffect(() => {
    //     if (!images[curIndex]) {
    //         setCurIndex(images.length - 1)
    //     }
    //
    //     setCurImageUrl(images[curIndex].fileUrl)
    //     setCurZoom(images[curIndex].zoom)
    //     setCurCrop(images[curIndex].crop)
    // }, [curIndex])

    // useEffect(() => {
    //     console.log(images)
    //     setImages(
    //         props.files.map((file) => {
    //             const newImage: Image = {
    //                 fileUrl: URL.createObjectURL(file),
    //                 outputUrl:
    //                 crop: { x: 0, y: 0 },
    //                 zoom: 1,
    //             }
    //
    //             return newImage
    //         }),
    //     )
    //
    //     // setCurImageUrl(images[curIndex].fileUrl)
    //     // setCurZoom(images[curIndex].zoom)
    //     // setCurCrop(images[curIndex].crop)
    // }, [])
    //
    const handleChangeIndex = (newIndex: number) => {
        setCurIndex(newIndex)
    }

    useEffect(() => handleChangeIndex(0), [])

    return (
        <>
            <AlertDialogTitle>Crop</AlertDialogTitle>
            <div className="w-full">
                <div className=" aspect-square relative w-full ">
                    <div
                        className={cn(
                            isReorderShown && "w-full",
                            "absolute p-3 gap-1 w-full z-50 bottom-0 right-0 items-end flex flex-col",
                        )}
                    >
                        {/* {isReorderShown && ( */}
                        {/*     <div className="h-30 w-full flex bg-black/50 p-3 rounded-2xl hover:bg-black/70 items-center"> */}
                        {/*         <Reorder.Group */}
                        {/*             axis="x" */}
                        {/*             onReorder={handleReorder} */}
                        {/*             values={props.croppedImages} */}
                        {/*             className="flex gap-3 h-full overflow-x-scroll scrollbar-thumb-white/70 pb-1 " */}
                        {/*         > */}
                        {/*             {props.croppedImages.map((image, index) => ( */}
                        {/*                 <Reorder.Item */}
                        {/*                     key={image} */}
                        {/*                     value={image} */}
                        {/*                     className="h-full aspect-square relative" */}
                        {/*                 > */}
                        {/*                     <img */}
                        {/*                         src={image} */}
                        {/*                         draggable={false} */}
                        {/*                         className="h-full aspect-square object-cover cursor-grab" */}
                        {/*                     /> */}
                        {/*                     {images.length > 1 && ( */}
                        {/*                         <button */}
                        {/*                             onClick={() => handleDeleteItem(index)} */}
                        {/*                             className="absolute cursor-pointer top-1 right-1 p-1 bg-white/70 hover:bg-white rounded-full" */}
                        {/*                         > */}
                        {/*                             <X size={14} /> */}
                        {/*                         </button> */}
                        {/*                     )} */}
                        {/*                 </Reorder.Item> */}
                        {/*             ))} */}
                        {/*         </Reorder.Group> */}
                        {/*         <input */}
                        {/*             ref={fileInputRef} */}
                        {/*             type="file" */}
                        {/*             accept="image/png, image/jpeg, video/mp4" */}
                        {/*             multiple */}
                        {/*             className="hidden" */}
                        {/*             onChange={(e) => addFiles(e.target.files)} */}
                        {/*         /> */}
                        {/**/}
                        {/*         <button */}
                        {/*             className=" p-3 bg-white/70 rounded-full ml-3 cursor-pointer hover:bg-white" */}
                        {/*             onClick={() => fileInputRef.current?.click()} */}
                        {/*         > */}
                        {/*             <Plus size={24} /> */}
                        {/*         </button> */}
                        {/*     </div> */}
                        {/* )} */}
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
                            {props.images.map((_, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        index === curIndex ? "bg-blue-500" : "bg-gray-400",
                                        "size-1.5 rounded-full",
                                    )}
                                ></div>
                            ))}
                        </div>
                    </div>

                    {props.images.map((image, index) => (
                        <ImageCropper
                            key={image.fileUrl}
                            image={image}
                            isActive={index === curIndex}
                            onCropDone={(crop, zoom, outputUrl) =>
                                handleCropDone(index, crop, zoom, outputUrl)
                            }
                        />
                    ))}

                    <div className="w-full h-full flex justify-between items-center p-3 ">
                        <button
                            onClick={() => handleChangeIndex(curIndex - 1)}
                            className={cn(
                                curIndex <= 0 && "invisible",
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
                            onClick={() => handleChangeIndex(curIndex + 1)}
                            className={cn(
                                curIndex >= props.images.length - 1 && "invisible",
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

                <button
                    onClick={props.handleChangeStep}
                    className="w-full p-4 border-t-2 border-border  cursor-pointer hover:bg-gray-100  text-blue-500 z-50"
                >
                    Next
                </button>
            </div>
        </>
    )
}

export default CropStep

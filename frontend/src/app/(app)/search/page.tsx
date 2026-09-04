"use client"

import { useState } from "react"

import SearchInput from "@/components/ui/search-input"

type Props = {}

const page = (props: Props) => {
    const [inputVal, setInputVal] = useState("")

    return (
        <div className="w-full flex flex-col items-center md:px-30">
            <div className="w-full md:max-w-175 p-5 pt-15 pb-0 md:p-0 md:pt-15 ">
                <SearchInput
                    className="h-11 text-lg rounded-full bg-gray-100 gap-2 px-4"
                    setValue={setInputVal}
                    value={inputVal}
                />
            </div>
        </div>
    )
}

export default page

import { Dispatch, SetStateAction } from "react"
import { ChevronDown } from "lucide-react"

import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

type Props = {
    value: Date | undefined
    setter: Dispatch<SetStateAction<Date | undefined>>
}

const PickDateForm = (props: Props) => {
    return (
        <div className="md:flex">
            <Popover>
                <PopoverTrigger
                    render={
                        <button className="relative mb-3 w-full" type="button">
                            <p
                                className={`h-15 w-full rounded-2xl border border-gray-300 px-5 pt-6 pb-1 text-left outline-none hover:cursor-pointer hover:border-gray-500 ${
                                    props.value ? "" : "text-transparent"
                                }`}>
                                {props.value
                                    ? props.value.toLocaleDateString()
                                    : "placeholder"}
                            </p>
                            <p
                                className={`absolute left-5 cursor-text transition-all ${
                                    props.value
                                        ? "top-2 translate-y-0 text-xs text-gray-500"
                                        : "top-1/2 -translate-y-1/2 text-gray-500"
                                }`}>
                                Date
                            </p>
                            <ChevronDown
                                className="absolute top-1/2 right-5 -translate-y-1/2 cursor-pointer"
                                size={20}
                            />
                        </button>
                    }
                />
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={props.value}
                        defaultMonth={props.value}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                            props.setter(date)
                        }}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default PickDateForm

import { Dispatch, SetStateAction } from "react";
import { ChevronDown } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  value: Date | undefined;
  setter: Dispatch<SetStateAction<Date | undefined>>;
};

const PickDateForm = (props: Props) => {
  return (
    <div className=" md:flex">
      <Popover>
        <PopoverTrigger
          render={
            <button className="relative mb-3 w-full" type="button">
              <p
                className={`px-5 pt-6 pb-1 outline-none w-full h-15 border-gray-300 hover:border-gray-500 hover:cursor-pointer border rounded-2xl text-left ${
                  props.value ? "" : "text-transparent"
                }`}
              >
                {props.value ? props.value.toLocaleDateString() : "placeholder"}
              </p>
              <p
                className={`absolute cursor-text left-5 transition-all ${
                  props.value
                    ? "top-2 text-xs translate-y-0 text-gray-500"
                    : "top-1/2 -translate-y-1/2 text-gray-500"
                }`}
              >
                Date
              </p>
              <ChevronDown
                className="absolute cursor-pointer right-5 top-1/2 -translate-y-1/2"
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
              props.setter(date);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default PickDateForm;

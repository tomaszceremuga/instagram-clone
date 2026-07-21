import { Dispatch, SetStateAction, useState } from "react";
import { Eye, EyeOff, CircleCheck } from "lucide-react";

type Props = {
  name: string;
  label: string;
  type?: string;
  value: string;
  setter: Dispatch<SetStateAction<string>>;
  isInvalid?: boolean;
};

const FormInput = (props: Props) => {
  const [isShown, setIsShown] = useState(false);

  return (
    <div className="relative mb-3">
      <input
        type={
          props.type === "password"
            ? isShown
              ? "text"
              : "password"
            : (props.type ?? "text")
        }
        id={props.name}
        placeholder=" "
        className={`${props.isInvalid ? "border-red-700" : "border-gray-300 hover:border-gray-500"} peer px-5 pt-5 pb-1 outline-none w-full h-15  border rounded-2xl`}
        value={props.value}
        onChange={(e) => props.setter(e.target.value)}
      />
      <label
        className={` ${props.isInvalid ? "text-red-700" : "text-gray-500"} absolute cursor-text left-5 top-1/2 -translate-y-1/2 transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:translate-y-0 peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:translate-y-0`}
        htmlFor={props.name}
      >
        {props.label}
      </label>
      {props.type === "password" && (
        <button
          className="absolute right-5 top-1/2 -translate-y-1/2 hover:bg-gray-100 rounded-full p-2 -mr-2 "
          onClick={() => setIsShown(!isShown)}
        >
          {isShown ? <Eye size={20} /> : <EyeOff size={20} />}
        </button>
      )}
      {props.name === "username" && !props.isInvalid && (
        <CircleCheck
          className="absolute right-5 top-1/2 -translate-y-1/2 text-green-700"
          size={20}
        />
      )}
    </div>
  );
};

export default FormInput;

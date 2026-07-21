import { Dispatch, SetStateAction } from "react";

type Props = {
  name: string;
  label: string;
  type?: string;
  value: string;
  setter: Dispatch<SetStateAction<string>>;
};

const FormInput = (props: Props) => {
  return (
    <div className="relative mb-3">
      <input
        type={props.type ?? "text"}
        id={props.name}
        placeholder=" "
        className="peer px-5 pt-5 pb-1 outline-none w-full h-15 border-gray-300 border rounded-2xl"
        value={props.value}
        onChange={(e) => props.setter(e.target.value)}
      />
      <label
        className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:translate-y-0 peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:translate-y-0"
        htmlFor={props.name}
      >
        {props.label}
      </label>
    </div>
  );
};

export default FormInput;

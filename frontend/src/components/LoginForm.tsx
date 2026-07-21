"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import FormInput from "./FormInput";

const LoginForm = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const isFormCorrect = Boolean(username && password.length >= 8);

  const handleSend = async () => {
    try {
      const res = await api.post("/login", { username, password });
      console.log(res.data);
      router.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="">
      <p className=" text-xl font-medium w-full text-left mb-5">
        Log into Instagram
      </p>

      <FormInput
        name="username"
        label="Username"
        value={username}
        setter={setUsername}
      />

      <FormInput
        name="password"
        label="Password"
        value={password}
        type="password"
        setter={setPassword}
      />

      <button
        type="submit"
        className={`${isFormCorrect ? "bg-blue-700 cursor-pointer" : "bg-blue-300 cursor-not-allowed"} text-white rounded-[22px] mt-2 h-11 w-full`}
        onClick={handleSend}
      >
        Log in
      </button>

      <button className="border-blue-700 text-blue-700 cursor-pointer border rounded-[22px] mt-3 md:mt-24 h-11 w-full">
        Create new account
      </button>
    </div>
  );
};

export default LoginForm;

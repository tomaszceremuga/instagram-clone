"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

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
      <p className=" text-lg w-full text-left font-semibold text-gray-800 mb-5">
        Log into Instagram
      </p>

      <div className="relative mb-3 ">
        <input
          type="text"
          id="username"
          placeholder=" "
          className="peer px-5 pt-5 pb-1 outline-none w-full h-15 border-gray-300 border rounded-2xl"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label
          className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:translate-y-0 peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:translate-y-0"
          htmlFor="username"
        >
          Username
        </label>
      </div>

      <div className="relative mb-5">
        <input
          type="password"
          id="password"
          placeholder=" "
          className="peer px-5 pt-5 pb-1 outline-none w-full h-15 border-gray-300 border rounded-2xl"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label
          className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:translate-y-0 peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:translate-y-0"
          htmlFor="password"
        >
          Password
        </label>
      </div>

      <button
        type="submit"
        className={`${isFormCorrect ? "bg-blue-700" : "bg-blue-300"} text-white rounded-[22px] h-11 w-full`}
        onClick={handleSend}
      >
        Log in
      </button>

      <button className="border-blue-700 text-blue-700 border rounded-[22px] md:mt-24 h-11 w-full">
        Create new account
      </button>
    </div>
  );
};

export default LoginForm;

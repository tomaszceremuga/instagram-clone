"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import LoginForm from "@/components/LoginForm";

const page = () => {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="w-screen h-screen md:flex">
      <div className="md:w-full p-10 md:p-13 md:border-r-3 border-b-3 md:border-b-0 border-gray-300">
        <img src={"/logo-gradient.png"} className="w-19 " />
        <h1 className="font-instagram cursor-default text-[2.8vw]/[64.8px] text-center mt-3 mb-2 hidden md:block">
          See everyday moments from <br />
          your{" "}
          <span className="inline-block bg-[linear-gradient(to_right,#fb724b,rgba(255,0,105,1),rgba(211,0,197,1))] bg-clip-text text-transparent">
            close friends
          </span>
          .
        </h1>
        <div className="w-full justify-center hidden md:flex">
          <img src={"/53X3pk-t2Gn.webp"} className="w-175" />
        </div>
      </div>

      <div className="w-full md:w-[55vw] h-screen md:content-center p-10 md:p-16">
        <LoginForm />
      </div>
    </div>
  );
};

export default page;

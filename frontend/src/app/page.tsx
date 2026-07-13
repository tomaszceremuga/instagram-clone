"use client"

import { useState } from "react";
import { api } from "@/lib/api";
import TestForm from "@/components/TestForm";


const Home = () => {
    const [inputVal, setInputVal] = useState("")

    const handleTest = async () => {
        const res = await api.get("/");
        console.log(res.data)

    }

    const handleSend = async () => {
        try {
            const rest = await api.post("/post1", { text: inputVal });
            console.log(rest.data)

        } catch (err) {
            console.log(err)

        }

    }

    return (
        <div className="p-10 block">
            <p className="text-purple-500">hello</p>
            <button onClick={handleTest}>test</button>
            <input value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="podaj login"
                className="border border-black w-75 block p-1"
            />
            <button className="p-2 bg-black text-white" onClick={handleSend}>send</button>
            <hr className="my-5" />
            <TestForm />
        </div>
    )
}


export default Home;

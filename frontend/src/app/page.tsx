"use client"

import { useState } from "react";
import { api } from "@/lib/api";


const Home = () => {
    const [inputVal, setInputVal] = useState("")

    const handleTest = async () => {
        const rest = await api.get("/");
        console.log(rest.data)

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
        </div>
    )
}

export default Home;

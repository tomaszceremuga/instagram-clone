"use client"

import { useState, } from "react";
import { api } from "@/lib/api";


const TestForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [count, setCount] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [id, setId] = useState(0)

    const handleSend = async () => {
        setIsLoading(false);
        setError(null);

        try {
            const res = await api.post("/test", { title, count, isActive });
            console.log(res.data)

            setTitle("");
            setCount(0);
            setIsActive(false);


        } catch (err) {
            console.error(err)
            setError("error in sending form");
        } finally {
            setIsLoading(false);
        }

    }

    const handleDelete = async () => {
        try {
            const res = await api.delete(`/test/${id}`);
            console.log(res.data);

        } catch (err) {
            console.error(err);

        }

    }

    return (
        <div className="block">
            <h1>Test form</h1>
            <div>
                <label htmlFor="title">Enter title</label>
                <input
                    id="title"
                    type="text"
                    className="m-1 border"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="count">Enter count</label>
                <input
                    id="count"
                    type="number"
                    value={count}
                    className="m-1 border"
                    onChange={e => setCount(e.target.value === "" ? 0 : parseInt(e.target.value))}
                />
            </div>
            <div>
                <label htmlFor="active">Active?</label>
                <input
                    id="active"
                    type="checkbox"
                    checked={isActive}
                    className="m-1 border"
                    onChange={() => setIsActive(!isActive)}
                />
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <button
                className="text-white bg-purple-400 my-3 text-xl p-2"
                onClick={handleSend}
            >
                {isLoading ? "sending..." : "send"}
            </button>


            <div className="my-3 flex">
                id: <input type="number" className="bg-amber-300" value={id} onChange={e => setId(parseInt(e.target.value))} />
                <button onClick={handleDelete}>delete</button>
            </div>
        </div>
    )

}


export default TestForm;

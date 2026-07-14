
"use client"

import { useState } from "react";
import { api } from "@/lib/api";

const page = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSend = async () => {
        try {
            const res = await api.post("/register", { username, email, password });
            console.log(res.data);

        } catch (err) {
            console.error(err);
        } finally {
            setUsername("");
            setEmail("");
            setPassword("");
        }

    }


    return (
        <div className="p-72">
            <h1>Register</h1>
            <div>
                <div>
                    <label htmlFor="username">username</label>
                    <input
                        type="text"
                        value={username}
                        id="username"
                        onChange={e => setUsername(e.target.value)}
                        className="border m-1"
                    />
                </div>
                <div>
                    <label htmlFor="email">email</label>
                    <input
                        type="email"
                        value={email}
                        id="email"
                        onChange={e => setEmail(e.target.value)}
                        className="border m-1"
                    />
                </div>
                <div>
                    <label htmlFor="password">password</label>
                    <input
                        type="password"
                        value={password}
                        id="password"
                        onChange={e => setPassword(e.target.value)}
                        className="border m-1"
                    />
                </div>
                <button
                    className="text-white bg-black p-1 px-3"
                    onClick={handleSend}
                >send</button>
            </div>
        </div>
    )
}

export default page


"use client"

import { useState } from "react";
import { api } from "@/lib/api";

const page = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loggedUsername, setLoggedUsername] = useState("");

    const handleSend = async () => {
        try {
            const res = await api.post("/login", { email, password });
            console.log(res.data);
            setLoggedUsername(res.data.username);

        } catch (err) {
            console.error(err);
        } finally {
            setEmail("");
            setPassword("");
        }

    }


    const handleTestAuth = async () => {
        try {
            const res = await api.get("/profile");
            console.log(res.data);
        } catch (err) {
            console.error(err);
        }
    }


    return (
        <div className="p-72">
            <h1>Login</h1>
            <div>
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
                <p className="text-blue-400">{loggedUsername && `Hello ${loggedUsername}`}</p>
                <button
                    className="text-white bg-green-400  p-1 px-3"
                    onClick={handleTestAuth}
                >test auth</button>
            </div>
        </div>
    )
}


export default page;

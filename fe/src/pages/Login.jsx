import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import Cookies from "js-cookie"
import { z } from "zod/v4";

export default function Login() {
    const [creds, setCreds] = useState({email: "", password: ""})
    const [error, setError] = useState("")
    const navigate = useNavigate()

    async function login() {
        const credential = z.object({
            email: z.email(),
            password: z.string().min(1, "Password needs to be filled")
        })
        const result = await credential.safeParseAsync(creds)
        if (!result.success) {
            setError(result.error.issues[0].message)
            return
        }

        const res = await fetch("http://localhost:3000/login", {
            method: "POST",
            body: JSON.stringify({
                email: creds.email,
                password: creds.password,
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const json = await res.json()
        if (!json.ok) {
            console.error(json)
            if (json.errcode) {
                setError(json.message)
            }
        } else {
            Cookies.set("session_token", json.session_token)
            navigate("/")
        }
    }

    return (
        <main className="flex flex-col justify-center items-center h-screen gap-3">
            <label className="">Email</label>
            <input value={creds.email} onChange={(e) => setCreds({...creds, email: e.target.value})} className="rounded-full border px-3" type="text" />
            <label className="">Password</label>
            <input value={creds.password} onChange={(e) => setCreds({...creds, password: e.target.value})} className="rounded-full border px-3" type="password" />
            {error &&
            <p className="border min-w-52 text-center py-1">{error}</p>
            }
            <button onClick={login} className="bg-black text-white w-52 py-1 mt-3 rounded-full">Login</button>
            <NavLink className="underline" to="/register">Don't have an account yet?</NavLink>
        </main>
    )
}
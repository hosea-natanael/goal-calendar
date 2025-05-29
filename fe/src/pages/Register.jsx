import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { email, z } from "zod/v4"
import Cookies from "js-cookie"

export default function Register() {
    const [creds, setCreds] = useState({name: "", email: "", password: ""})
    const [error, setError] = useState("")
    const navigate = useNavigate()

    async function register() {

        const credential = z.object({
            name: z.string().trim().min(1, "Name must have at least one character"),
            email: z.email(),
            password: z.string().min(8, "Password must have minimum of 8 characters")
        })
        const result = await credential.safeParseAsync(creds)
        if (!result.success) {
            setError(result.error.issues[0].message)
            return
        }

        const res = await fetch("http://localhost:3000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: creds.name,
                email: creds.email,
                password: creds.password,
            }),
        })    
        if (!res.ok) {
            return console.error(res)
        }
        const json = await res.json()
        if (json.ok) {
            Cookies.set("session_token", json.session_token)
            navigate("/")
        } else {
            console.error(json)
            if (json.errcode) {
                setError(json.message)
            }
        }
    }

    return (
        <main className="flex flex-col justify-center items-center h-screen gap-3">
            <label className="">Name</label>
            <input value={creds.name} onChange={(e) => setCreds({...creds, name: e.target.value})} className="rounded-full border px-3" type="text" />
            <label className="">Email</label>
            <input value={creds.email} onChange={(e) => setCreds({...creds, email: e.target.value})} className="rounded-full border px-3" type="text" />
            <label className="">Password</label>
            <input value={creds.password} onChange={(e) => setCreds({...creds, password: e.target.value})} className="rounded-full border px-3" type="password" />
            {error &&
            <p className="border min-w-52 text-center py-1">{error}</p>
            }
            <button onClick={register} className="bg-black text-white w-52 py-1 mt-3 rounded-full">Register</button>
            <NavLink className="underline" to="/login">Already have an account?</NavLink>
        </main>
    )
}
import { useState } from "react"
import { useEffect } from "react"
import { useRef } from "react"
import { NavLink, useParams } from "react-router"
import Cookies from "js-cookie"
import useSessUser from "../hooks/useSessUser"

export default function Goal() {
    useSessUser()

    const date = useRef( new Date().toLocaleDateString("en-US", {month: "short", day: "2-digit", year: "numeric"}))
    const [calendarName, setCalendarName] = useState("")
    const [achieved, setAchieved] = useState(false)
    const { calendarId } = useParams()
    

    async function getCalendarName() {
        const sessToken = Cookies.get("session_token")
        if (!sessToken) {
            console.error("No session token found")
        }

        const res = await fetch("http://localhost:3000/calendar/" + calendarId, {
            headers: { "Authorization": sessToken },
        })
        
        const json = await res.json()
        if (!json.ok) {
            return console.error(json)
        }

        setCalendarName(json.data.name)
    }

    async function getGoal() {
        const sessToken = Cookies.get("session_token")
        if (!sessToken) {
            console.error("No session token found")
        }

        const res = await fetch("http://localhost:3000/calendar/" + calendarId + "/goal-achieved/now", {
            headers: { "Authorization": sessToken },
        })
        
        const json = await res.json()
        if (!json.ok) {
            return console.error(json)
        }

        setAchieved(json.data.achieved)
    }

    useEffect(() => {
        getCalendarName()
        getGoal()
    }, [])

    async function toggleGoal() {
        const sessToken = Cookies.get("session_token")
        if (!sessToken) {
            console.error("No session token found")
        }

        const res = await fetch("http://localhost:3000/calendar/" + calendarId + "/goal-achieved/toggle-now", {
            method: "PUT",
            headers: { "Authorization": sessToken },
        })
        
        const json = await res.json()
        if (!json.ok) {
            return console.error(json)
        }

        await getGoal()
    }

    return (
        <main className="flex flex-col justify-center items-center h-screen gap-8">
            <p className="font-bold text-xl">{calendarName}</p>
            <p className="font-bold text-xl">{date.current}</p>
            {achieved ? 
            <button onClick={toggleGoal} className="cursor-pointer border rounded-full w-52 py-1 bg-black text-white hover:bg-white hover:text-black">Goal Un-Achieved</button>
            :
            <button onClick={toggleGoal} className="cursor-pointer border rounded-full w-52 py-1 hover:bg-black hover:text-white">Goal Achieved</button>
            }
            <NavLink to={`/calendar/${calendarId}`} className="underline">Calendar</NavLink>
        </main>
    )
}
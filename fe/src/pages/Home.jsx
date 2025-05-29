import { useState } from "react";
import AddCalendar from "../components/AddCalendar";
import CalendarRow from "../components/CalendarRow";
import { useNavigate } from "react-router";
import useSessUser from "../hooks/useSessUser";
import { useEffect } from "react";
import Cookies from "js-cookie";

export default function Home() {
    const [calendars, setCalendars] = useState([])
    const navigate = useNavigate()

    const sessUser = useSessUser()

    async function getCalendars() {
        const sessToken = Cookies.get("session_token")
        if (!sessToken) {
            console.error("No session token found")
        }

        const res = await fetch("http://localhost:3000/calendar", {
            headers: {"Authorization": sessToken}
        })
        const json = await res.json()

        if(!json.ok) {
            return console.error(json)
        }

        setCalendars(json.data)
    }

    useEffect(() => {
        getCalendars()
    }, [])

    async function addCalendar() {
        const sessToken = Cookies.get("session_token")
        if (!sessToken) {
            console.error("No session token found")
        }

        const res = await fetch("http://localhost:3000/calendar", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": sessToken },
            body: JSON.stringify({name: "Goal Calendar"})
        })
        const json = await res.json()

        if (!json.ok) {
            return console.error(json)
        }

        await getCalendars()

    }

    async function deleteCalendar(index) {
        const sessToken = Cookies.get("session_token")
        if (!sessToken) {
            console.error("No session token found")
        }

        const res = await fetch("http://localhost:3000/calendar/" + index, {
            method: "DELETE",
            headers: { "Authorization": sessToken },
        })
        
        const json = await res.json()
        if (!json.ok) {
            return console.error(json)
        }

        await getCalendars()
    }

    function renameCalendar(index) {
        const sessToken = Cookies.get("session_token")
        if (!sessToken) {
            console.error("No session token found")
        }

        return async (newName) => {
            const res = await fetch("http://localhost:3000/calendar/" + index, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "Authorization": sessToken },
                body: JSON.stringify({name: newName})
            })
            
            const json = await res.json()
            if (!json.ok) {
                return console.error(json)
            }

            await getCalendars()
        }
    }

    function navigateToCalendar(index) {
        return (editState) => {
            if (editState == false) {
                navigate(`/goal/${index}`)
            }
        }
    }

    return (
        <main className="flex justify-center items-center h-screen">
            <div className="flex flex-col gap-3 text-center">
                <p className="text-xl font-bold mb-3">Hi, {sessUser.name}</p>
                {calendars.map((calendar) => 
                
                    <CalendarRow 
                        key={calendar.id}
                        initText={calendar.name}
                        deleteCalendar={() => deleteCalendar(calendar.id)}
                        renameCalendar={renameCalendar(calendar.id)}
                        navigateToCalendar={navigateToCalendar(calendar.id)}
                    />
                )}
                <AddCalendar addCalendar={addCalendar}/>

            </div>
        </main>
    )
}
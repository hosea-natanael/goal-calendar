import { useState } from "react";
import GoalCalendar from "../components/GoalCalendar";
import { useEffect } from "react";
import { useParams } from "react-router";
import Cookies from "js-cookie";
import Note from "../components/Note";
import { formatMonth } from "../utils/utils";
import { useMemo } from "react";
import useSessUser from "../hooks/useSessUser";

export default function Calendar() {
    useSessUser()

    const [currDate, setCurrDate] = useState(new Date())
    const [month, setMonth] = useState(formatMonth(new Date()))
    const [year, setYear] = useState((new Date()).getFullYear())
    const params = useParams()

    const [selectedGoal, setSelectedGoal] = useState(null)
    const [monthlyGoals, setMonthlyGoals] = useState([])

    async function getCurrGoal() {
        const sessToken = Cookies.get("session_token")
        if (!sessToken) {
            console.error("No session token found")
        }

        const res = await fetch(
            import.meta.env.VITE_SERVER_URL + "/calendar/" + params.calendarId +
            "/goal-achieved?date=" + currDate.toLocaleDateString("en-CA"), {
            headers: { "Authorization": sessToken }
        })
        const json = await res.json()
        if (!json.ok) {
            console.error(json)
        } else {
            setSelectedGoal(json.data)
        }
    }

    async function getMonthlyGoals() {
        const sessToken = Cookies.get("session_token")
        if (!sessToken) {
            console.error("No session token found")
        }

        const res = await fetch(
            import.meta.env.VITE_SERVER_URL + "/calendar/" + params.calendarId +
            "/goal-achieved?month=" + `${year}-${month}`, {
            headers: { "Authorization": sessToken }
        })
        const json = await res.json()
        if (!json.ok) {
            console.error(json)
        } else {
            setMonthlyGoals(json.data)
        }
    }

    useEffect(()=>{
        getCurrGoal()
    }, [currDate])

    useEffect(()=>{
        getMonthlyGoals()
    }, [year, month])

    const noteEmpty = useMemo(() => {
        if (selectedGoal?.id) {
            return true
        }
        return false
    }, [selectedGoal])

    async function addGoal() {
        const sessToken = Cookies.get("session_token")
        if (!sessToken) {
            console.error("No session token found")
        }

        const res = await fetch(import.meta.env.VITE_SERVER_URL + "/goal-achieved", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": sessToken },
            body: JSON.stringify({
                calendarId: params.calendarId,
                date: currDate.toLocaleDateString("en-CA") 
            })
        })
        const json = await res.json()
        if (!json.ok) {
            console.error(json)
        } else {
            await getCurrGoal()
            await getMonthlyGoals()
        }
    }

    async function removeGoal() {
        const sessToken = Cookies.get("session_token")
        if (!sessToken) {
            console.error("No session token found")
        }

        const res = await fetch(import.meta.env.VITE_SERVER_URL + "/goal-achieved/" + selectedGoal.id, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", "Authorization": sessToken },
        })
        const json = await res.json()
        if (!json.ok) {
            console.error(json)
        } else {
            await getCurrGoal()
            await getMonthlyGoals()
        }
    }

    async function saveNote() {
        const sessToken = Cookies.get("session_token")
        if (!sessToken) {
            console.error("No session token found")
        }

        const res = await fetch(import.meta.env.VITE_SERVER_URL+"/goal-achieved/" + selectedGoal.id, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": sessToken },
            body: JSON.stringify({note: selectedGoal.note})
        })
        const json = await res.json()
        if (!json.ok) {
            console.error(json)
        } else {
            await getCurrGoal()
        }
    }

    return (
        <main className="flex justify-center items-center flex-col">
            <GoalCalendar
                currDate={currDate} 
                setCurrDate={setCurrDate}
                setYear={setYear}
                setMonth={setMonth}
                monthlyGoals={monthlyGoals}
            />
            <Note
                empty={noteEmpty}
                text={selectedGoal?.note || ""}
                onChangeText={(e) => setSelectedGoal({...selectedGoal, note: e.target.value})}
                addGoal={addGoal}
                removeGoal={removeGoal}
                saveNote={saveNote}
            />
        </main>
        
    )
}
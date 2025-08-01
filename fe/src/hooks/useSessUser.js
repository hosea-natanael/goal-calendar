import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import Cookies from "js-cookie"

export default function useSessUser() {
    const [sessUser, setSessUser] = useState({})
    const navigate = useNavigate()

    useEffect(() => {
        async function session() {
            const sessToken = Cookies.get("session_token")
            if (!sessToken) {
                return navigate("/login")
            }

            const res = await fetch("http://localhost:3002/session-user", {
                headers: {
                    "Authorization": sessToken
                }
            })
            const json = await res.json()
            if (json.ok) {
                setSessUser(json.data)
            } else {
                console.error(json)
                return navigate("/login")
            }
        }
        session()
    }, [])

    return sessUser
}
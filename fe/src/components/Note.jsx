import { useState } from "react"
import SettingsIcon from "../assets/settings.svg"
import { useRef } from "react"
import { useEffect } from "react"

export default function Note({
    empty,
    text,
    onChangeText,
    addGoal,
    removeGoal,
    saveNote,
}) {
    const [toggle, setToggle] = useState(false)
    const buttonRef = useRef()

    // collapse dropdown when clicking outside of it
    useEffect(() => {
        function handleOutsideClick(event) {
            if (buttonRef.current && !buttonRef.current.contains(event.target)) {
                setToggle(false)
            }
        }
        document.addEventListener("click", handleOutsideClick)

        return () => {
            document.removeEventListener("click", handleOutsideClick)
        }
    }, [])

    return (
        <div className="w-[560px] mt-2 min-h-40 border p-2">
            <div className="relative flex justify-between">
                <p>{empty && "Note"}</p>
                <img ref={buttonRef} className="cursor-pointer" src={SettingsIcon} onClick={() => setToggle(!toggle)}/>
                {toggle &&
                <div className="absolute right-3 top-3 bg-white shadow-md w-20 text-center p-1 flex flex-col gap-2">
                    {empty ?
                    <>
                        <button onClick={removeGoal}>Remove</button>
                        <button onClick={saveNote}>Save</button>
                    </>
                    :
                    <button onClick={addGoal}>Add</button>
                    }
                    
                </div>
                }
            </div>

            {empty && 
            <textarea className="w-full h-40" value={text} onChange={onChangeText} name="" id=""></textarea>
            }
        </div>
    )
}
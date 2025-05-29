import { useState } from "react"
import SettingIcon from "../assets/settings.svg"
import { useEffect } from "react"
import { useRef } from "react"

export default function CalendarRow({
    initText, 
    deleteCalendar, 
    renameCalendar,
    navigateToCalendar,
}) {
    const [edit, setEdit] = useState(false)
    const [dropdown, setDropdown] = useState(false)
    const dropdownRef = useRef()
    const inputRef = useRef()

    const [text, setText] = useState(initText)

    // collapse dropdown when clicking outside of it
    useEffect(() => {
        function handleOutsideClick(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdown(false)
            }
        }
        document.addEventListener("click", handleOutsideClick)

        return () => {
            document.removeEventListener("click", handleOutsideClick)
        }
    }, [])

    function rename() {
        setEdit(true)
        setDropdown(false)
        setTimeout(() => {
            inputRef.current.focus()
        }, 0);
    }

    function save() {
        setEdit(false)
        renameCalendar(text)
    }

    function enterSave(event) {
        if (event.key == "Enter") {
            save()
        }
    }

    return (
        <div className="relative flex items-center border rounded-full w-80">
            {edit ?
            <input ref={inputRef} value={text} onChange={(e)=>setText(e.target.value)} onKeyDown={enterSave} className="rounded-l-full px-3 py-1 w-full" type="text" />
            :
            <button onClick={() => navigateToCalendar(edit)} className="cursor-pointer text-left px-3 py-1 w-full">{text}</button>
            }

            {!edit ?
            <img ref={dropdownRef} onClick={() => setDropdown(!dropdown)} className="size-5 mr-1 cursor-pointer" src={SettingIcon} alt="" />
            :
            // <button onClick={save} className="bg-black text-white rounded-r-full rounded-l-md py-0.5 px-1 mr-0.5">save</button>
            <></>
            }
            
            {dropdown &&
            <div className="z-10 absolute flex flex-col bg-white shadow-sm rounded-md w-20 right-3 top-4">
                <button className="py-1" onClick={deleteCalendar}>delete</button>
                <button className="py-1" onClick={rename}>rename</button>
            </div>
            }
        </div>
    )
}
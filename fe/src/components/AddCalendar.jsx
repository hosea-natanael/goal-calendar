import PlusIcon from "../assets/plus.svg"

export default function AddCalendar({addCalendar}) {
    return (
        <button onClick={addCalendar} className="flex justify-center border py-0.5 rounded-full cursor-pointer">
            <img src={PlusIcon} alt="" />
        </button>
    )
}
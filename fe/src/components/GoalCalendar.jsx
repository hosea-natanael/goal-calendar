import { formatMonth, isSameDay, isSameMonth } from "../utils/utils";
import "./GoalCalendar.css"
import Calendar from "react-calendar";

export default function GoalCalendar({
    currDate,
    setCurrDate,
    setMonth,
    setYear,
    monthlyGoals,
}) {

    function selectedTile({date, view}) {
        if (view == "month") {
            if (isSameDay(date, currDate) && monthlyGoals.find((goal) =>  isSameDay(new Date(goal.date), date))) {
                return "selected-achieved"
            }

            if (isSameDay(date, currDate)) {
                return "selected"
            }
            if (monthlyGoals.find((goal) =>  isSameDay(new Date(goal.date), date))) {
                return "achieved"
            }
        }

        if (view == "year") {
            if (isSameMonth(date, currDate)) {
                return "selected"
            }
        }
    }

    function monthView({action, activeStartDate, value, view}) {
        if (action == "prev" || action == "next" || action == "onChange" || action == "drillDown") {
            setMonth(formatMonth(activeStartDate))
            setYear(activeStartDate.getFullYear())
        }
    }

    return (
        <Calendar 
            className="w-[560px]"
            onChange={(nextVal) => setCurrDate(nextVal)} 
            value={currDate}
            tileClassName={selectedTile}
            minDetail="year"
            onActiveStartDateChange={monthView}
            next2Label={null}
            prev2Label={null}
            maxDate={new Date()}
        />    
    )
}

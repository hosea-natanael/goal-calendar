export function isSameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
}

export function isSameMonth(d1, d2) {
    return d1.getMonth() === d2.getMonth()
}

export function formatMonth(date) {
    let month = date.getMonth() + 1
    if (month < 10) {
        return "0" + month
    } else {
        return "" + month
    }
}
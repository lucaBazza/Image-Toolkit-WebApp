/**
 *  https://stackoverflow.com/questions/40377103/how-to-convert-date-into-this-yyyy-mm-dd-format-in-angular-2
 *  use: 
 *      const ddate = new Date()
 *      const result = formatDate(ddate)
 * 
 * @param dateObj date to convert
 * @returns ex :    17th, Sunday July, 2022
 */
export default function formatDate(dateObj){
    if(typeof dateObj === 'string')
        dateObj = new Date(dateObj)

    const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
    
    const dateOrdinal=(dom)=> {
        if (dom == 31 || dom == 21 || dom == 1) return dom + "st";
        else if (dom == 22 || dom == 2) return dom + "nd";
        else if (dom == 23 || dom == 3) return dom + "rd";
        else return dom + "th";
    }

    return dateOrdinal(dateObj.getDate())+', '+days[dateObj.getDay()]+' '+ months[dateObj.getMonth()]+', '+dateObj.getFullYear()
}

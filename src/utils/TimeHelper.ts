import moment from "moment";

export default class TimeHelper {

    public static formatDate(time: any): string {
        const now = moment();
        const secondDiff = now.diff(moment(time), "seconds");
        const minuteDiff = now.diff(moment(time), "minutes");
        const hourDiff = now.diff(moment(time), "hours");
        const dayDiff = now.diff(moment(time), "days");
        const monthDiff = now.diff(moment(time), "months");
        const yearDiff = now.diff(moment(time), "years");
    
        if (yearDiff == 1)
          return `${yearDiff} year ago`;
    
        if (yearDiff > 1)
          return `${yearDiff} years ago`;
    
        if (monthDiff == 1)
          return `${monthDiff} month ago`;
    
        if (monthDiff > 1 && monthDiff < 12)
          return `${monthDiff} months ago`;
    
        if (dayDiff == 1)
          return `${dayDiff} day ago`;
    
        if (dayDiff > 1 && dayDiff < 31)
          return `${dayDiff} days ago`;
    
        if (hourDiff == 1)
          return `${hourDiff} hour ago`;
    
        if (hourDiff > 1 && hourDiff < 24)
          return `${hourDiff} hours ago`;
    
        if (minuteDiff == 1)
          return `${minuteDiff} minute ago`;
    
        if (minuteDiff >= 1 && minuteDiff < 60)
          return `${minuteDiff} minutes ago`;
    
        if (secondDiff == 1)
          return `${secondDiff} second ago`;
    
        if (secondDiff < 60)
          return `${secondDiff} seconds ago`;
    
        return "An eternity ago";
    }

    public static formatTime(millis: any): string {
        const minutes = Math.floor(millis / 60000);
        const seconds = ((millis % 60000) / 1000);
        const sec = seconds < 10;
        if (minutes === 0)
          return minutes + ":" + (sec ? '0' : '') + seconds.toFixed(0);
        return minutes + ":" + (sec ? '0' : '') + seconds.toFixed(0);
    }

    public static ToDate(time: any, showTime: Boolean = true): string {
        if (showTime)
            return moment(time).format("DD.MM.YYYY HH:mm:ss");
        return moment(time).format("DD.MM.YYYY");
    }
}
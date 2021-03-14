import * as fs from 'date-fns'
const moment = require('moment');

export default class TimeHelper {

    public static formatDateDistance(time: any): string {
        return fs.formatDistance(fs.subDays(fs.parseISO(time), 0), new Date(), {
            addSuffix: true
        });
    }

    public static formatDate(time: any, hidetime: true): string {
        const format = (hidetime) ? "MMMM DD, YYYY" : "MMMM DD, YYYY HH:mm:ss";
        return moment(new Date(time)).format(format);
    }

    public static formatTime(millis: any): string {
        const minutes = Math.floor(millis / 60000);
        const seconds = ((millis % 60000) / 1000);
        const sec = seconds < 10;

        if (minutes === 0)
            return minutes + ":" + (sec ? '0' : '') + Math.floor(seconds);
        return minutes + ":" + (sec ? '0' : '') + Math.floor(seconds);
    }

    public static convertTime(time: number): string {
        const minutes = Math.floor(time / 60000);
        const seconds = ((time % 60000) / 1000);
        if (minutes === 0)
            return minutes + ":" + (seconds < 10 ? '0' : '') + seconds.toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds.toFixed(0);
    }
}
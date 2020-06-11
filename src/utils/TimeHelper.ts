import * as fs from 'date-fns'

export default class TimeHelper {

    public static formatDateDistance(time: any): string {
        return fs.formatDistance(fs.subDays(fs.parseISO(time), 0), new Date(), {
            addSuffix: true
        });
    }

    public static formatDate(time: any): string {
        return fs.format(new Date(fs.parseISO(time)), "dd.MM.yyyy HH:MM:ss");
    }

    public static formatTime(millis: any): string {
        const minutes = Math.floor(millis / 60000);
        const seconds = ((millis % 60000) / 1000);
        const sec = seconds < 10;
        if (minutes === 0)
          return minutes + ":" + (sec ? '0' : '') + seconds.toFixed(0);
        return minutes + ":" + (sec ? '0' : '') + seconds.toFixed(0);
    }

    public static convertTime(time: number): string {
        const minutes = Math.floor(time / 60000);
        const seconds = ((time % 60000) / 1000);
        if (minutes === 0)
            return minutes + ":" + (seconds < 10 ? '0' : '') + seconds.toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds.toFixed(0);
    }
}
import LogLevel from "./LogLevel";
import chalk from "chalk";

const log = console.log;

export default class Logger {
    /**
     * Logs to the console at a given level.
     * @param message
     * @param level
     * @constructor
     */
    public static Log(message: string, level: LogLevel): void {
        // Modify the message with the date.
        const date: Date = new Date();
        
        // Formatted date.
        const d: string = `[${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}]`;
        const formattedLog = `${d} ${message}`;
        
        switch (level) {
            case LogLevel.Info:
                log(chalk.blue(formattedLog));
                break;
            case LogLevel.Warning:
                log(chalk.yellow(formattedLog));
                break;
            case LogLevel.Error:
                log(chalk.red(formattedLog));
                break;
            case LogLevel.Success:
                log(chalk.greenBright(formattedLog));
                break;
          }
    }

    /**
     * Logs an error
     * @param message
     * @constructor
     */
    public static Error(message: string) : void {
          this.Log(message, LogLevel.Error);
    }

    /**
     * Logs an info message
     * @param message
     * @constructor
     */
    public static Info(message: string) : void {
        this.Log(message, LogLevel.Info);
    }

    /**
     * Logs a warning.
     * @param message
     * @constructor
     */
    public static Warning(message: string) : void {
        this.Log(message, LogLevel.Warning);
    }

    /**
     * Logs a success message.
     * @param message
     * @constructor
     */
    public static Success(message: string) : void {
        this.Log(message, LogLevel.Success);
    }
}
/// <reference path="../../typings/index.d.ts" />

import {Global} from "./global";
import * as winston from "winston";
import {StringUtil} from "./string-util";

export class LoggingHelper {
    private static cli: boolean = false;

    public static debug (logger: string, message: string): void {
        LoggingHelper.log("debug", logger, message);
    }

    public static info (logger: string, message: string): void {
        LoggingHelper.log("info", logger, message);
    }

    public static warn (logger: string, message: string): void {
        LoggingHelper.log("warn", logger, message);
    }

    public static error (logger: string, message: string): void {
        LoggingHelper.log("error", logger, message);
    }

    private static log(level: string, logger: string, message: string) {
        // Rpad and then truncate the logger name
        let loggerString = StringUtil.rpad(logger, " ", 10).substr(0, 10);
        if (LoggingHelper.cli) {
            winston.log(level, message);
        } else {
            winston.log(level, loggerString + "  " + message);
        }
    }

    public static initialize (cli: boolean): void {
        LoggingHelper.cli = cli;
        winston.clear();
        if (LoggingHelper.cli) {
            winston.add(winston.transports.Console,
                {
                    formatter: LoggingHelper.cliFormatter,
                    level: "info"
                }
            );
        } else {
            winston.add(winston.transports.Console,
                {
                    formatter: LoggingHelper.formatter,
                    level: "info"
                }
            );
        }
    }

    private static formatter(options: any): string {
        return new Date().toISOString() + " "
            + options.level.toUpperCase() + " "
            + (undefined !== options.message ? options.message : "")
            + (options.meta && Object.keys(options.meta).length ? "\n\t"
            + JSON.stringify(options.meta) : "" );
    }

    private static cliFormatter(options: any): string {
        return options.message;
    }

}

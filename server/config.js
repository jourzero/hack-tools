const os = require("os");
const {createLogger, format, transports} = require("winston");
const {combine, timestamp, printf, json} = format;
const appRoot = require("app-root-path");
const myFormat = printf(({level, message, timestamp}) => {
    return `${timestamp} ${level}: ${message}`;
});

module.exports = {
    port: 5001,
    appName: "hack-tools",

    // Session secret
    session: {
        resave: true,
        saveUninitialized: true,
        secret: "fawefjeaiaoeifj",
        //cookie: {path: "/", httpOnly: true, secure: true, sameSite: "lax"}
        cookie: {path: "/", httpOnly: true, secure: false, sameSite: "lax"},
    },

    // Configure request logging
    reqLogging: {
        file: {
            filename: `${appRoot}/logs/access.log`,
        },
    },

    // Configure app logging
    logging: {
        file: {
            format: combine(timestamp(), json()),
            level: "info",
            handleExceptions: true,
            json: true,
            colorize: false,
            maxsize: 5242880, // 5MB
            maxFiles: 2,
            filename: `${appRoot}/logs/app.log`,
        },
        console: {
            format: combine(format.colorize(), timestamp(), myFormat),
            level: "debug",
            handleExceptions: true,
            json: false,
            colorize: true,
        },
    },
};

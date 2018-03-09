const EOL = require("os").EOL;

class Log {
    constructor(append) {
        if (typeof append !== "function") {
            throw new Error("append function must be provided.")
        }

        this._append = append;
    }

    info(message) {
        this._append("INFO: " + message + EOL);
    }

    error(message) {
        this._append("ERROR: " + message + EOL);
    }
}

module.exports = {
    Log: Log
}
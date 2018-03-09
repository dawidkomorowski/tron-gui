const Process = require("./process").Process;

class TronBot {
    constructor(path, logCallback) {
        this._path = path;
        this._logCallback = logCallback;
        this._protocol = null;
    }

    start() {
        this._info("Starting tron bot process...")
        this._process = new Process(this._path);

        return new Promise((resolve, reject) => {
            this._info("Negotiating tron bot interface.")
            this._process.sendMessage("tbi").then(data => {
                if (data === "tbi ok") {
                    this._info("Tron bot interface accepted.")
                    this._info("Negotiating interface version.")
                    this._process.sendMessage("tbi v1").then(data => {
                        if (data === "tbi v1 ok") {
                            this._info("Tron bot interface version 1 accepted.");
                            this._protocol = "tbi v1";

                            this._info("Tron bot started.");
                            resolve();
                        }
                        else {
                            this._error("Tron bot interface version 1 is not supported.")
                            this._error("Closing tron bot process.")
                            this._process.close();
                            reject();
                        }
                    });
                }
                else {
                    this._error("Tron bot interface is not supported.")
                    this._error("Closing tron bot process.")
                    this._process.close();
                    reject();
                }
            });
        });
    }

    stop() {
        this._info("Tron bot is being stopped.");
        this._process.sendMessage("exit");
    }

    _log(message) {
        if (this._logCallback) {
            this._logCallback(message);
        }
    }

    _info(message) {
        this._log("INFO: " + message);
    }

    _error(message) {
        this._log("ERROR: " + message);
    }
}

module.exports = {
    TronBot: TronBot
}
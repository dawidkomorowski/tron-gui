const Process = require("./process").Process;
const TronString = require("./tronString").TronString;
const TronMoveDirection = require("./tronBoard").TronMoveDirection;

class TronBot {
    constructor(path, log) {
        this._path = path;
        this._log = log;
        this._protocol = null;
    }

    start() {
        this._log.info("Starting tron bot process...")
        this._process = new Process(this._path);

        return new Promise((resolve, reject) => {
            this._log.info("Negotiating tron bot interface.")
            this._process.sendMessage("tbi").then(data => {
                if (data === "tbi ok") {
                    this._log.info("Tron bot interface accepted.")
                    this._log.info("Negotiating interface version.")
                    this._process.sendMessage("tbi v1").then(data => {
                        if (data === "tbi v1 ok") {
                            this._log.info("Tron bot interface version 1 accepted.");
                            this._protocol = "tbi v1";

                            this._log.info("Tron bot started.");
                            resolve();
                        }
                        else {
                            this._log.error("Tron bot interface version 1 is not supported.")
                            this._log.error("Closing tron bot process.")
                            this._process.close();
                            reject();
                        }
                    });
                }
                else {
                    this._log.error("Tron bot interface is not supported.")
                    this._log.error("Closing tron bot process.")
                    this._process.close();
                    reject();
                }
            });
        });
    }

    makeMove(tronString) {
        if (!(tronString instanceof TronString)) {
            throw new Error("tronString must be provided.");
        }

        this._log.info("Make move requested.");
        return this._process.sendMessage("move " + tronString.toString()).then(data => {
            this._log.info("Received move response: " + data);
            switch (data) {
                case "up":
                    return TronMoveDirection.Up;
                case "down":
                    return TronMoveDirection.Down;
                case "left":
                    return TronMoveDirection.Left;
                case "right":
                    return TronMoveDirection.Right;
                default:
                    this._log.error(data + " is invalid move response.")
                    throw new Error("Invalid move response.");
            }
        });
    }

    stop() {
        this._log.info("Tron bot is being stopped.");
        this._process.sendMessage("exit");
    }
}

module.exports = {
    TronBot: TronBot
}
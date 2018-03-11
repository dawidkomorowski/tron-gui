const createProcess = require("./process").createProcess;
const TronString = require("./tronString").TronString;
const TronMoveDirection = require("./tronBoard").TronMoveDirection;
const Log = require("./log").Log;

class TronBot {
    constructor(color, path, log) {
        if (!color) {
            throw new Error("color must be provided.")
        }
        if (color !== TronBotColor.Blue && color !== TronBotColor.Red) {
            throw new Error("color must be either Blue or Red.")
        }
        if (!path) {
            throw new Error("path must be provided.")
        }
        if (!(log instanceof Log)) {
            throw new Error("log must be provided.");
        }

        this._color = color;
        this._path = path;
        this._log = log;
        this._protocol = null;
        this._process = null;
    }

    start() {
        if (this._process) {
            throw new Error("Tron bot cannot be started when process is running.")
        }

        this._log.info("Starting tron bot process...")
        this._process = createProcess(this._path);

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
                            this._log.info(this._color + " color assignment requested.");
                            this._process.sendMessage("color " + this._encodeColor()).then(data => {
                                if (data === "color ok") {
                                    this._log.info(this._color + " color assignment accepted.");
                                    this._log.info("Tron bot started successfully.");
                                    resolve();
                                }
                                else {
                                    this._log.error("Color assignment rejected.")
                                    this._forceCloseProcess();
                                    reject();
                                }
                            });
                        }
                        else {
                            this._log.error("Tron bot interface version 1 is not supported.")
                            this._forceCloseProcess();
                            reject();
                        }
                    });
                }
                else {
                    this._log.error("Tron bot interface is not supported.")
                    this._forceCloseProcess();
                    reject();
                }
            });
        });
    }

    makeMove(tronString) {
        if (!(tronString instanceof TronString)) {
            throw new Error("tronString must be provided.");
        }
        if (!this._process) {
            throw new Error("Tron bot cannot make move when process is not running.")
        }

        this._log.info("Make move requested.");
        return this._process.sendMessage("move " + tronString.toString()).then(data => {
            this._log.info("Received move: " + data);
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
                    this._forceCloseProcess();
                    throw new Error("Invalid move response.");
            }
        });
    }

    stop() {
        if (!this._process) {
            throw new Error("Tron bot cannot be stopped when process is not running.")
        }

        this._log.info("Tron bot is being stopped.");
        this._process.sendMessage("exit");
        this._process = null;
    }

    _forceCloseProcess() {
        this._log.error("Closing tron bot process.")
        this._process.close();
        this._process = null;
    }

    _encodeColor() {
        switch (this._color) {
            case TronBotColor.Blue:
                return "blue";
            case TronBotColor.Red:
                return "red";
        }
    }
}

const TronBotColor = {
    Blue: "Blue",
    Red: "Red"
}

module.exports = {
    TronBot: TronBot,
    TronBotColor: TronBotColor
}
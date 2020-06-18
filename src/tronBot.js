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

        this._log.info("Negotiating tron bot interface.")

        return this._process.sendMessage("tbi").then(data => {
            if (data === "tbi ok") {
                this._log.info("Tron bot interface accepted.")
                this._log.info("Negotiating interface version.")
                return this._process.sendMessage("tbi v1");
            }
            else {
                throw new Error("Tron bot interface is not supported.");
            }
        }).then(data => {
            if (data === "tbi v1 ok") {
                this._log.info("Tron bot interface version 1 accepted.");
                this._protocol = "tbi v1";
                this._log.info(this._color + " color assignment requested.");
                return this._process.sendMessage("color " + this._encodeColor());
            }
            else {
                throw new Error("Tron bot interface version 1 is not supported.")
            }
        }).then(data => {
            if (data === "color ok") {
                this._log.info(this._color + " color assignment accepted.");
                this._log.info("Tron bot started successfully.");
            }
            else {
                throw new Error("Color assignment rejected.")
            }
        }).catch(this._createCatchHandler());
    }

    makeMove(tronString) {
        if (!(tronString instanceof TronString)) {
            throw new Error("tronString must be provided.");
        }
        if (!this._process) {
            throw new Error("Tron bot cannot make move when process is not running.")
        }

        this._log.info("Make move requested for tron string: " + tronString.toString());
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
                    throw new Error(data + " is invalid move response.");
            }
        }).catch(this._createCatchHandler());
    }

    stop() {
        if (!this._process) {
            throw new Error("Tron bot cannot be stopped when process is not running.")
        }

        this._log.info("Tron bot is being stopped.");
        this._process.sendMessage("exit").catch(this._createCatchHandler());
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

    _createCatchHandler() {
        return error => {
            this._log.error(error.message);
            this._forceCloseProcess();
            return Promise.reject(error);
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
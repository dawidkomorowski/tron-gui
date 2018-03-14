const TronBoardRenderer = require("./tronBoardRenderer").TronBoardRenderer;
const ControlPanel = require("./controlPanel").ControlPanel;
const TronString = require("./tronString").TronString;
const TronBoard = require("./tronBoard").TronBoard;
const TronMove = require("./tronBoard").TronMove;
const TronBot = require("./tronBot").TronBot;
const TronBotColor = require("./tronBot").TronBotColor;

class HostManager {
    constructor(tronBoardRenderer, controlPanel) {
        if (!(tronBoardRenderer instanceof TronBoardRenderer)) {
            throw new Error("tronBoardRenderer must be provided.");
        }
        if (!(controlPanel instanceof ControlPanel)) {
            throw new Error("controlPanel must be provided.");
        }

        this._tronBoardRenderer = tronBoardRenderer;
        this._controlPanel = controlPanel;
        this._isRunning = false;

        this._controlPanel.runButtonHandler = () => {
            this._runButtonHandler();
        };

        this._initialSetup();
    }

    _runButtonHandler() {
        if (this._isRunning) {
            return;
        }
        this._initialSetup();

        this._controlPanel.runButtonDisabled = true;
        this._isRunning = true;

        if (this._errorScope(TronBotColor.Blue, () => {
            this._blueBot = new TronBot(TronBotColor.Blue, this._controlPanel.blueBotPath, this._controlPanel.blueBotLog);
        })) {
            return;
        }
        if (this._errorScope(TronBotColor.Red, () => {
            this._redBot = new TronBot(TronBotColor.Red, this._controlPanel.redBotPath, this._controlPanel.redBotLog);
        })) {
            return;
        }

        let blueBotPromise;
        let redBotPromise;

        if (this._errorScope(TronBotColor.Blue, () => {
            blueBotPromise = this._blueBot.start();
        })) {
            return;
        }
        if (this._errorScope(TronBotColor.Red, () => {
            redBotPromise = this._redBot.start();
        })) {
            return;
        }

        Promise.all([blueBotPromise, redBotPromise]).then(() => {
            this._makeMove();
        }, () => {
            this._stop();
        });
    }

    _initialSetup() {
        const tronString = new TronString("oooooooooooo/oB9o/o10o/o10o/o10o/o10o/o10o/o10o/o10o/o10o/o9Ro/oooooooooooo");
        this._tronBoard = new TronBoard(tronString);
        this._tronBoardRenderer.tronBoard = this._tronBoard;
        this._tronBoardRenderer.render();
    }

    _makeMove() {
        Promise.all([this._blueBot.makeMove(this._tronBoard.toTronString()), this._redBot.makeMove(this._tronBoard.toTronString())]).then((moves) => {
            const tronMove = new TronMove(moves[0], moves[1]);
            this._tronBoard.makeMove(tronMove);
            this._tronBoardRenderer.render();

            if (this._tronBoard.isGameOver) {
                if (!this._tronBoard.isBlueAlive) {
                    this._controlPanel.blueBotLog.info("Blue bot crashed!")
                }
                if (!this._tronBoard.isRedAlive) {
                    this._controlPanel.redBotLog.info("Red bot crashed!");
                }

                this._stop();
            }
            else {
                this._makeMove();
            }
        }, () => {
            this._stop();
        });
    }

    _stop() {
        this._controlPanel.runButtonDisabled = false;
        this._isRunning = false;
        this._blueBot.stop();
        this._redBot.stop();
    }

    _errorScope(color, action) {
        try {
            action();
        } catch (error) {
            let log;
            switch (color) {
                case TronBotColor.Blue:
                    log = this._controlPanel.blueBotLog;
                    break;
                case TronBotColor.Red:
                    log = this._controlPanel.redBotLog;
                    break;
                default:
                    throw new Error("color must be either Blue or Red.");
            }
            log.error(error);
            this._controlPanel.runButtonDisabled = false;
            this._isRunning = false;

            try {
                this._stop();
            }
            catch (error) {
                log.error(error);
            }

            return true;
        }

        return false;
    }
}

module.exports = {
    HostManager: HostManager
}
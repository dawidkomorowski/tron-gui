const TronBoardRenderer = require("./UserInterface/tronBoardRenderer").TronBoardRenderer;
const ControlPanel = require("./UserInterface/controlPanel").ControlPanel;
const ResultsControl = require("./UserInterface/resultsControl").ResultsControl;
const Result = require("./UserInterface/resultsControl").Result;
const TronString = require("./tronString").TronString;
const TronBoard = require("./tronBoard").TronBoard;
const TronMove = require("./tronBoard").TronMove;
const TronBot = require("./tronBot").TronBot;
const TronBotColor = require("./tronBot").TronBotColor;
const Configuration = require("./configuration").Configuration;

const ConfigFilePath = "tron-gui-config.json";

class HostManager {
    constructor(tronBoardRenderer, controlPanel, resultsControl) {
        if (!(tronBoardRenderer instanceof TronBoardRenderer)) {
            throw new Error("tronBoardRenderer must be provided.");
        }
        if (!(controlPanel instanceof ControlPanel)) {
            throw new Error("controlPanel must be provided.");
        }
        if (!(resultsControl instanceof ResultsControl)) {
            throw new Error("resultsControl must be provided.")
        }

        this._tronBoardRenderer = tronBoardRenderer;
        this._controlPanel = controlPanel;
        this._resultsControl = resultsControl;

        this._controlPanel.runButtonHandler = () => {
            this._runButtonHandler();
        };

        this._controlPanel.setConfiguration(Configuration.readFromFile(ConfigFilePath));

        this._initialSetup();
    }

    onAppClosing() {
        const configuration = this._controlPanel.getConfiguration();
        Configuration.writeToFile(ConfigFilePath, configuration);
    }

    _runButtonHandler() {
        this._controlPanel.clearLogs();
        this._initialSetup();

        this._controlPanel.runButtonDisabled = true;

        const configuration = this._controlPanel.getConfiguration();

        if (this._stopOnError(TronBotColor.Blue, () => {
            this._blueBot = new TronBot(TronBotColor.Blue, configuration.blueBotConfig, this._controlPanel.blueBotLog);
        })) {
            return;
        }
        if (this._stopOnError(TronBotColor.Red, () => {
            this._redBot = new TronBot(TronBotColor.Red, configuration.redBotConfig, this._controlPanel.redBotLog);
        })) {
            return;
        }

        Promise.all([this._blueBot.start(), this._redBot.start()]).then(() => {
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
        const blueMovePromise = this._blueBot.makeMove(this._tronBoard.toTronString());
        const redMovePromise = this._redBot.makeMove(this._tronBoard.toTronString());
        Promise.all([blueMovePromise, redMovePromise]).then((moves) => {
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

                this._appendResult(this._tronBoard.isBlueAlive, this._tronBoard.isRedAlive);

                this._stop();
            }
            else {
                this._makeMove();
            }
        }, () => {
            this._stop();
        });
    }

    _appendResult(blueIsAlive, redIsAlive) {
        if (blueIsAlive && redIsAlive) {
            throw new Error("Assertion error. Blue and Red cannot be both alive when game is over.")
        }
        if (blueIsAlive && !redIsAlive) {
            this._resultsControl.appendResult(Result.BlueWon);
        }
        if (!blueIsAlive && redIsAlive) {
            this._resultsControl.appendResult(Result.RedWon);
        }
        if (!blueIsAlive && !redIsAlive) {
            this._resultsControl.appendResult(Result.Draw);
        }
    }

    _stop() {
        this._controlPanel.runButtonDisabled = false;

        if (this._blueBot) {
            this._catchAndLogErrors(TronBotColor.Blue, () => {
                this._blueBot.stop();
            });
        }

        if (this._redBot) {
            this._catchAndLogErrors(TronBotColor.Red, () => {
                this._redBot.stop();
            });
        }
    }

    _catchAndLogErrors(color, action) {
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

            return true;
        }

        return false;
    }

    _stopOnError(color, action) {
        if (this._catchAndLogErrors(color, action)) {
            this._stop();
            return true;
        }

        return false;
    }
}

module.exports = {
    HostManager: HostManager
}
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

        this._blueBot = new TronBot(TronBotColor.Blue, this._controlPanel.blueBotPath, this._controlPanel.blueBotLog);
        this._redBot = new TronBot(TronBotColor.Red, this._controlPanel.redBotPath, this._controlPanel.redBotLog);

        Promise.all([this._blueBot.start(), this._redBot.start()]).then(() => {
            this._makeMove();
        }, () => {
            this._controlPanel.runButtonDisabled = false;
            this._isRunning = false;
        });
    }

    _initialSetup() {
        //const tronString = new TronString("oooooooooooo/oB9o/o10o/o10o/o10o/o10o/o10o/o10o/o10o/o10o/o9Ro/oooooooooooo");
        const tronString = new TronString("oooooooooooo/o10o/o10o/o10o/o4B5o/o10o/o10o/o5R4o/o10o/o10o/o10o/oooooooooooo");
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

                this._controlPanel.runButtonDisabled = false;
                this._isRunning = false;
            }
            else {
                this._makeMove();
            }
        }, () => {
            this._controlPanel.runButtonDisabled = false;
            this._isRunning = false;
        });
    }
}

module.exports = {
    HostManager: HostManager
}
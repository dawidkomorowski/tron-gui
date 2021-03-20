const Log = require("../log").Log;
const Configuration = require("../configuration").Configuration;
const TronBotConfig = require("../configuration").TronBotConfig;

class ControlPanel {
    constructor(controlsIds) {
        this._blueBotPathInput = document.getElementById(controlsIds.blueBotPathInput);
        this._redBotPathInput = document.getElementById(controlsIds.redBotPathInput);
        this._runButton = document.getElementById(controlsIds.runButton);
        this._blueBotLogTextArea = document.getElementById(controlsIds.blueBotLogTextArea);
        this._redBotLogTextArea = document.getElementById(controlsIds.redBotLogTextArea);

        this._runButton.addEventListener("click", event => {
            if (this._runButtonHandler) {
                this._runButtonHandler();
            }
        })

        this._blueBotLog = new Log((message) => {
            this._blueBotLogTextArea.value += message;
            this._blueBotLogTextArea.scrollTop = this._blueBotLogTextArea.scrollHeight;
        });

        this._redBotLog = new Log((message) => {
            this._redBotLogTextArea.value += message;
            this._redBotLogTextArea.scrollTop = this._redBotLogTextArea.scrollHeight;
        });
    }

    set runButtonHandler(handler) { this._runButtonHandler = handler; }
    set runButtonDisabled(disabled) { this._runButton.disabled = disabled; }
    get blueBotLog() { return this._blueBotLog; }
    get redBotLog() { return this._redBotLog; }

    clearLogs() {
        this._blueBotLogTextArea.value = "";
        this._redBotLogTextArea.value = "";
    }

    getConfiguration() {
        return new Configuration(
            new TronBotConfig(this._blueBotPathInput.value),
            new TronBotConfig(this._redBotPathInput.value)
        );
    }

    setConfiguration() {

    }
}

module.exports = {
    ControlPanel: ControlPanel
}
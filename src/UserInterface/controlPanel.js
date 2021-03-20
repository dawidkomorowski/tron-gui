const Log = require("../log").Log;
const Configuration = require("../configuration").Configuration;
const TronBotConfig = require("../configuration").TronBotConfig;

class ControlPanel {
    constructor(rootElementId) {
        const rootElement = document.getElementById(rootElementId);
        this._blueBotPathInput = rootElement.querySelector("#blue-bot-path");
        this._redBotPathInput = rootElement.querySelector("#red-bot-path");
        this._runButton = rootElement.querySelector("#run-button");
        this._blueBotLogTextArea = rootElement.querySelector("#blue-bot-log");
        this._redBotLogTextArea = rootElement.querySelector("#red-bot-log");

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

    setConfiguration(configuration) {
        this._blueBotPathInput.value = configuration.blueBotConfig.path;
        this._redBotPathInput.value = configuration.redBotConfig.path;
    }
}

module.exports = {
    ControlPanel: ControlPanel
}
const Log = require("./log").Log;

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
            this._blueBotLogTextArea.textContent = this._blueBotLogTextArea.textContent + message;
            this._blueBotLogTextArea.scrollTop = this._blueBotLogTextArea.scrollHeight;
        });

        this._redBotLog = new Log((message) => {
            this._redBotLogTextArea.textContent = this._redBotLogTextArea.textContent + message;
            this._redBotLogTextArea.scrollTop = this._redBotLogTextArea.scrollHeight;
        });
    }

    get blueBotPath() { return this._blueBotPathInput.value; }
    get redBotPath() { return this._redBotPathInput.value; }
    set runButtonHandler(handler) { this._runButtonHandler = handler; }
    set runButtonDisabled(disabled) { this._runButton.disabled = disabled; }
    get blueBotLog() { return this._blueBotLog; }
    get redBotLog() { return this._redBotLog; }
}

module.exports = {
    ControlPanel: ControlPanel
}
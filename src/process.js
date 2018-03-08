const spawn = require("child_process").spawn;

class Process {
    constructor(path) {
        this._internalProcess = spawn(path);
        this._internalProcess.stdout.on("data", (data) => { this._internalStdoutHandler(data); });

        this._responseHandler = null;
    }

    sendMessage(message, responseHandler) {
        this._internalProcess.stdin.write(message + "\n");
        this._responseHandler = responseHandler;
    }

    close() {
        this._internalProcess.kill();
    }

    _internalStdoutHandler(data) {
        if (this._responseHandler) {
            this._responseHandler(data);
        }
    }
}

module.exports = {
    Process: Process
}
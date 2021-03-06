const spawn = require("child_process").spawn;
const EOL = require("os").EOL;

class Process {
    constructor(path) {
        this._internalProcess = spawn(path);
        this._internalProcess.stdout.on("data", data => { this._internalStdoutHandler(data); });

        this._responseHandler = null;
    }

    sendMessage(message) {
        const promise = new Promise((resolve, reject) => {
            this._responseHandler = data => {
                resolve(data);
                this._responseHandler = null;
            };

            const timeout = 5000;
            setTimeout(() => {
                reject(new Error(`Communication with process timed out after ${timeout} ms.`))
            }, timeout)

            try {
                this._internalProcess.stdin.write(message + EOL);

            } catch (error) {
                reject(error);
            }
        });

        return promise;
    }

    close() {
        this._internalProcess.kill();
    }

    _internalStdoutHandler(data) {
        if (this._responseHandler) {
            let rawStrData = data.toString();
            let strData = rawStrData.substring(0, rawStrData.length - EOL.length);
            this._responseHandler(strData);
        }
    }
}

module.exports = {
    Process: Process,
    createProcess(path) {
        return new Process(path);
    }
}
const assert = require("assert");
const proxyquire = require("proxyquire");
const Log = require("../src/log").Log;
const TronBotColor = require("../src/tronBot").TronBotColor;
const TronString = require("../src/tronString").TronString;
const TronMoveDirection = require("../src/tronBoard").TronMoveDirection;
const TronBotConfig = require("../src/configuration").TronBotConfig;

function createProcessMock() {
    return {
        sendMessage(message) {
            this.messages.push(message);
            return new Promise((resolve, reject) => {
                if (this.responses[message].ok) {
                    resolve(this.responses[message].response);
                }
                else {
                    reject(new Error());
                }
            });
        },
        close() {
            this.closed = true;
        },
        messages: [],
        responses: {},
        path: null,
        closed: false
    };
}

function createLog() {
    return new Log(() => { });
}

function createSUT() {
    let processMock = createProcessMock();
    let TronBot = proxyquire("../src/tronBot", {
        "./process": {
            createProcess(path) {
                processMock.path = path;
                return processMock;
            }
        }
    }).TronBot;

    return {
        ProcessMock: processMock,
        TronBot: TronBot
    }
}

function configureHappyPath(processMock) {
    processMock.responses["tbi"] = {
        ok: true,
        response: "tbi ok"
    };
    processMock.responses["tbi v1"] = {
        ok: true,
        response: "tbi v1 ok"
    };
    processMock.responses["color blue"] = {
        ok: true,
        response: "color ok"
    };
}

describe("TronBot", () => {
    describe("#constructor", () => {
        it("constructor() should throw error", () => {
            const TronBot = createSUT().TronBot;
            assert.throws(() => {
                const tronBot = new TronBot();
            }, /color must be provided/);
        });
        it('constructor("red") should throw error', () => {
            const TronBot = createSUT().TronBot;
            assert.throws(() => {
                const tronBot = new TronBot("red");
            }, /color must be either Blue or Red/);
        });
        it("constructor(TronBotColor.Blue) should throw error", () => {
            const TronBot = createSUT().TronBot;
            assert.throws(() => {
                const tronBot = new TronBot(TronBotColor.Blue);
            }, /config must be provided/);
        });
        it("constructor(TronBotColor.Blue, config) should throw error given config with null path", () => {
            const TronBot = createSUT().TronBot;
            const config = new TronBotConfig(null);
            assert.throws(() => {
                const tronBot = new TronBot(TronBotColor.Blue, config);
            }, /config.path must be provided/);
        });
        it("constructor(TronBotColor.Blue, config) should throw error given config with empty path", () => {
            const TronBot = createSUT().TronBot;
            const config = new TronBotConfig("");
            assert.throws(() => {
                const tronBot = new TronBot(TronBotColor.Blue, config);
            }, /config.path must be provided/);
        });
        it('constructor(TronBotColor.Blue, config) should throw error', () => {
            const TronBot = createSUT().TronBot;
            const config = new TronBotConfig("some-path");
            assert.throws(() => {
                const tronBot = new TronBot(TronBotColor.Blue, config);
            }, /log must be provided/);
        });
        it("should create new instance given color, config and log", () => {
            const TronBot = createSUT().TronBot;
            const config = new TronBotConfig("some-path");
            const tronBot = new TronBot(TronBotColor.Blue, config, createLog());
            assert.strictEqual(typeof tronBot, "object");
        });
    });
    describe("#start", () => {
        it("should start process with given path", () => {
            const sut = createSUT();
            const TronBot = sut.TronBot;
            const ProcessMock = sut.ProcessMock;

            const config = new TronBotConfig("some-path");
            const tronBot = new TronBot(TronBotColor.Blue, config, createLog());
            tronBot.start();
            assert.strictEqual(ProcessMock.path, "some-path");
        });
        it("should send message 'tbi' and on response other than 'tbi ok' should close process and reject promise", (done) => {
            const sut = createSUT();
            const TronBot = sut.TronBot;
            const ProcessMock = sut.ProcessMock;

            ProcessMock.responses["tbi"] = {
                ok: true,
                response: "tbi n/a"
            };

            const config = new TronBotConfig("some-path");
            const tronBot = new TronBot(TronBotColor.Blue, config, createLog());
            tronBot.start().then(() => {
                assert.fail();
                done();
            }, () => {
                assert.strictEqual(ProcessMock.messages[0], "tbi");
                assert.strictEqual(ProcessMock.closed, true);
                done();
            });
        });
        it("should send message 'tbi' and on response 'tbi ok' should send message 'tbi v1' and on response other than 'tbi v1 ok' should close process and reject promise", (done) => {
            const sut = createSUT();
            const TronBot = sut.TronBot;
            const ProcessMock = sut.ProcessMock;

            ProcessMock.responses["tbi"] = {
                ok: true,
                response: "tbi ok"
            };
            ProcessMock.responses["tbi v1"] = {
                ok: true,
                response: "tbi v1 n/a"
            };

            const config = new TronBotConfig("some-path");
            const tronBot = new TronBot(TronBotColor.Blue, config, createLog());
            tronBot.start().then(() => {
                assert.fail();
                done();
            }, () => {
                assert.strictEqual(ProcessMock.messages[0], "tbi");
                assert.strictEqual(ProcessMock.messages[1], "tbi v1");
                assert.strictEqual(ProcessMock.closed, true);
                done();
            });
        });
        it("should send message 'tbi' and on response 'tbi ok' should send message 'tbi v1' and on response 'tbi v1 ok' should send message 'color blue' and on responce other than 'color ok' should close process and reject promise", (done) => {
            const sut = createSUT();
            const TronBot = sut.TronBot;
            const ProcessMock = sut.ProcessMock;

            ProcessMock.responses["tbi"] = {
                ok: true,
                response: "tbi ok"
            };
            ProcessMock.responses["tbi v1"] = {
                ok: true,
                response: "tbi v1 ok"
            };
            ProcessMock.responses["color blue"] = {
                ok: true,
                response: "color n/a"
            };

            const config = new TronBotConfig("some-path");
            const tronBot = new TronBot(TronBotColor.Blue, config, createLog());
            tronBot.start().then(() => {
                assert.fail();
                done();
            }, () => {
                assert.strictEqual(ProcessMock.messages[0], "tbi");
                assert.strictEqual(ProcessMock.messages[1], "tbi v1");
                assert.strictEqual(ProcessMock.messages[2], "color blue");
                assert.strictEqual(ProcessMock.closed, true);
                done();
            });
        });
        it("should send message 'tbi' and on response 'tbi ok' should send message 'tbi v1' and on response 'tbi v1 ok' should send message 'color red' and on responce other than 'color ok' should close process and reject promise", (done) => {
            const sut = createSUT();
            const TronBot = sut.TronBot;
            const ProcessMock = sut.ProcessMock;

            ProcessMock.responses["tbi"] = {
                ok: true,
                response: "tbi ok"
            };
            ProcessMock.responses["tbi v1"] = {
                ok: true,
                response: "tbi v1 ok"
            };
            ProcessMock.responses["color red"] = {
                ok: true,
                response: "color n/a"
            };

            const config = new TronBotConfig("some-path");
            const tronBot = new TronBot(TronBotColor.Red, config, createLog());
            tronBot.start().then(() => {
                assert.fail();
                done();
            }, () => {
                assert.strictEqual(ProcessMock.messages[0], "tbi");
                assert.strictEqual(ProcessMock.messages[1], "tbi v1");
                assert.strictEqual(ProcessMock.messages[2], "color red");
                assert.strictEqual(ProcessMock.closed, true);
                done();
            });
        });
        it("should send message 'tbi' and on response 'tbi ok' should send message 'tbi v1' and on response 'tbi v1 ok' should send message 'color blue' and on responce 'color ok' should resolve promise", (done) => {
            const sut = createSUT();
            const TronBot = sut.TronBot;
            const ProcessMock = sut.ProcessMock;

            configureHappyPath(ProcessMock);

            const config = new TronBotConfig("some-path");
            const tronBot = new TronBot(TronBotColor.Blue, config, createLog());
            tronBot.start().then(() => {
                assert.strictEqual(ProcessMock.messages[0], "tbi");
                assert.strictEqual(ProcessMock.messages[1], "tbi v1");
                assert.strictEqual(ProcessMock.messages[2], "color blue");
                assert.strictEqual(ProcessMock.closed, false);
                done();
            }, () => {
                assert.fail();
                done();
            });
        });
        it("should send message 'tbi' and on error should close process and reject promise", (done) => {
            const sut = createSUT();
            const TronBot = sut.TronBot;
            const ProcessMock = sut.ProcessMock;

            configureHappyPath(ProcessMock);

            ProcessMock.responses["tbi"].ok = false;

            const config = new TronBotConfig("some-path");
            const tronBot = new TronBot(TronBotColor.Blue, config, createLog());
            tronBot.start().then(() => {
                assert.fail();
                done();
            }, () => {
                assert.strictEqual(ProcessMock.messages[0], "tbi");
                assert.strictEqual(ProcessMock.closed, true);
                done();
            });
        });
    });
    describe("#makeMove", () => {
        it("should send message 'move 4/4/4/4' and on response 'up' should return TronMoveDirection.Up", (done) => {
            const sut = createSUT();
            const TronBot = sut.TronBot;
            const ProcessMock = sut.ProcessMock;

            configureHappyPath(ProcessMock);

            ProcessMock.responses["move 4/4/4/4"] = {
                ok: true,
                response: "up"
            };

            let tronString = new TronString(4, 4);

            const config = new TronBotConfig("some-path");
            const tronBot = new TronBot(TronBotColor.Blue, config, createLog());
            tronBot.start().then(() => {
                ProcessMock.messages = [];
                return tronBot.makeMove(tronString);
            }).then(move => {
                assert.strictEqual(ProcessMock.messages[0], "move 4/4/4/4");
                assert.strictEqual(move, TronMoveDirection.Up);
                done();
            }).catch(error => {
                assert.fail(error);
                done();
            });
        });
        it("should send message 'move 4/4/4/4' and on response 'down' should return TronMoveDirection.Down", (done) => {
            const sut = createSUT();
            const TronBot = sut.TronBot;
            const ProcessMock = sut.ProcessMock;

            configureHappyPath(ProcessMock);

            ProcessMock.responses["move 4/4/4/4"] = {
                ok: true,
                response: "down"
            };

            let tronString = new TronString(4, 4);

            const config = new TronBotConfig("some-path");
            const tronBot = new TronBot(TronBotColor.Blue, config, createLog());
            tronBot.start().then(() => {
                ProcessMock.messages = [];
                return tronBot.makeMove(tronString);
            }).then(move => {
                assert.strictEqual(ProcessMock.messages[0], "move 4/4/4/4");
                assert.strictEqual(move, TronMoveDirection.Down);
                done();
            }).catch(error => {
                assert.fail(error);
                done();
            });
        });
        it("should send message 'move 4/4/4/4' and on response 'left' should return TronMoveDirection.Left", (done) => {
            const sut = createSUT();
            const TronBot = sut.TronBot;
            const ProcessMock = sut.ProcessMock;

            configureHappyPath(ProcessMock);

            ProcessMock.responses["move 4/4/4/4"] = {
                ok: true,
                response: "left"
            };

            let tronString = new TronString(4, 4);

            const config = new TronBotConfig("some-path");
            const tronBot = new TronBot(TronBotColor.Blue, config, createLog());
            tronBot.start().then(() => {
                ProcessMock.messages = [];
                return tronBot.makeMove(tronString);
            }).then(move => {
                assert.strictEqual(ProcessMock.messages[0], "move 4/4/4/4");
                assert.strictEqual(move, TronMoveDirection.Left);
                done();
            }).catch(error => {
                assert.fail(error);
                done();
            });
        });
        it("should send message 'move 4/4/4/4' and on response 'right' should return TronMoveDirection.Right", (done) => {
            const sut = createSUT();
            const TronBot = sut.TronBot;
            const ProcessMock = sut.ProcessMock;

            configureHappyPath(ProcessMock);

            ProcessMock.responses["move 4/4/4/4"] = {
                ok: true,
                response: "right"
            };

            let tronString = new TronString(4, 4);

            const config = new TronBotConfig("some-path");
            const tronBot = new TronBot(TronBotColor.Blue, config, createLog());
            tronBot.start().then(() => {
                ProcessMock.messages = [];
                return tronBot.makeMove(tronString);
            }).then(move => {
                assert.strictEqual(ProcessMock.messages[0], "move 4/4/4/4");
                assert.strictEqual(move, TronMoveDirection.Right);
                done();
            }).catch(error => {
                assert.fail(error);
                done();
            });
        });
        it("should send message 'move 4/4/4/4' and on error should close process and reject promise", (done) => {
            const sut = createSUT();
            const TronBot = sut.TronBot;
            const ProcessMock = sut.ProcessMock;

            configureHappyPath(ProcessMock);

            ProcessMock.responses["move 4/4/4/4"] = {
                ok: false,
                response: "up"
            };

            let tronString = new TronString(4, 4);

            const config = new TronBotConfig("some-path");
            const tronBot = new TronBot(TronBotColor.Blue, config, createLog());
            tronBot.start().then(() => {
                ProcessMock.messages = [];
                return tronBot.makeMove(tronString);
            }).then(() => {
                assert.fail(error);
                done();
            }).catch(() => {
                assert.strictEqual(ProcessMock.messages[0], "move 4/4/4/4");
                assert.strictEqual(ProcessMock.closed, true);
                done();
            });
        });
    });
    describe("#stop", () => {
        it("should send message 'exit'", (done) => {
            const sut = createSUT();
            const TronBot = sut.TronBot;
            const ProcessMock = sut.ProcessMock;

            configureHappyPath(ProcessMock);

            const config = new TronBotConfig("some-path");
            const tronBot = new TronBot(TronBotColor.Blue, config, createLog());
            tronBot.start().then(() => {
                ProcessMock.messages = [];
                tronBot.stop();

                assert.strictEqual(ProcessMock.messages[0], "exit");
                done();
            }, () => {
                assert.fail();
                done();
            });
        });
    });
});
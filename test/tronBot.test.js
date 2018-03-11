const assert = require("assert");
const proxyquire = require("proxyquire");
const Log = require("../src/log").Log;
const TronBotColor = require("../src/tronBot").TronBotColor;
const TronString = require("../src/tronString").TronString;
const TronMoveDirection = require("../src/tronBoard").TronMoveDirection;

function createProcessMock() {
    return {
        sendMessage(message) {
            this.messages.push(message);
            return new Promise((resolve, reject) => {
                if (this.responses[message].ok) {
                    resolve(this.responses[message].response);
                }
                else {
                    reject();
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
            }, /path must be provided/);
        });
        it('constructor(TronBotColor.Blue, "some-path") should throw error', () => {
            const TronBot = createSUT().TronBot;
            assert.throws(() => {
                const tronBot = new TronBot(TronBotColor.Blue, "some-path");
            }, /log must be provided/);
        });
        it("should create new instance given path and log", () => {
            const TronBot = createSUT().TronBot;
            const tronBot = new TronBot(TronBotColor.Blue, "some-path", createLog());
            assert.equal(typeof tronBot, "object");
        });
    });
    describe("#start", () => {
        it("should start process with given path", () => {
            const sut = createSUT();
            const TronBot = sut.TronBot;
            const ProcessMock = sut.ProcessMock;

            const tronBot = new TronBot(TronBotColor.Blue, "some-path", createLog());
            tronBot.start();
            assert.equal(ProcessMock.path, "some-path");
        });
        it("should send message 'tbi' and on response other than 'tbi ok' should close process and reject promise", (done) => {
            const sut = createSUT();
            const TronBot = sut.TronBot;
            const ProcessMock = sut.ProcessMock;

            ProcessMock.responses["tbi"] = {
                ok: true,
                response: "tbi n/a"
            };

            const tronBot = new TronBot(TronBotColor.Blue, "some-path", createLog());
            tronBot.start().then(() => {
                assert.fail();
                done();
            }, () => {
                assert.equal(ProcessMock.messages[0], "tbi");
                assert.equal(ProcessMock.closed, true);
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

            const tronBot = new TronBot(TronBotColor.Blue, "some-path", createLog());
            tronBot.start().then(() => {
                assert.fail();
                done();
            }, () => {
                assert.equal(ProcessMock.messages[0], "tbi");
                assert.equal(ProcessMock.messages[1], "tbi v1");
                assert.equal(ProcessMock.closed, true);
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

            const tronBot = new TronBot(TronBotColor.Blue, "some-path", createLog());
            tronBot.start().then(() => {
                assert.fail();
                done();
            }, () => {
                assert.equal(ProcessMock.messages[0], "tbi");
                assert.equal(ProcessMock.messages[1], "tbi v1");
                assert.equal(ProcessMock.messages[2], "color blue");
                assert.equal(ProcessMock.closed, true);
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

            const tronBot = new TronBot(TronBotColor.Red, "some-path", createLog());
            tronBot.start().then(() => {
                assert.fail();
                done();
            }, () => {
                assert.equal(ProcessMock.messages[0], "tbi");
                assert.equal(ProcessMock.messages[1], "tbi v1");
                assert.equal(ProcessMock.messages[2], "color red");
                assert.equal(ProcessMock.closed, true);
                done();
            });
        });
        it("should send message 'tbi' and on response 'tbi ok' should send message 'tbi v1' and on response 'tbi v1 ok' should send message 'color blue' and on responce 'color ok' should resolve promise", (done) => {
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
                response: "color ok"
            };

            const tronBot = new TronBot(TronBotColor.Blue, "some-path", createLog());
            tronBot.start().then(() => {
                assert.equal(ProcessMock.messages[0], "tbi");
                assert.equal(ProcessMock.messages[1], "tbi v1");
                assert.equal(ProcessMock.messages[2], "color blue");
                assert.equal(ProcessMock.closed, false);
                done();
            }, () => {
                assert.fail();
                done();
            });
        });
    });
    describe("#makeMove", () => {
        it("should send message 'move 4/4/4/4' and on response 'up' should return TronMoveDirection.Up", (done) => {
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
                response: "color ok"
            };
            ProcessMock.responses["move 4/4/4/4"] = {
                ok: true,
                response: "up"
            };

            let tronString = new TronString(4, 4);

            const tronBot = new TronBot(TronBotColor.Blue, "some-path", createLog());
            tronBot.start().then(() => {
                ProcessMock.messages = [];
                tronBot.makeMove(tronString).then((move) => {
                    assert.equal(ProcessMock.messages[0], "move 4/4/4/4");
                    assert.equal(move, TronMoveDirection.Up);
                    done();
                }, () => {
                    assert.fail();
                    done();
                });
            }, () => {
                assert.fail();
                done();
            });
        });
        it("should send message 'move 4/4/4/4' and on response 'down' should return TronMoveDirection.Down", (done) => {
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
                response: "color ok"
            };
            ProcessMock.responses["move 4/4/4/4"] = {
                ok: true,
                response: "down"
            };

            let tronString = new TronString(4, 4);

            const tronBot = new TronBot(TronBotColor.Blue, "some-path", createLog());
            tronBot.start().then(() => {
                ProcessMock.messages = [];
                tronBot.makeMove(tronString).then((move) => {
                    assert.equal(ProcessMock.messages[0], "move 4/4/4/4");
                    assert.equal(move, TronMoveDirection.Down);
                    done();
                }, () => {
                    assert.fail();
                    done();
                });
            }, () => {
                assert.fail();
                done();
            });
        });
        it("should send message 'move 4/4/4/4' and on response 'left' should return TronMoveDirection.Left", (done) => {
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
                response: "color ok"
            };
            ProcessMock.responses["move 4/4/4/4"] = {
                ok: true,
                response: "left"
            };

            let tronString = new TronString(4, 4);

            const tronBot = new TronBot(TronBotColor.Blue, "some-path", createLog());
            tronBot.start().then(() => {
                ProcessMock.messages = [];
                tronBot.makeMove(tronString).then((move) => {
                    assert.equal(ProcessMock.messages[0], "move 4/4/4/4");
                    assert.equal(move, TronMoveDirection.Left);
                    done();
                }, () => {
                    assert.fail();
                    done();
                });
            }, () => {
                assert.fail();
                done();
            });
        });
        it("should send message 'move 4/4/4/4' and on response 'right' should return TronMoveDirection.Right", (done) => {
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
                response: "color ok"
            };
            ProcessMock.responses["move 4/4/4/4"] = {
                ok: true,
                response: "right"
            };

            let tronString = new TronString(4, 4);

            const tronBot = new TronBot(TronBotColor.Blue, "some-path", createLog());
            tronBot.start().then(() => {
                ProcessMock.messages = [];
                tronBot.makeMove(tronString).then((move) => {
                    assert.equal(ProcessMock.messages[0], "move 4/4/4/4");
                    assert.equal(move, TronMoveDirection.Right);
                    done();
                }, () => {
                    assert.fail();
                    done();
                });
            }, () => {
                assert.fail();
                done();
            });
        });
    });
    describe("#stop", () => {
        it("should send message 'exit'", (done) => {
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
                response: "color ok"
            };

            const tronBot = new TronBot(TronBotColor.Blue, "some-path", createLog());
            tronBot.start().then(() => {
                ProcessMock.messages = [];
                tronBot.stop();

                assert.equal(ProcessMock.messages[0], "exit");
                done();
            }, () => {
                assert.fail();
                done();
            });
        });
    });
});
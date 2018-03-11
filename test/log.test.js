const assert = require("assert");
const Log = require("../src/log").Log;
const EOL = require("os").EOL;

describe("Log", () => {
    describe("#constructor", () => {
        it("constructor() should throw error", () => {
            assert.throws(() => {
                const log = new Log();
            }, /append function must be provided/);
        });

        it("constructor({}) should throw error", () => {
            assert.throws(() => {
                const log = new Log({});
            }, /append function must be provided/);
        });

        it("constructor(() => {}) should create Log instance", () => {
            const log = new Log(() => { });
            assert.equal(typeof log, "object");
        });
    });

    describe("#info", () => {
        it("info('some message') should append 'INFO: some message' end of line", () => {
            var infoMessage;
            const log = new Log((m) => {
                infoMessage = m;
            });

            log.info("some message");

            assert.equal(infoMessage, "INFO: some message" + EOL)
        });
    });

    describe("#error", () => {
        it("error('some message') should append 'ERROR: some message' end of line", () => {
            var infoMessage;
            const log = new Log((m) => {
                infoMessage = m;
            });

            log.error("some message");

            assert.equal(infoMessage, "ERROR: some message" + EOL)
        });
    });
});
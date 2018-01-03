const assert = require("assert");
const TronBoard = require("../src/tronBoard").TronBoard;
const TronString = require("../src/tronString").TronString;
const TronStringEnum = require("../src/tronString").TronStringEnum;

describe("TronBoard", () => {
    describe("#constructor", () => {
        it("constructor() should throw error", () => {
            assert.throws(() => {
                const tronBoard = new TronBoard();
            }, /tronString must be provided/);
        });

        it("constructor('') should throw error", () => {
            assert.throws(() => {
                const tronBoard = new TronBoard("");
            }, /tronString must be provided/);
        });

        it("constructor({}) should throw error", () => {
            assert.throws(() => {
                const tronBoard = new TronBoard({});
            }, /tronString must be provided/);
        });

        it("constructor(new TronString('bbbb/rR1b/r1Bb/rrrr')) should create board 4x4 with some blue, blue head, red, red head and empty tiles", () => {
            const tronString = new TronString("bbbb/rR1b/r1Bb/rrrr");
            const tronBoard = new TronBoard(tronString);
            assert.equal(tronBoard.width, 4);
            assert.equal(tronBoard.height, 4);

            assert.equal(tronBoard.getElementAt(0, 0), TronStringEnum.Blue);
            assert.equal(tronBoard.getElementAt(1, 0), TronStringEnum.Blue);
            assert.equal(tronBoard.getElementAt(2, 0), TronStringEnum.Blue);
            assert.equal(tronBoard.getElementAt(3, 0), TronStringEnum.Blue);

            assert.equal(tronBoard.getElementAt(0, 1), TronStringEnum.Red);
            assert.equal(tronBoard.getElementAt(1, 1), TronStringEnum.RedHead);
            assert.equal(tronBoard.getElementAt(2, 1), TronStringEnum.Empty);
            assert.equal(tronBoard.getElementAt(3, 1), TronStringEnum.Blue);

            assert.equal(tronBoard.getElementAt(0, 2), TronStringEnum.Red);
            assert.equal(tronBoard.getElementAt(1, 2), TronStringEnum.Empty);
            assert.equal(tronBoard.getElementAt(2, 2), TronStringEnum.BlueHead);
            assert.equal(tronBoard.getElementAt(3, 2), TronStringEnum.Blue);

            assert.equal(tronBoard.getElementAt(0, 3), TronStringEnum.Red);
            assert.equal(tronBoard.getElementAt(1, 3), TronStringEnum.Red);
            assert.equal(tronBoard.getElementAt(2, 3), TronStringEnum.Red);
            assert.equal(tronBoard.getElementAt(3, 3), TronStringEnum.Red);
        });
    });

    describe("#toTronString", () => {
        it("toTronString() should return TronString '1b1r/2B1/1R2/b1r1' when TronBoard created from such a TronString", () => {
            const tronString = new TronString("1b1r/2B1/1R2/b1r1");
            const tronBoard = new TronBoard(tronString);
            const actual = tronBoard.toTronString();
            assert.equal(actual.toString(), "1b1r/2B1/1R2/b1r1");
        });

        it("toTronString() should return TronString 'bbbb/rR1b/r1Bb/rrrr' when TronBoard created from such a TronString", () => {
            const tronString = new TronString("bbbb/rR1b/r1Bb/rrrr");
            const tronBoard = new TronBoard(tronString);
            const actual = tronBoard.toTronString();
            assert.equal(actual.toString(), "bbbb/rR1b/r1Bb/rrrr");
        });
    });
});

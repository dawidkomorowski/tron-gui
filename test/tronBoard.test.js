const assert = require("assert");
const TronBoard = require("../src/tronBoard").TronBoard;
const TronBoardEnum = require("../src/tronBoard").TronBoardEnum;

describe("TronBoard", () => {
    it("constructor() should throw error", () => {
        assert.throws(() => {
            var tronBoard = new TronBoard();
        });
    });

    it("constructor('') should throw error", () => {
        assert.throws(() => {
            var tronBoard = new TronBoard("");
        });
    });

    it("constructor('4/4/3/4') should throw error", () => {
        assert.throws(() => {
            var tronBoard = new TronBoard("4/4/3/4");
        });
    });

    it("constructor('4/4/4/4') creates empty board 4x4", () => {
        var tronBoard = new TronBoard("4/4/4/4");
        assert.equal(tronBoard.width, 4);
        assert.equal(tronBoard.height, 4);
        for (let x = 0; x < tronBoard.width; x++) {
            for (let y = 0; y < tronBoard.height; y++) {
                assert.equal(tronBoard.getElementAt(x, y), TronBoardEnum.Empty);
            }
        }
    });

    it("constructor('7/7/7/7/7/7/7') creates empty board 7x7", () => {
        var tronBoard = new TronBoard("7/7/7/7/7/7/7");
        assert.equal(tronBoard.width, 7);
        assert.equal(tronBoard.height, 7);
        for (let x = 0; x < tronBoard.width; x++) {
            for (let y = 0; y < tronBoard.height; y++) {
                assert.equal(tronBoard.getElementAt(x, y), TronBoardEnum.Empty);
            }
        }
    });

    it("constructor('7/7/7/7') creates empty board 7x4", () => {
        var tronBoard = new TronBoard("7/7/7/7");
        assert.equal(tronBoard.width, 7);
        assert.equal(tronBoard.height, 4);
        for (let x = 0; x < tronBoard.width; x++) {
            for (let y = 0; y < tronBoard.height; y++) {
                assert.equal(tronBoard.getElementAt(x, y), TronBoardEnum.Empty);
            }
        }
    });

    it("constructor('b3/4/4/4') creates board 4x4 with one blue", () => {
        var tronBoard = new TronBoard("b3/4/4/4");
        assert.equal(tronBoard.width, 4);
        assert.equal(tronBoard.height, 4);
        for (let x = 0; x < tronBoard.width; x++) {
            for (let y = 0; y < tronBoard.height; y++) {
                if (x === 0 && y === 0) {
                    assert.equal(tronBoard.getElementAt(x, y), TronBoardEnum.Blue);
                }
                else {
                    assert.equal(tronBoard.getElementAt(x, y), TronBoardEnum.Empty);
                }
            }
        }
    });

    it("constructor('B3/4/4/3R') creates board 4x4 with one blue head and one red head", () => {
        var tronBoard = new TronBoard("B3/4/4/3R");
        assert.equal(tronBoard.width, 4);
        assert.equal(tronBoard.height, 4);
        for (let x = 0; x < tronBoard.width; x++) {
            for (let y = 0; y < tronBoard.height; y++) {
                if (x === 0 && y === 0) {
                    assert.equal(tronBoard.getElementAt(x, y), TronBoardEnum.BlueHead);
                }
                else if (x === 3 && y === 3) {
                    assert.equal(tronBoard.getElementAt(x, y), TronBoardEnum.RedHead);
                }
                else {
                    assert.equal(tronBoard.getElementAt(x, y), TronBoardEnum.Empty);
                }
            }
        }
    });

    it("constructor('B9/10/10/10/10/10/10/10/10/9R') creates board 10x10 with one blue head and one red head", () => {
        var tronBoard = new TronBoard("B9/10/10/10/10/10/10/10/10/9R");
        assert.equal(tronBoard.width, 10);
        assert.equal(tronBoard.height, 10);
        for (let x = 0; x < tronBoard.width; x++) {
            for (let y = 0; y < tronBoard.height; y++) {
                if (x === 0 && y === 0) {
                    assert.equal(tronBoard.getElementAt(x, y), TronBoardEnum.BlueHead);
                }
                else if (x === 9 && y === 9) {
                    assert.equal(tronBoard.getElementAt(x, y), TronBoardEnum.RedHead);
                }
                else {
                    assert.equal(tronBoard.getElementAt(x, y), TronBoardEnum.Empty);
                }
            }
        }
    });

    it("constructor('bbbb/rR1b/r1Bb/rrrr') creates comples board 4x4 with some blue, blue head, red, red head and empty tiles", () => {
        var tronBoard = new TronBoard("bbbb/rR1b/r1Bb/rrrr");
        assert.equal(tronBoard.width, 4);
        assert.equal(tronBoard.height, 4);

        assert.equal(tronBoard.getElementAt(0, 0), TronBoardEnum.Blue);
        assert.equal(tronBoard.getElementAt(1, 0), TronBoardEnum.Blue);
        assert.equal(tronBoard.getElementAt(2, 0), TronBoardEnum.Blue);
        assert.equal(tronBoard.getElementAt(3, 0), TronBoardEnum.Blue);

        assert.equal(tronBoard.getElementAt(0, 1), TronBoardEnum.Red);
        assert.equal(tronBoard.getElementAt(1, 1), TronBoardEnum.RedHead);
        assert.equal(tronBoard.getElementAt(2, 1), TronBoardEnum.Empty);
        assert.equal(tronBoard.getElementAt(3, 1), TronBoardEnum.Blue);

        assert.equal(tronBoard.getElementAt(0, 2), TronBoardEnum.Red);
        assert.equal(tronBoard.getElementAt(1, 2), TronBoardEnum.Empty);
        assert.equal(tronBoard.getElementAt(2, 2), TronBoardEnum.BlueHead);
        assert.equal(tronBoard.getElementAt(3, 2), TronBoardEnum.Blue);

        assert.equal(tronBoard.getElementAt(0, 3), TronBoardEnum.Red);
        assert.equal(tronBoard.getElementAt(1, 3), TronBoardEnum.Red);
        assert.equal(tronBoard.getElementAt(2, 3), TronBoardEnum.Red);
        assert.equal(tronBoard.getElementAt(3, 3), TronBoardEnum.Red);
    });
});

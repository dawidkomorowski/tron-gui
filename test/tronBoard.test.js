const assert = require("assert");
const TronBoard = require("../src/tronBoard").TronBoard;
const TronMove = require("../src/tronBoard").TronMove;
const TronMoveDirection = require("../src/tronBoard").TronMoveDirection;
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

    describe("#getElementAt", () => {
        it("getElementAt(-1, 0) should throw error when TronBoard area is 4x6", () => {
            assert.throws(() => {
                const tronString = new TronString(4, 6);
                const tronBoard = new TronBoard(tronString);
                tronBoard.getElementAt(-1, 0);
            }, /x cannot be negative/);
        });

        it("getElementAt(0, -1) should throw error when TronBoard area is 4x6", () => {
            assert.throws(() => {
                const tronString = new TronString(4, 6);
                const tronBoard = new TronBoard(tronString);
                tronBoard.getElementAt(0, -1);
            }, /y cannot be negative/);
        });

        it("getElementAt(4, 0) should throw error when TronBoard area is 4x6", () => {
            assert.throws(() => {
                const tronString = new TronString(4, 6);
                const tronBoard = new TronBoard(tronString);
                tronBoard.getElementAt(4, 0);
            }, /x cannot be greater or equal width/);
        });

        it("getElementAt(0, 6) should throw error when TronBoard area is 4x6", () => {
            assert.throws(() => {
                const tronString = new TronString(4, 6);
                const tronBoard = new TronBoard(tronString);
                tronBoard.getElementAt(0, 6);
            }, /y cannot be greater or equal height/);
        });

        it("getElementAt(0, 0) should return TronStringEnum.Empty when TronBoard area is 4x6", () => {
            const tronString = new TronString(4, 6);
            const tronBoard = new TronBoard(tronString);
            const actual = tronBoard.getElementAt(0, 0);
            assert.equal(actual, TronStringEnum.Empty);
        });

        it("getElementAt(3, 5) should return TronStringEnum.Empty when TronBoard area is 4x6", () => {
            const tronString = new TronString(4, 6);
            const tronBoard = new TronBoard(tronString);
            const actual = tronBoard.getElementAt(3, 5);
            assert.equal(actual, TronStringEnum.Empty);
        });
    });

    describe("#makeMove", () => {
        it("makeMove() should throw error", () => {
            assert.throws(() => {
                const tronString = new TronString("B9/10/10/10/10/10/10/10/10/9R");
                const tronBoard = new TronBoard(tronString);
                tronBoard.makeMove();
            }, /tronMove must be provided/);
        });

        it("makeMove({}) should throw error", () => {
            assert.throws(() => {
                const tronString = new TronString("B9/10/10/10/10/10/10/10/10/9R");
                const tronBoard = new TronBoard(tronString);
                tronBoard.makeMove({});
            }, /tronMove must be provided/);
        });

        it("makeMove(new TronMove(TronMoveDirection.Up, TronMoveDirection.Up)) should throw error when move is beyond the board at the top", () => {
            assert.throws(() => {
                const tronString = new TronString("B9/10/10/10/10/10/10/10/10/9R");
                const tronBoard = new TronBoard(tronString);
                const tronMove = new TronMove(TronMoveDirection.Up, TronMoveDirection.Up);
                tronBoard.makeMove(tronMove);
            }, /y cannot be negative/);
        });

        it("makeMove(new TronMove(TronMoveDirection.Down, TronMoveDirection.Down)) should throw error when move is beyond the board at the bottom", () => {
            assert.throws(() => {
                const tronString = new TronString("B9/10/10/10/10/10/10/10/10/9R");
                const tronBoard = new TronBoard(tronString);
                const tronMove = new TronMove(TronMoveDirection.Down, TronMoveDirection.Down);
                tronBoard.makeMove(tronMove);
            }, /y cannot be greater or equal height/);
        });

        it("makeMove(new TronMove(TronMoveDirection.Left, TronMoveDirection.Left)) should throw error when move is beyond the board on the left", () => {
            assert.throws(() => {
                const tronString = new TronString("B9/10/10/10/10/10/10/10/10/9R");
                const tronBoard = new TronBoard(tronString);
                const tronMove = new TronMove(TronMoveDirection.Left, TronMoveDirection.Left);
                tronBoard.makeMove(tronMove);
            }, /x cannot be negative/);
        });

        it("makeMove(new TronMove(TronMoveDirection.Right, TronMoveDirection.Right)) should throw error when move is beyond the board on the right", () => {
            assert.throws(() => {
                const tronString = new TronString("B9/10/10/10/10/10/10/10/10/9R");
                const tronBoard = new TronBoard(tronString);
                const tronMove = new TronMove(TronMoveDirection.Right, TronMoveDirection.Right);
                tronBoard.makeMove(tronMove);
            }, /x cannot be greater or equal width/);
        });

        it("makeMove(new TronMove(TronMoveDirection.Down, TronMoveDirection.Up)) should move accordingly", () => {
            const tronString = new TronString("B9/10/10/10/10/10/10/10/10/9R");
            const tronBoard = new TronBoard(tronString);
            const tronMove = new TronMove(TronMoveDirection.Down, TronMoveDirection.Up);
            tronBoard.makeMove(tronMove);
            const tronStringAfterMove = tronBoard.toTronString();
            assert.equal(tronStringAfterMove.toString(), "b9/B9/10/10/10/10/10/10/9R/9r");
        });

        it("makeMove(new TronMove(TronMoveDirection.Right, TronMoveDirection.Left)) should move accordingly", () => {
            const tronString = new TronString("B9/10/10/10/10/10/10/10/10/9R");
            const tronBoard = new TronBoard(tronString);
            const tronMove = new TronMove(TronMoveDirection.Right, TronMoveDirection.Left);
            tronBoard.makeMove(tronMove);
            const tronStringAfterMove = tronBoard.toTronString();
            assert.equal(tronStringAfterMove.toString(), "bB8/10/10/10/10/10/10/10/10/8Rr");
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

describe("TronMove", () => {
    describe("#constructor", () => {
        it("constructor() should throw error", () => {
            assert.throws(() => {
                const tronMove = new TronMove();
            }, /direction must be one of the TronMoveDirection values/);
        });

        it("constructor('Not existing value', TronMoveDirection.Up) should throw error", () => {
            assert.throws(() => {
                const tronMove = new TronMove("Not existing value", TronMoveDirection.Up);
            }, /direction must be one of the TronMoveDirection values/);
        });

        it("constructor(TronMoveDirection.Up, 'Not existing value') should throw error", () => {
            assert.throws(() => {
                const tronMove = new TronMove(TronMoveDirection.Up, "Not existing value");
            }, /direction must be one of the TronMoveDirection values/);
        });

        it("constructor('Not existing value', 'Not existing value') should throw error", () => {
            assert.throws(() => {
                const tronMove = new TronMove("Not existing value", "Not existing value");
            }, /direction must be one of the TronMoveDirection values/);
        });

        it("constructor(TronMoveDirection.Up, TronMoveDirection.Down) should set blueDirection as TronMoveDirection.Up and redDirection as TronMoveDirection.Down", () => {
            const tronMove = new TronMove(TronMoveDirection.Up, TronMoveDirection.Down);
            assert.equal(tronMove.blueDirection, TronMoveDirection.Up);
            assert.equal(tronMove.redDirection, TronMoveDirection.Down);
        });

        it("constructor(TronMoveDirection.Left, TronMoveDirection.Right) should set blueDirection as TronMoveDirection.Left and redDirection as TronMoveDirection.Right", () => {
            const tronMove = new TronMove(TronMoveDirection.Left, TronMoveDirection.Right);
            assert.equal(tronMove.blueDirection, TronMoveDirection.Left);
            assert.equal(tronMove.redDirection, TronMoveDirection.Right);
        });
    });
});
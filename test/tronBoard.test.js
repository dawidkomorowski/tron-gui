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

        it("constructor(new TronString('oooooo/obbbbo/orR1bo/or1Bbo/orrrro/oooooo')) should create board 4x4 with some blue, blue head, red, red head, empty tiles and surrounded with obstacles", () => {
            const tronString = new TronString("oooooo/obbbbo/orR1bo/or1Bbo/orrrro/oooooo");
            const tronBoard = new TronBoard(tronString);
            assert.strictEqual(tronBoard.width, 6);
            assert.strictEqual(tronBoard.height, 6);

            assert.strictEqual(tronBoard.getElementAt(0, 0), TronStringEnum.Obstacle);
            assert.strictEqual(tronBoard.getElementAt(1, 0), TronStringEnum.Obstacle);
            assert.strictEqual(tronBoard.getElementAt(2, 0), TronStringEnum.Obstacle);
            assert.strictEqual(tronBoard.getElementAt(3, 0), TronStringEnum.Obstacle);
            assert.strictEqual(tronBoard.getElementAt(4, 0), TronStringEnum.Obstacle);
            assert.strictEqual(tronBoard.getElementAt(5, 0), TronStringEnum.Obstacle);

            assert.strictEqual(tronBoard.getElementAt(0, 1), TronStringEnum.Obstacle);
            assert.strictEqual(tronBoard.getElementAt(1, 1), TronStringEnum.Blue);
            assert.strictEqual(tronBoard.getElementAt(2, 1), TronStringEnum.Blue);
            assert.strictEqual(tronBoard.getElementAt(3, 1), TronStringEnum.Blue);
            assert.strictEqual(tronBoard.getElementAt(4, 1), TronStringEnum.Blue);
            assert.strictEqual(tronBoard.getElementAt(5, 1), TronStringEnum.Obstacle);

            assert.strictEqual(tronBoard.getElementAt(0, 2), TronStringEnum.Obstacle);
            assert.strictEqual(tronBoard.getElementAt(1, 2), TronStringEnum.Red);
            assert.strictEqual(tronBoard.getElementAt(2, 2), TronStringEnum.RedHead);
            assert.strictEqual(tronBoard.getElementAt(3, 2), TronStringEnum.Empty);
            assert.strictEqual(tronBoard.getElementAt(4, 2), TronStringEnum.Blue);
            assert.strictEqual(tronBoard.getElementAt(5, 2), TronStringEnum.Obstacle);

            assert.strictEqual(tronBoard.getElementAt(0, 3), TronStringEnum.Obstacle);
            assert.strictEqual(tronBoard.getElementAt(1, 3), TronStringEnum.Red);
            assert.strictEqual(tronBoard.getElementAt(2, 3), TronStringEnum.Empty);
            assert.strictEqual(tronBoard.getElementAt(3, 3), TronStringEnum.BlueHead);
            assert.strictEqual(tronBoard.getElementAt(4, 3), TronStringEnum.Blue);
            assert.strictEqual(tronBoard.getElementAt(5, 3), TronStringEnum.Obstacle);

            assert.strictEqual(tronBoard.getElementAt(0, 4), TronStringEnum.Obstacle);
            assert.strictEqual(tronBoard.getElementAt(1, 4), TronStringEnum.Red);
            assert.strictEqual(tronBoard.getElementAt(2, 4), TronStringEnum.Red);
            assert.strictEqual(tronBoard.getElementAt(3, 4), TronStringEnum.Red);
            assert.strictEqual(tronBoard.getElementAt(4, 4), TronStringEnum.Red);
            assert.strictEqual(tronBoard.getElementAt(5, 4), TronStringEnum.Obstacle);

            assert.strictEqual(tronBoard.getElementAt(0, 5), TronStringEnum.Obstacle);
            assert.strictEqual(tronBoard.getElementAt(1, 5), TronStringEnum.Obstacle);
            assert.strictEqual(tronBoard.getElementAt(2, 5), TronStringEnum.Obstacle);
            assert.strictEqual(tronBoard.getElementAt(3, 5), TronStringEnum.Obstacle);
            assert.strictEqual(tronBoard.getElementAt(4, 5), TronStringEnum.Obstacle);
            assert.strictEqual(tronBoard.getElementAt(5, 5), TronStringEnum.Obstacle);
        });

        it("constructor should create board with isBlueAlive = true", () => {
            const tronString = new TronString("oooooo/obbbbo/orR1bo/or1Bbo/orrrro/oooooo");
            const tronBoard = new TronBoard(tronString);
            assert.strictEqual(tronBoard.isBlueAlive, true);
        });

        it("constructor should create board with isRedAlive = true", () => {
            const tronString = new TronString("oooooo/obbbbo/orR1bo/or1Bbo/orrrro/oooooo");
            const tronBoard = new TronBoard(tronString);
            assert.strictEqual(tronBoard.isRedAlive, true);
        });
    });

    describe("#isGameOver", () => {
        it("isGameOver should be false when isBlueAlive is true and isRedAlive is true", () => {
            const tronString = new TronString("B9/10/10/10/10/10/10/10/10/9R");
            const tronBoard = new TronBoard(tronString);
            assert.strictEqual(tronBoard.isBlueAlive, true);
            assert.strictEqual(tronBoard.isRedAlive, true);
            assert.strictEqual(tronBoard.isGameOver, false);
        });

        it("isGameOver should be true when isBlueAlive is false and isRedAlive is true", () => {
            const tronString = new TronString("Bo8/10/10/10/10/10/10/10/10/9R");
            const tronBoard = new TronBoard(tronString);
            const tronMove = new TronMove(TronMoveDirection.Right, TronMoveDirection.Left);
            tronBoard.makeMove(tronMove);
            assert.strictEqual(tronBoard.isBlueAlive, false);
            assert.strictEqual(tronBoard.isRedAlive, true);
            assert.strictEqual(tronBoard.isGameOver, true);
        });

        it("isGameOver should be true when isBlueAlive is true and isRedAlive is false", () => {
            const tronString = new TronString("B9/10/10/10/10/10/10/10/10/8oR");
            const tronBoard = new TronBoard(tronString);
            const tronMove = new TronMove(TronMoveDirection.Right, TronMoveDirection.Left);
            tronBoard.makeMove(tronMove);
            assert.strictEqual(tronBoard.isBlueAlive, true);
            assert.strictEqual(tronBoard.isRedAlive, false);
            assert.strictEqual(tronBoard.isGameOver, true);
        });

        it("isGameOver should be true when isBlueAlive is false and isRedAlive is false", () => {
            const tronString = new TronString("Bo8/10/10/10/10/10/10/10/10/8oR");
            const tronBoard = new TronBoard(tronString);
            const tronMove = new TronMove(TronMoveDirection.Right, TronMoveDirection.Left);
            tronBoard.makeMove(tronMove);
            assert.strictEqual(tronBoard.isBlueAlive, false);
            assert.strictEqual(tronBoard.isRedAlive, false);
            assert.strictEqual(tronBoard.isGameOver, true);
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
            assert.strictEqual(actual, TronStringEnum.Empty);
        });

        it("getElementAt(3, 5) should return TronStringEnum.Empty when TronBoard area is 4x6", () => {
            const tronString = new TronString(4, 6);
            const tronBoard = new TronBoard(tronString);
            const actual = tronBoard.getElementAt(3, 5);
            assert.strictEqual(actual, TronStringEnum.Empty);
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

            assert.strictEqual(tronBoard.isBlueAlive, true);
            assert.strictEqual(tronBoard.isRedAlive, true);
            const tronStringAfterMove = tronBoard.toTronString();
            assert.strictEqual(tronStringAfterMove.toString(), "b9/B9/10/10/10/10/10/10/9R/9r");
        });

        it("makeMove(new TronMove(TronMoveDirection.Right, TronMoveDirection.Left)) should move accordingly", () => {
            const tronString = new TronString("B9/10/10/10/10/10/10/10/10/9R");
            const tronBoard = new TronBoard(tronString);
            const tronMove = new TronMove(TronMoveDirection.Right, TronMoveDirection.Left);

            tronBoard.makeMove(tronMove);

            assert.strictEqual(tronBoard.isBlueAlive, true);
            assert.strictEqual(tronBoard.isRedAlive, true);
            const tronStringAfterMove = tronBoard.toTronString();
            assert.strictEqual(tronStringAfterMove.toString(), "bB8/10/10/10/10/10/10/10/10/8Rr");
        });

        it("makeMove(new TronMove(TronMoveDirection.Right, TronMoveDirection.Left)) should kill blue when it hits obstacle", () => {
            const tronString = new TronString("Bo8/10/10/10/10/10/10/10/10/9R");
            const tronBoard = new TronBoard(tronString);
            const tronMove = new TronMove(TronMoveDirection.Right, TronMoveDirection.Left);

            tronBoard.makeMove(tronMove);

            assert.strictEqual(tronBoard.isBlueAlive, false);
            assert.strictEqual(tronBoard.isRedAlive, true);
            const tronStringAfterMove = tronBoard.toTronString();
            assert.strictEqual(tronStringAfterMove.toString(), "Bo8/10/10/10/10/10/10/10/10/9R");
        });

        it("makeMove(new TronMove(TronMoveDirection.Right, TronMoveDirection.Left)) should kill blue when it hits blue", () => {
            const tronString = new TronString("Bb8/10/10/10/10/10/10/10/10/9R");
            const tronBoard = new TronBoard(tronString);
            const tronMove = new TronMove(TronMoveDirection.Right, TronMoveDirection.Left);

            tronBoard.makeMove(tronMove);

            assert.strictEqual(tronBoard.isBlueAlive, false);
            assert.strictEqual(tronBoard.isRedAlive, true);
            const tronStringAfterMove = tronBoard.toTronString();
            assert.strictEqual(tronStringAfterMove.toString(), "Bb8/10/10/10/10/10/10/10/10/9R");
        });

        it("makeMove(new TronMove(TronMoveDirection.Right, TronMoveDirection.Left)) should kill blue when it hits red", () => {
            const tronString = new TronString("Br8/10/10/10/10/10/10/10/10/9R");
            const tronBoard = new TronBoard(tronString);
            const tronMove = new TronMove(TronMoveDirection.Right, TronMoveDirection.Left);

            tronBoard.makeMove(tronMove);

            assert.strictEqual(tronBoard.isBlueAlive, false);
            assert.strictEqual(tronBoard.isRedAlive, true);
            const tronStringAfterMove = tronBoard.toTronString();
            assert.strictEqual(tronStringAfterMove.toString(), "Br8/10/10/10/10/10/10/10/10/9R");
        });

        it("makeMove(new TronMove(TronMoveDirection.Right, TronMoveDirection.Right)) should kill blue when it hits red head", () => {
            const tronString = new TronString("BR8/10/10/10/10/10/10/10/10/10");
            const tronBoard = new TronBoard(tronString);
            const tronMove = new TronMove(TronMoveDirection.Right, TronMoveDirection.Right);

            tronBoard.makeMove(tronMove);

            assert.strictEqual(tronBoard.isBlueAlive, false);
            assert.strictEqual(tronBoard.isRedAlive, true);
            const tronStringAfterMove = tronBoard.toTronString();
            assert.strictEqual(tronStringAfterMove.toString(), "BR8/10/10/10/10/10/10/10/10/10");
        });

        it("makeMove(new TronMove(TronMoveDirection.Left, TronMoveDirection.Right)) should kill red when it hits obstacle", () => {
            const tronString = new TronString("Ro8/10/10/10/10/10/10/10/10/9B");
            const tronBoard = new TronBoard(tronString);
            const tronMove = new TronMove(TronMoveDirection.Left, TronMoveDirection.Right);

            tronBoard.makeMove(tronMove);

            assert.strictEqual(tronBoard.isBlueAlive, true);
            assert.strictEqual(tronBoard.isRedAlive, false);
            const tronStringAfterMove = tronBoard.toTronString();
            assert.strictEqual(tronStringAfterMove.toString(), "Ro8/10/10/10/10/10/10/10/10/9B");
        });

        it("makeMove(new TronMove(TronMoveDirection.Left, TronMoveDirection.Right)) should kill red when it hits red", () => {
            const tronString = new TronString("Rr8/10/10/10/10/10/10/10/10/9B");
            const tronBoard = new TronBoard(tronString);
            const tronMove = new TronMove(TronMoveDirection.Left, TronMoveDirection.Right);

            tronBoard.makeMove(tronMove);

            assert.strictEqual(tronBoard.isBlueAlive, true);
            assert.strictEqual(tronBoard.isRedAlive, false);
            const tronStringAfterMove = tronBoard.toTronString();
            assert.strictEqual(tronStringAfterMove.toString(), "Rr8/10/10/10/10/10/10/10/10/9B");
        });

        it("makeMove(new TronMove(TronMoveDirection.Left, TronMoveDirection.Right)) should kill red when it hits blue", () => {
            const tronString = new TronString("Rb8/10/10/10/10/10/10/10/10/9B");
            const tronBoard = new TronBoard(tronString);
            const tronMove = new TronMove(TronMoveDirection.Left, TronMoveDirection.Right);

            tronBoard.makeMove(tronMove);

            assert.strictEqual(tronBoard.isBlueAlive, true);
            assert.strictEqual(tronBoard.isRedAlive, false);
            const tronStringAfterMove = tronBoard.toTronString();
            assert.strictEqual(tronStringAfterMove.toString(), "Rb8/10/10/10/10/10/10/10/10/9B");
        });

        it("makeMove(new TronMove(TronMoveDirection.Right, TronMoveDirection.Right)) should kill red when it hits blue head", () => {
            const tronString = new TronString("RB8/10/10/10/10/10/10/10/10/10");
            const tronBoard = new TronBoard(tronString);
            const tronMove = new TronMove(TronMoveDirection.Right, TronMoveDirection.Right);

            tronBoard.makeMove(tronMove);

            assert.strictEqual(tronBoard.isBlueAlive, true);
            assert.strictEqual(tronBoard.isRedAlive, false);
            const tronStringAfterMove = tronBoard.toTronString();
            assert.strictEqual(tronStringAfterMove.toString(), "RB8/10/10/10/10/10/10/10/10/10");
        });

        it("makeMove(new TronMove(TronMoveDirection.Right, TronMoveDirection.Left)) should kill blue and red when both enter the same field", () => {
            const tronString = new TronString("B1R7/10/10/10/10/10/10/10/10/10");
            const tronBoard = new TronBoard(tronString);
            const tronMove = new TronMove(TronMoveDirection.Right, TronMoveDirection.Left);

            tronBoard.makeMove(tronMove);

            assert.strictEqual(tronBoard.isBlueAlive, false);
            assert.strictEqual(tronBoard.isRedAlive, false);
            const tronStringAfterMove = tronBoard.toTronString();
            assert.strictEqual(tronStringAfterMove.toString(), "B1R7/10/10/10/10/10/10/10/10/10");
        });

        it("makeMove(new TronMove(TronMoveDirection.Right, TronMoveDirection.Left)) should kill blue and red when both enter obstacle", () => {
            const tronString = new TronString("Bo8/10/10/10/10/10/10/10/10/8oR");
            const tronBoard = new TronBoard(tronString);
            const tronMove = new TronMove(TronMoveDirection.Right, TronMoveDirection.Left);

            tronBoard.makeMove(tronMove);

            assert.strictEqual(tronBoard.isBlueAlive, false);
            assert.strictEqual(tronBoard.isRedAlive, false);
            const tronStringAfterMove = tronBoard.toTronString();
            assert.strictEqual(tronStringAfterMove.toString(), "Bo8/10/10/10/10/10/10/10/10/8oR");
        });
    });

    describe("#toTronString", () => {
        it("toTronString() should return TronString '1b1r/2B1/1R2/b1r1' when TronBoard created from such a TronString", () => {
            const tronString = new TronString("1b1r/2B1/1R2/b1r1");
            const tronBoard = new TronBoard(tronString);
            const actual = tronBoard.toTronString();
            assert.strictEqual(actual.toString(), "1b1r/2B1/1R2/b1r1");
        });

        it("toTronString() should return TronString 'oooooo/obbbbo/orR1bo/or1Bbo/orrrro/oooooo' when TronBoard created from such a TronString", () => {
            const tronString = new TronString("oooooo/obbbbo/orR1bo/or1Bbo/orrrro/oooooo");
            const tronBoard = new TronBoard(tronString);
            const actual = tronBoard.toTronString();
            assert.strictEqual(actual.toString(), "oooooo/obbbbo/orR1bo/or1Bbo/orrrro/oooooo");
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
            assert.strictEqual(tronMove.blueDirection, TronMoveDirection.Up);
            assert.strictEqual(tronMove.redDirection, TronMoveDirection.Down);
        });

        it("constructor(TronMoveDirection.Left, TronMoveDirection.Right) should set blueDirection as TronMoveDirection.Left and redDirection as TronMoveDirection.Right", () => {
            const tronMove = new TronMove(TronMoveDirection.Left, TronMoveDirection.Right);
            assert.strictEqual(tronMove.blueDirection, TronMoveDirection.Left);
            assert.strictEqual(tronMove.redDirection, TronMoveDirection.Right);
        });
    });
});
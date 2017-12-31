const assert = require("assert");
const TronString = require("../src/tronString").TronString;
const TronStringEnum = require("../src/tronString").TronStringEnum;

describe("TronString", () => {
    it("constructor() should throw error", () => {
        assert.throws(() => {
            var tronString = new TronString();
        }, /No constructor overload takes 0 parameters/);
    });

    it("constructor(0,0) should throw error", () => {
        assert.throws(() => {
            var tronString = new TronString(0, 0);
        }, /width must be positive/);
    });

    it("constructor(0,5) should throw error", () => {
        assert.throws(() => {
            var tronString = new TronString(0, 5);
        }, /width must be positive/);
    });

    it("constructor(5,0) should throw error", () => {
        assert.throws(() => {
            var tronString = new TronString(5, 0);
        }, /height must be positive/);
    });

    it("constructor(-5,-5) should throw error", () => {
        assert.throws(() => {
            var tronString = new TronString(-5, -5);
        }, /width must be positive/);
    });

    it("constructor(-5,5) should throw error", () => {
        assert.throws(() => {
            var tronString = new TronString(-5, 5);
        }, /width must be positive/);
    });

    it("constructor(5,-5) should throw error", () => {
        assert.throws(() => {
            var tronString = new TronString(5, -5);
        }, /height must be positive/);
    });

    it("constructor(4,4) should create TronString representing empty area 4x4", () => {
        var tronString = new TronString(4, 4);
        assert.equal(tronString.width, 4);
        assert.equal(tronString.height, 4);
        for (let x = 0; x < tronString.width; x++) {
            for (let y = 0; y < tronString.height; y++) {
                assert.equal(tronString.getElementAt(x, y), TronStringEnum.Empty);
            }
        }
    });

    it("constructor(5,10) should create TronString representing empty area 5x10", () => {
        var tronString = new TronString(5, 10);
        assert.equal(tronString.width, 5);
        assert.equal(tronString.height, 10);
        for (let x = 0; x < tronString.width; x++) {
            for (let y = 0; y < tronString.height; y++) {
                assert.equal(tronString.getElementAt(x, y), TronStringEnum.Empty);
            }
        }
    });

    it("constructor('') should throw error", () => {
        assert.throws(() => {
            var tronString = new TronString("");
        }, /string cannot be empty/);
    });

    it("constructor('4/4/3/4') should throw error", () => {
        assert.throws(() => {
            var tronString = new TronString("4/4/3/4");
        }, /TronString must define rectangular area/);
    });

    it("constructor('0/4/4/4') should throw error", () => {
        assert.throws(() => {
            var tronString = new TronString("0/4/4/4");
        }, /0 number is not allowed/);
    });

    it("constructor('4/4/4/0') should throw error", () => {
        assert.throws(() => {
            var tronString = new TronString("0/4/4/4");
        }, /0 number is not allowed/);
    });

    it("constructor('/4/4/4') should throw error", () => {
        assert.throws(() => {
            var tronString = new TronString("/4/4/4");
        }, /Expected one of the following 'b', 'B', 'r', 'R', number/);
    });

    it("constructor('4|4/4/4') should throw error", () => {
        assert.throws(() => {
            var tronString = new TronString("4|4/4/4");
        }, /Expected '\/'/);
    });

    it("constructor('4/4/4/4') should create TronString representing empty area 4x4", () => {
        var tronString = new TronString("4/4/4/4");
        assert.equal(tronString.width, 4);
        assert.equal(tronString.height, 4);
        for (let x = 0; x < tronString.width; x++) {
            for (let y = 0; y < tronString.height; y++) {
                assert.equal(tronString.getElementAt(x, y), TronStringEnum.Empty);
            }
        }
    });

    it("constructor('7/7/7/7/7/7/7') should create TronString representing empty area 7x7", () => {
        var tronString = new TronString("7/7/7/7/7/7/7");
        assert.equal(tronString.width, 7);
        assert.equal(tronString.height, 7);
        for (let x = 0; x < tronString.width; x++) {
            for (let y = 0; y < tronString.height; y++) {
                assert.equal(tronString.getElementAt(x, y), TronStringEnum.Empty);
            }
        }
    });

    it("constructor('7/7/7/7') should create TronString representing empty area 7x4", () => {
        var tronString = new TronString("7/7/7/7");
        assert.equal(tronString.width, 7);
        assert.equal(tronString.height, 4);
        for (let x = 0; x < tronString.width; x++) {
            for (let y = 0; y < tronString.height; y++) {
                assert.equal(tronString.getElementAt(x, y), TronStringEnum.Empty);
            }
        }
    });

    it("constructor('b3/4/4/4') should create TronString representing area 4x4 with one blue", () => {
        var tronString = new TronString("b3/4/4/4");
        assert.equal(tronString.width, 4);
        assert.equal(tronString.height, 4);
        for (let x = 0; x < tronString.width; x++) {
            for (let y = 0; y < tronString.height; y++) {
                if (x === 0 && y === 0) {
                    assert.equal(tronString.getElementAt(x, y), TronStringEnum.Blue);
                }
                else {
                    assert.equal(tronString.getElementAt(x, y), TronStringEnum.Empty);
                }
            }
        }
    });

    it("constructor('B3/4/4/3R') should create TronString representing area 4x4 with one blue head and one red head", () => {
        var tronString = new TronString("B3/4/4/3R");
        assert.equal(tronString.width, 4);
        assert.equal(tronString.height, 4);
        for (let x = 0; x < tronString.width; x++) {
            for (let y = 0; y < tronString.height; y++) {
                if (x === 0 && y === 0) {
                    assert.equal(tronString.getElementAt(x, y), TronStringEnum.BlueHead);
                }
                else if (x === 3 && y === 3) {
                    assert.equal(tronString.getElementAt(x, y), TronStringEnum.RedHead);
                }
                else {
                    assert.equal(tronString.getElementAt(x, y), TronStringEnum.Empty);
                }
            }
        }
    });

    it("constructor('B9/10/10/10/10/10/10/10/10/9R') should create TronString representing area 10x10 with one blue head and one red head", () => {
        var tronString = new TronString("B9/10/10/10/10/10/10/10/10/9R");
        assert.equal(tronString.width, 10);
        assert.equal(tronString.height, 10);
        for (let x = 0; x < tronString.width; x++) {
            for (let y = 0; y < tronString.height; y++) {
                if (x === 0 && y === 0) {
                    assert.equal(tronString.getElementAt(x, y), TronStringEnum.BlueHead);
                }
                else if (x === 9 && y === 9) {
                    assert.equal(tronString.getElementAt(x, y), TronStringEnum.RedHead);
                }
                else {
                    assert.equal(tronString.getElementAt(x, y), TronStringEnum.Empty);
                }
            }
        }
    });

    it("constructor('bbbb/rR1b/r1Bb/rrrr') should create TronString representing area 4x4 with some blue, blue head, red, red head and empty tiles", () => {
        var tronString = new TronString("bbbb/rR1b/r1Bb/rrrr");
        assert.equal(tronString.width, 4);
        assert.equal(tronString.height, 4);

        assert.equal(tronString.getElementAt(0, 0), TronStringEnum.Blue);
        assert.equal(tronString.getElementAt(1, 0), TronStringEnum.Blue);
        assert.equal(tronString.getElementAt(2, 0), TronStringEnum.Blue);
        assert.equal(tronString.getElementAt(3, 0), TronStringEnum.Blue);

        assert.equal(tronString.getElementAt(0, 1), TronStringEnum.Red);
        assert.equal(tronString.getElementAt(1, 1), TronStringEnum.RedHead);
        assert.equal(tronString.getElementAt(2, 1), TronStringEnum.Empty);
        assert.equal(tronString.getElementAt(3, 1), TronStringEnum.Blue);

        assert.equal(tronString.getElementAt(0, 2), TronStringEnum.Red);
        assert.equal(tronString.getElementAt(1, 2), TronStringEnum.Empty);
        assert.equal(tronString.getElementAt(2, 2), TronStringEnum.BlueHead);
        assert.equal(tronString.getElementAt(3, 2), TronStringEnum.Blue);

        assert.equal(tronString.getElementAt(0, 3), TronStringEnum.Red);
        assert.equal(tronString.getElementAt(1, 3), TronStringEnum.Red);
        assert.equal(tronString.getElementAt(2, 3), TronStringEnum.Red);
        assert.equal(tronString.getElementAt(3, 3), TronStringEnum.Red);
    });

    it("constructor(10,15,20) should throw error", () => {
        assert.throws(() => {
            var tronString = new TronString(10, 15, 20);
        }, /Invalid arguments/);
    });
});
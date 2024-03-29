const assert = require("assert");
const TronString = require("../src/tronString").TronString;
const TronStringEnum = require("../src/tronString").TronStringEnum;

describe("TronString", () => {
    describe("#constructor", () => {
        it("constructor() should throw error", () => {
            assert.throws(() => {
                const tronString = new TronString();
            }, /No constructor overload takes 0 parameters/);
        });

        it("constructor(0,0) should throw error", () => {
            assert.throws(() => {
                const tronString = new TronString(0, 0);
            }, /width must be positive/);
        });

        it("constructor(0,5) should throw error", () => {
            assert.throws(() => {
                const tronString = new TronString(0, 5);
            }, /width must be positive/);
        });

        it("constructor(5,0) should throw error", () => {
            assert.throws(() => {
                const tronString = new TronString(5, 0);
            }, /height must be positive/);
        });

        it("constructor(-5,-5) should throw error", () => {
            assert.throws(() => {
                const tronString = new TronString(-5, -5);
            }, /width must be positive/);
        });

        it("constructor(-5,5) should throw error", () => {
            assert.throws(() => {
                const tronString = new TronString(-5, 5);
            }, /width must be positive/);
        });

        it("constructor(5,-5) should throw error", () => {
            assert.throws(() => {
                const tronString = new TronString(5, -5);
            }, /height must be positive/);
        });

        it("constructor(4,4) should create TronString representing empty area 4x4", () => {
            const tronString = new TronString(4, 4);
            assert.strictEqual(tronString.width, 4);
            assert.strictEqual(tronString.height, 4);
            for (let x = 0; x < tronString.width; x++) {
                for (let y = 0; y < tronString.height; y++) {
                    assert.strictEqual(tronString.getElementAt(x, y), TronStringEnum.Empty);
                }
            }
        });

        it("constructor(5,10) should create TronString representing empty area 5x10", () => {
            const tronString = new TronString(5, 10);
            assert.strictEqual(tronString.width, 5);
            assert.strictEqual(tronString.height, 10);
            for (let x = 0; x < tronString.width; x++) {
                for (let y = 0; y < tronString.height; y++) {
                    assert.strictEqual(tronString.getElementAt(x, y), TronStringEnum.Empty);
                }
            }
        });

        it("constructor('') should throw error", () => {
            assert.throws(() => {
                const tronString = new TronString("");
            }, /string cannot be empty/);
        });

        it("constructor('4/4/3/4') should throw error", () => {
            assert.throws(() => {
                const tronString = new TronString("4/4/3/4");
            }, /TronString must define rectangular area/);
        });

        it("constructor('0/4/4/4') should throw error", () => {
            assert.throws(() => {
                const tronString = new TronString("0/4/4/4");
            }, /0 number is not allowed/);
        });

        it("constructor('4/4/4/0') should throw error", () => {
            assert.throws(() => {
                const tronString = new TronString("0/4/4/4");
            }, /0 number is not allowed/);
        });

        it("constructor('/4/4/4') should throw error", () => {
            assert.throws(() => {
                const tronString = new TronString("/4/4/4");
            }, /Expected one of the following 'b', 'B', 'r', 'R', number/);
        });

        it("constructor('4|4/4/4') should throw error", () => {
            assert.throws(() => {
                const tronString = new TronString("4|4/4/4");
            }, /Expected '\/'/);
        });

        it("constructor('BB2/4/4/4') should throw error", () => {
            assert.throws(() => {
                const tronString = new TronString("BB2/4/4/4");
            }, /Multiple heads are not allowed/);
        });

        it("constructor('RR2/4/4/4') should throw error", () => {
            assert.throws(() => {
                const tronString = new TronString("RR2/4/4/4");
            }, /Multiple heads are not allowed/);
        });

        it("constructor('4/4/4/4') should create TronString representing empty area 4x4", () => {
            const tronString = new TronString("4/4/4/4");
            assert.strictEqual(tronString.width, 4);
            assert.strictEqual(tronString.height, 4);
            for (let x = 0; x < tronString.width; x++) {
                for (let y = 0; y < tronString.height; y++) {
                    assert.strictEqual(tronString.getElementAt(x, y), TronStringEnum.Empty);
                }
            }
        });

        it("constructor('7/7/7/7/7/7/7') should create TronString representing empty area 7x7", () => {
            const tronString = new TronString("7/7/7/7/7/7/7");
            assert.strictEqual(tronString.width, 7);
            assert.strictEqual(tronString.height, 7);
            for (let x = 0; x < tronString.width; x++) {
                for (let y = 0; y < tronString.height; y++) {
                    assert.strictEqual(tronString.getElementAt(x, y), TronStringEnum.Empty);
                }
            }
        });

        it("constructor('7/7/7/7') should create TronString representing empty area 7x4", () => {
            const tronString = new TronString("7/7/7/7");
            assert.strictEqual(tronString.width, 7);
            assert.strictEqual(tronString.height, 4);
            for (let x = 0; x < tronString.width; x++) {
                for (let y = 0; y < tronString.height; y++) {
                    assert.strictEqual(tronString.getElementAt(x, y), TronStringEnum.Empty);
                }
            }
        });

        it("constructor('o3/4/4/4') should create TronString representing area 4x4 with one obstacle", () => {
            const tronString = new TronString("o3/4/4/4");
            assert.strictEqual(tronString.width, 4);
            assert.strictEqual(tronString.height, 4);
            for (let x = 0; x < tronString.width; x++) {
                for (let y = 0; y < tronString.height; y++) {
                    if (x === 0 && y === 0) {
                        assert.strictEqual(tronString.getElementAt(x, y), TronStringEnum.Obstacle);
                    }
                    else {
                        assert.strictEqual(tronString.getElementAt(x, y), TronStringEnum.Empty);
                    }
                }
            }
        });

        it("constructor('b3/4/4/4') should create TronString representing area 4x4 with one blue", () => {
            const tronString = new TronString("b3/4/4/4");
            assert.strictEqual(tronString.width, 4);
            assert.strictEqual(tronString.height, 4);
            for (let x = 0; x < tronString.width; x++) {
                for (let y = 0; y < tronString.height; y++) {
                    if (x === 0 && y === 0) {
                        assert.strictEqual(tronString.getElementAt(x, y), TronStringEnum.Blue);
                    }
                    else {
                        assert.strictEqual(tronString.getElementAt(x, y), TronStringEnum.Empty);
                    }
                }
            }
        });

        it("constructor('B3/4/4/3R') should create TronString representing area 4x4 with one blue head and one red head", () => {
            const tronString = new TronString("B3/4/4/3R");
            assert.strictEqual(tronString.width, 4);
            assert.strictEqual(tronString.height, 4);
            for (let x = 0; x < tronString.width; x++) {
                for (let y = 0; y < tronString.height; y++) {
                    if (x === 0 && y === 0) {
                        assert.strictEqual(tronString.getElementAt(x, y), TronStringEnum.BlueHead);
                    }
                    else if (x === 3 && y === 3) {
                        assert.strictEqual(tronString.getElementAt(x, y), TronStringEnum.RedHead);
                    }
                    else {
                        assert.strictEqual(tronString.getElementAt(x, y), TronStringEnum.Empty);
                    }
                }
            }
        });

        it("constructor('B9/10/10/10/10/10/10/10/10/9R') should create TronString representing area 10x10 with one blue head and one red head", () => {
            const tronString = new TronString("B9/10/10/10/10/10/10/10/10/9R");
            assert.strictEqual(tronString.width, 10);
            assert.strictEqual(tronString.height, 10);
            for (let x = 0; x < tronString.width; x++) {
                for (let y = 0; y < tronString.height; y++) {
                    if (x === 0 && y === 0) {
                        assert.strictEqual(tronString.getElementAt(x, y), TronStringEnum.BlueHead);
                    }
                    else if (x === 9 && y === 9) {
                        assert.strictEqual(tronString.getElementAt(x, y), TronStringEnum.RedHead);
                    }
                    else {
                        assert.strictEqual(tronString.getElementAt(x, y), TronStringEnum.Empty);
                    }
                }
            }
        });

        it("constructor('oooooo/obbbbo/orR1bo/or1Bbo/orrrro/oooooo') should create TronString representing area 6x6 with some blue, blue head, red, red head, empty tiles and surrounded with obstacles", () => {
            const tronString = new TronString("oooooo/obbbbo/orR1bo/or1Bbo/orrrro/oooooo");
            assert.strictEqual(tronString.width, 6);
            assert.strictEqual(tronString.height, 6);

            assert.strictEqual(tronString.getElementAt(0, 0), TronStringEnum.Obstacle);
            assert.strictEqual(tronString.getElementAt(1, 0), TronStringEnum.Obstacle);
            assert.strictEqual(tronString.getElementAt(2, 0), TronStringEnum.Obstacle);
            assert.strictEqual(tronString.getElementAt(3, 0), TronStringEnum.Obstacle);
            assert.strictEqual(tronString.getElementAt(4, 0), TronStringEnum.Obstacle);
            assert.strictEqual(tronString.getElementAt(5, 0), TronStringEnum.Obstacle);

            assert.strictEqual(tronString.getElementAt(0, 1), TronStringEnum.Obstacle);
            assert.strictEqual(tronString.getElementAt(1, 1), TronStringEnum.Blue);
            assert.strictEqual(tronString.getElementAt(2, 1), TronStringEnum.Blue);
            assert.strictEqual(tronString.getElementAt(3, 1), TronStringEnum.Blue);
            assert.strictEqual(tronString.getElementAt(4, 1), TronStringEnum.Blue);
            assert.strictEqual(tronString.getElementAt(5, 1), TronStringEnum.Obstacle);

            assert.strictEqual(tronString.getElementAt(0, 2), TronStringEnum.Obstacle);
            assert.strictEqual(tronString.getElementAt(1, 2), TronStringEnum.Red);
            assert.strictEqual(tronString.getElementAt(2, 2), TronStringEnum.RedHead);
            assert.strictEqual(tronString.getElementAt(3, 2), TronStringEnum.Empty);
            assert.strictEqual(tronString.getElementAt(4, 2), TronStringEnum.Blue);
            assert.strictEqual(tronString.getElementAt(5, 2), TronStringEnum.Obstacle);

            assert.strictEqual(tronString.getElementAt(0, 3), TronStringEnum.Obstacle);
            assert.strictEqual(tronString.getElementAt(1, 3), TronStringEnum.Red);
            assert.strictEqual(tronString.getElementAt(2, 3), TronStringEnum.Empty);
            assert.strictEqual(tronString.getElementAt(3, 3), TronStringEnum.BlueHead);
            assert.strictEqual(tronString.getElementAt(4, 3), TronStringEnum.Blue);
            assert.strictEqual(tronString.getElementAt(5, 3), TronStringEnum.Obstacle);

            assert.strictEqual(tronString.getElementAt(0, 4), TronStringEnum.Obstacle);
            assert.strictEqual(tronString.getElementAt(1, 4), TronStringEnum.Red);
            assert.strictEqual(tronString.getElementAt(2, 4), TronStringEnum.Red);
            assert.strictEqual(tronString.getElementAt(3, 4), TronStringEnum.Red);
            assert.strictEqual(tronString.getElementAt(4, 4), TronStringEnum.Red);
            assert.strictEqual(tronString.getElementAt(5, 4), TronStringEnum.Obstacle);

            assert.strictEqual(tronString.getElementAt(0, 5), TronStringEnum.Obstacle);
            assert.strictEqual(tronString.getElementAt(1, 5), TronStringEnum.Obstacle);
            assert.strictEqual(tronString.getElementAt(2, 5), TronStringEnum.Obstacle);
            assert.strictEqual(tronString.getElementAt(3, 5), TronStringEnum.Obstacle);
            assert.strictEqual(tronString.getElementAt(4, 5), TronStringEnum.Obstacle);
            assert.strictEqual(tronString.getElementAt(5, 5), TronStringEnum.Obstacle);
        });

        it("constructor(10,15,20) should throw error", () => {
            assert.throws(() => {
                const tronString = new TronString(10, 15, 20);
            }, /Invalid arguments/);
        });
    });

    describe("#getElementAt", () => {
        it("getElementAt(-1, 0) should throw error when TronString area is 4x6", () => {
            assert.throws(() => {
                const tronString = new TronString(4, 6);
                tronString.getElementAt(-1, 0);
            }, /x cannot be negative/);
        });

        it("getElementAt(0, -1) should throw error when TronString area is 4x6", () => {
            assert.throws(() => {
                const tronString = new TronString(4, 6);
                tronString.getElementAt(0, -1);
            }, /y cannot be negative/);
        });

        it("getElementAt(4, 0) should throw error when TronString area is 4x6", () => {
            assert.throws(() => {
                const tronString = new TronString(4, 6);
                tronString.getElementAt(4, 0);
            }, /x cannot be greater or equal width/);
        });

        it("getElementAt(0, 6) should throw error when TronString area is 4x6", () => {
            assert.throws(() => {
                const tronString = new TronString(4, 6);
                tronString.getElementAt(0, 6);
            }, /y cannot be greater or equal height/);
        });

        it("getElementAt(0, 0) should return TronStringEnum.Empty when TronString area is 4x6", () => {
            const tronString = new TronString(4, 6);
            const actual = tronString.getElementAt(0, 0);
            assert.strictEqual(actual, TronStringEnum.Empty);
        });

        it("getElementAt(3, 5) should return TronStringEnum.Empty when TronString area is 4x6", () => {
            const tronString = new TronString(4, 6);
            const actual = tronString.getElementAt(3, 5);
            assert.strictEqual(actual, TronStringEnum.Empty);
        });
    });

    describe("#setElementAt", () => {
        it("setElementAt(-1, 0, TronStringEnum.Empty) should throw error when TronString area is 4x6", () => {
            assert.throws(() => {
                const tronString = new TronString(4, 6);
                tronString.setElementAt(-1, 0, TronStringEnum.Empty);
            }, /x cannot be negative/);
        });

        it("setElementAt(0, -1, TronStringEnum.Empty) should throw error when TronString area is 4x6", () => {
            assert.throws(() => {
                const tronString = new TronString(4, 6);
                tronString.setElementAt(0, -1, TronStringEnum.Empty);
            }, /y cannot be negative/);
        });

        it("setElementAt(4, 0, TronStringEnum.Empty) should throw error when TronString area is 4x6", () => {
            assert.throws(() => {
                const tronString = new TronString(4, 6);
                tronString.setElementAt(4, 0, TronStringEnum.Empty);
            }, /x cannot be greater or equal width/);
        });

        it("setElementAt(0, 6, TronStringEnum.Empty) should throw error when TronString area is 4x6", () => {
            assert.throws(() => {
                const tronString = new TronString(4, 6);
                tronString.setElementAt(0, 6, TronStringEnum.Empty);
            }, /y cannot be greater or equal height/);
        });

        it("setElementAt(0, 0, 'Value not existing in TronStringEnum') should throw error when TronString area is 4x6", () => {
            assert.throws(() => {
                const tronString = new TronString(4, 6);
                tronString.setElementAt(0, 0, "Value not existing in TronStringEnum");
            }, /value must be one of the TronStringEnum values/);
        });

        it("setElementAt(0, 0, TronStringEnum.Empty) should pass validation when TronString area is 4x6", () => {
            assert.doesNotThrow(() => {
                const tronString = new TronString(4, 6);
                tronString.setElementAt(0, 0, TronStringEnum.Empty);
            });
        });

        it("setElementAt(3, 5, TronStringEnum.Empty) should pass validation when TronString area is 4x6", () => {
            assert.doesNotThrow(() => {
                const tronString = new TronString(4, 6);
                tronString.setElementAt(3, 5, TronStringEnum.Empty);
            });
        });

        it("setElementAt(0, 0, TronStringEnum.Obstacle) should set TronStringEnum.Obstacle at (0,0) when TronString area is 4x6", () => {
            const tronString = new TronString(4, 6);
            tronString.setElementAt(0, 0, TronStringEnum.Obstacle);
            const actual = tronString.getElementAt(0, 0);
            assert.strictEqual(actual, TronStringEnum.Obstacle);
        });

        it("setElementAt(0, 0, TronStringEnum.Blue) should set TronStringEnum.Blue at (0,0) when TronString area is 4x6", () => {
            const tronString = new TronString(4, 6);
            tronString.setElementAt(0, 0, TronStringEnum.Blue);
            const actual = tronString.getElementAt(0, 0);
            assert.strictEqual(actual, TronStringEnum.Blue);
        });

        it("setElementAt(0, 0, TronStringEnum.BlueHead) should set TronStringEnum.BlueHead at (0,0) when TronString area is 4x6", () => {
            const tronString = new TronString(4, 6);
            tronString.setElementAt(0, 0, TronStringEnum.BlueHead);
            const actual = tronString.getElementAt(0, 0);
            assert.strictEqual(actual, TronStringEnum.BlueHead);
        });

        it("setElementAt(0, 0, TronStringEnum.Red) should set TronStringEnum.Red at (0,0) when TronString area is 4x6", () => {
            const tronString = new TronString(4, 6);
            tronString.setElementAt(0, 0, TronStringEnum.Red);
            const actual = tronString.getElementAt(0, 0);
            assert.strictEqual(actual, TronStringEnum.Red);
        });

        it("setElementAt(0, 0, TronStringEnum.RedHead) should set TronStringEnum.RedHead at (0,0) when TronString area is 4x6", () => {
            const tronString = new TronString(4, 6);
            tronString.setElementAt(0, 0, TronStringEnum.RedHead);
            const actual = tronString.getElementAt(0, 0);
            assert.strictEqual(actual, TronStringEnum.RedHead);
        });
    });

    describe("#toString", () => {
        it("toString() should return '4/4/4/4' when TronString created from constructor('4/4/4/4')", () => {
            const tronString = new TronString("4/4/4/4");
            const actual = tronString.toString();
            assert.strictEqual(actual, "4/4/4/4");
        });

        it("toString() should return '10/10/10/10/10/10/10/10' when TronString created from constructor('10/10/10/10/10/10/10/10')", () => {
            const tronString = new TronString("10/10/10/10/10/10/10/10");
            const actual = tronString.toString();
            assert.strictEqual(actual, "10/10/10/10/10/10/10/10");
        });

        it("toString() should return 'bbbb/4/4/4' when TronString created from constructor('bbbb/4/4/4')", () => {
            const tronString = new TronString("bbbb/4/4/4");
            const actual = tronString.toString();
            assert.strictEqual(actual, "bbbb/4/4/4");
        });

        it("toString() should return 'Bbbb/4/4/4' when TronString created from constructor('Bbbb/4/4/4')", () => {
            const tronString = new TronString("Bbbb/4/4/4");
            const actual = tronString.toString();
            assert.strictEqual(actual, "Bbbb/4/4/4");
        });

        it("toString() should return 'rrrr/4/4/4' when TronString created from constructor('rrrr/4/4/4')", () => {
            const tronString = new TronString("rrrr/4/4/4");
            const actual = tronString.toString();
            assert.strictEqual(actual, "rrrr/4/4/4");
        });

        it("toString() should return 'Rrrr/4/4/4' when TronString created from constructor('Rrrr/4/4/4')", () => {
            const tronString = new TronString("Rrrr/4/4/4");
            const actual = tronString.toString();
            assert.strictEqual(actual, "Rrrr/4/4/4");
        });

        it("toString() should return 'b3/4/4/4' when TronString created from constructor('b3/4/4/4')", () => {
            const tronString = new TronString("b3/4/4/4");
            const actual = tronString.toString();
            assert.strictEqual(actual, "b3/4/4/4");
        });

        it("toString() should return '3b/4/4/4' when TronString created from constructor('3b/4/4/4')", () => {
            const tronString = new TronString("3b/4/4/4");
            const actual = tronString.toString();
            assert.strictEqual(actual, "3b/4/4/4");
        });

        it("toString() should return 'o3/4/4/4' when TronString created from constructor('o3/4/4/4')", () => {
            const tronString = new TronString("o3/4/4/4");
            const actual = tronString.toString();
            assert.strictEqual(actual, "o3/4/4/4");
        });

        it("toString() should return '1b1r/2B1/1R2/b1r1' when TronString created from constructor('1b1r/2B1/1R2/b1r1')", () => {
            const tronString = new TronString("1b1r/2B1/1R2/b1r1");
            const actual = tronString.toString();
            assert.strictEqual(actual, "1b1r/2B1/1R2/b1r1");
        });

        it("toString() should return 'oooooo/obbbbo/orR1bo/or1Bbo/orrrro/oooooo' when TronString created from constructor('oooooo/obbbbo/orR1bo/or1Bbo/orrrro/oooooo')", () => {
            const tronString = new TronString("oooooo/obbbbo/orR1bo/or1Bbo/orrrro/oooooo");
            const actual = tronString.toString();
            assert.strictEqual(actual, "oooooo/obbbbo/orR1bo/or1Bbo/orrrro/oooooo");
        });
    });
});
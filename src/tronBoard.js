const TronString = require("./tronString").TronString;
const TronStringEnum = require("./tronString").TronStringEnum;

class TronBoard {
    constructor(tronString) {
        if (!tronString || typeof tronString !== "object" || tronString.constructor !== TronString) {
            throw new Error("tronString must be provided.");
        }

        this._width = tronString.width;
        this._height = tronString.height;

        this._board = [];
        for (let x = 0; x < this._width; x++) {
            this._board[x] = [];

            for (let y = 0; y < this._height; y++) {
                this._board[x][y] = tronString.getElementAt(x, y);
            }
        }

        this._isBlueAlive = true;
        this._isRedAlive = true;
    }

    get width() { return this._width; }
    get height() { return this._height; }

    get isBlueAlive() { return this._isBlueAlive; }
    get isRedAlive() { return this._isRedAlive; }
    get isGameOver() { return !this.isBlueAlive || !this.isRedAlive; }

    getElementAt(x, y) {
        this._validateCoordinates(x, y);
        return this._board[x][y];
    }

    makeMove(tronMove) {
        if (!tronMove || typeof tronMove !== "object" || tronMove.constructor !== TronMove) {
            throw new Error("tronMove must be provided.");
        }

        if (this.isGameOver) {
            throw new Error("Game is already over.");
        }

        const headsPositions = this._getHeadsPositions();
        const newBluePosition = this._translate(headsPositions.blueHead, tronMove.blueDirection);
        const newRedPosition = this._translate(headsPositions.redHead, tronMove.redDirection);

        if (this.getElementAt(newBluePosition.x, newBluePosition.y) !== TronStringEnum.Empty) {
            this._isBlueAlive = false;
        }
        if (this.getElementAt(newRedPosition.x, newRedPosition.y) !== TronStringEnum.Empty) {
            this._isRedAlive = false;
        }
        if (newBluePosition.x === newRedPosition.x && newBluePosition.y === newRedPosition.y) {
            this._isBlueAlive = false;
            this._isRedAlive = false;
        }
        if (this.isGameOver) return;

        this._setElementAt(headsPositions.blueHead.x, headsPositions.blueHead.y, TronStringEnum.Blue);
        this._setElementAt(headsPositions.redHead.x, headsPositions.redHead.y, TronStringEnum.Red);

        this._setElementAt(newBluePosition.x, newBluePosition.y, TronStringEnum.BlueHead);
        this._setElementAt(newRedPosition.x, newRedPosition.y, TronStringEnum.RedHead);
    }

    toTronString() {
        const tronString = new TronString(this.width, this.height);
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                tronString.setElementAt(x, y, this.getElementAt(x, y));
            }
        }

        return tronString;
    }

    _setElementAt(x, y, value) {
        this._validateCoordinates(x, y);
        this._board[x][y] = value;
    }

    _validateCoordinates(x, y) {
        if (x < 0) throw new Error("x cannot be negative.");
        if (y < 0) throw new Error("y cannot be negative.");
        if (x >= this.width) throw new Error("x cannot be greater or equal width.")
        if (y >= this.height) throw new Error("y cannot be greater or equal height.")
    }

    _getHeadsPositions() {
        const blueHead = {
            x: 0,
            y: 0
        };
        const redHead = {
            x: 0,
            y: 0
        };

        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (this.getElementAt(x, y) === TronStringEnum.BlueHead) {
                    blueHead.x = x;
                    blueHead.y = y;
                }
                if (this.getElementAt(x, y) === TronStringEnum.RedHead) {
                    redHead.x = x;
                    redHead.y = y;
                }
            }
        }

        return {
            blueHead: blueHead,
            redHead: redHead
        }
    }

    _translate(position, direction) {
        switch (direction) {
            case TronMoveDirection.Up:
                return {
                    x: position.x,
                    y: position.y - 1
                }
            case TronMoveDirection.Down:
                return {
                    x: position.x,
                    y: position.y + 1
                }
            case TronMoveDirection.Left:
                return {
                    x: position.x - 1,
                    y: position.y
                }
            case TronMoveDirection.Right:
                return {
                    x: position.x + 1,
                    y: position.y
                }
        }
    }
}

class TronMove {
    constructor(blueDirection, redDirection) {
        this._validateDirection(blueDirection);
        this._validateDirection(redDirection);

        this._blueDirection = blueDirection;
        this._redDirection = redDirection;
    }

    get blueDirection() { return this._blueDirection; }
    get redDirection() { return this._redDirection; }

    _validateDirection(direction) {
        if (direction === TronMoveDirection.Up) return;
        if (direction === TronMoveDirection.Down) return;
        if (direction === TronMoveDirection.Left) return;
        if (direction === TronMoveDirection.Right) return;

        throw new Error("direction must be one of the TronMoveDirection values.");
    }
}

const TronMoveDirection = {
    Up: "Up",
    Down: "Down",
    Left: "Left",
    Right: "Right"
}

module.exports = {
    TronBoard: TronBoard,
    TronMove: TronMove,
    TronMoveDirection: TronMoveDirection
}
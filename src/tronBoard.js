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
    }

    get width() { return this._width; }
    get height() { return this._height; }

    getElementAt(x, y) {
        return this._board[x][y];
    }

    makeMove(tronMove) {
        if (!tronMove || typeof tronMove !== "object" || tronMove.constructor !== TronMove) {
            throw new Error("tronMove must be provided.");
        }

        const headsPositions = this._getHeadsPositions();
        const newBluePosition = this._translate(headsPositions.blueHead, tronMove.blueDirection);
        const newRedPosition = this._translate(headsPositions.redHead, tronMove.redDirection);

        this._board[headsPositions.blueHead.x][headsPositions.blueHead.y] = TronStringEnum.Blue;
        this._board[headsPositions.redHead.x][headsPositions.redHead.y] = TronStringEnum.Red;

        this._board[newBluePosition.x][newBluePosition.y] = TronStringEnum.BlueHead;
        this._board[newRedPosition.x][newRedPosition.y] = TronStringEnum.RedHead;
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
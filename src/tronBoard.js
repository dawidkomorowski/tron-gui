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

    toTronString() {
        const tronString = new TronString(this.width, this.height);
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                tronString.setElementAt(x, y, this.getElementAt(x, y));
            }
        }

        return tronString;
    }
}

module.exports = {
    TronBoard: TronBoard,
}
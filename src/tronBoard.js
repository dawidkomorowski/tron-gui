class TronBoard {
    constructor(tronString) {
        if (!tronString) {
            throw "tronString cannot be empty."
        }

        let rowStrings = tronString.split("/");

        this._width = this._readTilesFromTronStringRow(rowStrings[0]).length;
        this._height = rowStrings.length;

        for (let i = 0; i < rowStrings.length; i++) {
            if (this._width !== this._readTilesFromTronStringRow(rowStrings[i]).length) {
                throw "Error at row index: " + i + " value: " + rowStrings[i] + ". tronString must define rectangular board.";
            }
        }

        this._board = [];
        for (let x = 0; x < this._width; x++) {
            this._board[x] = [];

            for (let y = 0; y < this._height; y++) {
                let tiles = this._readTilesFromTronStringRow(rowStrings[y])
                this._board[x][y] = tiles[x];
            }
        }
    }

    get width() { return this._width; }
    get height() { return this._height; }

    getElementAt(x, y) {
        return this._board[x][y];
    }

    toTronString() {
        return "B9/10/10/10/10/10/10/10/9R/9r";
    }

    _readTilesFromTronStringRow(tronStringRow) {
        let tiles = [];

        for (let i = 0; i < tronStringRow.length; i++) {
            if (tronStringRow[i] === "b") {
                tiles.push(TronBoardEnum.Blue);
            }
            if (tronStringRow[i] === "B") {
                tiles.push(TronBoardEnum.BlueHead);
            }
            if (tronStringRow[i] === "r") {
                tiles.push(TronBoardEnum.Red);
            }
            if (tronStringRow[i] === "R") {
                tiles.push(TronBoardEnum.RedHead);
            }

            let emptyTilesCountString = "";
            while (i < tronStringRow.length && Number.isInteger(parseInt(tronStringRow[i]))) {
                emptyTilesCountString += tronStringRow[i];
                i++;
            }
            if (emptyTilesCountString) i--;

            let emptyTilesCount = parseInt(emptyTilesCountString);
            if (emptyTilesCount) {
                for (let j = 0; j < emptyTilesCount; j++) {
                    tiles.push(TronBoardEnum.Empty);
                }
            }
        }

        return tiles;
    }
}

const TronBoardEnum = {
    Empty: "Empty",
    Blue: "Blue",
    BlueHead: "BlueHead",
    Red: "Red",
    RedHead: "RedHead"
}

module.exports = {
    TronBoard: TronBoard,
    TronBoardEnum: TronBoardEnum
}
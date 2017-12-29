class TronBoard {
    constructor(tronString) {
        if (!tronString) {
            throw "tronString cannot be empty."
        }

        let rowStrings = tronString.split("/");

        this._width = this._readWidthFromTronStringRow(rowStrings[0]);
        this._height = rowStrings.length;

        for (let i = 0; i < rowStrings.length; i++) {
            if (this._width !== this._readWidthFromTronStringRow(rowStrings[i])) {
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

    _readWidthFromTronStringRow(tronStringRow) {
        let width = 0;

        for (let i = 0; i < tronStringRow.length; i++) {
            if (tronStringRow[i] === "b" || tronStringRow[i] === "B" || tronStringRow[i] === "r" || tronStringRow[i] === "R") {
                width++;
            }

            // TODO handle multidigit numbers
            let emptyTilesCount = parseInt(tronStringRow[i]);
            if (emptyTilesCount) {
                width += emptyTilesCount;
            }
        }

        return width;
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

            let emptyTilesCount = parseInt(tronStringRow[i]);
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
class TronBoard {
    constructor() {
        this._width = 10;
        this._height = 10;

        this._board = [];
        for (let x = 0; x < this._width; x++) {
            this._board[x] = [];
            for (let y = 0; y < this._height; y++) {
                this._board[x][y] = TronBoardEnum.Empty;
            }
        }

        this._board[0][0] = TronBoardEnum.BlueHead;
        this._board[9][9] = TronBoardEnum.RedHead;
    }

    get width() { return this._width; }
    get height() { return this._height; }

    getElementAt(x, y) {
        return this._board[x][y];
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
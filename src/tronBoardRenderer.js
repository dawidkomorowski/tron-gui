const TronBoardEnum = require("./tronBoard").TronBoardEnum;

class TronBoardRenderer {
    constructor(canvasId) {
        this._canvasId = canvasId;
        this._canvas = document.getElementById(this._canvasId);
        this._context = this._canvas.getContext("2d");
    }

    set tronBoard(tronBoard) { this._tronBoard = tronBoard; }
    get tronBoard() { return this._tronBoard; }
    get pixelsWidth() { return this._canvas.width; }
    get pixelsHeight() { return this._canvas.height; }
    get tilePixelsWidth() { return this.pixelsWidth / this._tronBoard.width; }
    get tilePixelsHeight() { return this.pixelsHeight / this._tronBoard.height; }

    render() {
        for (let x = 0; x < this._tronBoard.width; x++) {
            for (let y = 0; y < this._tronBoard.height; y++) {
                this._renderTile(x, y, this._tronBoard.getElementAt(x, y))
            }
        }
    }

    _renderTile(x, y, tileState) {
        const drawX = x * this.tilePixelsWidth;
        const drawY = y * this.tilePixelsHeight;

        // TODO mark heads
        this._context.fillStyle = this._convertTileStateToColor(tileState);
        this._context.fillRect(drawX, drawY, this.tilePixelsWidth, this.tilePixelsHeight);
        this._context.rect(drawX, drawY, this.tilePixelsWidth, this.tilePixelsHeight);
        this._context.stroke();
    }

    _convertTileStateToColor(tileState) {
        switch (tileState) {
            case TronBoardEnum.Empty:
                return "#FFFFFF";
            case TronBoardEnum.Red:
            case TronBoardEnum.RedHead:
                return "#FF0000";
            case TronBoardEnum.Blue:
            case TronBoardEnum.BlueHead:
                return "#0000FF";
        }
    }
}

module.exports = {
    TronBoardRenderer: TronBoardRenderer
}
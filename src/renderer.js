// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const TronBoard = require("./tronBoard").TronBoard;
const TronBoardRenderer = require("./tronBoardRenderer").TronBoardRenderer;

let tronBoardRenderer = new TronBoardRenderer("tronBoardCanvas");
let tronBoard = new TronBoard();

tronBoardRenderer.tronBoard = tronBoard;
tronBoardRenderer.render();
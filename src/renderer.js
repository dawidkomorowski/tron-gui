// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const TronString = require("./tronString").TronString;
const TronBoard = require("./tronBoard").TronBoard;
const TronBoardRenderer = require("./tronBoardRenderer").TronBoardRenderer;

let tronString = new TronString("oooooooooooo/oB9o/o10o/o10o/o10o/o10o/o10o/o10o/o10o/o10o/o9Ro/oooooooooooo");
let tronBoard = new TronBoard(tronString);
let tronBoardRenderer = new TronBoardRenderer("tronBoardCanvas");

// TODO maybe pass once by constructor?
tronBoardRenderer.tronBoard = tronBoard;
tronBoardRenderer.render();
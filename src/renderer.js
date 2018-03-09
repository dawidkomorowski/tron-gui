// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const TronString = require("./tronString").TronString;
const TronBoard = require("./tronBoard").TronBoard;
const TronBoardRenderer = require("./tronBoardRenderer").TronBoardRenderer;
const Process = require("./process").Process;
const TronBot = require("./tronBot").TronBot;

let tronString = new TronString("oooooooooooo/oB9o/o10o/o10o/o10o/o10o/o10o/o10o/o10o/o10o/o9Ro/oooooooooooo");
let tronBoard = new TronBoard(tronString);
let tronBoardRenderer = new TronBoardRenderer("tron-board-canvas");

// TODO maybe pass once by constructor?
tronBoardRenderer.tronBoard = tronBoard;
tronBoardRenderer.render();

let redBotLogTextArea = document.getElementById("red-bot-log");
let tronBot = new TronBot("C:\\Users\\Dawid Komorowski\\source\\repos\\TbiTester\\TbiTester\\bin\\Debug\\TbiTester.exe", m => {
    redBotLogTextArea.textContent = redBotLogTextArea.textContent + m + "\n";
    redBotLogTextArea.scrollTop = redBotLogTextArea.scrollHeight;
});

tronBot.start().then(() => {
    tronBot.stop();
});
// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const TronString = require("./tronString").TronString;
const TronBoard = require("./tronBoard").TronBoard;
const TronBoardRenderer = require("./tronBoardRenderer").TronBoardRenderer;
const Process = require("./process").Process;
const TronBot = require("./tronBot").TronBot;
const TronBotColor = require("./tronBot").TronBotColor;
const Log = require("./log").Log;
const ControlPanel = require("./controlPanel").ControlPanel;

const controlPanel = new ControlPanel({
    blueBotPathInput: "blue-bot-path",
    redBotPathInput: "red-bot-path",
    runButton: "run-button",
    blueBotLogTextArea: "blue-bot-log",
    redBotLogTextArea: "red-bot-log"
});

controlPanel._runButtonHandler = () => {
    console.log(controlPanel.blueBotPath);
}

let tronString = new TronString("oooooooooooo/oB9o/o10o/o10o/o10o/o10o/o10o/o10o/o10o/o10o/o9Ro/oooooooooooo");
let tronBoard = new TronBoard(tronString);
let tronBoardRenderer = new TronBoardRenderer("tron-board-canvas");

// TODO maybe pass once by constructor?
tronBoardRenderer.tronBoard = tronBoard;
tronBoardRenderer.render();

let tronBot = new TronBot(TronBotColor.Blue, "C:\\Users\\Dawid Komorowski\\source\\repos\\TbiTester\\TbiTester\\bin\\Debug\\TbiTester.exe", controlPanel.blueBotLog);

tronBot.start().then(() => {
    tronBot.makeMove(tronString).then(data => {
        console.log(data);
        tronBot.stop();
    })
});
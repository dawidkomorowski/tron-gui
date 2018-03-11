// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const TronBoardRenderer = require("./tronBoardRenderer").TronBoardRenderer;
const Process = require("./process").Process;
const TronBot = require("./tronBot").TronBot;
const TronBotColor = require("./tronBot").TronBotColor;
const ControlPanel = require("./controlPanel").ControlPanel;
const HostManager = require("./hostManager").HostManager;

const tronBoardRenderer = new TronBoardRenderer("tron-board-canvas");
const controlPanel = new ControlPanel({
    blueBotPathInput: "blue-bot-path",
    redBotPathInput: "red-bot-path",
    runButton: "run-button",
    blueBotLogTextArea: "blue-bot-log",
    redBotLogTextArea: "red-bot-log"
});
const hostManager = new HostManager(tronBoardRenderer, controlPanel);

// C:\Users\Dawid Komorowski\source\repos\TbiTester\TbiTester\bin\Debug\TbiTester.exe
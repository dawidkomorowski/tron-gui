// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const TronBoardRenderer = require("./tronBoardRenderer").TronBoardRenderer;
const ControlPanel = require("./controlPanel").ControlPanel;
const ResultsControl = require("./resultsControl").ResultsControl;
const HostManager = require("../hostManager").HostManager;

const tronBoardRenderer = new TronBoardRenderer("tron-board-canvas");
const controlPanel = new ControlPanel({
    blueBotPathInput: "blue-bot-path",
    redBotPathInput: "red-bot-path",
    runButton: "run-button",
    blueBotLogTextArea: "blue-bot-log",
    redBotLogTextArea: "red-bot-log"
});
const resultsControl = new ResultsControl("results-control")
const hostManager = new HostManager(tronBoardRenderer, controlPanel, resultsControl);

window.onbeforeunload = () => {
    hostManager.onAppClosing();
}
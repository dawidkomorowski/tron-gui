class ResultsControl {
    constructor(rootElementId) {
        this._rootElement = document.getElementById(rootElementId);
    }

    appendResult(result) {
        switch (result) {
            case Result.BlueWon:
                this._fetchAndAppendElementById("blue-won");
                return;
            case Result.RedWon:
                this._fetchAndAppendElementById("red-won");
                return;
            case Result.Draw:
                this._fetchAndAppendElementById("draw");
                return;
        }
    }

    _fetchAndAppendElementById(elementId) {
        fetch("./result-template.html").then(response => {
            return response.text();
        }).then(html => {
            const domParser = new DOMParser();
            const loadedDocument = domParser.parseFromString(html, "text/html");
            const loadedElement = loadedDocument.getElementById(elementId);

            this._rootElement.appendChild(loadedElement);
        });
    }
}

const Result = {
    BlueWon: "BlueWon",
    RedWon: "RedWon",
    Draw: "Draw"
}

module.exports = {
    ResultsControl: ResultsControl,
    Result: Result
}
class TronString {
    constructor() {
        if (arguments.length === 0) {
            throw new Error("No constructor overload takes 0 parameters.\n" +
                "Provide string (tron string format) parameter to create from tron string.\n" +
                "Provide width and height (numbers) parameters to create empty field of given dimension.");
        }
        else {
            if (arguments.length === 1 && typeof arguments[0] === "string") {
                this._constructorString(arguments[0]);
            }
            else {
                if (arguments.length === 2 && typeof arguments[0] === "number" && typeof arguments[1] === "number") {
                    this._constructorWidthHeight(arguments[0], arguments[1]);
                }
                else {
                    throw new Error("Invalid arguments: " + arguments);
                }
            }
        }
    }

    get width() { return this._width; }
    get height() { return this._height; }

    getElementAt(x, y) {
        // TODO validate?
        return this._elements[x][y];
    }

    setElementAt(x, y, value) {
        // TODO validate
        this._elements[x][y] = value;
    }

    _constructorString(string) {
        if (!string) throw new Error("string cannot be empty.");

        this._elements = this._parseTronString(string);
        this._width = this._elements.length;
        this._height = this._elements[0].length;
    }

    _constructorWidthHeight(width, height) {
        if (width <= 0) throw new Error("width must be positive.");
        if (height <= 0) throw new Error("height must be positive.");

        this._width = width;
        this._height = height;

        this._elements = [];
        for (let x = 0; x < this._width; x++) {
            this._elements[x] = [];
            for (let y = 0; y < this._height; y++) {
                this._elements[x][y] = TronStringEnum.Empty;
            }
        }
    }

    _parseTronString(string) {
        let elements = [];
        let width;
        let i = 0;
        let rowIndex = 0;

        while (true) {
            const rowResult = this._parseRow(string, i);

            if (width && width !== rowResult.rowElements.length) {
                throw new ParsingError(string, i, "TronString must define rectangular area.");
            }
            else {
                width = rowResult.rowElements.length;
            }

            for (let columnIndex = 0; columnIndex < rowResult.rowElements.length; columnIndex++) {
                if (!elements[columnIndex]) {
                    elements[columnIndex] = [];
                }
                elements[columnIndex][rowIndex] = rowResult.rowElements[columnIndex];
            }

            i += rowResult.charactersRead;
            rowIndex++;

            if (i < string.length) {
                if (string[i] !== "/") {
                    throw new ParsingError(string, i, "Expected '/'.")
                }
                i++;
            }
            else {
                break;
            }

        }

        return elements;
    }

    _parseRow(string, i) {
        let rowElements = [];
        let charactersRead = 0;

        const notEmptyResult = this._parseNotEmpty(string, i);
        if (notEmptyResult.charactersRead === 0) {
            const emptyResult = this._parseEmpty(string, i);
            if (emptyResult.charactersRead === 0) {
                throw new ParsingError(string, i, "Expected one of the following 'b', 'B', 'r', 'R', number.");
            }

            if (emptyResult.rowElements.length === 0) {
                throw new ParsingError(string, i, "0 number is not allowed.");
            }

            rowElements.push(...emptyResult.rowElements);
            charactersRead += emptyResult.charactersRead;
            i += emptyResult.charactersRead;
        }

        while (i < string.length) {
            let notEmptyResult = this._parseNotEmpty(string, i);
            if (notEmptyResult.charactersRead === 0) {
                let emptyResult = this._parseEmpty(string, i);
                if (emptyResult.charactersRead === 0) {
                    break;
                }

                if (emptyResult.rowElements.length === 0) {
                    throw new ParsingError(string, i, "0 number is not allowed.");
                }

                rowElements.push(...emptyResult.rowElements);
                charactersRead += emptyResult.charactersRead;
                i += emptyResult.charactersRead;
            }
            else {
                rowElements.push(...notEmptyResult.rowElements);
                charactersRead += notEmptyResult.charactersRead;
                i += notEmptyResult.charactersRead;
            }
        }

        return {
            rowElements: rowElements,
            charactersRead: charactersRead
        }
    }

    _parseNotEmpty(string, i) {
        let rowElements = [];
        let charactersRead = 0;

        switch (string[i]) {
            case "b":
                rowElements.push(TronStringEnum.Blue);
                charactersRead++;
                break;
            case "B":
                rowElements.push(TronStringEnum.BlueHead);
                charactersRead++;
                break;
            case "r":
                rowElements.push(TronStringEnum.Red);
                charactersRead++;
                break;
            case "R":
                rowElements.push(TronStringEnum.RedHead);
                charactersRead++;
                break;
            default:
                break;
        }

        return {
            rowElements: rowElements,
            charactersRead: charactersRead
        }
    }

    _parseEmpty(string, i) {
        let rowElements = [];
        let charactersRead = 0;
        let characters = "";

        while (i < string.length && this._isDigit(string[i])) {
            characters += string[i];
            charactersRead++;
            i++;
        }

        let number = parseInt(characters);
        if (Number.isInteger(number)) {
            for (let it = 0; it < number; it++) {
                rowElements.push(TronStringEnum.Empty);
            }
        }

        return {
            rowElements: rowElements,
            charactersRead: charactersRead
        }
    }

    _isDigit(char) {
        return char === "0" ||
            char === "1" ||
            char === "2" ||
            char === "3" ||
            char === "4" ||
            char === "5" ||
            char === "6" ||
            char === "7" ||
            char === "8" ||
            char === "9";
    }
}

class ParsingError extends Error {
    constructor(string, i, message) {
        super("Parsing error at position: " + i + ", character: '" + string[i] + "'. " + message);
    }
}

const TronStringEnum = {
    Empty: "Empty",
    Blue: "Blue",
    BlueHead: "BlueHead",
    Red: "Red",
    RedHead: "RedHead"
}

module.exports = {
    TronString: TronString,
    TronStringEnum: TronStringEnum
}
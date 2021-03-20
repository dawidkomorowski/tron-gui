class Configuration {
    constructor(blueBotConfig, redBotConfig) {
        this._blueBotConfig = blueBotConfig;
        this._redBotConfig = redBotConfig;
    }

    get blueBotConfig() { return this._blueBotConfig; }
    get redBotConfig() { return this._redBotConfig; }

    static readFromFile(path) {
        return new Configuration(
            new TronBotConfig("blue-path"),
            new TronBotConfig("red-path")
        );
    }

    static writeToFile(path, configuration) {

    }
}

class TronBotConfig {
    constructor(path) {
        this._path = path;
    }

    get path() { return this._path; }
}

module.exports = {
    Configuration: Configuration,
    TronBotConfig: TronBotConfig
}
const fs = require("fs");

class Configuration {
    constructor(blueBotConfig, redBotConfig) {
        this._blueBotConfig = blueBotConfig;
        this._redBotConfig = redBotConfig;
    }

    get blueBotConfig() { return this._blueBotConfig; }
    get redBotConfig() { return this._redBotConfig; }

    static readFromFile(path) {
        if (fs.existsSync(path)) {
            const json = fs.readFileSync(path);
            const parsed = JSON.parse(json);

            return new Configuration(
                new TronBotConfig(parsed.blueBotConfig.path),
                new TronBotConfig(parsed.redBotConfig.path)
            );
        }

        return new Configuration(
            new TronBotConfig(""),
            new TronBotConfig("")
        );
    }

    static writeToFile(path, configuration) {
        const toSerialize = {
            blueBotConfig: {
                path: configuration.blueBotConfig.path
            },
            redBotConfig: {
                path: configuration.redBotConfig.path
            }
        };
        const json = JSON.stringify(toSerialize);
        fs.writeFileSync(path, json);
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
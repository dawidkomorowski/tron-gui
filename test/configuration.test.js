const assert = require("assert");
const fs = require("fs");
const Configuration = require("../src/configuration").Configuration;
const TronBotConfig = require("../src/configuration").TronBotConfig;

const ExistingConfigFilePath = "test/workingDir/test-existing-config.json";
const NotExistingConfigFilePath = "test/workingDir/test-not-existing-config.json";

describe("Configuration", () => {
    beforeEach(() => {
        const existingConfig = {
            blueBotConfig: {
                path: "blue-path"
            },
            redBotConfig: {
                path: "red-path"
            }
        };
        const json = JSON.stringify(existingConfig);
        fs.writeFileSync(ExistingConfigFilePath, json);

        if (fs.existsSync(NotExistingConfigFilePath)) {
            fs.unlinkSync(NotExistingConfigFilePath);
        }
    });

    describe("#readFromFile", () => {
        it("should return default configuration with empty path when file does not exist", () => {
            const configuration = Configuration.readFromFile(NotExistingConfigFilePath);
            assert.strictEqual(configuration.blueBotConfig.path, "");
            assert.strictEqual(configuration.redBotConfig.path, "");
        });

        it("should return configuration read from file", () => {
            const configuration = Configuration.readFromFile(ExistingConfigFilePath);
            assert.strictEqual(configuration.blueBotConfig.path, "blue-path");
            assert.strictEqual(configuration.redBotConfig.path, "red-path");
        });
    });

    describe("#writeToFile", () => {
        it("should create new file and write configuration to it when file does not exist", () => {
            const configuration = new Configuration(
                new TronBotConfig("blue-path"),
                new TronBotConfig("red-path")
            );
            Configuration.writeToFile(NotExistingConfigFilePath, configuration);

            assert.strictEqual(fs.existsSync(NotExistingConfigFilePath), true);

            const readConfiguration = Configuration.readFromFile(NotExistingConfigFilePath);
            assert.strictEqual(readConfiguration.blueBotConfig.path, configuration.blueBotConfig.path);
            assert.strictEqual(readConfiguration.redBotConfig.path, configuration.redBotConfig.path);
        });

        it("should overwrite existing file with new configuration", () => {
            const configuration = new Configuration(
                new TronBotConfig("new-blue-path"),
                new TronBotConfig("new-red-path")
            );
            Configuration.writeToFile(ExistingConfigFilePath, configuration);

            const readConfiguration = Configuration.readFromFile(ExistingConfigFilePath);
            assert.strictEqual(readConfiguration.blueBotConfig.path, configuration.blueBotConfig.path);
            assert.strictEqual(readConfiguration.redBotConfig.path, configuration.redBotConfig.path);
        });
    });
});
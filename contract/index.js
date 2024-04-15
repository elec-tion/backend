const { compileContract } = require("./compiler/compile");
const { deployContract } = require("./deployer/deploy");

// take command line arguments
const args = process.argv.slice(2);
const command = args[0];

// if command is deploy, deploy contract
if (command === "compile") {
    console.log("Compiling contract...");
    compileContract(
        process.env.CONTRACT_SOURCE_PATH,
        process.env.CONTRACT_FILENAME,
        process.env.CONTRACT_NAME,
        process.env.BUILD_PATH
    ).catch((err) => {
        console.error("deployContract ERROR", err);
        console.error(err);
        process.exit(1);
    });
} else if (command === "deploy") {
    console.log("Deploying contract...");
    deployContract(
        process.env.CONTRACT_NAME,
        process.env.BUILD_PATH
    ).catch((err) => {
        console.error("deployContract ERROR", err);
        console.error(err);
        process.exit(1);
    });
} else if (command === "test") {
    console.log("Compiling and deploying contract...");
    compileContract(
        process.env.CONTRACT_SOURCE_PATH,
        process.env.CONTRACT_FILENAME,
        process.env.CONTRACT_NAME,
        process.env.BUILD_PATH
    ).catch((err) => {
        console.error("deployContract ERROR", err);
        console.error(err);
        process.exit(1);
    });
    deployContract(
        process.env.CONTRACT_NAME,
        process.env.BUILD_PATH
    ).catch((err) => {
        console.error("deployContract ERROR", err);
        console.error(err);
        process.exit(1);
    });

} else if (command === "help") {
    console.log("Usage: node index.js [command]");
    console.log("Commands:");
    console.log("   compile: Compile contract");
    console.log("   deploy: Deploy contract");
    console.log("   test: Compile and deploy contract");
    console.log("   help: Display this help message");
}
const { compileContract } = require("./src/compiler");
const { deployContract } = require("./src/deployer");
const dotenv = require("dotenv");
dotenv.config();

// take command line arguments
const args = process.argv.slice(2);
const command = args[0];

// if command is deploy, deploy contract
if (command === "compile") {
	console.log("Compiling contract...");
	compileContract(process.env.CONTRACT_SOURCE_PATH, process.env.CONTRACT_FILENAME, process.env.CONTRACT_NAME, process.env.BUILD_PATH)
		.then((paths) => {
			// Log success message
			console.log("Compilation successful!");
			// Log path to the compiled contract files
			console.log("ABI Path:", paths.abiPath);
			console.log("Bytecode Path:", paths.bytecodePath);
		})
		.catch((error) => {
			console.error("Compilation failed:", error); // Log error message if compilation fails
		});
} else if (command === "deploy") {
	console.log("Deploying contract...");

	deployContract(process.env.CONTRACT_NAME, process.env.BUILD_PATH)
		.then((receipt) => {
			console.log("Transaction Receipt:", receipt);
		})
		.catch((error) => {
			console.error("Error deploying contract:", error);
		});
} else if (command === "help") {
	console.log("Usage: node index.js [command]");
	console.log("Commands:");
	console.log("   compile: Compile contract");
	console.log("   deploy: Deploy contract");
	console.log("   help: Display this help message");
}

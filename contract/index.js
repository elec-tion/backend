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
	console.log("Usage: node index.js [command] or npm run [command]");
	console.log("Commands:");
	console.log("\tcompile\t\t-> Compile contract for e-lection Network");
	console.log("\tdeploy\t\t-> Deploy contract to e-lection Network");
	console.log("\thardhat:compile\t-> Compile contract for Hardhat local network");
	console.log("\thardhat:deploy\t-> Deploy contract to Hardhat local network");
	console.log("\thardhat:test\t-> Run tests using Hardhat local network");
	console.log("\thardhat:node\t-> Start Hardhat local network");
	console.log("\thelp\t\t-> Display this help message");
}

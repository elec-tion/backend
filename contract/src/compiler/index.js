// This code will compile smart contract and generate its ABI and bytecode
// Alternatively, you can use something like `npm i solc && npx solcjs MyContract.sol --bin --abi`

const solc = require("solc");
const path = require("path");
const fs = require("fs");

/**
 * Compiles the Solidity source code, generates bytecode and ABI, and saves them to files.
 *
 * @param {string} contractSourcePath - The path to the directory containing the Solidity source code.
 * @param {string} contractfileName - The name of the Solidity file to compile.
 * @param {string} contractName - The name of the contract to compile.
 * @param {string} buildPath - The path to save the compiled contract files.
 * @returns {Promise<object>} - The ABI and bytecode file paths.
 */
async function compileContract(contractSourcePath, contractfileName, contractName, buildPath) {
	// Read the Solidity source code from the file system
	const contractPath = path.join(contractSourcePath, contractfileName);
	const sourceCode = fs.readFileSync(contractPath, "utf8");

	// Create build path if it doesn't exist
	if (!fs.existsSync(buildPath)) {
		fs.mkdirSync(buildPath);
	}

	// solc compiler config
	const input = {
		language: "Solidity",
		sources: {
			[contractfileName]: {
				content: sourceCode,
			},
		},
		settings: {
			outputSelection: {
				"*": {
					"*": ["*"],
				},
			},
		},
	};

	// Compile the Solidity code using solc
	const compiledCode = JSON.parse(solc.compile(JSON.stringify(input)));

	// Get the bytecode from the compiled contract
	const bytecode = compiledCode.contracts[contractfileName][contractName].evm.bytecode.object;

	// Write the bytecode to a new file
	const bytecodePath = path.join(buildPath, contractName + ".bytecode");
	fs.writeFileSync(bytecodePath, bytecode, "utf-8");

	// Get the ABI from the compiled contract
	const abi = compiledCode.contracts[contractfileName][contractName].abi;

	// Write the Contract ABI to a new file
	const abiPath = path.join(buildPath, contractName + ".abi");
	fs.writeFileSync(abiPath, JSON.stringify(abi, null, 4), "utf-8");

	// Return the ABI and bytecode file paths
	return {
		abiPath: abiPath,
		bytecodePath: bytecodePath,
	};
}

module.exports = {
	compileContract,
};

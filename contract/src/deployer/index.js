const fs = require("fs");
const path = require("path");
const { Web3 } = require("web3");
const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();

const web3 = new Web3(process.env.CHAIN_RPC); // Specify your Quorum node's RPC endpoint

/**
 * Deploys a smart contract to the blockchain network.
 *
 * @param {string} contractName - The name of the contract to deploy.
 * @param {string} buildPath - The path where the contract is built.
 * @returns {Promise<object>} - The transaction receipt of the deployment.
 */
async function deployContract(contractName, buildPath) {
	// Read the bytecode from the file system
	const bytecodePath = path.join(buildPath, contractName + ".bytecode");
	const contractBytecode = fs.readFileSync(bytecodePath, "utf8");

	// Set the constructor parameters
	const contractConstructorInit = "";

	// Get the admin account
	const adminAccount = web3.eth.accounts.privateKeyToAccount("0x" + crypto.createHash("sha256").update(process.env.ADMIN_KEY).digest("hex"));

	// Get the transaction count for the admin account
	const txnCount = await web3.eth.getTransactionCount(adminAccount.address);

	// Define the transaction options
	let txOptions = {
		nonce: web3.utils.numberToHex(txnCount),
		from: adminAccount.address,
		to: null, // public tx
		value: "0x0",
		data: "0x" + contractBytecode + contractConstructorInit, // contract binary appended with initialization value
	};

	// Estimate the gas limit
	const gasEstimate = await web3.eth.estimateGas(txOptions).catch(async (err) => {
		console.error("Error estimating gas:", err);
		throw err;
	});

	// Convert the gas estimate to hex and set it with gas price
	const gasLimit = web3.utils.numberToHex(gasEstimate);
	txOptions.gasPrice = "0x0";
	txOptions.gasLimit = gasLimit;

	console.log("Creating and signing transaction...");
	const signedTx = await adminAccount.signTransaction(txOptions);

	console.log("Sending transaction...");
	const txr = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

	// Save the contract address to a file
	const addressPath = path.join(buildPath, contractName + ".address");
	fs.writeFileSync(addressPath, txr.contractAddress, "utf-8");

	// Print the transaction receipt
	return {
		blockHash: txr.blockHash,
		blockNumber: web3.utils.numberToHex(txr.blockNumber),
		contractAddress: txr.contractAddress,
		cumulativeGasUsed: web3.utils.numberToHex(txr.cumulativeGasUsed),
		from: txr.from,
		gasUsed: web3.utils.numberToHex(txr.gasUsed),
		logs: txr.logs,
		status: web3.utils.numberToHex(txr.status),
		to: txr.to,
		transactionHash: txr.transactionHash,
		transactionIndex: web3.utils.numberToHex(txr.transactionIndex),
		type: web3.utils.numberToHex(txr.type),
	};
}

module.exports = {
	deployContract,
};

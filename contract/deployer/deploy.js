import Web3 from 'web3';
import fs from 'fs';
import dotenv from 'dotenv'; dotenv.config();
import { exit } from 'process';

const web3 = new Web3(process.env.CHAIN_RPC); // Specify your Quorum node's RPC endpoint
const contractBytecode = fs.readFileSync('build/ElectionContract.bytecode', 'utf8');
const contractConstructorInit = "";

const account = web3.eth.accounts.privateKeyToAccount(process.env.ADMIN_PRIVATE_KEY);
const txnCount = await web3.eth.getTransactionCount(account.address);

let txOptions = {
	nonce: web3.utils.numberToHex(txnCount),
	from: account.address,
	to: null, // public tx
	value: "0x0",
	data: "0x" + contractBytecode + contractConstructorInit, // contract binary appended with initialization value
};

// estimate gas
const gasEstimate = await web3.eth.estimateGas(txOptions).catch(err => {
    console.error('Error estimating gas:', err);
    exit(1); // Exit the process if there's an error
});

// convert gas estimate to hex and double it
const gasLimit = web3.utils.numberToHex(gasEstimate);
txOptions.gasPrice = "0x0";
txOptions.gasLimit = gasLimit;

console.log("Creating and signing transaction...");
const signedTx = await web3.eth.accounts.signTransaction(txOptions, account.privateKey);

console.log("Sending transaction...");
const txr = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

console.log("tx : " + JSON.stringify({
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
}, null, 4));
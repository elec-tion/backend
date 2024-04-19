const fs = require('fs');
const dotenv = require('dotenv');
const crypto = require('crypto');
const Web3 = require('web3');
dotenv.config();

const chain = new Web3.Web3(process.env.CHAIN_RPC);
const adminAccount = chain.eth.accounts.privateKeyToAccount("0x" + crypto.createHash("sha256").update(process.env.ADMIN_KEY).digest("hex"));
const contractInstance = new chain.eth.Contract(
	JSON.parse(fs.readFileSync(process.env.CONTRACT_ABI_PATH, "utf-8")),
	fs.readFileSync(process.env.CONTRACT_ADDRESS_PATH, "utf-8")
);

module.exports = {
	chain,
	contractInstance,
	adminAccount,
};

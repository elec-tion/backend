const fs = require("fs");
const crypto = require("crypto");
const { Web3 } = require("web3");
const dotenv = require("dotenv");
dotenv.config();

const chain = new Web3(process.env.CHAIN_RPC);
const adminAccount = chain.eth.accounts.privateKeyToAccount("0x" + crypto.createHash("sha256").update(process.env.ADMIN_KEY).digest("hex"));
const contractInstance = new chain.eth.Contract(
	JSON.parse(fs.readFileSync(process.env.CONTRACT_ABI_LOCATION, "utf-8")),
	fs.readFileSync(process.env.CONTRACT_ADDRESS_LOCATION, "utf-8")
);

module.exports = {
	Web3,
	chain,
	contractInstance,
	adminAccount,
};

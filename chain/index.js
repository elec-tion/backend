import fs from 'fs';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { Web3 } from 'web3';
dotenv.config();

const chain = new Web3(new Web3.providers.HttpProvider(process.env.CHAIN_RPC));
const adminAccount = chain.eth.accounts.privateKeyToAccount("0x" + crypto.createHash("sha256").update(process.env.ADMIN_KEY).digest("hex"));
const contractInstance = new chain.eth.Contract(
	JSON.parse(fs.readFileSync(process.env.CONTRACT_ABI_PATH, "utf-8")),
	fs.readFileSync(process.env.CONTRACT_ADDRESS_PATH, "utf-8")
);

export {
	chain,
	contractInstance,
	adminAccount,
};

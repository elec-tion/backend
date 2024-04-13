const { Web3 } = require('web3');
const fs = require("fs");

const chain = new Web3(process.env.CHAIN_RPC);
const contractInstance = new chain.eth.Contract(
    JSON.parse(fs.readFileSync("../contract/build/ElectionContract.abi","utf-8")),
    "0x71898C4fe73046Db90C2EcB56d98c5FD27fd4058"
  );

module.exports = {chain, contractInstance, Web3};


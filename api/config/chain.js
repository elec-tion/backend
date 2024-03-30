const { Web3 } = require('web3');

const chain = new Web3(process.env.CHAIN_RPC);

module.exports = {chain, Web3};
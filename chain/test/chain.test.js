const chai = require('chai');
const fs = require('fs');
const { chain, contractInstance, adminAccount } = require('../index.js');

describe('Web3 Connection', function() {
    it('should connect to the blockchain', async function() {
        const accounts = await chain.eth.getAccounts();
        chai.expect(accounts).to.be.an('array').that.is.not.empty;
    });

    it('should get the current block number', async function() {
        const blockNumber = await chain.eth.getBlockNumber();
        chai.expect(blockNumber).to.be.a('bigint');
        chai.expect(parseInt(blockNumber)).to.be.above(0);
    });
});

describe('Contract Instance', function() {
    it('should be that the address deploying the contract matches the address of the contract admin', async function() {
        const contractAdmin = await contractInstance.methods.admin().call();
        chai.expect(contractAdmin).to.equal(adminAccount.address);
    });

    it('should throw an error if ABI location is not defined', function() {
        delete process.env.CONTRACT_ABI_PATH;

        chai.expect(() => {
            contractInstance = new chain.eth.Contract(
                JSON.parse(fs.readFileSync(process.env.CONTRACT_ABI_PATH, 'utf-8')),
                fs.readFileSync(process.env.CONTRACT_ADDRESS_PATH, 'utf-8')
            );
        }).to.throw();
    });

    it('should throw an error if contract address location is not defined', function() {
        delete process.env.CONTRACT_ADDRESS_PATH;

        chai.expect(() => {
            contractInstance = new chain.eth.Contract(
                JSON.parse(fs.readFileSync(process.env.CONTRACT_ABI_PATH, 'utf-8')),
                fs.readFileSync(process.env.CONTRACT_ADDRESS_PATH, 'utf-8')
            );
        }).to.throw();
    });
});
import chai from 'chai';
const { expect } = chai;
import fs from 'fs';
import { chain, contractInstance, adminAccount } from '../index.js';

describe('Web3 Connection', function() {
    it('should connect to the blockchain', async function() {
        const accounts = await chain.eth.getAccounts();
        expect(accounts).to.be.an('array').that.is.not.empty;
    });

    it('should get the current block number', async function() {
        const blockNumber = await chain.eth.getBlockNumber();
        expect(blockNumber).to.be.a('bigint');
        expect(parseInt(blockNumber)).to.be.above(0);
    });
});

describe('Contract Instance', function() {
    it('should be same Contract admin and the account used to deploy the contract', async function() {
        const contractAdmin = await contractInstance.methods.admin().call();
        expect(contractAdmin).to.equal(adminAccount.address);
    });
    it('should throw an error if ABI location is not defined', function() {
        delete process.env.CONTRACT_ABI_PATH;

        expect(() => {
            contractInstance = new chain.eth.Contract(
                JSON.parse(fs.readFileSync(process.env.CONTRACT_ABI_PATH, 'utf-8')),
                fs.readFileSync(process.env.CONTRACT_ADDRESS_PATH, 'utf-8')
            );
        }).to.throw();
    });

    it('should throw an error if contract address location is not defined', function() {
        delete process.env.CONTRACT_ADDRESS_PATH;

        expect(() => {
            contractInstance = new chain.eth.Contract(
                JSON.parse(fs.readFileSync(process.env.CONTRACT_ABI_PATH, 'utf-8')),
                fs.readFileSync(process.env.CONTRACT_ADDRESS_PATH, 'utf-8')
            );
        }).to.throw();
    });
});
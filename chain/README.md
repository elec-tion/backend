# Chain Library

This library for connecting to the e-lection blockchain.

## Pre-requisites for testing

- Install Node.js packages and mocha
	```bash	
	$ npm install
	$ npm install -g mocha
	```

### Create a `.env` file

Create a `.env` file in the root directory of the project and add the following content:
```bash
$ cp .env.example .env
```

Fill in the values for the following variables in the `.env` file:
```env
CHAIN_RPC=http://<IP>:8545
ADMIN_KEY=<KEY_TO_CREATE_PRIVATE_KEY>
CONTRACT_ABI_PATH=../contract/build/ElectionContract.abi # don't need to change if you follow the default contract build path
CONTRACT_ADDRESS_PATH=../contract/build/ElectionContract.address # don't need to change if you follow the default contract build path
```
*`ADMIN_KEY` should be the same with in the contract `.env` file*

## Run the tests with Mocha

```bash
$ npm run test
```
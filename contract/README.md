# Contract Development

## Usage

### Pre-requisites

- Install Node.js packages
	```bash	
	$ npm install
	$ npm install -g hardhat
	$ npm install -g mocha
	```

- Create a `.env` file
	Create a `.env` file in the root directory of the project and add the following content:
	```bash
	$ cp .env.example .env
	```

	Fill in the values for the following variables in the `.env` file:
	```env
	CHAIN_RPC=http://<IP>:8545
	ADMIN_KEY=<KEY_TO_CREATE_PRIVATE_KEY>
	BUILD_PATH=./build # don't need to change if you follow the default contract build path
	CONTRACT_SOURCE_PATH=./src # don't need to change if you follow the default contract build path
	CONTRACT_FILENAME=Election.sol # don't need to change if you follow the default contract build path
	CONTRACT_NAME=ElectionContract # don't need to change if you follow the default contract build path
	```
	*`ADMIN_KEY` should be the same with in the contract `.env` file*

## Compile

Should be run in `./contract` directory.

```bash
$ npm run compile
```

## Deploy

```bash
$ npm run deploy
```

## Run Hardhat tests

Need to run Hardhat node first.

```bash
$ npm run hardhat:node
```

Then compile contract and deploy to Hardhat.
```bash
$ npm run hardhat:compile
$ npm run hardhat:deploy
```

Finally, run Hardhat tests.
```bash
$ npm run hardhat:test
```
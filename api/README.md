# API

## Usage

### Pre-requisites

- Compiled and deployed the contract before running the API. You can follow the instructions in the [Contract](../contract/README.md) documentation.

- Install Node.js packages, nodemon and mocha
	```bash	
	$ npm install
	$ npm install -g nodemon
	$ npm install -g mocha
	```

- Create a `.env` file
	Create a `.env` file in the root directory of the project and add the following content:
	```bash
	$ cp .env.example .env
	```

	Fill in the values for the following variables in the `.env` file:
	```env
	IP=<LOCAL_IP>
	PORT=<PORT_NUMBER>
	CHAIN_RPC=http://<IP>:8545
	ADMIN_KEY=<KEY_TO_CREATE_PRIVATE_KEY>
	CONTRACT_ABI_PATH=../contract/build/ElectionContract.abi # don't need to change if you follow the default contract build path
	CONTRACT_ADDRESS_PATH=../contract/build/ElectionContract.address # don't need to change if you follow the default contract build path
	```
	*`ADMIN_KEY` should be the same with in the contract `.env` file*

## Without Docker
### Run the API with Nodemon

```bash
$ npm run server
```

### Run the API with Node.js

```bash
$ npm run start
```

## Test
### Run the tests with Mocha

```bash
$ npm run test
```

## Docker
### Docker Compose

1. Edit the `docker-compose.yml` file for port mapping.

2. Copy needed files to the `api/docker` directory
```bash
$ cp ../.env .
$ cp ../../contract/build/ElectionContract.address .
$ cp ../../contract/build/ElectionContract.abi .
```

3. Now you need to change the `api/docker/.env` file with the correct values for `CONTRACT_ABI_PATH` and `CONTRACT_ADDRESS_PATH`
```env
CONTRACT_ABI_PATH=/app/docker/ElectionContract.abi
CONTRACT_ADDRESS_PATH=/app/docker/ElectionContract.address
```

2. Run the Docker Compose file
```bash
$ docker-compose up -d
```
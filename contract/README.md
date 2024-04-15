# Contract Development

## Pre-requisites

- VS Code
- VS Code Extension: Prettier - Code formatter
- Install Node.js packages
    ```bash	
    $ npm install
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

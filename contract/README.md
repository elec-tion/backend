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

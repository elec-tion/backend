# Contract

## Pre-requisites

### Install Node.js packages
```bash	
npm install
```

### Create a `.env` file

Create a `.env` file in the root directory of the project and add the following content:
```bash
cp .env.example .env
```

Fill in the values for the following variables in the `.env` file:
```env
CHAIN_RPC=http://<IP>:8545
ADMIN_KEY=<KEY_TO_CREATE_PRIVATE_KEY>
ADMIN_PRIVATE_KEY=<PRIVATE_KEY_CREATED_FROM_KEY>
ADMIN_ADDRESS=<WALLET_ADDRESS_CREATED_FROM_PRIVATE_KEY>
```

## Compile

```bash
npm run compile
```

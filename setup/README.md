# e-lection backend setup

## Standalone server

1. First apply `contract/README.md`
2. Then apply `chain/README.md`
3. Finally apply `api/README.md`

## Docker server

1. Create a `.env` file for every modules.
```env
ADMIN_KEY=<KEY_TO_CREATE_PRIVATE_KEY>
BUILD_PATH=../contract/build
CHAIN_RPC=http://<IP>:8545
CONTRACT_SOURCE_PATH=../contract/src
CONTRACT_ABI_PATH=../contract/build/ElectionContract.abi # don't need to change if you follow the default contract build path
CONTRACT_ADDRESS_PATH=../contract/build/ElectionContract.address # don't need to change if you follow the default contract build path
CONTRACT_FILENAME=Election.sol
CONTRACT_NAME=ElectionContract
IP=<LOCAL_IP> # local ip 192.168.21.2, 0.0.0.0, localhost or 127.0.0.1
PORT=<PORT_NUMBER>
```

2. Run docker compose file with build argument
```bash
$ docker-compose up -d --force-recreate --build
```
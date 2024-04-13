// This code will compile smart contract and generate its ABI and bytecode
// Alternatively, you can use something like `npm i solc && npx solcjs MyContract.sol --bin --abi`

import solc from 'solc';
import path from 'path';
import fs from 'fs';

const fileName = 'Election.sol';
const contractName = 'ElectionContract';

// Read the Solidity source code from the file system
const contractPath = path.join('./src', fileName);
const sourceCode = fs.readFileSync(contractPath, 'utf8');

// solc compiler config
const input = {
	language: 'Solidity',
	sources: {
		[fileName]: {
			content: sourceCode,
		},
	},
	settings: {
		outputSelection: {
			'*': {
				'*': ['*'],
			},
		},
	},
};

// Compile the Solidity code using solc
const compiledCode = JSON.parse(solc.compile(JSON.stringify(input)));

// Get the bytecode from the compiled contract
const bytecode = compiledCode.contracts[fileName][contractName].evm.bytecode.object;

// Write the bytecode to a new file
const bytecodePath = path.join('./build', contractName+'.bytecode');
fs.writeFileSync(bytecodePath, bytecode, 'utf-8');

// Log the compiled contract code to the console
console.log('Contract Bytecode in:', bytecodePath);

// Get the ABI from the compiled contract
const abi = compiledCode.contracts[fileName][contractName].abi;

// Write the Contract ABI to a new file
const abiPath = path.join('./build', contractName+'.abi');
fs.writeFileSync(abiPath, JSON.stringify(abi, null, 4), 'utf-8');

// Log the Contract ABI to the console
console.log('Contract ABI in:', abiPath);
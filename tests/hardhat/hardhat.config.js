require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	solidity: "0.8.19",
	paths: {
		root: "../../",
		sources: "./contract/src",
		tests: "./tests/hardhat/src",
		cache: "./tests/hardhat/cache",
		artifacts: "./tests/hardhat/artifacts",
	},
	settings: {
		optimizer: {
			enabled: true,
			runs: 100,
		},
	},
	networks: {
		hardhat: {
			allowUnlimitedContractSize: true,
		},
	},
};

require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	solidity: "0.8.19",
	paths: {
		root: "../../",
		sources: "./src",
		tests: "./test/hardhat/src",
		cache: "./test/hardhat/cache",
		artifacts: "./test/hardhat/artifacts",
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

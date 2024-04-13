const { ethers } = require("hardhat");

async function main() {
	try {
		const [deployer] = await ethers.getSigners();

		console.log("Deploying contracts with the account:", deployer.address);

		const ElectionContract = await ethers.getContractFactory("ElectionContract");
		const electionContract = await ElectionContract.deploy();

		console.log("ElectionContract deployed to:", electionContract.target);
	} catch (error) {
		console.error("Error deploying contracts:", error);
	}
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});

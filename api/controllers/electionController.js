const { chain, adminAccount, contractInstance } = require("../config/chain.js");
const { exit } = require("process");
const asyncHandler = require("express-async-handler");

// @route POST /api/election/:name/:startDate/:endDate
// @access private
const createElection = asyncHandler(async (req, res) => {
	// Create raw transaction
	let rawTx = {
		from: adminAccount.address,
		to: contractInstance.options.address,
		data: contractInstance.methods.createElection(req.params.name, req.params.startDate, req.params.endDate).encodeABI(),
	};

	// estimate gas
	const gasEstimate = await chain.eth.estimateGas(rawTx).catch((err) => {
		console.error("Error estimating gas:", err);
		exit(1); // Exit the process if there's an error
	});

	// convert gas estimate and set gas limit, gas price
	const _gasLimit = chain.utils.numberToHex(gasEstimate);
	rawTx.gasLimit = _gasLimit;
	rawTx.gasPrice = "0x0";

	// sign transaction
	const signedTx = await adminAccount.signTransaction(rawTx);

	// send transaction
	const txr = await chain.eth.sendSignedTransaction(signedTx.rawTransaction);

	console.log("createElection", txr);
	// TODO: return created election details
	// getElectionDetails(getElectionsLength());
	res.status(200).json({ success: 1 });
});

// @route GET /api/election/:id
// @access private
const getElectionDetails = asyncHandler(async (req, res) => {
	console.log("getElectionDetails", BigInt(req.params.id), parseInt(req.params.id), Number(req.params.id));

	const fCall = await contractInstance.methods.getElectionDetails(Number(req.params.id)).call();

	res.status(200).json({
		id: fCall.id,
		name: fCall.name,
		districtIDs: fCall.districtIDs,
		candidateAddresses: fCall.candidateAddresses,
		electionCommittee: fCall.electionCommittee,
		startDate: fCall.startDate,
		endDate: fCall.endDate,
	});
});

// @route GET /api/election
// @access private
const getElectionsLength = asyncHandler(async (req, res) => {
	const fCall = await contractInstance.methods.getElectionsLength().call();

	console.log(fCall);
	res.status(200).json({
		length: Number(fCall),
	});
});

// @route DELETE /api/election/:id
// @access private
const removeElection = asyncHandler(async (req, res) => {
	// Create raw transaction
	let rawTx = {
		from: adminAccount.address,
		to: contractInstance.options.address,
		data: contractInstance.methods.removeElection(req.params.id).encodeABI(),
	};

	// estimate gas
	const gasEstimate = await chain.eth.estimateGas(rawTx).catch((err) => {
		console.error("Error estimating gas:", err);
		exit(1); // Exit the process if there's an error
	});

	// convert gas estimate and set gas limit, gas price
	const _gasLimit = chain.utils.numberToHex(gasEstimate);
	rawTx.gasLimit = _gasLimit;
	rawTx.gasPrice = "0x0";

	// sign transaction
	const signedTx = await adminAccount.signTransaction(rawTx);

	// send transaction
	const txr = await chain.eth.sendSignedTransaction(signedTx.rawTransaction);

	console.log("removeElection", txr);
	res.status(200).json({ success: 1 });
});

module.exports = {
	getElectionDetails,
	getElectionsLength,
	createElection,
	removeElection,
};

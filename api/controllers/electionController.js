const { chain, adminAccount, contractInstance } = require("../config/chain.js");
const asyncHandler = require("express-async-handler");
contractInstance.handleRevert = true;

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
		res.status(500).json({ success: 0 });
		return;
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
	console.log("getElectionDetails");

	const fCall = await contractInstance.methods.getElectionDetails(req.params.id).call();

	res.status(200).json({
		id: Number(fCall.id),
		name: fCall.name,
		districtIDs: fCall.districtIDs,
		candidateAddresses: fCall.candidateAddresses,
		electionCommittee: fCall.electionCommittee,
		startDate: Number(fCall.startDate),
		endDate: Number(fCall.endDate)
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
		res.status(500).json({ success: 0 });
		return;
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

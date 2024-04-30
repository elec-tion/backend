const { chain, adminAccount, contractInstance } = require("../../chain");
const { serialize } = require("../utils");

const asyncHandler = require("express-async-handler");
const uuid = require("uuid");

// @route POST /api/election/:name/:startDate/:endDate
// @access private
const createElection = asyncHandler(async (req, res) => {
	// Create UUID for election
	const _id = uuid.v4();

	// Create raw transaction
	let rawTx = {
		from: adminAccount.address,
		to: contractInstance.options.address,
		data: contractInstance.methods.createElection(req.params.name, req.params.startDate, req.params.endDate, _id).encodeABI(),
	};

	// estimate gas
	const gasEstimate = await chain.eth.estimateGas(rawTx).catch((err) => {
		console.error("Error estimating gas:", err);
		res.status(500).json({ success: 0 });
	});

	// convert gas estimate and set gas limit, gas price
	const _gasLimit = chain.utils.numberToHex(gasEstimate);
	rawTx.gasLimit = _gasLimit;
	rawTx.gasPrice = "0x0";

	// sign transaction
	const signedTx = await adminAccount.signTransaction(rawTx).catch((err) => {
		console.error("Error signing transaction:", err);
		res.status(500).json({ success: 0 });
	});

	// send transaction
	const txr = await chain.eth.sendSignedTransaction(signedTx.rawTransaction).catch((err) => {
		console.error("Error sending transaction:", err);
		res.status(500).json({ success: 0 });
	});

	// transaction receipt converter
	const _txr = serialize(txr);

	// TODO: return created election details
	// getElectionDetails(getElectionsLength());
	res.status(200).json({ success: 1, id: _id, txr: _txr });
});

// @route GET /api/election/:id
// @access private
const getElectionDetails = asyncHandler(async (req, res) => {
	console.log("getElectionDetails");

	const fCall = await contractInstance.methods
		.getElectionDetails(req.params.id)
		.call()
		.catch((err) => {
			console.error("Error getting election details:", err);
			res.status(500).json({ success: 0 });
		});

	res.status(200).json({
		id: fCall.id,
		name: fCall.name,
		districtIDs: fCall.districtIDs,
		candidateAddresses: fCall.candidateAddresses,
		electionCommittee: fCall.electionCommittee,
		startDate: Number(fCall.startDate),
		endDate: Number(fCall.endDate),
	});
});

// @route GET /api/electionids
// @access private
const getElectionIDs = asyncHandler(async (req, res) => {
	console.log("getElectionIDs");

	const fCall = await contractInstance.methods
		.getElectionIDs()
		.call()
		.catch((err) => {
			console.error("Error getting election IDs:", err);
			res.status(500).json({ success: 0 });
		});

	res.status(200).json({
		ids: fCall,
	});
});

// @route GET /api/election
// @access private
const getElectionsLength = asyncHandler(async (req, res) => {
	const fCall = await contractInstance.methods
		.getElectionsLength()
		.call()
		.catch((err) => {
			console.error("Error calling getElectionsLength:", err);
			res.status(500).json({ success: 0 });
		});

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
	});

	// convert gas estimate and set gas limit, gas price
	const _gasLimit = chain.utils.numberToHex(gasEstimate);
	rawTx.gasLimit = _gasLimit;
	rawTx.gasPrice = "0x0";

	// sign transaction
	const signedTx = await adminAccount.signTransaction(rawTx).catch((err) => {
		console.error("Error signing transaction:", err);
		res.status(500).json({ success: 0 });
	});

	// send transaction
	const txr = await chain.eth.sendSignedTransaction(signedTx.rawTransaction).catch((err) => {
		console.error("Error sending transaction:", err);
		res.status(500).json({ success: 0 });
	});

	// transaction receipt converter
	const _txr = serialize(txr);

	console.log("removeElection", txr);
	res.status(200).json({ success: 1, txr: _txr });
});

module.exports = {
	getElectionDetails,
	getElectionsLength,
	createElection,
	removeElection,
	getElectionIDs,
};

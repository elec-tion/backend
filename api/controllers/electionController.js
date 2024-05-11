const { chain, adminAccount, contractInstance } = require("../../chain");
const { serialize } = require("../utils");
const logger = require("../utils");

const asyncHandler = require("express-async-handler");
const uuid = require("uuid");

// @route POST /api/election/:name/:startDate/:endDate
// @access private
const createElection = asyncHandler(async (req, res) => {
	logger.info("Calling createElection..");

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
		logger.error(err, "Error estimating gas:");
		res.status(500).json({ success: 0 });
	});

	// convert gas estimate and set gas limit, gas price
	const _gasLimit = chain.utils.numberToHex(gasEstimate);
	rawTx.gasLimit = _gasLimit;
	rawTx.gasPrice = "0x0";

	// sign transaction
	const signedTx = await adminAccount.signTransaction(rawTx).catch((err) => {
		logger.error(err, "Error signing transaction:");
		res.status(500).json({ success: 0 });
	});

	// send transaction
	const txr = await chain.eth.sendSignedTransaction(signedTx.rawTransaction).catch((err) => {
		logger.error(err, "Error sending transaction:");
		res.status(500).json({ success: 0 });
	});

	// transaction receipt converter
	const _txr = serialize(txr);

	logger.info("createElection succeeded");
	logger.info("Election details:");
	res.status(200).json({ success: 1, id: _id, txr: _txr });
});


// @route PATCH /api/election/:id/:name/:startDate/:endDate
// @access private
const editElection = asyncHandler(async (req, res) => {
	logger.info("Calling editElection..");

	// Create raw transaction
	let rawTx = {
		from: adminAccount.address,
		to: contractInstance.options.address,
		data: contractInstance.methods.editElection(req.params.name, req.params.startDate, req.params.endDate, req.params.id).encodeABI(),
	};

	// estimate gas
	const gasEstimate = await chain.eth.estimateGas(rawTx).catch((err) => {
		logger.error("Error estimating gas:", err);
		res.status(500).json({ success: 0 });
	});

	// convert gas estimate and set gas limit, gas price
	const _gasLimit = chain.utils.numberToHex(gasEstimate);
	rawTx.gasLimit = _gasLimit;
	rawTx.gasPrice = "0x0";

	// sign transaction
	const signedTx = await adminAccount.signTransaction(rawTx).catch((err) => {
		logger.error("Error signing transaction:", err);
		res.status(500).json({ success: 0 });
	});

	// send transaction
	const txr = await chain.eth.sendSignedTransaction(signedTx.rawTransaction).catch((err) => {
		logger.error("Error sending transaction:", err);
		res.status(500).json({ success: 0 });
	});

	// transaction receipt converter	
	const _txr = serialize(txr);
	logger.info("editElection succeeded");
	logger.info(_txr, "editElection transaction receipt: ");

	res.status(200).json({ success: 1, txr: _txr });
});

// @route GET /api/election/:id
// @access private
const getElectionDetails = asyncHandler(async (req, res) => {
	logger.info("Calling getElectionDetails..");
	logger.info(req.params.id);
	// let body = getElectionDetailsEB(req.params.id);
	// logger.info(body);
	// if (body === null) {
	// 	res.status(500).json({ success: 0 });
	// } else {
	// 	res.status(200).json(body);
	// }
	const fCall = await contractInstance.methods
		.getElectionDetails(req.params.id)
		.call()
		.catch((err) => {
			logger.error(err, "Error getting election details:");
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
	logger.info("Calling getElectionIDs..");

	const fCall = await contractInstance.methods
		.getElectionIDs()
		.call()
		.catch((err) => {
			logger.error(err, "Error getting election IDs:");
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
			logger.error(err, "Error calling getElectionsLength:");
			res.status(500).json({ success: 0 });
		});

	logger.info(`fCall: ${fCall}`);
	res.status(200).json({
		length: Number(fCall),
	});
});

// @route DELETE /api/election/:id
// @access private
const removeElection = asyncHandler(async (req, res) => {
	logger.info("Calling removeElection..");

	// Create raw transaction
	let rawTx = {
		from: adminAccount.address,
		to: contractInstance.options.address,
		data: contractInstance.methods.removeElection(req.params.id).encodeABI(),
	};

	// estimate gas
	const gasEstimate = await chain.eth.estimateGas(rawTx).catch((err) => {
		logger.error(err, "Error estimating gas:");
		res.status(500).json({ success: 0 });
	});

	// convert gas estimate and set gas limit, gas price
	const _gasLimit = chain.utils.numberToHex(gasEstimate);
	rawTx.gasLimit = _gasLimit;
	rawTx.gasPrice = "0x0";

	// sign transaction
	const signedTx = await adminAccount.signTransaction(rawTx).catch((err) => {
		logger.error(err, "Error signing transaction:");
		res.status(500).json({ success: 0 });
	});

	// send transaction
	const txr = await chain.eth.sendSignedTransaction(signedTx.rawTransaction).catch((err) => {
		logger.error(err, "Error sending transaction:");
		res.status(500).json({ success: 0 });
	});

	// transaction receipt converter
	const _txr = serialize(txr);

	logger.info("removeElection succeeded");
	logger.info(_txr, "removeElection transaction receipt:");
	res.status(200).json({ success: 1, txr: _txr });
});

module.exports = {
	getElectionDetails,
	getElectionsLength,
	createElection,
	editElection,
	removeElection,
	getElectionIDs,
};

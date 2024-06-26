const { chain, adminAccount, contractInstance } = require("../../chain");
const asyncHandler = require("express-async-handler");
const { serialize } = require("../utils");
const logger = require("../utils");

// @route POST /api/committeemember/:adddr/:name
// @access private
const addElectionCommitteeMember = asyncHandler(async (req, res) => {
	logger.info("Calling addElectionCommitteeMember..");

	// Create raw transaction
	let rawTx = {
		from: adminAccount.address,
		to: contractInstance.options.address,
		data: contractInstance.methods.addElectionCommitteeMember(req.params.addr, req.params.name).encodeABI(),
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

	logger.info("addElectionCommitteeMember succeeded");
	logger.info(_txr, "addElectionCommitteeMember transaction receipt: ");
	res.status(200).json({ success: 1, txr: _txr });
});

// @route POST /api/committeemember/:addr/:elecId
// @access private
const addElectionCommitteeMemberToElection = asyncHandler(async (req, res) => {
	logger.info("Calling addElectionCommitteeMemberToElection..");

	// Create raw transaction
	let rawTx = {
		from: adminAccount.address,
		to: contractInstance.options.address,
		data: contractInstance.methods.addElectionCommitteeMemberToElection(req.params.addr, req.params.elecId).encodeABI(),
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

	logger.info("addElectionCommitteeMemberToElection succeeded");
	logger.info(_txr, "addElectionCommitteeMemberToElection transaction receipt: ");
	res.status(200).json({ success: 1, txr: _txr });
});

// @route DELETE /api/committeemember/:adddr/:elecId
// @access private
const removeElectionCommitteeMemberFromElection = asyncHandler(async (req, res) => {
	logger.info("Calling removeElectionCommitteeMemberFromElection..");

	// Create raw transaction
	let rawTx = {
		from: adminAccount.address,
		to: contractInstance.options.address,
		data: contractInstance.methods.removeElectionCommitteeMemberFromElection(req.params.addr, req.params.elecId).encodeABI(),
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

	logger.info("removeElectionCommitteeMemberFromElection succeeded");
	logger.info(_txr, "removeElectionCommitteeMemberFromElection transaction receipt: ");
	res.status(200).json({ success: 1, txr: _txr });
});

// @route DELETE /api/committeemember/:adddr
// @access private
const removeElectionCommitteeMember = asyncHandler(async (req, res) => {
	logger.info("Calling removeElectionCommitteeMember..");

	// Create raw transaction
	let rawTx = {
		from: adminAccount.address,
		to: contractInstance.options.address,
		data: contractInstance.methods.removeElectionCommitteeMember(req.params.addr).encodeABI(),
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

	logger.info("removeElectionCommitteeMember succeeded");
	logger.info(_txr, "removeElectionCommitteeMember transaction receipt: ");
	res.status(200).json({ success: 1, txr: _txr });
});

// @route GET /api/committeemember/:addr
// @access private
const getElectionCommitteeMemberDetails = asyncHandler(async (req, res) => {
	logger.info("Calling getElectionCommitteeMemberDetails..");

	try {
		const fCall = await contractInstance.methods.getElectionCommitteeMemberDetails(req.params.addr).call();
		logger.info("getElectionCommitteeMemberDetails succeeded");
		res.status(200).json({
			id: Number(fCall.id),
			name: fCall.name,
			wallet: fCall.wallet,
		});
	} catch (err) {
		logger.error(err, "Error calling getElectionCommitteeMemberDetails:");
		res.status(500).json({ success: 0 });
	}
});

module.exports = {
	addElectionCommitteeMember,
	addElectionCommitteeMemberToElection,
	removeElectionCommitteeMemberFromElection,
	removeElectionCommitteeMember,
	getElectionCommitteeMemberDetails,
};

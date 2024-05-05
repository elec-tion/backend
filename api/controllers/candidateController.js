const { chain, adminAccount, contractInstance } = require("../../chain");
const asyncHandler = require("express-async-handler");
const { serialize} = require("../utils");
const logger = require("../utils");


// @route POST /api/candidate/:name/:districtId/:addr
// @access private
const addCandidate = asyncHandler(async (req, res) => {
	// Create raw transaction
	let rawTx = {
		from: adminAccount.address,
		to: contractInstance.options.address,
		data: contractInstance.methods.addCandidate(req.params.name, req.params.districtId, req.params.addr).encodeABI(),
	};

	// estimate gas
	const gasEstimate = await chain.eth
		.estimateGas(rawTx)
		.catch((err) => {
			logger.error(`Error estimating gas: ${err}`);
			res.status(500).json({ success: 0 });
		});

	// convert gas estimate and set gas limit, gas price
	const _gasLimit = chain.utils.numberToHex(gasEstimate);
	rawTx.gasLimit = _gasLimit;
	rawTx.gasPrice = "0x0";

	if (gasEstimate === undefined) {
		// Handle the case when gas estimate is undefined
		logger.error('Gas estimate is undefined');
		res.status(500).json({ success: 0 });
	} else {
		// sign transaction
	const signedTx = await adminAccount
		.signTransaction(rawTx)
		.catch((err) => {
			logger.error("Error signing transaction:", err);
			res.status(500).json({ success: 0 });
		});
			// send transaction
	const txr = await chain.eth
		.sendSignedTransaction(signedTx.rawTransaction)
		.catch((err) => {
			logger.error("Error sending transaction:", err);
			res.status(500).json({ success: 0 });
		});

	// transaction receipt converter
	const _txr = serialize(txr);
	
	logger.log("addCandidate", txr);
	res.status(200).json({ success: 1, txr: _txr });
	}
	



});

// @route GET /api/candidate/:addr
// @access private
const getCandidate = asyncHandler(async (req, res) => {
	const candidate = await contractInstance.methods
		.getCandidateDetails(req.params.addr)
		.call()
		.catch((err) => {
			logger.error("Error getting candidate details:", err);
			res.status(500).json({ success: 0 });
		});

	logger.log("getCandidate");
	res.status(200).json({
		name: candidate.name,
		wallet: candidate.wallet,
		district: {
			id: candidate.district.districtID,
			name: candidate.district.name,
		},
	});
});

// @route POST /api/candidate/:elecId/:addr
// @access private
const addCandidateToElection = asyncHandler(async (req, res) => {
	// Create raw transaction
	let rawTx = {
		from: adminAccount.address,
		to: contractInstance.options.address,
		data: contractInstance.methods.addCandidateToElection(req.params.elecId, req.params.addr).encodeABI(),
	};

	// estimate gas
	const gasEstimate = await chain.eth
		.estimateGas(rawTx)
		.catch((err) => {
			logger.error("Error estimating gas:", err);
			res.status(500).json({ success: 0 });
		});

	// convert gas estimate and set gas limit, gas price
	const _gasLimit = chain.utils.numberToHex(gasEstimate);
	rawTx.gasLimit = _gasLimit;
	rawTx.gasPrice = "0x0";

	// sign transaction
	const signedTx = await adminAccount
		.signTransaction(rawTx)
		.catch((err) => {
			logger.error("Error signing transaction:", err);
			res.status(500).json({ success: 0 });
		});

	// send transaction
	const txr = await chain.eth
		.sendSignedTransaction(signedTx.rawTransaction)
		.catch((err) => {
			logger.error("Error sending transaction:", err);
			res.status(500).json({ success: 0 });
		});

	// transaction receipt converter
	const _txr = serialize(txr);

	logger.log("addCandidateToElection", txr);
	res.status(200).json({ success: 1, txr: _txr });
});

// @route DELETE /api/candidate/:elecId/:addr
// @access private
const removeCandidateFromElection = asyncHandler(async (req, res) => {
	// Create raw transaction
	let rawTx = {
		from: adminAccount.address,
		to: contractInstance.options.address,
		data: contractInstance.methods.removeCandidateFromElection(req.params.elecId, req.params.addr).encodeABI(),
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
	const signedTx = await adminAccount
		.signTransaction(rawTx)
		.catch((err) => {
			logger.error("Error signing transaction:", err);
			res.status(500).json({ success: 0 });
		});

	// send transaction
	const txr = await chain.eth
		.sendSignedTransaction(signedTx.rawTransaction)
		.catch((err) => {
			logger.error("Error sending transaction:", err);
			res.status(500).json({ success: 0 });
		});

	// transaction receipt converter
	const _txr = serialize(txr);

	logger.log("removeCandidateFromElection", txr);
	res.status(200).json({ success: 1, txr: _txr });
});

// @route DELETE /api/candidate/:addr
// @access private
const removeCandidate = asyncHandler(async (req, res) => {
	// Create raw transaction
	let rawTx = {
		from: adminAccount.address,
		to: contractInstance.options.address,
		data: contractInstance.methods.removeCandidate(req.params.addr).encodeABI(),
	};

	// estimate gas
	const gasEstimate = await chain.eth
		.estimateGas(rawTx)
		.catch((err) => {
			logger.error("Error estimating gas:", err);
			res.status(500).json({ success: 0 });
		});

	// convert gas estimate and set gas limit, gas price
	const _gasLimit = chain.utils.numberToHex(gasEstimate);
	rawTx.gasLimit = _gasLimit;
	rawTx.gasPrice = "0x0";

	// sign transaction
	const signedTx = await adminAccount
		.signTransaction(rawTx)
		.catch((err) => {
			logger.error("Error signing transaction:", err);
			res.status(500).json({ success: 0 });
		});

	// send transaction
	const txr = await chain.eth
		.sendSignedTransaction(signedTx.rawTransaction)
		.catch((err) => {
			logger.error("Error sending transaction:", err);
			res.status(500).json({ success: 0 });
		});

	// transaction receipt converter
	const _txr = serialize(txr);

	logger.log("removeCandidate", txr);
	res.status(200).json({ success: 1, txr: _txr });
});

module.exports = {
	addCandidate,
	addCandidateToElection,
	getCandidate,
	removeCandidateFromElection,
	removeCandidate,
};


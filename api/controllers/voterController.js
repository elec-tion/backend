const { chain, adminAccount, contractInstance } = require("../../chain");
const asyncHandler = require("express-async-handler");
const { serialize } = require("../utils");
const logger = require("../utils");

// @route POST /api/voterwithelection/:addr/:elecId
// @access private
const addVoterToElection = asyncHandler(async (req, res) => {
	logger.info("Calling addVoterToElection..");

	// Create raw transaction
	let rawTx = {
		from: adminAccount.address,
		to: contractInstance.options.address,
		data: contractInstance.methods.addVoterToElection(req.params.addr, req.params.elecId).encodeABI(),
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

	logger.info("addVoterToElection succeeded");
	logger.info(_txr, "addVoterToElection transaction receipt: ");
	res.status(200).json({ success: 1, txr: _txr });
});

// @route POST /api/voterwithdistrict/:addr/:districtId
// @access private
const addDistrictToVoter = asyncHandler(async (req, res) => {
	logger.info("Calling addDistrictToVoter..");

	// Create raw transaction
	let rawTx = {
		from: adminAccount.address,
		to: contractInstance.options.address,
		data: contractInstance.methods.addDistrictToVoter(req.params.addr, req.params.districtId).encodeABI(),
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

	logger.info("addDistrictToVoter succeeded");
	logger.info(_txr, "addDistrictToVoter transaction receipt: ");
	res.status(200).json({ success: 1, txr: _txr });
});

// @route DELETE /api/voterwithdistrict/:addr/:districtId
// @access private
const removeDistrictFromVoter = asyncHandler(async (req, res) => {
	logger.info("Calling removeDistrictFromVoter..");

	// Create raw transaction
	let rawTx = {
		from: adminAccount.address,
		to: contractInstance.options.address,
		data: contractInstance.methods.removeDistrictFromVoter(req.params.addr, req.params.districtId).encodeABI(),
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

	logger.info("removeDistrictFromVoter succeeded");
	logger.info(_txr, "removeDistrictFromVoter transaction receipt: ");
	res.status(200).json({ success: 1, txr: _txr });
});

// @route DELETE /api/voterwithelection/:elecId/:addr
// @access private
const removeVoterFromElection = asyncHandler(async (req, res) => {
	logger.info("Calling removeVoterFromElection..");	

	// Create raw transaction
	let rawTx = {
		from: adminAccount.address,
		to: contractInstance.options.address,
		data: contractInstance.methods.removeVoterFromElection(req.params.elecId, req.params.addr).encodeABI(),
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

	logger.info("removeVoterFromElection succeeded");
	logger.info(_txr, "removeVoterFromElection");
	res.status(200).json({ success: 1, txr: _txr });
});

// @route DELETE /api/voter/:addr
// @access private
const removeVoter = asyncHandler(async (req, res) => {
	logger.info("Calling removeVoter..");

	// Create raw transaction
	let rawTx = {
		from: adminAccount.address,
		to: contractInstance.options.address,
		data: contractInstance.methods.removeVoter(req.params.addr).encodeABI(),
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

	logger.info("removeVoter succeeded");
	logger.info(_txr, "removeVoter transaction receipt: ");
	res.status(200).json({ success: 1, txr: _txr });
});

// @route GET /api/voter/:addr
// @access private
const getVoterDetails = asyncHandler(async (req, res) => {
	logger.info("Calling getVoterDetails..");

	const fCall = await contractInstance.methods
		.getVoterDetails(req.params.addr)
		.call({from: adminAccount.address})
		.catch((err) => {
			logger.error(err, "Error calling getDistrictDetails:");
			res.status(500).json({ success: 0 });
		});

	logger.info("getVoterDetails succeeded");
	logger.info("Voter details: ");
	res.status(200).json({
		district: {
			name: fCall.district.name,
			id: fCall.district.districtID
		},
		electionIDs: fCall.electionIDs
	});

});

module.exports = {
	addVoterToElection,
	addDistrictToVoter,
	removeDistrictFromVoter,
	removeVoterFromElection,
	removeVoter,
	getVoterDetails,
};

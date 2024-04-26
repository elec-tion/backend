const { chain, adminAccount, contractInstance } = require("../../chain");
const asyncHandler = require("express-async-handler");

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
			console.error("Error estimating gas:", err);
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
			console.error("Error signing transaction:", err);
			res.status(500).json({ success: 0 });
		});

	// send transaction
	const txr = await chain.eth
		.sendSignedTransaction(signedTx.rawTransaction)
		.catch((err) => {
			console.error("Error sending transaction:", err);
			res.status(500).json({ success: 0 });
		});

	console.log("addCandidate", txr);
	res.status(200).json({ success: 1, txr: txr });
});

// @route GET /api/candidate/:addr
// @access private
const getCandidate = asyncHandler(async (req, res) => {
	const candidate = await contractInstance.methods
		.getCandidateDetails(req.params.addr)
		.call()
		.catch((err) => {
			console.error("Error getting candidate details:", err);
			res.status(500).json({ success: 0 });
		});

	console.log("getCandidate");
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
			console.error("Error estimating gas:", err);
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
			console.error("Error signing transaction:", err);
			res.status(500).json({ success: 0 });
		});

	// send transaction
	const txr = await chain.eth
		.sendSignedTransaction(signedTx.rawTransaction)
		.catch((err) => {
			console.error("Error sending transaction:", err);
			res.status(500).json({ success: 0 });
		});

	console.log("addCandidateToElection", txr);
	res.status(200).json({ success: 1, txr: txr });
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
		console.error("Error estimating gas:", err);
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
			console.error("Error signing transaction:", err);
			res.status(500).json({ success: 0 });
		});

	// send transaction
	const txr = await chain.eth
		.sendSignedTransaction(signedTx.rawTransaction)
		.catch((err) => {
			console.error("Error sending transaction:", err);
			res.status(500).json({ success: 0 });
		});

	console.log("removeCandidateFromElection", txr);
	res.status(200).json({ success: 1, txr: txr });
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
			console.error("Error estimating gas:", err);
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
			console.error("Error signing transaction:", err);
			res.status(500).json({ success: 0 });
		});

	// send transaction
	const txr = await chain.eth
		.sendSignedTransaction(signedTx.rawTransaction)
		.catch((err) => {
			console.error("Error sending transaction:", err);
			res.status(500).json({ success: 0 });
		});

	console.log("removeCandidate", txr);
	res.status(200).json({ success: 1, txr: txr });
});

module.exports = {
	addCandidate,
	addCandidateToElection,
	getCandidate,
	removeCandidateFromElection,
	removeCandidate,
};

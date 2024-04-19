const { chain, adminAccount, contractInstance } = require('../../chain/index.js');
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

	console.log("addCandidate", txr);
	res.status(200).json({ success: 1 });
});

// @route GET /api/candidate/:addr
// @access private
const getCandidate = asyncHandler(async (req, res) => {
	const candidate = await contractInstance.methods.getCandidateDetails(req.params.addr).call();

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

	console.log("addCandidateToElection", txr);
	res.status(200).json({ success: 1 });
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

	console.log("removeCandidateFromElection", txr);
	res.status(200).json({ success: 1 });
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

	console.log("removeCandidate", txr);
	res.status(200).json({ success: 1 });
});

module.exports = {
	addCandidate,
	addCandidateToElection,
	getCandidate,
	removeCandidateFromElection,
	removeCandidate,
};

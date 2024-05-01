const { chain, adminAccount, contractInstance } = require("../../chain");
const asyncHandler = require("express-async-handler");
const { serialize } = require("../utils");

// @route POST /api/committeemember/:adddr/:name
// @access private
const addElectionCommitteeMember = asyncHandler(async (req, res) => {
	// Create raw transaction
	let rawTx = {
		from: adminAccount.address,
		to: contractInstance.options.address,
		data: contractInstance.methods.addElectionCommitteeMember(req.params.addr, req.params.name).encodeABI(),
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

	// transaction receipt converter
	const _txr = serialize(txr);

	console.log("addElectionCommitteeMember", txr);
	res.status(200).json({ success: 1, txr: _txr });
});

// @route POST /api/committeemember/:addr/:elecId
// @access private
const addElectionCommitteeMemberToElection = asyncHandler(async (req, res) => {
	// Create raw transaction
	let rawTx = {
		from: adminAccount.address,
		to: contractInstance.options.address,
		data: contractInstance.methods.addElectionCommitteeMemberToElection(req.params.addr, req.params.elecId).encodeABI(),
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

	// transaction receipt converter
	const _txr = serialize(txr);

	console.log("addElectionCommitteeMemberToElection", txr);
	res.status(200).json({ success: 1, txr: _txr });
});

// @route DELETE /api/committeemember/:adddr/:elecId
// @access private
const removeElectionCommitteeMemberFromElection = asyncHandler(async (req, res) => {
	// Create raw transaction
	let rawTx = {
		from: adminAccount.address,
		to: contractInstance.options.address,
		data: contractInstance.methods.removeElectionCommitteeMemberFromElection(req.params.addr, req.params.elecId).encodeABI(),
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

	// transaction receipt converter
	const _txr = serialize(txr);

	console.log("removeElectionCommitteeMemberFromElection", txr);
	res.status(200).json({ success: 1, txr: _txr });
});

// @route DELETE /api/committeemember/:adddr
// @access private
const removeElectionCommitteeMember = asyncHandler(async (req, res) => {
	// Create raw transaction
	let rawTx = {
		from: adminAccount.address,
		to: contractInstance.options.address,
		data: contractInstance.methods.removeElectionCommitteeMember(req.params.addr).encodeABI(),
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

	// transaction receipt converter
	const _txr = serialize(txr);

	console.log("removeElectionCommitteeMember", txr);
	res.status(200).json({ success: 1, txr: _txr });
});

// @route GET /api/committeemember/:addr
// @access private
const getElectionCommitteeMemberDetails = asyncHandler(async (req, res) => {
	const fCall = await contractInstance.methods
		.getElectionCommitteeMemberDetails(req.params.addr)
		.call()
		.catch((err) => {
			console.error("Error calling getElectionCommitteeMemberDetails:", err);
			res.status(500).json({ success: 0 });
		});

	res.status(200).json({
		id: Number(fCall.id),
		name: fCall.name,
		wallet: fCall.wallet,
	});
});

module.exports = {
	addElectionCommitteeMember,
	addElectionCommitteeMemberToElection,
	removeElectionCommitteeMemberFromElection,
	removeElectionCommitteeMember,
	getElectionCommitteeMemberDetails,
};

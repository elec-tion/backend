const { chain, adminAccount, contractInstance } = require("../config/chain.js");

const asyncHandler = require("express-async-handler");

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

	console.log("addElectionCommitteeMember", txr);
	res.status(200).json({ success: 1 });
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

	console.log("addElectionCommitteeMemberToElection", txr);
	res.status(200).json({ success: 1 });
});

// @route DELETE /api/committeemember/:adddr/:elecId
// @access private
const removeElectionCommitteeMemberFromElection = asyncHandler(async (req, res) => {
	// Create raw transaction
	let rawTx = {
		from: adminAccount.address,
		to: contractInstance.options.address,
		data: contractInstance.methods.removeElectionCommitteeMemberFromElection(req.params.addr,req.params.elecId).encodeABI(),
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

	console.log("removeElectionCommitteeMemberFromElection", txr);
	res.status(200).json({ success: 1 });
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

	console.log("removeElectionCommitteeMember", txr);
	res.status(200).json({ success: 1 });
});

module.exports = {
	addElectionCommitteeMember,
	addElectionCommitteeMemberToElection,
    removeElectionCommitteeMemberFromElection,
	removeElectionCommitteeMember,
};

const { chain, adminAccount, contractInstance } = require('../../chain/index.js');
const asyncHandler = require("express-async-handler");

// @route POST /api/district/:id/:name
// @access private
const addDistrict = asyncHandler(async (req, res) => {
	// Create raw transaction
	let rawTx = {
		from: adminAccount.address,
		to: contractInstance.options.address,
		data: contractInstance.methods.addDistrict(req.params.name, req.params.id).encodeABI(),
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

	console.log("addDistrict", txr);
	res.status(200).json({ success: 1 });
});

// @route GET /api/district/:id
// @access private
const getDistrict = asyncHandler(async (req, res) => {
	const fCall = await contractInstance.methods.getDistrictDetails(req.params.id).call();

	res.status(200).json({
		id: fCall.districtID,
		name: fCall.name,
	});
});

// @route PUT /api/district/:electionId/:districtId
// @access private
const addDistrictToElection = asyncHandler(async (req, res) => {
	// Create raw transaction
	let rawTx = {
		from: adminAccount.address,
		to: contractInstance.options.address,
		data: contractInstance.methods.addDistrictToElection(req.params.electionId, req.params.districtId).encodeABI(),
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

	console.log("addDistrictToElection", txr);
	res.status(200).json({ success: 1 });
});

// @route DELETE /api/district/:electionId/:districtId
// @access private
const removeDistrictFromElection = asyncHandler(async (req, res) => {
	// Create raw transaction
	let rawTx = {
		from: adminAccount.address,
		to: contractInstance.options.address,
		data: contractInstance.methods.removeDistrictFromElection(req.params.electionId, req.params.districtId).encodeABI(),
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

	console.log("removeDistrictFromElection", txr);
	res.status(200).json({ success: 1 });
});

// @route DELETE /api/district/:id
// @access private
const removeDistrict = asyncHandler(async (req, res) => {
	// Create raw transaction
	let rawTx = {
		from: adminAccount.address,
		to: contractInstance.options.address,
		data: contractInstance.methods.removeDistrict(req.params.id).encodeABI(),
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

	console.log("removeDistrict", txr);
	res.status(200).json({ success: 1 });
});

module.exports = {
	getDistrict,
	addDistrict,
	removeDistrict,
	addDistrictToElection,
	removeDistrictFromElection,
};

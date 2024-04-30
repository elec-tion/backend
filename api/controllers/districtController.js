const { chain, adminAccount, contractInstance } = require("../../chain");
const asyncHandler = require("express-async-handler");
const { serialize } = require("../utils");

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
		})

	// send transaction
	const txr = await chain.eth
		.sendSignedTransaction(signedTx.rawTransaction)
		.catch((err) => {
			console.error("Error sending transaction:", err);
			res.status(500).json({ success: 0 });
		});

	// transaction receipt converter
	const _txr = serialize(txr);

	console.log("addDistrict", txr);
	res.status(200).json({ success: 1, txr: _txr });
});

// @route GET /api/district/:id
// @access private
const getDistrict = asyncHandler(async (req, res) => {
	const fCall = await contractInstance.methods
		.getDistrictDetails(req.params.id)
		.call()
		.catch((err) => {
			console.error("Error calling getDistrictDetails:", err);
			res.status(500).json({ success: 0 });
		});

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

	console.log("addDistrictToElection", txr);
	res.status(200).json({ success: 1, txr: _txr });
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

	console.log("removeDistrictFromElection", txr);
	res.status(200).json({ success: 1, txr: _txr });
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

	console.log("removeDistrict", txr);
	res.status(200).json({ success: 1, txr: _txr });
});

module.exports = {
	getDistrict,
	addDistrict,
	removeDistrict,
	addDistrictToElection,
	removeDistrictFromElection,
};

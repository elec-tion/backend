const { chain, adminAccount, contractInstance } = require("../config/chain.js");
const { exit } = require("process");
const asyncHandler = require("express-async-handler");
contractInstance.handleRevert = true;

// @route GET /api/district
// @access private
const getDistrict = asyncHandler(async (req, res) => {
	const fCall = await contractInstance.methods.getDistrictDetails(req.params.id).call();

	res.status(200).json({
		id: fCall.districtID,
		name: fCall.name,
	});
});

// @route POST /api/district
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

	console.log("addDistrict", txr);
	res.status(200).json({ success: 1 });
});

module.exports = {
	getDistrict,
	addDistrict,
};
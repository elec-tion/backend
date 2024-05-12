const { chain, adminAccount, contractInstance } = require("../../chain");
const asyncHandler = require("express-async-handler");
const { serialize } = require("../utils");
const logger = require("../utils");

// @route GET /api/balance/:wallet_id
// @access private
const getBalance = asyncHandler(async (req, res) => {
	logger.info("Calling getBalance..");

	chain.eth
		.getBalance(req.params.wallet_id)
		.then((weiBalance) => {
			logger.info({addr: req.params.wallet_id, wei: weiBalance}, "balance succesfully retrieved.")
			res.status(200).json({ success: 1, balance: chain.utils.fromWei(weiBalance, "ether") });
		})
		.catch((error) => {
			logger.error(error, "Error getting balance: ");
			res.status(500).json({ success: 0 });
		});
	
});

module.exports = {
	getBalance,
};



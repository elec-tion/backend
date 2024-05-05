const { chain, adminAccount, contractInstance } = require("../../chain");
const asyncHandler = require("express-async-handler");
const logger = require("../utils");

// @route GET /api/balance/:wallet_id
// @access private
const getBalance = asyncHandler(async (req, res) => {
	chain.eth
		.getBalance(req.params.wallet_id)
		.then((weiBalance) => {
			res.status(200).json({ balance: chain.utils.fromWei(weiBalance, "ether") });
		})
		.catch((error) => {
			logger.error(`Error getting balance: ${error}`);
			res.status(500).json({ success: 0 });
		});
});


module.exports = {
	getBalance,
};



const { chain } = require("../config/chain.js");

const asyncHandler = require("express-async-handler");

// @route GET /api/balance/:wallet_id
// @access private
const getBalance = asyncHandler(async (req, res) => {
	let weiBalance = await chain.eth.getBalance(req.params.wallet_id);
	let ethBalance = chain.utils.fromWei(weiBalance, 'ether');
	res.status(200).json({ balance: ethBalance });
});


// @route PUT /api/balance/:wallet_id
// @access private
const updateBalance = asyncHandler(async (req, res) => {
	chain.eth.getBalance(req.params.wallet_id)
		.then(balance => {
			console.log(`Wallet ${wallet_id} exists on the node.`);
			console.log(`Balance: ${chain.utils.fromWei(balance, 'ether')} ETH`);
		})
		.catch(error => {
			console.error(`Error checking wallet existence: ${error}`);
		});

	// TODO: update function implementation
	res.status(200).json();
});

// // @route DELETE /api/bisiler/:id
// // @access private
// const deleteBisiler = asyncHandler(async (req, res) => {
//     res.status(200).json({ message: `Delete bisiler ${req.params.id}` });
// });

// // @route POST /api/bisiler
// // @access private
// const setBisiler = asyncHandler(async (req, res) => {
//     if (!req.body.text) {
//         res.status(400);
//         throw new Error("Please add a text field");
//     }
//     res.status(200).json({ message: "Set Bisiler" });
// });


module.exports = {
	getBalance,
	updateBalance,
};

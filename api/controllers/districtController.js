const { chain, contractInstance } = require("../config/chain.js");

const asyncHandler = require("express-async-handler");

// @route POST /api/district
// @access private
const addDistrict = asyncHandler(async (req, res) => {

  const x = await contractInstance.methods
    .addDistrict("Turkiye", "00")
    .send({
      from: "0x41aD2bc63A2059f9b623533d87fe99887D794847",
      gasPrice: "0x0",
      gasLimit: "0x24A22",
    });

  console.log(x);
  res.status(200).json({ success: 1 });
});

module.exports = {
  addDistrict,
};

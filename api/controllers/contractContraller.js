const { chain, adminAccount, contractInstance } = require("../../chain");
const asyncHandler = require("express-async-handler");
const { serialize } = require("../utils");
const logger = require("../utils");

// @route GET /api/contract/address
// @access private

const getContractAddress = asyncHandler(async (req, res) => {
    logger.info("Calling getContractAddress..");

    res.status(200).json({ 
        success: 1,
        address: contractInstance.options.address
    });
});

// @route GET /api/contract/abi
// @access private

const getContractAbi = asyncHandler(async (req, res) => {
    logger.info("Calling getContractAbi..");

    res.status(200).json({
        success: 1,
        abi: contractInstance.options.jsonInterface
    });

});

module.exports = {
    getContractAddress,
    getContractAbi
};
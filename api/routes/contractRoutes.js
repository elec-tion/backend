const express = require("express");
const router = express.Router();
const { 
    getContractAddress,
    getContractAbi    
} = require("../controllers/contractContraller");

router.route("/contract/address").get(getContractAddress);
router.route("/contract/abi").get(getContractAbi);

module.exports = router;
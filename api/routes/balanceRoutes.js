const express = require("express");
const router = express.Router();
const { getBalance, updateBalance } = require("../controllers/balanceController");

router.route("/balance/:wallet_id").get(getBalance).put(updateBalance);
module.exports = router;

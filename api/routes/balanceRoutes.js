const express = require("express");
const router = express.Router();
const { getBalance } = require("../controllers/balanceController");

router.route("/balance/:wallet_id").get(getBalance);
module.exports = router;

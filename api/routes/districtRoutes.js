const express = require("express");
const router = express.Router();
const { addDistrict } = require("../controllers/districtController");

router.route("/district/a").post(addDistrict);
module.exports = router;

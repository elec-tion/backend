const express = require("express");
const router = express.Router();
const { getDistrict, addDistrict } = require("../controllers/districtController");

router.route("/district/:id").get(getDistrict);
router.route("/district/:id/:name").post(addDistrict);
module.exports = router;

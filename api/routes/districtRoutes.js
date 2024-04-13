const express = require("express");
const router = express.Router();
const { getDistrict, addDistrict, removeDistrict, addDistrictToElection, removeDistrictFromElection } = require("../controllers/districtController");

router.route("/district/:id").get(getDistrict);
router.route("/district/:id/:name").post(addDistrict);
router.route("/district/:id").delete(removeDistrict);
router.route("/district/:electionId/:districtId").post(addDistrictToElection);
router.route("/district/:electionId/:districtId").delete(removeDistrictFromElection);

module.exports = router;

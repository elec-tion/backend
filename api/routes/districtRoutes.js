const express = require("express");
const router = express.Router();
const {
    getDistrict,
    addDistrict,
    removeDistrict,
    addDistrictToElection,
    removeDistrictFromElection
} = require("../controllers/districtController");

router.route("/district/:id/:name").post(addDistrict);
router.route("/district/:id").delete(removeDistrict);

router.route("/districtwithelection/:electionId/:districtId").post(addDistrictToElection);
router.route("/districtwithelection/:electionId/:districtId").delete(removeDistrictFromElection);

router.route("/district/:id").get(getDistrict);

module.exports = router;
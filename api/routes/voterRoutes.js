const express = require("express");
const router = express.Router();
const { 
    addVoterToElection,
    addDistrictToVoter,
    removeDistrictFromVoter,
    removeVoterFromElection,
    removeVoter
} = require("../controllers/voterController");

router.route("/voterwithdistrict/:addr/:districtId").post(addDistrictToVoter);
router.route("/voterwithdistrict/:addr/:districtId").delete(removeDistrictFromVoter);

router.route("/voter/:name/:addr/:elecId").post(addVoterToElection);
router.route("/voterwithelection/:elecId/:addr").delete(removeVoterFromElection);

router.route("/voter/:addr").delete(removeVoter);

module.exports = router;

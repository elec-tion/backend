const express = require("express");
const router = express.Router();
const {
    getElectionDetails,
    getElectionsLength,
    createElection,
    removeElection,
    getElectionIDs,
} = require("../controllers/electionController");

router.route("/election/:name/:startDate/:endDate").post(createElection);
router.route("/election/:id").delete(removeElection);

router.route("/election/:id").get(getElectionDetails);
router.route("/election").get(getElectionsLength);

router.route("/electionids").get(getElectionIDs);

module.exports = router;

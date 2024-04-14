const express = require("express");
const router = express.Router();
const {
    getElectionDetails,
    getElectionsLength,
    createElection,
    removeElection
} = require("../controllers/electionController");

router.route("/election/:name/:startDate/:endDate").post(createElection);
router.route("/election/:id").get(getElectionDetails);
router.route("/election").get(getElectionsLength);
router.route("/election/:id").delete(removeElection);

module.exports = router;

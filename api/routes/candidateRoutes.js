const express = require("express");
const router = express.Router();
const { addCandidate, addCandidateToElection, removeCandidateFromElection, removeCandidate } = require("../controllers/electionController");

router.route("/candidate/:name/:districtId/:addr").post(addCandidate);
router.route("/committeemember/:elecId/:addr").post(addCandidateToElection);
router.route("/committeemember/:elecId/:addr").delete(removeCandidateFromElection);
router.route("/candidate/:addr").delete(removeCandidate);

module.exports = router;

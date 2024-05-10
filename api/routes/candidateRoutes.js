const express = require("express");
const router = express.Router();
const { 
    addCandidate,
    addCandidateToElection,
    getCandidate,
    removeCandidateFromElection,
    removeCandidate
} = require("../controllers/candidateController");

router.route("/candidate/:name/:districtId/:addr").post(addCandidate);
router.route("/candidate/:addr").delete(removeCandidate);

router.route("/candidatewithelection/:elecId/:addr").post(addCandidateToElection);
router.route("/candidatewithelection/:elecId/:addr").delete(removeCandidateFromElection);

router.route("/candidate/:addr").get(getCandidate);

module.exports = router;
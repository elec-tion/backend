const express = require("express");
const router = express.Router();
const { addElectionCommitteeMember, addElectionCommitteeMemberToElection, removeElectionCommitteeMemberFromElection, removeElectionCommitteeMember } = require("../controllers/electionController");

router.route("/committeemember/:adddr/:name").post(addElectionCommitteeMember);
router.route("/committeemember/:addr/:elecId").post(addElectionCommitteeMemberToElection);
router.route("/committeemember/:addr/:elecId").delete(removeElectionCommitteeMemberFromElection);
router.route("/committeemember/:addr").delete(removeElectionCommitteeMember);

module.exports = router;

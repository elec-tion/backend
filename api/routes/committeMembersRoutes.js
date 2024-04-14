const express = require("express");
const router = express.Router();
const {
    addElectionCommitteeMember,
    addElectionCommitteeMemberToElection,
    removeElectionCommitteeMemberFromElection,
    removeElectionCommitteeMember
} = require("../controllers/committeeMembersController");

router.route("/committeemember/:adddr/:name").post(addElectionCommitteeMember);
router.route("/committeememberwithelection/:addr/:elecId").post(addElectionCommitteeMemberToElection);
router.route("/committeememberwithelection/:addr/:elecId").delete(removeElectionCommitteeMemberFromElection);
router.route("/committeemember/:addr").delete(removeElectionCommitteeMember);

module.exports = router;

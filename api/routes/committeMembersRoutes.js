const express = require("express");
const router = express.Router();
const {
    addElectionCommitteeMember,
    addElectionCommitteeMemberToElection,
    removeElectionCommitteeMemberFromElection,
    removeElectionCommitteeMember,
    getElectionCommitteeMemberLength,
    getElectionCommitteeMemberDetails,
} = require("../controllers/committeeMembersController");

router.route("/committeemember/:addr/:name").post(addElectionCommitteeMember);
router.route("/committeemember/:addr").delete(removeElectionCommitteeMember);

router.route("/committeememberwithelection/:addr/:elecId").post(addElectionCommitteeMemberToElection);
router.route("/committeememberwithelection/:elecId/:addr").delete(removeElectionCommitteeMemberFromElection);

router.route("/committeemember/:addr").get(getElectionCommitteeMemberDetails);
module.exports = router;

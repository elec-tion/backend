const chai = require("chai");
const sinon = require("sinon");
const dotenv = require("dotenv");
dotenv.config();

// tools for testing
const { chain, adminAccount, contractInstance } = require("../../chain");
const { voterAccounts, candidateAccounts, electionCommitteeAccounts } = require("./accounts.js");

// import controllers for testing
const { getBalance, updateBalance } = require("../controllers/balanceController");
const { addCandidate, addCandidateToElection, getCandidate, removeCandidateFromElection, removeCandidate } = require("../controllers/candidateController");
const { addElectionCommitteeMember, addElectionCommitteeMemberToElection, removeElectionCommitteeMemberFromElection, removeElectionCommitteeMember, getElectionCommitteeMemberLength, getElectionCommitteeMemberDetails } = require("../controllers/committeeMembersController");
const { getDistrict, addDistrict, removeDistrict, addDistrictToElection, removeDistrictFromElection } = require("../controllers/districtController");
const { getElectionDetails, getElectionsLength, createElection, removeElection } = require("../controllers/electionController");
const { addVoterToElection, addDistrictToVoter, removeDistrictFromVoter, removeVoterFromElection, removeVoter } = require("../controllers/voterController");

describe("District Controller - getDistrict", () => {
	it("should retrieve district details from contractInstance and return a JSON object", async () => {
		const req = {
			params: {
				id: "districtId",
			},
		};
		const res = {
			status: sinon.stub().returnsThis(),
			json: sinon.stub(),
		};
		const fCall = {
			districtID: "districtId1",
			name: "districtName",
		};
		contractInstance.methods.getDistrictDetails = sinon.stub().returns({
			call: sinon.stub().resolves(fCall),
		});

		await getDistrict(req, res);

		sinon.assert.calledWith(res.status, 200);
		sinon.assert.calledWith(res.json, {
			id: "districtId1",
			name: "districtName",
		});
	});
	it("should return district details and a 200 status response", async () => {
		const req = {
			params: {
				id: "districtId1",
			},
		};
		const res = {
			status: sinon.stub().returnsThis(),
			json: sinon.stub(),
		};
		const districtDetails = {
			id: "districtId1",
			name: "districtName",
		};
		// contractInstance.methods.getDistrictDetails = sinon.stub().resolves(districtDetails);

		await getDistrict(req, res);

		sinon.assert.calledWith(res.status, 200);
		sinon.assert.calledWith(res.json, districtDetails);
	});
});
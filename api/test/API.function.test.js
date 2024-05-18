const chai = require("chai");
const dotenv = require("dotenv");
dotenv.config();
chai.use(require('chai-uuid'));

// tools for testing
const { 
	chain, 
	adminAccount,
	contractInstance
} = require("../../chain");
const { 
	voterAccounts,
	candidateAccounts,
	electionCommitteeAccounts
} = require("./accounts.js");

// import controllers for testing
const {
	getBalance
} = require("../controllers/balanceController");
const { 
	addCandidate,
	getCandidate,
	addCandidateToElection,
	removeCandidateFromElection,
	removeCandidate
} = require("../controllers/candidateController");
const {
	addElectionCommitteeMember,
	getElectionCommitteeMemberDetails,
	addElectionCommitteeMemberToElection,
	removeElectionCommitteeMemberFromElection,
	removeElectionCommitteeMember,
} = require("../controllers/committeeMembersController");
const { 
	addDistrict,
	getDistrict,
	removeDistrict,
	addDistrictToElection,
	removeDistrictFromElection
} = require("../controllers/districtController");
const { 
	createElection,
	getElectionDetails,
	getElectionsLength,
	removeElection
} = require("../controllers/electionController");
const { 
	addVoterToElection,
	addDistrictToVoter,
	removeDistrictFromVoter,
	removeVoterFromElection,
	removeVoter
} = require("../controllers/voterController");

describe("Balance Controller", async () => {
	// The function should return a JSON object with a 'balance' property.
	it("should return a JSON object with a 'balance' property when 'chain.eth.getBalance' does not throw an error", async () => {
		const req = { params: { wallet_id: voterAccounts[0].address } };
		const res = {
			status: (statusCode) => {
				chai.expect(statusCode).to.equal(200);
				return res;
			},
			json: (data) => {
				chai.expect(data).to.have.property("balance");
				chai.expect(data.balance).to.be.a("string");
			},
		};

		await getBalance(req, res);
	});
	// If 'chain.eth.getBalance' throws an error, the function should return a 500 status code.
	it("should return a 500 status code when 'chain.eth.getBalance' throws an error", async () => {
		const req = { params: { wallet_id: "0x0" } };
		const res = {
			status: (statusCode) => {
				expect(statusCode).to.equal(500);
				return res;
			},
			json: (data) => {
				chai.expect(data).to.have.property("success");
				chai.expect(data.success).to.be.a("number");
				chai.expect(data.success).to.equal(0);
			},
		};

		await getBalance(req, res);
	});
});

describe("District Controller", async () => {
	// Successfully adds a district to the contract
	it("should successfully add a district to the contract", async () => {
		const req = {
			params: {
				name: "districtName",
				id: "01",
			},
		};
		const res = {
			status: function (statusCode) {
				chai.expect(statusCode).to.equal(200);
				return res;
			},
			json: function (data) {
				chai.expect(data).to.have.property("success");
				chai.expect(data.success).to.be.a("number");
				chai.expect(data.success).to.equal(1);

				chai.expect(data.txr).to.have.property("status");
				chai.expect(data.txr.status).to.be.a("number");
				chai.expect(data.txr.status).to.equal(1);
			},
		};

		await addDistrict(req, res);
	});

	// Successfully retrieves a district from the contract
	it("should successfully retrieve a district from the contract", async () => {
		const req = {
			params: {
				id: "01",
			},
		};
		const res = {
			status: function (statusCode) {
				chai.expect(statusCode).to.equal(200);
				return res;
			},
			json: function (data) {
				chai.expect(data).to.have.property("id");
				chai.expect(data.id).to.be.a("string");
				chai.expect(data.id).to.equal("01");

				chai.expect(data).to.have.property("name");
				chai.expect(data.name).to.be.a("string");
				chai.expect(data.name).to.equal("districtName");
			},
		};

		await getDistrict(req, res);
	});

	// Successfully removes a district from the contract
	it("should successfully remove a district from the contract", async () => {
		const req = {
			params: {
				id: "01",
			},
		};
		const res = {
			status: function (statusCode) {
				chai.expect(statusCode).to.equal(200);
				return res;
			},
			json: function (data) {
				chai.expect(data).to.have.property("success");
				chai.expect(data.success).to.be.a("number");
				chai.expect(data.success).to.equal(1);

				chai.expect(data.txr).to.have.property("status");
				chai.expect(data.txr.status).to.be.a("number");;
				chai.expect(data.txr.status).to.equal(1);
			},
		};

		await removeDistrict(req, res);
	});
});

describe("Election Committee Member Controller", async () => {
	// Successfully adds an election committee member to the contract
	it("should successfully add an election committee member to the contract", async () => {
		const req = {
			params: {
				name: "electionCommitteeAccountName",
				addr: electionCommitteeAccounts[0].address,
			},
		};
		const res = {
			status: function (statusCode) {
				chai.expect(statusCode).to.equal(200);
				return res;
			},
			json: function (data) {
				chai.expect(data).to.have.property("success");
				chai.expect(data.success).to.be.a("number");
				chai.expect(data.success).to.equal(1);

				chai.expect(data.txr).to.have.property("status");
				chai.expect(data.txr.status).to.be.a("number");
				chai.expect(data.txr.status).to.equal(1);
			},
		};

		await addElectionCommitteeMember(req, res);
	});

	// Successfully retrieves an election committee member from the contract
	it("should successfully retrieve an election committee member from the contract", async () => {
		const req = {
			params: {
				addr: electionCommitteeAccounts[0].address,
			},
		};
		const res = {
			status: function (statusCode) {
				chai.expect(statusCode).to.equal(200);
				return res;
			},
			json: function (data) {
				chai.expect(data).to.have.property("id");
				chai.expect(data.id).to.be.a("number");
				chai.expect(data.id).to.equal(1);

				chai.expect(data).to.have.property("name");
				chai.expect(data.name).to.be.a("string");
				chai.expect(data.name).to.equal("electionCommitteeAccountName");

				chai.expect(data).to.have.property("wallet");
				chai.expect(data.wallet).to.be.a("string");
				chai.expect(data.wallet).to.equal(electionCommitteeAccounts[0].address);
			},
		};

		await getElectionCommitteeMemberDetails(req, res);
	});

	// Successfully removes an election committee member from the contract
	it("should successfully remove an election committee member from the contract", async () => {
		const req = {
			params: {
				addr: electionCommitteeAccounts[0].address,
			},
		};
		const res = {
			status: function (statusCode) {
				chai.expect(statusCode).to.equal(200);
				return res;
			},
			json: function (data) {
				chai.expect(data).to.have.property("success");
				chai.expect(data.success).to.be.a("number");
				chai.expect(data.success).to.equal(1);

				chai.expect(data.txr).to.have.property("status");
				chai.expect(data.txr.status).to.be.a("number");
				chai.expect(data.txr.status).to.equal(1);
			},
		};

		await removeElectionCommitteeMember(req, res);
	});
});

describe("Candidate Controller", async () => {
	// Add a district to the contract for testing candidate functions
	before(async () => {
		const req = {
			params: {
				name: "districtName",
				id: "01",
			},
		};
		const res = {
			status: function (statusCode) {
				chai.expect(statusCode).to.equal(200);
				return res;
			},
			json: function (data) {
				chai.expect(data).to.have.property("success");
				chai.expect(data.success).to.be.a("number");
				chai.expect(data.success).to.equal(1);

				chai.expect(data.txr).to.have.property("status");
				chai.expect(data.txr.status).to.be.a("number");
				chai.expect(data.txr.status).to.equal(1);
			},
		};

		await addDistrict(req, res);
	});

	// Successfully adds a candidate to the contract
	it("should successfully add a candidate to the contract", async () => {
		const req = {
			params: {
				name: "candidateName",
				addr: candidateAccounts[0].address,
				districtId: "01",
			},
		};
		const res = {
			status: function (statusCode) {
				chai.expect(statusCode).to.equal(200);
				return res;
			},
			json: function (data) {
				chai.expect(data).to.have.property("success");
				chai.expect(data.success).to.be.a("number");
				chai.expect(data.success).to.equal(1);

				chai.expect(data.txr).to.have.property("status");
				chai.expect(data.txr.status).to.be.a("number");
				chai.expect(data.txr.status).to.equal(1);
			},
		};

		await addCandidate(req, res);
	});

	// Successfully retrieves a candidate from the contract
	it("should successfully retrieve a candidate from the contract", async () => {
		const req = {
			params: {
				addr: candidateAccounts[0].address,
			},
		};
		const res = {
			status: function (statusCode) {
				chai.expect(statusCode).to.equal(200);
				return res;
			},
			json: function (data) {
				chai.expect(data).to.have.property("name");
				chai.expect(data.name).to.be.a("string");
				chai.expect(data.name).to.equal("candidateName");

				chai.expect(data).to.have.property("wallet");
				chai.expect(data.wallet).to.be.a("string");
				chai.expect(data.wallet).to.equal(candidateAccounts[0].address);

				chai.expect(data).to.have.property("district");
				chai.expect(data.district).to.be.a("object");

				chai.expect(data.district).to.have.property("id");
				chai.expect(data.district.id).to.be.a("string");
				chai.expect(data.district.id).to.equal("01");

				chai.expect(data.district).to.have.property("name");
				chai.expect(data.district.name).to.be.a("string");
				chai.expect(data.district.name).to.equal("districtName");
			},
		};

		await getCandidate(req, res);
	});

	// Successfully removes a candidate from the contract
	it("should successfully remove a candidate from the contract", async () => {
		const req = {
			params: {
				addr: candidateAccounts[0].address,
			},
		};
		const res = {
			status: function (statusCode) {
				chai.expect(statusCode).to.equal(200);
				return res;
			},
			json: function (data) {
				chai.expect(data).to.have.property("success");
				chai.expect(data.success).to.be.a("number");
				chai.expect(data.success).to.equal(1);

				chai.expect(data.txr).to.have.property("status");
				chai.expect(data.txr.status).to.be.a("number");
				chai.expect(data.txr.status).to.equal(1);
			},
		};

		await removeCandidate(req, res);
	});

	// Delete the district from the contract for testing candidate functions
	after(async () => {
		const req = {
			params: {
				id: "01",
			},
		};
		const res = {
			status: function (statusCode) {
				chai.expect(statusCode).to.equal(200);
				return res;
			},
			json: function (data) {
				chai.expect(data).to.have.property("success");
				chai.expect(data.success).to.be.a("number");
				chai.expect(data.success).to.equal(1);

				chai.expect(data.txr).to.have.property("status");
				chai.expect(data.txr.status).to.be.a("number");
				chai.expect(data.txr.status).to.equal(1);
			},
		};

		await removeDistrict(req, res);
	});

});

describe("Election Controller", async () => {
	let _id = "";
	// Add a district to the contract for testing election functions
	before(async () => {
		const req = {
			params: {
				name: "districtName",
				id: "01",
			},
		};
		const res = {
			status: function (statusCode) {
				chai.expect(statusCode).to.equal(200);
				return res;
			},
			json: function (data) {
				chai.expect(data).to.have.property("success");
				chai.expect(data.success).to.be.a("number");
				chai.expect(data.success).to.equal(1);

				chai.expect(data.txr).to.have.property("status");
				chai.expect(data.txr.status).to.be.a("number");
				chai.expect(data.txr.status).to.equal(1);
			},
		};

		await addDistrict(req, res);
	});

	// Successfully adds an election to the contract
	it("should successfully create an election to the contract", async () => {
		const req = {
			params: {
				name: "electionName",
				startDate: 1324556,
				endDate: 1724557,
			},
		};
		const res = {
			status: function (statusCode) {
				chai.expect(statusCode).to.equal(200);
				return res;
			},
			json: function (data) {
				chai.expect(data).to.have.property("success");
				chai.expect(data.success).to.be.a("number");
				chai.expect(data.success).to.equal(1);

				chai.expect(data.txr).to.have.property("status");
				chai.expect(data.txr.status).to.be.a("number");
				chai.expect(data.txr.status).to.equal(1);

				chai.expect(data).to.have.property("id");
				chai.expect(data.id).to.be.a("string");
				chai.expect(data.id).to.be.a.uuid("v4");

				_id = data.id;
			},
		};

		await createElection(req, res);
	});

	// Successfully retrieves an election from the contract
	it("should successfully retrieve an election from the contract", async () => {
		const req = {
			params: {
				id: _id,
			},
		};
		const res = {
			status: function (statusCode) {
				chai.expect(statusCode).to.equal(200);
				return res;
			},
			json: function (data) {
				chai.expect(data).to.have.property("name");
				chai.expect(data.name).to.be.a("string");
				chai.expect(data.name).to.equal("electionName");

				chai.expect(data).to.have.property("startDate");
				chai.expect(data.startDate).to.be.a("number");
				chai.expect(data.startDate).to.equal(1324556);

				chai.expect(data).to.have.property("endDate");
				chai.expect(data.endDate).to.be.a("number");
				chai.expect(data.endDate).to.equal(1724557);

				chai.expect(data).to.have.property("id");
				chai.expect(data.id).to.be.a("string");
				chai.expect(data.id).to.be.a.uuid("v4");
				chai.expect(data.id).to.equal(_id);
				
				chai.expect(data).to.have.property("districtIDs");
				chai.expect(data.districtIDs).to.be.a("array");
				chai.expect(data.districtIDs).to.have.lengthOf(0);

				chai.expect(data).to.have.property("candidateAddresses");
				chai.expect(data.candidateAddresses).to.be.a("array");
				chai.expect(data.candidateAddresses).to.have.lengthOf(0);

				chai.expect(data).to.have.property("electionCommittee");
				chai.expect(data.electionCommittee).to.be.a("array");
				chai.expect(data.electionCommittee).to.have.lengthOf(0);
			},
		};

		await getElectionDetails(req, res);
	});

	// Successfully removes an election from the contract
	it("should successfully remove an election from the contract", async () => {
		const req = {
			params: {
				id: _id,
			},
		};
		const res = {
			status: function (statusCode) {
				chai.expect(statusCode).to.equal(200);
				return res;
			},
			json: function (data) {
				chai.expect(data).to.have.property("success");
				chai.expect(data.success).to.be.a("number");
				chai.expect(data.success).to.equal(1);

				chai.expect(data.txr).to.have.property("status");
				chai.expect(data.txr.status).to.be.a("number");
				chai.expect(data.txr.status).to.equal(1);
			},
		};

		await removeElection(req, res);
	});

	// Successfully removes a district from the contract
	after(async () => {
		const req = {
			params: {
				id: "01",
			},
		};
		const res = {
			status: function (statusCode) {
				chai.expect(statusCode).to.equal(200);
				return res;
			},
			json: function (data) {
				chai.expect(data).to.have.property("success");
				chai.expect(data.success).to.be.a("number");
				chai.expect(data.success).to.equal(1);

				chai.expect(data.txr).to.have.property("status");
				chai.expect(data.txr.status).to.be.a("number");
				chai.expect(data.txr.status).to.equal(1);
			},
		};

		await removeDistrict(req, res);
	});
});

describe("Election-District", async () => {
	this.timeout(20000);
	let _id;
	// Add a district and an election to the contract for testing election functions
	before(async () => {
		const reqDistrict = {
			params: {
				name: "Test District",
				id: "01",
			},
		};
		const reqElection = {
			params: {
				name: "Test Election",
				startDate: 1324556,
				endDate: 1724557,
			},
		}
		const resElection = {
			status: function (statusCode) {
				chai.expect(statusCode).to.equal(200);
				return resElection;
			},
			json: function (data) {
				chai.expect(data).to.have.property("success");
				chai.expect(data.success).to.be.a("number");
				chai.expect(data.success).to.equal(1);

				chai.expect(data.txr).to.have.property("status");
				chai.expect(data.txr.status).to.be.a("number");
				chai.expect(data.txr.status).to.equal(1);

				chai.expect(data).to.have.property("id");
				chai.expect(data.id).to.be.a("string");
				chai.expect(data.id).to.be.a.uuid("v4");

				_id = data.id;
			},
		};
		const resDistrict = {
			status: function (statusCode) {
				chai.expect(statusCode).to.equal(200);
				return resDistrict;
			},
			json: function (data) {
				chai.expect(data).to.have.property("success");
				chai.expect(data.success).to.be.a("number");
				chai.expect(data.success).to.equal(1);

				chai.expect(data.txr).to.have.property("status");
				chai.expect(data.txr.status).to.be.a("number");
				chai.expect(data.txr.status).to.equal(1);
			},
		};

		await addDistrict(reqDistrict, resDistrict);
		await createElection(reqElection, resElection);

	});

	// Successfully adds a district to an election
	it("should successfully add a district to an election", async () => {
		const req = {
			params: {
				electionID: _id,
				districtID: "01",
			},
		};
		const res = {
			status: function (statusCode) {
				chai.expect(statusCode).to.equal(200);
				return res;
			},
			json: function (data) {
				chai.expect(data).to.have.property("success");
				chai.expect(data.success).to.be.a("number");
				chai.expect(data.success).to.equal(1);

				chai.expect(data.txr).to.have.property("status");
				chai.expect(data.txr.status).to.be.a("number");
				chai.expect(data.txr.status).to.equal(1);
			},
		};

		await addDistrictToElection(req, res);
	});

	// Successfully removes a district from an election
	it("should successfully remove a district from an election", async () => {
		const req = {
			params: {
				electionID: _id,
				districtID: "01",
			},
		};
		const res = {
			status: function (statusCode) {
				chai.expect(statusCode).to.equal(200);
				return res;
			},
			json: function (data) {
				chai.expect(data).to.have.property("success");
				chai.expect(data.success).to.be.a("number");
				chai.expect(data.success).to.equal(1);

				chai.expect(data.txr).to.have.property("status");
				chai.expect(data.txr.status).to.be.a("number");
				chai.expect(data.txr.status).to.equal(1);
			},
		};

		await removeDistrictFromElection(req, res);
	});

	// Removes district and election from contract for testing
	after(async () => {
		const reqElection = {
			params: {
				id: _id,
			},
		};
		const reqDistrict = {
			params: {
				id: "01",
			},
		};

		const resElection = {
			status: function (statusCode) {
				chai.expect(statusCode).to.equal(200);
				return resElection;
			},
			json: function (data) {
				chai.expect(data).to.have.property("success");
				chai.expect(data.success).to.be.a("number");
				chai.expect(data.success).to.equal(1);
				
				chai.expect(data.txr).to.have.property("status");
				chai.expect(data.txr.status).to.be.a("number");
				chai.expect(data.txr.status).to.equal(1);
			},
		};
		const resDistrict = {
			status: function (statusCode) {
				chai.expect(statusCode).to.equal(200);
				return resDistrict;
			},
			json: function (data) {
				chai.expect(data).to.have.property("success");
				chai.expect(data.success).to.be.a("number");
				chai.expect(data.success).to.equal(1);
				
				chai.expect(data.txr).to.have.property("status");
				chai.expect(data.txr.status).to.be.a("number");
				chai.expect(data.txr.status).to.equal(1);
			},
		};
		await removeElection(reqElection, resElection);
		await removeDistrict(reqDistrict, resDistrict);
	});
});

describe("Committee-Election", async () => {
	this.timeout(20000);
	let _id;
	// Add a district and an election to the contract for testing election functions
	before(async () => {
		const reqCommittee = {
			params: {
				name: "Test Committee",
				addr: electionCommitteeAccounts[0].address,
			},
		};
		const reqElection = {
			params: {
				name: "Test Election",
				startDate: 1324556,
				endDate: 1724557,
			},
		}
		const resElection = {
			status: function (statusCode) {
				chai.expect(statusCode).to.equal(200);
				return resElection;
			},
			json: function (data) {
				chai.expect(data).to.have.property("success");
				chai.expect(data.success).to.be.a("number");
				chai.expect(data.success).to.equal(1);

				chai.expect(data.txr).to.have.property("status");
				chai.expect(data.txr.status).to.be.a("number");
				chai.expect(data.txr.status).to.equal(1);

				chai.expect(data).to.have.property("id");
				chai.expect(data.id).to.be.a("string");
				chai.expect(data.id).to.be.a.uuid("v4");

				_id = data.id;
			},
		};
		const resCommittee = {
			status: function (statusCode) {
				chai.expect(statusCode).to.equal(200);
				return resCommittee;
			},
			json: function (data) {
				chai.expect(data).to.have.property("success");
				chai.expect(data.success).to.be.a("number");
				chai.expect(data.success).to.equal(1);

				chai.expect(data.txr).to.have.property("status");
				chai.expect(data.txr.status).to.be.a("number");
				chai.expect(data.txr.status).to.equal(1);
			},
		};

		await addElectionCommitteeMember(reqCommittee, resCommittee);
		await createElection(reqElection, resElection);

	});

	// Successfully adds an election to a committee
	it("should successfully add an election to a committee", async () => {
		const req = {
			params: {
				elecId: _id,
				addr: electionCommitteeAccounts[0].address,
			},
		};
		const res = {
			status: function (statusCode) {
				chai.expect(statusCode).to.equal(200);
				return res;
			},
			json: function (data) {
				chai.expect(data).to.have.property("success");
				chai.expect(data.success).to.be.a("number");
				chai.expect(data.success).to.equal(1);

				chai.expect(data.txr).to.have.property("status");
				chai.expect(data.txr.status).to.be.a("number");
				chai.expect(data.txr.status).to.equal(1);
			},
		};

		await addElectionCommitteeMemberToElection(req, res);
	});

	// Successfully removes an election from a committee
	it("should successfully remove an election from a committee", async () => {
		const req = {
			params: {
				elecId: _id,
				addr: electionCommitteeAccounts[0].address,
			},
		};
		const res = {
			status: function (statusCode) {
				chai.expect(statusCode).to.equal(200);
				return res;
			},
			json: function (data) {
				chai.expect(data).to.have.property("success");
				chai.expect(data.success).to.be.a("number");
				chai.expect(data.success).to.equal(1);

				chai.expect(data.txr).to.have.property("status");
				chai.expect(data.txr.status).to.be.a("number");
				chai.expect(data.txr.status).to.equal(1);
			},
		};

		await removeElectionCommitteeMemberFromElection(req, res);
	});

	// Removes committee and election from contract for testing
	after(async () => {
		const reqElection = {
			params: {
				id: _id,
			},
		};
		const reqCommittee = {
			params: {
				addr: electionCommitteeAccounts[0].address,
			},
		};

		const resElection = {
			status: function (statusCode) {
				chai.expect(statusCode).to.equal(200);
				return resElection;
			},
			json: function (data) {
				chai.expect(data).to.have.property("success");
				chai.expect(data.success).to.be.a("number");
				chai.expect(data.success).to.equal(1);

				chai.expect(data.txr).to.have.property("status");
				chai.expect(data.txr.status).to.be.a("number");
				chai.expect(data.txr.status).to.equal(1);
			},
		};
		const resCommittee = {
			status: function (statusCode) {
				chai.expect(statusCode).to.equal(200);
				return resCommittee;
			},
			json: function (data) {
				chai.expect(data).to.have.property("success");
				chai.expect(data.success).to.be.a("number");
				chai.expect(data.success).to.equal(1);

				chai.expect(data.txr).to.have.property("status");
				chai.expect(data.txr.status).to.be.a("number");
				chai.expect(data.txr.status).to.equal(1);
			},
		};

		await removeElectionCommitteeMember(reqCommittee, resCommittee);
		await removeElection(reqElection, resElection);
	});
});

describe("Candidate-Election", async () => {
	// Add a district, an election and a candidate to the contract for testing election functions
	let elecId;
	before(async () => {
		const reqDistrict = {
			params: {
				name: "Test District",
				id: "01",
			},
		};
		const reqElection = {
			params: {
				name: "Test Election",
				startDate: 1324556,
				endDate: 1724557,
			},
		}
		const reqCandidate = {
			params: {
				name: "candidateName",
				addr: candidateAccounts[0].address,
				districtId: "01",
			},
		};
		const resElection = {
			status: function (statusCode) {
				chai.expect(statusCode).to.equal(200);
				return resElection;
			},
			json: function (data) {
				chai.expect(data).to.have.property("success");
				chai.expect(data.success).to.be.a("number");
				chai.expect(data.success).to.equal(1);

				chai.expect(data.txr).to.have.property("status");
				chai.expect(data.txr.status).to.be.a("number");
				chai.expect(data.txr.status).to.equal(1);

				chai.expect(data).to.have.property("id");
				chai.expect(data.id).to.be.a("string");
				chai.expect(data.id).to.be.a.uuid("v4");
				
				elecId = data.id;
			},
		};
		const resDistrict = {
			status: function (statusCode) {
				chai.expect(statusCode).to.equal(200);
				return resDistrict;
			},
			json: function (data) {
				chai.expect(data).to.have.property("success");
				chai.expect(data.success).to.be.a("number");
				chai.expect(data.success).to.equal(1);

				chai.expect(data.txr).to.have.property("status");
				chai.expect(data.txr.status).to.be.a("number");
				chai.expect(data.txr.status).to.equal(1);
			},
		};
		const resCandidate = {
			status: function (statusCode) {
				chai.expect(statusCode).to.equal(200);
				return resCandidate;
			},
			json: function (data) {
				chai.expect(data).to.have.property("success");
				chai.expect(data.success).to.be.a("number");
				chai.expect(data.success).to.equal(1);

				chai.expect(data.txr).to.have.property("status");
				chai.expect(data.txr.status).to.be.a("number");
				chai.expect(data.txr.status).to.equal(1);
			},
		};

		await addDistrict(reqDistrict, resDistrict);
		elec = await createElection(reqElection, resElection);
		await addCandidate(reqCandidate, resCandidate);
	});

	it("should successfully add a candidate to an election", async () => {
		const req = {
			params: {
				elecId: elecId,
				addr: candidateAccounts[0].address,
			},
		};
		const res = {
			status: function (statusCode) {
				chai.expect(statusCode).to.equal(200);
				return res;
			},
			json: function (data) {
				chai.expect(data).to.have.property("success");
				chai.expect(data.success).to.be.a("number");
				chai.expect(data.success).to.equal(1);

				chai.expect(data.txr).to.have.property("status");
				chai.expect(data.txr.status).to.be.a("number");
				chai.expect(data.txr.status).to.equal(1);
			},
		};

		await addCandidateToElection(req, res);
	});

	it("should successfully remove a candidate from an election", async () => {
		const req = {
			params: {
				elecId: elecId,
				addr: candidateAccounts[0].address,
			},
		};
		const res = {
			status: function (statusCode) {
				chai.expect(statusCode).to.equal(200);
				return res;
			},
			json: function (data) {
				chai.expect(data).to.have.property("success");
				chai.expect(data.success).to.be.a("number");
				chai.expect(data.success).to.equal(1);
			},
		};

		await removeCandidateFromElection(req, res);
	});

	// Removes district, election and candidate from contract for testing
	after(async () => {
		const reqElection = {
			params: {
				id: elecId,
			},
		};
		const reqDistrict = {
			params: {
				id: "01",
			},
		};
		const reqCandidate = {
			params: {
				addr: candidateAccounts[0].address,
			},
		};

		const resElection = {
			status: function (statusCode) {
				chai.expect(statusCode).to.equal(200);
				return resElection;
			},
			json: function (data) {
				chai.expect(data).to.have.property("success");
				chai.expect(data.success).to.be.a("number");
				chai.expect(data.success).to.equal(1);
				
				chai.expect(data.txr).to.have.property("status");
				chai.expect(data.txr.status).to.be.a("number");
				chai.expect(data.txr.status).to.equal(1);
			},
		};
		const resDistrict = {
			status: function (statusCode) {
				chai.expect(statusCode).to.equal(200);
				return resDistrict;
			},
			json: function (data) {
				chai.expect(data).to.have.property("success");
				chai.expect(data.success).to.be.a("number");
				chai.expect(data.success).to.equal(1);
				
				chai.expect(data.txr).to.have.property("status");
				chai.expect(data.txr.status).to.be.a("number");
				chai.expect(data.txr.status).to.equal(1);
			},
		};
		const resCandidate = {
			status: function (statusCode) {
				chai.expect(statusCode).to.equal(200);
				return resCandidate;
			},
			json: function (data) {
				chai.expect(data).to.have.property("success");
				chai.expect(data.success).to.be.a("number");
				chai.expect(data.success).to.equal(1);

				chai.expect(data.txr).to.have.property("status");
				chai.expect(data.txr.status).to.be.a("number");
				chai.expect(data.txr.status).to.equal(1);
			},
		};

		await removeElection(reqElection, resElection);
		await removeCandidate(reqCandidate, resCandidate);
		await removeDistrict(reqDistrict, resDistrict);

	});
});
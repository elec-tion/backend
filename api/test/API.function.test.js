const chai = require("chai");
const sinon = require("sinon");
const dotenv = require("dotenv");
dotenv.config();

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
	getElectionCommitteeMemberLength,
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
				chai.expect(data.txr.status).to.be.a("bigint");
				chai.expect(data.txr.status).to.equal(BigInt(1));
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
				chai.expect(data.txr.status).to.be.a("bigint");
				chai.expect(data.txr.status).to.equal(BigInt(1));
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
				name: "electionCommitteeMemberName",
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
				chai.expect(data.txr.status).to.be.a("bigint");
				chai.expect(data.txr.status).to.equal(BigInt(1));
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
				chai.expect(data.name).to.equal("electionCommitteeMemberName");

				chai.expect(data).to.have.property("wallet");
				chai.expect(data.wallet).to.be.a("string");
				chai.expect(data.wallet).to.equal(electionCommitteeAccounts[0].address);
			},
		};

		await getElectionCommitteeMemberDetails(req, res);
	});

	// Successfully retrieves length of election committee members from the contract
	it("should successfully retrieve length of election committee members from the contract", async () => {
		const req = {};
		const res = {
			status: function (statusCode) {
				chai.expect(statusCode).to.equal(200);
				return res;
			},
			json: function (data) {
				chai.expect(data).to.have.property("length");
				chai.expect(data.length).to.be.a("number");
				chai.expect(data.length).to.equal(1);
			},
		};

		await getElectionCommitteeMemberLength(req, res);
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
				chai.expect(data.txr.status).to.be.a("bigint");
				chai.expect(data.txr.status).to.equal(BigInt(1));
			},
		};

		await removeElectionCommitteeMember(req, res);
	});
});

describe("Candidate Controller", async () => {
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
				chai.expect(data.txr.status).to.be.a("bigint");
				chai.expect(data.txr.status).to.equal(BigInt(1));
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
				chai.expect(data.txr.status).to.be.a("bigint");
				chai.expect(data.txr.status).to.equal(BigInt(1));
			},
		};

		await removeCandidate(req, res);
	});
});

describe("Election Controller", async () => {
	// Successfully adds an election to the contract
	it("should successfully add an election to the contract", async () => {
		const req = {
			params: {
				name: "electionName",
				districts: ["01", "02"],
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
				chai.expect(data.txr.status).to.be.a("bigint");
				chai.expect(data.txr.status).to.equal(BigInt(1));
			},
		};

		await addElection(req, res);
	});

	// Successfully retrieves an election from the contract
	it("should successfully retrieve an election from the contract", async () => {
		const req = {
			params: {
				id: "1",
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
			},
		};

		await getElectionDetails(req, res);
	});

	// Successfully removes an election from the contract
	it("should successfully remove an election from the contract", async () => {
		const req = {
			params: {
				id: "1",
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
				chai.expect(data.txr.status).to.be.a("bigint");
				chai.expect(data.txr.status).to.equal(BigInt(1));
			},
		};

		await removeElection(req, res);
	});
});

describe("Election-District", async () => {
	// Successfully adds a district to an election
	it("should successfully add a district to an election", async () => {
		const req = {
			params: {
				electionID: 1,
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
				chai.expect(data.txr.status).to.be.a("bigint");
				chai.expect(data.txr.status).to.equal(BigInt(1));
			},
		};

		await addDistrictToElection(req, res);
	});

	// Successfully removes a district from an election
	it("should successfully remove a district from an election", async () => {
		const req = {
			params: {
				electionID: 1,
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
				chai.expect(data.txr.status).to.be.a("bigint");
				chai.expect(data.txr.status).to.equal(BigInt(1));
			},
		};

		await removeDistrictFromElection(req, res);
	});
});

describe("Committee-Election", async () => {
	// Successfully adds an election to a committee
	it("should successfully add an election to a committee", async () => {
		const req = {
			params: {
				electionID: 1,
				committeeID: "01",
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
				chai.expect(data.txr.status).to.be.a("bigint");
				chai.expect(data.txr.status).to.equal(BigInt(1));
			},
		};

		await addElectionToCommittee(req, res);
	});

	// Successfully removes an election from a committee
	it("should successfully remove an election from a committee", async () => {
		const req = {
			params: {
				electionID: 1,
				committeeID: "01",
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
				chai.expect(data.txr.status).to.be.a("bigint");
				chai.expect(data.txr.status).to.equal(BigInt(1));
			},
		};

		await removeElectionFromCommittee(req, res);
	});
});
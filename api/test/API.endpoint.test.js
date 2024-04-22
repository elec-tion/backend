const chai = require("chai");
const chaiHttp = require("chai-http");
const dotenv = require("dotenv");
const { voterAccounts, candidateAccounts, electionCommitteeAccounts } = require("./accounts.js");
dotenv.config();
chai.use(chaiHttp);

describe("API Connection", function () {
	it("should connect to the API", async function () {
		// change timeout to 10 seconds
		this.timeout(10000);

		// test connection to the API
		const res = await chai.request(`http://${process.env.IP}:${process.env.PORT}`).get("/api/");

		// check if the response status is 200
		chai.expect(res).to.have.status(200);
	});
});

// District API test
describe("District API", function () {
	beforeEach(async function () {
		// change timeout to 10 seconds
		this.timeout(10000);
	});

	// Add a new district
	it("should add a new district", async function () {

		// test adding a new district
		await chai.request(`http://${process.env.IP}:${process.env.PORT}`)
			.post("/api/district/01/Turkiye")
			.end((err, res) => {
				chai.expect(res).to.have.status(200);
				chai.expect(res.body).to.be.an('object');
				// chai.expect(res.body).to.have.property('districtId');
				done();
			});
	});

	// Remove a district
	it("should remove a district", async function () {
		// test removing a district
		await chai.request(`http://${process.env.IP}:${process.env.PORT}`)
			.delete("/api/district/01")
			.end((err, res) => {
				chai.expect(res).to.have.status(200);
				chai.expect(res.body).to.be.an('object');
				// chai.expect(res.body).to.have.property('districtId');
				done();
			});
	});
	
	
});

/* 
	// Candidate API test
	describe("Candidate API", function () {
		beforeEach(async function () {
			// change timeout to 10 seconds
			this.timeout(10000);

		});

		// Add a new candidate
		it("should add a new candidate", async function () {

			const res = await chai.request(`http://${process.env.IP}:${process.env.PORT}`).post(`/api/candidate/John Doe/01/${candidateAccounts[0].address}`);

			// check if the response status is 200
			chai.expect(res).to.have.status(200);
		});

	});
 */
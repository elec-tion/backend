const chai = require("chai");
const chaiHttp = require("chai-http");
const dotenv = require("dotenv");
const { voterAccounts, candidateAccounts, electionCommitteeAccounts } = require("./accounts.js");
dotenv.config();
chai.use(chaiHttp);

describe("API Connection", function () {
	it("should connect to the API", async function () {
		// test connection to the API
		const res = await chai.request(`http://${process.env.IP}:${process.env.PORT}`).get("/api/");

		// check if the response status is 200
		chai.expect(res).to.have.status(200);
	});
});

// District API test
describe("District API", function () {
    // Add a new district
    it("should add a new district", async function () {
        // change timeout to 10 seconds
        this.timeout(10000);

        // test adding a new district
        const res = await chai.request(`http://${process.env.IP}:${process.env.PORT}`).post("/api/district/01/Turkiye").timeout(10000);

        // check if the response status is 200
        chai.expect(res).to.have.status(200);
    });
});

// Candidate API test
describe("Candidate API", function () {
	// Add a new candidate
    it("should add a new candidate", async function () {
        const res = await chai.request(`http://${process.env.IP}:${process.env.PORT}`).post(`/api/candidate/John Doe/01/${candidateAccounts[0].address}`);

        chai.expect(res).to.have.status(200);
    });
});

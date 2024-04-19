// npx hardhat run scripts/deploy.js --network localhost

// test/electionContract.test.js

const { expect } = require("chai");

describe("ElectionContract", function () {
	let ElectionContract;
	let electionContract;
	let admin;
	let committee;
	let voter1;
	let voter2;

	beforeEach(async function () {
		[admin, committee, candidate, voter1] = await ethers.getSigners();
		ElectionContract = await ethers.getContractFactory("ElectionContract"); // returns a factory object that can be used to deploy the contract
		hardhatToken = await ethers.deployContract("ElectionContract");
	});

	// add/remove election committee
	it("Should set admin correctly", async function () {
		let addr = await hardhatToken.connect(admin).admin();
		expect(addr).to.equal(admin.address);
	});

	it("Should add and remove election committee members", async function () {
		await hardhatToken.connect(admin).addElectionCommitteeMember(committee.address, "Test Committee Member");
		expect(await hardhatToken.connect(committee).isElectionComitteMemberExists(committee.address)).to.equal(true);

		await hardhatToken.connect(admin).removeElectionCommitteeMember(committee.address);
		expect(await hardhatToken.connect(committee).isElectionComitteMemberExists(committee.address)).to.equal(false);
	});

	// create election by admin
	it("Should allow admin to create election", async function () {
		// create election
		await hardhatToken.connect(admin).createElection("Test Election", 1648886400, 1648972800);

		// check if the election content is correcly set
		let adminElection = await hardhatToken.connect(admin).elections(0);
		expect(adminElection.name).to.equal("Test Election");
		expect(adminElection.startDate).to.equal(1648886400);
		expect(adminElection.endDate).to.equal(1648972800);

		// checking if the election has been created
		const electionExist = await hardhatToken.connect(admin).isElectionExists(0);
		expect(electionExist).to.equal(true);

	});

	// add committe member to election (by admin)
	it("Should add a committe member to an election", async function () {
		// creating election then adding a commite member
		await hardhatToken.connect(admin).createElection("Test Election", 1648886400, 1648972800);
		await hardhatToken.connect(admin).addElectionCommitteeMember(committee.address, "Test Committee Member");

		// adding the committe member to the election
		await hardhatToken.connect(admin).addElectionCommitteeMemberToElection(committee.address, 0);

		// check if the member added to the election
		let electionContent = await hardhatToken.connect(admin).getElectionDetails(0);
		let committeeMember = await electionContent.electionCommittee[0];
		expect(committeeMember).to.equal(committee.address);
	});

	// remove committe member from election (by admin)
	it("Should remove a committe member from an election", async function () {
		// creating election then adding a commite member
		await hardhatToken.connect(admin).createElection("Test Election", 1648886400, 1648972800);
		await hardhatToken.connect(admin).addElectionCommitteeMember(committee.address, "Test Committee Member");

		// adding the committe member to the election
		await hardhatToken.connect(admin).addElectionCommitteeMemberToElection(committee.address, 0);

		// removing the committe member to the election
		await hardhatToken.connect(admin).removeElectionCommitteeMemberFromElection(committee.address, 0);

		// check if the member removed to the election
		let electionContent = await hardhatToken.connect(admin).getElectionDetails(0);
		let committeeMember = await electionContent.electionCommittee;
		expect(committeeMember.length).to.equal(0);
	});

	// remove Election from election contract
	it("Should remove an election from the contract", async function () {
		// creating election then adding a commite member
		await hardhatToken.connect(admin).createElection("Test Election", 1648886400, 1648972800);

		// removing the committe member to the election
		await hardhatToken.connect(admin).removeElection(0);

		// check if the member removed from the election
		const electionExist = await hardhatToken.connect(admin).isElectionExists;
		expect(electionExist.length).to.equal(0);
	});

	// add district (by admin)
	it("Should add a new district", async function () {
		// add a district
		await hardhatToken.connect(admin).addDistrict("Test District", "01");
		const district = await hardhatToken.connect(admin).districts("01");
		expect(district.name).to.equal("Test District");
		expect(district.districtID).to.equal("01");
		expect(await hardhatToken.connect(admin).isDistrictExists("01")).to.equal(true);
	});

	// add district to election (by admin)
	it("Should add a district to an election", async function () {
		// create election
		await hardhatToken.connect(admin).createElection("Test Election", 1648886400, 1648972800);

		// add a district
		await hardhatToken.connect(admin).addDistrict("Test District", "01");

		// add district to election
		await hardhatToken.connect(admin).addDistrictToElection(0, "01");

		// check if the district added to the election
		let electionContent = await hardhatToken.connect(admin).getElectionDetails(0);
		let district = await electionContent.districtIDs[0];
		expect(district).to.equal("01");
	});

	// remove district from election (by admin)
	it("Should remove a district from an election", async function () {
		// create election
		await hardhatToken.connect(admin).createElection("Test Election", 1648886400, 1648972800);

		// add a district
		await hardhatToken.connect(admin).addDistrict("Test District", "01");

		// add district to election
		await hardhatToken.connect(admin).addDistrictToElection(0, "01");

		// remove district from election
		await hardhatToken.connect(admin).removeDistrictFromElection(0, "01");

		// check if the district removed from the election
		let electionContent = await hardhatToken.connect(admin).getElectionDetails(0);
		let district = await electionContent.districtIDs;
		expect(district.length).to.equal(0);
	});

	// remove district (by admin)
	it("Should remove a district", async function () {
		// add a district
		await hardhatToken.connect(admin).addDistrict("Test District", "01");

		// remove district
		await hardhatToken.connect(admin).removeDistrict("01");

		// check if the district removed
		expect(await hardhatToken.connect(admin).isDistrictExists("01")).to.equal(false);
	});

	// add candidate (by admin)
	it("Should add a new candidate", async function () {
		// create election
		await hardhatToken.connect(admin).createElection("Test Election", 1648886400, 1648972800);

		// add a district
		await hardhatToken.connect(admin).addDistrict("Test District", "01");

		// add a candidate
		await hardhatToken.connect(admin).addCandidate("Test Candidate", "01", candidate.address);

		// check if the candidate info is correct
		const newCandidate = await hardhatToken.connect(admin).candidates(candidate.address);
		expect(newCandidate.name).to.equal("Test Candidate");
		expect(newCandidate.district.districtID).to.equal("01");
		expect(newCandidate.wallet).to.equal(candidate.address);

		// check if candidate has been added
		expect(await hardhatToken.connect(admin).isCandidateExists(candidate.address)).to.equal(true);
	});

	// add candidate to election (by admin)
	it("Should add a candidate to an election", async function () {
		// create election
		await hardhatToken.connect(admin).createElection("Test Election", 1648886400, 1648972800);

		// add a district
		await hardhatToken.connect(admin).addDistrict("Test District", "01");

		// add a candidate
		await hardhatToken.connect(admin).addCandidate("Test Candidate", "01", candidate.address);

		// add candidate to election
		await hardhatToken.connect(admin).addCandidateToElection(0, candidate.address);

		// check if the candidate added to the election
		let electionContent = await hardhatToken.connect(admin).getElectionDetails(0);
		let _candidate = await electionContent.candidateAddresses[0];
		expect(_candidate).to.equal(candidate.address);
	});

	// remove candidate from election (by admin)
	it("Should remove a candidate from an election", async function () {
		// create election
		await hardhatToken.connect(admin).createElection("Test Election", 1648886400, 1648972800);

		// add a district
		await hardhatToken.connect(admin).addDistrict("Test District", "01");

		// add a candidate
		await hardhatToken.connect(admin).addCandidate("Test Candidate", "01", candidate.address);

		// add candidate to election
		await hardhatToken.connect(admin).addCandidateToElection(0, candidate.address);

		// remove candidate from election
		await hardhatToken.connect(admin).removeCandidateFromElection(0, candidate.address);

		// check if the candidate removed from the election
		let electionContent = await hardhatToken.connect(admin).getElectionDetails(0);
		let _candidate = await electionContent.candidateAddresses;
		expect(_candidate.length).to.equal(0);
	});

	// remove candidate (by admin)
	it("Should remove a candidate", async function () {
		// add a district
		await hardhatToken.connect(admin).addDistrict("Test District", "01");

		// add a candidate
		await hardhatToken.connect(admin).addCandidate("Test Candidate", "01", candidate.address);

		// remove candidate
		await hardhatToken.connect(admin).removeCandidate(candidate.address);

		// check if the candidate removed
		expect(await hardhatToken.connect(admin).isCandidateExists(candidate.address)).to.equal(false);
	});


	// add voter
	it("Should add a new voter", async function () {
		// voter adds itself
		await hardhatToken.connect(voter1).addVoter();

		// check if the voter is added
		expect(await hardhatToken.connect(admin).isVoterExists(voter1.address)).to.equal(true);
	});

	// add voter to election
	it("Should add a voter to an election", async function () {
		// add a voter
		await hardhatToken.connect(voter1).addVoter();

		// create election
		await hardhatToken.connect(admin).createElection("Test Election", 1648886400, 1648972800);

		// add voter to election
		await hardhatToken.connect(admin).addVoterToElection(voter1.address, 0);
		
		// get voter's elections and check if the election is added 
		let voterElections = await hardhatToken.connect(voter1).getVotersElections();
		expect(voterElections[0]).to.equal(0);

		// case: there is 2 elections but voter can participate only 1
		await hardhatToken.connect(admin).createElection("Test Election 2", 1648886400, 1648972800);
		voterElections = await hardhatToken.connect(voter1).getVotersElections();
		expect(voterElections.length).to.equal(1);
	});

	// remove voter from election
	it("Should remove a voter from an election", async function () {
		// add a voter
		await hardhatToken.connect(voter1).addVoter();

		// create election
		await hardhatToken.connect(admin).createElection("Test Election", 1648886400, 1648972800);

		// add voter to election
		await hardhatToken.connect(admin).addVoterToElection(voter1.address, 0);

		// remove voter from election
		await hardhatToken.connect(admin).removeVoterFromElection(0, voter1.address);

		// get voter's elections and check if the election is removed
		// by calling getVotersElections() and it should reverted with reason string
		// because voter don't have any election to participate
		let voterElections = await hardhatToken.connect(voter1);

		expect(voterElections.getVotersElections()).to.be.revertedWith("Voter can't enter any election");
	});

	// remove voter (by admin)
	it("Should remove voter", async function () {
		// voter adds itself then admin removes voter
		await hardhatToken.connect(voter1).addVoter();
		await hardhatToken.connect(admin).removeVoter(voter1.address);
		const isExist = await hardhatToken.connect(admin).isVoterExists(voter1.address);

		// check if voter exist (should be false)
		expect(isExist).to.equal(false);
	});

	// add district to voter (by admin)
	it("Should add a district to voter", async function () {
		// add a voter
		await hardhatToken.connect(voter1).addVoter();

		// add a district
		await hardhatToken.connect(admin).addDistrict("Test District", "01");

		// add district to voter
		await hardhatToken.connect(admin).addDistrictToVoter(voter1.address, "01");

		// check if the district added to the voter
		let voter = await hardhatToken.connect(admin).getVoter(voter1.address);
		let voterDistrict = await voter.district;
		expect(voterDistrict.districtID).to.equal("01");
	});

	// remove district from voter (by admin)
	it("Should remove a district from voter", async function () {
		// add a voter
		await hardhatToken.connect(voter1).addVoter();

		// add a district
		await hardhatToken.connect(admin).addDistrict("Test District", "01");

		// add district to voter
		await hardhatToken.connect(admin).addDistrictToVoter(voter1.address, "01");

		// remove district from voter
		await hardhatToken.connect(admin).removeDistrictFromVoter(voter1.address, "01");

		// check if the district removed from the voter
		// getVoter() -> Voter(struct) -> District(struct) -> districtID(string)
		let voter = await hardhatToken.connect(admin).getVoter(voter1.address);
		let voterDistrict = await voter.district;
		expect(voterDistrict.districtID).to.equal('null');
	});


	// get voter's elections
	// should assign some elections to a voter and check if the elections has been assigned
	it("Should get voters elections", async function () {
		// add a voter
		await hardhatToken.connect(voter1).addVoter();
		
		// create 2 elections and assign them to the voter
		await hardhatToken.connect(admin).createElection("Test Election 1", 1648886400, 1648972800);
		await hardhatToken.connect(admin).createElection("Test Election 2", 1648886400, 1648972800);
		await hardhatToken.connect(admin).addVoterToElection(voter1.address,0);
		await hardhatToken.connect(admin).addVoterToElection(voter1.address, 1);

		// check if the elections assigned to the voter
		const elections = await hardhatToken.connect(voter1).getVotersElections();
		expect(elections[1]).to.equal(1);
		expect(elections[0]).to.equal(0);
	});

	// get voter (by admin)
	it("Should get voter", async function () {
		// add a voter
		await hardhatToken.connect(voter1).addVoter();

		// get voter
		const voter = await hardhatToken.connect(admin).voters(voter1.address);
		expect(voter[0]).to.equal('null');
		expect(voter[1]).to.equal('null');
	});

	// get Election Committee Members array length
	it("Should get Election Committee Members array length", async function () {
		// add a committee member
		hardhatToken.connect(admin).addElectionCommitteeMember(committee.address);

		// get Election Committee Members array length
		const length = await hardhatToken.connect(admin).getElectionCommitteeMembersLength();
		expect(length).to.equal(1);
	});

	// get Election Committee Member details
	it("Should get Election Committee Member details", async function () {
		// add a committee member
		await hardhatToken.connect(admin).addElectionCommitteeMember(committee.address, "Test Committee Member");
		
		// get Election Committee Member details
		let details = await hardhatToken.connect(admin).getElectionCommitteeMemberDetails(committee.address);
		expect(details.wallet).to.equal(committee.address);
	});

	// get election details
	it("Should get election details", async function () {
		// create election
		await hardhatToken.connect(admin).createElection("Test Election", 1648886400, 1648972800);

		// get election details
		let electionDetails = await hardhatToken.connect(admin).getElectionDetails(0);
		expect(electionDetails.name).to.equal("Test Election");
	});

	// get candidate details
	it("Should get candidate details", async function () {
		// add a district
		await hardhatToken.connect(admin).addDistrict("Test District", "01");

		// add a candidate
		await hardhatToken.connect(admin).addCandidate("Test Candidate", "01", candidate.address);

		// get candidate details
		let candidateDetails = await hardhatToken.connect(admin).getCandidateDetails(candidate.address);
		expect(candidateDetails.name).to.equal("Test Candidate");
	});

	// get district details
	it("Should get district details", async function () {
		// add a district
		await hardhatToken.connect(admin).addDistrict("Test District", "01");

		// get district details
		let districtDetails = await hardhatToken.connect(admin).getDistrictDetails("01");
		expect(districtDetails.districtID).to.equal("01");
	});


 });


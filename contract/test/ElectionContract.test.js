const { chain, adminAccount, contractInstance } = require("../../chain");
const { voterAccounts, candidateAccounts, electionCommitteeAccounts } = require("./accounts.js");
const fs = require("fs");
const path = require("path");
const chai = require('chai');
const dotenv = require("dotenv");
dotenv.config();

// Check contract deployed via ElectionContract.address file
if (!fs.existsSync(path.join(process.env.BUILD_PATH, process.env.CONTRACT_NAME + ".address"))) {
	console.error("Contract not deployed");
	process.exit(1);
}

// Test cases of ElectionContract contract
describe('ElectionContract', function () {
	// add/remove election commitee
	it("Should set admin correctly", async function () {
		const contractAdmin = await contractInstance.methods.admin().call();
		chai.expect(contractAdmin).to.equal(adminAccount.address);
	});
	/*
		// add/remove election commitee
		it("Should set admin correctly", async function () {
			let addr = await hardhatToken.connect(admin).admin();
			expect(addr).to.equal(admin.address);
		});
	*/
	// add election commitee
	it("Should add election committee members", async function () {
		// increase timeout
		this.timeout(10000);

		const member = electionCommitteeAccounts[0];

		// Create raw transaction
		let rawTx = {
			from: adminAccount.address,
			to: contractInstance.options.address,
			data: contractInstance.methods.addElectionCommitteeMember(member.address, "Test Election Committee Member #0").encodeABI(),
		};

		// estimate gas
		const gasEstimate = await chain.eth.estimateGas(rawTx).catch((err) => {
			console.error("Error estimating gas:", err);
			return;
		});
	
		// convert gas estimate and set gas limit, gas price
		const _gasLimit = chain.utils.numberToHex(gasEstimate);
		rawTx.gasLimit = _gasLimit;
		rawTx.gasPrice = "0x0";
	
		// sign transaction
		const signedTx = await adminAccount.signTransaction(rawTx);

		// send transaction
		const txr = await chain.eth.sendSignedTransaction(signedTx.rawTransaction);
		chai.expect(Number(txr.status)).to.equal(1);

		// check if the member added
		const isMemberExists = await contractInstance.methods.isElectionComitteMemberExists(member.address).call();
		chai.expect(isMemberExists).to.equal(true);
	});
	// remove election commitee
	it("Should remove election committee members", async function () {
		// increase timeout
		this.timeout(10000);

		const member = electionCommitteeAccounts[0];

		// Create raw transaction
		let rawTx = {
			from: adminAccount.address,
			to: contractInstance.options.address,
			data: contractInstance.methods.removeElectionCommitteeMember(member.address).encodeABI(),
		};

		// estimate gas
		const gasEstimate = await chain.eth.estimateGas(rawTx).catch((err) => {
			console.error("Error estimating gas:", err);
			return;
		});
	
		// convert gas estimate and set gas limit, gas price
		const _gasLimit = chain.utils.numberToHex(gasEstimate);
		rawTx.gasLimit = _gasLimit;
		rawTx.gasPrice = "0x0";
	
		// sign transaction
		const signedTx = await adminAccount.signTransaction(rawTx);

		// send transaction
		const txr = await chain.eth.sendSignedTransaction(signedTx.rawTransaction);
		chai.expect(Number(txr.status)).to.equal(1);

		// check if the member added
		const isMemberExistsAfterRemove = await contractInstance.methods.isElectionComitteMemberExists(member.address).call();
		chai.expect(isMemberExistsAfterRemove).to.equal(false);
	});
	/*
		// add/remove election commitee
		it("Should add and remove election committee members", async function () {
			await hardhatToken.connect(admin).addElectionCommitteeMember(commitee.address, "Test Committee Member");
			expect(await hardhatToken.connect(commitee).isElectionComitteMemberExists(commitee.address)).to.equal(true);

			await hardhatToken.connect(admin).removeElectionCommitteeMember(commitee.address);
			expect(await hardhatToken.connect(commitee).isElectionComitteMemberExists(commitee.address)).to.equal(false);
		});
	*/
	/*
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
	*/
	/*
		// add committe member to election (by admin)
		it("Should add a committe member to an election", async function () {
			// creating election then adding a commite member
			await hardhatToken.connect(admin).createElection("Test Election", 1648886400, 1648972800);
			await hardhatToken.connect(admin).addElectionCommitteeMember(commitee.address, "Test Committee Member");

			// adding the committe member to the election
			await hardhatToken.connect(admin).addElectionCommitteeMemberToElection(commitee.address, 0);

			// check if the member added to the election
			let electionContent = await hardhatToken.connect(admin).getElectionDetails(0);
			let committeeMember = await electionContent.electionCommittee[0];
			expect(committeeMember).to.equal(commitee.address);
		});
	*/
	/*
		// remove committe member from election (by admin)
		it("Should remove a committe member from an election", async function () {
			// creating election then adding a commite member
			await hardhatToken.connect(admin).createElection("Test Election", 1648886400, 1648972800);
			await hardhatToken.connect(admin).addElectionCommitteeMember(commitee.address, "Test Committee Member");

			// adding the committe member to the election
			await hardhatToken.connect(admin).addElectionCommitteeMemberToElection(commitee.address, 0);

			// removing the committe member to the election
			await hardhatToken.connect(admin).removeElectionCommitteeMemberFromElection(commitee.address, 0);

			// check if the member removed to the election
			let electionContent = await hardhatToken.connect(admin).getElectionDetails(0);
			let committeeMember = await electionContent.electionCommittee;
			expect(committeeMember.length).to.equal(0);
		});
	*/
	/*
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
	*/
	/*
		// add district (by admin)
		it("Should add a new district", async function () {
			// add a district
			await hardhatToken.connect(admin).addDistrict("Test District", "01");
			const district = await hardhatToken.connect(admin).districts("01");
			console.log(district);
			expect(district.name).to.equal("Test District");
			expect(district.districtID).to.equal("01");
			expect(await hardhatToken.connect(admin).isDistrictExists("01")).to.equal(true);
		});
	*/
	/*
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
	*/
	/*
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
	*/
	/*
		// remove district (by admin)
		it("Should remove a district", async function () {
			// add a district
			await hardhatToken.connect(admin).addDistrict("Test District", "01");

			// remove district
			await hardhatToken.connect(admin).removeDistrict("01");

			// check if the district removed
			expect(await hardhatToken.connect(admin).isDistrictExists("01")).to.equal(false);
		});
	*/
	/*
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
	*/
	/*
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
	*/
	/*
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
	*/
	/*
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
	*/
	/*
		// add voter
		it("Should add a new voter", async function () {
			// voter adds itself
			await hardhatToken.connect(voter1).addVoter();

			// check if the voter is added
			expect(await hardhatToken.connect(admin).isVoterExists(voter1.address)).to.equal(true);
		});
	*/
	/*
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
	*/
	/*
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
			let voterElections = await hardhatToken.connect(voter1).getVotersElections();

			expect(voterElections.length).to.equal(0);
		});
	*/
	/*
		// remove voter (by admin)
		it("Should remove voter", async function () {
			// voter adds itself then admin removes voter
			await hardhatToken.connect(voter1).addVoter();
			await hardhatToken.connect(admin).removeVoter(voter1.address);
			const isExist = await hardhatToken.connect(admin).isVoterExists(voter1.address);

			// check if voter exist (should be false)
			expect(isExist).to.equal(false);
		});
	*/
	/*
		// update voter's elections (by admin)
		it("Should update voters elections", async function () {
			await hardhatToken.connect(admin).admin();
	
			// admin creates election and updates voter1's elections
			await hardhatToken.connect(admin).createElection("Test Election", 1648886400, 1648972800);
			await hardhatToken.connect(voter1).addVoter();
			await hardhatToken.connect(admin).updateVotersElections(0, voter1.address);
			const voter = await hardhatToken.connect(admin).getVoters(voter1.address);
			// voter1's girst election's id should be 0
			expect(voter.election_ids[0]).to.equal(0);
		});
	*/
	/*
		// get voter's elections
		// should assign some elections to a voter and check if the elections has been assigned
		it("Should get voters elections", async function () {
			await hardhatToken.connect(admin).admin();
	
			await hardhatToken.connect(voter1).addVoter();
			await hardhatToken.connect(admin).createElection("Test Election 1", 1648886400, 1648972800);
			await hardhatToken.connect(admin).createElection("Test Election 2", 1648886400, 1648972800);
			await hardhatToken.connect(admin).updateVotersElections(0, voter1.address);
			await hardhatToken.connect(admin).updateVotersElections(1, voter1.address);
			const elections = await hardhatToken.connect(voter1).getVotersElections();
			expect(elections[1]).to.equal(1);
		});
	*/
	/*
		// only admin should add/remove commitee members
		it("Should not allow non-admin to add/remove election committee member", async function () {
			await hardhatToken.connect(admin).addElectionCommitteeMember(commitee.address);
			await expect(hardhatToken.connect(commitee).addElectionCommitteeMember(voter1.address)).to.be.revertedWith("Only admin can call this function");
			await expect(hardhatToken.connect(commitee).removeElectionCommitteeMember(voter2.address)).to.be.revertedWith("Only admin can call this function");
		});
	*/
	/*
		// only admin should add district
		it("Should not allow non-admin to add district", async function () {
			await hardhatToken.connect(admin).addElectionCommitteeMember(commitee.address);
	
			await expect(hardhatToken.connect(commitee).addDistrict(0, "Test District", "01")).to.be.revertedWith("Only admin can call this function");
		});
	*/
	/*
		// only admin should add candidate
		it("Should not allow non-admin to add candidate", async function () {
			await hardhatToken.connect(admin).addElectionCommitteeMember(commitee.address);
			await expect(hardhatToken.connect(commitee).addCandidate(0, "Test Candidate", "01", voter1.address)).to.be.revertedWith("Only admin can call this function");
		});
	*/
	/*
		// only admin should remove voters
		it("Should not allow non-admin to remove voter", async function () {
			await hardhatToken.connect(admin).addElectionCommitteeMember(commitee.address);
			await expect(hardhatToken.connect(commitee).removeVoter(voter1.address)).to.be.revertedWith("Only admin can call this function");
		});
	*/
	/*
		// only admin should update voters elections
		it("Should not allow non-election committee member to update voters elections", async function () {
			await hardhatToken.connect(voter1).addVoter();
			await expect(hardhatToken.connect(voter1).updateVotersElections(0, voter1.address)).to.be.revertedWith("Only admin or election committee members can call this function");
		});
	*/
	/*
		// only admin should create election
		it("Should not allow non-election committee member to create election", async function () {
			await hardhatToken.connect(voter1).addVoter();
			await expect(hardhatToken.connect(voter1).createElection("Test Election", 1648886400, 1648972800)).to.be.revertedWith(
				"Only admin or election committee members can call this function"
			);
		});
	*/
	/*
		// only admin should add/remove election committee member
		it("Should not allow non-registered voter to get voters elections", async function () {
			await expect(hardhatToken.connect(voter1).getVotersElections()).to.be.revertedWith("User not exist");
		});
	*/
});
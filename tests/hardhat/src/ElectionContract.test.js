// const { expect } = require("chai"); // assertion library

// // declaring test suit using Mocha's describe function
// describe("ElectionContract", function () {
//   let ElectionContract; // holds the contract factory, which is used to deploy the contract
//   let electionContract; // holds the deployed instance of the contract
//   let owner, addr1; // holds the first signer account, which is the deployer account

//   beforeEach(async function () {
//     [owner, addr1, addr2] = await ethers.getSigners(); // we only need the first signer, so we use array destructuring to assign it to owner var
//     ElectionContract = await ethers.getContractFactory("ElectionContract"); // returns a factory object that can be used to deploy the contract
//     electionContract = await ElectionContract.deploy(); // function deploys the contract and returns a promise that resolves to the deployed contract instance
//   });

//   // create election
//   it("Should create an election", async function () {
//     await electionContract.createElection("Test Election"); // function creates a new election with the given name
//     const election = await electionContract.elections(0); // Retrieves the first election from the contract
//     expect(election.name).to.equal("Test Election");
//   });

//   // add district
//   it("should add a district", async function () {
//     await electionContract.createElection("Test Election"); // function creates a new election with the given name
//     await electionContract.addDistrict(0, "Test District", "00");
//     const district = await electionContract.districts(0);
//     expect(district.name).to.equal("Test District");
//     expect(district.id).to.equal("00");
//   });

//   // add candidate
//   it("should add a candidate", async function () {
//     await electionContract.createElection("Test Election"); // function creates a new election with the given name
//     await electionContract.addDistrict(0, "Test District", "01"); // function creates a new election with the given name
//     await electionContract.addCandidate(0, "Test Candidate", "01", addr1.address);
//     const candidate = await electionContract.candidates(0);

//     expect(candidate.name).to.equal("Test Candidate");
//     expect(candidate.district_id).to.equal("01");
//     expect(candidate.wallet_id).to.equal(addr1.address);
//   });

//   // add voter
//   it("should add a voter", async function () {
//     await electionContract.createElection("Test Election"); // function creates a new election with the given name

//     let isExist = await electionContract.voter_exists(owner.address);
//     expect(isExist).to.equal(false);

//     await electionContract.addVoter();
//     isExist = await electionContract.voter_exists(owner.address);
//     expect(isExist).to.equal(true);

//   });

//   // update voters's elections with owner account address
//   it("should update voter elections", async function () {
//     await electionContract.createElection("Test Election"); // function creates a new election with the given name
//     await electionContract.addVoter();
//     await electionContract.updateVotersElections(0, owner.address);
//     const test_voter = await electionContract.getVoters(owner.address);
//     expect(test_voter.election_ids.length).to.equal(1);

    
//     //expect(eleids).to.revertedWith("Voter can't enter any election");
//   });

//   it("should get voter elections", async function () {
//     await electionContract.createElection("Test Election"); // function creates a new election with the given name
//     await electionContract.addVoter();
//     await electionContract.updateVotersElections(0, owner.address);

//     let elecIds = await electionContract.getVotersElections();    
    
//     expect(elecIds.length).to.equal(1);
//   });
  
// });



// describe("ElectionContract2", function () {
//   let ElectionContract; // holds the contract factory, which is used to deploy the contract
//   let electionContract; // holds the deployed instance of the contract
//   let owner; // holds the first signer account, which is the deployer account
//   let hardhatToken = null;
//   beforeEach(async function () {
//     [owner, addr1, addr2] = await ethers.getSigners(); // we only need the first signer, so we use array destructuring to assign it to owner var
//     ElectionContract = await ethers.getContractFactory("ElectionContract"); // returns a factory object that can be used to deploy the contract
//     // electionContract = await ElectionContract.deploy(); // function deploys the contract and returns a promise that resolves to the deployed contract instance
//     hardhatToken = await ethers.deployContract("ElectionContract");

//   });

//   // update voter's elections with different account address (addr1)
//   it("should update voter elections", async function () {
//     await hardhatToken.connect(addr1).createElection("Test Election");
//     await hardhatToken.connect(addr1).addVoter();
//     await hardhatToken.connect(addr1).updateVotersElections(0, addr1.address);
//     const test_voter = await hardhatToken.connect(addr1).getVoters(addr1.address);
//     expect(test_voter.election_ids.length).to.equal(1);

    
//     //expect(eleids).to.revertedWith("Voter can't enter any election");
//   });
  
// });


// test/electionContract.test.js

const { expect } = require("chai");

describe("ElectionContract", function () {
  let ElectionContract;
  let electionContract;
  let admin;
  let commitee;
  let voter1;
  let voter2;

  beforeEach(async function () {
    [admin, commitee, voter1, voter2] = await ethers.getSigners();
    ElectionContract = await ethers.getContractFactory("ElectionContract"); // returns a factory object that can be used to deploy the contract
    hardhatToken = await ethers.deployContract("ElectionContract");
  });

  // add/remove election commitee
  it("Should set admin correctly", async function () {
    expect(await hardhatToken.connect(admin).admin()).to.equal(admin.address);
  });

  it("Should add and remove election committee members", async function () {
    await hardhatToken.connect(admin).addElectionCommitteeMember(commitee.address);
    expect(await hardhatToken.connect(commitee).electionCommitteeMembers(commitee.address)).to.equal(true);

    await hardhatToken.connect(admin).removeElectionCommitteeMember(commitee.address);
    expect(await hardhatToken.connect(commitee).electionCommitteeMembers(commitee.address)).to.equal(false);
  });

  // create election
  it("Should allow admin or election committee to create election", async function () {
    await hardhatToken.connect(admin).admin();

    // Add election committee member by admin
    await hardhatToken.connect(admin).addElectionCommitteeMember(commitee.address);
    
    // Create election by admin
    await hardhatToken.connect(admin).createElection("Admin Election", 1648886400, 1648972800);
    let adminElection = await hardhatToken.connect(admin).elections(0);
    expect(adminElection.name).to.equal("Admin Election");
    expect(adminElection.startDate).to.equal(1648886400);
    expect(adminElection.endDate).to.equal(1648972800);

    // checking if the election has been created
    let electionsLength = await hardhatToken.getElectionsLength();
    expect(parseInt(electionsLength)).to.equal(1);

    // Create election by election committee member
    await hardhatToken.connect(commitee).createElection("Comitee Election", 1648886400, 1648972800);
    const commiteeElection = await hardhatToken.connect(commitee).elections(1); 
    expect(commiteeElection.name).to.equal("Comitee Election");
    expect(commiteeElection.startDate).to.equal(1648886400);
    expect(commiteeElection.endDate).to.equal(1648972800);
  });
  
  // add district (by admin)
  it("Should add district", async function () {
    await hardhatToken.connect(admin).admin();
    await hardhatToken.connect(admin).createElection("Test Election", 1648886400, 1648972800);

    await hardhatToken.connect(admin).addDistrict(0, "Test District", "01");
    const district = await hardhatToken.connect(admin).districts(0);
    expect(district.name).to.equal("Test District");
    expect(district.id).to.equal("01");
  });

  // add candidate (by admin)
  it("Should add candidate", async function () {
    await hardhatToken.connect(admin).admin();
    await hardhatToken.connect(admin).createElection("Test Election", 1648886400, 1648972800);

    await hardhatToken.connect(admin).addCandidate(0, "Test Candidate", "01", voter1.address);
    const candidate = await hardhatToken.connect(admin).candidates(0);
    expect(candidate.name).to.equal("Test Candidate");
    expect(candidate.district_id).to.equal("01");
    expect(candidate.wallet_id).to.equal(voter1.address);
  });

  // add voter 
  it("Should add voter", async function () {
    await hardhatToken.connect(voter1).addVoter();
    expect(await hardhatToken.connect(voter1).voter_exists(voter1.address)).to.equal(true);
  });

  // remove voter (by admin)
  it("Should remove voter", async function () {
    await hardhatToken.connect(admin).admin();
    // voter adds itself then admin removes voter and check if voter exist (should be false) 
    await hardhatToken.connect(voter1).addVoter();
    await hardhatToken.connect(admin).removeVoter(voter1.address);
    expect(await hardhatToken.connect(voter1).voter_exists(voter1.address)).to.equal(false);
  });

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



  
  // only admin should add/remove commitee members
  it("Should not allow non-admin to add/remove election committee member", async function () {
    await hardhatToken.connect(admin).addElectionCommitteeMember(commitee.address);
    await expect(hardhatToken.connect(commitee).addElectionCommitteeMember(voter1.address)).to.be.revertedWith("Only admin can call this function");
    await expect(hardhatToken.connect(commitee).removeElectionCommitteeMember(voter2.address)).to.be.revertedWith("Only admin can call this function");
  });

  // only admin should add district
  it("Should not allow non-admin to add district", async function () {
  await hardhatToken.connect(admin).addElectionCommitteeMember(commitee.address);

  await expect(hardhatToken.connect(commitee).addDistrict(0, "Test District", "01")).to.be.revertedWith("Only admin can call this function");
  });

  // only admin should add candidate
  it("Should not allow non-admin to add candidate", async function () {
  await hardhatToken.connect(admin).addElectionCommitteeMember(commitee.address);
  await expect(hardhatToken.connect(commitee).addCandidate(0, "Test Candidate", "01", voter1.address)).to.be.revertedWith("Only admin can call this function");
  });

  // only admin should remove voters
  it("Should not allow non-admin to remove voter", async function () {
  await hardhatToken.connect(admin).addElectionCommitteeMember(commitee.address);
  await expect(hardhatToken.connect(commitee).removeVoter(voter1.address)).to.be.revertedWith("Only admin can call this function");
  });

  
  it("Should not allow non-election committee member to update voters elections", async function () {
  await hardhatToken.connect(voter1).addVoter();
  await expect(hardhatToken.connect(voter1).updateVotersElections(0, voter1.address)).to.be.revertedWith("Only admin or election committee members can call this function");
  });
  
  it("Should not allow non-election committee member to create election", async function () {
  await hardhatToken.connect(voter1).addVoter();
  await expect(hardhatToken.connect(voter1).createElection("Test Election", 1648886400, 1648972800)).to.be.revertedWith("Only admin or election committee members can call this function");
  });

  it("Should not allow non-registered voter to get voters elections", async function () {
    await expect(hardhatToken.connect(voter1).getVotersElections()).to.be.revertedWith("User not exist");
    });
});
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ElectionContract {
    struct Election {
        uint id;
        string name;
        uint[] districtIndices;
        uint[] candidateIndices;
        uint256 startDate;
        uint256 endDate;
    }

    struct District {
        string name;
        string id; // string because we can give id like "00", "01" etc.
    }

    struct Candidate {
        string name;
        string district_id;
        address wallet_id;
    } 

    struct Voter {
        uint[] election_ids;
        string[] district_id;
    }

    Election[] public elections;
    District[] public districts;
    Candidate[] public candidates;
    mapping(address => Voter) voters;
    mapping(address => bool) public voter_exists;

    // Constructor to set the initial admin
    constructor() {
        admin = msg.sender;
    }

    // Function to add a new election committee member
    function addElectionCommitteeMember(address _member) public onlyAdmin {
        electionCommitteeMembers[_member] = true;
    }

    // Function to remove an election committee member
    function removeElectionCommitteeMember(address _member) public onlyAdmin {
        electionCommitteeMembers[_member] = false;
    }

    function createElection(
        string memory _name,
        uint256 _startDate,
        uint256 _endDate
    ) public onlyAdminOrElectionCommittee{
        uint electionId = elections.length;
        // Initialize empty arrays for district and candidate indices
        uint[] memory emptyDistrictIndices;
        uint[] memory emptyCandidateIndices;
        Election memory election = Election(
            electionId,
            _name,
            emptyDistrictIndices,
            emptyCandidateIndices,
            _startDate,
            _endDate
        );
        elections.push(election);
    }

    // adding a new district to a specific election
    // create new District struct, add it to the districts array, and update the district indices for the specified election
    function addDistrict(
        uint _electionId,
        string memory _name,
        string memory _id
    ) public onlyAdmin{
        require(_electionId < elections.length, "Invalid election ID");
        uint districtIndex = districts.length;
        districts.push(District(_name, _id));
        elections[_electionId].districtIndices.push(districtIndex);
    }

    // adding a new candidate to a specific election
    // create new Candidate struct, add it to the candidates array, and update the candidate indices for the specified election
    function addCandidate(
        uint _electionId,
        string memory _name,
        string memory _district_id,
        address _wallet_id
    ) public onlyAdmin{
        require(_electionId < elections.length, "Invalid election ID");
        uint candidateIndex = candidates.length;
        candidates.push(Candidate(_name, _district_id, _wallet_id));
        elections[_electionId].candidateIndices.push(candidateIndex);
    }

    // Function to add a new voter
    // voter calls this function itself so no access control 
    function addVoter() public {
        require(!voter_exists[msg.sender], "User already registered");
        // Initialize an empty array for election ids and districts
        uint[] memory emptyElectionIds;
        string[] memory emptyDistrictArray;
        // Create a new Voter struct and assign it to the sender's address in the voters mapping
        Voter memory voter = Voter(emptyElectionIds, emptyDistrictArray);
        voters[msg.sender] = voter;
        voter_exists[msg.sender] = true;
    }

    // Function to remove a voter
    // check if the voter exists then delete from the mapping 
    function removeVoter(address _voterAddress) public onlyAdmin {
        require(voter_exists[_voterAddress], "Voter does not exist");
        delete voters[_voterAddress];
        delete voter_exists[_voterAddress];
    }

    // Function to update the elections a voter can participate in
    function updateVotersElections(uint _electionId, address _walletId) public onlyAdminOrElectionCommittee{
        require(voter_exists[_walletId], "User not exist");
        require(_electionId < elections.length, "Invalid election ID");

        voters[_walletId].election_ids.push(_electionId);
    }

    // Function to get the elections a voter can participate in
    // user can call this function see their elections that they can participate
    function getVotersElections() public view returns (uint[] memory){
        require(voter_exists[msg.sender], "User not exist");
        require(
            voters[msg.sender].election_ids.length != 0,
            "Voter can't enter any election"
        );
        // Return the array of election IDs the voter can participate in
        return voters[msg.sender].election_ids;
    }

    // Function to get the voter details for a given address
    function getVoters(address _address) public onlyAdmin view returns (Voter memory) {
        return voters[_address];
    }

    function getElectionsLength() public view returns (uint) {
        return elections.length;
    }

    address public admin;
    mapping(address => bool) public electionCommitteeMembers;

    // Modifier to restrict access to admins only
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    // Modifier to restrict access to election committee members only
    modifier onlyElectionCommittee() {
        require(
            electionCommitteeMembers[msg.sender],
            "Only election committee members can call this function"
        );
        _;
    }

    modifier onlyAdminOrElectionCommittee() {
    require(
        msg.sender == admin || electionCommitteeMembers[msg.sender],
        "Only admin or election committee members can call this function"
    );
    _;
}

  

    // function allows a voter to cast their vote in a specific election for a particular candidate
    // function vote(uint _electionId, uint _candidateIndex) public {
    //     require(_electionId < elections.length, "Invalid election ID");
    //     require(
    //         _candidateIndex < elections[_electionId].candidateIndices.length,
    //         "Invalid candidate index"
    //     );
    //     require(address(voters[msg.sender].wallet_id).balance != 0, "You already voted");
    //     require(address(voters[msg.sender].wallet_id).balance > 1, "You already voted");
    //     // Additional checks for ensuring voter eligibility, preventing multiple votes, etc.

    //     voters[msg.sender].election_ids.push(_electionId);  // msg.sender represents the address of the account that called the current function
    //     // Record the vote
    // }

    // function getElectionResults(uint _electionId) public view returns (uint[] memory) {
    //     require(_electionId < elections.length, "Invalid election ID");

    //     uint[] memory results;
    //     uint[] memory candidateIndices = elections[_electionId].candidateIndices;

    //     for (uint i = 0; i < candidateIndices.length; i++) {
    //         uint candidateIndex = candidateIndices[i];
    //         // Here, you can retrieve specific information about candidates, such as votes received
    //         // For simplicity, let's just store the candidate index in the results array
    //         results[i] = candidateIndex;
    //     }

    //     return results;
    // }
}

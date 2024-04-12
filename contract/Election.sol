// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ElectionContract {
    struct Admin {
        address wallet;
    }

    struct ElectionCommittee {
        uint id;
        string name;
        address wallet;
    }

    struct Election {
        uint id;
        string name;
        string[] districtIDs;
        address[] candidateAddresses;
        uint256 startDate;
        uint256 endDate;
        ElectionCommittee[] electionCommittee;
    }

    struct District {
        string name; // name of the district like "County, City, Municipality, Neighborhood".
        string districtID; // district id like "00-01-01-01"
    }

    struct Candidate {
        string name; // name of the candidate
        address wallet; // wallet address of the candidate
        District district; // district of the candidate
    }

    struct Voter {
        District district;
        uint[] electionIDs;
    }

    Admin public admin; // admin details

    uint public electionCommitteeMemberCounter; // counter to keep track of the number of election committee members
    mapping(address => ElectionCommittee) electionCommitteeMembers; // election committee member address to election committee member details
    mapping(address => bool) public isElectionComitteMemberExists; // election committee member address to check if election committee member exists

    uint public electionCounter; // counter to keep track of the number of elections
    mapping(uint => Election) public elections; // election id to election details
    mapping(uint => bool) public isElectionExists; // election id to check if election exists

    mapping(string => District) public districts; // district id like "00-01-01-01" to district details
    mapping(string => bool) public isDistrictExists; // district id to check if district exists

    mapping(address => Candidate) public candidates; // candidate id to candidate details
    mapping(address => bool) public isCandidateExists; // candidate address to check if candidate exists

    mapping(address => Voter) voters; // voter address to voter details
    mapping(address => bool) public isVoterExists; // voter address to check if voter exists

    // Modifier to restrict access to admins only
    modifier onlyAdmin() {
        require(msg.sender == admin.wallet, "Only admin can call this function");
        _;
    }

    // Modifier to restrict access to election committee members only
    modifier onlyElectionCommittee() {
        require(isElectionComitteMemberExists[msg.sender], "Only election committee members can call this function");
        _;
    }

    // Constructor to set the initial admin
    constructor() {
        // Set election counter to 0 for fresh deployment
        electionCounter = 0;
        // Set election committee member counter to 0 for fresh deployment
        electionCommitteeMemberCounter = 0;
        // Set the admin to the address that deploys the contract
        admin.wallet = msg.sender;
    }

    // Function to add a new election committee member
    function addElectionCommitteeMember(address _member, string memory _name) public onlyAdmin {
        // Check if the member already exists
        require(!isElectionComitteMemberExists[_member], "Member already registered");
        // If not, add the member to the mappings
        isElectionComitteMemberExists[_member] = true;
        electionCommitteeMembers[_member] = ElectionCommittee(++electionCommitteeMemberCounter, _name, _member);
    }

    // Function to remove an election committee member
    function removeElectionCommitteeMember(address _member) public onlyAdmin {
        // Check if the member exists
        require(isElectionComitteMemberExists[_member], "Member does not exist");
        // If yes, delete the member from the mappings
        delete electionCommitteeMembers[_member];
        delete isElectionComitteMemberExists[_member];
    }

    // Function to create a new election for admin
    function createElection(string memory _name, uint256 _startDate, uint256 _endDate, address _member) public onlyAdmin {
        // Check if the member exists
        require(isElectionComitteMemberExists[_member], "Member does not exist");

        // Initialize empty arrays for district and candidate indices
        string[] memory emptyDistricts;
        address[] memory emptyCandidates;

        // Create a new ElectionCommittee array and add the specified member to it
        ElectionCommittee[] memory electionCommittee;
        electionCommittee.push(electionCommitteeMembers[_member]);

        // Create a new Election struct and add it to the elections array
        elections[electionCounter] = Election(
            ++electionCounter, // Increment the election counter then assign it to the election ID
            _name, // Election name
            emptyDistricts, // Empty array for district indices
            emptyCandidates, // Empty array for candidate indices
            _startDate, // Election start date in seconds
            _endDate, // Election end date in seconds
            electionCommittee // Election committee members array
        );
    }

    // Function to create a new election for election committee members
    function createElection(string memory _name, uint256 _startDate, uint256 _endDate) public onlyElectionCommittee {
        // Check if the member exists
        require(isElectionComitteMemberExists[msg.sender], "Member does not exist. Submit to admin for approval.");

        // Initialize empty arrays for district and candidate indices
        string[] memory emptyDistricts;
        address[] memory emptyCandidates;

        // Create a new ElectionCommittee array and add the specified member to it
        ElectionCommittee[] memory electionCommittee;
        electionCommittee.push(electionCommitteeMembers[msg.sender]);

        elections[electionCounter] = Election(
            ++electionCounter, // Increment the election counter then assign it to the election ID
            _name, // Election name
            emptyDistricts, // Empty array for district indices
            emptyCandidates, // Empty array for candidate indices
            _startDate, // Election start date in seconds
            _endDate, // Election end date in seconds
            electionCommittee // Election committee members array
        );
    }

    // Function to remove an election
    function removeElection(uint _electionId) public onlyAdmin {
        // Check if the election id range
        require(_electionId < elections.length, "Invalid election ID");
        // Check if the election exists
        require(isElectionExists[_electionId], "Election does not exist");

        // If yes, delete the election from the mappings
        delete elections[_electionId];
    }

    // Function to add a new district for admin
    function addDistrict(string memory _name, string memory _id) public onlyAdmin {
        // Check if the district already exists
        require(!isDistrictExists[_name], "District already exists");
        
        // If not, add the district to the mappings
        isDistrictExists[_name] = true;
        districts[_name] = District(_name, _id);
    }

    // adding a new district to a specific election
    // create new District struct, add it to the districts array, and update the district indices for the specified election
    // Function to add a new district for election committee members
    function addDistrict(string memory _name, string memory _id) public onlyElectionCommittee {
        // Check if the district already exists
        require(!isDistrictExists[_name], "District already exists");
        // Check if the member exists
        require(isElectionComitteMemberExists[msg.sender], "Member does not exist. Submit to admin for approval.");

        // If not, add the district to the mappings
        isDistrictExists[_name] = true;
        districts[_name] = District(_name, _id);
    }

    // Function to add district to an election for admin
    function addDistrictToElection(uint _electionId, string memory _districtId) public onlyAdmin {
        // Check if the election id range
        require(_electionId < elections.length, "Invalid election ID");
        // Check if the election exists
        require(isElectionExists[_electionId], "Election does not exist");
        // Check if the district exists
        require(isDistrictExists[_districtId], "District does not exist");

        // Add the district to the specified election
        elections[_electionId].districtIDs.push(_districtId);
    }

    // Function to add district to an election for election committee members
    function addDistrictToElection(uint _electionId, string memory _districtId) public onlyElectionCommittee {
        // Check if the election id range
        require(_electionId < elections.length, "Invalid election ID");
        // Check if the member exists
        require(isElectionComitteMemberExists[msg.sender], "Member does not exist. Submit to admin for approval.");
        // Check if the member is part of the election committee for the specified election
        bool committeeMemberCheckerFlag = false;
        for (uint i = 0; i < elections[_electionId].electionCommittee.length; i++) {
            if (elections[_electionId].electionCommittee[i].wallet == msg.sender) {
                committeeMemberCheckerFlag = true;
                break;
            }
        }
        require(committeeMemberCheckerFlag, "Member not part of the election committee for this election");
        // Check if the election exists
        require(isElectionExists[_electionId], "Election does not exist");
        // Check if the district exists
        require(isDistrictExists[_districtId], "District does not exist");
        
        // Add the district to the specified election
        elections[_electionId].districtIDs.push(_districtId);
    }

    // Function to remove a district
    function removeDistrict(string memory _name) public onlyAdmin {
        // Check if the district exists
        require(isDistrictExists[_name], "District does not exist");

        // If yes, delete the district from the mappings
        delete districts[_name];
        delete isDistrictExists[_name];
    }

    // adding a new candidate to a specific election
    // create new Candidate struct, add it to the candidates array, and update the candidate indices for the specified election
    // Function to add a new candidate for admin
    function addCandidate(string memory _name, string memory _districtID, address _wallet) public onlyAdmin {
        // Check if the candidate already exists
        require(!isCandidateExists[_wallet], "Candidate already registered");
        // Check if the district exists
        require(isDistrictExists[_districtID], "District does not exist");

        // If not, add the candidate to the mappings
        isCandidateExists[_wallet] = true;
        candidates[_wallet] = Candidate(_name, _wallet, districts[_districtID]);
    }

    // Function to add a new candidate for election committee members
    function addCandidate(string memory _name, string memory _districtID, address _wallet) public onlyElectionCommittee {
        // Check if the candidate already exists
        require(!isCandidateExists[_wallet], "Candidate already registered");
        // Check if the district exists
        require(isDistrictExists[_districtID], "District does not exist");
        // Check if the member exists
        require(isElectionComitteMemberExists[msg.sender], "Member does not exist. Submit to admin for approval.");

        // If not, add the candidate to the mappings
        isCandidateExists[_wallet] = true;
        candidates[_wallet] = Candidate(_name, _wallet, districts[_districtID]);
    }

    // Function to add candidate to an election for admin
    function addCandidateToElection(uint _electionId, address _wallet) public onlyAdmin {
        // Check if the election id range
        require(_electionId < elections.length, "Invalid election ID");
        // Check if the election exists
        require(isElectionExists[_electionId], "Election does not exist");
        // Check if the candidate exists
        require(isCandidateExists[_wallet], "Candidate does not exist");

        // Add the candidate to the specified election
        elections[_electionId].candidateAddresses.push(_wallet);
    }

    // Function to add candidate to an election for election committee members
    function addCandidateToElection(uint _electionId, address _wallet) public onlyElectionCommittee {
        // Check if the election id range
        require(_electionId < elections.length, "Invalid election ID");
        // Check if the member exists
        require(isElectionComitteMemberExists[msg.sender], "Member does not exist. Submit to admin for approval.");
        // Check if the member is part of the election committee for the specified election
        bool committeeMemberCheckerFlag = false;
        for (uint i = 0; i < elections[_electionId].electionCommittee.length; i++) {
            if (elections[_electionId].electionCommittee[i].wallet == msg.sender) {
                committeeMemberCheckerFlag = true;
                break;
            }
        }
        require(committeeMemberCheckerFlag, "Member not part of the election committee for this election");
        // Check if the election exists
        require(isElectionExists[_electionId], "Election does not exist");
        // Check if the candidate exists
        require(isCandidateExists[_wallet], "Candidate does not exist");

        // Add the candidate to the specified election
        elections[_electionId].candidateAddresses.push(_wallet);
    }

    // Function to remove a candidate from an election for admin
    function removeCandidateFromElection(uint _electionId, address _wallet) public onlyAdmin {
        // Check if the election id range
        require(_electionId < elections.length, "Invalid election ID");
        // Check if the election exists
        require(isElectionExists[_electionId], "Election does not exist");
        // Check if the candidate exists
        require(isCandidateExists[_wallet], "Candidate does not exist");

        // Find the index of the candidate in the candidateAddresses array
        uint index = 0;
        for (uint i = 0; i < elections[_electionId].candidateAddresses.length; i++) {
            if (elections[_electionId].candidateAddresses[i] == _wallet) {
                index = i;
                break;
            }
        }

        // Create a new array to store the candidate addresses
        address[] memory newCandidateAddresses = new address[](elections[_electionId].candidateAddresses.length - 1);

        // Assign the candidate addresses to the new array, excluding the candidate to be removed
        uint j = 0;
        uint k = 0;
        while (j < elections[_electionId].candidateAddresses.length) {
            if (j == index) {
                j++;
                continue;
            }
            newCandidateAddresses[k++] = elections[_electionId].candidateAddresses[j++];
        }

        // Update the candidateAddresses array with the new array
        elections[_electionId].candidateAddresses = newCandidateAddresses;
    }

    // Function to remove a candidate for admin
    function removeCandidate(address _wallet) public onlyAdmin {
        // Check if the candidate exists
        require(isCandidateExists[_wallet], "Candidate does not exist");

        // If yes, delete the candidate from the mappings
        delete candidates[_wallet];
        delete isCandidateExists[_wallet];
    }

    // TODO: Implement the following functions again
    // Function to add a new voter
    // voter calls this function itself so no access control
    function addVoter() public {
        require(!isVoterExists[msg.sender], "User already registered");
        // Initialize an empty array for election ids and districts
        uint[] memory emptyElectionIds;
        string[] memory emptyDistrictArray;
        // Create a new Voter struct and assign it to the sender's address in the voters mapping
        Voter memory voter = Voter(emptyElectionIds, emptyDistrictArray);
        voters[msg.sender] = voter;
        isVoterExists[msg.sender] = true;
    }

    // Function to remove a voter
    // check if the voter exists then delete from the mapping
    function removeVoter(address _voterAddress) public onlyAdmin {
        require(isVoterExists[_voterAddress], "Voter does not exist");
        delete voters[_voterAddress];
        delete isVoterExists[_voterAddress];
    }

    // Function to update the elections a voter can participate in
    function updateVotersElections(
        uint _electionId,
        address _walletId
    ) public onlyAdminOrElectionCommittee {
        require(isVoterExists[_walletId], "User not exist");
        require(_electionId < elections.length, "Invalid election ID");

        voters[_walletId].election_ids.push(_electionId);
    }

    // Function to get the elections a voter can participate in
    // user can call this function see their elections that they can participate
    function getVotersElections() public view returns (uint[] memory) {
        require(isVoterExists[msg.sender], "User not exist");
        require(
            voters[msg.sender].election_ids.length != 0,
            "Voter can't enter any election"
        );
        // Return the array of election IDs the voter can participate in
        return voters[msg.sender].election_ids;
    }

    // Function to get the voter details for a given address
    function getVoters(
        address _address
    ) public view onlyAdmin returns (Voter memory) {
        return voters[_address];
    }

    function getElectionsLength() public view returns (uint) {
        return elections.length;
    }

    // function allows a voter to cast their vote in a specific election for a particular candidate
    // function vote(uint _electionId, uint _candidateIndex) public {
    //     require(_electionId < elections.length, "Invalid election ID");
    //     require(
    //         _candidateIndex < elections[_electionId].candidateIndices.length,
    //         "Invalid candidate index"
    //     );
    //     require(address(voters[msg.sender].wallet).balance != 0, "You already voted");
    //     require(address(voters[msg.sender].wallet).balance > 1, "You already voted");
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

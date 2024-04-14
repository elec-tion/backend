// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

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
        address[] electionCommittee;
        uint256 startDate;      // in unix timestamp
        uint256 endDate;        // in unix timestamp
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

    Admin public admin; 

    uint public electionCommitteeMemberCounter; // counter to keep track of the number of election committee members
    mapping(address => ElectionCommittee) electionCommitteeMembers; // election committee member details with that specified member address
    mapping(address => bool) public isElectionComitteMemberExists; // to check if election committee member exists with that specified member address

    uint public electionCounter; // counter to keep track of the number of elections
    mapping(uint => Election) public elections; // election details with that specified election id
    mapping(uint => bool) public isElectionExists; // to check if election exists with that specified election id

    mapping(string => District) public districts; // district id like "00-01-01-01" to district details
    mapping(string => bool) public isDistrictExists; // to check if district exists with that specified district

    mapping(address => Candidate) public candidates; // candidate id to candidate details
    mapping(address => bool) public isCandidateExists; // to check if candidate exists with that specified candidate address

    mapping(address => Voter) voters; // voter details with that specified voter address
    mapping(address => bool) public isVoterExists; // to check if voter exists with that specified voter address


    // MODIFIERS
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
        electionCounter = 0;
        electionCommitteeMemberCounter = 0;
        // Set the admin to the address that deploys the contract
        admin.wallet = msg.sender;
        addElectionCommitteeMember(msg.sender, "admin");
    }

    // Function to add a new election committee member
    function addElectionCommitteeMember(address _member, string memory _name) public onlyAdmin {
        // Check if the member already exists. If not, add the member to the mappings
        require(!isElectionComitteMemberExists[_member], "Member already registered");

        isElectionComitteMemberExists[_member] = true;
        electionCommitteeMembers[_member] = ElectionCommittee(++electionCommitteeMemberCounter, _name, _member);
    }

    // Function to remove an election committee member
    function removeElectionCommitteeMember(address _member) public onlyAdmin {
        // Check if the member exists. If yes, delete the member from the mappings
        require(isElectionComitteMemberExists[_member], "Member does not exist");

        delete electionCommitteeMembers[_member];
        delete isElectionComitteMemberExists[_member];
    }

    // Function to create a new election -for admin-
    function createElection(string memory _name, uint256 _startDate, uint256 _endDate) public onlyAdmin {

        // Initialize empty arrays for districts, candidates  and members
        string[] memory emptyDistricts;
        address[] memory emptyCandidates;
        address[] memory emptyMembers;

        // Create a new Election struct and add it to the elections array
        elections[electionCounter] = Election(
            electionCounter, 
            _name, 
            emptyDistricts, 
            emptyCandidates, 
            emptyMembers,
            _startDate, // Election start date in seconds
            _endDate // Election end date in seconds
        );
        isElectionExists[electionCounter] = true;
        electionCounter = electionCounter + 1;
    }

    // Function to add a committe member to a specific election -for admin-
    function addElectionCommitteeMemberToElection(address _member, uint _electionId) public onlyAdmin {
        // Check if the member exists. 
        require(isElectionComitteMemberExists[_member], "Member does not exist");
        // Check if the election exists
        require(isElectionExists[_electionId], "Election does not exist");
        // check if that member is already assigned to that election
        for (uint i = 0; i < elections[_electionId].electionCommittee.length; i++) {
            if (elections[_electionId].electionCommittee[i] == _member) {
                require(false, "This committee member already assigned to this election.");
            }
        }

        elections[_electionId].electionCommittee.push(_member);
    }

    // Function to remove a committe member from a specific election -for admin-
    function removeElectionCommitteeMemberFromElection(address _member, uint _electionId) public onlyAdmin {
        // Check if the member exists. 
        require(isElectionComitteMemberExists[_member], "Member does not exist");
        // Check if the election exists
        require(isElectionExists[_electionId], "Election does not exist");

        // find the member that has been assigned to this election      
        uint index = 0;
        for (uint i = 0; i < elections[_electionId].electionCommittee.length; i++) {
            if (elections[_electionId].electionCommittee[i] == _member) {
                index = i;
                break;
            }
        }

        // Create a new array to store the committee members of the election
        address[] memory newElectionCommittee = new address[](elections[_electionId].electionCommittee.length - 1);

        // Assign the committee members of the election to the new array, excluding the adress of the member to be removed
        uint j = 0;
        uint k = 0;
        while (j < elections[_electionId].electionCommittee.length) {
            if (j == index) {
                j++;
                continue;
            }
            newElectionCommittee[k++] = elections[_electionId].electionCommittee[j++];
        }

        // Update the committee members array of the election with the new array
        elections[_electionId].electionCommittee = newElectionCommittee;

    }

    // Function to remove an election
    function removeElection(uint _electionId) public onlyAdmin {
        // Check if the election exists
        require(isElectionExists[_electionId], "Election does not exist");

        // If yes, delete the election from the mappings
        delete elections[_electionId];
    }

    // Function to add a new district -for admin-
    function addDistrict(string memory _name, string memory _id) public onlyAdmin {
        // Check if the district already exists
        require(!isDistrictExists[_id], "District already exists");
        
        // If not, add the district to the mappings
        isDistrictExists[_id] = true;
        districts[_id] = District(_name, _id);
    }


    // Function to add district to an election -for admin-
    // adding a district to a specific election
    function addDistrictToElection(uint _electionId, string memory _districtId) public onlyAdmin {
        // Check if the election exists & district exists
        require(isElectionExists[_electionId], "Election does not exist");
        require(isDistrictExists[_districtId], "District does not exist");

        // Add the district to the specified election
        elections[_electionId].districtIDs.push(_districtId);
    }

    // Function to remove a district from an election -for admin-
    function removeDistrictFromElection(uint _electionId, string memory _id) public onlyAdmin {
        // Check if the election exists
        require(isElectionExists[_electionId], "Election does not exist");
        // Check if the district exists
        require(isDistrictExists[_id], "District does not exist");

        // Find the index of the district in the districtIDs array
        uint index = 0;
        for (uint i = 0; i < elections[_electionId].districtIDs.length; i++) {
            if (keccak256(abi.encodePacked(elections[_electionId].districtIDs[i])) == keccak256(abi.encodePacked(_id))) {
                index = i;
                break;
            }
        }

        // Create a new array to store the district IDs
        string[] memory newDistrictIDs = new string[](elections[_electionId].districtIDs.length - 1);

        // Assign the district IDs to the new array, excluding the district to be removed
        uint j = 0;
        uint k = 0;
        while (j < elections[_electionId].districtIDs.length) {
            if (j == index) {
                j++;
                continue;
            }
            newDistrictIDs[k++] = elections[_electionId].districtIDs[j++];
        }

        // Update the districtIDs array with the new array
        elections[_electionId].districtIDs = newDistrictIDs;
    }

    // Function to remove a district
    function removeDistrict(string memory _id) public onlyAdmin {
        // Check if the district exists
        require(isDistrictExists[_id], "District does not exist");

        // If yes, delete the district from the mappings
        delete districts[_id];
        delete isDistrictExists[_id];
    }

    // adding a new candidate to a specific election
    // create new Candidate struct, add it to the candidates array, and update the candidate indices for the specified election
    // Function to add a new candidate for admin
    function addCandidate(string memory _name, string memory _districtID, address _wallet) public onlyAdmin {
        // Check if the candidate already exists & if the district exists
        require(!isCandidateExists[_wallet], "Candidate already registered");
        require(isDistrictExists[_districtID], "District does not exist");

        // If not, add the candidate to the mappings
        isCandidateExists[_wallet] = true;
        candidates[_wallet] = Candidate(_name, _wallet, districts[_districtID]);
    }

    // Function to add candidate to an election for admin
    function addCandidateToElection(uint _electionId, address _wallet) public onlyAdmin {
        // Check if the election exists
        require(isElectionExists[_electionId], "Election does not exist");
        // Check if the candidate exists
        require(isCandidateExists[_wallet], "Candidate does not exist");

        // Add the candidate to the specified election
        elections[_electionId].candidateAddresses.push(_wallet);
    }

    // Function to remove a candidate from an election for admin
    function removeCandidateFromElection(uint _electionId, address _wallet) public onlyAdmin {
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

    // Function to add a new voter
    // voter calls this function itself so no access control
    function addVoter() public {
        // check if the voter exists
        require(!isVoterExists[msg.sender], "User already registered");

        // Initialize an empty array for election ids
        uint[] memory emptyElectionIds;

        // Create a new Voter struct and assign it to the sender's address in the voters mapping
        isVoterExists[msg.sender] = true;
        voters[msg.sender] = Voter(District("null", "null"), emptyElectionIds);
    }

    // Function to remove a voter
    // check if the voter exists then delete from the mapping
    function removeVoter(address _voter) public onlyAdmin {
        // check if the voter exists. If yes, delete the voter
        require(isVoterExists[_voter], "Voter does not exist");

        delete voters[_voter];
        delete isVoterExists[_voter];
    }

    function addVoterToElection(address _voter, uint _electionId)  public onlyAdmin () {
        // Check if the election exists
        require(isElectionExists[_electionId], "Election does not exist");
        // check if the voter exists.
        require(isVoterExists[_voter], "Voter does not exist");

        // add voter's election
        voters[_voter].electionIDs.push(_electionId);
    }

    // Function to remove a voter from an election -for admin-
    function removeVoterFromElection(uint _electionId, address _voter) public onlyAdmin {
        // Check if the election exists
        require(isElectionExists[_electionId], "Election does not exist");
        // Check if the voter exists
        require(isVoterExists[_voter], "Voter does not exist");

        // Find the index of the voter in the voters array
        uint index = 0;
        for (uint i = 0; i < voters[_voter].electionIDs.length; i++) {
            if (voters[_voter].electionIDs[i] == _electionId) {
                index = i;
                break;
            }
        }

        // Create a new array to store the voter's election IDs
        uint[] memory newElectionIDs = new uint[](voters[_voter].electionIDs.length - 1);

        // Assign the voter's election IDs to the new array, excluding the election ID to be removed
        uint j = 0;
        uint k = 0;
        while (j < voters[_voter].electionIDs.length) {
            if (j == index) {
                j++;
                continue;
            }
            newElectionIDs[k++] = voters[_voter].electionIDs[j++];
        }

        // Update the voter's election IDs array with the new array
        voters[_voter].electionIDs = newElectionIDs;
    }

    // Function to add a district to a voter -for admin-   
    function addDistrictToVoter(address _voter, string memory _districtId) public onlyAdmin {
        // check if the voter exists. 
        require(isVoterExists[_voter], "Voter does not exist");
        // Check if the district exists
        require(isDistrictExists[_districtId], "District does not exist");

        // add voter's district
        voters[_voter].district = districts[_districtId];
    }

    // Function to remove a district from voter -for admin-    
    function addDistrictFromVoter(address _voter, string memory _districtId) public onlyAdmin {
        // check if the voter exists. 
        require(isVoterExists[_voter], "Voter does not exist");
        // Check if the district exists
        require(isDistrictExists[_districtId], "District does not exist");

        // add voter's district
        voters[_voter].district = District("null", "null");
    }

    // Function to get the elections a voter can participate in
    // user can call this function see their elections that they can participate
    function getVotersElections() public view returns (uint[] memory) {
        // check if the voter exists. 
        require(isVoterExists[msg.sender], "User not exist");
        // check if any election is assigned to the voter
        require(
            voters[msg.sender].electionIDs.length != 0, "Voter can't enter any election");
       
        // Return the array of election IDs the voter can participate in
        return voters[msg.sender].electionIDs;
    }

    // Function to get the voter details for a given address
    function getVoter( address _voter) public view onlyAdmin returns (Voter memory) {
        return voters[_voter];
    }

    // Function to get the total number of elections
    function getElectionsLength() public view returns (uint) {
        return electionCounter;
    }

    // Function to get the total number of election committee members
    function getElectionCommitteeMembersLength() public view returns (uint) {
        return electionCommitteeMemberCounter;
    }

    // Function to return spesific election committee member's details
    function getElectionCommitteeMemberDetails(address _wallet) public view returns (ElectionCommittee memory) {
        // Check if the election committee member already exists
        require(isElectionComitteMemberExists[_wallet], "Election committee member does not exists");

        return electionCommitteeMembers[_wallet];
    }

    // Funtion to return specific election's details
    function getElectionDetails(uint _id) public view returns (Election memory) {
        // Check if the election exists
        require(isElectionExists[_id], "Election does not exist");

        return elections[_id];
    }

    // Funtion to return specific candidate's details
    function getCandidateDetails(address _wallet) public view returns (Candidate memory) {
        // Check if the candidate already exists
        require(isCandidateExists[_wallet], "Candidate does not exists");

        return candidates[_wallet];
    }

    // Funtion to return specific district's details
    function getDistrictDetails(string memory _id) public view returns (District memory) {
        // Check if the district already exists
        require(isDistrictExists[_id], "District does not exists");

        return districts[_id];
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

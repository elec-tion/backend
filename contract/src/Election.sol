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
        string id;
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
        uint256 voteCount; // vote count of the candidate
    }

    struct Voter {
        District district;
        string[] electionIDs;
    }

    Admin public admin; 

    uint public electionCommitteeMemberCounter; // counter to keep track of the number of election committee members
    mapping(address => ElectionCommittee) public electionCommitteeMembers; // election committee member details with that specified member address
    mapping(address => bool) public isElectionComitteMemberExists; // to check if election committee member exists with that specified member address

    string[] public electionIDs; // string Array of election ids to keep track of election ids
    mapping(string => Election) public elections; // election details with that specified election id
    mapping(string => bool) public isElectionExists; // to check if election exists with that specified election id

    mapping(string => District) public districts; // district id like "00-01-01-01" to district details
    mapping(string => bool) public isDistrictExists; // to check if district exists with that specified district

    mapping(address => Candidate) public candidates; // candidate id to candidate details
    mapping(address => bool) public isCandidateExists; // to check if candidate exists with that specified candidate address

    mapping(address => Voter) public voters; // voter details with that specified voter address
    mapping(address => bool) public isVoterExists; // to check if voter exists with that specified voter address

    mapping(address => mapping (string => bool)) public isElectionVotedByVoter; // to check if voter voted in that specified election

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
        electionCommitteeMembers[_member] = ElectionCommittee(electionCommitteeMemberCounter, _name, _member);
        electionCommitteeMemberCounter = electionCommitteeMemberCounter + 1;
    }

    // Function to remove an election committee member
    function removeElectionCommitteeMember(address _member) public onlyAdmin {
        // Check if the member exists. If yes, delete the member from the mappings
        require(isElectionComitteMemberExists[_member], "Member does not exist");

        delete electionCommitteeMembers[_member];
        delete isElectionComitteMemberExists[_member];
    }

    // Function to create a new election -for admin-
    function createElection(string memory _name, uint256 _startDate, uint256 _endDate, string memory _electionId) public onlyAdmin {
        // Check if the election already exists
        require(!isElectionExists[_electionId], "Election already exists");

        // Initialize empty arrays for districts, candidates  and members
        string[] memory emptyDistricts;
        address[] memory emptyCandidates;
        address[] memory emptyMembers;

        // Create a new Election struct and add it to the elections array
        elections[_electionId] = Election(
            _electionId, 
            _name, 
            emptyDistricts, 
            emptyCandidates, 
            emptyMembers,
            _startDate, // Election start date in seconds
            _endDate // Election end date in seconds
        );
        isElectionExists[_electionId] = true;
        electionIDs.push(_electionId);
    }

    // Function to edit an existing election -for admin-
    function editElection(string memory _name, uint256 _startDate, uint256 _endDate, string memory _electionId) public onlyAdmin {
        // Check if the election exists
        require(isElectionExists[_electionId], "Election does not exist");

        // Update the election details
        elections[_electionId].name = _name;
        elections[_electionId].startDate = _startDate;
        elections[_electionId].endDate = _endDate;
    }

    // Function to add a committe member to a specific election -for admin-
    function addElectionCommitteeMemberToElection(address _member, string memory _electionId) public onlyAdmin {
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
    function removeElectionCommitteeMemberFromElection(address _member, string memory _electionId) public onlyAdmin {
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
    function removeElection(string memory _electionId) public onlyAdmin {
        // Check if the election exists
        require(isElectionExists[_electionId], "Election does not exist");

        // If yes, delete the election from the mappings
        delete elections[_electionId];
    }

    // Function to add a new district -for admin-
    function addDistrict(string memory _name, string memory _districtId) public onlyAdmin {
        // Check if the district already exists
        require(!isDistrictExists[_districtId], "District already exists");
        
        // If not, add the district to the mappings
        isDistrictExists[_districtId] = true;
        districts[_districtId] = District(_name, _districtId);
    }

    // Function to add district to an election -for admin-
    // adding a district to a specific election
    function addDistrictToElection(string memory _electionId, string memory _districtId) public onlyAdmin {
        // Check if the election exists & district exists
        require(isElectionExists[_electionId], "Election does not exist");
        require(isDistrictExists[_districtId], "District does not exist");

        // Add the district to the specified election
        elections[_electionId].districtIDs.push(_districtId);
    }

    // Function to remove a district from an election -for admin-
    function removeDistrictFromElection(string memory _electionId, string memory _districtId) public onlyAdmin {
        // Check if the election exists
        require(isElectionExists[_electionId], "Election does not exist");
        // Check if the district exists
        require(isDistrictExists[_districtId], "District does not exist");

        // Find the index of the district in the districtIDs array
        uint index = 0;
        for (uint i = 0; i < elections[_electionId].districtIDs.length; i++) {
            if (keccak256(abi.encodePacked(elections[_electionId].districtIDs[i])) == keccak256(abi.encodePacked(_districtId))) {
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
    function removeDistrict(string memory _districtId) public onlyAdmin {
        // Check if the district exists
        require(isDistrictExists[_districtId], "District does not exist");

        // If yes, delete the district from the mappings
        delete districts[_districtId];
        delete isDistrictExists[_districtId];
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
        candidates[_wallet] = Candidate(_name, _wallet, districts[_districtID], 0);
    }

    // Function to add candidate to an election for admin
    function addCandidateToElection(string memory _electionId, address _wallet) public onlyAdmin {
        // Check if the election exists
        require(isElectionExists[_electionId], "Election does not exist");
        // Check if the candidate exists
        require(isCandidateExists[_wallet], "Candidate does not exist");

        // Add the candidate to the specified election
        elections[_electionId].candidateAddresses.push(_wallet);
    }

    // Function to remove a candidate from an election for admin
    function removeCandidateFromElection(string memory _electionId, address _wallet) public onlyAdmin {
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
        string[] memory emptyElectionIds;

        // Create a new Voter struct and assign it to the sender's address in the voters mapping
        isVoterExists[msg.sender] = true;
        voters[msg.sender] = Voter(District("null", "null"), emptyElectionIds);
    }

    function addVoterToElection(address _voter, string memory _electionId)  public onlyAdmin () {
        // Check if the election exists
        require(isElectionExists[_electionId], "Election does not exist");
        // check if the voter exists.
        require(isVoterExists[_voter], "Voter does not exist");

        // add voter's election
        voters[_voter].electionIDs.push(_electionId);
        isElectionVotedByVoter[_voter][_electionId] = false;
    }

    // Function to remove a voter from an election -for admin-
    function removeVoterFromElection(string memory _electionId, address _voter) public onlyAdmin {
        // Check if the election exists
        require(isElectionExists[_electionId], "Election does not exist");
        // Check if the voter exists
        require(isVoterExists[_voter], "Voter does not exist");

        // Find the index of the voter in the voters array
        uint index = 0;
        for (uint i = 0; i < voters[_voter].electionIDs.length; i++) {
            if (keccak256(abi.encodePacked((voters[_voter].electionIDs[i]))) == keccak256(abi.encodePacked((_electionId)))) {
                index = i;
                break;
            }
        }

        // Create a new array to store the voter's election IDs
        string[] memory newElectionIDs = new string[](voters[_voter].electionIDs.length - 1);

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
        // Delete voters' electionID from voter's isVoted mapping
        delete isElectionVotedByVoter[_voter][_electionId];
    }

    // Function to remove a voter
    // check if the voter exists then delete from the mapping
    function removeVoter(address _voter) public onlyAdmin {
        // check if the voter exists. If yes, delete the voter
        require(isVoterExists[_voter], "Voter does not exist");

        delete voters[_voter];
        delete isVoterExists[_voter];
        // get keys of mapping
        for (uint i = 0; i < electionIDs.length; i++) {
            delete isElectionVotedByVoter[_voter][electionIDs[i]];
        }

        // delete isElectionVotedByVoter[_voter]; // not work 
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
    function removeDistrictFromVoter(address _voter, string memory _districtId) public onlyAdmin {
        // check if the voter exists. 
        require(isVoterExists[_voter], "Voter does not exist");
        // Check if the district exists
        require(isDistrictExists[_districtId], "District does not exist");

        // add voter's district
        voters[_voter].district = District("null", "null");
    }

    // Voter give vote
    function vote(string memory _electionId, address _candidate) public {
        // Check if the voter exists
        require(isVoterExists[msg.sender], "Voter does not exist");

        // Check if the election exists
        require(isElectionExists[_electionId], "Election does not exists");

        // Check if the candidate exists
        require(isCandidateExists[_candidate], "Candidate does not exists");

        // Check if that candidate is added to that election
        bool found = false;
        for (uint i = 0; i < elections[_electionId].candidateAddresses.length; i++) {
            if (elections[_electionId].candidateAddresses[i] == _candidate) {
                found = true;
            }
        }
        require(found, "This candidate is not assigned to this election");

        // Check if the voter has already voted
        require(!isElectionVotedByVoter[msg.sender][_electionId], "Voter has already voted");

        // Add the voter's vote
        candidates[_candidate].voteCount += 1;

        // Voter has voted in that election
        isElectionVotedByVoter[msg.sender][_electionId] = true;
    }

    ///////////////// GET FUNCTIONS /////////////////
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
    
    // Function to get all election IDs
    function getElectionIDs() public view returns (string[] memory) {
        return electionIDs;
    }
    // Funtion to return specific election's details
    function getElectionDetails(string memory _electionId) public view returns (Election memory) {
        // Check if the election exists
        require(isElectionExists[_electionId], "Election does not exists");

        return elections[_electionId];
    }
    // Function to get the total number of elections
    function getElectionsLength() public view returns (uint) {
        // Return the length of electionIDs in the array
        return electionIDs.length;
    }

    // Funtion to return specific district's details
    function getDistrictDetails(string memory _districtId) public view returns (District memory) {
        // Check if the district already exists
        require(isDistrictExists[_districtId], "District does not exists");

        return districts[_districtId];
    }

    // Funtion to return specific candidate's details
    function getCandidateDetails(address _wallet) public view returns (Candidate memory) {
        // Check if the candidate already exists
        require(isCandidateExists[_wallet], "Candidate does not exists");

        return candidates[_wallet];
    }

    // Function to get the elections a voter can participate in
    // user can call this function see their elections that they can participate
    function getVotersElections() public view returns (string[] memory) {
        // check if the voter exists. 
        require(isVoterExists[msg.sender], "User not exist");
        // check if any election is assigned to the voter
        require(voters[msg.sender].electionIDs.length != 0, "Voter can't enter any election");
       
        // Return the array of election IDs the voter can participate in
        return voters[msg.sender].electionIDs;
    }

    // Function to get the voter details for a given address
    function getVoterDetails(address _voter) public view onlyAdmin returns (Voter memory) {
        // check if the voter exists. 
        require(isVoterExists[_voter], "User not exist");

        return voters[_voter];
    }
}

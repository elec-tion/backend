const { chain } = require("../../chain");
// Create accounts
const voterAccounts = [
    chain.eth.accounts.privateKeyToAccount("0x" + crypto.createHash("sha256").update("VOTER_1").digest("hex")),
    chain.eth.accounts.privateKeyToAccount("0x" + crypto.createHash("sha256").update("VOTER_2").digest("hex")),
    chain.eth.accounts.privateKeyToAccount("0x" + crypto.createHash("sha256").update("VOTER_3").digest("hex"))
];
const candidateAccounts = [
    chain.eth.accounts.privateKeyToAccount("0x" + crypto.createHash("sha256").update("CANDIDATE_1").digest("hex")),
    chain.eth.accounts.privateKeyToAccount("0x" + crypto.createHash("sha256").update("CANDIDATE_2").digest("hex")),
    chain.eth.accounts.privateKeyToAccount("0x" + crypto.createHash("sha256").update("CANDIDATE_3").digest("hex"))
];
const electionCommitteeAccounts = [
    chain.eth.accounts.privateKeyToAccount("0x" + crypto.createHash("sha256").update("ELECTION_COMMITTEE_MEMBER_1").digest("hex")),
    chain.eth.accounts.privateKeyToAccount("0x" + crypto.createHash("sha256").update("ELECTION_COMMITTEE_MEMBER_2").digest("hex")),
    chain.eth.accounts.privateKeyToAccount("0x" + crypto.createHash("sha256").update("ELECTION_COMMITTEE_MEMBER_3").digest("hex"))
];

module.exports = {
    voterAccounts,
    candidateAccounts,
    electionCommitteeAccounts
}

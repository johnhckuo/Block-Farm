pragma solidity ^0.4.4;

contract owned {
    address public owner;

    function owned() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        if (msg.sender != owner) throw;
        _;
    }

    function transferOwnership(address newOwner) onlyOwner {
        owner = newOwner;
    }
}

contract tokenRecipient {
    event receivedEther(address sender, uint amount);
    event receivedTokens(address _from, uint256 _value, address _token, bytes _extraData);


    function receiveApproval(address _from, uint256 _value, address _token, bytes _extraData){
        Token t = Token(_token);
        if (!t.transferFrom(_from, this, _value)) throw;
        receivedTokens(_from, _value, _token, _extraData);
    }

    function () payable {
        receivedEther(msg.sender, msg.value);
    }
}

contract Token {
    function transferFrom(address _from, address _to, uint256 _value) returns (bool success);
}

contract Congress is owned, tokenRecipient {

    /* Contract Variables and events */
    uint public minimumQuorum;
    uint public debatingPeriodInMinutes;
    int public majorityMargin;
    Proposal[] public proposals;
    uint public numProposals;
    mapping (address => uint) public stakeholderId;
    Stakeholder[] public stakeholders;

    StakeholderGameData[] public stakeholdersGameData;

    // address PropertyAddress = 0x1;    //  <------------------------------ here

    event ProposalAdded(uint proposalID, address recipient, uint amount, string description);
    event Voted(uint proposalID, bool position, address voter, string justification);
    event ProposalTallied(uint proposalID, int result, uint quorum, bool active);
    event MembershipChanged(address Stakeholder, bool isMember);
    event ChangeOfRules(uint minimumQuorum, uint debatingPeriodInMinutes, int majorityMargin);

    event addmember_test(bytes32);
    event int_test(uint);
    event int256_test(uint256);

    struct Proposal {
        address recipient;
        uint amount;
        string description;
        uint votingDeadline;
        bool executed;
        bool proposalPassed;
        uint numberOfVotes;
        int currentResult;
        bytes32 proposalHash;
        Vote[] votes;
        mapping (address => bool) voted;
    }

    struct Stakeholder {
        uint256 threshold;
        uint256 fund;
        uint256 id;
        uint rate;
        address addr;
        uint since;
        uint farmerLevel;

    }

    struct StakeholderGameData {
        bytes32 name;
        bytes32 character;

        uint exp;
        uint totalExp;
        uint landSize;
        uint level;
        uint stamina;
        uint guardId;
        uint[] thiefId;

        uint propertyCount;
        uint[] propertyId;

        bytes32 lastLogin;
    }

    struct Syndicate{
        uint id;
        uint characterId;
        int256 progress;
        uint exp;
        uint totalExp;
        uint level;
        int256 success;
        int256 fail;
        bytes32 character;
    }

    struct Vote {
        bool inSupport;
        address voter;
        string justification;
    }

    /* modifier that allows only shareholders to vote and create new proposals */
    modifier onlyStakeholders {
        if (stakeholderId[msg.sender] == 0)
            throw;
        _;
    }

    /* First time setup */

    function Congress(
        uint minimumQuorumForProposals,
        uint minutesForDebate,
        int marginOfVotesForMajority, address congressLeader
    ) payable {
        changeVotingRules(minimumQuorumForProposals, minutesForDebate, marginOfVotesForMajority);
        if (congressLeader != 0) owner = congressLeader;
        // It’s necessary to add an empty first Stakeholder
        //addMember(0, 'Genesis', 0, 0, 0, "Genesis");

        // and let's add the founder, to save a step later
        //addMember(0,0,0);
        //initPlayerData("John", "Guard");
        //addMember(0,0,0);
        //initPlayerData("Powei", "Theft");

    }

    // function Congress(){
    //     owner = msg.sender;
    // }


    function getStakeholdersLength() constant returns(uint){
        return stakeholders.length;
    }

    function getStakeholder(uint s_Id) constant returns(bytes32, uint, uint, bytes32, uint, uint, uint){
        return (stakeholdersGameData[s_Id].name, stakeholdersGameData[s_Id].exp, stakeholdersGameData[s_Id].totalExp, stakeholdersGameData[s_Id].character, stakeholdersGameData[s_Id].landSize, stakeholdersGameData[s_Id].level, stakeholdersGameData[s_Id].stamina);
    }

    function getStakeholderLastLogin(uint s_Id) constant returns(bytes32){
        return stakeholdersGameData[s_Id].lastLogin;
    }

    function getStakeholder_Mission(uint s_Id) constant returns(uint){
        return stakeholders[s_Id].farmerLevel;
    }

    function getPropertyList(uint s_Id) constant returns(uint[]){
        return stakeholdersGameData[s_Id].propertyId;
    }

    function getPropertyId(uint s_Id, uint index) constant returns(uint){
        return stakeholdersGameData[s_Id].propertyId[index];
    }

    function getStakeholderPropertyCount(uint s_Id) constant returns(uint){
        return stakeholdersGameData[s_Id].propertyCount;
    }

    function addProperty(uint _id, uint p_Id){
        stakeholdersGameData[_id].propertyCount++;
        stakeholdersGameData[_id].propertyId.push(p_Id);
    }

    function addMember(uint256 _threshold, uint256 _fund, uint _rate){
        uint id;
        address targetStakeholder = msg.sender;


        if (stakeholderId[targetStakeholder] == 0) {
           stakeholderId[targetStakeholder] = stakeholders.length;
           id = stakeholders.length++;

           stakeholders[id].threshold=_threshold;
           stakeholders[id].fund=_fund;
           stakeholders[id].id=id;
           stakeholders[id].rate=_rate;
           stakeholders[id].addr=msg.sender;
           stakeholders[id].since=now;


           stakeholders[id].farmerLevel = 0;
          // important!!!!! This will be implemented in the front end interface !!!!!!!!!!! so that the using property dependency can be removed
          //  usingProperty temp = usingProperty(PropertyAddress);
          //  uint p_Length = temp.getPropertiesLength();
          //  temp.updatePropertiesRating(p_Length, 0, "init");

            //04.21 Powei
            //  mission status[] needed to be pushed

        }
        else {
            id = stakeholderId[targetStakeholder];
            Stakeholder m = stakeholders[id];
        }
        MembershipChanged(targetStakeholder, true);
    }


    /*make Stakeholder*/
    function initPlayerData(bytes32 _name, bytes32 _character){

         uint _id = stakeholdersGameData.length++;
         stakeholdersGameData[_id].name=_name;

         stakeholdersGameData[_id].character= _character;

         stakeholdersGameData[_id].exp = 0;
         stakeholdersGameData[_id].totalExp = 0;
         stakeholdersGameData[_id].landSize = 3;
         stakeholdersGameData[_id].level = 0;
         stakeholdersGameData[_id].stamina = 100;
         stakeholdersGameData[_id].lastLogin = 0;

         //stakeholders[_id].guardId = 0;
         //stakeholders[_id].thiefId = 0;
    }

    function updateUserExp(uint u_Id, uint exp){
        stakeholdersGameData[u_Id].exp = exp;
        stakeholdersGameData[u_Id].totalExp += exp;
    }


    function updateUserStamina(uint u_Id, uint sta){
        stakeholdersGameData[u_Id].stamina = sta;
    }

    function updateStakeholderLastLogin(uint u_Id, bytes32 _lastLogin){
        stakeholdersGameData[u_Id].lastLogin = _lastLogin;
    }

    function updateGameData(uint u_Id, uint _landSize, uint _level){
        stakeholdersGameData[u_Id].landSize = _landSize;
        stakeholdersGameData[u_Id].level = _level;


    }

    function removeStakeholder(address targetStakeholder) onlyOwner {
        if (stakeholderId[targetStakeholder] == 0) throw;

        for (uint i = stakeholderId[targetStakeholder]; i<stakeholders.length-1; i++){
            stakeholders[i] = stakeholders[i+1];
        }
        delete stakeholders[stakeholders.length-1];
        stakeholders.length--;
    }

    /*change rules*/
    function changeVotingRules(
        uint minimumQuorumForProposals,
        uint minutesForDebate,
        int marginOfVotesForMajority
    ) onlyOwner {
        minimumQuorum = minimumQuorumForProposals;
        debatingPeriodInMinutes = minutesForDebate;
        majorityMargin = marginOfVotesForMajority;

        ChangeOfRules(minimumQuorum, debatingPeriodInMinutes, majorityMargin);
    }

    /* Function to create a new proposal */
    function newProposal(
        address beneficiary,
        uint etherAmount,
        string JobDescription,
        bytes transactionBytecode
    )
        onlyStakeholders
        returns (uint proposalID)
    {
        proposalID = proposals.length++;
        Proposal p = proposals[proposalID];
        p.recipient = beneficiary;
        p.amount = etherAmount;
        p.description = JobDescription;
        p.proposalHash = sha3(beneficiary, etherAmount, transactionBytecode);
        p.votingDeadline = now + debatingPeriodInMinutes * 1 minutes;
        p.executed = false;
        p.proposalPassed = false;
        p.numberOfVotes = 0;
        ProposalAdded(proposalID, beneficiary, etherAmount, JobDescription);
        numProposals = proposalID+1;

        return proposalID;
    }

    /* function to check if a proposal code matches */
    function checkProposalCode(
        uint proposalNumber,
        address beneficiary,
        uint etherAmount,
        bytes transactionBytecode
    )
        constant
        returns (bool codeChecksOut)
    {
        Proposal p = proposals[proposalNumber];
        return p.proposalHash == sha3(beneficiary, etherAmount, transactionBytecode);
    }

    function vote(
        uint proposalNumber,
        bool supportsProposal,
        string justificationText
    )
        onlyStakeholders
        returns (uint voteID)
    {
        Proposal p = proposals[proposalNumber];         // Get the proposal
        if (p.voted[msg.sender] == true) throw;         // If has already voted, cancel
        p.voted[msg.sender] = true;                     // Set this voter as having voted
        p.numberOfVotes++;                              // Increase the number of votes
        if (supportsProposal) {                         // If they support the proposal
            p.currentResult++;                          // Increase score
        } else {                                        // If they don't
            p.currentResult--;                          // Decrease the score
        }
        // Create a log of this event
        Voted(proposalNumber,  supportsProposal, msg.sender, justificationText);
        return p.numberOfVotes;
    }

    function executeProposal(uint proposalNumber, bytes transactionBytecode) {
        Proposal p = proposals[proposalNumber];
        /* Check if the proposal can be executed:
           - Has the voting deadline arrived?
           - Has it been already executed or is it being executed?
           - Does the transaction code match the proposal?
           - Has a minimum quorum?
        */


        if (now < p.votingDeadline
            || p.executed
            || p.proposalHash != sha3(p.recipient, p.amount, transactionBytecode)
            || p.numberOfVotes < minimumQuorum)
            throw;

        /* execute result */
        /* If difference between support and opposition is larger than margin */
        if (p.currentResult > majorityMargin) {
            // Avoid recursive calling

            p.executed = true;
            if (!p.recipient.call.value(p.amount * 1 ether)(transactionBytecode)) {
                throw;
            }

            p.proposalPassed = true;
        } else {
            p.proposalPassed = false;
        }
        // Fire Events
        ProposalTallied(proposalNumber, p.currentResult, p.numberOfVotes, p.proposalPassed);
    }

}

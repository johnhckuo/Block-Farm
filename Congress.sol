pragma solidity ^0.4.2;


//---------------------------
//|                         |
//|     Property            |
//|     Contract            |
//|             :D          |
//---------------------------


contract usingProperty{

    event propertyAdded(bool);
    struct Property{
        bytes32 name;
        uint id;
        mapping (address => bool) accessStakeholders;
        uint since;
        uint256 propertyCount;
        uint256 unit;  //單位
        bytes32 minUnit; //可拆分最小單位
        address owner;
        bytes32 extraData;
        uint[] rating;
    }

    Property[] public propertyList;

    address CongressAddress = 0x1;

  /*
    // seller property
    struct TicketInfo{
        uint date;
        bytes32 location;
        uint cost;
        bytes32 seat;
        address seller;
    }

    mapping (string => string[]) Tickets;  //using singer name to search for his concert list
  */


    function usingProperty(){
    }

    function addProperty(bytes32 _name, uint256 _propertyCount, address[] _accessStakeholders, uint256 _unit, bytes32 _minUnit, bytes32 _extraData, uint _rating) returns(bool success, uint _id){
        _id = propertyList.length++;
        // a little issue here, I can't create an identifier for each propertyList, therefore repeating propertyList issue might emerge

        Congress temp = Congress(CongressAddress);
        uint s_Id = temp.stakeholderId(msg.sender);
      //  Stakeholder[] s_List = temp.stakeholders;

        Property prop = propertyList[_id];
        for (uint i = 0 ; i < _accessStakeholders.length ; i++){
          prop.accessStakeholders[_accessStakeholders[i]] = true;
        }

        prop.rating.length = temp.getStakeholdersLength();
        //prop.rating.length = 1;
        prop.name = _name;
        prop.id= _id;
        prop.propertyCount= _propertyCount;
        prop.since= now;
        prop.unit= _unit;
        prop.minUnit= _minUnit;
        prop.owner= msg.sender;
        prop.extraData= _extraData;
        prop.rating[s_Id]= _rating;

        propertyAdded(true);
    }

    function removeProperty(uint _id){
        if (getPropertiesLength() == 0) throw;

        for (uint i = 0; i<propertyList.length-1; i++){
            propertyList[i] = propertyList[i+1];
        }
        delete propertyList[propertyList.length-1];
        propertyList.length--;

    }

    function queryProperty(uint _id) returns (bytes32, uint, uint, uint256, address, bytes32){
        Property temp = propertyList[_id];
        return (temp.name, temp.id, temp.since, temp.propertyCount, temp.owner, temp.extraData);
    }

    function getPropertiesLength() constant returns(uint){
        return propertyList.length;
    }

    function updatePropertiesRating(uint _id, bytes operation){
        if (sha3(operation) == sha3("init")){      //consider import string.utils contract ?
          propertyList[_id].rating.push(0);
        }
    }


}


//---------------------------
//|                         |
//|     Congress            |
//|     Contract            |
//|             :D          |
//---------------------------



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

    address PropertyAddress = 0x1;    //  <------------------------------ here

    event ProposalAdded(uint proposalID, address recipient, uint amount, string description);
    event Voted(uint proposalID, bool position, address voter, string justification);
    event ProposalTallied(uint proposalID, int result, uint quorum, bool active);
    event MembershipChanged(address Stakeholder, bool isMember);
    event ChangeOfRules(uint minimumQuorum, uint debatingPeriodInMinutes, int majorityMargin);

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
        bytes32 name;
        uint256 threshold;
        uint256 fund;
        uint256 id;
        uint rate;
        address addr;
        uint since;
        string character;
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
        addMember(0, 'Genesis', 0, 0, 0, "Genesis");
        // and let's add the founder, to save a step later
        addMember(msg.sender, 'Moderator', 0, 0, 0, "Founder");

    }

    function getStakeholdersLength() constant returns(uint){
        return stakeholders.length;
    }

    /*make Stakeholder*/
    function addMember(address targetStakeholder, bytes32 _name, uint256 _threshold, uint256 _fund, uint _rate, string _character) onlyOwner {
        uint id;
        if (stakeholderId[targetStakeholder] == 0) {
           stakeholderId[targetStakeholder] = stakeholders.length;
           id = stakeholders.length++;
           stakeholders[id] = Stakeholder({
               name:_name,
               threshold:_threshold,
               fund:_fund,
               id:id,
               rate:_rate,
               addr:msg.sender,
               since:now,
               character: _character
           });

           usingProperty temp = usingProperty(PropertyAddress);
           //Property[] p_List = temp.propertyList;
           uint p_Length = temp.getPropertiesLength();
           for (uint i = 0 ; i < p_Length ; i++){
              temp.updatePropertiesRating(i, "init");
           }

        } else {
            id = stakeholderId[targetStakeholder];
            Stakeholder m = stakeholders[id];
        }

        MembershipChanged(targetStakeholder, true);
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

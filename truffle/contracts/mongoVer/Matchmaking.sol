pragma solidity ^0.4.2;
contract Matchmaking{

    struct Match{
        uint id;
        uint[] visitedOwners;
        uint[] visitedProperties;
        uint[] visitedTradeables;
        uint[] confirmed;

        int256[] visitedPriorities;
        uint[] confirmation;
        uint visitedCount;
        string result;
    }


    modifier onlyOwner()
    {
        if(msg.sender != owner) throw;
        _;
    }

    Match[] public matches;
    address owner;

    function Matchmaking(){
        owner = msg.sender;
    }

    function getMatchMaking(uint m_Id) constant returns(int256[], uint[], uint[], uint[], uint[], uint, string){
        return (matches[m_Id].visitedPriorities, matches[m_Id].visitedOwners, matches[m_Id].visitedProperties, matches[m_Id].visitedTradeables, matches[m_Id].confirmation, matches[m_Id].visitedCount, matches[m_Id].result);
    }

    function getMatchMakingConfirmed(uint m_Id, uint s_Id) constant returns(uint){
        uint s_Index;
        for (uint i = 0 ; i < matches[m_Id].visitedOwners.length; i++){
            if (matches[m_Id].visitedOwners[i] == s_Id){
                s_Index = i;
                break;
            }
        }
        return (matches[m_Id].confirmed[s_Index]);
    }

    function getMatchMakingConfirmedArr(uint m_Id) constant returns (uint[]){
        return matches[m_Id].confirmed;
    }

    function getMatchMakingConfirmationArr(uint m_Id) constant returns(uint[]){
        return matches[m_Id].confirmation;
    }

    function updateConfirmation(uint m_Id, uint s_Id, uint confirmation) onlyOwner{
        uint s_Index;
        for (uint i = 0 ; i < matches[m_Id].visitedOwners.length; i++){
            if (matches[m_Id].visitedOwners[i] == s_Id){
                s_Index = i;
                break;
            }
        }
        matches[m_Id].confirmation[s_Index] = confirmation;
        matches[m_Id].confirmed[s_Index] = 1;
    }

    function getMatchMakingLength() constant returns(uint){
        return matches.length;
    }

    function gameCoreMatchingInit(uint _matchId, uint _visitedCount, string _result) onlyOwner{
        matches.length++;

        matches[_matchId].id = _matchId;
        matches[_matchId].visitedCount = _visitedCount;
        matches[_matchId].result = _result;

    }

    function gameCoreMatchingDetail(uint _matchId, int256 _priority, uint _owner, uint _property, uint _tradeable) onlyOwner{
        matches[_matchId].visitedPriorities.push(_priority);
        matches[_matchId].visitedOwners.push(_owner);
        matches[_matchId].visitedProperties.push(_property);
        matches[_matchId].visitedTradeables.push(_tradeable);


    }

    function gameCoreMatchingConfirmed(uint _matchId, uint _visitedLength) onlyOwner{
        for (uint i = 0 ; i < _visitedLength ; i++){
           matches[_matchId].confirmation.push(1);
           matches[_matchId].confirmed.push(0);
        }
    }


    function updateMatchResult(uint m_Id, string result) onlyOwner{
        matches[m_Id].result = result;
    }

}

pragma solidity ^0.4.2;
contract Matchmaking{

    struct Match{
        uint id;
        uint[] visitedOwners;
        uint[] visitedProperties;
        uint[] visitedTradeables;
        bool[] confirmed;

        int256[] visitedPriorities;
        uint[] confirmation;
        uint visitedCount;
        string result;
    }

    Match[] public matches;
    address owner;

    function Matchmaking(){
        owner = msg.sender;
    }

    function getMatchMaking(uint m_Id) constant returns(int256[], uint[], uint[], uint[], uint[], uint, string){
        return (matches[m_Id].visitedPriorities, matches[m_Id].visitedOwners, matches[m_Id].visitedProperties, matches[m_Id].visitedTradeables, matches[m_Id].confirmation, matches[m_Id].visitedCount, matches[m_Id].result);
    }

    function getMatchMakingConfirmed(uint m_Id, uint s_Id) constant returns(bool){
        return (matches[m_Id].confirmed[s_Id]);
    }

    function updateConfirmation(uint m_Id, uint s_Id, uint confirmation){
        uint s_Index;
        for (uint i = 0 ; i < matches[m_Id].visitedOwners.length; i++){
            if (matches[m_Id].visitedOwners[i] == s_Id){
                s_Index = i;
                break;
            }
        }
        matches[m_Id].confirmation[s_Index] = confirmation;
        matches[m_Id].confirmed[s_Index] = true;
    }

    function getMatchMakingLength() constant returns(uint){
        return matches.length;
    }

    function gameCoreMatchingInit(uint _matchId, uint _visitedCount, string _result, uint _visitedLength){
        matches.length++;

        matches[_matchId].id = _matchId;
        matches[_matchId].visitedCount = _visitedCount;
        matches[_matchId].result = _result;
        for (uint i = 0 ; i < _visitedLength ; i++){
           matches[_matchId].confirmation.push(1);
           matches[_matchId].confirmed.push(false);

           //property.updateTradingStatus(matches[_matchId].visitedProperties[i], true);
        }
    }

    function gameCoreMatchingDetail(uint _matchId, int256 _priority, uint _owner, uint _property, uint _tradeable){
        matches[_matchId].visitedPriorities.push(_priority);
        matches[_matchId].visitedOwners.push(_owner);
        matches[_matchId].visitedProperties.push(_property);
        matches[_matchId].visitedTradeables.push(_tradeable);

        /*
        for (uint k = 0 ; k < matches[_matchId].visitedOwners.length-1 ; k++){
             congress.insertMatchesId(matches[_matchId].visitedOwners[k], _matchId);
        }
       
        for (uint l = 0 ; l < matches[_matchId].visitedProperties.length ; l++){
             matches[_matchId].visitedTradeable.push(property.checkTradeable(matches[_matchId].visitedProperties[l]));
        }
        */
    }
}

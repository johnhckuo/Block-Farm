pragma solidity ^0.4.4;

contract Congress{
    function deleteMatchesId(uint, uint);
    function updateGuardMatchId(uint, int256);
    function insertMatchesId(uint, uint);
    function updateGuardId(uint, uint);
    function updateFarmerId(uint, uint);
}

contract usingProperty{
    function getPropertyType_Matchmaking(uint) constant returns(uint);
    function getPropertyTypeLength() constant returns(uint);
    function updateTradingStatus(uint, bool);
    function updateOwnershipStatus(uint, uint);
    function checkTradeable(uint) constant returns(uint);

}


contract Matchmaking{

    Congress congress;
    usingProperty property;

    uint floatOffset = 1000;
    uint matchMakingThreshold = 500;
    uint matchMakingInterval = 1800;
    uint matchesConfirmThreshold = 2;

    struct Match{
        uint id;
        uint[] visitedOwners;
        uint[] visitedProperties;
        uint[] visitedTradeable;
        bool[] confirmed;

        int256[] visitedPriorities;
        uint[] confirmation;
        uint visitedCount;
        string result;
    }

    Match[] public matches;

    function Matchmaking(address _congressAddress, address _propertyAddress){

      congress = Congress(_congressAddress);
      property = usingProperty(_propertyAddress);

    }


    function getMatchMaking(uint m_Id) constant returns(int256[], uint[], uint[], uint[], uint[], uint, string){
        return (matches[m_Id].visitedPriorities, matches[m_Id].visitedOwners, matches[m_Id].visitedProperties, matches[m_Id].visitedTradeable, matches[m_Id].confirmation, matches[m_Id].visitedCount, matches[m_Id].result);
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


    function gameCoreMatchingInit(uint _matchId, uint _visitedCount, string _result){
        matches.length++;

        matches[_matchId].id = _matchId;
        matches[_matchId].visitedCount = _visitedCount;
        matches[_matchId].result = _result;
    }

/*
    function checkConfirmation() returns(bool){
        for (uint j = 0 ; j < matches.length - matchesConfirmThreshold ; j++){
            uint confirm = 0;
            for (uint i = 0 ; i < matches[j].confirmation.length-1; i++){
                if (matches[j].confirmation[i] == 1){
                    confirm++;
                }
                congress.deleteMatchesId(matches[j].visitedOwners[i], matches[j].id);
            }

            confirm = confirm*floatOffset;
            uint totalCount = matches[j].visitedCount;

            if (confirm/totalCount <= matchMakingThreshold){
                matches[j].result = "false";
                return false;
            }else{
                matches[j].result = "true";
                transferOwnership(j);
                return true;
            }

        }

    }

    function transferOwnership(uint m_Id){
        uint length = property.getPropertyTypeLength();
        uint visitedLength = matches[m_Id].visitedOwners.length-1;
        for (uint i = 0 ; i < visitedLength; i++){
            uint s_Id = matches[m_Id].visitedOwners[i+1];
            uint currentPID = matches[m_Id].visitedProperties[i];
            uint propertyType = currentPID % length;
            uint receivedPID = s_Id*length + propertyType;

            property.updateOwnershipStatus(receivedPID, currentPID);

            //cancel isTrading status
            property.updateTradingStatus(currentPID, false);

            uint p_Type = property.getPropertyType_Matchmaking(matches[m_Id].visitedProperties[i]);
            if (p_Type > 29 && p_Type < 40){
                congress.updateGuardMatchId(matches[m_Id].visitedOwners[i], int256(m_Id));
                congress.updateGuardId(matches[m_Id].visitedOwners[i+1], matches[m_Id].visitedOwners[i]);
                congress.updateFarmerId(matches[m_Id].visitedOwners[i], matches[m_Id].visitedOwners[i+1]);

            }
        }

    }

    function gameCoreMatchingDetail(uint _matchId, int256 _priority, uint _owner, uint _property){
        matches[_matchId].visitedPriorities.push(_priority);
        matches[_matchId].visitedOwners.push(_owner);
        matches[_matchId].visitedProperties.push(_property);


        for (uint i = 0 ; i < matches[_matchId].visitedOwners.length ; i++){
           matches[_matchId].confirmation.push(1);
           matches[_matchId].confirmed.push(false);

           property.updateTradingStatus(matches[_matchId].visitedProperties[i], true);
        }

        for (uint k = 0 ; k < matches[_matchId].visitedOwners.length-1 ; k++){
             congress.insertMatchesId(matches[_matchId].visitedOwners[k], _matchId);
        }

        for (uint l = 0 ; l < matches[_matchId].visitedProperties.length ; l++){
             matches[_matchId].visitedTradeable.push(property.checkTradeable(matches[_matchId].visitedProperties[l]));
        }

    }
*/



}

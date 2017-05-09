pragma solidity ^0.4.4;
import "./StringUtils.sol";
//import "./usingOraclize.sol";

contract Congress{
    mapping (address => uint) public stakeholderId;
    function initPlayerData(bytes32, bytes32);
    function addMember();
    function insertMatchesId(uint, uint);
    function deleteMatchesId(uint, uint);
}

contract usingProperty{
    function getPropertiesLength() constant returns(uint);
    function getPartialProperty(uint) returns(address);
    function addUserLandConfiguration(uint);
    function getPropertyTypeAverageRating(uint, uint) constant returns(uint);
    function getPropertyTypeRating_Matchmaking(uint, uint) constant returns(uint);
    function checkTradeable(uint) constant returns(uint);
    function getPropertyType_Matchmaking(uint) constant returns(uint);
    function getPropertyTypeLength() constant returns(uint);
    function updateTradingStatus(uint, bool);
    function updateOwnershipStatus(uint, uint);
    function getPropertiesOwner(uint visitedProperty) constant returns(uint);
    function checkTradingStatus(uint p_Id) constant returns (bool);
}

contract MainActivity{
    uint[] visitedProperty;
    int256[] visitedPriority;

    uint visitedCount;  //in order to ignore the rest of the array elem
    uint[] actualVisitIndex;
    uint origin;

    event matchSuccess(uint[], uint[]);
    event matchFail();
    event returnOrigin(uint);

    Congress congress;
    usingProperty property;

    uint floatOffset = 1000;
    uint matchMakingThreshold = 500;
    uint matchMakingInterval = 1800;

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

    function MainActivity(address _congressAddress, address _propertyAddress){

      congress = Congress(_congressAddress);
      property = usingProperty(_propertyAddress);

      congress.addMember();
      initGameData(0, "Moderator", "guard");

      //matchmaking(0);    // start executing matchmaking algo

    }

    function initGameData(uint s_Id, bytes32 _name, bytes32 _character){
        congress.initPlayerData(_name, _character);
        for (uint i = 0 ; i < 9 ; i++){
            property.addUserLandConfiguration(s_Id);
        }
    }

    function sort(int256[] priorityList, uint[] visitList) returns(int256[], uint[]){
      //selection sort

        for (uint i=0; i < priorityList.length; i++)
        {

            uint max_index = i;
            for (uint j=i+1; j<priorityList.length; j++)
                if (priorityList[j] > priorityList[max_index])
                    max_index = j;

            int256 temp = priorityList[i];
            priorityList[i] = priorityList[max_index];
            priorityList[max_index] = temp;

            uint temp2 = visitList[i];
            visitList[i] = visitList[max_index];
            visitList[max_index] = temp2;
        }
        return (priorityList, visitList);
    }

    function findOrigin() returns(string success){

        uint length = property.getPropertiesLength();
        int256[] memory priorityList = new int256[](length);
        uint[] memory visitList = new uint[](length);
        uint[] memory sortedList = new uint[](length);

        visitedProperty.length = 0;
        visitedPriority.length = 0;

        for (uint i = 0 ; i < length ; i++){
            uint access = property.checkTradeable(i);
            bool isTrading = property.checkTradingStatus(i);
            if (access == 0 || isTrading){
                continue;
            }

            address owner = property.getPartialProperty(i);
            uint averageRating = property.getPropertyTypeAverageRating(i, congress.stakeholderId(owner));
            uint self_Importance = property.getPropertyTypeRating_Matchmaking(i, congress.stakeholderId(owner));
            int256 diff = int256(averageRating - self_Importance);

            priorityList[i] = diff;
            visitList[i] = i;
        }

        (priorityList, sortedList) = sort(priorityList, visitList);
        actualVisitIndex = new uint[](length);
        origin = sortedList[0];

        visitedCount = 0;
        visitedProperty.length++;
        visitedProperty[visitedCount] = origin;
        visitedPriority.length++;
        visitedPriority[visitedCount] = 0;

        success = findVisitNode(origin);
    }

    function checkExist(uint elem, uint[] data) returns(bool){
        for (uint i = 0 ; i < data.length; i++){
            if (elem == data[i] && i != 0){
                return false;
            }
        }
        return true;
    }

    function returnPriority(uint visitNode, uint i) constant returns(int256){

        address owner = property.getPartialProperty(i);

        uint self_Importance = property.getPropertyTypeRating_Matchmaking(i, congress.stakeholderId(owner));
        uint currentRating = property.getPropertyTypeRating_Matchmaking(visitNode, congress.stakeholderId(owner));
        int256 diff = int256(currentRating - self_Importance);

        int256 tradeableCount = int256(property.checkTradeable(i));

        tradeableCount = (tradeableCount/10)%10;
        diff += diff/10*tradeableCount;

        return diff;
    }

    function searchNeighborNodes(uint visitNode) constant returns(int256[], uint[]){
        uint length = property.getPropertiesLength();
        uint[] memory goThroughList = new uint[](length);
        int256[] memory diffList = new int256[](length);
        uint k = 0;

        for (uint i = 0 ; i < length ; i++){

            if (i == visitNode || property.checkTradeable(i) == 0 || property.checkTradingStatus(i)){
                k++;
                diffList[i] = -100000;
                continue;
            }

            address newOwner = property.getPartialProperty(i);
            address currentOwner = property.getPartialProperty(visitNode);

            uint currentType = property.getPropertyType_Matchmaking(i);
            uint newType = property.getPropertyType_Matchmaking(visitNode);

            if (newOwner == currentOwner || currentType == newType){
                k++;
                diffList[i] = -10000;
                continue;
            }

            if (k == length-1){
                matchFail();
            }

            diffList[i] = returnPriority(visitNode, i);
            goThroughList[i] = i;
        }
        return (diffList, goThroughList);
    }

    function findVisitNode(uint visitNode) returns(string){

        uint length = property.getPropertiesLength();


        var (diffList, goThroughList) = searchNeighborNodes(visitNode);
        (diffList, goThroughList) = sort(diffList, goThroughList);

        if (diffList[0] <= 0){
            matchFail();
            return "Fail";
        }

        bool flag = false;
        uint visitIndex;

        for (uint j = 0 ; j< length ; j++){

            flag = checkExist(goThroughList[j], visitedProperty);

            if (flag){
                visitIndex = j;
                break;
            }
            if (!flag && j == length-1){
                matchFail();
                return "Fail";
            }
        }

        visitedProperty.length++;
        visitedProperty[++visitedCount] = goThroughList[visitIndex];

        visitedPriority.length++;
        visitedPriority[visitedCount] = diffList[visitIndex];

        uint[] memory visitedOwners = new uint[](visitedProperty.length);
        for (uint h = 0 ; h < visitedProperty.length ; h++){
            visitedOwners[h] = property.getPropertiesOwner(visitedProperty[h]);
        }

        if (goThroughList[visitIndex] == origin){

             uint matchId = matches.length++;

             matches[matchId].id = matchId;
             matches[matchId].visitedPriorities = visitedPriority;
             matches[matchId].visitedOwners = visitedOwners;
             matches[matchId].visitedProperties = visitedProperty;
             matches[matchId].visitedCount = visitedCount;
             matches[matchId].result = "null";

             for (uint i = 0 ; i < matches[matchId].visitedOwners.length ; i++){
                matches[matchId].confirmation.push(1);
                matches[matchId].confirmed.push(false);

                property.updateTradingStatus(visitedProperty[i], true);
             }

             for (uint k = 0 ; k < matches[matchId].visitedOwners.length-1 ; k++){
                  congress.insertMatchesId(matches[matchId].visitedOwners[k], matchId);
             }

             for (uint l = 0 ; l < matches[matchId].visitedProperties.length ; l++){
                  matches[matchId].visitedTradeable.push(property.checkTradeable(matches[matchId].visitedProperties[l]));
             }

             matchSuccess(visitedProperty, matches[matchId].visitedOwners);

             return "Success";
        }else{
            while (StringUtils.equal(findVisitNode(goThroughList[visitIndex++]),"Fail")){
                matchFail();
            }

        }

    }

    function getMatchMaking(uint m_Id) constant returns(int256[], uint[], uint[], uint[], uint[], uint, string){
        return (matches[m_Id].visitedPriorities, matches[m_Id].visitedOwners, matches[m_Id].visitedProperties, matches[m_Id].visitedTradeable, matches[m_Id].confirmation, matches[m_Id].visitedCount, matches[m_Id].result);
    }

    function getMatchMakingConfirmed(uint m_Id, uint s_Id) constant returns(bool){
        return (matches[m_Id].confirmed[s_Id]);
    }

    function checkConfirmation() returns(bool){
        for (uint j = 0 ; j < matches.length ; j++){
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

        }

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
/*
    function __callback(bytes32 myid, string result) {
        if (msg.sender != oraclize_cbAddress()) throw;
        findOrigin();
        matchmaking(matchMakingInterval); // execute every 3 hours
    }

    function matchmaking(uint delay) {
        oraclize_query(delay, 'URL', '');
    }
*/

}

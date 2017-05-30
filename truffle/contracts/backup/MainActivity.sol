pragma solidity ^0.4.4;
import "./StringUtils.sol";
import "./usingOraclize.sol";

contract Congress{
    mapping (address => uint) public stakeholderId;
    function addMember();
    function initPlayerData(bytes32, bytes32);
}

contract usingProperty{
    function getPropertiesLength() constant returns(uint);
    function getPartialProperty(uint) returns(address);
    function getPropertyTypeAverageRating(uint, uint) constant returns(uint);
    function getPropertyTypeRating_Matchmaking(uint, uint) constant returns(uint);
    function checkTradeable(uint) constant returns(uint);
    function getPropertyType_Matchmaking(uint) constant returns(uint);
    function updateTradingStatus(uint, bool);
    function getPropertiesOwner(uint) constant returns(uint);
    function checkTradingStatus(uint) constant returns (bool);
    function addUserLandConfiguration(uint);
}

contract MainActivity2{
    function gameCoreMatchingDetail(uint , int256 , uint , uint );
    function gameCoreMatchingInit(uint , uint , string );
}

contract MainActivity is usingOraclize{
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
    MainActivity2 mainactivity2;

    uint floatOffset = 1000;
    uint matchMakingThreshold = 500;
    uint matchMakingInterval = 1800;

    uint matchLength = 0;

    uint john=  0;

    function MainActivity(address _congressAddress, address _propertyAddress, address _mainActivityAddress){
      john = 1;
      congress = Congress(_congressAddress);
      property = usingProperty(_propertyAddress);
      mainactivity2 = MainActivity2(_mainActivityAddress);

      congress.addMember();
      initGameData(0, "Moderator", "guard");

      //matchmaking(0);    // start executing matchmaking algo

    }

    function getJohn() constant returns (uint){
    return john;
    }

    function initGameData(uint s_Id, bytes32 _name, bytes32 _character){
        congress.initPlayerData(_name, _character);
        for (uint i = 0 ; i < 9 ; i++){
            property.addUserLandConfiguration(s_Id);
        }
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

             uint matchId = matchLength++;

             mainactivity2.gameCoreMatchingInit(matchId, visitedCount, "null");
             for (uint m = 0 ; m < visitedProperty.length ; m++){
                  mainactivity2.gameCoreMatchingDetail(matchId, visitedPriority[m], visitedOwners[m], visitedProperty[m]);
             }

             matchSuccess(visitedProperty, visitedOwners);
             return "Success";

        }else{
            while (StringUtils.equal(findVisitNode(goThroughList[visitIndex++]),"Fail")){
                matchFail();
            }

        }

    }

    function __callback(bytes32 myid, string result) {
        if (msg.sender != oraclize_cbAddress()) throw;
        findOrigin();
        matchmaking(matchMakingInterval); // execute every 3 hours
    }

    function matchmaking(uint delay) {
        oraclize_query(delay, 'URL', '');
    }

}

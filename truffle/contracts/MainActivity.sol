pragma solidity ^0.4.8;

contract Congress{
    mapping (address => uint) public stakeholderId;
    function getStakeholdersLength() constant returns(uint);
}

contract usingProperty{
    function getPropertiesLength() constant returns(uint);
    function getPartialProperty(uint p_Id) returns(address, uint);
    function getPropertyRating(uint p_Id, uint s_Id) constant returns(uint);
}

contract MainActivity{

    uint[] visitedProperty;
    uint visitedCount;  //in order to ignore the rest of the array elem
    uint[] actualVisitIndex;
    uint origin;

    event matchSuccess(uint[]);
    event matchFail();
    event test(uint);

    Congress congress;
    usingProperty property;

    address CongressAddress;
    address PropertyAddress;

    struct Match{
        uint id;
        uint[] actualVisitIndex;
        uint[] involvePropertyId;
    }

    Match[] public matches;

    function MainActivity(address _congressAddress, address _propertyAddress){
      CongressAddress = _congressAddress;
      PropertyAddress = _propertyAddress;

      congress = Congress(CongressAddress);
      property = usingProperty(PropertyAddress);
    }

    function sort(int256[] priorityList, uint[] visitList) returns(uint[]){
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
        return visitList;
    }

    function getPropertiesLength() returns(uint){
        return property.getPropertiesLength();
    }

    function startMatching() returns(bytes32 success){

        uint length = property.getPropertiesLength();
        int256[] memory priorityList = new int256[](length);
        uint[] memory visitList = new uint[](length);
        uint[] memory sortedList = new uint[](length);

        visitedProperty.length = 0;

        for (uint i = 0 ; i < length ; i++){
            var (owner, averageRating) = property.getPartialProperty(i);

            uint self_Importance = property.getPropertyRating(i, congress.stakeholderId(owner));
            int256 diff = int256(averageRating - self_Importance);

            priorityList[i] = diff;
            visitList[i] = i;
        }

        sortedList = sort(priorityList, visitList);
        actualVisitIndex = new uint[](length);
        origin = sortedList[0];

        visitedCount = 0;
        visitedProperty.length++;
        visitedProperty[visitedCount] = origin;
        success = tradingMatch(origin);
    }

    function checkExist(uint elem, uint[] data) returns(bool){
        for (uint i = 0 ; i < data.length; i++){
            if (elem == data[i] && i != 0){
                return false;
            }
        }
        return true;
    }

    function matchingAlgo(uint visitNode, uint i) constant returns(int256){

        var (owner, averageRating) = property.getPartialProperty(visitNode);
        uint self_Importance = property.getPropertyRating(visitNode, congress.stakeholderId(owner));
        uint currentRating = property.getPropertyRating(i, congress.stakeholderId(owner));
        int256 diff = int256(currentRating - self_Importance);

        return diff;
    }

    function tradingMatch(uint visitNode) returns(bytes32){

        uint length = property.getPropertiesLength();
        uint[] memory goThroughList = new uint[](length);

        int256[] memory diffList = new int256[](length);

        for (uint i = 0 ; i < length ; i++){
            var (newOwner, newAverageRating) = property.getPartialProperty(i);
            var (currentOwner, currentAverageRating) = property.getPartialProperty(visitNode);

            if (i == visitNode || (newOwner == currentOwner && i != origin)){
                continue;
            }

            diffList[i] = matchingAlgo(visitNode, i);
            goThroughList[i] = i;
        }
        goThroughList = sort(diffList, goThroughList);

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

        if (goThroughList[visitIndex] == origin){
             matchSuccess(visitedProperty);
             test(visitedCount);
             return "Success";
        }else{
            tradingMatch(goThroughList[visitIndex]);
        }

    }


    function initContract(){

    }

}

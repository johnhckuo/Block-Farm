pragma solidity ^0.4.4;

contract Congress{
    mapping (address => uint) public stakeholderId;
    function getStakeholdersLength() constant returns(uint);
    function getStakeholder(uint s_Id) constant returns(bytes32, uint, uint, bytes32, uint, uint, uint);
    function updateGameData(uint u_Id, uint _landSize, uint _level);
    function initPlayerData(bytes32 _name, bytes32 _character);
    function addMember(uint256 _threshold, uint256 _fund, uint _rate);


}

contract usingProperty{
    function getPropertiesLength() constant returns(uint);
    function getPartialProperty(uint p_Id) returns(address);
    function getPropertyRating(uint p_Id, uint s_Id) constant returns(uint);
    function getPropertyType(uint p_Id) constant returns(bytes32, uint, uint, bytes32, uint);
    function addUserPropertyType(uint u_Id, uint p_Id);
    function getPropertyTypeId(uint p_Id) constant returns(uint);
    function addUserLandConfiguration(uint u_Id);
    function getPropertyTypeAverageRating(uint p_Id, uint s_Id) constant returns(uint);
    function getPropertyTypeRating(uint p_Id, uint s_Id) constant returns(uint);
    function checkTradeable(uint p_Id) constant returns(uint);
}

contract MainActivity{

    uint[] visitedProperty;
    int256[] visitedPriority;

    uint visitedCount;  //in order to ignore the rest of the array elem
    uint[] actualVisitIndex;
    uint origin;

    event matchSuccess(uint[] id, int256[] priority);
    event matchFail();
    event test(uint);
    event returnOrigin(uint);
    
    Congress congress;
    usingProperty property;

    address CongressAddress;
    address PropertyAddress;

    uint unlockCropNum = 3;
    uint unlockCropLevel = 5;

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

      congress.addMember(0, 0, 0);
      initGameData(0, "Moderator", "guard");
    }

    function initGameData(uint s_Id, bytes32 _name, bytes32 _character){
        congress.initPlayerData(_name, _character);
        for (uint i = 0 ; i < 9 ; i++){
            property.addUserLandConfiguration(s_Id);

        }


    }

    function levelCap(uint _level) constant returns(uint){
        uint powerResult = 1;
        for (uint i = 0 ; i < _level ; i++){
            powerResult *= 2;
        }
        return powerResult*100;
    }

    function playerLevelUp(uint u_Id, uint random){

        var (name, exp, totalExp, character, landSize, level, stamina) = congress.getStakeholder(u_Id);
        level += 1;
        if (level % 5 == 0){
            landSize += 1;

            uint p_Id = property.getPropertyTypeId(random + ((level/unlockCropLevel)*unlockCropNum));
            property.addUserPropertyType(u_Id, p_Id);

            uint difference = (landSize*landSize) - ((landSize-1)*(landSize-1)) +1;
            for (uint i = 0 ; i < difference ; i++){
                property.addUserLandConfiguration(u_Id);
            }
        }

        congress.updateGameData(u_Id, landSize, level);
        //congress.updateUserExp(u_Id, exp);

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

    function getPropertiesLength() returns(uint){
        return property.getPropertiesLength();
    }

    function findOrigin() returns(bytes32 success){

        uint length = property.getPropertiesLength();
        int256[] memory priorityList = new int256[](length);
        uint[] memory visitList = new uint[](length);
        uint[] memory sortedList = new uint[](length);

        visitedProperty.length = 0;
        visitedPriority.length = 0;

        for (uint i = 0 ; i < length ; i++){
            uint access = property.checkTradeable(i);
            if (access == 0){
                continue;
            }
            address owner = property.getPartialProperty(i);
            uint averageRating = property.getPropertyTypeAverageRating(i, congress.stakeholderId(owner));
            uint self_Importance = property.getPropertyTypeRating(i, congress.stakeholderId(owner));
            int256 diff = int256(averageRating - self_Importance);

            priorityList[i] = diff;
            visitList[i] = i;
        }

        (priorityList, sortedList) = sort(priorityList, visitList);
        actualVisitIndex = new uint[](length);
        origin = sortedList[0];
        returnOrigin(origin);

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

        address owner = property.getPartialProperty(visitNode);

        uint self_Importance = property.getPropertyTypeRating(visitNode, congress.stakeholderId(owner));
        uint currentRating = property.getPropertyTypeRating(i, congress.stakeholderId(owner));

        int256 diff = int256(currentRating - self_Importance);

        return diff;
    }

    function findVisitNode(uint visitNode) returns(bytes32){

        uint length = property.getPropertiesLength();
        uint[] memory goThroughList = new uint[](length);

        int256[] memory diffList = new int256[](length);

        for (uint i = 0 ; i < length ; i++){

            if (property.checkTradeable(i) == 0){
                continue;
            }

            address newOwner = property.getPartialProperty(i);
            address currentOwner = property.getPartialProperty(visitNode);

            if (i == visitNode || (newOwner == currentOwner && i != origin)){
                continue;
            }

            diffList[i] = returnPriority(visitNode, i);
            goThroughList[i] = i;
        }
        (diffList, goThroughList) = sort(diffList, goThroughList);

        bool flag = false;
        uint visitIndex;

        for (uint j = 0 ; j< length ; j++){

            if (property.checkTradeable(j) == 0){
                continue;
            }

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

        if (goThroughList[visitIndex] == origin){
             matchSuccess(visitedProperty, visitedPriority);
             test(visitedCount);
             return "Success";
        }else{
            findVisitNode(goThroughList[visitIndex]);
        }

    }


}

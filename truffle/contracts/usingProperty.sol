pragma solidity ^0.4.4;

contract Congress{

    mapping (address => uint) public stakeholderId;
    function addProperty(uint _id, uint p_Id);
    function getStakeholdersLength() constant returns(uint);
    function getStakeholder(uint s_Id) constant returns(bytes32, uint256, uint256, uint, address, uint, bytes32);
    function getPropertyId(uint s_Id, uint index) constant returns(uint);
    function getStakeholderPropertyCount(uint s_Id) constant returns(uint);
}

contract usingProperty{

    event propertyAdded(bytes32);

    struct PropertyType{
        bytes32 name;
        uint id;
        uint[] rating;
        uint averageRating;
        bytes32[] img;
        bytes32 time;
        uint harvestUnit;
    }

    struct UserPropertyType{
        uint[] id;
        uint[] count;
    }

    PropertyType[] public propertyTypeList;

    mapping (uint => UserPropertyType) userPropertyTypeList;

    struct Property{
        bytes32 name;
        uint id;
        uint since;
        uint propertyCount;
        uint256 minUnit; //可拆分最小單位
        address owner;
        bytes32 extraData;
        uint propertyType;
        uint tradeable; //可被交易的數量
        bool isTrading;
    }

    Property[] public propertyList;


    address CongressAddress;
    Congress congress;
    address owner;

    function usingProperty(address _congressAddress){
        CongressAddress = _congressAddress;
        congress = Congress(CongressAddress);
        owner = msg.sender;
    }

    /*  ----------------------------------
        |                                |
        |       utility functions        |
        |                                |
        ----------------------------------  */


    function getStakeholdersLength() constant returns(uint){
        return congress.getStakeholdersLength();
    }

    /*  ----------------------------------
        |                                |
        |            property            |
        |                                |
        ----------------------------------  */

    function initUserProperty(uint p_Id){
        uint _id = propertyList.length++;
        Property prop = propertyList[_id];
        PropertyType pt = propertyTypeList[p_Id];

        prop.name = pt.name;
        prop.id= _id;
        prop.propertyCount= 0;
        prop.since= now;
        prop.minUnit= 0;
        prop.owner= msg.sender;
        prop.extraData= "";
        prop.propertyType = pt.id;
        prop.tradeable = 0;
    }

    function getPropertyTo2(uint i, address _from) constant returns(uint, uint, bytes32, uint, uint, bytes32){
        if(propertyList[i].owner == _from){
            return ( propertyList[i].id, propertyList[i].propertyType, propertyTypeList[propertyList[i].propertyType].name, propertyList[i].propertyCount, propertyList[i].tradeable, propertyTypeList[propertyList[i].propertyType].img[3]);
        }

    }


    function addProperty(bytes32 _name, uint _propertyCount, uint256 _minUnit, bytes32 _extraData, uint _type, uint _tradeable) returns(uint _id){
        bool flag = true;
        for (uint w = 0 ; w < propertyTypeList.length ; w++){
            if (_type == propertyTypeList[w].id){
                flag = false;
                break;
            }
        }
        if (flag){
            propertyAdded("Property Type Not Found");
        }

        _id = propertyList.length++;

        uint s_Id = congress.stakeholderId(msg.sender);
        congress.addProperty(s_Id, _id);

        Property prop = propertyList[_id];

        prop.name = _name;
        prop.id= _id;
        prop.propertyCount= _propertyCount;
        prop.since= now;
        prop.minUnit= _minUnit;
        prop.owner= msg.sender;
        prop.extraData= _extraData;
        prop.propertyType = _type;
        prop.tradeable = _tradeable;
        prop.isTrading = false;
    }

    function getPropertyByOwner(uint p_Id) constant returns (uint, bytes32, uint, uint256, bytes32, uint, uint){
        if(propertyList[p_Id].owner == msg.sender){
            return (propertyList[p_Id].id, propertyList[p_Id].name, propertyList[p_Id].propertyCount, propertyList[p_Id].minUnit, propertyList[p_Id].extraData, propertyList[p_Id].propertyType, propertyList[p_Id].tradeable);
        }else{
            throw;
        }
    }

    function removeProperty(uint _id){
        if (getPropertiesLength() == 0) throw;

        for (uint i = 0; i<propertyList.length; i++){
            propertyList[i] = propertyList[i+1];
        }
        delete propertyList[propertyList.length-1];
        propertyList.length--;
    }

    function getPropertiesLength() constant returns(uint){
        return propertyList.length;
    }

    function getProperty_MissionSubmit(uint p_Id) constant returns(uint, address, uint){
        return (propertyList[p_Id].propertyType, propertyList[p_Id].owner, propertyList[p_Id].propertyCount);
    }

    function getPartialProperty(uint p_Id) constant returns(address){
        return (propertyList[p_Id].owner);
    }

    function getPropertyRatingLength(uint p_Id) constant returns(uint){
        return propertyTypeList[p_Id].rating.length;
    }

    function getPropertyCount(uint _id) constant returns(uint){
        return propertyList[_id].propertyCount;
    }

    function updatePropertyCount_Sudo(uint _id, uint _propertyCount, uint _tradeable){
        propertyList[_id].propertyCount = _propertyCount;
        propertyList[_id].tradeable = _tradeable;
    }

    function updatePropertyCount(uint _id, uint _propertyCount, uint _tradeable){
        if(propertyList[_id].owner == msg.sender){
            propertyList[_id].propertyCount = _propertyCount;
            propertyList[_id].tradeable = _tradeable;
        }
    }

    function updatePropertyCount_Cropped(uint _id, uint _croppedCount){
        if(propertyList[_id].owner == msg.sender){
            uint currentCount = propertyList[_id].propertyCount;
            propertyList[_id].propertyCount = currentCount + _croppedCount;
        }
    }

    function updatePropertyCount_MissionSubmit(uint _id, uint _propertyCount){
        propertyList[_id].propertyCount = _propertyCount;
    }

    // for match making

    function getPropertyTypeRating_Matchmaking(uint p_Id, uint s_Id) constant returns(uint){
        return propertyTypeList[propertyList[p_Id].propertyType].rating[s_Id];
    }

    function getPropertyTypeAverageRating(uint p_Id, uint s_Id) constant returns(uint){
        return propertyTypeList[propertyList[p_Id].propertyType].averageRating;
    }

    function checkTradeable(uint p_Id) constant returns(uint){
        return propertyList[p_Id].tradeable;
    }

    function updateTradingStatus(uint p_Id, bool isTrading){
        propertyList[p_Id].isTrading = isTrading;
    }

    function checkTradingStatus(uint p_Id) constant returns (bool){
        return propertyList[p_Id].isTrading;
    }

    function getPropertyType_Matchmaking(uint p_Id) constant returns(uint){
        return propertyList[p_Id].propertyType;
    }

    function updateOwnershipStatus(uint receivedPID, uint currentPID){
        uint receivedCount = getPropertyCount(receivedPID);
        uint currentCount = getPropertyCount(currentPID);

        uint currentTradeable = checkTradeable(currentPID);
        uint receivedTradeable = checkTradeable(receivedPID);

        updatePropertyCount_Sudo(receivedPID, receivedCount + currentTradeable, receivedTradeable);
        updatePropertyCount_Sudo(currentPID, currentCount, 0);

    }

    function getPropertiesOwner(uint visitedProperty) constant returns(uint){

         uint visitedOwner;
         address owner = getPartialProperty(visitedProperty);
         visitedOwner = congress.stakeholderId(owner);
         return visitedOwner;

    }


    /*  ----------------------------------
        |                                |
        |       user property type       |
        |                                |
        ----------------------------------  */

    function addUserPropertyType(uint u_Id, uint p_Id){
        userPropertyTypeList[u_Id].id.push(p_Id);
        userPropertyTypeList[u_Id].count.push(0);
    }

    function updateUserPropertyType(uint u_Id, uint level){
        userPropertyTypeList[u_Id].count[level]++;
    }

    function getUserPropertyType(uint u_Id) constant returns(uint[], uint[]){
        return (userPropertyTypeList[u_Id].id, userPropertyTypeList[u_Id].count);
    }



    /*  ----------------------------------
        |                                |
        |       property type            |
        |                                |
        ----------------------------------  */

    function updatePropertyTypeRating(uint _id, uint rate, string operation){
        if (equal(operation,"update")){

            uint length = congress.getStakeholdersLength();

            length = length-1; // ignore founder rating

            uint s_Id = congress.stakeholderId(msg.sender);

            propertyTypeList[_id].rating[s_Id] = rate;

            propertyTypeList[_id].averageRating = ((propertyTypeList[_id].averageRating * (length-1))+rate)/length;

        }else if (equal(operation,"new")){

            for (uint j = 0 ; j < _id ; j++){
                propertyTypeList[j].rating.push(0);
            }
        }
    }

    function addPropertyType(bytes32 _name, bytes32[] _img, bytes32 _time, uint _harvestUnit){
        uint _id = propertyTypeList.length++;
        uint length = congress.getStakeholdersLength();
        for (uint j = 0 ; j < length ; j++){
            propertyTypeList[_id].rating.push(0);
        }

        PropertyType prop = propertyTypeList[_id];

        prop.name = _name;
        prop.id= _id;
        prop.averageRating = 0;

        uint imgLength = _img.length;
        for (uint i = 0 ; i < imgLength ; i++){
            propertyTypeList[_id].img.push(_img[i]);
        }

        prop.time = _time;
        prop.harvestUnit = _harvestUnit;
    }

    function getPropertyType(uint p_Id) constant returns(bytes32, uint, uint, uint){
        uint s_Id = congress.stakeholderId(msg.sender);
        return(propertyTypeList[p_Id].name, propertyTypeList[p_Id].id, propertyTypeList[p_Id].averageRating, propertyTypeList[p_Id].rating[s_Id]);
    }

    function getPropertyTypeId(uint p_Id) constant returns(uint){
        return propertyTypeList[p_Id].id;
    }

    function getPropertyTypeImg(uint p_Id, uint img_Id) constant returns(bytes32){
        return propertyTypeList[p_Id].img[img_Id];
    }

    function getPropertyType_forMission(uint p_id, uint cropStage) constant returns(bytes32, uint, bytes32){
        return(propertyTypeList[p_id].name, propertyTypeList[p_id].id, propertyTypeList[p_id].img[cropStage]);
    }

    function getPropertyTypeLength() constant returns(uint){
        return propertyTypeList.length;
    }

    /// @dev Does a byte-by-byte lexicographical comparison of two strings.
    /// @return a negative number if `_a` is smaller, zero if they are equal
    /// and a positive numbe if `_b` is smaller.
    function compare(string _a, string _b) returns (int) {
        bytes memory a = bytes(_a);
        bytes memory b = bytes(_b);
        uint minLength = a.length;
        if (b.length < minLength) minLength = b.length;
        //@todo unroll the loop into increments of 32 and do full 32 byte comparisons
        for (uint i = 0; i < minLength; i ++)
            if (a[i] < b[i])
                return -1;
            else if (a[i] > b[i])
                return 1;
        if (a.length < b.length)
            return -1;
        else if (a.length > b.length)
            return 1;
        else
            return 0;
    }
    /// @dev Compares two strings and returns true iff they are equal.
    function equal(string _a, string _b) returns (bool) {
        return compare(_a, _b) == 0;
    }
    /// @dev Finds the index of the first occurrence of _needle in _haystack
    function indexOf(string _haystack, string _needle) returns (int)
    {
      bytes memory h = bytes(_haystack);
      bytes memory n = bytes(_needle);
      if(h.length < 1 || n.length < 1 || (n.length > h.length))
        return -1;
      else if(h.length > (2**128 -1)) // since we have to be able to return -1 (if the char isn't found or input error), this function must return an "int" type with a max length of (2^128 - 1)
        return -1;
      else
      {
        uint subindex = 0;
        for (uint i = 0; i < h.length; i ++)
        {
          if (h[i] == n[0]) // found the first char of b
          {
            subindex = 1;
            while(subindex < n.length && (i + subindex) < h.length && h[i + subindex] == n[subindex]) // search until the chars don't match or until we reach the end of a or b
            {
              subindex++;
            }
            if(subindex == n.length)
              return int(i);
          }
        }
        return -1;
      }
    }


}

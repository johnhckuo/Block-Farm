pragma solidity ^0.4.4;

contract Congress{
    mapping (address => uint) public stakeholderId;
    function addProperty(uint _id, uint p_Id);
    function getStakeholdersLength() constant returns(uint);
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
        uint256 minUnit;
        address owner;
        bytes32 extraData;
        uint propertyType;
        uint tradeable;
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

    function stringToBytes(string memory source) returns (bytes32) {
        bytes memory bytesString = new bytes(32);
        bytesString = bytes(source);
            
        uint val;

        for (uint i = 0; i < 32; i++)  {
            val *= 256;
            if (i < bytesString.length)
                val |= uint8(bytesString[i]);
        }
        return bytes32(val);
    }

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
        prop.isTrading = false;
        uint s_Id = congress.stakeholderId(msg.sender);
        //congress.addProperty(s_Id, _id);
    }

    function getstakeholderid(address a) constant returns(uint){
        return congress.stakeholderId(a);
    }

    function init(address a){
        uint l = propertyList.length++;
        uint s_Id = congress.stakeholderId(a);
        congress.addProperty(0,l);
    }

    function getPropertyTo2(uint i, address _from) constant returns(uint, uint, bytes32, uint, uint, bytes32){
        if(propertyList[i].owner == _from){
            return ( propertyList[i].id, propertyList[i].propertyType, propertyTypeList[propertyList[i].propertyType].name, propertyList[i].propertyCount, propertyList[i].tradeable, propertyTypeList[propertyList[i].propertyType].img[3]);
        }
    }

    function getPropertyByOwner(uint p_Id) constant returns (uint, bytes32, uint, uint256, bytes32, uint, uint){
        if(propertyList[p_Id].owner == msg.sender){
            return (propertyList[p_Id].id, propertyList[p_Id].name, propertyList[p_Id].propertyCount, propertyList[p_Id].minUnit, propertyList[p_Id].extraData, propertyList[p_Id].propertyType, propertyList[p_Id].tradeable);
        }else{
            throw;
        }
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

    function getPropertyTypeAverageRating(uint p_Id) constant returns(uint){
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
         address owner = propertyList[visitedProperty].owner;
         visitedOwner = congress.stakeholderId(owner);
         return visitedOwner;
    }

    function addUserPropertyType(uint u_Id, address u_addr, uint p_Id){
        if(u_addr == 0x000){
            u_Id = congress.stakeholderId(u_addr);
        }
        userPropertyTypeList[u_Id].id.push(p_Id);
        userPropertyTypeList[u_Id].count.push(0);
    }

    function updateUserPropertyType(uint u_Id, uint level){
        userPropertyTypeList[u_Id].count[level]++;
    }

    function getUserPropertyType(uint u_Id) constant returns(uint[], uint[]){
        return (userPropertyTypeList[u_Id].id, userPropertyTypeList[u_Id].count);
    }

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

    function addPropertyType(string _name, string _time, uint _harvestUnit){
        uint _id = propertyTypeList.length++;
        uint length = congress.getStakeholdersLength();
        for (uint j = 0 ; j < length ; j++){
            propertyTypeList[_id].rating.push(0);
        }

        PropertyType prop = propertyTypeList[_id];

        prop.name = stringToBytes(_name);
        prop.id= _id;
        prop.averageRating = 0;
        prop.time = stringToBytes(_time);
        prop.harvestUnit = _harvestUnit;
    }

    function addPropertyTypeImg(uint p_Id, string img1, string img2, string img3, string img4, string img5){
        PropertyType prop = propertyTypeList[p_Id];
        prop.img.push(stringToBytes(img1));
        prop.img.push(stringToBytes(img2));
        prop.img.push(stringToBytes(img3));
        prop.img.push(stringToBytes(img4));
        prop.img.push(stringToBytes(img5));
    }

    function getPropertyType(uint p_Id) constant returns(bytes32, uint, uint, uint){
        uint s_Id = congress.stakeholderId(msg.sender);
        return(propertyTypeList[p_Id].name, propertyTypeList[p_Id].id, propertyTypeList[p_Id].averageRating, propertyTypeList[p_Id].rating[s_Id]);
    }

    function getPropertyTypeAll(uint p_Id) constant returns(bytes32, uint, uint[], uint, bytes32[], bytes32, uint){
        return(propertyTypeList[p_Id].name, propertyTypeList[p_Id].id, propertyTypeList[p_Id].rating, propertyTypeList[p_Id].averageRating, propertyTypeList[p_Id].img, propertyTypeList[p_Id].time, propertyTypeList[p_Id].harvestUnit);
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

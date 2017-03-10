pragma solidity ^0.4.2;

contract Congress{

    mapping (address => uint) public stakeholderId;

    function addProperty(uint _id, uint p_Id);
    function getStakeholdersLength() constant returns(uint);

    function getStakeholder(uint s_Id) constant returns(bytes32, uint256, uint256, uint, address, uint, bytes32);

    function getPropertyId(uint s_Id, uint index) constant returns(uint);

    function getStakeholderPropertyCount(uint s_Id) constant returns(uint);
}

contract usingProperty{

    event propertyAdded(bool);
    event propertyUpdated(uint);
    event updatedPropertiesCalled();
    event propertyNewed(uint);
    event propertyInited(uint);
    struct Property{
        bytes32 name;
        uint id;
        mapping (address => bool) accessStakeholders;
        uint since;
        uint256 propertyCount;
        bytes32 unit;  //單位
        uint256 minUnit; //可拆分最小單位
        address owner;
        bytes32 extraData;
        uint[] rating;
        uint averageRating;
    }

    Property[] public propertyList;

    address CongressAddress;
    Congress congress;
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


    function usingProperty(address _congressAddress){
        CongressAddress = _congressAddress;
        congress = Congress(CongressAddress);
    }

    function getCongressAddr() constant returns(address){
        return CongressAddress;
    }

    function getStakeholdersLength() constant returns(uint){
        return congress.getStakeholdersLength();
    }

    function addProperty(bytes32 _name, uint256 _propertyCount, address[] _accessStakeholders, bytes32 _unit, uint256 _minUnit, bytes32 _extraData, uint _rating) returns(uint _id){
        _id = propertyList.length++;

        uint s_Id = congress.stakeholderId(msg.sender);
        congress.addProperty(s_Id, _id);

      //  Stakeholder[] s_List = temp.stakeholders;

        Property prop = propertyList[_id];
        for (uint i = 0 ; i < _accessStakeholders.length ; i++){
          prop.accessStakeholders[_accessStakeholders[i]] = true;
        }

        uint length = congress.getStakeholdersLength();
        for (uint j = 0 ; j < length ; j++){
            updatePropertiesRating(_id, 0, "init");
        }

        prop.rating.length = congress.getStakeholdersLength();
        prop.name = _name;
        prop.id= _id;
        prop.propertyCount= _propertyCount;
        prop.since= now;
        prop.unit= _unit;
        prop.minUnit= _minUnit;
        prop.owner= msg.sender;
        prop.extraData= _extraData;
        prop.rating[s_Id]= _rating;
        prop.averageRating = _rating;

        propertyAdded(true);
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

    function getProperty(uint p_Id) constant returns(bytes32, uint, uint256, bytes32, uint256, address, bytes32){
        return (propertyList[p_Id].name, propertyList[p_Id].since, propertyList[p_Id].propertyCount, propertyList[p_Id].unit, propertyList[p_Id].minUnit, propertyList[p_Id].owner, propertyList[p_Id].extraData);
    }

    function getPartialProperty(uint p_Id) constant returns(address, uint){
        return (propertyList[p_Id].owner, propertyList[p_Id].averageRating);
    }

    function getPropertyRating(uint p_Id, uint s_Id) constant returns(uint){
        return propertyList[p_Id].rating[s_Id];
    }

    function getPropertyRatingLength(uint p_Id) constant returns(uint){
        return propertyList[p_Id].rating.length;
    }

    function returnSHA(bytes32 input) constant returns(bytes32){
	return sha3(input);
    }

    function updatePropertiesRating(uint _id, uint rate, bytes32 operation){
        updatedPropertiesCalled();
        if (sha3(operation) == sha3("init")){      //consider import string.utils contract ?
            propertyInited(_id);
            propertyList[_id].rating.push(0);
        }else if (sha3(operation) == sha3("update")){
            propertyUpdated(_id);

            uint length = congress.getStakeholdersLength();

            length = length-1; // ignore founder rating

            uint s_Id = congress.stakeholderId(msg.sender);
            propertyList[_id].rating[s_Id] = rate;
            propertyList[_id].averageRating = ((propertyList[_id].averageRating * (length-1))+rate)/length;
        }else if (sha3(operation) == sha3("new")){
            propertyNewed(_id);

            for (uint j = 0 ; j < _id ; j++){
                propertyList[j].rating.push(0);
            }
        }
    }


}

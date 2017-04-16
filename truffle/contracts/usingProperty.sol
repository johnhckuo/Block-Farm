pragma solidity ^0.4.8;
import "./StringUtils.sol";

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
    event propertyTypeAdded(bool);

    event propertyUpdated(uint);
    event updatedPropertiesCalled();
    event propertyNewed(uint);
    event propertyInited(uint);

    struct PropertyType{
        bytes32 name;
        uint id;
        bytes32 unit;  //單位
        uint256 minUnit; //可拆分最小單位
        uint[] rating;
        uint averageRating;
    }

    PropertyType[] public propertyTypeList;

    struct Property{
        bytes32 name;
        uint id;
        uint since;
        uint256 propertyCount;
        uint256 minUnit; //可拆分最小單位
        address owner;
        bytes32 extraData;
        uint[] rating;
        uint averageRating;
        uint propertyType;
        bool tradeable;
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

    function addProperty(bytes32 _name, uint256 _propertyCount, uint256 _minUnit, bytes32 _extraData, uint _rating, uint _type, bool _tradeable) returns(uint _id){

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

      //  Stakeholder[] s_List = temp.stakeholders;

        Property prop = propertyList[_id];


        uint length = congress.getStakeholdersLength();
        for (uint j = 0 ; j < length ; j++){
            updatePropertiesRating(_id, 0, "init");
        }

        prop.rating.length = congress.getStakeholdersLength();
        prop.name = _name;
        prop.id= _id;
        prop.propertyCount= _propertyCount;
        prop.since= now;
        prop.minUnit= _minUnit;
        prop.owner= msg.sender;
        prop.extraData= _extraData;
        prop.rating[s_Id]= _rating;
        prop.averageRating = _rating;
        prop.propertyType = _type;
        prop.tradeable = _tradeable;



        propertyAdded("Success");
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

    function getProperty(uint p_Id) constant returns(bytes32, uint, uint256, uint256, address, bytes32){
        return (propertyList[p_Id].name, propertyList[p_Id].since, propertyList[p_Id].propertyCount, propertyList[p_Id].minUnit, propertyList[p_Id].owner, propertyList[p_Id].extraData);
    }

    function getProperty_Shop(uint p_Id) constant returns( uint256, address, uint, bool){
        return (propertyList[p_Id].propertyCount,  propertyList[p_Id].owner, propertyList[p_Id].propertyType, propertyList[p_Id].tradeable);
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

    function updatePropertiesRating(uint _id, uint rate, string operation){
        updatedPropertiesCalled();
        if (StringUtils.equal(operation,"init")){      //consider import string.utils contract ?
            propertyInited(_id);
            propertyList[_id].rating.push(0);
        }else if (StringUtils.equal(operation,"update")){
            propertyUpdated(_id);

            uint length = congress.getStakeholdersLength();

            length = length-1; // ignore founder rating

            uint s_Id = congress.stakeholderId(msg.sender);
            propertyList[_id].rating[s_Id] = rate;
            propertyList[_id].averageRating = ((propertyList[_id].averageRating * (length-1))+rate)/length;

            propertyTypeList[_id].rating[s_Id] = rate;
            propertyTypeList[_id].averageRating = ((propertyTypeList[_id].averageRating * (length-1))+rate)/length;

        }else if (StringUtils.equal(operation,"new")){
            propertyNewed(_id);

            for (uint j = 0 ; j < _id ; j++){
                propertyList[j].rating.push(0);
            }
        }
    }


    function updatePropertyTypeRating(uint _id, uint rate, string operation){
        updatedPropertiesCalled();
        if (StringUtils.equal(operation,"update")){

            uint length = congress.getStakeholdersLength();

            length = length-1; // ignore founder rating

            uint s_Id = congress.stakeholderId(msg.sender);

            propertyTypeList[_id].rating[s_Id] = rate;
            propertyTypeList[_id].averageRating = ((propertyTypeList[_id].averageRating * (length-1))+rate)/length;

            for (uint i = 0 ; i < propertyList.length; i++){
                if (propertyList[i].propertyType == _id){
                    propertyList[i].averageRating = propertyTypeList[_id].averageRating;
                }
            }

        }else if (StringUtils.equal(operation,"new")){

            for (uint j = 0 ; j < _id ; j++){
                propertyTypeList[j].rating.push(0);
            }
        }
    }


    function addPropertyType(bytes32 _name, bytes32 _unit, uint256 _minUnit){

        uint _id = propertyTypeList.length++;

        uint length = congress.getStakeholdersLength();
        for (uint j = 0 ; j < length ; j++){
            propertyTypeList[_id].rating.push(0);
        }

        PropertyType prop = propertyTypeList[_id];

        prop.name = _name;
        prop.id= _id;
        prop.unit= _unit;
        prop.minUnit= _minUnit;
        prop.averageRating = 0;

        propertyTypeAdded(true);


    }

    function getPropertyType(uint p_id, uint u_id) constant returns(bytes32, uint, bytes32, uint256,  uint){
        return(propertyTypeList[p_id].name, propertyTypeList[p_id].id, propertyTypeList[p_id].unit, propertyTypeList[p_id].minUnit, propertyTypeList[p_id].averageRating);
    }

    function getPropertyTypeRating(uint u_id, uint p_id) constant returns(uint){
        return (propertyTypeList[p_id].rating[u_id]);
    }

    function getPropertyTypeLength() constant returns(uint){
        return propertyTypeList.length;
    }

}

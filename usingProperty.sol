pragma solidity ^0.4.2;

import "./Congress.sol";

contract usingProperty is Congress{

    event propertyAdded(bool);
    struct Property{
        bytes32 name;
        uint id;
        mapping (address => bool) accessStakeholders;
        uint since;
        uint256 propertyCount;
        bytes32 unit;  //單位
        bytes32 minUnit; //可拆分最小單位
        address owner;
        bytes32 extraData;
        uint[] rating;
    }

    Property[] public propertyList;

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


    function usingProperty(){
    }

    function addProperty(bytes32 _name, uint256 _propertyCount, address[] _accessStakeholders, uint _unit, bytes32 _minUnit, bytes32 _extraData, uint _rating) returns(bool success, uint _id){
        _id = propertyList.length++;
        // a little issue here, I can't create an identifier for each propertyList, therefore repeating propertyList issue might emerge

        uint s_Id = stakeholderId[msg.sender];

        mapping (address => bool) temp;
        for (uint i = 0 ; i < _accessStakeholders.length ; i++){
          temp[_accessStakeholders[i]] = true;
        }

        propertyList[_id].rating.length = stakeholders.length;

        Property prop;
        prop.rating.length = 1;
        prop.name = _name;
        prop.id= _id;
        prop.accessStakeholders= temp;
        prop.propertyCount= _propertyCount;
        prop.since= now;
        prop.unit= _unit;
        prop.minUnit= _minUnit;
        prop.owner= msg.sender;
        prop.extraData= _extraData;
        prop.rating[s_Id]= _rating;

        propertyList[_id] = prop;

        propertyAdded(true);
    }

    function removeProperty(uint _id){
        if (propertyList[_id] == 0) throw;

        for (uint i = propertyList[_id]; i<propertyList.length-1; i++){
            propertyList[i] = propertyList[i+1];
        }
        delete propertyList[propertyList.length-1];
        propertyList.length--;

    }

    function queryProperty(uint _id) returns (bytes32, uint, uint, uint256, address, bytes32){
        Property temp = propertyList[_id];
        return (temp.name, temp.id, temp.since, temp.propertyCount, temp.owner, temp.extraData);
    }


}

pragma solidity ^0.4.2;

contract Property{

  struct Property{
    bytes32 name;
    uint id;
    mapping (address => bool) accessStakeholders;
    uint since;
    uint256 propertyCount;

  }
  Property[] public properties;

  function Property(){
  }

  function addProperty(bytes32 _name, uint _id, uint256 _propertyCount, address[] _accessStakeholders){
     uint id = properties.length++;
      // a little issue here, I can't create an identifier for each properties, therefore repeating properties issue might emerge

     properties[id] = Property({
         name: _name,
         id: _id,
         propertyCount: _propertyCount,
         since: now
     });

     for (uint i = 0 ; i < _accessStakeholders.length ; i++){
      properties[id].accessStakeholders[_accessStakeholders[i]] = true;
     }

     PropertyChanged(targetProperty, true);
  }

  function removeProperty(uint _id){
      if (properties[_id] == 0) throw;

      for (uint i = properties[_id]; i<properties.length-1; i++){
          properties[i] = properties[i+1];
      }
      delete properties[properties.length-1];
      properties.length--;

  }



}

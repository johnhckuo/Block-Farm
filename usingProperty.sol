
contract usingProperty{

    event propertyAdded(bool);
    struct Property{
        bytes32 name;
        uint id;
        mapping (address => bool) accessStakeholders;
        uint since;
        uint256 propertyCount;
        address owner;
        bytes32 extraData;

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


    function Property(){
    }

    function addProperty(bytes32 _name, uint256 _propertyCount, address[] _accessStakeholders, bytes32 _extraData) returns(bool success, uint _id){
        uint _id = propertyList.length++;
        // a little issue here, I can't create an identifier for each propertyList, therefore repeating propertyList issue might emerge

        propertyList[_id] = Property({
            name: _name,
            id: _id,
            propertyCount: _propertyCount,
            since: now,
            address: msg.sender,
            extraData: _extraData

        });

        for (uint i = 0 ; i < _accessStakeholders.length ; i++){
          propertyList[_id].accessStakeholders[_accessStakeholders[i]] = true;
        }

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

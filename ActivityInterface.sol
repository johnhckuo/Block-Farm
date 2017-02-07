pragma solidity ^0.4.2;


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


contract ActivityInterface {
    //function balanceOf(address _owner) constant returns (uint256 balance);
    //function transfer(address _to, uint256 _amount) returns (bool success);

    event biddingAdded(bool);
    address owner;

    struct Bidding{
        uint id;
        uint propertyId;
        bytes32 name;
        uint256 startingPrice;
        uint startDate;
        uint closeDate;

    }

    Bidding[] biddingList;

    function ActivityInterface(){
        owner = msg.sender;
    }

    function addBidding(uint _propertyId, bytes32 _name, uint256 _startingPrice, uint _closeDate) returns(bool success, uint _id){
        uint _id = biddingList.length++;
        // a little issue here, I can't create an identifier for each biddingList, therefore repeating biddingList issue might emerge

        biddingList[_id] = Bidding({
            propertyId: _propertyId,
            name: _name,
            startingPrice: _startingPrice,
            startDate: now,
            closeDate: _closeDate
        });


        biddingAdded(true);
    }

    function removeBidding(uint _id) returns(bool success){
        if (biddingList[_id] == 0) throw;

        for (uint i = biddingList[_id]; i<biddingList.length-1; i++){
            biddingList[i] = biddingList[i+1];
        }
        delete biddingList[biddingList.length-1];
        biddingList.length--;

    }

    function queryBidding(uint _id) returns (uint, bytes32, uint256, uint, uint){
        Bidding temp = biddingList[_id];
        return (temp.propertyId, temp.name, temp.startingPrice, temp.startDate, temp.closeDate);
    }


}

contract BuyerInterface is ActivityInterface, usingProperty{


    function BuyerInterface(){

    }


    function getTicket(uint _id) returns (bool);
    function bid(uint256 input, address buyAddress) returns (bool success);

}

contract SellerInterface is ActivityInterface, usingProperty{


    function SellerInterface(){

    }

}

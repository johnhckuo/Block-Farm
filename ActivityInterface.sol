pragma solidity ^0.4.2;

import "./usingProperty.sol";

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

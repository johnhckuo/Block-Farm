pragma solidity ^0.4.2;

import "./usingProperty.sol";

contract ActivityInterface {
    //function balanceOf(address _owner) constant returns (uint256 balance);
    //function transfer(address _to, uint256 _amount) returns (bool success);

    event biddingAdded(bool);
    address owner;

    struct Bidding{
        uint id;
        address bidOwner;
        uint propertyId;
        bytes32 name;
        uint256 startingPrice;
        uint256 currentPrice;
        uint startDate;
        uint closeDate;
        uint lastUpdateDate;
        address lastBidder;
    }

    Bidding[] biddingList;

    function ActivityInterface(){
        owner = msg.sender;
    }

    function addBidding(uint _propertyId, bytes32 _name, uint256 _startingPrice, uint256 _currentPrice, uint _closeDate) returns(bool success, uint _id){
        uint _id = biddingList.length++;
        // a little issue here, I can't create an identifier for each biddingList, therefore repeating biddingList issue might emerge

        biddingList[_id] = Bidding({
            id: _id,
            bidOwner : msg.sender,
            propertyId: _propertyId,
            name: _name,
            startingPrice: _startingPrice,
            currentPrice: _startingPrice,
            startDate: now,
            closeDate: _closeDate,
            lastUpdateDate: now,
            lastBidder: 0
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

    function queryBidding(uint _id) returns (uint, bytes32, uint256, uint256, uint, uint){
        Bidding temp = biddingList[_id];
        return (temp.id, temp.bidOwner, temp.propertyId, temp.name, temp.startingPrice, temp.currentPrice, temp.startDate, temp.closeDate, temp.lastUpdateDate, temp.lastBidder);
    }


}

contract BuyerInterface is ActivityInterface, usingProperty{


    function BuyerInterface(){

    }

    function bid(uint id, uint256 bidPrice, address buyAddress) returns (bool success){
        if (bidPrice <= biddingList[_id].currrentPrice || now > biddingList[_id].closeDate || msg.sender == biddingList[_id].bidOwner) throw;
        biddingList[_id].currentPrice = bidPrice;
        biddingList[_id].lastBidder = msg.sender;
        biddingList[_id].lastUpdateDate = now;
    }

}

contract SellerInterface is ActivityInterface, usingProperty{

    function SellerInterface(){

    }

}

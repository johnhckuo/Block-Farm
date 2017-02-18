pragma solidity ^0.4.2;

import "./usingProperty.sol";

contract ActivityInterface is usingProperty{

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

    function resourceRating(uint _id, uint rating){
        uint s_id = stakeholderId[msg.sender];
        propertyList[_id].rating[s_id] = rating;
    }

}

contract SellerInterface is ActivityInterface, usingProperty{

    function SellerInterface(){

    }

}

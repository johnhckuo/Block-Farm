pragma solidity ^0.4.2;

import "./Congress.sol";

contract mainActivity is usingProperty{
    function mainActivity(){

    }

    function tradingMatch(){
        uint[] memory visitedProperty;
        uint highestRating = 0;

        for (uint i = 0 ; i < propertyList.length ; i++){
            for (uint j = 0 ; j < propertyList[i].rating.length ; j++){
                if (propertyList[i].rating[j] > highestRating){
                  highestRating = propertyList[i].rating[j];
                  break;
                }else{
                  continue;
                }




            }
        }


    }

    function initContract(){

    }


}

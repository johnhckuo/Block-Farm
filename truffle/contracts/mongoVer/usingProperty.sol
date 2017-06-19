pragma solidity ^0.4.4;

contract usingProperty{

    event propertyAdded(bytes32);

    struct PropertyType{
        bytes32 name;
        uint id;
        uint[] rating;
        uint averageRating;
    }

    PropertyType[] public propertyTypeList;

    address owner;

    function usingProperty(){
        owner = msg.sender;
    }

    /*  ----------------------------------
        |                                |
        |       property type            |
        |                                |
        ----------------------------------  */

    function updatePropertyTypeRating(uint _id, uint rate, string operation){
        if (equal(operation,"update")){

            uint length = congress.getStakeholdersLength();

            length = length-1; // ignore founder rating

            uint s_Id = congress.stakeholderId(msg.sender);

            propertyTypeList[_id].rating[s_Id] = rate;

            propertyTypeList[_id].averageRating = ((propertyTypeList[_id].averageRating * (length-1))+rate)/length;

        }else if (equal(operation,"new")){

            for (uint j = 0 ; j < _id ; j++){
                propertyTypeList[j].rating.push(0);
            }
        }
    }

    function addPropertyType(bytes32 _name, uint s_Length){
        uint _id = propertyTypeList.length++;
        for (uint j = 0 ; j < s_Length ; j++){
            propertyTypeList[_id].rating.push(0);
        }

        PropertyType prop = propertyTypeList[_id];
        prop.name = _name;
        prop.id= _id;
        prop.averageRating = 0;

    }

    function getPropertyType(uint p_Id) constant returns(bytes32, uint, uint, uint[]){
        return(propertyTypeList[p_Id].name, propertyTypeList[p_Id].id, propertyTypeList[p_Id].averageRating, propertyTypeList[p_Id].rating);
    }

    function getPropertyTypeId(uint p_Id) constant returns(uint){
        return propertyTypeList[p_Id].id;
    }

    function getPropertyTypeLength() constant returns(uint){
        return propertyTypeList.length;
    }

}

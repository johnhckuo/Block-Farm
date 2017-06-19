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

    function Property(){
        owner = msg.sender;
    }

    /*  ----------------------------------
        |                                |
        |       property type            |
        |                                |
        ----------------------------------  */

    function updatePropertyTypeRating(uint _id, uint rate, string operation, uint s_Length, uint s_Id){
        if (equal(operation,"update")){

            s_Length = s_Length-1; // ignore founder rating

            propertyTypeList[_id].rating[s_Id] = rate;

            propertyTypeList[_id].averageRating = ((propertyTypeList[_id].averageRating * (s_Length-1))+rate)/s_Length;

        }else if (equal(operation,"new")){

            for (uint j = 0 ; j < _id ; j++){
                propertyTypeList[j].rating.push(0);
            }
        }
    }

    function addPropertyType(string _name, uint s_Length){
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

    /// @dev Does a byte-by-byte lexicographical comparison of two strings.
    /// @return a negative number if `_a` is smaller, zero if they are equal
    /// and a positive numbe if `_b` is smaller.
    function compare(string _a, string _b) returns (int) {
        bytes memory a = bytes(_a);
        bytes memory b = bytes(_b);
        uint minLength = a.length;
        if (b.length < minLength) minLength = b.length;
        //@todo unroll the loop into increments of 32 and do full 32 byte comparisons
        for (uint i = 0; i < minLength; i ++)
            if (a[i] < b[i])
                return -1;
            else if (a[i] > b[i])
                return 1;
        if (a.length < b.length)
            return -1;
        else if (a.length > b.length)
            return 1;
        else
            return 0;
    }
    /// @dev Compares two strings and returns true iff they are equal.
    function equal(string _a, string _b) returns (bool) {
        return compare(_a, _b) == 0;
    }
    /// @dev Finds the index of the first occurrence of _needle in _haystack
    function indexOf(string _haystack, string _needle) returns (int)
    {
      bytes memory h = bytes(_haystack);
      bytes memory n = bytes(_needle);
      if(h.length < 1 || n.length < 1 || (n.length > h.length))
        return -1;
      else if(h.length > (2**128 -1)) // since we have to be able to return -1 (if the char isn't found or input error), this function must return an "int" type with a max length of (2^128 - 1)
        return -1;
      else
      {
        uint subindex = 0;
        for (uint i = 0; i < h.length; i ++)
        {
          if (h[i] == n[0]) // found the first char of b
          {
            subindex = 1;
            while(subindex < n.length && (i + subindex) < h.length && h[i + subindex] == n[subindex]) // search until the chars don't match or until we reach the end of a or b
            {
              subindex++;
            }
            if(subindex == n.length)
              return int(i);
          }
        }
        return -1;
      }
    }

}

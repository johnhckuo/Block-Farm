
pragma solidity ^0.4.4;

contract GameProperty{

    struct UserLandConfiguration{
        uint[] id;
        int256[] crop;
        int256[] land;
    }

    struct LandType{
        uint id;
        bytes32 name;
        bytes32 img;
        uint count;
    }

    mapping (uint => UserLandConfiguration) userLandConfigurationList;

    LandType[] public landTypeList;

    struct CropList{
        uint[] id;
        bytes32[] name;
        bytes32[] img;
        bytes32[] start;
        bytes32[] end;
        uint[] cropType;
        bool[] ripe;
        uint[] count;
    }

    mapping (uint => CropList) cropList;

    function GameProperty(){


    }
    /*  ----------------------------------
        |                                |
        |            Crop List           |
        |                                |
        ----------------------------------  */

    function addCropList(uint u_Id, bytes32 _name, bytes32 _img, bytes32 _start, bytes32 _end, uint _cropType, bool _ripe, uint _count){
        uint _id = cropList[u_Id].id.length++;
        cropList[u_Id].id[_id] = _id;
        cropList[u_Id].name.push(_name);
        cropList[u_Id].img.push(_img);
        cropList[u_Id].start.push(_start);
        cropList[u_Id].end.push(_end);
        cropList[u_Id].cropType.push(_cropType);
        cropList[u_Id].ripe.push(_ripe);
        cropList[u_Id].count.push(_count);

    }

    function updateCropList(uint u_Id, uint p_Id, bytes32 _name, bytes32 _img, bytes32 _start, bytes32 _end, uint _cropType, bool _ripe, uint _count){

        cropList[u_Id].name[p_Id] = _name;
        cropList[u_Id].img[p_Id] = _img;
        cropList[u_Id].start[p_Id] = _start;
        cropList[u_Id].end[p_Id] = _end;
        cropList[u_Id].cropType[p_Id] = _cropType;
        cropList[u_Id].ripe[p_Id] = _ripe;
        cropList[u_Id].count[p_Id] = _count;
    }
    //for thief
    function updateCropCount(uint u_Id, uint p_Id, uint _count){
        cropList[u_Id].count[p_Id] = _count;
    }

    function getCropList(uint u_Id) constant returns( uint[], bytes32[], bytes32[], bytes32[], bytes32[], uint[], bool[]){
        return (cropList[u_Id].id, cropList[u_Id].name, cropList[u_Id].img, cropList[u_Id].start, cropList[u_Id].end, cropList[u_Id].cropType, cropList[u_Id].ripe);
    }

    function getCropListCount(uint u_Id) constant returns(uint[]){
        return cropList[u_Id].count;
    }

    function getCropListLength(uint u_Id) constant returns(uint){
        return cropList[u_Id].id.length;
    }



    /*  ----------------------------------
        |                                |
        |       land configuration       |
        |                                |
        ----------------------------------  */

    function addUserLandConfiguration(uint u_Id, uint landSize){
        uint difference;
        if (landSize == 3){
            difference = landSize*landSize;
        }else{
            difference = (landSize*landSize) - ((landSize-1)*(landSize-1));
        }
        for (uint i = 0 ; i < difference ; i++){
            uint _id = userLandConfigurationList[u_Id].id.length++;
            userLandConfigurationList[u_Id].id.push(_id);
            userLandConfigurationList[u_Id].land.push(-1);
            userLandConfigurationList[u_Id].crop.push(-1);
        }

    }

    function updateUserLandConfiguration(uint u_Id, uint c_Id, int256 cropId, int256 landId, string operation){
        if (equal(operation,"land")){
            userLandConfigurationList[u_Id].land[c_Id] = landId;

        }else if (equal(operation,"crop")){
            userLandConfigurationList[u_Id].crop[c_Id] = cropId;
        }
    }

    function getUserLandConfiguration(uint u_Id) constant returns(int256[], int256[]){
        return (userLandConfigurationList[u_Id].land, userLandConfigurationList[u_Id].crop);

    }

    function moveUserLandPosition(uint u_Id, uint landSize){

        uint length = landSize-1;
        for (uint i = ((length*length)-1) ; i >= length  ; i--){
            userLandConfigurationList[s_Id].land[i + (i/length)] = userLandConfigurationList[s_Id].land[i];
            userLandConfigurationList[s_Id].crop[i + (i/length)] = userLandConfigurationList[s_Id].crop[i];
            userLandConfigurationList[s_Id].land[i] = -1;
            userLandConfigurationList[s_Id].crop[i] = -1;
        }
    }

    /*  ----------------------------------
        |                                |
        |            land type           |
        |                                |
        ----------------------------------  */

    function addLandType(bytes32 _name, bytes32 _img, uint _count){

        uint _id = landTypeList.length++;

        LandType land = landTypeList[_id];
        land.name = _name;
        land.id= _id;
        land.img = _img;
        land.count = _count;
    }

    function getLandType(uint l_Id) constant returns(bytes32, uint, bytes32, uint){
        return(landTypeList[l_Id].name, landTypeList[l_Id].id, landTypeList[l_Id].img, landTypeList[l_Id].count);
    }

    // StringUtils

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

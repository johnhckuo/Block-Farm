
pragma solidity ^0.4.2;

contract Congress{
    mapping (address => uint) public stakeholderId;
}

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
    address CongressAddress;
    Congress congress;

    function GameProperty(address _congressAddress){
        CongressAddress = _congressAddress;
        congress = Congress(CongressAddress);
    }

    function stringToBytes(string memory source) returns (bytes32) {
        bytes memory bytesString = new bytes(32);
        bytesString = bytes(source);
            
        uint val;

        for (uint i = 0; i < 32; i++)  {
            val *= 256;
            if (i < bytesString.length)
                val |= uint8(bytesString[i]);
        }
        return bytes32(val);
    }

    function addCropList(uint u_Id, string _name, string _img, string _start, string _end, uint _cropType, bool _ripe, uint _count){
        uint _id = cropList[u_Id].id.length++;
        cropList[u_Id].id[_id] = _id;
        cropList[u_Id].name.push(stringToBytes(_name));
        cropList[u_Id].img.push(stringToBytes(_img));
        cropList[u_Id].start.push(stringToBytes(_start));
        cropList[u_Id].end.push(stringToBytes(_end));
        cropList[u_Id].cropType.push(_cropType);
        cropList[u_Id].ripe.push(_ripe);
        cropList[u_Id].count.push(_count);
    }

    function updateCropList(uint u_Id, uint p_Id, string _name, string _img, string _start, string _end, uint _cropType, bool _ripe, uint _count){
        cropList[u_Id].name[p_Id] = stringToBytes(_name);
        cropList[u_Id].img[p_Id] = stringToBytes(_img);
        cropList[u_Id].start[p_Id] = stringToBytes(_start);
        cropList[u_Id].end[p_Id] = stringToBytes(_end);
        cropList[u_Id].cropType[p_Id] = _cropType;
        cropList[u_Id].ripe[p_Id] = _ripe;
        cropList[u_Id].count[p_Id] = _count;
    }

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

    function addUserLandConfiguration(uint u_Id, address u_addr, uint landSize){
        if(u_addr == 0x000){
            u_Id = congress.stakeholderId(u_addr);
        }
        uint difference;
        if (landSize == 3){
            difference = landSize*landSize;
        }else{
            difference = (landSize*landSize) - ((landSize-1)*(landSize-1));
        }
        uint _id = userLandConfigurationList[u_Id].id.length++;
        for (uint i = 0 ; i < difference ; i++){
            userLandConfigurationList[u_Id].id.push(_id);
            userLandConfigurationList[u_Id].land.push(9999);
            userLandConfigurationList[u_Id].crop.push(9999);
            _id++;
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
            userLandConfigurationList[u_Id].land[i + (i/length)] = userLandConfigurationList[u_Id].land[i];
            userLandConfigurationList[u_Id].crop[i + (i/length)] = userLandConfigurationList[u_Id].crop[i];
            userLandConfigurationList[u_Id].land[i] = -1;
            userLandConfigurationList[u_Id].crop[i] = -1;
        }
    }

    function addLandType(string _name, string _img, uint _count){

        uint _id = landTypeList.length++;

        LandType land = landTypeList[_id];
        land.name = stringToBytes(_name);
        land.id= _id;
        land.img = stringToBytes(_img);
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

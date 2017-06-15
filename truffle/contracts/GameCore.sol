pragma solidity ^0.4.4;

contract Congress{

    mapping (address => uint) public stakeholderId;

    function getStakeholder_Mission(uint s_Id) constant returns(uint);
    function getStakeholdersLength() constant returns(uint);
    function getStakeholder(uint) constant returns(bytes32, uint, uint, bytes32, uint, uint, uint);
}

contract usingProperty{
    function getPropertyTypeLength() constant returns(uint);
    function getPropertyType_forMission(uint p_id, uint cropStage) constant returns(bytes32, uint, bytes32);
}

contract GameCore{

    struct Mission{
        uint id;
        bytes32 name;
        uint exp;
        uint lvl_limitation;
        bool[] accountStatus;
        bool missionStatus;
        uint[] cropId;
        uint[] quantity;
    }

    Mission[] public MissionList;

    Congress congress;
    usingProperty usingPropertyInstance;

    function GameCore(address _congressAddress, address _usingPropertyInstanceAddress){
        congress = Congress(_congressAddress);
        usingPropertyInstance = usingProperty(_usingPropertyInstanceAddress);

        addMission("Mission0", 9999, 9999, false);
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

    function getPropertyTypeLength() constant returns(uint){
        return usingPropertyInstance.getPropertyTypeLength();
    }

    function pushMissionAccountStatus(){
        uint stakeholderLength = congress.getStakeholdersLength();
        for(uint i = 0; i < MissionList.length; i++){
            uint currentLength = MissionList[i].accountStatus.length;
            uint diff = stakeholderLength - currentLength;
            for(uint j = 0; j < diff; j++){
                MissionList[i].accountStatus.push(false);
            }
        }
    }

    function addMission(string _name, uint _exp, uint _lvl_limitation, bool _missionStatus){
        uint stakeholderLength = congress.getStakeholdersLength();
        uint _id = MissionList.length++;
        Mission obj = MissionList[_id];

        for(uint i = 0; i < stakeholderLength; i++){
            obj.accountStatus.push(false);
        }
        obj.id = _id;
        obj.name = stringToBytes(_name);
        obj.exp = _exp;
        obj.lvl_limitation = _lvl_limitation;
        obj.missionStatus = _missionStatus;
    }

    function addMissionItem(uint mId, uint _cropId, uint _quantity){
        Mission obj = MissionList[mId];

        obj.cropId.push(_cropId);
        obj.quantity.push(_quantity);
    }

    function getMission(uint m_Id) constant returns(uint, bytes32, uint, uint, bool){

        uint _MissionId;
        bytes32 _MissionName;
        uint _MissionExp;
        uint _MissionLimit;
        bool _MissionAccountstatus;

        uint s_Id = congress.stakeholderId(msg.sender);
        uint user_level = congress.getStakeholder_Mission(s_Id);
        Mission obj = MissionList[m_Id];
        if((obj.missionStatus)&&(user_level >= obj.lvl_limitation)){
            _MissionId = obj.id;
            _MissionName = obj.name;
            _MissionExp = obj.exp;
            _MissionLimit = obj.lvl_limitation;
            _MissionAccountstatus = obj.accountStatus[s_Id];
        }
        else{
            if(!obj.missionStatus){
                return (0, "mission close", 0, 999, true);
            }
            else if(user_level < obj.lvl_limitation){
                return (999, "lv_limited", 0, 999, true);
            }
        }
        return (_MissionId, _MissionName, _MissionExp, _MissionLimit, _MissionAccountstatus);
    }

    function getMissionItemsArray(uint mId) constant returns(uint[] ,uint[]){

        Mission obj = MissionList[mId];

        uint[] memory _MissionCropId = new uint[](obj.cropId.length);
        uint[] memory _MissionQuantity = new uint[](obj.cropId.length);
        for(uint j = 0; j < obj.cropId.length; j++){
            _MissionCropId[j] = obj.cropId[j];
            _MissionQuantity[j] = obj.quantity[j];
        }
        return(_MissionCropId,_MissionQuantity);
    }

    function getMissionItems(uint mId, uint itemId) constant returns(uint ,bytes32, uint, bytes32){
        Mission obj = MissionList[mId];

        var (name, id, img) = usingPropertyInstance.getPropertyType_forMission(obj.cropId[itemId], 3);
        return (obj.cropId[itemId], name, obj.quantity[itemId], img);
    }

    function getMissionsLength() constant returns(uint){
        return MissionList.length;
    }

    function getMissionItemsLength(uint mId) constant returns(uint){
        return MissionList[mId].cropId.length;
    }

    function submitMission(uint mId){
    uint s_Id = congress.stakeholderId(msg.sender);
    MissionList[mId].accountStatus[s_Id] = true;
    }
}

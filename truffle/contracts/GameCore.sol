pragma solidity ^0.4.8;
import "./StringUtils.sol";

contract Congress{

    mapping (address => uint) public stakeholderId;

    function addProperty(uint _id, uint p_Id);
    function getStakeholdersLength() constant returns(uint);

    function getStakeholder(uint s_Id) constant returns(bytes32, uint256, uint256, uint, address, uint, bytes32);


}

contract GameCore{

    struct Mission{
        uint id;
        bytes32 name;
        uint exp;
        uint lvl_limitation;
        bool[] accountStatus;
        bool missionStatus;
    }

    Mission[] public MissionList;

    struct MissionItem{
        uint id;
        uint missionId;
        uint cropId;
        uint quantity;
    }

    MissionItem[] public MissionItemList;

    struct CropType{
        uint id;
        bytes32 name;
        bytes32[] img;
        uint count;
        bytes32 time;
    }

    CropType[] public CropTypeList;

    address CongressAddress;
    Congress congress;

    function addCropType(bytes32 _name, uint _count, bytes32 _time){
        uint _id = CropTypeList.length;

        CropType obj = CropTypeList[_id];

        obj.id = _id;
        obj.name = _name;
        obj.img[0] = "_seed.svg";
        obj.img[1] = "_grow.svg";
        obj.img[2] = "_harvest.svg";
        obj.img[3] = ".svg";
        obj.count = _count;
        obj.time = _time;
    }

    function getCropType(uint cId, uint cropStage) constant returns(bytes32, bytes32, uint, bytes32){
        CropType obj = CropTypeList[cId];
        return (obj.name, obj.img[cropStage], obj.count, obj.time);
    }

    function getCropTypesLength() constant returns(uint){
        return CropTypeList.length;
    }

    function addMissionItem(uint _missionId, uint _cropId, uint _quantity){
        uint _id = MissionItemList.length;

        MissionItem obj = MissionItemList[_id];

        obj.id = _id;
        obj.missionId = _missionId;
        obj.cropId = _cropId;
        obj.quantity = _quantity;
    }

    function addMission(bytes32 _name, uint _exp, uint _lvl_limitation, bool _missionStatus){
        uint stakeholderLength = congress.getStakeholdersLength();

        uint _id = MissionList.length;

        Mission obj = MissionList[_id];

        for(uint i = 0; i < stakeholderLength; i++){
            obj.accountStatus[i] = false;
        }
        obj.id = _id;
        obj.name = _name;
        obj.exp = _exp;
        obj.lvl_limitation = _lvl_limitation;
        obj.missionStatus = _missionStatus;

    }

    function getMission(uint mId) constant returns(bytes32, uint, uint, bool){
        Mission obj = MissionList[mId];

        uint s_Id = congress.stakeholderId(msg.sender);

        if(MissionList[mId].missionStatus){
            return (obj.name, obj.exp, obj.lvl_limitation, obj.accountStatus[s_Id]);
        }
    }

    function getMissionItems(uint mId, uint itemId) constant returns(uint ,bytes32, uint){
        MissionItem obj = MissionItemList[itemId];
        if(obj.missionId == mId){
            bytes32 cropName = CropTypeList[obj.cropId].name;
            return (obj.cropId, cropName, obj.quantity);
        }
    }
    
    function getMissionsLength() constant returns(uint){
        return MissionList.length;
    }

    function getMissionItemsLength() constant returns(uint){
        return MissionItemList.length;
    }

}

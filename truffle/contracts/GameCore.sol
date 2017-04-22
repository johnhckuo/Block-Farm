pragma solidity ^0.4.8;
import "./StringUtils.sol";

contract Congress{

    mapping (address => uint) public stakeholderId;

    function addProperty(uint _id, uint p_Id);
    function getStakeholdersLength() constant returns(uint);

    function getStakeholder(uint s_Id) constant returns(bytes32, uint256, uint256, uint, address, uint, bytes32);
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

    address CongressAddress;
    Congress congress;
    address usingPropertyInstanceAddress;
    usingProperty usingPropertyInstance;

    function GameCore(address _congressAddress, address _usingPropertyInstanceAddress){
        CongressAddress = _congressAddress;
        congress = Congress(CongressAddress);
        usingPropertyInstanceAddress = _usingPropertyInstanceAddress;
        usingPropertyInstance = usingProperty(usingPropertyInstanceAddress);
    }

    function getPropertyTypeLength() constant returns(uint){
        return usingPropertyInstance.getPropertyTypeLength();
    }

    function addMission(bytes32 _name, uint _exp, uint _lvl_limitation, bool _missionStatus){
        uint stakeholderLength = congress.getStakeholdersLength();
        uint _id = MissionList.length++;
        Mission obj = MissionList[_id];
        
        for(uint i = 0; i < stakeholderLength; i++){
            obj.accountStatus.push(false);
        }
        obj.id = _id;
        obj.name = _name;
        obj.exp = _exp;
        obj.lvl_limitation = _lvl_limitation;
        obj.missionStatus = _missionStatus;
    }

    function addMissionItem(uint mId, uint _cropId, uint _quantity){
        Mission obj = MissionList[mId];

        obj.cropId.push(_cropId);
        obj.quantity.push(_quantity);
    }

    function getMission(uint mId) constant returns(bytes32, uint, uint, bool){
        Mission obj = MissionList[mId];

        uint s_Id = congress.stakeholderId(msg.sender);

        if(MissionList[mId].missionStatus){
            return (obj.name, obj.exp, obj.lvl_limitation, obj.accountStatus[s_Id]);
        }
    }
        event cropnamegetting(bytes32);
    function getMissionItems(uint mId, uint itemId) constant returns(uint ,bytes32, uint){
        Mission obj = MissionList[mId];
       
        var (name, id, img) = usingPropertyInstance.getPropertyType_forMission(obj.cropId[itemId], 3);

        cropnamegetting(name);
        return (obj.cropId[itemId], name, obj.quantity[itemId]);
        
    }

    //function getMissionItems_forList(uint itemId) constant returns(uint, uint, bytes32, uint){
    //    MissionItem obj = MissionItemList[itemId];
    //    bytes32 cropName = CropTypeList[obj.cropId].name;
    //    return (obj.missionId, obj.cropId, cropName, obj.quantity);
    //}
    
    function getMissionsLength() constant returns(uint){
        return MissionList.length;
    }

    function getMissionItemsLength(uint mId) constant returns(uint){
        return MissionList[mId].cropId.length;
    }

}

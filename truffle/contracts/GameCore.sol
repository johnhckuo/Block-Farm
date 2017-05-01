pragma solidity ^0.4.4;
import "./StringUtils.sol";

contract Congress{

    mapping (address => uint) public stakeholderId;

    function addProperty(uint _id, uint p_Id);
    function getStakeholdersLength() constant returns(uint);

    function getStakeholder(uint s_Id) constant returns(bytes32, uint256, uint256, uint, address, uint, bytes32);
    function getStakeholder_Mission(uint s_Id) constant returns(uint);
}

contract usingProperty{
    function getPropertyTypeLength() constant returns(uint);
    function getPropertyType_forMission(uint p_id, uint cropStage) constant returns(bytes32, uint, bytes32);
    function getPropertiesLength() constant returns(uint);
    function updatePropertyCount_MissionSubmit(uint _id, uint _propertyCount);
    function getProperty_MissionSubmit(uint p_Id) constant returns(uint, address, uint);
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

        addMission("Mission0", 9999, 9999, false);
    }

    function getPropertyTypeLength() constant returns(uint){
        return usingPropertyInstance.getPropertyTypeLength();
    }

    function pushMissionAccountStatus(){
        uint currentLength = MissionList[0].accountStatus.length;
        uint stakeholderLength = congress.getStakeholdersLength();
        uint diff = stakeholderLength - currentLength;
        if(diff > 0){
            for(uint i = 1; i <= diff; i++){
                for(uint j = 0; j < MissionList.length; j++){
                    MissionList[j].accountStatus.push(false);
                }
            }
        }
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
        uint user_level = congress.getStakeholder_Mission(s_Id);

        if((MissionList[mId].missionStatus)&&(user_level >= obj.lvl_limitation)){
            return (obj.name, obj.exp, obj.lvl_limitation, obj.accountStatus[s_Id]);
        }
        else{
            return ("empty_mission", 0, 999, true);
        }
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
        uint missionItemLength = getMissionItemsLength(mId);
        uint propertyLength = usingPropertyInstance.getPropertiesLength();
        for(uint i = 0; i < missionItemLength; i++){
            
            var (cropId, name, quantity, img) = getMissionItems(mId, i);
            
            for(uint j = 0; j < propertyLength; j++){
                var (propertyType, propertyOwner, propertyCount) = usingPropertyInstance.getProperty_MissionSubmit(j);
                if((propertyOwner == msg.sender)&&(propertyType == cropId)){
                    uint countResult = propertyCount - quantity;
                    if(countResult >= 0){
                        usingPropertyInstance.updatePropertyCount_MissionSubmit(j, countResult);
                        break;
                    }
                }
            }
        }
    uint s_Id = congress.stakeholderId(msg.sender);
    MissionList[mId].accountStatus[s_Id] = true;
    }

}

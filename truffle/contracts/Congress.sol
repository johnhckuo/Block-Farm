pragma solidity ^0.4.4;

contract Congress{

    mapping (address => uint) public stakeholderId;
    Stakeholder[] public stakeholders;

    StakeholderGameData[] public stakeholdersGameData;
    address owner;

    event addmember_test(bytes32);
    event int_test(uint);
    event int256_test(uint256);

    struct Stakeholder {
        uint256 threshold;
        uint256 fund;
        uint256 id;
        uint rate;
        address addr;
        uint since;
        uint farmerLevel;

    }

    struct StakeholderGameData {
        bytes32 name;
        bytes32 character;
        uint exp;
        uint totalExp;
        uint landSize;
        uint level;
        uint stamina;
        uint guardId;
        uint[] thiefId;
        uint propertyCount;
        uint[] propertyId;
        bytes32 lastLogin;
    }

    struct Syndicate{
        uint id;
        uint characterId;
        int256 progress;
        uint exp;
        uint totalExp;
        uint level;
        int256 success;
        int256 fail;
        bytes32 character;
    }

    function Congress(){
       owner = msg.sender;
    }

    function getStakeholdersLength() constant returns(uint){
        return stakeholders.length;
    }

    function getStakeholder(uint s_Id) constant returns(bytes32, uint, uint, bytes32, uint, uint, uint){
        return (stakeholdersGameData[s_Id].name, stakeholdersGameData[s_Id].exp, stakeholdersGameData[s_Id].totalExp, stakeholdersGameData[s_Id].character, stakeholdersGameData[s_Id].landSize, stakeholdersGameData[s_Id].level, stakeholdersGameData[s_Id].stamina);
    }

    function getStakeholderLastLogin(uint s_Id) constant returns(bytes32){
        return stakeholdersGameData[s_Id].lastLogin;
    }

    function getStakeholder_Mission(uint s_Id) constant returns(uint){
        return stakeholdersGameData[s_Id].level;
    }

    function getPropertyList(uint s_Id) constant returns(uint[]){
        return stakeholdersGameData[s_Id].propertyId;
    }

    function getPropertyId(uint s_Id, uint index) constant returns(uint){
        return stakeholdersGameData[s_Id].propertyId[index];
    }

    function getStakeholderPropertyCount(uint s_Id) constant returns(uint){
        return stakeholdersGameData[s_Id].propertyCount;
    }

    function addProperty(uint _id, uint p_Id){
        stakeholdersGameData[_id].propertyCount++;
        stakeholdersGameData[_id].propertyId.push(p_Id);
    }

    function addMember(uint256 _threshold, uint256 _fund, uint _rate){
        uint id;
        address targetStakeholder = msg.sender;
        if (stakeholderId[targetStakeholder] == 0) {
           stakeholderId[targetStakeholder] = stakeholders.length;
           id = stakeholders.length++;

           stakeholders[id].threshold=_threshold;
           stakeholders[id].fund=_fund;
           stakeholders[id].id=id;
           stakeholders[id].rate=_rate;
           stakeholders[id].addr=msg.sender;
           stakeholders[id].since=now;


           stakeholders[id].farmerLevel = 0;

            //04.21 Powei
            //  mission status[] needed to be pushed

        }

    }

    function initPlayerData(bytes32 _name, bytes32 _character){

         uint _id = stakeholdersGameData.length++;
         stakeholdersGameData[_id].name=_name;

         stakeholdersGameData[_id].character= _character;

         stakeholdersGameData[_id].exp = 0;
         stakeholdersGameData[_id].totalExp = 0;
         stakeholdersGameData[_id].landSize = 3;
         stakeholdersGameData[_id].level = 0;
         stakeholdersGameData[_id].stamina = 100;
         stakeholdersGameData[_id].lastLogin = 0;

         //stakeholders[_id].guardId = 0;
         //stakeholders[_id].thiefId = 0;
    }

    function updateUserExp(uint u_Id, uint exp){
        stakeholdersGameData[u_Id].exp = exp;
        stakeholdersGameData[u_Id].totalExp += exp;
    }


    function updateUserStamina(uint u_Id, uint sta){
        stakeholdersGameData[u_Id].stamina = sta;
    }

    function updateStakeholderLastLogin(uint u_Id, bytes32 _lastLogin){
        stakeholdersGameData[u_Id].lastLogin = _lastLogin;
    }

    function updateGameData(uint u_Id, uint _landSize, uint _level){
        stakeholdersGameData[u_Id].landSize = _landSize;
        stakeholdersGameData[u_Id].level = _level;


    }

    function removeStakeholder(address targetStakeholder){
        if (stakeholderId[targetStakeholder] == 0) throw;

        for (uint i = stakeholderId[targetStakeholder]; i<stakeholders.length-1; i++){
            stakeholders[i] = stakeholders[i+1];
        }
        delete stakeholders[stakeholders.length-1];
        stakeholders.length--;
    }

}

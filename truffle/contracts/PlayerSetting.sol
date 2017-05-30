pragma solidity ^0.4.4;

contract Congress{
    function getStakeholder(uint) constant returns(bytes32, uint, uint, bytes32, uint, uint, uint);
    function updateGameData(uint, uint, uint);
    function addMember();
    function initPlayerData(bytes32, bytes32);
}

contract usingProperty{
    function addUserPropertyType(uint, uint);
}

contract GameProperty{
  function addUserLandConfiguration(uint);
  function moveUserLandPosition(uint u_Id, uint oldId, uint newId);
}

contract PlayerSetting{
    Congress congress;
    usingProperty property;
    GameProperty gameProperty;
    uint unlockCropNum = 3;
    uint unlockCropLevel = 5;

    function PlayerSetting(address _congressAddress, address _usingPropertyInstanceAddress, address _gamePropertyAddress){
        congress = Congress(_congressAddress);
        property = usingProperty(_usingPropertyInstanceAddress);
        gameProperty = GameProperty(_gamePropertyAddress);

        congress.addMember();
        initGameData(0, "Moderator", "guard");
    }
    function levelCap(uint _level) constant returns(uint){
        uint powerResult = 1;
        for (uint i = 0 ; i < _level ; i++){
            powerResult *= 2;
        }
        return powerResult*100;
    }

    function playerLevelUp(uint u_Id, uint random){

        var (name, exp, totalExp, character, landSize, level, stamina) = congress.getStakeholder(u_Id);
        level += 1;
        if (level % 5 == 0){
            landSize += 1;

            uint p_Id = random + ((level/unlockCropLevel)*unlockCropNum);
            property.addUserPropertyType(u_Id, p_Id);

            uint difference = (landSize*landSize) - ((landSize-1)*(landSize-1));
            for (uint i = 0 ; i < difference ; i++){
                gameProperty.addUserLandConfiguration(u_Id);
            }
            //levelupLandUpdate(landSize, u_Id);
        }
        congress.updateGameData(u_Id, landSize, level);
        //congress.updateUserExp(u_Id, exp);

    }

    function levelupLandUpdate(uint landSize, uint s_Id){
        uint length = landSize-1;

        //ignore the first line since their id remains the same
        for (uint i = ((length*length)-1) ; i >= length  ; i--){
            gameProperty.moveUserLandPosition(s_Id, i, i + (i/length));
        }

    }

    function initGameData(uint s_Id, bytes32 _name, bytes32 _character){
        congress.initPlayerData(_name, _character);
        for (uint i = 0 ; i < 9 ; i++){
            gameProperty.addUserLandConfiguration(s_Id);
        }
    }
}

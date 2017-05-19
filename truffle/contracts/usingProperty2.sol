pragma solidity ^0.4.4;

contract Congress{
    function getPropertyIndex(uint u_Id) constant returns(uint);
}

contract usingProperty{
    function getPropertyTo2(uint i, address _from) constant returns(uint, uint, bytes32, uint, uint, bytes32);
    function getPropertiesLength() constant returns(uint);
    function getPropertyTypeLength() constant returns(uint);
}

contract usingProperty2{

    address CongressAddress;
    Congress congress;
    address usingPropertyInstanceAddress;
    usingProperty usingPropertyInstance;

    uint[] get_PropertyId;
    bytes32[] get_PropertyName;
    uint[] get_PropertyType;
    uint[] get_PropertyCount;
    uint[] get_PropertyTradable;
    bytes32[] get_PropertyImg;
    
    function usingProperty2(address _congressAddress, address _usingPropertyInstanceAddress){
        CongressAddress = _congressAddress;
        congress = Congress(CongressAddress);
        usingPropertyInstanceAddress = _usingPropertyInstanceAddress;
        usingPropertyInstance = usingProperty(usingPropertyInstanceAddress);
    }

    function getAllProperty(uint u_Id) constant returns(uint[], uint[], bytes32[], uint[], uint[], bytes32[]){
        for(uint i = congress.getPropertyIndex(u_Id); i < usingPropertyInstance.getPropertiesLength(); i++){
            var ( _get_PropertyId, _get_PropertyType, _get_PropertyName, _get_PropertyCount, _get_PropertyTradable, _get_PropertyImg) = usingPropertyInstance.getPropertyTo2(i, msg.sender);
            //if(_Owner == msg.sender){
                get_PropertyId.push(_get_PropertyId);
                get_PropertyName.push(_get_PropertyName);
                get_PropertyType.push(_get_PropertyType);
                get_PropertyCount.push(_get_PropertyCount);
                get_PropertyTradable.push(_get_PropertyTradable);
                get_PropertyImg.push(_get_PropertyImg);
            //}
            //else{
            //}
            
        }
    return (get_PropertyId, get_PropertyType, get_PropertyName, get_PropertyCount, get_PropertyTradable, get_PropertyImg);
    }     
}

var Congress = artifacts.require("./Congress.sol");
var usingProperty = artifacts.require("./usingProperty.sol");
var MainActivity = artifacts.require("./MainActivity.sol");
var GameCore = artifacts.require("./GameCore.sol");

var CongressAddr;

contract('Congress', function (accounts) {
   // it("adding new member", function () {
   //     var congress;
   //     var property;

   //     return Congress.deployed().then(function (instance) {
   //         return instance.addMember(0, 0, 100, { from: accounts[1] });

   //     }).then(function (txs) {
   //     });
   // });

   // it("bla", function(){
   // return Congress.deployed().then(function (instance){
   // 	return instance.initGameData("Bill", "Guard", {from:accounts[1]});
   // });
	
   //});

    it("check stakeholders length", function () {
        return Congress.deployed().then(function (instance) {
            return instance.getStakeholdersLength.call();
        }).then(function (res) {
            console.log(res);
        });
    });

    it("add propertyType", function () {
        return usingProperty.deployed().then(function (instance) {
            return instance.addPropertyType('Cauliflower', ["s1", "s2", "s3", "s4"], '0.0.0.10', 4, { from: accounts[0], gas: 2000000 });
        });
    });
    it("add propertyType", function () {
        return usingProperty.deployed().then(function (instance) {
            return instance.addPropertyType('Cauliflower', ["s1", "s2", "s3", "s4"], '0.0.0.10', 4, { from:accounts[0], gas: 2000000 });
        });
    });
    it("add propertyType", function () {
        return usingProperty.deployed().then(function (instance) {
            return instance.addPropertyType('Cauliflower', ["s1", "s2", "s3", "s4"], '0.0.0.10', 4, { from:accounts[0], gas: 2000000 });
        });
    });

    it("add property", function () {
        return usingProperty.deployed().then(function (instance) {
            return instance.addProperty('Carrot', 4, 1, '', 0, 0, 0, { from: accounts[1], gas: 2000000 });
        });
    });

    it("add property", function () {
        return usingProperty.deployed().then(function (instance) {
            return instance.addProperty('Radish', 14, 1, '', 0, 1, 0, { from: accounts[1], gas: 2000000 });
        });
    });

    it("add property", function () {
        return usingProperty.deployed().then(function (instance) {
            return instance.addProperty('Lettuce', 4, 1, '', 0, 2, 0, { from: accounts[1], gas: 2000000 });
        });
    });

    //it("add property", function () {
    //    return usingProperty.deployed().then(function (instance) {
    //        return instance.addProperty('Cauliflower', 4, 1, '', 0, 0, 0, { from: accounts[1], gas: 2000000 });
    //    });
    //});

    it("add mission", function () {
        return GameCore.deployed().then(function (instance) {
            return instance.addMission('Mission1', 100, 0, true, { from: accounts[0], gas: 2000000 });
        });
    });

    it("add mission item", function () {
        return GameCore.deployed().then(function (instance) {
            return instance.addMissionItem(0, 0, 3, { from: accounts[0], gas: 2000000 });
        });
    });

    it("add mission item", function () {
        return GameCore.deployed().then(function (instance) {
            return instance.addMissionItem(0, 1, 4, { from: accounts[0], gas: 2000000 });
        });
    });

    

    it("get property length", function () {
        return usingProperty.deployed().then(function (instance) {
            return instance.getPropertiesLength.call( { from: accounts[1]});
        }).then(function (res) {
            console.log(res);
        });
    });

    it("get property item", function () {
        return usingProperty.deployed().then(function (instance) {
            return instance.getProperty_MissionSubmit.call(0, { from: accounts[1] });
        }).then(function (res) {
            console.log(res);
        });
    });

    it("get property item", function () {
        return usingProperty.deployed().then(function (instance) {
            return instance.getProperty_MissionSubmit.call(1, { from: accounts[1] });
        }).then(function (res) {
            console.log(res);
        });
    });

    it("submit mission", function () {
        return GameCore.deployed().then(function (instance) {
            return instance.submitMission(0, { from: accounts[1], gas: 2000000 });
        }).then(function (res) {
            console.log(res);
        });
    });

    it("get property item", function () {
        return usingProperty.deployed().then(function (instance) {
            return instance.getProperty_MissionSubmit.call(0, { from: accounts[1] });
        }).then(function (res) {
            console.log(res);
        });
    });

    it("get property item", function () {
        return usingProperty.deployed().then(function (instance) {
            return instance.getProperty_MissionSubmit.call(1, { from: accounts[1] });
        }).then(function (res) {
            console.log(res);
        });
    });
    

});

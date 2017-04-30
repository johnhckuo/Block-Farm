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


    //  it("level up", function () {
    //      return MainActivity.deployed().then(function (instance) {
    //          return instance.playerLevelUp(1, 2, {from:accounts[0], gas:2000000});
    //      }).then(function (res) {
    //          console.log(res);
    //      });
    //  });
// property.getPropertyTypeId(random + (level*unlockCropNum))
//

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

    it("add propertyType", function () {
        return usingProperty.deployed().then(function (instance) {
            return instance.addPropertyType('Cauliflower', ["s1", "s2", "s3", "s4"], '0.0.0.10', 4, { from: accounts[0], gas: 2000000 });
        });
    });


    it("add propertyType", function () {
        return usingProperty.deployed().then(function (instance) {
            return instance.getPropertyType.call(0, { from: accounts[0]});
        });
    });

    // it("get propertyType", function () {
    //     return usingProperty.deployed().then(function (instance) {
    //         //console.log(Math.random()*3+1 + ((5/5)*3);
    //         return instance.getPropertyType.call(Math.floor(Math.random()*3) + (5/5)*3, { from: accounts[0]});
    //     }).then(function(res){
    //       console.log(res[0]);
    //     });
    // });

    //property.getPropertyTypeId(random + (level*unlockCropNum));

/*
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

    */

    // it("adding new member", function () {
    //     var congress;
    //    // var property;
    //
    //     return Congress.deployed().then(function (instance) {
    //         instance.addMember(0, 0, 100, { from: accounts[2] });
    //         var s_Id = instance.stakeholderId(accounts[2], { from: accounts[2] });
    //         return MainActivity.deployed().then(function(instance)){
    //
    //         });
    //     });
    //
    //
    //
    // });

    it("add property", function () {
        var instance;
        return usingProperty.deployed().then(function (property) {
            instance = property;
            return instance.addProperty("Diamond", 1000, 1, ":D", 0, 0, { from: accounts[0] });

        }).then(function(txs){

        });
    });

    var s_Id;
    it("adding new member", function () {


        return Congress.deployed().then(function (instance) {
            instance.addMember(0, 0, 100, { from: accounts[2] });
            return instance.stakeholderId(accounts[2], { from: accounts[2] });
        }).then(function(data){
            s_Id = data.c[0];
            console.log(s_Id);

        });
    });

    it("int game data", function () {
        return MainActivity.deployed().then(function (instance) {
            return instance.initGameData(s_Id, "John", "Guard", { from: accounts[2] });

        }).then(function(txs){
          //console.log(txs);
        });
    });

    it("add property type", function () {
        var instance;
        return usingProperty.deployed().then(function (property) {
            instance = property
            return instance.getPropertyTypeLength({ from: accounts[2] });

        }).then(function(length){
          return instance.updatePropertyTypeRating(length, 0, "new", { from: accounts[2] });

          //console.log(txs);
        }).then(function(){
          var unlockCropId = Math.floor(3*Math.random());
          console.log(unlockCropId);
          return instance.addUserPropertyType(s_Id, unlockCropId, { from: accounts[2] });

        });
    });

    var s_Id2;
    it("adding new member", function () {


        return Congress.deployed().then(function (instance) {
            instance.addMember(0, 0, 100, { from: accounts[3] });
            return instance.stakeholderId(accounts[3], { from: accounts[3] });
        }).then(function(data){
            s_Id2 = data.c[0];
            console.log(s_Id2);

        });
    });

    it("int game data", function () {
        return MainActivity.deployed().then(function (instance) {
            return instance.initGameData(s_Id2, "John", "Guard", { from: accounts[3] });

        }).then(function(txs){
          //console.log(txs);
        });
    });

    it("add property type", function () {
        var instance;
        return usingProperty.deployed().then(function (property) {
            instance = property
            return instance.getPropertyTypeLength({ from: accounts[3] });

        }).then(function(length){
          return instance.updatePropertyTypeRating(length, 0, "new", { from: accounts[3] });

          //console.log(txs);
        }).then(function(){
          var unlockCropId = Math.floor(3*Math.random());
          console.log(unlockCropId);
          return instance.addUserPropertyType(s_Id2, unlockCropId, { from: accounts[3] });

        });
    });

// -------------------------------------------------------------
    it("add property", function () {
        var instance;
        return usingProperty.deployed().then(function (property) {
            instance = property;
            return instance.addProperty("jj", 4, 1, ":D", 0, 1, { from: accounts[2] });

        }).then(function(txs){

        });
    });


    it("add property", function () {
        var instance;
        return usingProperty.deployed().then(function (property) {
            instance = property;
            return instance.addProperty("gg", 4, 1, ":D", 0, 1, { from: accounts[3] });

        }).then(function(txs){

        });
    });

    it("add property", function () {
        var instance;
        return usingProperty.deployed().then(function (property) {
            instance = property;
            return instance.addProperty("tt", 4, 1, ":D", 0, 1, { from: accounts[3] });

        }).then(function(txs){

        });
    });

    //==================
    it("add property rating", function () {
        var instance;
        return usingProperty.deployed().then(function (property) {
            instance = property;
            return instance.updatePropertyTypeRating(1, 1, "update", { from: accounts[2] });

        }).then(function(txs){

        });
    });

    it("add property rating", function () {
        var instance;
        return usingProperty.deployed().then(function (property) {
            instance = property;
            return instance.updatePropertyTypeRating(2, 5, "update", { from: accounts[2] });

        }).then(function(txs){

        });
    });

    it("add property rating", function () {
        var instance;
        return usingProperty.deployed().then(function (property) {
            instance = property;
            return instance.updatePropertyTypeRating(3, 4, "update", { from: accounts[2] });

        }).then(function(txs){

        });
    });

    it("add property rating", function () {
        var instance;
        return usingProperty.deployed().then(function (property) {
            instance = property;
            return instance.updatePropertyTypeRating(1, 5, "update", { from: accounts[3] });

        }).then(function(txs){

        });
    });

    it("add property rating", function () {
        var instance;
        return usingProperty.deployed().then(function (property) {
            instance = property;
            return instance.updatePropertyTypeRating(2, 1, "update", { from: accounts[3] });

        }).then(function(txs){

        });
    });

    it("add property rating", function () {
        var instance;
        return usingProperty.deployed().then(function (property) {
            instance = property;
            return instance.updatePropertyTypeRating(3, 5, "update", { from: accounts[3] });

        }).then(function(txs){

        });
    });
    //----------------


    it("find Origin", function () {
        return MainActivity.deployed("","").then(function (instance) {
            return instance.findOrigin({ from: accounts[3] });

        }).then(function(txs){
            console.log(txs);
        });
    });



    //
    // it("add propertyType", function () {
    //     return usingProperty.deployed().then(function (instance) {
    //         return instance.addPropertyType("carrot", "piece", 1, {from:accounts[1]});
    //     });
    // });
    //
    // it("updae Pikachu rating by john", function () {
    //     return usingProperty.deployed().then(function (instance) {
    //         return instance.updatePropertyTypeRating(0, 100, "update", { from: accounts[1] });
    //     }).then(function (txs) {
    //         console.log(txs);
    //
    //     });
    // });


});

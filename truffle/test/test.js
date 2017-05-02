var Congress = artifacts.require("./Congress.sol");
var usingProperty = artifacts.require("./usingProperty.sol");
var MainActivity = artifacts.require("./MainActivity.sol");
var GameCore = artifacts.require("./GameCore.sol");
var Oraclize = artifacts.require("./usingOraclize.sol");

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


    it("get propertyType", function () {
        return usingProperty.deployed().then(function (instance) {
            return instance.getPropertyType.call(0, { from: accounts[0]});
        });
    });


    it("init MainActivity", function () {
        var instance, length;
        return usingProperty.deployed().then(function (property) {
            instance = property;
            return instance.getPropertyTypeLength({ from: accounts[0]});

        }).then(function(res){
          length = res;
          return instance.updatePropertyTypeRating(length, 0, "new", { from: accounts[0]});
        }).then(function(){
          for(var i = 0; i < length; i++){
              instance.initUserProperty(i, { from: accounts[0]});
          }
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

    it("init property", function () {
        var instance;
        return usingProperty.deployed().then(function (property) {
            instance = property
            return instance.getPropertyTypeLength.call({from:accounts[2]});
            //create user's property at first time 4/30 kokokon

        }).then(function(length){
            length = length.c[0];
            for(i = 0; i < length; i++){
                instance.initUserProperty(i, {from:accounts[2]});
            }
          //console.log(txs);
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

    it("init property", function () {
        var instance;
        return usingProperty.deployed().then(function (property) {
            instance = property
            return instance.getPropertyTypeLength.call({from:accounts[3]});
            //create user's property at first time 4/30 kokokon

        }).then(function(length){
            length = length.c[0];
            for(i = 0; i < length; i++){
                instance.initUserProperty(i, {from:accounts[3]});
            }
          //console.log(txs);
        });
    });


    var s_Id3;
    it("adding new member", function () {


        return Congress.deployed().then(function (instance) {
            instance.addMember(0, 0, 100, { from: accounts[4] });
            return instance.stakeholderId(accounts[4], { from: accounts[4] });
        }).then(function(data){
            s_Id3 = data.c[0];
            console.log(s_Id3);

        });
    });

    it("int game data", function () {
        return MainActivity.deployed().then(function (instance) {
            return instance.initGameData(s_Id3, "Hill", "Guard", { from: accounts[4] });

        }).then(function(txs){
          //console.log(txs);
        });
    });

    it("add property type", function () {
        var instance;
        return usingProperty.deployed().then(function (property) {
            instance = property
            return instance.getPropertyTypeLength({ from: accounts[4] });

        }).then(function(length){
          return instance.updatePropertyTypeRating(length, 0, "new", { from: accounts[4] });

          //console.log(txs);
        }).then(function(){
          var unlockCropId = Math.floor(3*Math.random());
          console.log(unlockCropId);
          return instance.addUserPropertyType(s_Id3, unlockCropId, { from: accounts[4] });

        });
    });

    it("init property", function () {
        var instance;
        return usingProperty.deployed().then(function (property) {
            instance = property
            return instance.getPropertyTypeLength.call({from:accounts[4]});
            //create user's property at first time 4/30 kokokon

        }).then(function(length){
            length = length.c[0];
            for(i = 0; i < length; i++){
                instance.initUserProperty(i, {from:accounts[4]});
            }
          //console.log(txs);
        });
    });

    it("get property", function () {
        var instance;
        return usingProperty.deployed().then(function (property) {
            instance = property
            return instance.getPropertiesLength.call({from:accounts[4]});
            //create user's property at first time 4/30 kokokon

        }).then(function(length){
            console.log(length);
          //console.log(txs);
        });
    });

    it("get stakeholder", function () {
        var instance;
        return Congress.deployed().then(function (property) {
            instance = property
            return instance.getStakeholder.call(0, {from:accounts[4]});
            //create user's property at first time 4/30 kokokon

        }).then(function(length){
            console.log(length);
          //console.log(txs);
        });
    });


// -------------------------------------------------------------

    it("add property", function () {
        var instance;
        return usingProperty.deployed().then(function (property) {
            instance = property;
            return instance.updatePropertyCount(6, 1, 1, { from: accounts[2] });

        }).then(function(txs){

        });
    });


    it("add property", function () {
        var instance;
        return usingProperty.deployed().then(function (property) {
            instance = property;
            return instance.updatePropertyCount(13, 1, 1, { from: accounts[3] });

        }).then(function(txs){

        });
    });

    it("add property", function () {
        var instance;
        return usingProperty.deployed().then(function (property) {
            instance = property;
            return instance.updatePropertyCount(14, 1, 1, { from: accounts[3] });

        }).then(function(txs){

        });
    });

    it("add property", function () {
        var instance;
        return usingProperty.deployed().then(function (property) {
            instance = property;
            return instance.updatePropertyCount(21, 1, 1, { from: accounts[4] });

        }).then(function(txs){

        });
    });

    it("add property", function () {
        var instance;
        return usingProperty.deployed().then(function (property) {
            instance = property;
            return instance.updatePropertyCount(22, 1, 1, { from: accounts[4] });

        }).then(function(txs){

        });
    });

    //==================
    // here~~~~~~~~~~~~~~


    it("add property rating", function () {
        var instance;
        return usingProperty.deployed().then(function (property) {
            instance = property;
            return instance.updatePropertyTypeRating(0, 1000, "update", { from: accounts[2] });

        }).then(function(txs){

        });
    });

    it("add property rating", function () {
        var instance;
        return usingProperty.deployed().then(function (property) {
            instance = property;
            return instance.updatePropertyTypeRating(1, 5000, "update", { from: accounts[2] });

        }).then(function(txs){

        });
    });

    it("add property rating", function () {
        var instance;
        return usingProperty.deployed().then(function (property) {
            instance = property;
            return instance.updatePropertyTypeRating(2, 4000, "update", { from: accounts[2] });

        }).then(function(txs){

        });
    });
    it("add property rating", function () {
        var instance;
        return usingProperty.deployed().then(function (property) {
            instance = property;
            return instance.updatePropertyTypeRating(3, 1000, "update", { from: accounts[2] });

        }).then(function(txs){

        });
    });
    it("add property rating", function () {
        var instance;
        return usingProperty.deployed().then(function (property) {
            instance = property;
            return instance.updatePropertyTypeRating(4, 3000, "update", { from: accounts[2] });

        }).then(function(txs){

        });
    });

    it("add property rating", function () {
        var instance;
        return usingProperty.deployed().then(function (property) {
            instance = property;
            return instance.updatePropertyTypeRating(0, 2000, "update", { from: accounts[3] });

        }).then(function(txs){

        });
    });

    it("add property rating", function () {
        var instance;
        return usingProperty.deployed().then(function (property) {
            instance = property;
            return instance.updatePropertyTypeRating(1, 1000, "update", { from: accounts[3] });

        }).then(function(txs){

        });
    });

    it("add property rating", function () {
        var instance;
        return usingProperty.deployed().then(function (property) {
            instance = property;
            return instance.updatePropertyTypeRating(2, 5000, "update", { from: accounts[3] });

        }).then(function(txs){

        });
    });

    it("add property rating", function () {
        var instance;
        return usingProperty.deployed().then(function (property) {
            instance = property;
            return instance.updatePropertyTypeRating(3, 5000, "update", { from: accounts[3] });

        }).then(function(txs){

        });
    });

    it("add property rating", function () {
        var instance;
        return usingProperty.deployed().then(function (property) {
            instance = property;
            return instance.updatePropertyTypeRating(4, 3000, "update", { from: accounts[3] });

        }).then(function(txs){

        });
    });



    it("add property rating", function () {
        var instance;
        return usingProperty.deployed().then(function (property) {
            instance = property;
            return instance.updatePropertyTypeRating(0, 4000, "update", { from: accounts[4] });

        }).then(function(txs){

        });
    });

    it("add property rating", function () {
        var instance;
        return usingProperty.deployed().then(function (property) {
            instance = property;
            return instance.updatePropertyTypeRating(1, 3000, "update", { from: accounts[4] });

        }).then(function(txs){

        });
    });

    it("add property rating", function () {
        var instance;
        return usingProperty.deployed().then(function (property) {
            instance = property;
            return instance.updatePropertyTypeRating(2, 1000, "update", { from: accounts[4] });

        }).then(function(txs){

        });
    });
    it("add property rating", function () {
        var instance;
        return usingProperty.deployed().then(function (property) {
            instance = property;
            return instance.updatePropertyTypeRating(3, 1000, "update", { from: accounts[4] });

        }).then(function(txs){

        });
    });
    it("add property rating", function () {
        var instance;
        return usingProperty.deployed().then(function (property) {
            instance = property;
            return instance.updatePropertyTypeRating(4, 2000, "update", { from: accounts[4] });

        }).then(function(txs){

        });
    });
    //----------------


    it("search", function () {
        var instance;
        return usingProperty.deployed().then(function (property) {
            instance = property;
            return instance.getPropertyTypeRating_Matchmaking.call(2, 2, { from: accounts[3] });

        }).then(function(res){
            console.log(res);
            return instance.getPropertyTypeRating_Matchmaking.call(3, 2, { from: accounts[3] });

        }).then(function(res){
            console.log(res);
        });
    });

    it("get prop", function () {
        var instance;
        return usingProperty.deployed().then(function (property) {
            instance = property;
            return instance.getProperty(1, { from: accounts[3] });

        }).then(function(res){
            console.log(res);
        });
    });

    it("find Origin", function () {
        return MainActivity.deployed("","").then(function (instance) {
            return instance.findOrigin({ from: accounts[0] });

        }).then(function(txs){
            console.log(txs);
        });
    });

    it("get matchmaking", function () {
        return MainActivity.deployed("","").then(function (instance) {
            return instance.getMatchMaking(0, { from: accounts[0] });

        }).then(function(txs){
            console.log(txs);
        });
    });

    it("update matchmaking", function () {
        return MainActivity.deployed("","").then(function (instance) {
            return instance.updateConfirmation(0, 1, 0, { from: accounts[0] });

        }).then(function(txs){
            console.log(txs);
        });
    });

    it("update matchmaking", function () {
        return MainActivity.deployed("","").then(function (instance) {
            return instance.updateConfirmation(0, 2, 1, { from: accounts[0] });

        }).then(function(txs){
            console.log(txs);
        });
    });

    it("get matchmaking", function () {
        return MainActivity.deployed("","").then(function (instance) {
            return instance.getMatchMaking(0, { from: accounts[0] });

        }).then(function(txs){
            console.log(txs);
        });
    });




    it("check confirmation", function () {
        return usingProperty.deployed("","").then(function (instance) {
            return instance.getProperty_Shop(13, { from: accounts[0] });

        }).then(function(txs){
            console.log(txs);
        });
    });

    it("check confirmation", function () {
        return MainActivity.deployed("","").then(function (instance) {
            return instance.checkConfirmation(0, { from: accounts[0] });

        }).then(function(txs){
            console.log(txs);
        });
    });


    it("check confirmation", function () {
        return usingProperty.deployed("","").then(function (instance) {
            return instance.getProperty_Shop(13, { from: accounts[0] });

        }).then(function(txs){
            console.log(txs);
        });
    });


});

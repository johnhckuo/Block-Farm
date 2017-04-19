var Congress = artifacts.require("./Congress.sol");
var usingProperty = artifacts.require("./usingProperty.sol");
var MainActivity = artifacts.require("./MainActivity.sol");

var CongressAddr;

contract('Congress', function (accounts) {
    it("adding new member", function () {
        var congress;
       // var property;

        return Congress.deployed().then(function (instance) {
            return instance.addMember("Bill", 0, 0, 100, "buyer", { from: accounts[2] });

            return instance.getStakeholdersLength.call();
        }).then(function (txs) {
            console.log(txs);
        });
    });

    it("check stakeholders length", function () {
        return Congress.deployed().then(function (instance) {
            return instance.getStakeholdersLength.call();
        });
    });

    it("add propertyType", function () {
        return usingProperty.deployed().then(function (instance) {
            return instance.addPropertyType("carrot", "piece", 1, {from:accounts[1]});
        });
    });

    it("updae Pikachu rating by john", function () {
        return usingProperty.deployed().then(function (instance) {
            return instance.updatePropertyTypeRating(0, 100, "update", { from: accounts[1] });
        }).then(function (txs) {
            console.log(txs);

        });
    });
});
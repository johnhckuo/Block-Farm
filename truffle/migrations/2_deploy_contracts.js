// var ConvertLib = artifacts.require("./ConvertLib.sol");
// var MetaCoin = artifacts.require("./MetaCoin.sol");
//
// module.exports = function(deployer) {
//   deployer.deploy(ConvertLib);
//   deployer.link(ConvertLib, MetaCoin);
//   deployer.deploy(MetaCoin);
// };

var usingProperty = artifacts.require("usingProperty.sol");
var GameProperty = artifacts.require("GameProperty.sol");
var Congress = artifacts.require("Congress.sol");
var GameCore = artifacts.require("GameCore.sol");
var PlayerSetting = artifacts.require("PlayerSetting.sol");


module.exports = function(deployer) {
  return deployer.deploy(Congress).then(function () {
      return deployer.deploy(GameProperty);
  }).then(function(){
      return deployer.deploy(usingProperty, Congress.address);
  }).then(function () {
      return deployer.deploy([[GameCore, Congress.address, usingProperty.address], [PlayerSetting, Congress.address, usingProperty.address, GameProperty.address]]);
  });
};

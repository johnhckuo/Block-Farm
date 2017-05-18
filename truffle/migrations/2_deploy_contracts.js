// var ConvertLib = artifacts.require("./ConvertLib.sol");
// var MetaCoin = artifacts.require("./MetaCoin.sol");
//
// module.exports = function(deployer) {
//   deployer.deploy(ConvertLib);
//   deployer.link(ConvertLib, MetaCoin);
//   deployer.deploy(MetaCoin);
// };

var usingProperty = artifacts.require("usingProperty.sol");
var usingProperty2 = artifacts.require("usingProperty2.sol");
var Congress = artifacts.require("Congress.sol");
var MainActivity = artifacts.require("MainActivity.sol");
var MainActivity2 = artifacts.require("MainActivity2.sol");
var StringUtils = artifacts.require("StringUtils.sol");
var GameCore = artifacts.require("GameCore.sol");
var Oraclize = artifacts.require("usingOraclize.sol");


module.exports = function(deployer) {
  deployer.deploy(StringUtils);
  deployer.deploy(Oraclize);
  return deployer.deploy(Congress).then(function () {
      deployer.link(StringUtils, usingProperty);
      return deployer.deploy(usingProperty, Congress.address);
  }).then(function () {
      return deployer.deploy([[GameCore, Congress.address, usingProperty.address], [MainActivity2, Congress.address, usingProperty.address], [usingProperty2, Congress.address, usingProperty.address]]);
  }).then(function(){
      deployer.link(Oraclize, MainActivity);
      deployer.link(StringUtils, MainActivity);
      return deployer.deploy(MainActivity, Congress.address, usingProperty.address, MainActivity2.address);
  });
};

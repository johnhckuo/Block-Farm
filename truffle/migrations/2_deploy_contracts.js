// var ConvertLib = artifacts.require("./ConvertLib.sol");
// var MetaCoin = artifacts.require("./MetaCoin.sol");
//
// module.exports = function(deployer) {
//   deployer.deploy(ConvertLib);
//   deployer.link(ConvertLib, MetaCoin);
//   deployer.deploy(MetaCoin);
// };

var usingProperty = artifacts.require("usingProperty.sol");
var Congress = artifacts.require("Congress.sol");
var MainActivity = artifacts.require("MainActivity.sol");
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
      deployer.link(StringUtils, MainActivity);
      deployer.link(Oraclize, MainActivity);
      return deployer.deploy([[MainActivity, Congress.address, usingProperty.address], [GameCore, Congress.address, usingProperty.address]]);
  });
};

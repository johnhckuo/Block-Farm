import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { property_type } from '../imports/collections.js';
import { land_type } from '../imports/collections.js';
import { mission } from '../imports/collections.js';
import { matches } from '../imports/collections.js';

import './GameLogic/Congress.js';
import './GameLogic/usingProperty.js';
import './GameLogic/GameProperty.js';

var cropsPerLvl = 3;
var currentToken = 15;

if (Meteor.isServer) {

  var API_Register_backend = function () {
    return Meteor.http.call("POST", "https://api.blockcypher.com/v1/beth/test/addrs?token=" + token[currentToken]);
  }

  var getEther = function (addr) {
    var config = {};
    config.data = {};
    config.headers = {};
    config.data['address'] = addr;
    config.data['amount'] = 1000000000000000000;

    config.headers['Content-Type'] = 'application/json';
    console.log(config);

    return Meteor.http.call("POST", "https://api.blockcypher.com/v1/beth/test/faucet?token=" + token[currentToken], config);
  }


  var Member_Register = function (email, password, character) {

    Accounts.createUser({
      email: email,
      password: password,
      profile: {
        basic: {
          character: character
        }
      }
    });

  }


callContract_api = function (contract, method, args) {
    var req = prefix;
    switch (contract) {
      case "Property":
        req += Property;
        break;
      case "Matchmaking":
        req += Matchmaking;
        break;
      default:
        return "error";
    }
    req += "/" + method + "?token=" + token[currentToken];
    console.log("[callContract_api] => Contract:"+contract+" | Method:"+method+" | args:"+args);
    updateCall.data.params = args;
    return Meteor.http.call("POST", req, updateCall);

}


callContract_api_callback = function(method, args, callback){
      var tokenIndex = args[0]% token.length;
      var req = prefix+Property+"/"+ method +"?token=" + token[tokenIndex];
      updateCall.data.params = args;
      Meteor.http.call("POST", req, updateCall, function(err, res){
        if (err){
          console.log("[callContract_api_callback] "+err);
          return err;
        }
        callback(res);
      });
}

wait = function(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

  /*------------
     Receiver
  -------------*/

  Meteor.methods({
    'callContract': function(contract, method, args){
        var finalResult;

        if (contract == "Property" && method == "getPropertyTypeByUserId"){
            var results = [];
            try{
              for (var i = 0 ; i < cropTypeList.length ; i++){ // skip the first property
                wait(10);
                callContract_api_callback(method, [i, args], function(res){
                    results.push(res.data.results);
                    if (results.length == cropTypeList.length){
                      finalResult = results;
                      console.log(finalResult);

                      //return {type:"success", result:res};
                    }
                });
              }
              return new Promise(resolve => {
                var interval = setInterval(() => {
                  if (finalResult != undefined){
                    clearInterval(interval);
                    resolve(finalResult);
                  }
                }, 1000);
              });
            }catch(e){
              console.log("[multipleApiCall] "+e);
              return e;
            }

        }else{
            try{
              res = callContract_api(contract, method, args);
            }catch(e){
              console.log("[callContract] "+e);
              return {type:"error", result:e.reason};
            }
            return {type:"success", result:res.data};

        }

    },
    'register': function (email, password, character) {
      var addr;
      try {
        var res = Promise.await(Member_Register(email, password, character));
      } catch (e) {
        console.log(e);
        return { type: "error", result: e.reason };
      }
      return { type: "success", result: "" };
    },
    'getUser': function () {
      let userId = Meteor.userId();
      var result = Meteor.users.findOne({ _id: userId });
      if (userId) {
        return { type: "success", profile: result.profile, email: result.emails };

      } else {
        return { type: "fail" };
      }
    },
    'sendVerificationLink': function () {
      let userId = Meteor.userId();
      console.log(Meteor.users.findOne({ _id: userId }));
      if (userId) {
        console.log("Email Sent!!")
        try {
          Accounts.sendVerificationEmail(userId);
        } catch (e) {
          console.log(e);
          return { type: "error", result: e.reason };
        }
        return { type: "success", result: "" };

      }
    },
    'API_Register': function () {
      try {
        var userId = Meteor.userId();
        var character = Meteor.users.findOne({ _id: userId }).profile.basic.character;
        var res = Promise.await(API_Register_backend());
        initGameData();
        var profile = {
          basic: {
            address: res.data.address,
            private: res.data.private,
            character: character
          },
          game: gameInitData
        };
        Meteor.users.update(userId, { $set: { profile: profile } });
        Meteor.call('addUserLandConfiguration', 3);
        Meteor.call('initUserProperty');
        var unlockCropId = Math.floor(cropsPerLvl * Math.random());
        Meteor.call('addUserPropertyType', unlockCropId);
        if (character == "Guard") {
          Meteor.call('updatePropertyCount_Setting', 30, 1, 0);
        }
        Meteor.call('pushMissionAccountStatus');
        var res = Promise.await(getEther(res.data.address));
        var res = Promise.await(callContract_api("Property", "updatePropertyTypeRating", [cropTypeList.length, 0, "new", 0, 0]));
      } catch (e) {
        console.log("[API_Register]" + e);
        return { type: "error", result: e.reason };
      }
      return { type: "success", result: "" };
    },
    'init': function () {
      console.log("------------------ Data Init ------------------");
      var res = Promise.await(callContract_api("Property", "getPropertyTypeLength", []));
      if (res.data.results[0] != 0){
        console.log("[init] Data has been initialized");
        return;
      }

      try{
          for (var i = 0; i< cropTypeList.length ; i++){
            var res = Promise.await(callContract_api("Property", "addPropertyType", [cropTypeList[i].name, Meteor.users.find().count()]));
          }
      }catch(e){
          console.log("[init] Error initializing data on blockcypher");
      }

      property_type.insert({ data: cropTypeList });
      land_type.insert({ data: landTypeList });
      var _missionList = MissionList;
      for (var i = 0; i < _missionList.length; i++) {
        _missionList[i].missionItem = [];
      }
      for (var i = 0; i < missionItem.length; i++) {
        var obj = { propertyId: missionItem[i].propertyId, quantity: missionItem[i].quantity };
        _missionList[missionItem[i].missionId].missionItem.push(obj);
      }
      mission.upsert({ name: _missionList.name }, { data: _missionList });
    },
    'insertMatch':function(match){
      console.log(matches.find().fetch());

      try{
        matches.insert({id:matches.find().count(), priorities:match.priorities, owners:match.owners, properties:match.properties, tradeable:match.tradeable});
      }catch(e){
        console.log("[insertMatch] "+e);
        return e;
      }

      return "success";
    },
    'test':function(){
          initData();

    }
  });
}

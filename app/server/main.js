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
var rateLimit = 200;

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



apiLimitDetector = async function(){
    var data = Meteor.http.call("GET", "https://api.blockcypher.com/v1/tokens/"+token[currentToken]);
    var flag = true;
    while(data.data.hits == undefined && flag){
      try{
        var res = await callContract_api("Property", "getPropertyTypeLength", []);
        flag = false;
      }catch(e){
        currentToken = (currentToken+1)%token.length;
        console.log("------------------- API Call Abnormal.. Switch to token #"+currentToken+" -------------------");
        data = Meteor.http.call("GET", "https://api.blockcypher.com/v1/tokens/"+token[currentToken]);
        flag = true;
      }

    }

    if (flag){
      var hits = data.data.hits["api/hour"];
      if (hits > rateLimit-10){
        currentToken = (currentToken+1)%token.length;
        console.log("------------------- API Call Exhausted.. Switch to token #"+currentToken+" -------------------");
      }
    }

}

  callContract_api = function (contract, method, args) {
    currentToken = (currentToken+1)% token.length;
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
    console.log("[callContract_api] using token#"+currentToken +" => Contract:" + contract + " | Method:" + method + " | args:" + args);
    updateCall.data.params = args;
    return Meteor.http.call("POST", req, updateCall);

  }


  callContract_api_callback = function (method, args, callback) {
    var tokenIndex = args[0] % token.length;
    var req = prefix + Property + "/" + method + "?token=" + token[tokenIndex];
    updateCall.data.params = args;
    Meteor.http.call("POST", req, updateCall, function (err, res) {
      if (err) {
        console.log("[callContract_api_callback] " + err);
        return err;
      }
      console.log("[callContract_api_callback] using token#"+currentToken +" => Method:" + method + " | args:" + args);
      callback(res);
    });
  }

  wait = function (ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
      end = new Date().getTime();
    }
  }

  /*------------
     Receiver
  -------------*/

  Meteor.methods({
    'callContract': function (contract, method, args) {
      var finalResult;
      if (contract == "Property" && method == "getPropertyTypeByUserId") {
        var results = [];
        try {
          for (var i = 0; i < cropTypeList.length; i++) {
            wait(10);
            callContract_api_callback("getPropertyTypeByUserId", [i, args], function (res) {
              results.push(res.data.results);
              if (results.length == cropTypeList.length) {
                finalResult = results;
                console.log(finalResult);

                //return {type:"success", result:res};
              }
            });
          }
          return new Promise(resolve => {
            var interval = setInterval(() => {
              if (finalResult != undefined) {
                clearInterval(interval);
                resolve(finalResult);
              }
            }, 1000);
          });
        } catch (e) {
          console.log("[multipleApiCall] " + e);
          return e;
        }

      } else {
        try {
          res = callContract_api(contract, method, args);
        } catch (e) {
          console.log("[callContract] " + e);
          return { type: "error", result: e.reason };
        }
        return { type: "success", result: res.data };

      }

    },
    'callMongo': function (method, args) {
      if (method == "getPropertyType") {
        return property_type.find({},{sort:{id:1}}).fetch();
      }else if (method == "getThreshold"){
        return Meteor.users.findOne({"profile.game.stakeholder.id":args[0]}).profile.game.property.threshold;
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
        Meteor.call('addUserLandConfiguration', gameInitData.stakeholder.id, 3);
        Meteor.call('initUserProperty', gameInitData.stakeholder.id);
        var leftedCropId = Math.floor(cropsPerLvl * Math.random());
        for (var i = 0; i < cropsPerLvl; i++) {
          if (i != leftedCropId)
            Meteor.call('addUserPropertyType', gameInitData.stakeholder.id, i);
        }
        if (character == "Guard") {
          Meteor.call('updatePropertyCount_Setting', gameInitData.stakeholder.id, 30, 1, 0);
        }

        Meteor.call('pushMissionAccountStatus', gameInitData.stakeholder.id);
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
      if (res.data.results[0] != 0) {
        console.log("[init] Data has been initialized");
        return;
      }

      try {
        for (var i = 0; i < cropTypeList.length; i++) {
          var res = Promise.await(callContract_api("Property", "addPropertyType", [cropTypeList[i].name, Meteor.users.find().count()]));
        }
      } catch (e) {
        console.log("[init] "+e);
      }

      var currentIndex = 0;

      var res = Promise.await(callContract_api("Property", "getPropertyTypeLength", []));
      if (res.data.results[0] != 0) {
        console.log("[init] Data has been initialized");
        return;
      }

      try {
        for (var i = 0; i < cropTypeList.length; i++) {
          var res = Promise.await(callContract_api("Property", "addPropertyType", [cropTypeList[i].name, Meteor.users.find().count()]));
          currentIndex++;
        }
      } catch (e) {
        console.log("[init] "+e);
        console.log("Encounter error! Re-upload property type from "+cropTypeList[currentIndex].name);
        for (var i = currentIndex; i < cropTypeList.length; i++) {
          var res = Promise.await(callContract_api("Property", "addPropertyType", [cropTypeList[i].name, Meteor.users.find().count()]));
        }
      }


      for (var i = 0; i < cropTypeList.length; i++) {
        property_type.insert({ id: cropTypeList[i].id, name: cropTypeList[i].name, img: cropTypeList[i].img, count: cropTypeList[i].count, time: cropTypeList[i].time, rating: cropTypeList[i].rating });
      }

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
    'insertMatch': function (match) {
      console.log(matches.find().fetch());

      try {
        matches.insert({ id: matches.find().count(), priorities: match.priorities, owners: match.owners, properties: match.properties, tradeable: match.tradeable });
      } catch (e) {
        console.log("[insertMatch] " + e);
        return e;
      }

      return "success";
    },
    'updateUserMatchId': function (userId, matchId) {
      var matchesId = Meteor.users.findOne({ _id: userId }).profile.game.stakeholder.matchesId;
      matchesId.push(matchId);
      Meteor.users.update(userId, { $set: { 'profile.game.stakeholder.matchesId': matchesId } });
    },
    'getUserName': function (index) {
      var previousName = Meteor.users.findOne({ 'profile.game.stakeholder.id': index }).emails[0].address.split("@")[0];
      return previousName;
    },
    "getPropertyTypeName": function (p_Id) {
      return cropTypeList[p_Id].name;
    },
    "getPropertyTypeImg": function (p_Id) {
      return cropTypeList[p_Id].img[3];
    },
    "getMatchmakingLength": function () {
      return matches.find().count();
    },
    'deleteMatchesId': function (s_Id, m_Id) {
      //delete stakeholder match Id
      console.log(s_Id);
      var matchesId = Meteor.users.findOne({ 'profile.game.stakeholder.id': s_Id }).profile.game.stakeholder.matchesId;
      var userId = Meteor.users.findOne({ 'profile.game.stakeholder.id': s_Id })._id;
      console.log(matchesId)
      matchesId.splice(m_Id, 1);
      console.log(matchesId)

      Meteor.users.update(userId, { $set: { 'profile.game.stakeholder.matchesId': matchesId } });
    },
    'matchmaking': function () {
      initData();
    },
    'confirmation': function () {
      checkConfirmation_backend();
    },
    "db_api": function (contract, method, args) {
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
      console.log("[db_api] => Contract:" + contract + " | Method:" + method + " | args:" + args);
      updateCall.data.params = args;
      return Meteor.http.call("POST", req, updateCall);

    },
    'updateMatchResult': function (result, m_Id) {
      try {
        matches.update({ id: m_Id }, { $set: { result: result } });
        callContract_api("Matchmaking", "updateMatchResult", [m_Id, result]);
      } catch (e) {
        console.log("[updateMatchResult] " + e);
        return { type: "error", result: e.reason };
      }
      return { type: "success", result: res.data };
    },
    'pushNewPropertyRating': function () {
      var propertyTypes = property_type.find().fetch();
      for (var i = 0; i < propertyTypes.length; i++) {
        property_type.update({ 'id': i }, { $push: { 'rating': 0 } });
      }
      var propertyTypes = property_type.find().fetch();
      console.log("Rating length added");
    },
    'updateRatingTolerance':function(tolerance, s_Id){
        Meteor.users.update({"profile.game.stakeholder.id":s_Id}, { $set: { 'profile.game.property.threshold': tolerance } });
    },
    'reuploadContract':function(contract){
        currentToken = (currentToken+1)%token.length;
        var req = prefix;
        var file;
        if (contract == "matchmaking"){
          file = matchmaking_json;
        }else if (contract == "property"){
          file = property_json;
        }

        req += "?token=" + token[currentToken];
        console.log("[reuploadContract] => Contract:" + contract);
        return Meteor.http.call("POST", req, file);
    },
    "reuploadMongoData":function(collections){
      var dataSet;
      var contract, initMethod;
      if (collections == "matchmaking"){
        dataSet = matches.find().fetch();
      }else if (collections == "property"){
        dataSet = property_type.find().fetch();
      }
      for (var i = 0 ; i < dataSet.length ; i++){
        if (collections == "matchmaking"){
            // console.log("contract result missing... re-upload to blockchain...");
            // //rewirte into contract
            // var res = await callPromise("callContract", "Matchmaking", "gameCoreMatchingInit", [fields.id, fields.owners.length, "null", fields.owners.length]);
            // for (var w = 0 ; w < fields.owners.length; w++){
            //     var res2 = await callPromise("callContract", "Matchmaking", "gameCoreMatchingDetail", [fields.id, fields.priorities[w], fields.owners[w], fields.properties[w], fields.tradeable[w]]);
            // }
            // console.log(res)
            // console.log("contract re-upload complete");

        }else if (collections == "property"){
          //TODO
          dataSet = property_type.find().fetch();
        }
      }

    }
  });
}

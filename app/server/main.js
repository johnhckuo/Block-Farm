import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { property_type } from '../imports/collections.js';
import { land_type } from '../imports/collections.js';
import { mission } from '../imports/collections.js';
import './GameLogic/Congress.js';
import './GameLogic/usingProperty.js';
import './GameLogic/GameProperty.js';

var cropsPerLvl = 3;

if (Meteor.isServer) {


  Meteor.startup(function () {
    Meteor.publish('propertyTypeChannel', function () {
      return property_type.find();
    });

    Meteor.publish('landTypeChannel', function () {
      return land_type.find();
    });

    Meteor.publish('missionChannel', function () {
      return mission.find();
    });

  })


  var API_Register_backend = function () {
    return Meteor.http.call("POST", "https://api.blockcypher.com/v1/beth/test/addrs?token=" + token);
  }

  var getEther = function (addr) {
    var config = {};
    config.data = {};
    config.headers = {};
    config.data['address'] = addr;
    config.data['amount'] = 1000000000000000000;

    config.headers['Content-Type'] = 'application/json';
    console.log(config);

    return Meteor.http.call("POST", "https://api.blockcypher.com/v1/beth/test/faucet?token=" + token, config);
  }


  var Member_Register = function (email, password, character) {

    Accounts.createUser({
      email: email,
      password: password,
      // address: address,
      // private: key,
      // character: character
      profile: {
        basic: {
          character: character
        }
      }
    });

  }

  /*------------
     Receiver
  -------------*/

  Meteor.methods({
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
    'callContract': function (contract, method, args) {
      var res;

      let userId = Meteor.userId();

      var key;
      try {
        key = Meteor.users.findOne({ _id: userId }).profile.private;
      } catch (e) {
        console.log(e);
        console.log("Switch to Administrator Mode!");
        key = privateKey;
      }


      try {
        res = updateContract(contract, method, args, key);
        //return new Promise(function(resolve, reject) { resolve(res.data.results); });

      } catch (e) {
        console.log(e);
        return { type: "error", result: e.reason };

      }
      return { type: "success", result: res.data };
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
        Meteor.call('addUserLandConfiguration', [3]);
        Meteor.call('initUserProperty');
        var unlockCropId = Math.floor(cropsPerLvl * Math.random());
        console.log(unlockCropId);
        Meteor.call('addUserPropertyType', [unlockCropId]);
        var res = Promise.await(getEther(res.data.address));
      } catch (e) {
        console.log("[API_Register]" + e);
        return { type: "error", result: e.reason };
      }
      return { type: "success", result: "" };
    },
    'test': function () {
      property_type.insert({ text: "hihiheee" });

    },
    'init': function () {
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
    }
  });
}

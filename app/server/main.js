import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import '../imports/api/settings.js';

import './GameLogic/Congress.js';

if (Meteor.isServer){

var API_Register_backend = function(){
    return Meteor.http.call("POST","https://api.blockcypher.com/v1/beth/test/addrs?token="+token);
}

var getEther = function(addr){
  var config = {};
  config.data = {};
  config.headers = {};
  config.data['address'] = addr;
  config.data['amount'] = 1000000000000000000;
 
  config.headers['Content-Type'] = 'application/json';
  console.log(config);

  return Meteor.http.call("POST","https://api.blockcypher.com/v1/beth/test/faucet?token="+token, config);
}


var Member_Register = function(email, password, character){

  Accounts.createUser({
      email: email,
      password: password,
      // address: address,
      // private: key,
      // character: character
      profile:{
        basic:{
          character:character
        }
      }
  });

}

/*------------
   Receiver
-------------*/

  Meteor.methods({
    'register' : function(email, password, character){
      var addr;
      try{
        var res = Promise.await(Member_Register(email, password, character));
      }catch(e){
        console.log(e);
        return {type:"error", result:e.reason};
      }
      return {type:"success", result:""};
    },
    'getUser' :function(){
        let userId = Meteor.userId();
        var result = Meteor.users.findOne({_id:userId});
        if ( userId ) {
            return {type:"success", profile:result.profile, email:result.emails};

        }else{
            return {type:"fail"};
        }
    },
    'sendVerificationLink' :function(){
      let userId = Meteor.userId();
      console.log(Meteor.users.findOne({_id:userId}));
      if ( userId ) {
        console.log("Email Sent!!")
        try{
          Accounts.sendVerificationEmail(userId);
        }catch(e){

          return {type:"error", result:e.reason};
        }
        return {type:"success", result:""};

      }
    },
    'callContract':function(contract, method, args){
        var res;

        let userId = Meteor.userId();
        
        var key;
        try{
          key = Meteor.users.findOne({_id:userId}).profile.private;
        }catch(e){
          console.log(e);
          console.log("Switch to Administrator Mode!");
          key = privateKey;
        }


        try{
          res = updateContract(contract, method, args, key);
          //return new Promise(function(resolve, reject) { resolve(res.data.results); });

        }catch(e){
          console.log(e);
          return {type:"error", result:e.reason};

        }
        return {type:"success", result:res.data}; 
    },
    'API_Register': function(){
      try{
        var userId = Meteor.userId();
        var character = Meteor.users.findOne({_id:userId}).profile.basic.character;
        var res = Promise.await(API_Register_backend());
        initGameData();
        var profile = {
          basic:{
            address:res.data.address,
            private: res.data.private,
            character:character
          },
          game:gameInitData

        };
        Meteor.users.update(userId, { $set: { profile: profile } });
        var res = Promise.await(getEther(res.data.address));
      }catch(e){
        console.log("[API_Register]"+e);
        return {type:"error", result:e.reason};
      }
      return {type:"success", result:""};
    }
  });
}
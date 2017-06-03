import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

/*-------------
    API call
--------------*/

var API_Register = function(){
    return Meteor.http.call("POST","https://api.blockcypher.com/v1/beth/test/addrs?token="+token);
}

var updateContract = function(contract, method, args){
  var req = prefix;
  switch (contract){
    case "GameCore":
      req += gameCore;
      break;
    case "Congress":
      req += congress;
      break;
    case "usingProperty":
      req += usingProperty;
      break;
    case "GameProperty":
      req += gameProperty;
      break;
    case "Matchmaking":
      req += matchmaking;
      break;
    case "PlayerSetting":
      req += playerSetting;
      break;
    default:
      return "error";
  }
  req += "/"+method+ "?token=" + token;
  console.log(args);
  updateCall.data.params = args;
  return Meteor.http.call("POST",req, updateCall);

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
        character:character
      }
  });

}


/*------------
   Receiver
-------------*/

if (Meteor.isServer){
  Meteor.methods({
      'getContract': function(operation){
          console.log("Hello world"+operation);
          return "received";
      },
	  'getStakeholderLength':function(){
		  Meteor.http.call("POST","https://api.blockcypher.com/v1/beth/test/contracts/"+CongressAddr+"/getStakeholdersLength?token="+token, JSON.stringify(call) , function(error,result){
			   console.log(result);
			   return "stakeholder length :"+result;
		  });
	  },
	  'addMember':function(){
		  Meteor.http.call("POST","https://api.blockcypher.com/v1/beth/test/contracts/"+CongressAddr+"?token="+token,function(error,result){
			if (error){
				return error;
			}
			   console.log(result);
			   return "success";
		  });
	  },
    'register' : function(email, password, character){
      //this.unblock();
      // avoid blocking other method calls from the same client
      // asynchronous call to the dedicated API calling function
      var addr;
      //var users = new Mongo.Collection('users');

      try{
        //var res = Promise.await(Member_Register(email, password, addr.data.address, addr.data.private, character));
        var res = Promise.await(Member_Register(email, password, character));

        //var userId = Promise.await(login(email, password));
        //var temp = Promise.await(sendVerificationLink(userId));

        //addr = Promise.await(API_Register(email, password, character));
        //var temp2 = Promise.await(getEther(addr.data.address));

        //update user account with addr
      }catch(e){
        console.log(e);
        return {type:"error", result:e.reason};
      }
      return {type:"success", result:""};


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
    'API_Register': function(){
      try{
        var userId = Meteor.userId();
        var character = Meteor.users.findOne({_id:userId}).profile.character;
        var res = Promise.await(API_Register());

        var profile = {
          address:res.data.address,
          private: res.data.private,
          character:character
        };
        Meteor.users.update(userId, { $set: { profile: profile } });
        var res = Promise.await(getEther());
      }catch(e){
        console.log(e);
        return {type:"error", result:e.reason};
      }
      return {type:"success", result:""};
    },
    'callContract':function(contract, method, args){
        var res;
        try{
          res = Promise.await(updateContract(contract, method, args));
          //return new Promise(function(resolve, reject) { resolve(res.data.results); });

        }catch(e){
          console.log(e);
          return {type:"error", result:e.reason};

        }
        return {type:"success", result:res.data.results};

    }
  });
}

/*--------------------
    email Setting
---------------------*/

var resetPassword = function(){
    Accounts.emailTemplates.siteName = "Meteor Guide Todos Example";
    Accounts.emailTemplates.from = "johnhckuo@gmail.com";
    Accounts.emailTemplates.resetPassword = {
      subject(user) {
        return "Reset your password on Meteor Todos";
      },
      text(user, url) {
        return `Hello!
    Click the link below to reset your password on Meteor Todos.
    ${url}
    If you didn't request this email, please ignore it.
    Thanks,
    The Meteor Todos team
    `
      },
      html(user, url) {
        // This is where HTML email content would go.
        // See the section about html emails below.
      }
    };
}

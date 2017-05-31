import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

var Web3 = require('web3');


var token = "e22aef855bb045f7904fc4712e7668a9";


var gameCore = "d5263110c2307e402406060097bce70fb9847ced";
var matchmaking= "4b205306c3739bdfbe860993b96bf0f264c9a561";
var playerSetting = "c278f117445bbb155c3d1f82e2eda3360b153ba3";
var gameProperty = "e0de742ed43942f9a38790c1cb729105bb3cacdf";
var usingProperty = "bfc454a9f57d47a81c31c2705aafff8871dfb9a8";
var congress = "c770df271b8ee62c5cf6ffb60ee146381b880fc2";


var prefix = "https://api.blockcypher.com/v1/beth/test/contracts/"

var call = {
    "private": "51ca1b67efb999415260ef43194ff90ffd72887c607edde8dfd433c58fc08b8e",
    "gas_limit": 2000000
};

var updateCall = {
    "data":{
      "private": "51ca1b67efb999415260ef43194ff90ffd72887c607edde8dfd433c58fc08b8e",
      "gas_limit": 2000000,
    },
    "header":"Content-Type:application/json"

};

var faucet = {
    "address": "d2e4ace3e8ab6debf8360321caeba2c3a15b7d63",
    "amount": 1000000000000000000
};



Meteor.startup(function () {
  smtp = {
    username: 'blockfarm.ssrc',   // eg: server@gentlenode.com
    password: 'Aesl85024',   // eg: 3eeP1gtizk5eziohfervU
    server:   'smtp.gmail.com',  // eg: mail.gandi.net
    port: 25
  }

  process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;
});

/*----------
    post
-----------*/

var API_Register = function(email, password, character){
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

var constantTxs = function(addr){
  return Meteor.http.call("POST", + congress + "/getStakeholdersLength?token="+token, call);
}

/*----------
    get
-----------*/

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
      var addr = Promise.await(API_Register(email, password, character));

      Accounts.createUser({
          email: email,
          password: password,
          address: addr.data.address,
          private: addr.data.private,
          character: character
      });
      var res = Promise.await(getEther(addr.data.address));
      return addr.data.address;


    },
    'sendMail':function(userId){
        Accounts.sendVerificationEmail(userId)

    },
    'stakeholderId':function(addr){
        return Promise.await(getStakeholderId(addr));
    },
    'updateContract':function(contract, method, args){
        try{
          var res = Promise.await(updateContract(contract, method, args));
          console.log(res);
          return new Promise(function(resolve, reject) { resolve(res.data.results); });
        }catch(e){
          console.log(e);
        }
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

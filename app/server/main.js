import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

/*-------------
    API call
--------------*/

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
    'callContract':function(contract, method, args){
        try{
          var res = Promise.await(updateContract(contract, method, args));
          console.log(res);
          //return new Promise(function(resolve, reject) { resolve(res.data.results); });
          return res.data.results;

        }catch(e){
          console.log(e);
        }
    }
  });
}



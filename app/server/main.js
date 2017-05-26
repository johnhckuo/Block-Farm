import { Meteor } from 'meteor/meteor';
var CongressAddr = "d2ae3d423a1c77021f65b95f1502d3a32b9b529f";
var token = "e22aef855bb045f7904fc4712e7668a9";


var callJson = {
    "private": "51ca1b67efb999415260ef43194ff90ffd72887c607edde8dfd433c58fc08b8e",
    "gas_limit": 2000000
};

var faucet = {
    "address": "d2e4ace3e8ab6debf8360321caeba2c3a15b7d63",
    "amount": 1000000000000000000
};



/*----------
    post
-----------*/

var API_Register = function(email, password, character, callback){
  Meteor.http.call("POST","https://api.blockcypher.com/v1/beth/test/addrs?token="+token, function(error,result){
      if (error){
        callback(error, null);
      }else{
        addr = result;
        //console.log(addr.data.private);
        try{
          Accounts.createUser({
              email: email,
              password: password,
              address: addr.data.address,
              private: addr.data.private,
              character: character
          });
        }catch(e){
          callback(e, null);

        }

        var config = {};
        config.data = {};
        config.headers = {};
        config.data['address'] = addr.data.address;
        config.data['amount'] = 1000000000000000000;

        config.headers['Content-Type'] = 'application/json';
        console.log(config);

        Meteor.http.call("POST","https://api.blockcypher.com/v1/beth/test/faucet?token="+token, config, function(error,result){
            if (error){
              console.log(error);
              callback(error, null);
            }else{
              console.log(result);
              callback(null, "success");

            }
        });

      }
  });
}

var getEther = function(addr, callback){




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
		  Meteor.http.call("POST","https://api.blockcypher.com/v1/beth/test/contracts/"+CongressAddr+"/getStakeholdersLength?token="+token, JSON.stringify(callJson) , function(error,result){
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
    'register':function(email, password, character){
      this.unblock();

      // avoid blocking other method calls from the same client
      // asynchronous call to the dedicated API calling function
      var response = Meteor.wrapAsync(API_Register)(email, password, character);
      console.log(response);
      return response;


    }
  });
}

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

/*----------------------
    init declaration
-----------------------*/
token = "e22aef855bb045f7904fc4712e7668a9";
//token = "68a657243ee1461db6376af481cdb479";

congress = "f9cc75f7435c0139b706ad5e3bbc543f0690ab53";
usingProperty = "d75c04b75237b282cc7e61845f038fbe2669f2cc";
gameProperty = "1bcd070f78a956e2bab965512976c11aba313a2f";
playerSetting = "38c2e1ea64f8b511414ea141c17b16732832bf13";
gameCore = "bf5e3440ec438e41c0bcab4eda2860741c84de41";
matchmaking= "3163ec511129d4633ee17de9ccec58628d0f8c93";

prefix = "https://api.blockcypher.com/v1/beth/test/contracts/";

call = {
    "private": "51ca1b67efb999415260ef43194ff90ffd72887c607edde8dfd433c58fc08b8e",
    "gas_limit": 2000000
};
// call = {
//     "private": "eabe2fb5738329a9f3b955cfd23abf573c5e8f22974a9c6167da26ec787c03a8",
//     "gas_limit": 2000000
// };
updateCall = {
    "data":{
        "private": "51ca1b67efb999415260ef43194ff90ffd72887c607edde8dfd433c58fc08b8e",
      "gas_limit": 2000000,
    },
    "header":"Content-Type:application/json"
};

// updateCall = {
//     "data":{
//         "private": "eabe2fb5738329a9f3b955cfd23abf573c5e8f22974a9c6167da26ec787c03a8",
//       "gas_limit": 2000000,
//     },
//     "header":"Content-Type:application/json"
// };

faucet = {
    "address": "2cdd7eef11071781785b130bec04ba04ccf9df6d",
    "amount": 1000000000000000000
};

/*---------
    init
-----------*/


Meteor.startup(function () {
  smtp = {
    username: 'blockfarm.ssrc',   // eg: server@gentlenode.com
    password: 'Aesl85024',   // eg: 3eeP1gtizk5eziohfervU
    server:   'smtp.gmail.com',  // eg: mail.gandi.net
    port: 25
  }

  process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;
});


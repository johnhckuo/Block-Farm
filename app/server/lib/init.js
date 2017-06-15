import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

/*----------------------
    init declaration
-----------------------*/
//token = "e22aef855bb045f7904fc4712e7668a9";
//token = "68a657243ee1461db6376af481cdb479";
token = "6585fc55331146d798de46d80de359e1";

congress = "2ffc892c4b62844335972e7860521e5a41fea568";
usingProperty = "736329caba7eef597a96ac48c75ad0e1eb9a8be9";
gameProperty = "e030d8bb75740cf1ae4556b11206a48f4d310f75";
playerSetting = "f8fe88aacd6a23cdb96fbb9195439493ab324b17";
gameCore = "f94b7ee3ede3b04df0633eaa28c1bba485e6cb13";
matchmaking= "cecf2d43a689bab41cba2c81526ea1885533cb6d";

prefix = "https://api.blockcypher.com/v1/beth/test/contracts/";

// call = {
//     "private": "51ca1b67efb999415260ef43194ff90ffd72887c607edde8dfd433c58fc08b8e",
//     "gas_limit": 2000000
// };
call = {
    "private": "eabe2fb5738329a9f3b955cfd23abf573c5e8f22974a9c6167da26ec787c03a8",
    "gas_limit": 2000000
};
// updateCall = {
//     "data":{
//         "private": "51ca1b67efb999415260ef43194ff90ffd72887c607edde8dfd433c58fc08b8e",
//       "gas_limit": 2000000,
//     },
//     "header":"Content-Type:application/json"
// };

updateCall = {
    "data":{
        "private": "eabe2fb5738329a9f3b955cfd23abf573c5e8f22974a9c6167da26ec787c03a8",
      "gas_limit": 2000000,
    },
    "header":"Content-Type:application/json"
};

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


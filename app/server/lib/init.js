/*----------------------
    init declaration
-----------------------*/

token = "e22aef855bb045f7904fc4712e7668a9";

gameCore = "d5263110c2307e402406060097bce70fb9847ced";
matchmaking= "4b205306c3739bdfbe860993b96bf0f264c9a561";
playerSetting = "c278f117445bbb155c3d1f82e2eda3360b153ba3";
gameProperty = "e0de742ed43942f9a38790c1cb729105bb3cacdf";
usingProperty = "bfc454a9f57d47a81c31c2705aafff8871dfb9a8";
congress = "c770df271b8ee62c5cf6ffb60ee146381b880fc2";


prefix = "https://api.blockcypher.com/v1/beth/test/contracts/";

call = {
    "private": "51ca1b67efb999415260ef43194ff90ffd72887c607edde8dfd433c58fc08b8e",
    "gas_limit": 2000000
};

updateCall = {
    "data":{
      "private": "51ca1b67efb999415260ef43194ff90ffd72887c607edde8dfd433c58fc08b8e",
      "gas_limit": 2000000,
    },
    "header":"Content-Type:application/json"

};

faucet = {
    "address": "d2e4ace3e8ab6debf8360321caeba2c3a15b7d63",
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
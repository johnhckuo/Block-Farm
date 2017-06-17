import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';


if (Meteor.isServer){


    /*----------------------
        init declaration
    -----------------------*/
    token = "e22aef855bb045f7904fc4712e7668a9";
    //token = "68a657243ee1461db6376af481cdb479";
    privateKey = "51ca1b67efb999415260ef43194ff90ffd72887c607edde8dfd433c58fc08b8e";

    congress = "2ffc892c4b62844335972e7860521e5a41fea568";
    usingProperty = "736329caba7eef597a96ac48c75ad0e1eb9a8be9";
    gameProperty = "e030d8bb75740cf1ae4556b11206a48f4d310f75";
    playerSetting = "f8fe88aacd6a23cdb96fbb9195439493ab324b17";
    gameCore = "f94b7ee3ede3b04df0633eaa28c1bba485e6cb13";
    matchmaking= "cecf2d43a689bab41cba2c81526ea1885533cb6d";

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
        "address": "2cdd7eef11071781785b130bec04ba04ccf9df6d",
        "amount": 1000000000000000000
    };

    /*--------------
        game data
    ----------------*/

    gameInitData = {stakeholder:{},syndicateData:{},property:{},mission:{}, landConfig:{}};
    initGameData = function(){
        console.log("initializing...");
        var userId = Meteor.userId();
        var character = Meteor.users.findOne({_id:userId}).profile.basic.character;
        var username = Meteor.users.findOne({_id:userId}).emails[0].address;

        gameInitData.stakeholder.id = Meteor.users.find().count(); 
        gameInitData.stakeholder.farmerLevel = 0;
        gameInitData.stakeholder.name = username.split("@")[0];
        gameInitData.stakeholder.exp = 0;
        gameInitData.stakeholder.totalExp = 0;
        gameInitData.stakeholder.landSize = 3;
        gameInitData.stakeholder.level = 0;
        gameInitData.stakeholder.stamina = 100;
        gameInitData.stakeholder.lastLogin = 0;
        gameInitData.stakeholder.guardId = 0;

        gameInitData.syndicateData.exp = 0;
        gameInitData.syndicateData.totalExp = 0;
        gameInitData.syndicateData.level = 1;
        gameInitData.syndicateData.success = 0;
        gameInitData.syndicateData.fail = 0;
        gameInitData.syndicateData.progress = 0;
        gameInitData.syndicateData.guardMatchId = -1;
        gameInitData.syndicateData.guardFarmerId = 0;

        gameInitData.property.name = [];
        gameInitData.property.count = [];
        gameInitData.property.type = [];
        gameInitData.property.tradeable = [];
        gameInitData.property.isTrading = [];
        gameInitData.property.start = [];
        gameInitData.property.end = [];
        gameInitData.property.ripe = [];

        gameInitData.landConfig.id = [];
        gameInitData.landConfig.crop = [];
        gameInitData.landConfig.land = [];

        gameInitData.mission.accountStatus = [];
    }


}
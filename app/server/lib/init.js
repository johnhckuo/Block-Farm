import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { property_type } from '../../imports/collections.js';
import { land_type } from '../../imports/collections.js';
import { mission } from '../../imports/collections.js';


if (Meteor.isServer) {


    // const PropertyType = new Mongo.Collection('PropertyType');
    // PropertyType.allow({
    //     'insert': function (userId,doc) {
    //     /* user and doc checks ,
    //     return true to allow insert */
    //     return true; 
    //     }
    // });

    /*----------------------
        init declaration
    -----------------------*/
    // john powei johng bryant
    token = ["d4659f9b512a434287fea776cd6f0fe6", "99fc27a26a42455cbc529923e3a6f8ad", 
    "6df03f5a22014eab8adb54fb83223ff0", "e22aef855bb045f7904fc4712e7668a9", 
    "6f01b597b56b46c0820c56a4e3b16a87", "6585fc55331146d798de46d80de359e1", 
    "308a65855adc4e39bd832bada26eec60", "baf43c22e4e14304993ef62f39d10b58",
    "d6c9fae99f244b91b9a91b62ba5aaf77", "68a657243ee1461db6376af481cdb479",
    "9de8d91e37c04e6cb18fe8293a9c42aa", "bdfbd1877d4242919f011aed5cb2c3bf",
    "25dfd5e26f654c5d9261c690fc032ac0", "0969a88f675e486db5bc2640ef159346",
    "7b67ee158fc9484794fb6a6f2bc8f5ab", "76d25b61922d4958b5f1aa86b7c52717",
    "528fafaf2ba344e5aa67fc16d8ec2b84", "2d43f47becdf4d40a6bbcea9d9af723a",
    "594944bb76d048cda8b0ea013300c4cc", "d3a2846e250d448289d013c1d07e92a2",
    "e73d6ae280f84b1081c8685395f12baf", "27541b99309a4dc7820fb39e92249153",
    "dd0c48b757544042b55b1ded0e0a2633", "05ecfd5fff584d7091d4815cf059e234",
    "4908fcadf071482d8abdfd113b9bac7c"];

    //token = "68a657243ee1461db6376af481cdb479";
    privateKey = "eabe2fb5738329a9f3b955cfd23abf573c5e8f22974a9c6167da26ec787c03a8";

    Property = "b2ed2d6a24e5797f9f6e2ca796b20048ed5e6c31";
    Matchmaking = "cecf2d43a689bab41cba2c81526ea1885533cb6d";

    prefix = "https://api.blockcypher.com/v1/beth/test/contracts/";

    call = {
        "private": "eabe2fb5738329a9f3b955cfd23abf573c5e8f22974a9c6167da26ec787c03a8",
        "gas_limit": 2000000
    };

    updateCall = {
        "data": {
            "private": "eabe2fb5738329a9f3b955cfd23abf573c5e8f22974a9c6167da26ec787c03a8",
            "gas_limit": 2000000,
        },
        "header": "Content-Type:application/json"
    };


    faucet = {
        "address": "2cdd7eef11071781785b130bec04ba04ccf9df6d",
        "amount": 1000000000000000000
    };

    /*--------------
        game data
    ----------------*/

    gameInitData = { stakeholder: {}, syndicateData: {}, property: {}, mission: {}, cropList:{}, landConfig: {} };
    initGameData = function () {
        console.log("initializing...");
        var userId = Meteor.userId();
        var character = Meteor.users.findOne({ _id: userId }).profile.basic.character;
        var username = Meteor.users.findOne({ _id: userId }).emails[0].address;

        gameInitData.stakeholder.id = Meteor.users.find().count()-1;
        gameInitData.stakeholder.farmerLevel = 0;
        gameInitData.stakeholder.name = username.split("@")[0];
        gameInitData.stakeholder.exp = 0;
        gameInitData.stakeholder.totalExp = 0;
        gameInitData.stakeholder.landSize = 3;
        gameInitData.stakeholder.level = 0;
        gameInitData.stakeholder.stamina = 100;
        gameInitData.stakeholder.lastLogin = 0;
        gameInitData.stakeholder.guardId = 0;
        gameInitData.stakeholder.matchesId = [];
        gameInitData.stakeholder.unlockedCropType = [];

        gameInitData.syndicateData.exp = 0;
        gameInitData.syndicateData.totalExp = 0;
        gameInitData.syndicateData.level = 1;
        gameInitData.syndicateData.success = 0;
        gameInitData.syndicateData.fail = 0;
        gameInitData.syndicateData.progress = 0;
        gameInitData.syndicateData.guardMatchId = -1;
        gameInitData.syndicateData.guardFarmerId = 0;

        gameInitData.property.id = [];
        gameInitData.property.name = [];
        gameInitData.property.count = [];
        gameInitData.property.type = [];
        gameInitData.property.tradeable = [];
        gameInitData.property.isTrading = [];        

        gameInitData.cropList.id = [];
        gameInitData.cropList.name = [];
        gameInitData.cropList.img = [];
        gameInitData.cropList.start = [];
        gameInitData.cropList.end = [];
        gameInitData.cropList.ripe = [];
        gameInitData.cropList.count = [];
        gameInitData.cropList.cropType = [];

        gameInitData.landConfig.id = [];
        gameInitData.landConfig.crop = [];
        gameInitData.landConfig.land = [];

        gameInitData.mission.accountStatus = [];
    }


}
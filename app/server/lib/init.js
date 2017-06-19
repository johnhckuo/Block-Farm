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
    token = "99fc27a26a42455cbc529923e3a6f8ad";
    //token = "68a657243ee1461db6376af481cdb479";
    privateKey = "eabe2fb5738329a9f3b955cfd23abf573c5e8f22974a9c6167da26ec787c03a8";

    Property = "1070dcf3255bed81fc0885d17bcf1039d9caa99f";
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
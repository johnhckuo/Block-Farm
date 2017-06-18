import { Session } from 'meteor/session';
import { property_type } from '../../imports/collections.js';
import { land_type } from '../../imports/collections.js';
import { mission } from '../../imports/collections.js';



currentAccount = 3;
cropsPerLvl =3;


function init(event){
  web3.eth.getAccounts(function(err, accs) {
    if (err != null) {
      //sweetAlert("Oops...", "There was an error fetching your accounts.", "error");
      Session.set('account', "Wallet Not Found");
      return;
    }

    if (accs.length == 0) {
      //sweetAlert("Oops...", "Couldn't get any accounts! Make sure your Ethereum client is configured correctly.", "error");
      Session.set('account', "Account Not Found");
      return;
    }

    accounts = accs;
    account = accounts[currentAccount];
    Session.set('account', account);
    //alert(account)
  });
}


Template.index.created = async function() {
    $.getScript('scripts/buttons.js');

    // init();
    Session.set('currentAccount', currentAccount);
    Session.set('cropsPerLvl', cropsPerLvl);
    Session.set("crop_loaded", false);
    Session.set("land_loaded", false);
    Session.set("mission_loaded", false);

    propertyTypeSub = Meteor.subscribe("propertyTypeChannel", function(){
        Session.set("crop_loaded", true);
    });
    landTypeSub = Meteor.subscribe("landTypeChannel", function(){
        Session.set("land_loaded", true);
    });
    missionSub = Meteor.subscribe("missionChannel", function(){
        Session.set("mission_loaded", true);
    });

    // if (Session.get('account') == "Account Not Found" || Session.get('account') == "Wallet Not Found"){
    //     return false;
    // };

    // try{
    //   var val = usingPropertyInstance.propertyTypeList(0);
    //   console.log("=========== Data Inited ===========");

    // }
    // catch(err){
    //   initGameConfig();
    //   console.log(err);
    // }




    //for(var i = 0; i < 70; i++){
    //    GameCoreInstance.addMission(MissionList[i].name, MissionList[i].exp, MissionList[i].lvl_limitation, MissionList[i].status,  { from: web3.eth.accounts[currentAccount], gas: 2000000 });
    //}
    //for(var i = 70; i < MissionList.length; i++){
    //    GameCoreInstance.addMission(MissionList[i].name, MissionList[i].exp, MissionList[i].lvl_limitation, MissionList[i].status,  { from: web3.eth.accounts[currentAccount], gas: 2000000 });
    //}
    //for(var i = 0; i < 70; i++){
    //    GameCoreInstance.addMissionItem(missionItem[i].missionId, missionItem[i].propertyId, missionItem[i].quantity, { from: web3.eth.accounts[currentAccount], gas: 2000000 });
    //}
    //for(var i = 70; i < 140; i++){
    //    GameCoreInstance.addMissionItem(missionItem[i].missionId, missionItem[i].propertyId, missionItem[i].quantity, { from: web3.eth.accounts[currentAccount], gas: 2000000 });
    //}
    //for(var i = 140; i < 210; i++){
    //    GameCoreInstance.addMissionItem(missionItem[i].missionId, missionItem[i].propertyId, missionItem[i].quantity, { from: web3.eth.accounts[currentAccount], gas: 2000000 });
    //}
    //for(var i = 210; i < missionItem.length; i++){
    //    GameCoreInstance.addMissionItem(missionItem[i].missionId, missionItem[i].propertyId, missionItem[i].quantity, { from: web3.eth.accounts[currentAccount], gas: 2000000 });
    //}
}

import { Session } from 'meteor/session';
import { property_type } from '../../imports/collections.js';
import { land_type } from '../../imports/collections.js';
import { mission } from '../../imports/collections.js';
import { matches } from '../../imports/collections.js';

currentAccount = 9;
cropsPerLvl =3;

Template.index.created = async function() {
    $.getScript('scripts/buttons.js');

    Session.set('currentAccount', currentAccount);
    Session.set('cropsPerLvl', cropsPerLvl);
    Session.set("crop_loaded", false);
    Session.set("land_loaded", false);
    Session.set("mission_loaded", false);
    Session.set("current_user_loaded", false);
    Session.set("matches_loaded", false);

    propertyTypeSub = Meteor.subscribe("propertyTypeChannel", function(){
        Session.set("crop_loaded", true);
    });
    landTypeSub = Meteor.subscribe("landTypeChannel", function(){
        Session.set("land_loaded", true);
    });
    missionSub = Meteor.subscribe("missionChannel", function(){
        Session.set("mission_loaded", true);
    });

    userSub = Meteor.subscribe("currentUserChannel", function(){
        Session.set("current_user_loaded", true);
    });

    Meteor.autosubscribe(function() {
        Session.set("matches_loaded", true);
        matches.find().observe({
            added: function(item){ 
            console.log(item);
            }
        });
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
}

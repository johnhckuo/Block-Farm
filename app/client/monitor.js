import { Tracker } from 'meteor/tracker';
import { Session } from 'meteor/session';
import { callPromise } from '../imports/promise.js';
import { dbPromise } from '../imports/promise.js';

Template.monitor.events({
    'click #btn_login': function () {
        $('.login').css('display', 'none');
        $('.monitor_content').css('display', 'flex');
    },
    'click #allSettingData': async function () {
        var data = await dbPromise('getAllSettings');
        $('.contentBoard').html(JSON.stringify(data));
    },
    'click #allUserData': async function () {
        var data = await dbPromise('getAllUser');
        $('.contentBoard').html(JSON.stringify(data));
    },
    'click #MongoMatch': async function () {
        var data = await dbPromise('getMongo');
        $('.contentBoard').html(JSON.stringify(data));
    },
    'click #BlockMatch': async function () {
        var data = await dbPromise('getBlockchain');
        $('.contentBoard').html(data);
    },
    'click #Answers': async function(){
        var data = await dbPromise('getAnsewers');
        $('.contentBoard').html(JSON.stringify(data));
    },
    'click .matchmaking': function(event){
      //await Meteor.call("stopTick");
      Meteor.call("matchmaking");
      sweetAlert("Request Received!", "Stop Ticking! Start matchmaking!", "success");
    },
    'click .startTick':function(event){

      Meteor.call("startTick");
      sweetAlert("Request Received!", "Start ticking!", "success");
    },
    'click .stopTick':function(event){
      Meteor.call("stopTick");
      sweetAlert("Request Received!", "Stop ticking!", "success");
    },
    'click .pauseTick':function(event){
      Meteor.call("pauseTick");
      sweetAlert("Request Received!", "Pause ticking!", "success");
    },
    'click .reupload':function(event){
      Meteor.call("reuploadMongoData", 0, 30);
      sweetAlert("Request Received!", "DB document reuploading to contract", "success");
    },
    'click .reupload2':function(event){
      Meteor.call("reuploadMongoData", 30, 59);
      sweetAlert("Request Received!", "DB document reuploading to contract", "success");
    },
    'click .reupload3':function(event){
      Meteor.call("reuploadMongoData", 57, 59);
      sweetAlert("Request Received!", "DB document reuploading to contract", "success");
    }
});
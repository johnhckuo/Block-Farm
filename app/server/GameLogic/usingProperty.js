import { Meteor } from 'meteor/meteor';

initUserProperty = function(){
    var u_Id = Meteor.userId();
    var _property = Meteor.users.findOne({_id:u_Id}).profile.game.property;
    
}
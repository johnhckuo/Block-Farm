import { Meteor } from 'meteor/meteor';
if(Meteor.isServer){

addUserLandConfiguration = function (landsize) {
    var userId = Meteor.userId();
    var t = Meteor.users.findOne({ _id: userId });
    var _landConfig = Meteor.users.findOne({ _id: userId }).profile.game.landConfig;
    if (landsize == 3) {
        difference = landsize * landsize;
    }
    else {
        difference = (landsize * landsize) - ((landsize - 1) * (landsize - 1));
    }
    var _id = _landConfig.length;
    if(!Number.isInteger(_id)){
        _id = 0;
    }
    for (var i = 0; i < difference; i++) {
        _landConfig.id.push(_id);
        _landConfig.land.push(-1);
        _landConfig.crop.push(-1);
        _id++;
    }

    Meteor.users.update(userId, { $set: { 'profile.game.landConfig': _landConfig } });
}




}
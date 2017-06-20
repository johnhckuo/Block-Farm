import { Meteor } from 'meteor/meteor';
import './GameProperty.js';
import './usingProperty.js';
import './Congress.js';

var unlockCropNum = 3;
var unlockCropLevel = 5;

if (Meteor.isServer) {
    Meteor.methods({
        'levelCap': function (_level) {
            powerResult = 1;
            for (var i = 0; i < _level; i++) {
                powerResult *= 2;
            }
            return powerResult * 100;
        },
        'playerLevelUp': function (random) {
            var u_Id = Meteor.userId();
            var _stakeholder = Meteor.users.findOne({ _id: u_Id }).profile.game.stakeholder;
            _stakeholder.level += 1;
            if (_stakeholder.level % 5 == 0) {
                _stakeholder.landSize += 1;
                var p_Id = random + ((_stakeholder.level / unlockCropLevel) * unlockCropNum);
                Meteor.call('addUserPropertyType', p_Id);
                Meteor.call('addUserLandConfiguration', _stakeholder.landSize);
            }
            Meteor.call('updateGameData', _stakeholder.landSize, _stakeholder.level);
        }
    });
}
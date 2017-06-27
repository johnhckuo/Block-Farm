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
        'playerLevelUp': function (s_Id, random) {
            var _stakeholder = Meteor.users.findOne({'profile.game.stakeholder.id':s_Id}).profile.game.stakeholder;
            _stakeholder.level += 1;
            if (_stakeholder.level % 5 == 0) {
                _stakeholder.landSize += 1;
                var cropStart = ((_stakeholder.level / unlockCropLevel) * unlockCropNum);
                var cropEnd = cropStart + unlockCropNum;
                var p_Id = random + cropStart;
                for (var i = cropStart; i < cropEnd; i++) {
                    if (i != p_Id)
                        Meteor.call('addUserPropertyType',s_Id, i);
                }
                Meteor.call('addUserLandConfiguration',s_Id, _stakeholder.landSize);
            }
            Meteor.call('updateGameData',s_Id, _stakeholder.landSize, _stakeholder.level);
        }
    });
}
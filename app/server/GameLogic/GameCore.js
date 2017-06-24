import { Meteor } from 'meteor/meteor';
import { property_type } from '../../imports/collections.js';
import { mission } from '../../imports/collections.js';

if (Meteor.isServer) {
    Meteor.methods({
        'pushMissionAccountStatus': function (s_Id) {
            var _mission = Meteor.users.findOne({'profile.game.stakeholder.id': s_Id}).profile.game.mission;
            var missionList = mission.findOne({}).data;
            for (var i = 0; i < missionList.length; i++) {
                _mission.accountStatus.push(false);
            }
            Meteor.users.update({'profile.game.stakeholder.id': s_Id}, { $set: { 'profile.game.mission': _mission } });
        },
        'submitMission': function (s_Id, m_Id) {
            var _mission = Meteor.users.findOne({'profile.game.stakeholder.id': s_Id}).profile.game.mission;
            _mission.accountStatus[m_Id] = true;
            Meteor.users.update({'profile.game.stakeholder.id': s_Id}, { $set: { 'profile.game.mission': _mission } });
        }
    });
}
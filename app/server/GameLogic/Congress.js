import { Meteor } from 'meteor/meteor';
import { questionnaires } from '../../imports/collections.js';

if (Meteor.isServer) {
    Meteor.methods({
        'updateGameData': function (s_Id, _landSize, _level) {
            var _stakeholder = Meteor.users.findOne({ 'profile.game.stakeholder.id': s_Id }).profile.game.stakeholder;
            _stakeholder.landSize = _landSize;
            _stakeholder.level = _level;
            Meteor.users.update({ 'profile.game.stakeholder.id': s_Id }, { $set: { 'profile.game.stakeholder': _stakeholder } });
        },
        'updateStakeholderLastLogin': function (s_Id) {
            try {
                var _stakeholder = Meteor.users.findOne({ 'profile.game.stakeholder.id': s_Id }).profile.game.stakeholder;
                _stakeholder.lastLogin = new Date();
                Meteor.users.update({ 'profile.game.stakeholder.id': s_Id }, { $set: { 'profile.game.stakeholder': _stakeholder } });
            }
            catch (e) {
                console.log(e);
            }
        },
        'updateUserStamina': function (s_Id, sta) {
            try {
                var _stakeholder = Meteor.users.findOne({ 'profile.game.stakeholder.id': s_Id }).profile.game.stakeholder;
                _stakeholder.stamina = sta;
                Meteor.users.update({ 'profile.game.stakeholder.id': s_Id }, { $set: { 'profile.game.stakeholder': _stakeholder } });
            }
            catch (e) {
                console.log(e);
            }
        },
        'updateGuardId': function (s_Id, g_Id) {
            var _stakeholder = Meteor.users.findOne({ "profile.game.stakeholder.id": s_Id }).profile.game.stakeholder;
            _stakeholder.guardId = g_Id;
            Meteor.users.update({ "profile.game.stakeholder.id": s_Id }, { $set: { 'profile.game.stakeholder': _stakeholder } });
        },
        'updateGuardMatchId': function (s_Id, g_Id) {
            var _syndicateData = Meteor.users.findOne({ "profile.game.stakeholder.id": s_Id }).profile.game.syndicateData;
            _syndicateData.guardMatchId = g_Id;
            Meteor.users.update({ "profile.game.stakeholder.id": s_Id }, { $set: { 'profile.game.syndicateData': _syndicateData } });
        },
        'updateFarmerId': function (s_Id, f_Id) {
            var _syndicateData = Meteor.users.findOne({ "profile.game.stakeholder.id": s_Id }).profile.game.syndicateData;
            _syndicateData.guardFarmerId = f_Id;
            Meteor.users.update({ "profile.game.stakeholder.id": s_Id }, { $set: { 'profile.game.syndicateData': _syndicateData } });
        },
        'updateSyndicateProgress': function (s_Id, _progress) {
            var _syndicateData = Meteor.users.findOne({ 'profile.game.stakeholder.id': s_Id }).profile.game.syndicateData;
            _syndicateData.progress = _progress;
            Meteor.users.update({ 'profile.game.stakeholder.id': s_Id }, { $set: { 'profile.game.syndicateData': _syndicateData } });
        },
        'updateStealRecord': function (s_Id, result) {
            var _syndicateData = Meteor.users.findOne({ 'profile.game.stakeholder.id': s_Id }).profile.game.syndicateData;
            if (result)
                _syndicateData.success += 1;
            else
                _syndicateData.fail += 1;
            Meteor.users.update({ 'profile.game.stakeholder.id': s_Id }, { $set: { 'profile.game.syndicateData': _syndicateData } });
        },
        'updateUserExp': function (s_Id, _exp, currentExp) {
            var _stakeholder = Meteor.users.findOne({ 'profile.game.stakeholder.id': s_Id }).profile.game.stakeholder;
            _stakeholder.exp = currentExp;
            _stakeholder.totalExp += _exp;
            Meteor.users.update({ 'profile.game.stakeholder.id': s_Id }, { $set: { 'profile.game.stakeholder': _stakeholder } });
        },
        'updateSyndicateExp': function (s_Id, _exp, currentExp, _level) {
            var _syndicateData = Meteor.users.findOne({ 'profile.game.stakeholder.id': s_Id }).profile.game.syndicateData;
            _syndicateData.exp = currentExp;
            _syndicateData.totalExp += _exp;
            _syndicateData.level = _level;
            Meteor.users.update({ 'profile.game.stakeholder.id': s_Id }, { $set: { 'profile.game.syndicateData': _syndicateData } });
        },
        'updateAnswerStatus': function (s_Id) {
            var _stakeholder = Meteor.users.findOne({ 'profile.game.stakeholder.id': s_Id }).profile.game.stakeholder;
            _stakeholder.answered = true;
            Meteor.users.update({ 'profile.game.stakeholder.id': s_Id }, { $set: { 'profile.game.stakeholder': _stakeholder } });
        },
        'submitQuestionnaire': function (s_Id, data) {
            var user = Meteor.users.findOne({ 'profile.game.stakeholder.id': s_Id });
            var email = user.emails[0].address;
            var answers = {};
            data['email'] = email;
            for(var i =0; i < data.length; i++){
                answers['Q' + i] = data[i];
            }
            questionnaires.insert(answers);       
        }
    });
}

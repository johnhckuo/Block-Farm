import { Meteor } from 'meteor/meteor';
if (Meteor.isServer) {
    Meteor.methods({
        'updateGameData': function (_landSize, _level) {
            var userId = Meteor.userId();
            var _stakeholder = Meteor.users.findOne({ _id: userId }).profile.game.stakeholder;
            _stakeholder.landSize = _landSize;
            _stakeholder.level = _level;
            Meteor.users.update(userId, { $set: { 'profile.game.stakeholder': _stakeholder } });
        },
        'updateStakeholderLastLogin': function () {
            var userId = Meteor.userId();
            try {
                var _stakeholder = Meteor.users.findOne({ _id: userId }).profile.game.stakeholder;
                _stakeholder.lastLogin = new Date();
                Meteor.users.update(userId, { $set: { 'profile.game.stakeholder': _stakeholder } });
            }
            catch (e) {
                console.log(e);
            }
        },
        'updateUserStamina': function (sta) {
            var userId = Meteor.userId();
            try {
                var _stakeholder = Meteor.users.findOne({ _id: userId }).profile.game.stakeholder;
                _stakeholder.stamina = sta;
                Meteor.users.update(userId, { $set: { 'profile.game.stakeholder': _stakeholder } });
            }
            catch (e) {
                console.log(e);
            }
        },
        'updateGuardId': function (s_Id, g_Id) {
            var _stakeholder = Meteor.users.findOne({ "profile.game.stakeholder.id": s_Id }).profile.game.stakeholder;
            _stakeholder.guardId = g_Id;
            Meteor.users.update({"profile.game.stakeholder.id": s_Id}, { $set: { 'profile.game.stakeholder': _stakeholder } });
        },
        'updateGuardMatchId': function (s_Id, g_Id) {
            var _syndicateData = Meteor.users.findOne({"profile.game.stakeholder.id": s_Id }).profile.game.syndicateData;
            _syndicateData.guardMatchId = g_Id;
            Meteor.users.update({"profile.game.stakeholder.id": s_Id}, { $set: { 'profile.game.syndicateData': _syndicateData } });
        },
        'updateFarmerId': function (s_Id, f_Id) {
            var _syndicateData = Meteor.users.findOne({"profile.game.stakeholder.id": s_Id }).profile.game.syndicateData;
            _syndicateData.guardFarmerId = f_Id;
            Meteor.users.update({"profile.game.stakeholder.id": s_Id}, { $set: { 'profile.game.syndicateData': _syndicateData } });
        },
        'updateSyndicateProgress': function (_progress) {
            var userId = Meteor.userId();
            var _syndicateData = Meteor.users.findOne({ _id: userId }).profile.game.syndicateData;
            _syndicateData.progress = _progress;
            Meteor.users.update(userId, { $set: { 'profile.game.syndicateData': _syndicateData } });
        },
        'updateStealRecord': function (result) {
            var userId = Meteor.userId();
            var _syndicateData = Meteor.users.findOne({ _id: userId }).profile.game.syndicateData;
            if (result)
                _syndicateData.success += 1;
            else
                _syndicateData.fail += 1;
            Meteor.users.update(userId, { $set: { 'profile.game.syndicateData': _syndicateData } });
        },
        'updateUserExp': function (_exp, currentExp) {
            var userId = Meteor.userId();
            var _stakeholder = Meteor.users.findOne({ _id: userId }).profile.game.stakeholder;
            _stakeholder.exp = currentExp;
            _stakeholder.totalExp += _exp;
            Meteor.users.update(userId, { $set: { 'profile.game.stakeholder': _stakeholder } });
        },
        'updateSyndicateExp': function (_exp, currentExp, _level) {
            var userId = Meteor.userId();
            var _syndicateData = Meteor.users.findOne({ _id: userId }).profile.game.syndicateData;
            _syndicateData.exp = currentExp;
            _syndicateData.totalExp += _exp;
            _syndicateData.level = _level;
            Meteor.users.update(userId, { $set: { 'profile.game.syndicateData': _syndicateData } });
        }
    });
}

import { Meteor } from 'meteor/meteor';
if (Meteor.isServer) {
    Meteor.methods({
        'updateGameData': function (_landSize, _level) {
            var userId = Meteor.userId();
            var _stakeholder = Meteor.users.findOne({ _id: userId }).profile.game.stakeholder;
            console.log(_stakeholder.level);
            _stakeholder.landSize = _landSize;
            _stakeholder.level = _level;
            console.log(_stakeholder.level);
            Meteor.users.update(userId, { $set: { 'profile.game.stakeholder': _stakeholder } });
        },
        'updateStakeholderLastLogin': function (_lastLogin) {
            var userId = Meteor.userId();
            try {
                var _stakeholder = Meteor.users.findOne({ _id: userId }).profile.game.stakeholder;
                _stakeholder.lastLogin = _lastLogin;
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
        'updateGuardId': function (g_Id) {
            var userId = Meteor.userId();
            var _stakeholder = Meteor.users.findOne({ _id: userId }).profile.game.stakeholder;
            _stakeholder.guardId = g_Id;
            Meteor.users.update(userId, { $set: { 'profile.game.stakeholder': _stakeholder } });
        },
        'updateGuardMatchId': function (g_Id) {
            var userId = Meteor.userId();
            var _syndicateData = Meteor.users.findOne({ _id: userId }).profile.game.syndicateData;
            _syndicateData.guardMatchId = g_Id;
            Meteor.users.update(userId, { $set: { 'profile.game.syndicateData': _syndicateData } });
        },
        'updateFarmerId': function (f_Id) {
            var userId = Meteor.userId();
            var _syndicateData = Meteor.users.findOne({ _id: userId }).profile.game.syndicateData;
            _syndicateData.guardFarmerId = f_Id;
            Meteor.users.update(userId, { $set: { 'profile.game.syndicateData': _syndicateData } });
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
        'updateSyndicateExp': function (_exp, _level) {
            var userId = Meteor.userId();
            var _syndicateData = Meteor.users.findOne({ _id: userId }).profile.game.syndicateData;
            _syndicateData.exp = _exp;
            _syndicateData.totalExp += _exp;
            _syndicateData.level = _level;
            Meteor.users.update(userId, { $set: { 'profile.game.syndicateData': _syndicateData } });
        }
    });
}

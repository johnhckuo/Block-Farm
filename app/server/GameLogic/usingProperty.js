import { Meteor } from 'meteor/meteor';
import { property_type } from '../../imports/collections.js';

if (Meteor.isServer) {
    Meteor.methods({
        'initUserProperty': function () {
            var u_Id = Meteor.userId();
            var _property = Meteor.users.findOne({ _id: u_Id }).profile.game.property;
            var propertyType = property_type.findOne({}).data;
            for (var i = 0; i < propertyType.length; i++) {
                _property.name.push(propertyType[i].name);
                _property.count.push(0);
                _property.type.push(i);
                _property.tradeable.push(0);
                _property.isTrading.push(0);
            }
            Meteor.users.update(u_Id, { $set: { 'profile.game.property': _property } });
        },
        'updatePropertyCount_Setting': function (p_Id, _count, _tradable) {
            var u_Id = Meteor.userId();
            var _property = Meteor.users.findOne({ _id: u_Id }).profile.game.property;
            _property.count[p_Id] = _count;
            _property.tradeable[p_Id] = _tradable;
            Meteor.users.update(u_Id, { $set: { 'profile.game.property': _property } });
        },
        'updatePropertyCount': function (p_Id, _count) {
            var u_Id = Meteor.userId();
            var _property = Meteor.users.findOne({ _id: u_Id }).profile.game.property;
            _property.count[p_Id] += parseInt(_count);
            console.log(_count);
            Meteor.users.update(u_Id, { $set: { 'profile.game.property': _property } });
        },
        'updateTradingStatus': function (p_Id, _isTrading) {
            var u_Id = Meteor.userId();
            var _property = Meteor.users.findOne({ _id: u_Id }).profile.game.property;
            _property.isTrading[p_Id] = _isTrading;
            Meteor.users.update(u_Id, { $set: { 'profile.game.property': _property } });
        },
        'addUserPropertyType': function (p_Id) {
            var u_Id = Meteor.userId();
            var _stakeholder = Meteor.users.findOne({ _id: u_Id }).profile.game.stakeholder;
            _stakeholder.unlockedCropType.push(p_Id);
            Meteor.users.update(u_Id, { $set: { 'profile.game.stakeholder': _stakeholder } });
        }
    });
}     
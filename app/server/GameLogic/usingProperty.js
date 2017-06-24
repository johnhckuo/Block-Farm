import { Meteor } from 'meteor/meteor';
import { property_type } from '../../imports/collections.js';

if (Meteor.isServer) {
    Meteor.methods({
        'initUserProperty': function (s_Id) {
            var _property = Meteor.users.findOne({'profile.game.stakeholder.id': s_Id}).profile.game.property;
            var propertyType = property_type.find({},{sort:{id:1}}).fetch();
            for (var i = 0; i < propertyType.length; i++) {
                _property.id.push(i);
                _property.name.push(propertyType[i].name);
                _property.count.push(0);
                _property.type.push(i);
                _property.tradeable.push(0);
                _property.isTrading.push(0);
            }
            Meteor.users.update({'profile.game.stakeholder.id': s_Id}, { $set: { 'profile.game.property': _property } });
        },
        'updatePropertyCount_Setting': function (s_Id, p_Id, _count, _tradable) {
            var _property = Meteor.users.findOne({'profile.game.stakeholder.id': s_Id}).profile.game.property;
            _property.count[p_Id] = _count;
            _property.tradeable[p_Id] = _tradable;
            Meteor.users.update({'profile.game.stakeholder.id': s_Id}, { $set: { 'profile.game.property': _property } });
        },
        'updatePropertyCount': function (s_Id, p_Id, _count) {
            var _property = Meteor.users.findOne({'profile.game.stakeholder.id': s_Id}).profile.game.property;
            _property.count[p_Id] += parseInt(_count);
            Meteor.users.update({'profile.game.stakeholder.id': s_Id}, { $set: { 'profile.game.property': _property } });
        },
        'updateTradingStatus': function (s_Id, p_Id, _isTrading) {
            var isTrading = Meteor.users.findOne({'profile.game.stakeholder.id':s_Id}).profile.game.property.isTrading;
            isTrading[p_Id] = _isTrading;
            Meteor.users.update({'profile.game.stakeholder.id': s_Id}, { $set: { 'profile.game.property.isTrading': isTrading } });
        },
        'addUserPropertyType': function (s_Id, p_Id) {
            var _stakeholder = Meteor.users.findOne({'profile.game.stakeholder.id': s_Id}).profile.game.stakeholder;
            _stakeholder.unlockedCropType.push(p_Id);
            Meteor.users.update({'profile.game.stakeholder.id': s_Id}, { $set: { 'profile.game.stakeholder': _stakeholder } });
        },
        'updateOwnershipStatus':function(current_s_Id, receive_s_Id, p_Id, tradeCount){
            var current_userId = Meteor.users.findOne({'profile.game.stakeholder.id':current_s_Id})._id;
            var receive_userId = Meteor.users.findOne({'profile.game.stakeholder.id':receive_s_Id})._id;

            var reciever_Count = Meteor.users.findOne({_id:receive_userId}).profile.game.property.count;
            var sender_Tradeable = Meteor.users.findOne({_id:current_userId}).profile.game.property.tradeable;

            reciever_Count[p_Id] += tradeCount;
            sender_Tradeable[p_Id] = 0;
            Meteor.users.update(receive_userId, { $set: { 'profile.game.property.count': reciever_Count } });
            Meteor.users.update(current_userId, { $set: { 'profile.game.property.tradeable': sender_Tradeable } });
            return "success";
        },
        'updatePropertyTypeRating': function(p_Id, _rate, s_Id){
            try{                
                var rating = property_type.find({'id':p_Id}, {fields:{rating:1}}).fetch()[0].rating;
                console.log("========="+ rating[s_Id]+"|"+_rate+"|"+p_Id);

                rating[s_Id] = _rate;
                property_type.update({'id':p_Id}, { $set: { 'rating': rating } });
            }catch(e){
                console.log(e);
            }
        }
    });
}     
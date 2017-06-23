
import { Meteor } from 'meteor/meteor';
import { property_type } from '../../imports/collections.js';
import { land_type } from '../../imports/collections.js';
import { mission } from '../../imports/collections.js';
import { matches } from '../../imports/collections.js';
import { callPromise } from '../../imports/promise.js';
import { dbPromise } from '../../imports/promise.js';

if (Meteor.isServer) {
    Meteor.methods({
        'getAllSettings': function () {
            var _property = property_type.find().fetch();
            var _land = land_type.find().fetch();
            var _mission = mission.find().fetch();
            var obj = { 
                'property': _property, 
                'land': _land, 
                'mission': _mission 
            };
            return obj;
        },
        'getAllUser': function () {
            return Meteor.users.find().fetch();
        },
        'getMongo': function () {
            return matches.find().fetch();
        },
        'getBlockchain': function () {

        }
    });
}
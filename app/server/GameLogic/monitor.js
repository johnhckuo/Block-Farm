
import { Meteor } from 'meteor/meteor';
import { property_type } from '../../imports/collections.js';
import { land_type } from '../../imports/collections.js';
import { mission } from '../../imports/collections.js';
import { matches } from '../../imports/collections.js';
import { callPromise } from '../../imports/promise.js';
import { dbPromise } from '../../imports/promise.js';
import { questionnaires } from '../../imports/collections.js';

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
            var match = [];
            for (i = 0; i < matches.find().fetch().length; i++) {
                wait(200);
                try {
                    var res = Promise.await(callContract_api("Matchmaking", "getMatchMaking", [i]));
                    match.push("<div>" + JSON.stringify(res) + "</div><p>");
                }
                catch (e) {
                    console.log(i + " : " + e);
                }
            }
            return match;
        },
        'getAnsewers': function () {
            return questionnaires.find().fetch();
        }
    });
}
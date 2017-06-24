import { Meteor } from 'meteor/meteor';

if (Meteor.isServer) {

    SyncedCron.add({
        name: 'Matchmaking ticker',
        schedule: function(parser) {
            // parser is a later.parse object
            return parser.text('every 1 minutes');
        },
        job: function() {
            Meteor.call("matchmaking");
        }
    });

    Meteor.methods({
        'tick': function () {

        },
        'startTick': function () {
            SyncedCron.start();
        },
        'stopTick': function () {
            SyncedCron.stop();
        },
        'pauseTick': function () {
            SyncedCron.pause();
        },
    });
}
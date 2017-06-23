import { Tracker } from 'meteor/tracker';
import { Session } from 'meteor/session';
import { property_type } from '../imports/collections.js';
import { land_type } from '../imports/collections.js';
import { mission } from '../imports/collections.js';
import { matches } from '../imports/collections.js';
import { callPromise } from '../imports/promise.js';
import { dbPromise } from '../imports/promise.js';

Template.monitor.events({
    'click #btn_login':function(){
        alert("a");
    }

});
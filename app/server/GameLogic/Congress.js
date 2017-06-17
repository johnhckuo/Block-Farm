import { Meteor } from 'meteor/meteor';
if (Meteor.isServer){

    Congress = new function(){

        this.addMember = function(){
            console.log("hi");
        };

    }
}

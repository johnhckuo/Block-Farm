import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

/*--------------------
    email Setting
---------------------*/

var resetPassword = function(){
    Accounts.emailTemplates.siteName = "Meteor Guide Todos Example";
    Accounts.emailTemplates.from = "johnhckuo@gmail.com";
    Accounts.emailTemplates.resetPassword = {
      subject(user) {
        return "Reset your password on Meteor Todos";
      },
      text(user, url) {
        return `Hello!
    Click the link below to reset your password on Meteor Todos.
    ${url}
    If you didn't request this email, please ignore it.
    Thanks,
    The Meteor Todos team
    `
      },
      html(user, url) {
        // This is where HTML email content would go.
        // See the section about html emails below.
      }
    };

}

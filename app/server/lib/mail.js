import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

/*--------------------
    email Setting
---------------------*/

Accounts.emailTemplates.siteName = "Blockfarm email Verification";
Accounts.emailTemplates.from = "blockfarm.ssrc@gmail.com";
Accounts.emailTemplates.verifyEmail = {
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




// Accounts.emailTemplates.verifyEmail = {
//   subject() {
//     return "[Blockfarm] Verify Your Email Address";
//   },
//   text( user, url ) {
//     let emailAddress   = user.emails[0].address,
//         urlWithoutHash = url.replace( '#/', '' ),
//         supportEmail   = "blockfarm.ssrc@gmail.com",
//         emailBody      = `To verify your email address (${emailAddress}) visit the following link:\n\n${urlWithoutHash}\n\n If you did not request this verification, please ignore this email. If you feel something is wrong, please contact our support team: ${supportEmail}.`;

//     return emailBody;
//   }
// };
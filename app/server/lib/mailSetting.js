import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

if (Meteor.isServer){


    /*--------------------
        email Setting
    ---------------------*/

    Accounts.emailTemplates.siteName = "Blockfarm";
    Accounts.emailTemplates.from = "Blockfarm Support <blockfarm.ssrc@gmail.com>";

    /*--------------------
        verify email
    ---------------------*/

    Accounts.emailTemplates.verifyEmail = {
    subject(user) {
        return "[Blockfarm] Please Verify Your Email Address";
    },
    // text( user, url ) {
    //   let emailAddress   = user.emails[0].address,
    //       urlWithoutHash = url.replace( '#/', '' ),
    //       supportEmail   = "blockfarm.ssrc@gmail.com",
    //       emailBody      = `To verify your email address : ${emailAddress}, please visit the following link:\n\n${urlWithoutHash}\n\n If you did not request this verification, please ignore this email.\nIf you feel something is wrong, please contact our support team: ${supportEmail}.\n\nThank you and have a nice day!`;
    //
    //   return emailBody;
    // },
    html(user, url){
        var emailAddress   = user.emails[0].address,
            urlWithoutHash = url.replace( '#/', '' ),
            supportEmail   = "blockfarm.ssrc@gmail.com",
            githubURL = "https://github.com/johnhckuo/Block-Farm",
            emailBody      = "<p>To verify your email address : "+emailAddress+", please visit the following link:</p><br />"+urlWithoutHash+"<br /><br /><p>If you did not request this verification, please ignore this email.</p><p>If you feel something is wrong, please contact our support team: "+ supportEmail+".</p><p>Thank you and have a nice day!</p><br /><br />";

        var emailFooter = "<img src='https://ci3.googleusercontent.com/proxy/Xbp8qxedtTusnbhds1lgI-5N4CxyxFBK8kZndjbw29BAPqVCoPZZkAUk6oPGVcmw9hjulbsG2tVLpegUAtXUFbrTYn78Y9rjm6DJ-E9JOd3LCMA3tshOZBjNMClVRe-tdCSQcE3x0K5hZbcmhM_JbkEuKRq2SU92c6d4cHBLtgYqHA7Z2AhdJMqFwjNIbCS_jiYkQcDdLvsABMo=s0-d-e1-ft#https://docs.google.com/uc?export=download&id=0B-F5E2JQkra-blloNFoyTzhwc0U&revid=0B-F5E2JQkra-RU53ZXdvYzBOendZQTB4QUZvZFV1ZWcrWENFPQ' width='40%' height='auto'/><p>Blockfarm Development Team</p><p><a>"+ githubURL+"</a></p><p>-----------------------------------</p><p>National ChengChi University</p><p>Service Science Research Center</p><p>No.64, Sec. 2, Zhinan Rd., Wenshan Dist., Taipei City 116, Taiwan (R.O.C)</p>"
        return emailBody+emailFooter;
    }
    };

    /*------------------
       Reset password
    -------------------*/

    Accounts.emailTemplates.resetPassword = {
    subject(user) {
        return "[Blockfarm] Please Reset Your Password";
    },
    html( user, url ) {
        var emailAddress   = user.emails[0].address,
            urlWithoutHash = url.replace( '#/', '' ),
            supportEmail   = "blockfarm.ssrc@gmail.com",
            githubURL = "https://github.com/johnhckuo/Block-Farm",
            emailBody = "<p>To reset your password, please visit the following link: </p><br />"+url+ "<br /><br /><p>If you did not request this reset, please ignore this email.</p><p>If you feel something is wrong, please contact our support team: "+supportEmail+".</p><br /><br /><p>Thank you and have a nice day!</p>";
        var emailFooter = "<img src='https://ci3.googleusercontent.com/proxy/Xbp8qxedtTusnbhds1lgI-5N4CxyxFBK8kZndjbw29BAPqVCoPZZkAUk6oPGVcmw9hjulbsG2tVLpegUAtXUFbrTYn78Y9rjm6DJ-E9JOd3LCMA3tshOZBjNMClVRe-tdCSQcE3x0K5hZbcmhM_JbkEuKRq2SU92c6d4cHBLtgYqHA7Z2AhdJMqFwjNIbCS_jiYkQcDdLvsABMo=s0-d-e1-ft#https://docs.google.com/uc?export=download&id=0B-F5E2JQkra-blloNFoyTzhwc0U&revid=0B-F5E2JQkra-RU53ZXdvYzBOendZQTB4QUZvZFV1ZWcrWENFPQ' width='40%' height='auto'/><p>Blockfarm Development Team</p><p><a>"+ githubURL+"</a></p><p>-----------------------------------</p><p>National ChengChi University</p><p>Service Science Research Center</p><p>No.64, Sec. 2, Zhinan Rd., Wenshan Dist., Taipei City 116, Taiwan (R.O.C)</p>"

        return emailBody+emailFooter;
    }
    };

}
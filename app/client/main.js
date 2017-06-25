import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import { property_type } from '../imports/collections.js';
import { land_type } from '../imports/collections.js';
import { mission } from '../imports/collections.js';

import './main.html';
import './index.html';
import './game.html';

import './game.js';

////////////////////
//                //
//     Init       //
//                //
////////////////////

var stakeholderLength;
var ownerAccount = 0;
var renderChecked = false;
var userNameCounter = 0;
var name;

////////////////////
//                //
//     Utility    //
//     Function   //
//                //
////////////////////

var hex2a = function (hexx) {
  var hex = hexx.toString();//force conversion
  var str = '';
  for (var i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}

var loading = function (on) {
  var opacity;
  if (on) {
    $(".loadingParent").css("display", "flex");
    $(".loadingParent").css("opacity", 0.8);
  } else {
    $(".loadingParent").css("opacity", 0);
    setTimeout(function () {
      $(".loadingParent").css("display", "none");
    }, 1000);
  }
}


var validateEmail = function (email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}


////////////////////
//                //
//     Helpers    //
//                //
////////////////////

if (Meteor.isClient) {


  Template.index.rendered = async function () {
    if (!this._rendered && !renderChecked) {
      console.log('Template render complete');
      renderChecked = true;
      var fetcher = setInterval(async function () {
        if (Session.get("crop_loaded") && Session.get("land_loaded") & Session.get("mission_loaded")  && Session.get("current_user_loaded")) {
          console.log("server connection established!");
          var initCounter = property_type.find().fetch().length;
<<<<<<< HEAD
          if (initCounter == 0) { // need to comment
=======
          if (initCounter == 0) {
>>>>>>> 5501d77020163f02b0e8e7c661795c485cd1a791
            var res = await Meteor.call('init');
          }
          clearInterval(fetcher);
        } else {
          console.log("establishing db connection... hold on!")
        }
      }, 1000);
    }
  }


  Template.index.helpers({

    currentAddress: function () {

      return Session.get("account");
    },
    currentAccount: function () {
      var Id = CongressInstance.stakeholderId.call(web3.eth.accounts[currentAccount], { from: web3.eth.accounts[currentAccount] }).c[0];
      var data = CongressInstance.getStakeholder.call(Id, { from: web3.eth.accounts[currentAccount] });
      return hex2a(data[0]);
    }

  });

  ////////////////////
  //                //
  //     Event      //
  //                //
  ////////////////////

  Template.index.events({
    'click #arrow-down': function (e) {
      e.preventDefault();
      var height = window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight;
      scrollDuration = 1000;
      $(window).scrollTo(height, scrollDuration);
    },
    'click .chooseCharacters': function (event, instance) {
      document.getElementById("guard").setAttribute("class", "btn btn-default chooseCharacters");
      document.getElementById("thief").setAttribute("class", "btn btn-default chooseCharacters");
      event.target.className = "btn btn-info chooseCharacters";
      character = event.target.value;
    },
    'click #login-submit': function (event) {
      event.preventDefault();
      var email = $('[name=login_email]').val();
      var password = $('[name=login_password]').val();
      if (email.trim() == "") {
        sweetAlert("Oops...", "Please enter your email !", "error");
        return;
      } else if (password == null) {
        sweetAlert("Oops...", "Please enter your password !", "error");
        return;
      }
      Meteor.loginWithPassword(email, password, function (err, res) {
        loading(0);
        var userId = Meteor.userId();
        var info = Meteor.users.findOne({ _id: userId });
        if (err) {
          console.log(err);
          sweetAlert("Oops...", err.reason, "error");
          Session.set("data", err.reason);
        } else if (!Meteor.user().emails[0].verified) {
          sweetAlert("You haven't verified your email!", "Please go check your mailbox", "error");
        } else {
          Session.set("address", info.profile.address);
          Session.set("private", info.profile.private);
          Session.set('loggedIn', true);

          swal({
            title: "You are now logged in!",
            text: "Your address is " + info.profile.basic.address,
            type: "success",
            showCancelButton: false
          },
            function () {
              Router.go('/game');
            });

        }
      });

    },
    'click .forget-password': async function (event) {
      event.preventDefault();
      let email = $('[name=forget-password-email]').val();
      // var res = Meteor.users.findOne({: email}});
      // console.log(res);
      try {
        var res = await Accounts.forgotPassword({ email: email });
      } catch (e) {
        sweetAlert("Oops...", e, reason, "error");
        return;
      }
      sweetAlert("Please check your email!", "We've just sent an e-mail to reset your password!", "success");
    },
    'click .register': async function (e) {
      e.preventDefault();

      var email = $('[name=email]').val();
      var password = $('[name=password]').val();
      if (email.trim() == "") {
        sweetAlert("Oops...", "Please enter your username !", "error");
        return;
      } else if (password.trim() == "") {
        sweetAlert("Oops...", "Please enter your password !", "error");
        return;
      } else if (typeof character == 'undefined') {
        sweetAlert("Oops...", "Please choose your character !", "error");
        return;
      }

      if (!validateEmail(email)) {
        sweetAlert("Oops...", "Please enter a valid email !", "error");
        return;
      }
      if (password.length < 6) {
        sweetAlert("Oops...", "Password must be at least 6 characters long !", "error");
        return;
      }

      Meteor.logout();
      loading(1);

      console.log("get Parameter" + email + "." + password + "." + character);
      var res = await callPromise('register', email, password, character);
      Meteor.loginWithPassword(
        { 'email': email },
        password
      );
      if (res.type == "error") {
        sweetAlert("Oops...", res.result, "error");
        Session.set("loggedIn", false);
        loading(0);
        return;
      }
      var res = await callPromise('sendVerificationLink');

      if (res.type == "success") {
        sweetAlert("Register Complete :)", "We've sent a verification email to " + email, "success");
        Session.set("loggedIn", true);
        //Router.go("game");
      } else {
        sweetAlert("Oops...", res.result, "error");
      }
      loading(0);
      //register();

    },
    'click #sign-up': function (event) {
      event.preventDefault();
      var height = window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight;
      scrollDuration = 1000;
      $(window).scrollTo(height * 3, scrollDuration);
    },
    'click #login-trigger': function (event) {
      $('#login-container').slideToggle('fast');
      $('#login-container').toggleClass('hidden');
      // if($(event.target).hasClass('active')) $(event.target).find('span')
    },
    'click #forgot-passward': function (event) {
      // $('.flipper').slideToggle();
      $('.flipper').toggleClass('flipperClicked');
    },
    'click #forgot-back': function (event) {
      $('.flipper').toggleClass('flipperClicked');
    },
    'click .matchmaking': function(event){
      Meteor.call("matchmaking");
    },
    'click .confirmation':function(event){
      Meteor.call("confirmation");
    },
    'click .startTick':function(event){
      Meteor.call("startTick");
    },
    'click .stopTick':function(event){
      Meteor.call("stopTick");
    },
    'click .pauseTick':function(event){
      Meteor.call("pauseTick");
    }
  });
}

function register() {
  var txs = CongressInstance.addMember({ from: web3.eth.accounts[currentAccount], gas: 221468 }, function () {
    $(".loadingParent").fadeIn(1000);
    CongressInstance.stakeholderId.call(web3.eth.accounts[currentAccount], { from: web3.eth.accounts[currentAccount] }, function (err, res) {
      var s_Id = res.c[0];
      console.log(s_Id);
      PlayerSettingInstance.initGameData(s_Id, name, character, { from: web3.eth.accounts[currentAccount], gas: 2201468 }, function () {
        usingPropertyInstance.getPropertiesLength.call({ from: web3.eth.accounts[currentAccount] }, function (err, res) {
          var length = res.c[0];
          CongressInstance.setPropertyIndex(s_Id, length, { from: web3.eth.accounts[currentAccount], gas: 2201468 }, function () {
            usingPropertyInstance.getPropertyTypeLength.call({ from: web3.eth.accounts[currentAccount] }, function (err, res) {
              var Typelength = res.c[0];
              console.log(Typelength)
              usingPropertyInstance.updatePropertyTypeRating(Typelength, 0, "new", { from: web3.eth.accounts[currentAccount], gas: 2514068 }, function () {
                //create user's property at first time 4/30 kokokon
                for (i = 0; i < Typelength; i++) {
                  usingPropertyInstance.initUserProperty(i, { from: web3.eth.accounts[currentAccount], gas: 2201468 }, function (err) {
                    if (err) {
                      console.log(err);
                    }
                  });
                }
                if (character == "Guard") {
                  usingPropertyInstance.updatePropertyCount_Sudo((length + 30), 1, 0, { from: web3.eth.accounts[currentAccount], gas: 2514068 }, function (err) {
                    if (err) {
                      console.log(err);
                    }
                  });
                }

                GameCoreInstance.pushMissionAccountStatus({ from: web3.eth.accounts[currentAccount], gas: 2201468 }, function () {
                  //console.log(name, threshold, fund, rate, character);
                  var unlockCropId = Math.floor(Session.get("cropsPerLvl") * Math.random());
                  usingPropertyInstance.addUserPropertyType(s_Id, unlockCropId, { from: web3.eth.accounts[currentAccount], gas: 2201468 }, function () {
                    $(".loadingParent").fadeOut(1000);
                    Router.go('game');
                  });
                });
              });
            });
          });
        });
      });
    });

  });
}

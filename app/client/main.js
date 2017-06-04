import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';

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
var loginClicked = false;

Template.index.created = function() {
  if (Meteor.userId() != null){
    Session.set("loggedIn", true);
  }else{
    Session.set("loggedIn", false);
  }
}

Template.index.rendered = function() {
    if(!this._rendered && !renderChecked) {
      console.log('Template render complete');
      //$('#fullpage').fullpage();
      renderChecked = true;

      // MainActivityInstance.matchSuccess().watch(function(error, result){
      //   if (!error)
      //     console.log(result.args);
      // });

      // MainActivityInstance.test().watch(function(error, result2){
      //   if (!error)
      //     console.log(result2.args);
      // });
    }
}

////////////////////
//                //
//     Utility    //
//     Function   //
//                //
////////////////////

var validateEmail = function(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

var hex2a = function(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

var loading = function(on){
    var opacity;
    if (on){
        $(".loadingParent").css("display", "flex");
        $(".loadingParent").css("opacity", 0.8);
    }else{
        $(".loadingParent").css("opacity", 0);
        setTimeout(function(){
            $(".loadingParent").css("display", "none");
        }, 1000);

    }


}

////////////////////
//                //
//     Helpers    //
//                //
////////////////////

if (Meteor.isClient) {

  Template.header.helpers({
      loggedIn: function(){
        return Session.get("loggedIn");
      },
  });

  Template.index.helpers({
      loggin: function(){
        return Session.get("loggin");
      },
      currentAddress: function(){

        return Session.get("account");
      },
      currentAccount: function(){
        var Id = CongressInstance.stakeholderId.call(web3.eth.accounts[currentAccount], {from:web3.eth.accounts[currentAccount]}).c[0];
        var data = CongressInstance.getStakeholder.call(Id, {from:web3.eth.accounts[currentAccount]});
        return hex2a(data[0]);
      }

  });


  ////////////////////
  //                //
  //     Event      //
  //                //
  ////////////////////

  Template.header.events({
    'click .loginHref':function(){
        var isLogin = Session.get("loggin");
        Session.set("loggin", !isLogin);
    },
    'click .logout':function(){
        Meteor.logout();
        Session.set("loggedIn", false);
    }
  })

  Template.loginPanel.events({
    "click #login": async function(event){
      event.preventDefault();
      var email = $('[name=login_email]').val();
      var password = $('[name=login_password]').val();
      if (email.trim() == ""){
          sweetAlert("Oops...", "Please enter your email !", "error");
          return;
      }else if (password == null){
          sweetAlert("Oops...", "Please enter your password !", "error");
          return;
      }

      loading(1);
      console.log(email);
      console.log(password)

      Meteor.loginWithPassword(email, password, function(err, res){
        loading(0);
        var userId = Meteor.userId();
        var info = Meteor.users.findOne({_id:userId});
        if(err){
          console.log(err);
          sweetAlert("Oops...", err.reason, "error");
          Session.set("data", err.reason);
        }else if (!Meteor.user().emails[0].verified){
          sweetAlert("You haven't verified your email!", "Please go check your mailbox", "error");
        }else{
          Session.set("address", info.profile.address);
          Session.set("private", info.profile.private);
          Session.set('loggedIn', true);

          swal({
            title: "You are now logged in!",
            text: "Your address is "+info.profile.address,
            type: "success",
            showCancelButton: false
          },
          function(){
            Router.go('/game');
          });

        }
      });
      //register();


    },
    'click .forget-password':async function(){
        let email = this.refs.email.value;
        try{
          var res = await Accounts.forgotPassword({email: email});
        }catch(e){
          sweetAlert("Oops...", e,reason, "error");
          return;
        }
        sweetAlert("Please check your email!", "We've just sent an e-mail to reset your password!", "success");

    }
  });

  Template.index.events({
    'click #arrow-down': function (e) {
        e.preventDefault();
        var height = window.innerHeight
          || document.documentElement.clientHeight
          || document.body.clientHeight;
          scrollDuration = 1000;
        $(window).scrollTo(height, scrollDuration);
    },
    'click .chooseCharacters':function (event, instance){
        document.getElementById("guard").setAttribute("class", "btn btn-default chooseCharacters");
        document.getElementById("thief").setAttribute("class", "btn btn-default chooseCharacters");
        event.target.className = "btn btn-info chooseCharacters";
        character = event.target.value;
    },
    'submit form': async function (event){
        event.preventDefault();

        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        if (email.trim() == ""){
            sweetAlert("Oops...", "Please enter your username !", "error");
            return;
        }else if (password.trim() == ""){
            sweetAlert("Oops...", "Please enter your password !", "error");
            return;
        }else if (typeof character == 'undefined'){
            sweetAlert("Oops...", "Please choose your character !", "error");
            return;
        }

        if (!validateEmail(email)){
          sweetAlert("Oops...", "Please enter a valid email !", "error");
          return;
        }
        if (password.length < 6){
          sweetAlert("Oops...", "Password must be at least 6 characters long !", "error");
          return;
        }

        Meteor.logout();
        loading(1);
        var res = await callPromise('register', email, password, character);
        Meteor.loginWithPassword(
            { 'email': email},
            password
        );

        if (res.type == "error"){
          sweetAlert("Oops...", res.result, "error");
          Session.set("loggedIn", false);
          loading(0);
          return;
        }

        var res = await callPromise('sendVerificationLink');

        if (res.type == "success"){
          sweetAlert("Register Complete :)", "We've sent a verification email to "+email, "success");
          Session.set("loggedIn", true);
          //Router.go("game");
        }else{
          sweetAlert("Oops...", res.result, "error");
        }

        loading(0);

        //register();

    },
    'click .forget-password':async function(){
        let email = this.refs.email.value;
        try{
          var res = await Accounts.forgotPassword({email: email});
        }catch(e){
          sweetAlert("Oops...", e,reason, "error");
          return;
        }
        sweetAlert("Please check your email!", "We've just sent an e-mail to reset your password!", "success");

    }
  });
}





async function register(){
    var txs = await callPromise('callContract', 'Congress', 'addMember', []);
    loading(1);
    var res = await callPromise('callContract', 'Congress', 'stakeholderId', [Session.get("addr")]);
    if(res.type == "success"){
        var s_Id = res.result.c[0];
        console.log(s_Id);
    }
    else{
        console.log("register fail: get Id");
        return;
    }
    await callPromise('callContract', 'PlayerSetting', 'initGameData', [s_Id, name, character]);
    var res = await callPromise('callContract', 'usingProperty', 'getPropertiesLength', []);
    if(res.type == "success"){
        var length = res.result.c[0];
    }
    else{
        console.log("register fail : get property length");
        return;
    }
    await callPromise('callContract', 'Congress', 'setPropertyIndex', [s_Id, length]);
    var res = await callPromise('callContract', 'usingProperty', 'getPropertyTypeLength', []);
    if(res.type == "success"){
        var Typelength = res.result.c[0];
    }
    else{
        console.log("register fail : get propertyType length");
        return;
    }
    await callPromise('callContract', 'usingProperty', 'updatePropertyTypeRating', [Typelength, 0, "new"]);
    for(i = 0; i < Typelength; i++){
        await callPromise('callContract', 'usingProperty', 'initUserProperty', [i]);
    }
    if (character == "Guard"){
        await callPromise('callContract', 'usingProperty', 'updatePropertyCount_Sudo', [(length + 30), 1, 0]);
    }
    await callPromise('callContract', 'GameCore', 'pushMissionAccountStatus', []);
    var unlockCropId = Math.floor(Session.get("cropsPerLvl")*Math.random());
    await callPromise('callContract', 'usingProperty', 'addUserPropertyType', [s_Id, unlockCropId]);
    loading(0);
    Router.go('game');
  //var txs = CongressInstance.addMember({from:web3.eth.accounts[currentAccount], gas:221468}, function(){
  //  $(".loadingParent").fadeIn(1000);
  //  CongressInstance.stakeholderId.call(web3.eth.accounts[currentAccount], { from:web3.eth.accounts[currentAccount]},function(err, res){
  //    var s_Id = res.c[0];
  //    console.log(s_Id);
  //    PlayerSettingInstance.initGameData(s_Id, name, character, {from:web3.eth.accounts[currentAccount], gas:2201468}, function(){
  //      usingPropertyInstance.getPropertiesLength.call({from:web3.eth.accounts[currentAccount]}, function(err, res){
  //        var length = res.c[0];
  //        CongressInstance.setPropertyIndex(s_Id, length, {from:web3.eth.accounts[currentAccount], gas:2201468}, function(){
  //          usingPropertyInstance.getPropertyTypeLength.call({from:web3.eth.accounts[currentAccount]}, function(err, res){
  //            var Typelength = res.c[0];
  //            console.log(Typelength)
  //            usingPropertyInstance.updatePropertyTypeRating(Typelength, 0, "new", {from:web3.eth.accounts[currentAccount], gas:2514068}, function(){
  //              //create user's property at first time 4/30 kokokon
  //              for(i = 0; i < Typelength; i++){
  //                  usingPropertyInstance.initUserProperty(i, {from:web3.eth.accounts[currentAccount], gas:2201468}, function(err){
  //                    if (err){
  //                      console.log(err);
  //                    }
  //                  });
  //              }
  //              if (character == "Guard"){
  //                  usingPropertyInstance.updatePropertyCount_Sudo((length + 30), 1, 0, {from:web3.eth.accounts[currentAccount], gas:2514068}, function(err){
  //                    if (err){
  //                      console.log(err);
  //                    }
  //                  });
  //              }

  //              GameCoreInstance.pushMissionAccountStatus({from:web3.eth.accounts[currentAccount], gas:2201468}, function(){
  //                //console.log(name, threshold, fund, rate, character);
  //                var unlockCropId = Math.floor(Session.get("cropsPerLvl")*Math.random());
  //                usingPropertyInstance.addUserPropertyType(s_Id, unlockCropId, {from:web3.eth.accounts[currentAccount], gas:2201468}, function(){
  //                  $(".loadingParent").fadeOut(1000);
  //                  Router.go('game');
  //                });
  //              });
  //            });
  //          });
  //        });
  //      });
  //    });
  //  });

  //});
}

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



var hex2a = function(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

var loading = function(on){
    var opacity;
    $(".cropObject").css("display", "none");
    if (on){
        $(".loading").css("display", "flex");
        $(".loading").css("opacity", 0.7);
    }else{
        setTimeout(function(){
            $(".loading").css("opacity", 0);
            setTimeout(function(){
                $(".loading").css("display", "none");
            }, 1000);
        },1000);

    }


}

var validateEmail = function(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

////////////////////
//                //
//     Helpers    //
//                //
////////////////////

if (Meteor.isClient) {
  var matchResult = new Meteor.Collection(null);

  Template.index.helpers({

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
    'click #next': function (event){

        event.preventDefault();
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        if (email.trim() == ""){
            sweetAlert("Oops...", "Please enter your email !", "error");
            return;
        }else if (typeof character == 'undefined'){
            sweetAlert("Oops...", "Please choose your character !", "error");
            return;
        }else if (password == null){
            sweetAlert("Oops...", "Please enter your password !", "error");
            return;
        }

        if (!validateEmail(email)){
          sweetAlert("Oops...", "Please enter a valid email !", "error");
          return;
        }

        $(".loadingParent").fadeIn(1000);


        Meteor.call('register', email, password, character, function(err, res){
          $(".loadingParent").fadeOut(100);

          if(err){
            console.log(err);
            sweetAlert("Oops...", err.reason, "error");
            Session.set("data", err.reason);
          }else{
            Session.set("data", res);
            sweetAlert("Register Complete :)", "Your address is "+res, "success");
            Router.go("game");
          }
        });
        //register();

    },
    'click #login': function (event){

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

        $(".loadingParent").fadeIn(1000);
        console.log(email);
        console.log(password)

        Meteor.loginWithPassword(email, password, function(err, res){
          $(".loadingParent").fadeOut(100);
          console.log(Meteor.user())
          if(err){
            console.log(err);
            sweetAlert("Oops...", err.reason, "error");
            Session.set("data", err.reason);
          }else{
            console.log(res);
            Session.set("addr", res);
            sweetAlert("You are now logged in!", "Your address is "+res, "success");
            //Router.go("game");
          }
        });
        //register();

    },
    'click #registered': function (event){
        $(".flipper").addClass("flipperClicked");

    },
    'click #register': function (event){
        $(".flipper").removeClass("flipperClicked");

    },
    'click .sendMail':function(){
        Meteor.call('sendMail', Meteor.userId(), function(err, res){

          if(err){
            console.log(err);

          }else{
            console.log("sent");
          }
        });

    }
  });
}





function register(){
  var txs = CongressInstance.addMember({from:web3.eth.accounts[currentAccount], gas:221468}, function(){
    $(".loadingParent").fadeIn(1000);
    CongressInstance.stakeholderId.call(web3.eth.accounts[currentAccount], { from:web3.eth.accounts[currentAccount]},function(err, res){
      var s_Id = res.c[0];
      console.log(s_Id);
      MainActivityInstance.initGameData(s_Id, name, character, {from:web3.eth.accounts[currentAccount], gas:2201468}, function(){
        usingPropertyInstance.getPropertiesLength.call({from:web3.eth.accounts[currentAccount]}, function(err, res){
          var length = res.c[0];
          CongressInstance.setPropertyIndex(s_Id, length, {from:web3.eth.accounts[currentAccount], gas:2201468}, function(){
            usingPropertyInstance.getPropertyTypeLength.call({from:web3.eth.accounts[currentAccount]}, function(err, res){
              var Typelength = res.c[0];
              console.log(Typelength)
              usingPropertyInstance.updatePropertyTypeRating(Typelength, 0, "new", {from:web3.eth.accounts[currentAccount], gas:2514068}, function(){
                //create user's property at first time 4/30 kokokon
                for(i = 0; i < Typelength; i++){
                    usingPropertyInstance.initUserProperty(i, {from:web3.eth.accounts[currentAccount], gas:2201468}, function(err){
                      if (err){
                        console.log(err);
                      }
                    });
                }
                if (character == "Guard"){
                    usingPropertyInstance.updatePropertyCount_Sudo((length + 30), 1, 0, {from:web3.eth.accounts[currentAccount], gas:2514068}, function(err){
                      if (err){
                        console.log(err);
                      }
                    });
                }

                GameCoreInstance.pushMissionAccountStatus({from:web3.eth.accounts[currentAccount], gas:2201468}, function(){
                  //console.log(name, threshold, fund, rate, character);
                  var unlockCropId = Math.floor(Session.get("cropsPerLvl")*Math.random());
                  usingPropertyInstance.addUserPropertyType(s_Id, unlockCropId, {from:web3.eth.accounts[currentAccount], gas:2201468}, function(){
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

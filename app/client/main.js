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
    'keydown .s_Name':function(event){
        var ew = event.which;
        console.log(ew);
        if (ew == 16 || (ew <= 40 && ew >= 37)){
            return true;
        }
        if((65 <= ew && ew <= 90) || (97 <= ew && ew <= 122) || ew == 189){
            if (userNameCounter >= 10){
              sweetAlert("Oops...", "Length of username must not exceed a number of 10", "error");
              return true;
            }
            userNameCounter++;
            return true;
        }else if (ew == 8){
            console.log(userNameCounter)
            if (userNameCounter >0){
              userNameCounter--;
            }
            return true;
        }else{
            sweetAlert("Oops...", "Only english characters are accepted", "error");
            return false;
        }

    },
    'click #next': function (event){
        event.preventDefault();
        var name = $(".s_Name").val().toString();

        if (name.trim() == ""){
            sweetAlert("Oops...", "Please enter your username !", "error");
        }else if (typeof character == 'undefined'){
            sweetAlert("Oops...", "Please choose your character !", "error");

        }else if (account == null){
            sweetAlert("Oops...", "Make sure your Ethereum client is configured correctly.", "error");

        }
        //alert(web3.eth.accounts[currentAccount]);
        var txs = CongressInstance.addMember({from:web3.eth.accounts[currentAccount], gas:221468}, function(){
          $(".loadingParent").fadeIn(1000);
          var s_Id = CongressInstance.stakeholderId.call(web3.eth.accounts[currentAccount], { from:web3.eth.accounts[currentAccount]});
          var txs = MainActivityInstance.initGameData(s_Id, name, character, {from:web3.eth.accounts[currentAccount], gas:2201468}, function(){
            var length = usingPropertyInstance.getPropertiesLength.call({from:web3.eth.accounts[currentAccount]}).c[0];
            var txs = CongressInstance.setPropertyIndex(s_Id, length, {from:web3.eth.accounts[currentAccount], gas:2201468}, function(){
              var Typelength = usingPropertyInstance.getPropertyTypeLength.call({from:web3.eth.accounts[currentAccount]}).c[0];
              var tx = usingPropertyInstance.updatePropertyTypeRating(Typelength, 0, "new", {from:web3.eth.accounts[currentAccount], gas:2514068}, function(){
                //create user's property at first time 4/30 kokokon
                for(i = 0; i < Typelength; i++){
                    usingPropertyInstance.initUserProperty(i, {from:web3.eth.accounts[currentAccount], gas:2201468});
                }
                if (character == "Guard"){
                    usingPropertyInstance.updatePropertyCount_Sudo((length + 30), 1, 0, {from:web3.eth.accounts[currentAccount], gas:2514068});
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
            //console.log(txs);
          });
        });
    },
  });
}

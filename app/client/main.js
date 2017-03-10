import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

////////////////////
//                //
//     Init       //
//                //
////////////////////

var stakeholderLength;
var currentAccount = 0, ownerAccount = 0;

Template.init.rendered = function() {
    if(!this._rendered) {
      this._rendered = true;
      console.log('Template render complete');

      var height = window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight;
      $(window).scroll(function(){
          if (window.pageYOffset >= height){
              $(".indexHeader").addClass("fixed");
          }else{
              $(".indexHeader").removeClass("fixed");
          }

      });

      MainActivityInstance.matchSuccess().watch(function(error, result){
        if (!error)
          console.log(result.args);
      });

      MainActivityInstance.test().watch(function(error, result2){
        if (!error)
          alert(result2.args);
      });

      usingPropertyInstance.propertyUpdated().watch(function(error, result2){
        if (!error)
          alert("HHHH"+result2.args);
      });

      usingPropertyInstance.propertyAdded().watch(function(error, result2){
        if (!error)
          alert("ADDDDDD");
      });
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

////////////////////
//                //
//     Helpers    //
//                //
////////////////////

if (Meteor.isClient) {
  Template.updateData.helpers({
    properties: function(){
      var propertiesData = [];
      var propertyLength = usingPropertyInstance.getPropertiesLength.call({from:web3.eth.accounts[currentAccount]}).c[0];
      for (var i = 0 ; i < propertyLength; i++){
        var data = usingPropertyInstance.getProperty.call(i, {from:web3.eth.accounts[currentAccount]});

        var ratingLength = usingPropertyInstance.getPropertyRatingLength.call(0, {from:web3.eth.accounts[currentAccount]}).c[0];
        console.log(ratingLength);
        var Id = CongressInstance.stakeholderId.call(web3.eth.accounts[currentAccount], {from:web3.eth.accounts[currentAccount]}).c[0];
        var currentRating = usingPropertyInstance.getPropertyRating.call(i, Id, {from:web3.eth.accounts[currentAccount]}).c[0];


        propertiesData.push({
          "name": hex2a(data[0]),
          "count": data[2],
          "unit": hex2a(data[3]),
          "minUnit" :data[4],
          "owner" :data[5],
          "extraData" : hex2a(data[6]),
          'currentRating' : currentRating,
          'ratingId' : 'property'+i
        });
      }
      return propertiesData;
    }
  });

  Template.switchStakeholder.helpers({

    stakeholders: function(){
      var stakeholdersData = [];
      var stakeholderLength = CongressInstance.getStakeholdersLength.call({from:web3.eth.accounts[currentAccount]}).c[0];
      for (var i = 0 ; i < stakeholderLength; i++){
        var data = CongressInstance.getStakeholder.call(i, {from:web3.eth.accounts[currentAccount]});
        //console.log(data);
        stakeholdersData.push({
          "name": hex2a(data[0]),
          "threshold": data[1],
          "fund": data[2],
          "rate" :data[3],
          "address" :data[4],
          "since" : data[5],
          "character": hex2a(data[6]),
          "id": i
        });
      }


      return stakeholdersData;

    },
    web3Accounts:function(){
      var web3AccountsData = [];

      for (var j = 0; j < web3.eth.accounts.length ; j++){
        web3AccountsData.push({
          "id": j,
          "address" : web3.eth.accounts[j]
        });
      }
      return web3AccountsData;
    }
  });

  Template.manage.helpers({

    stakeholders: function(){
      var stakeholdersData = [];
      var stakeholderLength = CongressInstance.getStakeholdersLength.call({from:web3.eth.accounts[currentAccount]}).c[0];
      for (var i = 0 ; i < stakeholderLength; i++){
        var data = CongressInstance.getStakeholder.call(i, {from:web3.eth.accounts[currentAccount]});
        //console.log(data);
        stakeholdersData.push({
          "name": hex2a(data[0]),
          "threshold": data[1],
          "fund": data[2],
          "rate" :data[3],
          "address" :data[4],
          "since" : data[5],
          "character": hex2a(data[6])
        });
      }
      return stakeholdersData;

    },
    properties: function(){
      var propertiesData = [];
      var propertyLength = usingPropertyInstance.getPropertiesLength.call({from:web3.eth.accounts[currentAccount]}).c[0];
      for (var i = 0 ; i < propertyLength; i++){
        var data = usingPropertyInstance.getProperty.call(i, {from:web3.eth.accounts[currentAccount]});
        //console.log(data);
        propertiesData.push({
          "name": hex2a(data[0]),
          "count": data[2],
          "unit": hex2a(data[3]),
          "minUnit" :data[4],
          "owner" :data[5],
          "extraData" : hex2a(data[6]),
        });
      }
      return propertiesData;
    }
  });


  Template.index.helpers({

      currentAddress: function(){
        return web3.eth.accounts[currentAccount];
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

  Template.switchStakeholder.events({
    'click .stakeholderSwitch': function (event){
        currentAccount = event.target.id;
        alert("You've switched to Account"+currentAccount);
    },
  })

  Template.updateData.events({
    'click #updateRating': function (event){
        var propertyLength = usingPropertyInstance.getPropertiesLength.call({from:web3.eth.accounts[currentAccount]}).c[0];
        for (var i = 0 ; i< propertyLength ; i++){
          var rating = $("#property"+i);
          var txs = usingPropertyInstance.updatePropertiesRating(i, rating, "update", {from:web3.eth.accounts[currentAccount], gas:800000});
          console.log(txs);
        }
    },
  })

  Template.manage.events({
    'click #matchMake': function (event){
        console.log("=== Start Match Making ===");
        var txs = MainActivityInstance.startMatching({from:web3.eth.accounts[ownerAccount], gas:4500000});
        console.log(txs);
    },
  })
  Template.index.events({
    'click #test': function (e) {
        e.preventDefault();
        var value = usingPropertyInstance.returnSHA.call("hi", {from:web3.eth.accounts[currentAccount]});
        console.log("hi1"+value);

        var value = usingPropertyInstance.returnSHA.call("hi", {from:web3.eth.accounts[currentAccount]});
        console.log("hi2"+value);
    },
    'click #arrow-down': function (e) {
        e.preventDefault();
        var height = window.innerHeight
          || document.documentElement.clientHeight
          || document.body.clientHeight;
          scrollDuration = 1000;
        $(window).scrollTo(height, scrollDuration);
    },
    'click .chooseCharacters':function (event, instance){
        document.getElementById("seller").setAttribute("class", "btn btn-default");
        document.getElementById("buyer").setAttribute("class", "btn btn-default");
        event.target.className = "btn btn-info";
        character = event.target.value;
    },
    'click #previous': function (event){
        event.preventDefault();
        var temp = document.getElementById("flipper");
        temp.className = " flipper";
    },
    'click #submit': function (event){
        event.preventDefault();
        var name = $(".p_Name").val();
        var count = parseInt($(".p_Count").val());
        var accessStakeholders = $(".p_AccessStakeholders").val();
        var unit = $(".p_Unit").val();
        var atomicUnit = parseInt($(".p_AtomicUnit").val());
        var data = $(".p_Data").val();
        var rating = parseInt($(".p_Rating").val());
        console.log(name, count, accessStakeholders, unit, atomicUnit, data, rating);

        var txs = usingPropertyInstance.addProperty(name, count, [web3.eth.accounts[0]], unit, atomicUnit, data, rating, {from:web3.eth.accounts[currentAccount], gas:800000});
        console.log(txs);

    },
    'click #next': function (event){
        event.preventDefault();
        var name = $(".s_Name").val();
        var threshold = parseInt($(".s_Threshold").val());
        var fund = parseInt($(".s_Fund").val());
        var rate = parseInt($(".s_Rate").val());

        //alert(web3.eth.accounts[currentAccount]);

        var length = usingPropertyInstance.getPropertiesLength.call({from:web3.eth.accounts[currentAccount]}).c[0];
        console.log(length);
        for (var i = 0 ; i < length ; i++){
          var tx = usingPropertyInstance.updatePropertiesRating(i, 0, "init", {from:web3.eth.accounts[currentAccount], gas:251468});
        }

        //console.log(name, threshold, fund, rate, character);

        var txs = CongressInstance.addMember(name, threshold, fund, rate, character, {from:web3.eth.accounts[currentAccount], gas:221468});
        console.log(txs);

        document.getElementById("buyerInfo").style.display = "inline";
        document.getElementById("sellerInfo").style.display = "inline";

        if (character == "seller"){
            document.getElementById("buyerInfo").style.display = "none";
        }else{
            document.getElementById("sellerInfo").style.display = "none";
        }

        var temp = document.getElementById("flipper");
        temp.className += " flipperClicked";

    },


  });
}

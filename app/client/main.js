import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';
import './index.html';
import './game.html';

import './graph.js';
import './mainActivity.js';
import './game.js';

////////////////////
//                //
//     Init       //
//                //
////////////////////

var stakeholderLength;
var currentAccount = 1, ownerAccount = 0;
var renderChecked = false;
Template.index.rendered = function() {
    if(!this._rendered && !renderChecked) {
      console.log('Template render complete');

      $('#fullpage').fullpage();
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

////////////////////
//                //
//     Helpers    //
//                //
////////////////////

if (Meteor.isClient) {
  var matchResult = new Meteor.Collection(null);


  Template.updateData.helpers({
    properties: function(){
      var propertiesData = [];
      var propertyLength = usingPropertyInstance.getPropertiesLength.call({from:web3.eth.accounts[currentAccount]}).c[0];
      for (var i = 0 ; i < propertyLength; i++){
        var data = usingPropertyInstance.getProperty.call(i, {from:web3.eth.accounts[currentAccount]});

        var Id = CongressInstance.stakeholderId.call(web3.eth.accounts[currentAccount], {from:web3.eth.accounts[currentAccount]}).c[0];
        var currentRating = usingPropertyInstance.getPropertyRating.call(i, Id, {from:web3.eth.accounts[currentAccount]}).c[0];

        var ratingLength = usingPropertyInstance.getPropertyRatingLength.call(0, {from:web3.eth.accounts[currentAccount]}).c[0];

        var s_Id = CongressInstance.stakeholderId.call(data[5], {from:web3.eth.accounts[currentAccount]}).c[0];
        var owner = CongressInstance.getStakeholder.call(s_Id, {from:web3.eth.accounts[currentAccount]});
        owner = hex2a(owner[0]);

        console.log(ratingLength);
        propertiesData.push({
          "name": hex2a(data[0]),
          "count": data[2],
          "unit": hex2a(data[3]),
          "minUnit" :data[4],
          "owner" :owner,
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

        var s_Id = CongressInstance.stakeholderId.call(data[5], {from:web3.eth.accounts[currentAccount]}).c[0];
        var owner = CongressInstance.getStakeholder.call(s_Id, {from:web3.eth.accounts[currentAccount]});
        owner = hex2a(owner[0]);

        propertiesData.push({
          "name": hex2a(data[0]),
          "count": data[2],
          "unit": hex2a(data[3]),
          "minUnit" :data[4],
          "owner" :owner,
          "extraData" : hex2a(data[6]),
        });
      }
      return propertiesData;
    },
    matchingResults: function(){
      return matchResult.find({});

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

  Template.header.helpers({

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
  Template.transaction.events({
    'click .press': function (event){
        //console.log("fff");

        console.log("=== Start Match Making ===");

        MainActivityInstance.matchSuccess().watch(function(error, result){
          if (!error){
            //var length = result.args[""].length/2;
            var length = result.args[""].length;
            console.log(length);

        }
        });

        var txs = MainActivityInstance.findOrigin({from:web3.eth.accounts[ownerAccount], gas:4500000});
        console.log(txs);


        Blaze.renderWithData(Template.testtt,{},$('.hihi')[0]);
        updateEmpowermentData('calculate', '');
        // graph = new drawGraph(".transaction");

    },
  })

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
          var rating = $("#property"+i).val();
          //console.log(rating);
          var txs = usingPropertyInstance.updatePropertiesRating(i, rating, "update", {from:web3.eth.accounts[currentAccount], gas:800000});
          console.log(txs);
        }
    },
  })


  Template.manage.events({
    'click #matchMake': function (event){
        console.log("=== Start Match Making ===");

        MainActivityInstance.matchSuccess().watch(function(error, result){
          if (!error){
            //var length = result.args[""].length/2;
            var length = result.args[""].length;
            for (var i = 0 ; i < length; i++){
              var _id = result.args[""][i].c[0];
              var data = usingPropertyInstance.getProperty.call(_id, {from:web3.eth.accounts[currentAccount]});

              var currentRating = usingPropertyInstance.getPartialProperty.call(_id, {from:web3.eth.accounts[currentAccount]})[1].c[0];

              console.log(currentRating);
              var s_Id = CongressInstance.stakeholderId.call(data[5], {from:web3.eth.accounts[currentAccount]}).c[0];
              var _owner = CongressInstance.getStakeholder.call(s_Id, {from:web3.eth.accounts[currentAccount]});
              _owner = hex2a(_owner[0]);

              matchResult.insert({
                id: _id,
                name: hex2a(data[0]),
                owner: _owner,
                importance : currentRating
              });

          }
          var height = window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight;
          $(window).scrollTo(height, 1500);
        }
        });

        var txs = MainActivityInstance.findOrigin({from:web3.eth.accounts[ownerAccount], gas:4500000});
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
        document.getElementById("guard").setAttribute("class", "btn btn-default");
        document.getElementById("thief").setAttribute("class", "btn btn-default");
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
        var txs = CongressInstance.addMember(threshold, fund, rate, {from:web3.eth.accounts[currentAccount], gas:221468});
        var s_Id = CongressInstance.stakeholderId.call(web3.eth.accounts[currentAccount], { from:web3.eth.accounts[currentAccount]});
        var txs = MainActivityInstance.initGameData(s_Id, name, character, {from:web3.eth.accounts[currentAccount], gas:2201468});

        //console.log(txs);

        var length = usingPropertyInstance.getPropertyTypeLength.call({from:web3.eth.accounts[currentAccount]}).c[0];
        console.log(length);
        var tx = usingPropertyInstance.updatePropertyTypeRating(length, 0, "new", {from:web3.eth.accounts[currentAccount], gas:251468});

        //console.log(name, threshold, fund, rate, character);

        Router.go('game');
/*
        document.getElementById("buyerInfo").style.display = "inline";
        document.getElementById("sellerInfo").style.display = "inline";

        if (character == "seller"){
            document.getElementById("buyerInfo").style.display = "none";
        }else{
            document.getElementById("sellerInfo").style.display = "none";
        }

        var temp = document.getElementById("flipper");
        temp.className += " flipperClicked";
*/
    },


  });
}

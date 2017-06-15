// index

var userData;


Router.route('/', function () {
    this.render('index');
});


Router.route('/manage', function () {
  this.render('manage');
});

Router.route('/update', function () {
  this.render('updateData');
});

Router.route('/switch', function () {
  this.render('switchStakeholder');
});

Router.route('/aboutus', function () {
  this.render('aboutUs');
});

Router.route('/transaction', function () {
  this.render('transaction');
});


//game
//
Router.route('/game', function () {
  this.render('gameIndex');
});

var registered = false;

Router.route( '/verify-email/:token', async function(){
    if (registered) {
        return;
    }
    registered = true;
    console.log(registered);
    var userObj = await callPromise("getUser");
    //if (!userObj.email[0].verified) {
        //var res = await Meteor.call("API_Register");
        userData = { name: userObj.email[0].address, address: userObj.profile.address, character: userObj.profile.character };
        await register();
    //}
    try {
        var res = await Accounts.verifyEmail(this.params.token);
    } catch (e) {
        swal({
            title: "Oops...",
            text: e.reason,
            type: "warning",
            showCancelButton: false
        },
            function () {
                Router.go('/');
            });

    }

  swal({
      title: "Email Verified !",
      text: "You will now redirected to game page",
      type: "success",
      showCancelButton: false
  },
  function(){
      Router.go('/game');
  });

});

async function register(){
    var txs = await callPromise('callContract', 'Congress', 'addMember', [userData.address]);  
    Session.set('cropsPerLvl', 3);
    await callPromise('callContract', 'Congress', 'initPlayerData', [userData.name, userData.character]);
    await callPromise('callContract', 'GameProperty', 'addUserLandConfiguration', [0, userData.address, 3]);
    var res = await callPromise('callContract', 'usingProperty', 'getPropertiesLength', []);
    if (res.type == "success") {
        var length = res.result.results[0];
    }
    else {
        console.log("register fail : get property length");
        return;
    }
    await callPromise('callContract', 'Congress', 'setPropertyIndex', [0, userData.address, length]);
    var res = await callPromise('callContract', 'usingProperty', 'getPropertyTypeLength', []);
    if (res.type == "success") {
        var Typelength = res.result.results[0];
    }
    else {
        console.log("register fail : get propertyType length");
        return;
    }
    await callPromise('callContract', 'usingProperty', 'updatePropertyTypeRating', [Typelength, 0, "new"]);
    for (i = 0; i < Typelength; i++) {
        await callPromise('callContract', 'usingProperty', 'initUserProperty', [i]);
    }
    if (userData.character == "Guard") {
        await callPromise('callContract', 'usingProperty', 'updatePropertyCount_Sudo', [(length + 30), 1, 0]);
    }
    await callPromise('callContract', 'GameCore', 'pushMissionAccountStatus', []);
    var unlockCropId = Math.floor(Session.get("cropsPerLvl") * Math.random());
    await callPromise('callContract', 'usingProperty', 'addUserPropertyType', [0, userData.address, unlockCropId]);


    
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

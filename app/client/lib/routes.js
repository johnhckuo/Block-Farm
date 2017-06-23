// index

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

Router.route('/monitor', function () {
  this.render('monitor');
});



var registered = false;

Router.route( '/verify-email/:token', async function(){
    if (registered) {
        return;
    }
    registered = true;
    console.log(registered);
    var userObj = await callPromise("getUser");
    if (!userObj.email[0].verified) {
        var res = await callPromise("API_Register");
        userObj = await callPromise("getUser");
        userData = { name: userObj.email[0].address, address: userObj.profile.address, character: userObj.profile.character };
              
        //await register();
    }
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
    Session.set("loggedIn", true);
    Session.set("address", userObj.profile.address);


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
    console.log(txs);
    res = await callPromise('callContract', 'Congress', 'getStakeholderId', [userData.address]);
    if (res.type == "success") {
        s_Id = res.result.results[0];
        console.log(res);
    }
    else {
        console.log("register fail: get Id");
        return;
    }

    Session.set('cropsPerLvl', 3);
    await callPromise('callContract', 'Congress', 'initPlayerData', [userData.name, userData.character]);
    await callPromise('callContract', 'GameProperty', 'addUserLandConfiguration', [userData.address, 3]);
    var res = await callPromise('callContract', 'usingProperty', 'getPropertiesLength', []);
    if (res.type == "success") {
        var length = res.result.results[0];
    }
    else {
        console.log("register fail : get property length");
        return;
    }
    await callPromise('callContract', 'Congress', 'setPropertyIndex', [userData.address, length]);
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
    await callPromise('callContract', 'usingProperty', 'addUserPropertyType', [userData.address, unlockCropId]);

}

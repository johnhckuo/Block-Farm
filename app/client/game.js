import { Tracker } from 'meteor/tracker';
import { Session } from 'meteor/session';


var landSize = 3;
var blockSize = 150;
var landSrc = "/img/game/land.svg";

var prefix = "/img/game/";
var postfix = ".svg";

var currentCropId;
var plantMode = false;
var currentLandId;
var placeMode = false;
var currentCropLand;
var audio;

var s_Id;


var _dep = new Tracker.Dependency;
var cursorX;
var cursorY;

var panelCounter = 2, panelCount = 3;

var cropList = [];
var harvestCropList = [];
var landList = [];

var staminaList = {crop:5,steal:5};

var currentUser = {};


var userLandConfiguration = [];

var showThief = false;

var otherUserLandConfiguration = [];

var otherUser =
  {
    id:0,
    address:"0x0101010101",

    name: "bill",
    exp: 0,
    totalExp: 0,
    type: "Thief",
    landSize: 5,
    level:0,
    stamina: 100,
    guardId: null,
    thiefId: null

  };

var cropTypeList = [];

var landTypeList = [];


///////////////////////////
//  prototype functions  //
///////////////////////////

Date.prototype.addTime = function(days, hours, minutes, seconds) {
    //var dat = new Date(this.valueOf());
    var dat = new Date();

    dat.setDate(dat.getDate() + days);
    dat.setHours(dat.getHours() + hours);
    dat.setMinutes(dat.getMinutes() + minutes);
    dat.setSeconds(dat.getSeconds() + seconds);

    return dat;
}

/////////////////
//  onCreated  //
/////////////////

Template.gameIndex.created = function() {
    currentAccount = Session.get('currentAccount');




    s_Id = CongressInstance.stakeholderId.call(web3.eth.accounts[currentAccount], { from:web3.eth.accounts[currentAccount]});
    s_Id = s_Id.c[0];
    getUserData(s_Id);
    getLandConfiguration(s_Id);
    loadCropList(s_Id);

    fetchGameInitConfig();
    console.log(cropTypeList);
    // Tracker.autorun(() => {
    //   Meteor.subscribe('characterList', { userName: Session.get('userName') });
    // });



    // Template.registerHelper('characterList',function(input){
    //     return Session.get("userName");
    // });

    loading(1);

    audio = new Audio('/music/background_music.mp3');
    //audio.play();

    // for (var i = 0 ; i < currentUser.landSize*currentUser.landSize ; i++){
    //     userLandConfiguration.push(
    //       {
    //           id: i,
    //           land: null,
    //           crop:null
    //       }
    //     );
    // }
    //
    for (var i = 0 ; i < otherUser.landSize*otherUser.landSize; i++){
        otherUserLandConfiguration.push(
          {
              id: i,
              land: Math.floor(Math.random() * landTypeList.length),
              crop: Math.floor(Math.random() * cropTypeList.length)


          }
        );
    }



}

//////////////////
//  onRendered  //
//////////////////

Template.gameIndex.rendered = function() {
    if(!this._rendered) {

        updateUserExp(0);
        updateStaminaBar(0);

        initCropLand(currentAccount);

        Session.set('userName', currentUser.name);
        Session.set('userExp', currentUser.exp);
        Session.set('userSta', currentUser.sta);
        Session.set('userCharacter', currentUser.type);

        //farmObjectLoader();

        setInterval(checkMission, 1000);
        setInterval(cropSummaryUpdate, 1000);
        setInterval(updateUserStamina, 1000*60);

        //initCropLand(otherUser, otherUserLandConfiguration);
        console.log('gameArea render complete');

        loading(0);
    }
}

Template.shop.rendered = function () {
    var stakeholder_length = CongressInstance.getStakeholdersLength.call({from:web3.eth.accounts[currentAccount]});
    var select = $('<select>></select>');
    for (i = 0; i < stakeholder_length; i++) {
        var stakeholder_info = CongressInstance.getStakeholder.call(i,{from:web3.eth.accounts[currentAccount]});
        option = $('<option>', {
            value: i,
            text: hex2a(stakeholder_info[0])
        });
        select.append(option);
    }
    select.on('change', function () {
        currentAccount = $(this).val();
        set_propertyType_table();
    })
    $('.shop_header').append(select);
}


///////////////
//  Helpers  //
///////////////

var activated_account = 2;
var account_index;
property_log = [];
user_property = [];
property_database = [];
display_field = [];
//for testing
//currentAccount = activated_account;
//for testing
Template.shop.helpers({

});

Template.characterList.helpers({
    userName: function() {
      return Session.get('userName');
    },
    userExp: function() {
      return Session.get('userExp');
    },
    characterType: function() {
      return Session.get('userCharacter');
    }
});

Template.statusList.helpers({
    crops: function(){

        var cropsData = [];

        for (var i = 0 ; i < cropTypeList.length; i++){
            var data = cropTypeList[i];

            //console.log(data);
            cropsData.push({
                "name": "crop property"+data.id,
                "img": prefix+data.img[3]+postfix,
                "content": data.name
            });
        }
        return cropsData;
    },
    cropsSummary: function(){
        var cropsData = [];

        for (var i = 0 ; i < cropList.length; i++){
            if (cropList[i].name == 0){
                continue;
            }
            var data = cropList[i];

            //console.log(data);
            cropsData.push({
                "id": "currentCrop"+data.id,
                "name": data.name,
                "img": prefix+data.img+postfix,
                "timeLeft": null
            });
        }

        _dep.depend();
        return cropsData;



    },
    lands: function(){

        var landsData = [];

        for (var i = 0 ; i < landTypeList.length; i++){
            var data = landTypeList[i];

            //console.log(data);
            landsData.push({
                "name": "cropLand farmLand"+data.id,
                "img": prefix+data.img+postfix,
                "content": data.name
            });
        }
        return landsData;
    },
});


//////////////
//  Events  //
//////////////

Template.shop.events({
    'click #btn_show_property': function () {
        set_propertyType_table();
    },
    'click #btn_shop_close': function () {
        $('.property_shop').css('display', 'none');
    },
    'click #btn_shop_add':function(){
        CongressInstance.initPlayerData('John', 'Guard',  { from: web3.eth.accounts[0], gas: 2000000 });
        CongressInstance.addMember(10, 1000, 1, { from: web3.eth.accounts[0], gas: 2000000 });
        CongressInstance.initPlayerData('Bryant', 'Guard',  { from: web3.eth.accounts[1], gas: 2000000 });
        CongressInstance.addMember(10, 1000, 1, { from: web3.eth.accounts[1], gas: 2000000 });
        CongressInstance.initPlayerData('Claire', 'Thief',  { from: web3.eth.accounts[2], gas: 2000000 });
        CongressInstance.addMember(10, 1000, 1, { from: web3.eth.accounts[2], gas: 2000000 });
        CongressInstance.initPlayerData('Po-Wei', 'Thief',  { from: web3.eth.accounts[3], gas: 2000000 });
        CongressInstance.addMember(10, 1000, 1, { from: web3.eth.accounts[3], gas: 2000000 });
        CongressInstance.initPlayerData('Ping', 'Guard',  { from: web3.eth.accounts[4], gas: 2000000 });
        CongressInstance.addMember(10, 1000, 1, { from: web3.eth.accounts[4], gas: 2000000 });
        CongressInstance.initPlayerData('Chi', 'Thief',  { from: web3.eth.accounts[5], gas: 2000000 });
        CongressInstance.addMember(10, 1000, 1, { from: web3.eth.accounts[5], gas: 2000000 });
        CongressInstance.initPlayerData('Nina', 'Guard',  { from: web3.eth.accounts[6], gas: 2000000 });
        CongressInstance.addMember(10, 1000, 1, { from: web3.eth.accounts[6], gas: 2000000 });
        CongressInstance.initPlayerData('Jackie', 'Thief',  { from: web3.eth.accounts[7], gas: 2000000 });
        CongressInstance.addMember(10, 1000, 1, { from: web3.eth.accounts[7], gas: 2000000 });
        CongressInstance.initPlayerData('Charlie', 'Guard',  { from: web3.eth.accounts[8], gas: 2000000 });
        CongressInstance.addMember(10, 1000, 1, { from: web3.eth.accounts[8], gas: 2000000 });


        usingPropertyInstance.addPropertyType('Carrot', ["carrot_seed", "carrot_grow", "carrot_harvest", "carrot"], '0.0.0.10', 4, { from: web3.eth.accounts[currentAccount], gas: 2000000 });
        usingPropertyInstance.addPropertyType('Radish',["radish_seed", "radish_grow", "radish_harvest", "radish"], '0.0.0.30', 4, { from: web3.eth.accounts[currentAccount], gas: 2000000 });
        usingPropertyInstance.addPropertyType('Lettuce',["lettuce_seed", "lettucet_grow", "lettuce_harvest", "lettuce"], '0.0.10.0', 4, { from: web3.eth.accounts[currentAccount], gas: 2000000 });
        usingPropertyInstance.addPropertyType('Cauliflower', ["cauliflower_seed", "cauliflower_grow", "cauliflower_harvest", "cauliflower"], '0.0.0.10', 4, { from: web3.eth.accounts[currentAccount], gas: 2000000 });


        usingPropertyInstance.addProperty('Carrot', 4, 1, '', 0, 0, 0, { from: web3.eth.accounts[0], gas: 2000000 });
        usingPropertyInstance.addProperty('Radish', 4, 1, '', 0, 1, 0, { from: web3.eth.accounts[0], gas: 2000000 });
        usingPropertyInstance.addProperty('Lettuce', 3, 1, '', 0, 2, 0, { from: web3.eth.accounts[0], gas: 2000000 });
        usingPropertyInstance.addProperty('Cauliflower', 3, 1, '', 0, 3, 0, { from: web3.eth.accounts[0], gas: 2000000 });
        usingPropertyInstance.addProperty('Carrot', 8, 1, '', 0, 0, 0, { from: web3.eth.accounts[1], gas: 2000000 });
        usingPropertyInstance.addProperty('Radish', 5, 1, '', 0, 1, 0, { from: web3.eth.accounts[1], gas: 2000000 });
        usingPropertyInstance.addProperty('Lettuce', 9, 1, '', 0, 2, 0, { from: web3.eth.accounts[1], gas: 2000000 });
        usingPropertyInstance.addProperty('Cauliflower',10, 1, '', 0, 3, 0, { from: web3.eth.accounts[1], gas: 2000000 });
        usingPropertyInstance.addProperty('Carrot',10, 1, '', 0, 0, 0, { from: web3.eth.accounts[2], gas: 2000000 });
        usingPropertyInstance.addProperty('Radish', 9, 1, '', 0, 1, 0, { from: web3.eth.accounts[2], gas: 2000000 });
        usingPropertyInstance.addProperty('Lettuce', 7, 1, '', 0, 2, 0, { from: web3.eth.accounts[2], gas: 2000000 });
        usingPropertyInstance.addProperty('Cauliflower', 6, 1, '', 0, 3, 0, { from: web3.eth.accounts[2], gas: 2000000 });
        usingPropertyInstance.addProperty('Carrot', 14, 1, '', 0, 0, 0, { from: web3.eth.accounts[3], gas: 2000000 });
        usingPropertyInstance.addProperty('Radish', 14, 1, '', 0, 1, 0, { from: web3.eth.accounts[3], gas: 2000000 });
        usingPropertyInstance.addProperty('Lettuce', 13, 1, '', 0, 2, 0, { from: web3.eth.accounts[3], gas: 2000000 });
        usingPropertyInstance.addProperty('Cauliflower', 13, 1, '', 0, 3, 0, { from: web3.eth.accounts[3], gas: 2000000 });
        usingPropertyInstance.addProperty('Carrot', 1, 1, '', 0, 0, 0, { from: web3.eth.accounts[4], gas: 2000000 });
        usingPropertyInstance.addProperty('Radish', 2, 1, '', 0, 1, 0, { from: web3.eth.accounts[4], gas: 2000000 });
        usingPropertyInstance.addProperty('Lettuce', 3, 1, '', 0, 2, 0, { from: web3.eth.accounts[4], gas: 2000000 });
        usingPropertyInstance.addProperty('Cauliflower', 4, 1, '', 0, 3, 0, { from: web3.eth.accounts[4], gas: 2000000 });
        //var id = usingPropertyInstance.gets_id.call({ from: web3.eth.accounts[currentAccount], gas: 2000000 });
        //alert(id);
    },
    'click #btn_property_tradeable':function(){
        set_property_table();
    }
});


Template.gameIndex.events({
    'click .cropObject': function (event){
        // var left = $(event.target).position().left;
        // var top = $(event.target).position().top;
        if (currentCropId != null && plantMode){
            var _landId = currentCropLand.split("cropLand")[1];


            if (userLandConfiguration[_landId].crop != -1){
                alert("Don't plant twice !");
                return;
            }else if (userLandConfiguration[_landId].land == -1){
                alert("You need a land first !");
                return;
            }else if (currentUser.sta < staminaList["crop"]){
                alert("not enough stamina");
                return;
            }

            cropTypeList[currentCropId].count++;
            updateStaminaBar(staminaList["crop"]);

            var styles = {
                'z-index' : "2",
                'opacity': 1
            };
            $( ".cropObject" ).clone().attr("class","croppedObject croppedObject"+cropList.length).appendTo(".surfaceObject").css(styles);

            //var start = Date.now();
            var start = new Date();
            var end = new Date();

            var cropWaitingTime = cropTypeList[currentCropId].time.split(".");

            end = end.addTime(parseInt(cropWaitingTime[0]), parseInt(cropWaitingTime[1]), parseInt(cropWaitingTime[2]), parseInt(cropWaitingTime[3]));

            var _id = cropList.length;

            //userLandConfiguration[_landId].crop = cropTypeList[currentCropId].id;
            userLandConfiguration[_landId].crop = _id;
            usingPropertyInstance.updateUserLandConfiguration(s_Id, _landId, _id, 0, 'crop', {from:web3.eth.accounts[currentAccount], gas:2000000});

            usingPropertyInstance.addCropList(s_Id, cropTypeList[currentCropId].name, cropTypeList[currentCropId].img[3], start, end, parseInt(cropTypeList[currentCropId].id), 0, {from:web3.eth.accounts[currentAccount], gas:2000000});
            cropList.push({
                id: _id,
                name: cropTypeList[currentCropId].name,
                img:cropTypeList[currentCropId].img[3],
                start: start,
                end: end,
                type: cropTypeList[currentCropId].id,
                ripe: 0
            });
            //console.log(cropList);
            _dep.changed();

            console.log(userLandConfiguration);
            console.log(cropList);

        }else{
            alert("Specify Crop first");
            return;
        }



    },
    'click .farmObject': function(event){
        if (currentLandId != null && placeMode){
            var _landId = currentCropLand.split("cropLand")[1];

            if (userLandConfiguration[_landId].land != -1){
                alert("Don't plant twice !");
                return;
            }
            landTypeList[currentLandId].count++;
            currentCropLand = currentCropLand.split(" ")[1];
            $( ".farmObject" ).children().clone().appendTo("."+currentCropLand).css({opacity:1});
            $("."+currentCropLand).css({"border-style":"none"});
            var _id = landList.length;
            userLandConfiguration[_landId].land = landTypeList[currentLandId].id;
            usingPropertyInstance.updateUserLandConfiguration(s_Id, _landId, -1, landTypeList[currentLandId].id, 'land', {from:web3.eth.accounts[currentAccount], gas:2000000});

            landList.push({
                id: _id,
                name: landTypeList[currentLandId].name,
                img:landTypeList[currentLandId].img,
            });

            console.log(userLandConfiguration);
            console.log(cropList);
        }else{
            alert("Specify Land first");
            return;
        }
    },
    'click .thief': function(event){
        $(event.target).parent().css({opacity:0, transform:"translateY(50px)"});
        setTimeout(function(){
            $(event.target).parent().remove();
        },1000);


    },
    'click .croppedObject': function (event){
        // var left = $(event.target).position().left;
        // var top = $(event.target).position().top;
        var id, cropClass;
        if (event.target.className == ""){
            cropClass = $(event.target).parent().prop('className').split(" ")[1];
            id = cropClass.split("croppedObject")[1];
        }else{
            cropClass = event.target.className.split(" ")[1];
            id = cropClass.split("croppedObject")[1];

        }
        if (cropList[id].ripe){

            $(".animationImg").html("<img src = '" + prefix+ cropTypeList[cropList[id].type].img[3] + postfix +"' />");
            //var exp = cropTypeList[cropList[id].type].exp;

            var difference = elapsedTime(cropList[id].start, cropList[id].end);
            var exp = (difference/(1000*30))*20;
            updateUserExp(exp);
            $(".scoreObject").html("+" + exp +"XP");
        }else{
            alert("Patience is a virtue <3");
            return;
        }

        var landTop = $(".land").position().top;
        var landLeft = $(".land").position().left;

        var areaLeft = $(".gamingArea").position().left;

        var divHeight =$(".farmObject").height()/5;
        var divWidth = $(".farmObject").width()/4;

        var temp = $(".animationObject").clone().attr("class", "animationTemp").appendTo(".canvas");
        temp.css({display:"inline", top: cursorY-divHeight, left: cursorX-areaLeft+divWidth});
        temp.addClass("animationTempShow");

        setTimeout(function(){
            temp.css({opacity:0, transform:"translateY(0px)"});
            setTimeout(function(){
                temp.css({display: "none"});
                temp.remove();
            },1000);
        },1000);

        harvestCropList.push(cropList[id]);

        var configId;
        for (var i = 0 ; i < userLandConfiguration.length ; i++){
            if (userLandConfiguration[i].crop == id){
                userLandConfiguration[i].crop = -1;
                configId = i;
            }
        }

        usingPropertyInstance.updateUserLandConfiguration(s_Id, configId, -1, 0, 'crop', {from:web3.eth.accounts[currentAccount], gas:2000000});

        cropList[id].name = 0;
        cropList[id].img = 0;
        cropList[id].start = 0;
        cropList[id].end = 0;
        cropList[id].cropType = 0;
        cropList[id].ripe = 0;

        usingPropertyInstance.updateCropList(s_Id, id, 0, 0, 0, 0, 0, 0, {from:web3.eth.accounts[currentAccount], gas:2000000});

        //cropList.splice(id, 1);
        $("."+cropClass).remove();



    },
})


Template.crop.events({
    'click .crop button': function (event){
        var id = $(event.target).parent()[0].className.split("property")[1];

        if ($(event.target).data('pressed')){
            $(event.target).css("background", "#337ab7");
            $(event.target).css("border-color", "#337ab7");
            $(event.target).text("Specify");
            $(event.target).data('pressed', false);
            plantMode = false;
            return;
        }

        plantMode = true;

        var btns = $(".crop").find("button");

        for (var i = 0 ; i < btns.length; i++){
            if ($(btns[i]).data('pressed')){
                $(btns[i]).css("background", "#337ab7");
                $(btns[i]).css("border-color", "#337ab7");
                $(btns[i]).text("Specify");
                $(btns[i]).data('pressed', false);
            }
        }
        $(event.target).data('pressed', true);

        $(".cropObject").html("<img src = '" + prefix+ cropTypeList[id].img[0] + postfix +"' />");
        currentCropId = id;

        $(".cropObject").css("display", "inline");

        $(event.target).css("background", "gray");
        $(event.target).css("border-color", "gray");
        $(event.target).text("Done");

    },

})

Template.land.events({
    'click .cropLand button': function (event){
        var id = $(event.target).parent()[0].className.split("farmLand")[1];
        $(".farmObject").html("<img src = '" + prefix+ landTypeList[id].img + postfix +"' />");
        currentLandId = id;

        placeMode = !placeMode;
        if (placeMode){
            $(".farmObject").css("display", "inline");

            $(event.target).css("background", "gray");
            $(event.target).css("border-color", "gray");
            $(event.target).text("Done");
        }else{
            $(".farmObject").css("display", "none");

            $(event.target).css("background", "#337ab7");
            $(event.target).css("border-color", "#337ab7");
            $(event.target).text("Specify");

        }
    },

})

Template.gamingArea.events({
    'mouseenter .land div': function (event){
        if (plantMode){
            currentCropLand = event.target.className;
            var top = $(event.target)[0].getBoundingClientRect().top;
            var left = $(event.target)[0].getBoundingClientRect().left;

            var landTop = $(".land").position().top;
            var landLeft = $(".land").position().left;

            var areaLeft = $(".gamingArea").position().left;

            var divHeight =$(".cropObject").height()/5;
            var divWidth = $(".cropObject").width()/4;
            // var divHeight =0;
            // var divWidth = 0;

            var styles = {
                top: top-divHeight,
                left: left-areaLeft+divWidth,
                width:"150px",
                height:"150px",
                position:"absolute",
                opacity:0.5,
                "z-index":2
            };

            $(".cropObject").css(styles);

        }else if (placeMode){
            currentCropLand = event.target.className;
            var top = $(event.target)[0].getBoundingClientRect().top;
            var left = $(event.target)[0].getBoundingClientRect().left;

            var landTop = $(".land").position().top;
            var landLeft = $(".land").position().left;

            var areaLeft = $(".gamingArea").position().left;

            var divHeight =$(".farmObject").height()/5;
            var divWidth = $(".farmObject").width()/4;
            // var divHeight =0;
            // var divWidth = 0;

            $(".farmObject").css({top: top-divHeight, left: left-areaLeft+divWidth, width:"150px", height:"150px", position:"absolute", opacity:0.5});

        }

    },
})

Template.statusList.events({
    'click .btn-info': function (e) {

        var temp = panelCounter;
        $(".statusPanel:nth-child("+panelCounter+")").removeClass("statusPanelShow");
        $(".statusPanel:nth-child("+temp+")").css("z-index", -1);

        // setTimeout(function(){
        //   $(".statusPanel:nth-child("+temp+")").css("z-index", -1);
        // },1000);

        panelCounter = e.target.className.split("crop")[1];

        $(".statusPanel:nth-child("+panelCounter+")").css("z-index", 1);
        $(".statusPanel:nth-child("+panelCounter+")").addClass("statusPanelShow");






    },
})

Template.characterList.events({
    'click .shopOpen': function (e) {
        $(".property_shop").css("display", "inline");

    },

    'click .characterSwitch': function (event) {

        loading(1);
        var s_Length = CongressInstance.getStakeholdersLength.call({from:web3.eth.accounts[currentAccount]}).c[0];

        var visitNode = currentAccount;
        while (visitNode == currentAccount){
            visitNode = Math.floor(s_Length*Math.random());
        }
        console.log(visitNode);
        console.log(s_Length);
        if ($(event.target).html() == "Guard"){
            showThief = true;

            rerenderCropLand(visitNode);
            $(event.target).html("Home");
        }else if ($(event.target).html() == "Thief"){
            rerenderCropLand(visitNode);
            $(event.target).html("Home");
            $(event.target).parent().append("<button type='button' name='button' class='btn btn-primary nextHome'>Next</button>");

        }else if ($(event.target).html() == "Home"){
            $(event.target).html(Session.get('userCharacter'));
            showThief = false;
            $(".missionObject").html("<div class='thiefObject'></div>");

            rerenderCropLand(currentAccount);
            $(event.target).parent().find(".nextHome").remove();
        }
        loading(0);
    },
    'click .nextHome': function (event) {

        // ===== wait for further testing

    },
    'click .musicSwitch': function (event) {
        if (!audio.paused){
            audio.pause();
            $(".musicSwitch").find("img").attr("src", "/img/game/speaker_on.svg");
        }else{
            audio.play();
            $(".musicSwitch").find("img").attr("src", "/img/game/speaker_off.svg");

        }

    },

    'click .MissionOpen': function(event){
        $(".mission_template").css("display", "inline");
        mission_rending();
    },

})




/////////////////////////
//  Utility Functions  //
/////////////////////////


document.onmousemove = function(e){
    cursorX = e.pageX;
    cursorY = e.pageY;
}

var loadCropList = function(s_Id){
    cropList = [];
    var data = usingPropertyInstance.getCropList(s_Id, { from:web3.eth.accounts[currentAccount]});
    var length = usingPropertyInstance.getCropListLength(s_Id, { from:web3.eth.accounts[currentAccount]});
    for (var i = 0 ; i < length ; i++){
      var start = web3.toUtf8(data[3][i]).split(".")[0]+"Z";
      var end = web3.toUtf8(data[4][i]).split(".")[0]+"Z";

      start = start.split("\"")[1];
      end = end.split("\"")[1];

        cropList.push({
            id: data[0][i].c[0],
            name: web3.toUtf8(data[1][i]),
            img: web3.toUtf8(data[2][i]),
            start: new Date(start),
            end: new Date(end),
            type: data[5][i].c[0],
            ripe: data[6][i]
        });
    }
    console.log(cropList);

}

var getUserData = function(s_Id){

    var data = CongressInstance.getStakeholder.call(s_Id, { from:web3.eth.accounts[currentAccount]});

    currentUser = {
      id:s_Id,
      address:web3.eth.accounts[currentAccount],

      name: web3.toUtf8(data[0]),
      exp: data[1].c[0],
      totalExp: data[2].c[0],
      type: web3.toUtf8(data[3]),
      landSize: data[4].c[0],
      level:data[5].c[0],
      sta: data[6].c[0],
      guardId: null,
      thiefId: null
    };

}

var getLandConfiguration = function(s_Id){
    userLandConfiguration = [];
    var data = usingPropertyInstance.getUserLandConfiguration.call(s_Id, { from:web3.eth.accounts[currentAccount]});

    var contractLandData = data[0];
    var contractCropData = data[1];

    var landSize = currentUser.landSize;

    for (var i = 0 ; i < landSize*landSize ; i++){
        if (contractLandData[i].s != -1){
            contractLandData[i].s = contractLandData[i].c[0];
        }
        if (contractCropData[i].s != -1){
            contractCropData[i].s = contractCropData[i].c[0];
        }
        userLandConfiguration.push(
          {
              id: i,
              land: contractLandData[i].s,
              crop: contractCropData[i].s
          }
        );
    }

    console.log(contractCropData);


}

var fetchGameInitConfig = function(){
    var cropData = [];
    var landData = [];

    var flag = true;
    var i = 0;
    while (flag){
      try{
        cropData.push(usingPropertyInstance.propertyTypeList(i));
        i++;
      }
      catch(err) {
        flag = false;
      }
    }

    flag = true;
    i = 0;

    while (flag){
      try{
        landData.push(usingPropertyInstance.landTypeList(i));
        i++;
      }
      catch(err) {
        flag = false;
      }
    }

    // console.log(landData);
    // console.log(cropData);
    for (var i = 0 ; i < cropData.length ; i++){
        var tempImg = [];
        for (var j = 0 ; j < 4; j++){
            var tempStr =  web3.toUtf8(usingPropertyInstance.getPropertyTypeImg(i, j, { from:web3.eth.accounts[currentAccount]})).toString();
            tempImg.push(tempStr);
            //tempImg.push(["carrot_seed", "carrot_grow", "carrot_harvest", "carrot"]);
            //tempImg.push("carrot_grow");
        }
        cropTypeList.push({
          name : web3.toUtf8(cropData[i][0]),
          id : cropData[i][1].c[0],
          img: tempImg,
          time: web3.toUtf8(cropData[i][3]),
          count:cropData[i][4].c[0]

        })
    }
    console.log(cropTypeList);

    for (var i = 0 ; i < landData.length ; i++){

        landTypeList.push({
          id : landData[i][0].c[0],
          name : web3.toUtf8(landData[i][1]),
          img: web3.toUtf8(landData[i][2]),
          count:landData[i][3].c[0]

        })
    }

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
    $(".cropObject").css("display", "none");
    if (on){
        $(".loading").css("display", "flex");
        opacity = 0.5;
    }else{
        setTimeout(function(){
            $(".loading").css("display", "none");
        },1000);
        opacity = 0;

    }
    $(".loading").css("opacity", opacity);


}

var rerenderCropLand = function(id){
  getUserData(id);
  getLandConfiguration(id);
  loadCropList(id);
  initCropLand(id);
}

var initCropLand = function(id){

    $('.land').html("");
    $(".surfaceObject").html("");
    $(".surfaceObject").append("<div class='cropObject'></div>");

    $('.land').css("width", blockSize*currentUser.landSize );
    $('.land').css("height", blockSize*currentUser.landSize );

    for (var i = 0 ; i < currentUser.landSize*currentUser.landSize; i++){
        $('.land').append("<div class='farm cropLand" + i + "'></div>");
        if (userLandConfiguration[i].land == -1){
            $('.cropLand'+i).css("border", '1px solid black');
        }
        //$('.land').append("<div></div>");
    }

    var theifId = 0;
    for (var i = 0 ; i < userLandConfiguration.length ; i++){

        if (userLandConfiguration[i].land == -1){
            continue;
        }
        $(".farmObject").html("<img src = '" + prefix+ landTypeList[userLandConfiguration[i].land].img + postfix +"' />");
        $( ".farmObject" ).children().clone().appendTo(".cropLand"+ i).css({opacity:1});


        if (userLandConfiguration[i].crop == -1){
            continue;
        }

        //currentCropLand = event.target.className;
        var top = $('.cropLand'+i)[0].getBoundingClientRect().top;
        var left = $('.cropLand'+i)[0].getBoundingClientRect().left;

        var landTop = $(".land").position().top;
        var landLeft = $(".land").position().left;

        var areaLeft = $(".gamingArea").position().left;

        var divHeight =$(".cropObject").height()/5;
        var divWidth = $(".cropObject").width()/4;
        // var divHeight =0;
        // var divWidth = 0;
        var styles = {
            top: top-divHeight,
            left: left-areaLeft+divWidth,
            width:"150px",
            height:"150px",
            position:"absolute",
            opacity:1,
            "z-index":2
        };


        var index = userLandConfiguration[i].crop;
        if (index == -1){
          return;
        }

        var difference = elapsedTime(new Date(), cropList[index].end);
        var originDifference = elapsedTime(cropList[index].start, cropList[index].end);

        var percent = difference/originDifference;
        if (percent <= 0.6){
            $(".cropObject").html("<img src = '" + prefix+ cropTypeList[cropList[index].type].img[1] + postfix +"' />");
        }
        if (percent <= 0){
            $(".cropObject").html("<img src = '" + prefix+ cropTypeList[cropList[index].type].img[2] + postfix +"' />");
            //cropList[i].ripe = 1;
        }

        //var diffData = (difference.getDate()-1)+" Days. "+(difference.getHours()-8)+' Hrs. '+difference.getMinutes()+' Mins. '+difference.getSeconds()+" Secs";
        //$(".currentCrop"+index).html(diffData);


        //$(".cropObject").html("<img src = '" + prefix+ cropTypeList[config[i].crop].img[0] + postfix +"' />");
        $( ".cropObject" ).clone().attr("class","croppedObject croppedObject"+index).appendTo(".surfaceObject").css(styles);

        console.log(showThief)
        if (showThief){
          var missionStyles = {
              top: top-divHeight,
              left: left-areaLeft+divWidth,
              width:"150px",
              height:"150px",
              position:"absolute",
              opacity:1,
              "z-index":5,
              display:'inline'
          };


          var prob = Math.random()*3;
          if (prob > 2){
            $(".thiefObject").html("<img src = '/img/game/thief.gif' />");
            $( ".thiefObject" ).clone().attr("class","thief thief"+theifId++).appendTo(".missionObject").css(missionStyles);
          }
        }else{
            $(".missionObject").html("<div class='thiefObject'></div>");
        }

    }
}

var levelCap = function(n){
    var powerResult = 1;
    for (var i = 0 ; i < n ; i++){
        powerResult *= 2;
    }
    return powerResult*100;
}

var staminaCap = function(n){
    return 100+n*10;
}

var updateStaminaBar = function(consumedSta){
    var staCap = staminaCap(currentUser.level);

    currentUser.sta -= consumedSta;
    var percent = (currentUser.sta/staCap)*100;
    $(".staProgressBar").css("width", percent + "%");
    $(".staText").text(currentUser.sta+"/"+staCap);
}


var updateUserStamina = function(){
    var staCap = staminaCap(currentUser.level);
    if (currentUser.sta >= staCap){
        return;
    }
    currentUser.sta += 1;
    updateStaminaBar(0);

}




var updateUserExp = function(exp){
  currentUser.exp += parseInt(exp);
  currentUser.totalExp += currentUser.exp;
  var lvlCap = levelCap(currentUser.level);
  var percent = (currentUser.exp/lvlCap)*100;
  if  (percent >= 100){
    currentUser.level += 1;
    currentUser.exp = currentUser.exp - lvlCap;
    $(".levelUpObject").attr("display", "inline");

    MainActivityInstance.playerLevelUp(s_Id, Math.random()*3+1, {from:web3.eth.accounts[currentAccount]});
    rerenderCropLand(s_Id);

  }
  $(".expProgressBar").css("width", percent + "%");
  $(".expText").text(currentUser.exp+"/"+lvlCap);

}

var checkMission = function(){

    if (showThief){


    }
}

var cropSummaryUpdate = function(){
    for (var i = 0 ; i < cropList.length ; i++){
        if (cropList[i].name == 0 || cropList[i].ripe ){
            continue;
        }
        var difference = elapsedTime(new Date(), cropList[i].end);
        var originDifference = elapsedTime(cropList[i].start, cropList[i].end);
        //var percentage = (1 - (difference / originDifference))*100;
        // console.log(percentage);
        // if (percentage > 100){
        //   continue;
        // }
        //$(".currentCrop"+i).css("width", percentage+"%");
        var percent = difference/originDifference;
        if (percent <= 0.6){
            $(".croppedObject"+cropList[i].id).find("img").attr("src",prefix+cropTypeList[cropList[i].type].img[1]+postfix);
        }
        if (percent <= 0){
            $(".croppedObject"+cropList[i].id).find("img").attr("src",prefix+cropTypeList[cropList[i].type].img[2]+postfix);
            cropList[i].ripe = 1;
            $(".currentCrop"+cropList[i].id).parent().remove();
            continue;
        }

        var diffData = (difference.getDate()-1)+" Days. "+(difference.getHours()-8)+' Hrs. '+difference.getMinutes()+' Mins. '+difference.getSeconds()+" Secs";
        $(".currentCrop"+i).html(diffData);
    }
}

var elapsedTime = function(start, end){

    //var elapsed = end.getTime() - start.getTime();

    var elapsed = end - start; // time in milliseconds
    var difference = new Date(elapsed);
    //var diff_days = difference.getDate();

    //var diff_hours = difference.getHours();
    //var diff_mins = difference.getMinutes();
    //var diff_secs = difference.getSeconds();

    //return difference;
    return difference;

}



// var farmObjectLoader = function(){
//     $('.land').css("width", blockSize*currentUser.landSize );
//     $('.land').css("height", blockSize*currentUser.landSize );
//
//     for (var i = 0 ; i < currentUser.landSize*currentUser.landSize; i++){
//         $('.land').append("<div class='farm cropLand" + i + "' style='border:1px solid black; border-style:solid;'></div>");
//     }
// }


/////////////////////////
//  Shop Functions  //
/////////////////////////

get_user_property_setting = function () {
    user_property = [];
    var propertyLength = usingPropertyInstance.getPropertiesLength.call();
    for(i = 0; i < propertyLength;i++){
        var property_data = usingPropertyInstance.getProperty_Shop(i, {from:web3.eth.accounts[currentAccount]});
        if(web3.eth.accounts[currentAccount] == property_data[2]){
            var data = {"id":i, "propertyType":property_data[0].c[0], "name":hex2a(property_data[1]), "propertyCount":property_data[3].c[0],  "tradeable":property_data[4]};
            user_property.push(data);
        }
    }
}

get_propertyType_setting = function(){
    display_field = [];
    var propertyTypeLength = usingPropertyInstance.getPropertyTypeLength.call(0, {from:web3.eth.accounts[currentAccount]});

    for(i = 0; i < propertyTypeLength.c[0]; i++){
        var property_type = usingPropertyInstance.getPropertyType.call(i,currentAccount, {from:web3.eth.accounts[currentAccount]});
        var property_type_rating = usingPropertyInstance.getPropertyTypeRating.call(i,{from:web3.eth.accounts[currentAccount]});
        console.log(property_type_rating);

        var data = {"name":hex2a(property_type[0]),"id": property_type[1].c[0],"rating":property_type_rating.c[0],"averageRating":property_type[2].c[0]};
        display_field.push(data);
    }
}

set_property_table = function(){
    get_user_property_setting();
    var table, tr, td, heart_path, heart_status;
    heart_path = ['./img/heart-outline.png','./img/heart_filled.png'];

    $('.shop_content').html('');
    table = $('<table></table>').attr('id', 'property_table')
                                .attr('class', 'property_shop_table');
    //header
    tr = $('<tr></tr>');
    tr.append($('<th></th>'));
    tr.append($('<th></th>').text('Property'));
    tr.append($('<th></th>').text('Stock'));
    tr.append($('<th></th>').text('Tradable'));
    table.append(tr);
    //header
    //content
    for(i = 0; i < user_property.length; i++){
        tr = $('<tr></tr>');
        td = $('<td></td>');
        td.append($('<img></img>', {
            src:prefix+cropTypeList[user_property[i].propertyType].img[3] + postfix,
            style:'width:50px; height:50px'
        }));
        tr.append(td);
        td = $('<td></td>');
        td.text(user_property[i].name);
        tr.append(td);
        td = $('<td></td>');
        td.text(user_property[i].propertyCount);
        tr.append(td);
        td = $('<td></td>');
        td.append(
                $('<input></input>',{
                    type:'text',
                    class:'shop_tradable_input',
                    id:'tradable_input_' + user_property[i].id,
                    value:user_property[i].tradeable
                })
                .on('keydown',function (e) {
                    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                        (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
                        (e.keyCode >= 35 && e.keyCode <= 40)) {
                        return;
                    }
                    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                        e.preventDefault();
                    }
                })
                .on('change',function(e){
                    var _id = index_finder($(this).attr('id'), 'tradable_input_');
                    if(parseInt($(this).val(),10) > parseInt($('#shop_stock_' + _id).val())){
                        $(this).val($('#shop_stock_' + _id).val());
                    }
                    $('#shop_stock_' + _id)[0].parentNode.previousSibling.textContent= parseInt($('#shop_stock_' + _id).val(),10) -  parseInt($(this).val(),10);
                })
                .on('click', function(){
                    $(this).select();
                })
                );
        td.append($('<input></input>',{
            type:'hidden',
            id:'shop_stock_' + user_property[i].id,
            value: parseInt(user_property[i].propertyCount,10) + parseInt(user_property[i].tradeable,10)
        }));
        tr.append(td);
        table.append(tr);
    }
    //content
    //control bar
    tr = $('<tr></tr>');
    td = $('<td></td>').attr('colspan', 4).attr('style','textalign=cneter;');
    td.append($('<input>').attr( {
        type: 'button',
        id: 'btn_property_save',
        value: 'SAVE'
    }).on('click', function () {
        save_tradable_setting();
    }));
    td.append($('<input>').attr( {
        type: 'button',
        id: 'btn_property_cancel',
        value: 'CANCEL'
    }).on('click', function () {
        alert('cancel');
    }));
    tr.append(td);
    table.append(tr);
    //control bar
    $('.shop_content').append(table);
}

index_finder = function(_source, _mask){
    var res = _source.substring(_mask.length, _source.length);
    return res;
}

set_propertyType_table = function () {

    var table, tr, td, property_index;

    get_propertyType_setting();
    $('.shop_content').html('');
    table = $('<table></table>').attr('id', 'property_table')
                                .attr('class', 'property_shop_table');
    //header
    tr = $('<tr></tr>');
    tr.append($('<th></th>').text('Property'));
    tr.append($('<th></th>').text('Rating'));
    tr.append($('<th></th>').text('AVG Rating'));
    table.append(tr);
    //header
    //content
    for (i = 0; i < display_field.length; i++) {
        tr = $('<tr></tr>');
        tr.append($('<td></td>').text(display_field[i].name));
        //tr.append($('<td></td>').text(display_field[i].propertyCount));
        td = $('<td></td>');
        td.append($('<input>', {
            type: 'range',
            value: display_field[i].rating,
            max: 100,
            min: 0,
            step: 1,
            id: 'rating' + i
        }).on('change', function () {
            $('label[for = ' + $(this).attr('id') + ']').html($(this).val());
        })
        );
        td.append($('<label>').attr('for', 'rating' + i).html(display_field[i].rating));
        tr.append(td);
        tr.append($('<td></td>').text(display_field[i].averageRating));
        table.append(tr);
    }
    //content
    //control bar
    tr = $('<tr></tr>');
    td = $('<td></td>').attr('colspan', 3);
    td.append($('<input>').attr( {
        type: 'button',
        id: 'btn_property_save',
        value: 'SAVE'
    }).on('click', function () {
        save_rating_setting();
    }));
    td.append($('<input>').attr( {
        type: 'button',
        id: 'btn_property_cancel',
        value: 'CANCEL'
    }).on('click', function () {
        alert('cancel');
    }));
    tr.append(td);
    table.append(tr);
    //control bar
    $('.shop_content').append(table);
}

save_tradable_setting = function(){
    for(i = 0; i < $('.shop_tradable_input').length; i++){
        var _id = index_finder( $('.shop_tradable_input')[i].id, 'tradable_input_');
        var _tradable = $('#tradable_input_' + _id).val();
        var _propertyCount = parseInt($('#shop_stock_' + _id).val(),10) - parseInt(_tradable,10);
        usingPropertyInstance.updatePropertyCount(_id,_propertyCount,_tradable, {from:web3.eth.accounts[currentAccount],gas:200000});
    }
}

save_rating_setting = function () {
    //for (i = 0; i < user_property.length; i++) {
    //    user_property[i].rating = $('#rating' + i).val();
    //}
    //property_log[account_index].property = user_property;
    //$('#json_temp').val(JSON.stringify(property_log));
    //averageRating_calculation();
    for(i = 0; i < display_field.length;i++){
        var _id = parseInt(display_field[i].id,10);
        var _rate = parseInt($('#rating' + i).val(),10);
        usingPropertyInstance.updatePropertyTypeRating(_id, _rate, "update", {from:web3.eth.accounts[currentAccount],gas:200000});
    }


}

averageRating_calculation = function () {
    for (i = 0; i < property_database.length; i++) {
        property_database[i].averageRating = 0;
        delete property_database[i].rating;
    }

    for (i = 0; i < property_log.length; i++) {
        for (j = 0; j < property_log[i].property.length; j++) {
            for (k = 0 ; k < property_database.length; k++) {
                if (property_database[k].id == property_log[i].property[j].id) {
                    property_database[k].averageRating = parseInt(property_database[k].averageRating, 10) + parseInt(property_log[i].property[j].rating, 10);
                    break;
                }
            }
        }
    }
    for (i = 0; i < property_database.length; i++) {
        n = parseInt(property_database[i].averageRating, 10) / property_log.length;
        property_database[i].averageRating = n.toFixed(2);
    }
    $('#temp_property').val(JSON.stringify(property_database));
}


/////////////////////////
//  Mission Functions  //
/////////////////////////
var mission_list = [];

get_mission_list = function(){
    var item, result, _cropId, _cropName, _quantity, _missionId, _missionName, _exp, _lvl_limitation, _accountStatus;
    var mission_count = GameCoreInstance.getMissionsLength.call({from: web3.eth.accounts[currentAccount]});
    mission_list = [];

    for(i = 0; i < mission_count; i++){
        mission_source = GameCoreInstance.getMission.call(i, {from:web3.eth.accounts[currentAccount]});
        item_length = GameCoreInstance.getMissionItemsLength.call(i, {from:web3.eth.accounts[currentAccount]});
        mission = {id: i, name:$.trim(hex2a(mission_source[0])), exp: mission_source[1].c[0], lvl_limitation: mission_source[2].c[0], solved:mission_source[3],items:[]};

        if(mission.lvl_limitation ===999){}
        else{
            for(j = 0; j < item_length;j++){
                item_source = GameCoreInstance.getMissionItems.call(i, j, {from:web3.eth.accounts[currentAccount]});
                item = {crop_id:item_source[0].c[0], crop_name: hex2a(item_source[1]), quantity:item_source[2].c[0]};
                mission.items.push(item);
            }
            mission_list.push(mission);
        }
    }
}
mission_rending = function(){

    get_mission_list();
    $('.mission_template').html('');
    $('.mission_template').append($('<input></input>',{
        type:'button',
        value:'Close',
    })
    .on('click', function(){ $('.mission_template').css('display','none'); })
    );
    $('.mission_template').append($('<input></input>',{
        type:'button',
        value:'add',
    })
.on('click', function(){
    GameCoreInstance.addMission('Mission1', 100, 0, true,  { from: web3.eth.accounts[currentAccount], gas: 2000000 });
    GameCoreInstance.addMission('Mission2', 300, 4, true,  { from: web3.eth.accounts[currentAccount], gas: 2000000 });
    GameCoreInstance.addMission('Mission3', 200, 2, false, { from: web3.eth.accounts[currentAccount], gas: 2000000 });
    GameCoreInstance.addMission('Mission4', 500, 3, true,  { from: web3.eth.accounts[currentAccount], gas: 2000000 });

    //GameCoreInstance.addMission('Mission5', 567, 5, true,  { from: web3.eth.accounts[currentAccount], gas: 2000000 });
    //GameCoreInstance.addMission('Mission6', 600, 7, true,  { from: web3.eth.accounts[currentAccount], gas: 2000000 });
    //GameCoreInstance.addMission('Mission7', 700, 9, true,  { from: web3.eth.accounts[currentAccount], gas: 2000000 });
    //GameCoreInstance.addMission('Mission8', 880, 8, true,  { from: web3.eth.accounts[currentAccount], gas: 2000000 });

    GameCoreInstance.addMissionItem(0, 0, 3, true,  { from: web3.eth.accounts[currentAccount], gas: 2000000 });
    GameCoreInstance.addMissionItem(0, 1, 4, true,  { from: web3.eth.accounts[currentAccount], gas: 2000000 });
    GameCoreInstance.addMissionItem(1, 1, 5, true,  { from: web3.eth.accounts[currentAccount], gas: 2000000 });
    GameCoreInstance.addMissionItem(1, 3, 2, true,  { from: web3.eth.accounts[currentAccount], gas: 2000000 });
    GameCoreInstance.addMissionItem(2, 0, 3, true,  { from: web3.eth.accounts[currentAccount], gas: 2000000 });
    GameCoreInstance.addMissionItem(2, 1, 3, true,  { from: web3.eth.accounts[currentAccount], gas: 2000000 });
    GameCoreInstance.addMissionItem(2, 2, 3, true,  { from: web3.eth.accounts[currentAccount], gas: 2000000 });
    GameCoreInstance.addMissionItem(3, 0, 5, true,  { from: web3.eth.accounts[currentAccount], gas: 2000000 });
    GameCoreInstance.addMissionItem(3, 1, 5, true,  { from: web3.eth.accounts[currentAccount], gas: 2000000 });
    GameCoreInstance.addMissionItem(3, 2, 5, true,  { from: web3.eth.accounts[currentAccount], gas: 2000000 });
    GameCoreInstance.addMissionItem(3, 3, 5, true,  { from: web3.eth.accounts[currentAccount], gas: 2000000 });
})
);
    var table, tr, td;
    table = $('<table></table>');
    //header
    tr = $('<tr></tr>');
    tr.append($('<th></th>').text('Mission'));
    tr.append($('<th></th>').text('Requirement'));
    tr.append($('<th></th>').text('Exp'));
    tr.append($('<th></th>').text('Submit'));
    table.append(tr);
    //header
    //content
    for(i = 0; i < mission_list.length;i++){
        tr = $('<tr></tr>');
        td = $('<td></td>',{
            text:mission_list[i].name
        });
        tr.append(td);
        td = $('<td></td>');
        for(j = 0; j < mission_list[i].items.length; j++){
            td.append($('<img></img>',{
                src: prefix + cropTypeList[mission_list[i].items[j].crop_id].img[3]+postfix,
                alt:mission_list[i].items[j].crop_name
            }));
            td.append($('<span></span>',{
                text: ' X ' + mission_list[i].items[j].quantity
            }));
        }
        tr.append(td);
        td = $('<td></td>',{
            text:  mission_list[i].exp
        });
        tr.append(td);
        td = $('<td></td>');
        td.append($('<input></input>',{
            type:'hidden',
            id:'mission_exp_' + mission_list[i].id,
            value:mission_list[i].exp
        }));
        td.append($('<input></input>',{
            type:'hidden',
            id:'mission_id_' + mission_list[i].id
        }));
        if(!mission_list[i].solved){
            td.append($('<input></input>',{
                type:'button',
                value:'Submit',
                id:'btn_mission_submit_' + mission_list[i].id
            })
            .on('click', function(){
                var _id =index_finder($(this).prev('input').attr('id'),'mission_id_');
                var mission_qualify = mission_qualify_check(_id);
                if(mission_qualify){
                    mission_submit(_id);
                }
            })
            );
        }
        tr.append(td);
        table.append(tr);
    }
    //content
    $('.mission_template').append(table);
    get_user_property_setting();
    get_mission_list();
    for(k = 0; k < mission_list.length;k++){
        mission_qualify_check(mission_list[k].id);
    }
}

mission_submit = function(_id){
    updateUserExp(parseInt($('#mission_exp_' + _id).val(),10));
    GameCoreInstance.submitMission(_id,  { from: web3.eth.accounts[currentAccount], gas: 2000000 });
    mission_rending();
}

mission_qualify_check = function(_id){

    var target_mission;
    for(i = 0; i < mission_list.length; i++){
        if(mission_list[i].id == _id){
            target_mission = mission_list[i];
            break;
        }
    }
    var qualify = false;
    for(i = 0; i < target_mission.items.length; i++){
        qualify = false;
        for(j =0; j < user_property.length; j++){
            if(user_property[j].propertyType == target_mission.items[i].crop_id){
                if(parseInt(user_property[j].propertyCount,10) >= parseInt(target_mission.items[i].quantity,10)){
                    qualify = true;
                }
                else{
                    qualify = false;
                }
                break;
            }
        }
        if(!qualify){
            break;
        }
    }

    if(qualify){
        $('#btn_mission_submit_' + _id).css('display', 'block');
        return (true);
    }
    else {
        $('#btn_mission_submit_' + _id).css('display', 'none');
        return (false);
    }
}

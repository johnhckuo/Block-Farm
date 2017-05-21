import { Tracker } from 'meteor/tracker';
import { Session } from 'meteor/session';


var landSize = 3;
var blockSize = 150;
var landSrc = "/img/game/land.svg";

var previousUnlockCrop = 0;

var prefix = "/img/game/plant/";
var postfix = ".svg";

var currentCropId;
var plantMode = false;
var currentLandId;
var placeMode = false;
var currentCropLand;
var audio;

var currentCharacter = "farmer";

var visitNode;
var s_Id;
var x = 0, y = 0;
var currentTutorialSlide = 0;

var gameMode = "Farmer";


const _dep = new Tracker.Dependency;
const _crop = new Tracker.Dependency;
const _character = new Tracker.Dependency;


var cursorX;
var cursorY;

var panelCounter = 2;

var cropList = [];
var stockList = [];
var landList = [];

var staminaList = {crop:5,steal:20, stealFail:40};

var currentUser = {};

var userLandConfiguration = [];

var showThief = false;

var cropTypeList = [];

var landTypeList = [];

var userCropType = [];


var property_log = [];
var user_property = [];
var property_database = [];
var display_field = [];

var currentClickedCrop = null;
var currentClickedLand = null;
var removeMode = false;

var floatOffset = 1000;

var checkMissionInterval = null;
var theifId = 0;
var landInfo = [];
var stealRate;

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

//////////////////////
//  initGameConfig  //
//////////////////////






/////////////////
//  onCreated  //
/////////////////

Template.gameIndex.created = function() {

    s_Id = CongressInstance.stakeholderId(web3.eth.accounts[currentAccount]);
    s_Id = s_Id.c[0];
    if (s_Id == 0){
        sweetAlert("Oops...", "Please Register First", "error");
        Router.go('/');
        return;
    }
    loading(1);


    getUserData(s_Id);
    getLandConfiguration(s_Id);
    loadCropList(s_Id);
    getUserStockList(s_Id);

    fetchGameInitConfig(s_Id);

    eventListener();
    // Tracker.autorun(() => {
    //   Meteor.subscribe('characterList', { userName: Session.get('userName') });
    // });



    // Template.registerHelper('characterList',function(input){
    //     return Session.get("userName");
    // });


    audio = new Audio('/music/background_music.mp3');
    //audio.play();

    $(window).resize(function(evt) {
        initCropLand(s_Id);
    });


}

//////////////////
//  onRendered  //
//////////////////

Template.gameIndex.rendered = function() {
    if(!this._rendered) {
        $(".levelUp").hide();

        updateUserExp(0);
        updateSyndicateExp(0);
        updateStaminaBar(0);

        initCropLand(s_Id);
        showConfirmation(s_Id);

        Session.set('userName', currentUser.name);
        Session.set('userExp', currentUser.exp);
        Session.set('userSta', currentUser.sta);
        Session.set('userCharacter', currentUser.type);
        Session.set('userLevel', currentUser.level);
        Session.set('SyndicateLevel', currentUser.SyndicateLevel);


        setInterval(cropSummaryUpdate, 1000);
        setInterval(updateUserStamina, 500);

        loading(0);
        //need to be async 0513
        get_user_property_setting();

        if (currentUser.level == 0){
          $(".tutorialContainer").fadeIn();
        }

    }
}

Template.shop.rendered = function () {

}

//////////////////
//    onLeave   //
//////////////////

$(window).on("beforeunload", function() {
    CongressInstance.updateStakeholderLastLogin(s_Id, new Date(), {from:web3.eth.accounts[currentAccount], gas:2000000} );
    CongressInstance.updateUserStamina(s_Id, currentUser.sta, {from:web3.eth.accounts[currentAccount], gas:2000000} );

    console.log("saved");
    return true ? "Do you really want to close?" : null;
})

///////////////
//  Helpers  //
///////////////

Template.shop.helpers({

});

Template.gamingArea.helpers({
    currentLevel: function(){
      _character.depend();
        //return currentUser.level;
      return Session.get('Levelup');
    },
    staminaCap: function(){
      return "Stamina Capacity: "+Session.get('staminaCap');
    },
    expCap: function(){
      return "Exp Capacity: "+Session.get('expCap');
    },
    unlockCrop: function(){
      if (previousUnlockCrop != Session.get('unlockCrop')){
        previousUnlockCrop = Session.get('unlockCrop');
        return "Unlock Crop: "+cropTypeList[Session.get('unlockCrop')].name;
      }
    }
});

Template.characterList.helpers({
    userLevel: function(){
      return "LV. "+Session.get('userLevel');
    },
    userSyndicateLevel: function(){
      return "LV. "+Session.get('SyndicateLevel');
    },
    userName: function() {
      return Session.get('userName');
    },
    characterType: function() {
      if(Session.get('userCharacter') == "Thief"){
          return "/img/game/thief.svg";
      }else{
          return "/img/game/guard.svg";

      }
    }
});

Template.statusList.helpers({
    crops: function(){

        var cropsData = [];
        for (var i = 0 ; i < cropTypeList.length; i++){
            var data = cropTypeList[i];

            cropsData.push({
                "name": "crop plantButton property"+ i,
                "img": prefix+data.img[3]+postfix,
                "content": data.name
            });
        }
        _crop.depend();
        return cropsData;
    },
    lands: function(){

        var landsData = [];

        for (var i = 0 ; i < landTypeList.length; i++){
            var data = landTypeList[i];

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

Template.firstTutorial.events({
    'click .tutorialNextBtn': function (event) {
        currentTutorialSlide -= 100;
        $(".tutorialContainer").css("transform", "translateX("+ currentTutorialSlide +"vw)");
    },
    'click .tutorialPreviousBtn': function (event) {
        currentTutorialSlide += 100;
        $(".tutorialContainer").css("transform", "translateX("+ currentTutorialSlide +"vw)");
    },
    'click .tutorialFinishBtn': function (event) {
        $(".tutorialContainer").css("opacity", "0");
        currentTutorialSlide = 0;
        setTimeout(function(){
          $(".tutorialContainer").css("display", "none");

        },1000);
    },
    'click .tutorialSkipBtn': function (event) {
        $(".tutorialContainer").css("opacity", "0");
        currentTutorialSlide = 0;
        setTimeout(function(){
          $(".tutorialContainer").css("display", "none");

        },1000);
    }
});

Template.shop.events({
    'click #btn_show_property': function () {
        set_propertyType_table();
    },
    'click #btn_shop_close': function () {
        $('.property_shop').css('display', 'none');
    },

    'click #btn_property_tradeable':function(){
        //set_property_table();
    },
    'change input[type="range"]':function(e){
      var eTarget=$(e.target);
      eTarget.css({'background-image':'-webkit-linear-gradient(left ,#82cbd1 0%,#82cbd1 '+eTarget.val()+'%,#C7FFEF '+eTarget.val()+'%, #C7FFEF 100%)'});
    }
});


Template.gameIndex.events({
    'click .cropObject': function (event){
        // var left = $(event.target).position().left;
        // var top = $(event.target).position().top;
        if (currentCropId != null && plantMode){
            var _landId = currentCropLand.split("cropLand")[1];


            if (userLandConfiguration[_landId].crop != -1){
                sweetAlert("Oops...", "Don't plant twice !", "error");
                return;
            }else if (userLandConfiguration[_landId].land == -1){
                sweetAlert("Oops...", "You need a land first !", "error");
                return;
            }else if (currentUser.sta < staminaList["crop"]){
                sweetAlert("Oops...", "Not enough stamina", "error");
                return;
            }

            updateStaminaBar(staminaList["crop"]);

            var styles = {
                'z-index' : "2",
                'opacity': 1
            };
            $( ".cropObject" ).clone().attr("class","croppedObject croppedObject"+cropList.length).attr("cropcount", cropTypeList[currentCropId].count).appendTo(".surfaceObject").css(styles);

            //var start = Date.now();
            var start = new Date();
            var end = new Date();

            var cropWaitingTime = cropTypeList[currentCropId].time.split(".");

            end = end.addTime(parseInt(cropWaitingTime[0]), parseInt(cropWaitingTime[1]), parseInt(cropWaitingTime[2]), parseInt(cropWaitingTime[3]));

            var _id = cropList.length;


            //userLandConfiguration[_landId].crop = cropTypeList[currentCropId].id;
            userLandConfiguration[_landId].crop = _id;
            usingPropertyInstance.updateUserLandConfiguration(s_Id, _landId, _id, 0, 'crop', {from:web3.eth.accounts[currentAccount], gas:2000000});

            usingPropertyInstance.addCropList(s_Id, cropTypeList[currentCropId].name, cropTypeList[currentCropId].img[3], start, end, parseInt(cropTypeList[currentCropId].id), 0, parseInt(cropTypeList[currentCropId].count), {from:web3.eth.accounts[currentAccount], gas:2000000});
            cropList.push({
                id: _id,
                name: cropTypeList[currentCropId].name,
                img:cropTypeList[currentCropId].img[3],
                start: start,
                end: end,
                type: cropTypeList[currentCropId].id,
                ripe: 0,
                count: cropTypeList[currentCropId].count
            });
            _dep.changed();

            userCropType[currentCropId].count++;
            usingPropertyInstance.updateUserPropertyType(s_Id, currentCropId, {from:web3.eth.accounts[currentAccount], gas:2000000});

        }else{
            sweetAlert("Oops...", "Please specify Crop first", "error");
            return;
        }



    },
    'click .farmObject': function(event){
        if (currentLandId != null && placeMode){
            var _landId = currentCropLand.split("cropLand")[1];

            if (userLandConfiguration[_landId].land != -1){
                sweetAlert("Oops...", "Don't plow twice !", "error");
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

        }else{
            sweetAlert("Oops...", "Specify Land first", "error");
            return;
        }
    },
    'click .thief': function(event){
        $(event.target).parent().css({opacity:0, transform:"translateY(50px)"});
        landInfo[$(event.target).parent().attr('bindindex')].showed = 0;
        updateSyndicateExp(2);
        currentUser.SyndicateProgress -= 1;
        CongressInstance.updateSyndicateProgress(s_Id, currentUser.SyndicateProgress, {from: web3.eth.accounts[currentAccount], gas:2000000});
        setTimeout(function(){
            $(event.target).parent().remove();
        },1000);
        if(currentUser.SyndicateProgress <= 0){
            clearInterval(checkMissionInterval);
            var leftThieives = $('.thief').length;
            for(i = 0; i < leftThieives; i++){
                $('.thief:eq(' + i + ')').css({opacity:0, transform:"translateY(50px)"});
                $('.thief:eq(' + i + ')').remove();
            }
            CongressInstance.updateFarmerId(s_Id, 0, {from:web3.eth.accounts[currentAccount], gas:2000000});
            updateSyndicateExp(30);
            sweetAlert("Congratulations!", "Mission Completed!", "success");

        }
    },
    'click .croppedObject': function (event){
        // var left = $(event.target).position().left;
        // var top = $(event.target).position().top;

        var id, cropClass, cropCount;

        if (event.target.className == ""){
            cropClass = $(event.target).parent().prop('className').split(" ")[1];
            id = cropClass.split("croppedObject")[1];
        }else{
            cropClass = event.target.className.split(" ")[1];
            id = cropClass.split("croppedObject")[1];

        }

        cropCount = $(event.target).parent().attr("cropcount");

        var typeIndex;
        for (var j = 0 ; j < cropTypeList.length ; j++){
            if (cropTypeList[j].id == cropList[id].type){
                typeIndex = j;
            }
        }

        $(".floatCropStatus").css("display", "none");

        if(gameMode == "Farmer"){
            if (cropList[id].ripe){
                var imgs = $(".crop").find("img");

                for (var i = 0 ; i < imgs.length; i++){
                    if ($(imgs[i]).parent().data('pressed')){
                        $(imgs[i]).parent().data('pressed', false);
                        $(imgs[i]).parent().html("<img src = '" + prefix+ cropTypeList[i].img[3] + postfix +"' />" +  cropTypeList[i].name);
                    }
                }
                $(".animationImg").html("<img src = '" + prefix+ cropTypeList[typeIndex].img[3] + postfix +"' />");
                //var exp = cropTypeList[cropList[id].type].exp;

                var difference = elapsedTime(cropList[id].start, cropList[id].end);
                var exp = Math.floor((difference/(1000*30))*20);
                updateUserExp(exp);
                $(".scoreObject").html("+" + exp +"XP");

                var temp2 = $(".expPopText").clone().attr("class", "expPopTextTemp").appendTo(".expProgress");

                temp2.html("+" + exp +"XP");
                temp2.css({display:"inline", opacity:1, transform:"translateY(0px)"});

                setTimeout(function(){
                    temp2.css({opacity:0, transform:"translateY(10px)"});
                    setTimeout(function(){
                        temp2.css({display: "none"});
                    },2000);
                },1000);

            }else{
                sweetAlert("Oops...", "Patience is a virtue <3", "error");
                return;
            }

            var top = $(event.target)[0].getBoundingClientRect().top;
            var left = $(event.target)[0].getBoundingClientRect().left;

            var landTop = ($(".canvas").height()-$(window).height())/2;
            var landLeft = ($(".canvas").width()-$(window).width())/2;

            var areaLeft = $(".gamingArea").position().left;
            var resizeOffsetX = (screen.width- $(window).width())/6.5;

            var divHeight =$(".cropObject").height()/5;
            var divWidth = $(".cropObject").width()*1.65;
            // var divHeight =0;
            // var divWidth = 0;
            var posX = left+landLeft-areaLeft+divWidth-x-resizeOffsetX;
            var posY = top+landTop-divHeight-y;

            var temp = $(".animationObject").clone().attr("class", "animationTemp").appendTo(".canvas");
            temp.css({display:"inline", top: posY, left: posX});
            temp.addClass("animationTempShow");

            setTimeout(function(){
                temp.css({opacity:0, transform:"translateY(0px)"});
                setTimeout(function(){
                    temp.css({display: "none"});
                    temp.remove();
                },1000);
            },1000);

            var stockId = stockList.length;
            stockList.push({
                id: stockId,
                name: cropList[id].name,
                minUnit: 1,
                extraData: cropList[id].name,
                type: cropList[id].type,
                count: cropCount,
                tradeable: 0
            });
            var propertyLength = usingPropertyInstance.getPropertiesLength.call({from:web3.eth.accounts[currentAccount]});
            var propertyIndex;
            for(var i = 0; i < user_property.length; i++){
                if(user_property[i].propertyType == stockList[stockId].type){
                    propertyIndex = user_property[i].id;
                    user_property[i].propertyCount += parseInt(stockList[stockId].count);
                    break;
                }
            }
            usingPropertyInstance.updatePropertyCount_Cropped(propertyIndex, parseInt(stockList[stockId].count), {from:web3.eth.accounts[currentAccount], gas:3000000});

            //usingPropertyInstance.addProperty(stockList[stockId].name, stockList[stockId].count, stockList[stockId].minUnit, stockList[stockId].extraData, stockList[stockId].type, stockList[stockId].tradeable, {from:web3.eth.accounts[currentAccount], gas:2000000});

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
            cropList[id].type = 0;
            cropList[id].ripe = 0;

            usingPropertyInstance.updateCropList(s_Id, id, 0, 0, 0, 0, 0, 0, 0, {from:web3.eth.accounts[currentAccount], gas:2000000});

            //cropList.splice(id, 1);
            $("."+cropClass).remove();

            //reload propertyTable
            set_property_table();
        }
        else if(gameMode == "Thief"){
            if(currentUser.sta < staminaList["steal"]){
                sweetAlert("Oops...", "Not enough stamina", "error");
                return;
            }
            else{
                var stolenFlag, stealCount, judgement, stealResult;
                stolenFlag = $(event.target).parent().attr("stolenFlag");
                if ((cropList[id].ripe)&&(stolenFlag == "f")){
                    judgement = Math.random();
                    if(judgement >= stealRate){
                        stealResult = true;

                        $(".animationImg").html("<img src = '" + prefix+ cropTypeList[typeIndex].img[3] + postfix +"' />");
                        $(".scoreObject").html("+" + 5 +"XP");
                        updateStaminaBar(staminaList["steal"]);
                        updateSyndicateExp(5);

                        var landTop = ($(".canvas").height()-$(window).height())/2;
                        var landLeft = ($(".canvas").width()-$(window).width())/2;

                        var areaLeft = $(".gamingArea").position().left;
                        var resizeOffsetX = (screen.width- $(window).width())/6.5;

                        var divHeight =$(".cropObject").height()/5;
                        var divWidth = $(".cropObject").width()*1.65;
                        var posX = cursorX+landLeft-areaLeft+divWidth-x-resizeOffsetX;
                        var posY = cursorY+landTop-divHeight-y;
                        posX = cursorX + posX;
                        posY = cursorY + posY;


                        var temp = $(".animationObject").clone().attr("class", "animationTemp").appendTo(".canvas");
                        temp.css({display:"inline", top: posY, left: posX});
                        temp.addClass("animationTempShow");

                        setTimeout(function(){
                            temp.css({opacity:0, transform:"translateY(0px)"});
                            setTimeout(function(){
                                temp.css({display: "none"});
                                temp.remove();
                            },1000);
                        },1000);
                        stealCount = Math.round(cropCount / 2);
                        cropCount = cropCount - stealCount;
                        var propertyLength = usingPropertyInstance.getPropertiesLength.call({from:web3.eth.accounts[currentAccount]});
                        var propertyIndex;
                        for(var i = 0; i < user_property.length; i++){
                            if(user_property[i].propertyType == cropList[id].type){
                                propertyIndex = user_property[i].id;
                                user_property[i].propertyCount += parseInt(cropCount);
                                break;
                            }
                        }
                        usingPropertyInstance.updatePropertyCount_Cropped(propertyIndex, stealCount,{from:web3.eth.accounts[currentAccount], gas:2000000});
                        usingPropertyInstance.updateCropCount(visitNode, id, cropCount, {from:web3.eth.accounts[currentAccount], gas:2000000});
                        $(event.target).parent().attr("cropcount", parseInt(cropCount));
                        $(event.target).parent().attr("stolenFlag", "t");

                        $("."+cropClass).html("<img src = '" + prefix+ cropTypeList[typeIndex].img[4] + postfix +"' />");
                        //reload propertyTable
                        set_property_table();
                    }
                    else{
                        stealResult = false;
                        sweetAlert("Oops...", "You are under arrest!", "warning");
                        updateStaminaBar(staminaList["stealFail"]);
                    }
                    CongressInstance.updateStealRecord(s_Id, stealResult, {from:web3.eth.accounts[currentAccount], gas:2000000});
                }
                else{
                    sweetAlert("Oops...", "Don't be so greedy", "error");
                    return;
                }
            }
        }
        else if(gameMode == "Guard"){
        }
    },

    'click .farm img': function(event){
        if (removeMode){
            var parentClass = $(event.target).parent()[0].className;
            var _landId = parentClass.split("cropLand")[1];

            if (userLandConfiguration[_landId].land == -1){
                sweetAlert("Oops...", "Its already empty !", "error");
                return;
            }

            $($(event.target).parent()[0]).css("border", "1px solid black");
            $(event.target).remove();

            userLandConfiguration[_landId].land = -1;
            usingPropertyInstance.updateUserLandConfiguration(s_Id, _landId, -1, -1, 'land', {from:web3.eth.accounts[currentAccount], gas:2000000});
        }
    },
    'mouseenter .croppedObject img':function(event){
      $(".floatCropStatus").css("display", "inline");
      var cropId = $(event.target).parent()[0].className.split("croppedObject")[2];

      var posX = cursorX;
      var posY = cursorY;

      $(".floatCropStatus").css({display:"inline", top: posY, left: posX});
      $(".floatCropName").html(cropList[cropId].name);

      var difference = elapsedTime(new Date(), cropList[cropId].end);
      var diffData = (difference.getHours()-8)+' Hrs. '+difference.getMinutes()+' Mins. '+difference.getSeconds()+" Secs";

      if (cropList[cropId].ripe){
        $(".timeLeft").html("Ready to harvest");
      }else{
        $(".timeLeft").html(diffData);
      }

      $(".timeLeft").attr("class", "timeLeft timeLeft"+cropId);

      var index;
      for (var j = 0 ; j < cropTypeList.length ; j++){
          if (cropTypeList[j].id == cropList[cropId].type){
              index = j;
          }
      }
      $(".floatCropStatus").find("img").attr("src",prefix+cropTypeList[index].img[3]+postfix);
    },
    'mouseout .croppedObject img':function(event){
      $(".floatCropStatus").css("display", "none");
    },
})

Template.crop.events({
    'click .crop': function (event){
        clickTarget=null;
        if(event.target.className==""){
          clickTarget=$(event.target).parent();
        }else{
          clickTarget=$(event.target);
        }
        var imgs = $(".cropLand").find("img");
        $(".farmObject").css("display", "none");
        $(imgs[0]).parent().data('pressed', false);
        $(imgs[0]).parent().html("<img src = '" + prefix+ "land" + postfix + "' />" + "Dirt");
        $(imgs[1]).parent().data('pressed', false);
        $(imgs[1]).parent().html("<img src = '/img/game/background.svg' />Grass");
        placeMode = false;
        removeMode = false;

        var id = clickTarget[0].className.split("property")[1];

        if (clickTarget.data('pressed')){
            $(".cropObject").css("display", "none");
            clickTarget.html("<img src = '" + prefix+ cropTypeList[id].img[3] + postfix +"' />" + cropTypeList[id].name);
            clickTarget.data('pressed', false);
            plantMode = false;
            return;
        }

        plantMode = true;

        currentClickedCrop = clickTarget;
        var imgs = $(".crop").find("img");

        for (var i = 0 ; i < imgs.length; i++){
            if ($(imgs[i]).parent().data('pressed')){
                $(imgs[i]).parent().data('pressed', false);
                $(imgs[i]).parent().html("<img src = '" + prefix+ cropTypeList[i].img[3] + postfix +"' />" +  cropTypeList[i].name);
            }
        }
        clickTarget.data('pressed', true);

        $(".cropObject").html("<img src = '" + prefix+ cropTypeList[id].img[0] + postfix +"' />");
        currentCropId = id;

        $(".cropObject").css("display", "inline");
        clickTarget.html("<img src='/img/game/cancel2.svg' width='50%'>")

    },

})

Template.land.events({
    'click .cropLand ': function (event){
        clickTarget=null;
        if(event.target.className==""){
          clickTarget=$(event.target).parent();
        }else{
          clickTarget=$(event.target);
        }

        if (plantMode){
            $(".cropObject").css("display", "none");
            for(var k = 0; k < cropTypeList.length; k++){
                $('.crop:nth-child(' + (k + 1) + ')').data('pressed', false);
                $('.crop:nth-child(' + (k + 1) + ')').html("<img src = '" + prefix+ cropTypeList[k].img[3] + postfix +"' />" +  cropTypeList[k].name);
            }
            plantMode = false;
        }

        var id = clickTarget[0].className.split("farmLand")[1];

        if (clickTarget.data('pressed')){
            $(".farmObject").css("display", "none");
            clickTarget.html("<img src = '" + prefix+ landTypeList[id].img + postfix +"' />Dirt");
            clickTarget.data('pressed', false);
            place = false;
            return;
        }

        var imgs = $(".cropLand").find("img");
        imgs[1].src = '/img/game/background.svg';
        $(imgs[1]).parent().data('pressed', false);
        removeMode = false;

        placeMode = true;
        clickTarget.data('pressed', true);

        $(".farmObject").html("<img src = '" + prefix+ landTypeList[id].img + postfix +"' />");
        currentLandId = id;

        if (placeMode){
            $(".farmObject").css("display", "inline");
            clickTarget.html("<img src='/img/game/cancel2.svg' width='50%'>")
            currentClickedLand = clickTarget;

        }else{
            $(currentClickedLand).html("<img src = '" + prefix+ landTypeList[id].img + postfix +"' />Dirt");
            clickTarget.html("<img src = '" + prefix+ landTypeList[id].img + postfix +"' />Dirt");
            $(".farmObject").css("display", "none");
        }
    },

})

Template.gamingArea.events({
    'mouseenter .land div': function (event){
        if (plantMode){
            currentCropLand = event.target.className;

            var top = $(event.target)[0].getBoundingClientRect().top;
            var left = $(event.target)[0].getBoundingClientRect().left;

            var landTop = ($(".canvas").height()-$(window).height())/2;
            var landLeft = ($(".canvas").width()-$(window).width())/2;

            var resizeOffsetX = ($(window).width()-400)/6.5;
            var areaLeft = $(".gamingArea").position().left;
            var divHeight =$(".cropObject").height()/5;
            var divWidth = $(".cropObject").width()/1.65;
            // var divHeight =0;
            // var divWidth = 0;
            var posX = left+landLeft-areaLeft+divWidth-x+resizeOffsetX;
            //var posX = left+landLeft+divWidth-x;

            var posY = top+landTop-divHeight-y;


            var styles = {
                top: posY,
                left: posX,
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

            var landTop = ($(".canvas").height()-$(window).height())/2;
            var landLeft = ($(".canvas").width()-$(window).width())/2;

            var resizeOffsetX = ($(window).width()-400)/6.5;
            var areaLeft = $(".gamingArea").position().left;
            var divHeight =$(".cropObject").height()/10;
            var divWidth = $(".cropObject").width()/1.75;
            // var divHeight =0;
            // var divWidth = 0;
            var posX = left+landLeft-areaLeft+divWidth-x+resizeOffsetX;
            //var posX = left+landLeft+divWidth-x;

            var posY = top+landTop-divHeight-y;

            $(".farmObject").css({top: posY, left: posX, width:"150px", height:"150px", position:"absolute", opacity:0.5});

        }

    },
    'click .matchesBtn':function(event){
        var m_Id = $(event.target).attr("class").split("matchBtn")[1];
        MainActivity2Instance.updateConfirmation(m_Id, s_Id, 1, {from:web3.eth.accounts[currentAccount], gas:2000000});

        $(event.target).prop("value", "Waiting");
        $(event.target).prop("disabled", true);
    },
    // 'click .zoom':function(event){
    //     var data = $(".canvas").css("transform");
    //     var scale;
    //     if (data == 'none'){
    //       scale = 1;
    //     }else{
    //       var values = data.split('(')[1];
    //       values = values.split(')')[0];
    //       values = values.split(',');
    //
    //       var a = values[0];
    //       var b = values[1];
    //
    //       scale = Math.sqrt(a*a + b*b);
    //       console.log(scale);
    //     }
    //     console.log(scale);
    //
    //
    //
    //     if (event.target.className.split(" ")[1] == 'zoomin' && scale < 1.5){
    //         scale += 0.1;
    //     }else if (event.target.className.split(" ")[1] == 'zoomout' && scale > 0.5){
    //         scale -= 0.1;
    //
    //     }
    //     $(".canvas").css("transform", "scale(" + scale + ")");
    //
    // }
    'click .nav':function(event){
        var moveSpeed = 30;
        var data = $(".canvas").css('-webkit-transform');
        var negativeBoundary = -900;
        var boundary = 900;

        if (data == 'none'){
          x = 0;
          y = 0;
        }else{
          data = data.split(/[()]/)[1];
          x = parseInt(data.split(',')[4]);
          y = parseInt(data.split(',')[5]);
        }

        if (event.target.className.split(" ")[1] == 'navUp' && y < boundary){
            y += moveSpeed;
        }else if (event.target.className.split(" ")[1] == 'navDown' && y > negativeBoundary){
            y -= moveSpeed;
        }else if (event.target.className.split(" ")[1] == 'navLeft' && x < boundary){
            x += moveSpeed;
        }else if (event.target.className.split(" ")[1] == 'navRight' && x > negativeBoundary){
            x -= moveSpeed;
        }
        //$(".canvas").css("transform", "translate(" + x + "px, " +y+ "px)");
        $('.canvas').css('-webkit-transform',  'translateX(' + x+ 'px) translateY(' + y+ 'px)');
    }
})

function PanelControl(panelIndex){
    $(".statusPanel:nth-child("+panelCounter+")").removeClass("statusPanelShow");
    $(".statusPanel:nth-child("+panelCounter+")").css("z-index", -1);
    $(".crop"+panelCounter).css("background-color","rgba(255,255,255,0.45)");

    $(".crop"+panelIndex).css("background-color","rgba(255,255,255,0.65)");
    $(".statusPanel:nth-child("+panelIndex+")").css("z-index", 1);
    $(".statusPanel:nth-child("+panelIndex+")").addClass("statusPanelShow");
    panelCounter = panelIndex;

    if(panelCounter==3){
        set_property_table();
    }

    $(".cropObject").css("display", "none");
    $(".farmObject").css("display", "none");

    initAllBtns();
}

Template.statusList.events({
    'click .crop2' :function(){
        PanelControl(2);
    },
    'click .crop3' :function(){
        PanelControl(3);
    },
    'click .removeLand': function (event){

          clickTarget=null;
          $(".farmObject").css("display", "none");
          if (plantMode){
              $(".cropObject").css("display", "none");
              for(var k = 0; k < cropTypeList.length; k++){
                  $('.crop:nth-child(' + (k + 1) + ')').html("<img src = '" + prefix+ cropTypeList[k].img[3] + postfix +"' />" +  cropTypeList[k].name);
                  $('.crop:nth-child(' + (k + 1) + ')').data('pressed', false);
              }
              plantMode = false;
          }

          if(event.target.className==""){
            clickTarget=$(event.target).parent();
          }else{
            clickTarget=$(event.target);
          }

          if (clickTarget.data('pressed')){

              clickTarget.html("<img src='/img/game/background.svg'>Grass")
              clickTarget.data('pressed', false);
              removeMode = false;
              return;
          }

          removeMode = true;
          var imgs = $(".cropLand").find("img");
          imgs[0].src = prefix+ "land" + postfix;
          $(imgs[0]).parent().data('pressed', false);

          clickTarget.data('pressed', true);

          if (removeMode){
              clickTarget.html("<img src='/img/game/cancel2.svg' width='50%'>");

          }else{
              clickTarget.html("<img src='/img/game/background.svg'>Grass");
          }
    },
    // for tradable table to save
    'click #btn_tradeable_save':function(){
        save_tradable_setting();
    },
    'click #btn_tradeable_cancel':function(){
        sweetAlert("Warning", 'cancel', "warning");
        set_property_table();
    },
    'click .test': function(event){
        currentUser.level+=1;
        Session.set('userLevel', currentUser.level);

        GameCoreInstance.playerLevelUp(s_Id, Math.floor(Math.random()*3), {from:web3.eth.accounts[currentAccount], gas:3000000}, function(){

          _character.changed();
          levelUp("userLevel");
          if (currentUser.level%5 ==0){
              getUserData(s_Id);
          }
          rerenderCropLand(s_Id);
          Session.set("unlockCrop", cropTypeList.length);
        });

    },
    'click .matchmaking': function(event){
        MainActivityInstance.findOrigin({from:web3.eth.accounts[1], gas:5000000});
        updateUserData(s_Id);
        showConfirmation(s_Id);
    },
    'click .confirmMatches':function(event){
        MainActivity2Instance.checkConfirmation({from:web3.eth.accounts[0], gas:2000000});
        updateUserData(s_Id);
        showConfirmation(s_Id);

    },
})

Template.characterList.events({
    'click .characterImg':function(event){
        loading(1);
        if(currentCharacter == "farmer"){
            if(Session.get('userCharacter') == "Thief"){

                PanelControl(3);
                visitNode = getVisitNode();
                setStealRate(visitNode);
                rerenderCropLand(visitNode);
                $('.SyndicateExp').css('visibility', 'visible');
                $('.userExp').css('visibility', 'collapse');
                $('.functionSwitch').append($('<input></input>',{
                    type:'button',
                    name:'button',
                    class:'btn btn-primary nextHome',
                    value:'Next'
                }));
                gameMode = "Thief";
                $('.crop2').css('display','none');
                currentCharacter = "thief";
                loading(0);
            }
            else if(Session.get('userCharacter') == "Guard"){

                var gaurdMatchID = CongressInstance.getGuardMatchId.call(s_Id, {from: web3.eth.accounts[currentAccount]}).c[0];
                var matchLength = MainActivity2Instance.getMatchMakingLength.call(s_Id,  {from: web3.eth.accounts[currentAccount]}).c[0];
                var matchDiff = matchLength - gaurdMatchID;
                matchDiff = 3;
                if(matchDiff <= 2){
                    var guardData = CongressInstance.getGuardReqInfo.call(s_Id, {from:web3.eth.accounts[currentAccount]});
                    var guardLand = guardData[0].c[0];
                    var progress = guardData[1].c[0];
                    if(guardLand == 0){
                        sweetAlert("Oops...", "You have completed your mission.", "error");
                        loading(0);
                        return;
                    }
                    else{

                        PanelControl(3);
                        showThief = true;

                        $('.SyndicateExp').css('visibility', 'visible');
                        $('.userExp').css('visibility', 'collapse');
                        $(".front img").prop('src', "/img/game/guard.svg");
                        $(".back img").prop('src', "/img/game/farmer.svg");
                        if(progress == 0){
                            progress = thiefNumber(currentUser.SyndicateLevel);
                            currentUser.SyndicateProgress = progress;
                            CongressInstance.updateSyndicateProgress(s_Id, progress, {from: web3.eth.accounts[currentAccount], gas:2000000});
                        }

                        PanelControl(3);
                        showThief = true;
                        rerenderCropLand(guardLand);
                        gameMode = "Guard";
                        $('.SyndicateExp').css('visibility', 'visible');
                        $('.userExp').css('visibility', 'collapse');
                        $('.crop2').css('display','none');
                        landInfo = [];
                        for (var i = 0 ; i < userLandConfiguration.length ; i++){
                            var top = $('.cropLand'+i)[0].getBoundingClientRect().top;
                            var left = $('.cropLand'+i)[0].getBoundingClientRect().left;
                            var info = {top:top,left:left, showed:0};
                            landInfo.push(info);
                        }
                        currentUser.SyndicateProgress = progress;
                        checkMissionInterval = setInterval(checkMission, 1000);
                        currentCharacter = "guard";
                        gameMode = "Guard";
                    }
                }
                else{
                    //check guard property stock
                    var _propertyIndex = CongressInstance.getPropertyIndex.call(s_Id, {from:web3.eth.accounts[currentAccount]});
                    for(var i = 0; i < user_property.length; i++){
                        if(user_property[i].propertyType == (currentUser.SyndicateLevel + 29)){
                            if((user_property[i].propertyCount == 0) && (user_property[i].tradeable == 0)){
                                usingPropertyInstance.updatePropertyCount_Sudo(user_property[i].id , 1, 0, {from:web3.eth.accounts[currentAccount], gas:2514068});
                                user_property[i].propertyCount++;
                            }
                            break;
                        }
                    }
                    set_property_table();
                    sweetAlert("Oops...", "You are not assiged to any farm right now.", "error");
                    loading(0);
                    return;
                }
            }
        }
        else{
            currentCharacter = "farmer";

            showThief = false;
            clearInterval(checkMissionInterval);
            $(".missionObject").html("<div class='thiefObject'></div>");
            $('.SyndicateExp').css('visibility', 'collapse');
            $('.userExp').css('visibility', 'visible');
            $('.crop2').css('display','block');
            $('.functionSwitch').parent().find(".nextHome").remove();
            gameMode = "Farmer"
            rerenderCropLand(s_Id);
            loading(0);
        }
    },
    'mouseenter .flipDIV *':function(event){
      if (gameMode == "Farmer"){
        $('.characterImg').addClass('flipped');
      }else{
        $('.characterImg').removeClass('flipped');
      }
    },
    'mouseout .flipDIV *':function(event){
      if (gameMode == "Farmer"){
        $('.characterImg').removeClass('flipped');
      }else{
        $('.characterImg').addClass('flipped');
      }
    },
    'click .nextHome': function (event) {
        loading(1);
        visitNode = getVisitNode();
        setStealRate(visitNode);
        rerenderCropLand(visitNode);
        loading(0);
    },
    'click .musicSwitch': function (event) {
        if (!audio.paused){
            audio.pause();
            $(".musicSwitch").find("img").attr("src", "/img/game/speaker_off.svg");
        }else{
            audio.play();
            $(".musicSwitch").find("img").attr("src", "/img/game/speaker_on.svg");

        }

    },

    // 'mouseenter .userExp':function(event){
    //     $(".expHoverText").fadeIn();
    //     $(".expHoverText").css({"left":cursorX, "top":cursorY});
    // },
    // 'mouseout .userExp':function(event){
    //     $(".expHoverText").fadeOut();
    // },

})

Template.operationList.events({
    'click .menuButton': function(event) {
      if($(".menuButton").hasClass("open")===true){
        $(".rightMenuIcon").fadeOut('normal');
        $(".menuButton").removeClass("open");
      }else{
        $(".rightMenuIcon").fadeIn('normal');
        $(".menuButton").fadeTo("slow", 0.7);
        $(".menuButton").addClass("open");
      }
    },
    'click .shopOpen': function (e) {
        $(".mission_template").css("display", "none");
        $(".property_shop").css("display", "inline");
        set_propertyType_table();
    },
    'click .MissionOpen': function(event){
        $(".property_shop").css("display", "none");
        $(".mission_template").css("display", "inline");
        set_mission_table();
    }
})


/////////////////////////
//  Utility Functions  //
/////////////////////////


document.onmousemove = function(e){
    cursorX = e.pageX;
    cursorY = e.pageY;
}


var initAllBtns = function(){
  var imgs = $(".cropLand").find("img");
  $(imgs[0]).parent().html("<img src = '" + prefix+ "land" + postfix + "' />" + "Dirt");
  $(imgs[0]).parent().data('pressed', false);
  $(imgs[1]).parent().html("<img src = '/img/game/background.svg' />Grass");
  $(imgs[1]).parent().data('pressed', false);

  var imgs = $(".crop").find("img");

  for (var i = 0 ; i < imgs.length; i++){
      if ($(imgs[i]).parent().data('pressed')){
          $(imgs[i]).parent().html("<img src = '" + prefix+ cropTypeList[i].img[3] + postfix +"' />" +  cropTypeList[i].name);
          $(imgs[i]).parent().data('pressed', false);
      }
  }

  placeMode = false;
  plantMode = false;
  removeMode = false;
}

var eventListener = function(){

  // var events = MainActivityInstance.allEvents([{fromBlock: 0, toBlock: 'latest'}]);
  //
  // // watch for changes
  // events.watch(function(error, event){
  //   if (!error)
  //     console.log(event);
  // });

  // Or pass a callback to start watching immediately
  // var event = MainActivityInstance.matchSuccess({} , [{from: 0, to: 'latest'}] , function(error, result){
  //   if (!error)
  //     console.log(result);
  // });
  //
  // var event = MainActivityInstance.matchFail({} , [{fromBlock: 0, toBlock: 'latest'}] , function(error, result){
  //   if (!error)
  //     console.log(result);
  // });

  // watch for an event with {some: 'args'}
var events = MainActivityInstance.matchSuccess({fromBlock: 0, toBlock: 'latest'});
events.watch(function(error, result){
  console.log(result);
  updateUserData(s_Id);
  showConfirmation(s_Id);
});

// would get all past logs again.
events.get(function(error, logs){
    console.log(logs);
});


var events2 = MainActivityInstance.returnOrigin({fromBlock: 0, toBlock: 'latest'});
events2.watch(function(error, result){
    console.log(result);
});

// would get all past logs again.
events2.get(function(error, logs){
    console.log(logs);
});

}

var showConfirmation = function(s_Id){
    var length = currentUser.matches.length;
    if (length > 0){
        $(".systemInfo").css("transform", "translateX(0px)");
    }else{
        $(".systemInfo").css("transform", "translateX(600px)");
        return;
    }
    $(".matches").remove();

    for (var i = 0 ; i < length ; i++){

        var data = MainActivity2Instance.getMatchMaking.call(currentUser.matches[i], {from:web3.eth.accounts[currentAccount]});
        var owners = data[1];
        var properties = data[2];
        var tradeables = data[3];
        var index;

        for (var j = 0 ; j < owners.length ; j++){
            if (s_Id == owners[j].c[0]){
                index = j;
            }
        }

        var previousIndex = (index-1+owners.length)%owners.length


        var previousName = web3.toUtf8(CongressInstance.getStakeholder.call(parseInt(owners[previousIndex].c[0]), {from:web3.eth.accounts[currentAccount]})[0]);
        var type_Id = usingPropertyInstance.getPropertyType_Matchmaking.call(parseInt(properties[previousIndex].c[0]), {from:web3.eth.accounts[currentAccount]});
        var receiveProperty = usingPropertyInstance.getPropertyType.call(type_Id, {from:web3.eth.accounts[currentAccount]});

        type_Id = usingPropertyInstance.getPropertyType_Matchmaking.call(parseInt(properties[index].c[0]), {from:web3.eth.accounts[currentAccount]});
        var provideProperty = usingPropertyInstance.getPropertyType.call(type_Id, {from:web3.eth.accounts[currentAccount]});

        var row = $("<div>").attr("class", "matches match"+i);
        var fromAddr = $("<div>").text("from "+previousName);
        var receive = $("<div>").text("for " +web3.toUtf8(receiveProperty[0]) + "X" + tradeables[previousIndex].c[0]);
        var provide = $("<div>").text("You exchange " + web3.toUtf8(provideProperty[0]) + "X" + tradeables[index].c[0]);
        var checkBtn = $('<input>').attr( {
            type: 'button',
            class: "btn btn-info matchesBtn matchBtn"+currentUser.matches[i].c[0],
            value: 'Confirm'
        });
        row.append(provide).append(receive).append(fromAddr).append(checkBtn);



        $(".systemInfo").append(row);

        var confirmed = MainActivity2Instance.getMatchMakingConfirmed.call(currentUser.matches[i], s_Id, {from:web3.eth.accounts[currentAccount]});
        if (confirmed){
            $(".matchBtn"+currentUser.matches[i].c[0]).prop("value", "Waiting");
            $(".matchBtn"+currentUser.matches[i].c[0]).prop("disabled", true);

        }
    }

}

var getVisitNode = function(){
    var s_Length = CongressInstance.getStakeholdersLength.call({from:web3.eth.accounts[currentAccount]}).c[0];

    visitNode = s_Id;
    while (visitNode == s_Id){
        visitNode = Math.floor(s_Length*Math.random());
    }

    return visitNode;
}

//call with caution, this will consume lots of loading time
var fetchAllCropTypes = function(){

    var cropData = [];
    var typesList = [];

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


    for (var i = 0 ; i < cropData.length ; i++){
        var tempImg = [];
        for (var j = 0 ; j < 4; j++){
            var tempStr =  web3.toUtf8(usingPropertyInstance.getPropertyTypeImg(cropData[i][1].c[0], j, { from:web3.eth.accounts[currentAccount]})).toString();
            tempImg.push(tempStr);
            //tempImg.push(["carrot_seed", "carrot_grow", "carrot_harvest", "carrot"]);
            //tempImg.push("carrot_grow");
        }
        typesList.push({
          name : web3.toUtf8(cropData[i][0]),
          id : cropData[i][1].c[0],
          img: tempImg,
          time: web3.toUtf8(cropData[i][3]),
          count:cropData[i][4].c[0]

        })
    }

    return typesList;
}

var loadCropList = function(s_Id){
    cropList = [];
    var data = usingPropertyInstance.getCropList(s_Id, { from:web3.eth.accounts[currentAccount]});
    var countData = usingPropertyInstance.getCropListCount(s_Id, {from:web3.eth.accounts[currentAccount]});
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
            ripe: data[6][i],
            count: countData[i].c[0]
        });
    }

}


var getUserStockList = function(s_Id){
    var p_List = CongressInstance.getPropertyList(s_Id, { from:web3.eth.accounts[currentAccount]});

    var data = [];
    for (var i = 0 ; i < p_List.length ; i++){
        data.push(usingPropertyInstance.getPropertyByOwner(p_List[i].c[0], { from:web3.eth.accounts[currentAccount]}));
    }
    for (var i = 0 ; i < data.length ; i++){
      stockList.push({
          id: data[i][0].c[0],
          name: web3.toUtf8(data[i][1]),
          count: data[i][2].c[0],
          minUnit: data[i][3].c[0],
          extraData: web3.toUtf8(data[i][4]),
          type: data[i][5].c[0],
          tradeable: data[i][6].c[0]
      });
    }

}

var getUserData = function(s_Id){

    var data = CongressInstance.getStakeholder.call(s_Id, { from:web3.eth.accounts[currentAccount]});
    var syndicateData = CongressInstance.getSyndicateData.call(s_Id, {from:web3.eth.accounts[currentAccount]});
    var matches = CongressInstance.getStakeholderMatches.call(s_Id, { from:web3.eth.accounts[currentAccount]});

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
      thiefId: null,
      SyndicateExp:syndicateData[0].c[0],
      SyndicateTotalExp:syndicateData[1].c[0],
      SyndicateLevel:syndicateData[2].c[0],
      SyndicateProgress:0,
      matches : matches
    };
    var lastLogin = CongressInstance.getStakeholderLastLogin(s_Id, { from:web3.eth.accounts[currentAccount]});

    if (web3.toUtf8(lastLogin) == 0){
        return;
    }

    lastLogin = web3.toUtf8(lastLogin).split(".")[0]+"Z";
    lastLogin = new Date(lastLogin.split("\"")[1]);

    var difference = elapsedTime(lastLogin, new Date());

    currentUser.sta += Math.round(difference.getTime()/(1000*60));
    var staCap = staminaCap(currentUser.level);

    if (currentUser.sta >= staCap ){
        currentUser.sta = staCap;
    }
    // end = end.split("\"")[1];

}

var updateUserData = function(s_Id){

    var data = CongressInstance.getStakeholder.call(s_Id, { from:web3.eth.accounts[currentAccount]});
    var syndicateData = CongressInstance.getSyndicateData.call(s_Id, {from:web3.eth.accounts[currentAccount]});
    var matches = CongressInstance.getStakeholderMatches.call(s_Id, { from:web3.eth.accounts[currentAccount]});

    currentUser.exp =  data[1].c[0];
    currentUser.totalExp = data[2].c[0];
    currentUser.landSize = data[4].c[0];
    currentUser.level = data[5].c[0];
    currentUser.SyndicateExp = syndicateData[0].c[0];
    currentUser.SyndicateTotalExp = syndicateData[1].c[0];
    currentUser.SyndicateLevel = syndicateData[2].c[0];
    currentUser.matches = matches;
    // end = end.split("\"")[1];

}

var getLandConfiguration = function(s_Id){
    userLandConfiguration = [];
    var data = usingPropertyInstance.getUserLandConfiguration.call(s_Id, { from:web3.eth.accounts[currentAccount]});
    landSize = Math.sqrt(data[0].length);

    var contractLandData = data[0];
    var contractCropData = data[1];

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

}

var fetchGameInitConfig = function(s_Id){
    var cropData = [];
    var landData = [];
    userCropType = [];
    cropTypeList = [];
    landTypeList = [];

    var userCropTypeData = usingPropertyInstance.getUserPropertyType(s_Id, { from:web3.eth.accounts[currentAccount]});
    for (var i = 0 ; i < userCropTypeData[0].length ; i++){
        userCropType.push({
            id: userCropTypeData[0][i].c[0],
            count: userCropTypeData[1][i].c[0],
        });
    }

    for (var i = 0 ; i < userCropType.length; i++){
        cropData.push(usingPropertyInstance.propertyTypeList(userCropType[i].id));
    }

    var flag = true;
    var i = 0;

    while (flag){
      try{
        landData.push(usingPropertyInstance.landTypeList(i));
        i++;
      }
      catch(err) {
        flag = false;
      }
    }

    for (var i = 0 ; i < cropData.length ; i++){
        var tempImg = [];
        for (var j = 0 ; j < 5; j++){
            var tempStr =  web3.toUtf8(usingPropertyInstance.getPropertyTypeImg(cropData[i][1].c[0], j, { from:web3.eth.accounts[currentAccount]})).toString();
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
    _crop.changed();

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

var rerenderCropLand = function(id){
    getLandConfiguration(id);
    loadCropList(id);
    fetchGameInitConfig(id);
    initCropLand(id);
    getUserStockList(id);
    loading(0);
}

var initCropLand = function(id){


    $('.land').html("");
    $(".surfaceObject").html("");
    $(".surfaceObject").append("<div class='cropObject'></div>");
    $('.land').css("width", blockSize*landSize );
    $('.land').css("height", blockSize*landSize );

    for (var i = 0 ; i < landSize*landSize; i++){
        $('.land').append("<div class='farm cropLand" + i + "'></div>");
        if (userLandConfiguration[i].land == -1){
            $('.cropLand'+i).css("border", '1px solid black');
        }
        //$('.land').append("<div></div>");
    }

    console.log(cropList);
    console.log(userLandConfiguration);


    landInfo = [];
    for (var i = 0 ; i < userLandConfiguration.length ; i++){

        if (userLandConfiguration[i].land == -1){
            continue;
        }
        $(".farmObject").html("<img src = '" + prefix+ landTypeList[userLandConfiguration[i].land].img + postfix +"' />");
        $(".farmObject" ).children().clone().appendTo(".cropLand"+ i).css({opacity:1});


        if (userLandConfiguration[i].crop == -1){
            continue;
        }

        /*
        var top = $('.cropLand'+i)[0].getBoundingClientRect().top;
        var left = $('.cropLand'+i)[0].getBoundingClientRect().left;

        var landTop = $(".land").position().top;
        var landLeft = $(".land").position().left;

        var areaLeft = $(".gamingArea").position().left;

        var divHeight =$(".cropObject").height()/5;
        var divWidth = $(".cropObject").width()/4;
        */

        var top = $('.cropLand'+i)[0].getBoundingClientRect().top;
        var left = $('.cropLand'+i)[0].getBoundingClientRect().left;


        var landTop = ($(".canvas").height()-$(window).height())/2;
        var landLeft = ($(".canvas").width()-$(window).width())/2;

        var resizeOffsetX = ($(window).width()-400)/6.5;
        var areaLeft = $(".gamingArea").position().left;
        var divHeight =$(".cropObject").height()/5;
        var divWidth = $(".cropObject").width()/1.65;
        // var divHeight =0;
        // var divWidth = 0;
        var posX = left+landLeft-areaLeft+divWidth-x+resizeOffsetX;
        //var posX = left+landLeft+divWidth-x;

        var posY = top+landTop-divHeight-y;

        var styles = {
            top: posY,
            left: posX,
            width:"150px",
            height:"150px",
            position:"absolute",
            opacity:1,
            "z-index":2
        };



        var info = {top:posY,left:posX, showed:0};
        landInfo.push(info);

        var index = userLandConfiguration[i].crop;
        if (index == -1){
          return;
        }

        var difference = elapsedTime(new Date(), cropList[index].end);
        var originDifference = elapsedTime(cropList[index].start, cropList[index].end);
        var percent = difference/originDifference;

        var typeIndex;
        for (var j = 0 ; j < cropTypeList.length ; j++){
            if (cropTypeList[j].id == cropList[index].type){
                typeIndex = j;
                break;
            }else{
            }
        }

        if (percent > 0.6){
            $(".cropObject").html("<img src = '" + prefix+ cropTypeList[typeIndex].img[0] + postfix +"' />");
        }
        if (percent <= 0.6){
            $(".cropObject").html("<img src = '" + prefix+ cropTypeList[typeIndex].img[1] + postfix +"' />");
        }
        if (percent <= 0){
            $(".cropObject").html("<img src = '" + prefix+ cropTypeList[typeIndex].img[2] + postfix +"' />");
            //cropList[i].ripe = 1;
        }
        //0430 wait to change stolen svg
        var stolenFlag = "f";
        if(cropList[index].count != cropTypeList[typeIndex].count){
            $(".cropObject").html("<img src = '" + prefix+ cropTypeList[typeIndex].img[4] + postfix +"' />");
            stolenFlag = "t";
        }
        //var diffData = (difference.getDate()-1)+" Days. "+(difference.getHours()-8)+' Hrs. '+difference.getMinutes()+' Mins. '+difference.getSeconds()+" Secs";
        //$(".currentCrop"+index).html(diffData);


        //$(".cropObject").html("<img src = '" + prefix+ cropTypeList[config[i].crop].img[0] + postfix +"' />");
        $( ".cropObject" ).clone().attr("class","croppedObject croppedObject"+index).attr("cropCount", cropList[index].count).attr("stolenFlag", stolenFlag).appendTo(".surfaceObject").css(styles);


    }
}

var levelCap = function(n){
    var powerResult = 1;
    for (var i = 0 ; i < n ; i++){
        powerResult *= 2;
    }
    return powerResult*100;
}

var SyndicateLevelCap = function(n){
    return n * 100;
}

var staminaCap = function(n){
    return 100+n*10;
}

var thiefNumber = function(n){
    return n * 10;
}

var updateStaminaBar = function(consumedSta){
    var staCap = staminaCap(currentUser.level);

    currentUser.sta -= consumedSta;
    var percent = (currentUser.sta/staCap)*100;
    $(".staProgressBar").css("width", percent + "%");
    $(".staText").text(Math.floor(percent)+"%");
    //$(".staHoverText").text(currentUser.sta+"/"+staCap);

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

  if  (currentUser.exp >= lvlCap){

    currentUser.level += 1;
    _character.changed();
    Session.set('userLevel', currentUser.level);
    currentUser.exp = currentUser.exp - lvlCap;

    CongressInstance.updateUserExp(s_Id, currentUser.exp, {from:web3.eth.accounts[currentAccount], gas:2000000});

    GameCoreInstance.playerLevelUp(s_Id, Math.floor(Math.random()*3), {from:web3.eth.accounts[currentAccount], gas:3000000}, function(){
      levelUp("userLevel");
      getUserData(s_Id);
      rerenderCropLand(s_Id);
      lvlCap = levelCap(currentUser.level);
      Session.set("unlockCrop", cropTypeList.length);

    });

  }else{
    CongressInstance.updateUserExp(s_Id, currentUser.exp, {from:web3.eth.accounts[currentAccount], gas:2000000});
  }

  var percent = Math.floor((currentUser.exp/lvlCap)*100);
  $(".expProgressBar").css("width", percent + "%");
  $(".expText").text(percent+"%");
  //$(".expHoverText").text(currentUser.exp+ " / " +lvlCap);


}

var updateSyndicateExp = function(exp){
    if(currentUser.SyndicateLevel <= 9){
        currentUser.SyndicateExp += parseInt(exp);
        currentUser.SyndicateTotalExp += currentUser.SyndicateExp;
        var lvlCap = SyndicateLevelCap(currentUser.SyndicateLevel);

        if  (currentUser.SyndicateExp >= lvlCap){
            if(Session.get('userCharacter') == "Guard"){
                setGuardProperty();
            }

            currentUser.SyndicateLevel += 1;
            $(".front").find("h3").text("LV. " + currentUser.SyndicateLevel);
            _character.changed();
            Session.set('SyndicateLevel', currentUser.SyndicateLevel);
            currentUser.SyndicateExp = currentUser.SyndicateExp - lvlCap;
            levelUp('Syndicate');
            lvlCap = SyndicateLevelCap(currentUser.SyndicateLevel);
        }
        CongressInstance.updateSyndicateExp(s_Id, currentUser.SyndicateExp, currentUser.SyndicateLevel,{from:web3.eth.accounts[currentAccount], gas:2000000});


        var percent = (currentUser.SyndicateExp/lvlCap)*100;
        $(".SyndicateExpProgressBar").css("width", percent + "%");
        //$(".SyndicateExpText").text(currentUser.SyndicateExp+"/"+lvlCap);
    }

    CongressInstance.updateSyndicateExp(s_Id, currentUser.SyndicateExp, currentUser.SyndicateLevel,{from:web3.eth.accounts[currentAccount], gas:2000000});


    var percent =  Math.floor((currentUser.SyndicateExp/lvlCap)*100);
    $(".SyndicateExpProgressBar").css("width", percent + "%");
    //$(".SyndicateExpText").text(currentUser.SyndicateExp+"/"+lvlCap);
    $(".SyndicateExpText").text(percent+"%");

}

var levelUp = function(_type){
    if(_type == 'userLevel'){
        Session.set('Levelup', currentUser.level);
        Session.set('staminaCap', staminaCap(currentUser.level));
        Session.set('expCap', levelCap(currentUser.level));
    }
    else{
        Session.set('Levelup', currentUser.SyndicateLevel);
    }

    $(".levelUp").fadeIn().delay(5000).fadeOut();
}

var setGuardProperty = function(){
    var propertyIndex, userIndex;
    for(var i = 0; i < user_property.length; i++){
        if((user_property[i].propertyType - 29) == currentUser.SyndicateLevel){
            propertyIndex = user_property[i].id;
            userIndex = i;
            break;
        }
    }
    user_property[userIndex].propertyCount = 0;
    user_property[userIndex].tradeable = 0;
    user_property[userIndex + 1].propertyCount = 1;
    user_property[userIndex + 1].tradeable = 0;
    usingPropertyInstance.updatePropertyCount_Sudo(propertyIndex, 0, 0, {from:web3.eth.accounts[currentAccount], gas:2000000});
    usingPropertyInstance.updatePropertyCount_Sudo((propertyIndex + 1), 1, 0, {from:web3.eth.accounts[currentAccount], gas:2000000});

}

var setStealRate = function(visitNode){
    var thisGuardId = CongressInstance.getGuardId.call(visitNode, {from: web3.eth.accounts[currentAccount]});
    var thisGuardLvl;
    if(thisGuardId != 0){
        var GuardData = CongressInstance.getSyndicateData.call(thisGaurdId, {from: web3.eth.accounts[currentAccount]});
        thisGuardLvl = GuardData[2].c[0];
    }
    else{
        thisGuardLvl = 0;
    }
    stealRate = (80 * (thisGuardLvl / 10) - 40 * (currentUser.SyndicateLevel / 10)) / 100;
}

var checkMission = function(){
    if (showThief){
        var maxCount = (thiefNumber(currentUser.SyndicateLevel) / 2);
        if($('.thief').length > maxCount)
        {
            do{
                var removeRand = Math.round(Math.random() * maxCount);
            }while(removeRand >= $('.thief').length);
            var removeObj = $('.thief:eq('+ removeRand +')');
            var removeIndex = removeObj.attr('bindIndex');
            landInfo[removeIndex].showed = 0;
            removeObj.css({opacity:0, transform:"translateY(50px)"});
            removeObj.remove();
        }
        else{
            var show;
            do{
                var rand = Math.round(Math.random() * userLandConfiguration.length);
                show = landInfo[rand].showed;
            }while(show != 0);

            var top =landInfo[rand].top;
            var left = landInfo[rand].left;

            var areaLeft = $(".gamingArea").position().left;
            var divHeight =$(".cropObject").height()/5;
            var divWidth = $(".cropObject").width()/1.65;


            var missionStyles = {
                top:top-(divHeight*2),
                left:left-areaLeft+(divWidth*3),
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
                $( ".thiefObject" ).clone().attr("class","thief thief"+theifId++).appendTo(".missionObject").css(missionStyles).attr('bindIndex', rand);
                landInfo[rand].showed = 1;
            }
        }
    }
    else{
        $(".missionObject").html("<div class='thiefObject'></div>");
    }

}

var cropSummaryUpdate = function(){
    for (var i = 0 ; i < cropList.length ; i++){
        if (cropList[i].name == 0 || cropList[i].ripe ){
            continue;
        }
        var difference = elapsedTime(new Date(), cropList[i].end);
        var originDifference = elapsedTime(cropList[i].start, cropList[i].end);
        var percent = difference/originDifference;

        var index;
        for (var j = 0 ; j < cropTypeList.length ; j++){
            if (cropTypeList[j].id == cropList[i].type){
                index = j;
                break;
            }
        }

        if (percent > 0.6){
            $(".croppedObject"+cropList[i].id).find("img").attr("src",prefix+cropTypeList[index].img[0]+postfix);
        }
        if (percent <= 0.6){
            $(".croppedObject"+cropList[i].id).find("img").attr("src",prefix+cropTypeList[index].img[1]+postfix);
        }
        if (percent <= 0){
            if(cropList[i].count != cropTypeList[index].count){
                $(".croppedObject"+cropList[i].id).find("img").attr("src",prefix+cropTypeList[index].img[4]+postfix);
            }
            else{
                $(".croppedObject"+cropList[i].id).find("img").attr("src",prefix+cropTypeList[index].img[2]+postfix);
            }
            cropList[i].ripe = 1;
            //$(".currentCrop"+cropList[i].id).parent().remove();
            $(".timeLeft"+cropList[i].id).html("Ready to harvest");

            continue;
        }

        //var diffData = (difference.getDate()-1)+" Days. "+(difference.getHours()-8)+' Hrs. '+difference.getMinutes()+' Mins. '+difference.getSeconds()+" Secs";
        var diffData = (difference.getHours()-8)+' Hrs. '+difference.getMinutes()+' Mins. '+difference.getSeconds()+" Secs";
        $(".timeLeft"+i).html(diffData);
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
    var _propertyIndex = CongressInstance.getPropertyIndex.call(s_Id, {from:web3.eth.accounts[currentAccount]});
    var propertyTypeLength = usingPropertyInstance.getPropertyTypeLength.call({from:web3.eth.accounts[currentAccount]});
    var _goal = _propertyIndex.c[0] +  propertyTypeLength.c[0];
    for(i = _propertyIndex.c[0]; i < _goal; i++){
        var propertyData = usingPropertyInstance.getPropertyTo2(i, web3.eth.accounts[currentAccount], {from:web3.eth.accounts[currentAccount]}, function(err, result){
            if(err){
                console.log(err);
            }
            else{
                var _id = result[0].c[0];
                var _propertyType = result[1].c[0]
                var _name = web3.toUtf8(result[2]);
                var _propertyCount = result[3].c[0];
                var _tradeable = result[4].c[0];
                var _img = web3.toUtf8(result[5]);
                var data = {"id":_id, "propertyType":_propertyType, "name":_name, "propertyCount":_propertyCount,  "tradeable":_tradeable, "img": _img};
                user_property.push(data);
                console.log(i);
            }
        });
    }

}

get_propertyType_setting = function(_length){
    display_field = [];

    for(i = 0; i < _length; i++){
        var property_type = usingPropertyInstance.getPropertyType.call(i,currentAccount, {from:web3.eth.accounts[currentAccount]}, function(err, result){
            var _name = web3.toUtf8(result[0]);
            var _id =  result[1].c[0];
            var _rating = result[3].c[0]/floatOffset;
            var _averageRating = result[2].c[0]/floatOffset;

            var data = {"name": _name,"id":_id, "rating": _rating, "averageRating":_averageRating};
            display_field.push(data);
        });
    }
}

set_property_table = function(){
    var propertyTypeLength = usingPropertyInstance.getPropertyTypeLength.call(0, {from:web3.eth.accounts[currentAccount]}).c[0];
    if(user_property.length != propertyTypeLength){
        loading(1);
        setTimeout(set_property_table, 1000);
    }
    else{
        //loading(1);
        //get_user_property_setting();

        loading(0);
        var table, tr, td;

        $('.tradeable_content').html('');
        table = $('<table></table>').attr('id', 'property_trade_table')
                                    .attr('class', 'property_shop_table');
        //content
        var flag = 0;
        for(i = 0; i < user_property.length; i++){
            if((user_property[i].propertyCount != 0) || (user_property[i].tradeable != 0)){
                if (flag == 0){
                  flag++;
                  tr = $('<tr></tr>');
                  tr.append($('<th></th>').text('Property'));
                  tr.append($('<th></th>').text('Stock Number'));
                  tr.append($('<th></th>').text('Tradable Number'));
                  table.append(tr);
                }
                tr = $('<tr></tr>');
                td = $('<td></td>');
                td.append($('<img></img>', {
                    src:prefix+user_property[i].img + postfix,
                    style:'width:50px; height:50px'
                })).append("<div>"+user_property[i].name+"</div>");
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
        }


        if (!flag){
            tr = $('<tr></tr>');
            tr.append($('<th></th>').text('No Stock Found'));
            table.append(tr);
        }
        //content
        //control bar

        //control bar
        $('.tradeable_content').append(table);
    }
}

index_finder = function(_source, _mask){
    var res = _source.substring(_mask.length, _source.length);
    return res;
}

set_propertyType_table = function () {
    loading(1);
    var propertyTypeLength = usingPropertyInstance.getPropertyTypeLength.call(0, {from:web3.eth.accounts[currentAccount]});
    get_propertyType_setting(propertyTypeLength.c[0]);
    rend_propertyType_table(propertyTypeLength.c[0]);
}

rend_propertyType_table = function(_length){
    if(display_field.length != _length){
        setTimeout(function(){
            rend_propertyType_table(_length);
        },1000);
    }
    else{
        var table, tr, td, property_index;
        loading(1);
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
            td.append($('<label>').attr('for', 'rating' + i).html(display_field[i].rating));
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
            tr.append(td);
            tr.append($('<td></td>').text(display_field[i].averageRating));
            table.append(tr);
        }
        //content
        //control bar
        tr = $('<tr></tr>');
        td = $('<td></td>').attr('colspan', 3);
        td.append($('<button></button>').attr( {
            // type: 'button',
            id: 'btn_property_save',
            value: 'SAVE',
            class:'hvr-rectangle-out',
        }).append('SAVE').on('click', function () {
            save_rating_setting();
            $('.property_shop').css('display', 'none');
        }));
        td.append($('<button></button>').attr( {
            // type: 'button',
            id: 'btn_property_cancel',
            value: 'CANCEL',
            class:'hvr-rectangle-out'
        }).append('CANCEL').on('click', function () {
            set_propertyType_table();
            // sweetAlert("Warning!", 'cancel', "warning");
        }));
        tr.append(td);
        table.append(tr);
        //control bar
        $('.shop_content').append(table);
        loading(0);
    }
}

save_tradable_setting = function(){
    loading(1);
    for(i = 0; i < $('.shop_tradable_input').length; i++){
        var _id = index_finder( $('.shop_tradable_input')[i].id, 'tradable_input_');
        var _tradable = $('#tradable_input_' + _id).val();
        var _propertyCount = parseInt($('#shop_stock_' + _id).val(),10) - parseInt(_tradable,10);
        for(j = 0; j < user_property.length; j++){
            if(user_property[j].id == _id){
                user_property[j].propertyCount = _propertyCount;
                user_property[j].tradeable = _tradable;
                break;
            }
        }
        usingPropertyInstance.updatePropertyCount(_id,_propertyCount,_tradable, {from:web3.eth.accounts[currentAccount],gas:200000}, function(err, result){
            if(err){
                console.log(err);
            }
        });
    }
    loading(0);
    sweetAlert("Congratulations!", "Setting Saved!", "success");

}

save_rating_setting = function () {
    loading(1);
    for(i = 0; i < display_field.length;i++){
        var _id = parseInt(display_field[i].id,10);
        var _rate = parseInt($('#rating' + i).val(),10);
        usingPropertyInstance.updatePropertyTypeRating(_id, _rate*floatOffset, "update", {from:web3.eth.accounts[currentAccount],gas:200000}, function(err, result){
            if(err){
                console.log(err);
            }
        });
    }
    loading(0);
    sweetAlert("Congratulations!", "Rating Saved!", "success");
}

/////////////////////////
//  Mission Functions  //
/////////////////////////
var mission_list = [];

get_mission_list = function(){
    var item, result, _cropId, _cropName, _quantity, _missionId, _missionName, _exp, _lvl_limitation, _accountStatus;
    var mission_count = GameCoreInstance.getMissionsLength.call({from: web3.eth.accounts[currentAccount]});
    mission_list = [];
    var mission_source = GameCoreInstance.getMission.call({from:web3.eth.accounts[currentAccount]}, function(err, result){


        for(i = 0; i < result[0].length; i++){
            var _id = result[0][i].c[0];;
            var _name = web3.toUtf8(result[1][i]);
            var _exp = result[2][i].c[0];
            var _limitation = result[3][i].c[0];
            var _solved = result[4][i];
            mission = {id: _id, name:_name, exp: _exp, lvl_limitation: _limitation, solved:_solved,items:[]};

            item_source = GameCoreInstance.getMissionItemsArray.call(_id, {from:web3.eth.accounts[currentAccount]});
            for(j = 0; j < item_source[0].length; j++){
                var _crop_id = item_source[0][j].c[0];
                var res = find_propertyInfo(_crop_id);
                var _crop_name = res.name;
                var _quantity = item_source[1][j].c[0];
                var _img = res.img;
                // item = {crop_id:item_source[0].c[0], crop_name: web3.toUtf8(item_source[1]), quantity:item_source[2].c[0], img:web3.toUtf8(item_source[3])};
                item = {crop_id:_crop_id, crop_name:_crop_name, quantity:_quantity, img:_img};
                mission.items.push(item);
            }
            mission_list.push(mission);
        }
    });
}

find_propertyInfo = function(item_id){
    for(k = 0; k < user_property.length; k++){
        if(user_property[k].propertyType == item_id){
            target_crop = {crop_name: user_property[k].name, img: user_property[k].img};
            return(target_crop);
        }
    }
}

set_mission_table = function(){
    loading(1);
    get_mission_list();
    mission_rending();
}

mission_rending = function(){
    if(mission_list.length == 0){
        setTimeout(function(){
            mission_rending();
        }, 1000);
    }
    else{
        $('.mission_template').html('');
        $('.mission_template').append($('<button></button>',{
            type:'button',
            id:'btn_mission_close',
            class:'btnClose'
            // html:$("<img>",{src:"/img/game/cancel.svg",alt:""})
        })
        .on('click', function(){ $('.mission_template').css('display','none'); }).text('X')
      ).append($('<div></div>',{
          class:'mission_header'
      }).text('Mission'));


        var div, table, tr, td;
        div=$('<div></div>',{class:'mission_content'})
        table = $('<table></table>',{id:'mission_table'});
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

            if(!mission_list[i].solved){
                tr = $('<tr></tr>');
                td = $('<td></td>',{
                    text:mission_list[i].name
                });
                tr.append(td);
                td = $('<td></td>');
                for(j = 0; j < mission_list[i].items.length; j++){
                    td.append($('<img></img>',{
                        src: prefix + mission_list[i].items[j].img+postfix,
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
            div.append(table);
        }
        //content
        $('.mission_template').append(div);
        //get_user_property_setting();
        for(k = 0; k < mission_list.length;k++){
            mission_qualify_check(mission_list[k].id);
        }
        loading(0);
    }
}

mission_submit = function(_id){
    updateUserExp(parseInt($('#mission_exp_' + _id).val(),10));
    GameCoreInstance.submitMission(_id,  { from: web3.eth.accounts[currentAccount], gas: 2000000 });
    set_mission_table();
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

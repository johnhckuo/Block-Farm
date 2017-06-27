// JavaScript source code
import { Tracker } from 'meteor/tracker';
import { Session } from 'meteor/session';
import { property_type } from '../imports/collections.js';
import { land_type } from '../imports/collections.js';
import { mission } from '../imports/collections.js';
import { matches } from '../imports/collections.js';
import { callPromise } from '../imports/promise.js';
import './string.js';
import { dbPromise } from '../imports/promise.js';
import { questionnaires } from '../imports/collections.js';


var landSize = 3;
var blockSize = 150;
var landSrc = "/img/game/land.svg";

var prefix = "/img/game/plant/";
var postfix = ".svg";

var currentMatches = [];

var unlockCropNum = 3;
var unlockCropLevel = 5;

var currentCropId;
var plantMode = false;
var currentLandId;
var placeMode = false;
var currentCropLand;
var audio;
var removeMatchesTag = false;

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

var cropData = [];
var landData = [];

var staminaList = { crop: 3, steal: 10, stealFail: 20 };

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

var floatOffset = 1;

var checkMissionInterval = null;
var theifId = 0;
var landInfo = [];
var stealRate;

var tutorialMode = 0; //no tutorial
var targetCircleDiv = null;
var targetCircleTemp = null;
var cntAddLand = 0;  //for first time to add land
var cntAddCrop = 0;  //for first time to add plant/crop
var currentString = "";
var stringPosition = "";
var resizeWidth = 2; //for set the size for createTip
var circleNeed = true;
var stringNeed = true;
var t1PageCnt = 0;
var t2PageCnt = 0;
var t3PageCnt = 0;
var tPageBtn = false;

var onchangedIndex = [];
var systemInfoShowed = false;

var currentPage, pagerCounter;


///////////////////////////
//  prototype functions  //
///////////////////////////

Date.prototype.addTime = function (days, hours, minutes, seconds) {
    var dat = new Date();

    dat.setDate(dat.getDate() + days);
    dat.setHours(dat.getHours() + hours);
    dat.setMinutes(dat.getMinutes() + minutes);
    dat.setSeconds(dat.getSeconds() + seconds);

    return dat;
}

gameIndexCreation = async function () {
    await getStakeholderId();
    await fetchAllCropTypes();
    await getUserData(s_Id);
    await getLandConfiguration(s_Id);
    await loadCropList(s_Id);
    await getUserStockList(s_Id);
    await fetchGameInitConfig(s_Id);
}
getStakeholderId = function () {
    if (Meteor.user() == null) {
        sweetAlert("Oops...", "Please Register First", "error");
        Router.go('/');
        return;
    }
    s_Id = Meteor.user().profile.game.stakeholder.id;
}

gameIndexRend = function () {
    $(".levelUp").hide();
    get_user_property();

    updateUserExp(0);
    updateSyndicateExp(0);
    updateStaminaBar(0);

    initCropLand(s_Id);
    //showConfirmation(s_Id);

    Session.set('userName', currentUser.name);
    Session.set('userExp', currentUser.exp);
    Session.set('userSta', currentUser.sta);
    Session.set('userCharacter', currentUser.type);
    Session.set('userLevel', currentUser.level);
    Session.set('SyndicateLevel', currentUser.SyndicateLevel);
    Session.set('switchToType', currentUser.type);

    setInterval(cropSummaryUpdate, 1000);
    setInterval(updateUserStamina, 10000);

    loading(0);

    if (currentUser.level == 0) {
        $(".tutorialContainer").fadeIn();
    }
}

/////////////////
//  onCreated  //
/////////////////

Template.gameContent.created = function () {

}



Template.gameIndex.created = function () {

    var isChromium = window.chrome,
        winNav = window.navigator,
        vendorName = winNav.vendor,
        isOpera = winNav.userAgent.indexOf("OPR") > -1,
        isIEedge = winNav.userAgent.indexOf("Edge") > -1,
        isIOSChrome = winNav.userAgent.match("CriOS");

    if (isIOSChrome) {
        // is Google Chrome on IOS
    } else if (isChromium !== null && isChromium !== undefined && vendorName === "Google Inc." && isOpera == false && isIEedge == false) {
        // is Google Chrome
    } else {
        // not Google Chrome 
        sweetAlert("Oops...", "For your best using experience, please use Google Chrome browser", "error");
    }

    if (Meteor.userId()) {
        Session.set("loggedIn", true);
    } else {
        Session.set("loggedIn", false);
    }
};




//////////////////
//  onRendered  //
//////////////////

Template.gameContent.rendered = function () {
    if (!this._rendered) {
        createDBConnection();
        checkDBLoaded(async function (value) {
            var id = Meteor.userId();
            if (id) {
                Session.set("id", id);
            } else {

                swal({
                    title: "Oops...",
                    text: "You have to login first!",
                    type: "warning",
                    showCancelButton: false
                },
                    function () {
                        Router.go('/');
                    });
            }
            await gameIndexCreation();
            await gameIndexRend();

            //eventListener();
            audio = new Audio('/music/background_music.mp3');
            //audio.play();
        });
        $(window).resize(function (evt) {
            initCropLand();
        });
    }
}

Template.shop.rendered = function () {

}

//////////////////
//    onLeave   //
//////////////////

$(window).on("beforeunload", function () {
    Meteor.call('updateStakeholderLastLogin', s_Id);
    Meteor.call('updateUserStamina', s_Id, currentUser.sta);
    console.log("Porgress Saved");
    return true ? "Do you really want to close?" : null;
})

///////////////
//  Helpers  //
///////////////


Template.gameIndex.helpers({
    loggedIn: function () {
        if (Meteor.userId()) {
            Session.set("loggedIn", true);
        } else {
            Session.set("loggedIn", false);
        }
        return Session.get("loggedIn");
    }
});


Template.shop.helpers({

});

Template.gamingArea.helpers({
    currentLevel: function () {
        _character.depend();
        return Session.get('Levelup');
    },
    staminaCap: function () {
        return "Stamina Capacity: " + Session.get('staminaCap');
    },
    expCap: function () {
        return "Exp Capacity: " + Session.get('expCap');
    },
    unlockCrop: function () {
        if ((Session.get('userLevel') % 5) == 0) {
            if (previousUnlockCrop != Session.get('unlockCrop')) {
                previousUnlockCrop = Session.get('unlockCrop');
                return "Unlock Crop: " + cropTypeList[Session.get('unlockCrop')].name;
            }
        }
        else {
            return "";
        }
    }
});

Template.characterList.helpers({
    userLevel: function () {
        return "LV. " + Session.get('userLevel');
    },
    userSyndicateLevel: function () {
        return "LV. " + Session.get('SyndicateLevel');
    },
    userName: function () {
        return Session.get('userName');
    },
    characterType: function () {
        if (Session.get('userCharacter') == "Thief") {
            return "/img/game/thief.svg";
        } else {
            return "/img/game/guard.svg";

        }
    },
    characterTypeName: function () {
        return Session.get('switchToType');
    },
    expTip: function () {
        _character.depend();
        return currentUser.exp + "/" + levelCap(currentUser.level);
    },
    staTip: function () {
        _character.depend();
        return currentUser.sta + "/" + staminaCap(currentUser.level);
    },
    expSyndicate: function () {
        _character.depend();
        return currentUser.SyndicateExp + "/" + SyndicateLevelCap(currentUser.SyndicateLevel);
    },
});

Template.statusList.helpers({
    crops: function () {
        try {
            var _cropTypeList = Session.get('cropTypeList');
            var cropsData = [];
            for (var i = 0; i < _cropTypeList.length; i++) {
                var data = _cropTypeList[i];

                cropsData.push({
                    "name": "crop plantButton property" + i,
                    "img": prefix + data.img[3] + postfix,
                    "content": data.name
                });
            }
            _crop.depend();
            return cropsData;
        }
        catch (e) {

        }
    },
    lands: function () {
        try {
            var landsData = [];
            var _landTypeList = Session.get('landTypeList');
            for (var i = 0; i < _landTypeList.length; i++) {
                var data = _landTypeList[i];

                landsData.push({
                    "name": "cropLand farmLand" + data.id,
                    "img": prefix + data.img + postfix,
                    "content": data.name
                });
            }
            return landsData;
        }
        catch (e) { }
    },
});

//////////////
//  Events  //
//////////////

Template.gameIndex.events({
    'click .forget-password': function () {
        $(".resetPasswordContainer").fadeIn(1000);
        loading(0);
    },
    'click .resetPassword': async function () {
        var email = $("[name=resetPassword]").val();
        try {
            var res = await Accounts.forgotPassword({ email: email });
        } catch (e) {
            sweetAlert("Oops...", e, reason, "error");
            return;
        }
        sweetAlert("Please check your email!", "We've just sent an e-mail to reset your password!", "success");
    },
    'click .resend-verification-link': async function (event) {

        var res = await callPromise('sendVerificationLink');
        loading(0);
        if (res.type == "success") {
            swal({
                title: "Verification mail sent!",
                text: "Please go check your email :D",
                type: "success",
                showCancelButton: false
            },
                function () {
                    Router.go('/');
                });
        } else {
            swal({
                title: "Oops...",
                text: res.result,
                type: "error",
                showCancelButton: false
            },
                function () {
                    Router.go('/');
                });
            Session.set("loggedIn", false);
        }

    },
    'click .home': function () {
        Router.go("/");
    }
});

Template.advTutorial.events({
    // 'click .gameGuideImg':function(event){
    //   // $('.landList');
    //   $('.advTutorialContainer').css("background","rgba(255, 255, 255, 1)");
    // },
});

Template.firstTutorial.events({
    'click .tutorialNextBtn': function (event) {
        currentTutorialSlide -= 100;
        $(".tutorialContainer").css("transform", "translateX(" + currentTutorialSlide + "vw)");
    },
    'click .tutorialPreviousBtn': function (event) {
        currentTutorialSlide += 100;
        $(".tutorialContainer").css("transform", "translateX(" + currentTutorialSlide + "vw)");
    },
    'click .tutorialFinishBtn': function (event) {
        $(".tutorialContainer").css("opacity", "0");
        currentTutorialSlide = 0;
        setTimeout(function () {
            $(".tutorialContainer").css("display", "none");

        }, 1000);
    },
    'click .tutorialSkipBtn': function (event) {
        $(".tutorialContainer").css("opacity", "0");
        currentTutorialSlide = 0;
        setTimeout(function () {
            $(".tutorialContainer").css("display", "none");

        }, 1000);
    }
});

Template.questionnaire.events({
    'click #btn_questionnaire_close': function () {
        if (!Meteor.user().profile.game.stakeholder.answered) {
            swal({
                title: "Are you sure?",
                text: "Please make sure you have done the questionnaire to obtain the lucky draw!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, I've done!",
                closeOnConfirm: false
            },
                function () {
                    $('.questionnaire_main').css('display', 'none');
                    sweetAlert("Closed", "", "success")
                });
        }
    },
    'click .option-input': function (e) {
        var _id = index_finder($(e.target).attr('id'), 'radioAnswer');
        var parentId = _id.split("_");
        $('#answer_cover' + parentId[0]).removeClass('mustAnswer');

    }
});

Template.shop.events({
    'click #btn_show_property': function () {
        set_propertyType_table();
    },
    'click #btn_shop_close': function () {
        $('.property_shop').css('display', 'none');
    },
    'mouseenter input[type="range"]': function (e) {
        var r = $(e.target);

        var p = r.val();
        r.on('click', function () {
            p = r.val();
            bg(p);
        });
        r.on('mousemove', function () {
            p = r.val();
            bg(p);
        });

        function bg(n) {
            r.css({ 'background-image': '-webkit-linear-gradient(left ,#82cbd1 0%,#82cbd1 ' + n + '%,#C7FFEF ' + n + '%, #C7FFEF 100%)' });
        }
    },
    'click #btn_property_save': function () {
        save_rating_setting();
        $('.property_shop').css('display', 'none');
    },
    'click #btn_property_cancel': function () {
        set_propertyType_table();
    }
});

Template.gameContent.events({
    'click .cropObject': function (event) {
        if (currentCropId != null && plantMode) {
            var _landId = currentCropLand.split("cropLand")[1];

            if (userLandConfiguration[_landId].crop != -1) {
                sweetAlert("Oops...", "Don't plant twice !", "error");
                return;
            } else if (userLandConfiguration[_landId].land == -1) {
                sweetAlert("Oops...", "You need a land first !", "error");
                return;
            } else if (currentUser.sta < staminaList["crop"]) {
                sweetAlert("Oops...", "Not enough stamina", "error");
                return;
            }

            updateStaminaBar(staminaList["crop"]);

            var styles = {
                'z-index': "2",
                'opacity': 1
            };
            $(".cropObject").clone().attr("class", "croppedObject croppedObject" + cropList.length).attr("cropcount", cropTypeList[currentCropId].count).appendTo(".surfaceObject").css(styles);

            var start = new Date();
            var end = new Date();

            var cropWaitingTime = cropTypeList[currentCropId].time.split(".");

            end = end.addTime(parseInt(cropWaitingTime[0]), parseInt(cropWaitingTime[1]), parseInt(cropWaitingTime[2]), parseInt(cropWaitingTime[3]));

            var _id = cropList.length;

            userLandConfiguration[_landId].crop = _id;
            Meteor.call('updateUserLandConfiguration', s_Id, _landId, _id, 0, 'crop');
            Meteor.call('addCropList', s_Id, cropTypeList[currentCropId].name, cropTypeList[currentCropId].img[3], start, end, parseInt(cropTypeList[currentCropId].id), 0, parseInt(cropTypeList[currentCropId].count));
            cropList.push({
                id: _id,
                name: cropTypeList[currentCropId].name,
                img: cropTypeList[currentCropId].img[3],
                start: start,
                end: end,
                type: cropTypeList[currentCropId].id,
                ripe: 0,
                count: cropTypeList[currentCropId].count
            });
            _dep.changed();
            // for detect do user crop land on game area for tutorial using
            cntAddCrop++;
            if (tutorialMode == 1 && cntAddCrop == 1) {
                // step 1.3 for tutorial, point to the croppedObject
                t1PageCnt++;
                tutorial1();
                // setCircleTarget($('.croppedObject'),false,"down",2,stringHarvest);
                // HideCircle();
                // HideCircleText();
                // setTimeout(function () {
                //     createCircle();
                // }, 3000);

            }

            //userCropType[currentCropId].count++;
            //usingPropertyInstance.updateUserPropertyType(s_Id, currentCropId, {from:web3.eth.accounts[currentAccount], gas:2000000});

        } else {
            sweetAlert("Oops...", "Please specify Crop first", "error");
            return;
        }
    },
    'click .farmObject': function (event) {
        if (currentLandId != null && placeMode) {
            var _landId = currentCropLand.split("cropLand")[1];

            if (userLandConfiguration[_landId].land != -1) {
                sweetAlert("Oops...", "Don't plow twice !", "error");
                return;
            }
            landTypeList[currentLandId].count++;
            currentCropLand = currentCropLand.split(" ")[1];
            $(".farmObject").children().clone().appendTo("." + currentCropLand).css({ opacity: 1 });
            $("." + currentCropLand).css({ "border-style": "none" });
            var _id = landList.length;
            userLandConfiguration[_landId].land = landTypeList[currentLandId].id;
            Meteor.call('updateUserLandConfiguration', s_Id, _landId, -1, landTypeList[currentLandId].id, 'land');

            landList.push({
                id: _id,
                name: landTypeList[currentLandId].name,
                img: landTypeList[currentLandId].img,
            });

            cntAddLand++;
            if (tutorialMode == 1 && cntAddLand == 1) {
                // step 1.2 for tutorial, point to the crop
                t1PageCnt++;
                tutorial1();

                // $('.farm').css("-webkit-animation",""); // no blingbling on land
                // HideCircle();
                // HideCircleText();
                // sweetAlert("Nice! Look to your left ! ", "", "success");
                // setCircleTarget($('.property0'),true,"right",3,stringCrop);
                // setTimeout(function () {
                //     createCircle();
                // }, 2000);

            }

        } else {
            sweetAlert("Oops...", "Specify Land first", "error");
            return;
        }
    },
    'click .thief': function (event) {
        $(event.target).parent().css({ opacity: 0, transform: "translateY(50px)" });
        landInfo[$(event.target).parent().attr('bindindex')].showed = 0;
        updateSyndicateExp(2);
        currentUser.SyndicateProgress -= 1;
        $('#hitsBoard').text(currentUser.SyndicateProgress + ' hits left.');
        Meteor.call('updateSyndicateProgress', s_Id, currentUser.SyndicateProgress);
        setTimeout(function () {
            $(event.target).parent().remove();
        }, 1000);
        if (currentUser.SyndicateProgress <= 0) {
            clearInterval(checkMissionInterval);
            var leftThieives = $('.thief').length;
            for (i = 0; i < leftThieives; i++) {
                $('.thief:eq(' + i + ')').css({ opacity: 0, transform: "translateY(50px)" });
                $('.thief:eq(' + i + ')').remove();
            }
            Meteor.call('updateFarmerId', s_Id, -1);
            for (var s = 0; s < user_property.length; s++) {
                if ((user_property[s].propertyType == (currentUser.SyndicateLevel + 29)) && ((user_property[s].propertyCount == 0) && (user_property[s].tradeable == 0))) {
                    Meteor.call('updatePropertyCount_Setting', s_Id, (currentUser.SyndicateLevel + 29), 1, 0);
                }
            }
            updateSyndicateExp(30);
            sweetAlert("Congratulations!", "Mission Completed!", "success");

            currentCharacter = "farmer";
            Session.set('userName', currentUser.name);
            showThief = false;
            $(".missionObject").html("<div class='thiefObject'></div>");
            $('.SyndicateExp').css('visibility', 'collapse');
            $('.userExp').css('visibility', 'visible');
            $('.crop2').css('display', 'block');
            $('#hitsBoard').remove();
            gameMode = "Farmer"
            Session.set('switchToType', currentUser.type);
            set_property_table();
            rerenderCropLand(s_Id);
        }
    },
    'click .croppedObject': function (event) {
        var id, cropClass, cropCount;

        if (event.target.className == "") {
            cropClass = $(event.target).parent().prop('className').split(" ")[1];
            id = cropClass.split("croppedObject")[1];
        } else {
            cropClass = event.target.className.split(" ")[1];
            id = cropClass.split("croppedObject")[1];
        }

        cropCount = $(event.target).parent().attr("cropcount");

        var typeIndex;
        for (var j = 0; j < cropTypeList.length; j++) {
            if (cropTypeList[j].id == cropList[id].type) {
                typeIndex = j;
            }
        }

        $(".floatCropStatus").css("display", "none");

        if (gameMode == "Farmer") {
            if (cropList[id].ripe) {
                var imgs = $(".crop").find("img");

                // for (var i = 0; i < imgs.length; i++) {
                //     if ($(imgs[i]).parent().data('pressed')) {
                //         $(imgs[i]).parent().data('pressed', false);
                //         $(imgs[i]).parent().html("<img src = '" + prefix + cropTypeList[i].img[3] + postfix + "' />" + cropTypeList[i].name);
                //     }
                // }
                // $(".cropObject").css("display", "none");
                // plantMode = false;

                $(".animationImg").html("<img src = '" + prefix + cropTypeList[typeIndex].img[3] + postfix + "' />");

                var difference = elapsedTime(cropList[id].start, cropList[id].end);
                var exp = Math.floor((difference / (1000 * 30)) * 20);

                $(".scoreObject").html("+" + exp + "XP");

                var temp2 = $(".expPopText").clone().attr("class", "expPopTextTemp").appendTo(".expProgress");

                temp2.html("+" + exp + "XP");
                temp2.css({ display: "inline", opacity: 1, transform: "translateY(0px)" });

                setTimeout(function () {
                    temp2.css({ opacity: 0, transform: "translateY(10px)" });
                    setTimeout(function () {
                        temp2.css({ display: "none" });
                    }, 2000);
                }, 1000);
                updateUserExp(exp);

            } else {
                sweetAlert("Oops...", "The crop is not ready for harvest yet! :(", "error");
                return;
            }

            var top = $(event.target)[0].getBoundingClientRect().top;
            var left = $(event.target)[0].getBoundingClientRect().left;

            var landTop = ($(".canvas").height() - $(window).height()) / 2;
            var landLeft = ($(".canvas").width() - $(window).width()) / 2;

            var areaLeft = $(".gamingArea").position().left;
            var resizeOffsetX = (screen.width - $(window).width()) / 6.5;

            var divHeight = $(".cropObject").height() / 5;
            var divWidth = $(".cropObject").width() * 1.65;

            var posX = left + landLeft - areaLeft + divWidth - x - resizeOffsetX;
            var posY = top + landTop - divHeight - y;

            var temp = $(".animationObject").clone().attr("class", "animationTemp").appendTo(".canvas");
            temp.css({ display: "inline", top: posY, left: posX });
            temp.addClass("animationTempShow");

            setTimeout(function () {
                temp.css({ opacity: 0, transform: "translateY(0px)" });
                setTimeout(function () {
                    temp.css({ display: "none" });
                    temp.remove();
                }, 1000);
            }, 1000);

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
            var p_Id;
            for (var i = 0; i < user_property.length; i++) {
                if (user_property[i].propertyType == stockList[stockId].type) {
                    p_Id = i;
                    user_property[i].propertyCount += parseInt(stockList[stockId].count);
                    break;
                }
            }

            var configId;
            for (var i = 0; i < userLandConfiguration.length; i++) {
                if (userLandConfiguration[i].crop == id) {
                    userLandConfiguration[i].crop = -1;
                    configId = i;
                }
            }
            Meteor.call('updateUserLandConfiguration', s_Id, configId, -1, 0, 'crop');

            cropList[id].name = 0;
            cropList[id].img = 0;
            cropList[id].start = 0;
            cropList[id].end = 0;
            cropList[id].type = 0;
            cropList[id].ripe = 0;
            Meteor.call('updateCropList', s_Id, id, 0, 0, 0, 0, 0, 0, 0);

            $("." + cropClass).remove();
            Meteor.call('updatePropertyCount', s_Id, p_Id, parseInt(stockList[stockId].count), function () {
                //reload propertyTable
                set_property_table();
            });
            //usingPropertyInstance.updatePropertyCount_Cropped(propertyIndex, parseInt(stockList[stockId].count), {from:web3.eth.accounts[currentAccount], gas:3000000});

            //reload propertyTable
            set_property_table();

            // step 1.4 for tutorial, point to the stock
            if (tutorialMode == 1) {

                t1PageCnt++; //case=4
                tutorial1();
                // setCircleTarget($('.crop3'),false,"right",6,stringcrop3);
                // $('.crop3').css("-webkit-animation","leftBtnAnimation 1s infinite");
                // createCircle();
            }
        }
        else if (gameMode == "Thief") {
            if (currentUser.sta < staminaList["steal"]) {
                sweetAlert("Oops...", "Not enough stamina", "error");
                return;
            }
            else {
                var stolenFlag, stealCount, judgement, stealResult;
                stolenFlag = $(event.target).parent().attr("stolenFlag");
                if ((cropList[id].ripe) && (stolenFlag == "f")) {
                    judgement = Math.random();
                    if (judgement >= stealRate) {
                        stealResult = true;

                        $(".animationImg").html("<img src = '" + prefix + cropTypeList[typeIndex].img[3] + postfix + "' />");
                        $(".scoreObject").html("+" + 5 + "XP");
                        updateStaminaBar(staminaList["steal"]);
                        updateSyndicateExp(5);

                        var landTop = ($(".canvas").height() - $(window).height()) / 2;
                        var landLeft = ($(".canvas").width() - $(window).width()) / 2;

                        var areaLeft = $(".gamingArea").position().left;
                        var resizeOffsetX = (screen.width - $(window).width()) / 6.5;

                        var divHeight = $(".cropObject").height() / 5;
                        var divWidth = $(".cropObject").width() * 1.65;
                        var posX = cursorX + landLeft - areaLeft + divWidth - x - resizeOffsetX;
                        var posY = cursorY + landTop - divHeight - y;
                        posX = cursorX + posX;
                        posY = cursorY + posY;


                        var temp = $(".animationObject").clone().attr("class", "animationTemp").appendTo(".canvas");
                        temp.css({ display: "inline", top: posY, left: posX });
                        temp.addClass("animationTempShow");

                        setTimeout(function () {
                            temp.css({ opacity: 0, transform: "translateY(0px)" });
                            setTimeout(function () {
                                temp.css({ display: "none" });
                                temp.remove();
                            }, 1000);
                        }, 1000);
                        stealCount = Math.round(cropCount / 2);
                        cropCount = cropCount - stealCount;
                        var p_Id;
                        for (var i = 0; i < user_property.length; i++) {
                            if (user_property[i].propertyType == cropList[id].type) {
                                p_Id = user_property[i].id;
                                user_property[i].propertyCount += parseInt(cropCount);
                                break;
                            }
                        }
                        Meteor.call('updatePropertyCount', s_Id, p_Id, stealCount, function () {
                            Meteor.call('updateCropCount', visitNode, id, cropCount);
                            $(event.target).parent().attr("cropcount", parseInt(cropCount));
                            $(event.target).parent().attr("stolenFlag", "t");

                            $("." + cropClass).html("<img src = '" + prefix + cropTypeList[typeIndex].img[4] + postfix + "' />");
                            //reload propertyTable
                            set_property_table();

                        });
                    }
                    else {
                        stealResult = false;
                        sweetAlert("Oops...", "You are under arrest!", "warning");
                        updateStaminaBar(staminaList["stealFail"]);
                    }
                    Meteor.call('updateStealRecord', s_Id, stealResult);
                }
                else {
                    sweetAlert("Oops...", "Don't be so greedy", "error");
                    return;
                }
            }
            // step 3.5
            if (tutorialMode == 3) {
                t3PageCnt++;   // case=5
                tutorial3();
            }
        }
        else if (gameMode == "Guard") {
        }
    },

    'click .farm img': function (event) {
        if (removeMode) {
            var parentClass = $(event.target).parent()[0].className;
            var _landId = parentClass.split("cropLand")[1];

            if (userLandConfiguration[_landId].land == -1) {
                sweetAlert("Oops...", "Its already empty !", "error");
                return;
            }

            $($(event.target).parent()[0]).css("border", "1px solid black");
            $(event.target).remove();

            userLandConfiguration[_landId].land = -1;
            Meteor.call('updateUserLandConfiguration', s_Id, _landId, -1, -1, 'land');
        }
    },
    'mouseenter .croppedObject img': function (event) {
        $(".floatCropStatus").css("display", "inline");
        var cropId = $(event.target).parent()[0].className.split("croppedObject")[2];

        var posX = cursorX;
        var posY = cursorY;

        $(".floatCropStatus").css({ display: "inline", top: posY, left: posX });
        $(".floatCropName").html(cropList[cropId].name);

        var difference = elapsedTime(new Date(), cropList[cropId].end);
        var diffData = (difference.getHours() - 8) + ' Hrs. ' + difference.getMinutes() + ' Mins. ' + difference.getSeconds() + " Secs";

        if (cropList[cropId].ripe) {
            $(".timeLeft").html("Ready to harvest");
        } else {
            $(".timeLeft").html(diffData);
        }

        $(".timeLeft").attr("class", "timeLeft timeLeft" + cropId);

        var index;
        for (var j = 0; j < cropTypeList.length; j++) {
            if (cropTypeList[j].id == cropList[cropId].type) {
                index = j;
            }
        }
        $(".floatCropStatus").find("img").attr("src", prefix + cropTypeList[index].img[3] + postfix);
    },
    'mouseout .croppedObject img': function (event) {
        $(".floatCropStatus").css("display", "none");
    },
})

Template.crop.events({
    'click .crop': function (event) {
        clickTarget = null;
        if (event.target.className == "") {
            clickTarget = $(event.target).parent();
        } else {
            clickTarget = $(event.target);
        }
        var imgs = $(".cropLand").find("img");
        $(".farmObject").css("display", "none");
        $(imgs[0]).parent().data('pressed', false);
        $(imgs[0]).parent().html("<img src = '" + prefix + "land" + postfix + "' />" + "Dirt");
        $(imgs[1]).parent().data('pressed', false);
        $(imgs[1]).parent().html("<img src = '/img/game/background.svg' />Grass");
        placeMode = false;
        removeMode = false;

        var id = clickTarget[0].className.split("property")[1];

        if (clickTarget.data('pressed')) {
            $(".cropObject").css("display", "none");
            clickTarget.html("<img src = '" + prefix + cropTypeList[id].img[3] + postfix + "' />" + cropTypeList[id].name);
            clickTarget.data('pressed', false);
            plantMode = false;
            return;
        }

        plantMode = true;

        currentClickedCrop = clickTarget;
        var imgs = $(".crop").find("img");

        for (var i = 0; i < imgs.length; i++) {
            if ($(imgs[i]).parent().data('pressed')) {
                $(imgs[i]).parent().data('pressed', false);
                $(imgs[i]).parent().html("<img src = '" + prefix + cropTypeList[i].img[3] + postfix + "' />" + cropTypeList[i].name);
            }
        }
        clickTarget.data('pressed', true);

        $(".cropObject").html("<img src = '" + prefix + cropTypeList[id].img[0] + postfix + "' />");
        currentCropId = id;

        $(".cropObject").css("display", "inline");
        clickTarget.html("<img src='/img/game/cancel2.svg' width='50%'>");
    },

})

Template.land.events({
    'click .cropLand ': function (event) {
        clickTarget = null;
        if (event.target.className == "") {
            clickTarget = $(event.target).parent();
        } else {
            clickTarget = $(event.target);
        }

        if (plantMode) {
            $(".cropObject").css("display", "none");
            for (var k = 0; k < cropTypeList.length; k++) {
                $('.crop:nth-child(' + (k + 1) + ')').data('pressed', false);
                $('.crop:nth-child(' + (k + 1) + ')').html("<img src = '" + prefix + cropTypeList[k].img[3] + postfix + "' />" + cropTypeList[k].name);
            }
            plantMode = false;
        }

        var id = clickTarget[0].className.split("farmLand")[1];

        if (clickTarget.data('pressed')) {
            $(".farmObject").css("display", "none");
            clickTarget.html("<img src = '" + prefix + landTypeList[id].img + postfix + "' />Dirt");
            clickTarget.data('pressed', false);
            placeMode = false;
            return;
        }
        else {
            placeMode = true;
            clickTarget.data('pressed', true);
        }
        removeMode = false;

        var imgs = $(".cropLand").find("img");
        $(imgs[1]).parent().data('pressed', false);
        $(imgs[1]).parent().html('<img src="/img/game/background.svg">Grass');

        $(".farmObject").html("<img src = '" + prefix + landTypeList[id].img + postfix + "' />");
        currentLandId = id;

        if (placeMode) {
            $(".farmObject").css("display", "inline");
            clickTarget.html("<img src='/img/game/cancel2.svg' width='50%'>")
            currentClickedLand = clickTarget;
        } else {
            $(currentClickedLand).html("<img src = '" + prefix + landTypeList[id].img + postfix + "' />Dirt");
            clickTarget.html("<img src = '" + prefix + landTypeList[id].img + postfix + "' />Dirt");
            $(".farmObject").css("display", "none");
        }
    },

})

Template.gamingArea.events({
    'mouseenter .land div': function (event) {
        if (plantMode) {
            currentCropLand = event.target.className;

            var top = $(event.target)[0].getBoundingClientRect().top;
            var left = $(event.target)[0].getBoundingClientRect().left;

            var landTop = ($(".canvas").height() - $(window).height()) / 2;
            var landLeft = ($(".canvas").width() - $(window).width()) / 2;

            var resizeOffsetX = ($(window).width() - 400) / 6.5;
            var areaLeft = $(".gamingArea").position().left;
            var divHeight = $(".cropObject").height() / 5;
            var divWidth = $(".cropObject").width() / 1.65;

            var posX = left + landLeft - areaLeft + divWidth - x + resizeOffsetX;

            var posY = top + landTop - divHeight - y;

            var styles = {
                top: posY,
                left: posX,
                width: "150px",
                height: "150px",
                position: "absolute",
                opacity: 0.5,
                "z-index": 2
            };

            $(".cropObject").css(styles);

        } else if (placeMode) {
            currentCropLand = event.target.className;
            var top = $(event.target)[0].getBoundingClientRect().top;
            var left = $(event.target)[0].getBoundingClientRect().left;

            var landTop = ($(".canvas").height() - $(window).height()) / 2;
            var landLeft = ($(".canvas").width() - $(window).width()) / 2;

            var resizeOffsetX = ($(window).width() - 400) / 6.5;
            var areaLeft = $(".gamingArea").position().left;
            var divHeight = $(".cropObject").height() / 10;
            var divWidth = $(".cropObject").width() / 1.75;

            var posX = left + landLeft - areaLeft + divWidth - x + resizeOffsetX;

            var posY = top + landTop - divHeight - y;

            $(".farmObject").css({ top: posY, left: posX, width: "150px", height: "150px", position: "absolute", opacity: 0.5 });
        }

    },
    'click .matchesBtn': async function (event) {
        var m_Id = $(event.target).attr("class").split("matchBtn")[1];
        var s_Id = Meteor.users.findOne({ _id: Session.get("id") }).profile.game.stakeholder.id;
        if ($(event.target).hasClass('matchedAcceptBtn')) {
            var res = await callPromise("callContract", "Matchmaking", "updateConfirmation", [parseInt(m_Id), s_Id, 1]);
            console.log("confirm");
        }
        else {
            var res = await callPromise("callContract", "Matchmaking", "updateConfirmation", [parseInt(m_Id), s_Id, 0]);
            console.log("reject");
        }
        var waitBtn = $('<input>').attr({
            type: 'button',
            class: "btn btn-warning matchesBtn matchesBtnWait matchBtn" + m_Id,
            value: 'Waiting for others to confirm',
            disabled: true
        });
        var btnParent = $(event.target).parent();
        btnParent.find('.matchesBtn').each(function () {
            $(this).remove();
        });

        btnParent.append(waitBtn);
        // $(event.target).prop("value", "Waiting for others to confirm");
        // $(event.target).prop("disabled", true);
    },
    // 'click .hideSystemInfo': function (event) {
    //     if (systemInfoShowed) {
    //         $(".systemInfo").css("transform", "translateX(550px)");
    //     } else {
    //         $(".systemInfo").css("transform", "translateX(0px)");
    //     }
    //     systemInfoShowed = !systemInfoShowed;
    // },
    'click .systemInfoHeaderbtn': function () {
        if (systemInfoShowed) {
            $(".systemInfo").css("transform", "translateX(560px)");
            $('.systemInfoHeaderbtn').find('img').attr('src', '/img/game/back.svg')
        } else {
            $(".systemInfo").css("transform", "translateX(0px)");
            $('.systemInfoHeaderbtn').find('img').attr('src', '/img/game/next.svg')
        }
        systemInfoShowed = !systemInfoShowed;
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
    'click .nav': function (event) {
        var moveSpeed = 30;
        var data = $(".canvas").css('-webkit-transform');
        var negativeBoundary = -900;
        var boundary = 900;

        if (data == 'none') {
            x = 0;
            y = 0;
        } else {
            data = data.split(/[()]/)[1];
            x = parseInt(data.split(',')[4]);
            y = parseInt(data.split(',')[5]);
        }

        if (event.target.className.split(" ")[1] == 'navUp' && y < boundary) {
            y += moveSpeed;
        } else if (event.target.className.split(" ")[1] == 'navDown' && y > negativeBoundary) {
            y -= moveSpeed;
        } else if (event.target.className.split(" ")[1] == 'navLeft' && x < boundary) {
            x += moveSpeed;
        } else if (event.target.className.split(" ")[1] == 'navRight' && x > negativeBoundary) {
            x -= moveSpeed;
        }
        $('.canvas').css('-webkit-transform', 'translateX(' + x + 'px) translateY(' + y + 'px)');
    },
    'click .musicSwitch': function (event) {
        if (!audio.paused) {
            audio.pause();
            $(".musicSwitch").find("img").attr("src", "/img/game/speaker_off.svg");
        } else {
            audio.play();
            $(".musicSwitch").find("img").attr("src", "/img/game/speaker_on.svg");
        }
    },
    'click .gameGuideImg': function (event) {
        // display original tutorial
        // $(".tutorialContainer").css("opacity", "1");
        // $(".tutorialContainer").css("display", "inline");
        // $(".tutorialContainer").css("transform", "translateX("+ (0) +"vw)");

        // display cover color tutorial
        // $('.advTutorialContainer').css("display","inline");
        // $('.advTutorialContainer').css("background","rgba(255, 255, 255, 0.7)");
        // $('.advTutorialContainer').css("z-index","100");
        // $('.landList').css("z-index","101");
        //tutorialSession1();
        //tutorialSession2();
        tutorialSession3();
    },
})
Template.guideCircle.events({
    'click #btnTutorialMM': function (event) {
        // step 2.2 for tutorial session2, next button for introduce rating
        if (tutorialMode == 2) {
            t2PageCnt++;  // case=2
            tutorial2();
            // $('.guideBox').hide();
            //
            // setCircleTarget($('.menuButton'),false,"left",8,stringMenuButton2);
            // createCircle($('.menuButton'));
            // $('.menuButton').css("-webkit-animation","menuBtnAnimation 1s infinite");
        }
    },
    'click .nextPageBtn': function (event) {
        if (tutorialMode == 2) {
            t2PageCnt++;  // case=6   case=7   case=8   case=10
            tutorial2();

        }
        if (tutorialMode == 1) {
            t1PageCnt++;  // case=6   case=10   case=11  case=12
            tutorial1();
        }
        if (tutorialMode == 3) {
            t3PageCnt++; // case=3  case=6  case=7
            tutorial3();
        }
    },
    'click .prevPageBtn': function (event) {
        if (tutorial2 == 2) {
            t2PageCnt--;

        }
    }

})
function tutorialSession1() {
    // start point for tutorial 1
    tutorialMode = 1; //tutorialSession1
    // step 1.1 for tutorial, point to the land
    t1PageCnt++;
    tutorial1();
    // setCircleTarget($('.cropLand'),true,"right",3,stringDirt);
    // $('.farm').css("-webkit-animation","circleLandAnimation 1s infinite");
    // createCircle();
}
function tutorial1() {
    switch (t1PageCnt) {
        case 1:  // step 1.1 for tutorial, point to the land
            // lock to prevent
            $('.crop3').attr('disabled', true);   // lock crop3
            $('.menuButton').attr('disabled', true);  //notyet  lock menuButton
            $('.plantButton').attr('disabled', true); //lock plantButton


            setCircleTarget($('.cropLand'), true, "right", 3, stringDirt, false);
            $('.farm').css("-webkit-animation", "circleLandAnimation 1s infinite");
            createCircle();
            break;

        case 2: // step 1.2 for tutorial, point to the crop
            // no lock
            $('.plantButton').attr('disabled', false); //lock plantButton
            $('.farmLand0').attr('disabled', true);  // lock farmLand0
            $('.removeLand').attr('disabled', true);  // lock removeLand

            $('.farm').css("-webkit-animation", ""); // no blingbling on land
            HideCircle();
            HideCircleText();
            sweetAlert("Nice! Look to your left ! ", "", "success");
            setCircleTarget($('.property0'), true, "right", 3, stringCrop, false);
            createCircle();
            break;

        case 3:  // step 1.3 for tutorial, point to the croppedObject

            setCircleTarget($('.croppedObject'), false, "down", 2, stringHarvest, false);
            HideCircle();
            HideCircleText();
            setTimeout(function () {
                createCircle();
            }, 3000);
            break;

        case 4:  // step 1.4 for tutorial, point to the stock
            // lock
            $('.crop3').attr('disabled', false);  //lock crop3
            $('.plantButton').attr('disabled', true); // lock plantButton

            setCircleTarget($('.crop3'), false, "right", 6, stringcrop3, false);
            $('.crop3').css("-webkit-animation", "leftBtnAnimation 1s infinite");
            createCircle();
            break;

        case 5:   // step 1.5 for tutorial, no button text, add new guidance in stock
            // lock
            $('.crop3').attr('disabled', true);  //lock crop3
            $('.crop2').attr('disabled', true);  //lock crop2

            $('.crop3').css("-webkit-animation", "");
            var tempSN = $('.property_shop_table').find('tr:nth-child(2)').find("td:eq(1)");
            tempSN.css("-webkit-animation", "stockNumAnimation 1s infinite");

            setCircleTarget(tempSN, false, "right", 6, stringStockNum, true);
            createCircle(tempSN);
            break;

        case 6: // step 1.6 for tutorial, shift to right menu
            // lock
            $('.menuButton').attr('disabled', false);  //lock menuButton

            $('.property_shop_table').find('tr:nth-child(2)').find("td:eq(1)").css("-webkit-animation", "");

            HideCircle();
            setCircleTarget($('.menuButton'), false, "left", 9, stringMenuButton, false);
            createCircle($('.menuButton'));
            $('.menuButton').css("-webkit-animation", "menuBtnAnimation 1s infinite");
            break;

        case 7:  // step 1.6.2 , add new guidance in Mision
            // lock
            $('.btnShop').attr('disabled', true); // lock btnShop
            $('.btnRank').attr('disabled', true); // lock btnRank
            $('.menuButton').attr('disabled', true); // lock menuButton

            $('.menuButton').css("-webkit-animation", "");
            setCircleTarget($('.btnMission'), false, "left", 3.5, stringMissionBtn, false);
            createCircle($('.btnMission'));
            $('.btnMission').css("-webkit-animation", "rightBtnAnimation 1s infinite");
            break;

        case 8:   // step 1.6.3
            // lock
            $('.btnMission').attr('disabled', true);   // lock btnMission

            $('.btnMission').css("-webkit-animation", "");
            HideCircleText();
            break;

        case 9:  // step 1.7.1
            //lock
            $('#btn_mission_close').attr('disabled', true);  // lock btn_mission_close
            $("input[id^='btn_mission_submit_']").attr('disabled', true); // btn_mission_submit_

            var cTarget1 = $('#mission_table').find("td:nth-child(1)");
            cTarget1.css("-webkit-animation", "missionAnimation 1s infinite");
            setCircleTarget(cTarget1, false, "left", 2, stringMissionName, true);
            createCircle();
            break;

        case 10:  // step 1.7.2
            $('#mission_table').find("td:nth-child(1)").css("-webkit-animation", "");
            var cTarget2 = $('#mission_table').find("td:nth-child(2), td:nth-child(3)");
            cTarget2.css("-webkit-animation", "missionAnimation 1s infinite");
            setCircleTarget(cTarget2, false, "left", 2, stringMissionReq, true);
            createCircle();
            break;

        case 11:  // step 1.7.3
            $('#mission_table').find("td:nth-child(2), td:nth-child(3)").css("-webkit-animation", "");
            var cTarget3 = $('#mission_table').find("td:nth-child(4)");
            cTarget3.css("-webkit-animation", "missionAnimation 1s infinite");
            setCircleTarget(cTarget3, false, "left", 3, stringMissionSub, true);
            createCircle();
            break;

        case 12:  // step 1.7.4
            // lock release
            $('.crop3,.menuButton,.plantButton,.crop2,.btnMission,#btn_mission_close,.btnShop,.btnRank,.farmLand0,.removeLand').removeAttr('disabled');  //lock crop3
            //lock menuButton
            //lock plantButton
            //lock crop2
            //lock btnMission
            //lock btn_mission_close
            //lock btnShop
            //lock btnRank
            //lock farmLand0
            //lock removeLand
            $("input[id^='btn_mission_submit_']").removeAttr('disabled'); //btn_mission_submit_


            HideCircle();
            HideCircleText();
            $('.mission_template').css('display', 'none');
            sweetAlert("Congratulations ! ", "Go and plant more ! ", "success");
            tutorialMode = 0; // first tutorial session completed
            t1PageCnt = 0;
            break;
        default:

    }
}
function tutorialSession2() {

    // start point for tutorial 2
    tutorialMode = 2;
    // step 2.1 for tutorial, box description
    t2PageCnt++;   // case=1
    tutorial2();
    // $(".property_shop").css("display", "none");
    // $(".mission_template").css("display", "none");
    // $(".rank_template").css("display", "none");
    //
    // $('.guideBox').fadeIn();

    //var tempTN=$('.property_shop_table').find('tr:nth-child(2)').find("td:eq(2)");
}
function tutorial2() {

    switch (t2PageCnt) {
        case 1:  // step 2.1 for tutorial, box description
            // lock
            $('.farmLand0').attr('disabled', true); // lock2 farmLand0
            $('.removeLand').attr('disabled', true); // lock2 removeLand
            $('.plantButton').attr('disabled', true); // lock2 plantButton
            $('.crop3').attr('disabled', true); // lock2 crop3
            $('.crop2').attr('disabled', true); // lock2 crop2
            $('.menuButton').attr('disabled', true); // lock2 menuButton
            if ($(".menuButton").hasClass("open") === true) {
                $(".rightMenuIcon").fadeOut('normal');
                $(".menuButton").removeClass("open");
            }

            $(".property_shop").css("display", "none");
            $(".mission_template").css("display", "none");
            $(".rank_template").css("display", "none");

            $('.guideBox').fadeIn();
            break;

        case 2:  // step 2.2 for tutorial session2, next button for introduce rating
            //lock
            $('.menuButton').attr('disabled', false); // lock2 menuButton

            $('.guideBox').hide();

            setCircleTarget($('.menuButton'), false, "left", 8, stringMenuButton2, false);
            createCircle($('.menuButton'));
            $('.menuButton').css("-webkit-animation", "menuBtnAnimation 1s infinite");
            break;

        case 3:  // step 2.3 for tutorial, for click rating button
            // lock
            $('.btnRank').attr('disabled', true); // lock2 btnRank
            $('.btnMission').attr('disabled', true);   // lock2 btnMission
            $('.menuButton').attr('disabled', true); // lock2 menuButton

            $('.menuButton').css("-webkit-animation", "");
            setCircleTarget($('.btnShop'), false, "left", 3.5, stringRatingButton, false);
            createCircle($('.btnShop'));
            $('.btnShop').css("-webkit-animation", "rightBtnAnimation 1s infinite");
            break;
        case 4:  //step 2.4 .1 for tutorial, for rating
            //lock
            $('.btnShop').attr('disabled', true);  // lock2 btnShop

            $('.btnShop').css("-webkit-animation", "");
            HideCircleText();
            break;

        case 5:  // step 2.5.1 for tutorial, for rating tolerance
            // lock
            $('#btn_property_save').attr('disabled', true);  // lock2 btn_property_save
            $('#btn_property_cancel').attr('disabled', true);  // lock2 btn_property_cancel
            $('#btn_shop_close').attr('disabled', true);  // lock2 btn_shop_close
            //set
            $('.shop_content').css("overflow", "hidden");
            //$('.tipToleranceText').css(styleVisible);
            $('.ratingRange').css(styleAnimation);
            setCircleTarget($('.RatingTH'), false, "down", 3, stringRatingTor, true);
            createCircle();
            break;

        case 6:  // step 2.5.2 for tutorial, for rating
            //reset
            //$('.tipToleranceText').css(styleHidden);
            $('.ratingRange').css("-webkit-animation", "");
            //set
            //$('.tipRatingText').css(styleVisible);
            var tempPST2 = $('.property_shop_table').find("td:nth-child(2), th:nth-child(2)");
            tempPST2.css(styleAnimation);
            setCircleTarget(tempPST2, false, "left", 3, stringRating, true);
            createCircle();
            break;

        case 7:  // step 2.5.3 for tutorial, for avg rating
            //reset
            //$('.tipRatingText').css(styleHidden);
            $('.property_shop_table').find("td:nth-child(2), th:nth-child(2)").css("-webkit-animation", "");
            //set
            //$('.tipAvgRatingText').css(styleVisible);
            var tempPST3 = $('.property_shop_table').find("td:nth-child(3), th:nth-child(3)");
            tempPST3.css(styleAnimation);
            setCircleTarget(tempPST3, false, "left", 2.5, stringRatingAvg, true);
            createCircle();
            break;

        case 8:  // step 2.5.4 transfer rating to crop3 button;
            //$('.tipAvgRatingText').css(styleHidden);
            $('.property_shop_table').find("td:nth-child(3), th:nth-child(3)").css("-webkit-animation", "");

            sweetAlert("One more thing you need to be careful ! ", "", "warning");

            setCircleTarget($('.crop3'), false, "right", 6, stringcrop3, false);
            $('.crop3').css("-webkit-animation", "leftBtnAnimation 1s infinite");
            createCircle();

            //lock
            $('.crop3').attr('disabled', false);  // lock2 crop3

            break;

        case 9:  // step 2.6   for trade number
            // lock
            $('#btn_tradeable_save').attr('disabled', true);   // lock2 btn_tradeable_save
            $('#btn_tradeable_cancel').attr('disabled', true);  // lock2 btn_tradeable_cancel
            $('.crop3').attr('disabled', true);   // lock2 crop3

            $('.crop3').css("-webkit-animation", "");
            $('#btn_tradeable_save').css("-webkit-animation", "leftBtnAnimation 1s infinite");
            var tempTN = $('#property_trade_table').find('tr:nth-child(2)').find("td:eq(2)");
            tempTN.css("-webkit-animation", "leftBtnAnimation 1s infinite");
            setCircleTarget(tempTN, "false", "right", 6, stringTradeNum, true);
            createCircle();
            break;

        case 10:        //step 2.7  for end
            // lock2  release
            $('.menuButton,.menuButton,.plantButton,.crop3,.crop2').removeAttr('disabled');
            //lock menuButton
            // lock plantButton
            // lock crop3
            // lock crop2
            $('.farmLand0,.removeLand,.btnRank,.btnMission,.btnShop').removeAttr('disabled');
            // lock farmLand0
            // lock removeLand
            // lock2 btnRank
            // lock2 btnMission
            // lock2 btnShop
            $('#btn_property_save,#btn_property_cancel,#btn_shop_close,#btn_tradeable_save,#btn_tradeable_cancel').removeAttr('disabled');
            // lock2 btn_property_save
            // lock2 btn_property_cancel
            // lock2 btn_shop_close
            // lock2 btn_tradeable_save
            // lock2 btn_tradeable_cancel

            $('#btn_tradeable_save').css("-webkit-animation", "");
            $('.shop_content').css("overflow", "auto");
            $('#property_trade_table').find('tr:nth-child(2)').find("td:eq(2)").css("-webkit-animation", "");
            HideCircle();
            HideCircleText();
            $('.property_shop').css('display', 'none');
            sweetAlert("Congratulations ! ", "Go and play fun ! ", "success");
            tutorialMode = 0; // second tutorial session2 completed
            t2PageCnt = 0;
            break;
        default:

    }
}

function tutorialSession3() {
    // start point for tutorial 3
    tutorialMode = 3;
    // step 3.1 for tutorial, circle color on avator
    t3PageCnt++;   // case=1
    tutorial3();
}
function tutorial3() {
    switch (t3PageCnt) {
        case 1:   // step 3.1   start
            // lock
            $('.menuButton').attr('disabled', true);  // lock3 menuButton
            $('.crop3').attr('disabled', true);  // lock3 crop3
            $('.crop2').attr('disabled', true);  // lock3 crop2
            $('.cropLand').attr('disabled', true);  // lock3 landList
            $('.crop').attr('disabled', true);  // lock3 cropListDiv


            $('.imgContainer').css("-webkit-animation", "imgContainerAnimation 1s infinite");
            setCircleTarget($('.characterImg'), false, "right", 4, stringCharSwitch, false);
            createCircle();

            break;

        case 2:   // step 3.2   for tutorial3  click to switch
            //lock
            $('.nextHome').attr('disabled', true);  // lock3 nextHome
            $('#btn_tradeable_save').attr('disabled', true);  // lock3 btn_tradeable_save
            $('#btn_tradeable_cancel').attr('disabled', true); // lock3 btn_tradeable_cancel
            $('.imgContainer').attr('disabled', true);   // lock3 imgContainer


            $('.imgContainer').css("-webkit-animation", "");
            $('.userName h3').css("-webkit-animation", "characterStatusAnimation 1s infinite");
            setCircleTarget($('.userName h3'), false, "right", 2, stringStolenName, true);
            createCircle();

            break;

        case 3:  // step 3.3   for tutorial3 name to exp and sta
            $('.userName h3').css("-webkit-animation", "");
            $('.userBarContainer').css("-webkit-animation", "characterStatusAnimation 1s infinite");
            setCircleTarget($('.userName h3'), false, "right", 2, stringEXPSTA, true);
            createCircle();
            break;

        case 4:  // step 3.4  for tutorial3   sta to steal the crop
            $('.userBarContainer').css("-webkit-animation", "");
            setCircleTarget($('.userName h3'), false, "right", 2, stringSteal, false);
            createCircle();
            break;

        case 5:  // step 3.5
            $('#property_trade_table').css("-webkit-animation", "characterStatusAnimation 1s infinite");
            setCircleTarget($('.crop3'), false, "right", 9, stringStock, true);
            createCircle();
            break;

        case 6:  // step 3.6
            $('#property_trade_table').css("-webkit-animation", "");
            $('.nextHome').css("-webkit-animation", "nextHomeAnimation 1s infinite");
            setCircleTarget($('.nextHome'), false, "right", 8, stringNextSwitch, true);
            createCircle();
            break;

        case 7:  // setp 3.7
            // lock release
            $('.menuButton').removeAttr('disabled');  // lock3 menuButton
            $('.crop3,.crop2,.cropLand,.crop').removeAttr('disabled'); // lock3 crop3
            // lock3 crop2
            // lock3 landList
            // lock3 cropListDiv
            $('.nextHome,#btn_tradeable_save,#btn_tradeable_cancel,.imgContainer').removeAttr('disabled');
            // lock3 nextHome
            // lock3 btn_tradeable_save
            // lock3 btn_tradeable_cancel
            // lock3 imgContainer

            $('.nextHome').css("-webkit-animation", "");
            HideCircleText();
            sweetAlert("Good luck ! ", "Wish you could steal what you want.", "success");

            t3PageCnt = 0;
            tutorialMode = 0;
            break;

        default:

    }
}

// for create tutorial highlight circle by the div class
function createCircle() {
    if (tutorialMode == 0) {
        return;
    }
    // if(targetCircleTemp!=targetCircleDiv){
    //   // for reset default value
    //   resizeWidth=2;
    //   circleNeed=true;
    // }
    // targetCircleTemp=targetCircleDiv;
    var topT = targetCircleDiv[0].getBoundingClientRect().top;
    var leftT = targetCircleDiv[0].getBoundingClientRect().left;
    var heightT = targetCircleDiv.height();
    var widthT = targetCircleDiv.width();
    console.log(topT + "," + leftT + "," + heightT + "," + widthT);
    // top: topT-heightT/4.5,
    // left: leftT-widthT/7.5,
    //(targetCircleDiv[0].className.split(" ")[0])!=("croppedObject")
    if (circleNeed == true) {
        var cricleStyle = {
            top: topT - (0.25 * heightT),
            left: leftT - ((1.5 * heightT - widthT) / 2),
            width: heightT * 1.5,
            height: heightT * 1.5,
            position: "absolute",
            opacity: 1,
            "border": "2px solid rgb(255, 31, 0)",
            "border-radius": "99em",
            "z-index": 99,
            "-webkit-animation": "circleCorlorAnimation 1s infinite"
        };
        $('.guideCircleStatus').css(cricleStyle);
    } else {
        // not to draw circle, but draw text.
    }
    console.log(leftT);
    createTip(topT, leftT, heightT, widthT, currentString, resizeWidth);
    // if(targetCircleTemp!=targetCircleDiv){
    //   // for reset default value
    //   resizeWidth=2;
    //   circleNeed=true;
    // }
    // targetCircleTemp=targetCircleDiv;
}
function createTip(_cTop, _cLeft, _cHeight, _cWidth, _tString, _resizeWidth) {
    if (stringPosition == "right") {
        var tipStyle = {
            position: "absolute",
            opacity: 1,
            top: _cTop + (_cHeight / 3),
            left: _cLeft + (_cWidth * 5 / 4),
            width: _resizeWidth * _cWidth,
            // height:"100px",
            "line-height": "24px",
            "font-size": "20px",
            padding: "30px",
            "border-radius": "15px",
            "background-color": "rgb(255, 255, 255)",
            "z-index": 120,
            "transition": ".3s",
        };
    }
    if (stringPosition == "down") {
        var tipStyle = {
            position: "absolute",
            opacity: 1,
            top: _cTop + (_cHeight * 5 / 4),
            left: _cLeft - (_cWidth * 0.5),
            width: _resizeWidth * _cWidth,
            // height:"100px",
            "line-height": "24px",
            "font-size": "20px",
            padding: "30px",
            "border-radius": "15px",
            "background-color": "rgb(255, 255, 255)",
            "z-index": 120,
        };
    }
    if (stringPosition == "left") {
        var tipStyle = {
            position: "absolute",
            opacity: 1,
            top: _cTop + (_cHeight * 0.25),
            left: _cLeft - (_cWidth * _resizeWidth),
            width: _resizeWidth * _cWidth,
            // height:"100px",
            "line-height": "24px",
            "font-size": "20px",
            padding: "30px",
            "border-radius": "15px",
            "background-color": "rgb(255, 255, 255)",
            "z-index": 120,
        };
    }
    $('.guideCircleText').css(tipStyle);
    if (tPageBtn == true) {
        $('.guideCircleText').html("<div><div>" + _tString + "</div><div class='pageBtn'><div class='nextPageBtn'>Next</div><div></div>");
    } else {
        $('.guideCircleText').text(_tString);
    }

}
function setCircleTarget(targetDiv, _cN, _sP, _rW, _cS, _pBtn) {
    targetCircleDiv = targetDiv;
    circleNeed = _cN;
    stringPosition = _sP;
    resizeWidth = _rW;
    currentString = _cS;
    tPageBtn = _pBtn;
    //targetCircleTemp=targetCircleDiv;
}
function HideCircle() {
    $('.guideCircleStatus').css("opacity", "0");
    $('.guideCircleStatus').css("z-index", "-99");
}
function HideCircleText() {
    $('.guideCircleText').css("opacity", "0");
    $('.guideCircleText').css("z-index", "-99");
}

function PanelControl(panelIndex) {
    $(".statusPanel:nth-child(" + panelCounter + ")").removeClass("statusPanelShow");
    $(".statusPanel:nth-child(" + panelCounter + ")").css("z-index", -1);
    $(".crop" + panelCounter).css("background-color", "rgba(255,255,255,0.45)");

    $(".crop" + panelIndex).css("background-color", "rgba(255,255,255,0.65)");
    $(".statusPanel:nth-child(" + panelIndex + ")").css("z-index", 100);
    $(".statusPanel:nth-child(" + panelIndex + ")").addClass("statusPanelShow");
    panelCounter = panelIndex;

    if (panelCounter == 3) {
        set_property_table();
    }

    $(".cropObject").css("display", "none");
    $(".farmObject").css("display", "none");

    initAllBtns();
}

Template.statusList.events({
    'click .crop2': function () {
        PanelControl(2);
    },
    'click .crop3': function () {
        PanelControl(3);

        // step 1.5 for tutorial, no button text, add new guidance in stock
        if (tutorialMode == 1) {
            t1PageCnt++;  // case=5
            tutorial1();
            // $('.crop3').css("-webkit-animation","");
            // var tempSN=$('.property_shop_table').find('tr:nth-child(2)').find("td:eq(1)");
            // tempSN.css("-webkit-animation","stockNumAnimation 1s infinite");
            // // tempSN.css("border","2px solid rgb(255, 167, 167)");
            // setCircleTarget(tempSN,true,"right",6,stringStockNum);
            // createCircle(tempSN);


            // setTimeout(function () {
            //   // step 1.6 for tutorial, shift to right menu
            //   tempSN.css("-webkit-animation","");
            //   tempSN.css("border","");
            //   HideCircle();
            //   setCircleTarget($('.menuButton'),false,"left",9,stringMenuButton);
            //   createCircle($('.menuButton'));
            //   $('.menuButton').css("-webkit-animation","menuBtnAnimation 1s infinite");
            // }, 3000);
        }


        if (tutorialMode == 2) {
            // step 2.6
            t2PageCnt++;
            tutorial2();
            // step 2.6
            // $('.crop3').css("-webkit-animation","");
            // var tempTN=$('#property_trade_table').find('tr:nth-child(2)').find("td:eq(2)");
            // tempTN.css("-webkit-animation","leftBtnAnimation 1s infinite");
            // setCircleTarget(tempTN,"false","right",6,stringTradeNum);
            // createCircle();

            // setTimeout(function () {
            //   //step 2.7
            //   tempTN.css("-webkit-animation","");
            //   HideCircle();
            //   HideCircleText();
            //   $('.property_shop').css('display', 'none');
            //   sweetAlert("Congratulations ! ","Go and play fun ! ","success");
            //   tutorialMode=0; // second tutorial session2 completed
            // }, 8000);

        }
    },
    'click .removeLand': function (event) {
        clickTarget = null;
        $(".farmObject").css("display", "none");
        if (plantMode) {
            $(".cropObject").css("display", "none");
            for (var k = 0; k < cropTypeList.length; k++) {
                $('.crop:nth-child(' + (k + 1) + ')').html("<img src = '" + prefix + cropTypeList[k].img[3] + postfix + "' />" + cropTypeList[k].name);
                $('.crop:nth-child(' + (k + 1) + ')').data('pressed', false);
            }
            plantMode = false;
        }

        if (event.target.className == "") {
            clickTarget = $(event.target).parent();
        } else {
            clickTarget = $(event.target);
        }

        if (clickTarget.data('pressed')) {

            clickTarget.html("<img src='/img/game/background.svg'>Grass")
            clickTarget.data('pressed', false);
            removeMode = false;
            return;
        }
        else {
            removeMode = true;
        }
        var imgs = $(".cropLand").find("img");
        $(imgs[0]).parent().data('pressed', false);
        $(imgs[0]).parent().html('<img src="/img/game/plant/land.svg">Dirt');

        clickTarget.data('pressed', true);

        if (removeMode) {
            clickTarget.html("<img src='/img/game/cancel2.svg' width='50%'>");

        } else {
            clickTarget.html("<img src='/img/game/background.svg'>Grass");
        }
    },
    'click #btn_tradeable_save': function () {
        save_tradable_setting();
    },
    'click #btn_tradeable_cancel': function () {
        sweetAlert("Warning", 'cancel', "warning");
        set_property_table();
    },
    'click .test': function (event) {
        var lvlCap = levelCap(currentUser.level);
        currentUser.exp = lvlCap;
        currentUser.totalExp += currentUser.exp;
        updateUserExp(0);
    },
    'click .matchmaking': function (event) {
        //matchmakingbug
        MainActivityInstance.findOrigin({ from: web3.eth.accounts[1], gas: 5000000 });
        updateUserData(s_Id);
        showConfirmation(s_Id);
    },
    'click .confirmMatches': function (event) {
        //matchmakingbug
        MainActivity2Instance.checkConfirmation({ from: web3.eth.accounts[0], gas: 2000000 });
        updateUserData(s_Id);
        showConfirmation(s_Id);
    },
    'click .nextHome': async function (event) {
        loading(1);
        visitInfo = await dbPromise('getVisitNode', s_Id);
        visitNode = visitInfo.id;
        visitName = visitInfo.name;
        Session.set('userName', visitName);
        stealRate = await dbPromise('getStealRate', visitNode);
        rerenderCropLand(visitNode);
        loading(0);
    },
})

Template.characterList.events({
    'click .characterImg': async function (event) {
        loading(1);
        if (currentCharacter == "farmer") {
            if (Session.get('userCharacter') == "Thief") {
                PanelControl(3);
                visitInfo = await dbPromise('getVisitNode', s_Id);
                visitNode = visitInfo.id;
                visitName = visitInfo.name;
                Session.set('userName', visitName);

                stealRate = await dbPromise('getStealRate', visitNode);
                rerenderCropLand(visitNode);
                $('.SyndicateExp').css('visibility', 'visible');
                $('.userExp').css('visibility', 'collapse');
                $('.nextSwitch').append($('<input></input>', {
                    type: 'image', //type:'button',
                    name: 'button',
                    class: 'nextHome',
                    value: 'Next',
                    src: '/img/game/nextHome.svg'
                }));

                gameMode = "Thief";
                Session.set('switchToType', 'Farmer');
                $('.crop2').css('display', 'none');
                currentCharacter = "thief";
                loading(0);

                // step 3.2 for tutorial3  click to switch
                if (tutorialMode == 3) {
                    t3PageCnt++;  // case=2
                    tutorial3();
                }
            }
            else if (Session.get('userCharacter') == "Guard") {
                var gaurdMatchID = Meteor.user().profile.game.syndicateData.guardMatchId;
                var matchLength = await dbPromise('getMatchedLength');
                var matchDiff = matchLength - gaurdMatchID;
                if (matchDiff <= 2) {
                    var guardLand = Meteor.user().profile.game.syndicateData.guardFarmerId;
                    var progress = Meteor.user().profile.game.syndicateData.progress;
                    if (guardLand == -1) {
                        sweetAlert("Oops...", "You have completed your mission. Please wait for next matching.", "error");
                        loading(0);
                        return;
                    }
                    else {
                        PanelControl(3);
                        showThief = true;

                        $('.SyndicateExp').css('visibility', 'visible');
                        $('.userExp').css('visibility', 'collapse');
                        if (progress == 0) {
                            progress = thiefNumber(currentUser.SyndicateLevel);
                            currentUser.SyndicateProgress = progress;
                            Meteor.call('updateSyndicateProgress', s_Id, progress);
                        }

                        await rerenderCropLand(guardLand);
                        $('.nextSwitch').append($('<label></label>', {
                            id: "hitsBoard",
                            text: progress + "hits left",
                            style: "font-size:25px;font-family: Copperplate Gothic Bold;"
                        }));
                        gameMode = "Guard";
                        Session.set('switchToType', 'Farmer');
                        $('.SyndicateExp').css('visibility', 'visible');
                        $('.userExp').css('visibility', 'collapse');
                        $('.crop2').css('display', 'none');
                        landInfo = [];
                        for (var i = 0; i < userLandConfiguration.length; i++) {
                            var top = $('.cropLand' + i)[0].getBoundingClientRect().top;
                            var left = $('.cropLand' + i)[0].getBoundingClientRect().left;
                            var info = { top: top, left: left, showed: 0 };
                            landInfo.push(info);
                        }
                        currentUser.SyndicateProgress = progress;
                        checkMissionInterval = setInterval(checkMission, 1000);
                        currentCharacter = "guard";
                    }
                }
                else {
                    //check guard property stock
                    for (var i = 0; i < user_property.length; i++) {
                        if (user_property[i].propertyType == (currentUser.SyndicateLevel + 29)) {
                            if ((user_property[i].propertyCount == 0) && (user_property[i].tradeable == 0)) {
                                Meteor.call('updatePropertyCount_Setting', s_Id, (currentUser.SyndicateLevel + 29), 1, 0);
                                Meteor.call('updateFarmerId', s_Id, -1);
                                Meteor.call('updateSyndicateProgress', s_Id, 0);
                                user_property[i].propertyCount++;
                            }
                            break;
                        }
                    }
                    set_property_table();
                    sweetAlert("Oops...", "You are not assiged to any farm right now.Please wait for next matching.", "error");
                    loading(0);
                    return;
                }
            }
        }
        else {
            currentCharacter = "farmer";
            Session.set('userName', currentUser.name);
            showThief = false;
            clearInterval(checkMissionInterval);
            $(".missionObject").html("<div class='thiefObject'></div>");
            $('.SyndicateExp').css('visibility', 'collapse');
            $('.userExp').css('visibility', 'visible');
            $('.crop2').css('display', 'block');
            $('.nextHome').remove();
            $('#hitsBoard').remove();
            gameMode = "Farmer"
            Session.set('switchToType', currentUser.type);
            rerenderCropLand(s_Id);
            loading(0);
        }
    },
    'mouseenter .flipDIV *': function (event) {
        if (gameMode == "Farmer") {
            $('.characterImg').addClass('flipped');
        } else {
            $('.characterImg').removeClass('flipped');
        }
    },
    'mouseout .flipDIV *': function (event) {
        if (gameMode == "Farmer") {
            $('.characterImg').removeClass('flipped');
        } else {
            $('.characterImg').addClass('flipped');
        }
    },

    // 'click .musicSwitch': function (event) {
    //     if (!audio.paused){
    //         audio.pause();
    //         $(".musicSwitch").find("img").attr("src", "/img/game/speaker_off.svg");
    //     }else{
    //         audio.play();
    //         $(".musicSwitch").find("img").attr("src", "/img/game/speaker_on.svg");
    //
    //     }
    //
    // },

    // 'mouseenter .userExp':function(event){
    //     $(".expHoverText").fadeIn();
    //     $(".expHoverText").css({"left":cursorX, "top":cursorY});
    // },
    // 'mouseout .userExp':function(event){
    //     $(".expHoverText").fadeOut();
    // },

})

Template.operationList.events({
    'click .menuButton': function (event) {
        if ($(".menuButton").hasClass("open") === true) {
            $(".rightMenuIcon").fadeOut('normal');
            $(".menuButton").removeClass("open");
        } else {
            $(".rightMenuIcon").fadeIn('normal');
            $(".menuButton").fadeTo("slow", 0.7);
            $(".menuButton").addClass("open");
        }

        // step 1.6.2 for tutorial, add new guidance in Mision
        if (tutorialMode == 1) {
            t1PageCnt++;
            tutorial1();
            // $('.menuButton').css("-webkit-animation","");
            // setCircleTarget($('.btnMission'),false,"left",3.5,stringMissionBtn);
            // createCircle($('.btnMission'));
            // $('.btnMission').css("-webkit-animation","rightBtnAnimation 1s infinite");
        }

        // step 2.3 for tutorial, for click rating button
        if (tutorialMode == 2) {
            t2PageCnt++;   // case=3
            tutorial2();
            // $('.menuButton').css("-webkit-animation","");
            // setCircleTarget($('.btnShop'),false,"left",3.5,stringRatingButton);
            // createCircle($('.btnShop'));
            // $('.btnShop').css("-webkit-animation","rightBtnAnimation 1s infinite");
        }
    },
    'click .shopOpen': function (e) {
        $(".property_shop").css("display", "inline");
        $(".mission_template").css("display", "none");
        $(".rank_template").css("display", "none");

        //step 2.4 for tutorial, for rating
        if (tutorialMode == 2) {
            t2PageCnt++;   // case=4
            tutorial2();
            // $('.btnShop').css("-webkit-animation","");
            // HideCircleText();
        }
        set_propertyType_table();

        // step 2.4 for tutorial, for rating

        // if(tutorialMode==2){
        //   $('.tipToleranceText').css("visibility","visible");
        //   $('.tipToleranceText').css("opacity","1");
        //   alert(123);
        // }

    },
    'click .MissionOpen': function (event) {
        $(".property_shop").css("display", "none");
        $(".mission_template").css("display", "inline");
        $(".rank_template").css("display", "none");

        // step 1.6.3 for tutorial, add new guidance in Mission Page
        if (tutorialMode == 1) {
            t1PageCnt++;  // case=8
            tutorial1();
            // $('.btnMission').css("-webkit-animation","");
            // HideCircleText();
        }

        set_mission_table();

        // step 1.7 for tutorial, add new guidance in Mission Page
        if (tutorialMode == 1) {
            // t1PageCnt++;
            // tutorial1();
            // setTimeout(function () {
            //   // step 1.7.1
            //   // var cTarget1=$('#mission_table').find("td:nth-child(1)");
            //   // cTarget1.css("-webkit-animation","missionAnimation 1s infinite");
            //   // setCircleTarget(cTarget1,false,"left",2,stringMissionName);
            //   // createCircle();
            //
            //   setTimeout(function () {
            //     // step 1.7.2
            //     cTarget1.css("-webkit-animation","");
            //     var cTarget2=$('#mission_table').find("td:nth-child(2), td:nth-child(3)");
            //     cTarget2.css("-webkit-animation","missionAnimation 1s infinite");
            //     setCircleTarget(cTarget2,false,"left",2,stringMissionReq);
            //     createCircle();
            //


            //     setTimeout(function () {
            //       // step 1.7.3
            //       cTarget2.css("-webkit-animation","");
            //       var cTarget3=$('#mission_table').find("td:nth-child(4)");
            //       cTarget3.css("-webkit-animation","missionAnimation 1s infinite");
            //       setCircleTarget(cTarget3,false,"left",3,stringMissionSub);
            //       createCircle();
            //
            //       setTimeout(function () {
            //         // step 1.7.4
            //         HideCircle();
            //         HideCircleText();
            //         $('.mission_template').css('display', 'none');
            //         sweetAlert("Congratulations ! ","Go and plant more ! ","success");
            //         tutorialMode=false; // first tutorial session completed
            //       }, 4000);
            //
            //     }, 4000);
            //
            //   }, 4000);
            //
            // }, 2000);
        }

    },
    'click .rankOpen': function () {
        $(".property_shop").css("display", "none");
        $(".mission_template").css("display", "none");
        $(".rank_template").css("display", "inline");
        get_rank_data();
    }
});


/////////////////////////
//  Utility Functions  //
/////////////////////////


document.onmousemove = function (e) {
    cursorX = e.pageX;
    cursorY = e.pageY;
}

function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
}


var checkDBLoaded = function (callback) {
    var fetcher = setInterval(function () {
        if (Session.get("crop_loaded") && Session.get("land_loaded") && Session.get("mission_loaded") && Session.get("current_user_loaded")) {
            console.log("server connection established!");
            clearInterval(fetcher);
            callback("done");
        } else {
            console.log("establishing server connection... hold on!");
        }
    }, 1000);
}

var createDBConnection = function () {

    Session.set("crop_loaded", false);
    Session.set("land_loaded", false);
    Session.set("mission_loaded", false);
    Session.set("current_user_loaded", false);
    Session.set("other_user_loaded", false);
    Session.set("matches_loaded", false);

    propertyTypeSub = Meteor.subscribe("propertyTypeChannel", function () {
        Session.set("crop_loaded", true);
    });
    landTypeSub = Meteor.subscribe("landTypeChannel", function () {
        Session.set("land_loaded", true);
    });
    missionSub = Meteor.subscribe("missionChannel", function () {
        Session.set("mission_loaded", true);
    });

    userSub = Meteor.subscribe("currentUserChannel", function () {
        Session.set("current_user_loaded", true);
    });

    matchesSub = Meteor.subscribe("matchesChannel", function () {
        Session.set("matches_loaded", true);
        matches.find().observeChanges({

            added: function (item, fields) {
                var matchCounter = 0;
                var owners = [];
                var matchId = fields.id;
                currentMatches = matches.find().fetch();
                matchmakingLength = currentMatches.length;
                owners = currentMatches[matchId].owners;
                if (matchId >= matchmakingLength - 2) {

                    var s_Id = Meteor.user().profile.game.stakeholder.id;
                    if (jQuery.inArray(s_Id, owners) != -1) {
                        Session.set("id", Meteor.userId());
                        var data = Meteor.users.findOne({ _id: Session.get("id") }).profile.game.stakeholder.matchesId;
                        var res;
                        var minedDetector = setInterval(async function () {
                            res = await callPromise("callContract", "Matchmaking", "getMatchMakingConfirmed", [matchId, s_Id]);
                            console.log(res);
                            if (res.type == "success" && res.result != undefined) {
                                console.log("Mining Listener Closed...");
                                clearInterval(minedDetector);
                                console.log(res);
                                var confirmed = res.result.results[0];

                                //if (!confirmed){
                                if (jQuery.inArray(matchId, data) == -1) {
                                    var res = Meteor.call("updateUserMatchId", Session.get("id"), matchId);
                                }
                                showConfirmation(s_Id, matchId);
                                systemInfoShowed = true;
                                //}
                            } else {
                                matchCounter++;
                                console.log("new matchmaking! waiting for txs being mined");
                                if (matchCounter >= 8) {
                                    // console.log("contract result missing... re-upload to blockchain...");
                                    // //rewirte into contract
                                    // var res = await callPromise("callContract", "Matchmaking", "gameCoreMatchingInit", [fields.id, fields.owners.length, "null", fields.owners.length]);
                                    // for (var w = 0 ; w < fields.owners.length; w++){
                                    //     var res2 = await callPromise("callContract", "Matchmaking", "gameCoreMatchingDetail", [fields.id, fields.priorities[w], fields.owners[w], fields.properties[w], fields.tradeable[w]]);
                                    // }
                                    // console.log(res)
                                    // console.log("contract re-upload complete");
                                    matchCounter = 0;
                                }
                                console.log(res)
                                console.log("contract re-upload complete");
                                matchCounter = 0;
                            }
                        }, 20000)

                        // var minedDetector = setInterval(function(){
                        //     callPromise("callContract", "Matchmaking", "getMatchMakingConfirmed", [matchId, s_Id]).then(function(res){
                        //         console.log(res);
                        //         if (res.result.results[0]){
                        //             clearInterval(minedDetector);
                        //         }
                        //     })
                        // },3000)

                    }
                }

                //Meteor.users.update(userId, { $set: { profile: profile } });
                //Meteor.users.
            },
            changed: function (item, fields) {
                wait(1000);
                currentMatches = dbPromise('getMatch');
                if (currentMatches.length < 2) {
                    offset = currentMatches.length
                } else {
                    offset = 2;
                }
                for (var i = currentMatches.length - offset; i < currentMatches.length; i++) {
                    console.log("match " + currentMatches[i]);
                    if (currentMatches[i].result == true) {
                        $(".matchBtn" + i).attr({
                            type: 'button',
                            class: "btn btn-success matchesBtn matchBtn" + i,
                            value: 'Success',
                            disabled: true
                        });
                    } else if (currentMatches[i].result == false) {
                        $(".matchBtn" + i).attr({
                            type: 'button',
                            class: "btn btn-danger matchesBtn matchBtn" + i,
                            value: 'Fail',
                            disabled: true
                        });
                    }
                }
            }
        });
    });

}

var initAllBtns = function () {
    var imgs = $(".cropLand").find("img");
    $(imgs[0]).parent().html("<img src = '" + prefix + "land" + postfix + "' />" + "Dirt");
    $(imgs[0]).parent().data('pressed', false);
    $(imgs[1]).parent().html("<img src = '/img/game/background.svg' />Grass");
    $(imgs[1]).parent().data('pressed', false);

    var imgs = $(".crop").find("img");

    for (var i = 0; i < imgs.length; i++) {
        if ($(imgs[i]).parent().data('pressed')) {
            $(imgs[i]).parent().html("<img src = '" + prefix + cropTypeList[i].img[3] + postfix + "' />" + cropTypeList[i].name);
            $(imgs[i]).parent().data('pressed', false);
        }
    }

    placeMode = false;
    plantMode = false;
    removeMode = false;
}

var eventListener = function () {

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
    //matchmakingbug
    //var events = MainActivityInstance.matchSuccess({fromBlock: 0, toBlock: 'latest'});
    //events.watch(function(error, result){
    //    console.log(result);
    //    updateUserData(s_Id);
    //    showConfirmation(s_Id);
    //});

    // would get all past logs again.
    events.get(function (error, logs) {
        console.log(logs);
    });

    //matchmakingbug
    //var events2 = MainActivityInstance.returnOrigin({fromBlock: 0, toBlock: 'latest'});
    //events2.watch(function(error, result){
    //    console.log(result);
    //});

    // would get all past logs again.
    events2.get(function (error, logs) {
        console.log(logs);
    });
}

var showConfirmation = async function (s_Id, m_Id) {
    set_property_table();
    $(".systemInfo").css("transform", "translateX(0px)");
    $('.systemInfoHeaderbtn').find('img').attr('src', '/img/game/next.svg');
    if ($(".matches").length >= 2) {
        $('.systemInfo div:nth-child(3)').remove();
    }
    var data = await callPromise("callContract", "Matchmaking", "getMatchMaking", [m_Id]);
    var owners = data.result.results[1];
    var properties = data.result.results[2];
    var tradeables = data.result.results[3];
    var result = data.result.results[6];
    console.log(data);
    var index = [];
    var length = owners.length - 1;
    for (var j = 0; j < length; j++) {
        if (s_Id == owners[j]) {
            index.push(j);
        }
    }

    for (var i = 0; i < index.length; i++) {
        console.log(owners);
        var previousIndex = (index[i] - 1 + length) % length;
        var nextIndex = (index[i] + 1) % length;

        var previousName = await callPromise("getUserName", owners[previousIndex]);
        var nextName = await callPromise("getUserName", owners[nextIndex]);

        var receivePropertyName = await callPromise("getPropertyTypeName", properties[previousIndex]);
        var providePropertyName = await callPromise("getPropertyTypeName", properties[index[i]]);

        var receiveProperty = await callPromise("getPropertyTypeImg", properties[previousIndex]);
        var provideProperty = await callPromise("getPropertyTypeImg", properties[index[i]]);

        var row = $("<div>").attr("class", "matches match" + m_Id);
        var receive = $("<div>").append("<img class='txImg' src = '" + prefix + receiveProperty + postfix + "' /><div>You receive</div><div> " + receivePropertyName + " X " + tradeables[previousIndex] + " </div><div>from " + previousName + "</div>");
        var provide = $("<div>").append("<img class='txImg' src = '" + prefix + provideProperty + postfix + "' /><div>You provide</div><div> " + providePropertyName + " X " + tradeables[index[i]] + " </div><div>to " + nextName + "</div>");
        var checkBtn;
        var confirmBtn;

        console.log(result);
        if (result != "null") {
            if (result == "true") {
                checkBtn = $('<input>').attr({
                    type: 'button',
                    class: "btn btn-success matchesBtn matchBtn" + m_Id,
                    value: 'Success',
                    disabled: true
                });
            } else if (result == "false") {
                checkBtn = $('<input>').attr({
                    type: 'button',
                    class: "btn btn-danger matchesBtn matchBtn" + m_Id,
                    value: 'Fail',
                    disabled: true
                });
            }
        }
        else {
            var res = await callPromise("callContract", "Matchmaking", "getMatchMakingConfirmed", [m_Id, s_Id]);
            console.log("confirmed" + res.result.results[0]);
            var confirmed = res.result.results[0];
            if (confirmed != 0) {
                checkBtn = $('<input>').attr({
                    type: 'button',
                    class: "btn btn-warning matchesBtnWait matchesBtn matchBtn" + m_Id,
                    value: 'Waiting for others to confirm',
                    disabled: true
                });
            } else {
                confirmBtn = $('<input></input>', {
                    type: 'button',
                    class: 'btn btn-primary matchedAcceptBtn matchesBtn matchBtn' + m_Id,
                    value: 'Accept'
                });
                checkBtn = $('<input>').attr({
                    type: 'button',
                    class: "btn btn-danger matchesBtn matchBtn" + m_Id,
                    value: 'Reject'
                });
            }
        }

        row.append(provide).append(receive).append(confirmBtn).append(checkBtn);
        $(".systemInfo").append(row);

        var res = await callPromise("callContract", "Matchmaking", "getMatchMakingConfirmed", [m_Id, s_Id]);
        var confirmed = res.result.results[0];
        if (confirmed != 0) {
            $(".matchBtn" + m_Id).prop("value", "Waiting for others to confirm");
            $(".matchBtn" + m_Id).prop("disabled", true);
        }
    }
}


var getVisitNode = async function () {
    return await dbPromise('getVisitNode');
}

var fetchAllCropTypes = function () {
    cropData = property_type.find({}, { sort: { id: 1 } }).fetch();
    landData = land_type.find().fetch()[0].data;
}

var loadCropList = async function (s_Id) {
    cropList = [];
    var data = await dbPromise('getCropList', s_Id);

    var countData = data.count;
    var length = data.id.length;
    for (var i = 0; i < length; i++) {
        // TODO  check format
        // var start = web3.toUtf8(data[i].start).split(".")[0]+"Z";
        // var end = web3.toUtf8(data[i].end).split(".")[0]+"Z";
        // start = start.split("\"")[1];
        // end = end.split("\"")[1];
        var start = data.start[i];
        var end = data.end[i];

        cropList.push({
            id: data.id[i],
            name: data.name[i],
            img: data.img[i],
            start: new Date(start),
            end: new Date(end),
            type: data.cropType[i],
            ripe: data.ripe[i],
            count: data.count[i]
        });
    }
}


var getUserStockList = async function (s_Id) {

    var p_List = await dbPromise('getUserProperty', s_Id);
    for (var i = 0; i < p_List.name.length; i++) {
        stockList.push({
            name: p_List.name[i],
            count: p_List.count[i],
            type: p_List.type[i],
            tradeable: p_List.tradeable[i],
            isTrading: p_List.isTrading[i]
        });
    }
    if ((currentUser.level >= 5) && (!Meteor.user().profile.game.stakeholder.answered)) {
        showQuestionnaire();
    }
}

var getUserData = async function (s_Id) {
    var data = Meteor.users.findOne({ _id: Session.get("id") }).profile.game.stakeholder;
    var syndicateData = Meteor.users.findOne({ _id: Session.get("id") }).profile.game.syndicateData;
    var matches = data.matchesId;

    currentUser = {
        id: s_Id,
        address: Meteor.users.findOne({ _id: Session.get("id") }).profile.basic.address,
        name: data.name,
        exp: data.exp,
        totalExp: data.totalExp,
        type: Meteor.users.findOne({ _id: Session.get("id") }).profile.basic.character,
        landSize: data.landSize,
        level: data.level,
        sta: data.stamina,
        guardId: null,
        thiefId: null,
        SyndicateExp: syndicateData.exp,
        SyndicateTotalExp: syndicateData.totalExp,
        SyndicateLevel: syndicateData.level,
        SyndicateProgress: 0,
        matches: matches
    };
    var lastLogin = data.lastLogin;

    if (lastLogin == 0) {
        return;
    }

    // TODO : check last login format
    //lastLogin = web3.toUtf8(lastLogin).split(".")[0]+"Z";
    //lastLogin = new Date(lastLogin.split("\"")[1]);
    var currentTime = await dbPromise('getCurrentTime');

    var difference = elapsedTime(lastLogin, currentTime);

    currentUser.sta += Math.round(difference.getTime() / (1000 * 10));
    var staCap = staminaCap(currentUser.level);

    if (currentUser.sta >= staCap) {
        currentUser.sta = staCap;
    }
    // end = end.split("\"")[1];
    _character.changed();
}

var updateUserData = function (s_Id) {

    var oriData = Meteor.users.findOne({ _id: Session.get("id") }).profile.game;
    var data = oriData.stakeholder;
    var syndicateData = oriData.syndicateData;

    // var data = CongressInstance.getStakeholder.call(s_Id, { from: web3.eth.accounts[currentAccount] });
    // var syndicateData = CongressInstance.getSyndicateData.call(s_Id, { from: web3.eth.accounts[currentAccount] });
    // var matches = CongressInstance.getStakeholderMatches.call(s_Id, { from: web3.eth.accounts[currentAccount] });

    currentUser.exp = data.exp;
    currentUser.totalExp = data.totalExp;
    currentUser.landSize = data.landSize;
    currentUser.level = data.level;
    currentUser.SyndicateExp = syndicateData.exp;
    currentUser.SyndicateTotalExp = syndicateData.totalExp;
    currentUser.SyndicateLevel = syndicateData.level;
    currentUser.matches = data.matchesId;
}

var getLandConfiguration = async function (s_Id) {
    userLandConfiguration = [];
    var res = await dbPromise('getUserlandConfig', s_Id);
    landSize = Math.sqrt(res.land.length);

    var contractLandData = res.land;
    var contractCropData = res.crop;

    for (var i = 0; i < landSize * landSize; i++) {
        userLandConfiguration.push(
            {
                id: i,
                land: contractLandData[i],
                crop: contractCropData[i]
            }
        );
    }
}

var fetchGameInitConfig = async function (s_Id) {
    userCropType = [];
    cropTypeList = [];
    landTypeList = [];

    userCropType = await dbPromise('getUnlockedCropType', s_Id);

    for (var i = 0; i < userCropType.length; i++) {
        cropTypeList.push(cropData[userCropType[i]]);
    }

    for (var i = 0; i < landData.length; i++) {
        landTypeList.push(landData[i]);
    }
    Session.set('cropTypeList', cropTypeList);
    _crop.changed();
    Session.set('landTypeList', landTypeList);
}

var loading = function (on) {
    var opacity;
    $(".cropObject").css("display", "none");
    if (on) {
        $(".loading").css("display", "flex");
        $(".loading").css("opacity", 0.9);
    } else {
        setTimeout(function () {
            $(".loading").css("opacity", 0);
            setTimeout(function () {
                $(".loading").css("display", "none");
            }, 1000);
        }, 1000);
    }
}

var rerenderCropLand = async function (id) {
    await getLandConfiguration(id);
    await loadCropList(id);
    await fetchGameInitConfig(id); //bryant
    await initCropLand();
    await getUserStockList(id);
    loading(0);
}

var initCropLand = function () {
    $('.land').html("");
    $(".surfaceObject").html("");
    $(".surfaceObject").append("<div class='cropObject'></div>");
    $('.land').css("width", blockSize * landSize);
    $('.land').css("height", blockSize * landSize);

    for (var i = 0; i < landSize * landSize; i++) {
        $('.land').append("<div class='farm cropLand" + i + "'></div>");
        if (userLandConfiguration[i].land == -1) {
            $('.cropLand' + i).css("border", '1px solid black');
        }
    }

    landInfo = [];
    for (var i = 0; i < userLandConfiguration.length; i++) {

        if (userLandConfiguration[i].land == -1) {
            continue;
        }
        $(".farmObject").html("<img src = '" + prefix + landTypeList[userLandConfiguration[i].land].img + postfix + "' />");
        $(".farmObject").children().clone().appendTo(".cropLand" + i).css({ opacity: 1 });


        if (userLandConfiguration[i].crop == -1) {
            continue;
        }

        var top = $('.cropLand' + i)[0].getBoundingClientRect().top;
        var left = $('.cropLand' + i)[0].getBoundingClientRect().left;


        var landTop = ($(".canvas").height() - $(window).height()) / 2;
        var landLeft = ($(".canvas").width() - $(window).width()) / 2;

        var resizeOffsetX = ($(window).width() - 400) / 6.5;
        var areaLeft = $(".gamingArea").position().left;
        var divHeight = $(".cropObject").height() / 5;
        var divWidth = $(".cropObject").width() / 1.65;

        var posX = left + landLeft - areaLeft + divWidth - x + resizeOffsetX;

        var posY = top + landTop - divHeight - y;

        var styles = {
            top: posY,
            left: posX,
            width: "150px",
            height: "150px",
            position: "absolute",
            opacity: 1,
            "z-index": 2
        };

        var info = { top: posY, left: posX, showed: 0 };
        landInfo.push(info);

        var index = userLandConfiguration[i].crop;
        if (index == -1) {
            return;
        }

        var difference = elapsedTime(new Date(), cropList[index].end);
        var originDifference = elapsedTime(cropList[index].start, cropList[index].end);
        var percent = difference / originDifference;

        var typeIndex;
        for (var j = 0; j < cropTypeList.length; j++) {
            if (cropTypeList[j].id == cropList[index].type) {
                typeIndex = j;
                break;
            } else {
            }
        }

        if (percent > 0.6) {
            $(".cropObject").html("<img src = '" + prefix + cropTypeList[typeIndex].img[0] + postfix + "' />");
        }
        if (percent <= 0.6) {
            $(".cropObject").html("<img src = '" + prefix + cropTypeList[typeIndex].img[1] + postfix + "' />");
        }
        if (percent <= 0) {
            $(".cropObject").html("<img src = '" + prefix + cropTypeList[typeIndex].img[2] + postfix + "' />");
            //cropList[i].ripe = 1;
        }
        var stolenFlag = "f";
        if (cropList[index].count != cropTypeList[typeIndex].count) {
            $(".cropObject").html("<img src = '" + prefix + cropTypeList[typeIndex].img[4] + postfix + "' />");
            stolenFlag = "t";
        }
        $(".cropObject").clone().attr("class", "croppedObject croppedObject" + index).attr("cropCount", cropList[index].count).attr("stolenFlag", stolenFlag).appendTo(".surfaceObject").css(styles);
    }
    if (currentCropId != undefined) {
        $(".cropObject").html("<img src = '" + prefix + cropTypeList[currentCropId].img[0] + postfix + "' />");
    }

    createCircle();
}

var levelCap = function (n) {
    var powerResult = 1;
    for (var i = 0; i < n; i++) {
        powerResult *= 2;
    }
    return powerResult * 100;
}

var SyndicateLevelCap = function (n) {
    return n * 100;
}

var staminaCap = function (n) {
    return 100 + n * 10;
}

var thiefNumber = function (n) {
    return n * 10;
}

var updateStaminaBar = function (consumedSta) {
    var staCap = staminaCap(currentUser.level);

    currentUser.sta -= consumedSta;
    var percent = (currentUser.sta / staCap) * 100;
    $(".staProgressBar").css("width", percent + "%");
    $(".staText").text(Math.floor(percent) + "%");
    //$(".staHoverText").text(currentUser.sta+"/"+staCap);
    _character.changed();
}

var updateUserStamina = function () {
    var staCap = staminaCap(currentUser.level);
    if (currentUser.sta >= staCap) {
        return;
    }
    currentUser.sta += 1;
    updateStaminaBar(0);
}

var updateUserExp = function (exp) {
    if (currentUser.level < 46) {
        currentUser.exp += parseInt(exp);
        currentUser.totalExp += exp;
        var lvlCap = levelCap(currentUser.level);

        if (currentUser.exp >= lvlCap) {

            currentUser.level += 1;
            Session.set('userLevel', currentUser.level);
            currentUser.exp = currentUser.exp - lvlCap;

            //set stamina to full
            currentUser.sta = staminaCap(currentUser.level);
            Meteor.call('updateUserStamina', s_Id, currentUser.sta);
            updateStaminaBar(0);

            Meteor.call('updateUserExp', s_Id, exp, currentUser.exp);
            //CongressInstance.updateUserExp(s_Id, currentUser.exp, {from:web3.eth.accounts[currentAccount], gas:2000000});
            var p_Id = Math.floor(Math.random() * 3);
            Meteor.call('playerLevelUp', s_Id, p_Id, function () {
                levelUp("userLevel");
                getUserData(s_Id);
                lvlCap = levelCap(currentUser.level);
                if (currentUser.level % 5 == 0) {
                    Meteor.call('moveUserLandPosition', s_Id, currentUser.landSize, async function () {
                        await rerenderCropLand(s_Id);
                        $(".unlockCropId").html("<h3>Unlock Crop: " + cropTypeList[cropTypeList.length - 1].name + "</h3>");
                        Session.set("unlockCrop", cropTypeList.length - 1);
                    });
                    //GamePropertyInstance.moveUserLandPosition(s_Id, currentUser.landSize, {from:web3.eth.accounts[currentAccount], gas:2000000});
                } else {
                    $(".unlockCropId").html('');
                    rerenderCropLand(s_Id);
                }
                lvlCap = levelCap(currentUser.level);
            });
        } else {
            Meteor.call('updateUserExp', s_Id, exp, currentUser.exp);
        }
        var percent = Math.floor((currentUser.exp / lvlCap) * 100);
        $(".expProgressBar").css("width", percent + "%");
        $(".expText").text(percent + "%");
        _character.changed();
        if ((currentUser.level == 5)&&(!Meteor.user().profile.game.stakeholder.answered)) {
            showQuestionnaire();
        }
    }
}

var updateSyndicateExp = function (exp) {
    if (currentUser.SyndicateLevel <= 9) {
        currentUser.SyndicateExp += parseInt(exp);
        currentUser.SyndicateTotalExp += parseInt(exp);
        var lvlCap = SyndicateLevelCap(currentUser.SyndicateLevel);

        if (currentUser.SyndicateExp >= lvlCap) {
            if (Session.get('userCharacter') == "Guard") {
                setGuardProperty();
            }

            //set stamina to full
            currentUser.sta = staminaCap(currentUser.level);
            Meteor.call('updateUserStamina', s_Id, currentUser.sta);
            updateStaminaBar(0);

            currentUser.SyndicateLevel += 1;
            $(".front").find("h3").text("LV. " + currentUser.SyndicateLevel);

            Session.set('SyndicateLevel', currentUser.SyndicateLevel);
            currentUser.SyndicateExp = currentUser.SyndicateExp - lvlCap;
            levelUp('Syndicate');
            lvlCap = SyndicateLevelCap(currentUser.SyndicateLevel);
        }
        Meteor.call('updateSyndicateExp', s_Id, exp, currentUser.SyndicateExp, currentUser.SyndicateLevel);

        var percent = Math.floor((currentUser.SyndicateExp / lvlCap) * 100);
        $(".SyndicateExpProgressBar").css("width", percent + "%");
        $(".SyndicateExpText").text(percent + "%");
        _character.changed();
    }
}

var levelUp = function (_type) {
    if (_type == 'userLevel') {
        Session.set('Levelup', currentUser.level);
        Session.set('staminaCap', staminaCap(currentUser.level));
        Session.set('expCap', levelCap(currentUser.level));
        $('.levelUpReward').css('display', 'flex');
    }
    else {
        Session.set('Levelup', currentUser.SyndicateLevel);
        Session.set('staminaCap', staminaCap(currentUser.level));
        Session.set('expCap', levelCap(currentUser.level));
        $('.levelUpReward').css('display', 'none');
    }

    $(".levelUp").fadeIn().delay(5000).fadeOut();
}

var setGuardProperty = function () {
    var propertyIndex, userIndex;
    for (var i = 0; i < user_property.length; i++) {
        if ((user_property[i].propertyType - 29) == currentUser.SyndicateLevel) {
            propertyIndex = user_property[i].id;
            userIndex = i;
            break;
        }
    }
    user_property[userIndex].propertyCount = 0;
    user_property[userIndex].tradeable = 0;
    user_property[userIndex + 1].propertyCount = 1;
    user_property[userIndex + 1].tradeable = 0;
    Meteor.call('updatePropertyCount_Setting', s_Id, propertyIndex, 0, 0);
    Meteor.call('updatePropertyCount_Setting', s_Id, (propertyIndex + 1), 1, 0);
}



var checkMission = function () {
    if (showThief) {
        var maxCount = (landInfo.length / 2);
        if ($('.thief').length > maxCount) {
            do {
                var removeRand = Math.round(Math.random() * maxCount);
            } while (removeRand >= $('.thief').length);
            var removeObj = $('.thief:eq(' + removeRand + ')');
            var removeIndex = removeObj.attr('bindIndex');
            landInfo[removeIndex].showed = 0;
            removeObj.css({ opacity: 0, transform: "translateY(50px)" });
            removeObj.remove();
        }
        else {
            var show;
            do {
                var rand = Math.round(Math.random() * userLandConfiguration.length);
                show = landInfo[rand].showed;
            } while (show != 0);

            var top = landInfo[rand].top;
            var left = landInfo[rand].left;

            var areaLeft = $(".gamingArea").position().left;
            var divHeight = $(".cropObject").height() / 5;
            var divWidth = $(".cropObject").width() / 1.65;

            var missionStyles = {
                top: top - (divHeight * 2),
                left: left - areaLeft + (divWidth * 3),
                width: "150px",
                height: "150px",
                position: "absolute",
                opacity: 1,
                "z-index": 5,
                display: 'inline'
            };

            var prob = Math.random() * 3;

            if (prob > 2) {
                $(".thiefObject").html("<img src = '/img/game/thief.gif' />");
                $(".thiefObject").clone().attr("class", "thief thief" + theifId++).appendTo(".missionObject").css(missionStyles).attr('bindIndex', rand);
                landInfo[rand].showed = 1;
            }
        }
    }
    else {
        $(".missionObject").html("<div class='thiefObject'></div>");
    }
}

var cropSummaryUpdate = function () {
    for (var i = 0; i < cropList.length; i++) {
        if (cropList[i].name == 0 || cropList[i].ripe) {
            continue;
        }
        var difference = elapsedTime(new Date(), cropList[i].end);
        var originDifference = elapsedTime(cropList[i].start, cropList[i].end);
        var percent = difference / originDifference;

        var index;
        for (var j = 0; j < cropTypeList.length; j++) {
            if (cropTypeList[j].id == cropList[i].type) {
                index = j;
                break;
            }
        }

        if (percent > 0.6) {
            $(".croppedObject" + cropList[i].id).find("img").attr("src", prefix + cropTypeList[index].img[0] + postfix);
        }
        if (percent <= 0.6) {
            $(".croppedObject" + cropList[i].id).find("img").attr("src", prefix + cropTypeList[index].img[1] + postfix);
        }
        if (percent <= 0) {
            if (cropList[i].count != cropTypeList[index].count) {
                $(".croppedObject" + cropList[i].id).find("img").attr("src", prefix + cropTypeList[index].img[4] + postfix);
            }
            else {
                $(".croppedObject" + cropList[i].id).find("img").attr("src", prefix + cropTypeList[index].img[2] + postfix);
            }
            cropList[i].ripe = 1;
            $(".timeLeft" + cropList[i].id).html("Ready to harvest");

            continue;
        }

        var diffData = (difference.getHours() - 8) + ' Hrs. ' + difference.getMinutes() + ' Mins. ' + difference.getSeconds() + " Secs";
        $(".timeLeft" + i).html(diffData);
    }
}

var elapsedTime = function (start, end) {
    //var elapsed = end.getTime() - start.getTime();
    var elapsed = end - start; // time in milliseconds
    var difference = new Date(elapsed);
    //var diff_days = difference.getDate();
    //var diff_hours = difference.getHours();
    //var diff_mins = difference.getMinutes();
    //var diff_secs = difference.getSeconds();
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

get_Avg = async function () {
    var a = await dbPromise('getAvgTradableNumber');
    return a;
}

get_user_property = function () {
    user_property = [];
    var db_property = Meteor.user().profile.game.property;
    var avg = []
    Meteor.call('getAvgTradableNumber', function (err, res) {
        for (var k = 0; k < res.length; k++) {
            $('#tradable_td' + k).find('p').remove();
            $('#tradable_td' + k).prepend('<p style="padding-bottom:2px;">Avg : ' + res[k] + '</p>');
        }
        //avg = res;
    });
    //var avg = get_Avg();
    for (var i = 0; i < db_property.name.length; i++) {
        user_property.push({
            "id": db_property.id[i],
            "name": db_property.name[i],
            "propertyType": db_property.type[i],
            "propertyCount": db_property.count[i],
            "tradeable": db_property.tradeable[i],
            "img": cropData[db_property.type[i]].img[3],
            "isTrading": db_property.isTrading[i],
        });
    }
}

get_propertyType_setting = async function (_length) {
    display_field = [];

    var mongoPropertyType = await callPromise("callMongo", "getPropertyType", []);

    currentThreshold = await callPromise("callMongo", "getThreshold", [Meteor.user().profile.game.stakeholder.id]);
    // var property_type;
    // var s_Id = Meteor.users.findOne({ _id: Session.get("id") }).profile.game.stakeholder.id;
    // property_type = await callPromise("callContract", "Property", "getPropertyTypeByUserId", s_Id);

    // console.log(property_type);
    // if (property_type.type == "error"){
    //     loading(0);
    //     sweetAlert("Oops...", "Something went wrong... Please try again", "error");
    //     ratingOpened = false;
    //     return;
    // }
    // property_type.sort(function (crop1, crop2) {
    //     if (crop1[1] > crop2[1]) return 1;
    //     if (crop1[1] < crop2[1]) return -1;
    //     return 0;
    // });
    // console.log(property_type);

    if (mongoPropertyType.length != _length) {
        loading(0);
        sweetAlert("Oops... Something went wrong!", "Please try again later :(", "error");
        return;
    }

    var s_Id = Meteor.user().profile.game.stakeholder.id;
    for (var i = 0; i < mongoPropertyType.length; i++) {

        var averageRating = 0;
        for (var j = 0; j < mongoPropertyType[i].rating.length; j++) {
            mongoPropertyType[i].rating[j] = parseInt(mongoPropertyType[i].rating[j])
            averageRating += mongoPropertyType[i].rating[j];
        }
        averageRating = parseInt(averageRating / mongoPropertyType[i].rating.length);

        var _name = mongoPropertyType[i].name;
        var _id = mongoPropertyType[i].id;
        var _rating = mongoPropertyType[i].rating[s_Id];
        var _averageRating = averageRating;
        var data = { "name": _name, "id": _id, "rating": _rating, "averageRating": _averageRating };
        display_field.push(data);
    }


}

set_property_table = function () {

    get_user_property();
    var table, tr, td;
    $('.tradeable_content').html('');
    table = $('<table></table>').attr('id', 'property_trade_table')
        .attr('class', 'property_shop_table');
    // for tip content
    var tipPropertyString = "";
    if (Session.get('userCharacter') == "Thief") {
        tipPropertyString = "It consists the crops which you gathered or stole.";
    } else {
        tipPropertyString = "It consists crops and guard of which level is decided by playing in Guard mode.";
    }
    //content
    var flag = 0;
    for (i = 0; i < user_property.length; i++) {
        if ((user_property[i].propertyCount != 0) || (user_property[i].tradeable != 0)) {
            if (flag == 0) {
                flag++;
                tr = $('<tr></tr>');
                // tr.append($('<th></th>').text('Property'));
                // tr.append($('<th></th>').text('Stock Number'));
                // tr.append($('<th></th>').text('Tradable Number'));
                tr.html(
                    '<th><div class="TradablePropertyTH">Property<div class="tipContainer tipContainerProperty"><img id="tipPropertyImg" src="/img/game/question-mark.png" alt=""><div class="tipPropertyText tipText">' + tipPropertyString + '</div></div></div></th><th>Stock Number</th><th><div class="TradableNumTH">Tradable Number<div class="tipContainer tipContainerTradable"><img id="tipTradableImg" src="/img/game/question-mark.png" alt=""><div class="tipTradableText tipText">The quantity of the crop which you want to provide for joining the exchange.<br> Notice that while processing match-making, this value can not be changed until it completes.</div></div></div></th>'
                );
                table.append(tr);
            }
            tr = $('<tr></tr>');
            td = $('<td></td>');
            td.append($('<img></img>', {
                src: prefix + user_property[i].img + postfix,
                style: 'width:50px; height:50px'
            })).append("<div>" + user_property[i].name + "</div>");
            tr.append(td);
            td = $('<td></td>');
            td.text(user_property[i].propertyCount);
            tr.append(td);
            td = $('<td></td>', {
                id: 'tradable_td' + i
            });
            // td.append('Avg : ' + user_property[i].avgTradable);
            tradeable_input = $('<input></input>', {
                type: 'text',
                class: 'shop_tradable_input',
                id: 'tradable_input_' + user_property[i].id,
                value: user_property[i].tradeable
            })
                .on('focusin', function () {
                    $(this).data('val', $(this).val());
                })
                .on('keydown', function (e) {
                    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13]) !== -1 ||
                        (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
                        (e.keyCode >= 35 && e.keyCode <= 40)) {
                        return;
                    }
                    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                        e.preventDefault();
                    }
                })
                .on('change', function (e) {
                    var n = parseInt($(this).val());
                    var _id = index_finder($(this).attr('id'), 'tradable_input_');
                    var total = parseInt($('#shop_stock_' + _id).val());
                    if (Number.isInteger(n)) {
                        if (n > total) {
                            $(this).val(total);
                            n = total
                        }
                        $('#shop_stock_' + _id)[0].parentNode.previousSibling.textContent = total - n;
                    }
                    else {
                        sweetAlert('Oops', 'Tradable number must be integer.', 'error');
                        $(this).val($(this).data('val'));
                    }
                })
                .on('click', function () {
                    $(this).select();
                });
            if (user_property[i].isTrading) {
                tradeable_input.prop('disabled', true);
                tradeable_input.prop('disabled', true);
                tradeable_input.addClass('shop_tradable_input_isTrading');
            }
            td.append(tradeable_input);
            td.append($('<input></input>', {
                type: 'hidden',
                id: 'shop_stock_' + user_property[i].id,
                value: parseInt(user_property[i].propertyCount, 10) + parseInt(user_property[i].tradeable, 10)
            }));
            tr.append(td);
            table.append(tr);
        }
    }

    if (!flag) {
        tr = $('<tr></tr>');
        tr.append($('<th></th>').text('No Stock Found'));
        table.append(tr);
    }
    //content
    $('.tradeable_content').append(table);
}

index_finder = function (_source, _mask) {
    var res = _source.substring(_mask.length, _source.length);
    return res;
}

set_propertyType_table = async function () {
    loading(1);
    var res = await callPromise("getPropertyTypeLength");
    console.log(res);
    get_propertyType_setting(res);
    rend_propertyType_table(res);
}

rend_propertyType_table = function (_length) {
    onchangedIndex = [];
    if (display_field.length != _length) {
        setTimeout(function () {
            rend_propertyType_table(_length);
        }, 1000);
    }
    else {
        var table, tr, td, property_index;
        loading(1);
        $('.shop_content').html(
            '<div class="ratingRange">Rating Tolerance<div class="tipTolerance tipContainer"><img src="/img/game/question-mark.png" alt=""><div class="tipToleranceText tipText">The lower represents that you can only accept the equipollently important crop while exchanging. The higher means you may not receive the expected crop, but the higher success rate will occur.</div></div><input type="range" value="0" max="100" min="0" step="1" id="ratingPercent"><label for="ratingPercent">0%</label></div><hr>'
        );
        console.log(currentThreshold)
        $('#ratingPercent').val(currentThreshold).on('change', function () {
            $('label[for = ratingPercent]').html($(this).val());
        });

        table = $('<table></table>').attr('id', 'property_table')
            .attr('class', 'property_shop_table');
        //header
        tr = $('<tr></tr>');
        // tr.append($('<th></th>').text('Property'));
        // tr.append($('<th></th>').text('Rating'));
        // tr.append($('<th></th>').text('AVG Rating'));
        tr.html('<th>Property</th><th><div class="RatingTH">Rating<div class="tipContainer tipContainerRating"><img id="tipRatingImg" src="/img/game/question-mark.png" alt=""><div class="tipRatingText tipText">It represents how important the crop is to you.</div></div></div></th><th><div class="AvgRatingTH">AVG Rating<div class="tipContainer tipContainerAvg"><img id="tipAvgRatingImg" src="/img/game/question-mark.png" alt=""><div class="tipAvgRatingText tipText">Current average rating from all the gamers.</div></div></div></th>'
        );
        table.append(tr);
        //header
        //content
        for (i = 0; i < display_field.length; i++) {
            tr = $('<tr></tr>');
            tr.append($('<td></td>').html("<div><div><img src = '" + prefix + (display_field[i].name.toLowerCase()) + postfix + "'/></div>" + "<div>" + display_field[i].name + "</div></div>"));
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
                var id = $(this).attr('id').split("rating")[1];
                if (jQuery.inArray(id, onchangedIndex) == -1) {
                    onchangedIndex.push(id);
                }
                $('label[for = ' + $(this).attr('id') + ']').html($(this).val());
            })
            );
            tr.append(td);
            tr.append($('<td></td>').text(display_field[i].averageRating));
            table.append(tr);
        }
        //content
        $('.shop_content').append(table);


        loading(0); // original function, don't delete

        // step 2.5 for tutorial, for rating

        if (tutorialMode == 2) {
            t2PageCnt++;   // step 2.5.1  case=5
            tutorial2();
            // var styleHidden={
            //   "visibility":"hidden",
            //   "opacity":"0",
            // };
            // var styleVisible={
            //   "visibility":"visible",
            //   "opacity":"1",
            // };
            // var styleAnimation={
            //   "-webkit-animation":"missionAnimation 1s infinite"
            // };

            // //set
            // $('.shop_content').css("overflow","hidden");
            // //$('.tipToleranceText').css(styleVisible);
            // $('.ratingRange').css(styleAnimation);
            // setCircleTarget($('.ratingRange'),false,"down",0.8,stringRatingTor,true);
            // createCircle();



            setTimeout(function () {
                // t2PageCnt++;//  step 2.5.2  case=6
                // tutorial2();

                // //reset
                // $('.tipToleranceText').css(styleHidden);
                // $('.ratingRange').css("-webkit-animation","");
                // //set
                // $('.tipRatingText').css(styleVisible);
                // $('.property_shop_table').find("td:nth-child(2), th:nth-child(2)").css(styleAnimation);


                //   setTimeout(function () {
                // t2PageCnt++; // step 2.5.3 case=7
                // tutorial2();

                //     //reset
                //     $('.tipRatingText').css(styleHidden);
                //     $('.property_shop_table').find("td:nth-child(2), th:nth-child(2)").css("-webkit-animation","");
                //     //set
                //     $('.tipAvgRatingText').css(styleVisible);
                //     $('.property_shop_table').find("td:nth-child(3), th:nth-child(3)").css(styleAnimation);
                //
                //     setTimeout(function () {
                // t2PageCnt++;  // step 2.5.4  case=8
                // tutorial2();

                //       $('.tipAvgRatingText').css(styleHidden);
                //       $('.property_shop_table').find("td:nth-child(3), th:nth-child(3)").css("-webkit-animation","");
                //
                //       sweetAlert("One more thing you need to be careful ! ","","success");
                //
                //       setCircleTarget($('.crop3'),false,"right",6,stringcrop3);
                //       $('.crop3').css("-webkit-animation","leftBtnAnimation 1s infinite");
                //       createCircle();
                //
                //     }, 8000);
                //
                //   }, 10000);
                //
            }, 15000);


        }

        $('label[for = ratingPercent]').text(currentThreshold);
        loading(0);

    }
}

save_tradable_setting = function () {
    get_user_property();
    for (i = 0; i < $('.shop_tradable_input').length; i++) {
        var _id = index_finder($('.shop_tradable_input')[i].id, 'tradable_input_');
        var _tradable = $('#tradable_input_' + _id).val();
        var _propertyCount = parseInt($('#shop_stock_' + _id).val()) - parseInt(_tradable);
        for (j = 0; j < user_property.length; j++) {
            if (user_property[j].id == _id) {
                if (user_property[j].isTrading) {
                    $('#tradable_input_' + _id).addClass('shop_tradable_input_isTrading');
                }
                else {
                    user_property[j].propertyCount = _propertyCount;
                    user_property[j].tradeable = _tradable;
                    Meteor.call('updatePropertyCount_Setting', s_Id, _id, _propertyCount, _tradable);
                }
                break;
            }
        }
    }
    sweetAlert("Congratulations!", "Setting Saved!", "success");
    get_user_property();
}

save_rating_setting = async function () {
    loading(1);

    var s_Length = 0;
    var allUser = Meteor.users.find().fetch();
    for (i = 0; i < allUser.length; i++) {
        if (allUser[i].emails[0].verified)
            s_Length++;
    }

    var s_Id = Meteor.users.findOne({ _id: Session.get("id") }).profile.game.stakeholder.id;
    try {
        for (i = 0; i < onchangedIndex.length; i++) {
            var _id = parseInt(display_field[onchangedIndex[i]].id, 10);
            var _rate = parseInt($('#rating' + onchangedIndex[i]).val(), 10);
            var res = await callPromise("updatePropertyTypeRating", _id, _rate, s_Id);
            var res = await callPromise("callContract", "Property", "updatePropertyTypeRating", [_id, _rate * floatOffset, "update", s_Length, s_Id]);

        }
        var _ratingPercent = parseInt($('#ratingPercent').val(), 10);
        var res = await Meteor.call("updateRatingTolerance", _ratingPercent, Meteor.user().profile.game.stakeholder.id);
    } catch (e) {
        console.log(e);
    }

    onchangedIndex = [];
    loading(0);
    sweetAlert("Congratulations!", "Rating Saved!", "success");
}

/////////////////////////
//  Mission Functions  //
/////////////////////////
var mission_list = [];

get_mission_list = function () {
    mission_list = [];
    var _missionList = mission.find().fetch()[0].data;
    var _missionAccountStatus = Meteor.users.findOne({ _id: Session.get("id") }).profile.game.mission.accountStatus;
    for (var i = 1; i < _missionList.length; i++) {
        if (_missionList[i].lvl_limitation > currentUser.level) {
            break;
        }
        if ((_missionList[i].status) && (!_missionAccountStatus[i])) {
            for (var j = 0; j < _missionList[i].missionItem.length; j++) {
                var target_property = find_propertyInfo(_missionList[i].missionItem[j].propertyId);
                _missionList[i].missionItem[j].name = target_property.name;
                _missionList[i].missionItem[j].img = target_property.img;
            }
            mission_list.push(_missionList[i]);
        }
    }
}

find_propertyInfo = function (item_id) {
    for (k = 0; k < user_property.length; k++) {
        if (user_property[k].propertyType == item_id) {
            target_crop = { name: user_property[k].name, img: user_property[k].img };
            return (target_crop);
        }
    }
}

set_mission_table = async function () {
    loading(1);
    await get_mission_list();
    await mission_rending();
}

mission_rending = function () {
    loading(1);
    $('.mission_template').html('');
    $('.mission_template').append($('<button></button>', {
        type: 'button',
        id: 'btn_mission_close',
        class: 'btnClose'
    })
        .on('click', function () { $('.mission_template').css('display', 'none'); }).text('X')
    ).append($('<div></div>', {
        class: 'mission_header'
    }).text('Mission'));

    var div, table, tr, td;
    div = $('<div></div>', { class: 'mission_content' })
    table = $('<table></table>', { id: 'mission_table' });
    //header
    tr = $('<tr></tr>');
    tr.append($('<th></th>').text('Mission'));
    tr.append($('<th></th>').text('Requirement'));
    tr.append($('<th></th>').text('Exp'));
    tr.append($('<th></th>').text('Submit'));
    table.append(tr);
    //header
    //content
    for (i = 0; i < mission_list.length; i++) {
        if (!mission_list[i].solved) {
            tr = $('<tr></tr>');
            td = $('<td></td>', {
                text: mission_list[i].name
            });
            tr.append(td);
            td = $('<td></td>');
            for (j = 0; j < mission_list[i].missionItem.length; j++) {
                td.append($('<img></img>', {
                    src: prefix + mission_list[i].missionItem[j].img + postfix,
                    alt: mission_list[i].missionItem[j].name
                }));
                td.append($('<span></span>', {
                    text: ' X ' + mission_list[i].missionItem[j].quantity
                }));
            }
            tr.append(td);
            td = $('<td></td>', {
                text: mission_list[i].exp
            });
            tr.append(td);
            td = $('<td></td>');
            td.append($('<input></input>', {
                type: 'hidden',
                id: 'mission_exp_' + mission_list[i].id,
                value: mission_list[i].exp
            }));
            td.append($('<input></input>', {
                type: 'hidden',
                id: 'mission_id_' + mission_list[i].id
            }));
            td.append($('<input></input>', {
                type: 'button',
                value: 'Submit',
                id: 'btn_mission_submit_' + mission_list[i].id,
                style: 'margin: 0 auto; display:block;'
            })
                .on('click', function () {
                    var _id = index_finder($(this).prev('input').attr('id'), 'mission_id_');
                    var mission_qualify = mission_qualify_check(_id);
                    if (mission_qualify) {
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
    for (k = 0; k < mission_list.length; k++) {
        mission_qualify_check(mission_list[k].id);
    }
    loading(0);

    if (tutorialMode == 1) {
        t1PageCnt++;
        tutorial1();
    }
}

mission_submit = async function (_id) {
    updateUserExp(parseInt($('#mission_exp_' + _id).val()));
    var target_mission;
    for (i = 0; i < mission_list.length; i++) {
        if (mission_list[i].id == _id) {
            target_mission = mission_list[i];
            break;
        }
    }
    if (target_mission == undefined) {
        sweetAlert('Oops', 'System error! Please try again', 'error');
        return;
    }

    for (k = 0; k < target_mission.missionItem.length; k++) {
        for (i = 0; i < user_property.length; i++) {
            if (user_property[i].propertyType == target_mission.missionItem[k].propertyId) {
                user_property[i].propertyCount += (parseInt(target_mission.missionItem[k].quantity) * -1);
                Meteor.call('updatePropertyCount', s_Id, i, (parseInt(target_mission.missionItem[k].quantity) * -1));
                //usingPropertyInstance.updatePropertyCount_MissionSubmit(user_property[i].id, user_property[i].propertyCount,  { from: web3.eth.accounts[currentAccount], gas: 2000000 });
                break;
            }
        }
    }
    Meteor.call('submitMission', s_Id, _id, function () {
        initAllBtns();
        set_property_table();
        sweetAlert("Congratulations!", "Mission Completed!", "success");
        set_mission_table();
    });
}

mission_qualify_check = function (_id) {
    var target_mission;
    for (i = 0; i < mission_list.length; i++) {
        if (mission_list[i].id == _id) {
            target_mission = mission_list[i];
            break;
        }
    }
    var qualify = false;
    for (i = 0; i < target_mission.missionItem.length; i++) {
        qualify = false;
        for (j = 0; j < user_property.length; j++) {
            if (user_property[j].propertyType == target_mission.missionItem[i].propertyId) {
                if (parseInt(user_property[j].propertyCount, 10) >= parseInt(target_mission.missionItem[i].quantity, 10)) {
                    qualify = true;
                }
                else {
                    qualify = false;
                }
                break;
            }
        }
        if (!qualify) {
            break;
        }
    }

    if (qualify) {
        $('#btn_mission_submit_' + _id).css('display', 'block');
        return (true);
    }
    else {
        $('#btn_mission_submit_' + _id).css('display', 'none');
        return (false);
    }
}

get_rank_data = async function () {
    loading(1);
    var rankData = await dbPromise('getRanking');
    sorted = selectedSort(rankData);
    set_rank_table(sorted);
    loading(0);
}

set_rank_table = function (data) {
    $('.rank_template').html('');

    $('.rank_template').append($('<button></button>', {
        type: 'button',
        id: 'btn_rank_close',
        class: 'btnClose'
    })
        .on('click', function () { $('.rank_template').css('display', 'none'); }).text('X')
    ).append($('<div></div>', {
        class: 'rank_header'
    }).text('Rank'));

    var table, tr, td;
    table = $('<table></table>', { id: 'rank_table', class: 'rank_table' });
    //header
    tr = $('<tr></tr>');
    tr.append($('<th></th>', { text: 'Rank', style: 'width:5vw' }));
    tr.append($('<th></th>', { text: 'Name', style: 'width:8vw' }));
    tr.append($('<th></th>', { text: 'Address', style: 'width:18vw' }));
    tr.append($('<th></th>', { text: 'Lv', style: 'width:5vw;' }));
    table.append(tr);
    //header
    //content
    var table_length;
    if (data.length > 10) {
        table_length = 10;
    }
    else {
        table_length = data.length;
    }
    var onboard = 0;
    for (i = 0; i < table_length; i++) {
        if (data[i].address == currentUser.address) {
            onboard = 1;
            tr = $('<tr></tr>', { class: "onBoard" });
        }
        else {
            tr = $('<tr></tr>');
        }
        td = $('<td></td>', { text: (i + 1) });
        tr.append(td);
        td = $('<td></td>', { text: data[i].name, style: 'word-wrap:break-word;' });
        tr.append(td);
        td = $('<td></td>', { text: data[i].address, style: 'word-wrap:break-word;' });
        tr.append(td);
        td = $('<td></td>', { text: data[i].lv, style: 'word-wrap:break-word;' });
        tr.append(td);
        table.append(tr);
    }
    if (onboard == 0) {
        for (i = 0; i < data.length; i++) {
            if (data[i].address == currentUser.address) {
                tr = $('<tr></tr>', { class: "onBoard" });
                td = $('<td></td>', { text: (i + 1) });
                tr.append(td);
                td = $('<td></td>', { text: data[i].name });
                tr.append(td);
                td = $('<td></td>', { text: data[i].address });
                tr.append(td);
                td = $('<td></td>', { text: data[i].lv });
                tr.append(td);
                table.append(tr);
            }
        }
    }

    $('.rank_template').append(table);
}

var selectedSort = function (data) {
    var tmp, max;
    for (i = 0; i < data.length; i++) {
        max = i;
        for (j = i + 1; j < data.length; j++) {
            if (data[j].lv > data[max].lv) {
                max = j;
            }
        }
        if (max != i) {
            tmp = data[i];
            data[i] = data[max];
            data[max] = tmp;
        }
    }
    return data;
}
var questionCount = 0;
<<<<<<< HEAD

var showQuestionnaire = function(){
    if($('.questionnaire_content').length == 0){
createQuestionnaire();
    }
    else{
        $('.questionnaire_main').css('display','flex');
    }
}

=======
var showQuestionnaire = function () {
    if ($('.questionnaire_content').length == 0) {
        createQuestionnaire();
    }
    else {
        $('.questionnaire_content').css('display', 'flex');
    }
}
>>>>>>> 550ac055c7a7013b44ba7a8b82243058dbdb4fb6
var createQuestionnaire = function () {
    currentPage = 1;
    pagerCounter = 1;
    var ageData = ['below 21', '21-30', '31-40', '41-50', '51-60', 'above 60'];
    var educationData = ['High School or Equivalent', 'Vocational or Technical School', "Bachelor's Degree", "Master's Degree", "Doctoral Degree", "Professional degree (MD, JD, etc.)", "Others"];
    var EmploymentData = [
        "Student", "Information, Software and Technology", "Manufacturing and Electronics", "Arts, Entertainment, or Recreation", "Finance or Insurance",
        "Government and Public Administration", "Health Care and Social Assistance", "Telecommunications", "Education", "Retired", "Others"
    ];
    var questions = [
        "h1 BlockFarm Operating Questionnaire",
        "h2 This questionnaire is designed for an academic research, apply to D3 Accelerator Project of Service Science Research Center in National Chengchi University, R.O.C.. Your privacy information will be under protection and only used for contacting when there is any implementation or reward sending problems.",
        "Q0: I think the gaming mechanism is meaningful.",
        "h1 Simple Questions for User Ability",
        "Q1: It is not difficult for me to make new friends.",
        "Q2: I can make friends through my personal abilities.",
        "Q3: If something looks too complicated, I will still do my best to try it.",
        "Q4: When try to learn something new, I will not give up easily.",
        "Q5: I do not avoid learning new things when they look too difficult for me.",
        "Q6: I am confident about my ability to play this game.",
        "Q7: I can determine how to play this game.",
        "Next Page",
        "h3 ● Second part is some questions about our bartering mechanism.",
        "h1 Questions For Crops' Match-Making Mechanism",
        "h2 Match-making mechanism is the core value of bartering in Blockfarm, it is used for exchanging crops with other players. You just set up an importance of each crop and how many crops you are willing to exchange in the next transaction, then We will try to find the best solution for your crop bartering through match-making mechanism.",
        "Q8: You think our match-making mechanism meets your expectations and is easy to use.",
        "Q9: Our match-making mechanism can help you exchange crops you really want.",
        "Q10: I do not need to spend lots of time using match-making.",
        "Q11: I do not need to put a lot of efforts while match-making.",
        "Q12: I do not need to wait for a long time to get what I want.",
        "Q13: There is no difficulty for me to use match-making.",
        "Q14: I often could get crops I really want after match-making.",
        "Q15: Settings before match-making is simple and friendly to me.",
        "Q16: I am satisfied with the way doing match-making.",
        "Q17: I think the mechanism of match-making is great enough.",
        "h1 Personal Influence in Bartering Transactions",
        "h2 The match-making mechanism is based on player's importance of each crop and the preference of what you are earning for. The computing logic shows as follows:",
        "Q18: My ranking of crops will make an impact on other players' transaction results.",
        "Q19: Results of transactions will be affected by my ranking of crops.",
        "Q20: I can control what happens in my game result.",
        "Next Page",
        "h3 ● Third part is about your experience and feelings of BlockFarm.",
        "h1 Questions for Gaming Mechanism",
        "Q21: The gaming mechanism of Blockfarm is original ad novel.",
        "Q22: The gaming mechanism of Blockfarm is uncommon and deserve to be mentioned to others.",
        "Q23: The gaming mechanism of Blockfarm is unique and irreplaceable.",
        "Q24: Combination of blockchain and farming game is an innovating and expanding idea based on two differentiating domain.",
        "h1 Questions for Your Feelings of BlockFarm",
        "Q25: Playing Blockfarm makes you feel pleasant that you are expected to play this game.",
        "Q26: You feel enjoyable to have interactions in Blockfarm and would like to recommend this game to your friends.",
        "Q27: You are satisfied with our system’s quality and will keep playing this game.",
        "h3 ( interactions refers to thieving and guarding, crops transaction, etc. )",
        "Q28: This game is entertaining to you and you are willing to share this experience to others.",
        "Q29: The guideline is clear for me to understand.",
        "Q30: The gaming operation is convenient.",
        "Q31: You are satisfied with our system stability.",
        "Q32: There is s few disadvantages in Blockfarm, but they do not affect to game playing.",
        "Q33: I play Blockfarm frequently.",
        "h1 Would you like to keep playing BlockFarm?",
        "Q34: I will continue playing Blockfarm frequently in future.",
        "Q35: Many people I communicate with play this game.",
        "Q36: Many people I communicate with regularly play this game.",
        "Q37: People I communicate with will continue to play this game. ",
        "h1 Personal Information",
        "TQ38: Age:",
        "TQ39: Education:",
        "TQ40: Employment:",
        "TQ41: What do you think we can do to improve our match-making mechanism and Blockfarm?",
    ];
    $('.questionnaire_main').css('display', 'flex');
    $('.questionnaire_main').append($('<div></div>', {
        id: 'questionPage' + pagerCounter,
        class: 'questionnaire_content questionPage' + pagerCounter
    }));
    for (var i = 0; i < questions.length; i++) {
        if (questions[i].substring(0, 1) == 'Q') {
            $('.questionPage' + pagerCounter).append($('<div></div>', {
                id: 'question' + questionCount,
                class: 'question_q'
            }));
            $('#question' + questionCount).html(questions[i]);
            $('.questionPage' + pagerCounter).append($('<div></div>', {
                id: 'answer_cover' + questionCount,
                class: 'question_a_cover'
            }));
            $('#answer_cover' + questionCount).append($('<div></div>', {
                id: 'answer' + questionCount,
                class: 'question_a'
            }));
            $('#answer' + questionCount).append('<p>Strongly Disagree</p>');
            for (var j = 1; j <= 5; j++) {
                $('#answer' + questionCount).append($('<div></div>', {
                    id: 'answerRadio' + questionCount + '_' + j,
                    class: 'answerRadioDiv'
                }));
                $('#answerRadio' + questionCount + '_' + j).append($('<label></label>', {
                    for: 'radioAnswer' + questionCount + '_' + j,
                    text: j
                }));
                $('#answerRadio' + questionCount + '_' + j).append($('<input></input>', {
                    id: 'radioAnswer' + questionCount + '_' + j,
                    type: 'radio',
                    class: 'option-input radio',
                    style: 'outline: none;',
                    name: 'radioAnswer' + questionCount,
                    value: j
                }));
            }
            $('#answer' + questionCount).append('<p>Strongly Agree</p>');
            $('#answer_cover' + questionCount).append($('<hr>', {
                class: 'question_hr'
            }));
            questionCount++;
        }
        else if (questions[i].substring(0, 1) == 'h') {
            $('.questionPage' + pagerCounter).append($('<div></div>', {
                id: 'questionTitle' + i,
                class: 'questionTitle'
            }));
            var showText = questions[i].substring(2, questions[i].length);
            $('#questionTitle' + i).html('<h' + questions[i].substring(1, 2) + '>' + showText + '<h' + questions[i].substring(0, 1) + '/>');
        }
        else if (questions[i] == 'Next Page') {
            pagerCounter++;
            $('.questionnaire_main').append($('<div></div>', {
                id: 'questionPage' + pagerCounter,
                class: 'questionnaire_content questionPage' + pagerCounter
            }));
        }
        else if (questions[i].substring(0, 1) == 'T') {
        }
    }
    dumpCounter = 54;
    //age
    $('.questionPage' + pagerCounter).append($('<div></div>', {
        id: 'question' + questionCount,
        class: 'question_q'
    }));
    $('#question' + questionCount).html(questions[dumpCounter].substring(1, questions[dumpCounter].length));
    $('.questionPage' + pagerCounter).append($('<div></div>', {
        id: 'answer_cover' + questionCount,
        class: 'question_a_cover'
    }));
    $('#answer_cover' + questionCount).append($('<div></div>', {
        id: 'answer' + questionCount,
        class: 'question_a'
    }));
    for (var j = 0; j < ageData.length; j++) {
        $('#answer' + questionCount).append($('<div></div>', {
            id: 'answerRadio' + questionCount + '_' + j,
            class: 'answerRadioDiv'
        }));
        $('#answerRadio' + questionCount + '_' + j).append($('<label></label>', {
            for: 'radioAnswer' + questionCount + '_' + j,
            text: ageData[j]
        }));
        $('#answerRadio' + questionCount + '_' + j).append($('<input></input>', {
            id: 'radioAnswer' + questionCount + '_' + j,
            type: 'radio',
            class: 'option-input radio',
            style: 'outline: none;',
            name: 'radioAnswer' + questionCount,
            value: j
        }));
    }
    $('#answer_cover' + questionCount).append($('<hr>', {
        class: 'question_hr'
    }));
    questionCount++;
    dumpCounter++;
    //age
    //education
    $('.questionPage' + pagerCounter).append($('<div></div>', {
        id: 'question' + questionCount,
        class: 'question_q'
    }));
    $('#question' + questionCount).html(questions[dumpCounter].substring(1, questions[dumpCounter].length));
    $('.questionPage' + pagerCounter).append($('<div></div>', {
        id: 'answer_cover' + questionCount,
        class: 'question_a_cover'
    }));
    $('#answer_cover' + questionCount).append($('<div></div>', {
        id: 'answer' + questionCount,
        class: 'question_a'
    }));
    for (var j = 0; j < educationData.length; j++) {
        $('#answer' + questionCount).append($('<div></div>', {
            id: 'answerRadio' + questionCount + '_' + j,
            class: 'answerRadioDiv'
        }));
        $('#answerRadio' + questionCount + '_' + j).append($('<label></label>', {
            for: 'radioAnswer' + questionCount + '_' + j,
            text: educationData[j]
        }));
        $('#answerRadio' + questionCount + '_' + j).append($('<input></input>', {
            id: 'radioAnswer' + questionCount + '_' + j,
            type: 'radio',
            class: 'option-input radio',
            style: 'outline: none;',
            name: 'radioAnswer' + questionCount,
            value: j
        }));
    }
    $('#answer_cover' + questionCount).append($('<hr>', {
        class: 'question_hr'
    }));
    questionCount++;
    dumpCounter++;
    //education
    //employment
    $('.questionPage' + pagerCounter).append($('<div></div>', {
        id: 'question' + questionCount,
        class: 'question_q'
    }));
    $('#question' + questionCount).html(questions[dumpCounter].substring(1, questions[dumpCounter].length));
    $('.questionPage' + pagerCounter).append($('<div></div>', {
        id: 'answer_cover' + questionCount,
        class: 'question_a_cover'
    }));
    EmploymentDivCounter = 0;
    for (var j = 0; j < EmploymentData.length; j++) {
        if ((j % 6) == 0) {
            EmploymentDivCounter++;
            $('#answer_cover' + questionCount).append($('<div></div>', {
                id: 'answer' + questionCount + '_' + EmploymentDivCounter,
                class: 'question_a'
            }));
        }
        $('#answer' + questionCount + '_' + EmploymentDivCounter).append($('<div></div>', {
            id: 'answerRadio' + questionCount + '_' + j,
            class: 'answerRadioDiv'
        }));
        $('#answerRadio' + questionCount + '_' + j).append($('<label></label>', {
            for: 'radioAnswer' + questionCount + '_' + j,
            text: EmploymentData[j]
        }));
        $('#answerRadio' + questionCount + '_' + j).append($('<input></input>', {
            id: 'radioAnswer' + questionCount + '_' + j,
            type: 'radio',
            class: 'option-input radio',
            name: 'radioAnswer' + questionCount,
            value: j
        }));
    }
    $('#answer_cover' + questionCount).append($('<hr>', {
        class: 'question_hr'
    }));
    questionCount++;
    dumpCounter++;
    //employment
    //feedback
    $('.questionPage' + pagerCounter).append($('<div></div>', {
        id: 'question' + questionCount,
        class: 'question_q'
    }));
    $('#question' + questionCount).html(questions[dumpCounter].substring(1, questions[dumpCounter].length));
    $('.questionPage' + pagerCounter).append($('<div></div>', {
        id: 'answer_cover' + questionCount,
        class: 'question_a_cover'
    }));
    $('#answer_cover' + questionCount).append($('<textarea></textarea>', {
        id: 'answer' + questionCount,
        type: 'text',
        class: 'question_textarea',
        rows: 5,
        cols: 50,
        maxlength: 255
    }));
    //feedback
    $('#answer_cover' + questionCount).append($('<hr>', {
        class: 'question_hr'
    }));
    $('.questionPage' + pagerCounter).append($('<div></div>', {
        id: 'answer_cover' + (questionCount + 1),
        class: 'question_a_cover questionEnd'
    }));
    $('#answer_cover' + (questionCount + 1)).append($('<input></input>', {
        type: 'button',
        value: 'submit',
        style: 'color:black;',
        class: 'hvr-rectangle-out questionBtn'
    })
        .on('click', function () {
            submitQuestionnaire();
        })
    );

    $('.questionPage' + currentPage).css('display', 'flex');
    $('.questionnaire_main').append($('<div></div>', {
        id: 'questionControl',
        class: 'questionControl'
    }));
    $('.questionControl').append($('<input></input>', {
        id: 'prevPage',
        type: 'button',
        class: 'questionBtn questionBtnPrev',
        disabled: true
    })
        .on('click', function () {
            pageFlip(-1);
        })
    );
    $('.questionControl').append($('<input></input>', {
        id: 'nextPage',
        type: 'button',
        class: 'questionBtn questionBtnNext'
    })
        .on('click', function () {
            pageFlip(1);
        })
    );
}

var submitQuestionnaire = function () {
    var answerChecked = true;
    var data = [];
    for (var i = 0; i < (questionCount - 1); i++) {
        var currentRadioValue = parseInt($('input[name=radioAnswer' + i + ']:checked').val());
        if (!Number.isInteger(currentRadioValue)) {
            answerChecked = false;
            $('#answer_cover' + i).addClass('mustAnswer');
        }
        else {
            $('#answer_cover' + i).removeClass('mustAnswer');
        }
        data.push(currentRadioValue);
    }
    data.push($('.question_textarea').val());
    console.log(data);
    if (answerChecked) {
        Meteor.call('submitQuestionnaire', s_Id, data);
        Meteor.call('updateAnswerStatus', s_Id);
        $('.questionnaire_main').css('display', 'none');
        sweetAlert('Thanks!', 'Success');
    }
    else {
        sweetAlert('Oops', 'All the questions must be selected!', 'error');
    }
}

var pageFlip = function (goto) {
    if (currentPage == 1) {
        $('#prevPage').attr('disabled', false);
    }
    else if (currentPage == pagerCounter) {
        $('#nextPage').attr('disabled', false);
    }
    $('.questionPage' + currentPage).hide();
    currentPage = currentPage + goto;
    $('.questionPage' + currentPage).fadeIn().css('display', 'flex');

    if (currentPage == 1) {
        $('#prevPage').attr('disabled', true);
    }
    else if (currentPage == pagerCounter) {
        $('#nextPage').attr('disabled', true);
    }
}

import { Tracker } from 'meteor/tracker';


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

var cropList = [];
var harvestCropList = [];
var landList = [];
var _dep = new Tracker.Dependency;

var cursorX;
var cursorY;


var hex2a = function(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

var panelCounter = 2, panelCount = 3;


var currentUser = {
  id:0,
  address:"0x101010101010",

  name: "john",
  exp: 0,
  type: "Guard",
  landSize: 3,
  level:0
};

var userLandConfiguration = [];


var cropTypeList = [
  {
    id:0,
    name: "Carrot",
    img: ["carrot_seed", "carrot_grow", "carrot_harvest", "carrot"],
    count:0,
    time:"0.0.0.3"

  },
  {
    id:1,
    name: "Radish",
    img: ["radish_seed", "radish_grow", "radish_harvest", "radish"],
    count:0,
    time:"0.0.0.30"

  },
  {
    id:2,
    name: "Lettuce",
    img: ["lettuce_seed", "lettuce_grow", "lettuce_harvest", "lettuce"],
    count:0,
    time:"0.0.10.0"

  },
  {
    id:3,
    name: "Cauliflower",
    img: ["cauliflower_seed", "cauliflower_grow", "cauliflower_harvest", "cauliflower"],
    count:0,
    time:"0.0.0.10"

  },
  {
    id:4,
    name: "Mill",
    img: ["mill", "cauliflower_grow", "cauliflower_harvest", "mill"],
    count:0,
    time:"0.1.0.0"

  }

];

var landTypeList = [
  {
    id:0,
    name: "Dirt",
    img: "land",
    count:0,
  },
  {
    id:1,
    name: "Water",
    img: "pond",
    count:0,

  }

];



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

//////////////////
//  onRendered  //
//////////////////

Template.gameIndex.rendered = function() {
    if(!this._rendered) {
      console.log('gameArea render complete');

      updateUserExp(0);
      farmObjectLoader();

      setInterval(cropSummaryUpdate, 1000);
      var audio = new Audio('/music/background_music.mp3');
      audio.play();

      for (var i = 0 ; i < currentUser.landSize*currentUser.landSize ; i++){
          userLandConfiguration.push(
            {
              id: i,
              land: null,
              crop:null
            }
          );
       }

    }
}

Template.shop.rendered = function () {
    //$.getJSON('property.json', function (property_data) {
    //    for (i = 0; i < property_data.length; i++) {
    //        property_database.push(property_data[i]);
    //        display_field.push(property_data[i]);
    //    }
    //});

    //$.getJSON('test.json', function (user_data) {
    //    property_log = user_data;
    //})
    //.done(function () {
    //    var select = $('<select>></select>');
    //    for (i = 0; i < property_log.length; i++) {
    //        option = $('<option>', {
    //            value: property_log[i].account,
    //            text: property_log[i].account
    //        });
    //        select.append(option);
    //    }
    //    select.on('change', function () {
    //        activated_account = $(this).val();
    //        set_property_table();
    //    })
    //    $('.shop_header').append(select);
    //})
    //.fail(function (jqxhr, textStatus, error) {
    //    var err = textStatus + ", " + error;
    //    console.log("Request Failed: " + err);
    //});
    //console.log("rend");

}


///////////////
//  Helpers  //
///////////////

var activated_account = 0;
var account_index;
property_log = [];
user_property = [];
property_database = [];
display_field = [];
//for testing
currentAccount = activated_account;
//for testing
Template.shop.helpers({

});

Template.characterList.helpers({
  userName: currentUser.name,
  userExp: currentUser.exp,
  characterType: currentUser.type
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


          if (userLandConfiguration[_landId].crop != null){
              alert("Its already been planted dude -3- ");
              return;
          }else if (userLandConfiguration[_landId].land == null){
              alert("WTF dude? you need a land first!!");
              return;
          }

          cropTypeList[currentCropId].count++;

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

          userLandConfiguration[_landId].land = _id;
          cropList.push({
            id: _id,
            name: cropTypeList[currentCropId].name,
            img:cropTypeList[currentCropId].img[3],
            start: start,
            end: end,
            type: cropTypeList[currentCropId].id,
            ripe: 0
          });
          _dep.changed();

        }else{
          alert("Specify Crop first");
          return;
        }



  },
  'click .farmObject': function(event){
      if (currentLandId != null && placeMode){
        var _landId = currentCropLand.split("cropLand")[1];

        if (userLandConfiguration[_landId].land != null){
            alert("Its already been planted dude -3- ");
            return;
        }
        landTypeList[currentLandId].count++;
        currentCropLand = currentCropLand.split(" ")[1];
        $( ".farmObject" ).children().clone().appendTo("."+currentCropLand).css({opacity:1});
        $("."+currentCropLand).css({"border-style":"none"});
        var _id = landList.length;

        userLandConfiguration[_landId].land = _id;
        landList.push({
          id: _id,
          name: landTypeList[currentLandId].name,
          img:landTypeList[currentLandId].img,
        });
      }else{
        alert("Specify Land first");
        return;
      }
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
          alert("Not yet~~~ Patience is a virtue <3");
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
        //cropList.splice(id, 1);
        $("."+cropClass).remove();



  },
})


Template.crop.events({
  'click .crop button': function (event){
      var id = $(event.target).parent()[0].className.split("property")[1];
      $(".cropObject").html("<img src = '" + prefix+ cropTypeList[id].img[0] + postfix +"' />");
      currentCropId = id;

      plantMode = !plantMode;
      if (plantMode){
          $(".cropObject").css("display", "inline");

          $(event.target).css("background", "gray");
          $(event.target).css("border-color", "gray");
          $(event.target).text("Done");
      }else{
          $(".cropObject").css("display", "none");
          $(event.target).css("background", "#337ab7");
          $(event.target).css("border-color", "#337ab7");
          $(event.target).text("Specify");

      }
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
})




/////////////////////////
//  Utility Functions  //
/////////////////////////


document.onmousemove = function(e){
    cursorX = e.pageX;
    cursorY = e.pageY;
}

var powerFunc = function(n){
    var powerResult = 1;
    for (var i = 0 ; i < n ; i++){
        powerResult *= 2;
    }
    return powerResult;
}

var updateUserExp = function(exp){
  currentUser.exp += parseInt(exp);
  var lvlCap = powerFunc(currentUser.level)*100;
  console.log((currentUser.exp/lvlCap)*100);
  $(".expProgressBar").css("width", (currentUser.exp/lvlCap)*100 + "%");
  $(".expText").text(currentUser.exp+"/"+lvlCap);
}

var cropSummaryUpdate = function(){

    for (var i = 0 ; i < cropList.length ; i++){
        if (cropList[i].ripe){
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



var farmObjectLoader = function(){
    $('.land').css("width", blockSize*currentUser.landSize );
    $('.land').css("height", blockSize*currentUser.landSize );

    for (var i = 0 ; i < currentUser.landSize*currentUser.landSize; i++){
        $('.land').append("<div class='farm cropLand" + i + "' style='border:1px solid black; border-style:solid;'></div>");
        //$('.land').append("<div></div>");
    }
}


/////////////////////////
//  Shop Functions  //
/////////////////////////

get_user_property_setting = function () {
    //for (i = 0; i < property_log.length; i++) {
    //    if (activated_account == property_log[i].account) {
    //        user_property = property_log[i].property;
    //        account_index = i;
    //    }
    //}

    //for (i = 0; i < display_field.length; i++) {
    //    display_field.rating = 0;
    //    display_field.propertyCount =0;
    //    for (j = 0; j < user_property.length; j++){
    //        if (user_property[j].id == display_field[i].id) {
    //            display_field[i].rating = user_property[j].rating;
    //            display_field[i].propertyCount = user_property[j].propertyCount;
    //            display_field[i].tradeable = user_property[j].tradeable;
    //            break;
    //        }
    //    }
    //}
    user_property = [];
    var propertyLength = usingPropertyInstance.getPropertiesLength.call();
    for(i = 0; i < propertyLength;i++){
        var property_data = usingPropertyInstance.getProperty_Shop(i, {from:web3.eth.accounts[currentAccount]});
        if(web3.eth.accounts[currentAccount] == property_data[1]){
            var data = {"id":i,"propertyCount":property_data[0].c[0],"propertyType":property_data[2].c[0],"tradeable":property_data[3]};
            user_property.push(data);
        }
    }
}

get_propertyType_setting = function(){
    display_field = [];
    var propertyTypeLength = usingPropertyInstance.getPropertyTypeLength.call(0, {from:web3.eth.accounts[currentAccount]});

    for(i = 0; i < propertyTypeLength.c[0]; i++){
        var property_type = usingPropertyInstance.getPropertyType.call(i,currentAccount, {from:web3.eth.accounts[currentAccount]});
        var property_type_rating = usingPropertyInstance.getPropertyTypeRating.call(currentAccount,i,{from:web3.eth.accounts[currentAccount]});
        console.log(property_type_rating);

        var data = {"name":hex2a(property_type[0]),"id": property_type[1].c[0],"rating":property_type_rating.c[0],"averageRating":property_type[4].c[0]};
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
    tr.append($('<th></th>').text('Property'));
    tr.append($('<th></th>').text('Stock'));
    tr.append($('<th></th>').text('Favorite'));
    table.append(tr);
    //header
    //content
    for(i = 0; i < user_property.length; i++){
        tr = $('<tr></tr>');
        tr.append($('<td></td>').text(user_property[i].id));
        tr.append($('<td></td>').text(user_property[i].propertyCount));
        if(user_property[i].tradeable)
            heart_status = 1;
        else
            heart_status = 0;
        tr.append(
            $('<td></td>').append(
               $('<img></img>').attr('src', heart_path[heart_status])
                               .attr('heart_status',heart_status)
                               .attr('property_index',i)
                               .css('width', '30px')
                               .css('height', '30px')
                               .on('click', function(){
                                   property_index = $(this).attr('property_index');
                                   if( $(this).attr('heart_status') == 0)
                                   {
                                       $(this).attr('heart_status', 1);
                                   }
                                   else
                                   {
                                       $(this).attr('heart_status', 0);
                                       heart_status =0;
                                   }
                                   add_to_favorite(account_index, property_index,$(this).attr('heart_status'));
                                   $(this).attr('src', heart_path[$(this).attr('heart_status')]);
                               })));
        table.append(tr);
    }
    //content
    $('.shop_content').append(table);
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
            max: 5,
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

add_to_favorite = function(_account_index, _property_index,_heart_status){

}

save_rating_setting = function () {
    //for (i = 0; i < user_property.length; i++) {
    //    user_property[i].rating = $('#rating' + i).val();
    //}
    //property_log[account_index].property = user_property;
    //$('#json_temp').val(JSON.stringify(property_log));
    //averageRating_calculation();
    for(i = 0; i < display_field.length;i++){
        usingPropertyInstance.updatePropertyTypeRating(parseInt(display_field[i].id,10), parseInt($('#rating' + i).val(),10), "update", {from:web3.eth.accounts[currentAccount],gas:200000});
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

//calling ethereum
//MainActivityInstance.updatePropertiesRating(i, importance, "update", { from: web3.eth.accounts[currentAccount], gas: 200000 });

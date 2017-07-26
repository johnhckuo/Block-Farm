import { Meteor } from 'meteor/meteor';
import { Promise } from 'meteor/promise';
import { matchesCollection } from '../imports/collections.js';

var properties = [];
var propertyType = [];
var originDiffThreshold = 0;
var floatOffset = 1;
var searchThreshold = 10;
var timeout = 6000;
var matchmaking_start;
var nodeThreshold = 10;

wait = function(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

initData = function(){
    console.log("----------------------------Commence Data Fetching-----------------------------");
    properties = [];
    propertyType = [];

    //reset
    visitedProperty = [];
    visitedCount = 0;  //in order to ignore the rest of the array elem
    actualVisitIndex = [];
    origin = null;
    visitedOwner = [];
    visitedPriority = [];
    visitedTradeable = [];

    visitedCounts = [];
    totalGoThroughList = [];
    matchmaking_start = 0;
    /*--------------
       properties
    ---------------*/
    var rawProperties = [];
    var rawOwners = [];
    var raw = Meteor.users.find({}, {fields:{'profile.game.property':1, 'profile.game.stakeholder':1}}).fetch();
    
    for (var i = 0 ; i < raw.length ; i++){
        if (raw[i].profile.game == undefined){
          continue;
        }
        rawProperties.push(raw[i].profile.game.property);
        rawOwners.push(raw[i].profile.game.stakeholder.id);
    }

    for (var i = 0 ; i <rawProperties.length ; i++){
      for (var j = 0 ; j < cropTypeList.length ; j++){
          if (rawProperties[i].tradeable[j] != 0 && !rawProperties[i].isTrading[j]){
            properties.push({id:rawProperties[i].type[j], name:rawProperties[i].name[j], count:rawProperties[i].count[j], type:rawProperties[i].type[j], tradeable:parseInt(rawProperties[i].tradeable[j]), isTrading:rawProperties[i].isTrading[j], owner:rawOwners[i], threshold:rawProperties[i].threshold});
          }
      }
    }
    console.log("Property Data Loading Complete, Total Length = "+properties.length);
    /*--------------
      propertyType
    ---------------*/
    try{
      for (var i = 0 ; i < cropTypeList.length ; i++){
        wait(300);
        callContract_api_callback("getPropertyType", [i], function(res){
          console.log(i+"."+res.data.results);
            propertyType.push(res.data.results);
            if (propertyType.length == cropTypeList.length){
              var s_Length = propertyType[0][3].length;
              for (var j = 0 ; j < propertyType.length ;j++){
                  for (var w = 0 ; w < propertyType[j][3].length ; w++){
                    propertyType[j][3][w] /= floatOffset;
                  }
                  propertyType[j][2] /= floatOffset;
                  propertyType[j] = {id:propertyType[j][1], avg:parseInt(propertyType[j][2]/s_Length), ratings:propertyType[j][3]};
              }
              console.log(propertyType)
              console.log("Property Type Data Loading Complete");
              wait(5000);
              findOrigin();
            }
        });
      }
    }catch(e){
      console.log("[initData] "+e);
    }

    
}

// for matchmaking

var visitedProperty = [];
var visitedCount;  //in order to ignore the rest of the array elem
var actualVisitIndex = [];
var origin;
var visitedOwner = [];
var visitedPriority = [];
var visitedTradeable = [];


// for confirm

var matches = [];
var matchesConfirmThreshold = 0;

/* ----- Matchmaking Functions ----- */

var sort = function(list){
  //selection sort

    for (var i=0; i < list.length; i++)
    {

        var max_index = i;
        for (var j=i+1; j<list.length; j++){
            if (list[j].priority > list[max_index].priority){
                max_index = j;
            }
        }
        var temp = list[i];
        list[i] = list[max_index];
        list[max_index] = temp;

    }
    return list;
}

findOrigin = function(){
    console.log("----------------------------Matchmaking-----------------------------");

    //var length = Promise.await(callContract("usingProperty", "getPropertiesLength", []));
    var length = properties.length;

    var priorityList = [];

    for (var i = 0 ; i < length ; i++){
        var access = properties[i].tradeable;
        var isTrading = properties[i].isTrading;

        if (access == 0 || isTrading){
          continue;
        }

        var index;
        for (var j = 0 ; j < propertyType.length ; j++){
            if (propertyType[j].id == properties[i].type){
              index = j;
              break;
            }
        }

        var owner = properties[i].owner;
        var averageRating = propertyType[index].avg;
        var self_Importance = propertyType[index].ratings[owner];


        var maxTypeRating = 0;
        for (var j = 0 ; j < propertyType.length ; j++){
            if (maxTypeRating < propertyType[j].ratings[owner]){
              maxTypeRating = propertyType[j].ratings[owner];
            }
        }

        var diff = averageRating - self_Importance + maxTypeRating;
        console.log("["+i+"] "+averageRating+"|"+self_Importance);
        if (diff < originDiffThreshold){
            continue;
        }

        priorityList.push({
          id:i,
          priority:diff*properties[i].tradeable,
          tradeable:properties[i].tradeable,
          type: properties[i].type
        });
    }
    priorityList = sort(priorityList);
    if (priorityList.length == 0){
      matchFail(2);
      return "Fail";
    }

    origin = priorityList[0].id;

    visitedCount = 0;
    visitedProperty.push({id : origin, priority : priorityList[0].priority, tradeable:priorityList[0].tradeable, type: priorityList[0].type});

    console.log(priorityList);
    if (priorityList.length > nodeThreshold){
      priorityList = priorityList.slice(0, nodeThreshold);
    }

    //randomize to avoid infinite matchmaking
    // var sameCount = 0;
    // var tempVar = priorityList[0].priority;
    // for (var x = 0 ; x < priorityList.length; x++){
    //   if (priorityList[x].priority == tempVar){
    //     sameCount++;
    //   }
    // }


    // if (sameCount == priorityList.length){
    //   console.log("Found multiple same value !!! Starting randomize entry point!!")
    //   var randomIndex = Math.floor(Math.random()*3);
    //   var temp = priorityList[0];
    //   priorityList[0] = priorityList[randomIndex];
    //   priorityList[randomIndex] = temp;
    // }

    totalGoThroughList.push(priorityList);
    visitedCounts.push(0);

    console.log("Entry Point Found: #"+origin);

    matchmaking_start = new Date().getTime();

    console.log("------------------------ Start Counting Down: Starting Time => "+matchmaking_start+" ------------------------");
    
    success = findVisitNode();
    //return "success";
    return success;
}

var checkExist = function(elem, data){
    for (var i = 0 ; i < data.length; i++){
        if (elem == data[i].id && i != 0){
            return false;
        }
    }
    return true;
}

var globalRatingSort = function(list){
  var stakeholderLength = propertyType[0].ratings.length;

  var tempSortList = [];
  console.log("start init")
  for (var i = 0 ; i < list.length ; i++){
    var index;
    var tempList = [];

    for (var j = 0 ; j < propertyType.length; j++){
      if (list[i].type == propertyType[j].id){
        index = j;
        break;
      }
    }

    for (var w = 0 ; w < stakeholderLength ; w++){
      if (w == properties[list[i].id].owner){
        //console.log("owner "+properties[list[i].id].owner +" himself, skip");
        continue;
      }
      tempList.push(propertyType[index].ratings[w]);
    }
    var tempSort = [];
    //console.log("receive List"+tempList+"index"+index);
    for (var k = 0 ; k < tempList.length ; k++){
      tempSort.push(tempList[k] - propertyType[index].avg);
    }
    console.log("before sort"+tempSort)
    tempSort = tempSort.sort(function(a, b){
      return b-a;
    });
    console.log("after sort"+tempSort)
    tempSortList.push(tempSort[0]);

  }
  console.log("second stage")
  wait(1);
  var currentPriority = list[0].priority;
  var finalResult = [];
  var sortList = [];
  console.log("=========================");
  var currentCount = 0;
  for (var i = 0 ; i < list.length ; i++){

    // for efficiency, we only consider the highest priority owners
    if (currentCount == 3){
      break;
    }
    if (list[i].priority == currentPriority){
      sortList.push(list[i]);
    }

    if (list[i].priority != currentPriority || i == list.length-1){
        currentCount++;
        //sort
        for (var j = finalResult.length ; j < i; j++){

            var max_index = j;
            for (var w=j+1; w<sortList.length; w++){
                if (tempSortList[w] > tempSortList[max_index]){
                    max_index = w;
                }
            }
            var temp = sortList[j-finalResult.length];
            sortList[j-finalResult.length] = sortList[max_index-finalResult.length];
            sortList[max_index-finalResult.length] = temp;

            temp = tempSortList[j];
            tempSortList[j] = tempSortList[max_index];
            tempSortList[max_index] = temp;
        }

        //push 
        for (var k = 0 ; k < sortList.length; k++){
          finalResult.push(sortList[k]);
        }
        sortList = [];

        if (i == list.length-1 && list[i].priority != currentPriority){
          finalResult.push(list[i]);
        }
        currentPriority = list[i].priority;
        sortList.push(list[i]);
    }

  }
  console.log(tempSortList)
  console.log(finalResult);
  console.log("=========================");

  // if (finalResult.length != list.length){
  //   console.log("Something is Wrong !!!!!");
  // }else{
    return finalResult;

  // }
}

var searchNeighborNodes = function(visitNode){
    var length = properties.length;
    goThroughList = [];
    console.log("[System Log] Current Node :"+visitNode);

    var currentOwner = properties[visitNode].owner;
    var currentType = properties[visitNode].type;

    for (var i = 0 ; i < length ; i++){

      var newOwner = properties[i].owner;
      var newType = properties[i].type;
        if (i == visitNode || properties[i].tradeable == 0 || properties[i].isTrading || newOwner == currentOwner || currentType == newType){
            //console.log("[searchNeighborNodes] => Node #"+i+"Not Qualfied!! Skip!");
            continue;
        }


        var owner = properties[i].owner;
        var index;
        for (var j = 0 ; j < propertyType.length ; j++){
            if (propertyType[j].id == properties[visitNode].type){
              index = j;
              break;
            }
        }
        var diff = propertyType[index].ratings[owner];

        //console.log("[searchNeighborNodes] : properties "+visitNode+" to owner of properties"+ propertyType[index].id +" => diff:" +diff+" | threshold: "+properties[i].threshold)
        if (diff <= properties[i].threshold){
          //console.log("Does not meet the owners threshold, Skip!");
          continue;
        }


        var avgImportance = returnAverage(i);

        goThroughList.push({
          id:i,
          priority:diff,
          tradeable:properties[i].tradeable,
          type:properties[i].type
        });
    }

    if (goThroughList.length == 0){
        return matchFail(0);
    }
    goThroughList = sort(goThroughList);

    var flag = false;
    var visitIndex;

    for (var j = 0 ; j< goThroughList.length ; j++){
        flag = checkExist(goThroughList[j].id, visitedProperty);

        if (!flag){

            goThroughList.splice(j, 1);
            j--;
            if (goThroughList.length == 0){
                return matchFail(1);
            }
        }


    }
    // console.log(visitedProperty)
    // console.log("=====");
    // for (var j = 0 ; j< goThroughList.length ; j++){
    //   console.log(goThroughList[j].id);
    // }
    // console.log("=====");

    goThroughList = globalRatingSort(goThroughList);

    //accelerate origin discovery
    for (var i = 0 ; i < goThroughList.length ; i++){
      if (properties[goThroughList[i].id].owner == properties[origin].owner && i!=0){
        console.log("//////////////////////////// Found possible route ! Accelerate ////////////////////////////");
        var temp = goThroughList[i];
        goThroughList[i] = goThroughList[0];
        goThroughList[0] = temp;
      }
    }

    if (goThroughList.length > nodeThreshold){
      goThroughList = goThroughList.slice(0, nodeThreshold);
    }

    return goThroughList;
}


var findVisitNode = function(){

  visitingIndex =0;
  var found = false;
  var firstRound = true;

  while (!found){

    var found = verifyNode();
    if (found){
      break;
    }
    for (var j = 0 ; j < totalGoThroughList.length ; j++){
      for (var i = 0; i < totalGoThroughList[j].length; i++){
        console.log("[findVisitNode] => totalGoThroughList: " + totalGoThroughList[j][i].id + " visitedCount:" + visitedCounts[j]);
      }
      console.log("-------------------------------------------------")
    }
    goThroughList= searchNeighborNodes(totalGoThroughList[visitingIndex][visitedCounts[visitingIndex]].id);

    flag = false;
    // no neighbor nodes
    if (goThroughList == 0){

      // all choices have consumed
      if (totalGoThroughList[visitingIndex].length-1 <= visitedCounts[visitingIndex]){
        // fail if the beginning node also run out of choices
        if (visitingIndex == 0){
          return "Fail";
        // swtich to previous nodes & give up current node
        }else{
          flag = true;
        }
      // switch to secondary choice
      }else{
        visitedCounts[visitingIndex]++;
        visitedProperty[visitedProperty.length-1] = totalGoThroughList[visitingIndex][visitedCounts[visitingIndex]];
        console.log("[System Log] Now visiting index: " + visitingIndex +", and now switch to prioity #"+(visitedCounts[visitingIndex])+": "+totalGoThroughList[visitingIndex][visitedCounts[visitingIndex]].id);
        // switch to next alternative origin point
        if (visitingIndex == 0){
          console.log("[Change Origin] Origin switch from property"+origin+" to property"+ totalGoThroughList[visitingIndex][visitedCounts[visitingIndex]].id)
          origin = totalGoThroughList[visitingIndex][visitedCounts[visitingIndex]].id;
        }
        firstRound = false;
        continue;

      }
    }else{
        for (var j = 0 ; j < goThroughList.length ; j++){
          for (var i = 0 ; i < goThroughList[j].length ; i++){
            console.log("[findVisitNode] goThroughList => "+goThroughList[j][i].id);
          }
        }
    }

    firstRound = false;
    if (!flag){
      console.log("Node"+totalGoThroughList[visitingIndex][visitedCounts[visitingIndex]].id+" registered");
      registerNode();
    }

    while (flag){
      console.log("VisitingIndex:"+visitingIndex+" ,Node"+totalGoThroughList[visitingIndex][visitedCounts[visitingIndex]].id+" removed");
      visitedProperty.splice(visitedProperty.length-1, 1);
      totalGoThroughList.splice(totalGoThroughList.length-1, 1);
      visitedCounts.splice(visitedCounts.length-1, 1);
      visitingIndex--;

      if (totalGoThroughList[visitingIndex].length-1 >= (visitedCounts[visitingIndex]+1)){
        visitedCounts[visitingIndex]++;
        console.log("[System Log] Run out of alternative nodes! Switch to previous index #"+ visitingIndex +" node "+totalGoThroughList[visitingIndex][visitedCounts[visitingIndex]].id);
        visitedProperty[visitedProperty.length-1] = totalGoThroughList[visitingIndex][visitedCounts[visitingIndex]];
        if (visitingIndex == 0){
            console.log("[Change Origin] Origin switch from property"+origin+" to property"+ totalGoThroughList[visitingIndex][visitedCounts[visitingIndex]].id)
            origin = totalGoThroughList[visitingIndex][visitedCounts[visitingIndex]].id;
        }
        flag = false;
      }else{
        if (visitingIndex == 0){
          return "Fail";
        }
      }
    }
    // register the accessible neighbor node
  }

  return "Success!";
}


var registerNode = function(){
  totalGoThroughList.push(goThroughList);
  visitedCounts.push(0);
  visitingIndex++;
  visitedProperty.push(totalGoThroughList[visitingIndex][visitedCounts[visitingIndex]]);

}

var verifyNode =  function(){
  console.log("[verifyNode] "+totalGoThroughList[visitingIndex][visitedCounts[visitingIndex]].id)
  if (visitingIndex == 0){
    console.log("-------------Commence Node Searching Process---------------");
    return false;
  }

  var matchmaking_end = new Date().getTime();
  var timeDiff = matchmaking_end - matchmaking_start;
  console.log("------------------------ Time Elapsed => "+((timeDiff/1000)*5)+" seconds ------------------------");
  
  if (timeDiff > timeout){
    console.log("[Error Log] Timeout! Execute time exceed "+((timeout/1000)*5)+" seconds... Abort!");
    matchmaking_start = 0;
    return true;
  }

  // if (totalGoThroughList.length >= searchThreshold){
  //   var originOwner = properties[origin].owner;
  //   var originWishList = 0, maxRating = 0;
  //   for (var i = 0 ; i < propertyType.length; i++){
  //     if (maxRating < propertyType[i].ratings[originOwner]){
  //       maxRating = propertyType[i].ratings[originOwner];
  //       originWishList = i;
  //     }
  //   }

  //   //push account
  //   totalGoThroughList.push({
  //         id:i,
  //         priority:100,
  //         tradeable:properties[i].tradeable,
  //         type: properties[i].type
  //   });
  //   visitedCounts.push(0);
  //   visitingIndex++;
  //   visitedProperty.push(totalGoThroughList[visitingIndex][visitedCounts[visitingIndex]]);

  //   //now push origin account


  //   totalGoThroughList.push({
  //         id:i,
  //         priority:diff,
  //         tradeable:properties[i].tradeable,
  //         type: properties[i].type
  //   });
  //   visitedCounts.push(0);
  //   visitingIndex++;
  //   visitedProperty.push(totalGoThroughList[visitingIndex][visitedCounts[visitingIndex]]);
  // }

  if (totalGoThroughList[visitingIndex][visitedCounts[visitingIndex]] != undefined && properties[totalGoThroughList[visitingIndex][visitedCounts[visitingIndex]].id].owner == properties[origin].owner && visitingIndex != 0){
      console.log("---------------------------- Success -----------------------------");
      
      matchmaking_start = 0;

      var visitedProperty_temp = [];
      for (var h = 0 ; h < visitedProperty.length ; h++){
          visitedProperty_temp.push(visitedProperty[h].id);
          visitedOwner.push(properties[visitedProperty[h].id].owner);
          visitedPriority.push(visitedProperty[h].priority);
          visitedTradeable.push(visitedProperty[h].tradeable);
      }

      var matchId = matches.length;

      var tempJson = {};
      tempJson.id = matchId;
      tempJson.visitedCount = visitedCounts;
      tempJson.result = "null";

      tempJson.visitedOwners = [];
      tempJson.visitedProperties = [];
      tempJson.visitedPriorities = [];
      tempJson.visitedTradeable = [];

      if (visitedOwner.length == 1){
          console.log("----------------------------Abnormal result, again-----------------------------");
          //initData();
          return "Fail";
      }

      for (var i = 0 ; i < visitedProperty.length; i++){
        tempJson.visitedProperties.push(visitedProperty[i].type);
        tempJson.visitedOwners.push(visitedOwner[i]);
        tempJson.visitedPriorities.push(visitedPriority[i]);
        console.log(visitedTradeable[i])
        tempJson.visitedTradeable.push(visitedTradeable[i]);
      }
      matches.push(tempJson);

      //pop the last element since it may not be the origin property
      tempJson.visitedProperties[tempJson.visitedProperties.length-1] = tempJson.visitedProperties[0];
      tempJson.visitedPriorities[tempJson.visitedPriorities.length-1] = tempJson.visitedPriorities[0];
      tempJson.visitedTradeable[tempJson.visitedTradeable.length-1] = tempJson.visitedTradeable[0];
      console.log("------------------------ Now Insert Data into Mongodb ------------------------");

      console.log("[Properties] "+tempJson.visitedProperties);
      console.log("[Priorities] "+tempJson.visitedPriorities);
      console.log("[Owners] "+tempJson.visitedOwners);
      console.log("[Tradeables] "+tempJson.visitedTradeable);
      try{
        var res = Meteor.call("insertMatch", {priorities:tempJson.visitedPriorities, owners:tempJson.visitedOwners, properties:tempJson.visitedProperties, tradeable:tempJson.visitedTradeable, result:tempJson.result});
      }catch(e){
        console.log("[verifyNode] => Something is wrong while inserting into mongo, log:"+e);
      }

      try{
        for (var i = 0 ; i < tempJson.visitedOwners.length ; i++){
            Meteor.call("updateTradingStatus", tempJson.visitedOwners[i], tempJson.visitedProperties[i],  true);
        }
      }catch(e){
        console.log("[verifyNode] => Something is wrong while updating trading status, log:"+e);
      }
      console.log("------------------------ Mongodb Insert Complete ------------------------ ")
      console.log("------------------------ Now Update Smart Contract ------------------------");

      // var m_Id = callContract_api("Matchmaking", "getMatchMakingLength", []).data.results[0];
      // var res = callContract_api("Matchmaking", "gameCoreMatchingInit", [m_Id, visitedOwner.length, "null", tempJson.visitedOwners.length]);
      
      // for (var i = 0 ; i < tempJson.visitedOwners.length ; i++){
      //     Meteor.call("updateTradingStatus", tempJson.visitedOwners[i], tempJson.visitedProperties[i],  true);
      // }
      // for (var i = 0 ; i < visitedOwner.length ; i++){
      //   var res = callContract_api("Matchmaking", "gameCoreMatchingDetail", [m_Id, tempJson.visitedPriorities[i], tempJson.visitedOwners[i], tempJson.visitedProperties[i], tempJson.visitedTradeable[i]]);
      // }

      var res;
      try{
        res = Promise.await(Meteor.call("callContract", "Matchmaking", "getMatchMakingLength", []));
      }catch(e){
        console.log("[updating matchmaking error] "+e);
        res = Promise.await(Meteor.call("callContract", "Matchmaking", "getMatchMakingLength", []));

      }
      var m_Id = res.result.results[0];
      try{
        var res2 = Promise.await(Meteor.call("callContract", "Matchmaking", "gameCoreMatchingInit", [m_Id, tempJson.visitedOwners.length, "null"]));
      }catch(e){
        console.log("[updating matchmaking error] "+e);
        var res2 = Promise.await(Meteor.call("callContract", "Matchmaking", "gameCoreMatchingInit", [m_Id, tempJson.visitedOwners.length, "null"]));
      }
      wait(3000);

      for (var j = 0 ; j < tempJson.visitedOwners.length ; j++){
        try{
          var res3 = Promise.await(Meteor.call("callContract", "Matchmaking", "gameCoreMatchingDetail", [m_Id, parseInt(tempJson.visitedPriorities[j]), tempJson.visitedOwners[j], tempJson.visitedProperties[j], tempJson.visitedTradeable[j]]));
        }catch(e){
          console.log("[updating matchmaking error] "+e);
          var res3 = Promise.await(Meteor.call("callContract", "Matchmaking", "gameCoreMatchingDetail", [m_Id, parseInt(tempJson.visitedPriorities[j]), tempJson.visitedOwners[j], tempJson.visitedProperties[j], tempJson.visitedTradeable[j]]));
        }
      }
      
      try{
        var res4 = Promise.await(Meteor.call("callContract", "Matchmaking", "gameCoreMatchingConfirmed", [m_Id, tempJson.visitedOwners.length]));
      }catch(e){
        console.log("[updating matchmaking error] "+e);
        var res4 = Promise.await(Meteor.call("callContract", "Matchmaking", "gameCoreMatchingConfirmed", [m_Id, tempJson.visitedOwners.length]));
      }

      console.log("------------------------ Contract Update Complete ------------------------ ")   
      console.log("------------------------ Now Check Confirmation ------------------------ ")

      checkConfirmation_backend();

      console.log("------------------------ Confirmation checking complete ------------------------ ")

      return true;

  }else{

      return false;

  }
}


var returnPriority = function(visitNode, i){
    var owner = properties[i].owner;
    var index;
    for (var j = 0 ; j < propertyType.length ; j++){
        if (propertyType[j].id == properties[visitNode].type){
          index = j;
          break;
        }
    }
    return propertyType[index].ratings[owner];
}

var returnAverage = function(i){
    var index;
    for (var j = 0 ; j < propertyType.length ; j++){
        if (propertyType[j].id == properties[i].type){
          index = j;
          break;
        }
    }
    return propertyType[index].avg;
}


var matchFail = function(errCode){
  switch (errCode){
    case 0:
      console.log("[Error Log] No available neighbor nodes");
      break;
    case 1:
      console.log("[Error Log] No unvisited neighbor nodes left");
      break;
    case 2:
      console.log("[Error Log] No origin entry points found, Abort!");
      break;
  }
  return 0;
}

var matchSuccess = function(){
  return 1;
}

/* ----- check Transaction ----- */

var matches = [];

checkConfirmation_backend = async function(){
    var length = await Meteor.call("getMatchmakingLength");
    if (length < 3){
      return;
    }
    var i = length -3;
    try{
        var res = await callContract_api("Matchmaking", "getMatchMaking", [i]);
        var match = { visitedPriorities: res.data.results[0], visitedOwners: res.data.results[1], visitedProperties: res.data.results[2], visitedTradeable: res.data.results[3], confirmation: res.data.results[4], visitedCount:res.data.results[5], result:res.data.results[6] };

        var confirm = 0;
        for (var j = 0 ; j < match.confirmation.length-1; j++){
            if (match.confirmation[j] == 1){
                confirm++;
            }
            //var result = await Meteor.call("deleteMatchesId", match.visitedOwners[j], i);
        }

        var totalCount = match.visitedOwners.length-1;
        if (confirm/totalCount < 0.5){
          console.log("fail");
            match.result = "false";
        }else{
            console.log("pass")
            match.result = "true";
            transferOwnership(i,match);
        }
        console.log("[checkConfirmation] the result of match#"+i+" is "+match.result);

        var result = await Meteor.call("updateMatchResult", match.result, i);
    }catch(e){
      console.log("[checkConfirmation_backend] "+e);
    }

}

transferOwnership = async function(m_Id, match){
    var length = cropTypeList.length;

    var owners = match.visitedOwners;
    var properties = match.visitedProperties;
    var tradeables = match.visitedTradeable;

    console.log("[transferOwnership] Now start transfering property ownership!!!")

    var visitedLength = owners.length;
    try{
      for (var i = 0 ; i < visitedLength; i++){
          var current_s_Id = owners[i]; 
          var receive_s_Id = owners[i+1];
          var p_Id = properties[i];
          var tradeCount = tradeables[i];
          var res = await Meteor.call("updateOwnershipStatus", current_s_Id, receive_s_Id, p_Id, tradeCount, m_Id);
          console.log("[transferOwnership] owner#"+current_s_Id+" transfer property#"+p_Id+" x"+tradeCount+" to owner#"+receive_s_Id);
          var res2 = await Meteor.call("updateTradingStatus", current_s_Id, p_Id, false);
          console.log("[transferOwnership] lock property#"+ p_Id +" from owner#"+current_s_Id);

      }
    }catch(e){
      console.log("[transferOwnership] "+e);
    }

}
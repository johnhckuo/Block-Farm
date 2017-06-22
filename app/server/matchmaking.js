import { Meteor } from 'meteor/meteor';
import { Promise } from 'meteor/promise';
import { matchesCollection } from '../imports/collections.js';

var properties = [];
var propertyType = [];
var diffThreshold = -100;


wait = function(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

initData = function(){
    
    properties = [];
    propertyType = [];
    /*--------------
       properties
    ---------------*/
    var rawProperties = [];

    var raw = Meteor.users.find({}, {fields:{'profile.game.property':1}}).fetch();
    
    for (var i = 0 ; i < raw.length ; i++){
        if (raw[i].profile.game == undefined){
          console.log(raw[i].profile.game)
          continue;
        }
        rawProperties.push(raw[i].profile.game.property);
    }

    for (var i = 0 ; i <rawProperties.length ; i++){
      for (var j = 0 ; j < cropTypeList.length ; j++){
          if (rawProperties[i].tradeable[j] != 0 || rawProperties[i].count[j] != 0){
            properties.push({id:rawProperties[i].type[j], name:rawProperties[i].name[j], count:rawProperties[i].count[j], type:rawProperties[i].type[j], tradeable:parseInt(rawProperties[i].tradeable[j]), isTrading:rawProperties[i].isTrading[j], owner:i});
          }
      }
    }
    console.log("Property Data Loading Complete");
    /*--------------
      propertyType
    ---------------*/
    try{
      for (var i = 0 ; i < cropTypeList.length ; i++){
        wait(10);
        callContract_api_callback("getPropertyType", [i], function(res){
          console.log(i+"."+res.data.results);
            propertyType.push(res.data.results);
            if (propertyType.length == cropTypeList.length){
              console.log(propertyType)

              for (var j = 0 ; j < propertyType.length ;j++){
                  propertyType[j] = {avg:propertyType[j][2], ratings:propertyType[j][3]};
              }
              console.log("Property Type Data Loading Complete");
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

findOrigin = async function(){
    console.log("----------------------------Matchmaking-----------------------------");
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


    //var length = Promise.await(callContract("usingProperty", "getPropertiesLength", []));
    var length = properties.length;

    var priorityList = [];

    for (var i = 0 ; i < length ; i++){
        var access = properties[i].tradeable;
        var isTrading = properties[i].isTrading;

        if (access == 0 || isTrading){
          continue;
        }

        var owner = properties[i].owner;
        var averageRating = propertyType[properties[i].type].avg;
        var self_Importance = propertyType[properties[i].type].ratings[owner];

        var diff = averageRating - self_Importance;
        console.log("["+i+"] "+averageRating+"|"+self_Importance);
        if (diff < diffThreshold){
            continue;
        }

        priorityList.push({
          id:i,
          priority:diff,
          tradeable:properties[i].tradeable
        });
    }
    priorityList = sort(priorityList);
    if (priorityList.length == 0){
      matchFail(2);
      return "Fail";
    }

    origin = priorityList[0].id;

    visitedCount = 0;
    visitedProperty.push({id : origin, priority : priorityList[0].priority, tradeable:priorityList[0].tradeable})

    console.log(priorityList)
    totalGoThroughList.push(priorityList);
    visitedCounts.push(0);


    console.log("Entry Point Found: #"+origin);
    success = await findVisitNode();
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


var searchNeighborNodes = function(visitNode){
    var length = properties.length;
    //var length = Promise.await(callContract("usingProperty", "getPropertiesLength", []));
    goThroughList = [];
    console.log("start searching");
    console.log("[System Log] Current Node :"+visitNode);
    /*
            var newOwner = Promise.await(callContract("usingProperty", "getPartialProperty", [i]));
            var currentOwner = Promise.await(callContract("usingProperty", "getPartialProperty", [visitNode]));
            var currentType = Promise.await(callContract("usingProperty", "getPropertyType_Matchmaking", [i]));
            var newType = Promise.await(callContract("usingProperty", "getPropertyType_Matchmaking", [visitNode]));
    */

    var k = 0;
    var currentOwner = properties[visitNode].owner;
    var newType = properties[visitNode].type;

    for (var i = 0 ; i < length ; i++){

      var newOwner = properties[i].owner;
      var currentType = properties[i].type;
        //if (i == visitNode || Promise.await(callContract("usingProperty", "checkTradeable", [i])) == 0 || Promise.await(callContract("usingProperty", "checkTradingStatus", [i]))){
        if (i == visitNode || properties[i].tradeable == 0 || properties[i].isTrading || newOwner == currentOwner || currentType == newType){
            console.log("check"+i)
            continue;
        }


        var diff = returnPriority(visitNode, i);
        console.log("[diff]"+diff)
        if (diff < diffThreshold){
          //this need to be modified to user config
          continue;
        }
        console.log("[visitnode"+visitNode+"] "+diff);

        goThroughList.push({
          id:i,
          priority:diff,
          tradeable:properties[i].tradeable
        });
    }
    console.log(goThroughList)

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


    return goThroughList;
}


var findVisitNode = function(){

  visitingIndex =0;
  var found = false;


  while (!found){

    var found = verifyNode();
    if (found){
      console.log("All done!");
      break;
    }
    console.log(totalGoThroughList)
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
        console.log("%c[System Log] Now visiting index: " + visitingIndex +", and now switch to prioity #"+(visitedCounts[visitingIndex]+1)+": "+totalGoThroughList[visitingIndex][visitedCounts[visitingIndex]].id, "color:#00ff00");
        continue;

      }
    }
    if (!flag)
      registerNode();

    console.log(visitedCounts[visitingIndex]);
    while (flag){
      visitedProperty.splice(visitedProperty.length-1, 1);
      totalGoThroughList.splice(totalGoThroughList.length-1, 1);
      visitedCounts.splice(visitedCounts.length-1, 1);
      visitingIndex--;
      console.log(totalGoThroughList[visitingIndex][0])
      if (totalGoThroughList[visitingIndex].length-1 >= (visitedCounts[visitingIndex]+1)){
        visitedCounts[visitingIndex]++;
        console.log("%c[System Log] Run out of alternative nodes! Switch to previous index #"+ visitingIndex +" node "+totalGoThroughList[visitingIndex][visitedCounts[visitingIndex]].id, "color:#00ff00");
        visitedProperty[visitedProperty.length-1] = totalGoThroughList[visitingIndex][visitedCounts[visitingIndex]];

        flag = false;
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
  console.log("start searching");
  console.log(visitingIndex)
  if (totalGoThroughList[visitingIndex][visitedCounts[visitingIndex]] != undefined && totalGoThroughList[visitingIndex][visitedCounts[visitingIndex]].id == origin && visitingIndex != 0){
      console.log("----------------------------Success-----------------------------");
      var visitedProperty_temp = [];
      for (var h = 0 ; h < visitedProperty.length ; h++){
          visitedProperty_temp.push(visitedProperty[h].id);
          visitedOwner.push(properties[visitedProperty[h].id].owner);
          visitedPriority.push(visitedProperty[h].priority);
          visitedTradeable.push(visitedProperty[h].tradeable);
      }

      console.log("Visited Owner "+visitedOwner);
      console.log("Visited priority "+visitedPriority);

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
          initData();
          return;
      }

      for (var i = 0 ; i < visitedProperty.length; i++){
        tempJson.visitedProperties.push(visitedProperty[i].id);
        tempJson.visitedOwners.push(visitedOwner[i]);
        tempJson.visitedPriorities.push(visitedPriority[i]);
        console.log(visitedTradeable[i])
        tempJson.visitedTradeable.push(visitedTradeable[i]);
      }
      console.log("Now Update Contract Content");
      matches.push(tempJson);

      console.log(tempJson.visitedProperties);
      console.log(tempJson.visitedPriorities);

      console.log(tempJson.visitedOwners);
      console.log(tempJson.visitedTradeable);

      //var length = MatchmakingInstance.getMatchMakingLength.call({from:web3.eth.accounts[currentAccount]}).c[0];

      var res = Meteor.call("insertMatch", {priorities:tempJson.visitedPriorities, owners:tempJson.visitedOwners, properties:tempJson.visitedProperties, tradeable:tempJson.visitedTradeable});


      console.log("Insert Complete")

      //gameCoreMatchingDetail(length-1, tempJson.visitedPriorities, tempJson.visitedOwners, tempJson.visitedProperties);
      var m_Id = callContract_api("Matchmaking", "getMatchMakingLength", []).data.results[0];
      console.log(m_Id);
      var res = callContract_api("Matchmaking", "gameCoreMatchingInit", [m_Id, visitedOwner.length, "null", tempJson.visitedOwners.length]);
      
      for (var i = 0 ; i < tempJson.visitedOwners.length ; i++){
          Meteor.call("updateTradingStatus", tempJson.visitedOwners[i], tempJson.visitedProperties[i],  true);
      }
      for (var i = 0 ; i < visitedOwner.length ; i++){
        var res = callContract_api("Matchmaking", "gameCoreMatchingDetail", [m_Id, tempJson.visitedPriorities[i], tempJson.visitedOwners[i], tempJson.visitedProperties[i], tempJson.visitedTradeable[i]]);
      }

      console.log(res);
      //var res = MatchmakingInstance.gameCoreMatchingInit(visitedOwner.length, "null", {from:web3.eth.accounts[currentAccount], gas:100000});
      //var res2 = MatchmakingInstance.gameCoreMatchingDetail(tempJson.visitedPriorities, tempJson.visitedOwners, tempJson.visitedProperties, tempJson.visitedTradeable,  {from:web3.eth.accounts[currentAccount], gas:2000000});
      console.log(length);
      return true;

  }else{
      if (visitingIndex == 0){
        console.log("-------------Commence Node Searching Process---------------");
      }
      return false;

  }
}


var returnPriority = function(visitNode, i){
    var owner = properties[i].owner;
    return propertyType[properties[visitNode].type].ratings[owner];
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
    console.log(length)
    var checkCount = 0;
    if (length >= 2){
      checkCount = 2;
    }else{
      checkCount = length;
    }
    try{
      for (var i = length-checkCount ; i < length ; i++){
        var res = await callContract_api("Matchmaking", "getMatchMaking", [i]);
        var match = { visitedPriorities: res.data.results[0], visitedOwners: res.data.results[1], visitedProperties: res.data.results[2], visitedTradeable: res.data.results[3], confirmation: res.data.results[4], visitedCount:res.data.results[5], result:res.data.results[6] };
        console.log(match);
        console.log(match.visitedOwners)
        var confirm = 0;
        for (var j = 0 ; j < match.confirmation.length-1; j++){
            if (match.confirmation[j] == 1){
                confirm++;
            }
            //var result = await Meteor.call("deleteMatchesId", match.visitedOwners[j], i);
        }

        var totalCount = match.visitedOwners.length;
        console.log(confirm);
        if (confirm/totalCount <= 0.5){
          console.log("fail");
            match.result = "false";
        }else{
            console.log("pass")
            match.result = "true";
            transferOwnership(i,match);
        }
        var result = await Meteor.call("updateMatchResult", match.result, i);
      }
    }catch(e){
      console.log("[checkConfirmation_backend] "+e);
    }

}

transferOwnership = async function(m_Id, match){
    var length = cropTypeList.length;

    var owners = match.visitedOwners;
    var properties = match.visitedProperties;
    var tradeables = match.visitedTradeable;

    console.log(owners);
    console.log(properties)
    var visitedLength = owners.length-1;
    try{
      for (var i = 0 ; i < visitedLength; i++){
          var current_s_Id = owners[i]; 
          var receive_s_Id = owners[i+1];
          var p_Id = properties[i];
          var tradeCount = tradeables[i];
          var res = await Meteor.call("updateOwnershipStatus", current_s_Id, receive_s_Id, p_Id, tradeCount);
          var res2 = await Meteor.call("updateTradingStatus", current_s_Id, p_Id, false);
      }
    }catch(e){
      console.log(e);
    }

    /*

        var propertyType = currentPID % length;
        var receivedPID = s_Id*length + propertyType;

        var res1 = await usingPropertyInstance.updateOwnershipStatus(receivedPID, currentPID, {from:web3.eth.accounts[currentAccount], gas:2000000}, function(err, res){
          if (err){
            console.log(err);
          }
        })

        //cancel isTrading status
        var res2 = await usingPropertyInstance.updateTradingStatus(currentPID, false, {from:web3.eth.accounts[currentAccount], gas:2000000}, function(err, res){
          if (err){
            console.log(err);
          }

        })
    //     var res = await usingPropertyInstance.updateOwnershipStatus(receivedPID, currentPID, {from:web3.eth.accounts[currentAccount], gas:2000000});
    //
    //     var res2 = await usingPropertyInstance.updateTradingStatus(currentPID, false, {from:web3.eth.accounts[currentAccount], gas:2000000});
    // }
  }
  */

}

function gameCoreMatchingDetail(_matchId, _priority, _owner, _property){

    for (var i = 0 ; i < matches[_matchId].visitedOwners.length ; i++){
       //Promise.await(callContract("usingProperty", "updateTradingStatus", [matches[_matchId].visitedProperties[i], true]));
       usingPropertyInstance.updateTradingStatus(matches[_matchId].visitedProperties[i], true, {from:web3.eth.accounts[currentAccount], gas:1000000}, function(err,res){
         if (err){
           console.log(err);
         }
       })
    }

    for (var k = 0 ; k < matches[_matchId].visitedOwners.length-1 ; k++){
        //Promise.await(callContract("Congress", "insertMatchesId", [matches[_matchId].visitedOwners[k], _matchId]));
        CongressInstance.insertMatchesId(matches[_matchId].visitedOwners[k], _matchId, {from: web3.eth.accounts[currentAccount], gas:100000}, function(err, res){
          if (err){
            console.log(err);
          }
        });
    }

}

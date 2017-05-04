import { Session } from 'meteor/session';


var currentAccount = 2;
var cropsPerLvl =3;

var cropTypeList = [
  {
      id:0,
      name: "Carrot",
      img: ["carrot_seed", "carrot_grow", "carrot_harvest", "carrot"],
      count:4,
      time:"0.0.0.3"

  },
  {
      id:1,
      name: "Radish",
      img: ["radish_seed", "radish_grow", "radish_harvest", "radish"],
      count:4,
      time:"0.0.0.5"

  },
  {
      id:2,
      name: "Lettuce",
      img: ["lettuce_seed", "lettuce_grow", "lettuce_harvest", "lettuce"],
      count:4,
      time:"0.0.0.3"

  },
  {
      id:3,
      name: "Cauliflower",
      img: ["cauliflower_seed", "cauliflower_grow", "cauliflower_harvest", "cauliflower"],
      count:4,
      time:"0.0.0.10"

  },
  {
      id:4,
      name: "Eggplant",
      img: ["eggplant_seed", "eggplant_grow", "eggplant_harvest", "eggplant"],
      count:4,
      time:"0.0.0.10"

  },
  {
      id:5,
      name: "Blueberry",
      img: ["blueberry_seed", "blueberry_grow", "blueberry_harvest", "blueberry"],
      count:4,
      time:"0.0.0.10"

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

var MissionList = [
    {
        name: "Mission1",
        exp: 100,
        lvl_limitation:0,
        status:true
    },
    {
        name: "Mission2",
        exp: 100,
        lvl_limitation:0,
        status:true
    },
    {
        name: "Mission3",
        exp: 100,
        lvl_limitation:0,
        status:true
    },
    {
        name: "Mission4",
        exp: 200,
        lvl_limitation:1,
        status:true
    },
    {
        name: "Mission5",
        exp: 200,
        lvl_limitation:1,
        status:true
    },
    {
        name: "Mission6",
        exp: 200,
        lvl_limitation:1,
        status:true
    },
];

var missionItem = [
    {
        missionId: 1,
        propertyId :0,
        quantity: 4
    },
    {
        missionId: 2,
        propertyId :1,
        quantity: 4
    },
    {
        missionId: 3,
        propertyId :2,
        quantity: 4
    },
    {
        missionId: 4,
        propertyId :0,
        quantity: 8
    },
    {
        missionId: 5,
        propertyId :1,
        quantity: 8
    },
    {
        missionId: 6,
        propertyId :2,
        quantity: 8
    },
    {
        missionId: 6,
        propertyId :1,
        quantity: 8
    },
    {
        missionId: 6,
        propertyId :0,
        quantity: 8
    },
];




function init(event){
  web3.eth.getAccounts(function(err, accs) {
    if (err != null) {
      alert("There was an error fetching your accounts.");
      return;
    }

    if (accs.length == 0) {
      alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
      return;
    }

    accounts = accs;
    account = accounts[0];
    //alert(account)
  });
}


function initGameConfig(){

    for(var i = 0 ; i < MissionList.length; i++){
        GameCoreInstance.addMission(MissionList[i].name, MissionList[i].exp, MissionList[i].lvl_limitation, MissionList[i].status,  { from: web3.eth.accounts[currentAccount], gas: 2000000 });
    }
    for(var i = 0; i < missionItem.length; i++){
        GameCoreInstance.addMissionItem(missionItem[i].missionId, missionItem[i].propertyId, missionItem[i].quantity, { from: web3.eth.accounts[currentAccount], gas: 2000000 });
    }
    console.log("Mission added");

    for (var i = 0 ; i < cropTypeList.length ; i++){
       usingPropertyInstance.addPropertyType(cropTypeList[i].name, cropTypeList[i].img, cropTypeList[i].time, cropTypeList[i].count, { from:web3.eth.accounts[currentAccount], gas:2500000});
    }

    for (var i = 0 ; i < landTypeList.length ; i++){
        usingPropertyInstance.addLandType(landTypeList[i].name, landTypeList[i].img, landTypeList[i].count, { from:web3.eth.accounts[currentAccount], gas:2000000});

    }


    var length = usingPropertyInstance.getPropertyTypeLength({ from:web3.eth.accounts[currentAccount]});
    usingPropertyInstance.updatePropertyTypeRating(length, 0, "new", { from:web3.eth.accounts[currentAccount], gas:2000000});

    for(var i = 0; i < length; i++){
        usingPropertyInstance.initUserProperty(i, { from:web3.eth.accounts[currentAccount], gas:2000000});
    }
    console.log("Init Complete");


}

Template.index.created = function() {
    init();
    Session.set('currentAccount', currentAccount);
    Session.set('cropsPerLvl', cropsPerLvl);

    try{
      var val = usingPropertyInstance.propertyTypeList(0);
      console.log("=========== Data Inited ===========");

    }
    catch(err){
      initGameConfig();
      console.log(err);
    }

    // try{
    //   console.log("data inited");
    //   var val = usingPropertyInstance.propertyTypeList(0);
    // }
    // catch(err) {
    //   initGameConfig();
    // }




}

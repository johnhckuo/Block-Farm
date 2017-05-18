import { Session } from 'meteor/session';

currentAccount = 5;
cropsPerLvl =3;

cropTypeList = [
  {
        id:0,
        name: "Carrot",
        img: ["carrot_seed", "carrot_grow", "carrot_harvest", "carrot", "carrot_warn"],
        count:4,
        time:"0.0.0.3"

    },
    {
        id:1,
        name: "Radish",
        img: ["radish_seed", "radish_grow", "radish_harvest", "radish", "radish_warn"],
        count:4,
        time:"0.0.0.5"

    },
    {
        id:2,
        name: "Lettuce",
        img: ["lettuce_seed", "lettuce_grow", "lettuce_harvest", "lettuce", "lettuce_warn"],
        count:4,
        time:"0.0.0.3"

    },
    {
        id:3,
        name: "Cauliflower",
        img: ["cauliflower_seed", "cauliflower_grow", "cauliflower_harvest", "cauliflower", "cauliflower_warn"],
        count:4,
        time:"0.0.0.10"

    },
    {
        id:4,
        name: "Eggplant",
        img: ["eggplant_seed", "eggplant_grow", "eggplant_harvest", "eggplant", "eggplant_warn"],
        count:4,
        time:"0.0.0.10"

    },
    {
        id:5,
        name: "Blueberry",
        img: ["blueberry_seed", "blueberry_grow", "blueberry_harvest", "blueberry", "blueberry_warn"],
        count:4,
        time:"0.0.0.10"

    },
    {
        id:6,
        name: "Chili",
        img: ["chili_seed", "chili_grow", "chili_harvest", "chili", "chili_warn"],
        count:4,
        time:"0.0.2.0"

    },
    {
        id:7,
        name: "Watermelon",
        img: ["watermelon_seed", "watermelon_grow", "watermelon_harvest", "watermelon", "watermelon_warn"],
        count:4,
        time:"0.0.2.0"

    },
    {
        id:8,
        name: "Strawberry",
        img: ["strawberry_seed", "strawberry_grow", "strawberry_harvest", "strawberry", "strawberry_warn"],
        count:4,
        time:"0.0.2.0"

    },
    {
        id:9,
        name: "Loofa",
        img: ["loofa_seed", "loofa_grow", "loofa_harvest", "loofa", "loofa_warn"],
        count:4,
        time:"0.0.5.0"

    },
    {
        id:10,
        name: "Honeydew melon",
        img: ["hamimelon_seed", "hamimelon_grow", "hamimelon_harvest", "hamimelon", "hamimelon_warn"],
        count:4,
        time:"0.0.5.0"

    },
    {
        id:11,
        name: "Green pepper",
        img: ["greenPepper_seed", "greenPepper_grow", "greenPepper_harvest", "greenPepper", "greenPepper_warn"],
        count:4,
        time:"0.0.5.0"

    },
    {
        id:12,
        name: "Onion",
        img: ["onion_seed", "onion_grow", "onion_harvest", "onion", "onion_warn"],
        count:4,
        time:"0.0.10.0"

    },
    {
        id:13,
        name: "Scallion",
        img: ["sansingOnion_seed", "sansingOnion_grow", "sansingOnion_harvest", "sansingOnion", "sansingOnion_warn"],
        count:4,
        time:"0.0.10.0"

    },
    {
        id:14,
        name: "Grape",
        img: ["grape_seed", "grape_grow", "grape_harvest", "grape", "grape_warn"],
        count:4,
        time:"0.0.10.0"

    },
    {
        id:15,
        name: "Bamboo",
        img: ["bamboo_seed", "bamboo_grow", "bamboo_harvest", "bamboo", "bamboo_warn"],
        count:4,
        time:"0.0.15.0"

    },
    {
        id:16,
        name: "Apple",
        img: ["apple_seed", "apple_grow", "apple_harvest", "apple", "apple_warn"],
        count:4,
        time:"0.0.15.0"

    },
    {
        id:17,
        name: "Wheat",
        img: ["wheat_seed", "wheat_grow", "wheat_harvest", "wheat", "wheat_warn"],
        count:4,
        time:"0.0.15.0"

    },
    {
        id:18,
        name: "Corn",
        img: ["corn_seed", "corn_grow", "corn_harvest", "corn", "corn_warn"],
        count:4,
        time:"0.0.30.0"

    },
    {
        id:19,
        name: "Pear",
        img: ["pear_seed", "pear_grow", "pear_harvest", "pear", "pear_warn"],
        count:4,
        time:"0.0.30.0"

    },
    {
        id:20,
        name: "Lemon",
        img: ["lemon_seed", "lemon_grow", "lemon_harvest", "lemon", "lemon_warn"],
        count:4,
        time:"0.0.30.0"

    },
    {
        id:21,
        name: "Mushroom",
        img: ["mushroom_seed", "mushroom_grow", "mushroom_harvest", "mushroom", "mushroom_warn"],
        count:4,
        time:"0.1.0.0"
    },
    {
        id:22,
        name: "Cactus",
        img: ["cactus_seed", "cactus_grow", "cactus_harvest", "cactus", "cactus_warn"],
        count:4,
        time:"0.1.0.0"
    },
    {
        id:23,
        name: "Banana",
        img: ["banana_seed", "banana_grow", "banana_harvest", "banana", "banana_warn"],
        count:4,
        time:"0.1.0.0"
    },
    {
        id:24,
        name: "Cupcake",
        img: ["cupcake_seed", "cupcake_grow", "cupcake_harvest", "cupcake", "cupcake_warn"],
        count:4,
        time:"0.2.0.0"
    },
    {
        id:25,
        name: "Doughnut",
        img: ["doughnut_seed", "doughnut_grow", "doughnut_harvest", "doughnut", "doughnut_warn"],
        count:4,
        time:"0.2.0.0"
    },
    {
        id:26,
        name: "Gingerbread Man",
        img: ["gingerbread_man_seed", "gingerbread_man_grow", "gingerbread_man_harvest", "gingerbread_man", "gingerbread_man_warn"],
        count:4,
        time:"0.2.0.0"
    },
    {
        id:27,
        name: "Egg",
        img: ["egg_seed", "egg_grow", "egg_harvest", "egg", "egg_warn"],
        count:4,
        time:"0.4.0.0"
    },
    {
        id:28,
        name: "Chicken",
        img: ["chicken_seed", "chicken_grow", "chicken_harvest", "chicken", "chicken_warn"],
        count:4,
        time:"0.4.0.0"
    },
    {
        id:29,
        name: "Report",
        img: ["report_seed", "report_grow", "report_harvest", "report", "report_warn"],
        count:4,
        time:"0.4.0.0"
    },
    {
        id:30,
        name: "Guard Level 1",
        img: ["report", "report", "report", "report", "report"],
        count:1,
        time:"0.4.0.0"
    },
    {
        id:31,
        name: "Guard Level 2",
        img: ["report", "report", "report", "report", "report"],
        count:1,
        time:"0.4.0.0"
    },
    {
        id:32,
        name: "Guard Level 3",
        img: ["report", "report", "report", "report", "report"],
        count:1,
        time:"0.4.0.0"
    },
    {
        id:33,
        name: "Guard Level 4",
        img: ["report", "report", "report", "report", "report"],
        count:1,
        time:"0.4.0.0"
    },
    {
        id:34,
        name: "Guard Level 5",
        img: ["report", "report", "report", "report", "report"],
        count:1,
        time:"0.4.0.0"
    },
    {
        id:35,
        name: "Guard Level 6",
        img: ["report", "report", "report", "report", "report"],
        count:1,
        time:"0.4.0.0"
    },
    {
        id:36,
        name: "Guard Level 7",
        img: ["report", "report", "report", "report", "report"],
        count:1,
        time:"0.4.0.0"
    },
    {
        id:37,
        name: "Guard Level 8",
        img: ["report", "report", "report", "report", "report"],
        count:1,
        time:"0.4.0.0"
    },
    {
        id:38,
        name: "Guard Level 9",
        img: ["report", "report", "report", "report", "report"],
        count:1,
        time:"0.4.0.0"
    },
    {
        id:39,
        name: "Guard Level 10",
        img: ["report", "report", "report", "report", "report"],
        count:1,
        time:"0.4.0.0"
    },


];

landTypeList = [
  {
      id:0,
      name: "Dirt",
      img: "land",
      count:0,
  }

];

MissionList = [
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

missionItem = [
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
      //sweetAlert("Oops...", "There was an error fetching your accounts.", "error");
      Session.set('account', "Wallet Not Found");
      return;
    }

    if (accs.length == 0) {
      //sweetAlert("Oops...", "Couldn't get any accounts! Make sure your Ethereum client is configured correctly.", "error");
      Session.set('account', "Account Not Found");
      return;
    }

    accounts = accs;
    account = accounts[currentAccount];
    Session.set('account', account);
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


    //var length = usingPropertyInstance.getPropertyTypeLength({ from:web3.eth.accounts[currentAccount]});
    //usingPropertyInstance.updatePropertyTypeRating(length, 0, "new", { from:web3.eth.accounts[currentAccount], gas:2000000});

    //for(var i = 0; i < length; i++){
    //    usingPropertyInstance.initUserProperty(i, { from:web3.eth.accounts[currentAccount], gas:2000000});
    //}
    console.log("Init Complete");


}

Template.index.created = function() {
    $.getScript('scripts/buttons.js');

    init();
    Session.set('currentAccount', currentAccount);
    Session.set('cropsPerLvl', cropsPerLvl);

    if (Session.get('account') == "Account Not Found" || Session.get('account') == "Wallet Not Found"){
        return false;
    };

    try{
      var val = usingPropertyInstance.propertyTypeList(0);
      console.log("=========== Data Inited ===========");

    }
    catch(err){
      initGameConfig();
      console.log(err);
    }




}

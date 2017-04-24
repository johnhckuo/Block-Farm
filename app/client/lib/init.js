import { Session } from 'meteor/session';

var currentAccount = 1;
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
      time:"0.0.0.30"

  },
  {
      id:2,
      name: "Lettuce",
      img: ["lettuce_seed", "lettuce_grow", "lettuce_harvest", "lettuce"],
      count:4,
      time:"0.0.10.0"

  },
  {
      id:3,
      name: "Cauliflower",
      img: ["cauliflower_seed", "cauliflower_grow", "cauliflower_harvest", "cauliflower"],
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
    for (var i = 0 ; i < cropTypeList.length ; i++){
        usingPropertyInstance.addPropertyType(cropTypeList[i].name, cropTypeList[i].img, cropTypeList[i].time, cropTypeList[i].count, { from:web3.eth.accounts[currentAccount], gas:2000000});
    }

    for (var i = 0 ; i < landTypeList.length ; i++){
        usingPropertyInstance.addLandType(landTypeList[i].name, landTypeList[i].img, landTypeList[i].count, { from:web3.eth.accounts[currentAccount], gas:2000000});

    }
    console.log("Init Complete");

}

window.onload = function() {
    init();
    Session.set('currentAccount', currentAccount);
    Session.set('cropsPerLvl', cropsPerLvl);


    //initGameConfig();

}

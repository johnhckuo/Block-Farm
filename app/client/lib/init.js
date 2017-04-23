import { Session } from 'meteor/session';

var currentAccount = 1;


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

}


var hex2a = function(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

window.onload = function() {
    init();
    Session.set('currentAccount', currentAccount);
    //initGameConfig();
}

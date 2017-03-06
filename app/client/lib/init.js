var accounts;
var account;
var balance;

function init(event){

    //alert("Congress Address:" +CongressInstance.address);


    //alert("usingProperty Address:" +usingPropertyInstance.address);


    //傾聽事件
    // Congress.createTime().watch(function(error, result){
    //   if (!error)
    //     alert("contract created!");
    // });


}




function addMember(name, threshold, fund, rate, character){
    var name = $(".s_Name").val();
    var threshold = $(".s_Threshold").val();
    var fund = $(".s_Fund").val();
    var rate = $("s_Rate").val();
    var character = $("")

    Congress.addMember(name, threshold, fund, rate, character, {from:accounts[1], gas:221468})
    .then(function(txs){
        console.log("txs");
        console.log(txs);
        console.log(Congress.address)

    });
}

function getStakeholdersLength(){
    CongressInstance.getStakeholdersLength.call({from:accounts[0]})
    .then(function(result){
      alert("get Stakeholder Length");
      console.log(result);
    });
}

function getCongressAddr(){
    usingProperty.getCongressAddr.call({from:accounts[1]})
    .then(function(addr){
        console.log(addr);
    });
}


function hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}



window.onload = function() {
  console.log("h")
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
    init();
  });
}

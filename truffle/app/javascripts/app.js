var accounts;
var account;
var balance;

var Congress, usingProperty;

function init(event){

    $(".getCongressAddr").click(getCongressAddr);
    $(".addMember").click(addMember);


    Congress.deployed().then(function(instance,txs){
      console.log(instance);
      Congress = instance;
      alert("Congress Address:" +Congress.address);
    });

    usingProperty.deployed().then(function(instance){
      usingProperty = instance;
      alert("usingProperty Address:" +usingProperty.address);
    });

    //傾聽事件
    // Congress.createTime().watch(function(error, result){
    //   if (!error)
    //     alert("contract created!");
    // });


}




function addMember(){
    var name = $(".s_Name").val();
    var threshold = parseInt($(".s_Threshold").val());
    var fund = parseInt($(".s_Fund").val());
    var rate = parseInt($(".s_Rate").val());
    var character = $(".s_Character").val();
    console.log(name, threshold, fund, rate, character);


    Congress.addMember(name, threshold, fund, rate, character, {from:accounts[1], gas:221468})
    .then(function(txs){
        console.log("txs");
        console.log(txs);
    });
}

function getStakeholdersLength(){
    Congress.getStakeholdersLength.call({from:accounts[0]})
    .then(function(result){
      console.log("get Stakeholder Length");
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
    alert(account)
    init();
  });
}

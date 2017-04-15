var Congress = artifacts.require("./Congress.sol");
var usingProperty = artifacts.require("./usingProperty.sol");
var MainActivity = artifacts.require("./MainActivity.sol");


var CongressAddr;
//account0 = founder

//acount1 = new member

contract('Congress', function(accounts) {
  it("adding new member", function() {
    return Congress.deployed().then(function(instance){
        return instance.addMember("John", 100, 100, 50, "buyer", {from:accounts[1]});
      }).then(function(txs){
            console.log("txs");
            console.log(txs);
        });
  });

  it("get Stakeholder Length", function() {
    return Congress.deployed().then(function(instance){
        return instance.getStakeholdersLength.call({from:accounts[0]});
      }).then(function(result){
          console.log("get Stakeholder Length");
          console.log(result);
    });
  });

  it("show new stakeholder ID", function() {
    return Congress.deployed().then(function(instance){
        return instance.stakeholderId.call(accounts[1]);
      }).then(function(result){
          console.log("stakeholderId " +result);
    });
  });
// });
//
// contract('usingProperty', function(accounts) {
  it("show congress contract address ", function() {
    return usingProperty.deployed().then(function(instance){
        return instance.getCongressAddr.call(accounts[1]);
      }).then(function(addr){
            CongressAddr = addr;
            console.log("=========================")
            console.log(addr);
        });
    });


  // it("adding new property", function() {
  //   return usingProperty.deployed().then(function(instance){
  //       return instance.addProperty("Egg", 100, [accounts[0], accounts[1]], "unit", 1, ":D", 10, {from:accounts[1]});
  //     }).then(function(txs){
  //           console.log(txs);
  //
  //   }).catch(function(e){
  //     console.log(e);
  //   });
  //
  // });

  it("check property length", function() {
    return usingProperty.deployed().then(function(instance){
        return instance.getPropertiesLength.call({from:accounts[0]});
      }).then(function(length){
            console.log(length);

        });


  });

  // it("check property rating length", function() {
  //   return usingProperty.deployed().then(function(instance){
  //       return instance.getPropertyRatingLength.call(0, {from:accounts[0]});
  //     }).then(function(length){
  //           console.log(length);
  //
  //       });
  // });

  // it("get property", function() {
  //   return usingProperty.deployed().then(function(instance){
  //       return instance.getProperty.call(0, {from: accounts[1]});
  //     }).then(function(name, since, propertyCount, unit, minUnit, owner, extraData){
  //           console.log(name+ '-' +since+ '-' +propertyCount+ '-' +unit+ '-' +minUnit+ '-' +owner+ '-' +extraData);
  //
  //       });
  // });
  //
  // it("get property rating", function() {
  //   return usingProperty.deployed().then(function(instance){
  //       return instance.getPropertyRating.call(0, 1, {from: accounts[0]});
  //     }).then(function(rating){
  //           console.log(rating);
  //       });
  // });



  it("adding new member", function() {
    var congress;
    var property;

    return Congress.deployed().then(function(instance){
            congress = instance;
            return congress.addMember("Bill", 200, 200, 100, "buyer", {from:accounts[2]});
        }).then(function(txs){

            console.log("txs");
            console.log(txs);
            return usingProperty.deployed();
        }).then(function(instance){
            property = instance;
            return property.getPropertiesLength.call({from:accounts[1]});

        }).then(function(length){
            console.log(length);
            return property.updatePropertyTypeRating(length, 0, "new", {from:accounts[1]});
        });
  });

  it("get Stakeholder Length", function() {
    return Congress.deployed().then(function(instance){
        return instance.getStakeholdersLength.call({from:accounts[0]});
      }).then(function(result){
          console.log("get Stakeholder Length");
          console.log(result);
    });
  });


  it("Init property type", function() {
    return usingProperty.deployed().then(function(instance){
        return instance.addPropertyType("carrot", "piece", 1, {from:accounts[2]});
      }).then(function(txs){
            console.log(txs);

    }).catch(function(e){
      console.log(e);
    });

  });

  it("Init property type", function() {
    return usingProperty.deployed().then(function(instance){
        return instance.addPropertyType("cactus", "piece", 1, {from:accounts[2]});
      }).then(function(txs){
            console.log(txs);

    }).catch(function(e){
      console.log(e);
    });

  });


  it("Init property type", function() {
    return usingProperty.deployed().then(function(instance){
        return instance.addPropertyType("apple", "piece", 1, {from:accounts[2]});
      }).then(function(txs){
            console.log(txs);

    }).catch(function(e){
      console.log(e);
    });

  });




  it("adding new property by bill", function() {
    return usingProperty.deployed().then(function(instance){
        return instance.addProperty("Pikachu", 1000, [accounts[0], accounts[1]], "unit", 10, "C:", 30, "carrot", true, {from:accounts[2]});
      }).then(function(txs){
            console.log(txs);

    }).catch(function(e){
      console.log(e);
    });

  });

  it("adding new property2 by bill", function() {
    return usingProperty.deployed().then(function(instance){
        return instance.addProperty("MacBook", 1, [accounts[0], accounts[1]], "unit", 1, ":)", 20, "cactus", true, {from:accounts[2]});
      }).then(function(txs){
            console.log(txs);

    }).catch(function(e){
      console.log(e);
    });

  });

  it("adding new property by john", function() {
    return usingProperty.deployed().then(function(instance){
        return instance.addProperty("Egg", 100, [accounts[0], accounts[1]], "unit", 1, ":D", 10, "apple", true, {from:accounts[1]});
      }).then(function(txs){
            console.log(txs);

    }).catch(function(e){
      console.log(e);
    });

  });

  it("check property length", function() {
    return usingProperty.deployed().then(function(instance){
        return instance.getPropertiesLength.call({from:accounts[0]});
      }).then(function(length){
            console.log(length);

        });
  });

  it("check property rating length", function() {
    return usingProperty.deployed().then(function(instance){
        return instance.getPropertyRatingLength.call(0, {from:accounts[0]});
      }).then(function(length){
            console.log(length);

        });
  });



  it("get average rating of pikachu", function() {
    return usingProperty.deployed().then(function(instance){
        return instance.getPartialProperty.call(0, {from: accounts[0]});
      }).then(function(rating){
            console.log(rating);
        });
  });

  it("get average rating of pickachu", function() {
    return usingProperty.deployed().then(function(instance){
        return instance.getPartialProperty.call(1, {from: accounts[0]});
      }).then(function(rating){
            console.log(rating);
        });
  });


  // it("match making test", function(done) {
  //   var main;
  //   return MainActivity.deployed().then(function(instance){
  //     main = instance;
  //
  //     main.matchSuccess().watch(function(error, result){
  //       if (!error)
  //         console.log(result.args);
  //     });
  //
  //     main.test().watch(function(error, result2){
  //       if (!error)
  //         console.log(result2.args);
  //     });
  //
  //     // main.matchFail().watch(function(error, result){
  //     //   if (!error)
  //     //     console.log("Fail !!!!!!!!!");
  //     // });
  //
  //       return instance.startMatching({from:accounts[0]});
  //     }).then(function(result){
  //           //console.log(result);
  //
  //     });
  // });

  it("adding new member", function() {
    var congress;
    var property;

    return Congress.deployed().then(function(instance){
            congress = instance;
            return congress.addMember("Bryant", 200, 200, 100, "buyer", {from:accounts[3]});
        }).then(function(txs){

            console.log("txs");
            console.log(txs);
            return usingProperty.deployed();
        }).then(function(instance){
            property = instance;
            return property.getPropertiesLength.call({from:accounts[1]});

        }).then(function(length){
            console.log(length);
            return property.updatePropertyTypeRating(length, 0, "new", {from:accounts[1]});
        });
  });

  it("adding lenovo by bryant", function() {
    var property;
    return usingProperty.deployed().then(function(instance){
        property = instance;
        return property.addProperty("lenovo", 100, [accounts[0], accounts[1]], "unit", 1, ":D", 5, "apple", true, {from:accounts[3]});
      }).then(function(txs){
        console.log(txs);
      });

  });

  it("adding Ipod by bryant", function() {
    var property;
    return usingProperty.deployed().then(function(instance){
        property = instance;
        return property.addProperty("IPod", 100, [accounts[0], accounts[1]], "unit", 1, ":D", 7, "cactus", true, {from:accounts[3]});
      }).then(function(txs){
        console.log(txs);
      });

  });
  it("adding Iphone by bryant", function() {
    var property;
    return usingProperty.deployed().then(function(instance){
        property = instance;
        return property.addProperty("IPhone", 100, [accounts[0], accounts[1]], "unit", 1, ":D", 3, "carrot", true, {from:accounts[3]});
      }).then(function(txs){
        console.log(txs);
      });

  });

  it("check property length", function() {
    return usingProperty.deployed().then(function(instance){
        return instance.getPropertiesLength.call({from:accounts[0]});
      }).then(function(length){
            console.log(length);

        });
  });

  it("updae Pikachu rating by john", function() {
    return usingProperty.deployed().then(function(instance){
        return instance.updatePropertyTypeRating(0, 100, "update",  {from:accounts[1]});
      }).then(function(txs){
            console.log(txs);

        });
  });

  it("updae MacBook rating by john", function() {
    return usingProperty.deployed().then(function(instance){
        return instance.updatePropertyTypeRating(1, 100, "update",  {from:accounts[1]});
      }).then(function(txs){
            console.log(txs);

        });
  });

  it("updae MacBook rating by john", function() {
    return usingProperty.deployed().then(function(instance){
        return instance.updatePropertyTypeRating(2, 50, "update",  {from:accounts[1]});
      }).then(function(txs){
            console.log(txs);

        });
  });

  it("updae Egg rating by bill", function() {
    return usingProperty.deployed().then(function(instance){
        return instance.updatePropertyTypeRating(0, 40, "update",  {from:accounts[2]});
      }).then(function(txs){
            console.log(txs);

        });
  });

  it("updae Egg rating by bill", function() {
    return usingProperty.deployed().then(function(instance){
        return instance.updatePropertyTypeRating(1, 70, "update",  {from:accounts[2]});
      }).then(function(txs){
            console.log(txs);

        });
  });

  it("updae Egg rating by bill", function() {
    return usingProperty.deployed().then(function(instance){
        return instance.updatePropertyTypeRating(2, 20, "update",  {from:accounts[2]});
      }).then(function(txs){
            console.log(txs);

        });
  });

  it("updae Egg rating by bryant", function() {
    return usingProperty.deployed().then(function(instance){
        return instance.updatePropertyTypeRating(0, 80, "update",  {from:accounts[3]});
      }).then(function(txs){
            console.log(txs);

        });
  });

  it("updae Pikachu rating by bryant", function() {
    return usingProperty.deployed().then(function(instance){
        return instance.updatePropertyTypeRating(1, 60, "update",  {from:accounts[3]});
      }).then(function(txs){
            console.log(txs);

        });
  });

  it("updae Mac rating by bryant", function() {
    return usingProperty.deployed().then(function(instance){
        return instance.updatePropertyTypeRating(2, 10, "update",  {from:accounts[3]});
      }).then(function(txs){
            console.log(txs);

        });
  });


  // it("updae Lenovo rating by John", function() {
  //   return usingProperty.deployed().then(function(instance){
  //       return instance.updatePropertyTypeRating(3, 40, "update",  {from:accounts[1]});
  //     }).then(function(txs){
  //           console.log(txs);
  //
  //       });
  // });
  //
  // it("updae IPod rating by John", function() {
  //   return usingProperty.deployed().then(function(instance){
  //       return instance.updatePropertyTypeRating(4, 70, "update",  {from:accounts[1]});
  //     }).then(function(txs){
  //           console.log(txs);
  //
  //       });
  // });
  //
  // it("updae IPhone rating by John", function() {
  //   return usingProperty.deployed().then(function(instance){
  //       return instance.updatePropertyTypeRating(5, 50, "update",  {from:accounts[1]});
  //     }).then(function(txs){
  //           console.log(txs);
  //
  //       });
  // });


  // it("updae Lenovo rating by Bill", function() {
  //   return usingProperty.deployed().then(function(instance){
  //       return instance.updatePropertyTypeRating(3, 100, "update",  {from:accounts[2]});
  //     }).then(function(txs){
  //           console.log(txs);
  //
  //       });
  // });
  //
  // it("updae IPod rating by BIll", function() {
  //   return usingProperty.deployed().then(function(instance){
  //       return instance.updatePropertyTypeRating(4, 90, "update",  {from:accounts[2]});
  //     }).then(function(txs){
  //           console.log(txs);
  //
  //       });
  // });
  //
  // it("updae IPhone rating by Bill", function() {
  //   return usingProperty.deployed().then(function(instance){
  //       return instance.updatePropertyTypeRating(5, 95, "update",  {from:accounts[2]});
  //     }).then(function(txs){
  //           console.log(txs);
  //
  //       });
  // });

  it("match making test", function(done) {
    var main;
    return MainActivity.deployed().then(function(instance){
      main = instance;

      main.matchSuccess().watch(function(error, result){
        if (!error)
          console.log(result.args.id);
      });


      main.test().watch(function(error, result2){
        if (!error)
          console.log(result2.args);
      });

      main.matchFail().watch(function(error, result){
        if (!error)
          console.log("Fail !!!!!!!!!");
      });

        return instance.findOrigin({from:accounts[0]});
      }).then(function(result){
            //console.log(result);

      });
  });

  // it("test", function() {
  //   return MainActivity.deployed().then(function(instance){
  //       return instance.matchingAlgo.call(0, 2, {from:accounts[0]});
  //     }).then(function(result){
  //           console.log(result);
  //       });
  // });


});

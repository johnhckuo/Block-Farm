var Web3 = require("web3");
var SolidityEvent = require("web3/lib/web3/event.js");

(function() {
  // Planned for future features, logging, etc.
  function Provider(provider) {
    this.provider = provider;
  }

  Provider.prototype.send = function() {
    this.provider.send.apply(this.provider, arguments);
  };

  Provider.prototype.sendAsync = function() {
    this.provider.sendAsync.apply(this.provider, arguments);
  };

  var BigNumber = (new Web3()).toBigNumber(0).constructor;

  var Utils = {
    is_object: function(val) {
      return typeof val == "object" && !Array.isArray(val);
    },
    is_big_number: function(val) {
      if (typeof val != "object") return false;

      // Instanceof won't work because we have multiple versions of Web3.
      try {
        new BigNumber(val);
        return true;
      } catch (e) {
        return false;
      }
    },
    merge: function() {
      var merged = {};
      var args = Array.prototype.slice.call(arguments);

      for (var i = 0; i < args.length; i++) {
        var object = args[i];
        var keys = Object.keys(object);
        for (var j = 0; j < keys.length; j++) {
          var key = keys[j];
          var value = object[key];
          merged[key] = value;
        }
      }

      return merged;
    },
    promisifyFunction: function(fn, C) {
      var self = this;
      return function() {
        var instance = this;

        var args = Array.prototype.slice.call(arguments);
        var tx_params = {};
        var last_arg = args[args.length - 1];

        // It's only tx_params if it's an object and not a BigNumber.
        if (Utils.is_object(last_arg) && !Utils.is_big_number(last_arg)) {
          tx_params = args.pop();
        }

        tx_params = Utils.merge(C.class_defaults, tx_params);

        return new Promise(function(accept, reject) {
          var callback = function(error, result) {
            if (error != null) {
              reject(error);
            } else {
              accept(result);
            }
          };
          args.push(tx_params, callback);
          fn.apply(instance.contract, args);
        });
      };
    },
    synchronizeFunction: function(fn, instance, C) {
      var self = this;
      return function() {
        var args = Array.prototype.slice.call(arguments);
        var tx_params = {};
        var last_arg = args[args.length - 1];

        // It's only tx_params if it's an object and not a BigNumber.
        if (Utils.is_object(last_arg) && !Utils.is_big_number(last_arg)) {
          tx_params = args.pop();
        }

        tx_params = Utils.merge(C.class_defaults, tx_params);

        return new Promise(function(accept, reject) {

          var decodeLogs = function(logs) {
            return logs.map(function(log) {
              var logABI = C.events[log.topics[0]];

              if (logABI == null) {
                return null;
              }

              var decoder = new SolidityEvent(null, logABI, instance.address);
              return decoder.decode(log);
            }).filter(function(log) {
              return log != null;
            });
          };

          var callback = function(error, tx) {
            if (error != null) {
              reject(error);
              return;
            }

            var timeout = C.synchronization_timeout || 240000;
            var start = new Date().getTime();

            var make_attempt = function() {
              C.web3.eth.getTransactionReceipt(tx, function(err, receipt) {
                if (err) return reject(err);

                if (receipt != null) {
                  // If they've opted into next gen, return more information.
                  if (C.next_gen == true) {
                    return accept({
                      tx: tx,
                      receipt: receipt,
                      logs: decodeLogs(receipt.logs)
                    });
                  } else {
                    return accept(tx);
                  }
                }

                if (timeout > 0 && new Date().getTime() - start > timeout) {
                  return reject(new Error("Transaction " + tx + " wasn't processed in " + (timeout / 1000) + " seconds!"));
                }

                setTimeout(make_attempt, 1000);
              });
            };

            make_attempt();
          };

          args.push(tx_params, callback);
          fn.apply(self, args);
        });
      };
    }
  };

  function instantiate(instance, contract) {
    instance.contract = contract;
    var constructor = instance.constructor;

    // Provision our functions.
    for (var i = 0; i < instance.abi.length; i++) {
      var item = instance.abi[i];
      if (item.type == "function") {
        if (item.constant == true) {
          instance[item.name] = Utils.promisifyFunction(contract[item.name], constructor);
        } else {
          instance[item.name] = Utils.synchronizeFunction(contract[item.name], instance, constructor);
        }

        instance[item.name].call = Utils.promisifyFunction(contract[item.name].call, constructor);
        instance[item.name].sendTransaction = Utils.promisifyFunction(contract[item.name].sendTransaction, constructor);
        instance[item.name].request = contract[item.name].request;
        instance[item.name].estimateGas = Utils.promisifyFunction(contract[item.name].estimateGas, constructor);
      }

      if (item.type == "event") {
        instance[item.name] = contract[item.name];
      }
    }

    instance.allEvents = contract.allEvents;
    instance.address = contract.address;
    instance.transactionHash = contract.transactionHash;
  };

  // Use inheritance to create a clone of this contract,
  // and copy over contract's static functions.
  function mutate(fn) {
    var temp = function Clone() { return fn.apply(this, arguments); };

    Object.keys(fn).forEach(function(key) {
      temp[key] = fn[key];
    });

    temp.prototype = Object.create(fn.prototype);
    bootstrap(temp);
    return temp;
  };

  function bootstrap(fn) {
    fn.web3 = new Web3();
    fn.class_defaults  = fn.prototype.defaults || {};

    // Set the network iniitally to make default data available and re-use code.
    // Then remove the saved network id so the network will be auto-detected on first use.
    fn.setNetwork("default");
    fn.network_id = null;
    return fn;
  };

  // Accepts a contract object created with web3.eth.contract.
  // Optionally, if called without `new`, accepts a network_id and will
  // create a new version of the contract abstraction with that network_id set.
  function Contract() {
    if (this instanceof Contract) {
      instantiate(this, arguments[0]);
    } else {
      var C = mutate(Contract);
      var network_id = arguments.length > 0 ? arguments[0] : "default";
      C.setNetwork(network_id);
      return C;
    }
  };

  Contract.currentProvider = null;

  Contract.setProvider = function(provider) {
    var wrapped = new Provider(provider);
    this.web3.setProvider(wrapped);
    this.currentProvider = provider;
  };

  Contract.new = function() {
    if (this.currentProvider == null) {
      throw new Error("MainActivity error: Please call setProvider() first before calling new().");
    }

    var args = Array.prototype.slice.call(arguments);

    if (!this.unlinked_binary) {
      throw new Error("MainActivity error: contract binary not set. Can't deploy new instance.");
    }

    var regex = /__[^_]+_+/g;
    var unlinked_libraries = this.binary.match(regex);

    if (unlinked_libraries != null) {
      unlinked_libraries = unlinked_libraries.map(function(name) {
        // Remove underscores
        return name.replace(/_/g, "");
      }).sort().filter(function(name, index, arr) {
        // Remove duplicates
        if (index + 1 >= arr.length) {
          return true;
        }

        return name != arr[index + 1];
      }).join(", ");

      throw new Error("MainActivity contains unresolved libraries. You must deploy and link the following libraries before you can deploy a new version of MainActivity: " + unlinked_libraries);
    }

    var self = this;

    return new Promise(function(accept, reject) {
      var contract_class = self.web3.eth.contract(self.abi);
      var tx_params = {};
      var last_arg = args[args.length - 1];

      // It's only tx_params if it's an object and not a BigNumber.
      if (Utils.is_object(last_arg) && !Utils.is_big_number(last_arg)) {
        tx_params = args.pop();
      }

      tx_params = Utils.merge(self.class_defaults, tx_params);

      if (tx_params.data == null) {
        tx_params.data = self.binary;
      }

      // web3 0.9.0 and above calls new twice this callback twice.
      // Why, I have no idea...
      var intermediary = function(err, web3_instance) {
        if (err != null) {
          reject(err);
          return;
        }

        if (err == null && web3_instance != null && web3_instance.address != null) {
          accept(new self(web3_instance));
        }
      };

      args.push(tx_params, intermediary);
      contract_class.new.apply(contract_class, args);
    });
  };

  Contract.at = function(address) {
    if (address == null || typeof address != "string" || address.length != 42) {
      throw new Error("Invalid address passed to MainActivity.at(): " + address);
    }

    var contract_class = this.web3.eth.contract(this.abi);
    var contract = contract_class.at(address);

    return new this(contract);
  };

  Contract.deployed = function() {
    if (!this.address) {
      throw new Error("Cannot find deployed address: MainActivity not deployed or address not set.");
    }

    return this.at(this.address);
  };

  Contract.defaults = function(class_defaults) {
    if (this.class_defaults == null) {
      this.class_defaults = {};
    }

    if (class_defaults == null) {
      class_defaults = {};
    }

    var self = this;
    Object.keys(class_defaults).forEach(function(key) {
      var value = class_defaults[key];
      self.class_defaults[key] = value;
    });

    return this.class_defaults;
  };

  Contract.extend = function() {
    var args = Array.prototype.slice.call(arguments);

    for (var i = 0; i < arguments.length; i++) {
      var object = arguments[i];
      var keys = Object.keys(object);
      for (var j = 0; j < keys.length; j++) {
        var key = keys[j];
        var value = object[key];
        this.prototype[key] = value;
      }
    }
  };

  Contract.all_networks = {
  "default": {
    "abi": [
      {
        "constant": false,
        "inputs": [
          {
            "name": "visitNode",
            "type": "uint256"
          }
        ],
        "name": "findVisitNode",
        "outputs": [
          {
            "name": "",
            "type": "bytes32"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_level",
            "type": "uint256"
          }
        ],
        "name": "levelCap",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "visitNode",
            "type": "uint256"
          },
          {
            "name": "i",
            "type": "uint256"
          }
        ],
        "name": "returnPriority",
        "outputs": [
          {
            "name": "",
            "type": "int256"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "s_Id",
            "type": "uint256"
          },
          {
            "name": "_name",
            "type": "bytes32"
          },
          {
            "name": "_character",
            "type": "bytes32"
          }
        ],
        "name": "initGameData",
        "outputs": [],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "matches",
        "outputs": [
          {
            "name": "id",
            "type": "uint256"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "findOrigin",
        "outputs": [
          {
            "name": "success",
            "type": "bytes32"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "elem",
            "type": "uint256"
          },
          {
            "name": "data",
            "type": "uint256[]"
          }
        ],
        "name": "checkExist",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "priorityList",
            "type": "int256[]"
          },
          {
            "name": "visitList",
            "type": "uint256[]"
          }
        ],
        "name": "sort",
        "outputs": [
          {
            "name": "",
            "type": "int256[]"
          },
          {
            "name": "",
            "type": "uint256[]"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "u_Id",
            "type": "uint256"
          },
          {
            "name": "random",
            "type": "uint256"
          }
        ],
        "name": "playerLevelUp",
        "outputs": [],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "getPropertiesLength",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "inputs": [
          {
            "name": "_congressAddress",
            "type": "address"
          },
          {
            "name": "_propertyAddress",
            "type": "address"
          }
        ],
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "id",
            "type": "uint256[]"
          },
          {
            "indexed": false,
            "name": "priority",
            "type": "int256[]"
          }
        ],
        "name": "matchSuccess",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [],
        "name": "matchFail",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "test",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "returnOrigin",
        "type": "event"
      }
    ],
    "unlinked_binary": "0x60606040818152600360095580611691833960a0908190529051608051600780546c01000000000000000000000000808502819004600160a060020a0319928316179283905560088054828602839004908416179081905560058054600160a060020a039586168402849004908516179081905560068054928616840293909304919093161790557fec935ada000000000000000000000000000000000000000000000000000000008552600060a481905260c481905260e48190529394929391169163ec935ada91610104916064818387803b156100025760325a03f1156100025750505061022060007f4d6f64657261746f7200000000000000000000000000000000000000000000007f4775617264000000000000000000000000000000000000000000000000000000600554604080517ff46bba8d00000000000000000000000000000000000000000000000000000000815260048101859052602481018490529051600092600160a060020a03169163f46bba8d916044808301928692919082900301818387803b156100025760325a03f11561000257505050600090505b600381101561023057600654604080517feef3921f000000000000000000000000000000000000000000000000000000008152600481018790529051600160a060020a039092169163eef3921f9160248082019260009290919082900301818387803b156100025760325a03f115610002575050506001016101a3565b505061145b806102366000396000f35b5050505056606060405236156100825760e060020a6000350463077c83d681146100875780630d09e9c71461009757806319a87723146100c0578063448514d5146100d35780634768d4ef146101d857806390ec566214610207578063a48e7f971461033c578063bf7be6921461038a578063d91a3c881461040e578063f1607bf5146104d8575b610002565b346100025761054060043561057d565b34610002576105406004355b60006001815b83811015610ea457600291909102906001016100a9565b346100025761054060043560243561079e565b34610002576109b4600435602435604435600554604080517ff46bba8d00000000000000000000000000000000000000000000000000000000815260048101859052602481018490529051600092600160a060020a03169163f46bba8d916044808301928692919082900301818387803b156100025760325a03f11561000257505050600090505b6003811015610eae57600654604080517feef3921f000000000000000000000000000000000000000000000000000000008152600481018790529051600160a060020a039092169163eef3921f9160248082019260009290919082900301818387803b156100025760325a03f1156100025750505060010161015b565b3461000257610540600435600a8054829081101561000257906000526020600020906003020160005054905081565b346100025760408051602080820183526000808352835180830185528181528451808401865282815260065486518501849052865160e060020a63f1607bf502815296516105409794968796909587938493849384938493600160a060020a03169263f1607bf59260048084019391929182900301818787803b156100025760325a03f11561000257505060405180519a508a91508059106102a65750595b9080825280602002602001820160405280156102bd575b509750886040518059106102ce5750595b9080825280602002602001820160405280156102e5575b509650886040518059106102f65750595b90808252806020026020018201604052801561030d575b5095506000600060005081815481835581811511610eb457600083815260209020610eb4918101908301610ce2565b34610002576040805160248035600481810135602081810286810182019097528186526109b696833596939560449501929182919085019084908082843750949650610a4495505050505050565b346100025760408051602060048035808201358381028086018501909652808552610a8195929460249490939285019282918501908490808284375050604080518735808a013560208181028481018201909552818452989a99604499939850919091019550935083925085019084908082843750949650610b0c95505050505050565b34610002576109b4600435602435600060006000600060006000600060006000600560009054906101000a9004600160a060020a0316600160a060020a031663c98516298c600060405160e001526040518260e060020a0281526004018082815260200191505060e060405180830381600087803b156100025760325a03f1156100025750506040805180516020820151928201516060830151608084015160a085015160c090950151939f50949d50909b509950919750600101955093506112c89050846100a3565b34610002576105406006546040805160006020918201819052825160e060020a63f1607bf502815292519093600160a060020a03169263f1607bf592600480830193919282900301818787803b156100025760325a03f1156100025750506040515191505090565b60408051918252519081900360200190f35b50506002546001805460009450909250811015610002576000918252602090912001556004546111d8905b600060006020604051908101604052806000815260200150602060405190810160405280600081526020015060006000600060006000600060006000600660009054906101000a9004600160a060020a0316600160a060020a031663f1607bf56000604051602001526040518160e060020a028152600401809050602060405180830381600087803b156100025760325a03f11561000257505060405180519c508c915080591061062b5750595b908082528060200260200182016040528015610642575b5099508a6040518059106106535750595b90808252806020026020018201604052801561066a575b509850600097505b8a881015610b0657600654604080516000908201819052815160e060020a63149449d3028152600481018c90528251600160a060020a039094169363149449d39360248084019491938390030190829087803b156100025760325a03f115610002575050506040518051906020018051906020015096509650600660009054906101000a9004600160a060020a0316600160a060020a031663149449d38e6000604051604001526040518260e060020a02815260040180828152602001915050604060405180830381600087803b156100025760325a03f1156100025750506040518051602090910151909650945050878d148061078e575084600160a060020a031687600160a060020a031614801561078e57506004548814155b1561079857610bba565b610b8b8d895b600060006000600060006000600660009054906101000a9004600160a060020a0316600160a060020a031663149449d3896000604051604001526040518260e060020a02815260040180828152602001915050604060405180830381600087803b156100025760325a03f11561000257505060408051805160209182018051600654600554600093849052865160e260020a633834dc73028152600160a060020a0380871660048301529751959d50929b50908616965063de2aad36958f9591169363e0d371cc936024808501948390030190829087803b156100025760325a03f11561000257505050604051805190602001506000604051602001526040518360e060020a0281526004018083815260200182815260200192505050602060405180830381600087803b156100025760325a03f11561000257505060408051805160065460055460006020948501819052855160e260020a633834dc73028152600160a060020a038d811660048301529651949a50928616965063de2aad36958e9592169363e0d371cc9360248082019493918390030190829087803b156100025760325a03f11561000257505050604051805190602001506000604051602001526040518360e060020a0281526004018083815260200182815260200192505050602060405180830381600087803b156100025760325a03f115610002575050604051519390930398975050505050505050565b005b604080519115158252519081900360200190f35b9a509850600092508290505b8a811015610bd157610bc58a8281518110156100025760209081029091018101516000805460408051828602810186019091528181529293830182828015610a3e57602002820191906000526020600020905b81548152600190910190602001808311610a29575b50505050505b6000805b82518110156111e65782818151811015610002579060200190602002015184148015610a7357508015155b156111f257600091506111eb565b6040518080602001806020018381038352858181518152602001915080519060200190602002808383829060006004602084601f0104600302600f01f1509050018381038252848181518152602001915080519060200190602002808383829060006004602084601f0104600302600f01f15090500194505050505060405180910390f35b6109ca898b5b6040805160208181018352600080835283519182019093528281529091808080805b88518510156111fa578493508460010192505b8851831015611207578884815181101561000257906020019060200201518984815181101561000257906020019060200201511315610b805782935083505b600190920191610b41565b898981518110156100025760209081029091010152895188908b90829081101561000257602090810290910101525b600190970196610672565b92508215610c00579050805b6000805460018101808355909190828015829011610c6e57600083815260209020610c6e918101908301610ce2565b82158015610c10575060018b0381145b15610c66576040517f15263772101e2492477ebc827b016feaae825e0448fc62c6c090679efceacc6790600090a17f4661696c000000000000000000000000000000000000000000000000000000009b50610e94565b6001016109d6565b505050508982815181101561000257602090810290910101516002805460010190819055600080549091908110156100025760009182526020909120015560018054808201808355909190828015829011610cfa57600083815260209020610cfa918101908301610ce2565b506111009291505b80821115610cf65760008155600101610ce2565b5090565b5050505088828151811015610002579060200190602002015160016000506002600050548154811015610002576000918252602090912001556004548a518b90849081101561000257906020019060200201511415610e75577f8e4658573e812041d633f2131f90a61776b0ecc6dc545b7a5504c341e34000c5600060005060016000506040518080602001806020018381038352858181548152602001915080548015610dc857602002820191906000526020600020905b81548152600190910190602001808311610db3575b50508381038252848181548152602001915080548015610e0857602002820191906000526020600020905b81548152600190910190602001808311610df3575b505094505050505060405180910390a160408051600254815290517f29e99f07d14aa8d30a12fa0b0789b43183ba1bf6b4a72b95459a3e397cca10d79181900360200190a17f53756363657373000000000000000000000000000000000000000000000000009b50610e94565b610e928a838151811015610002579060200190602002015161057d565b505b5050505050505050505050919050565b5060640292915050565b50505050565b505050506000600160005081815481835581811511610ee457600083815260209020610ee4918101908301610ce2565b50505050600094505b8885101561106557600654604080516000908201819052815160e060020a63149449d3028152600481018990528251600160a060020a039094169363149449d39360248084019491938390030190829087803b156100025760325a03f11561000257505060408051805160209182018051600654600554600093849052865160e260020a633834dc73028152600160a060020a0380871660048301529751959c50929a50908616965063de2aad36958c9591169363e0d371cc936024808501948390030190829087803b156100025760325a03f11561000257505050604051805190602001506000604051602001526040518360e060020a0281526004018083815260200182815260200192505050602060405180830381600087803b156100025760325a03f115610002575050604051518951909350838503925082915089908790811015610002576020908102909101015286518590889082908110156100025760209081029091010152600190940193610eed565b61106f8888610b0c565b604051919950965089908059106110835750595b90808252806020026020018201604052801561109a575b50805160038054828255600082905290927fc2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85b9182019291906020018215610cda579160200282015b82811115610cda5782518260005055916020019190600101906110e2565b50508560008151811015610002576020908102909101810151600481905560408051918252517fe8caaaa4a0d5c9d15947ae3564cfdd394ffeaf5b1a87465c5a14104815beaec5929181900390910190a16000600281905580546001810180835590919082801582901161118557600083815260209020611185918101908301610ce2565b505060045460025460008054929450925090811015610002576000918252602090912001556001805480820180835590919082801582901161055257600083815260209020610552918101908301610ce2565b995050505050505050505090565b600191505b5092915050565b600101610a48565b5096979596505050505050565b8885815181101561000257906020019060200201519150888481518110156100025790602001906020020151898681518110156100025760209081029091010152885182908a90869081101561000257602090810290910101528751889086908110156100025790602001906020020151905087848151811015610002579060200190602002015188868151811015610002576020908102909101015287518190899086908110156100025760209081029091010152600190940193610b2e565b808803985091506005840615156113cd57600654600954604080516000602091820181905282517f17353dcd0000000000000000000000000000000000000000000000000000000081529389028f016004850152915160019990990198600160a060020a03909416936317353dcd93602480820194918390030190829087803b156100025760325a03f11561000257505050604051805190602001509050600660009054906101000a9004600160a060020a0316600160a060020a031663991b4d6e8c836040518360e060020a0281526004018083815260200182815260200192505050600060405180830381600087803b156100025760325a03f115610002575050505b600554604080517fdf9cd8cb000000000000000000000000000000000000000000000000000000008152600481018e90526024810188905260448101879052606481018b90529051600160a060020a039092169163df9cd8cb9160848082019260009290919082900301818387803b156100025760325a03f11561000257505050505050505050505050505056",
    "events": {
      "0x8e4658573e812041d633f2131f90a61776b0ecc6dc545b7a5504c341e34000c5": {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "id",
            "type": "uint256[]"
          },
          {
            "indexed": false,
            "name": "priority",
            "type": "int256[]"
          }
        ],
        "name": "matchSuccess",
        "type": "event"
      },
      "0x15263772101e2492477ebc827b016feaae825e0448fc62c6c090679efceacc67": {
        "anonymous": false,
        "inputs": [],
        "name": "matchFail",
        "type": "event"
      },
      "0x29e99f07d14aa8d30a12fa0b0789b43183ba1bf6b4a72b95459a3e397cca10d7": {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "test",
        "type": "event"
      },
      "0xe8caaaa4a0d5c9d15947ae3564cfdd394ffeaf5b1a87465c5a14104815beaec5": {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "returnOrigin",
        "type": "event"
      }
    },
    "updated_at": 1492937143152
  }
};

  Contract.checkNetwork = function(callback) {
    var self = this;

    if (this.network_id != null) {
      return callback();
    }

    this.web3.version.network(function(err, result) {
      if (err) return callback(err);

      var network_id = result.toString();

      // If we have the main network,
      if (network_id == "1") {
        var possible_ids = ["1", "live", "default"];

        for (var i = 0; i < possible_ids.length; i++) {
          var id = possible_ids[i];
          if (Contract.all_networks[id] != null) {
            network_id = id;
            break;
          }
        }
      }

      if (self.all_networks[network_id] == null) {
        return callback(new Error(self.name + " error: Can't find artifacts for network id '" + network_id + "'"));
      }

      self.setNetwork(network_id);
      callback();
    })
  };

  Contract.setNetwork = function(network_id) {
    var network = this.all_networks[network_id] || {};

    this.abi             = this.prototype.abi             = network.abi;
    this.unlinked_binary = this.prototype.unlinked_binary = network.unlinked_binary;
    this.address         = this.prototype.address         = network.address;
    this.updated_at      = this.prototype.updated_at      = network.updated_at;
    this.links           = this.prototype.links           = network.links || {};
    this.events          = this.prototype.events          = network.events || {};

    this.network_id = network_id;
  };

  Contract.networks = function() {
    return Object.keys(this.all_networks);
  };

  Contract.link = function(name, address) {
    if (typeof name == "function") {
      var contract = name;

      if (contract.address == null) {
        throw new Error("Cannot link contract without an address.");
      }

      Contract.link(contract.contract_name, contract.address);

      // Merge events so this contract knows about library's events
      Object.keys(contract.events).forEach(function(topic) {
        Contract.events[topic] = contract.events[topic];
      });

      return;
    }

    if (typeof name == "object") {
      var obj = name;
      Object.keys(obj).forEach(function(name) {
        var a = obj[name];
        Contract.link(name, a);
      });
      return;
    }

    Contract.links[name] = address;
  };

  Contract.contract_name   = Contract.prototype.contract_name   = "MainActivity";
  Contract.generated_with  = Contract.prototype.generated_with  = "3.2.0";

  // Allow people to opt-in to breaking changes now.
  Contract.next_gen = false;

  var properties = {
    binary: function() {
      var binary = Contract.unlinked_binary;

      Object.keys(Contract.links).forEach(function(library_name) {
        var library_address = Contract.links[library_name];
        var regex = new RegExp("__" + library_name + "_*", "g");

        binary = binary.replace(regex, library_address.replace("0x", ""));
      });

      return binary;
    }
  };

  Object.keys(properties).forEach(function(key) {
    var getter = properties[key];

    var definition = {};
    definition.enumerable = true;
    definition.configurable = false;
    definition.get = getter;

    Object.defineProperty(Contract, key, definition);
    Object.defineProperty(Contract.prototype, key, definition);
  });

  bootstrap(Contract);

  if (typeof module != "undefined" && typeof module.exports != "undefined") {
    module.exports = Contract;
  } else {
    // There will only be one version of this contract in the browser,
    // and we can use that.
    window.MainActivity = Contract;
  }
})();

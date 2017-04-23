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
      throw new Error("usingProperty error: Please call setProvider() first before calling new().");
    }

    var args = Array.prototype.slice.call(arguments);

    if (!this.unlinked_binary) {
      throw new Error("usingProperty error: contract binary not set. Can't deploy new instance.");
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

      throw new Error("usingProperty contains unresolved libraries. You must deploy and link the following libraries before you can deploy a new version of usingProperty: " + unlinked_libraries);
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
      throw new Error("Invalid address passed to usingProperty.at(): " + address);
    }

    var contract_class = this.web3.eth.contract(this.abi);
    var contract = contract_class.at(address);

    return new this(contract);
  };

  Contract.deployed = function() {
    if (!this.address) {
      throw new Error("Cannot find deployed address: usingProperty not deployed or address not set.");
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
        "constant": true,
        "inputs": [
          {
            "name": "p_Id",
            "type": "uint256"
          }
        ],
        "name": "getPartialProperty",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "p_Id",
            "type": "uint256"
          }
        ],
        "name": "getPropertyRatingLength",
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
            "name": "p_Id",
            "type": "uint256"
          }
        ],
        "name": "getPropertyTypeId",
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
            "name": "p_Id",
            "type": "uint256"
          }
        ],
        "name": "getProperty",
        "outputs": [
          {
            "name": "",
            "type": "bytes32"
          },
          {
            "name": "",
            "type": "uint256"
          },
          {
            "name": "",
            "type": "uint256"
          },
          {
            "name": "",
            "type": "uint256"
          },
          {
            "name": "",
            "type": "address"
          },
          {
            "name": "",
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
            "name": "u_Id",
            "type": "uint256"
          },
          {
            "name": "c_Id",
            "type": "uint256"
          },
          {
            "name": "cropId",
            "type": "uint256"
          },
          {
            "name": "landId",
            "type": "uint256"
          }
        ],
        "name": "updateUserLandConfiguration",
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
        "name": "propertyList",
        "outputs": [
          {
            "name": "name",
            "type": "bytes32"
          },
          {
            "name": "id",
            "type": "uint256"
          },
          {
            "name": "since",
            "type": "uint256"
          },
          {
            "name": "propertyCount",
            "type": "uint256"
          },
          {
            "name": "minUnit",
            "type": "uint256"
          },
          {
            "name": "owner",
            "type": "address"
          },
          {
            "name": "extraData",
            "type": "bytes32"
          },
          {
            "name": "propertyType",
            "type": "uint256"
          },
          {
            "name": "tradeable",
            "type": "uint256"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "getCongressAddr",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "p_id",
            "type": "uint256"
          },
          {
            "name": "cropStage",
            "type": "uint256"
          }
        ],
        "name": "getPropertyType_forMission",
        "outputs": [
          {
            "name": "",
            "type": "bytes32"
          },
          {
            "name": "",
            "type": "uint256"
          },
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
            "name": "p_Id",
            "type": "uint256"
          }
        ],
        "name": "getPropertyType",
        "outputs": [
          {
            "name": "",
            "type": "bytes32"
          },
          {
            "name": "",
            "type": "uint256"
          },
          {
            "name": "",
            "type": "uint256"
          },
          {
            "name": "",
            "type": "bytes32"
          },
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
        "inputs": [],
        "name": "getStakeholdersLength",
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
        "constant": false,
        "inputs": [
          {
            "name": "_name",
            "type": "bytes32"
          },
          {
            "name": "_propertyCount",
            "type": "uint256"
          },
          {
            "name": "_minUnit",
            "type": "uint256"
          },
          {
            "name": "_extraData",
            "type": "bytes32"
          },
          {
            "name": "_rating",
            "type": "uint256"
          },
          {
            "name": "_type",
            "type": "uint256"
          },
          {
            "name": "_tradeable",
            "type": "uint256"
          }
        ],
        "name": "addProperty",
        "outputs": [
          {
            "name": "_id",
            "type": "uint256"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_name",
            "type": "bytes32"
          },
          {
            "name": "_img",
            "type": "bytes32[]"
          },
          {
            "name": "_time",
            "type": "bytes32"
          },
          {
            "name": "_harvestUnit",
            "type": "uint256"
          }
        ],
        "name": "addPropertyType",
        "outputs": [],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "p_id",
            "type": "uint256"
          },
          {
            "name": "u_id",
            "type": "uint256"
          }
        ],
        "name": "getPropertyType",
        "outputs": [
          {
            "name": "",
            "type": "bytes32"
          },
          {
            "name": "",
            "type": "uint256"
          },
          {
            "name": "",
            "type": "uint256"
          },
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_id",
            "type": "uint256"
          },
          {
            "name": "_propertyCount",
            "type": "uint256"
          },
          {
            "name": "_tradeable",
            "type": "uint256"
          }
        ],
        "name": "updatePropertyCount",
        "outputs": [],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_id",
            "type": "uint256"
          },
          {
            "name": "rate",
            "type": "uint256"
          },
          {
            "name": "operation",
            "type": "string"
          }
        ],
        "name": "updatePropertyTypeRating",
        "outputs": [],
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
            "name": "p_Id",
            "type": "uint256"
          }
        ],
        "name": "addUserPropertyType",
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
        "name": "propertyTypeList",
        "outputs": [
          {
            "name": "name",
            "type": "bytes32"
          },
          {
            "name": "id",
            "type": "uint256"
          },
          {
            "name": "averageRating",
            "type": "uint256"
          },
          {
            "name": "time",
            "type": "bytes32"
          },
          {
            "name": "harvestUnit",
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
            "name": "p_Id",
            "type": "uint256"
          }
        ],
        "name": "getProperty_Shop",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          },
          {
            "name": "",
            "type": "bytes32"
          },
          {
            "name": "",
            "type": "address"
          },
          {
            "name": "",
            "type": "uint256"
          },
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_id",
            "type": "uint256"
          }
        ],
        "name": "removeProperty",
        "outputs": [],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "p_id",
            "type": "uint256"
          }
        ],
        "name": "getPropertyTypeRating",
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
        "inputs": [],
        "name": "getPropertyTypeLength",
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
        "constant": false,
        "inputs": [
          {
            "name": "u_Id",
            "type": "uint256"
          },
          {
            "name": "level",
            "type": "uint256"
          }
        ],
        "name": "updateUserPropertyType",
        "outputs": [],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "u_Id",
            "type": "uint256"
          }
        ],
        "name": "getUserLandConfiguration",
        "outputs": [
          {
            "name": "",
            "type": "uint256[]"
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
        "constant": true,
        "inputs": [
          {
            "name": "p_Id",
            "type": "uint256"
          },
          {
            "name": "s_Id",
            "type": "uint256"
          }
        ],
        "name": "getPropertyRating",
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
            "name": "p_Id",
            "type": "uint256"
          },
          {
            "name": "img_Id",
            "type": "uint256"
          }
        ],
        "name": "getPropertyTypeImg",
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
        "constant": false,
        "inputs": [
          {
            "name": "u_Id",
            "type": "uint256"
          }
        ],
        "name": "addUserLandConfiguration",
        "outputs": [],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
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
        "constant": true,
        "inputs": [
          {
            "name": "u_Id",
            "type": "uint256"
          }
        ],
        "name": "getUserPropertyType",
        "outputs": [
          {
            "name": "",
            "type": "uint256[]"
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
        "inputs": [
          {
            "name": "_congressAddress",
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
            "name": "",
            "type": "bytes32"
          }
        ],
        "name": "propertyAdded",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "",
            "type": "bool"
          }
        ],
        "name": "propertyTypeAdded",
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
        "name": "propertyUpdated",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [],
        "name": "updatedPropertiesCalled",
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
        "name": "propertyNewed",
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
        "name": "propertyInited",
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
        "name": "propertyRatinglength_testing",
        "type": "event"
      }
    ],
    "unlinked_binary": "0x6060604052604051602080611d5f833950608060405251600480546c01000000000000000000000000928302839004600160a060020a0319918216179182905560058054600160a060020a039093168402939093049116179055611cf8806100676000396000f3606060405236156101485760e060020a6000350463149449d3811461014d578063160117b81461018f57806317353dcd1461021b57806332665ffb14610253578063422e5c591461035957806351d2a3b2146103cc578063614138d91461043a57806364969cf3146104525780636712f55f146104f657806368dc61e0146105d05780636b59069a146106515780636f00645814610791578063801723bb146108265780638acc1a8b146108d75780638c8e6bc81461097a578063991b4d6e14610c63578063b597564514610cab578063bb7226af14610cf5578063bc43d06f14610df8578063c161f7bc14610e11578063c34eca9f14610ec3578063cbd0950814610ed3578063d0f2909514610f13578063de2aad3614610ffb578063e584a8bd1461106e578063eef3921f146110bf578063f1607bf514611105578063f4b41d4714611112575b610002565b34610002576111f26004356000600360005082815481101561000257906000526020600020906009020160005060050154600160a060020a031690505b919050565b346100025761120e60043560007f8abc202c428b4ff626ba799f83938a413393019d1edc1556b59141eeced8afa760016000508381548110156100025790600052602060002090600702016000506002015460408051918252519081900360200190a160018054839081101561000257906000526020600020906007020160005060020154905061018a565b346100025761120e6004356000600160005082815481101561000257906000526020600020906007020160005060010154905061018a565b346100025761122060043560006000600060006000600060036000508781548110156100025790600052602060002090600902016000505460038054899081101561000257906000526020600020906009020160005060020154600380548a908110156100025790600052602060002090600902016000506003016000505460036000508a815481101561000257906000526020600020906009020160005060040154600380548c908110156100025790600052602060002090600902016000506005015460038054600160a060020a03909216918d90811015610002576000918252602090912060066009909202010154949c939b5091995097509550909350915050565b346100025761125c600435602435604435606435600084815260208190526040902060020180548291908590811015610002579060005260206000209001600050556000848152602081905260409020600101805483919085908110156100025760009182526020909120015550505050565b346100025761125e600435600380548290811015610002579060005260206000209060090201600050805460018201546002830154600384015460048501546005860154600687015460078801546008909801549698509496939592949193600160a060020a039091169289565b34610002576111f2600454600160a060020a03165b90565b34610002576112ae60043560243560006000600060016000508581548110156100025790600052602060002090600702016000505460018054879081101561000257906000526020600020906007020160005060010160005054600160005087815481101561000257906000526020600020906007020160005060040180548790811015610002579060005260206000209001600050549250925092509250925092565b34610002576112cc6004356000600060006000600060016000508681548110156100025790600052602060002090600702016000505460018054889081101561000257906000526020600020906007020160005060010160005054600160005088815481101561000257906000526020600020906007020160005060030154600180548a9081101561000257906000526020600020906007020160005060050154600180548b9081101561000257906000526020600020906007020160005060060160005054945094509450945094505b91939590929450565b346100025761120e600554604080516000602091820181905282517f68dc61e000000000000000000000000000000000000000000000000000000000815292519093600160a060020a0316926368dc61e092600480830193919282900301818787803b156100025760325a03f11561000257505060405151915061044f9050565b346100025761120e60043560243560443560643560843560a43560c435600060018180805b6001548310156106ae57600180548490811015610002579060005260206000209060070201600050600101548714156113d557600093505b831561070857604080517f50726f70657274792054797065204e6f7420466f756e64000000000000000000815290517f6e98a67d07b1236151193da1b1a71c35ff356fb2dfcb683e46f63b6abf4becef9181900360200190a15b60038054600181018083559091908280158290116113e0576009028160090283600052602060002091820191016113e091905b808211156115aa57600080825560018201819055600282018190556003820181905560048201819055600582018054600160a060020a03191690556006820181905560078201819055600882015560090161073b565b346100025760408051602480356004818101356020818102868101820190975281865261125c968335969395604495019291829190850190849080828437509496505093359350506064359150506000600060006000600060006001600050805480919060010190908154818355818115116115ae576007028160070283600052602060002091820191016115ae9190611686565b34610002576112f7600435602435600060006000600060016000508681548110156100025790600052602060002090600702016000505460018054889081101561000257906000526020600020906007020160005060010160005054600160005088815481101561000257906000526020600020906007020160005060060154600180548a908110156100025760009182526020909120600360079092020101549299919850965090945092505050565b346100025761125c60043560243560443533600160a060020a0316600360005084815481101561000257906000526020600020906009020160005060050154600160a060020a03161415610148578160036000508481548110156100025790600052602060002090600902016000506003016000508190555080600360005084815481101561000257906000526020600020906009020160005060080155505050565b3461000257604080516020600460443581810135601f810184900484028501840190955284845261125c948235946024803595606494929391909201918190840183828082843750949650505050505050604051600090819081907fbe94f4bc9231183f4e52990fb4744cff4530314ce3425a3b0c4c281817b19557908290a173__StringUtils___________________________6346bdca9a856000604051602001526040518260e060020a0281526004018080602001806020018381038352848181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f168015610a8e5780820380516001836020036101000a031916815260200191505b50838103825260068152602001807f7570646174650000000000000000000000000000000000000000000000000000815260200150602001935050505060206040518083038186803b156100025760325a03f4156100025750506040515115905061195057600560009054906101000a9004600160a060020a0316600160a060020a03166368dc61e06000604051602001526040518160e060020a028152600401809050602060405180830381600087803b156100025760325a03f11561000257505060408051805160055460006020938401819052845160e260020a633834dc73028152600160a060020a0333811660048301529551600019909401995094909116945063e0d371cc936024808201949392918390030190829087803b156100025760325a03f115610002575050604051516001805491945087925090889081101561000257906000526020600020906007020160005060020180548490811015610002576000918252602090912001556001805484918791600019840191908a90811015610002579060005260206000209060070201600050600301540201811561000257046001600050878154811015610002579060005260206000209060070201600050600301555b505050505050565b346100025761125c60043560243560008281526002602052604090208054600181018083558281838015829011611ab957600083815260209020611ab99181019083016116d9565b34610002576112cc60043560018054829081101561000257906000526020600020906007020160005080546001820154600383015460058401546006909401549294509092909185565b346100025761131d6004356000600060006000600060036000508681548110156100025790600052602060002090600902016000506007015460038054600191908990811015610002579060005260206000209060090201600050600701548154811015610002579060005260206000209060070201600050546003805489908110156100025790600052602060002090600902016000506005015460038054600160a060020a03909216918a908110156100025790600052602060002090600902016000506003016000505460036000508a815481101561000257906000526020600020906009020160005060080160005054945094509450945094506105c7565b346100025761125c6004356000611b1e5b60035461044f565b346100025761120e6004356005546040805160006020918201819052825160e260020a633834dc7302815233600160a060020a039081166004830152935191948594169263e0d371cc9260248084019382900301818787803b156100025760325a03f11561000257505060405151600180549193509150849081101561000257906000526020600020906007020160005060020180548290811015610002576000918252602090912001549392505050565b346100025761120e60015461044f565b346100025761125c600435602435600082815260026020526040902060010180548290811015610002576000918252602090912001805460010190555050565b346100025761135060043560408051602081810183526000808352835180830185528181528582528183529084902060028101805486518186028101860190975280875294959294909360019092019291849190830182828015610f9757602002820191906000526020600020905b81548152600190910190602001808311610f82575b5050505050915080805480602002602001604051908101604052809291908181526020018280548015610fea57602002820191906000526020600020905b81548152600190910190602001808311610fd5575b50505050509050915091505b915091565b346100025761120e600435602435600380546000916001918590811015610002579060005260206000209060090201600050600701548154811015610002579060005260206000209060070201600050600201805483908110156100025760009182526020909120015490505b92915050565b346100025761120e6004356024356000600160005083815481101561000257906000526020600020906007020160005060040180548390811015610002576000918252602090912001549050611068565b346100025761125c6004356000818152602081905260408120805460018101808355909190828015829011611ca357600083815260209020611ca39181019083016116d9565b346100025761120e610e09565b34610002576113506004356040805160208181018352600080835283518083018552818152858252600283529084902080548551818502810185019096528086529394919390926001840192918491830182828015610f97576020028201919060005260206000209081548152600190910190602001808311610f82575b5050505050915080805480602002602001604051908101604052809291908181526020018280548015610fea576020028201919060005260206000209081548152600190910190602001808311610fd5575b5050505050905091509150610ff6565b60408051600160a060020a039092168252519081900360200190f35b60408051918252519081900360200190f35b604080519687526020870195909552858501939093526060850191909152600160a060020a0316608084015260a0830152519081900360c00190f35b005b60408051998a5260208a01989098528888019690965260608801949094526080870192909252600160a060020a031660a086015260c085015260e084015261010083015251908190036101200190f35b60408051938452602084019290925282820152519081900360600190f35b6040805195865260208601949094528484019290925260608401526080830152519081900360a00190f35b604080519485526020850193909352838301919091526060830152519081900360800190f35b604080519586526020860194909452600160a060020a039092168484015260608401526080830152519081900360a00190f35b6040518080602001806020018381038352858181518152602001915080519060200190602002808383829060006004602084601f0104600302600f01f1509050018381038252848181518152602001915080519060200190602002808383829060006004602084601f0104600302600f01f15090500194505050505060405180910390f35b600190920191610676565b50505094508450600560009054906101000a9004600160a060020a0316600160a060020a031663e0d371cc336000604051602001526040518260e060020a0281526004018082600160a060020a03168152602001915050602060405180830381600087803b156100025760325a03f1156100025750506040805180516005547f03b66f6300000000000000000000000000000000000000000000000000000000835260048301829052602483018a90529251909550600160a060020a0390921692506303b66f6391604480830192600092919082900301818387803b156100025760325a03f1156100025750505060036000508581548110156100025760009182526020918290206009909102018d815560018101879055600381018d9055426002820155600481018c9055600581018054600160a060020a0319166c0100000000000000000000000033810204179055600681018b90556007810189905560088101889055604080517f5375636365737300000000000000000000000000000000000000000000000000815290519193507f6e98a67d07b1236151193da1b1a71c35ff356fb2dfcb683e46f63b6abf4becef92908290030190a150505050979650505050505050565b5090565b5050509550600560009054906101000a9004600160a060020a0316600160a060020a03166368dc61e06000604051602001526040518160e060020a028152600401809050602060405180830381600087803b156100025760325a03f11561000257505060405151955060009450505b848410156116ed576001805487908110156100025790600052602060002090600702016000506002018054600181018083558281838015829011611750576000838152602090206117509181019083016116d9565b505060006005820181905560068201556007015b808211156115aa57600080825560018201819055600282018054828255908252602082206116b6918101906116d9565b506000600383018190556004830180548282559082526020909120611672918101905b808211156115aa57600081556001016116d9565b6001805487908110156100025790600052602060002090600702016000508a815560018082018890556000600383015560048201805491820180825592955091828183801582901161176b5760008381526020902061176b9181019083016116d9565b5050506000928352506020822001556001939093019261161d565b50505060009283525060209091207f5f736565640000000000000000000000000000000000000000000000000000009101556004830180546001810180835582818380158290116117cd576000838152602090206117cd9181019083016116d9565b50505060009283525060209091207f5f67726f7700000000000000000000000000000000000000000000000000000091015560048301805460018101808355828183801582901161182f5760008381526020902061182f9181019083016116d9565b50505060009283525060209091207f5f68617276657374000000000000000000000000000000000000000000000000910155600483018054600181018083558281838015829011611891576000838152602090206118919181019083016116d9565b5050506000928352506020822001819055600584018990558951925090505b8181101561190557600180548790811015610002579060005260206000209060070201600050600401805460018101808355828183801582901161191c5760008381526020902061191c9181019083016116d9565b505060058101959095555050506006909101555050565b5050509190906000526020600020900160008b848151811015610002576020908102909101015190915550506001016118b0565b73__StringUtils___________________________6346bdca9a856000604051602001526040518260e060020a0281526004018080602001806020018381038352848181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f1680156119e45780820380516001836020036101000a031916815260200191505b50838103825260038152602001807f6e65770000000000000000000000000000000000000000000000000000000000815260200150602001935050505060206040518083038186803b156100025760325a03f41561000257505060405151159050610c5b575060005b85811015610c5b576001805482908110156100025790600052602060002090600702016000506002018054600181018083558281838015829011611aa257600083815260209020611aa29181019083016116d9565b505050600092835250602082200155600101611a4d565b50505060009283525060208083209091018390558382526002905260409020600190810180549182018082559091908281838015829011611b0b57600083815260209020611b0b9181019083016116d9565b5050506000928352506020822001555050565b1515611b2957610002565b5060005b600354811015611c0357600380546001830190811015610002579060005260206000209060090201600050600380548390811015610002579060005260206000209060090201600050815481556001808301549082015560028083015490820155600380830154908201556004808301549082015560058083015490820180546c01000000000000000000000000600160a060020a03909316830292909204600160a060020a03199092169190911790556006808301549082015560078083015490820155600891820154910155600101611b2d565b6003805460001981019081101561000257906000526020600020906009020160005060008082556001820181905560028201819055600380830182905560048301829055600583018054600160a060020a0319169055600683018290556007830182905560089092015580546000198101808355909190828015829011610c5b57600902816009028360005260206000209182019101610c5b919061073b565b505050600083815260208190526040902080546001810180835592935090918281838015829011611ce557600083815260209020611ce59181019083016116d9565b505050600092835250602090912001555056",
    "events": {
      "0x6e98a67d07b1236151193da1b1a71c35ff356fb2dfcb683e46f63b6abf4becef": {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "",
            "type": "bytes32"
          }
        ],
        "name": "propertyAdded",
        "type": "event"
      },
      "0x3696e6175db6d8a89552b74242d83ee40aedbac30cfdbb4d75bba58cb643dba3": {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "",
            "type": "bool"
          }
        ],
        "name": "propertyTypeAdded",
        "type": "event"
      },
      "0x39877db6ea3194f11c06f9c3a3daeba6cd30831fda3e1b1284c717f1096a7e59": {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "propertyUpdated",
        "type": "event"
      },
      "0xbe94f4bc9231183f4e52990fb4744cff4530314ce3425a3b0c4c281817b19557": {
        "anonymous": false,
        "inputs": [],
        "name": "updatedPropertiesCalled",
        "type": "event"
      },
      "0x7f445f8451d59b7fae7dd57068653ebc377ea74d534142248da8203e8df9bf8c": {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "propertyNewed",
        "type": "event"
      },
      "0xb20022e2964d49349bc52b92123fe9879854efc705410aa8a69fac302e1f4546": {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "propertyInited",
        "type": "event"
      },
      "0x8abc202c428b4ff626ba799f83938a413393019d1edc1556b59141eeced8afa7": {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "propertyRatinglength_testing",
        "type": "event"
      }
    },
    "updated_at": 1492937143159
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

  Contract.contract_name   = Contract.prototype.contract_name   = "usingProperty";
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
    window.usingProperty = Contract;
  }
})();

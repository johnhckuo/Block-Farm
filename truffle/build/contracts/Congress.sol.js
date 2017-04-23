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
      throw new Error("Congress error: Please call setProvider() first before calling new().");
    }

    var args = Array.prototype.slice.call(arguments);

    if (!this.unlinked_binary) {
      throw new Error("Congress error: contract binary not set. Can't deploy new instance.");
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

      throw new Error("Congress contains unresolved libraries. You must deploy and link the following libraries before you can deploy a new version of Congress: " + unlinked_libraries);
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
      throw new Error("Invalid address passed to Congress.at(): " + address);
    }

    var contract_class = this.web3.eth.contract(this.abi);
    var contract = contract_class.at(address);

    return new this(contract);
  };

  Contract.deployed = function() {
    if (!this.address) {
      throw new Error("Cannot find deployed address: Congress not deployed or address not set.");
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
            "name": "_id",
            "type": "uint256"
          },
          {
            "name": "p_Id",
            "type": "uint256"
          }
        ],
        "name": "addProperty",
        "outputs": [],
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
        "constant": true,
        "inputs": [
          {
            "name": "s_Id",
            "type": "uint256"
          },
          {
            "name": "index",
            "type": "uint256"
          }
        ],
        "name": "getPropertyId",
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
            "name": "s_Id",
            "type": "uint256"
          }
        ],
        "name": "getStakeholder",
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
            "name": "",
            "type": "address"
          }
        ],
        "name": "stakeholderId",
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
            "name": "s_Id",
            "type": "uint256"
          }
        ],
        "name": "getStakeholderPropertyCount",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "type": "function"
      }
    ],
    "unlinked_binary": "0x6060604052604051608080611bc8833960e06040529051905160a05160c051600080546c0100000000000000000000000033810204600160a060020a0319909116179055606184848460005433600160a060020a0390811691161460a5576002565b600160a060020a0381161560935760008054600160a060020a0319166c01000000000000000000000000838102041790555b50505050611acf806100f96000396000f35b600183905560028290556003819055604080518481526020810184905280820183905290517fa439d3fa452be5e0e1e24a8145e715f4fd8b9c08c96a42fd82a855a85e5d57de9181900360600190a150505056606060405236156101485760e060020a6000350463013cf08b811461018e57806303b66f63146101fd5780630a98c24c1461028057806310a42391146102b95780631207af5c1461031d5780631d6b8b7214610354578063237e9492146103b5578063400e3949146104e157806368dc61e0146104ef57806369bd34361461050a57806376f703d5146105185780638160f0b5146105695780638da5cb5b146105775780638f4ffcb11461058e578063aa02a90f1461066a578063b1050da514610678578063bcb0c2d71461072f578063bcca1fd314610756578063c985162914610782578063d3c0715b1461089e578063df20356e14610915578063df9cd8cb14610977578063e0d371cc14610a00578063ec935ada14610a1d578063eceb294514610aa6578063edbd1ce614610b89578063f2fde38b14610bc1578063f46bba8d14610be7575b6040805133600160a060020a031681523460208201528151610c2d927fa398b89ba344a0b23a0b9de53db298b2a1a868b396c1878b7e9dcbafecd49b13928290030190a1565b3461000257610c2f6004356004805482908110156100025790600052602060002090600a02016000508054600182015460038301546004840154600585015460068601546007870154600160a060020a039096169750939560020194929360ff80841694610100909404169289565b3461000257610c2d6004356024356008805483908110156100025790600052602060002090600b0201600050600901805460010190556008805483908110156100025790600052602060002090600b0201600050600a018054600181018083558281838015829011610df657600083815260209020610df6918101908301610e23565b34610002576104f8600435600060076000508281548110156100025790600052602060002090600702016000506006015490505b919050565b3461000257610d066004356008805482908110156100025790600052602060002090600b0201600050805460018201546002830154600384015460048501546005860154600687015460078801546009909801549698509496939592949193909289565b3461000257610c2d6004356024358060086000508381548110156100025790600052602060002090600b0201600050600601555050565b3461000257610d4d600435600780548290811015610002579060005260206000209060070201600050805460018201546002830154600384015460048501546005860154600690960154949650929491939092600160a060020a0316919087565b346100025760408051602060046024803582810135601f8101859004850286018501909652858552610c2d9583359593946044949392909201918190840183828082843750949650505050505050600060046000508381548110156100025790600052602060002090600a0201600050600381015490915042108061043e5750600481015460ff165b806104c757508060000160009054906101000a9004600160a060020a03168160010160005054836040518084600160a060020a0316606060020a0281526014018381526020018280519060200190808383829060006004602084601f0104600302600f01f150905001935050505060405180910390206000191681600701600050546000191614155b806104d757506001546005820154105b15610e3b57610002565b34610002576104f860055481565b34610002576007545b60408051918252519081900360200190f35b34610002576104f860025481565b34610002576104f8600435602435600060086000508381548110156100025790600052602060002090600b0201600050600a0180548390811015610002576000918252602090912001549392505050565b34610002576104f860015481565b3461000257610d8e600054600160a060020a031681565b3461000257604080516020600460643581810135601f8101849004840285018401909552848452610c2d9482359460248035956044359594608494920191908190840183828082843750949650505050505050600082905080600160a060020a03166323b872dd8630876000604051602001526040518460e060020a0281526004018084600160a060020a0316815260200183600160a060020a031681526020018281526020019350505050602060405180830381600087803b156100025760325a03f1156100025750506040515115159050610f7957610002565b34610002576104f860035481565b3461000257604080516020600460443581810135601f81018490048402850184019095528484526104f8948235946024803595606494929391909201918190840183828082843750506040805160209735808a0135601f81018a90048a0283018a019093528282529698976084979196506024919091019450909250829150840183828082843750949650505050505050600160a060020a0333166000908152600660205260408120548190151561103957610002565b3461000257610c2d6004356000805433600160a060020a039081169116146113d757610002565b3461000257610c2d60043560243560443560005433600160a060020a039081169116146115ad57610002565b3461000257610daa600435600060006000600060006000600060086000508881548110156100025790600052602060002090600b020160005054600880548a908110156100025790600052602060002090600b020160005060020154600880548b908110156100025790600052602060002090600b020160005060030154600880548c908110156100025790600052602060002090600b020160005060010154600880548d908110156100025790600052602060002090600b020160005060040154600880548e908110156100025790600052602060002090600b020160005060050154600880548f9081101561000257600091825260209091206006600b909202010154959e949d50929b5090995097509550909350915050565b3461000257604080516020600460443581810135601f81018490048402850184019095528484526104f8948235946024803595606494929391909201918190840183828082843750949650505050505050600160a060020a0333166000908152600660205260408120548190151561160157610002565b3461000257610c2d6004356024358060086000508381548110156100025790600052602060002090600b0201600050600201556008805482919084908110156100025790600052602060002090600b0201600050600301805490910190555050565b3461000257610c2d6004356024356044356064358260086000508581548110156100025790600052602060002090600b0201600050600401556008805483919086908110156100025790600052602060002090600b0201600050600501556008805482919086908110156100025790600052602060002090600b02016000506002015550505050565b34610002576104f860043560066020526000908152604090205481565b3461000257610c2d600435602435604435600160a060020a0333908116600090815260066020526040812054909190829015156117635760078054600160a060020a0384166000908152600660205260409020819055600181018083559091908280158290116117ed576007028160070283600052602060002091820191016117ed919061155d565b3461000257604080516020600460643581810135601f8101849004840285018401909552848452610de294823594602480359560443595946084949201919081908401838280828437509496505050505050506000600060046000508681548110156100025790600052602060002090600a020160005090508484846040518084600160a060020a0316606060020a0281526014018381526020018280519060200190808383829060006004602084601f0104600302600f01f15090500193505050506040518091039020600019168160070160005054600019161491506111f2565b34610002576104f8600435600060086000508281548110156100025790600052602060002090600b02016000506009015490506102b4565b3461000257610c2d60043560005433600160a060020a0390811691161461191957610002565b3461000257610c2d60043560243560088054600181018083556000929082801582901161193857600b0281600b0283600052602060002091820191016119389190611a4e565b005b60408051600160a060020a038b168152602081018a905260608101889052861515608082015285151560a082015260c0810185905260e081018490526101008082018490526101209282018381528a546002600182161590930260001901169190910492820183905290916101408301908a908015610cef5780601f10610cc457610100808354040283529160200191610cef565b820191906000526020600020905b815481529060010190602001808311610cd257829003601f168201915b50509a505050505050505050505060405180910390f35b60408051998a5260208a0198909852888801969096526060880194909452608087019290925260a086015260c085015260e084015261010083015251908190036101200190f35b604080519788526020880196909652868601949094526060860192909252600160a060020a0316608085015260a084015260c0830152519081900360e00190f35b60408051600160a060020a039092168252519081900360200190f35b604080519788526020880196909652868601949094526060860192909252608085015260a084015260c0830152519081900360e00190f35b604080519115158252519081900360200190f35b5050506000928352506020909120015550565b601f0160209004906000526020600020908101906112e691905b80821115610e375760008155600101610e23565b5090565b60035460068201541315610ef05760048181018054600160ff1990911681179091558254908301546040518551600160a060020a0390931693670de0b6b3a764000090920292869282916020808601928291859183918691600091601f850104600302600f01f150905090810190601f168015610ecc5780820380516001836020036101000a031916815260200191505b5091505060006040518083038185876185025a03f1925050501515610f6357610002565b60048101805461ff00191690555b6006810154600582015460048301546040805187815260208101949094528381019290925260ff6101009091041615156060830152517fd220b7272a8b6d0d7d6bcdace67b936a8f175e6d5c1b3ee438b72256b32ab3af9181900360800190a1505050565b60048101805461ff001916610100179055610efe565b7f0eeb71b8926d7ed8f47a2cedf6b9b204e2001344c7fa20c696c9f06ea7c413c6858585856040518085600160a060020a0316815260200184815260200183600160a060020a03168152602001806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f1680156110225780820380516001836020036101000a031916815260200191505b509550505050505060405180910390a15050505050565b60048054600181018083559091908280158290116111fb57600a0281600a0283600052602060002091820191016111fb91906112a2565b50508585846040518084600160a060020a0316606060020a0281526014018381526020018280519060200190808383829060006004602084601f0104600302600f01f150905001935050505060405180910390208160070160005081905550600260005054603c024201816003016000508190555060008160040160006101000a81548160ff021916908360f860020a90810204021790555060008160040160016101000a81548160ff021916908360f860020a908102040217905550600081600501600050819055507f646fec02522b41e7125cfc859a64fd4f4cefd5dc3b6237ca0abe251ded1fa881828787876040518085815260200184600160a060020a03168152602001838152602001806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f1680156111da5780820380516001836020036101000a031916815260200191505b509550505050505060405180910390a1600182016005555b50949350505050565b505060048054929450918491508110156100025790600052602060002090600a02016000508054606060020a80890204600160a060020a0319909116178155600180820187905585516002808401805460008281526020908190209697509195601f958216156101000260001901909116929092048401819004820193908901908390106113a757805160ff19168380011785555b50611070929150610e23565b5050600a015b80821115610e37578054600160a060020a03191681556000600180830182905560028084018054848255909281161561010002600019011604601f819010610e0957505b5060006003830181905560048301805461ffff19169055600583018190556006830181905560078301819055600883018054828255908252602090912061129c916002028101905b80821115610e3757805474ffffffffffffffffffffffffffffffffffffffffff1916815560018082018054600080835592600260001991831615610100029190910190911604601f81901061138957505b505060020161132e565b601f01602090049060005260206000209081019061137f9190610e23565b82800160010185558215611290579182015b828111156112905782518260005055916020019190600101906113b9565b600160a060020a03821660009081526006602052604090205415156113fb57610002565b50600160a060020a0381166000908152600660205260409020545b600754600019018110156114d357600780546001830190811015610002579060005260206000209060070201600050600780548390811015610002579060005260206000209060070201600050815481556001808301549082015560028083015490820155600380830154908201556004808301549082018054606060020a600160a060020a03909316830292909204600160a060020a031990921691909117905560058083015490820155600691820154910155600101611416565b6007805460001981019081101561000257600091825260208220600791820201828155600181018390556002810183905560038101839055600481018054600160a060020a03191690556005810183905560060191909155805460001981018083559091908280158290116115a5576007028160070283600052602060002091820191016115a591905b80821115610e37576000808255600182018190556002820181905560038201819055600482018054600160a060020a031916905560058201819055600682015560070161155d565b505050505050565b600183905560028290556003819055604080518481526020810184905280820183905290517fa439d3fa452be5e0e1e24a8145e715f4fd8b9c08c96a42fd82a855a85e5d57de9181900360600190a1505050565b6004805486908110156100025790600052602060002090600a0201600050600160a060020a033316600090815260098201602052604090205490915060ff1615156001141561164f57610002565b600160a060020a03331660009081526009820160205260409020805460ff19166001908117909155600582018054909101905583156116985760068101805460010190556116a5565b6006810180546000190190555b7fc34f869b7ff431b034b7b9aea9822dac189a685e0b015c7d1be3add3f89128e88585338660405180858152602001841515815260200183600160a060020a03168152602001806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f1680156117475780820380516001836020036101000a031916815260200191505b509550505050505060405180910390a160050154949350505050565b600160a060020a0382166000908152600660205260409020546007805491945090849081101561000257906000526020600020906007020160005090505b60408051600160a060020a03841681526001602082015281517f27b022af4a8347100c7a041ce5ccf8e14d644ff05de696315196faae8cd50c9b929181900390910190a1505050505050565b50505092508250856007600050848154811015610002579060005260206000209060070201600050556007805486919085908110156100025790600052602060002090600702016000506001015560078054849190829081101561000257906000526020600020906007020160005060020155600780548591908590811015610002579060005260206000209060070201600050600301556007805433919085908110156100025790600052602060002090600702016000506004018054606060020a92830292909204600160a060020a03199092169190911790556007805442919085908110156100025790600052602060002090600702016000506005015560078054600091908590811015610002579060005260206000209060070201600050600601556117a1565b60008054606060020a80840204600160a060020a031990911617905550565b50505090508260086000508281548110156100025790600052602060002090600b0201600050556008805483919083908110156100025790600052602060002090600b020160005060010155600880546000919083908110156100025790600052602060002090600b020160005060020155600880546000919083908110156100025790600052602060002090600b02016000506003908101919091556008805483908110156100025790600052602060002090600b020160005060040155600880546000919083908110156100025790600052602060002090600b020160005060050155600880546064919083908110156100025790600052602060002090600b020160005060060155505050565b5050600b015b80821115610e375760008082556001820181905560028201819055600382018190556004820181905560058201819055600682018190556007820181905560088201805482825590825260208220611aa891810190610e23565b50600060098301819055600a830180548282559082526020909120611a4891810190610e2356",
    "events": {},
    "updated_at": 1492937143146
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

  Contract.contract_name   = Contract.prototype.contract_name   = "Congress";
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
    window.Congress = Contract;
  }
})();

var fs = require("fs");
var path = require("path");

module.exports = function(contents, file, options, process, callback) {

  fs.readdir(options.contracts_build_directory, function(err, files) {
    if (err) return callback(err);

    var promises = files.map(function(file_path) {
      return new Promise(function(accept, reject) {
        fs.readFile(path.join(options.contracts_build_directory, file_path), "utf8", function(err, body) {
          if (err) return reject(err);

          try {
            body = JSON.parse(body);
          } catch (e) {
            return reject(e);
          }

          accept(body);
        });
      });
    });

    Promise.all(promises).then(function(contracts_json) {
      var contract_names = contracts_json.map(function(contract) {return contract.contract_name;});

      var dev_network = options.networks.development || {
        host: "localhost",
        port: 8545
      };

      var host = dev_network.host || "localhost";
      var port = dev_network.port || 8545;

      // Note: __contracts__ is provided by include_contracts.js

      contents = "\
//// TRUFFLE BOOTSTRAP                                          \n\n\
Object.keys(__contracts__).forEach(function(contract_name) {    \n\n\
  window[contract_name] = TruffleContract(__contracts__[contract_name]); \n\n\
});                                                             \n\n\
window.addEventListener('load', function() {                    \n\n\
                                                                \n\n\
  // Supports Mist, and other wallets that provide 'web3'.      \n\n\
  if (typeof web3 !== 'undefined') {                            \n\n\
    // Use the Mist/wallet provider.                            \n\n\
    window.web3 = new Web3(web3.currentProvider);               \n\n\
  } else {                                                      \n\n\
    // Use the provider from the config.                        \n\n\
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://" + host + ":" + port + "')); \n\n\
  }                                                             \n\n\
                                                                \n\n\
  [" + contract_names + "].forEach(function(contract) {         \n\n\
    contract.setProvider(window.web3.currentProvider);          \n\n\
  });                                                           \n\n\
});                                                              \n\n\
//// END TRUFFLE BOOTSTRAP                                      \n\n\ " + contents;

      callback(null, contents);
    }).catch(callback);
  });
};

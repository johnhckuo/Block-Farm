var path = require("path");
var temp = require("temp").track();
var browserify = require('browserify');
var async = require("async");
var fs = require("fs");

var digest = function(source_directory, callback) {
  var self = this;

  fs.readdir(source_directory, function(err, files) {
    if (err) return callback(err);

    var promises = files.map(function(file_path) {
      return new Promise(function(accept, reject) {
        fs.readFile(path.join(source_directory, file_path), "utf8", function(err, body) {
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
      var digest = "window.__contracts__ = {\n"

      contracts_json.forEach(function(json, index) {
        digest += "  \"" + json.contract_name + "\": " + JSON.stringify(json, null, 2);

        if (index != contracts_json.length - 1) {
          digest += ",";
        }

        digest += "\n";
      });

      digest += "};"

      callback(null, digest);
    }).catch(callback);
  });
};

module.exports = function(contents, file, options, process, callback) {
  digest(options.contracts_build_directory, function(err, source) {
    if (err) return callback(err);

    callback(null, source.toString() + "\n\n" + contents);
  });
};

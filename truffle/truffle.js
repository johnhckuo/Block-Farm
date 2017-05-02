var DefaultBuilder = require("truffle-default-builder");

module.exports = {
  build: new DefaultBuilder({
    "index.html": "index.html",
    "jquery-3.1.1.min.js": [
      "javascripts/jquery-3.1.1.min.js"
    ],
    "bootstrap.min.js": [
      "javascripts/bootstrap.min.js"
    ],
    "app.css": [
      "stylesheets/app.css"
    ],
    "bootstrap.css": [
      "stylesheets/bootstrap.css"
    ],
    "app.js": [
      "javascripts/app.js"
    ],

  }),
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id

    }
  }
};

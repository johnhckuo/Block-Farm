//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
// Source maps are supported by all recent versions of Chrome, Safari,  //
// and Firefox, and by Internet Explorer 11.                            //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var _ = Package.underscore._;
var meteorInstall = Package['modules-runtime'].meteorInstall;

/* Package-scope variables */
var Buffer, process;

var require = meteorInstall({"node_modules":{"meteor":{"modules":{"client.js":["./install-packages.js","./stubs.js","./buffer.js","./process.js","reify/lib/runtime","./css",function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/modules/client.js                                                                                 //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
require("./install-packages.js");                                                                             // 1
require("./stubs.js");                                                                                        // 2
require("./buffer.js");                                                                                       // 3
require("./process.js");                                                                                      // 4
require("reify/lib/runtime").enable(module.constructor);                                                      // 5
                                                                                                              // 6
exports.addStyles = require("./css").addStyles;                                                               // 7
                                                                                                              // 8
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"buffer.js":["buffer",function(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/modules/buffer.js                                                                                 //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
try {                                                                                                         // 1
  Buffer = global.Buffer || require("buffer").Buffer;                                                         // 2
} catch (noBuffer) {}                                                                                         // 3
                                                                                                              // 4
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"css.js":function(require,exports){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/modules/css.js                                                                                    //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
var doc = document;                                                                                           // 1
var head = doc.getElementsByTagName("head").item(0);                                                          // 2
                                                                                                              // 3
exports.addStyles = function (css) {                                                                          // 4
  var style = doc.createElement("style");                                                                     // 5
                                                                                                              // 6
  style.setAttribute("type", "text/css");                                                                     // 7
                                                                                                              // 8
  // https://msdn.microsoft.com/en-us/library/ms535871(v=vs.85).aspx                                          // 9
  var internetExplorerSheetObject =                                                                           // 10
    style.sheet || // Edge/IE11.                                                                              // 11
    style.styleSheet; // Older IEs.                                                                           // 12
                                                                                                              // 13
  if (internetExplorerSheetObject) {                                                                          // 14
    internetExplorerSheetObject.cssText = css;                                                                // 15
  } else {                                                                                                    // 16
    style.appendChild(doc.createTextNode(css));                                                               // 17
  }                                                                                                           // 18
                                                                                                              // 19
  return head.appendChild(style);                                                                             // 20
};                                                                                                            // 21
                                                                                                              // 22
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"install-packages.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/modules/install-packages.js                                                                       //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
function install(name, mainModule) {                                                                          // 1
  var meteorDir = {};                                                                                         // 2
                                                                                                              // 3
  // Given a package name <name>, install a stub module in the                                                // 4
  // /node_modules/meteor directory called <name>.js, so that                                                 // 5
  // require.resolve("meteor/<name>") will always return                                                      // 6
  // /node_modules/meteor/<name>.js instead of something like                                                 // 7
  // /node_modules/meteor/<name>/index.js, in the rare but possible event                                     // 8
  // that the package contains a file called index.js (#6590).                                                // 9
                                                                                                              // 10
  if (mainModule) {                                                                                           // 11
    meteorDir[name + ".js"] = [mainModule, function (require, e, module) {                                    // 12
      module.exports = require(mainModule);                                                                   // 13
    }];                                                                                                       // 14
  } else {                                                                                                    // 15
    // back compat with old Meteor packages                                                                   // 16
    meteorDir[name + ".js"] = function (r, e, module) {                                                       // 17
      module.exports = Package[name];                                                                         // 18
    };                                                                                                        // 19
  }                                                                                                           // 20
                                                                                                              // 21
  meteorInstall({                                                                                             // 22
    node_modules: {                                                                                           // 23
      meteor: meteorDir                                                                                       // 24
    }                                                                                                         // 25
  });                                                                                                         // 26
}                                                                                                             // 27
                                                                                                              // 28
// This file will be modified during computeJsOutputFilesMap to include                                       // 29
// install(<name>) calls for every Meteor package.                                                            // 30
                                                                                                              // 31
install("underscore");                                                                                        // 32
install("meteor");                                                                                            // 33
install("meteor-base");                                                                                       // 34
install("mobile-experience");                                                                                 // 35
install("modules-runtime");                                                                                   // 36
install("modules", "meteor/modules/client.js");                                                               // 37
install("es5-shim", "meteor/es5-shim/client.js");                                                             // 38
install("promise", "meteor/promise/client.js");                                                               // 39
install("ecmascript-runtime", "meteor/ecmascript-runtime/runtime.js");                                        // 40
install("babel-compiler");                                                                                    // 41
install("ecmascript");                                                                                        // 42
install("base64");                                                                                            // 43
install("ejson");                                                                                             // 44
install("id-map");                                                                                            // 45
install("ordered-dict");                                                                                      // 46
install("tracker");                                                                                           // 47
install("babel-runtime", "meteor/babel-runtime/babel-runtime.js");                                            // 48
install("random");                                                                                            // 49
install("mongo-id");                                                                                          // 50
install("diff-sequence");                                                                                     // 51
install("geojson-utils", "meteor/geojson-utils/main.js");                                                     // 52
install("minimongo");                                                                                         // 53
install("check", "meteor/check/match.js");                                                                    // 54
install("retry");                                                                                             // 55
install("ddp-common");                                                                                        // 56
install("reload");                                                                                            // 57
install("ddp-client");                                                                                        // 58
install("ddp");                                                                                               // 59
install("ddp-server");                                                                                        // 60
install("allow-deny");                                                                                        // 61
install("insecure");                                                                                          // 62
install("mongo");                                                                                             // 63
install("blaze-html-templates");                                                                              // 64
install("reactive-var");                                                                                      // 65
install("jquery", "meteor/jquery/main.js");                                                                   // 66
install("standard-minifier-css");                                                                             // 67
install("standard-minifier-js");                                                                              // 68
install("shell-server");                                                                                      // 69
install("autopublish");                                                                                       // 70
install("ethereum:web3");                                                                                     // 71
install("shcherbin:flexbox-grid");                                                                            // 72
install("twbs:bootstrap");                                                                                    // 73
install("natestrauser:jquery-scrollto");                                                                      // 74
install("deps");                                                                                              // 75
install("observe-sequence");                                                                                  // 76
install("htmljs");                                                                                            // 77
install("blaze");                                                                                             // 78
install("ui");                                                                                                // 79
install("spacebars");                                                                                         // 80
install("templating-compiler");                                                                               // 81
install("templating-runtime");                                                                                // 82
install("templating");                                                                                        // 83
install("iron:core");                                                                                         // 84
install("iron:dynamic-template");                                                                             // 85
install("iron:layout");                                                                                       // 86
install("iron:url");                                                                                          // 87
install("iron:middleware-stack");                                                                             // 88
install("iron:location");                                                                                     // 89
install("reactive-dict");                                                                                     // 90
install("iron:controller");                                                                                   // 91
install("iron:router");                                                                                       // 92
install("lawshe:full-page");                                                                                  // 93
install("d3js:d3");                                                                                           // 94
install("session");                                                                                           // 95
install("webapp");                                                                                            // 96
install("livedata");                                                                                          // 97
install("hot-code-push");                                                                                     // 98
install("launch-screen");                                                                                     // 99
install("autoupdate");                                                                                        // 100
                                                                                                              // 101
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"process.js":["process",function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/modules/process.js                                                                                //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
try {                                                                                                         // 1
  // The application can run `npm install process` to provide its own                                         // 2
  // process stub; otherwise this module will provide a partial stub.                                         // 3
  process = global.process || require("process");                                                             // 4
} catch (noProcess) {                                                                                         // 5
  process = {};                                                                                               // 6
}                                                                                                             // 7
                                                                                                              // 8
if (Meteor.isServer) {                                                                                        // 9
  // Make require("process") work on the server in all versions of Node.                                      // 10
  meteorInstall({                                                                                             // 11
    node_modules: {                                                                                           // 12
      "process.js": function (r, e, module) {                                                                 // 13
        module.exports = process;                                                                             // 14
      }                                                                                                       // 15
    }                                                                                                         // 16
  });                                                                                                         // 17
} else {                                                                                                      // 18
  process.platform = "browser";                                                                               // 19
  process.nextTick = process.nextTick || Meteor._setImmediate;                                                // 20
}                                                                                                             // 21
                                                                                                              // 22
if (typeof process.env !== "object") {                                                                        // 23
  process.env = {};                                                                                           // 24
}                                                                                                             // 25
                                                                                                              // 26
_.extend(process.env, meteorEnv);                                                                             // 27
                                                                                                              // 28
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"stubs.js":["meteor-node-stubs",function(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/modules/stubs.js                                                                                  //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
try {                                                                                                         // 1
  // When meteor-node-stubs is installed in the application's root                                            // 2
  // node_modules directory, requiring it here installs aliases for stubs                                     // 3
  // for all Node built-in modules, such as fs, util, and http.                                               // 4
  require("meteor-node-stubs");                                                                               // 5
} catch (noStubs) {}                                                                                          // 6
                                                                                                              // 7
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"node_modules":{"reify":{"lib":{"runtime.js":["./entry.js","./utils.js",function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// node_modules/meteor/modules/node_modules/reify/lib/runtime.js                                              //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
var Entry = require("./entry.js").Entry;                                                                      // 1
var utils = require("./utils.js");                                                                            // 2
                                                                                                              // 3
exports.enable = function (Module) {                                                                          // 4
  var Mp = Module.prototype;                                                                                  // 5
                                                                                                              // 6
  if (typeof Mp.import === "function" &&                                                                      // 7
      typeof Mp.export === "function") {                                                                      // 8
    // If the Mp.{import,export} methods have already been                                                    // 9
    // defined, abandon reification immediately.                                                              // 10
    return Module;                                                                                            // 11
  }                                                                                                           // 12
                                                                                                              // 13
  // Platform-specific code should implement this method however                                              // 14
  // appropriate. Module.prototype.resolve(id) should return an absolute                                      // 15
  // version of the given module identifier, like require.resolve.                                            // 16
  Mp.resolve = Mp.resolve || function resolve(id) {                                                           // 17
    throw new Error("Module.prototype.resolve not implemented");                                              // 18
  };                                                                                                          // 19
                                                                                                              // 20
  // Platform-specific code should find a way to call this method whenever                                    // 21
  // the module system is about to return module.exports from require. This                                   // 22
  // might happen more than once per module, in case of dependency cycles,                                    // 23
  // so we want Module.prototype.runModuleSetters to run each time.                                           // 24
  Mp.runModuleSetters = function runModuleSetters(valueToPassThrough) {                                       // 25
    var entry = Entry.get(this.id);                                                                           // 26
    if (entry) {                                                                                              // 27
      entry.runModuleSetters(this);                                                                           // 28
    }                                                                                                         // 29
                                                                                                              // 30
    // Assignments to exported local variables get wrapped with calls to                                      // 31
    // module.runModuleSetters, so module.runModuleSetters returns the                                        // 32
    // valueToPassThrough parameter to allow the value of the original                                        // 33
    // expression to pass through. For example,                                                               // 34
    //                                                                                                        // 35
    //   export var a = 1;                                                                                    // 36
    //   console.log(a += 3);                                                                                 // 37
    //                                                                                                        // 38
    // becomes                                                                                                // 39
    //                                                                                                        // 40
    //   module.export("a", () => a);                                                                         // 41
    //   var a = 1;                                                                                           // 42
    //   console.log(module.runModuleSetters(a += 3));                                                        // 43
    //                                                                                                        // 44
    // This ensures module.runModuleSetters runs immediately after the                                        // 45
    // assignment, and does not interfere with the larger computation.                                        // 46
    return valueToPassThrough;                                                                                // 47
  };                                                                                                          // 48
                                                                                                              // 49
  function setESModule(module) {                                                                              // 50
    var exports = module.exports;                                                                             // 51
    if (exports && typeof exports === "object") {                                                             // 52
      exports.__esModule = true;                                                                              // 53
    }                                                                                                         // 54
  }                                                                                                           // 55
                                                                                                              // 56
  Mp.import = function (id, setters) {                                                                        // 57
    var module = this;                                                                                        // 58
    setESModule(module);                                                                                      // 59
                                                                                                              // 60
    var absoluteId = module.resolve(id);                                                                      // 61
                                                                                                              // 62
    if (setters && typeof setters === "object") {                                                             // 63
      var entry = Entry.getOrCreate(absoluteId);                                                              // 64
      entry.addSetters(module, setters);                                                                      // 65
    }                                                                                                         // 66
                                                                                                              // 67
    var countBefore = entry && entry.runCount;                                                                // 68
    var exports = typeof module.require === "function"                                                        // 69
      ? module.require(absoluteId)                                                                            // 70
      : require(absoluteId);                                                                                  // 71
                                                                                                              // 72
    if (entry && entry.runCount === countBefore) {                                                            // 73
      // If require(absoluteId) didn't run any setters for this entry,                                        // 74
      // perhaps because it's not the first time this module has been                                         // 75
      // required, run the setters now using an object that passes as the                                     // 76
      // real module object.                                                                                  // 77
      entry.runModuleSetters({                                                                                // 78
        id: absoluteId,                                                                                       // 79
        exports: exports,                                                                                     // 80
        getExportByName: Mp.getExportByName                                                                   // 81
      });                                                                                                     // 82
    }                                                                                                         // 83
  };                                                                                                          // 84
                                                                                                              // 85
  // Register getter functions for local variables in the scope of an                                         // 86
  // export statement. The keys of the getters object are exported names,                                     // 87
  // and the values are functions that return local values.                                                   // 88
  Mp.export = function (getters) {                                                                            // 89
    var module = this;                                                                                        // 90
    setESModule(module);                                                                                      // 91
                                                                                                              // 92
    if (utils.isPlainObject(getters)) {                                                                       // 93
      Entry.getOrCreate(module.id).addGetters(getters);                                                       // 94
    }                                                                                                         // 95
                                                                                                              // 96
    if (module.loaded) {                                                                                      // 97
      // If the module has already been evaluated, then we need to trigger                                    // 98
      // another round of entry.runModuleSetters calls, which begins by                                       // 99
      // calling entry.runModuleGetters(module).                                                              // 100
      module.runModuleSetters();                                                                              // 101
    }                                                                                                         // 102
  };                                                                                                          // 103
                                                                                                              // 104
  // This method can be overridden by client code to implement custom export                                  // 105
  // naming logic. The current implementation works well with Babel's                                         // 106
  // __esModule convention.                                                                                   // 107
  Mp.getExportByName = function (name) {                                                                      // 108
    var exports = this.exports;                                                                               // 109
                                                                                                              // 110
    if (name === "*") {                                                                                       // 111
      return exports;                                                                                         // 112
    }                                                                                                         // 113
                                                                                                              // 114
    if (name === "default" &&                                                                                 // 115
        ! (exports &&                                                                                         // 116
           typeof exports === "object" &&                                                                     // 117
           exports.__esModule &&                                                                              // 118
           "default" in exports)) {                                                                           // 119
      return exports;                                                                                         // 120
    }                                                                                                         // 121
                                                                                                              // 122
    return exports && exports[name];                                                                          // 123
  };                                                                                                          // 124
                                                                                                              // 125
  return Module;                                                                                              // 126
};                                                                                                            // 127
                                                                                                              // 128
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"entry.js":["./utils.js",function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// node_modules/meteor/modules/node_modules/reify/lib/entry.js                                                //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
var hasOwn = Object.prototype.hasOwnProperty;                                                                 // 1
var entryMap = Object.create(null);                                                                           // 2
var utils = require("./utils.js");                                                                            // 3
                                                                                                              // 4
function Entry(id) {                                                                                          // 5
  // Same as module.id for this module.                                                                       // 6
  this.id = id;                                                                                               // 7
  // The number of times this.runModuleSetters has been called.                                               // 8
  this.runCount = 0;                                                                                          // 9
  // Setters for assigning to local variables in parent modules.                                              // 10
  this.setters = Object.create(null);                                                                         // 11
  // Getters for local variables exported from this module.                                                   // 12
  this.getters = Object.create(null);                                                                         // 13
}                                                                                                             // 14
                                                                                                              // 15
var Ep = Entry.prototype;                                                                                     // 16
                                                                                                              // 17
Entry.get = function (id) {                                                                                   // 18
  return entryMap[id] || null;                                                                                // 19
};                                                                                                            // 20
                                                                                                              // 21
Entry.getOrCreate = function (id) {                                                                           // 22
  return entryMap[id] = entryMap[id] || new Entry(id);                                                        // 23
};                                                                                                            // 24
                                                                                                              // 25
Ep.addSetters = function (parent, setters) {                                                                  // 26
  var entry = this;                                                                                           // 27
                                                                                                              // 28
  Object.keys(setters).forEach(function (name) {                                                              // 29
    var setter = setters[name];                                                                               // 30
    if (typeof setter === "function" &&                                                                       // 31
        // Ignore any requests for the exports.__esModule property."                                          // 32
        name !== "__esModule") {                                                                              // 33
      setter.parent = parent;                                                                                 // 34
      (entry.setters[name] =                                                                                  // 35
       entry.setters[name] || []                                                                              // 36
      ).push(setter);                                                                                         // 37
    }                                                                                                         // 38
  });                                                                                                         // 39
};                                                                                                            // 40
                                                                                                              // 41
Ep.addGetters = function (getters) {                                                                          // 42
  var entry = this;                                                                                           // 43
  Object.keys(getters).forEach(function (name) {                                                              // 44
    var getter = getters[name];                                                                               // 45
    if (typeof getter === "function" &&                                                                       // 46
        // Ignore any requests for the exports.__esModule property."                                          // 47
        name !== "__esModule") {                                                                              // 48
      // Should this throw if hasOwn.call(this.getters, name)?                                                // 49
      entry.getters[name] = getter;                                                                           // 50
    }                                                                                                         // 51
  });                                                                                                         // 52
};                                                                                                            // 53
                                                                                                              // 54
function runModuleSetters(module) {                                                                           // 55
  var entry = entryMap[module.id];                                                                            // 56
  if (entry) {                                                                                                // 57
    entry.runModuleSetters(module);                                                                           // 58
  }                                                                                                           // 59
}                                                                                                             // 60
                                                                                                              // 61
function runModuleGetters(module) {                                                                           // 62
  var entry = entryMap[module.id];                                                                            // 63
  return entry ? entry.runModuleGetters(module) : 0;                                                          // 64
}                                                                                                             // 65
                                                                                                              // 66
Ep.runModuleGetters = function (module) {                                                                     // 67
  var entry = this;                                                                                           // 68
  var changeCount = 0;                                                                                        // 69
                                                                                                              // 70
  Object.keys(entry.getters).forEach(function (name) {                                                        // 71
    if (entry.runGetter(module, name)) {                                                                      // 72
      ++changeCount;                                                                                          // 73
    }                                                                                                         // 74
  });                                                                                                         // 75
                                                                                                              // 76
  return changeCount;                                                                                         // 77
};                                                                                                            // 78
                                                                                                              // 79
// Returns true iff the getter updated module.exports with a new value.                                       // 80
Ep.runGetter = function (module, name) {                                                                      // 81
  if (! hasOwn.call(this.getters, name)) {                                                                    // 82
    return false;                                                                                             // 83
  }                                                                                                           // 84
                                                                                                              // 85
  var getter = this.getters[name];                                                                            // 86
  try {                                                                                                       // 87
    var value = getter.call(module);                                                                          // 88
  } catch (e) {}                                                                                              // 89
  var exports = module.exports;                                                                               // 90
                                                                                                              // 91
  if (! hasOwn.call(exports, name) ||                                                                         // 92
      exports[name] !== value) {                                                                              // 93
    // We update module.exports[name] with the current value so that                                          // 94
    // CommonJS require calls remain consistent with module.import.                                           // 95
    exports[name] = value;                                                                                    // 96
    return true;                                                                                              // 97
  }                                                                                                           // 98
                                                                                                              // 99
  return false;                                                                                               // 100
};                                                                                                            // 101
                                                                                                              // 102
// Called whenever module.exports might have changed, to trigger any                                          // 103
// setters associated with the newly exported values.                                                         // 104
Ep.runModuleSetters = function (module) {                                                                     // 105
  var entry = this;                                                                                           // 106
  var names = Object.keys(entry.setters);                                                                     // 107
                                                                                                              // 108
  // Make sure module.exports is up to date before we call                                                    // 109
  // module.getExportByName(name).                                                                            // 110
  entry.runModuleGetters(module);                                                                             // 111
                                                                                                              // 112
  // Invoke the given callback once for every (setter, value, name) triple                                    // 113
  // that needs to be called. Note that forEachSetter does not call any                                       // 114
  // setters itself, only the given callback.                                                                 // 115
  function forEachSetter(callback, context) {                                                                 // 116
    names.forEach(function (name) {                                                                           // 117
      entry.setters[name].forEach(function (setter) {                                                         // 118
        var value = module.getExportByName(name);                                                             // 119
        if (name === "*") {                                                                                   // 120
          Object.keys(value).forEach(function (name) {                                                        // 121
            call(setter, value[name], name);                                                                  // 122
          });                                                                                                 // 123
        } else {                                                                                              // 124
          call(setter, value, name);                                                                          // 125
        }                                                                                                     // 126
      });                                                                                                     // 127
    });                                                                                                       // 128
                                                                                                              // 129
    function call(setter, value, name) {                                                                      // 130
      if (name === "__esModule") {                                                                            // 131
        // Ignore setters asking for module.exports.__esModule.                                               // 132
        return;                                                                                               // 133
      }                                                                                                       // 134
                                                                                                              // 135
      setter.last = setter.last || Object.create(null);                                                       // 136
                                                                                                              // 137
      if (! hasOwn.call(setter.last, name) ||                                                                 // 138
          setter.last[name] !== value) {                                                                      // 139
        // Only invoke the callback if we have not called this setter                                         // 140
        // (with a value of this name) before, or the current value is                                        // 141
        // different from the last value we passed to this setter.                                            // 142
        return callback.apply(context, arguments);                                                            // 143
      }                                                                                                       // 144
    }                                                                                                         // 145
  }                                                                                                           // 146
                                                                                                              // 147
  // Every three elements of this list form a (setter, value, name) triple                                    // 148
  // that needs to be invoked.                                                                                // 149
  var settersToCall = [];                                                                                     // 150
                                                                                                              // 151
  // Lazily-initialized objects mapping parent module identifiers to                                          // 152
  // relevant parent module objects and snapshots of their exports.                                           // 153
  var relevantParents;                                                                                        // 154
  var parentSnapshots;                                                                                        // 155
                                                                                                              // 156
  // Take snapshots of setter.parent.exports for any setters that we are                                      // 157
  // planning to call, so that we can later determine if calling the                                          // 158
  // setters modified any of those exports objects.                                                           // 159
  forEachSetter(function (setter, value, name) {                                                              // 160
    var parent = setter.parent;                                                                               // 161
    parentSnapshots = parentSnapshots || Object.create(null);                                                 // 162
    if (! hasOwn.call(parentSnapshots, parent.id)) {                                                          // 163
      relevantParents = relevantParents || Object.create(null);                                               // 164
      relevantParents[parent.id] = parent;                                                                    // 165
      if (utils.isPlainObject(parent.exports)) {                                                              // 166
        // If parent.exports is an object, make a shallow clone of it so                                      // 167
        // that we can see if it changes as a result of calling setters.                                      // 168
        parentSnapshots[parent.id] = utils.assign({}, parent.exports);                                        // 169
      } else {                                                                                                // 170
        // If parent.exports is not an object, the "snapshot" is just the                                     // 171
        // value of parent.exports.                                                                           // 172
        parentSnapshots[parent.id] = parent.exports;                                                          // 173
      }                                                                                                       // 174
    }                                                                                                         // 175
                                                                                                              // 176
    // Push three elements at a time to avoid creating wrapper arrays for                                     // 177
    // each (setter, value, name) triple. Note the i += 3 below.                                              // 178
    settersToCall.push(setter, value, name);                                                                  // 179
  });                                                                                                         // 180
                                                                                                              // 181
  // Now call all the setters that we decided we need to call.                                                // 182
  for (var i = 0; i < settersToCall.length; i += 3) {                                                         // 183
    var setter = settersToCall[i];                                                                            // 184
    var value = settersToCall[i + 1];                                                                         // 185
    var name = settersToCall[i + 2];                                                                          // 186
    setter.call(module, setter.last[name] = value, name);                                                     // 187
  }                                                                                                           // 188
                                                                                                              // 189
  ++entry.runCount;                                                                                           // 190
                                                                                                              // 191
  if (! relevantParents) {                                                                                    // 192
    // If we never called takeSnapshot, then we can avoid checking                                            // 193
    // relevantParents and parentSnapshots below.                                                             // 194
    return;                                                                                                   // 195
  }                                                                                                           // 196
                                                                                                              // 197
  // If any of the setters updated the module.exports of a parent module,                                     // 198
  // or updated local variables that are exported by that parent module,                                      // 199
  // then we must re-run any setters registered by that parent module.                                        // 200
  Object.keys(relevantParents).forEach(function (id) {                                                        // 201
    var parent = relevantParents[id];                                                                         // 202
                                                                                                              // 203
    if (runModuleGetters(parent) > 0) {                                                                       // 204
      return runModuleSetters(parent);                                                                        // 205
    }                                                                                                         // 206
                                                                                                              // 207
    var exports = parent.exports;                                                                             // 208
    var snapshot = parentSnapshots[parent.id];                                                                // 209
    if (utils.shallowObjEqual(exports, snapshot)) {                                                           // 210
      // If parent.exports have not changed since we took the snapshot,                                       // 211
      // then we do not need to run the parent's setters.                                                     // 212
      return;                                                                                                 // 213
    }                                                                                                         // 214
                                                                                                              // 215
    runModuleSetters(parent);                                                                                 // 216
  });                                                                                                         // 217
};                                                                                                            // 218
                                                                                                              // 219
exports.Entry = Entry;                                                                                        // 220
                                                                                                              // 221
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"utils.js":function(require,exports){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// node_modules/meteor/modules/node_modules/reify/lib/utils.js                                                //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
var hasOwn = Object.prototype.hasOwnProperty;                                                                 // 1
var objToStr = Object.prototype.toString;                                                                     // 2
var objStr = objToStr.call({});                                                                               // 3
                                                                                                              // 4
function isPlainObject(value) {                                                                               // 5
  return objToStr.call(value) === objStr;                                                                     // 6
}                                                                                                             // 7
exports.isPlainObject = isPlainObject;                                                                        // 8
                                                                                                              // 9
exports.assign = Object.assign || function (obj) {                                                            // 10
  var argc = arguments.length;                                                                                // 11
  for (var i = 1; i < argc; ++i) {                                                                            // 12
    var arg = arguments[i];                                                                                   // 13
    if (arg && typeof arg === "object") {                                                                     // 14
      var keys = Object.keys(arg);                                                                            // 15
      for (var k = 0; k < keys.length; ++k) {                                                                 // 16
        var key = keys[k];                                                                                    // 17
        obj[key] = arg[key];                                                                                  // 18
      }                                                                                                       // 19
    }                                                                                                         // 20
  }                                                                                                           // 21
  return obj;                                                                                                 // 22
};                                                                                                            // 23
                                                                                                              // 24
exports.shallowObjEqual = function(a, b) {                                                                    // 25
  if (a === b) {                                                                                              // 26
    return true;                                                                                              // 27
  }                                                                                                           // 28
                                                                                                              // 29
  if (! isPlainObject(a) ||                                                                                   // 30
      ! isPlainObject(b)) {                                                                                   // 31
    return false;                                                                                             // 32
  }                                                                                                           // 33
                                                                                                              // 34
  var aKeys = Object.keys(a);                                                                                 // 35
  var bKeys = Object.keys(b);                                                                                 // 36
                                                                                                              // 37
  if (aKeys.length !== bKeys.length) {                                                                        // 38
    return false;                                                                                             // 39
  }                                                                                                           // 40
                                                                                                              // 41
  return aKeys.every(function (key) {                                                                         // 42
    return hasOwn.call(b, key) &&                                                                             // 43
      a[key] === b[key];                                                                                      // 44
  });                                                                                                         // 45
};                                                                                                            // 46
                                                                                                              // 47
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},"meteor-node-stubs":{"package.json":function(require,exports){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// node_modules/meteor-node-stubs/package.json                                                                //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
exports.name = "meteor-node-stubs";                                                                           // 1
exports.version = "0.2.5";                                                                                    // 2
exports.main = "index.js";                                                                                    // 3
                                                                                                              // 4
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":["./map.json",function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// node_modules/meteor-node-stubs/index.js                                                                    //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
var map = require("./map.json");                                                                              // 1
var meteorAliases = {};                                                                                       // 2
                                                                                                              // 3
Object.keys(map).forEach(function (id) {                                                                      // 4
  if (typeof map[id] === "string") {                                                                          // 5
    var aliasParts = module.id.split("/");                                                                    // 6
    aliasParts.pop();                                                                                         // 7
    aliasParts.push("node_modules", map[id]);                                                                 // 8
    exports[id] = meteorAliases[id + ".js"] =                                                                 // 9
      aliasParts.join("/");                                                                                   // 10
  } else {                                                                                                    // 11
    exports[id] = map[id];                                                                                    // 12
    meteorAliases[id + ".js"] = function(){};                                                                 // 13
  }                                                                                                           // 14
});                                                                                                           // 15
                                                                                                              // 16
if (typeof meteorInstall === "function") {                                                                    // 17
  meteorInstall({                                                                                             // 18
    // Install the aliases into a node_modules directory one level up from                                    // 19
    // the root directory, so that they do not clutter the namespace                                          // 20
    // available to apps and packages.                                                                        // 21
    "..": {                                                                                                   // 22
      node_modules: meteorAliases                                                                             // 23
    }                                                                                                         // 24
  });                                                                                                         // 25
}                                                                                                             // 26
                                                                                                              // 27
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"map.json":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// node_modules/meteor-node-stubs/map.json                                                                    //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
module.exports = {                                                                                            // 1
  "assert": "assert/",                                                                                        // 2
  "buffer": "buffer/",                                                                                        // 3
  "child_process": null,                                                                                      // 4
  "cluster": null,                                                                                            // 5
  "console": "console-browserify",                                                                            // 6
  "constants": "constants-browserify",                                                                        // 7
  "crypto": "crypto-browserify",                                                                              // 8
  "dgram": null,                                                                                              // 9
  "dns": null,                                                                                                // 10
  "domain": "domain-browser",                                                                                 // 11
  "events": "events/",                                                                                        // 12
  "fs": null,                                                                                                 // 13
  "http": "http-browserify",                                                                                  // 14
  "https": "https-browserify",                                                                                // 15
  "module": null,                                                                                             // 16
  "net": null,                                                                                                // 17
  "os": "os-browserify/browser.js",                                                                           // 18
  "path": "path-browserify",                                                                                  // 19
  "process": "process/browser.js",                                                                            // 20
  "punycode": "punycode/",                                                                                    // 21
  "querystring": "querystring-es3/",                                                                          // 22
  "readline": null,                                                                                           // 23
  "repl": null,                                                                                               // 24
  "stream": "stream-browserify",                                                                              // 25
  "_stream_duplex": "readable-stream/duplex.js",                                                              // 26
  "_stream_passthrough": "readable-stream/passthrough.js",                                                    // 27
  "_stream_readable": "readable-stream/readable.js",                                                          // 28
  "_stream_transform": "readable-stream/transform.js",                                                        // 29
  "_stream_writable": "readable-stream/writable.js",                                                          // 30
  "string_decoder": "string_decoder/",                                                                        // 31
  "sys": "util/util.js",                                                                                      // 32
  "timers": "timers-browserify",                                                                              // 33
  "tls": null,                                                                                                // 34
  "tty": "tty-browserify",                                                                                    // 35
  "url": "url/",                                                                                              // 36
  "util": "util/util.js",                                                                                     // 37
  "vm": "vm-browserify",                                                                                      // 38
  "zlib": "browserify-zlib"                                                                                   // 39
};                                                                                                            // 40
                                                                                                              // 41
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"deps":{"buffer.js":["buffer/",function(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// node_modules/meteor-node-stubs/deps/buffer.js                                                              //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
require("buffer/");                                                                                           // 1
                                                                                                              // 2
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"process.js":["process/browser.js",function(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// node_modules/meteor-node-stubs/deps/process.js                                                             //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
require("process/browser.js");                                                                                // 1
                                                                                                              // 2
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"domain.js":["domain-browser",function(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// node_modules/meteor-node-stubs/deps/domain.js                                                              //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
require("domain-browser");                                                                                    // 1
                                                                                                              // 2
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]},"node_modules":{"buffer":{"package.json":function(require,exports){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// node_modules/meteor-node-stubs/node_modules/buffer/package.json                                            //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
exports.name = "buffer";                                                                                      // 1
exports.version = "4.9.1";                                                                                    // 2
exports.main = "index.js";                                                                                    // 3
                                                                                                              // 4
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":["base64-js","ieee754","isarray",function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// node_modules/meteor-node-stubs/node_modules/buffer/index.js                                                //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
/*!                                                                                                           // 1
 * The buffer module from node.js, for the browser.                                                           // 2
 *                                                                                                            // 3
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>                                      // 4
 * @license  MIT                                                                                              // 5
 */                                                                                                           // 6
/* eslint-disable no-proto */                                                                                 // 7
                                                                                                              // 8
'use strict'                                                                                                  // 9
                                                                                                              // 10
var base64 = require('base64-js')                                                                             // 11
var ieee754 = require('ieee754')                                                                              // 12
var isArray = require('isarray')                                                                              // 13
                                                                                                              // 14
exports.Buffer = Buffer                                                                                       // 15
exports.SlowBuffer = SlowBuffer                                                                               // 16
exports.INSPECT_MAX_BYTES = 50                                                                                // 17
                                                                                                              // 18
/**                                                                                                           // 19
 * If `Buffer.TYPED_ARRAY_SUPPORT`:                                                                           // 20
 *   === true    Use Uint8Array implementation (fastest)                                                      // 21
 *   === false   Use Object implementation (most compatible, even IE6)                                        // 22
 *                                                                                                            // 23
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,                         // 24
 * Opera 11.6+, iOS 4.2+.                                                                                     // 25
 *                                                                                                            // 26
 * Due to various browser bugs, sometimes the Object implementation will be used even                         // 27
 * when the browser supports typed arrays.                                                                    // 28
 *                                                                                                            // 29
 * Note:                                                                                                      // 30
 *                                                                                                            // 31
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,                        // 32
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.                                              // 33
 *                                                                                                            // 34
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.                                   // 35
 *                                                                                                            // 36
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of                     // 37
 *     incorrect length in some situations.                                                                   // 38
                                                                                                              // 39
 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they                     // 40
 * get the Object implementation, which is slower but behaves correctly.                                      // 41
 */                                                                                                           // 42
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined                                         // 43
  ? global.TYPED_ARRAY_SUPPORT                                                                                // 44
  : typedArraySupport()                                                                                       // 45
                                                                                                              // 46
/*                                                                                                            // 47
 * Export kMaxLength after typed array support is determined.                                                 // 48
 */                                                                                                           // 49
exports.kMaxLength = kMaxLength()                                                                             // 50
                                                                                                              // 51
function typedArraySupport () {                                                                               // 52
  try {                                                                                                       // 53
    var arr = new Uint8Array(1)                                                                               // 54
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}                         // 55
    return arr.foo() === 42 && // typed array instances can be augmented                                      // 56
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`                                  // 57
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`                                     // 58
  } catch (e) {                                                                                               // 59
    return false                                                                                              // 60
  }                                                                                                           // 61
}                                                                                                             // 62
                                                                                                              // 63
function kMaxLength () {                                                                                      // 64
  return Buffer.TYPED_ARRAY_SUPPORT                                                                           // 65
    ? 0x7fffffff                                                                                              // 66
    : 0x3fffffff                                                                                              // 67
}                                                                                                             // 68
                                                                                                              // 69
function createBuffer (that, length) {                                                                        // 70
  if (kMaxLength() < length) {                                                                                // 71
    throw new RangeError('Invalid typed array length')                                                        // 72
  }                                                                                                           // 73
  if (Buffer.TYPED_ARRAY_SUPPORT) {                                                                           // 74
    // Return an augmented `Uint8Array` instance, for best performance                                        // 75
    that = new Uint8Array(length)                                                                             // 76
    that.__proto__ = Buffer.prototype                                                                         // 77
  } else {                                                                                                    // 78
    // Fallback: Return an object instance of the Buffer class                                                // 79
    if (that === null) {                                                                                      // 80
      that = new Buffer(length)                                                                               // 81
    }                                                                                                         // 82
    that.length = length                                                                                      // 83
  }                                                                                                           // 84
                                                                                                              // 85
  return that                                                                                                 // 86
}                                                                                                             // 87
                                                                                                              // 88
/**                                                                                                           // 89
 * The Buffer constructor returns instances of `Uint8Array` that have their                                   // 90
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of                            // 91
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods                            // 92
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it                              // 93
 * returns a single octet.                                                                                    // 94
 *                                                                                                            // 95
 * The `Uint8Array` prototype remains unmodified.                                                             // 96
 */                                                                                                           // 97
                                                                                                              // 98
function Buffer (arg, encodingOrOffset, length) {                                                             // 99
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {                                             // 100
    return new Buffer(arg, encodingOrOffset, length)                                                          // 101
  }                                                                                                           // 102
                                                                                                              // 103
  // Common case.                                                                                             // 104
  if (typeof arg === 'number') {                                                                              // 105
    if (typeof encodingOrOffset === 'string') {                                                               // 106
      throw new Error(                                                                                        // 107
        'If encoding is specified then the first argument must be a string'                                   // 108
      )                                                                                                       // 109
    }                                                                                                         // 110
    return allocUnsafe(this, arg)                                                                             // 111
  }                                                                                                           // 112
  return from(this, arg, encodingOrOffset, length)                                                            // 113
}                                                                                                             // 114
                                                                                                              // 115
Buffer.poolSize = 8192 // not used by this implementation                                                     // 116
                                                                                                              // 117
// TODO: Legacy, not needed anymore. Remove in next major version.                                            // 118
Buffer._augment = function (arr) {                                                                            // 119
  arr.__proto__ = Buffer.prototype                                                                            // 120
  return arr                                                                                                  // 121
}                                                                                                             // 122
                                                                                                              // 123
function from (that, value, encodingOrOffset, length) {                                                       // 124
  if (typeof value === 'number') {                                                                            // 125
    throw new TypeError('"value" argument must not be a number')                                              // 126
  }                                                                                                           // 127
                                                                                                              // 128
  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {                                   // 129
    return fromArrayBuffer(that, value, encodingOrOffset, length)                                             // 130
  }                                                                                                           // 131
                                                                                                              // 132
  if (typeof value === 'string') {                                                                            // 133
    return fromString(that, value, encodingOrOffset)                                                          // 134
  }                                                                                                           // 135
                                                                                                              // 136
  return fromObject(that, value)                                                                              // 137
}                                                                                                             // 138
                                                                                                              // 139
/**                                                                                                           // 140
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError                                    // 141
 * if value is a number.                                                                                      // 142
 * Buffer.from(str[, encoding])                                                                               // 143
 * Buffer.from(array)                                                                                         // 144
 * Buffer.from(buffer)                                                                                        // 145
 * Buffer.from(arrayBuffer[, byteOffset[, length]])                                                           // 146
 **/                                                                                                          // 147
Buffer.from = function (value, encodingOrOffset, length) {                                                    // 148
  return from(null, value, encodingOrOffset, length)                                                          // 149
}                                                                                                             // 150
                                                                                                              // 151
if (Buffer.TYPED_ARRAY_SUPPORT) {                                                                             // 152
  Buffer.prototype.__proto__ = Uint8Array.prototype                                                           // 153
  Buffer.__proto__ = Uint8Array                                                                               // 154
  if (typeof Symbol !== 'undefined' && Symbol.species &&                                                      // 155
      Buffer[Symbol.species] === Buffer) {                                                                    // 156
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97                                // 157
    Object.defineProperty(Buffer, Symbol.species, {                                                           // 158
      value: null,                                                                                            // 159
      configurable: true                                                                                      // 160
    })                                                                                                        // 161
  }                                                                                                           // 162
}                                                                                                             // 163
                                                                                                              // 164
function assertSize (size) {                                                                                  // 165
  if (typeof size !== 'number') {                                                                             // 166
    throw new TypeError('"size" argument must be a number')                                                   // 167
  } else if (size < 0) {                                                                                      // 168
    throw new RangeError('"size" argument must not be negative')                                              // 169
  }                                                                                                           // 170
}                                                                                                             // 171
                                                                                                              // 172
function alloc (that, size, fill, encoding) {                                                                 // 173
  assertSize(size)                                                                                            // 174
  if (size <= 0) {                                                                                            // 175
    return createBuffer(that, size)                                                                           // 176
  }                                                                                                           // 177
  if (fill !== undefined) {                                                                                   // 178
    // Only pay attention to encoding if it's a string. This                                                  // 179
    // prevents accidentally sending in a number that would                                                   // 180
    // be interpretted as a start offset.                                                                     // 181
    return typeof encoding === 'string'                                                                       // 182
      ? createBuffer(that, size).fill(fill, encoding)                                                         // 183
      : createBuffer(that, size).fill(fill)                                                                   // 184
  }                                                                                                           // 185
  return createBuffer(that, size)                                                                             // 186
}                                                                                                             // 187
                                                                                                              // 188
/**                                                                                                           // 189
 * Creates a new filled Buffer instance.                                                                      // 190
 * alloc(size[, fill[, encoding]])                                                                            // 191
 **/                                                                                                          // 192
Buffer.alloc = function (size, fill, encoding) {                                                              // 193
  return alloc(null, size, fill, encoding)                                                                    // 194
}                                                                                                             // 195
                                                                                                              // 196
function allocUnsafe (that, size) {                                                                           // 197
  assertSize(size)                                                                                            // 198
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)                                                 // 199
  if (!Buffer.TYPED_ARRAY_SUPPORT) {                                                                          // 200
    for (var i = 0; i < size; ++i) {                                                                          // 201
      that[i] = 0                                                                                             // 202
    }                                                                                                         // 203
  }                                                                                                           // 204
  return that                                                                                                 // 205
}                                                                                                             // 206
                                                                                                              // 207
/**                                                                                                           // 208
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.                           // 209
 * */                                                                                                         // 210
Buffer.allocUnsafe = function (size) {                                                                        // 211
  return allocUnsafe(null, size)                                                                              // 212
}                                                                                                             // 213
/**                                                                                                           // 214
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.                       // 215
 */                                                                                                           // 216
Buffer.allocUnsafeSlow = function (size) {                                                                    // 217
  return allocUnsafe(null, size)                                                                              // 218
}                                                                                                             // 219
                                                                                                              // 220
function fromString (that, string, encoding) {                                                                // 221
  if (typeof encoding !== 'string' || encoding === '') {                                                      // 222
    encoding = 'utf8'                                                                                         // 223
  }                                                                                                           // 224
                                                                                                              // 225
  if (!Buffer.isEncoding(encoding)) {                                                                         // 226
    throw new TypeError('"encoding" must be a valid string encoding')                                         // 227
  }                                                                                                           // 228
                                                                                                              // 229
  var length = byteLength(string, encoding) | 0                                                               // 230
  that = createBuffer(that, length)                                                                           // 231
                                                                                                              // 232
  var actual = that.write(string, encoding)                                                                   // 233
                                                                                                              // 234
  if (actual !== length) {                                                                                    // 235
    // Writing a hex string, for example, that contains invalid characters will                               // 236
    // cause everything after the first invalid character to be ignored. (e.g.                                // 237
    // 'abxxcd' will be treated as 'ab')                                                                      // 238
    that = that.slice(0, actual)                                                                              // 239
  }                                                                                                           // 240
                                                                                                              // 241
  return that                                                                                                 // 242
}                                                                                                             // 243
                                                                                                              // 244
function fromArrayLike (that, array) {                                                                        // 245
  var length = array.length < 0 ? 0 : checked(array.length) | 0                                               // 246
  that = createBuffer(that, length)                                                                           // 247
  for (var i = 0; i < length; i += 1) {                                                                       // 248
    that[i] = array[i] & 255                                                                                  // 249
  }                                                                                                           // 250
  return that                                                                                                 // 251
}                                                                                                             // 252
                                                                                                              // 253
function fromArrayBuffer (that, array, byteOffset, length) {                                                  // 254
  array.byteLength // this throws if `array` is not a valid ArrayBuffer                                       // 255
                                                                                                              // 256
  if (byteOffset < 0 || array.byteLength < byteOffset) {                                                      // 257
    throw new RangeError('\'offset\' is out of bounds')                                                       // 258
  }                                                                                                           // 259
                                                                                                              // 260
  if (array.byteLength < byteOffset + (length || 0)) {                                                        // 261
    throw new RangeError('\'length\' is out of bounds')                                                       // 262
  }                                                                                                           // 263
                                                                                                              // 264
  if (byteOffset === undefined && length === undefined) {                                                     // 265
    array = new Uint8Array(array)                                                                             // 266
  } else if (length === undefined) {                                                                          // 267
    array = new Uint8Array(array, byteOffset)                                                                 // 268
  } else {                                                                                                    // 269
    array = new Uint8Array(array, byteOffset, length)                                                         // 270
  }                                                                                                           // 271
                                                                                                              // 272
  if (Buffer.TYPED_ARRAY_SUPPORT) {                                                                           // 273
    // Return an augmented `Uint8Array` instance, for best performance                                        // 274
    that = array                                                                                              // 275
    that.__proto__ = Buffer.prototype                                                                         // 276
  } else {                                                                                                    // 277
    // Fallback: Return an object instance of the Buffer class                                                // 278
    that = fromArrayLike(that, array)                                                                         // 279
  }                                                                                                           // 280
  return that                                                                                                 // 281
}                                                                                                             // 282
                                                                                                              // 283
function fromObject (that, obj) {                                                                             // 284
  if (Buffer.isBuffer(obj)) {                                                                                 // 285
    var len = checked(obj.length) | 0                                                                         // 286
    that = createBuffer(that, len)                                                                            // 287
                                                                                                              // 288
    if (that.length === 0) {                                                                                  // 289
      return that                                                                                             // 290
    }                                                                                                         // 291
                                                                                                              // 292
    obj.copy(that, 0, 0, len)                                                                                 // 293
    return that                                                                                               // 294
  }                                                                                                           // 295
                                                                                                              // 296
  if (obj) {                                                                                                  // 297
    if ((typeof ArrayBuffer !== 'undefined' &&                                                                // 298
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {                                              // 299
      if (typeof obj.length !== 'number' || isnan(obj.length)) {                                              // 300
        return createBuffer(that, 0)                                                                          // 301
      }                                                                                                       // 302
      return fromArrayLike(that, obj)                                                                         // 303
    }                                                                                                         // 304
                                                                                                              // 305
    if (obj.type === 'Buffer' && isArray(obj.data)) {                                                         // 306
      return fromArrayLike(that, obj.data)                                                                    // 307
    }                                                                                                         // 308
  }                                                                                                           // 309
                                                                                                              // 310
  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')   // 311
}                                                                                                             // 312
                                                                                                              // 313
function checked (length) {                                                                                   // 314
  // Note: cannot use `length < kMaxLength()` here because that fails when                                    // 315
  // length is NaN (which is otherwise coerced to zero.)                                                      // 316
  if (length >= kMaxLength()) {                                                                               // 317
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +                                  // 318
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')                                   // 319
  }                                                                                                           // 320
  return length | 0                                                                                           // 321
}                                                                                                             // 322
                                                                                                              // 323
function SlowBuffer (length) {                                                                                // 324
  if (+length != length) { // eslint-disable-line eqeqeq                                                      // 325
    length = 0                                                                                                // 326
  }                                                                                                           // 327
  return Buffer.alloc(+length)                                                                                // 328
}                                                                                                             // 329
                                                                                                              // 330
Buffer.isBuffer = function isBuffer (b) {                                                                     // 331
  return !!(b != null && b._isBuffer)                                                                         // 332
}                                                                                                             // 333
                                                                                                              // 334
Buffer.compare = function compare (a, b) {                                                                    // 335
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {                                                           // 336
    throw new TypeError('Arguments must be Buffers')                                                          // 337
  }                                                                                                           // 338
                                                                                                              // 339
  if (a === b) return 0                                                                                       // 340
                                                                                                              // 341
  var x = a.length                                                                                            // 342
  var y = b.length                                                                                            // 343
                                                                                                              // 344
  for (var i = 0, len = Math.min(x, y); i < len; ++i) {                                                       // 345
    if (a[i] !== b[i]) {                                                                                      // 346
      x = a[i]                                                                                                // 347
      y = b[i]                                                                                                // 348
      break                                                                                                   // 349
    }                                                                                                         // 350
  }                                                                                                           // 351
                                                                                                              // 352
  if (x < y) return -1                                                                                        // 353
  if (y < x) return 1                                                                                         // 354
  return 0                                                                                                    // 355
}                                                                                                             // 356
                                                                                                              // 357
Buffer.isEncoding = function isEncoding (encoding) {                                                          // 358
  switch (String(encoding).toLowerCase()) {                                                                   // 359
    case 'hex':                                                                                               // 360
    case 'utf8':                                                                                              // 361
    case 'utf-8':                                                                                             // 362
    case 'ascii':                                                                                             // 363
    case 'latin1':                                                                                            // 364
    case 'binary':                                                                                            // 365
    case 'base64':                                                                                            // 366
    case 'ucs2':                                                                                              // 367
    case 'ucs-2':                                                                                             // 368
    case 'utf16le':                                                                                           // 369
    case 'utf-16le':                                                                                          // 370
      return true                                                                                             // 371
    default:                                                                                                  // 372
      return false                                                                                            // 373
  }                                                                                                           // 374
}                                                                                                             // 375
                                                                                                              // 376
Buffer.concat = function concat (list, length) {                                                              // 377
  if (!isArray(list)) {                                                                                       // 378
    throw new TypeError('"list" argument must be an Array of Buffers')                                        // 379
  }                                                                                                           // 380
                                                                                                              // 381
  if (list.length === 0) {                                                                                    // 382
    return Buffer.alloc(0)                                                                                    // 383
  }                                                                                                           // 384
                                                                                                              // 385
  var i                                                                                                       // 386
  if (length === undefined) {                                                                                 // 387
    length = 0                                                                                                // 388
    for (i = 0; i < list.length; ++i) {                                                                       // 389
      length += list[i].length                                                                                // 390
    }                                                                                                         // 391
  }                                                                                                           // 392
                                                                                                              // 393
  var buffer = Buffer.allocUnsafe(length)                                                                     // 394
  var pos = 0                                                                                                 // 395
  for (i = 0; i < list.length; ++i) {                                                                         // 396
    var buf = list[i]                                                                                         // 397
    if (!Buffer.isBuffer(buf)) {                                                                              // 398
      throw new TypeError('"list" argument must be an Array of Buffers')                                      // 399
    }                                                                                                         // 400
    buf.copy(buffer, pos)                                                                                     // 401
    pos += buf.length                                                                                         // 402
  }                                                                                                           // 403
  return buffer                                                                                               // 404
}                                                                                                             // 405
                                                                                                              // 406
function byteLength (string, encoding) {                                                                      // 407
  if (Buffer.isBuffer(string)) {                                                                              // 408
    return string.length                                                                                      // 409
  }                                                                                                           // 410
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&                       // 411
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {                                        // 412
    return string.byteLength                                                                                  // 413
  }                                                                                                           // 414
  if (typeof string !== 'string') {                                                                           // 415
    string = '' + string                                                                                      // 416
  }                                                                                                           // 417
                                                                                                              // 418
  var len = string.length                                                                                     // 419
  if (len === 0) return 0                                                                                     // 420
                                                                                                              // 421
  // Use a for loop to avoid recursion                                                                        // 422
  var loweredCase = false                                                                                     // 423
  for (;;) {                                                                                                  // 424
    switch (encoding) {                                                                                       // 425
      case 'ascii':                                                                                           // 426
      case 'latin1':                                                                                          // 427
      case 'binary':                                                                                          // 428
        return len                                                                                            // 429
      case 'utf8':                                                                                            // 430
      case 'utf-8':                                                                                           // 431
      case undefined:                                                                                         // 432
        return utf8ToBytes(string).length                                                                     // 433
      case 'ucs2':                                                                                            // 434
      case 'ucs-2':                                                                                           // 435
      case 'utf16le':                                                                                         // 436
      case 'utf-16le':                                                                                        // 437
        return len * 2                                                                                        // 438
      case 'hex':                                                                                             // 439
        return len >>> 1                                                                                      // 440
      case 'base64':                                                                                          // 441
        return base64ToBytes(string).length                                                                   // 442
      default:                                                                                                // 443
        if (loweredCase) return utf8ToBytes(string).length // assume utf8                                     // 444
        encoding = ('' + encoding).toLowerCase()                                                              // 445
        loweredCase = true                                                                                    // 446
    }                                                                                                         // 447
  }                                                                                                           // 448
}                                                                                                             // 449
Buffer.byteLength = byteLength                                                                                // 450
                                                                                                              // 451
function slowToString (encoding, start, end) {                                                                // 452
  var loweredCase = false                                                                                     // 453
                                                                                                              // 454
  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only                                // 455
  // property of a typed array.                                                                               // 456
                                                                                                              // 457
  // This behaves neither like String nor Uint8Array in that we set start/end                                 // 458
  // to their upper/lower bounds if the value passed is out of range.                                         // 459
  // undefined is handled specially as per ECMA-262 6th Edition,                                              // 460
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.                                          // 461
  if (start === undefined || start < 0) {                                                                     // 462
    start = 0                                                                                                 // 463
  }                                                                                                           // 464
  // Return early if start > this.length. Done here to prevent potential uint32                               // 465
  // coercion fail below.                                                                                     // 466
  if (start > this.length) {                                                                                  // 467
    return ''                                                                                                 // 468
  }                                                                                                           // 469
                                                                                                              // 470
  if (end === undefined || end > this.length) {                                                               // 471
    end = this.length                                                                                         // 472
  }                                                                                                           // 473
                                                                                                              // 474
  if (end <= 0) {                                                                                             // 475
    return ''                                                                                                 // 476
  }                                                                                                           // 477
                                                                                                              // 478
  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.                                  // 479
  end >>>= 0                                                                                                  // 480
  start >>>= 0                                                                                                // 481
                                                                                                              // 482
  if (end <= start) {                                                                                         // 483
    return ''                                                                                                 // 484
  }                                                                                                           // 485
                                                                                                              // 486
  if (!encoding) encoding = 'utf8'                                                                            // 487
                                                                                                              // 488
  while (true) {                                                                                              // 489
    switch (encoding) {                                                                                       // 490
      case 'hex':                                                                                             // 491
        return hexSlice(this, start, end)                                                                     // 492
                                                                                                              // 493
      case 'utf8':                                                                                            // 494
      case 'utf-8':                                                                                           // 495
        return utf8Slice(this, start, end)                                                                    // 496
                                                                                                              // 497
      case 'ascii':                                                                                           // 498
        return asciiSlice(this, start, end)                                                                   // 499
                                                                                                              // 500
      case 'latin1':                                                                                          // 501
      case 'binary':                                                                                          // 502
        return latin1Slice(this, start, end)                                                                  // 503
                                                                                                              // 504
      case 'base64':                                                                                          // 505
        return base64Slice(this, start, end)                                                                  // 506
                                                                                                              // 507
      case 'ucs2':                                                                                            // 508
      case 'ucs-2':                                                                                           // 509
      case 'utf16le':                                                                                         // 510
      case 'utf-16le':                                                                                        // 511
        return utf16leSlice(this, start, end)                                                                 // 512
                                                                                                              // 513
      default:                                                                                                // 514
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)                                 // 515
        encoding = (encoding + '').toLowerCase()                                                              // 516
        loweredCase = true                                                                                    // 517
    }                                                                                                         // 518
  }                                                                                                           // 519
}                                                                                                             // 520
                                                                                                              // 521
// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect                        // 522
// Buffer instances.                                                                                          // 523
Buffer.prototype._isBuffer = true                                                                             // 524
                                                                                                              // 525
function swap (b, n, m) {                                                                                     // 526
  var i = b[n]                                                                                                // 527
  b[n] = b[m]                                                                                                 // 528
  b[m] = i                                                                                                    // 529
}                                                                                                             // 530
                                                                                                              // 531
Buffer.prototype.swap16 = function swap16 () {                                                                // 532
  var len = this.length                                                                                       // 533
  if (len % 2 !== 0) {                                                                                        // 534
    throw new RangeError('Buffer size must be a multiple of 16-bits')                                         // 535
  }                                                                                                           // 536
  for (var i = 0; i < len; i += 2) {                                                                          // 537
    swap(this, i, i + 1)                                                                                      // 538
  }                                                                                                           // 539
  return this                                                                                                 // 540
}                                                                                                             // 541
                                                                                                              // 542
Buffer.prototype.swap32 = function swap32 () {                                                                // 543
  var len = this.length                                                                                       // 544
  if (len % 4 !== 0) {                                                                                        // 545
    throw new RangeError('Buffer size must be a multiple of 32-bits')                                         // 546
  }                                                                                                           // 547
  for (var i = 0; i < len; i += 4) {                                                                          // 548
    swap(this, i, i + 3)                                                                                      // 549
    swap(this, i + 1, i + 2)                                                                                  // 550
  }                                                                                                           // 551
  return this                                                                                                 // 552
}                                                                                                             // 553
                                                                                                              // 554
Buffer.prototype.swap64 = function swap64 () {                                                                // 555
  var len = this.length                                                                                       // 556
  if (len % 8 !== 0) {                                                                                        // 557
    throw new RangeError('Buffer size must be a multiple of 64-bits')                                         // 558
  }                                                                                                           // 559
  for (var i = 0; i < len; i += 8) {                                                                          // 560
    swap(this, i, i + 7)                                                                                      // 561
    swap(this, i + 1, i + 6)                                                                                  // 562
    swap(this, i + 2, i + 5)                                                                                  // 563
    swap(this, i + 3, i + 4)                                                                                  // 564
  }                                                                                                           // 565
  return this                                                                                                 // 566
}                                                                                                             // 567
                                                                                                              // 568
Buffer.prototype.toString = function toString () {                                                            // 569
  var length = this.length | 0                                                                                // 570
  if (length === 0) return ''                                                                                 // 571
  if (arguments.length === 0) return utf8Slice(this, 0, length)                                               // 572
  return slowToString.apply(this, arguments)                                                                  // 573
}                                                                                                             // 574
                                                                                                              // 575
Buffer.prototype.equals = function equals (b) {                                                               // 576
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')                                   // 577
  if (this === b) return true                                                                                 // 578
  return Buffer.compare(this, b) === 0                                                                        // 579
}                                                                                                             // 580
                                                                                                              // 581
Buffer.prototype.inspect = function inspect () {                                                              // 582
  var str = ''                                                                                                // 583
  var max = exports.INSPECT_MAX_BYTES                                                                         // 584
  if (this.length > 0) {                                                                                      // 585
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')                                               // 586
    if (this.length > max) str += ' ... '                                                                     // 587
  }                                                                                                           // 588
  return '<Buffer ' + str + '>'                                                                               // 589
}                                                                                                             // 590
                                                                                                              // 591
Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {                        // 592
  if (!Buffer.isBuffer(target)) {                                                                             // 593
    throw new TypeError('Argument must be a Buffer')                                                          // 594
  }                                                                                                           // 595
                                                                                                              // 596
  if (start === undefined) {                                                                                  // 597
    start = 0                                                                                                 // 598
  }                                                                                                           // 599
  if (end === undefined) {                                                                                    // 600
    end = target ? target.length : 0                                                                          // 601
  }                                                                                                           // 602
  if (thisStart === undefined) {                                                                              // 603
    thisStart = 0                                                                                             // 604
  }                                                                                                           // 605
  if (thisEnd === undefined) {                                                                                // 606
    thisEnd = this.length                                                                                     // 607
  }                                                                                                           // 608
                                                                                                              // 609
  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {                           // 610
    throw new RangeError('out of range index')                                                                // 611
  }                                                                                                           // 612
                                                                                                              // 613
  if (thisStart >= thisEnd && start >= end) {                                                                 // 614
    return 0                                                                                                  // 615
  }                                                                                                           // 616
  if (thisStart >= thisEnd) {                                                                                 // 617
    return -1                                                                                                 // 618
  }                                                                                                           // 619
  if (start >= end) {                                                                                         // 620
    return 1                                                                                                  // 621
  }                                                                                                           // 622
                                                                                                              // 623
  start >>>= 0                                                                                                // 624
  end >>>= 0                                                                                                  // 625
  thisStart >>>= 0                                                                                            // 626
  thisEnd >>>= 0                                                                                              // 627
                                                                                                              // 628
  if (this === target) return 0                                                                               // 629
                                                                                                              // 630
  var x = thisEnd - thisStart                                                                                 // 631
  var y = end - start                                                                                         // 632
  var len = Math.min(x, y)                                                                                    // 633
                                                                                                              // 634
  var thisCopy = this.slice(thisStart, thisEnd)                                                               // 635
  var targetCopy = target.slice(start, end)                                                                   // 636
                                                                                                              // 637
  for (var i = 0; i < len; ++i) {                                                                             // 638
    if (thisCopy[i] !== targetCopy[i]) {                                                                      // 639
      x = thisCopy[i]                                                                                         // 640
      y = targetCopy[i]                                                                                       // 641
      break                                                                                                   // 642
    }                                                                                                         // 643
  }                                                                                                           // 644
                                                                                                              // 645
  if (x < y) return -1                                                                                        // 646
  if (y < x) return 1                                                                                         // 647
  return 0                                                                                                    // 648
}                                                                                                             // 649
                                                                                                              // 650
// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,                               // 651
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.                                          // 652
//                                                                                                            // 653
// Arguments:                                                                                                 // 654
// - buffer - a Buffer to search                                                                              // 655
// - val - a string, Buffer, or number                                                                        // 656
// - byteOffset - an index into `buffer`; will be clamped to an int32                                         // 657
// - encoding - an optional encoding, relevant is val is a string                                             // 658
// - dir - true for indexOf, false for lastIndexOf                                                            // 659
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {                                      // 660
  // Empty buffer means no match                                                                              // 661
  if (buffer.length === 0) return -1                                                                          // 662
                                                                                                              // 663
  // Normalize byteOffset                                                                                     // 664
  if (typeof byteOffset === 'string') {                                                                       // 665
    encoding = byteOffset                                                                                     // 666
    byteOffset = 0                                                                                            // 667
  } else if (byteOffset > 0x7fffffff) {                                                                       // 668
    byteOffset = 0x7fffffff                                                                                   // 669
  } else if (byteOffset < -0x80000000) {                                                                      // 670
    byteOffset = -0x80000000                                                                                  // 671
  }                                                                                                           // 672
  byteOffset = +byteOffset  // Coerce to Number.                                                              // 673
  if (isNaN(byteOffset)) {                                                                                    // 674
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer                              // 675
    byteOffset = dir ? 0 : (buffer.length - 1)                                                                // 676
  }                                                                                                           // 677
                                                                                                              // 678
  // Normalize byteOffset: negative offsets start from the end of the buffer                                  // 679
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset                                                 // 680
  if (byteOffset >= buffer.length) {                                                                          // 681
    if (dir) return -1                                                                                        // 682
    else byteOffset = buffer.length - 1                                                                       // 683
  } else if (byteOffset < 0) {                                                                                // 684
    if (dir) byteOffset = 0                                                                                   // 685
    else return -1                                                                                            // 686
  }                                                                                                           // 687
                                                                                                              // 688
  // Normalize val                                                                                            // 689
  if (typeof val === 'string') {                                                                              // 690
    val = Buffer.from(val, encoding)                                                                          // 691
  }                                                                                                           // 692
                                                                                                              // 693
  // Finally, search either indexOf (if dir is true) or lastIndexOf                                           // 694
  if (Buffer.isBuffer(val)) {                                                                                 // 695
    // Special case: looking for empty string/buffer always fails                                             // 696
    if (val.length === 0) {                                                                                   // 697
      return -1                                                                                               // 698
    }                                                                                                         // 699
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)                                               // 700
  } else if (typeof val === 'number') {                                                                       // 701
    val = val & 0xFF // Search for a byte value [0-255]                                                       // 702
    if (Buffer.TYPED_ARRAY_SUPPORT &&                                                                         // 703
        typeof Uint8Array.prototype.indexOf === 'function') {                                                 // 704
      if (dir) {                                                                                              // 705
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)                                     // 706
      } else {                                                                                                // 707
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)                                 // 708
      }                                                                                                       // 709
    }                                                                                                         // 710
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)                                           // 711
  }                                                                                                           // 712
                                                                                                              // 713
  throw new TypeError('val must be string, number or Buffer')                                                 // 714
}                                                                                                             // 715
                                                                                                              // 716
function arrayIndexOf (arr, val, byteOffset, encoding, dir) {                                                 // 717
  var indexSize = 1                                                                                           // 718
  var arrLength = arr.length                                                                                  // 719
  var valLength = val.length                                                                                  // 720
                                                                                                              // 721
  if (encoding !== undefined) {                                                                               // 722
    encoding = String(encoding).toLowerCase()                                                                 // 723
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||                                                        // 724
        encoding === 'utf16le' || encoding === 'utf-16le') {                                                  // 725
      if (arr.length < 2 || val.length < 2) {                                                                 // 726
        return -1                                                                                             // 727
      }                                                                                                       // 728
      indexSize = 2                                                                                           // 729
      arrLength /= 2                                                                                          // 730
      valLength /= 2                                                                                          // 731
      byteOffset /= 2                                                                                         // 732
    }                                                                                                         // 733
  }                                                                                                           // 734
                                                                                                              // 735
  function read (buf, i) {                                                                                    // 736
    if (indexSize === 1) {                                                                                    // 737
      return buf[i]                                                                                           // 738
    } else {                                                                                                  // 739
      return buf.readUInt16BE(i * indexSize)                                                                  // 740
    }                                                                                                         // 741
  }                                                                                                           // 742
                                                                                                              // 743
  var i                                                                                                       // 744
  if (dir) {                                                                                                  // 745
    var foundIndex = -1                                                                                       // 746
    for (i = byteOffset; i < arrLength; i++) {                                                                // 747
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {                               // 748
        if (foundIndex === -1) foundIndex = i                                                                 // 749
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize                                   // 750
      } else {                                                                                                // 751
        if (foundIndex !== -1) i -= i - foundIndex                                                            // 752
        foundIndex = -1                                                                                       // 753
      }                                                                                                       // 754
    }                                                                                                         // 755
  } else {                                                                                                    // 756
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength                                // 757
    for (i = byteOffset; i >= 0; i--) {                                                                       // 758
      var found = true                                                                                        // 759
      for (var j = 0; j < valLength; j++) {                                                                   // 760
        if (read(arr, i + j) !== read(val, j)) {                                                              // 761
          found = false                                                                                       // 762
          break                                                                                               // 763
        }                                                                                                     // 764
      }                                                                                                       // 765
      if (found) return i                                                                                     // 766
    }                                                                                                         // 767
  }                                                                                                           // 768
                                                                                                              // 769
  return -1                                                                                                   // 770
}                                                                                                             // 771
                                                                                                              // 772
Buffer.prototype.includes = function includes (val, byteOffset, encoding) {                                   // 773
  return this.indexOf(val, byteOffset, encoding) !== -1                                                       // 774
}                                                                                                             // 775
                                                                                                              // 776
Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {                                     // 777
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)                                          // 778
}                                                                                                             // 779
                                                                                                              // 780
Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {                             // 781
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)                                         // 782
}                                                                                                             // 783
                                                                                                              // 784
function hexWrite (buf, string, offset, length) {                                                             // 785
  offset = Number(offset) || 0                                                                                // 786
  var remaining = buf.length - offset                                                                         // 787
  if (!length) {                                                                                              // 788
    length = remaining                                                                                        // 789
  } else {                                                                                                    // 790
    length = Number(length)                                                                                   // 791
    if (length > remaining) {                                                                                 // 792
      length = remaining                                                                                      // 793
    }                                                                                                         // 794
  }                                                                                                           // 795
                                                                                                              // 796
  // must be an even number of digits                                                                         // 797
  var strLen = string.length                                                                                  // 798
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')                                             // 799
                                                                                                              // 800
  if (length > strLen / 2) {                                                                                  // 801
    length = strLen / 2                                                                                       // 802
  }                                                                                                           // 803
  for (var i = 0; i < length; ++i) {                                                                          // 804
    var parsed = parseInt(string.substr(i * 2, 2), 16)                                                        // 805
    if (isNaN(parsed)) return i                                                                               // 806
    buf[offset + i] = parsed                                                                                  // 807
  }                                                                                                           // 808
  return i                                                                                                    // 809
}                                                                                                             // 810
                                                                                                              // 811
function utf8Write (buf, string, offset, length) {                                                            // 812
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)                            // 813
}                                                                                                             // 814
                                                                                                              // 815
function asciiWrite (buf, string, offset, length) {                                                           // 816
  return blitBuffer(asciiToBytes(string), buf, offset, length)                                                // 817
}                                                                                                             // 818
                                                                                                              // 819
function latin1Write (buf, string, offset, length) {                                                          // 820
  return asciiWrite(buf, string, offset, length)                                                              // 821
}                                                                                                             // 822
                                                                                                              // 823
function base64Write (buf, string, offset, length) {                                                          // 824
  return blitBuffer(base64ToBytes(string), buf, offset, length)                                               // 825
}                                                                                                             // 826
                                                                                                              // 827
function ucs2Write (buf, string, offset, length) {                                                            // 828
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)                         // 829
}                                                                                                             // 830
                                                                                                              // 831
Buffer.prototype.write = function write (string, offset, length, encoding) {                                  // 832
  // Buffer#write(string)                                                                                     // 833
  if (offset === undefined) {                                                                                 // 834
    encoding = 'utf8'                                                                                         // 835
    length = this.length                                                                                      // 836
    offset = 0                                                                                                // 837
  // Buffer#write(string, encoding)                                                                           // 838
  } else if (length === undefined && typeof offset === 'string') {                                            // 839
    encoding = offset                                                                                         // 840
    length = this.length                                                                                      // 841
    offset = 0                                                                                                // 842
  // Buffer#write(string, offset[, length][, encoding])                                                       // 843
  } else if (isFinite(offset)) {                                                                              // 844
    offset = offset | 0                                                                                       // 845
    if (isFinite(length)) {                                                                                   // 846
      length = length | 0                                                                                     // 847
      if (encoding === undefined) encoding = 'utf8'                                                           // 848
    } else {                                                                                                  // 849
      encoding = length                                                                                       // 850
      length = undefined                                                                                      // 851
    }                                                                                                         // 852
  // legacy write(string, encoding, offset, length) - remove in v0.13                                         // 853
  } else {                                                                                                    // 854
    throw new Error(                                                                                          // 855
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'                               // 856
    )                                                                                                         // 857
  }                                                                                                           // 858
                                                                                                              // 859
  var remaining = this.length - offset                                                                        // 860
  if (length === undefined || length > remaining) length = remaining                                          // 861
                                                                                                              // 862
  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {                            // 863
    throw new RangeError('Attempt to write outside buffer bounds')                                            // 864
  }                                                                                                           // 865
                                                                                                              // 866
  if (!encoding) encoding = 'utf8'                                                                            // 867
                                                                                                              // 868
  var loweredCase = false                                                                                     // 869
  for (;;) {                                                                                                  // 870
    switch (encoding) {                                                                                       // 871
      case 'hex':                                                                                             // 872
        return hexWrite(this, string, offset, length)                                                         // 873
                                                                                                              // 874
      case 'utf8':                                                                                            // 875
      case 'utf-8':                                                                                           // 876
        return utf8Write(this, string, offset, length)                                                        // 877
                                                                                                              // 878
      case 'ascii':                                                                                           // 879
        return asciiWrite(this, string, offset, length)                                                       // 880
                                                                                                              // 881
      case 'latin1':                                                                                          // 882
      case 'binary':                                                                                          // 883
        return latin1Write(this, string, offset, length)                                                      // 884
                                                                                                              // 885
      case 'base64':                                                                                          // 886
        // Warning: maxLength not taken into account in base64Write                                           // 887
        return base64Write(this, string, offset, length)                                                      // 888
                                                                                                              // 889
      case 'ucs2':                                                                                            // 890
      case 'ucs-2':                                                                                           // 891
      case 'utf16le':                                                                                         // 892
      case 'utf-16le':                                                                                        // 893
        return ucs2Write(this, string, offset, length)                                                        // 894
                                                                                                              // 895
      default:                                                                                                // 896
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)                                 // 897
        encoding = ('' + encoding).toLowerCase()                                                              // 898
        loweredCase = true                                                                                    // 899
    }                                                                                                         // 900
  }                                                                                                           // 901
}                                                                                                             // 902
                                                                                                              // 903
Buffer.prototype.toJSON = function toJSON () {                                                                // 904
  return {                                                                                                    // 905
    type: 'Buffer',                                                                                           // 906
    data: Array.prototype.slice.call(this._arr || this, 0)                                                    // 907
  }                                                                                                           // 908
}                                                                                                             // 909
                                                                                                              // 910
function base64Slice (buf, start, end) {                                                                      // 911
  if (start === 0 && end === buf.length) {                                                                    // 912
    return base64.fromByteArray(buf)                                                                          // 913
  } else {                                                                                                    // 914
    return base64.fromByteArray(buf.slice(start, end))                                                        // 915
  }                                                                                                           // 916
}                                                                                                             // 917
                                                                                                              // 918
function utf8Slice (buf, start, end) {                                                                        // 919
  end = Math.min(buf.length, end)                                                                             // 920
  var res = []                                                                                                // 921
                                                                                                              // 922
  var i = start                                                                                               // 923
  while (i < end) {                                                                                           // 924
    var firstByte = buf[i]                                                                                    // 925
    var codePoint = null                                                                                      // 926
    var bytesPerSequence = (firstByte > 0xEF) ? 4                                                             // 927
      : (firstByte > 0xDF) ? 3                                                                                // 928
      : (firstByte > 0xBF) ? 2                                                                                // 929
      : 1                                                                                                     // 930
                                                                                                              // 931
    if (i + bytesPerSequence <= end) {                                                                        // 932
      var secondByte, thirdByte, fourthByte, tempCodePoint                                                    // 933
                                                                                                              // 934
      switch (bytesPerSequence) {                                                                             // 935
        case 1:                                                                                               // 936
          if (firstByte < 0x80) {                                                                             // 937
            codePoint = firstByte                                                                             // 938
          }                                                                                                   // 939
          break                                                                                               // 940
        case 2:                                                                                               // 941
          secondByte = buf[i + 1]                                                                             // 942
          if ((secondByte & 0xC0) === 0x80) {                                                                 // 943
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)                                   // 944
            if (tempCodePoint > 0x7F) {                                                                       // 945
              codePoint = tempCodePoint                                                                       // 946
            }                                                                                                 // 947
          }                                                                                                   // 948
          break                                                                                               // 949
        case 3:                                                                                               // 950
          secondByte = buf[i + 1]                                                                             // 951
          thirdByte = buf[i + 2]                                                                              // 952
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {                                  // 953
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)        // 954
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {                // 955
              codePoint = tempCodePoint                                                                       // 956
            }                                                                                                 // 957
          }                                                                                                   // 958
          break                                                                                               // 959
        case 4:                                                                                               // 960
          secondByte = buf[i + 1]                                                                             // 961
          thirdByte = buf[i + 2]                                                                              // 962
          fourthByte = buf[i + 3]                                                                             // 963
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {  // 964
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {                                         // 966
              codePoint = tempCodePoint                                                                       // 967
            }                                                                                                 // 968
          }                                                                                                   // 969
      }                                                                                                       // 970
    }                                                                                                         // 971
                                                                                                              // 972
    if (codePoint === null) {                                                                                 // 973
      // we did not generate a valid codePoint so insert a                                                    // 974
      // replacement char (U+FFFD) and advance only 1 byte                                                    // 975
      codePoint = 0xFFFD                                                                                      // 976
      bytesPerSequence = 1                                                                                    // 977
    } else if (codePoint > 0xFFFF) {                                                                          // 978
      // encode to utf16 (surrogate pair dance)                                                               // 979
      codePoint -= 0x10000                                                                                    // 980
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)                                                             // 981
      codePoint = 0xDC00 | codePoint & 0x3FF                                                                  // 982
    }                                                                                                         // 983
                                                                                                              // 984
    res.push(codePoint)                                                                                       // 985
    i += bytesPerSequence                                                                                     // 986
  }                                                                                                           // 987
                                                                                                              // 988
  return decodeCodePointsArray(res)                                                                           // 989
}                                                                                                             // 990
                                                                                                              // 991
// Based on http://stackoverflow.com/a/22747272/680742, the browser with                                      // 992
// the lowest limit is Chrome, with 0x10000 args.                                                             // 993
// We go 1 magnitude less, for safety                                                                         // 994
var MAX_ARGUMENTS_LENGTH = 0x1000                                                                             // 995
                                                                                                              // 996
function decodeCodePointsArray (codePoints) {                                                                 // 997
  var len = codePoints.length                                                                                 // 998
  if (len <= MAX_ARGUMENTS_LENGTH) {                                                                          // 999
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()                               // 1000
  }                                                                                                           // 1001
                                                                                                              // 1002
  // Decode in chunks to avoid "call stack size exceeded".                                                    // 1003
  var res = ''                                                                                                // 1004
  var i = 0                                                                                                   // 1005
  while (i < len) {                                                                                           // 1006
    res += String.fromCharCode.apply(                                                                         // 1007
      String,                                                                                                 // 1008
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)                                                          // 1009
    )                                                                                                         // 1010
  }                                                                                                           // 1011
  return res                                                                                                  // 1012
}                                                                                                             // 1013
                                                                                                              // 1014
function asciiSlice (buf, start, end) {                                                                       // 1015
  var ret = ''                                                                                                // 1016
  end = Math.min(buf.length, end)                                                                             // 1017
                                                                                                              // 1018
  for (var i = start; i < end; ++i) {                                                                         // 1019
    ret += String.fromCharCode(buf[i] & 0x7F)                                                                 // 1020
  }                                                                                                           // 1021
  return ret                                                                                                  // 1022
}                                                                                                             // 1023
                                                                                                              // 1024
function latin1Slice (buf, start, end) {                                                                      // 1025
  var ret = ''                                                                                                // 1026
  end = Math.min(buf.length, end)                                                                             // 1027
                                                                                                              // 1028
  for (var i = start; i < end; ++i) {                                                                         // 1029
    ret += String.fromCharCode(buf[i])                                                                        // 1030
  }                                                                                                           // 1031
  return ret                                                                                                  // 1032
}                                                                                                             // 1033
                                                                                                              // 1034
function hexSlice (buf, start, end) {                                                                         // 1035
  var len = buf.length                                                                                        // 1036
                                                                                                              // 1037
  if (!start || start < 0) start = 0                                                                          // 1038
  if (!end || end < 0 || end > len) end = len                                                                 // 1039
                                                                                                              // 1040
  var out = ''                                                                                                // 1041
  for (var i = start; i < end; ++i) {                                                                         // 1042
    out += toHex(buf[i])                                                                                      // 1043
  }                                                                                                           // 1044
  return out                                                                                                  // 1045
}                                                                                                             // 1046
                                                                                                              // 1047
function utf16leSlice (buf, start, end) {                                                                     // 1048
  var bytes = buf.slice(start, end)                                                                           // 1049
  var res = ''                                                                                                // 1050
  for (var i = 0; i < bytes.length; i += 2) {                                                                 // 1051
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)                                                 // 1052
  }                                                                                                           // 1053
  return res                                                                                                  // 1054
}                                                                                                             // 1055
                                                                                                              // 1056
Buffer.prototype.slice = function slice (start, end) {                                                        // 1057
  var len = this.length                                                                                       // 1058
  start = ~~start                                                                                             // 1059
  end = end === undefined ? len : ~~end                                                                       // 1060
                                                                                                              // 1061
  if (start < 0) {                                                                                            // 1062
    start += len                                                                                              // 1063
    if (start < 0) start = 0                                                                                  // 1064
  } else if (start > len) {                                                                                   // 1065
    start = len                                                                                               // 1066
  }                                                                                                           // 1067
                                                                                                              // 1068
  if (end < 0) {                                                                                              // 1069
    end += len                                                                                                // 1070
    if (end < 0) end = 0                                                                                      // 1071
  } else if (end > len) {                                                                                     // 1072
    end = len                                                                                                 // 1073
  }                                                                                                           // 1074
                                                                                                              // 1075
  if (end < start) end = start                                                                                // 1076
                                                                                                              // 1077
  var newBuf                                                                                                  // 1078
  if (Buffer.TYPED_ARRAY_SUPPORT) {                                                                           // 1079
    newBuf = this.subarray(start, end)                                                                        // 1080
    newBuf.__proto__ = Buffer.prototype                                                                       // 1081
  } else {                                                                                                    // 1082
    var sliceLen = end - start                                                                                // 1083
    newBuf = new Buffer(sliceLen, undefined)                                                                  // 1084
    for (var i = 0; i < sliceLen; ++i) {                                                                      // 1085
      newBuf[i] = this[i + start]                                                                             // 1086
    }                                                                                                         // 1087
  }                                                                                                           // 1088
                                                                                                              // 1089
  return newBuf                                                                                               // 1090
}                                                                                                             // 1091
                                                                                                              // 1092
/*                                                                                                            // 1093
 * Need to make sure that buffer isn't trying to write out of bounds.                                         // 1094
 */                                                                                                           // 1095
function checkOffset (offset, ext, length) {                                                                  // 1096
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')                            // 1097
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')                    // 1098
}                                                                                                             // 1099
                                                                                                              // 1100
Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {                            // 1101
  offset = offset | 0                                                                                         // 1102
  byteLength = byteLength | 0                                                                                 // 1103
  if (!noAssert) checkOffset(offset, byteLength, this.length)                                                 // 1104
                                                                                                              // 1105
  var val = this[offset]                                                                                      // 1106
  var mul = 1                                                                                                 // 1107
  var i = 0                                                                                                   // 1108
  while (++i < byteLength && (mul *= 0x100)) {                                                                // 1109
    val += this[offset + i] * mul                                                                             // 1110
  }                                                                                                           // 1111
                                                                                                              // 1112
  return val                                                                                                  // 1113
}                                                                                                             // 1114
                                                                                                              // 1115
Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {                            // 1116
  offset = offset | 0                                                                                         // 1117
  byteLength = byteLength | 0                                                                                 // 1118
  if (!noAssert) {                                                                                            // 1119
    checkOffset(offset, byteLength, this.length)                                                              // 1120
  }                                                                                                           // 1121
                                                                                                              // 1122
  var val = this[offset + --byteLength]                                                                       // 1123
  var mul = 1                                                                                                 // 1124
  while (byteLength > 0 && (mul *= 0x100)) {                                                                  // 1125
    val += this[offset + --byteLength] * mul                                                                  // 1126
  }                                                                                                           // 1127
                                                                                                              // 1128
  return val                                                                                                  // 1129
}                                                                                                             // 1130
                                                                                                              // 1131
Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {                                          // 1132
  if (!noAssert) checkOffset(offset, 1, this.length)                                                          // 1133
  return this[offset]                                                                                         // 1134
}                                                                                                             // 1135
                                                                                                              // 1136
Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {                                    // 1137
  if (!noAssert) checkOffset(offset, 2, this.length)                                                          // 1138
  return this[offset] | (this[offset + 1] << 8)                                                               // 1139
}                                                                                                             // 1140
                                                                                                              // 1141
Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {                                    // 1142
  if (!noAssert) checkOffset(offset, 2, this.length)                                                          // 1143
  return (this[offset] << 8) | this[offset + 1]                                                               // 1144
}                                                                                                             // 1145
                                                                                                              // 1146
Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {                                    // 1147
  if (!noAssert) checkOffset(offset, 4, this.length)                                                          // 1148
                                                                                                              // 1149
  return ((this[offset]) |                                                                                    // 1150
      (this[offset + 1] << 8) |                                                                               // 1151
      (this[offset + 2] << 16)) +                                                                             // 1152
      (this[offset + 3] * 0x1000000)                                                                          // 1153
}                                                                                                             // 1154
                                                                                                              // 1155
Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {                                    // 1156
  if (!noAssert) checkOffset(offset, 4, this.length)                                                          // 1157
                                                                                                              // 1158
  return (this[offset] * 0x1000000) +                                                                         // 1159
    ((this[offset + 1] << 16) |                                                                               // 1160
    (this[offset + 2] << 8) |                                                                                 // 1161
    this[offset + 3])                                                                                         // 1162
}                                                                                                             // 1163
                                                                                                              // 1164
Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {                              // 1165
  offset = offset | 0                                                                                         // 1166
  byteLength = byteLength | 0                                                                                 // 1167
  if (!noAssert) checkOffset(offset, byteLength, this.length)                                                 // 1168
                                                                                                              // 1169
  var val = this[offset]                                                                                      // 1170
  var mul = 1                                                                                                 // 1171
  var i = 0                                                                                                   // 1172
  while (++i < byteLength && (mul *= 0x100)) {                                                                // 1173
    val += this[offset + i] * mul                                                                             // 1174
  }                                                                                                           // 1175
  mul *= 0x80                                                                                                 // 1176
                                                                                                              // 1177
  if (val >= mul) val -= Math.pow(2, 8 * byteLength)                                                          // 1178
                                                                                                              // 1179
  return val                                                                                                  // 1180
}                                                                                                             // 1181
                                                                                                              // 1182
Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {                              // 1183
  offset = offset | 0                                                                                         // 1184
  byteLength = byteLength | 0                                                                                 // 1185
  if (!noAssert) checkOffset(offset, byteLength, this.length)                                                 // 1186
                                                                                                              // 1187
  var i = byteLength                                                                                          // 1188
  var mul = 1                                                                                                 // 1189
  var val = this[offset + --i]                                                                                // 1190
  while (i > 0 && (mul *= 0x100)) {                                                                           // 1191
    val += this[offset + --i] * mul                                                                           // 1192
  }                                                                                                           // 1193
  mul *= 0x80                                                                                                 // 1194
                                                                                                              // 1195
  if (val >= mul) val -= Math.pow(2, 8 * byteLength)                                                          // 1196
                                                                                                              // 1197
  return val                                                                                                  // 1198
}                                                                                                             // 1199
                                                                                                              // 1200
Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {                                            // 1201
  if (!noAssert) checkOffset(offset, 1, this.length)                                                          // 1202
  if (!(this[offset] & 0x80)) return (this[offset])                                                           // 1203
  return ((0xff - this[offset] + 1) * -1)                                                                     // 1204
}                                                                                                             // 1205
                                                                                                              // 1206
Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {                                      // 1207
  if (!noAssert) checkOffset(offset, 2, this.length)                                                          // 1208
  var val = this[offset] | (this[offset + 1] << 8)                                                            // 1209
  return (val & 0x8000) ? val | 0xFFFF0000 : val                                                              // 1210
}                                                                                                             // 1211
                                                                                                              // 1212
Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {                                      // 1213
  if (!noAssert) checkOffset(offset, 2, this.length)                                                          // 1214
  var val = this[offset + 1] | (this[offset] << 8)                                                            // 1215
  return (val & 0x8000) ? val | 0xFFFF0000 : val                                                              // 1216
}                                                                                                             // 1217
                                                                                                              // 1218
Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {                                      // 1219
  if (!noAssert) checkOffset(offset, 4, this.length)                                                          // 1220
                                                                                                              // 1221
  return (this[offset]) |                                                                                     // 1222
    (this[offset + 1] << 8) |                                                                                 // 1223
    (this[offset + 2] << 16) |                                                                                // 1224
    (this[offset + 3] << 24)                                                                                  // 1225
}                                                                                                             // 1226
                                                                                                              // 1227
Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {                                      // 1228
  if (!noAssert) checkOffset(offset, 4, this.length)                                                          // 1229
                                                                                                              // 1230
  return (this[offset] << 24) |                                                                               // 1231
    (this[offset + 1] << 16) |                                                                                // 1232
    (this[offset + 2] << 8) |                                                                                 // 1233
    (this[offset + 3])                                                                                        // 1234
}                                                                                                             // 1235
                                                                                                              // 1236
Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {                                      // 1237
  if (!noAssert) checkOffset(offset, 4, this.length)                                                          // 1238
  return ieee754.read(this, offset, true, 23, 4)                                                              // 1239
}                                                                                                             // 1240
                                                                                                              // 1241
Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {                                      // 1242
  if (!noAssert) checkOffset(offset, 4, this.length)                                                          // 1243
  return ieee754.read(this, offset, false, 23, 4)                                                             // 1244
}                                                                                                             // 1245
                                                                                                              // 1246
Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {                                    // 1247
  if (!noAssert) checkOffset(offset, 8, this.length)                                                          // 1248
  return ieee754.read(this, offset, true, 52, 8)                                                              // 1249
}                                                                                                             // 1250
                                                                                                              // 1251
Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {                                    // 1252
  if (!noAssert) checkOffset(offset, 8, this.length)                                                          // 1253
  return ieee754.read(this, offset, false, 52, 8)                                                             // 1254
}                                                                                                             // 1255
                                                                                                              // 1256
function checkInt (buf, value, offset, ext, max, min) {                                                       // 1257
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')               // 1258
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')                   // 1259
  if (offset + ext > buf.length) throw new RangeError('Index out of range')                                   // 1260
}                                                                                                             // 1261
                                                                                                              // 1262
Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {                   // 1263
  value = +value                                                                                              // 1264
  offset = offset | 0                                                                                         // 1265
  byteLength = byteLength | 0                                                                                 // 1266
  if (!noAssert) {                                                                                            // 1267
    var maxBytes = Math.pow(2, 8 * byteLength) - 1                                                            // 1268
    checkInt(this, value, offset, byteLength, maxBytes, 0)                                                    // 1269
  }                                                                                                           // 1270
                                                                                                              // 1271
  var mul = 1                                                                                                 // 1272
  var i = 0                                                                                                   // 1273
  this[offset] = value & 0xFF                                                                                 // 1274
  while (++i < byteLength && (mul *= 0x100)) {                                                                // 1275
    this[offset + i] = (value / mul) & 0xFF                                                                   // 1276
  }                                                                                                           // 1277
                                                                                                              // 1278
  return offset + byteLength                                                                                  // 1279
}                                                                                                             // 1280
                                                                                                              // 1281
Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {                   // 1282
  value = +value                                                                                              // 1283
  offset = offset | 0                                                                                         // 1284
  byteLength = byteLength | 0                                                                                 // 1285
  if (!noAssert) {                                                                                            // 1286
    var maxBytes = Math.pow(2, 8 * byteLength) - 1                                                            // 1287
    checkInt(this, value, offset, byteLength, maxBytes, 0)                                                    // 1288
  }                                                                                                           // 1289
                                                                                                              // 1290
  var i = byteLength - 1                                                                                      // 1291
  var mul = 1                                                                                                 // 1292
  this[offset + i] = value & 0xFF                                                                             // 1293
  while (--i >= 0 && (mul *= 0x100)) {                                                                        // 1294
    this[offset + i] = (value / mul) & 0xFF                                                                   // 1295
  }                                                                                                           // 1296
                                                                                                              // 1297
  return offset + byteLength                                                                                  // 1298
}                                                                                                             // 1299
                                                                                                              // 1300
Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {                                 // 1301
  value = +value                                                                                              // 1302
  offset = offset | 0                                                                                         // 1303
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)                                                    // 1304
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)                                                  // 1305
  this[offset] = (value & 0xff)                                                                               // 1306
  return offset + 1                                                                                           // 1307
}                                                                                                             // 1308
                                                                                                              // 1309
function objectWriteUInt16 (buf, value, offset, littleEndian) {                                               // 1310
  if (value < 0) value = 0xffff + value + 1                                                                   // 1311
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {                                         // 1312
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>                                // 1313
      (littleEndian ? i : 1 - i) * 8                                                                          // 1314
  }                                                                                                           // 1315
}                                                                                                             // 1316
                                                                                                              // 1317
Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {                           // 1318
  value = +value                                                                                              // 1319
  offset = offset | 0                                                                                         // 1320
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)                                                  // 1321
  if (Buffer.TYPED_ARRAY_SUPPORT) {                                                                           // 1322
    this[offset] = (value & 0xff)                                                                             // 1323
    this[offset + 1] = (value >>> 8)                                                                          // 1324
  } else {                                                                                                    // 1325
    objectWriteUInt16(this, value, offset, true)                                                              // 1326
  }                                                                                                           // 1327
  return offset + 2                                                                                           // 1328
}                                                                                                             // 1329
                                                                                                              // 1330
Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {                           // 1331
  value = +value                                                                                              // 1332
  offset = offset | 0                                                                                         // 1333
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)                                                  // 1334
  if (Buffer.TYPED_ARRAY_SUPPORT) {                                                                           // 1335
    this[offset] = (value >>> 8)                                                                              // 1336
    this[offset + 1] = (value & 0xff)                                                                         // 1337
  } else {                                                                                                    // 1338
    objectWriteUInt16(this, value, offset, false)                                                             // 1339
  }                                                                                                           // 1340
  return offset + 2                                                                                           // 1341
}                                                                                                             // 1342
                                                                                                              // 1343
function objectWriteUInt32 (buf, value, offset, littleEndian) {                                               // 1344
  if (value < 0) value = 0xffffffff + value + 1                                                               // 1345
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {                                         // 1346
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff                                       // 1347
  }                                                                                                           // 1348
}                                                                                                             // 1349
                                                                                                              // 1350
Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {                           // 1351
  value = +value                                                                                              // 1352
  offset = offset | 0                                                                                         // 1353
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)                                              // 1354
  if (Buffer.TYPED_ARRAY_SUPPORT) {                                                                           // 1355
    this[offset + 3] = (value >>> 24)                                                                         // 1356
    this[offset + 2] = (value >>> 16)                                                                         // 1357
    this[offset + 1] = (value >>> 8)                                                                          // 1358
    this[offset] = (value & 0xff)                                                                             // 1359
  } else {                                                                                                    // 1360
    objectWriteUInt32(this, value, offset, true)                                                              // 1361
  }                                                                                                           // 1362
  return offset + 4                                                                                           // 1363
}                                                                                                             // 1364
                                                                                                              // 1365
Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {                           // 1366
  value = +value                                                                                              // 1367
  offset = offset | 0                                                                                         // 1368
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)                                              // 1369
  if (Buffer.TYPED_ARRAY_SUPPORT) {                                                                           // 1370
    this[offset] = (value >>> 24)                                                                             // 1371
    this[offset + 1] = (value >>> 16)                                                                         // 1372
    this[offset + 2] = (value >>> 8)                                                                          // 1373
    this[offset + 3] = (value & 0xff)                                                                         // 1374
  } else {                                                                                                    // 1375
    objectWriteUInt32(this, value, offset, false)                                                             // 1376
  }                                                                                                           // 1377
  return offset + 4                                                                                           // 1378
}                                                                                                             // 1379
                                                                                                              // 1380
Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {                     // 1381
  value = +value                                                                                              // 1382
  offset = offset | 0                                                                                         // 1383
  if (!noAssert) {                                                                                            // 1384
    var limit = Math.pow(2, 8 * byteLength - 1)                                                               // 1385
                                                                                                              // 1386
    checkInt(this, value, offset, byteLength, limit - 1, -limit)                                              // 1387
  }                                                                                                           // 1388
                                                                                                              // 1389
  var i = 0                                                                                                   // 1390
  var mul = 1                                                                                                 // 1391
  var sub = 0                                                                                                 // 1392
  this[offset] = value & 0xFF                                                                                 // 1393
  while (++i < byteLength && (mul *= 0x100)) {                                                                // 1394
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {                                               // 1395
      sub = 1                                                                                                 // 1396
    }                                                                                                         // 1397
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF                                                      // 1398
  }                                                                                                           // 1399
                                                                                                              // 1400
  return offset + byteLength                                                                                  // 1401
}                                                                                                             // 1402
                                                                                                              // 1403
Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {                     // 1404
  value = +value                                                                                              // 1405
  offset = offset | 0                                                                                         // 1406
  if (!noAssert) {                                                                                            // 1407
    var limit = Math.pow(2, 8 * byteLength - 1)                                                               // 1408
                                                                                                              // 1409
    checkInt(this, value, offset, byteLength, limit - 1, -limit)                                              // 1410
  }                                                                                                           // 1411
                                                                                                              // 1412
  var i = byteLength - 1                                                                                      // 1413
  var mul = 1                                                                                                 // 1414
  var sub = 0                                                                                                 // 1415
  this[offset + i] = value & 0xFF                                                                             // 1416
  while (--i >= 0 && (mul *= 0x100)) {                                                                        // 1417
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {                                               // 1418
      sub = 1                                                                                                 // 1419
    }                                                                                                         // 1420
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF                                                      // 1421
  }                                                                                                           // 1422
                                                                                                              // 1423
  return offset + byteLength                                                                                  // 1424
}                                                                                                             // 1425
                                                                                                              // 1426
Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {                                   // 1427
  value = +value                                                                                              // 1428
  offset = offset | 0                                                                                         // 1429
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)                                                // 1430
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)                                                  // 1431
  if (value < 0) value = 0xff + value + 1                                                                     // 1432
  this[offset] = (value & 0xff)                                                                               // 1433
  return offset + 1                                                                                           // 1434
}                                                                                                             // 1435
                                                                                                              // 1436
Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {                             // 1437
  value = +value                                                                                              // 1438
  offset = offset | 0                                                                                         // 1439
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)                                            // 1440
  if (Buffer.TYPED_ARRAY_SUPPORT) {                                                                           // 1441
    this[offset] = (value & 0xff)                                                                             // 1442
    this[offset + 1] = (value >>> 8)                                                                          // 1443
  } else {                                                                                                    // 1444
    objectWriteUInt16(this, value, offset, true)                                                              // 1445
  }                                                                                                           // 1446
  return offset + 2                                                                                           // 1447
}                                                                                                             // 1448
                                                                                                              // 1449
Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {                             // 1450
  value = +value                                                                                              // 1451
  offset = offset | 0                                                                                         // 1452
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)                                            // 1453
  if (Buffer.TYPED_ARRAY_SUPPORT) {                                                                           // 1454
    this[offset] = (value >>> 8)                                                                              // 1455
    this[offset + 1] = (value & 0xff)                                                                         // 1456
  } else {                                                                                                    // 1457
    objectWriteUInt16(this, value, offset, false)                                                             // 1458
  }                                                                                                           // 1459
  return offset + 2                                                                                           // 1460
}                                                                                                             // 1461
                                                                                                              // 1462
Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {                             // 1463
  value = +value                                                                                              // 1464
  offset = offset | 0                                                                                         // 1465
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)                                    // 1466
  if (Buffer.TYPED_ARRAY_SUPPORT) {                                                                           // 1467
    this[offset] = (value & 0xff)                                                                             // 1468
    this[offset + 1] = (value >>> 8)                                                                          // 1469
    this[offset + 2] = (value >>> 16)                                                                         // 1470
    this[offset + 3] = (value >>> 24)                                                                         // 1471
  } else {                                                                                                    // 1472
    objectWriteUInt32(this, value, offset, true)                                                              // 1473
  }                                                                                                           // 1474
  return offset + 4                                                                                           // 1475
}                                                                                                             // 1476
                                                                                                              // 1477
Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {                             // 1478
  value = +value                                                                                              // 1479
  offset = offset | 0                                                                                         // 1480
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)                                    // 1481
  if (value < 0) value = 0xffffffff + value + 1                                                               // 1482
  if (Buffer.TYPED_ARRAY_SUPPORT) {                                                                           // 1483
    this[offset] = (value >>> 24)                                                                             // 1484
    this[offset + 1] = (value >>> 16)                                                                         // 1485
    this[offset + 2] = (value >>> 8)                                                                          // 1486
    this[offset + 3] = (value & 0xff)                                                                         // 1487
  } else {                                                                                                    // 1488
    objectWriteUInt32(this, value, offset, false)                                                             // 1489
  }                                                                                                           // 1490
  return offset + 4                                                                                           // 1491
}                                                                                                             // 1492
                                                                                                              // 1493
function checkIEEE754 (buf, value, offset, ext, max, min) {                                                   // 1494
  if (offset + ext > buf.length) throw new RangeError('Index out of range')                                   // 1495
  if (offset < 0) throw new RangeError('Index out of range')                                                  // 1496
}                                                                                                             // 1497
                                                                                                              // 1498
function writeFloat (buf, value, offset, littleEndian, noAssert) {                                            // 1499
  if (!noAssert) {                                                                                            // 1500
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)                      // 1501
  }                                                                                                           // 1502
  ieee754.write(buf, value, offset, littleEndian, 23, 4)                                                      // 1503
  return offset + 4                                                                                           // 1504
}                                                                                                             // 1505
                                                                                                              // 1506
Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {                             // 1507
  return writeFloat(this, value, offset, true, noAssert)                                                      // 1508
}                                                                                                             // 1509
                                                                                                              // 1510
Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {                             // 1511
  return writeFloat(this, value, offset, false, noAssert)                                                     // 1512
}                                                                                                             // 1513
                                                                                                              // 1514
function writeDouble (buf, value, offset, littleEndian, noAssert) {                                           // 1515
  if (!noAssert) {                                                                                            // 1516
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)                    // 1517
  }                                                                                                           // 1518
  ieee754.write(buf, value, offset, littleEndian, 52, 8)                                                      // 1519
  return offset + 8                                                                                           // 1520
}                                                                                                             // 1521
                                                                                                              // 1522
Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {                           // 1523
  return writeDouble(this, value, offset, true, noAssert)                                                     // 1524
}                                                                                                             // 1525
                                                                                                              // 1526
Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {                           // 1527
  return writeDouble(this, value, offset, false, noAssert)                                                    // 1528
}                                                                                                             // 1529
                                                                                                              // 1530
// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)                                  // 1531
Buffer.prototype.copy = function copy (target, targetStart, start, end) {                                     // 1532
  if (!start) start = 0                                                                                       // 1533
  if (!end && end !== 0) end = this.length                                                                    // 1534
  if (targetStart >= target.length) targetStart = target.length                                               // 1535
  if (!targetStart) targetStart = 0                                                                           // 1536
  if (end > 0 && end < start) end = start                                                                     // 1537
                                                                                                              // 1538
  // Copy 0 bytes; we're done                                                                                 // 1539
  if (end === start) return 0                                                                                 // 1540
  if (target.length === 0 || this.length === 0) return 0                                                      // 1541
                                                                                                              // 1542
  // Fatal error conditions                                                                                   // 1543
  if (targetStart < 0) {                                                                                      // 1544
    throw new RangeError('targetStart out of bounds')                                                         // 1545
  }                                                                                                           // 1546
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')                    // 1547
  if (end < 0) throw new RangeError('sourceEnd out of bounds')                                                // 1548
                                                                                                              // 1549
  // Are we oob?                                                                                              // 1550
  if (end > this.length) end = this.length                                                                    // 1551
  if (target.length - targetStart < end - start) {                                                            // 1552
    end = target.length - targetStart + start                                                                 // 1553
  }                                                                                                           // 1554
                                                                                                              // 1555
  var len = end - start                                                                                       // 1556
  var i                                                                                                       // 1557
                                                                                                              // 1558
  if (this === target && start < targetStart && targetStart < end) {                                          // 1559
    // descending copy from end                                                                               // 1560
    for (i = len - 1; i >= 0; --i) {                                                                          // 1561
      target[i + targetStart] = this[i + start]                                                               // 1562
    }                                                                                                         // 1563
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {                                                     // 1564
    // ascending copy from start                                                                              // 1565
    for (i = 0; i < len; ++i) {                                                                               // 1566
      target[i + targetStart] = this[i + start]                                                               // 1567
    }                                                                                                         // 1568
  } else {                                                                                                    // 1569
    Uint8Array.prototype.set.call(                                                                            // 1570
      target,                                                                                                 // 1571
      this.subarray(start, start + len),                                                                      // 1572
      targetStart                                                                                             // 1573
    )                                                                                                         // 1574
  }                                                                                                           // 1575
                                                                                                              // 1576
  return len                                                                                                  // 1577
}                                                                                                             // 1578
                                                                                                              // 1579
// Usage:                                                                                                     // 1580
//    buffer.fill(number[, offset[, end]])                                                                    // 1581
//    buffer.fill(buffer[, offset[, end]])                                                                    // 1582
//    buffer.fill(string[, offset[, end]][, encoding])                                                        // 1583
Buffer.prototype.fill = function fill (val, start, end, encoding) {                                           // 1584
  // Handle string cases:                                                                                     // 1585
  if (typeof val === 'string') {                                                                              // 1586
    if (typeof start === 'string') {                                                                          // 1587
      encoding = start                                                                                        // 1588
      start = 0                                                                                               // 1589
      end = this.length                                                                                       // 1590
    } else if (typeof end === 'string') {                                                                     // 1591
      encoding = end                                                                                          // 1592
      end = this.length                                                                                       // 1593
    }                                                                                                         // 1594
    if (val.length === 1) {                                                                                   // 1595
      var code = val.charCodeAt(0)                                                                            // 1596
      if (code < 256) {                                                                                       // 1597
        val = code                                                                                            // 1598
      }                                                                                                       // 1599
    }                                                                                                         // 1600
    if (encoding !== undefined && typeof encoding !== 'string') {                                             // 1601
      throw new TypeError('encoding must be a string')                                                        // 1602
    }                                                                                                         // 1603
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {                                       // 1604
      throw new TypeError('Unknown encoding: ' + encoding)                                                    // 1605
    }                                                                                                         // 1606
  } else if (typeof val === 'number') {                                                                       // 1607
    val = val & 255                                                                                           // 1608
  }                                                                                                           // 1609
                                                                                                              // 1610
  // Invalid ranges are not set to a default, so can range check early.                                       // 1611
  if (start < 0 || this.length < start || this.length < end) {                                                // 1612
    throw new RangeError('Out of range index')                                                                // 1613
  }                                                                                                           // 1614
                                                                                                              // 1615
  if (end <= start) {                                                                                         // 1616
    return this                                                                                               // 1617
  }                                                                                                           // 1618
                                                                                                              // 1619
  start = start >>> 0                                                                                         // 1620
  end = end === undefined ? this.length : end >>> 0                                                           // 1621
                                                                                                              // 1622
  if (!val) val = 0                                                                                           // 1623
                                                                                                              // 1624
  var i                                                                                                       // 1625
  if (typeof val === 'number') {                                                                              // 1626
    for (i = start; i < end; ++i) {                                                                           // 1627
      this[i] = val                                                                                           // 1628
    }                                                                                                         // 1629
  } else {                                                                                                    // 1630
    var bytes = Buffer.isBuffer(val)                                                                          // 1631
      ? val                                                                                                   // 1632
      : utf8ToBytes(new Buffer(val, encoding).toString())                                                     // 1633
    var len = bytes.length                                                                                    // 1634
    for (i = 0; i < end - start; ++i) {                                                                       // 1635
      this[i + start] = bytes[i % len]                                                                        // 1636
    }                                                                                                         // 1637
  }                                                                                                           // 1638
                                                                                                              // 1639
  return this                                                                                                 // 1640
}                                                                                                             // 1641
                                                                                                              // 1642
// HELPER FUNCTIONS                                                                                           // 1643
// ================                                                                                           // 1644
                                                                                                              // 1645
var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g                                                                  // 1646
                                                                                                              // 1647
function base64clean (str) {                                                                                  // 1648
  // Node strips out invalid characters like \n and \t from the string, base64-js does not                    // 1649
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')                                                        // 1650
  // Node converts strings with length < 2 to ''                                                              // 1651
  if (str.length < 2) return ''                                                                               // 1652
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not                     // 1653
  while (str.length % 4 !== 0) {                                                                              // 1654
    str = str + '='                                                                                           // 1655
  }                                                                                                           // 1656
  return str                                                                                                  // 1657
}                                                                                                             // 1658
                                                                                                              // 1659
function stringtrim (str) {                                                                                   // 1660
  if (str.trim) return str.trim()                                                                             // 1661
  return str.replace(/^\s+|\s+$/g, '')                                                                        // 1662
}                                                                                                             // 1663
                                                                                                              // 1664
function toHex (n) {                                                                                          // 1665
  if (n < 16) return '0' + n.toString(16)                                                                     // 1666
  return n.toString(16)                                                                                       // 1667
}                                                                                                             // 1668
                                                                                                              // 1669
function utf8ToBytes (string, units) {                                                                        // 1670
  units = units || Infinity                                                                                   // 1671
  var codePoint                                                                                               // 1672
  var length = string.length                                                                                  // 1673
  var leadSurrogate = null                                                                                    // 1674
  var bytes = []                                                                                              // 1675
                                                                                                              // 1676
  for (var i = 0; i < length; ++i) {                                                                          // 1677
    codePoint = string.charCodeAt(i)                                                                          // 1678
                                                                                                              // 1679
    // is surrogate component                                                                                 // 1680
    if (codePoint > 0xD7FF && codePoint < 0xE000) {                                                           // 1681
      // last char was a lead                                                                                 // 1682
      if (!leadSurrogate) {                                                                                   // 1683
        // no lead yet                                                                                        // 1684
        if (codePoint > 0xDBFF) {                                                                             // 1685
          // unexpected trail                                                                                 // 1686
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)                                                 // 1687
          continue                                                                                            // 1688
        } else if (i + 1 === length) {                                                                        // 1689
          // unpaired lead                                                                                    // 1690
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)                                                 // 1691
          continue                                                                                            // 1692
        }                                                                                                     // 1693
                                                                                                              // 1694
        // valid lead                                                                                         // 1695
        leadSurrogate = codePoint                                                                             // 1696
                                                                                                              // 1697
        continue                                                                                              // 1698
      }                                                                                                       // 1699
                                                                                                              // 1700
      // 2 leads in a row                                                                                     // 1701
      if (codePoint < 0xDC00) {                                                                               // 1702
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)                                                   // 1703
        leadSurrogate = codePoint                                                                             // 1704
        continue                                                                                              // 1705
      }                                                                                                       // 1706
                                                                                                              // 1707
      // valid surrogate pair                                                                                 // 1708
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000                               // 1709
    } else if (leadSurrogate) {                                                                               // 1710
      // valid bmp char, but last char was a lead                                                             // 1711
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)                                                     // 1712
    }                                                                                                         // 1713
                                                                                                              // 1714
    leadSurrogate = null                                                                                      // 1715
                                                                                                              // 1716
    // encode utf8                                                                                            // 1717
    if (codePoint < 0x80) {                                                                                   // 1718
      if ((units -= 1) < 0) break                                                                             // 1719
      bytes.push(codePoint)                                                                                   // 1720
    } else if (codePoint < 0x800) {                                                                           // 1721
      if ((units -= 2) < 0) break                                                                             // 1722
      bytes.push(                                                                                             // 1723
        codePoint >> 0x6 | 0xC0,                                                                              // 1724
        codePoint & 0x3F | 0x80                                                                               // 1725
      )                                                                                                       // 1726
    } else if (codePoint < 0x10000) {                                                                         // 1727
      if ((units -= 3) < 0) break                                                                             // 1728
      bytes.push(                                                                                             // 1729
        codePoint >> 0xC | 0xE0,                                                                              // 1730
        codePoint >> 0x6 & 0x3F | 0x80,                                                                       // 1731
        codePoint & 0x3F | 0x80                                                                               // 1732
      )                                                                                                       // 1733
    } else if (codePoint < 0x110000) {                                                                        // 1734
      if ((units -= 4) < 0) break                                                                             // 1735
      bytes.push(                                                                                             // 1736
        codePoint >> 0x12 | 0xF0,                                                                             // 1737
        codePoint >> 0xC & 0x3F | 0x80,                                                                       // 1738
        codePoint >> 0x6 & 0x3F | 0x80,                                                                       // 1739
        codePoint & 0x3F | 0x80                                                                               // 1740
      )                                                                                                       // 1741
    } else {                                                                                                  // 1742
      throw new Error('Invalid code point')                                                                   // 1743
    }                                                                                                         // 1744
  }                                                                                                           // 1745
                                                                                                              // 1746
  return bytes                                                                                                // 1747
}                                                                                                             // 1748
                                                                                                              // 1749
function asciiToBytes (str) {                                                                                 // 1750
  var byteArray = []                                                                                          // 1751
  for (var i = 0; i < str.length; ++i) {                                                                      // 1752
    // Node's code seems to be doing this and not & 0x7F..                                                    // 1753
    byteArray.push(str.charCodeAt(i) & 0xFF)                                                                  // 1754
  }                                                                                                           // 1755
  return byteArray                                                                                            // 1756
}                                                                                                             // 1757
                                                                                                              // 1758
function utf16leToBytes (str, units) {                                                                        // 1759
  var c, hi, lo                                                                                               // 1760
  var byteArray = []                                                                                          // 1761
  for (var i = 0; i < str.length; ++i) {                                                                      // 1762
    if ((units -= 2) < 0) break                                                                               // 1763
                                                                                                              // 1764
    c = str.charCodeAt(i)                                                                                     // 1765
    hi = c >> 8                                                                                               // 1766
    lo = c % 256                                                                                              // 1767
    byteArray.push(lo)                                                                                        // 1768
    byteArray.push(hi)                                                                                        // 1769
  }                                                                                                           // 1770
                                                                                                              // 1771
  return byteArray                                                                                            // 1772
}                                                                                                             // 1773
                                                                                                              // 1774
function base64ToBytes (str) {                                                                                // 1775
  return base64.toByteArray(base64clean(str))                                                                 // 1776
}                                                                                                             // 1777
                                                                                                              // 1778
function blitBuffer (src, dst, offset, length) {                                                              // 1779
  for (var i = 0; i < length; ++i) {                                                                          // 1780
    if ((i + offset >= dst.length) || (i >= src.length)) break                                                // 1781
    dst[i + offset] = src[i]                                                                                  // 1782
  }                                                                                                           // 1783
  return i                                                                                                    // 1784
}                                                                                                             // 1785
                                                                                                              // 1786
function isnan (val) {                                                                                        // 1787
  return val !== val // eslint-disable-line no-self-compare                                                   // 1788
}                                                                                                             // 1789
                                                                                                              // 1790
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]},"base64-js":{"package.json":function(require,exports){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// node_modules/meteor-node-stubs/node_modules/base64-js/package.json                                         //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
exports.name = "base64-js";                                                                                   // 1
exports.version = "1.2.0";                                                                                    // 2
exports.main = "index.js";                                                                                    // 3
                                                                                                              // 4
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// node_modules/meteor-node-stubs/node_modules/base64-js/index.js                                             //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
'use strict'                                                                                                  // 1
                                                                                                              // 2
exports.byteLength = byteLength                                                                               // 3
exports.toByteArray = toByteArray                                                                             // 4
exports.fromByteArray = fromByteArray                                                                         // 5
                                                                                                              // 6
var lookup = []                                                                                               // 7
var revLookup = []                                                                                            // 8
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array                                              // 9
                                                                                                              // 10
var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'                                 // 11
for (var i = 0, len = code.length; i < len; ++i) {                                                            // 12
  lookup[i] = code[i]                                                                                         // 13
  revLookup[code.charCodeAt(i)] = i                                                                           // 14
}                                                                                                             // 15
                                                                                                              // 16
revLookup['-'.charCodeAt(0)] = 62                                                                             // 17
revLookup['_'.charCodeAt(0)] = 63                                                                             // 18
                                                                                                              // 19
function placeHoldersCount (b64) {                                                                            // 20
  var len = b64.length                                                                                        // 21
  if (len % 4 > 0) {                                                                                          // 22
    throw new Error('Invalid string. Length must be a multiple of 4')                                         // 23
  }                                                                                                           // 24
                                                                                                              // 25
  // the number of equal signs (place holders)                                                                // 26
  // if there are two placeholders, than the two characters before it                                         // 27
  // represent one byte                                                                                       // 28
  // if there is only one, then the three characters before it represent 2 bytes                              // 29
  // this is just a cheap hack to not do indexOf twice                                                        // 30
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0                                              // 31
}                                                                                                             // 32
                                                                                                              // 33
function byteLength (b64) {                                                                                   // 34
  // base64 is 4/3 + up to two characters of the original data                                                // 35
  return b64.length * 3 / 4 - placeHoldersCount(b64)                                                          // 36
}                                                                                                             // 37
                                                                                                              // 38
function toByteArray (b64) {                                                                                  // 39
  var i, j, l, tmp, placeHolders, arr                                                                         // 40
  var len = b64.length                                                                                        // 41
  placeHolders = placeHoldersCount(b64)                                                                       // 42
                                                                                                              // 43
  arr = new Arr(len * 3 / 4 - placeHolders)                                                                   // 44
                                                                                                              // 45
  // if there are placeholders, only get up to the last complete 4 chars                                      // 46
  l = placeHolders > 0 ? len - 4 : len                                                                        // 47
                                                                                                              // 48
  var L = 0                                                                                                   // 49
                                                                                                              // 50
  for (i = 0, j = 0; i < l; i += 4, j += 3) {                                                                 // 51
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF                                                                             // 53
    arr[L++] = (tmp >> 8) & 0xFF                                                                              // 54
    arr[L++] = tmp & 0xFF                                                                                     // 55
  }                                                                                                           // 56
                                                                                                              // 57
  if (placeHolders === 2) {                                                                                   // 58
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)                       // 59
    arr[L++] = tmp & 0xFF                                                                                     // 60
  } else if (placeHolders === 1) {                                                                            // 61
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF                                                                              // 63
    arr[L++] = tmp & 0xFF                                                                                     // 64
  }                                                                                                           // 65
                                                                                                              // 66
  return arr                                                                                                  // 67
}                                                                                                             // 68
                                                                                                              // 69
function tripletToBase64 (num) {                                                                              // 70
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]   // 71
}                                                                                                             // 72
                                                                                                              // 73
function encodeChunk (uint8, start, end) {                                                                    // 74
  var tmp                                                                                                     // 75
  var output = []                                                                                             // 76
  for (var i = start; i < end; i += 3) {                                                                      // 77
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])                                             // 78
    output.push(tripletToBase64(tmp))                                                                         // 79
  }                                                                                                           // 80
  return output.join('')                                                                                      // 81
}                                                                                                             // 82
                                                                                                              // 83
function fromByteArray (uint8) {                                                                              // 84
  var tmp                                                                                                     // 85
  var len = uint8.length                                                                                      // 86
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes                                             // 87
  var output = ''                                                                                             // 88
  var parts = []                                                                                              // 89
  var maxChunkLength = 16383 // must be multiple of 3                                                         // 90
                                                                                                              // 91
  // go through the array every three bytes, we'll deal with trailing stuff later                             // 92
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {                                   // 93
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))              // 94
  }                                                                                                           // 95
                                                                                                              // 96
  // pad the end with zeros, but make sure to not forget the extra bytes                                      // 97
  if (extraBytes === 1) {                                                                                     // 98
    tmp = uint8[len - 1]                                                                                      // 99
    output += lookup[tmp >> 2]                                                                                // 100
    output += lookup[(tmp << 4) & 0x3F]                                                                       // 101
    output += '=='                                                                                            // 102
  } else if (extraBytes === 2) {                                                                              // 103
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])                                                            // 104
    output += lookup[tmp >> 10]                                                                               // 105
    output += lookup[(tmp >> 4) & 0x3F]                                                                       // 106
    output += lookup[(tmp << 2) & 0x3F]                                                                       // 107
    output += '='                                                                                             // 108
  }                                                                                                           // 109
                                                                                                              // 110
  parts.push(output)                                                                                          // 111
                                                                                                              // 112
  return parts.join('')                                                                                       // 113
}                                                                                                             // 114
                                                                                                              // 115
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"ieee754":{"package.json":function(require,exports){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// node_modules/meteor-node-stubs/node_modules/ieee754/package.json                                           //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
exports.name = "ieee754";                                                                                     // 1
exports.version = "1.1.8";                                                                                    // 2
exports.main = "index.js";                                                                                    // 3
                                                                                                              // 4
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// node_modules/meteor-node-stubs/node_modules/ieee754/index.js                                               //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
exports.read = function (buffer, offset, isLE, mLen, nBytes) {                                                // 1
  var e, m                                                                                                    // 2
  var eLen = nBytes * 8 - mLen - 1                                                                            // 3
  var eMax = (1 << eLen) - 1                                                                                  // 4
  var eBias = eMax >> 1                                                                                       // 5
  var nBits = -7                                                                                              // 6
  var i = isLE ? (nBytes - 1) : 0                                                                             // 7
  var d = isLE ? -1 : 1                                                                                       // 8
  var s = buffer[offset + i]                                                                                  // 9
                                                                                                              // 10
  i += d                                                                                                      // 11
                                                                                                              // 12
  e = s & ((1 << (-nBits)) - 1)                                                                               // 13
  s >>= (-nBits)                                                                                              // 14
  nBits += eLen                                                                                               // 15
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}                                  // 16
                                                                                                              // 17
  m = e & ((1 << (-nBits)) - 1)                                                                               // 18
  e >>= (-nBits)                                                                                              // 19
  nBits += mLen                                                                                               // 20
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}                                  // 21
                                                                                                              // 22
  if (e === 0) {                                                                                              // 23
    e = 1 - eBias                                                                                             // 24
  } else if (e === eMax) {                                                                                    // 25
    return m ? NaN : ((s ? -1 : 1) * Infinity)                                                                // 26
  } else {                                                                                                    // 27
    m = m + Math.pow(2, mLen)                                                                                 // 28
    e = e - eBias                                                                                             // 29
  }                                                                                                           // 30
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)                                                             // 31
}                                                                                                             // 32
                                                                                                              // 33
exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {                                        // 34
  var e, m, c                                                                                                 // 35
  var eLen = nBytes * 8 - mLen - 1                                                                            // 36
  var eMax = (1 << eLen) - 1                                                                                  // 37
  var eBias = eMax >> 1                                                                                       // 38
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)                                            // 39
  var i = isLE ? 0 : (nBytes - 1)                                                                             // 40
  var d = isLE ? 1 : -1                                                                                       // 41
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0                                                 // 42
                                                                                                              // 43
  value = Math.abs(value)                                                                                     // 44
                                                                                                              // 45
  if (isNaN(value) || value === Infinity) {                                                                   // 46
    m = isNaN(value) ? 1 : 0                                                                                  // 47
    e = eMax                                                                                                  // 48
  } else {                                                                                                    // 49
    e = Math.floor(Math.log(value) / Math.LN2)                                                                // 50
    if (value * (c = Math.pow(2, -e)) < 1) {                                                                  // 51
      e--                                                                                                     // 52
      c *= 2                                                                                                  // 53
    }                                                                                                         // 54
    if (e + eBias >= 1) {                                                                                     // 55
      value += rt / c                                                                                         // 56
    } else {                                                                                                  // 57
      value += rt * Math.pow(2, 1 - eBias)                                                                    // 58
    }                                                                                                         // 59
    if (value * c >= 2) {                                                                                     // 60
      e++                                                                                                     // 61
      c /= 2                                                                                                  // 62
    }                                                                                                         // 63
                                                                                                              // 64
    if (e + eBias >= eMax) {                                                                                  // 65
      m = 0                                                                                                   // 66
      e = eMax                                                                                                // 67
    } else if (e + eBias >= 1) {                                                                              // 68
      m = (value * c - 1) * Math.pow(2, mLen)                                                                 // 69
      e = e + eBias                                                                                           // 70
    } else {                                                                                                  // 71
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)                                                  // 72
      e = 0                                                                                                   // 73
    }                                                                                                         // 74
  }                                                                                                           // 75
                                                                                                              // 76
  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}                            // 77
                                                                                                              // 78
  e = (e << mLen) | m                                                                                         // 79
  eLen += mLen                                                                                                // 80
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}                             // 81
                                                                                                              // 82
  buffer[offset + i - d] |= s * 128                                                                           // 83
}                                                                                                             // 84
                                                                                                              // 85
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"isarray":{"package.json":function(require,exports){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// node_modules/meteor-node-stubs/node_modules/isarray/package.json                                           //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
exports.name = "isarray";                                                                                     // 1
exports.version = "1.0.0";                                                                                    // 2
exports.main = "index.js";                                                                                    // 3
                                                                                                              // 4
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// node_modules/meteor-node-stubs/node_modules/isarray/index.js                                               //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
var toString = {}.toString;                                                                                   // 1
                                                                                                              // 2
module.exports = Array.isArray || function (arr) {                                                            // 3
  return toString.call(arr) == '[object Array]';                                                              // 4
};                                                                                                            // 5
                                                                                                              // 6
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"process":{"browser.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// node_modules/meteor-node-stubs/node_modules/process/browser.js                                             //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
// shim for using process in browser                                                                          // 1
var process = module.exports = {};                                                                            // 2
                                                                                                              // 3
// cached from whatever global is present so that test runners that stub it                                   // 4
// don't break things.  But we need to wrap it in a try catch in case it is                                   // 5
// wrapped in strict mode code which doesn't define any globals.  It's inside a                               // 6
// function because try/catches deoptimize in certain engines.                                                // 7
                                                                                                              // 8
var cachedSetTimeout;                                                                                         // 9
var cachedClearTimeout;                                                                                       // 10
                                                                                                              // 11
function defaultSetTimout() {                                                                                 // 12
    throw new Error('setTimeout has not been defined');                                                       // 13
}                                                                                                             // 14
function defaultClearTimeout () {                                                                             // 15
    throw new Error('clearTimeout has not been defined');                                                     // 16
}                                                                                                             // 17
(function () {                                                                                                // 18
    try {                                                                                                     // 19
        if (typeof setTimeout === 'function') {                                                               // 20
            cachedSetTimeout = setTimeout;                                                                    // 21
        } else {                                                                                              // 22
            cachedSetTimeout = defaultSetTimout;                                                              // 23
        }                                                                                                     // 24
    } catch (e) {                                                                                             // 25
        cachedSetTimeout = defaultSetTimout;                                                                  // 26
    }                                                                                                         // 27
    try {                                                                                                     // 28
        if (typeof clearTimeout === 'function') {                                                             // 29
            cachedClearTimeout = clearTimeout;                                                                // 30
        } else {                                                                                              // 31
            cachedClearTimeout = defaultClearTimeout;                                                         // 32
        }                                                                                                     // 33
    } catch (e) {                                                                                             // 34
        cachedClearTimeout = defaultClearTimeout;                                                             // 35
    }                                                                                                         // 36
} ())                                                                                                         // 37
function runTimeout(fun) {                                                                                    // 38
    if (cachedSetTimeout === setTimeout) {                                                                    // 39
        //normal enviroments in sane situations                                                               // 40
        return setTimeout(fun, 0);                                                                            // 41
    }                                                                                                         // 42
    // if setTimeout wasn't available but was latter defined                                                  // 43
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {                         // 44
        cachedSetTimeout = setTimeout;                                                                        // 45
        return setTimeout(fun, 0);                                                                            // 46
    }                                                                                                         // 47
    try {                                                                                                     // 48
        // when when somebody has screwed with setTimeout but no I.E. maddness                                // 49
        return cachedSetTimeout(fun, 0);                                                                      // 50
    } catch(e){                                                                                               // 51
        try {                                                                                                 // 52
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);                                                       // 54
        } catch(e){                                                                                           // 55
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);                                                       // 57
        }                                                                                                     // 58
    }                                                                                                         // 59
                                                                                                              // 60
                                                                                                              // 61
}                                                                                                             // 62
function runClearTimeout(marker) {                                                                            // 63
    if (cachedClearTimeout === clearTimeout) {                                                                // 64
        //normal enviroments in sane situations                                                               // 65
        return clearTimeout(marker);                                                                          // 66
    }                                                                                                         // 67
    // if clearTimeout wasn't available but was latter defined                                                // 68
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {                // 69
        cachedClearTimeout = clearTimeout;                                                                    // 70
        return clearTimeout(marker);                                                                          // 71
    }                                                                                                         // 72
    try {                                                                                                     // 73
        // when when somebody has screwed with setTimeout but no I.E. maddness                                // 74
        return cachedClearTimeout(marker);                                                                    // 75
    } catch (e){                                                                                              // 76
        try {                                                                                                 // 77
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);                                                     // 79
        } catch (e){                                                                                          // 80
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout                      // 82
            return cachedClearTimeout.call(this, marker);                                                     // 83
        }                                                                                                     // 84
    }                                                                                                         // 85
                                                                                                              // 86
                                                                                                              // 87
                                                                                                              // 88
}                                                                                                             // 89
var queue = [];                                                                                               // 90
var draining = false;                                                                                         // 91
var currentQueue;                                                                                             // 92
var queueIndex = -1;                                                                                          // 93
                                                                                                              // 94
function cleanUpNextTick() {                                                                                  // 95
    if (!draining || !currentQueue) {                                                                         // 96
        return;                                                                                               // 97
    }                                                                                                         // 98
    draining = false;                                                                                         // 99
    if (currentQueue.length) {                                                                                // 100
        queue = currentQueue.concat(queue);                                                                   // 101
    } else {                                                                                                  // 102
        queueIndex = -1;                                                                                      // 103
    }                                                                                                         // 104
    if (queue.length) {                                                                                       // 105
        drainQueue();                                                                                         // 106
    }                                                                                                         // 107
}                                                                                                             // 108
                                                                                                              // 109
function drainQueue() {                                                                                       // 110
    if (draining) {                                                                                           // 111
        return;                                                                                               // 112
    }                                                                                                         // 113
    var timeout = runTimeout(cleanUpNextTick);                                                                // 114
    draining = true;                                                                                          // 115
                                                                                                              // 116
    var len = queue.length;                                                                                   // 117
    while(len) {                                                                                              // 118
        currentQueue = queue;                                                                                 // 119
        queue = [];                                                                                           // 120
        while (++queueIndex < len) {                                                                          // 121
            if (currentQueue) {                                                                               // 122
                currentQueue[queueIndex].run();                                                               // 123
            }                                                                                                 // 124
        }                                                                                                     // 125
        queueIndex = -1;                                                                                      // 126
        len = queue.length;                                                                                   // 127
    }                                                                                                         // 128
    currentQueue = null;                                                                                      // 129
    draining = false;                                                                                         // 130
    runClearTimeout(timeout);                                                                                 // 131
}                                                                                                             // 132
                                                                                                              // 133
process.nextTick = function (fun) {                                                                           // 134
    var args = new Array(arguments.length - 1);                                                               // 135
    if (arguments.length > 1) {                                                                               // 136
        for (var i = 1; i < arguments.length; i++) {                                                          // 137
            args[i - 1] = arguments[i];                                                                       // 138
        }                                                                                                     // 139
    }                                                                                                         // 140
    queue.push(new Item(fun, args));                                                                          // 141
    if (queue.length === 1 && !draining) {                                                                    // 142
        runTimeout(drainQueue);                                                                               // 143
    }                                                                                                         // 144
};                                                                                                            // 145
                                                                                                              // 146
// v8 likes predictible objects                                                                               // 147
function Item(fun, array) {                                                                                   // 148
    this.fun = fun;                                                                                           // 149
    this.array = array;                                                                                       // 150
}                                                                                                             // 151
Item.prototype.run = function () {                                                                            // 152
    this.fun.apply(null, this.array);                                                                         // 153
};                                                                                                            // 154
process.title = 'browser';                                                                                    // 155
process.browser = true;                                                                                       // 156
process.env = {};                                                                                             // 157
process.argv = [];                                                                                            // 158
process.version = ''; // empty string to avoid regexp issues                                                  // 159
process.versions = {};                                                                                        // 160
                                                                                                              // 161
function noop() {}                                                                                            // 162
                                                                                                              // 163
process.on = noop;                                                                                            // 164
process.addListener = noop;                                                                                   // 165
process.once = noop;                                                                                          // 166
process.off = noop;                                                                                           // 167
process.removeListener = noop;                                                                                // 168
process.removeAllListeners = noop;                                                                            // 169
process.emit = noop;                                                                                          // 170
                                                                                                              // 171
process.binding = function (name) {                                                                           // 172
    throw new Error('process.binding is not supported');                                                      // 173
};                                                                                                            // 174
                                                                                                              // 175
process.cwd = function () { return '/' };                                                                     // 176
process.chdir = function (dir) {                                                                              // 177
    throw new Error('process.chdir is not supported');                                                        // 178
};                                                                                                            // 179
process.umask = function() { return 0; };                                                                     // 180
                                                                                                              // 181
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"domain-browser":{"package.json":function(require,exports){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// node_modules/meteor-node-stubs/node_modules/domain-browser/package.json                                    //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
exports.name = "domain-browser";                                                                              // 1
exports.version = "1.1.7";                                                                                    // 2
exports.main = "./index.js";                                                                                  // 3
                                                                                                              // 4
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":["events",function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// node_modules/meteor-node-stubs/node_modules/domain-browser/index.js                                        //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
// This file should be ES5 compatible                                                                         // 1
/* eslint prefer-spread:0, no-var:0, prefer-reflect:0, no-magic-numbers:0 */                                  // 2
'use strict'                                                                                                  // 3
module.exports = (function () {                                                                               // 4
	// Import Events                                                                                             // 5
	var events = require('events')                                                                               // 6
                                                                                                              // 7
	// Export Domain                                                                                             // 8
	var domain = {}                                                                                              // 9
	domain.createDomain = domain.create = function () {                                                          // 10
		var d = new events.EventEmitter()                                                                           // 11
                                                                                                              // 12
		function emitError (e) {                                                                                    // 13
			d.emit('error', e)                                                                                         // 14
		}                                                                                                           // 15
                                                                                                              // 16
		d.add = function (emitter) {                                                                                // 17
			emitter.on('error', emitError)                                                                             // 18
		}                                                                                                           // 19
		d.remove = function (emitter) {                                                                             // 20
			emitter.removeListener('error', emitError)                                                                 // 21
		}                                                                                                           // 22
		d.bind = function (fn) {                                                                                    // 23
			return function () {                                                                                       // 24
				var args = Array.prototype.slice.call(arguments)                                                          // 25
				try {                                                                                                     // 26
					fn.apply(null, args)                                                                                     // 27
				}                                                                                                         // 28
				catch (err) {                                                                                             // 29
					emitError(err)                                                                                           // 30
				}                                                                                                         // 31
			}                                                                                                          // 32
		}                                                                                                           // 33
		d.intercept = function (fn) {                                                                               // 34
			return function (err) {                                                                                    // 35
				if ( err ) {                                                                                              // 36
					emitError(err)                                                                                           // 37
				}                                                                                                         // 38
				else {                                                                                                    // 39
					var args = Array.prototype.slice.call(arguments, 1)                                                      // 40
					try {                                                                                                    // 41
						fn.apply(null, args)                                                                                    // 42
					}                                                                                                        // 43
					catch (err) {                                                                                            // 44
						emitError(err)                                                                                          // 45
					}                                                                                                        // 46
				}                                                                                                         // 47
			}                                                                                                          // 48
		}                                                                                                           // 49
		d.run = function (fn) {                                                                                     // 50
			try {                                                                                                      // 51
				fn()                                                                                                      // 52
			}                                                                                                          // 53
			catch (err) {                                                                                              // 54
				emitError(err)                                                                                            // 55
			}                                                                                                          // 56
			return this                                                                                                // 57
		}                                                                                                           // 58
		d.dispose = function () {                                                                                   // 59
			this.removeAllListeners()                                                                                  // 60
			return this                                                                                                // 61
		}                                                                                                           // 62
		d.enter = d.exit = function () {                                                                            // 63
			return this                                                                                                // 64
		}                                                                                                           // 65
		return d                                                                                                    // 66
	}                                                                                                            // 67
	return domain                                                                                                // 68
}).call(this)                                                                                                 // 69
                                                                                                              // 70
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]},"events":{"package.json":function(require,exports){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// node_modules/meteor-node-stubs/node_modules/events/package.json                                            //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
exports.name = "events";                                                                                      // 1
exports.version = "1.1.1";                                                                                    // 2
exports.main = "./events.js";                                                                                 // 3
                                                                                                              // 4
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"events.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// node_modules/meteor-node-stubs/node_modules/events/events.js                                               //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
// Copyright Joyent, Inc. and other Node contributors.                                                        // 1
//                                                                                                            // 2
// Permission is hereby granted, free of charge, to any person obtaining a                                    // 3
// copy of this software and associated documentation files (the                                              // 4
// "Software"), to deal in the Software without restriction, including                                        // 5
// without limitation the rights to use, copy, modify, merge, publish,                                        // 6
// distribute, sublicense, and/or sell copies of the Software, and to permit                                  // 7
// persons to whom the Software is furnished to do so, subject to the                                         // 8
// following conditions:                                                                                      // 9
//                                                                                                            // 10
// The above copyright notice and this permission notice shall be included                                    // 11
// in all copies or substantial portions of the Software.                                                     // 12
//                                                                                                            // 13
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS                                    // 14
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF                                                 // 15
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN                                  // 16
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,                                   // 17
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR                                      // 18
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE                                  // 19
// USE OR OTHER DEALINGS IN THE SOFTWARE.                                                                     // 20
                                                                                                              // 21
function EventEmitter() {                                                                                     // 22
  this._events = this._events || {};                                                                          // 23
  this._maxListeners = this._maxListeners || undefined;                                                       // 24
}                                                                                                             // 25
module.exports = EventEmitter;                                                                                // 26
                                                                                                              // 27
// Backwards-compat with node 0.10.x                                                                          // 28
EventEmitter.EventEmitter = EventEmitter;                                                                     // 29
                                                                                                              // 30
EventEmitter.prototype._events = undefined;                                                                   // 31
EventEmitter.prototype._maxListeners = undefined;                                                             // 32
                                                                                                              // 33
// By default EventEmitters will print a warning if more than 10 listeners are                                // 34
// added to it. This is a useful default which helps finding memory leaks.                                    // 35
EventEmitter.defaultMaxListeners = 10;                                                                        // 36
                                                                                                              // 37
// Obviously not all Emitters should be limited to 10. This function allows                                   // 38
// that to be increased. Set to zero for unlimited.                                                           // 39
EventEmitter.prototype.setMaxListeners = function(n) {                                                        // 40
  if (!isNumber(n) || n < 0 || isNaN(n))                                                                      // 41
    throw TypeError('n must be a positive number');                                                           // 42
  this._maxListeners = n;                                                                                     // 43
  return this;                                                                                                // 44
};                                                                                                            // 45
                                                                                                              // 46
EventEmitter.prototype.emit = function(type) {                                                                // 47
  var er, handler, len, args, i, listeners;                                                                   // 48
                                                                                                              // 49
  if (!this._events)                                                                                          // 50
    this._events = {};                                                                                        // 51
                                                                                                              // 52
  // If there is no 'error' event listener then throw.                                                        // 53
  if (type === 'error') {                                                                                     // 54
    if (!this._events.error ||                                                                                // 55
        (isObject(this._events.error) && !this._events.error.length)) {                                       // 56
      er = arguments[1];                                                                                      // 57
      if (er instanceof Error) {                                                                              // 58
        throw er; // Unhandled 'error' event                                                                  // 59
      } else {                                                                                                // 60
        // At least give some kind of context to the user                                                     // 61
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');                             // 62
        err.context = er;                                                                                     // 63
        throw err;                                                                                            // 64
      }                                                                                                       // 65
    }                                                                                                         // 66
  }                                                                                                           // 67
                                                                                                              // 68
  handler = this._events[type];                                                                               // 69
                                                                                                              // 70
  if (isUndefined(handler))                                                                                   // 71
    return false;                                                                                             // 72
                                                                                                              // 73
  if (isFunction(handler)) {                                                                                  // 74
    switch (arguments.length) {                                                                               // 75
      // fast cases                                                                                           // 76
      case 1:                                                                                                 // 77
        handler.call(this);                                                                                   // 78
        break;                                                                                                // 79
      case 2:                                                                                                 // 80
        handler.call(this, arguments[1]);                                                                     // 81
        break;                                                                                                // 82
      case 3:                                                                                                 // 83
        handler.call(this, arguments[1], arguments[2]);                                                       // 84
        break;                                                                                                // 85
      // slower                                                                                               // 86
      default:                                                                                                // 87
        args = Array.prototype.slice.call(arguments, 1);                                                      // 88
        handler.apply(this, args);                                                                            // 89
    }                                                                                                         // 90
  } else if (isObject(handler)) {                                                                             // 91
    args = Array.prototype.slice.call(arguments, 1);                                                          // 92
    listeners = handler.slice();                                                                              // 93
    len = listeners.length;                                                                                   // 94
    for (i = 0; i < len; i++)                                                                                 // 95
      listeners[i].apply(this, args);                                                                         // 96
  }                                                                                                           // 97
                                                                                                              // 98
  return true;                                                                                                // 99
};                                                                                                            // 100
                                                                                                              // 101
EventEmitter.prototype.addListener = function(type, listener) {                                               // 102
  var m;                                                                                                      // 103
                                                                                                              // 104
  if (!isFunction(listener))                                                                                  // 105
    throw TypeError('listener must be a function');                                                           // 106
                                                                                                              // 107
  if (!this._events)                                                                                          // 108
    this._events = {};                                                                                        // 109
                                                                                                              // 110
  // To avoid recursion in the case that type === "newListener"! Before                                       // 111
  // adding it to the listeners, first emit "newListener".                                                    // 112
  if (this._events.newListener)                                                                               // 113
    this.emit('newListener', type,                                                                            // 114
              isFunction(listener.listener) ?                                                                 // 115
              listener.listener : listener);                                                                  // 116
                                                                                                              // 117
  if (!this._events[type])                                                                                    // 118
    // Optimize the case of one listener. Don't need the extra array object.                                  // 119
    this._events[type] = listener;                                                                            // 120
  else if (isObject(this._events[type]))                                                                      // 121
    // If we've already got an array, just append.                                                            // 122
    this._events[type].push(listener);                                                                        // 123
  else                                                                                                        // 124
    // Adding the second element, need to change to array.                                                    // 125
    this._events[type] = [this._events[type], listener];                                                      // 126
                                                                                                              // 127
  // Check for listener leak                                                                                  // 128
  if (isObject(this._events[type]) && !this._events[type].warned) {                                           // 129
    if (!isUndefined(this._maxListeners)) {                                                                   // 130
      m = this._maxListeners;                                                                                 // 131
    } else {                                                                                                  // 132
      m = EventEmitter.defaultMaxListeners;                                                                   // 133
    }                                                                                                         // 134
                                                                                                              // 135
    if (m && m > 0 && this._events[type].length > m) {                                                        // 136
      this._events[type].warned = true;                                                                       // 137
      console.error('(node) warning: possible EventEmitter memory ' +                                         // 138
                    'leak detected. %d listeners added. ' +                                                   // 139
                    'Use emitter.setMaxListeners() to increase limit.',                                       // 140
                    this._events[type].length);                                                               // 141
      if (typeof console.trace === 'function') {                                                              // 142
        // not supported in IE 10                                                                             // 143
        console.trace();                                                                                      // 144
      }                                                                                                       // 145
    }                                                                                                         // 146
  }                                                                                                           // 147
                                                                                                              // 148
  return this;                                                                                                // 149
};                                                                                                            // 150
                                                                                                              // 151
EventEmitter.prototype.on = EventEmitter.prototype.addListener;                                               // 152
                                                                                                              // 153
EventEmitter.prototype.once = function(type, listener) {                                                      // 154
  if (!isFunction(listener))                                                                                  // 155
    throw TypeError('listener must be a function');                                                           // 156
                                                                                                              // 157
  var fired = false;                                                                                          // 158
                                                                                                              // 159
  function g() {                                                                                              // 160
    this.removeListener(type, g);                                                                             // 161
                                                                                                              // 162
    if (!fired) {                                                                                             // 163
      fired = true;                                                                                           // 164
      listener.apply(this, arguments);                                                                        // 165
    }                                                                                                         // 166
  }                                                                                                           // 167
                                                                                                              // 168
  g.listener = listener;                                                                                      // 169
  this.on(type, g);                                                                                           // 170
                                                                                                              // 171
  return this;                                                                                                // 172
};                                                                                                            // 173
                                                                                                              // 174
// emits a 'removeListener' event iff the listener was removed                                                // 175
EventEmitter.prototype.removeListener = function(type, listener) {                                            // 176
  var list, position, length, i;                                                                              // 177
                                                                                                              // 178
  if (!isFunction(listener))                                                                                  // 179
    throw TypeError('listener must be a function');                                                           // 180
                                                                                                              // 181
  if (!this._events || !this._events[type])                                                                   // 182
    return this;                                                                                              // 183
                                                                                                              // 184
  list = this._events[type];                                                                                  // 185
  length = list.length;                                                                                       // 186
  position = -1;                                                                                              // 187
                                                                                                              // 188
  if (list === listener ||                                                                                    // 189
      (isFunction(list.listener) && list.listener === listener)) {                                            // 190
    delete this._events[type];                                                                                // 191
    if (this._events.removeListener)                                                                          // 192
      this.emit('removeListener', type, listener);                                                            // 193
                                                                                                              // 194
  } else if (isObject(list)) {                                                                                // 195
    for (i = length; i-- > 0;) {                                                                              // 196
      if (list[i] === listener ||                                                                             // 197
          (list[i].listener && list[i].listener === listener)) {                                              // 198
        position = i;                                                                                         // 199
        break;                                                                                                // 200
      }                                                                                                       // 201
    }                                                                                                         // 202
                                                                                                              // 203
    if (position < 0)                                                                                         // 204
      return this;                                                                                            // 205
                                                                                                              // 206
    if (list.length === 1) {                                                                                  // 207
      list.length = 0;                                                                                        // 208
      delete this._events[type];                                                                              // 209
    } else {                                                                                                  // 210
      list.splice(position, 1);                                                                               // 211
    }                                                                                                         // 212
                                                                                                              // 213
    if (this._events.removeListener)                                                                          // 214
      this.emit('removeListener', type, listener);                                                            // 215
  }                                                                                                           // 216
                                                                                                              // 217
  return this;                                                                                                // 218
};                                                                                                            // 219
                                                                                                              // 220
EventEmitter.prototype.removeAllListeners = function(type) {                                                  // 221
  var key, listeners;                                                                                         // 222
                                                                                                              // 223
  if (!this._events)                                                                                          // 224
    return this;                                                                                              // 225
                                                                                                              // 226
  // not listening for removeListener, no need to emit                                                        // 227
  if (!this._events.removeListener) {                                                                         // 228
    if (arguments.length === 0)                                                                               // 229
      this._events = {};                                                                                      // 230
    else if (this._events[type])                                                                              // 231
      delete this._events[type];                                                                              // 232
    return this;                                                                                              // 233
  }                                                                                                           // 234
                                                                                                              // 235
  // emit removeListener for all listeners on all events                                                      // 236
  if (arguments.length === 0) {                                                                               // 237
    for (key in this._events) {                                                                               // 238
      if (key === 'removeListener') continue;                                                                 // 239
      this.removeAllListeners(key);                                                                           // 240
    }                                                                                                         // 241
    this.removeAllListeners('removeListener');                                                                // 242
    this._events = {};                                                                                        // 243
    return this;                                                                                              // 244
  }                                                                                                           // 245
                                                                                                              // 246
  listeners = this._events[type];                                                                             // 247
                                                                                                              // 248
  if (isFunction(listeners)) {                                                                                // 249
    this.removeListener(type, listeners);                                                                     // 250
  } else if (listeners) {                                                                                     // 251
    // LIFO order                                                                                             // 252
    while (listeners.length)                                                                                  // 253
      this.removeListener(type, listeners[listeners.length - 1]);                                             // 254
  }                                                                                                           // 255
  delete this._events[type];                                                                                  // 256
                                                                                                              // 257
  return this;                                                                                                // 258
};                                                                                                            // 259
                                                                                                              // 260
EventEmitter.prototype.listeners = function(type) {                                                           // 261
  var ret;                                                                                                    // 262
  if (!this._events || !this._events[type])                                                                   // 263
    ret = [];                                                                                                 // 264
  else if (isFunction(this._events[type]))                                                                    // 265
    ret = [this._events[type]];                                                                               // 266
  else                                                                                                        // 267
    ret = this._events[type].slice();                                                                         // 268
  return ret;                                                                                                 // 269
};                                                                                                            // 270
                                                                                                              // 271
EventEmitter.prototype.listenerCount = function(type) {                                                       // 272
  if (this._events) {                                                                                         // 273
    var evlistener = this._events[type];                                                                      // 274
                                                                                                              // 275
    if (isFunction(evlistener))                                                                               // 276
      return 1;                                                                                               // 277
    else if (evlistener)                                                                                      // 278
      return evlistener.length;                                                                               // 279
  }                                                                                                           // 280
  return 0;                                                                                                   // 281
};                                                                                                            // 282
                                                                                                              // 283
EventEmitter.listenerCount = function(emitter, type) {                                                        // 284
  return emitter.listenerCount(type);                                                                         // 285
};                                                                                                            // 286
                                                                                                              // 287
function isFunction(arg) {                                                                                    // 288
  return typeof arg === 'function';                                                                           // 289
}                                                                                                             // 290
                                                                                                              // 291
function isNumber(arg) {                                                                                      // 292
  return typeof arg === 'number';                                                                             // 293
}                                                                                                             // 294
                                                                                                              // 295
function isObject(arg) {                                                                                      // 296
  return typeof arg === 'object' && arg !== null;                                                             // 297
}                                                                                                             // 298
                                                                                                              // 299
function isUndefined(arg) {                                                                                   // 300
  return arg === void 0;                                                                                      // 301
}                                                                                                             // 302
                                                                                                              // 303
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}},"babel-runtime":{"regenerator":{"index.js":["regenerator-runtime",function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// node_modules/babel-runtime/regenerator/index.js                                                            //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
module.exports = require("regenerator-runtime");                                                              // 1
                                                                                                              // 2
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]}},"regenerator-runtime":{"package.json":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// node_modules/regenerator-runtime/package.json                                                              //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
exports.name = "regenerator-runtime";                                                                         // 1
exports.version = "0.9.6";                                                                                    // 2
exports.main = "runtime-module.js";                                                                           // 3
                                                                                                              // 4
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"runtime-module.js":["./runtime",function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// node_modules/regenerator-runtime/runtime-module.js                                                         //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
// This method of obtaining a reference to the global object needs to be                                      // 1
// kept identical to the way it is obtained in runtime.js                                                     // 2
var g =                                                                                                       // 3
  typeof global === "object" ? global :                                                                       // 4
  typeof window === "object" ? window :                                                                       // 5
  typeof self === "object" ? self : this;                                                                     // 6
                                                                                                              // 7
// Use `getOwnPropertyNames` because not all browsers support calling                                         // 8
// `hasOwnProperty` on the global `self` object in a worker. See #183.                                        // 9
var hadRuntime = g.regeneratorRuntime &&                                                                      // 10
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;                                           // 11
                                                                                                              // 12
// Save the old regeneratorRuntime in case it needs to be restored later.                                     // 13
var oldRuntime = hadRuntime && g.regeneratorRuntime;                                                          // 14
                                                                                                              // 15
// Force reevalutation of runtime.js.                                                                         // 16
g.regeneratorRuntime = undefined;                                                                             // 17
                                                                                                              // 18
module.exports = require("./runtime");                                                                        // 19
                                                                                                              // 20
if (hadRuntime) {                                                                                             // 21
  // Restore the original runtime.                                                                            // 22
  g.regeneratorRuntime = oldRuntime;                                                                          // 23
} else {                                                                                                      // 24
  // Remove the global property added by runtime.js.                                                          // 25
  try {                                                                                                       // 26
    delete g.regeneratorRuntime;                                                                              // 27
  } catch(e) {                                                                                                // 28
    g.regeneratorRuntime = undefined;                                                                         // 29
  }                                                                                                           // 30
}                                                                                                             // 31
                                                                                                              // 32
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"runtime.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// node_modules/regenerator-runtime/runtime.js                                                                //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
/**                                                                                                           // 1
 * Copyright (c) 2014, Facebook, Inc.                                                                         // 2
 * All rights reserved.                                                                                       // 3
 *                                                                                                            // 4
 * This source code is licensed under the BSD-style license found in the                                      // 5
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An                                        // 6
 * additional grant of patent rights can be found in the PATENTS file in                                      // 7
 * the same directory.                                                                                        // 8
 */                                                                                                           // 9
                                                                                                              // 10
!(function(global) {                                                                                          // 11
  "use strict";                                                                                               // 12
                                                                                                              // 13
  var hasOwn = Object.prototype.hasOwnProperty;                                                               // 14
  var undefined; // More compressible than void 0.                                                            // 15
  var $Symbol = typeof Symbol === "function" ? Symbol : {};                                                   // 16
  var iteratorSymbol = $Symbol.iterator || "@@iterator";                                                      // 17
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";                                             // 18
                                                                                                              // 19
  var inModule = typeof module === "object";                                                                  // 20
  var runtime = global.regeneratorRuntime;                                                                    // 21
  if (runtime) {                                                                                              // 22
    if (inModule) {                                                                                           // 23
      // If regeneratorRuntime is defined globally and we're in a module,                                     // 24
      // make the exports object identical to regeneratorRuntime.                                             // 25
      module.exports = runtime;                                                                               // 26
    }                                                                                                         // 27
    // Don't bother evaluating the rest of this file if the runtime was                                       // 28
    // already defined globally.                                                                              // 29
    return;                                                                                                   // 30
  }                                                                                                           // 31
                                                                                                              // 32
  // Define the runtime globally (as expected by generated code) as either                                    // 33
  // module.exports (if we're in a module) or a new, empty object.                                            // 34
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};                                       // 35
                                                                                                              // 36
  function wrap(innerFn, outerFn, self, tryLocsList) {                                                        // 37
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;             // 39
    var generator = Object.create(protoGenerator.prototype);                                                  // 40
    var context = new Context(tryLocsList || []);                                                             // 41
                                                                                                              // 42
    // The ._invoke method unifies the implementations of the .next,                                          // 43
    // .throw, and .return methods.                                                                           // 44
    generator._invoke = makeInvokeMethod(innerFn, self, context);                                             // 45
                                                                                                              // 46
    return generator;                                                                                         // 47
  }                                                                                                           // 48
  runtime.wrap = wrap;                                                                                        // 49
                                                                                                              // 50
  // Try/catch helper to minimize deoptimizations. Returns a completion                                       // 51
  // record like context.tryEntries[i].completion. This interface could                                       // 52
  // have been (and was previously) designed to take a closure to be                                          // 53
  // invoked without arguments, but in all the cases we care about we                                         // 54
  // already have an existing method we want to call, so there's no need                                      // 55
  // to create a new function object. We can even get away with assuming                                      // 56
  // the method takes exactly one argument, since that happens to be true                                     // 57
  // in every case, so we don't have to touch the arguments object. The                                       // 58
  // only additional allocation required is the completion record, which                                      // 59
  // has a stable shape and so hopefully should be cheap to allocate.                                         // 60
  function tryCatch(fn, obj, arg) {                                                                           // 61
    try {                                                                                                     // 62
      return { type: "normal", arg: fn.call(obj, arg) };                                                      // 63
    } catch (err) {                                                                                           // 64
      return { type: "throw", arg: err };                                                                     // 65
    }                                                                                                         // 66
  }                                                                                                           // 67
                                                                                                              // 68
  var GenStateSuspendedStart = "suspendedStart";                                                              // 69
  var GenStateSuspendedYield = "suspendedYield";                                                              // 70
  var GenStateExecuting = "executing";                                                                        // 71
  var GenStateCompleted = "completed";                                                                        // 72
                                                                                                              // 73
  // Returning this object from the innerFn has the same effect as                                            // 74
  // breaking out of the dispatch switch statement.                                                           // 75
  var ContinueSentinel = {};                                                                                  // 76
                                                                                                              // 77
  // Dummy constructor functions that we use as the .constructor and                                          // 78
  // .constructor.prototype properties for functions that return Generator                                    // 79
  // objects. For full spec compliance, you may wish to configure your                                        // 80
  // minifier not to mangle the names of these two functions.                                                 // 81
  function Generator() {}                                                                                     // 82
  function GeneratorFunction() {}                                                                             // 83
  function GeneratorFunctionPrototype() {}                                                                    // 84
                                                                                                              // 85
  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype;                                        // 86
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;                                  // 87
  GeneratorFunctionPrototype.constructor = GeneratorFunction;                                                 // 88
  GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction";        // 89
                                                                                                              // 90
  // Helper for defining the .next, .throw, and .return methods of the                                        // 91
  // Iterator interface in terms of a single ._invoke method.                                                 // 92
  function defineIteratorMethods(prototype) {                                                                 // 93
    ["next", "throw", "return"].forEach(function(method) {                                                    // 94
      prototype[method] = function(arg) {                                                                     // 95
        return this._invoke(method, arg);                                                                     // 96
      };                                                                                                      // 97
    });                                                                                                       // 98
  }                                                                                                           // 99
                                                                                                              // 100
  runtime.isGeneratorFunction = function(genFun) {                                                            // 101
    var ctor = typeof genFun === "function" && genFun.constructor;                                            // 102
    return ctor                                                                                               // 103
      ? ctor === GeneratorFunction ||                                                                         // 104
        // For the native GeneratorFunction constructor, the best we can                                      // 105
        // do is to check its .name property.                                                                 // 106
        (ctor.displayName || ctor.name) === "GeneratorFunction"                                               // 107
      : false;                                                                                                // 108
  };                                                                                                          // 109
                                                                                                              // 110
  runtime.mark = function(genFun) {                                                                           // 111
    if (Object.setPrototypeOf) {                                                                              // 112
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);                                              // 113
    } else {                                                                                                  // 114
      genFun.__proto__ = GeneratorFunctionPrototype;                                                          // 115
      if (!(toStringTagSymbol in genFun)) {                                                                   // 116
        genFun[toStringTagSymbol] = "GeneratorFunction";                                                      // 117
      }                                                                                                       // 118
    }                                                                                                         // 119
    genFun.prototype = Object.create(Gp);                                                                     // 120
    return genFun;                                                                                            // 121
  };                                                                                                          // 122
                                                                                                              // 123
  // Within the body of any async function, `await x` is transformed to                                       // 124
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test                                        // 125
  // `value instanceof AwaitArgument` to determine if the yielded value is                                    // 126
  // meant to be awaited. Some may consider the name of this method too                                       // 127
  // cutesy, but they are curmudgeons.                                                                        // 128
  runtime.awrap = function(arg) {                                                                             // 129
    return new AwaitArgument(arg);                                                                            // 130
  };                                                                                                          // 131
                                                                                                              // 132
  function AwaitArgument(arg) {                                                                               // 133
    this.arg = arg;                                                                                           // 134
  }                                                                                                           // 135
                                                                                                              // 136
  function AsyncIterator(generator) {                                                                         // 137
    function invoke(method, arg, resolve, reject) {                                                           // 138
      var record = tryCatch(generator[method], generator, arg);                                               // 139
      if (record.type === "throw") {                                                                          // 140
        reject(record.arg);                                                                                   // 141
      } else {                                                                                                // 142
        var result = record.arg;                                                                              // 143
        var value = result.value;                                                                             // 144
        if (value instanceof AwaitArgument) {                                                                 // 145
          return Promise.resolve(value.arg).then(function(value) {                                            // 146
            invoke("next", value, resolve, reject);                                                           // 147
          }, function(err) {                                                                                  // 148
            invoke("throw", err, resolve, reject);                                                            // 149
          });                                                                                                 // 150
        }                                                                                                     // 151
                                                                                                              // 152
        return Promise.resolve(value).then(function(unwrapped) {                                              // 153
          // When a yielded Promise is resolved, its final value becomes                                      // 154
          // the .value of the Promise<{value,done}> result for the                                           // 155
          // current iteration. If the Promise is rejected, however, the                                      // 156
          // result for this iteration will be rejected with the same                                         // 157
          // reason. Note that rejections of yielded Promises are not                                         // 158
          // thrown back into the generator function, as is the case                                          // 159
          // when an awaited Promise is rejected. This difference in                                          // 160
          // behavior between yield and await is important, because it                                        // 161
          // allows the consumer to decide what to do with the yielded                                        // 162
          // rejection (swallow it and continue, manually .throw it back                                      // 163
          // into the generator, abandon iteration, whatever). With                                           // 164
          // await, by contrast, there is no opportunity to examine the                                       // 165
          // rejection reason outside the generator function, so the                                          // 166
          // only option is to throw it from the await expression, and                                        // 167
          // let the generator function handle the exception.                                                 // 168
          result.value = unwrapped;                                                                           // 169
          resolve(result);                                                                                    // 170
        }, reject);                                                                                           // 171
      }                                                                                                       // 172
    }                                                                                                         // 173
                                                                                                              // 174
    if (typeof process === "object" && process.domain) {                                                      // 175
      invoke = process.domain.bind(invoke);                                                                   // 176
    }                                                                                                         // 177
                                                                                                              // 178
    var previousPromise;                                                                                      // 179
                                                                                                              // 180
    function enqueue(method, arg) {                                                                           // 181
      function callInvokeWithMethodAndArg() {                                                                 // 182
        return new Promise(function(resolve, reject) {                                                        // 183
          invoke(method, arg, resolve, reject);                                                               // 184
        });                                                                                                   // 185
      }                                                                                                       // 186
                                                                                                              // 187
      return previousPromise =                                                                                // 188
        // If enqueue has been called before, then we want to wait until                                      // 189
        // all previous Promises have been resolved before calling invoke,                                    // 190
        // so that results are always delivered in the correct order. If                                      // 191
        // enqueue has not been called before, then it is important to                                        // 192
        // call invoke immediately, without waiting on a callback to fire,                                    // 193
        // so that the async generator function has the opportunity to do                                     // 194
        // any necessary setup in a predictable way. This predictability                                      // 195
        // is why the Promise constructor synchronously invokes its                                           // 196
        // executor callback, and why async functions synchronously                                           // 197
        // execute code before the first await. Since we implement simple                                     // 198
        // async functions in terms of async generators, it is especially                                     // 199
        // important to get this right, even though it requires care.                                         // 200
        previousPromise ? previousPromise.then(                                                               // 201
          callInvokeWithMethodAndArg,                                                                         // 202
          // Avoid propagating failures to Promises returned by later                                         // 203
          // invocations of the iterator.                                                                     // 204
          callInvokeWithMethodAndArg                                                                          // 205
        ) : callInvokeWithMethodAndArg();                                                                     // 206
    }                                                                                                         // 207
                                                                                                              // 208
    // Define the unified helper method that is used to implement .next,                                      // 209
    // .throw, and .return (see defineIteratorMethods).                                                       // 210
    this._invoke = enqueue;                                                                                   // 211
  }                                                                                                           // 212
                                                                                                              // 213
  defineIteratorMethods(AsyncIterator.prototype);                                                             // 214
                                                                                                              // 215
  // Note that simple async functions are implemented on top of                                               // 216
  // AsyncIterator objects; they just return a Promise for the value of                                       // 217
  // the final result produced by the iterator.                                                               // 218
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {                                             // 219
    var iter = new AsyncIterator(                                                                             // 220
      wrap(innerFn, outerFn, self, tryLocsList)                                                               // 221
    );                                                                                                        // 222
                                                                                                              // 223
    return runtime.isGeneratorFunction(outerFn)                                                               // 224
      ? iter // If outerFn is a generator, return the full iterator.                                          // 225
      : iter.next().then(function(result) {                                                                   // 226
          return result.done ? result.value : iter.next();                                                    // 227
        });                                                                                                   // 228
  };                                                                                                          // 229
                                                                                                              // 230
  function makeInvokeMethod(innerFn, self, context) {                                                         // 231
    var state = GenStateSuspendedStart;                                                                       // 232
                                                                                                              // 233
    return function invoke(method, arg) {                                                                     // 234
      if (state === GenStateExecuting) {                                                                      // 235
        throw new Error("Generator is already running");                                                      // 236
      }                                                                                                       // 237
                                                                                                              // 238
      if (state === GenStateCompleted) {                                                                      // 239
        if (method === "throw") {                                                                             // 240
          throw arg;                                                                                          // 241
        }                                                                                                     // 242
                                                                                                              // 243
        // Be forgiving, per 25.3.3.3.3 of the spec:                                                          // 244
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume                          // 245
        return doneResult();                                                                                  // 246
      }                                                                                                       // 247
                                                                                                              // 248
      while (true) {                                                                                          // 249
        var delegate = context.delegate;                                                                      // 250
        if (delegate) {                                                                                       // 251
          if (method === "return" ||                                                                          // 252
              (method === "throw" && delegate.iterator[method] === undefined)) {                              // 253
            // A return or throw (when the delegate iterator has no throw                                     // 254
            // method) always terminates the yield* loop.                                                     // 255
            context.delegate = null;                                                                          // 256
                                                                                                              // 257
            // If the delegate iterator has a return method, give it a                                        // 258
            // chance to clean up.                                                                            // 259
            var returnMethod = delegate.iterator["return"];                                                   // 260
            if (returnMethod) {                                                                               // 261
              var record = tryCatch(returnMethod, delegate.iterator, arg);                                    // 262
              if (record.type === "throw") {                                                                  // 263
                // If the return method threw an exception, let that                                          // 264
                // exception prevail over the original return or throw.                                       // 265
                method = "throw";                                                                             // 266
                arg = record.arg;                                                                             // 267
                continue;                                                                                     // 268
              }                                                                                               // 269
            }                                                                                                 // 270
                                                                                                              // 271
            if (method === "return") {                                                                        // 272
              // Continue with the outer return, now that the delegate                                        // 273
              // iterator has been terminated.                                                                // 274
              continue;                                                                                       // 275
            }                                                                                                 // 276
          }                                                                                                   // 277
                                                                                                              // 278
          var record = tryCatch(                                                                              // 279
            delegate.iterator[method],                                                                        // 280
            delegate.iterator,                                                                                // 281
            arg                                                                                               // 282
          );                                                                                                  // 283
                                                                                                              // 284
          if (record.type === "throw") {                                                                      // 285
            context.delegate = null;                                                                          // 286
                                                                                                              // 287
            // Like returning generator.throw(uncaught), but without the                                      // 288
            // overhead of an extra function call.                                                            // 289
            method = "throw";                                                                                 // 290
            arg = record.arg;                                                                                 // 291
            continue;                                                                                         // 292
          }                                                                                                   // 293
                                                                                                              // 294
          // Delegate generator ran and handled its own exceptions so                                         // 295
          // regardless of what the method was, we continue as if it is                                       // 296
          // "next" with an undefined arg.                                                                    // 297
          method = "next";                                                                                    // 298
          arg = undefined;                                                                                    // 299
                                                                                                              // 300
          var info = record.arg;                                                                              // 301
          if (info.done) {                                                                                    // 302
            context[delegate.resultName] = info.value;                                                        // 303
            context.next = delegate.nextLoc;                                                                  // 304
          } else {                                                                                            // 305
            state = GenStateSuspendedYield;                                                                   // 306
            return info;                                                                                      // 307
          }                                                                                                   // 308
                                                                                                              // 309
          context.delegate = null;                                                                            // 310
        }                                                                                                     // 311
                                                                                                              // 312
        if (method === "next") {                                                                              // 313
          // Setting context._sent for legacy support of Babel's                                              // 314
          // function.sent implementation.                                                                    // 315
          context.sent = context._sent = arg;                                                                 // 316
                                                                                                              // 317
        } else if (method === "throw") {                                                                      // 318
          if (state === GenStateSuspendedStart) {                                                             // 319
            state = GenStateCompleted;                                                                        // 320
            throw arg;                                                                                        // 321
          }                                                                                                   // 322
                                                                                                              // 323
          if (context.dispatchException(arg)) {                                                               // 324
            // If the dispatched exception was caught by a catch block,                                       // 325
            // then let that catch block handle the exception normally.                                       // 326
            method = "next";                                                                                  // 327
            arg = undefined;                                                                                  // 328
          }                                                                                                   // 329
                                                                                                              // 330
        } else if (method === "return") {                                                                     // 331
          context.abrupt("return", arg);                                                                      // 332
        }                                                                                                     // 333
                                                                                                              // 334
        state = GenStateExecuting;                                                                            // 335
                                                                                                              // 336
        var record = tryCatch(innerFn, self, context);                                                        // 337
        if (record.type === "normal") {                                                                       // 338
          // If an exception is thrown from innerFn, we leave state ===                                       // 339
          // GenStateExecuting and loop back for another invocation.                                          // 340
          state = context.done                                                                                // 341
            ? GenStateCompleted                                                                               // 342
            : GenStateSuspendedYield;                                                                         // 343
                                                                                                              // 344
          var info = {                                                                                        // 345
            value: record.arg,                                                                                // 346
            done: context.done                                                                                // 347
          };                                                                                                  // 348
                                                                                                              // 349
          if (record.arg === ContinueSentinel) {                                                              // 350
            if (context.delegate && method === "next") {                                                      // 351
              // Deliberately forget the last sent value so that we don't                                     // 352
              // accidentally pass it on to the delegate.                                                     // 353
              arg = undefined;                                                                                // 354
            }                                                                                                 // 355
          } else {                                                                                            // 356
            return info;                                                                                      // 357
          }                                                                                                   // 358
                                                                                                              // 359
        } else if (record.type === "throw") {                                                                 // 360
          state = GenStateCompleted;                                                                          // 361
          // Dispatch the exception by looping back around to the                                             // 362
          // context.dispatchException(arg) call above.                                                       // 363
          method = "throw";                                                                                   // 364
          arg = record.arg;                                                                                   // 365
        }                                                                                                     // 366
      }                                                                                                       // 367
    };                                                                                                        // 368
  }                                                                                                           // 369
                                                                                                              // 370
  // Define Generator.prototype.{next,throw,return} in terms of the                                           // 371
  // unified ._invoke helper method.                                                                          // 372
  defineIteratorMethods(Gp);                                                                                  // 373
                                                                                                              // 374
  Gp[iteratorSymbol] = function() {                                                                           // 375
    return this;                                                                                              // 376
  };                                                                                                          // 377
                                                                                                              // 378
  Gp[toStringTagSymbol] = "Generator";                                                                        // 379
                                                                                                              // 380
  Gp.toString = function() {                                                                                  // 381
    return "[object Generator]";                                                                              // 382
  };                                                                                                          // 383
                                                                                                              // 384
  function pushTryEntry(locs) {                                                                               // 385
    var entry = { tryLoc: locs[0] };                                                                          // 386
                                                                                                              // 387
    if (1 in locs) {                                                                                          // 388
      entry.catchLoc = locs[1];                                                                               // 389
    }                                                                                                         // 390
                                                                                                              // 391
    if (2 in locs) {                                                                                          // 392
      entry.finallyLoc = locs[2];                                                                             // 393
      entry.afterLoc = locs[3];                                                                               // 394
    }                                                                                                         // 395
                                                                                                              // 396
    this.tryEntries.push(entry);                                                                              // 397
  }                                                                                                           // 398
                                                                                                              // 399
  function resetTryEntry(entry) {                                                                             // 400
    var record = entry.completion || {};                                                                      // 401
    record.type = "normal";                                                                                   // 402
    delete record.arg;                                                                                        // 403
    entry.completion = record;                                                                                // 404
  }                                                                                                           // 405
                                                                                                              // 406
  function Context(tryLocsList) {                                                                             // 407
    // The root entry object (effectively a try statement without a catch                                     // 408
    // or a finally block) gives us a place to store values thrown from                                       // 409
    // locations where there is no enclosing try statement.                                                   // 410
    this.tryEntries = [{ tryLoc: "root" }];                                                                   // 411
    tryLocsList.forEach(pushTryEntry, this);                                                                  // 412
    this.reset(true);                                                                                         // 413
  }                                                                                                           // 414
                                                                                                              // 415
  runtime.keys = function(object) {                                                                           // 416
    var keys = [];                                                                                            // 417
    for (var key in object) {                                                                                 // 418
      keys.push(key);                                                                                         // 419
    }                                                                                                         // 420
    keys.reverse();                                                                                           // 421
                                                                                                              // 422
    // Rather than returning an object with a next method, we keep                                            // 423
    // things simple and return the next function itself.                                                     // 424
    return function next() {                                                                                  // 425
      while (keys.length) {                                                                                   // 426
        var key = keys.pop();                                                                                 // 427
        if (key in object) {                                                                                  // 428
          next.value = key;                                                                                   // 429
          next.done = false;                                                                                  // 430
          return next;                                                                                        // 431
        }                                                                                                     // 432
      }                                                                                                       // 433
                                                                                                              // 434
      // To avoid creating an additional object, we just hang the .value                                      // 435
      // and .done properties off the next function object itself. This                                       // 436
      // also ensures that the minifier will not anonymize the function.                                      // 437
      next.done = true;                                                                                       // 438
      return next;                                                                                            // 439
    };                                                                                                        // 440
  };                                                                                                          // 441
                                                                                                              // 442
  function values(iterable) {                                                                                 // 443
    if (iterable) {                                                                                           // 444
      var iteratorMethod = iterable[iteratorSymbol];                                                          // 445
      if (iteratorMethod) {                                                                                   // 446
        return iteratorMethod.call(iterable);                                                                 // 447
      }                                                                                                       // 448
                                                                                                              // 449
      if (typeof iterable.next === "function") {                                                              // 450
        return iterable;                                                                                      // 451
      }                                                                                                       // 452
                                                                                                              // 453
      if (!isNaN(iterable.length)) {                                                                          // 454
        var i = -1, next = function next() {                                                                  // 455
          while (++i < iterable.length) {                                                                     // 456
            if (hasOwn.call(iterable, i)) {                                                                   // 457
              next.value = iterable[i];                                                                       // 458
              next.done = false;                                                                              // 459
              return next;                                                                                    // 460
            }                                                                                                 // 461
          }                                                                                                   // 462
                                                                                                              // 463
          next.value = undefined;                                                                             // 464
          next.done = true;                                                                                   // 465
                                                                                                              // 466
          return next;                                                                                        // 467
        };                                                                                                    // 468
                                                                                                              // 469
        return next.next = next;                                                                              // 470
      }                                                                                                       // 471
    }                                                                                                         // 472
                                                                                                              // 473
    // Return an iterator with no values.                                                                     // 474
    return { next: doneResult };                                                                              // 475
  }                                                                                                           // 476
  runtime.values = values;                                                                                    // 477
                                                                                                              // 478
  function doneResult() {                                                                                     // 479
    return { value: undefined, done: true };                                                                  // 480
  }                                                                                                           // 481
                                                                                                              // 482
  Context.prototype = {                                                                                       // 483
    constructor: Context,                                                                                     // 484
                                                                                                              // 485
    reset: function(skipTempReset) {                                                                          // 486
      this.prev = 0;                                                                                          // 487
      this.next = 0;                                                                                          // 488
      // Resetting context._sent for legacy support of Babel's                                                // 489
      // function.sent implementation.                                                                        // 490
      this.sent = this._sent = undefined;                                                                     // 491
      this.done = false;                                                                                      // 492
      this.delegate = null;                                                                                   // 493
                                                                                                              // 494
      this.tryEntries.forEach(resetTryEntry);                                                                 // 495
                                                                                                              // 496
      if (!skipTempReset) {                                                                                   // 497
        for (var name in this) {                                                                              // 498
          // Not sure about the optimal order of these conditions:                                            // 499
          if (name.charAt(0) === "t" &&                                                                       // 500
              hasOwn.call(this, name) &&                                                                      // 501
              !isNaN(+name.slice(1))) {                                                                       // 502
            this[name] = undefined;                                                                           // 503
          }                                                                                                   // 504
        }                                                                                                     // 505
      }                                                                                                       // 506
    },                                                                                                        // 507
                                                                                                              // 508
    stop: function() {                                                                                        // 509
      this.done = true;                                                                                       // 510
                                                                                                              // 511
      var rootEntry = this.tryEntries[0];                                                                     // 512
      var rootRecord = rootEntry.completion;                                                                  // 513
      if (rootRecord.type === "throw") {                                                                      // 514
        throw rootRecord.arg;                                                                                 // 515
      }                                                                                                       // 516
                                                                                                              // 517
      return this.rval;                                                                                       // 518
    },                                                                                                        // 519
                                                                                                              // 520
    dispatchException: function(exception) {                                                                  // 521
      if (this.done) {                                                                                        // 522
        throw exception;                                                                                      // 523
      }                                                                                                       // 524
                                                                                                              // 525
      var context = this;                                                                                     // 526
      function handle(loc, caught) {                                                                          // 527
        record.type = "throw";                                                                                // 528
        record.arg = exception;                                                                               // 529
        context.next = loc;                                                                                   // 530
        return !!caught;                                                                                      // 531
      }                                                                                                       // 532
                                                                                                              // 533
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {                                                 // 534
        var entry = this.tryEntries[i];                                                                       // 535
        var record = entry.completion;                                                                        // 536
                                                                                                              // 537
        if (entry.tryLoc === "root") {                                                                        // 538
          // Exception thrown outside of any try block that could handle                                      // 539
          // it, so set the completion value of the entire function to                                        // 540
          // throw the exception.                                                                             // 541
          return handle("end");                                                                               // 542
        }                                                                                                     // 543
                                                                                                              // 544
        if (entry.tryLoc <= this.prev) {                                                                      // 545
          var hasCatch = hasOwn.call(entry, "catchLoc");                                                      // 546
          var hasFinally = hasOwn.call(entry, "finallyLoc");                                                  // 547
                                                                                                              // 548
          if (hasCatch && hasFinally) {                                                                       // 549
            if (this.prev < entry.catchLoc) {                                                                 // 550
              return handle(entry.catchLoc, true);                                                            // 551
            } else if (this.prev < entry.finallyLoc) {                                                        // 552
              return handle(entry.finallyLoc);                                                                // 553
            }                                                                                                 // 554
                                                                                                              // 555
          } else if (hasCatch) {                                                                              // 556
            if (this.prev < entry.catchLoc) {                                                                 // 557
              return handle(entry.catchLoc, true);                                                            // 558
            }                                                                                                 // 559
                                                                                                              // 560
          } else if (hasFinally) {                                                                            // 561
            if (this.prev < entry.finallyLoc) {                                                               // 562
              return handle(entry.finallyLoc);                                                                // 563
            }                                                                                                 // 564
                                                                                                              // 565
          } else {                                                                                            // 566
            throw new Error("try statement without catch or finally");                                        // 567
          }                                                                                                   // 568
        }                                                                                                     // 569
      }                                                                                                       // 570
    },                                                                                                        // 571
                                                                                                              // 572
    abrupt: function(type, arg) {                                                                             // 573
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {                                                 // 574
        var entry = this.tryEntries[i];                                                                       // 575
        if (entry.tryLoc <= this.prev &&                                                                      // 576
            hasOwn.call(entry, "finallyLoc") &&                                                               // 577
            this.prev < entry.finallyLoc) {                                                                   // 578
          var finallyEntry = entry;                                                                           // 579
          break;                                                                                              // 580
        }                                                                                                     // 581
      }                                                                                                       // 582
                                                                                                              // 583
      if (finallyEntry &&                                                                                     // 584
          (type === "break" ||                                                                                // 585
           type === "continue") &&                                                                            // 586
          finallyEntry.tryLoc <= arg &&                                                                       // 587
          arg <= finallyEntry.finallyLoc) {                                                                   // 588
        // Ignore the finally entry if control is not jumping to a                                            // 589
        // location outside the try/catch block.                                                              // 590
        finallyEntry = null;                                                                                  // 591
      }                                                                                                       // 592
                                                                                                              // 593
      var record = finallyEntry ? finallyEntry.completion : {};                                               // 594
      record.type = type;                                                                                     // 595
      record.arg = arg;                                                                                       // 596
                                                                                                              // 597
      if (finallyEntry) {                                                                                     // 598
        this.next = finallyEntry.finallyLoc;                                                                  // 599
      } else {                                                                                                // 600
        this.complete(record);                                                                                // 601
      }                                                                                                       // 602
                                                                                                              // 603
      return ContinueSentinel;                                                                                // 604
    },                                                                                                        // 605
                                                                                                              // 606
    complete: function(record, afterLoc) {                                                                    // 607
      if (record.type === "throw") {                                                                          // 608
        throw record.arg;                                                                                     // 609
      }                                                                                                       // 610
                                                                                                              // 611
      if (record.type === "break" ||                                                                          // 612
          record.type === "continue") {                                                                       // 613
        this.next = record.arg;                                                                               // 614
      } else if (record.type === "return") {                                                                  // 615
        this.rval = record.arg;                                                                               // 616
        this.next = "end";                                                                                    // 617
      } else if (record.type === "normal" && afterLoc) {                                                      // 618
        this.next = afterLoc;                                                                                 // 619
      }                                                                                                       // 620
    },                                                                                                        // 621
                                                                                                              // 622
    finish: function(finallyLoc) {                                                                            // 623
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {                                                 // 624
        var entry = this.tryEntries[i];                                                                       // 625
        if (entry.finallyLoc === finallyLoc) {                                                                // 626
          this.complete(entry.completion, entry.afterLoc);                                                    // 627
          resetTryEntry(entry);                                                                               // 628
          return ContinueSentinel;                                                                            // 629
        }                                                                                                     // 630
      }                                                                                                       // 631
    },                                                                                                        // 632
                                                                                                              // 633
    "catch": function(tryLoc) {                                                                               // 634
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {                                                 // 635
        var entry = this.tryEntries[i];                                                                       // 636
        if (entry.tryLoc === tryLoc) {                                                                        // 637
          var record = entry.completion;                                                                      // 638
          if (record.type === "throw") {                                                                      // 639
            var thrown = record.arg;                                                                          // 640
            resetTryEntry(entry);                                                                             // 641
          }                                                                                                   // 642
          return thrown;                                                                                      // 643
        }                                                                                                     // 644
      }                                                                                                       // 645
                                                                                                              // 646
      // The context.catch method must only be called with a location                                         // 647
      // argument that corresponds to a known catch block.                                                    // 648
      throw new Error("illegal catch attempt");                                                               // 649
    },                                                                                                        // 650
                                                                                                              // 651
    delegateYield: function(iterable, resultName, nextLoc) {                                                  // 652
      this.delegate = {                                                                                       // 653
        iterator: values(iterable),                                                                           // 654
        resultName: resultName,                                                                               // 655
        nextLoc: nextLoc                                                                                      // 656
      };                                                                                                      // 657
                                                                                                              // 658
      return ContinueSentinel;                                                                                // 659
    }                                                                                                         // 660
  };                                                                                                          // 661
})(                                                                                                           // 662
  // Among the various tricks for obtaining a reference to the global                                         // 663
  // object, this seems to be the most reliable technique that does not                                       // 664
  // use indirect eval (which violates Content Security Policy).                                              // 665
  typeof global === "object" ? global :                                                                       // 666
  typeof window === "object" ? window :                                                                       // 667
  typeof self === "object" ? self : this                                                                      // 668
);                                                                                                            // 669
                                                                                                              // 670
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}},{"extensions":[".js",".json"]});
var exports = require("./node_modules/meteor/modules/client.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package.modules = exports, {
  meteorInstall: meteorInstall,
  Buffer: Buffer,
  process: process
});

})();

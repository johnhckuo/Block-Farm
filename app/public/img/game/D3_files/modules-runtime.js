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

/* Package-scope variables */
var makeInstaller, meteorInstall;

/////////////////////////////////////////////////////////////////////////////
//                                                                         //
// packages/modules-runtime/.npm/package/node_modules/install/install.js   //
// This file is in bare mode and is not in its own closure.                //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////
                                                                           //
makeInstaller = function (options) {                                       // 1
  "use strict";                                                            // 2
                                                                           // 3
  options = options || {};                                                 // 4
                                                                           // 5
  // These file extensions will be appended to required module identifiers
  // if they do not exactly match an installed module.                     // 7
  var defaultExtensions = options.extensions || [".js", ".json"];          // 8
                                                                           // 9
  // If defined, the options.onInstall function will be called any time    // 10
  // new modules are installed.                                            // 11
  var onInstall = options.onInstall;                                       // 12
                                                                           // 13
  // If defined, each module-specific require function will be passed to   // 14
  // this function, along with the module.id of the parent module, and     // 15
  // the result will be used in place of the original require function.    // 16
  var wrapRequire = options.wrapRequire;                                   // 17
                                                                           // 18
  // If defined, the options.override function will be called before       // 19
  // looking up any top-level package identifiers in node_modules          // 20
  // directories. It can either return a string to provide an alternate    // 21
  // package identifier, or a non-string value to prevent the lookup from  // 22
  // proceeding.                                                           // 23
  var override = options.override;                                         // 24
                                                                           // 25
  // If defined, the options.fallback function will be called when no      // 26
  // installed module is found for a required module identifier. Often     // 27
  // options.fallback will be implemented in terms of the native Node      // 28
  // require function, which has the ability to load binary modules.       // 29
  var fallback = options.fallback;                                         // 30
                                                                           // 31
  // If truthy, package resolution will prefer the "browser" field of      // 32
  // package.json files to the "main" field. Note that this only supports  // 33
  // string-valued "browser" fields for now, though in the future it might
  // make sense to support the object version, a la browserify.            // 35
  var browser = options.browser;                                           // 36
                                                                           // 37
  // Called below as hasOwn.call(obj, key).                                // 38
  var hasOwn = {}.hasOwnProperty;                                          // 39
                                                                           // 40
  // The file object representing the root directory of the installed      // 41
  // module tree.                                                          // 42
  var root = new File("/", new File("/.."));                               // 43
  var rootRequire = makeRequire(root);                                     // 44
                                                                           // 45
  // Merges the given tree of directories and module factory functions     // 46
  // into the tree of installed modules and returns a require function     // 47
  // that behaves as if called from a module in the root directory.        // 48
  function install(tree, options) {                                        // 49
    if (isObject(tree)) {                                                  // 50
      fileMergeContents(root, tree, options);                              // 51
      if (isFunction(onInstall)) {                                         // 52
        onInstall(rootRequire);                                            // 53
      }                                                                    // 54
    }                                                                      // 55
    return rootRequire;                                                    // 56
  }                                                                        // 57
                                                                           // 58
  // This constructor will be used to instantiate the module objects       // 59
  // passed to module factory functions (i.e. the third argument after     // 60
  // require and exports), and is exposed as install.Module in case the    // 61
  // caller of makeInstaller wishes to modify Module.prototype.            // 62
  function Module(id) {                                                    // 63
    this.id = id;                                                          // 64
    this.children = [];                                                    // 65
  }                                                                        // 66
                                                                           // 67
  Module.prototype.resolve = function (id) {                               // 68
    return this.require.resolve(id);                                       // 69
  };                                                                       // 70
                                                                           // 71
  install.Module = Module;                                                 // 72
                                                                           // 73
  function getOwn(obj, key) {                                              // 74
    return hasOwn.call(obj, key) && obj[key];                              // 75
  }                                                                        // 76
                                                                           // 77
  function isObject(value) {                                               // 78
    return value && typeof value === "object";                             // 79
  }                                                                        // 80
                                                                           // 81
  function isFunction(value) {                                             // 82
    return typeof value === "function";                                    // 83
  }                                                                        // 84
                                                                           // 85
  function isString(value) {                                               // 86
    return typeof value === "string";                                      // 87
  }                                                                        // 88
                                                                           // 89
  function makeRequire(file) {                                             // 90
    function require(id) {                                                 // 91
      var result = fileResolve(file, id);                                  // 92
      if (result) {                                                        // 93
        return fileEvaluate(result, file.m);                               // 94
      }                                                                    // 95
                                                                           // 96
      var error = new Error("Cannot find module '" + id + "'");            // 97
                                                                           // 98
      if (isFunction(fallback)) {                                          // 99
        return fallback(                                                   // 100
          id, // The missing module identifier.                            // 101
          file.m.id, // The path of the requiring file.                    // 102
          error // The error we would have thrown.                         // 103
        );                                                                 // 104
      }                                                                    // 105
                                                                           // 106
      throw error;                                                         // 107
    }                                                                      // 108
                                                                           // 109
    if (isFunction(wrapRequire)) {                                         // 110
      require = wrapRequire(require, file.m.id);                           // 111
    }                                                                      // 112
                                                                           // 113
    require.extensions = fileGetExtensions(file).slice(0);                 // 114
                                                                           // 115
    require.resolve = function (id) {                                      // 116
      var f = fileResolve(file, id);                                       // 117
      if (f) return f.m.id;                                                // 118
      var error = new Error("Cannot find module '" + id + "'");            // 119
      if (fallback && isFunction(fallback.resolve)) {                      // 120
        return fallback.resolve(id, file.m.id, error);                     // 121
      }                                                                    // 122
      throw error;                                                         // 123
    };                                                                     // 124
                                                                           // 125
    return require;                                                        // 126
  }                                                                        // 127
                                                                           // 128
  // File objects represent either directories or modules that have been   // 129
  // installed. When a `File` respresents a directory, its `.c` (contents)
  // property is an object containing the names of the files (or           // 131
  // directories) that it contains. When a `File` represents a module, its
  // `.c` property is a function that can be invoked with the appropriate  // 133
  // `(require, exports, module)` arguments to evaluate the module. If the
  // `.c` property is a string, that string will be resolved as a module   // 135
  // identifier, and the exports of the resulting module will provide the  // 136
  // exports of the original file. The `.p` (parent) property of a File is
  // either a directory `File` or `null`. Note that a child may claim      // 138
  // another `File` as its parent even if the parent does not have an      // 139
  // entry for that child in its `.c` object.  This is important for       // 140
  // implementing anonymous files, and preventing child modules from using
  // `../relative/identifier` syntax to examine unrelated modules.         // 142
  function File(name, parent) {                                            // 143
    var file = this;                                                       // 144
                                                                           // 145
    // Link to the parent file.                                            // 146
    file.p = parent = parent || null;                                      // 147
                                                                           // 148
    // The module object for this File, which will eventually boast an     // 149
    // .exports property when/if the file is evaluated.                    // 150
    file.m = new Module(name);                                             // 151
  }                                                                        // 152
                                                                           // 153
  function fileEvaluate(file, parentModule) {                              // 154
    var contents = file && file.c;                                         // 155
    var module = file.m;                                                   // 156
                                                                           // 157
    if (! hasOwn.call(module, "exports")) {                                // 158
      if (parentModule) {                                                  // 159
        module.parent = parentModule;                                      // 160
        var children = parentModule.children;                              // 161
        if (Array.isArray(children)) {                                     // 162
          children.push(module);                                           // 163
        }                                                                  // 164
      }                                                                    // 165
                                                                           // 166
      // If a Module.prototype.useNode method is defined, give it a chance
      // to define module.exports based on module.id using Node.           // 168
      if (! isFunction(module.useNode) ||                                  // 169
          ! module.useNode()) {                                            // 170
        contents(                                                          // 171
          module.require = module.require || makeRequire(file),            // 172
          module.exports = {},                                             // 173
          module,                                                          // 174
          file.m.id,                                                       // 175
          file.p.m.id                                                      // 176
        );                                                                 // 177
      }                                                                    // 178
                                                                           // 179
      module.loaded = true;                                                // 180
    }                                                                      // 181
                                                                           // 182
    if (isFunction(module.runModuleSetters)) {                             // 183
      module.runModuleSetters();                                           // 184
    }                                                                      // 185
                                                                           // 186
    return module.exports;                                                 // 187
  }                                                                        // 188
                                                                           // 189
  function fileIsDirectory(file) {                                         // 190
    return file && isObject(file.c);                                       // 191
  }                                                                        // 192
                                                                           // 193
  function fileMergeContents(file, contents, options) {                    // 194
    // If contents is an array of strings and functions, return the last   // 195
    // function with a `.d` property containing all the strings.           // 196
    if (Array.isArray(contents)) {                                         // 197
      var deps = [];                                                       // 198
                                                                           // 199
      contents.forEach(function (item) {                                   // 200
        if (isString(item)) {                                              // 201
          deps.push(item);                                                 // 202
        } else if (isFunction(item)) {                                     // 203
          contents = item;                                                 // 204
        }                                                                  // 205
      });                                                                  // 206
                                                                           // 207
      if (isFunction(contents)) {                                          // 208
        contents.d = deps;                                                 // 209
      } else {                                                             // 210
        // If the array did not contain a function, merge nothing.         // 211
        contents = null;                                                   // 212
      }                                                                    // 213
                                                                           // 214
    } else if (isFunction(contents)) {                                     // 215
      // If contents is already a function, make sure it has `.d`.         // 216
      contents.d = contents.d || [];                                       // 217
                                                                           // 218
    } else if (! isString(contents) &&                                     // 219
               ! isObject(contents)) {                                     // 220
      // If contents is neither an array nor a function nor a string nor   // 221
      // an object, just give up and merge nothing.                        // 222
      contents = null;                                                     // 223
    }                                                                      // 224
                                                                           // 225
    if (contents) {                                                        // 226
      file.c = file.c || (isObject(contents) ? {} : contents);             // 227
      if (isObject(contents) && fileIsDirectory(file)) {                   // 228
        Object.keys(contents).forEach(function (key) {                     // 229
          if (key === "..") {                                              // 230
            child = file.p;                                                // 231
                                                                           // 232
          } else {                                                         // 233
            var child = getOwn(file.c, key);                               // 234
            if (! child) {                                                 // 235
              child = file.c[key] = new File(                              // 236
                file.m.id.replace(/\/*$/, "/") + key,                      // 237
                file                                                       // 238
              );                                                           // 239
                                                                           // 240
              child.o = options;                                           // 241
            }                                                              // 242
          }                                                                // 243
                                                                           // 244
          fileMergeContents(child, contents[key], options);                // 245
        });                                                                // 246
      }                                                                    // 247
    }                                                                      // 248
  }                                                                        // 249
                                                                           // 250
  function fileGetExtensions(file) {                                       // 251
    return file.o && file.o.extensions || defaultExtensions;               // 252
  }                                                                        // 253
                                                                           // 254
  function fileAppendIdPart(file, part, extensions) {                      // 255
    // Always append relative to a directory.                              // 256
    while (file && ! fileIsDirectory(file)) {                              // 257
      file = file.p;                                                       // 258
    }                                                                      // 259
                                                                           // 260
    if (! file || ! part || part === ".") {                                // 261
      return file;                                                         // 262
    }                                                                      // 263
                                                                           // 264
    if (part === "..") {                                                   // 265
      return file.p;                                                       // 266
    }                                                                      // 267
                                                                           // 268
    var exactChild = getOwn(file.c, part);                                 // 269
                                                                           // 270
    // Only consider multiple file extensions if this part is the last     // 271
    // part of a module identifier and not equal to `.` or `..`, and there
    // was no exact match or the exact match was a directory.              // 273
    if (extensions && (! exactChild || fileIsDirectory(exactChild))) {     // 274
      for (var e = 0; e < extensions.length; ++e) {                        // 275
        var child = getOwn(file.c, part + extensions[e]);                  // 276
        if (child) {                                                       // 277
          return child;                                                    // 278
        }                                                                  // 279
      }                                                                    // 280
    }                                                                      // 281
                                                                           // 282
    return exactChild;                                                     // 283
  }                                                                        // 284
                                                                           // 285
  function fileAppendId(file, id, extensions) {                            // 286
    var parts = id.split("/");                                             // 287
                                                                           // 288
    // Use `Array.prototype.every` to terminate iteration early if         // 289
    // `fileAppendIdPart` returns a falsy value.                           // 290
    parts.every(function (part, i) {                                       // 291
      return file = i < parts.length - 1                                   // 292
        ? fileAppendIdPart(file, part)                                     // 293
        : fileAppendIdPart(file, part, extensions);                        // 294
    });                                                                    // 295
                                                                           // 296
    return file;                                                           // 297
  }                                                                        // 298
                                                                           // 299
  function fileResolve(file, id, seenDirFiles) {                           // 300
    var extensions = fileGetExtensions(file);                              // 301
                                                                           // 302
    file =                                                                 // 303
      // Absolute module identifiers (i.e. those that begin with a `/`     // 304
      // character) are interpreted relative to the root directory, which  // 305
      // is a slight deviation from Node, which has access to the entire   // 306
      // file system.                                                      // 307
      id.charAt(0) === "/" ? fileAppendId(root, id, extensions) :          // 308
      // Relative module identifiers are interpreted relative to the       // 309
      // current file, naturally.                                          // 310
      id.charAt(0) === "." ? fileAppendId(file, id, extensions) :          // 311
      // Top-level module identifiers are interpreted as referring to      // 312
      // packages in `node_modules` directories.                           // 313
      nodeModulesLookup(file, id, extensions);                             // 314
                                                                           // 315
    // If the identifier resolves to a directory, we use the same logic as
    // Node to find an `index.js` or `package.json` file to evaluate.      // 317
    while (fileIsDirectory(file)) {                                        // 318
      seenDirFiles = seenDirFiles || [];                                   // 319
                                                                           // 320
      // If the "main" field of a `package.json` file resolves to a        // 321
      // directory we've already considered, then we should not attempt to
      // read the same `package.json` file again. Using an array as a set  // 323
      // is acceptable here because the number of directories to consider  // 324
      // is rarely greater than 1 or 2. Also, using indexOf allows us to   // 325
      // store File objects instead of strings.                            // 326
      if (seenDirFiles.indexOf(file) < 0) {                                // 327
        seenDirFiles.push(file);                                           // 328
                                                                           // 329
        var pkgJsonFile = fileAppendIdPart(file, "package.json");          // 330
        var pkg = pkgJsonFile && fileEvaluate(pkgJsonFile), main;          // 331
        if (pkg && (browser &&                                             // 332
                    isString(main = pkg.browser) ||                        // 333
                    isString(main = pkg.main))) {                          // 334
          // The "main" field of package.json does not have to begin with  // 335
          // ./ to be considered relative, so first we try simply          // 336
          // appending it to the directory path before falling back to a   // 337
          // full fileResolve, which might return a package from a         // 338
          // node_modules directory.                                       // 339
          file = fileAppendId(file, main, extensions) ||                   // 340
            fileResolve(file, main, seenDirFiles);                         // 341
                                                                           // 342
          if (file) {                                                      // 343
            // The fileAppendId call above may have returned a directory,  // 344
            // so continue the loop to make sure we resolve it to a        // 345
            // non-directory file.                                         // 346
            continue;                                                      // 347
          }                                                                // 348
        }                                                                  // 349
      }                                                                    // 350
                                                                           // 351
      // If we didn't find a `package.json` file, or it didn't have a      // 352
      // resolvable `.main` property, the only possibility left to         // 353
      // consider is that this directory contains an `index.js` module.    // 354
      // This assignment almost always terminates the while loop, because  // 355
      // there's very little chance `fileIsDirectory(file)` will be true   // 356
      // for the result of `fileAppendIdPart(file, "index.js")`. However,  // 357
      // in principle it is remotely possible that a file called           // 358
      // `index.js` could be a directory instead of a file.                // 359
      file = fileAppendIdPart(file, "index.js");                           // 360
    }                                                                      // 361
                                                                           // 362
    if (file && isString(file.c)) {                                        // 363
      file = fileResolve(file, file.c, seenDirFiles);                      // 364
    }                                                                      // 365
                                                                           // 366
    return file;                                                           // 367
  };                                                                       // 368
                                                                           // 369
  function nodeModulesLookup(file, id, extensions) {                       // 370
    if (isFunction(override)) {                                            // 371
      id = override(id, file.m.id);                                        // 372
    }                                                                      // 373
                                                                           // 374
    if (isString(id)) {                                                    // 375
      for (var resolved; file && ! resolved; file = file.p) {              // 376
        resolved = fileIsDirectory(file) &&                                // 377
          fileAppendId(file, "node_modules/" + id, extensions);            // 378
      }                                                                    // 379
                                                                           // 380
      return resolved;                                                     // 381
    }                                                                      // 382
  }                                                                        // 383
                                                                           // 384
  return install;                                                          // 385
};                                                                         // 386
                                                                           // 387
if (typeof exports === "object") {                                         // 388
  exports.makeInstaller = makeInstaller;                                   // 389
}                                                                          // 390
                                                                           // 391
/////////////////////////////////////////////////////////////////////////////







(function(){

/////////////////////////////////////////////////////////////////////////////
//                                                                         //
// packages/modules-runtime/modules-runtime.js                             //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////
                                                                           //
var options = {};                                                          // 1
var hasOwn = options.hasOwnProperty;                                       // 2
                                                                           // 3
// RegExp matching strings that don't start with a `.` or a `/`.           // 4
var topLevelIdPattern = /^[^./]/;                                          // 5
                                                                           // 6
if (typeof Profile === "function" &&                                       // 7
    process.env.METEOR_PROFILE) {                                          // 8
  options.wrapRequire = function (require) {                               // 9
    return Profile(function (id) {                                         // 10
      return "require(" + JSON.stringify(id) + ")";                        // 11
    }, require);                                                           // 12
  };                                                                       // 13
}                                                                          // 14
                                                                           // 15
// On the client, make package resolution prefer the "browser" field of    // 16
// package.json files to the "main" field.                                 // 17
options.browser = Meteor.isClient;                                         // 18
                                                                           // 19
// This function will be called whenever a module identifier that hasn't   // 20
// been installed is required. For backwards compatibility, and so that we
// can require binary dependencies on the server, we implement the         // 22
// fallback in terms of Npm.require.                                       // 23
options.fallback = function (id, parentId, error) {                        // 24
  // For simplicity, we honor only top-level module identifiers here.      // 25
  // We could try to honor relative and absolute module identifiers by     // 26
  // somehow combining `id` with `dir`, but we'd have to be really careful
  // that the resulting modules were located in a known directory (not     // 28
  // some arbitrary location on the file system), and we only really need  // 29
  // the fallback for dependencies installed in node_modules directories.  // 30
  if (topLevelIdPattern.test(id)) {                                        // 31
    if (typeof Npm === "object" &&                                         // 32
        typeof Npm.require === "function") {                               // 33
      return Npm.require(id);                                              // 34
    }                                                                      // 35
  }                                                                        // 36
                                                                           // 37
  throw error;                                                             // 38
};                                                                         // 39
                                                                           // 40
options.fallback.resolve = function (id, parentId, error) {                // 41
  if (Meteor.isServer &&                                                   // 42
      topLevelIdPattern.test(id)) {                                        // 43
    // Allow any top-level identifier to resolve to itself on the server,  // 44
    // so that options.fallback can have a chance to handle it.            // 45
    return id;                                                             // 46
  }                                                                        // 47
                                                                           // 48
  throw error;                                                             // 49
};                                                                         // 50
                                                                           // 51
meteorInstall = makeInstaller(options);                                    // 52
var Mp = meteorInstall.Module.prototype;                                   // 53
                                                                           // 54
if (Meteor.isServer) {                                                     // 55
  Mp.useNode = function () {                                               // 56
    if (typeof npmRequire !== "function") {                                // 57
      // Can't use Node if npmRequire is not defined.                      // 58
      return false;                                                        // 59
    }                                                                      // 60
                                                                           // 61
    var parts = this.id.split("/");                                        // 62
    var start = 0;                                                         // 63
    if (parts[start] === "") ++start;                                      // 64
    if (parts[start] === "node_modules" &&                                 // 65
        parts[start + 1] === "meteor") {                                   // 66
      start += 2;                                                          // 67
    }                                                                      // 68
                                                                           // 69
    if (parts.indexOf("node_modules", start) < 0) {                        // 70
      // Don't try to use Node for modules that aren't in node_modules     // 71
      // directories.                                                      // 72
      return false;                                                        // 73
    }                                                                      // 74
                                                                           // 75
    try {                                                                  // 76
      npmRequire.resolve(this.id);                                         // 77
    } catch (e) {                                                          // 78
      return false;                                                        // 79
    }                                                                      // 80
                                                                           // 81
    this.exports = npmRequire(this.id);                                    // 82
                                                                           // 83
    return true;                                                           // 84
  };                                                                       // 85
}                                                                          // 86
                                                                           // 87
/////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['modules-runtime'] = {}, {
  meteorInstall: meteorInstall
});

})();

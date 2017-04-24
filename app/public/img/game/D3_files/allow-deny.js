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
var LocalCollection = Package.minimongo.LocalCollection;
var Minimongo = Package.minimongo.Minimongo;
var check = Package.check.check;
var Match = Package.check.Match;
var EJSON = Package.ejson.EJSON;
var DDP = Package['ddp-client'].DDP;
var meteorInstall = Package.modules.meteorInstall;
var Buffer = Package.modules.Buffer;
var process = Package.modules.process;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var AllowDeny;

var require = meteorInstall({"node_modules":{"meteor":{"allow-deny":{"allow-deny.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/allow-deny/allow-deny.js                                                                              //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
///                                                                                                               // 1
/// Remote methods and access control.                                                                            // 2
///                                                                                                               // 3
                                                                                                                  //
// Restrict default mutators on collection. allow() and deny() take the                                           // 5
// same options:                                                                                                  // 6
//                                                                                                                // 7
// options.insert {Function(userId, doc)}                                                                         // 8
//   return true to allow/deny adding this document                                                               // 9
//                                                                                                                // 10
// options.update {Function(userId, docs, fields, modifier)}                                                      // 11
//   return true to allow/deny updating these documents.                                                          // 12
//   `fields` is passed as an array of fields that are to be modified                                             // 13
//                                                                                                                // 14
// options.remove {Function(userId, docs)}                                                                        // 15
//   return true to allow/deny removing these documents                                                           // 16
//                                                                                                                // 17
// options.fetch {Array}                                                                                          // 18
//   Fields to fetch for these validators. If any call to allow or deny                                           // 19
//   does not have this option then all fields are loaded.                                                        // 20
//                                                                                                                // 21
// allow and deny can be called multiple times. The validators are                                                // 22
// evaluated as follows:                                                                                          // 23
// - If neither deny() nor allow() has been called on the collection,                                             // 24
//   then the request is allowed if and only if the "insecure" smart                                              // 25
//   package is in use.                                                                                           // 26
// - Otherwise, if any deny() function returns true, the request is denied.                                       // 27
// - Otherwise, if any allow() function returns true, the request is allowed.                                     // 28
// - Otherwise, the request is denied.                                                                            // 29
//                                                                                                                // 30
// Meteor may call your deny() and allow() functions in any order, and may not                                    // 31
// call all of them if it is able to make a decision without calling them all                                     // 32
// (so don't include side effects).                                                                               // 33
                                                                                                                  //
AllowDeny = {                                                                                                     // 35
  CollectionPrototype: {}                                                                                         // 36
};                                                                                                                // 35
                                                                                                                  //
// In the `mongo` package, we will extend Mongo.Collection.prototype with these                                   // 39
// methods                                                                                                        // 40
var CollectionPrototype = AllowDeny.CollectionPrototype;                                                          // 41
                                                                                                                  //
/**                                                                                                               // 43
 * @summary Allow users to write directly to this collection from client code, subject to limitations you define.
 * @locus Server                                                                                                  //
 * @method allow                                                                                                  //
 * @memberOf Mongo.Collection                                                                                     //
 * @instance                                                                                                      //
 * @param {Object} options                                                                                        //
 * @param {Function} options.insert,update,remove Functions that look at a proposed modification to the database and return true if it should be allowed.
 * @param {String[]} options.fetch Optional performance enhancement. Limits the fields that will be fetched from the database for inspection by your `update` and `remove` functions.
 * @param {Function} options.transform Overrides `transform` on the  [`Collection`](#collections).  Pass `null` to disable transformation.
 */                                                                                                               //
CollectionPrototype.allow = function (options) {                                                                  // 54
  addValidator(this, 'allow', options);                                                                           // 55
};                                                                                                                // 56
                                                                                                                  //
/**                                                                                                               // 58
 * @summary Override `allow` rules.                                                                               //
 * @locus Server                                                                                                  //
 * @method deny                                                                                                   //
 * @memberOf Mongo.Collection                                                                                     //
 * @instance                                                                                                      //
 * @param {Object} options                                                                                        //
 * @param {Function} options.insert,update,remove Functions that look at a proposed modification to the database and return true if it should be denied, even if an [allow](#allow) rule says otherwise.
 * @param {String[]} options.fetch Optional performance enhancement. Limits the fields that will be fetched from the database for inspection by your `update` and `remove` functions.
 * @param {Function} options.transform Overrides `transform` on the  [`Collection`](#collections).  Pass `null` to disable transformation.
 */                                                                                                               //
CollectionPrototype.deny = function (options) {                                                                   // 69
  addValidator(this, 'deny', options);                                                                            // 70
};                                                                                                                // 71
                                                                                                                  //
CollectionPrototype._defineMutationMethods = function (options) {                                                 // 73
  var self = this;                                                                                                // 74
  options = options || {};                                                                                        // 75
                                                                                                                  //
  // set to true once we call any allow or deny methods. If true, use                                             // 77
  // allow/deny semantics. If false, use insecure mode semantics.                                                 // 78
  self._restricted = false;                                                                                       // 79
                                                                                                                  //
  // Insecure mode (default to allowing writes). Defaults to 'undefined' which                                    // 81
  // means insecure iff the insecure package is loaded. This property can be                                      // 82
  // overriden by tests or packages wishing to change insecure mode behavior of                                   // 83
  // their collections.                                                                                           // 84
  self._insecure = undefined;                                                                                     // 85
                                                                                                                  //
  self._validators = {                                                                                            // 87
    insert: { allow: [], deny: [] },                                                                              // 88
    update: { allow: [], deny: [] },                                                                              // 89
    remove: { allow: [], deny: [] },                                                                              // 90
    upsert: { allow: [], deny: [] }, // dummy arrays; can't set these!                                            // 91
    fetch: [],                                                                                                    // 92
    fetchAllFields: false                                                                                         // 93
  };                                                                                                              // 87
                                                                                                                  //
  if (!self._name) return; // anonymous collection                                                                // 96
                                                                                                                  //
  // XXX Think about method namespacing. Maybe methods should be                                                  // 99
  // "Meteor:Mongo:insert/NAME"?                                                                                  // 100
  self._prefix = '/' + self._name + '/';                                                                          // 101
                                                                                                                  //
  // Mutation Methods                                                                                             // 103
  // Minimongo on the server gets no stubs; instead, by default                                                   // 104
  // it wait()s until its result is ready, yielding.                                                              // 105
  // This matches the behavior of macromongo on the server better.                                                // 106
  // XXX see #MeteorServerNull                                                                                    // 107
  if (self._connection && (self._connection === Meteor.server || Meteor.isClient)) {                              // 108
    (function () {                                                                                                // 108
      var m = {};                                                                                                 // 109
                                                                                                                  //
      _.each(['insert', 'update', 'remove'], function (method) {                                                  // 111
        var methodName = self._prefix + method;                                                                   // 112
                                                                                                                  //
        if (options.useExisting) {                                                                                // 114
          var handlerPropName = Meteor.isClient ? '_methodHandlers' : 'method_handlers';                          // 115
          // Do not try to create additional methods if this has already been called.                             // 116
          // (Otherwise the .methods() call below will throw an error.)                                           // 117
          if (self._connection[handlerPropName] && typeof self._connection[handlerPropName][methodName] === 'function') return;
        }                                                                                                         // 120
                                                                                                                  //
        m[methodName] = function () /* ... */{                                                                    // 122
          // All the methods do their own validation, instead of using check().                                   // 123
          check(arguments, [Match.Any]);                                                                          // 124
          var args = _.toArray(arguments);                                                                        // 125
          try {                                                                                                   // 126
            // For an insert, if the client didn't specify an _id, generate one                                   // 127
            // now; because this uses DDP.randomStream, it will be consistent with                                // 128
            // what the client generated. We generate it now rather than later so                                 // 129
            // that if (eg) an allow/deny rule does an insert to the same                                         // 130
            // collection (not that it really should), the generated _id will                                     // 131
            // still be the first use of the stream and will be consistent.                                       // 132
            //                                                                                                    // 133
            // However, we don't actually stick the _id onto the document yet,                                    // 134
            // because we want allow/deny rules to be able to differentiate                                       // 135
            // between arbitrary client-specified _id fields and merely                                           // 136
            // client-controlled-via-randomSeed fields.                                                           // 137
            var generatedId = null;                                                                               // 138
            if (method === "insert" && !_.has(args[0], '_id')) {                                                  // 139
              generatedId = self._makeNewID();                                                                    // 140
            }                                                                                                     // 141
                                                                                                                  //
            if (this.isSimulation) {                                                                              // 143
              // In a client simulation, you can do any mutation (even with a                                     // 144
              // complex selector).                                                                               // 145
              if (generatedId !== null) args[0]._id = generatedId;                                                // 146
              return self._collection[method].apply(self._collection, args);                                      // 148
            }                                                                                                     // 150
                                                                                                                  //
            // This is the server receiving a method call from the client.                                        // 152
                                                                                                                  //
            // We don't allow arbitrary selectors in mutations from the client: only                              // 154
            // single-ID selectors.                                                                               // 155
            if (method !== 'insert') throwIfSelectorIsNotId(args[0], method);                                     // 156
                                                                                                                  //
            if (self._restricted) {                                                                               // 159
              // short circuit if there is no way it will pass.                                                   // 160
              if (self._validators[method].allow.length === 0) {                                                  // 161
                throw new Meteor.Error(403, "Access denied. No allow validators set on restricted " + "collection for method '" + method + "'.");
              }                                                                                                   // 165
                                                                                                                  //
              var validatedMethodName = '_validated' + method.charAt(0).toUpperCase() + method.slice(1);          // 167
              args.unshift(this.userId);                                                                          // 169
              method === 'insert' && args.push(generatedId);                                                      // 170
              return self[validatedMethodName].apply(self, args);                                                 // 171
            } else if (self._isInsecure()) {                                                                      // 172
              if (generatedId !== null) args[0]._id = generatedId;                                                // 173
              // In insecure mode, allow any mutation (with a simple selector).                                   // 175
              // XXX This is kind of bogus.  Instead of blindly passing whatever                                  // 176
              //     we get from the network to this function, we should actually                                 // 177
              //     know the correct arguments for the function and pass just                                    // 178
              //     them.  For example, if you have an extraneous extra null                                     // 179
              //     argument and this is Mongo on the server, the .wrapAsync'd                                   // 180
              //     functions like update will get confused and pass the                                         // 181
              //     "fut.resolver()" in the wrong slot, where _update will never                                 // 182
              //     invoke it. Bam, broken DDP connection.  Probably should just                                 // 183
              //     take this whole method and write it three times, invoking                                    // 184
              //     helpers for the common code.                                                                 // 185
              return self._collection[method].apply(self._collection, args);                                      // 186
            } else {                                                                                              // 187
              // In secure mode, if we haven't called allow or deny, then nothing                                 // 188
              // is permitted.                                                                                    // 189
              throw new Meteor.Error(403, "Access denied");                                                       // 190
            }                                                                                                     // 191
          } catch (e) {                                                                                           // 192
            if (e.name === 'MongoError' || e.name === 'MinimongoError') {                                         // 193
              throw new Meteor.Error(409, e.toString());                                                          // 194
            } else {                                                                                              // 195
              throw e;                                                                                            // 196
            }                                                                                                     // 197
          }                                                                                                       // 198
        };                                                                                                        // 199
      });                                                                                                         // 200
                                                                                                                  //
      self._connection.methods(m);                                                                                // 202
    })();                                                                                                         // 108
  }                                                                                                               // 203
};                                                                                                                // 204
                                                                                                                  //
CollectionPrototype._updateFetch = function (fields) {                                                            // 206
  var self = this;                                                                                                // 207
                                                                                                                  //
  if (!self._validators.fetchAllFields) {                                                                         // 209
    if (fields) {                                                                                                 // 210
      self._validators.fetch = _.union(self._validators.fetch, fields);                                           // 211
    } else {                                                                                                      // 212
      self._validators.fetchAllFields = true;                                                                     // 213
      // clear fetch just to make sure we don't accidentally read it                                              // 214
      self._validators.fetch = null;                                                                              // 215
    }                                                                                                             // 216
  }                                                                                                               // 217
};                                                                                                                // 218
                                                                                                                  //
CollectionPrototype._isInsecure = function () {                                                                   // 220
  var self = this;                                                                                                // 221
  if (self._insecure === undefined) return !!Package.insecure;                                                    // 222
  return self._insecure;                                                                                          // 224
};                                                                                                                // 225
                                                                                                                  //
CollectionPrototype._validatedInsert = function (userId, doc, generatedId) {                                      // 227
  var self = this;                                                                                                // 229
                                                                                                                  //
  // call user validators.                                                                                        // 231
  // Any deny returns true means denied.                                                                          // 232
  if (_.any(self._validators.insert.deny, function (validator) {                                                  // 233
    return validator(userId, docToValidate(validator, doc, generatedId));                                         // 234
  })) {                                                                                                           // 235
    throw new Meteor.Error(403, "Access denied");                                                                 // 236
  }                                                                                                               // 237
  // Any allow returns true means proceed. Throw error if they all fail.                                          // 238
  if (_.all(self._validators.insert.allow, function (validator) {                                                 // 239
    return !validator(userId, docToValidate(validator, doc, generatedId));                                        // 240
  })) {                                                                                                           // 241
    throw new Meteor.Error(403, "Access denied");                                                                 // 242
  }                                                                                                               // 243
                                                                                                                  //
  // If we generated an ID above, insert it now: after the validation, but                                        // 245
  // before actually inserting.                                                                                   // 246
  if (generatedId !== null) doc._id = generatedId;                                                                // 247
                                                                                                                  //
  self._collection.insert.call(self._collection, doc);                                                            // 250
};                                                                                                                // 251
                                                                                                                  //
// Simulate a mongo `update` operation while validating that the access                                           // 253
// control rules set by calls to `allow/deny` are satisfied. If all                                               // 254
// pass, rewrite the mongo operation to use $in to set the list of                                                // 255
// document ids to change ##ValidatedChange                                                                       // 256
CollectionPrototype._validatedUpdate = function (userId, selector, mutator, options) {                            // 257
  var self = this;                                                                                                // 259
                                                                                                                  //
  check(mutator, Object);                                                                                         // 261
                                                                                                                  //
  options = _.clone(options) || {};                                                                               // 263
                                                                                                                  //
  if (!LocalCollection._selectorIsIdPerhapsAsObject(selector)) throw new Error("validated update should be of a single ID");
                                                                                                                  //
  // We don't support upserts because they don't fit nicely into allow/deny                                       // 268
  // rules.                                                                                                       // 269
  if (options.upsert) throw new Meteor.Error(403, "Access denied. Upserts not " + "allowed in a restricted collection.");
                                                                                                                  //
  var noReplaceError = "Access denied. In a restricted collection you can only" + " update documents, not replace them. Use a Mongo update operator, such " + "as '$set'.";
                                                                                                                  //
  // compute modified fields                                                                                      // 278
  var fields = [];                                                                                                // 279
  if (_.isEmpty(mutator)) {                                                                                       // 280
    throw new Meteor.Error(403, noReplaceError);                                                                  // 281
  }                                                                                                               // 282
  _.each(mutator, function (params, op) {                                                                         // 283
    if (op.charAt(0) !== '$') {                                                                                   // 284
      throw new Meteor.Error(403, noReplaceError);                                                                // 285
    } else if (!_.has(ALLOWED_UPDATE_OPERATIONS, op)) {                                                           // 286
      throw new Meteor.Error(403, "Access denied. Operator " + op + " not allowed in a restricted collection.");  // 287
    } else {                                                                                                      // 289
      _.each(_.keys(params), function (field) {                                                                   // 290
        // treat dotted fields as if they are replacing their                                                     // 291
        // top-level part                                                                                         // 292
        if (field.indexOf('.') !== -1) field = field.substring(0, field.indexOf('.'));                            // 293
                                                                                                                  //
        // record the field we are trying to change                                                               // 296
        if (!_.contains(fields, field)) fields.push(field);                                                       // 297
      });                                                                                                         // 299
    }                                                                                                             // 300
  });                                                                                                             // 301
                                                                                                                  //
  var findOptions = { transform: null };                                                                          // 303
  if (!self._validators.fetchAllFields) {                                                                         // 304
    findOptions.fields = {};                                                                                      // 305
    _.each(self._validators.fetch, function (fieldName) {                                                         // 306
      findOptions.fields[fieldName] = 1;                                                                          // 307
    });                                                                                                           // 308
  }                                                                                                               // 309
                                                                                                                  //
  var doc = self._collection.findOne(selector, findOptions);                                                      // 311
  if (!doc) // none satisfied!                                                                                    // 312
    return 0;                                                                                                     // 313
                                                                                                                  //
  // call user validators.                                                                                        // 315
  // Any deny returns true means denied.                                                                          // 316
  if (_.any(self._validators.update.deny, function (validator) {                                                  // 317
    var factoriedDoc = transformDoc(validator, doc);                                                              // 318
    return validator(userId, factoriedDoc, fields, mutator);                                                      // 319
  })) {                                                                                                           // 323
    throw new Meteor.Error(403, "Access denied");                                                                 // 324
  }                                                                                                               // 325
  // Any allow returns true means proceed. Throw error if they all fail.                                          // 326
  if (_.all(self._validators.update.allow, function (validator) {                                                 // 327
    var factoriedDoc = transformDoc(validator, doc);                                                              // 328
    return !validator(userId, factoriedDoc, fields, mutator);                                                     // 329
  })) {                                                                                                           // 333
    throw new Meteor.Error(403, "Access denied");                                                                 // 334
  }                                                                                                               // 335
                                                                                                                  //
  options._forbidReplace = true;                                                                                  // 337
                                                                                                                  //
  // Back when we supported arbitrary client-provided selectors, we actually                                      // 339
  // rewrote the selector to include an _id clause before passing to Mongo to                                     // 340
  // avoid races, but since selector is guaranteed to already just be an ID, we                                   // 341
  // don't have to any more.                                                                                      // 342
                                                                                                                  //
  return self._collection.update.call(self._collection, selector, mutator, options);                              // 344
};                                                                                                                // 346
                                                                                                                  //
// Only allow these operations in validated updates. Specifically                                                 // 348
// whitelist operations, rather than blacklist, so new complex                                                    // 349
// operations that are added aren't automatically allowed. A complex                                              // 350
// operation is one that does more than just modify its target                                                    // 351
// field. For now this contains all update operations except '$rename'.                                           // 352
// http://docs.mongodb.org/manual/reference/operators/#update                                                     // 353
var ALLOWED_UPDATE_OPERATIONS = {                                                                                 // 354
  $inc: 1, $set: 1, $unset: 1, $addToSet: 1, $pop: 1, $pullAll: 1, $pull: 1,                                      // 355
  $pushAll: 1, $push: 1, $bit: 1                                                                                  // 356
};                                                                                                                // 354
                                                                                                                  //
// Simulate a mongo `remove` operation while validating access control                                            // 359
// rules. See #ValidatedChange                                                                                    // 360
CollectionPrototype._validatedRemove = function (userId, selector) {                                              // 361
  var self = this;                                                                                                // 362
                                                                                                                  //
  var findOptions = { transform: null };                                                                          // 364
  if (!self._validators.fetchAllFields) {                                                                         // 365
    findOptions.fields = {};                                                                                      // 366
    _.each(self._validators.fetch, function (fieldName) {                                                         // 367
      findOptions.fields[fieldName] = 1;                                                                          // 368
    });                                                                                                           // 369
  }                                                                                                               // 370
                                                                                                                  //
  var doc = self._collection.findOne(selector, findOptions);                                                      // 372
  if (!doc) return 0;                                                                                             // 373
                                                                                                                  //
  // call user validators.                                                                                        // 376
  // Any deny returns true means denied.                                                                          // 377
  if (_.any(self._validators.remove.deny, function (validator) {                                                  // 378
    return validator(userId, transformDoc(validator, doc));                                                       // 379
  })) {                                                                                                           // 380
    throw new Meteor.Error(403, "Access denied");                                                                 // 381
  }                                                                                                               // 382
  // Any allow returns true means proceed. Throw error if they all fail.                                          // 383
  if (_.all(self._validators.remove.allow, function (validator) {                                                 // 384
    return !validator(userId, transformDoc(validator, doc));                                                      // 385
  })) {                                                                                                           // 386
    throw new Meteor.Error(403, "Access denied");                                                                 // 387
  }                                                                                                               // 388
                                                                                                                  //
  // Back when we supported arbitrary client-provided selectors, we actually                                      // 390
  // rewrote the selector to {_id: {$in: [ids that we found]}} before passing to                                  // 391
  // Mongo to avoid races, but since selector is guaranteed to already just be                                    // 392
  // an ID, we don't have to any more.                                                                            // 393
                                                                                                                  //
  return self._collection.remove.call(self._collection, selector);                                                // 395
};                                                                                                                // 396
                                                                                                                  //
CollectionPrototype._callMutatorMethod = function () {                                                            // 398
  function _callMutatorMethod(name, args, callback) {                                                             // 398
    if (Meteor.isClient && !callback && !alreadyInSimulation()) {                                                 // 399
      // Client can't block, so it can't report errors by exception,                                              // 400
      // only by callback. If they forget the callback, give them a                                               // 401
      // default one that logs the error, so they aren't totally                                                  // 402
      // baffled if their writes don't work because their database is                                             // 403
      // down.                                                                                                    // 404
      // Don't give a default callback in simulation, because inside stubs we                                     // 405
      // want to return the results from the local collection immediately and                                     // 406
      // not force a callback.                                                                                    // 407
      callback = function () {                                                                                    // 408
        function callback(err) {                                                                                  // 408
          if (err) Meteor._debug(name + " failed: " + (err.reason || err.stack));                                 // 409
        }                                                                                                         // 411
                                                                                                                  //
        return callback;                                                                                          // 408
      }();                                                                                                        // 408
    }                                                                                                             // 412
                                                                                                                  //
    // For two out of three mutator methods, the first argument is a selector                                     // 414
    var firstArgIsSelector = name === "update" || name === "remove";                                              // 415
    if (firstArgIsSelector && !alreadyInSimulation()) {                                                           // 416
      // If we're about to actually send an RPC, we should throw an error if                                      // 417
      // this is a non-ID selector, because the mutation methods only allow                                       // 418
      // single-ID selectors. (If we don't throw here, we'll see flicker.)                                        // 419
      throwIfSelectorIsNotId(args[0], name);                                                                      // 420
    }                                                                                                             // 421
                                                                                                                  //
    var mutatorMethodName = this._prefix + name;                                                                  // 423
    return this._connection.apply(mutatorMethodName, args, { returnStubValue: true }, callback);                  // 424
  }                                                                                                               // 426
                                                                                                                  //
  return _callMutatorMethod;                                                                                      // 398
}();                                                                                                              // 398
                                                                                                                  //
function transformDoc(validator, doc) {                                                                           // 428
  if (validator.transform) return validator.transform(doc);                                                       // 429
  return doc;                                                                                                     // 431
}                                                                                                                 // 432
                                                                                                                  //
function docToValidate(validator, doc, generatedId) {                                                             // 434
  var ret = doc;                                                                                                  // 435
  if (validator.transform) {                                                                                      // 436
    ret = EJSON.clone(doc);                                                                                       // 437
    // If you set a server-side transform on your collection, then you don't get                                  // 438
    // to tell the difference between "client specified the ID" and "server                                       // 439
    // generated the ID", because transforms expect to get _id.  If you want to                                   // 440
    // do that check, you can do it with a specific                                                               // 441
    // `C.allow({insert: f, transform: null})` validator.                                                         // 442
    if (generatedId !== null) {                                                                                   // 443
      ret._id = generatedId;                                                                                      // 444
    }                                                                                                             // 445
    ret = validator.transform(ret);                                                                               // 446
  }                                                                                                               // 447
  return ret;                                                                                                     // 448
}                                                                                                                 // 449
                                                                                                                  //
function addValidator(collection, allowOrDeny, options) {                                                         // 451
  // validate keys                                                                                                // 452
  var VALID_KEYS = ['insert', 'update', 'remove', 'fetch', 'transform'];                                          // 453
  _.each(_.keys(options), function (key) {                                                                        // 454
    if (!_.contains(VALID_KEYS, key)) throw new Error(allowOrDeny + ": Invalid key: " + key);                     // 455
  });                                                                                                             // 457
                                                                                                                  //
  collection._restricted = true;                                                                                  // 459
                                                                                                                  //
  _.each(['insert', 'update', 'remove'], function (name) {                                                        // 461
    if (options.hasOwnProperty(name)) {                                                                           // 462
      if (!(options[name] instanceof Function)) {                                                                 // 463
        throw new Error(allowOrDeny + ": Value for `" + name + "` must be a function");                           // 464
      }                                                                                                           // 465
                                                                                                                  //
      // If the transform is specified at all (including as 'null') in this                                       // 467
      // call, then take that; otherwise, take the transform from the                                             // 468
      // collection.                                                                                              // 469
      if (options.transform === undefined) {                                                                      // 470
        options[name].transform = collection._transform; // already wrapped                                       // 471
      } else {                                                                                                    // 472
        options[name].transform = LocalCollection.wrapTransform(options.transform);                               // 473
      }                                                                                                           // 475
                                                                                                                  //
      collection._validators[name][allowOrDeny].push(options[name]);                                              // 477
    }                                                                                                             // 478
  });                                                                                                             // 479
                                                                                                                  //
  // Only update the fetch fields if we're passed things that affect                                              // 481
  // fetching. This way allow({}) and allow({insert: f}) don't result in                                          // 482
  // setting fetchAllFields                                                                                       // 483
  if (options.update || options.remove || options.fetch) {                                                        // 484
    if (options.fetch && !(options.fetch instanceof Array)) {                                                     // 485
      throw new Error(allowOrDeny + ": Value for `fetch` must be an array");                                      // 486
    }                                                                                                             // 487
    collection._updateFetch(options.fetch);                                                                       // 488
  }                                                                                                               // 489
}                                                                                                                 // 490
                                                                                                                  //
function throwIfSelectorIsNotId(selector, methodName) {                                                           // 492
  if (!LocalCollection._selectorIsIdPerhapsAsObject(selector)) {                                                  // 493
    throw new Meteor.Error(403, "Not permitted. Untrusted code may only " + methodName + " documents by ID.");    // 494
  }                                                                                                               // 497
};                                                                                                                // 498
                                                                                                                  //
// Determine if we are in a DDP method simulation                                                                 // 500
function alreadyInSimulation() {                                                                                  // 501
  var enclosing = DDP._CurrentInvocation.get();                                                                   // 502
  return enclosing && enclosing.isSimulation;                                                                     // 503
}                                                                                                                 // 504
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{"extensions":[".js",".json"]});
require("./node_modules/meteor/allow-deny/allow-deny.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['allow-deny'] = {}, {
  AllowDeny: AllowDeny
});

})();

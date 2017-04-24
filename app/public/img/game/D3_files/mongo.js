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
var AllowDeny = Package['allow-deny'].AllowDeny;
var Random = Package.random.Random;
var EJSON = Package.ejson.EJSON;
var _ = Package.underscore._;
var LocalCollection = Package.minimongo.LocalCollection;
var Minimongo = Package.minimongo.Minimongo;
var DDP = Package['ddp-client'].DDP;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var DiffSequence = Package['diff-sequence'].DiffSequence;
var MongoID = Package['mongo-id'].MongoID;
var check = Package.check.check;
var Match = Package.check.Match;
var meteorInstall = Package.modules.meteorInstall;
var Buffer = Package.modules.Buffer;
var process = Package.modules.process;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var LocalCollectionDriver, Mongo;

var require = meteorInstall({"node_modules":{"meteor":{"mongo":{"local_collection_driver.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/mongo/local_collection_driver.js                                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
LocalCollectionDriver = function LocalCollectionDriver() {                                                            // 1
  var self = this;                                                                                                    // 2
  self.noConnCollections = {};                                                                                        // 3
};                                                                                                                    // 4
                                                                                                                      //
var ensureCollection = function ensureCollection(name, collections) {                                                 // 6
  if (!(name in collections)) collections[name] = new LocalCollection(name);                                          // 7
  return collections[name];                                                                                           // 9
};                                                                                                                    // 10
                                                                                                                      //
_.extend(LocalCollectionDriver.prototype, {                                                                           // 12
  open: function () {                                                                                                 // 13
    function open(name, conn) {                                                                                       // 13
      var self = this;                                                                                                // 14
      if (!name) return new LocalCollection();                                                                        // 15
      if (!conn) {                                                                                                    // 17
        return ensureCollection(name, self.noConnCollections);                                                        // 18
      }                                                                                                               // 19
      if (!conn._mongo_livedata_collections) conn._mongo_livedata_collections = {};                                   // 20
      // XXX is there a way to keep track of a connection's collections without                                       // 22
      // dangling it off the connection object?                                                                       // 23
      return ensureCollection(name, conn._mongo_livedata_collections);                                                // 24
    }                                                                                                                 // 25
                                                                                                                      //
    return open;                                                                                                      // 13
  }()                                                                                                                 // 13
});                                                                                                                   // 12
                                                                                                                      //
// singleton                                                                                                          // 28
LocalCollectionDriver = new LocalCollectionDriver();                                                                  // 29
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"collection.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/mongo/collection.js                                                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
// options.connection, if given, is a LivedataClient or LivedataServer                                                // 1
// XXX presently there is no way to destroy/clean up a Collection                                                     // 2
                                                                                                                      //
/**                                                                                                                   // 4
 * @summary Namespace for MongoDB-related items                                                                       //
 * @namespace                                                                                                         //
 */                                                                                                                   //
Mongo = {};                                                                                                           // 8
                                                                                                                      //
/**                                                                                                                   // 10
 * @summary Constructor for a Collection                                                                              //
 * @locus Anywhere                                                                                                    //
 * @instancename collection                                                                                           //
 * @class                                                                                                             //
 * @param {String} name The name of the collection.  If null, creates an unmanaged (unsynchronized) local collection.
 * @param {Object} [options]                                                                                          //
 * @param {Object} options.connection The server connection that will manage this collection. Uses the default connection if not specified.  Pass the return value of calling [`DDP.connect`](#ddp_connect) to specify a different server. Pass `null` to specify no connection. Unmanaged (`name` is null) collections cannot specify a connection.
 * @param {String} options.idGeneration The method of generating the `_id` fields of new documents in this collection.  Possible values:
                                                                                                                      //
 - **`'STRING'`**: random strings                                                                                     //
 - **`'MONGO'`**:  random [`Mongo.ObjectID`](#mongo_object_id) values                                                 //
                                                                                                                      //
The default id generation technique is `'STRING'`.                                                                    //
 * @param {Function} options.transform An optional transformation function. Documents will be passed through this function before being returned from `fetch` or `findOne`, and before being passed to callbacks of `observe`, `map`, `forEach`, `allow`, and `deny`. Transforms are *not* applied for the callbacks of `observeChanges` or to cursors returned from publish functions.
 * @param {Boolean} options.defineMutationMethods Set to `false` to skip setting up the mutation methods that enable insert/update/remove from client code. Default `true`.
 */                                                                                                                   //
Mongo.Collection = function (name, options) {                                                                         // 27
  var self = this;                                                                                                    // 28
  if (!(self instanceof Mongo.Collection)) throw new Error('use "new" to construct a Mongo.Collection');              // 29
                                                                                                                      //
  if (!name && name !== null) {                                                                                       // 32
    Meteor._debug("Warning: creating anonymous collection. It will not be " + "saved or synchronized over the network. (Pass null for " + "the collection name to turn off this warning.)");
    name = null;                                                                                                      // 36
  }                                                                                                                   // 37
                                                                                                                      //
  if (name !== null && typeof name !== "string") {                                                                    // 39
    throw new Error("First argument to new Mongo.Collection must be a string or null");                               // 40
  }                                                                                                                   // 42
                                                                                                                      //
  if (options && options.methods) {                                                                                   // 44
    // Backwards compatibility hack with original signature (which passed                                             // 45
    // "connection" directly instead of in options. (Connections must have a "methods"                                // 46
    // method.)                                                                                                       // 47
    // XXX remove before 1.0                                                                                          // 48
    options = { connection: options };                                                                                // 49
  }                                                                                                                   // 50
  // Backwards compatibility: "connection" used to be called "manager".                                               // 51
  if (options && options.manager && !options.connection) {                                                            // 52
    options.connection = options.manager;                                                                             // 53
  }                                                                                                                   // 54
  options = _.extend({                                                                                                // 55
    connection: undefined,                                                                                            // 56
    idGeneration: 'STRING',                                                                                           // 57
    transform: null,                                                                                                  // 58
    _driver: undefined,                                                                                               // 59
    _preventAutopublish: false                                                                                        // 60
  }, options);                                                                                                        // 55
                                                                                                                      //
  switch (options.idGeneration) {                                                                                     // 63
    case 'MONGO':                                                                                                     // 64
      self._makeNewID = function () {                                                                                 // 65
        var src = name ? DDP.randomStream('/collection/' + name) : Random.insecure;                                   // 66
        return new Mongo.ObjectID(src.hexString(24));                                                                 // 69
      };                                                                                                              // 70
      break;                                                                                                          // 71
    case 'STRING':                                                                                                    // 72
    default:                                                                                                          // 73
      self._makeNewID = function () {                                                                                 // 74
        var src = name ? DDP.randomStream('/collection/' + name) : Random.insecure;                                   // 75
        return src.id();                                                                                              // 78
      };                                                                                                              // 79
      break;                                                                                                          // 80
  }                                                                                                                   // 63
                                                                                                                      //
  self._transform = LocalCollection.wrapTransform(options.transform);                                                 // 83
                                                                                                                      //
  if (!name || options.connection === null)                                                                           // 85
    // note: nameless collections never have a connection                                                             // 86
    self._connection = null;else if (options.connection) self._connection = options.connection;else if (Meteor.isClient) self._connection = Meteor.connection;else self._connection = Meteor.server;
                                                                                                                      //
  if (!options._driver) {                                                                                             // 95
    // XXX This check assumes that webapp is loaded so that Meteor.server !==                                         // 96
    // null. We should fully support the case of "want to use a Mongo-backed                                          // 97
    // collection from Node code without webapp", but we don't yet.                                                   // 98
    // #MeteorServerNull                                                                                              // 99
    if (name && self._connection === Meteor.server && typeof MongoInternals !== "undefined" && MongoInternals.defaultRemoteCollectionDriver) {
      options._driver = MongoInternals.defaultRemoteCollectionDriver();                                               // 103
    } else {                                                                                                          // 104
      options._driver = LocalCollectionDriver;                                                                        // 105
    }                                                                                                                 // 106
  }                                                                                                                   // 107
                                                                                                                      //
  self._collection = options._driver.open(name, self._connection);                                                    // 109
  self._name = name;                                                                                                  // 110
  self._driver = options._driver;                                                                                     // 111
                                                                                                                      //
  if (self._connection && self._connection.registerStore) {                                                           // 113
    // OK, we're going to be a slave, replicating some remote                                                         // 114
    // database, except possibly with some temporary divergence while                                                 // 115
    // we have unacknowledged RPC's.                                                                                  // 116
    var ok = self._connection.registerStore(name, {                                                                   // 117
      // Called at the beginning of a batch of updates. batchSize is the number                                       // 118
      // of update calls to expect.                                                                                   // 119
      //                                                                                                              // 120
      // XXX This interface is pretty janky. reset probably ought to go back to                                       // 121
      // being its own function, and callers shouldn't have to calculate                                              // 122
      // batchSize. The optimization of not calling pause/remove should be                                            // 123
      // delayed until later: the first call to update() should buffer its                                            // 124
      // message, and then we can either directly apply it at endUpdate time if                                       // 125
      // it was the only update, or do pauseObservers/apply/apply at the next                                         // 126
      // update() if there's another one.                                                                             // 127
      beginUpdate: function () {                                                                                      // 128
        function beginUpdate(batchSize, reset) {                                                                      // 128
          // pause observers so users don't see flicker when updating several                                         // 129
          // objects at once (including the post-reconnect reset-and-reapply                                          // 130
          // stage), and so that a re-sorting of a query can take advantage of the                                    // 131
          // full _diffQuery moved calculation instead of applying change one at a                                    // 132
          // time.                                                                                                    // 133
          if (batchSize > 1 || reset) self._collection.pauseObservers();                                              // 134
                                                                                                                      //
          if (reset) self._collection.remove({});                                                                     // 137
        }                                                                                                             // 139
                                                                                                                      //
        return beginUpdate;                                                                                           // 128
      }(),                                                                                                            // 128
                                                                                                                      //
      // Apply an update.                                                                                             // 141
      // XXX better specify this interface (not in terms of a wire message)?                                          // 142
      update: function () {                                                                                           // 143
        function update(msg) {                                                                                        // 143
          var mongoId = MongoID.idParse(msg.id);                                                                      // 144
          var doc = self._collection.findOne(mongoId);                                                                // 145
                                                                                                                      //
          // Is this a "replace the whole doc" message coming from the quiescence                                     // 147
          // of method writes to an object? (Note that 'undefined' is a valid                                         // 148
          // value meaning "remove it".)                                                                              // 149
          if (msg.msg === 'replace') {                                                                                // 150
            var replace = msg.replace;                                                                                // 151
            if (!replace) {                                                                                           // 152
              if (doc) self._collection.remove(mongoId);                                                              // 153
            } else if (!doc) {                                                                                        // 155
              self._collection.insert(replace);                                                                       // 156
            } else {                                                                                                  // 157
              // XXX check that replace has no $ ops                                                                  // 158
              self._collection.update(mongoId, replace);                                                              // 159
            }                                                                                                         // 160
            return;                                                                                                   // 161
          } else if (msg.msg === 'added') {                                                                           // 162
            if (doc) {                                                                                                // 163
              throw new Error("Expected not to find a document already present for an add");                          // 164
            }                                                                                                         // 165
            self._collection.insert(_.extend({ _id: mongoId }, msg.fields));                                          // 166
          } else if (msg.msg === 'removed') {                                                                         // 167
            if (!doc) throw new Error("Expected to find a document already present for removed");                     // 168
            self._collection.remove(mongoId);                                                                         // 170
          } else if (msg.msg === 'changed') {                                                                         // 171
            if (!doc) throw new Error("Expected to find a document to change");                                       // 172
            if (!_.isEmpty(msg.fields)) {                                                                             // 174
              var modifier = {};                                                                                      // 175
              _.each(msg.fields, function (value, key) {                                                              // 176
                if (value === undefined) {                                                                            // 177
                  if (!modifier.$unset) modifier.$unset = {};                                                         // 178
                  modifier.$unset[key] = 1;                                                                           // 180
                } else {                                                                                              // 181
                  if (!modifier.$set) modifier.$set = {};                                                             // 182
                  modifier.$set[key] = value;                                                                         // 184
                }                                                                                                     // 185
              });                                                                                                     // 186
              self._collection.update(mongoId, modifier);                                                             // 187
            }                                                                                                         // 188
          } else {                                                                                                    // 189
            throw new Error("I don't know how to deal with this message");                                            // 190
          }                                                                                                           // 191
        }                                                                                                             // 193
                                                                                                                      //
        return update;                                                                                                // 143
      }(),                                                                                                            // 143
                                                                                                                      //
      // Called at the end of a batch of updates.                                                                     // 195
      endUpdate: function () {                                                                                        // 196
        function endUpdate() {                                                                                        // 196
          self._collection.resumeObservers();                                                                         // 197
        }                                                                                                             // 198
                                                                                                                      //
        return endUpdate;                                                                                             // 196
      }(),                                                                                                            // 196
                                                                                                                      //
      // Called around method stub invocations to capture the original versions                                       // 200
      // of modified documents.                                                                                       // 201
      saveOriginals: function () {                                                                                    // 202
        function saveOriginals() {                                                                                    // 202
          self._collection.saveOriginals();                                                                           // 203
        }                                                                                                             // 204
                                                                                                                      //
        return saveOriginals;                                                                                         // 202
      }(),                                                                                                            // 202
      retrieveOriginals: function () {                                                                                // 205
        function retrieveOriginals() {                                                                                // 205
          return self._collection.retrieveOriginals();                                                                // 206
        }                                                                                                             // 207
                                                                                                                      //
        return retrieveOriginals;                                                                                     // 205
      }(),                                                                                                            // 205
                                                                                                                      //
      // Used to preserve current versions of documents across a store reset.                                         // 209
      getDoc: function () {                                                                                           // 210
        function getDoc(id) {                                                                                         // 210
          return self.findOne(id);                                                                                    // 211
        }                                                                                                             // 212
                                                                                                                      //
        return getDoc;                                                                                                // 210
      }(),                                                                                                            // 210
                                                                                                                      //
      // To be able to get back to the collection from the store.                                                     // 214
      _getCollection: function () {                                                                                   // 215
        function _getCollection() {                                                                                   // 215
          return self;                                                                                                // 216
        }                                                                                                             // 217
                                                                                                                      //
        return _getCollection;                                                                                        // 215
      }()                                                                                                             // 215
    });                                                                                                               // 117
                                                                                                                      //
    if (!ok) {                                                                                                        // 220
      var message = "There is already a collection named \"" + name + "\"";                                           // 221
      if (options._suppressSameNameError === true) {                                                                  // 222
        // XXX In theory we do not have to throw when `ok` is falsy. The store is already defined                     // 223
        // for this collection name, but this will simply be another reference to it and everything                   // 224
        // should work. However, we have historically thrown an error here, so for now we will                        // 225
        // skip the error only when `_suppressSameNameError` is `true`, allowing people to opt in                     // 226
        // and give this some real world testing.                                                                     // 227
        console.warn ? console.warn(message) : console.log(message);                                                  // 228
      } else {                                                                                                        // 229
        throw new Error(message);                                                                                     // 230
      }                                                                                                               // 231
    }                                                                                                                 // 232
  }                                                                                                                   // 233
                                                                                                                      //
  // XXX don't define these until allow or deny is actually used for this                                             // 235
  // collection. Could be hard if the security rules are only defined on the                                          // 236
  // server.                                                                                                          // 237
  if (options.defineMutationMethods !== false) {                                                                      // 238
    try {                                                                                                             // 239
      self._defineMutationMethods({ useExisting: options._suppressSameNameError === true });                          // 240
    } catch (error) {                                                                                                 // 241
      // Throw a more understandable error on the server for same collection name                                     // 242
      if (error.message === "A method named '/" + name + "/insert' is already defined") throw new Error("There is already a collection named \"" + name + "\"");
      throw error;                                                                                                    // 245
    }                                                                                                                 // 246
  }                                                                                                                   // 247
                                                                                                                      //
  // autopublish                                                                                                      // 249
  if (Package.autopublish && !options._preventAutopublish && self._connection && self._connection.publish) {          // 250
    self._connection.publish(null, function () {                                                                      // 252
      return self.find();                                                                                             // 253
    }, { is_auto: true });                                                                                            // 254
  }                                                                                                                   // 255
};                                                                                                                    // 256
                                                                                                                      //
///                                                                                                                   // 258
/// Main collection API                                                                                               // 259
///                                                                                                                   // 260
                                                                                                                      //
                                                                                                                      //
_.extend(Mongo.Collection.prototype, {                                                                                // 263
                                                                                                                      //
  _getFindSelector: function () {                                                                                     // 265
    function _getFindSelector(args) {                                                                                 // 265
      if (args.length == 0) return {};else return args[0];                                                            // 266
    }                                                                                                                 // 270
                                                                                                                      //
    return _getFindSelector;                                                                                          // 265
  }(),                                                                                                                // 265
                                                                                                                      //
  _getFindOptions: function () {                                                                                      // 272
    function _getFindOptions(args) {                                                                                  // 272
      var self = this;                                                                                                // 273
      if (args.length < 2) {                                                                                          // 274
        return { transform: self._transform };                                                                        // 275
      } else {                                                                                                        // 276
        check(args[1], Match.Optional(Match.ObjectIncluding({                                                         // 277
          fields: Match.Optional(Match.OneOf(Object, undefined)),                                                     // 278
          sort: Match.Optional(Match.OneOf(Object, Array, Function, undefined)),                                      // 279
          limit: Match.Optional(Match.OneOf(Number, undefined)),                                                      // 280
          skip: Match.Optional(Match.OneOf(Number, undefined))                                                        // 281
        })));                                                                                                         // 277
                                                                                                                      //
        return _.extend({                                                                                             // 284
          transform: self._transform                                                                                  // 285
        }, args[1]);                                                                                                  // 284
      }                                                                                                               // 287
    }                                                                                                                 // 288
                                                                                                                      //
    return _getFindOptions;                                                                                           // 272
  }(),                                                                                                                // 272
                                                                                                                      //
  /**                                                                                                                 // 290
   * @summary Find the documents in a collection that match the selector.                                             //
   * @locus Anywhere                                                                                                  //
   * @method find                                                                                                     //
   * @memberOf Mongo.Collection                                                                                       //
   * @instance                                                                                                        //
   * @param {MongoSelector} [selector] A query describing the documents to find                                       //
   * @param {Object} [options]                                                                                        //
   * @param {MongoSortSpecifier} options.sort Sort order (default: natural order)                                     //
   * @param {Number} options.skip Number of results to skip at the beginning                                          //
   * @param {Number} options.limit Maximum number of results to return                                                //
   * @param {MongoFieldSpecifier} options.fields Dictionary of fields to return or exclude.                           //
   * @param {Boolean} options.reactive (Client only) Default `true`; pass `false` to disable reactivity               //
   * @param {Function} options.transform Overrides `transform` on the  [`Collection`](#collections) for this cursor.  Pass `null` to disable transformation.
   * @param {Boolean} options.disableOplog (Server only) Pass true to disable oplog-tailing on this query. This affects the way server processes calls to `observe` on this query. Disabling the oplog can be useful when working with data that updates in large batches.
   * @param {Number} options.pollingIntervalMs (Server only) When oplog is disabled (through the use of `disableOplog` or when otherwise not available), the frequency (in milliseconds) of how often to poll this query when observing on the server. Defaults to 10000ms (10 seconds).
   * @param {Number} options.pollingThrottleMs (Server only) When oplog is disabled (through the use of `disableOplog` or when otherwise not available), the minimum time (in milliseconds) to allow between re-polling when observing on the server. Increasing this will save CPU and mongo load at the expense of slower updates to users. Decreasing this is not recommended. Defaults to 50ms.
   * @returns {Mongo.Cursor}                                                                                          //
   */                                                                                                                 //
  find: function () {                                                                                                 // 309
    function find() /* selector, options */{                                                                          // 309
      // Collection.find() (return all docs) behaves differently                                                      // 310
      // from Collection.find(undefined) (return 0 docs).  so be                                                      // 311
      // careful about the length of arguments.                                                                       // 312
      var self = this;                                                                                                // 313
      var argArray = _.toArray(arguments);                                                                            // 314
      return self._collection.find(self._getFindSelector(argArray), self._getFindOptions(argArray));                  // 315
    }                                                                                                                 // 317
                                                                                                                      //
    return find;                                                                                                      // 309
  }(),                                                                                                                // 309
                                                                                                                      //
  /**                                                                                                                 // 319
   * @summary Finds the first document that matches the selector, as ordered by sort and skip options. Returns `undefined` if no matching document is found.
   * @locus Anywhere                                                                                                  //
   * @method findOne                                                                                                  //
   * @memberOf Mongo.Collection                                                                                       //
   * @instance                                                                                                        //
   * @param {MongoSelector} [selector] A query describing the documents to find                                       //
   * @param {Object} [options]                                                                                        //
   * @param {MongoSortSpecifier} options.sort Sort order (default: natural order)                                     //
   * @param {Number} options.skip Number of results to skip at the beginning                                          //
   * @param {MongoFieldSpecifier} options.fields Dictionary of fields to return or exclude.                           //
   * @param {Boolean} options.reactive (Client only) Default true; pass false to disable reactivity                   //
   * @param {Function} options.transform Overrides `transform` on the [`Collection`](#collections) for this cursor.  Pass `null` to disable transformation.
   * @returns {Object}                                                                                                //
   */                                                                                                                 //
  findOne: function () {                                                                                              // 334
    function findOne() /* selector, options */{                                                                       // 334
      var self = this;                                                                                                // 335
      var argArray = _.toArray(arguments);                                                                            // 336
      return self._collection.findOne(self._getFindSelector(argArray), self._getFindOptions(argArray));               // 337
    }                                                                                                                 // 339
                                                                                                                      //
    return findOne;                                                                                                   // 334
  }()                                                                                                                 // 334
                                                                                                                      //
});                                                                                                                   // 263
                                                                                                                      //
Mongo.Collection._publishCursor = function (cursor, sub, collection) {                                                // 343
  var observeHandle = cursor.observeChanges({                                                                         // 344
    added: function () {                                                                                              // 345
      function added(id, fields) {                                                                                    // 345
        sub.added(collection, id, fields);                                                                            // 346
      }                                                                                                               // 347
                                                                                                                      //
      return added;                                                                                                   // 345
    }(),                                                                                                              // 345
    changed: function () {                                                                                            // 348
      function changed(id, fields) {                                                                                  // 348
        sub.changed(collection, id, fields);                                                                          // 349
      }                                                                                                               // 350
                                                                                                                      //
      return changed;                                                                                                 // 348
    }(),                                                                                                              // 348
    removed: function () {                                                                                            // 351
      function removed(id) {                                                                                          // 351
        sub.removed(collection, id);                                                                                  // 352
      }                                                                                                               // 353
                                                                                                                      //
      return removed;                                                                                                 // 351
    }()                                                                                                               // 351
  });                                                                                                                 // 344
                                                                                                                      //
  // We don't call sub.ready() here: it gets called in livedata_server, after                                         // 356
  // possibly calling _publishCursor on multiple returned cursors.                                                    // 357
                                                                                                                      //
  // register stop callback (expects lambda w/ no args).                                                              // 359
  sub.onStop(function () {                                                                                            // 360
    observeHandle.stop();                                                                                             // 360
  });                                                                                                                 // 360
                                                                                                                      //
  // return the observeHandle in case it needs to be stopped early                                                    // 362
  return observeHandle;                                                                                               // 363
};                                                                                                                    // 364
                                                                                                                      //
// protect against dangerous selectors.  falsey and {_id: falsey} are both                                            // 366
// likely programmer error, and not what you want, particularly for destructive                                       // 367
// operations.  JS regexps don't serialize over DDP but can be trivially                                              // 368
// replaced by $regex.                                                                                                // 369
Mongo.Collection._rewriteSelector = function (selector) {                                                             // 370
  // shorthand -- scalars match _id                                                                                   // 371
  if (LocalCollection._selectorIsId(selector)) selector = { _id: selector };                                          // 372
                                                                                                                      //
  if (_.isArray(selector)) {                                                                                          // 375
    // This is consistent with the Mongo console itself; if we don't do this                                          // 376
    // check passing an empty array ends up selecting all items                                                       // 377
    throw new Error("Mongo selector can't be an array.");                                                             // 378
  }                                                                                                                   // 379
                                                                                                                      //
  if (!selector || '_id' in selector && !selector._id)                                                                // 381
    // can't match anything                                                                                           // 382
    return { _id: Random.id() };                                                                                      // 383
                                                                                                                      //
  var ret = {};                                                                                                       // 385
  _.each(selector, function (value, key) {                                                                            // 386
    // Mongo supports both {field: /foo/} and {field: {$regex: /foo/}}                                                // 387
    if (value instanceof RegExp) {                                                                                    // 388
      ret[key] = convertRegexpToMongoSelector(value);                                                                 // 389
    } else if (value && value.$regex instanceof RegExp) {                                                             // 390
      ret[key] = convertRegexpToMongoSelector(value.$regex);                                                          // 391
      // if value is {$regex: /foo/, $options: ...} then $options                                                     // 392
      // override the ones set on $regex.                                                                             // 393
      if (value.$options !== undefined) ret[key].$options = value.$options;                                           // 394
    } else if (_.contains(['$or', '$and', '$nor'], key)) {                                                            // 396
      // Translate lower levels of $and/$or/$nor                                                                      // 398
      ret[key] = _.map(value, function (v) {                                                                          // 399
        return Mongo.Collection._rewriteSelector(v);                                                                  // 400
      });                                                                                                             // 401
    } else {                                                                                                          // 402
      ret[key] = value;                                                                                               // 403
    }                                                                                                                 // 404
  });                                                                                                                 // 405
  return ret;                                                                                                         // 406
};                                                                                                                    // 407
                                                                                                                      //
// convert a JS RegExp object to a Mongo {$regex: ..., $options: ...}                                                 // 409
// selector                                                                                                           // 410
function convertRegexpToMongoSelector(regexp) {                                                                       // 411
  check(regexp, RegExp); // safety belt                                                                               // 412
                                                                                                                      //
  var selector = { $regex: regexp.source };                                                                           // 414
  var regexOptions = '';                                                                                              // 415
  // JS RegExp objects support 'i', 'm', and 'g'. Mongo regex $options                                                // 416
  // support 'i', 'm', 'x', and 's'. So we support 'i' and 'm' here.                                                  // 417
  if (regexp.ignoreCase) regexOptions += 'i';                                                                         // 418
  if (regexp.multiline) regexOptions += 'm';                                                                          // 420
  if (regexOptions) selector.$options = regexOptions;                                                                 // 422
                                                                                                                      //
  return selector;                                                                                                    // 425
};                                                                                                                    // 426
                                                                                                                      //
// 'insert' immediately returns the inserted document's new _id.                                                      // 428
// The others return values immediately if you are in a stub, an in-memory                                            // 429
// unmanaged collection, or a mongo-backed collection and you don't pass a                                            // 430
// callback. 'update' and 'remove' return the number of affected                                                      // 431
// documents. 'upsert' returns an object with keys 'numberAffected' and, if an                                        // 432
// insert happened, 'insertedId'.                                                                                     // 433
//                                                                                                                    // 434
// Otherwise, the semantics are exactly like other methods: they take                                                 // 435
// a callback as an optional last argument; if no callback is                                                         // 436
// provided, they block until the operation is complete, and throw an                                                 // 437
// exception if it fails; if a callback is provided, then they don't                                                  // 438
// necessarily block, and they call the callback when they finish with error and                                      // 439
// result arguments.  (The insert method provides the document ID as its result;                                      // 440
// update and remove provide the number of affected docs as the result; upsert                                        // 441
// provides an object with numberAffected and maybe insertedId.)                                                      // 442
//                                                                                                                    // 443
// On the client, blocking is impossible, so if a callback                                                            // 444
// isn't provided, they just return immediately and any error                                                         // 445
// information is lost.                                                                                               // 446
//                                                                                                                    // 447
// There's one more tweak. On the client, if you don't provide a                                                      // 448
// callback, then if there is an error, a message will be logged with                                                 // 449
// Meteor._debug.                                                                                                     // 450
//                                                                                                                    // 451
// The intent (though this is actually determined by the underlying                                                   // 452
// drivers) is that the operations should be done synchronously, not                                                  // 453
// generating their result until the database has acknowledged                                                        // 454
// them. In the future maybe we should provide a flag to turn this                                                    // 455
// off.                                                                                                               // 456
                                                                                                                      //
/**                                                                                                                   // 458
 * @summary Insert a document in the collection.  Returns its unique _id.                                             //
 * @locus Anywhere                                                                                                    //
 * @method  insert                                                                                                    //
 * @memberOf Mongo.Collection                                                                                         //
 * @instance                                                                                                          //
 * @param {Object} doc The document to insert. May not yet have an _id attribute, in which case Meteor will generate one for you.
 * @param {Function} [callback] Optional.  If present, called with an error object as the first argument and, if no error, the _id as the second.
 */                                                                                                                   //
Mongo.Collection.prototype.insert = function () {                                                                     // 467
  function insert(doc, callback) {                                                                                    // 467
    // Make sure we were passed a document to insert                                                                  // 468
    if (!doc) {                                                                                                       // 469
      throw new Error("insert requires an argument");                                                                 // 470
    }                                                                                                                 // 471
                                                                                                                      //
    // Shallow-copy the document and possibly generate an ID                                                          // 473
    doc = _.extend({}, doc);                                                                                          // 474
                                                                                                                      //
    if ('_id' in doc) {                                                                                               // 476
      if (!doc._id || !(typeof doc._id === 'string' || doc._id instanceof Mongo.ObjectID)) {                          // 477
        throw new Error("Meteor requires document _id fields to be non-empty strings or ObjectIDs");                  // 479
      }                                                                                                               // 480
    } else {                                                                                                          // 481
      var generateId = true;                                                                                          // 482
                                                                                                                      //
      // Don't generate the id if we're the client and the 'outermost' call                                           // 484
      // This optimization saves us passing both the randomSeed and the id                                            // 485
      // Passing both is redundant.                                                                                   // 486
      if (this._isRemoteCollection()) {                                                                               // 487
        var enclosing = DDP._CurrentInvocation.get();                                                                 // 488
        if (!enclosing) {                                                                                             // 489
          generateId = false;                                                                                         // 490
        }                                                                                                             // 491
      }                                                                                                               // 492
                                                                                                                      //
      if (generateId) {                                                                                               // 494
        doc._id = this._makeNewID();                                                                                  // 495
      }                                                                                                               // 496
    }                                                                                                                 // 497
                                                                                                                      //
    // On inserts, always return the id that we generated; on all other                                               // 499
    // operations, just return the result from the collection.                                                        // 500
    var chooseReturnValueFromCollectionResult = function () {                                                         // 501
      function chooseReturnValueFromCollectionResult(result) {                                                        // 501
        if (doc._id) {                                                                                                // 502
          return doc._id;                                                                                             // 503
        }                                                                                                             // 504
                                                                                                                      //
        // XXX what is this for??                                                                                     // 506
        // It's some iteraction between the callback to _callMutatorMethod and                                        // 507
        // the return value conversion                                                                                // 508
        doc._id = result;                                                                                             // 509
                                                                                                                      //
        return result;                                                                                                // 511
      }                                                                                                               // 512
                                                                                                                      //
      return chooseReturnValueFromCollectionResult;                                                                   // 501
    }();                                                                                                              // 501
                                                                                                                      //
    var wrappedCallback = wrapCallback(callback, chooseReturnValueFromCollectionResult);                              // 514
                                                                                                                      //
    if (this._isRemoteCollection()) {                                                                                 // 517
      var result = this._callMutatorMethod("insert", [doc], wrappedCallback);                                         // 518
      return chooseReturnValueFromCollectionResult(result);                                                           // 519
    }                                                                                                                 // 520
                                                                                                                      //
    // it's my collection.  descend into the collection object                                                        // 522
    // and propagate any exception.                                                                                   // 523
    try {                                                                                                             // 524
      // If the user provided a callback and the collection implements this                                           // 525
      // operation asynchronously, then queryRet will be undefined, and the                                           // 526
      // result will be returned through the callback instead.                                                        // 527
      var _result = this._collection.insert(doc, wrappedCallback);                                                    // 528
      return chooseReturnValueFromCollectionResult(_result);                                                          // 529
    } catch (e) {                                                                                                     // 530
      if (callback) {                                                                                                 // 531
        callback(e);                                                                                                  // 532
        return null;                                                                                                  // 533
      }                                                                                                               // 534
      throw e;                                                                                                        // 535
    }                                                                                                                 // 536
  }                                                                                                                   // 537
                                                                                                                      //
  return insert;                                                                                                      // 467
}();                                                                                                                  // 467
                                                                                                                      //
/**                                                                                                                   // 539
 * @summary Modify one or more documents in the collection. Returns the number of matched documents.                  //
 * @locus Anywhere                                                                                                    //
 * @method update                                                                                                     //
 * @memberOf Mongo.Collection                                                                                         //
 * @instance                                                                                                          //
 * @param {MongoSelector} selector Specifies which documents to modify                                                //
 * @param {MongoModifier} modifier Specifies how to modify the documents                                              //
 * @param {Object} [options]                                                                                          //
 * @param {Boolean} options.multi True to modify all matching documents; false to only modify one of the matching documents (the default).
 * @param {Boolean} options.upsert True to insert a document if no matching documents are found.                      //
 * @param {Function} [callback] Optional.  If present, called with an error object as the first argument and, if no error, the number of affected documents as the second.
 */                                                                                                                   //
Mongo.Collection.prototype.update = function () {                                                                     // 552
  function update(selector, modifier) {                                                                               // 552
    for (var _len = arguments.length, optionsAndCallback = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      optionsAndCallback[_key - 2] = arguments[_key];                                                                 // 552
    }                                                                                                                 // 552
                                                                                                                      //
    var callback = popCallbackFromArgs(optionsAndCallback);                                                           // 553
                                                                                                                      //
    selector = Mongo.Collection._rewriteSelector(selector);                                                           // 555
                                                                                                                      //
    // We've already popped off the callback, so we are left with an array                                            // 557
    // of one or zero items                                                                                           // 558
    var options = _.clone(optionsAndCallback[0]) || {};                                                               // 559
    if (options && options.upsert) {                                                                                  // 560
      // set `insertedId` if absent.  `insertedId` is a Meteor extension.                                             // 561
      if (options.insertedId) {                                                                                       // 562
        if (!(typeof options.insertedId === 'string' || options.insertedId instanceof Mongo.ObjectID)) throw new Error("insertedId must be string or ObjectID");
      } else if (!selector._id) {                                                                                     // 566
        options.insertedId = this._makeNewID();                                                                       // 567
      }                                                                                                               // 568
    }                                                                                                                 // 569
                                                                                                                      //
    var wrappedCallback = wrapCallback(callback);                                                                     // 571
                                                                                                                      //
    if (this._isRemoteCollection()) {                                                                                 // 573
      var args = [selector, modifier, options];                                                                       // 574
                                                                                                                      //
      return this._callMutatorMethod("update", args, wrappedCallback);                                                // 580
    }                                                                                                                 // 581
                                                                                                                      //
    // it's my collection.  descend into the collection object                                                        // 583
    // and propagate any exception.                                                                                   // 584
    try {                                                                                                             // 585
      // If the user provided a callback and the collection implements this                                           // 586
      // operation asynchronously, then queryRet will be undefined, and the                                           // 587
      // result will be returned through the callback instead.                                                        // 588
      return this._collection.update(selector, modifier, options, wrappedCallback);                                   // 589
    } catch (e) {                                                                                                     // 591
      if (callback) {                                                                                                 // 592
        callback(e);                                                                                                  // 593
        return null;                                                                                                  // 594
      }                                                                                                               // 595
      throw e;                                                                                                        // 596
    }                                                                                                                 // 597
  }                                                                                                                   // 598
                                                                                                                      //
  return update;                                                                                                      // 552
}();                                                                                                                  // 552
                                                                                                                      //
/**                                                                                                                   // 600
 * @summary Remove documents from the collection                                                                      //
 * @locus Anywhere                                                                                                    //
 * @method remove                                                                                                     //
 * @memberOf Mongo.Collection                                                                                         //
 * @instance                                                                                                          //
 * @param {MongoSelector} selector Specifies which documents to remove                                                //
 * @param {Function} [callback] Optional.  If present, called with an error object as its argument.                   //
 */                                                                                                                   //
Mongo.Collection.prototype.remove = function () {                                                                     // 609
  function remove(selector, callback) {                                                                               // 609
    selector = Mongo.Collection._rewriteSelector(selector);                                                           // 610
                                                                                                                      //
    var wrappedCallback = wrapCallback(callback);                                                                     // 612
                                                                                                                      //
    if (this._isRemoteCollection()) {                                                                                 // 614
      return this._callMutatorMethod("remove", [selector], wrappedCallback);                                          // 615
    }                                                                                                                 // 616
                                                                                                                      //
    // it's my collection.  descend into the collection object                                                        // 618
    // and propagate any exception.                                                                                   // 619
    try {                                                                                                             // 620
      // If the user provided a callback and the collection implements this                                           // 621
      // operation asynchronously, then queryRet will be undefined, and the                                           // 622
      // result will be returned through the callback instead.                                                        // 623
      return this._collection.remove(selector, wrappedCallback);                                                      // 624
    } catch (e) {                                                                                                     // 625
      if (callback) {                                                                                                 // 626
        callback(e);                                                                                                  // 627
        return null;                                                                                                  // 628
      }                                                                                                               // 629
      throw e;                                                                                                        // 630
    }                                                                                                                 // 631
  }                                                                                                                   // 632
                                                                                                                      //
  return remove;                                                                                                      // 609
}();                                                                                                                  // 609
                                                                                                                      //
// Determine if this collection is simply a minimongo representation of a real                                        // 634
// database on another server                                                                                         // 635
Mongo.Collection.prototype._isRemoteCollection = function () {                                                        // 636
  function _isRemoteCollection() {                                                                                    // 636
    // XXX see #MeteorServerNull                                                                                      // 637
    return this._connection && this._connection !== Meteor.server;                                                    // 638
  }                                                                                                                   // 639
                                                                                                                      //
  return _isRemoteCollection;                                                                                         // 636
}();                                                                                                                  // 636
                                                                                                                      //
// Convert the callback to not return a result if there is an error                                                   // 641
function wrapCallback(callback, convertResult) {                                                                      // 642
  if (!callback) {                                                                                                    // 643
    return;                                                                                                           // 644
  }                                                                                                                   // 645
                                                                                                                      //
  // If no convert function was passed in, just use a "blank function"                                                // 647
  convertResult = convertResult || _.identity;                                                                        // 648
                                                                                                                      //
  return function (error, result) {                                                                                   // 650
    callback(error, !error && convertResult(result));                                                                 // 651
  };                                                                                                                  // 652
}                                                                                                                     // 653
                                                                                                                      //
/**                                                                                                                   // 655
 * @summary Modify one or more documents in the collection, or insert one if no matching documents were found. Returns an object with keys `numberAffected` (the number of documents modified)  and `insertedId` (the unique _id of the document that was inserted, if any).
 * @locus Anywhere                                                                                                    //
 * @param {MongoSelector} selector Specifies which documents to modify                                                //
 * @param {MongoModifier} modifier Specifies how to modify the documents                                              //
 * @param {Object} [options]                                                                                          //
 * @param {Boolean} options.multi True to modify all matching documents; false to only modify one of the matching documents (the default).
 * @param {Function} [callback] Optional.  If present, called with an error object as the first argument and, if no error, the number of affected documents as the second.
 */                                                                                                                   //
Mongo.Collection.prototype.upsert = function () {                                                                     // 664
  function upsert(selector, modifier, options, callback) {                                                            // 664
    if (!callback && typeof options === "function") {                                                                 // 666
      callback = options;                                                                                             // 667
      options = {};                                                                                                   // 668
    }                                                                                                                 // 669
                                                                                                                      //
    var updateOptions = _.extend({}, options, {                                                                       // 671
      _returnObject: true,                                                                                            // 672
      upsert: true                                                                                                    // 673
    });                                                                                                               // 671
                                                                                                                      //
    return this.update(selector, modifier, updateOptions, callback);                                                  // 676
  }                                                                                                                   // 677
                                                                                                                      //
  return upsert;                                                                                                      // 664
}();                                                                                                                  // 664
                                                                                                                      //
// We'll actually design an index API later. For now, we just pass through to                                         // 679
// Mongo's, but make it synchronous.                                                                                  // 680
Mongo.Collection.prototype._ensureIndex = function (index, options) {                                                 // 681
  var self = this;                                                                                                    // 682
  if (!self._collection._ensureIndex) throw new Error("Can only call _ensureIndex on server collections");            // 683
  self._collection._ensureIndex(index, options);                                                                      // 685
};                                                                                                                    // 686
Mongo.Collection.prototype._dropIndex = function (index) {                                                            // 687
  var self = this;                                                                                                    // 688
  if (!self._collection._dropIndex) throw new Error("Can only call _dropIndex on server collections");                // 689
  self._collection._dropIndex(index);                                                                                 // 691
};                                                                                                                    // 692
Mongo.Collection.prototype._dropCollection = function () {                                                            // 693
  var self = this;                                                                                                    // 694
  if (!self._collection.dropCollection) throw new Error("Can only call _dropCollection on server collections");       // 695
  self._collection.dropCollection();                                                                                  // 697
};                                                                                                                    // 698
Mongo.Collection.prototype._createCappedCollection = function (byteSize, maxDocuments) {                              // 699
  var self = this;                                                                                                    // 700
  if (!self._collection._createCappedCollection) throw new Error("Can only call _createCappedCollection on server collections");
  self._collection._createCappedCollection(byteSize, maxDocuments);                                                   // 703
};                                                                                                                    // 704
                                                                                                                      //
/**                                                                                                                   // 706
 * @summary Returns the [`Collection`](http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html) object corresponding to this collection from the [npm `mongodb` driver module](https://www.npmjs.com/package/mongodb) which is wrapped by `Mongo.Collection`.
 * @locus Server                                                                                                      //
 */                                                                                                                   //
Mongo.Collection.prototype.rawCollection = function () {                                                              // 710
  var self = this;                                                                                                    // 711
  if (!self._collection.rawCollection) {                                                                              // 712
    throw new Error("Can only call rawCollection on server collections");                                             // 713
  }                                                                                                                   // 714
  return self._collection.rawCollection();                                                                            // 715
};                                                                                                                    // 716
                                                                                                                      //
/**                                                                                                                   // 718
 * @summary Returns the [`Db`](http://mongodb.github.io/node-mongodb-native/2.2/api/Db.html) object corresponding to this collection's database connection from the [npm `mongodb` driver module](https://www.npmjs.com/package/mongodb) which is wrapped by `Mongo.Collection`.
 * @locus Server                                                                                                      //
 */                                                                                                                   //
Mongo.Collection.prototype.rawDatabase = function () {                                                                // 722
  var self = this;                                                                                                    // 723
  if (!(self._driver.mongo && self._driver.mongo.db)) {                                                               // 724
    throw new Error("Can only call rawDatabase on server collections");                                               // 725
  }                                                                                                                   // 726
  return self._driver.mongo.db;                                                                                       // 727
};                                                                                                                    // 728
                                                                                                                      //
/**                                                                                                                   // 731
 * @summary Create a Mongo-style `ObjectID`.  If you don't specify a `hexString`, the `ObjectID` will generated randomly (not using MongoDB's ID construction rules).
 * @locus Anywhere                                                                                                    //
 * @class                                                                                                             //
 * @param {String} [hexString] Optional.  The 24-character hexadecimal contents of the ObjectID to create             //
 */                                                                                                                   //
Mongo.ObjectID = MongoID.ObjectID;                                                                                    // 737
                                                                                                                      //
/**                                                                                                                   // 739
 * @summary To create a cursor, use find. To access the documents in a cursor, use forEach, map, or fetch.            //
 * @class                                                                                                             //
 * @instanceName cursor                                                                                               //
 */                                                                                                                   //
Mongo.Cursor = LocalCollection.Cursor;                                                                                // 744
                                                                                                                      //
/**                                                                                                                   // 746
 * @deprecated in 0.9.1                                                                                               //
 */                                                                                                                   //
Mongo.Collection.Cursor = Mongo.Cursor;                                                                               // 749
                                                                                                                      //
/**                                                                                                                   // 751
 * @deprecated in 0.9.1                                                                                               //
 */                                                                                                                   //
Mongo.Collection.ObjectID = Mongo.ObjectID;                                                                           // 754
                                                                                                                      //
/**                                                                                                                   // 756
 * @deprecated in 0.9.1                                                                                               //
 */                                                                                                                   //
Meteor.Collection = Mongo.Collection;                                                                                 // 759
                                                                                                                      //
// Allow deny stuff is now in the allow-deny package                                                                  // 761
_.extend(Meteor.Collection.prototype, AllowDeny.CollectionPrototype);                                                 // 762
                                                                                                                      //
function popCallbackFromArgs(args) {                                                                                  // 764
  // Pull off any callback (or perhaps a 'callback' variable that was passed                                          // 765
  // in undefined, like how 'upsert' does it).                                                                        // 766
  if (args.length && (args[args.length - 1] === undefined || args[args.length - 1] instanceof Function)) {            // 767
    return args.pop();                                                                                                // 770
  }                                                                                                                   // 771
}                                                                                                                     // 772
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{"extensions":[".js",".json"]});
require("./node_modules/meteor/mongo/local_collection_driver.js");
require("./node_modules/meteor/mongo/collection.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package.mongo = {}, {
  Mongo: Mongo
});

})();

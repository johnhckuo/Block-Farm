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
var EJSON = Package.ejson.EJSON;
var IdMap = Package['id-map'].IdMap;
var OrderedDict = Package['ordered-dict'].OrderedDict;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var MongoID = Package['mongo-id'].MongoID;
var Random = Package.random.Random;
var DiffSequence = Package['diff-sequence'].DiffSequence;
var GeoJSON = Package['geojson-utils'].GeoJSON;

/* Package-scope variables */
var LocalCollection, Minimongo, MinimongoTest, MinimongoError, isArray, isPlainObject, isIndexable, isOperatorObject, isNumericKey, regexpElementMatcher, equalityElementMatcher, ELEMENT_OPERATORS, makeLookupFunction, expandArraysInBranches, projectionDetails, pathsToTree;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/minimongo/minimongo.js                                                                              //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
// XXX type checking on selectors (graceful error if malformed)                                                 // 1
                                                                                                                // 2
// LocalCollection: a set of documents that supports queries and modifiers.                                     // 3
                                                                                                                // 4
// Cursor: a specification for a particular subset of documents, w/                                             // 5
// a defined order, limit, and offset.  creating a Cursor with LocalCollection.find(),                          // 6
                                                                                                                // 7
// ObserveHandle: the return value of a live query.                                                             // 8
                                                                                                                // 9
LocalCollection = function (name) {                                                                             // 10
  var self = this;                                                                                              // 11
  self.name = name;                                                                                             // 12
  // _id -> document (also containing id)                                                                       // 13
  self._docs = new LocalCollection._IdMap;                                                                      // 14
                                                                                                                // 15
  self._observeQueue = new Meteor._SynchronousQueue();                                                          // 16
                                                                                                                // 17
  self.next_qid = 1; // live query id generator                                                                 // 18
                                                                                                                // 19
  // qid -> live query object. keys:                                                                            // 20
  //  ordered: bool. ordered queries have addedBefore/movedBefore callbacks.                                    // 21
  //  results: array (ordered) or object (unordered) of current results                                         // 22
  //    (aliased with self._docs!)                                                                              // 23
  //  resultsSnapshot: snapshot of results. null if not paused.                                                 // 24
  //  cursor: Cursor object for the query.                                                                      // 25
  //  selector, sorter, (callbacks): functions                                                                  // 26
  self.queries = {};                                                                                            // 27
                                                                                                                // 28
  // null if not saving originals; an IdMap from id to original document value if                               // 29
  // saving originals. See comments before saveOriginals().                                                     // 30
  self._savedOriginals = null;                                                                                  // 31
                                                                                                                // 32
  // True when observers are paused and we should not send callbacks.                                           // 33
  self.paused = false;                                                                                          // 34
};                                                                                                              // 35
                                                                                                                // 36
Minimongo = {};                                                                                                 // 37
                                                                                                                // 38
// Object exported only for unit testing.                                                                       // 39
// Use it to export private functions to test in Tinytest.                                                      // 40
MinimongoTest = {};                                                                                             // 41
                                                                                                                // 42
MinimongoError = function (message) {                                                                           // 43
  var e = new Error(message);                                                                                   // 44
  e.name = "MinimongoError";                                                                                    // 45
  return e;                                                                                                     // 46
};                                                                                                              // 47
                                                                                                                // 48
                                                                                                                // 49
// options may include sort, skip, limit, reactive                                                              // 50
// sort may be any of these forms:                                                                              // 51
//     {a: 1, b: -1}                                                                                            // 52
//     [["a", "asc"], ["b", "desc"]]                                                                            // 53
//     ["a", ["b", "desc"]]                                                                                     // 54
//   (in the first form you're beholden to key enumeration order in                                             // 55
//   your javascript VM)                                                                                        // 56
//                                                                                                              // 57
// reactive: if given, and false, don't register with Tracker (default                                          // 58
// is true)                                                                                                     // 59
//                                                                                                              // 60
// XXX possibly should support retrieving a subset of fields? and                                               // 61
// have it be a hint (ignored on the client, when not copying the                                               // 62
// doc?)                                                                                                        // 63
//                                                                                                              // 64
// XXX sort does not yet support subkeys ('a.b') .. fix that!                                                   // 65
// XXX add one more sort form: "key"                                                                            // 66
// XXX tests                                                                                                    // 67
LocalCollection.prototype.find = function (selector, options) {                                                 // 68
  // default syntax for everything is to omit the selector argument.                                            // 69
  // but if selector is explicitly passed in as false or undefined, we                                          // 70
  // want a selector that matches nothing.                                                                      // 71
  if (arguments.length === 0)                                                                                   // 72
    selector = {};                                                                                              // 73
                                                                                                                // 74
  return new LocalCollection.Cursor(this, selector, options);                                                   // 75
};                                                                                                              // 76
                                                                                                                // 77
// don't call this ctor directly.  use LocalCollection.find().                                                  // 78
                                                                                                                // 79
LocalCollection.Cursor = function (collection, selector, options) {                                             // 80
  var self = this;                                                                                              // 81
  if (!options) options = {};                                                                                   // 82
                                                                                                                // 83
  self.collection = collection;                                                                                 // 84
  self.sorter = null;                                                                                           // 85
  self.matcher = new Minimongo.Matcher(selector);                                                               // 86
                                                                                                                // 87
  if (LocalCollection._selectorIsId(selector)) {                                                                // 88
    // stash for fast path                                                                                      // 89
    self._selectorId = selector;                                                                                // 90
  } else if (LocalCollection._selectorIsIdPerhapsAsObject(selector)) {                                          // 91
    // also do the fast path for { _id: idString }                                                              // 92
    self._selectorId = selector._id;                                                                            // 93
  } else {                                                                                                      // 94
    self._selectorId = undefined;                                                                               // 95
    if (self.matcher.hasGeoQuery() || options.sort) {                                                           // 96
      self.sorter = new Minimongo.Sorter(options.sort || [],                                                    // 97
                                         { matcher: self.matcher });                                            // 98
    }                                                                                                           // 99
  }                                                                                                             // 100
                                                                                                                // 101
  self.skip = options.skip;                                                                                     // 102
  self.limit = options.limit;                                                                                   // 103
  self.fields = options.fields;                                                                                 // 104
                                                                                                                // 105
  self._projectionFn = LocalCollection._compileProjection(self.fields || {});                                   // 106
                                                                                                                // 107
  self._transform = LocalCollection.wrapTransform(options.transform);                                           // 108
                                                                                                                // 109
  // by default, queries register w/ Tracker when it is available.                                              // 110
  if (typeof Tracker !== "undefined")                                                                           // 111
    self.reactive = (options.reactive === undefined) ? true : options.reactive;                                 // 112
};                                                                                                              // 113
                                                                                                                // 114
// Since we don't actually have a "nextObject" interface, there's really no                                     // 115
// reason to have a "rewind" interface.  All it did was make multiple calls                                     // 116
// to fetch/map/forEach return nothing the second time.                                                         // 117
// XXX COMPAT WITH 0.8.1                                                                                        // 118
LocalCollection.Cursor.prototype.rewind = function () {                                                         // 119
};                                                                                                              // 120
                                                                                                                // 121
LocalCollection.prototype.findOne = function (selector, options) {                                              // 122
  if (arguments.length === 0)                                                                                   // 123
    selector = {};                                                                                              // 124
                                                                                                                // 125
  // NOTE: by setting limit 1 here, we end up using very inefficient                                            // 126
  // code that recomputes the whole query on each update. The upside is                                         // 127
  // that when you reactively depend on a findOne you only get                                                  // 128
  // invalidated when the found object changes, not any object in the                                           // 129
  // collection. Most findOne will be by id, which has a fast path, so                                          // 130
  // this might not be a big deal. In most cases, invalidation causes                                           // 131
  // the called to re-query anyway, so this should be a net performance                                         // 132
  // improvement.                                                                                               // 133
  options = options || {};                                                                                      // 134
  options.limit = 1;                                                                                            // 135
                                                                                                                // 136
  return this.find(selector, options).fetch()[0];                                                               // 137
};                                                                                                              // 138
                                                                                                                // 139
/**                                                                                                             // 140
 * @callback IterationCallback                                                                                  // 141
 * @param {Object} doc                                                                                          // 142
 * @param {Number} index                                                                                        // 143
 */                                                                                                             // 144
/**                                                                                                             // 145
 * @summary Call `callback` once for each matching document, sequentially and synchronously.                    // 146
 * @locus Anywhere                                                                                              // 147
 * @method  forEach                                                                                             // 148
 * @instance                                                                                                    // 149
 * @memberOf Mongo.Cursor                                                                                       // 150
 * @param {IterationCallback} callback Function to call. It will be called with three arguments: the document, a 0-based index, and <em>cursor</em> itself.
 * @param {Any} [thisArg] An object which will be the value of `this` inside `callback`.                        // 152
 */                                                                                                             // 153
LocalCollection.Cursor.prototype.forEach = function (callback, thisArg) {                                       // 154
  var self = this;                                                                                              // 155
                                                                                                                // 156
  var objects = self._getRawObjects({ordered: true});                                                           // 157
                                                                                                                // 158
  if (self.reactive) {                                                                                          // 159
    self._depend({                                                                                              // 160
      addedBefore: true,                                                                                        // 161
      removed: true,                                                                                            // 162
      changed: true,                                                                                            // 163
      movedBefore: true});                                                                                      // 164
  }                                                                                                             // 165
                                                                                                                // 166
  _.each(objects, function (elt, i) {                                                                           // 167
    // This doubles as a clone operation.                                                                       // 168
    elt = self._projectionFn(elt);                                                                              // 169
                                                                                                                // 170
    if (self._transform)                                                                                        // 171
      elt = self._transform(elt);                                                                               // 172
    callback.call(thisArg, elt, i, self);                                                                       // 173
  });                                                                                                           // 174
};                                                                                                              // 175
                                                                                                                // 176
LocalCollection.Cursor.prototype.getTransform = function () {                                                   // 177
  return this._transform;                                                                                       // 178
};                                                                                                              // 179
                                                                                                                // 180
/**                                                                                                             // 181
 * @summary Map callback over all matching documents.  Returns an Array.                                        // 182
 * @locus Anywhere                                                                                              // 183
 * @method map                                                                                                  // 184
 * @instance                                                                                                    // 185
 * @memberOf Mongo.Cursor                                                                                       // 186
 * @param {IterationCallback} callback Function to call. It will be called with three arguments: the document, a 0-based index, and <em>cursor</em> itself.
 * @param {Any} [thisArg] An object which will be the value of `this` inside `callback`.                        // 188
 */                                                                                                             // 189
LocalCollection.Cursor.prototype.map = function (callback, thisArg) {                                           // 190
  var self = this;                                                                                              // 191
  var res = [];                                                                                                 // 192
  self.forEach(function (doc, index) {                                                                          // 193
    res.push(callback.call(thisArg, doc, index, self));                                                         // 194
  });                                                                                                           // 195
  return res;                                                                                                   // 196
};                                                                                                              // 197
                                                                                                                // 198
/**                                                                                                             // 199
 * @summary Return all matching documents as an Array.                                                          // 200
 * @memberOf Mongo.Cursor                                                                                       // 201
 * @method  fetch                                                                                               // 202
 * @instance                                                                                                    // 203
 * @locus Anywhere                                                                                              // 204
 * @returns {Object[]}                                                                                          // 205
 */                                                                                                             // 206
LocalCollection.Cursor.prototype.fetch = function () {                                                          // 207
  var self = this;                                                                                              // 208
  var res = [];                                                                                                 // 209
  self.forEach(function (doc) {                                                                                 // 210
    res.push(doc);                                                                                              // 211
  });                                                                                                           // 212
  return res;                                                                                                   // 213
};                                                                                                              // 214
                                                                                                                // 215
/**                                                                                                             // 216
 * @summary Returns the number of documents that match a query.                                                 // 217
 * @memberOf Mongo.Cursor                                                                                       // 218
 * @method  count                                                                                               // 219
 * @instance                                                                                                    // 220
 * @locus Anywhere                                                                                              // 221
 * @returns {Number}                                                                                            // 222
 */                                                                                                             // 223
LocalCollection.Cursor.prototype.count = function () {                                                          // 224
  var self = this;                                                                                              // 225
                                                                                                                // 226
  if (self.reactive)                                                                                            // 227
    self._depend({added: true, removed: true},                                                                  // 228
                 true /* allow the observe to be unordered */);                                                 // 229
                                                                                                                // 230
  return self._getRawObjects({ordered: true}).length;                                                           // 231
};                                                                                                              // 232
                                                                                                                // 233
LocalCollection.Cursor.prototype._publishCursor = function (sub) {                                              // 234
  var self = this;                                                                                              // 235
  if (! self.collection.name)                                                                                   // 236
    throw new Error("Can't publish a cursor from a collection without a name.");                                // 237
  var collection = self.collection.name;                                                                        // 238
                                                                                                                // 239
  // XXX minimongo should not depend on mongo-livedata!                                                         // 240
  if (! Package.mongo) {                                                                                        // 241
    throw new Error("Can't publish from Minimongo without the `mongo` package.");                               // 242
  }                                                                                                             // 243
                                                                                                                // 244
  return Package.mongo.Mongo.Collection._publishCursor(self, sub, collection);                                  // 245
};                                                                                                              // 246
                                                                                                                // 247
LocalCollection.Cursor.prototype._getCollectionName = function () {                                             // 248
  var self = this;                                                                                              // 249
  return self.collection.name;                                                                                  // 250
};                                                                                                              // 251
                                                                                                                // 252
LocalCollection._observeChangesCallbacksAreOrdered = function (callbacks) {                                     // 253
  if (callbacks.added && callbacks.addedBefore)                                                                 // 254
    throw new Error("Please specify only one of added() and addedBefore()");                                    // 255
  return !!(callbacks.addedBefore || callbacks.movedBefore);                                                    // 256
};                                                                                                              // 257
                                                                                                                // 258
LocalCollection._observeCallbacksAreOrdered = function (callbacks) {                                            // 259
  if (callbacks.addedAt && callbacks.added)                                                                     // 260
    throw new Error("Please specify only one of added() and addedAt()");                                        // 261
  if (callbacks.changedAt && callbacks.changed)                                                                 // 262
    throw new Error("Please specify only one of changed() and changedAt()");                                    // 263
  if (callbacks.removed && callbacks.removedAt)                                                                 // 264
    throw new Error("Please specify only one of removed() and removedAt()");                                    // 265
                                                                                                                // 266
  return !!(callbacks.addedAt || callbacks.movedTo || callbacks.changedAt                                       // 267
            || callbacks.removedAt);                                                                            // 268
};                                                                                                              // 269
                                                                                                                // 270
// the handle that comes back from observe.                                                                     // 271
LocalCollection.ObserveHandle = function () {};                                                                 // 272
                                                                                                                // 273
// options to contain:                                                                                          // 274
//  * callbacks for observe():                                                                                  // 275
//    - addedAt (document, atIndex)                                                                             // 276
//    - added (document)                                                                                        // 277
//    - changedAt (newDocument, oldDocument, atIndex)                                                           // 278
//    - changed (newDocument, oldDocument)                                                                      // 279
//    - removedAt (document, atIndex)                                                                           // 280
//    - removed (document)                                                                                      // 281
//    - movedTo (document, oldIndex, newIndex)                                                                  // 282
//                                                                                                              // 283
// attributes available on returned query handle:                                                               // 284
//  * stop(): end updates                                                                                       // 285
//  * collection: the collection this query is querying                                                         // 286
//                                                                                                              // 287
// iff x is a returned query handle, (x instanceof                                                              // 288
// LocalCollection.ObserveHandle) is true                                                                       // 289
//                                                                                                              // 290
// initial results delivered through added callback                                                             // 291
// XXX maybe callbacks should take a list of objects, to expose transactions?                                   // 292
// XXX maybe support field limiting (to limit what you're notified on)                                          // 293
                                                                                                                // 294
_.extend(LocalCollection.Cursor.prototype, {                                                                    // 295
  /**                                                                                                           // 296
   * @summary Watch a query.  Receive callbacks as the result set changes.                                      // 297
   * @locus Anywhere                                                                                            // 298
   * @memberOf Mongo.Cursor                                                                                     // 299
   * @instance                                                                                                  // 300
   * @param {Object} callbacks Functions to call to deliver the result set as it changes                        // 301
   */                                                                                                           // 302
  observe: function (options) {                                                                                 // 303
    var self = this;                                                                                            // 304
    return LocalCollection._observeFromObserveChanges(self, options);                                           // 305
  },                                                                                                            // 306
                                                                                                                // 307
  /**                                                                                                           // 308
   * @summary Watch a query.  Receive callbacks as the result set changes.  Only the differences between the old and new documents are passed to the callbacks.
   * @locus Anywhere                                                                                            // 310
   * @memberOf Mongo.Cursor                                                                                     // 311
   * @instance                                                                                                  // 312
   * @param {Object} callbacks Functions to call to deliver the result set as it changes                        // 313
   */                                                                                                           // 314
  observeChanges: function (options) {                                                                          // 315
    var self = this;                                                                                            // 316
                                                                                                                // 317
    var ordered = LocalCollection._observeChangesCallbacksAreOrdered(options);                                  // 318
                                                                                                                // 319
    // there are several places that assume you aren't combining skip/limit with                                // 320
    // unordered observe.  eg, update's EJSON.clone, and the "there are several"                                // 321
    // comment in _modifyAndNotify                                                                              // 322
    // XXX allow skip/limit with unordered observe                                                              // 323
    if (!options._allow_unordered && !ordered && (self.skip || self.limit))                                     // 324
      throw new Error("must use ordered observe (ie, 'addedBefore' instead of 'added') with skip or limit");    // 325
                                                                                                                // 326
    if (self.fields && (self.fields._id === 0 || self.fields._id === false))                                    // 327
      throw Error("You may not observe a cursor with {fields: {_id: 0}}");                                      // 328
                                                                                                                // 329
    var query = {                                                                                               // 330
      dirty: false,                                                                                             // 331
      matcher: self.matcher, // not fast pathed                                                                 // 332
      sorter: ordered && self.sorter,                                                                           // 333
      distances: (                                                                                              // 334
        self.matcher.hasGeoQuery() && ordered && new LocalCollection._IdMap),                                   // 335
      resultsSnapshot: null,                                                                                    // 336
      ordered: ordered,                                                                                         // 337
      cursor: self,                                                                                             // 338
      projectionFn: self._projectionFn                                                                          // 339
    };                                                                                                          // 340
    var qid;                                                                                                    // 341
                                                                                                                // 342
    // Non-reactive queries call added[Before] and then never call anything                                     // 343
    // else.                                                                                                    // 344
    if (self.reactive) {                                                                                        // 345
      qid = self.collection.next_qid++;                                                                         // 346
      self.collection.queries[qid] = query;                                                                     // 347
    }                                                                                                           // 348
    query.results = self._getRawObjects({                                                                       // 349
      ordered: ordered, distances: query.distances});                                                           // 350
    if (self.collection.paused)                                                                                 // 351
      query.resultsSnapshot = (ordered ? [] : new LocalCollection._IdMap);                                      // 352
                                                                                                                // 353
    // wrap callbacks we were passed. callbacks only fire when not paused and                                   // 354
    // are never undefined                                                                                      // 355
    // Filters out blacklisted fields according to cursor's projection.                                         // 356
    // XXX wrong place for this?                                                                                // 357
                                                                                                                // 358
    // furthermore, callbacks enqueue until the operation we're working on is                                   // 359
    // done.                                                                                                    // 360
    var wrapCallback = function (f) {                                                                           // 361
      if (!f)                                                                                                   // 362
        return function () {};                                                                                  // 363
      return function (/*args*/) {                                                                              // 364
        var context = this;                                                                                     // 365
        var args = arguments;                                                                                   // 366
                                                                                                                // 367
        if (self.collection.paused)                                                                             // 368
          return;                                                                                               // 369
                                                                                                                // 370
        self.collection._observeQueue.queueTask(function () {                                                   // 371
          f.apply(context, args);                                                                               // 372
        });                                                                                                     // 373
      };                                                                                                        // 374
    };                                                                                                          // 375
    query.added = wrapCallback(options.added);                                                                  // 376
    query.changed = wrapCallback(options.changed);                                                              // 377
    query.removed = wrapCallback(options.removed);                                                              // 378
    if (ordered) {                                                                                              // 379
      query.addedBefore = wrapCallback(options.addedBefore);                                                    // 380
      query.movedBefore = wrapCallback(options.movedBefore);                                                    // 381
    }                                                                                                           // 382
                                                                                                                // 383
    if (!options._suppress_initial && !self.collection.paused) {                                                // 384
      // XXX unify ordered and unordered interface                                                              // 385
      var each = ordered                                                                                        // 386
            ? _.bind(_.each, null, query.results)                                                               // 387
            : _.bind(query.results.forEach, query.results);                                                     // 388
      each(function (doc) {                                                                                     // 389
        var fields = EJSON.clone(doc);                                                                          // 390
                                                                                                                // 391
        delete fields._id;                                                                                      // 392
        if (ordered)                                                                                            // 393
          query.addedBefore(doc._id, self._projectionFn(fields), null);                                         // 394
        query.added(doc._id, self._projectionFn(fields));                                                       // 395
      });                                                                                                       // 396
    }                                                                                                           // 397
                                                                                                                // 398
    var handle = new LocalCollection.ObserveHandle;                                                             // 399
    _.extend(handle, {                                                                                          // 400
      collection: self.collection,                                                                              // 401
      stop: function () {                                                                                       // 402
        if (self.reactive)                                                                                      // 403
          delete self.collection.queries[qid];                                                                  // 404
      }                                                                                                         // 405
    });                                                                                                         // 406
                                                                                                                // 407
    if (self.reactive && Tracker.active) {                                                                      // 408
      // XXX in many cases, the same observe will be recreated when                                             // 409
      // the current autorun is rerun.  we could save work by                                                   // 410
      // letting it linger across rerun and potentially get                                                     // 411
      // repurposed if the same observe is performed, using logic                                               // 412
      // similar to that of Meteor.subscribe.                                                                   // 413
      Tracker.onInvalidate(function () {                                                                        // 414
        handle.stop();                                                                                          // 415
      });                                                                                                       // 416
    }                                                                                                           // 417
    // run the observe callbacks resulting from the initial contents                                            // 418
    // before we leave the observe.                                                                             // 419
    self.collection._observeQueue.drain();                                                                      // 420
                                                                                                                // 421
    return handle;                                                                                              // 422
  }                                                                                                             // 423
});                                                                                                             // 424
                                                                                                                // 425
// Returns a collection of matching objects, but doesn't deep copy them.                                        // 426
//                                                                                                              // 427
// If ordered is set, returns a sorted array, respecting sorter, skip, and limit                                // 428
// properties of the query.  if sorter is falsey, no sort -- you get the natural                                // 429
// order.                                                                                                       // 430
//                                                                                                              // 431
// If ordered is not set, returns an object mapping from ID to doc (sorter, skip                                // 432
// and limit should not be set).                                                                                // 433
//                                                                                                              // 434
// If ordered is set and this cursor is a $near geoquery, then this function                                    // 435
// will use an _IdMap to track each distance from the $near argument point in                                   // 436
// order to use it as a sort key. If an _IdMap is passed in the 'distances'                                     // 437
// argument, this function will clear it and use it for this purpose (otherwise                                 // 438
// it will just create its own _IdMap). The observeChanges implementation uses                                  // 439
// this to remember the distances after this function returns.                                                  // 440
LocalCollection.Cursor.prototype._getRawObjects = function (options) {                                          // 441
  var self = this;                                                                                              // 442
  options = options || {};                                                                                      // 443
                                                                                                                // 444
  // XXX use OrderedDict instead of array, and make IdMap and OrderedDict                                       // 445
  // compatible                                                                                                 // 446
  var results = options.ordered ? [] : new LocalCollection._IdMap;                                              // 447
                                                                                                                // 448
  // fast path for single ID value                                                                              // 449
  if (self._selectorId !== undefined) {                                                                         // 450
    // If you have non-zero skip and ask for a single id, you get                                               // 451
    // nothing. This is so it matches the behavior of the '{_id: foo}'                                          // 452
    // path.                                                                                                    // 453
    if (self.skip)                                                                                              // 454
      return results;                                                                                           // 455
                                                                                                                // 456
    var selectedDoc = self.collection._docs.get(self._selectorId);                                              // 457
    if (selectedDoc) {                                                                                          // 458
      if (options.ordered)                                                                                      // 459
        results.push(selectedDoc);                                                                              // 460
      else                                                                                                      // 461
        results.set(self._selectorId, selectedDoc);                                                             // 462
    }                                                                                                           // 463
    return results;                                                                                             // 464
  }                                                                                                             // 465
                                                                                                                // 466
  // slow path for arbitrary selector, sort, skip, limit                                                        // 467
                                                                                                                // 468
  // in the observeChanges case, distances is actually part of the "query" (ie,                                 // 469
  // live results set) object.  in other cases, distances is only used inside                                   // 470
  // this function.                                                                                             // 471
  var distances;                                                                                                // 472
  if (self.matcher.hasGeoQuery() && options.ordered) {                                                          // 473
    if (options.distances) {                                                                                    // 474
      distances = options.distances;                                                                            // 475
      distances.clear();                                                                                        // 476
    } else {                                                                                                    // 477
      distances = new LocalCollection._IdMap();                                                                 // 478
    }                                                                                                           // 479
  }                                                                                                             // 480
                                                                                                                // 481
  self.collection._docs.forEach(function (doc, id) {                                                            // 482
    var matchResult = self.matcher.documentMatches(doc);                                                        // 483
    if (matchResult.result) {                                                                                   // 484
      if (options.ordered) {                                                                                    // 485
        results.push(doc);                                                                                      // 486
        if (distances && matchResult.distance !== undefined)                                                    // 487
          distances.set(id, matchResult.distance);                                                              // 488
      } else {                                                                                                  // 489
        results.set(id, doc);                                                                                   // 490
      }                                                                                                         // 491
    }                                                                                                           // 492
    // Fast path for limited unsorted queries.                                                                  // 493
    // XXX 'length' check here seems wrong for ordered                                                          // 494
    if (self.limit && !self.skip && !self.sorter &&                                                             // 495
        results.length === self.limit)                                                                          // 496
      return false;  // break                                                                                   // 497
    return true;  // continue                                                                                   // 498
  });                                                                                                           // 499
                                                                                                                // 500
  if (!options.ordered)                                                                                         // 501
    return results;                                                                                             // 502
                                                                                                                // 503
  if (self.sorter) {                                                                                            // 504
    var comparator = self.sorter.getComparator({distances: distances});                                         // 505
    results.sort(comparator);                                                                                   // 506
  }                                                                                                             // 507
                                                                                                                // 508
  var idx_start = self.skip || 0;                                                                               // 509
  var idx_end = self.limit ? (self.limit + idx_start) : results.length;                                         // 510
  return results.slice(idx_start, idx_end);                                                                     // 511
};                                                                                                              // 512
                                                                                                                // 513
// XXX Maybe we need a version of observe that just calls a callback if                                         // 514
// anything changed.                                                                                            // 515
LocalCollection.Cursor.prototype._depend = function (changers, _allow_unordered) {                              // 516
  var self = this;                                                                                              // 517
                                                                                                                // 518
  if (Tracker.active) {                                                                                         // 519
    var v = new Tracker.Dependency;                                                                             // 520
    v.depend();                                                                                                 // 521
    var notifyChange = _.bind(v.changed, v);                                                                    // 522
                                                                                                                // 523
    var options = {                                                                                             // 524
      _suppress_initial: true,                                                                                  // 525
      _allow_unordered: _allow_unordered                                                                        // 526
    };                                                                                                          // 527
    _.each(['added', 'changed', 'removed', 'addedBefore', 'movedBefore'],                                       // 528
           function (fnName) {                                                                                  // 529
             if (changers[fnName])                                                                              // 530
               options[fnName] = notifyChange;                                                                  // 531
           });                                                                                                  // 532
                                                                                                                // 533
    // observeChanges will stop() when this computation is invalidated                                          // 534
    self.observeChanges(options);                                                                               // 535
  }                                                                                                             // 536
};                                                                                                              // 537
                                                                                                                // 538
// XXX enforce rule that field names can't start with '$' or contain '.'                                        // 539
// (real mongodb does in fact enforce this)                                                                     // 540
// XXX possibly enforce that 'undefined' does not appear (we assume                                             // 541
// this in our handling of null and $exists)                                                                    // 542
LocalCollection.prototype.insert = function (doc, callback) {                                                   // 543
  var self = this;                                                                                              // 544
  doc = EJSON.clone(doc);                                                                                       // 545
                                                                                                                // 546
  if (!_.has(doc, '_id')) {                                                                                     // 547
    // if you really want to use ObjectIDs, set this global.                                                    // 548
    // Mongo.Collection specifies its own ids and does not use this code.                                       // 549
    doc._id = LocalCollection._useOID ? new MongoID.ObjectID()                                                  // 550
                                      : Random.id();                                                            // 551
  }                                                                                                             // 552
  var id = doc._id;                                                                                             // 553
                                                                                                                // 554
  if (self._docs.has(id))                                                                                       // 555
    throw MinimongoError("Duplicate _id '" + id + "'");                                                         // 556
                                                                                                                // 557
  self._saveOriginal(id, undefined);                                                                            // 558
  self._docs.set(id, doc);                                                                                      // 559
                                                                                                                // 560
  var queriesToRecompute = [];                                                                                  // 561
  // trigger live queries that match                                                                            // 562
  for (var qid in self.queries) {                                                                               // 563
    var query = self.queries[qid];                                                                              // 564
    if (query.dirty) continue;                                                                                  // 565
    var matchResult = query.matcher.documentMatches(doc);                                                       // 566
    if (matchResult.result) {                                                                                   // 567
      if (query.distances && matchResult.distance !== undefined)                                                // 568
        query.distances.set(id, matchResult.distance);                                                          // 569
      if (query.cursor.skip || query.cursor.limit)                                                              // 570
        queriesToRecompute.push(qid);                                                                           // 571
      else                                                                                                      // 572
        LocalCollection._insertInResults(query, doc);                                                           // 573
    }                                                                                                           // 574
  }                                                                                                             // 575
                                                                                                                // 576
  _.each(queriesToRecompute, function (qid) {                                                                   // 577
    if (self.queries[qid])                                                                                      // 578
      self._recomputeResults(self.queries[qid]);                                                                // 579
  });                                                                                                           // 580
  self._observeQueue.drain();                                                                                   // 581
                                                                                                                // 582
  // Defer because the caller likely doesn't expect the callback to be run                                      // 583
  // immediately.                                                                                               // 584
  if (callback)                                                                                                 // 585
    Meteor.defer(function () {                                                                                  // 586
      callback(null, id);                                                                                       // 587
    });                                                                                                         // 588
  return id;                                                                                                    // 589
};                                                                                                              // 590
                                                                                                                // 591
// Iterates over a subset of documents that could match selector; calls                                         // 592
// f(doc, id) on each of them.  Specifically, if selector specifies                                             // 593
// specific _id's, it only looks at those.  doc is *not* cloned: it is the                                      // 594
// same object that is in _docs.                                                                                // 595
LocalCollection.prototype._eachPossiblyMatchingDoc = function (selector, f) {                                   // 596
  var self = this;                                                                                              // 597
  var specificIds = LocalCollection._idsMatchedBySelector(selector);                                            // 598
  if (specificIds) {                                                                                            // 599
    for (var i = 0; i < specificIds.length; ++i) {                                                              // 600
      var id = specificIds[i];                                                                                  // 601
      var doc = self._docs.get(id);                                                                             // 602
      if (doc) {                                                                                                // 603
        var breakIfFalse = f(doc, id);                                                                          // 604
        if (breakIfFalse === false)                                                                             // 605
          break;                                                                                                // 606
      }                                                                                                         // 607
    }                                                                                                           // 608
  } else {                                                                                                      // 609
    self._docs.forEach(f);                                                                                      // 610
  }                                                                                                             // 611
};                                                                                                              // 612
                                                                                                                // 613
LocalCollection.prototype.remove = function (selector, callback) {                                              // 614
  var self = this;                                                                                              // 615
                                                                                                                // 616
  // Easy special case: if we're not calling observeChanges callbacks and we're                                 // 617
  // not saving originals and we got asked to remove everything, then just empty                                // 618
  // everything directly.                                                                                       // 619
  if (self.paused && !self._savedOriginals && EJSON.equals(selector, {})) {                                     // 620
    var result = self._docs.size();                                                                             // 621
    self._docs.clear();                                                                                         // 622
    _.each(self.queries, function (query) {                                                                     // 623
      if (query.ordered) {                                                                                      // 624
        query.results = [];                                                                                     // 625
      } else {                                                                                                  // 626
        query.results.clear();                                                                                  // 627
      }                                                                                                         // 628
    });                                                                                                         // 629
    if (callback) {                                                                                             // 630
      Meteor.defer(function () {                                                                                // 631
        callback(null, result);                                                                                 // 632
      });                                                                                                       // 633
    }                                                                                                           // 634
    return result;                                                                                              // 635
  }                                                                                                             // 636
                                                                                                                // 637
  var matcher = new Minimongo.Matcher(selector);                                                                // 638
  var remove = [];                                                                                              // 639
  self._eachPossiblyMatchingDoc(selector, function (doc, id) {                                                  // 640
    if (matcher.documentMatches(doc).result)                                                                    // 641
      remove.push(id);                                                                                          // 642
  });                                                                                                           // 643
                                                                                                                // 644
  var queriesToRecompute = [];                                                                                  // 645
  var queryRemove = [];                                                                                         // 646
  for (var i = 0; i < remove.length; i++) {                                                                     // 647
    var removeId = remove[i];                                                                                   // 648
    var removeDoc = self._docs.get(removeId);                                                                   // 649
    _.each(self.queries, function (query, qid) {                                                                // 650
      if (query.dirty) return;                                                                                  // 651
                                                                                                                // 652
      if (query.matcher.documentMatches(removeDoc).result) {                                                    // 653
        if (query.cursor.skip || query.cursor.limit)                                                            // 654
          queriesToRecompute.push(qid);                                                                         // 655
        else                                                                                                    // 656
          queryRemove.push({qid: qid, doc: removeDoc});                                                         // 657
      }                                                                                                         // 658
    });                                                                                                         // 659
    self._saveOriginal(removeId, removeDoc);                                                                    // 660
    self._docs.remove(removeId);                                                                                // 661
  }                                                                                                             // 662
                                                                                                                // 663
  // run live query callbacks _after_ we've removed the documents.                                              // 664
  _.each(queryRemove, function (remove) {                                                                       // 665
    var query = self.queries[remove.qid];                                                                       // 666
    if (query) {                                                                                                // 667
      query.distances && query.distances.remove(remove.doc._id);                                                // 668
      LocalCollection._removeFromResults(query, remove.doc);                                                    // 669
    }                                                                                                           // 670
  });                                                                                                           // 671
  _.each(queriesToRecompute, function (qid) {                                                                   // 672
    var query = self.queries[qid];                                                                              // 673
    if (query)                                                                                                  // 674
      self._recomputeResults(query);                                                                            // 675
  });                                                                                                           // 676
  self._observeQueue.drain();                                                                                   // 677
  result = remove.length;                                                                                       // 678
  if (callback)                                                                                                 // 679
    Meteor.defer(function () {                                                                                  // 680
      callback(null, result);                                                                                   // 681
    });                                                                                                         // 682
  return result;                                                                                                // 683
};                                                                                                              // 684
                                                                                                                // 685
// XXX atomicity: if multi is true, and one modification fails, do                                              // 686
// we rollback the whole operation, or what?                                                                    // 687
LocalCollection.prototype.update = function (selector, mod, options, callback) {                                // 688
  var self = this;                                                                                              // 689
  if (! callback && options instanceof Function) {                                                              // 690
    callback = options;                                                                                         // 691
    options = null;                                                                                             // 692
  }                                                                                                             // 693
  if (!options) options = {};                                                                                   // 694
                                                                                                                // 695
  var matcher = new Minimongo.Matcher(selector);                                                                // 696
                                                                                                                // 697
  // Save the original results of any query that we might need to                                               // 698
  // _recomputeResults on, because _modifyAndNotify will mutate the objects in                                  // 699
  // it. (We don't need to save the original results of paused queries because                                  // 700
  // they already have a resultsSnapshot and we won't be diffing in                                             // 701
  // _recomputeResults.)                                                                                        // 702
  var qidToOriginalResults = {};                                                                                // 703
  // We should only clone each document once, even if it appears in multiple queries                            // 704
  var docMap = new LocalCollection._IdMap;                                                                      // 705
  var idsMatchedBySelector = LocalCollection._idsMatchedBySelector(selector);                                   // 706
                                                                                                                // 707
  _.each(self.queries, function (query, qid) {                                                                  // 708
    if ((query.cursor.skip || query.cursor.limit) && ! self.paused) {                                           // 709
      // Catch the case of a reactive `count()` on a cursor with skip                                           // 710
      // or limit, which registers an unordered observe. This is a                                              // 711
      // pretty rare case, so we just clone the entire result set with                                          // 712
      // no optimizations for documents that appear in these result                                             // 713
      // sets and other queries.                                                                                // 714
      if (query.results instanceof LocalCollection._IdMap) {                                                    // 715
        qidToOriginalResults[qid] = query.results.clone();                                                      // 716
        return;                                                                                                 // 717
      }                                                                                                         // 718
                                                                                                                // 719
      if (!(query.results instanceof Array)) {                                                                  // 720
        throw new Error("Assertion failed: query.results not an array");                                        // 721
      }                                                                                                         // 722
                                                                                                                // 723
      // Clones a document to be stored in `qidToOriginalResults`                                               // 724
      // because it may be modified before the new and old result sets                                          // 725
      // are diffed. But if we know exactly which document IDs we're                                            // 726
      // going to modify, then we only need to clone those.                                                     // 727
      var memoizedCloneIfNeeded = function(doc) {                                                               // 728
        if (docMap.has(doc._id)) {                                                                              // 729
          return docMap.get(doc._id);                                                                           // 730
        } else {                                                                                                // 731
          var docToMemoize;                                                                                     // 732
                                                                                                                // 733
          if (idsMatchedBySelector && !_.any(idsMatchedBySelector, function(id) {                               // 734
            return EJSON.equals(id, doc._id);                                                                   // 735
          })) {                                                                                                 // 736
            docToMemoize = doc;                                                                                 // 737
          } else {                                                                                              // 738
            docToMemoize = EJSON.clone(doc);                                                                    // 739
          }                                                                                                     // 740
                                                                                                                // 741
          docMap.set(doc._id, docToMemoize);                                                                    // 742
          return docToMemoize;                                                                                  // 743
        }                                                                                                       // 744
      };                                                                                                        // 745
                                                                                                                // 746
      qidToOriginalResults[qid] = query.results.map(memoizedCloneIfNeeded);                                     // 747
    }                                                                                                           // 748
  });                                                                                                           // 749
  var recomputeQids = {};                                                                                       // 750
                                                                                                                // 751
  var updateCount = 0;                                                                                          // 752
                                                                                                                // 753
  self._eachPossiblyMatchingDoc(selector, function (doc, id) {                                                  // 754
    var queryResult = matcher.documentMatches(doc);                                                             // 755
    if (queryResult.result) {                                                                                   // 756
      // XXX Should we save the original even if mod ends up being a no-op?                                     // 757
      self._saveOriginal(id, doc);                                                                              // 758
      self._modifyAndNotify(doc, mod, recomputeQids, queryResult.arrayIndices);                                 // 759
      ++updateCount;                                                                                            // 760
      if (!options.multi)                                                                                       // 761
        return false;  // break                                                                                 // 762
    }                                                                                                           // 763
    return true;                                                                                                // 764
  });                                                                                                           // 765
                                                                                                                // 766
  _.each(recomputeQids, function (dummy, qid) {                                                                 // 767
    var query = self.queries[qid];                                                                              // 768
    if (query)                                                                                                  // 769
      self._recomputeResults(query, qidToOriginalResults[qid]);                                                 // 770
  });                                                                                                           // 771
  self._observeQueue.drain();                                                                                   // 772
                                                                                                                // 773
  // If we are doing an upsert, and we didn't modify any documents yet, then                                    // 774
  // it's time to do an insert. Figure out what document we are inserting, and                                  // 775
  // generate an id for it.                                                                                     // 776
  var insertedId;                                                                                               // 777
  if (updateCount === 0 && options.upsert) {                                                                    // 778
    var newDoc = LocalCollection._removeDollarOperators(selector);                                              // 779
    LocalCollection._modify(newDoc, mod, {isInsert: true});                                                     // 780
    if (! newDoc._id && options.insertedId)                                                                     // 781
      newDoc._id = options.insertedId;                                                                          // 782
    insertedId = self.insert(newDoc);                                                                           // 783
    updateCount = 1;                                                                                            // 784
  }                                                                                                             // 785
                                                                                                                // 786
  // Return the number of affected documents, or in the upsert case, an object                                  // 787
  // containing the number of affected docs and the id of the doc that was                                      // 788
  // inserted, if any.                                                                                          // 789
  var result;                                                                                                   // 790
  if (options._returnObject) {                                                                                  // 791
    result = {                                                                                                  // 792
      numberAffected: updateCount                                                                               // 793
    };                                                                                                          // 794
    if (insertedId !== undefined)                                                                               // 795
      result.insertedId = insertedId;                                                                           // 796
  } else {                                                                                                      // 797
    result = updateCount;                                                                                       // 798
  }                                                                                                             // 799
                                                                                                                // 800
  if (callback)                                                                                                 // 801
    Meteor.defer(function () {                                                                                  // 802
      callback(null, result);                                                                                   // 803
    });                                                                                                         // 804
  return result;                                                                                                // 805
};                                                                                                              // 806
                                                                                                                // 807
// A convenience wrapper on update. LocalCollection.upsert(sel, mod) is                                         // 808
// equivalent to LocalCollection.update(sel, mod, { upsert: true, _returnObject:                                // 809
// true }).                                                                                                     // 810
LocalCollection.prototype.upsert = function (selector, mod, options, callback) {                                // 811
  var self = this;                                                                                              // 812
  if (! callback && typeof options === "function") {                                                            // 813
    callback = options;                                                                                         // 814
    options = {};                                                                                               // 815
  }                                                                                                             // 816
  return self.update(selector, mod, _.extend({}, options, {                                                     // 817
    upsert: true,                                                                                               // 818
    _returnObject: true                                                                                         // 819
  }), callback);                                                                                                // 820
};                                                                                                              // 821
                                                                                                                // 822
LocalCollection.prototype._modifyAndNotify = function (                                                         // 823
    doc, mod, recomputeQids, arrayIndices) {                                                                    // 824
  var self = this;                                                                                              // 825
                                                                                                                // 826
  var matched_before = {};                                                                                      // 827
  for (var qid in self.queries) {                                                                               // 828
    var query = self.queries[qid];                                                                              // 829
    if (query.dirty) continue;                                                                                  // 830
                                                                                                                // 831
    if (query.ordered) {                                                                                        // 832
      matched_before[qid] = query.matcher.documentMatches(doc).result;                                          // 833
    } else {                                                                                                    // 834
      // Because we don't support skip or limit (yet) in unordered queries, we                                  // 835
      // can just do a direct lookup.                                                                           // 836
      matched_before[qid] = query.results.has(doc._id);                                                         // 837
    }                                                                                                           // 838
  }                                                                                                             // 839
                                                                                                                // 840
  var old_doc = EJSON.clone(doc);                                                                               // 841
                                                                                                                // 842
  LocalCollection._modify(doc, mod, {arrayIndices: arrayIndices});                                              // 843
                                                                                                                // 844
  for (qid in self.queries) {                                                                                   // 845
    query = self.queries[qid];                                                                                  // 846
    if (query.dirty) continue;                                                                                  // 847
                                                                                                                // 848
    var before = matched_before[qid];                                                                           // 849
    var afterMatch = query.matcher.documentMatches(doc);                                                        // 850
    var after = afterMatch.result;                                                                              // 851
    if (after && query.distances && afterMatch.distance !== undefined)                                          // 852
      query.distances.set(doc._id, afterMatch.distance);                                                        // 853
                                                                                                                // 854
    if (query.cursor.skip || query.cursor.limit) {                                                              // 855
      // We need to recompute any query where the doc may have been in the                                      // 856
      // cursor's window either before or after the update. (Note that if skip                                  // 857
      // or limit is set, "before" and "after" being true do not necessarily                                    // 858
      // mean that the document is in the cursor's output after skip/limit is                                   // 859
      // applied... but if they are false, then the document definitely is NOT                                  // 860
      // in the output. So it's safe to skip recompute if neither before or                                     // 861
      // after are true.)                                                                                       // 862
      if (before || after)                                                                                      // 863
        recomputeQids[qid] = true;                                                                              // 864
    } else if (before && !after) {                                                                              // 865
      LocalCollection._removeFromResults(query, doc);                                                           // 866
    } else if (!before && after) {                                                                              // 867
      LocalCollection._insertInResults(query, doc);                                                             // 868
    } else if (before && after) {                                                                               // 869
      LocalCollection._updateInResults(query, doc, old_doc);                                                    // 870
    }                                                                                                           // 871
  }                                                                                                             // 872
};                                                                                                              // 873
                                                                                                                // 874
// XXX the sorted-query logic below is laughably inefficient. we'll                                             // 875
// need to come up with a better datastructure for this.                                                        // 876
//                                                                                                              // 877
// XXX the logic for observing with a skip or a limit is even more                                              // 878
// laughably inefficient. we recompute the whole results every time!                                            // 879
                                                                                                                // 880
LocalCollection._insertInResults = function (query, doc) {                                                      // 881
  var fields = EJSON.clone(doc);                                                                                // 882
  delete fields._id;                                                                                            // 883
  if (query.ordered) {                                                                                          // 884
    if (!query.sorter) {                                                                                        // 885
      query.addedBefore(doc._id, query.projectionFn(fields), null);                                             // 886
      query.results.push(doc);                                                                                  // 887
    } else {                                                                                                    // 888
      var i = LocalCollection._insertInSortedList(                                                              // 889
        query.sorter.getComparator({distances: query.distances}),                                               // 890
        query.results, doc);                                                                                    // 891
      var next = query.results[i+1];                                                                            // 892
      if (next)                                                                                                 // 893
        next = next._id;                                                                                        // 894
      else                                                                                                      // 895
        next = null;                                                                                            // 896
      query.addedBefore(doc._id, query.projectionFn(fields), next);                                             // 897
    }                                                                                                           // 898
    query.added(doc._id, query.projectionFn(fields));                                                           // 899
  } else {                                                                                                      // 900
    query.added(doc._id, query.projectionFn(fields));                                                           // 901
    query.results.set(doc._id, doc);                                                                            // 902
  }                                                                                                             // 903
};                                                                                                              // 904
                                                                                                                // 905
LocalCollection._removeFromResults = function (query, doc) {                                                    // 906
  if (query.ordered) {                                                                                          // 907
    var i = LocalCollection._findInOrderedResults(query, doc);                                                  // 908
    query.removed(doc._id);                                                                                     // 909
    query.results.splice(i, 1);                                                                                 // 910
  } else {                                                                                                      // 911
    var id = doc._id;  // in case callback mutates doc                                                          // 912
    query.removed(doc._id);                                                                                     // 913
    query.results.remove(id);                                                                                   // 914
  }                                                                                                             // 915
};                                                                                                              // 916
                                                                                                                // 917
LocalCollection._updateInResults = function (query, doc, old_doc) {                                             // 918
  if (!EJSON.equals(doc._id, old_doc._id))                                                                      // 919
    throw new Error("Can't change a doc's _id while updating");                                                 // 920
  var projectionFn = query.projectionFn;                                                                        // 921
  var changedFields = DiffSequence.makeChangedFields(                                                           // 922
    projectionFn(doc), projectionFn(old_doc));                                                                  // 923
                                                                                                                // 924
  if (!query.ordered) {                                                                                         // 925
    if (!_.isEmpty(changedFields)) {                                                                            // 926
      query.changed(doc._id, changedFields);                                                                    // 927
      query.results.set(doc._id, doc);                                                                          // 928
    }                                                                                                           // 929
    return;                                                                                                     // 930
  }                                                                                                             // 931
                                                                                                                // 932
  var orig_idx = LocalCollection._findInOrderedResults(query, doc);                                             // 933
                                                                                                                // 934
  if (!_.isEmpty(changedFields))                                                                                // 935
    query.changed(doc._id, changedFields);                                                                      // 936
  if (!query.sorter)                                                                                            // 937
    return;                                                                                                     // 938
                                                                                                                // 939
  // just take it out and put it back in again, and see if the index                                            // 940
  // changes                                                                                                    // 941
  query.results.splice(orig_idx, 1);                                                                            // 942
  var new_idx = LocalCollection._insertInSortedList(                                                            // 943
    query.sorter.getComparator({distances: query.distances}),                                                   // 944
    query.results, doc);                                                                                        // 945
  if (orig_idx !== new_idx) {                                                                                   // 946
    var next = query.results[new_idx+1];                                                                        // 947
    if (next)                                                                                                   // 948
      next = next._id;                                                                                          // 949
    else                                                                                                        // 950
      next = null;                                                                                              // 951
    query.movedBefore && query.movedBefore(doc._id, next);                                                      // 952
  }                                                                                                             // 953
};                                                                                                              // 954
                                                                                                                // 955
// Recomputes the results of a query and runs observe callbacks for the                                         // 956
// difference between the previous results and the current results (unless                                      // 957
// paused). Used for skip/limit queries.                                                                        // 958
//                                                                                                              // 959
// When this is used by insert or remove, it can just use query.results for the                                 // 960
// old results (and there's no need to pass in oldResults), because these                                       // 961
// operations don't mutate the documents in the collection. Update needs to pass                                // 962
// in an oldResults which was deep-copied before the modifier was applied.                                      // 963
//                                                                                                              // 964
// oldResults is guaranteed to be ignored if the query is not paused.                                           // 965
LocalCollection.prototype._recomputeResults = function (query, oldResults) {                                    // 966
  var self = this;                                                                                              // 967
  if (self.paused) {                                                                                            // 968
    // There's no reason to recompute the results now as we're still paused.                                    // 969
    // By flagging the query as "dirty", the recompute will be performed                                        // 970
    // when resumeObservers is called.                                                                          // 971
    query.dirty = true;                                                                                         // 972
    return;                                                                                                     // 973
  }                                                                                                             // 974
                                                                                                                // 975
  if (! self.paused && ! oldResults)                                                                            // 976
    oldResults = query.results;                                                                                 // 977
  if (query.distances)                                                                                          // 978
    query.distances.clear();                                                                                    // 979
  query.results = query.cursor._getRawObjects({                                                                 // 980
    ordered: query.ordered, distances: query.distances});                                                       // 981
                                                                                                                // 982
  if (! self.paused) {                                                                                          // 983
    LocalCollection._diffQueryChanges(                                                                          // 984
      query.ordered, oldResults, query.results, query,                                                          // 985
      { projectionFn: query.projectionFn });                                                                    // 986
  }                                                                                                             // 987
};                                                                                                              // 988
                                                                                                                // 989
                                                                                                                // 990
LocalCollection._findInOrderedResults = function (query, doc) {                                                 // 991
  if (!query.ordered)                                                                                           // 992
    throw new Error("Can't call _findInOrderedResults on unordered query");                                     // 993
  for (var i = 0; i < query.results.length; i++)                                                                // 994
    if (query.results[i] === doc)                                                                               // 995
      return i;                                                                                                 // 996
  throw Error("object missing from query");                                                                     // 997
};                                                                                                              // 998
                                                                                                                // 999
// This binary search puts a value between any equal values, and the first                                      // 1000
// lesser value.                                                                                                // 1001
LocalCollection._binarySearch = function (cmp, array, value) {                                                  // 1002
  var first = 0, rangeLength = array.length;                                                                    // 1003
                                                                                                                // 1004
  while (rangeLength > 0) {                                                                                     // 1005
    var halfRange = Math.floor(rangeLength/2);                                                                  // 1006
    if (cmp(value, array[first + halfRange]) >= 0) {                                                            // 1007
      first += halfRange + 1;                                                                                   // 1008
      rangeLength -= halfRange + 1;                                                                             // 1009
    } else {                                                                                                    // 1010
      rangeLength = halfRange;                                                                                  // 1011
    }                                                                                                           // 1012
  }                                                                                                             // 1013
  return first;                                                                                                 // 1014
};                                                                                                              // 1015
                                                                                                                // 1016
LocalCollection._insertInSortedList = function (cmp, array, value) {                                            // 1017
  if (array.length === 0) {                                                                                     // 1018
    array.push(value);                                                                                          // 1019
    return 0;                                                                                                   // 1020
  }                                                                                                             // 1021
                                                                                                                // 1022
  var idx = LocalCollection._binarySearch(cmp, array, value);                                                   // 1023
  array.splice(idx, 0, value);                                                                                  // 1024
  return idx;                                                                                                   // 1025
};                                                                                                              // 1026
                                                                                                                // 1027
// To track what documents are affected by a piece of code, call saveOriginals()                                // 1028
// before it and retrieveOriginals() after it. retrieveOriginals returns an                                     // 1029
// object whose keys are the ids of the documents that were affected since the                                  // 1030
// call to saveOriginals(), and the values are equal to the document's contents                                 // 1031
// at the time of saveOriginals. (In the case of an inserted document, undefined                                // 1032
// is the value.) You must alternate between calls to saveOriginals() and                                       // 1033
// retrieveOriginals().                                                                                         // 1034
LocalCollection.prototype.saveOriginals = function () {                                                         // 1035
  var self = this;                                                                                              // 1036
  if (self._savedOriginals)                                                                                     // 1037
    throw new Error("Called saveOriginals twice without retrieveOriginals");                                    // 1038
  self._savedOriginals = new LocalCollection._IdMap;                                                            // 1039
};                                                                                                              // 1040
LocalCollection.prototype.retrieveOriginals = function () {                                                     // 1041
  var self = this;                                                                                              // 1042
  if (!self._savedOriginals)                                                                                    // 1043
    throw new Error("Called retrieveOriginals without saveOriginals");                                          // 1044
                                                                                                                // 1045
  var originals = self._savedOriginals;                                                                         // 1046
  self._savedOriginals = null;                                                                                  // 1047
  return originals;                                                                                             // 1048
};                                                                                                              // 1049
                                                                                                                // 1050
LocalCollection.prototype._saveOriginal = function (id, doc) {                                                  // 1051
  var self = this;                                                                                              // 1052
  // Are we even trying to save originals?                                                                      // 1053
  if (!self._savedOriginals)                                                                                    // 1054
    return;                                                                                                     // 1055
  // Have we previously mutated the original (and so 'doc' is not actually                                      // 1056
  // original)?  (Note the 'has' check rather than truth: we store undefined                                    // 1057
  // here for inserted docs!)                                                                                   // 1058
  if (self._savedOriginals.has(id))                                                                             // 1059
    return;                                                                                                     // 1060
  self._savedOriginals.set(id, EJSON.clone(doc));                                                               // 1061
};                                                                                                              // 1062
                                                                                                                // 1063
// Pause the observers. No callbacks from observers will fire until                                             // 1064
// 'resumeObservers' is called.                                                                                 // 1065
LocalCollection.prototype.pauseObservers = function () {                                                        // 1066
  // No-op if already paused.                                                                                   // 1067
  if (this.paused)                                                                                              // 1068
    return;                                                                                                     // 1069
                                                                                                                // 1070
  // Set the 'paused' flag such that new observer messages don't fire.                                          // 1071
  this.paused = true;                                                                                           // 1072
                                                                                                                // 1073
  // Take a snapshot of the query results for each query.                                                       // 1074
  for (var qid in this.queries) {                                                                               // 1075
    var query = this.queries[qid];                                                                              // 1076
                                                                                                                // 1077
    query.resultsSnapshot = EJSON.clone(query.results);                                                         // 1078
  }                                                                                                             // 1079
};                                                                                                              // 1080
                                                                                                                // 1081
// Resume the observers. Observers immediately receive change                                                   // 1082
// notifications to bring them to the current state of the                                                      // 1083
// database. Note that this is not just replaying all the changes that                                          // 1084
// happened during the pause, it is a smarter 'coalesced' diff.                                                 // 1085
LocalCollection.prototype.resumeObservers = function () {                                                       // 1086
  var self = this;                                                                                              // 1087
  // No-op if not paused.                                                                                       // 1088
  if (!this.paused)                                                                                             // 1089
    return;                                                                                                     // 1090
                                                                                                                // 1091
  // Unset the 'paused' flag. Make sure to do this first, otherwise                                             // 1092
  // observer methods won't actually fire when we trigger them.                                                 // 1093
  this.paused = false;                                                                                          // 1094
                                                                                                                // 1095
  for (var qid in this.queries) {                                                                               // 1096
    var query = self.queries[qid];                                                                              // 1097
    if (query.dirty) {                                                                                          // 1098
      query.dirty = false;                                                                                      // 1099
      // re-compute results will perform `LocalCollection._diffQueryChanges` automatically.                     // 1100
      self._recomputeResults(query, query.resultsSnapshot);                                                     // 1101
    } else {                                                                                                    // 1102
      // Diff the current results against the snapshot and send to observers.                                   // 1103
      // pass the query object for its observer callbacks.                                                      // 1104
      LocalCollection._diffQueryChanges(                                                                        // 1105
        query.ordered, query.resultsSnapshot, query.results, query,                                             // 1106
        {projectionFn: query.projectionFn});                                                                    // 1107
    }                                                                                                           // 1108
    query.resultsSnapshot = null;                                                                               // 1109
  }                                                                                                             // 1110
  self._observeQueue.drain();                                                                                   // 1111
};                                                                                                              // 1112
                                                                                                                // 1113
                                                                                                                // 1114
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/minimongo/wrap_transform.js                                                                         //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
// Wrap a transform function to return objects that have the _id field                                          // 1
// of the untransformed document. This ensures that subsystems such as                                          // 2
// the observe-sequence package that call `observe` can keep track of                                           // 3
// the documents identities.                                                                                    // 4
//                                                                                                              // 5
// - Require that it returns objects                                                                            // 6
// - If the return value has an _id field, verify that it matches the                                           // 7
//   original _id field                                                                                         // 8
// - If the return value doesn't have an _id field, add it back.                                                // 9
LocalCollection.wrapTransform = function (transform) {                                                          // 10
  if (! transform)                                                                                              // 11
    return null;                                                                                                // 12
                                                                                                                // 13
  // No need to doubly-wrap transforms.                                                                         // 14
  if (transform.__wrappedTransform__)                                                                           // 15
    return transform;                                                                                           // 16
                                                                                                                // 17
  var wrapped = function (doc) {                                                                                // 18
    if (!_.has(doc, '_id')) {                                                                                   // 19
      // XXX do we ever have a transform on the oplog's collection? because that                                // 20
      // collection has no _id.                                                                                 // 21
      throw new Error("can only transform documents with _id");                                                 // 22
    }                                                                                                           // 23
                                                                                                                // 24
    var id = doc._id;                                                                                           // 25
    // XXX consider making tracker a weak dependency and checking Package.tracker here                          // 26
    var transformed = Tracker.nonreactive(function () {                                                         // 27
      return transform(doc);                                                                                    // 28
    });                                                                                                         // 29
                                                                                                                // 30
    if (!isPlainObject(transformed)) {                                                                          // 31
      throw new Error("transform must return object");                                                          // 32
    }                                                                                                           // 33
                                                                                                                // 34
    if (_.has(transformed, '_id')) {                                                                            // 35
      if (!EJSON.equals(transformed._id, id)) {                                                                 // 36
        throw new Error("transformed document can't have different _id");                                       // 37
      }                                                                                                         // 38
    } else {                                                                                                    // 39
      transformed._id = id;                                                                                     // 40
    }                                                                                                           // 41
    return transformed;                                                                                         // 42
  };                                                                                                            // 43
  wrapped.__wrappedTransform__ = true;                                                                          // 44
  return wrapped;                                                                                               // 45
};                                                                                                              // 46
                                                                                                                // 47
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/minimongo/helpers.js                                                                                //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
// Like _.isArray, but doesn't regard polyfilled Uint8Arrays on old browsers as                                 // 1
// arrays.                                                                                                      // 2
// XXX maybe this should be EJSON.isArray                                                                       // 3
isArray = function (x) {                                                                                        // 4
  return _.isArray(x) && !EJSON.isBinary(x);                                                                    // 5
};                                                                                                              // 6
                                                                                                                // 7
// XXX maybe this should be EJSON.isObject, though EJSON doesn't know about                                     // 8
// RegExp                                                                                                       // 9
// XXX note that _type(undefined) === 3!!!!                                                                     // 10
isPlainObject = LocalCollection._isPlainObject = function (x) {                                                 // 11
  return x && LocalCollection._f._type(x) === 3;                                                                // 12
};                                                                                                              // 13
                                                                                                                // 14
isIndexable = function (x) {                                                                                    // 15
  return isArray(x) || isPlainObject(x);                                                                        // 16
};                                                                                                              // 17
                                                                                                                // 18
// Returns true if this is an object with at least one key and all keys begin                                   // 19
// with $.  Unless inconsistentOK is set, throws if some keys begin with $ and                                  // 20
// others don't.                                                                                                // 21
isOperatorObject = function (valueSelector, inconsistentOK) {                                                   // 22
  if (!isPlainObject(valueSelector))                                                                            // 23
    return false;                                                                                               // 24
                                                                                                                // 25
  var theseAreOperators = undefined;                                                                            // 26
  _.each(valueSelector, function (value, selKey) {                                                              // 27
    var thisIsOperator = selKey.substr(0, 1) === '$';                                                           // 28
    if (theseAreOperators === undefined) {                                                                      // 29
      theseAreOperators = thisIsOperator;                                                                       // 30
    } else if (theseAreOperators !== thisIsOperator) {                                                          // 31
      if (!inconsistentOK)                                                                                      // 32
        throw new Error("Inconsistent operator: " +                                                             // 33
                        JSON.stringify(valueSelector));                                                         // 34
      theseAreOperators = false;                                                                                // 35
    }                                                                                                           // 36
  });                                                                                                           // 37
  return !!theseAreOperators;  // {} has no operators                                                           // 38
};                                                                                                              // 39
                                                                                                                // 40
                                                                                                                // 41
// string can be converted to integer                                                                           // 42
isNumericKey = function (s) {                                                                                   // 43
  return /^[0-9]+$/.test(s);                                                                                    // 44
};                                                                                                              // 45
                                                                                                                // 46
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/minimongo/selector.js                                                                               //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
// The minimongo selector compiler!                                                                             // 1
                                                                                                                // 2
// Terminology:                                                                                                 // 3
//  - a "selector" is the EJSON object representing a selector                                                  // 4
//  - a "matcher" is its compiled form (whether a full Minimongo.Matcher                                        // 5
//    object or one of the component lambdas that matches parts of it)                                          // 6
//  - a "result object" is an object with a "result" field and maybe                                            // 7
//    distance and arrayIndices.                                                                                // 8
//  - a "branched value" is an object with a "value" field and maybe                                            // 9
//    "dontIterate" and "arrayIndices".                                                                         // 10
//  - a "document" is a top-level object that can be stored in a collection.                                    // 11
//  - a "lookup function" is a function that takes in a document and returns                                    // 12
//    an array of "branched values".                                                                            // 13
//  - a "branched matcher" maps from an array of branched values to a result                                    // 14
//    object.                                                                                                   // 15
//  - an "element matcher" maps from a single value to a bool.                                                  // 16
                                                                                                                // 17
// Main entry point.                                                                                            // 18
//   var matcher = new Minimongo.Matcher({a: {$gt: 5}});                                                        // 19
//   if (matcher.documentMatches({a: 7})) ...                                                                   // 20
Minimongo.Matcher = function (selector) {                                                                       // 21
  var self = this;                                                                                              // 22
  // A set (object mapping string -> *) of all of the document paths looked                                     // 23
  // at by the selector. Also includes the empty string if it may look at any                                   // 24
  // path (eg, $where).                                                                                         // 25
  self._paths = {};                                                                                             // 26
  // Set to true if compilation finds a $near.                                                                  // 27
  self._hasGeoQuery = false;                                                                                    // 28
  // Set to true if compilation finds a $where.                                                                 // 29
  self._hasWhere = false;                                                                                       // 30
  // Set to false if compilation finds anything other than a simple equality or                                 // 31
  // one or more of '$gt', '$gte', '$lt', '$lte', '$ne', '$in', '$nin' used with                                // 32
  // scalars as operands.                                                                                       // 33
  self._isSimple = true;                                                                                        // 34
  // Set to a dummy document which always matches this Matcher. Or set to null                                  // 35
  // if such document is too hard to find.                                                                      // 36
  self._matchingDocument = undefined;                                                                           // 37
  // A clone of the original selector. It may just be a function if the user                                    // 38
  // passed in a function; otherwise is definitely an object (eg, IDs are                                       // 39
  // translated into {_id: ID} first. Used by canBecomeTrueByModifier and                                       // 40
  // Sorter._useWithMatcher.                                                                                    // 41
  self._selector = null;                                                                                        // 42
  self._docMatcher = self._compileSelector(selector);                                                           // 43
};                                                                                                              // 44
                                                                                                                // 45
_.extend(Minimongo.Matcher.prototype, {                                                                         // 46
  documentMatches: function (doc) {                                                                             // 47
    if (!doc || typeof doc !== "object") {                                                                      // 48
      throw Error("documentMatches needs a document");                                                          // 49
    }                                                                                                           // 50
    return this._docMatcher(doc);                                                                               // 51
  },                                                                                                            // 52
  hasGeoQuery: function () {                                                                                    // 53
    return this._hasGeoQuery;                                                                                   // 54
  },                                                                                                            // 55
  hasWhere: function () {                                                                                       // 56
    return this._hasWhere;                                                                                      // 57
  },                                                                                                            // 58
  isSimple: function () {                                                                                       // 59
    return this._isSimple;                                                                                      // 60
  },                                                                                                            // 61
                                                                                                                // 62
  // Given a selector, return a function that takes one argument, a                                             // 63
  // document. It returns a result object.                                                                      // 64
  _compileSelector: function (selector) {                                                                       // 65
    var self = this;                                                                                            // 66
    // you can pass a literal function instead of a selector                                                    // 67
    if (selector instanceof Function) {                                                                         // 68
      self._isSimple = false;                                                                                   // 69
      self._selector = selector;                                                                                // 70
      self._recordPathUsed('');                                                                                 // 71
      return function (doc) {                                                                                   // 72
        return {result: !!selector.call(doc)};                                                                  // 73
      };                                                                                                        // 74
    }                                                                                                           // 75
                                                                                                                // 76
    // shorthand -- scalars match _id                                                                           // 77
    if (LocalCollection._selectorIsId(selector)) {                                                              // 78
      self._selector = {_id: selector};                                                                         // 79
      self._recordPathUsed('_id');                                                                              // 80
      return function (doc) {                                                                                   // 81
        return {result: EJSON.equals(doc._id, selector)};                                                       // 82
      };                                                                                                        // 83
    }                                                                                                           // 84
                                                                                                                // 85
    // protect against dangerous selectors.  falsey and {_id: falsey} are both                                  // 86
    // likely programmer error, and not what you want, particularly for                                         // 87
    // destructive operations.                                                                                  // 88
    if (!selector || (('_id' in selector) && !selector._id)) {                                                  // 89
      self._isSimple = false;                                                                                   // 90
      return nothingMatcher;                                                                                    // 91
    }                                                                                                           // 92
                                                                                                                // 93
    // Top level can't be an array or true or binary.                                                           // 94
    if (typeof(selector) === 'boolean' || isArray(selector) ||                                                  // 95
        EJSON.isBinary(selector))                                                                               // 96
      throw new Error("Invalid selector: " + selector);                                                         // 97
                                                                                                                // 98
    self._selector = EJSON.clone(selector);                                                                     // 99
    return compileDocumentSelector(selector, self, {isRoot: true});                                             // 100
  },                                                                                                            // 101
  _recordPathUsed: function (path) {                                                                            // 102
    this._paths[path] = true;                                                                                   // 103
  },                                                                                                            // 104
  // Returns a list of key paths the given selector is looking for. It includes                                 // 105
  // the empty string if there is a $where.                                                                     // 106
  _getPaths: function () {                                                                                      // 107
    return _.keys(this._paths);                                                                                 // 108
  }                                                                                                             // 109
});                                                                                                             // 110
                                                                                                                // 111
                                                                                                                // 112
// Takes in a selector that could match a full document (eg, the original                                       // 113
// selector). Returns a function mapping document->result object.                                               // 114
//                                                                                                              // 115
// matcher is the Matcher object we are compiling.                                                              // 116
//                                                                                                              // 117
// If this is the root document selector (ie, not wrapped in $and or the like),                                 // 118
// then isRoot is true. (This is used by $near.)                                                                // 119
var compileDocumentSelector = function (docSelector, matcher, options) {                                        // 120
  options = options || {};                                                                                      // 121
  var docMatchers = [];                                                                                         // 122
  _.each(docSelector, function (subSelector, key) {                                                             // 123
    if (key.substr(0, 1) === '$') {                                                                             // 124
      // Outer operators are either logical operators (they recurse back into                                   // 125
      // this function), or $where.                                                                             // 126
      if (!_.has(LOGICAL_OPERATORS, key))                                                                       // 127
        throw new Error("Unrecognized logical operator: " + key);                                               // 128
      matcher._isSimple = false;                                                                                // 129
      docMatchers.push(LOGICAL_OPERATORS[key](subSelector, matcher,                                             // 130
                                              options.inElemMatch));                                            // 131
    } else {                                                                                                    // 132
      // Record this path, but only if we aren't in an elemMatcher, since in an                                 // 133
      // elemMatch this is a path inside an object in an array, not in the doc                                  // 134
      // root.                                                                                                  // 135
      if (!options.inElemMatch)                                                                                 // 136
        matcher._recordPathUsed(key);                                                                           // 137
      var lookUpByIndex = makeLookupFunction(key);                                                              // 138
      var valueMatcher =                                                                                        // 139
        compileValueSelector(subSelector, matcher, options.isRoot);                                             // 140
      docMatchers.push(function (doc) {                                                                         // 141
        var branchValues = lookUpByIndex(doc);                                                                  // 142
        return valueMatcher(branchValues);                                                                      // 143
      });                                                                                                       // 144
    }                                                                                                           // 145
  });                                                                                                           // 146
                                                                                                                // 147
  return andDocumentMatchers(docMatchers);                                                                      // 148
};                                                                                                              // 149
                                                                                                                // 150
// Takes in a selector that could match a key-indexed value in a document; eg,                                  // 151
// {$gt: 5, $lt: 9}, or a regular expression, or any non-expression object (to                                  // 152
// indicate equality).  Returns a branched matcher: a function mapping                                          // 153
// [branched value]->result object.                                                                             // 154
var compileValueSelector = function (valueSelector, matcher, isRoot) {                                          // 155
  if (valueSelector instanceof RegExp) {                                                                        // 156
    matcher._isSimple = false;                                                                                  // 157
    return convertElementMatcherToBranchedMatcher(                                                              // 158
      regexpElementMatcher(valueSelector));                                                                     // 159
  } else if (isOperatorObject(valueSelector)) {                                                                 // 160
    return operatorBranchedMatcher(valueSelector, matcher, isRoot);                                             // 161
  } else {                                                                                                      // 162
    return convertElementMatcherToBranchedMatcher(                                                              // 163
      equalityElementMatcher(valueSelector));                                                                   // 164
  }                                                                                                             // 165
};                                                                                                              // 166
                                                                                                                // 167
// Given an element matcher (which evaluates a single value), returns a branched                                // 168
// value (which evaluates the element matcher on all the branches and returns a                                 // 169
// more structured return value possibly including arrayIndices).                                               // 170
var convertElementMatcherToBranchedMatcher = function (                                                         // 171
    elementMatcher, options) {                                                                                  // 172
  options = options || {};                                                                                      // 173
  return function (branches) {                                                                                  // 174
    var expanded = branches;                                                                                    // 175
    if (!options.dontExpandLeafArrays) {                                                                        // 176
      expanded = expandArraysInBranches(                                                                        // 177
        branches, options.dontIncludeLeafArrays);                                                               // 178
    }                                                                                                           // 179
    var ret = {};                                                                                               // 180
    ret.result = _.any(expanded, function (element) {                                                           // 181
      var matched = elementMatcher(element.value);                                                              // 182
                                                                                                                // 183
      // Special case for $elemMatch: it means "true, and use this as an array                                  // 184
      // index if I didn't already have one".                                                                   // 185
      if (typeof matched === 'number') {                                                                        // 186
        // XXX This code dates from when we only stored a single array index                                    // 187
        // (for the outermost array). Should we be also including deeper array                                  // 188
        // indices from the $elemMatch match?                                                                   // 189
        if (!element.arrayIndices)                                                                              // 190
          element.arrayIndices = [matched];                                                                     // 191
        matched = true;                                                                                         // 192
      }                                                                                                         // 193
                                                                                                                // 194
      // If some element matched, and it's tagged with array indices, include                                   // 195
      // those indices in our result object.                                                                    // 196
      if (matched && element.arrayIndices)                                                                      // 197
        ret.arrayIndices = element.arrayIndices;                                                                // 198
                                                                                                                // 199
      return matched;                                                                                           // 200
    });                                                                                                         // 201
    return ret;                                                                                                 // 202
  };                                                                                                            // 203
};                                                                                                              // 204
                                                                                                                // 205
// Takes a RegExp object and returns an element matcher.                                                        // 206
regexpElementMatcher = function (regexp) {                                                                      // 207
  return function (value) {                                                                                     // 208
    if (value instanceof RegExp) {                                                                              // 209
      // Comparing two regexps means seeing if the regexps are identical                                        // 210
      // (really!). Underscore knows how.                                                                       // 211
      return _.isEqual(value, regexp);                                                                          // 212
    }                                                                                                           // 213
    // Regexps only work against strings.                                                                       // 214
    if (typeof value !== 'string')                                                                              // 215
      return false;                                                                                             // 216
                                                                                                                // 217
    // Reset regexp's state to avoid inconsistent matching for objects with the                                 // 218
    // same value on consecutive calls of regexp.test. This happens only if the                                 // 219
    // regexp has the 'g' flag. Also note that ES6 introduces a new flag 'y' for                                // 220
    // which we should *not* change the lastIndex but MongoDB doesn't support                                   // 221
    // either of these flags.                                                                                   // 222
    regexp.lastIndex = 0;                                                                                       // 223
                                                                                                                // 224
    return regexp.test(value);                                                                                  // 225
  };                                                                                                            // 226
};                                                                                                              // 227
                                                                                                                // 228
// Takes something that is not an operator object and returns an element matcher                                // 229
// for equality with that thing.                                                                                // 230
equalityElementMatcher = function (elementSelector) {                                                           // 231
  if (isOperatorObject(elementSelector))                                                                        // 232
    throw Error("Can't create equalityValueSelector for operator object");                                      // 233
                                                                                                                // 234
  // Special-case: null and undefined are equal (if you got undefined in there                                  // 235
  // somewhere, or if you got it due to some branch being non-existent in the                                   // 236
  // weird special case), even though they aren't with EJSON.equals.                                            // 237
  if (elementSelector == null) {  // undefined or null                                                          // 238
    return function (value) {                                                                                   // 239
      return value == null;  // undefined or null                                                               // 240
    };                                                                                                          // 241
  }                                                                                                             // 242
                                                                                                                // 243
  return function (value) {                                                                                     // 244
    return LocalCollection._f._equal(elementSelector, value);                                                   // 245
  };                                                                                                            // 246
};                                                                                                              // 247
                                                                                                                // 248
// Takes an operator object (an object with $ keys) and returns a branched                                      // 249
// matcher for it.                                                                                              // 250
var operatorBranchedMatcher = function (valueSelector, matcher, isRoot) {                                       // 251
  // Each valueSelector works separately on the various branches.  So one                                       // 252
  // operator can match one branch and another can match another branch.  This                                  // 253
  // is OK.                                                                                                     // 254
                                                                                                                // 255
  var operatorMatchers = [];                                                                                    // 256
  _.each(valueSelector, function (operand, operator) {                                                          // 257
    var simpleRange = _.contains(['$lt', '$lte', '$gt', '$gte'], operator) &&                                   // 258
      _.isNumber(operand);                                                                                      // 259
    var simpleEquality = _.contains(['$ne', '$eq'], operator) && !_.isObject(operand);                          // 260
    var simpleInclusion = _.contains(['$in', '$nin'], operator) &&                                              // 261
      _.isArray(operand) && !_.any(operand, _.isObject);                                                        // 262
                                                                                                                // 263
    if (! (simpleRange || simpleInclusion || simpleEquality)) {                                                 // 264
      matcher._isSimple = false;                                                                                // 265
    }                                                                                                           // 266
                                                                                                                // 267
    if (_.has(VALUE_OPERATORS, operator)) {                                                                     // 268
      operatorMatchers.push(                                                                                    // 269
        VALUE_OPERATORS[operator](operand, valueSelector, matcher, isRoot));                                    // 270
    } else if (_.has(ELEMENT_OPERATORS, operator)) {                                                            // 271
      var options = ELEMENT_OPERATORS[operator];                                                                // 272
      operatorMatchers.push(                                                                                    // 273
        convertElementMatcherToBranchedMatcher(                                                                 // 274
          options.compileElementSelector(                                                                       // 275
            operand, valueSelector, matcher),                                                                   // 276
          options));                                                                                            // 277
    } else {                                                                                                    // 278
      throw new Error("Unrecognized operator: " + operator);                                                    // 279
    }                                                                                                           // 280
  });                                                                                                           // 281
                                                                                                                // 282
  return andBranchedMatchers(operatorMatchers);                                                                 // 283
};                                                                                                              // 284
                                                                                                                // 285
var compileArrayOfDocumentSelectors = function (                                                                // 286
    selectors, matcher, inElemMatch) {                                                                          // 287
  if (!isArray(selectors) || _.isEmpty(selectors))                                                              // 288
    throw Error("$and/$or/$nor must be nonempty array");                                                        // 289
  return _.map(selectors, function (subSelector) {                                                              // 290
    if (!isPlainObject(subSelector))                                                                            // 291
      throw Error("$or/$and/$nor entries need to be full objects");                                             // 292
    return compileDocumentSelector(                                                                             // 293
      subSelector, matcher, {inElemMatch: inElemMatch});                                                        // 294
  });                                                                                                           // 295
};                                                                                                              // 296
                                                                                                                // 297
// Operators that appear at the top level of a document selector.                                               // 298
var LOGICAL_OPERATORS = {                                                                                       // 299
  $and: function (subSelector, matcher, inElemMatch) {                                                          // 300
    var matchers = compileArrayOfDocumentSelectors(                                                             // 301
      subSelector, matcher, inElemMatch);                                                                       // 302
    return andDocumentMatchers(matchers);                                                                       // 303
  },                                                                                                            // 304
                                                                                                                // 305
  $or: function (subSelector, matcher, inElemMatch) {                                                           // 306
    var matchers = compileArrayOfDocumentSelectors(                                                             // 307
      subSelector, matcher, inElemMatch);                                                                       // 308
                                                                                                                // 309
    // Special case: if there is only one matcher, use it directly, *preserving*                                // 310
    // any arrayIndices it returns.                                                                             // 311
    if (matchers.length === 1)                                                                                  // 312
      return matchers[0];                                                                                       // 313
                                                                                                                // 314
    return function (doc) {                                                                                     // 315
      var result = _.any(matchers, function (f) {                                                               // 316
        return f(doc).result;                                                                                   // 317
      });                                                                                                       // 318
      // $or does NOT set arrayIndices when it has multiple                                                     // 319
      // sub-expressions. (Tested against MongoDB.)                                                             // 320
      return {result: result};                                                                                  // 321
    };                                                                                                          // 322
  },                                                                                                            // 323
                                                                                                                // 324
  $nor: function (subSelector, matcher, inElemMatch) {                                                          // 325
    var matchers = compileArrayOfDocumentSelectors(                                                             // 326
      subSelector, matcher, inElemMatch);                                                                       // 327
    return function (doc) {                                                                                     // 328
      var result = _.all(matchers, function (f) {                                                               // 329
        return !f(doc).result;                                                                                  // 330
      });                                                                                                       // 331
      // Never set arrayIndices, because we only match if nothing in particular                                 // 332
      // "matched" (and because this is consistent with MongoDB).                                               // 333
      return {result: result};                                                                                  // 334
    };                                                                                                          // 335
  },                                                                                                            // 336
                                                                                                                // 337
  $where: function (selectorValue, matcher) {                                                                   // 338
    // Record that *any* path may be used.                                                                      // 339
    matcher._recordPathUsed('');                                                                                // 340
    matcher._hasWhere = true;                                                                                   // 341
    if (!(selectorValue instanceof Function)) {                                                                 // 342
      // XXX MongoDB seems to have more complex logic to decide where or or not                                 // 343
      // to add "return"; not sure exactly what it is.                                                          // 344
      selectorValue = Function("obj", "return " + selectorValue);                                               // 345
    }                                                                                                           // 346
    return function (doc) {                                                                                     // 347
      // We make the document available as both `this` and `obj`.                                               // 348
      // XXX not sure what we should do if this throws                                                          // 349
      return {result: selectorValue.call(doc, doc)};                                                            // 350
    };                                                                                                          // 351
  },                                                                                                            // 352
                                                                                                                // 353
  // This is just used as a comment in the query (in MongoDB, it also ends up in                                // 354
  // query logs); it has no effect on the actual selection.                                                     // 355
  $comment: function () {                                                                                       // 356
    return function () {                                                                                        // 357
      return {result: true};                                                                                    // 358
    };                                                                                                          // 359
  }                                                                                                             // 360
};                                                                                                              // 361
                                                                                                                // 362
// Returns a branched matcher that matches iff the given matcher does not.                                      // 363
// Note that this implicitly "deMorganizes" the wrapped function.  ie, it                                       // 364
// means that ALL branch values need to fail to match innerBranchedMatcher.                                     // 365
var invertBranchedMatcher = function (branchedMatcher) {                                                        // 366
  return function (branchValues) {                                                                              // 367
    var invertMe = branchedMatcher(branchValues);                                                               // 368
    // We explicitly choose to strip arrayIndices here: it doesn't make sense to                                // 369
    // say "update the array element that does not match something", at least                                   // 370
    // in mongo-land.                                                                                           // 371
    return {result: !invertMe.result};                                                                          // 372
  };                                                                                                            // 373
};                                                                                                              // 374
                                                                                                                // 375
// Operators that (unlike LOGICAL_OPERATORS) pertain to individual paths in a                                   // 376
// document, but (unlike ELEMENT_OPERATORS) do not have a simple definition as                                  // 377
// "match each branched value independently and combine with                                                    // 378
// convertElementMatcherToBranchedMatcher".                                                                     // 379
var VALUE_OPERATORS = {                                                                                         // 380
  $eq: function (operand) {                                                                                     // 381
    return convertElementMatcherToBranchedMatcher(                                                              // 382
      equalityElementMatcher(operand));                                                                         // 383
  },                                                                                                            // 384
  $not: function (operand, valueSelector, matcher) {                                                            // 385
    return invertBranchedMatcher(compileValueSelector(operand, matcher));                                       // 386
  },                                                                                                            // 387
  $ne: function (operand) {                                                                                     // 388
    return invertBranchedMatcher(convertElementMatcherToBranchedMatcher(                                        // 389
      equalityElementMatcher(operand)));                                                                        // 390
  },                                                                                                            // 391
  $nin: function (operand) {                                                                                    // 392
    return invertBranchedMatcher(convertElementMatcherToBranchedMatcher(                                        // 393
      ELEMENT_OPERATORS.$in.compileElementSelector(operand)));                                                  // 394
  },                                                                                                            // 395
  $exists: function (operand) {                                                                                 // 396
    var exists = convertElementMatcherToBranchedMatcher(function (value) {                                      // 397
      return value !== undefined;                                                                               // 398
    });                                                                                                         // 399
    return operand ? exists : invertBranchedMatcher(exists);                                                    // 400
  },                                                                                                            // 401
  // $options just provides options for $regex; its logic is inside $regex                                      // 402
  $options: function (operand, valueSelector) {                                                                 // 403
    if (!_.has(valueSelector, '$regex'))                                                                        // 404
      throw Error("$options needs a $regex");                                                                   // 405
    return everythingMatcher;                                                                                   // 406
  },                                                                                                            // 407
  // $maxDistance is basically an argument to $near                                                             // 408
  $maxDistance: function (operand, valueSelector) {                                                             // 409
    if (!valueSelector.$near)                                                                                   // 410
      throw Error("$maxDistance needs a $near");                                                                // 411
    return everythingMatcher;                                                                                   // 412
  },                                                                                                            // 413
  $all: function (operand, valueSelector, matcher) {                                                            // 414
    if (!isArray(operand))                                                                                      // 415
      throw Error("$all requires array");                                                                       // 416
    // Not sure why, but this seems to be what MongoDB does.                                                    // 417
    if (_.isEmpty(operand))                                                                                     // 418
      return nothingMatcher;                                                                                    // 419
                                                                                                                // 420
    var branchedMatchers = [];                                                                                  // 421
    _.each(operand, function (criterion) {                                                                      // 422
      // XXX handle $all/$elemMatch combination                                                                 // 423
      if (isOperatorObject(criterion))                                                                          // 424
        throw Error("no $ expressions in $all");                                                                // 425
      // This is always a regexp or equality selector.                                                          // 426
      branchedMatchers.push(compileValueSelector(criterion, matcher));                                          // 427
    });                                                                                                         // 428
    // andBranchedMatchers does NOT require all selectors to return true on the                                 // 429
    // SAME branch.                                                                                             // 430
    return andBranchedMatchers(branchedMatchers);                                                               // 431
  },                                                                                                            // 432
  $near: function (operand, valueSelector, matcher, isRoot) {                                                   // 433
    if (!isRoot)                                                                                                // 434
      throw Error("$near can't be inside another $ operator");                                                  // 435
    matcher._hasGeoQuery = true;                                                                                // 436
                                                                                                                // 437
    // There are two kinds of geodata in MongoDB: coordinate pairs and                                          // 438
    // GeoJSON. They use different distance metrics, too. GeoJSON queries are                                   // 439
    // marked with a $geometry property.                                                                        // 440
                                                                                                                // 441
    var maxDistance, point, distance;                                                                           // 442
    if (isPlainObject(operand) && _.has(operand, '$geometry')) {                                                // 443
      // GeoJSON "2dsphere" mode.                                                                               // 444
      maxDistance = operand.$maxDistance;                                                                       // 445
      point = operand.$geometry;                                                                                // 446
      distance = function (value) {                                                                             // 447
        // XXX: for now, we don't calculate the actual distance between, say,                                   // 448
        // polygon and circle. If people care about this use-case it will get                                   // 449
        // a priority.                                                                                          // 450
        if (!value || !value.type)                                                                              // 451
          return null;                                                                                          // 452
        if (value.type === "Point") {                                                                           // 453
          return GeoJSON.pointDistance(point, value);                                                           // 454
        } else {                                                                                                // 455
          return GeoJSON.geometryWithinRadius(value, point, maxDistance)                                        // 456
            ? 0 : maxDistance + 1;                                                                              // 457
        }                                                                                                       // 458
      };                                                                                                        // 459
    } else {                                                                                                    // 460
      maxDistance = valueSelector.$maxDistance;                                                                 // 461
      if (!isArray(operand) && !isPlainObject(operand))                                                         // 462
        throw Error("$near argument must be coordinate pair or GeoJSON");                                       // 463
      point = pointToArray(operand);                                                                            // 464
      distance = function (value) {                                                                             // 465
        if (!isArray(value) && !isPlainObject(value))                                                           // 466
          return null;                                                                                          // 467
        return distanceCoordinatePairs(point, value);                                                           // 468
      };                                                                                                        // 469
    }                                                                                                           // 470
                                                                                                                // 471
    return function (branchedValues) {                                                                          // 472
      // There might be multiple points in the document that match the given                                    // 473
      // field. Only one of them needs to be within $maxDistance, but we need to                                // 474
      // evaluate all of them and use the nearest one for the implicit sort                                     // 475
      // specifier. (That's why we can't just use ELEMENT_OPERATORS here.)                                      // 476
      //                                                                                                        // 477
      // Note: This differs from MongoDB's implementation, where a document will                                // 478
      // actually show up *multiple times* in the result set, with one entry for                                // 479
      // each within-$maxDistance branching point.                                                              // 480
      branchedValues = expandArraysInBranches(branchedValues);                                                  // 481
      var result = {result: false};                                                                             // 482
      _.each(branchedValues, function (branch) {                                                                // 483
        var curDistance = distance(branch.value);                                                               // 484
        // Skip branches that aren't real points or are too far away.                                           // 485
        if (curDistance === null || curDistance > maxDistance)                                                  // 486
          return;                                                                                               // 487
        // Skip anything that's a tie.                                                                          // 488
        if (result.distance !== undefined && result.distance <= curDistance)                                    // 489
          return;                                                                                               // 490
        result.result = true;                                                                                   // 491
        result.distance = curDistance;                                                                          // 492
        if (!branch.arrayIndices)                                                                               // 493
          delete result.arrayIndices;                                                                           // 494
        else                                                                                                    // 495
          result.arrayIndices = branch.arrayIndices;                                                            // 496
      });                                                                                                       // 497
      return result;                                                                                            // 498
    };                                                                                                          // 499
  }                                                                                                             // 500
};                                                                                                              // 501
                                                                                                                // 502
// Helpers for $near.                                                                                           // 503
var distanceCoordinatePairs = function (a, b) {                                                                 // 504
  a = pointToArray(a);                                                                                          // 505
  b = pointToArray(b);                                                                                          // 506
  var x = a[0] - b[0];                                                                                          // 507
  var y = a[1] - b[1];                                                                                          // 508
  if (_.isNaN(x) || _.isNaN(y))                                                                                 // 509
    return null;                                                                                                // 510
  return Math.sqrt(x * x + y * y);                                                                              // 511
};                                                                                                              // 512
// Makes sure we get 2 elements array and assume the first one to be x and                                      // 513
// the second one to y no matter what user passes.                                                              // 514
// In case user passes { lon: x, lat: y } returns [x, y]                                                        // 515
var pointToArray = function (point) {                                                                           // 516
  return _.map(point, _.identity);                                                                              // 517
};                                                                                                              // 518
                                                                                                                // 519
// Helper for $lt/$gt/$lte/$gte.                                                                                // 520
var makeInequality = function (cmpValueComparator) {                                                            // 521
  return {                                                                                                      // 522
    compileElementSelector: function (operand) {                                                                // 523
      // Arrays never compare false with non-arrays for any inequality.                                         // 524
      // XXX This was behavior we observed in pre-release MongoDB 2.5, but                                      // 525
      //     it seems to have been reverted.                                                                    // 526
      //     See https://jira.mongodb.org/browse/SERVER-11444                                                   // 527
      if (isArray(operand)) {                                                                                   // 528
        return function () {                                                                                    // 529
          return false;                                                                                         // 530
        };                                                                                                      // 531
      }                                                                                                         // 532
                                                                                                                // 533
      // Special case: consider undefined and null the same (so true with                                       // 534
      // $gte/$lte).                                                                                            // 535
      if (operand === undefined)                                                                                // 536
        operand = null;                                                                                         // 537
                                                                                                                // 538
      var operandType = LocalCollection._f._type(operand);                                                      // 539
                                                                                                                // 540
      return function (value) {                                                                                 // 541
        if (value === undefined)                                                                                // 542
          value = null;                                                                                         // 543
        // Comparisons are never true among things of different type (except                                    // 544
        // null vs undefined).                                                                                  // 545
        if (LocalCollection._f._type(value) !== operandType)                                                    // 546
          return false;                                                                                         // 547
        return cmpValueComparator(LocalCollection._f._cmp(value, operand));                                     // 548
      };                                                                                                        // 549
    }                                                                                                           // 550
  };                                                                                                            // 551
};                                                                                                              // 552
                                                                                                                // 553
// Each element selector contains:                                                                              // 554
//  - compileElementSelector, a function with args:                                                             // 555
//    - operand - the "right hand side" of the operator                                                         // 556
//    - valueSelector - the "context" for the operator (so that $regex can find                                 // 557
//      $options)                                                                                               // 558
//    - matcher - the Matcher this is going into (so that $elemMatch can compile                                // 559
//      more things)                                                                                            // 560
//    returning a function mapping a single value to bool.                                                      // 561
//  - dontExpandLeafArrays, a bool which prevents expandArraysInBranches from                                   // 562
//    being called                                                                                              // 563
//  - dontIncludeLeafArrays, a bool which causes an argument to be passed to                                    // 564
//    expandArraysInBranches if it is called                                                                    // 565
ELEMENT_OPERATORS = {                                                                                           // 566
  $lt: makeInequality(function (cmpValue) {                                                                     // 567
    return cmpValue < 0;                                                                                        // 568
  }),                                                                                                           // 569
  $gt: makeInequality(function (cmpValue) {                                                                     // 570
    return cmpValue > 0;                                                                                        // 571
  }),                                                                                                           // 572
  $lte: makeInequality(function (cmpValue) {                                                                    // 573
    return cmpValue <= 0;                                                                                       // 574
  }),                                                                                                           // 575
  $gte: makeInequality(function (cmpValue) {                                                                    // 576
    return cmpValue >= 0;                                                                                       // 577
  }),                                                                                                           // 578
  $mod: {                                                                                                       // 579
    compileElementSelector: function (operand) {                                                                // 580
      if (!(isArray(operand) && operand.length === 2                                                            // 581
            && typeof(operand[0]) === 'number'                                                                  // 582
            && typeof(operand[1]) === 'number')) {                                                              // 583
        throw Error("argument to $mod must be an array of two numbers");                                        // 584
      }                                                                                                         // 585
      // XXX could require to be ints or round or something                                                     // 586
      var divisor = operand[0];                                                                                 // 587
      var remainder = operand[1];                                                                               // 588
      return function (value) {                                                                                 // 589
        return typeof value === 'number' && value % divisor === remainder;                                      // 590
      };                                                                                                        // 591
    }                                                                                                           // 592
  },                                                                                                            // 593
  $in: {                                                                                                        // 594
    compileElementSelector: function (operand) {                                                                // 595
      if (!isArray(operand))                                                                                    // 596
        throw Error("$in needs an array");                                                                      // 597
                                                                                                                // 598
      var elementMatchers = [];                                                                                 // 599
      _.each(operand, function (option) {                                                                       // 600
        if (option instanceof RegExp)                                                                           // 601
          elementMatchers.push(regexpElementMatcher(option));                                                   // 602
        else if (isOperatorObject(option))                                                                      // 603
          throw Error("cannot nest $ under $in");                                                               // 604
        else                                                                                                    // 605
          elementMatchers.push(equalityElementMatcher(option));                                                 // 606
      });                                                                                                       // 607
                                                                                                                // 608
      return function (value) {                                                                                 // 609
        // Allow {a: {$in: [null]}} to match when 'a' does not exist.                                           // 610
        if (value === undefined)                                                                                // 611
          value = null;                                                                                         // 612
        return _.any(elementMatchers, function (e) {                                                            // 613
          return e(value);                                                                                      // 614
        });                                                                                                     // 615
      };                                                                                                        // 616
    }                                                                                                           // 617
  },                                                                                                            // 618
  $size: {                                                                                                      // 619
    // {a: [[5, 5]]} must match {a: {$size: 1}} but not {a: {$size: 2}}, so we                                  // 620
    // don't want to consider the element [5,5] in the leaf array [[5,5]] as a                                  // 621
    // possible value.                                                                                          // 622
    dontExpandLeafArrays: true,                                                                                 // 623
    compileElementSelector: function (operand) {                                                                // 624
      if (typeof operand === 'string') {                                                                        // 625
        // Don't ask me why, but by experimentation, this seems to be what Mongo                                // 626
        // does.                                                                                                // 627
        operand = 0;                                                                                            // 628
      } else if (typeof operand !== 'number') {                                                                 // 629
        throw Error("$size needs a number");                                                                    // 630
      }                                                                                                         // 631
      return function (value) {                                                                                 // 632
        return isArray(value) && value.length === operand;                                                      // 633
      };                                                                                                        // 634
    }                                                                                                           // 635
  },                                                                                                            // 636
  $type: {                                                                                                      // 637
    // {a: [5]} must not match {a: {$type: 4}} (4 means array), but it should                                   // 638
    // match {a: {$type: 1}} (1 means number), and {a: [[5]]} must match {$a:                                   // 639
    // {$type: 4}}. Thus, when we see a leaf array, we *should* expand it but                                   // 640
    // should *not* include it itself.                                                                          // 641
    dontIncludeLeafArrays: true,                                                                                // 642
    compileElementSelector: function (operand) {                                                                // 643
      if (typeof operand !== 'number')                                                                          // 644
        throw Error("$type needs a number");                                                                    // 645
      return function (value) {                                                                                 // 646
        return value !== undefined                                                                              // 647
          && LocalCollection._f._type(value) === operand;                                                       // 648
      };                                                                                                        // 649
    }                                                                                                           // 650
  },                                                                                                            // 651
  $regex: {                                                                                                     // 652
    compileElementSelector: function (operand, valueSelector) {                                                 // 653
      if (!(typeof operand === 'string' || operand instanceof RegExp))                                          // 654
        throw Error("$regex has to be a string or RegExp");                                                     // 655
                                                                                                                // 656
      var regexp;                                                                                               // 657
      if (valueSelector.$options !== undefined) {                                                               // 658
        // Options passed in $options (even the empty string) always overrides                                  // 659
        // options in the RegExp object itself. (See also                                                       // 660
        // Mongo.Collection._rewriteSelector.)                                                                  // 661
                                                                                                                // 662
        // Be clear that we only support the JS-supported options, not extended                                 // 663
        // ones (eg, Mongo supports x and s). Ideally we would implement x and s                                // 664
        // by transforming the regexp, but not today...                                                         // 665
        if (/[^gim]/.test(valueSelector.$options))                                                              // 666
          throw new Error("Only the i, m, and g regexp options are supported");                                 // 667
                                                                                                                // 668
        var regexSource = operand instanceof RegExp ? operand.source : operand;                                 // 669
        regexp = new RegExp(regexSource, valueSelector.$options);                                               // 670
      } else if (operand instanceof RegExp) {                                                                   // 671
        regexp = operand;                                                                                       // 672
      } else {                                                                                                  // 673
        regexp = new RegExp(operand);                                                                           // 674
      }                                                                                                         // 675
      return regexpElementMatcher(regexp);                                                                      // 676
    }                                                                                                           // 677
  },                                                                                                            // 678
  $elemMatch: {                                                                                                 // 679
    dontExpandLeafArrays: true,                                                                                 // 680
    compileElementSelector: function (operand, valueSelector, matcher) {                                        // 681
      if (!isPlainObject(operand))                                                                              // 682
        throw Error("$elemMatch need an object");                                                               // 683
                                                                                                                // 684
      var subMatcher, isDocMatcher;                                                                             // 685
      if (isOperatorObject(_.omit(operand, _.keys(LOGICAL_OPERATORS)), true)) {                                 // 686
        subMatcher = compileValueSelector(operand, matcher);                                                    // 687
        isDocMatcher = false;                                                                                   // 688
      } else {                                                                                                  // 689
        // This is NOT the same as compileValueSelector(operand), and not just                                  // 690
        // because of the slightly different calling convention.                                                // 691
        // {$elemMatch: {x: 3}} means "an element has a field x:3", not                                         // 692
        // "consists only of a field x:3". Also, regexps and sub-$ are allowed.                                 // 693
        subMatcher = compileDocumentSelector(operand, matcher,                                                  // 694
                                             {inElemMatch: true});                                              // 695
        isDocMatcher = true;                                                                                    // 696
      }                                                                                                         // 697
                                                                                                                // 698
      return function (value) {                                                                                 // 699
        if (!isArray(value))                                                                                    // 700
          return false;                                                                                         // 701
        for (var i = 0; i < value.length; ++i) {                                                                // 702
          var arrayElement = value[i];                                                                          // 703
          var arg;                                                                                              // 704
          if (isDocMatcher) {                                                                                   // 705
            // We can only match {$elemMatch: {b: 3}} against objects.                                          // 706
            // (We can also match against arrays, if there's numeric indices,                                   // 707
            // eg {$elemMatch: {'0.b': 3}} or {$elemMatch: {0: 3}}.)                                            // 708
            if (!isPlainObject(arrayElement) && !isArray(arrayElement))                                         // 709
              return false;                                                                                     // 710
            arg = arrayElement;                                                                                 // 711
          } else {                                                                                              // 712
            // dontIterate ensures that {a: {$elemMatch: {$gt: 5}}} matches                                     // 713
            // {a: [8]} but not {a: [[8]]}                                                                      // 714
            arg = [{value: arrayElement, dontIterate: true}];                                                   // 715
          }                                                                                                     // 716
          // XXX support $near in $elemMatch by propagating $distance?                                          // 717
          if (subMatcher(arg).result)                                                                           // 718
            return i;   // specially understood to mean "use as arrayIndices"                                   // 719
        }                                                                                                       // 720
        return false;                                                                                           // 721
      };                                                                                                        // 722
    }                                                                                                           // 723
  }                                                                                                             // 724
};                                                                                                              // 725
                                                                                                                // 726
// makeLookupFunction(key) returns a lookup function.                                                           // 727
//                                                                                                              // 728
// A lookup function takes in a document and returns an array of matching                                       // 729
// branches.  If no arrays are found while looking up the key, this array will                                  // 730
// have exactly one branches (possibly 'undefined', if some segment of the key                                  // 731
// was not found).                                                                                              // 732
//                                                                                                              // 733
// If arrays are found in the middle, this can have more than one element, since                                // 734
// we "branch". When we "branch", if there are more key segments to look up,                                    // 735
// then we only pursue branches that are plain objects (not arrays or scalars).                                 // 736
// This means we can actually end up with no branches!                                                          // 737
//                                                                                                              // 738
// We do *NOT* branch on arrays that are found at the end (ie, at the last                                      // 739
// dotted member of the key). We just return that array; if you want to                                         // 740
// effectively "branch" over the array's values, post-process the lookup                                        // 741
// function with expandArraysInBranches.                                                                        // 742
//                                                                                                              // 743
// Each branch is an object with keys:                                                                          // 744
//  - value: the value at the branch                                                                            // 745
//  - dontIterate: an optional bool; if true, it means that 'value' is an array                                 // 746
//    that expandArraysInBranches should NOT expand. This specifically happens                                  // 747
//    when there is a numeric index in the key, and ensures the                                                 // 748
//    perhaps-surprising MongoDB behavior where {'a.0': 5} does NOT                                             // 749
//    match {a: [[5]]}.                                                                                         // 750
//  - arrayIndices: if any array indexing was done during lookup (either due to                                 // 751
//    explicit numeric indices or implicit branching), this will be an array of                                 // 752
//    the array indices used, from outermost to innermost; it is falsey or                                      // 753
//    absent if no array index is used. If an explicit numeric index is used,                                   // 754
//    the index will be followed in arrayIndices by the string 'x'.                                             // 755
//                                                                                                              // 756
//    Note: arrayIndices is used for two purposes. First, it is used to                                         // 757
//    implement the '$' modifier feature, which only ever looks at its first                                    // 758
//    element.                                                                                                  // 759
//                                                                                                              // 760
//    Second, it is used for sort key generation, which needs to be able to tell                                // 761
//    the difference between different paths. Moreover, it needs to                                             // 762
//    differentiate between explicit and implicit branching, which is why                                       // 763
//    there's the somewhat hacky 'x' entry: this means that explicit and                                        // 764
//    implicit array lookups will have different full arrayIndices paths. (That                                 // 765
//    code only requires that different paths have different arrayIndices; it                                   // 766
//    doesn't actually "parse" arrayIndices. As an alternative, arrayIndices                                    // 767
//    could contain objects with flags like "implicit", but I think that only                                   // 768
//    makes the code surrounding them more complex.)                                                            // 769
//                                                                                                              // 770
//    (By the way, this field ends up getting passed around a lot without                                       // 771
//    cloning, so never mutate any arrayIndices field/var in this package!)                                     // 772
//                                                                                                              // 773
//                                                                                                              // 774
// At the top level, you may only pass in a plain object or array.                                              // 775
//                                                                                                              // 776
// See the test 'minimongo - lookup' for some examples of what lookup functions                                 // 777
// return.                                                                                                      // 778
makeLookupFunction = function (key, options) {                                                                  // 779
  options = options || {};                                                                                      // 780
  var parts = key.split('.');                                                                                   // 781
  var firstPart = parts.length ? parts[0] : '';                                                                 // 782
  var firstPartIsNumeric = isNumericKey(firstPart);                                                             // 783
  var nextPartIsNumeric = parts.length >= 2 && isNumericKey(parts[1]);                                          // 784
  var lookupRest;                                                                                               // 785
  if (parts.length > 1) {                                                                                       // 786
    lookupRest = makeLookupFunction(parts.slice(1).join('.'));                                                  // 787
  }                                                                                                             // 788
                                                                                                                // 789
  var omitUnnecessaryFields = function (retVal) {                                                               // 790
    if (!retVal.dontIterate)                                                                                    // 791
      delete retVal.dontIterate;                                                                                // 792
    if (retVal.arrayIndices && !retVal.arrayIndices.length)                                                     // 793
      delete retVal.arrayIndices;                                                                               // 794
    return retVal;                                                                                              // 795
  };                                                                                                            // 796
                                                                                                                // 797
  // Doc will always be a plain object or an array.                                                             // 798
  // apply an explicit numeric index, an array.                                                                 // 799
  return function (doc, arrayIndices) {                                                                         // 800
    if (!arrayIndices)                                                                                          // 801
      arrayIndices = [];                                                                                        // 802
                                                                                                                // 803
    if (isArray(doc)) {                                                                                         // 804
      // If we're being asked to do an invalid lookup into an array (non-integer                                // 805
      // or out-of-bounds), return no results (which is different from returning                                // 806
      // a single undefined result, in that `null` equality checks won't match).                                // 807
      if (!(firstPartIsNumeric && firstPart < doc.length))                                                      // 808
        return [];                                                                                              // 809
                                                                                                                // 810
      // Remember that we used this array index. Include an 'x' to indicate that                                // 811
      // the previous index came from being considered as an explicit array                                     // 812
      // index (not branching).                                                                                 // 813
      arrayIndices = arrayIndices.concat(+firstPart, 'x');                                                      // 814
    }                                                                                                           // 815
                                                                                                                // 816
    // Do our first lookup.                                                                                     // 817
    var firstLevel = doc[firstPart];                                                                            // 818
                                                                                                                // 819
    // If there is no deeper to dig, return what we found.                                                      // 820
    //                                                                                                          // 821
    // If what we found is an array, most value selectors will choose to treat                                  // 822
    // the elements of the array as matchable values in their own right, but                                    // 823
    // that's done outside of the lookup function. (Exceptions to this are $size                                // 824
    // and stuff relating to $elemMatch.  eg, {a: {$size: 2}} does not match {a:                                // 825
    // [[1, 2]]}.)                                                                                              // 826
    //                                                                                                          // 827
    // That said, if we just did an *explicit* array lookup (on doc) to find                                    // 828
    // firstLevel, and firstLevel is an array too, we do NOT want value                                         // 829
    // selectors to iterate over it.  eg, {'a.0': 5} does not match {a: [[5]]}.                                 // 830
    // So in that case, we mark the return value as "don't iterate".                                            // 831
    if (!lookupRest) {                                                                                          // 832
      return [omitUnnecessaryFields({                                                                           // 833
        value: firstLevel,                                                                                      // 834
        dontIterate: isArray(doc) && isArray(firstLevel),                                                       // 835
        arrayIndices: arrayIndices})];                                                                          // 836
    }                                                                                                           // 837
                                                                                                                // 838
    // We need to dig deeper.  But if we can't, because what we've found is not                                 // 839
    // an array or plain object, we're done. If we just did a numeric index into                                // 840
    // an array, we return nothing here (this is a change in Mongo 2.5 from                                     // 841
    // Mongo 2.4, where {'a.0.b': null} stopped matching {a: [5]}). Otherwise,                                  // 842
    // return a single `undefined` (which can, for example, match via equality                                  // 843
    // with `null`).                                                                                            // 844
    if (!isIndexable(firstLevel)) {                                                                             // 845
      if (isArray(doc))                                                                                         // 846
        return [];                                                                                              // 847
      return [omitUnnecessaryFields({value: undefined,                                                          // 848
                                      arrayIndices: arrayIndices})];                                            // 849
    }                                                                                                           // 850
                                                                                                                // 851
    var result = [];                                                                                            // 852
    var appendToResult = function (more) {                                                                      // 853
      Array.prototype.push.apply(result, more);                                                                 // 854
    };                                                                                                          // 855
                                                                                                                // 856
    // Dig deeper: look up the rest of the parts on whatever we've found.                                       // 857
    // (lookupRest is smart enough to not try to do invalid lookups into                                        // 858
    // firstLevel if it's an array.)                                                                            // 859
    appendToResult(lookupRest(firstLevel, arrayIndices));                                                       // 860
                                                                                                                // 861
    // If we found an array, then in *addition* to potentially treating the next                                // 862
    // part as a literal integer lookup, we should also "branch": try to look up                                // 863
    // the rest of the parts on each array element in parallel.                                                 // 864
    //                                                                                                          // 865
    // In this case, we *only* dig deeper into array elements that are plain                                    // 866
    // objects. (Recall that we only got this far if we have further to dig.)                                   // 867
    // This makes sense: we certainly don't dig deeper into non-indexable                                       // 868
    // objects. And it would be weird to dig into an array: it's simpler to have                                // 869
    // a rule that explicit integer indexes only apply to an outer array, not to                                // 870
    // an array you find after a branching search.                                                              // 871
    //                                                                                                          // 872
    // In the special case of a numeric part in a *sort selector* (not a query                                  // 873
    // selector), we skip the branching: we ONLY allow the numeric part to mean                                 // 874
    // "look up this index" in that case, not "also look up this index in all                                   // 875
    // the elements of the array".                                                                              // 876
    if (isArray(firstLevel) && !(nextPartIsNumeric && options.forSort)) {                                       // 877
      _.each(firstLevel, function (branch, arrayIndex) {                                                        // 878
        if (isPlainObject(branch)) {                                                                            // 879
          appendToResult(lookupRest(                                                                            // 880
            branch,                                                                                             // 881
            arrayIndices.concat(arrayIndex)));                                                                  // 882
        }                                                                                                       // 883
      });                                                                                                       // 884
    }                                                                                                           // 885
                                                                                                                // 886
    return result;                                                                                              // 887
  };                                                                                                            // 888
};                                                                                                              // 889
MinimongoTest.makeLookupFunction = makeLookupFunction;                                                          // 890
                                                                                                                // 891
expandArraysInBranches = function (branches, skipTheArrays) {                                                   // 892
  var branchesOut = [];                                                                                         // 893
  _.each(branches, function (branch) {                                                                          // 894
    var thisIsArray = isArray(branch.value);                                                                    // 895
    // We include the branch itself, *UNLESS* we it's an array that we're going                                 // 896
    // to iterate and we're told to skip arrays.  (That's right, we include some                                // 897
    // arrays even skipTheArrays is true: these are arrays that were found via                                  // 898
    // explicit numerical indices.)                                                                             // 899
    if (!(skipTheArrays && thisIsArray && !branch.dontIterate)) {                                               // 900
      branchesOut.push({                                                                                        // 901
        value: branch.value,                                                                                    // 902
        arrayIndices: branch.arrayIndices                                                                       // 903
      });                                                                                                       // 904
    }                                                                                                           // 905
    if (thisIsArray && !branch.dontIterate) {                                                                   // 906
      _.each(branch.value, function (leaf, i) {                                                                 // 907
        branchesOut.push({                                                                                      // 908
          value: leaf,                                                                                          // 909
          arrayIndices: (branch.arrayIndices || []).concat(i)                                                   // 910
        });                                                                                                     // 911
      });                                                                                                       // 912
    }                                                                                                           // 913
  });                                                                                                           // 914
  return branchesOut;                                                                                           // 915
};                                                                                                              // 916
                                                                                                                // 917
var nothingMatcher = function (docOrBranchedValues) {                                                           // 918
  return {result: false};                                                                                       // 919
};                                                                                                              // 920
                                                                                                                // 921
var everythingMatcher = function (docOrBranchedValues) {                                                        // 922
  return {result: true};                                                                                        // 923
};                                                                                                              // 924
                                                                                                                // 925
                                                                                                                // 926
// NB: We are cheating and using this function to implement "AND" for both                                      // 927
// "document matchers" and "branched matchers". They both return result objects                                 // 928
// but the argument is different: for the former it's a whole doc, whereas for                                  // 929
// the latter it's an array of "branched values".                                                               // 930
var andSomeMatchers = function (subMatchers) {                                                                  // 931
  if (subMatchers.length === 0)                                                                                 // 932
    return everythingMatcher;                                                                                   // 933
  if (subMatchers.length === 1)                                                                                 // 934
    return subMatchers[0];                                                                                      // 935
                                                                                                                // 936
  return function (docOrBranches) {                                                                             // 937
    var ret = {};                                                                                               // 938
    ret.result = _.all(subMatchers, function (f) {                                                              // 939
      var subResult = f(docOrBranches);                                                                         // 940
      // Copy a 'distance' number out of the first sub-matcher that has                                         // 941
      // one. Yes, this means that if there are multiple $near fields in a                                      // 942
      // query, something arbitrary happens; this appears to be consistent with                                 // 943
      // Mongo.                                                                                                 // 944
      if (subResult.result && subResult.distance !== undefined                                                  // 945
          && ret.distance === undefined) {                                                                      // 946
        ret.distance = subResult.distance;                                                                      // 947
      }                                                                                                         // 948
      // Similarly, propagate arrayIndices from sub-matchers... but to match                                    // 949
      // MongoDB behavior, this time the *last* sub-matcher with arrayIndices                                   // 950
      // wins.                                                                                                  // 951
      if (subResult.result && subResult.arrayIndices) {                                                         // 952
        ret.arrayIndices = subResult.arrayIndices;                                                              // 953
      }                                                                                                         // 954
      return subResult.result;                                                                                  // 955
    });                                                                                                         // 956
                                                                                                                // 957
    // If we didn't actually match, forget any extra metadata we came up with.                                  // 958
    if (!ret.result) {                                                                                          // 959
      delete ret.distance;                                                                                      // 960
      delete ret.arrayIndices;                                                                                  // 961
    }                                                                                                           // 962
    return ret;                                                                                                 // 963
  };                                                                                                            // 964
};                                                                                                              // 965
                                                                                                                // 966
var andDocumentMatchers = andSomeMatchers;                                                                      // 967
var andBranchedMatchers = andSomeMatchers;                                                                      // 968
                                                                                                                // 969
                                                                                                                // 970
// helpers used by compiled selector code                                                                       // 971
LocalCollection._f = {                                                                                          // 972
  // XXX for _all and _in, consider building 'inquery' at compile time..                                        // 973
                                                                                                                // 974
  _type: function (v) {                                                                                         // 975
    if (typeof v === "number")                                                                                  // 976
      return 1;                                                                                                 // 977
    if (typeof v === "string")                                                                                  // 978
      return 2;                                                                                                 // 979
    if (typeof v === "boolean")                                                                                 // 980
      return 8;                                                                                                 // 981
    if (isArray(v))                                                                                             // 982
      return 4;                                                                                                 // 983
    if (v === null)                                                                                             // 984
      return 10;                                                                                                // 985
    if (v instanceof RegExp)                                                                                    // 986
      // note that typeof(/x/) === "object"                                                                     // 987
      return 11;                                                                                                // 988
    if (typeof v === "function")                                                                                // 989
      return 13;                                                                                                // 990
    if (v instanceof Date)                                                                                      // 991
      return 9;                                                                                                 // 992
    if (EJSON.isBinary(v))                                                                                      // 993
      return 5;                                                                                                 // 994
    if (v instanceof MongoID.ObjectID)                                                                          // 995
      return 7;                                                                                                 // 996
    return 3; // object                                                                                         // 997
                                                                                                                // 998
    // XXX support some/all of these:                                                                           // 999
    // 14, symbol                                                                                               // 1000
    // 15, javascript code with scope                                                                           // 1001
    // 16, 18: 32-bit/64-bit integer                                                                            // 1002
    // 17, timestamp                                                                                            // 1003
    // 255, minkey                                                                                              // 1004
    // 127, maxkey                                                                                              // 1005
  },                                                                                                            // 1006
                                                                                                                // 1007
  // deep equality test: use for literal document and array matches                                             // 1008
  _equal: function (a, b) {                                                                                     // 1009
    return EJSON.equals(a, b, {keyOrderSensitive: true});                                                       // 1010
  },                                                                                                            // 1011
                                                                                                                // 1012
  // maps a type code to a value that can be used to sort values of                                             // 1013
  // different types                                                                                            // 1014
  _typeorder: function (t) {                                                                                    // 1015
    // http://www.mongodb.org/display/DOCS/What+is+the+Compare+Order+for+BSON+Types                             // 1016
    // XXX what is the correct sort position for Javascript code?                                               // 1017
    // ('100' in the matrix below)                                                                              // 1018
    // XXX minkey/maxkey                                                                                        // 1019
    return [-1,  // (not a type)                                                                                // 1020
            1,   // number                                                                                      // 1021
            2,   // string                                                                                      // 1022
            3,   // object                                                                                      // 1023
            4,   // array                                                                                       // 1024
            5,   // binary                                                                                      // 1025
            -1,  // deprecated                                                                                  // 1026
            6,   // ObjectID                                                                                    // 1027
            7,   // bool                                                                                        // 1028
            8,   // Date                                                                                        // 1029
            0,   // null                                                                                        // 1030
            9,   // RegExp                                                                                      // 1031
            -1,  // deprecated                                                                                  // 1032
            100, // JS code                                                                                     // 1033
            2,   // deprecated (symbol)                                                                         // 1034
            100, // JS code                                                                                     // 1035
            1,   // 32-bit int                                                                                  // 1036
            8,   // Mongo timestamp                                                                             // 1037
            1    // 64-bit int                                                                                  // 1038
           ][t];                                                                                                // 1039
  },                                                                                                            // 1040
                                                                                                                // 1041
  // compare two values of unknown type according to BSON ordering                                              // 1042
  // semantics. (as an extension, consider 'undefined' to be less than                                          // 1043
  // any other value.) return negative if a is less, positive if b is                                           // 1044
  // less, or 0 if equal                                                                                        // 1045
  _cmp: function (a, b) {                                                                                       // 1046
    if (a === undefined)                                                                                        // 1047
      return b === undefined ? 0 : -1;                                                                          // 1048
    if (b === undefined)                                                                                        // 1049
      return 1;                                                                                                 // 1050
    var ta = LocalCollection._f._type(a);                                                                       // 1051
    var tb = LocalCollection._f._type(b);                                                                       // 1052
    var oa = LocalCollection._f._typeorder(ta);                                                                 // 1053
    var ob = LocalCollection._f._typeorder(tb);                                                                 // 1054
    if (oa !== ob)                                                                                              // 1055
      return oa < ob ? -1 : 1;                                                                                  // 1056
    if (ta !== tb)                                                                                              // 1057
      // XXX need to implement this if we implement Symbol or integers, or                                      // 1058
      // Timestamp                                                                                              // 1059
      throw Error("Missing type coercion logic in _cmp");                                                       // 1060
    if (ta === 7) { // ObjectID                                                                                 // 1061
      // Convert to string.                                                                                     // 1062
      ta = tb = 2;                                                                                              // 1063
      a = a.toHexString();                                                                                      // 1064
      b = b.toHexString();                                                                                      // 1065
    }                                                                                                           // 1066
    if (ta === 9) { // Date                                                                                     // 1067
      // Convert to millis.                                                                                     // 1068
      ta = tb = 1;                                                                                              // 1069
      a = a.getTime();                                                                                          // 1070
      b = b.getTime();                                                                                          // 1071
    }                                                                                                           // 1072
                                                                                                                // 1073
    if (ta === 1) // double                                                                                     // 1074
      return a - b;                                                                                             // 1075
    if (tb === 2) // string                                                                                     // 1076
      return a < b ? -1 : (a === b ? 0 : 1);                                                                    // 1077
    if (ta === 3) { // Object                                                                                   // 1078
      // this could be much more efficient in the expected case ...                                             // 1079
      var to_array = function (obj) {                                                                           // 1080
        var ret = [];                                                                                           // 1081
        for (var key in obj) {                                                                                  // 1082
          ret.push(key);                                                                                        // 1083
          ret.push(obj[key]);                                                                                   // 1084
        }                                                                                                       // 1085
        return ret;                                                                                             // 1086
      };                                                                                                        // 1087
      return LocalCollection._f._cmp(to_array(a), to_array(b));                                                 // 1088
    }                                                                                                           // 1089
    if (ta === 4) { // Array                                                                                    // 1090
      for (var i = 0; ; i++) {                                                                                  // 1091
        if (i === a.length)                                                                                     // 1092
          return (i === b.length) ? 0 : -1;                                                                     // 1093
        if (i === b.length)                                                                                     // 1094
          return 1;                                                                                             // 1095
        var s = LocalCollection._f._cmp(a[i], b[i]);                                                            // 1096
        if (s !== 0)                                                                                            // 1097
          return s;                                                                                             // 1098
      }                                                                                                         // 1099
    }                                                                                                           // 1100
    if (ta === 5) { // binary                                                                                   // 1101
      // Surprisingly, a small binary blob is always less than a large one in                                   // 1102
      // Mongo.                                                                                                 // 1103
      if (a.length !== b.length)                                                                                // 1104
        return a.length - b.length;                                                                             // 1105
      for (i = 0; i < a.length; i++) {                                                                          // 1106
        if (a[i] < b[i])                                                                                        // 1107
          return -1;                                                                                            // 1108
        if (a[i] > b[i])                                                                                        // 1109
          return 1;                                                                                             // 1110
      }                                                                                                         // 1111
      return 0;                                                                                                 // 1112
    }                                                                                                           // 1113
    if (ta === 8) { // boolean                                                                                  // 1114
      if (a) return b ? 0 : 1;                                                                                  // 1115
      return b ? -1 : 0;                                                                                        // 1116
    }                                                                                                           // 1117
    if (ta === 10) // null                                                                                      // 1118
      return 0;                                                                                                 // 1119
    if (ta === 11) // regexp                                                                                    // 1120
      throw Error("Sorting not supported on regular expression"); // XXX                                        // 1121
    // 13: javascript code                                                                                      // 1122
    // 14: symbol                                                                                               // 1123
    // 15: javascript code with scope                                                                           // 1124
    // 16: 32-bit integer                                                                                       // 1125
    // 17: timestamp                                                                                            // 1126
    // 18: 64-bit integer                                                                                       // 1127
    // 255: minkey                                                                                              // 1128
    // 127: maxkey                                                                                              // 1129
    if (ta === 13) // javascript code                                                                           // 1130
      throw Error("Sorting not supported on Javascript code"); // XXX                                           // 1131
    throw Error("Unknown type to sort");                                                                        // 1132
  }                                                                                                             // 1133
};                                                                                                              // 1134
                                                                                                                // 1135
// Oddball function used by upsert.                                                                             // 1136
LocalCollection._removeDollarOperators = function (selector) {                                                  // 1137
  var selectorDoc = {};                                                                                         // 1138
  for (var k in selector)                                                                                       // 1139
    if (k.substr(0, 1) !== '$')                                                                                 // 1140
      selectorDoc[k] = selector[k];                                                                             // 1141
  return selectorDoc;                                                                                           // 1142
};                                                                                                              // 1143
                                                                                                                // 1144
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/minimongo/sort.js                                                                                   //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
// Give a sort spec, which can be in any of these forms:                                                        // 1
//   {"key1": 1, "key2": -1}                                                                                    // 2
//   [["key1", "asc"], ["key2", "desc"]]                                                                        // 3
//   ["key1", ["key2", "desc"]]                                                                                 // 4
//                                                                                                              // 5
// (.. with the first form being dependent on the key enumeration                                               // 6
// behavior of your javascript VM, which usually does what you mean in                                          // 7
// this case if the key names don't look like integers ..)                                                      // 8
//                                                                                                              // 9
// return a function that takes two objects, and returns -1 if the                                              // 10
// first object comes first in order, 1 if the second object comes                                              // 11
// first, or 0 if neither object comes before the other.                                                        // 12
                                                                                                                // 13
Minimongo.Sorter = function (spec, options) {                                                                   // 14
  var self = this;                                                                                              // 15
  options = options || {};                                                                                      // 16
                                                                                                                // 17
  self._sortSpecParts = [];                                                                                     // 18
  self._sortFunction = null;                                                                                    // 19
                                                                                                                // 20
  var addSpecPart = function (path, ascending) {                                                                // 21
    if (!path)                                                                                                  // 22
      throw Error("sort keys must be non-empty");                                                               // 23
    if (path.charAt(0) === '$')                                                                                 // 24
      throw Error("unsupported sort key: " + path);                                                             // 25
    self._sortSpecParts.push({                                                                                  // 26
      path: path,                                                                                               // 27
      lookup: makeLookupFunction(path, {forSort: true}),                                                        // 28
      ascending: ascending                                                                                      // 29
    });                                                                                                         // 30
  };                                                                                                            // 31
                                                                                                                // 32
  if (spec instanceof Array) {                                                                                  // 33
    for (var i = 0; i < spec.length; i++) {                                                                     // 34
      if (typeof spec[i] === "string") {                                                                        // 35
        addSpecPart(spec[i], true);                                                                             // 36
      } else {                                                                                                  // 37
        addSpecPart(spec[i][0], spec[i][1] !== "desc");                                                         // 38
      }                                                                                                         // 39
    }                                                                                                           // 40
  } else if (typeof spec === "object") {                                                                        // 41
    _.each(spec, function (value, key) {                                                                        // 42
      addSpecPart(key, value >= 0);                                                                             // 43
    });                                                                                                         // 44
  } else if (typeof spec === "function") {                                                                      // 45
    self._sortFunction = spec;                                                                                  // 46
  } else {                                                                                                      // 47
    throw Error("Bad sort specification: " + JSON.stringify(spec));                                             // 48
  }                                                                                                             // 49
                                                                                                                // 50
  // If a function is specified for sorting, we skip the rest.                                                  // 51
  if (self._sortFunction)                                                                                       // 52
    return;                                                                                                     // 53
                                                                                                                // 54
  // To implement affectedByModifier, we piggy-back on top of Matcher's                                         // 55
  // affectedByModifier code; we create a selector that is affected by the same                                 // 56
  // modifiers as this sort order. This is only implemented on the server.                                      // 57
  if (self.affectedByModifier) {                                                                                // 58
    var selector = {};                                                                                          // 59
    _.each(self._sortSpecParts, function (spec) {                                                               // 60
      selector[spec.path] = 1;                                                                                  // 61
    });                                                                                                         // 62
    self._selectorForAffectedByModifier = new Minimongo.Matcher(selector);                                      // 63
  }                                                                                                             // 64
                                                                                                                // 65
  self._keyComparator = composeComparators(                                                                     // 66
    _.map(self._sortSpecParts, function (spec, i) {                                                             // 67
      return self._keyFieldComparator(i);                                                                       // 68
    }));                                                                                                        // 69
                                                                                                                // 70
  // If you specify a matcher for this Sorter, _keyFilter may be set to a                                       // 71
  // function which selects whether or not a given "sort key" (tuple of values                                  // 72
  // for the different sort spec fields) is compatible with the selector.                                       // 73
  self._keyFilter = null;                                                                                       // 74
  options.matcher && self._useWithMatcher(options.matcher);                                                     // 75
};                                                                                                              // 76
                                                                                                                // 77
// In addition to these methods, sorter_project.js defines combineIntoProjection                                // 78
// on the server only.                                                                                          // 79
_.extend(Minimongo.Sorter.prototype, {                                                                          // 80
  getComparator: function (options) {                                                                           // 81
    var self = this;                                                                                            // 82
                                                                                                                // 83
    // If we have no distances, just use the comparator from the source                                         // 84
    // specification (which defaults to "everything is equal".                                                  // 85
    if (!options || !options.distances) {                                                                       // 86
      return self._getBaseComparator();                                                                         // 87
    }                                                                                                           // 88
                                                                                                                // 89
    var distances = options.distances;                                                                          // 90
                                                                                                                // 91
    // Return a comparator which first tries the sort specification, and if that                                // 92
    // says "it's equal", breaks ties using $near distances.                                                    // 93
    return composeComparators([self._getBaseComparator(), function (a, b) {                                     // 94
      if (!distances.has(a._id))                                                                                // 95
        throw Error("Missing distance for " + a._id);                                                           // 96
      if (!distances.has(b._id))                                                                                // 97
        throw Error("Missing distance for " + b._id);                                                           // 98
      return distances.get(a._id) - distances.get(b._id);                                                       // 99
    }]);                                                                                                        // 100
  },                                                                                                            // 101
                                                                                                                // 102
  _getPaths: function () {                                                                                      // 103
    var self = this;                                                                                            // 104
    return _.pluck(self._sortSpecParts, 'path');                                                                // 105
  },                                                                                                            // 106
                                                                                                                // 107
  // Finds the minimum key from the doc, according to the sort specs.  (We say                                  // 108
  // "minimum" here but this is with respect to the sort spec, so "descending"                                  // 109
  // sort fields mean we're finding the max for that field.)                                                    // 110
  //                                                                                                            // 111
  // Note that this is NOT "find the minimum value of the first field, the                                      // 112
  // minimum value of the second field, etc"... it's "choose the                                                // 113
  // lexicographically minimum value of the key vector, allowing only keys which                                // 114
  // you can find along the same paths".  ie, for a doc {a: [{x: 0, y: 5}, {x:                                  // 115
  // 1, y: 3}]} with sort spec {'a.x': 1, 'a.y': 1}, the only keys are [0,5] and                                // 116
  // [1,3], and the minimum key is [0,5]; notably, [0,3] is NOT a key.                                          // 117
  _getMinKeyFromDoc: function (doc) {                                                                           // 118
    var self = this;                                                                                            // 119
    var minKey = null;                                                                                          // 120
                                                                                                                // 121
    self._generateKeysFromDoc(doc, function (key) {                                                             // 122
      if (!self._keyCompatibleWithSelector(key))                                                                // 123
        return;                                                                                                 // 124
                                                                                                                // 125
      if (minKey === null) {                                                                                    // 126
        minKey = key;                                                                                           // 127
        return;                                                                                                 // 128
      }                                                                                                         // 129
      if (self._compareKeys(key, minKey) < 0) {                                                                 // 130
        minKey = key;                                                                                           // 131
      }                                                                                                         // 132
    });                                                                                                         // 133
                                                                                                                // 134
    // This could happen if our key filter somehow filters out all the keys even                                // 135
    // though somehow the selector matches.                                                                     // 136
    if (minKey === null)                                                                                        // 137
      throw Error("sort selector found no keys in doc?");                                                       // 138
    return minKey;                                                                                              // 139
  },                                                                                                            // 140
                                                                                                                // 141
  _keyCompatibleWithSelector: function (key) {                                                                  // 142
    var self = this;                                                                                            // 143
    return !self._keyFilter || self._keyFilter(key);                                                            // 144
  },                                                                                                            // 145
                                                                                                                // 146
  // Iterates over each possible "key" from doc (ie, over each branch), calling                                 // 147
  // 'cb' with the key.                                                                                         // 148
  _generateKeysFromDoc: function (doc, cb) {                                                                    // 149
    var self = this;                                                                                            // 150
                                                                                                                // 151
    if (self._sortSpecParts.length === 0)                                                                       // 152
      throw new Error("can't generate keys without a spec");                                                    // 153
                                                                                                                // 154
    // maps index -> ({'' -> value} or {path -> value})                                                         // 155
    var valuesByIndexAndPath = [];                                                                              // 156
                                                                                                                // 157
    var pathFromIndices = function (indices) {                                                                  // 158
      return indices.join(',') + ',';                                                                           // 159
    };                                                                                                          // 160
                                                                                                                // 161
    var knownPaths = null;                                                                                      // 162
                                                                                                                // 163
    _.each(self._sortSpecParts, function (spec, whichField) {                                                   // 164
      // Expand any leaf arrays that we find, and ignore those arrays                                           // 165
      // themselves.  (We never sort based on an array itself.)                                                 // 166
      var branches = expandArraysInBranches(spec.lookup(doc), true);                                            // 167
                                                                                                                // 168
      // If there are no values for a key (eg, key goes to an empty array),                                     // 169
      // pretend we found one null value.                                                                       // 170
      if (!branches.length)                                                                                     // 171
        branches = [{value: null}];                                                                             // 172
                                                                                                                // 173
      var usedPaths = false;                                                                                    // 174
      valuesByIndexAndPath[whichField] = {};                                                                    // 175
      _.each(branches, function (branch) {                                                                      // 176
        if (!branch.arrayIndices) {                                                                             // 177
          // If there are no array indices for a branch, then it must be the                                    // 178
          // only branch, because the only thing that produces multiple branches                                // 179
          // is the use of arrays.                                                                              // 180
          if (branches.length > 1)                                                                              // 181
            throw Error("multiple branches but no array used?");                                                // 182
          valuesByIndexAndPath[whichField][''] = branch.value;                                                  // 183
          return;                                                                                               // 184
        }                                                                                                       // 185
                                                                                                                // 186
        usedPaths = true;                                                                                       // 187
        var path = pathFromIndices(branch.arrayIndices);                                                        // 188
        if (_.has(valuesByIndexAndPath[whichField], path))                                                      // 189
          throw Error("duplicate path: " + path);                                                               // 190
        valuesByIndexAndPath[whichField][path] = branch.value;                                                  // 191
                                                                                                                // 192
        // If two sort fields both go into arrays, they have to go into the                                     // 193
        // exact same arrays and we have to find the same paths.  This is                                       // 194
        // roughly the same condition that makes MongoDB throw this strange                                     // 195
        // error message.  eg, the main thing is that if sort spec is {a: 1,                                    // 196
        // b:1} then a and b cannot both be arrays.                                                             // 197
        //                                                                                                      // 198
        // (In MongoDB it seems to be OK to have {a: 1, 'a.x.y': 1} where 'a'                                   // 199
        // and 'a.x.y' are both arrays, but we don't allow this for now.                                        // 200
        // #NestedArraySort                                                                                     // 201
        // XXX achieve full compatibility here                                                                  // 202
        if (knownPaths && !_.has(knownPaths, path)) {                                                           // 203
          throw Error("cannot index parallel arrays");                                                          // 204
        }                                                                                                       // 205
      });                                                                                                       // 206
                                                                                                                // 207
      if (knownPaths) {                                                                                         // 208
        // Similarly to above, paths must match everywhere, unless this is a                                    // 209
        // non-array field.                                                                                     // 210
        if (!_.has(valuesByIndexAndPath[whichField], '') &&                                                     // 211
            _.size(knownPaths) !== _.size(valuesByIndexAndPath[whichField])) {                                  // 212
          throw Error("cannot index parallel arrays!");                                                         // 213
        }                                                                                                       // 214
      } else if (usedPaths) {                                                                                   // 215
        knownPaths = {};                                                                                        // 216
        _.each(valuesByIndexAndPath[whichField], function (x, path) {                                           // 217
          knownPaths[path] = true;                                                                              // 218
        });                                                                                                     // 219
      }                                                                                                         // 220
    });                                                                                                         // 221
                                                                                                                // 222
    if (!knownPaths) {                                                                                          // 223
      // Easy case: no use of arrays.                                                                           // 224
      var soleKey = _.map(valuesByIndexAndPath, function (values) {                                             // 225
        if (!_.has(values, ''))                                                                                 // 226
          throw Error("no value in sole key case?");                                                            // 227
        return values[''];                                                                                      // 228
      });                                                                                                       // 229
      cb(soleKey);                                                                                              // 230
      return;                                                                                                   // 231
    }                                                                                                           // 232
                                                                                                                // 233
    _.each(knownPaths, function (x, path) {                                                                     // 234
      var key = _.map(valuesByIndexAndPath, function (values) {                                                 // 235
        if (_.has(values, ''))                                                                                  // 236
          return values[''];                                                                                    // 237
        if (!_.has(values, path))                                                                               // 238
          throw Error("missing path?");                                                                         // 239
        return values[path];                                                                                    // 240
      });                                                                                                       // 241
      cb(key);                                                                                                  // 242
    });                                                                                                         // 243
  },                                                                                                            // 244
                                                                                                                // 245
  // Takes in two keys: arrays whose lengths match the number of spec                                           // 246
  // parts. Returns negative, 0, or positive based on using the sort spec to                                    // 247
  // compare fields.                                                                                            // 248
  _compareKeys: function (key1, key2) {                                                                         // 249
    var self = this;                                                                                            // 250
    if (key1.length !== self._sortSpecParts.length ||                                                           // 251
        key2.length !== self._sortSpecParts.length) {                                                           // 252
      throw Error("Key has wrong length");                                                                      // 253
    }                                                                                                           // 254
                                                                                                                // 255
    return self._keyComparator(key1, key2);                                                                     // 256
  },                                                                                                            // 257
                                                                                                                // 258
  // Given an index 'i', returns a comparator that compares two key arrays based                                // 259
  // on field 'i'.                                                                                              // 260
  _keyFieldComparator: function (i) {                                                                           // 261
    var self = this;                                                                                            // 262
    var invert = !self._sortSpecParts[i].ascending;                                                             // 263
    return function (key1, key2) {                                                                              // 264
      var compare = LocalCollection._f._cmp(key1[i], key2[i]);                                                  // 265
      if (invert)                                                                                               // 266
        compare = -compare;                                                                                     // 267
      return compare;                                                                                           // 268
    };                                                                                                          // 269
  },                                                                                                            // 270
                                                                                                                // 271
  // Returns a comparator that represents the sort specification (but not                                       // 272
  // including a possible geoquery distance tie-breaker).                                                       // 273
  _getBaseComparator: function () {                                                                             // 274
    var self = this;                                                                                            // 275
                                                                                                                // 276
    if (self._sortFunction)                                                                                     // 277
      return self._sortFunction;                                                                                // 278
                                                                                                                // 279
    // If we're only sorting on geoquery distance and no specs, just say                                        // 280
    // everything is equal.                                                                                     // 281
    if (!self._sortSpecParts.length) {                                                                          // 282
      return function (doc1, doc2) {                                                                            // 283
        return 0;                                                                                               // 284
      };                                                                                                        // 285
    }                                                                                                           // 286
                                                                                                                // 287
    return function (doc1, doc2) {                                                                              // 288
      var key1 = self._getMinKeyFromDoc(doc1);                                                                  // 289
      var key2 = self._getMinKeyFromDoc(doc2);                                                                  // 290
      return self._compareKeys(key1, key2);                                                                     // 291
    };                                                                                                          // 292
  },                                                                                                            // 293
                                                                                                                // 294
  // In MongoDB, if you have documents                                                                          // 295
  //    {_id: 'x', a: [1, 10]} and                                                                              // 296
  //    {_id: 'y', a: [5, 15]},                                                                                 // 297
  // then C.find({}, {sort: {a: 1}}) puts x before y (1 comes before 5).                                        // 298
  // But  C.find({a: {$gt: 3}}, {sort: {a: 1}}) puts y before x (1 does not                                     // 299
  // match the selector, and 5 comes before 10).                                                                // 300
  //                                                                                                            // 301
  // The way this works is pretty subtle!  For example, if the documents                                        // 302
  // are instead {_id: 'x', a: [{x: 1}, {x: 10}]}) and                                                          // 303
  //             {_id: 'y', a: [{x: 5}, {x: 15}]}),                                                             // 304
  // then C.find({'a.x': {$gt: 3}}, {sort: {'a.x': 1}}) and                                                     // 305
  //      C.find({a: {$elemMatch: {x: {$gt: 3}}}}, {sort: {'a.x': 1}})                                          // 306
  // both follow this rule (y before x).  (ie, you do have to apply this                                        // 307
  // through $elemMatch.)                                                                                       // 308
  //                                                                                                            // 309
  // So if you pass a matcher to this sorter's constructor, we will attempt to                                  // 310
  // skip sort keys that don't match the selector. The logic here is pretty                                     // 311
  // subtle and undocumented; we've gotten as close as we can figure out based                                  // 312
  // on our understanding of Mongo's behavior.                                                                  // 313
  _useWithMatcher: function (matcher) {                                                                         // 314
    var self = this;                                                                                            // 315
                                                                                                                // 316
    if (self._keyFilter)                                                                                        // 317
      throw Error("called _useWithMatcher twice?");                                                             // 318
                                                                                                                // 319
    // If we are only sorting by distance, then we're not going to bother to                                    // 320
    // build a key filter.                                                                                      // 321
    // XXX figure out how geoqueries interact with this stuff                                                   // 322
    if (_.isEmpty(self._sortSpecParts))                                                                         // 323
      return;                                                                                                   // 324
                                                                                                                // 325
    var selector = matcher._selector;                                                                           // 326
                                                                                                                // 327
    // If the user just passed a literal function to find(), then we can't get a                                // 328
    // key filter from it.                                                                                      // 329
    if (selector instanceof Function)                                                                           // 330
      return;                                                                                                   // 331
                                                                                                                // 332
    var constraintsByPath = {};                                                                                 // 333
    _.each(self._sortSpecParts, function (spec, i) {                                                            // 334
      constraintsByPath[spec.path] = [];                                                                        // 335
    });                                                                                                         // 336
                                                                                                                // 337
    _.each(selector, function (subSelector, key) {                                                              // 338
      // XXX support $and and $or                                                                               // 339
                                                                                                                // 340
      var constraints = constraintsByPath[key];                                                                 // 341
      if (!constraints)                                                                                         // 342
        return;                                                                                                 // 343
                                                                                                                // 344
      // XXX it looks like the real MongoDB implementation isn't "does the                                      // 345
      // regexp match" but "does the value fall into a range named by the                                       // 346
      // literal prefix of the regexp", ie "foo" in /^foo(bar|baz)+/  But                                       // 347
      // "does the regexp match" is a good approximation.                                                       // 348
      if (subSelector instanceof RegExp) {                                                                      // 349
        // As far as we can tell, using either of the options that both we and                                  // 350
        // MongoDB support ('i' and 'm') disables use of the key filter. This                                   // 351
        // makes sense: MongoDB mostly appears to be calculating ranges of an                                   // 352
        // index to use, which means it only cares about regexps that match                                     // 353
        // one range (with a literal prefix), and both 'i' and 'm' prevent the                                  // 354
        // literal prefix of the regexp from actually meaning one range.                                        // 355
        if (subSelector.ignoreCase || subSelector.multiline)                                                    // 356
          return;                                                                                               // 357
        constraints.push(regexpElementMatcher(subSelector));                                                    // 358
        return;                                                                                                 // 359
      }                                                                                                         // 360
                                                                                                                // 361
      if (isOperatorObject(subSelector)) {                                                                      // 362
        _.each(subSelector, function (operand, operator) {                                                      // 363
          if (_.contains(['$lt', '$lte', '$gt', '$gte'], operator)) {                                           // 364
            // XXX this depends on us knowing that these operators don't use any                                // 365
            // of the arguments to compileElementSelector other than operand.                                   // 366
            constraints.push(                                                                                   // 367
              ELEMENT_OPERATORS[operator].compileElementSelector(operand));                                     // 368
          }                                                                                                     // 369
                                                                                                                // 370
          // See comments in the RegExp block above.                                                            // 371
          if (operator === '$regex' && !subSelector.$options) {                                                 // 372
            constraints.push(                                                                                   // 373
              ELEMENT_OPERATORS.$regex.compileElementSelector(                                                  // 374
                operand, subSelector));                                                                         // 375
          }                                                                                                     // 376
                                                                                                                // 377
          // XXX support {$exists: true}, $mod, $type, $in, $elemMatch                                          // 378
        });                                                                                                     // 379
        return;                                                                                                 // 380
      }                                                                                                         // 381
                                                                                                                // 382
      // OK, it's an equality thing.                                                                            // 383
      constraints.push(equalityElementMatcher(subSelector));                                                    // 384
    });                                                                                                         // 385
                                                                                                                // 386
    // It appears that the first sort field is treated differently from the                                     // 387
    // others; we shouldn't create a key filter unless the first sort field is                                  // 388
    // restricted, though after that point we can restrict the other sort fields                                // 389
    // or not as we wish.                                                                                       // 390
    if (_.isEmpty(constraintsByPath[self._sortSpecParts[0].path]))                                              // 391
      return;                                                                                                   // 392
                                                                                                                // 393
    self._keyFilter = function (key) {                                                                          // 394
      return _.all(self._sortSpecParts, function (specPart, index) {                                            // 395
        return _.all(constraintsByPath[specPart.path], function (f) {                                           // 396
          return f(key[index]);                                                                                 // 397
        });                                                                                                     // 398
      });                                                                                                       // 399
    };                                                                                                          // 400
  }                                                                                                             // 401
});                                                                                                             // 402
                                                                                                                // 403
// Given an array of comparators                                                                                // 404
// (functions (a,b)->(negative or positive or zero)), returns a single                                          // 405
// comparator which uses each comparator in order and returns the first                                         // 406
// non-zero value.                                                                                              // 407
var composeComparators = function (comparatorArray) {                                                           // 408
  return function (a, b) {                                                                                      // 409
    for (var i = 0; i < comparatorArray.length; ++i) {                                                          // 410
      var compare = comparatorArray[i](a, b);                                                                   // 411
      if (compare !== 0)                                                                                        // 412
        return compare;                                                                                         // 413
    }                                                                                                           // 414
    return 0;                                                                                                   // 415
  };                                                                                                            // 416
};                                                                                                              // 417
                                                                                                                // 418
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/minimongo/projection.js                                                                             //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
// Knows how to compile a fields projection to a predicate function.                                            // 1
// @returns - Function: a closure that filters out an object according to the                                   // 2
//            fields projection rules:                                                                          // 3
//            @param obj - Object: MongoDB-styled document                                                      // 4
//            @returns - Object: a document with the fields filtered out                                        // 5
//                       according to projection rules. Doesn't retain subfields                                // 6
//                       of passed argument.                                                                    // 7
LocalCollection._compileProjection = function (fields) {                                                        // 8
  LocalCollection._checkSupportedProjection(fields);                                                            // 9
                                                                                                                // 10
  var _idProjection = _.isUndefined(fields._id) ? true : fields._id;                                            // 11
  var details = projectionDetails(fields);                                                                      // 12
                                                                                                                // 13
  // returns transformed doc according to ruleTree                                                              // 14
  var transform = function (doc, ruleTree) {                                                                    // 15
    // Special case for "sets"                                                                                  // 16
    if (_.isArray(doc))                                                                                         // 17
      return _.map(doc, function (subdoc) { return transform(subdoc, ruleTree); });                             // 18
                                                                                                                // 19
    var res = details.including ? {} : EJSON.clone(doc);                                                        // 20
    _.each(ruleTree, function (rule, key) {                                                                     // 21
      if (!_.has(doc, key))                                                                                     // 22
        return;                                                                                                 // 23
      if (_.isObject(rule)) {                                                                                   // 24
        // For sub-objects/subsets we branch                                                                    // 25
        if (_.isObject(doc[key]))                                                                               // 26
          res[key] = transform(doc[key], rule);                                                                 // 27
        // Otherwise we don't even touch this subfield                                                          // 28
      } else if (details.including)                                                                             // 29
        res[key] = EJSON.clone(doc[key]);                                                                       // 30
      else                                                                                                      // 31
        delete res[key];                                                                                        // 32
    });                                                                                                         // 33
                                                                                                                // 34
    return res;                                                                                                 // 35
  };                                                                                                            // 36
                                                                                                                // 37
  return function (obj) {                                                                                       // 38
    var res = transform(obj, details.tree);                                                                     // 39
                                                                                                                // 40
    if (_idProjection && _.has(obj, '_id'))                                                                     // 41
      res._id = obj._id;                                                                                        // 42
    if (!_idProjection && _.has(res, '_id'))                                                                    // 43
      delete res._id;                                                                                           // 44
    return res;                                                                                                 // 45
  };                                                                                                            // 46
};                                                                                                              // 47
                                                                                                                // 48
// Traverses the keys of passed projection and constructs a tree where all                                      // 49
// leaves are either all True or all False                                                                      // 50
// @returns Object:                                                                                             // 51
//  - tree - Object - tree representation of keys involved in projection                                        // 52
//  (exception for '_id' as it is a special case handled separately)                                            // 53
//  - including - Boolean - "take only certain fields" type of projection                                       // 54
projectionDetails = function (fields) {                                                                         // 55
  // Find the non-_id keys (_id is handled specially because it is included unless                              // 56
  // explicitly excluded). Sort the keys, so that our code to detect overlaps                                   // 57
  // like 'foo' and 'foo.bar' can assume that 'foo' comes first.                                                // 58
  var fieldsKeys = _.keys(fields).sort();                                                                       // 59
                                                                                                                // 60
  // If _id is the only field in the projection, do not remove it, since it is                                  // 61
  // required to determine if this is an exclusion or exclusion. Also keep an                                   // 62
  // inclusive _id, since inclusive _id follows the normal rules about mixing                                   // 63
  // inclusive and exclusive fields. If _id is not the only field in the                                        // 64
  // projection and is exclusive, remove it so it can be handled later by a                                     // 65
  // special case, since exclusive _id is always allowed.                                                       // 66
  if (fieldsKeys.length > 0 &&                                                                                  // 67
      !(fieldsKeys.length === 1 && fieldsKeys[0] === '_id') &&                                                  // 68
      !(_.contains(fieldsKeys, '_id') && fields['_id']))                                                        // 69
    fieldsKeys = _.reject(fieldsKeys, function (key) { return key === '_id'; });                                // 70
                                                                                                                // 71
  var including = null; // Unknown                                                                              // 72
                                                                                                                // 73
  _.each(fieldsKeys, function (keyPath) {                                                                       // 74
    var rule = !!fields[keyPath];                                                                               // 75
    if (including === null)                                                                                     // 76
      including = rule;                                                                                         // 77
    if (including !== rule)                                                                                     // 78
      // This error message is copied from MongoDB shell                                                        // 79
      throw MinimongoError("You cannot currently mix including and excluding fields.");                         // 80
  });                                                                                                           // 81
                                                                                                                // 82
                                                                                                                // 83
  var projectionRulesTree = pathsToTree(                                                                        // 84
    fieldsKeys,                                                                                                 // 85
    function (path) { return including; },                                                                      // 86
    function (node, path, fullPath) {                                                                           // 87
      // Check passed projection fields' keys: If you have two rules such as                                    // 88
      // 'foo.bar' and 'foo.bar.baz', then the result becomes ambiguous. If                                     // 89
      // that happens, there is a probability you are doing something wrong,                                    // 90
      // framework should notify you about such mistake earlier on cursor                                       // 91
      // compilation step than later during runtime.  Note, that real mongo                                     // 92
      // doesn't do anything about it and the later rule appears in projection                                  // 93
      // project, more priority it takes.                                                                       // 94
      //                                                                                                        // 95
      // Example, assume following in mongo shell:                                                              // 96
      // > db.coll.insert({ a: { b: 23, c: 44 } })                                                              // 97
      // > db.coll.find({}, { 'a': 1, 'a.b': 1 })                                                               // 98
      // { "_id" : ObjectId("520bfe456024608e8ef24af3"), "a" : { "b" : 23 } }                                   // 99
      // > db.coll.find({}, { 'a.b': 1, 'a': 1 })                                                               // 100
      // { "_id" : ObjectId("520bfe456024608e8ef24af3"), "a" : { "b" : 23, "c" : 44 } }                         // 101
      //                                                                                                        // 102
      // Note, how second time the return set of keys is different.                                             // 103
                                                                                                                // 104
      var currentPath = fullPath;                                                                               // 105
      var anotherPath = path;                                                                                   // 106
      throw MinimongoError("both " + currentPath + " and " + anotherPath +                                      // 107
                           " found in fields option, using both of them may trigger " +                         // 108
                           "unexpected behavior. Did you mean to use only one of them?");                       // 109
    });                                                                                                         // 110
                                                                                                                // 111
  return {                                                                                                      // 112
    tree: projectionRulesTree,                                                                                  // 113
    including: including                                                                                        // 114
  };                                                                                                            // 115
};                                                                                                              // 116
                                                                                                                // 117
// paths - Array: list of mongo style paths                                                                     // 118
// newLeafFn - Function: of form function(path) should return a scalar value to                                 // 119
//                       put into list created for that path                                                    // 120
// conflictFn - Function: of form function(node, path, fullPath) is called                                      // 121
//                        when building a tree path for 'fullPath' node on                                      // 122
//                        'path' was already a leaf with a value. Must return a                                 // 123
//                        conflict resolution.                                                                  // 124
// initial tree - Optional Object: starting tree.                                                               // 125
// @returns - Object: tree represented as a set of nested objects                                               // 126
pathsToTree = function (paths, newLeafFn, conflictFn, tree) {                                                   // 127
  tree = tree || {};                                                                                            // 128
  _.each(paths, function (keyPath) {                                                                            // 129
    var treePos = tree;                                                                                         // 130
    var pathArr = keyPath.split('.');                                                                           // 131
                                                                                                                // 132
    // use _.all just for iteration with break                                                                  // 133
    var success = _.all(pathArr.slice(0, -1), function (key, idx) {                                             // 134
      if (!_.has(treePos, key))                                                                                 // 135
        treePos[key] = {};                                                                                      // 136
      else if (!_.isObject(treePos[key])) {                                                                     // 137
        treePos[key] = conflictFn(treePos[key],                                                                 // 138
                                  pathArr.slice(0, idx + 1).join('.'),                                          // 139
                                  keyPath);                                                                     // 140
        // break out of loop if we are failing for this path                                                    // 141
        if (!_.isObject(treePos[key]))                                                                          // 142
          return false;                                                                                         // 143
      }                                                                                                         // 144
                                                                                                                // 145
      treePos = treePos[key];                                                                                   // 146
      return true;                                                                                              // 147
    });                                                                                                         // 148
                                                                                                                // 149
    if (success) {                                                                                              // 150
      var lastKey = _.last(pathArr);                                                                            // 151
      if (!_.has(treePos, lastKey))                                                                             // 152
        treePos[lastKey] = newLeafFn(keyPath);                                                                  // 153
      else                                                                                                      // 154
        treePos[lastKey] = conflictFn(treePos[lastKey], keyPath, keyPath);                                      // 155
    }                                                                                                           // 156
  });                                                                                                           // 157
                                                                                                                // 158
  return tree;                                                                                                  // 159
};                                                                                                              // 160
                                                                                                                // 161
LocalCollection._checkSupportedProjection = function (fields) {                                                 // 162
  if (!_.isObject(fields) || _.isArray(fields))                                                                 // 163
    throw MinimongoError("fields option must be an object");                                                    // 164
                                                                                                                // 165
  _.each(fields, function (val, keyPath) {                                                                      // 166
    if (_.contains(keyPath.split('.'), '$'))                                                                    // 167
      throw MinimongoError("Minimongo doesn't support $ operator in projections yet.");                         // 168
    if (typeof val === 'object' && _.intersection(['$elemMatch', '$meta', '$slice'], _.keys(val)).length > 0)   // 169
      throw MinimongoError("Minimongo doesn't support operators in projections yet.");                          // 170
    if (_.indexOf([1, 0, true, false], val) === -1)                                                             // 171
      throw MinimongoError("Projection values should be one of 1, 0, true, or false");                          // 172
  });                                                                                                           // 173
};                                                                                                              // 174
                                                                                                                // 175
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/minimongo/modify.js                                                                                 //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
// XXX need a strategy for passing the binding of $ into this                                                   // 1
// function, from the compiled selector                                                                         // 2
//                                                                                                              // 3
// maybe just {key.up.to.just.before.dollarsign: array_index}                                                   // 4
//                                                                                                              // 5
// XXX atomicity: if one modification fails, do we roll back the whole                                          // 6
// change?                                                                                                      // 7
//                                                                                                              // 8
// options:                                                                                                     // 9
//   - isInsert is set when _modify is being called to compute the document to                                  // 10
//     insert as part of an upsert operation. We use this primarily to figure                                   // 11
//     out when to set the fields in $setOnInsert, if present.                                                  // 12
LocalCollection._modify = function (doc, mod, options) {                                                        // 13
  options = options || {};                                                                                      // 14
  if (!isPlainObject(mod))                                                                                      // 15
    throw MinimongoError("Modifier must be an object");                                                         // 16
                                                                                                                // 17
  // Make sure the caller can't mutate our data structures.                                                     // 18
  mod = EJSON.clone(mod);                                                                                       // 19
                                                                                                                // 20
  var isModifier = isOperatorObject(mod);                                                                       // 21
                                                                                                                // 22
  var newDoc;                                                                                                   // 23
                                                                                                                // 24
  if (!isModifier) {                                                                                            // 25
    if (mod._id && !EJSON.equals(doc._id, mod._id))                                                             // 26
      throw MinimongoError("Cannot change the _id of a document");                                              // 27
                                                                                                                // 28
    // replace the whole document                                                                               // 29
    for (var k in mod) {                                                                                        // 30
      if (/\./.test(k))                                                                                         // 31
        throw MinimongoError(                                                                                   // 32
          "When replacing document, field name may not contain '.'");                                           // 33
    }                                                                                                           // 34
    newDoc = mod;                                                                                               // 35
  } else {                                                                                                      // 36
    // apply modifiers to the doc.                                                                              // 37
    newDoc = EJSON.clone(doc);                                                                                  // 38
                                                                                                                // 39
    _.each(mod, function (operand, op) {                                                                        // 40
      var modFunc = MODIFIERS[op];                                                                              // 41
      // Treat $setOnInsert as $set if this is an insert.                                                       // 42
      if (options.isInsert && op === '$setOnInsert')                                                            // 43
        modFunc = MODIFIERS['$set'];                                                                            // 44
      if (!modFunc)                                                                                             // 45
        throw MinimongoError("Invalid modifier specified " + op);                                               // 46
      _.each(operand, function (arg, keypath) {                                                                 // 47
        if (keypath === '') {                                                                                   // 48
          throw MinimongoError("An empty update path is not valid.");                                           // 49
        }                                                                                                       // 50
                                                                                                                // 51
        if (keypath === '_id' && op !== '$setOnInsert') {                                                       // 52
          throw MinimongoError("Mod on _id not allowed");                                                       // 53
        }                                                                                                       // 54
                                                                                                                // 55
        var keyparts = keypath.split('.');                                                                      // 56
                                                                                                                // 57
        if (! _.all(keyparts, _.identity)) {                                                                    // 58
          throw MinimongoError(                                                                                 // 59
            "The update path '" + keypath +                                                                     // 60
              "' contains an empty field name, which is not allowed.");                                         // 61
        }                                                                                                       // 62
                                                                                                                // 63
        var noCreate = _.has(NO_CREATE_MODIFIERS, op);                                                          // 64
        var forbidArray = (op === "$rename");                                                                   // 65
        var target = findModTarget(newDoc, keyparts, {                                                          // 66
          noCreate: NO_CREATE_MODIFIERS[op],                                                                    // 67
          forbidArray: (op === "$rename"),                                                                      // 68
          arrayIndices: options.arrayIndices                                                                    // 69
        });                                                                                                     // 70
        var field = keyparts.pop();                                                                             // 71
        modFunc(target, field, arg, keypath, newDoc);                                                           // 72
      });                                                                                                       // 73
    });                                                                                                         // 74
  }                                                                                                             // 75
                                                                                                                // 76
  // move new document into place.                                                                              // 77
  _.each(_.keys(doc), function (k) {                                                                            // 78
    // Note: this used to be for (var k in doc) however, this does not                                          // 79
    // work right in Opera. Deleting from a doc while iterating over it                                         // 80
    // would sometimes cause opera to skip some keys.                                                           // 81
    if (k !== '_id')                                                                                            // 82
      delete doc[k];                                                                                            // 83
  });                                                                                                           // 84
  _.each(newDoc, function (v, k) {                                                                              // 85
    doc[k] = v;                                                                                                 // 86
  });                                                                                                           // 87
};                                                                                                              // 88
                                                                                                                // 89
// for a.b.c.2.d.e, keyparts should be ['a', 'b', 'c', '2', 'd', 'e'],                                          // 90
// and then you would operate on the 'e' property of the returned                                               // 91
// object.                                                                                                      // 92
//                                                                                                              // 93
// if options.noCreate is falsey, creates intermediate levels of                                                // 94
// structure as necessary, like mkdir -p (and raises an exception if                                            // 95
// that would mean giving a non-numeric property to an array.) if                                               // 96
// options.noCreate is true, return undefined instead.                                                          // 97
//                                                                                                              // 98
// may modify the last element of keyparts to signal to the caller that it needs                                // 99
// to use a different value to index into the returned object (for example,                                     // 100
// ['a', '01'] -> ['a', 1]).                                                                                    // 101
//                                                                                                              // 102
// if forbidArray is true, return null if the keypath goes through an array.                                    // 103
//                                                                                                              // 104
// if options.arrayIndices is set, use its first element for the (first) '$' in                                 // 105
// the path.                                                                                                    // 106
var findModTarget = function (doc, keyparts, options) {                                                         // 107
  options = options || {};                                                                                      // 108
  var usedArrayIndex = false;                                                                                   // 109
  for (var i = 0; i < keyparts.length; i++) {                                                                   // 110
    var last = (i === keyparts.length - 1);                                                                     // 111
    var keypart = keyparts[i];                                                                                  // 112
    var indexable = isIndexable(doc);                                                                           // 113
    if (!indexable) {                                                                                           // 114
      if (options.noCreate)                                                                                     // 115
        return undefined;                                                                                       // 116
      var e = MinimongoError(                                                                                   // 117
        "cannot use the part '" + keypart + "' to traverse " + doc);                                            // 118
      e.setPropertyError = true;                                                                                // 119
      throw e;                                                                                                  // 120
    }                                                                                                           // 121
    if (doc instanceof Array) {                                                                                 // 122
      if (options.forbidArray)                                                                                  // 123
        return null;                                                                                            // 124
      if (keypart === '$') {                                                                                    // 125
        if (usedArrayIndex)                                                                                     // 126
          throw MinimongoError("Too many positional (i.e. '$') elements");                                      // 127
        if (!options.arrayIndices || !options.arrayIndices.length) {                                            // 128
          throw MinimongoError("The positional operator did not find the " +                                    // 129
                               "match needed from the query");                                                  // 130
        }                                                                                                       // 131
        keypart = options.arrayIndices[0];                                                                      // 132
        usedArrayIndex = true;                                                                                  // 133
      } else if (isNumericKey(keypart)) {                                                                       // 134
        keypart = parseInt(keypart);                                                                            // 135
      } else {                                                                                                  // 136
        if (options.noCreate)                                                                                   // 137
          return undefined;                                                                                     // 138
        throw MinimongoError(                                                                                   // 139
          "can't append to array using string field name ["                                                     // 140
                    + keypart + "]");                                                                           // 141
      }                                                                                                         // 142
      if (last)                                                                                                 // 143
        // handle 'a.01'                                                                                        // 144
        keyparts[i] = keypart;                                                                                  // 145
      if (options.noCreate && keypart >= doc.length)                                                            // 146
        return undefined;                                                                                       // 147
      while (doc.length < keypart)                                                                              // 148
        doc.push(null);                                                                                         // 149
      if (!last) {                                                                                              // 150
        if (doc.length === keypart)                                                                             // 151
          doc.push({});                                                                                         // 152
        else if (typeof doc[keypart] !== "object")                                                              // 153
          throw MinimongoError("can't modify field '" + keyparts[i + 1] +                                       // 154
                      "' of list value " + JSON.stringify(doc[keypart]));                                       // 155
      }                                                                                                         // 156
    } else {                                                                                                    // 157
      if (keypart.length && keypart.substr(0, 1) === '$')                                                       // 158
        throw MinimongoError("can't set field named " + keypart);                                               // 159
      if (!(keypart in doc)) {                                                                                  // 160
        if (options.noCreate)                                                                                   // 161
          return undefined;                                                                                     // 162
        if (!last)                                                                                              // 163
          doc[keypart] = {};                                                                                    // 164
      }                                                                                                         // 165
    }                                                                                                           // 166
                                                                                                                // 167
    if (last)                                                                                                   // 168
      return doc;                                                                                               // 169
    doc = doc[keypart];                                                                                         // 170
  }                                                                                                             // 171
                                                                                                                // 172
  // notreached                                                                                                 // 173
};                                                                                                              // 174
                                                                                                                // 175
var NO_CREATE_MODIFIERS = {                                                                                     // 176
  $unset: true,                                                                                                 // 177
  $pop: true,                                                                                                   // 178
  $rename: true,                                                                                                // 179
  $pull: true,                                                                                                  // 180
  $pullAll: true                                                                                                // 181
};                                                                                                              // 182
                                                                                                                // 183
var MODIFIERS = {                                                                                               // 184
  $currentDate: function (target, field, arg) {                                                                 // 185
    if (typeof arg === "object" && arg.hasOwnProperty("$type")) {                                               // 186
       if (arg.$type !== "date") {                                                                              // 187
         throw MinimongoError("Minimongo does currently only support the date type in $currentDate modifiers");
       }                                                                                                        // 189
    } else if (arg !== true) {                                                                                  // 190
      throw MinimongoError("Invalid $currentDate modifier");                                                    // 191
    }                                                                                                           // 192
    target[field] = new Date();                                                                                 // 193
  },                                                                                                            // 194
  $min: function (target, field, arg) {                                                                         // 195
    if (typeof arg !== "number") {                                                                              // 196
      throw MinimongoError("Modifier $min allowed for numbers only");                                           // 197
    }                                                                                                           // 198
    if (field in target) {                                                                                      // 199
      if (typeof target[field] !== "number") {                                                                  // 200
        throw MinimongoError("Cannot apply $min modifier to non-number");                                       // 201
      }                                                                                                         // 202
      if (target[field] > arg) {                                                                                // 203
        target[field] = arg;                                                                                    // 204
      }                                                                                                         // 205
    } else {                                                                                                    // 206
      target[field] = arg;                                                                                      // 207
    }                                                                                                           // 208
  },                                                                                                            // 209
  $max: function (target, field, arg) {                                                                         // 210
    if (typeof arg !== "number") {                                                                              // 211
      throw MinimongoError("Modifier $max allowed for numbers only");                                           // 212
    }                                                                                                           // 213
    if (field in target) {                                                                                      // 214
      if (typeof target[field] !== "number") {                                                                  // 215
        throw MinimongoError("Cannot apply $max modifier to non-number");                                       // 216
      }                                                                                                         // 217
      if (target[field] < arg) {                                                                                // 218
         target[field] = arg;                                                                                   // 219
      }                                                                                                         // 220
    } else {                                                                                                    // 221
      target[field] = arg;                                                                                      // 222
    }                                                                                                           // 223
  },                                                                                                            // 224
  $inc: function (target, field, arg) {                                                                         // 225
    if (typeof arg !== "number")                                                                                // 226
      throw MinimongoError("Modifier $inc allowed for numbers only");                                           // 227
    if (field in target) {                                                                                      // 228
      if (typeof target[field] !== "number")                                                                    // 229
        throw MinimongoError("Cannot apply $inc modifier to non-number");                                       // 230
      target[field] += arg;                                                                                     // 231
    } else {                                                                                                    // 232
      target[field] = arg;                                                                                      // 233
    }                                                                                                           // 234
  },                                                                                                            // 235
  $set: function (target, field, arg) {                                                                         // 236
    if (!_.isObject(target)) { // not an array or an object                                                     // 237
      var e = MinimongoError("Cannot set property on non-object field");                                        // 238
      e.setPropertyError = true;                                                                                // 239
      throw e;                                                                                                  // 240
    }                                                                                                           // 241
    if (target === null) {                                                                                      // 242
      var e = MinimongoError("Cannot set property on null");                                                    // 243
      e.setPropertyError = true;                                                                                // 244
      throw e;                                                                                                  // 245
    }                                                                                                           // 246
    target[field] = arg;                                                                                        // 247
  },                                                                                                            // 248
  $setOnInsert: function (target, field, arg) {                                                                 // 249
    // converted to `$set` in `_modify`                                                                         // 250
  },                                                                                                            // 251
  $unset: function (target, field, arg) {                                                                       // 252
    if (target !== undefined) {                                                                                 // 253
      if (target instanceof Array) {                                                                            // 254
        if (field in target)                                                                                    // 255
          target[field] = null;                                                                                 // 256
      } else                                                                                                    // 257
        delete target[field];                                                                                   // 258
    }                                                                                                           // 259
  },                                                                                                            // 260
  $push: function (target, field, arg) {                                                                        // 261
    if (target[field] === undefined)                                                                            // 262
      target[field] = [];                                                                                       // 263
    if (!(target[field] instanceof Array))                                                                      // 264
      throw MinimongoError("Cannot apply $push modifier to non-array");                                         // 265
                                                                                                                // 266
    if (!(arg && arg.$each)) {                                                                                  // 267
      // Simple mode: not $each                                                                                 // 268
      target[field].push(arg);                                                                                  // 269
      return;                                                                                                   // 270
    }                                                                                                           // 271
                                                                                                                // 272
    // Fancy mode: $each (and maybe $slice and $sort and $position)                                             // 273
    var toPush = arg.$each;                                                                                     // 274
    if (!(toPush instanceof Array))                                                                             // 275
      throw MinimongoError("$each must be an array");                                                           // 276
                                                                                                                // 277
    // Parse $position                                                                                          // 278
    var position = undefined;                                                                                   // 279
    if ('$position' in arg) {                                                                                   // 280
      if (typeof arg.$position !== "number")                                                                    // 281
        throw MinimongoError("$position must be a numeric value");                                              // 282
      // XXX should check to make sure integer                                                                  // 283
      if (arg.$position < 0)                                                                                    // 284
        throw MinimongoError("$position in $push must be zero or positive");                                    // 285
      position = arg.$position;                                                                                 // 286
    }                                                                                                           // 287
                                                                                                                // 288
    // Parse $slice.                                                                                            // 289
    var slice = undefined;                                                                                      // 290
    if ('$slice' in arg) {                                                                                      // 291
      if (typeof arg.$slice !== "number")                                                                       // 292
        throw MinimongoError("$slice must be a numeric value");                                                 // 293
      // XXX should check to make sure integer                                                                  // 294
      if (arg.$slice > 0)                                                                                       // 295
        throw MinimongoError("$slice in $push must be zero or negative");                                       // 296
      slice = arg.$slice;                                                                                       // 297
    }                                                                                                           // 298
                                                                                                                // 299
    // Parse $sort.                                                                                             // 300
    var sortFunction = undefined;                                                                               // 301
    if (arg.$sort) {                                                                                            // 302
      if (slice === undefined)                                                                                  // 303
        throw MinimongoError("$sort requires $slice to be present");                                            // 304
      // XXX this allows us to use a $sort whose value is an array, but that's                                  // 305
      // actually an extension of the Node driver, so it won't work                                             // 306
      // server-side. Could be confusing!                                                                       // 307
      // XXX is it correct that we don't do geo-stuff here?                                                     // 308
      sortFunction = new Minimongo.Sorter(arg.$sort).getComparator();                                           // 309
      for (var i = 0; i < toPush.length; i++) {                                                                 // 310
        if (LocalCollection._f._type(toPush[i]) !== 3) {                                                        // 311
          throw MinimongoError("$push like modifiers using $sort " +                                            // 312
                      "require all elements to be objects");                                                    // 313
        }                                                                                                       // 314
      }                                                                                                         // 315
    }                                                                                                           // 316
                                                                                                                // 317
    // Actually push.                                                                                           // 318
    if (position === undefined) {                                                                               // 319
      for (var j = 0; j < toPush.length; j++)                                                                   // 320
        target[field].push(toPush[j]);                                                                          // 321
    } else {                                                                                                    // 322
      var spliceArguments = [position, 0];                                                                      // 323
      for (var j = 0; j < toPush.length; j++)                                                                   // 324
        spliceArguments.push(toPush[j]);                                                                        // 325
      Array.prototype.splice.apply(target[field], spliceArguments);                                             // 326
    }                                                                                                           // 327
                                                                                                                // 328
    // Actually sort.                                                                                           // 329
    if (sortFunction)                                                                                           // 330
      target[field].sort(sortFunction);                                                                         // 331
                                                                                                                // 332
    // Actually slice.                                                                                          // 333
    if (slice !== undefined) {                                                                                  // 334
      if (slice === 0)                                                                                          // 335
        target[field] = [];  // differs from Array.slice!                                                       // 336
      else                                                                                                      // 337
        target[field] = target[field].slice(slice);                                                             // 338
    }                                                                                                           // 339
  },                                                                                                            // 340
  $pushAll: function (target, field, arg) {                                                                     // 341
    if (!(typeof arg === "object" && arg instanceof Array))                                                     // 342
      throw MinimongoError("Modifier $pushAll/pullAll allowed for arrays only");                                // 343
    var x = target[field];                                                                                      // 344
    if (x === undefined)                                                                                        // 345
      target[field] = arg;                                                                                      // 346
    else if (!(x instanceof Array))                                                                             // 347
      throw MinimongoError("Cannot apply $pushAll modifier to non-array");                                      // 348
    else {                                                                                                      // 349
      for (var i = 0; i < arg.length; i++)                                                                      // 350
        x.push(arg[i]);                                                                                         // 351
    }                                                                                                           // 352
  },                                                                                                            // 353
  $addToSet: function (target, field, arg) {                                                                    // 354
    var isEach = false;                                                                                         // 355
    if (typeof arg === "object") {                                                                              // 356
      //check if first key is '$each'                                                                           // 357
      for (var k in arg) {                                                                                      // 358
        if (k === "$each")                                                                                      // 359
          isEach = true;                                                                                        // 360
        break;                                                                                                  // 361
      }                                                                                                         // 362
    }                                                                                                           // 363
    var values = isEach ? arg["$each"] : [arg];                                                                 // 364
    var x = target[field];                                                                                      // 365
    if (x === undefined)                                                                                        // 366
      target[field] = values;                                                                                   // 367
    else if (!(x instanceof Array))                                                                             // 368
      throw MinimongoError("Cannot apply $addToSet modifier to non-array");                                     // 369
    else {                                                                                                      // 370
      _.each(values, function (value) {                                                                         // 371
        for (var i = 0; i < x.length; i++)                                                                      // 372
          if (LocalCollection._f._equal(value, x[i]))                                                           // 373
            return;                                                                                             // 374
        x.push(value);                                                                                          // 375
      });                                                                                                       // 376
    }                                                                                                           // 377
  },                                                                                                            // 378
  $pop: function (target, field, arg) {                                                                         // 379
    if (target === undefined)                                                                                   // 380
      return;                                                                                                   // 381
    var x = target[field];                                                                                      // 382
    if (x === undefined)                                                                                        // 383
      return;                                                                                                   // 384
    else if (!(x instanceof Array))                                                                             // 385
      throw MinimongoError("Cannot apply $pop modifier to non-array");                                          // 386
    else {                                                                                                      // 387
      if (typeof arg === 'number' && arg < 0)                                                                   // 388
        x.splice(0, 1);                                                                                         // 389
      else                                                                                                      // 390
        x.pop();                                                                                                // 391
    }                                                                                                           // 392
  },                                                                                                            // 393
  $pull: function (target, field, arg) {                                                                        // 394
    if (target === undefined)                                                                                   // 395
      return;                                                                                                   // 396
    var x = target[field];                                                                                      // 397
    if (x === undefined)                                                                                        // 398
      return;                                                                                                   // 399
    else if (!(x instanceof Array))                                                                             // 400
      throw MinimongoError("Cannot apply $pull/pullAll modifier to non-array");                                 // 401
    else {                                                                                                      // 402
      var out = [];                                                                                             // 403
      if (arg != null && typeof arg === "object" && !(arg instanceof Array)) {                                  // 404
        // XXX would be much nicer to compile this once, rather than                                            // 405
        // for each document we modify.. but usually we're not                                                  // 406
        // modifying that many documents, so we'll let it slide for                                             // 407
        // now                                                                                                  // 408
                                                                                                                // 409
        // XXX Minimongo.Matcher isn't up for the job, because we need                                          // 410
        // to permit stuff like {$pull: {a: {$gt: 4}}}.. something                                              // 411
        // like {$gt: 4} is not normally a complete selector.                                                   // 412
        // same issue as $elemMatch possibly?                                                                   // 413
        var matcher = new Minimongo.Matcher(arg);                                                               // 414
        for (var i = 0; i < x.length; i++)                                                                      // 415
          if (!matcher.documentMatches(x[i]).result)                                                            // 416
            out.push(x[i]);                                                                                     // 417
      } else {                                                                                                  // 418
        for (var i = 0; i < x.length; i++)                                                                      // 419
          if (!LocalCollection._f._equal(x[i], arg))                                                            // 420
            out.push(x[i]);                                                                                     // 421
      }                                                                                                         // 422
      target[field] = out;                                                                                      // 423
    }                                                                                                           // 424
  },                                                                                                            // 425
  $pullAll: function (target, field, arg) {                                                                     // 426
    if (!(typeof arg === "object" && arg instanceof Array))                                                     // 427
      throw MinimongoError("Modifier $pushAll/pullAll allowed for arrays only");                                // 428
    if (target === undefined)                                                                                   // 429
      return;                                                                                                   // 430
    var x = target[field];                                                                                      // 431
    if (x === undefined)                                                                                        // 432
      return;                                                                                                   // 433
    else if (!(x instanceof Array))                                                                             // 434
      throw MinimongoError("Cannot apply $pull/pullAll modifier to non-array");                                 // 435
    else {                                                                                                      // 436
      var out = [];                                                                                             // 437
      for (var i = 0; i < x.length; i++) {                                                                      // 438
        var exclude = false;                                                                                    // 439
        for (var j = 0; j < arg.length; j++) {                                                                  // 440
          if (LocalCollection._f._equal(x[i], arg[j])) {                                                        // 441
            exclude = true;                                                                                     // 442
            break;                                                                                              // 443
          }                                                                                                     // 444
        }                                                                                                       // 445
        if (!exclude)                                                                                           // 446
          out.push(x[i]);                                                                                       // 447
      }                                                                                                         // 448
      target[field] = out;                                                                                      // 449
    }                                                                                                           // 450
  },                                                                                                            // 451
  $rename: function (target, field, arg, keypath, doc) {                                                        // 452
    if (keypath === arg)                                                                                        // 453
      // no idea why mongo has this restriction..                                                               // 454
      throw MinimongoError("$rename source must differ from target");                                           // 455
    if (target === null)                                                                                        // 456
      throw MinimongoError("$rename source field invalid");                                                     // 457
    if (typeof arg !== "string")                                                                                // 458
      throw MinimongoError("$rename target must be a string");                                                  // 459
    if (target === undefined)                                                                                   // 460
      return;                                                                                                   // 461
    var v = target[field];                                                                                      // 462
    delete target[field];                                                                                       // 463
                                                                                                                // 464
    var keyparts = arg.split('.');                                                                              // 465
    var target2 = findModTarget(doc, keyparts, {forbidArray: true});                                            // 466
    if (target2 === null)                                                                                       // 467
      throw MinimongoError("$rename target field invalid");                                                     // 468
    var field2 = keyparts.pop();                                                                                // 469
    target2[field2] = v;                                                                                        // 470
  },                                                                                                            // 471
  $bit: function (target, field, arg) {                                                                         // 472
    // XXX mongo only supports $bit on integers, and we only support                                            // 473
    // native javascript numbers (doubles) so far, so we can't support $bit                                     // 474
    throw MinimongoError("$bit is not supported");                                                              // 475
  }                                                                                                             // 476
};                                                                                                              // 477
                                                                                                                // 478
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/minimongo/diff.js                                                                                   //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
// ordered: bool.                                                                                               // 1
// old_results and new_results: collections of documents.                                                       // 2
//    if ordered, they are arrays.                                                                              // 3
//    if unordered, they are IdMaps                                                                             // 4
LocalCollection._diffQueryChanges = function (ordered, oldResults, newResults, observer, options) {             // 5
  return DiffSequence.diffQueryChanges(ordered, oldResults, newResults, observer, options);                     // 6
};                                                                                                              // 7
                                                                                                                // 8
LocalCollection._diffQueryUnorderedChanges = function (oldResults, newResults, observer, options) {             // 9
  return DiffSequence.diffQueryUnorderedChanges(oldResults, newResults, observer, options);                     // 10
};                                                                                                              // 11
                                                                                                                // 12
                                                                                                                // 13
LocalCollection._diffQueryOrderedChanges =                                                                      // 14
  function (oldResults, newResults, observer, options) {                                                        // 15
  return DiffSequence.diffQueryOrderedChanges(oldResults, newResults, observer, options);                       // 16
};                                                                                                              // 17
                                                                                                                // 18
LocalCollection._diffObjects = function (left, right, callbacks) {                                              // 19
  return DiffSequence.diffObjects(left, right, callbacks);                                                      // 20
};                                                                                                              // 21
                                                                                                                // 22
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/minimongo/id_map.js                                                                                 //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
LocalCollection._IdMap = function () {                                                                          // 1
  var self = this;                                                                                              // 2
  IdMap.call(self, MongoID.idStringify, MongoID.idParse);                                                       // 3
};                                                                                                              // 4
                                                                                                                // 5
Meteor._inherits(LocalCollection._IdMap, IdMap);                                                                // 6
                                                                                                                // 7
                                                                                                                // 8
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/minimongo/observe.js                                                                                //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
// XXX maybe move these into another ObserveHelpers package or something                                        // 1
                                                                                                                // 2
// _CachingChangeObserver is an object which receives observeChanges callbacks                                  // 3
// and keeps a cache of the current cursor state up to date in self.docs. Users                                 // 4
// of this class should read the docs field but not modify it. You should pass                                  // 5
// the "applyChange" field as the callbacks to the underlying observeChanges                                    // 6
// call. Optionally, you can specify your own observeChanges callbacks which are                                // 7
// invoked immediately before the docs field is updated; this object is made                                    // 8
// available as `this` to those callbacks.                                                                      // 9
LocalCollection._CachingChangeObserver = function (options) {                                                   // 10
  var self = this;                                                                                              // 11
  options = options || {};                                                                                      // 12
                                                                                                                // 13
  var orderedFromCallbacks = options.callbacks &&                                                               // 14
        LocalCollection._observeChangesCallbacksAreOrdered(options.callbacks);                                  // 15
  if (_.has(options, 'ordered')) {                                                                              // 16
    self.ordered = options.ordered;                                                                             // 17
    if (options.callbacks && options.ordered !== orderedFromCallbacks)                                          // 18
      throw Error("ordered option doesn't match callbacks");                                                    // 19
  } else if (options.callbacks) {                                                                               // 20
    self.ordered = orderedFromCallbacks;                                                                        // 21
  } else {                                                                                                      // 22
    throw Error("must provide ordered or callbacks");                                                           // 23
  }                                                                                                             // 24
  var callbacks = options.callbacks || {};                                                                      // 25
                                                                                                                // 26
  if (self.ordered) {                                                                                           // 27
    self.docs = new OrderedDict(MongoID.idStringify);                                                           // 28
    self.applyChange = {                                                                                        // 29
      addedBefore: function (id, fields, before) {                                                              // 30
        var doc = EJSON.clone(fields);                                                                          // 31
        doc._id = id;                                                                                           // 32
        callbacks.addedBefore && callbacks.addedBefore.call(                                                    // 33
          self, id, fields, before);                                                                            // 34
        // This line triggers if we provide added with movedBefore.                                             // 35
        callbacks.added && callbacks.added.call(self, id, fields);                                              // 36
        // XXX could `before` be a falsy ID?  Technically                                                       // 37
        // idStringify seems to allow for them -- though                                                        // 38
        // OrderedDict won't call stringify on a falsy arg.                                                     // 39
        self.docs.putBefore(id, doc, before || null);                                                           // 40
      },                                                                                                        // 41
      movedBefore: function (id, before) {                                                                      // 42
        var doc = self.docs.get(id);                                                                            // 43
        callbacks.movedBefore && callbacks.movedBefore.call(self, id, before);                                  // 44
        self.docs.moveBefore(id, before || null);                                                               // 45
      }                                                                                                         // 46
    };                                                                                                          // 47
  } else {                                                                                                      // 48
    self.docs = new LocalCollection._IdMap;                                                                     // 49
    self.applyChange = {                                                                                        // 50
      added: function (id, fields) {                                                                            // 51
        var doc = EJSON.clone(fields);                                                                          // 52
        callbacks.added && callbacks.added.call(self, id, fields);                                              // 53
        doc._id = id;                                                                                           // 54
        self.docs.set(id,  doc);                                                                                // 55
      }                                                                                                         // 56
    };                                                                                                          // 57
  }                                                                                                             // 58
                                                                                                                // 59
  // The methods in _IdMap and OrderedDict used by these callbacks are                                          // 60
  // identical.                                                                                                 // 61
  self.applyChange.changed = function (id, fields) {                                                            // 62
    var doc = self.docs.get(id);                                                                                // 63
    if (!doc)                                                                                                   // 64
      throw new Error("Unknown id for changed: " + id);                                                         // 65
    callbacks.changed && callbacks.changed.call(                                                                // 66
      self, id, EJSON.clone(fields));                                                                           // 67
    DiffSequence.applyChanges(doc, fields);                                                                     // 68
  };                                                                                                            // 69
  self.applyChange.removed = function (id) {                                                                    // 70
    callbacks.removed && callbacks.removed.call(self, id);                                                      // 71
    self.docs.remove(id);                                                                                       // 72
  };                                                                                                            // 73
};                                                                                                              // 74
                                                                                                                // 75
LocalCollection._observeFromObserveChanges = function (cursor, observeCallbacks) {                              // 76
  var transform = cursor.getTransform() || function (doc) {return doc;};                                        // 77
  var suppressed = !!observeCallbacks._suppress_initial;                                                        // 78
                                                                                                                // 79
  var observeChangesCallbacks;                                                                                  // 80
  if (LocalCollection._observeCallbacksAreOrdered(observeCallbacks)) {                                          // 81
    // The "_no_indices" option sets all index arguments to -1 and skips the                                    // 82
    // linear scans required to generate them.  This lets observers that don't                                  // 83
    // need absolute indices benefit from the other features of this API --                                     // 84
    // relative order, transforms, and applyChanges -- without the speed hit.                                   // 85
    var indices = !observeCallbacks._no_indices;                                                                // 86
    observeChangesCallbacks = {                                                                                 // 87
      addedBefore: function (id, fields, before) {                                                              // 88
        var self = this;                                                                                        // 89
        if (suppressed || !(observeCallbacks.addedAt || observeCallbacks.added))                                // 90
          return;                                                                                               // 91
        var doc = transform(_.extend(fields, {_id: id}));                                                       // 92
        if (observeCallbacks.addedAt) {                                                                         // 93
          var index = indices                                                                                   // 94
                ? (before ? self.docs.indexOf(before) : self.docs.size()) : -1;                                 // 95
          observeCallbacks.addedAt(doc, index, before);                                                         // 96
        } else {                                                                                                // 97
          observeCallbacks.added(doc);                                                                          // 98
        }                                                                                                       // 99
      },                                                                                                        // 100
      changed: function (id, fields) {                                                                          // 101
        var self = this;                                                                                        // 102
        if (!(observeCallbacks.changedAt || observeCallbacks.changed))                                          // 103
          return;                                                                                               // 104
        var doc = EJSON.clone(self.docs.get(id));                                                               // 105
        if (!doc)                                                                                               // 106
          throw new Error("Unknown id for changed: " + id);                                                     // 107
        var oldDoc = transform(EJSON.clone(doc));                                                               // 108
        DiffSequence.applyChanges(doc, fields);                                                                 // 109
        doc = transform(doc);                                                                                   // 110
        if (observeCallbacks.changedAt) {                                                                       // 111
          var index = indices ? self.docs.indexOf(id) : -1;                                                     // 112
          observeCallbacks.changedAt(doc, oldDoc, index);                                                       // 113
        } else {                                                                                                // 114
          observeCallbacks.changed(doc, oldDoc);                                                                // 115
        }                                                                                                       // 116
      },                                                                                                        // 117
      movedBefore: function (id, before) {                                                                      // 118
        var self = this;                                                                                        // 119
        if (!observeCallbacks.movedTo)                                                                          // 120
          return;                                                                                               // 121
        var from = indices ? self.docs.indexOf(id) : -1;                                                        // 122
                                                                                                                // 123
        var to = indices                                                                                        // 124
              ? (before ? self.docs.indexOf(before) : self.docs.size()) : -1;                                   // 125
        // When not moving backwards, adjust for the fact that removing the                                     // 126
        // document slides everything back one slot.                                                            // 127
        if (to > from)                                                                                          // 128
          --to;                                                                                                 // 129
        observeCallbacks.movedTo(transform(EJSON.clone(self.docs.get(id))),                                     // 130
                                 from, to, before || null);                                                     // 131
      },                                                                                                        // 132
      removed: function (id) {                                                                                  // 133
        var self = this;                                                                                        // 134
        if (!(observeCallbacks.removedAt || observeCallbacks.removed))                                          // 135
          return;                                                                                               // 136
        // technically maybe there should be an EJSON.clone here, but it's about                                // 137
        // to be removed from self.docs!                                                                        // 138
        var doc = transform(self.docs.get(id));                                                                 // 139
        if (observeCallbacks.removedAt) {                                                                       // 140
          var index = indices ? self.docs.indexOf(id) : -1;                                                     // 141
          observeCallbacks.removedAt(doc, index);                                                               // 142
        } else {                                                                                                // 143
          observeCallbacks.removed(doc);                                                                        // 144
        }                                                                                                       // 145
      }                                                                                                         // 146
    };                                                                                                          // 147
  } else {                                                                                                      // 148
    observeChangesCallbacks = {                                                                                 // 149
      added: function (id, fields) {                                                                            // 150
        if (!suppressed && observeCallbacks.added) {                                                            // 151
          var doc = _.extend(fields, {_id:  id});                                                               // 152
          observeCallbacks.added(transform(doc));                                                               // 153
        }                                                                                                       // 154
      },                                                                                                        // 155
      changed: function (id, fields) {                                                                          // 156
        var self = this;                                                                                        // 157
        if (observeCallbacks.changed) {                                                                         // 158
          var oldDoc = self.docs.get(id);                                                                       // 159
          var doc = EJSON.clone(oldDoc);                                                                        // 160
          DiffSequence.applyChanges(doc, fields);                                                               // 161
          observeCallbacks.changed(transform(doc),                                                              // 162
                                   transform(EJSON.clone(oldDoc)));                                             // 163
        }                                                                                                       // 164
      },                                                                                                        // 165
      removed: function (id) {                                                                                  // 166
        var self = this;                                                                                        // 167
        if (observeCallbacks.removed) {                                                                         // 168
          observeCallbacks.removed(transform(self.docs.get(id)));                                               // 169
        }                                                                                                       // 170
      }                                                                                                         // 171
    };                                                                                                          // 172
  }                                                                                                             // 173
                                                                                                                // 174
  var changeObserver = new LocalCollection._CachingChangeObserver(                                              // 175
    {callbacks: observeChangesCallbacks});                                                                      // 176
  var handle = cursor.observeChanges(changeObserver.applyChange);                                               // 177
  suppressed = false;                                                                                           // 178
                                                                                                                // 179
  return handle;                                                                                                // 180
};                                                                                                              // 181
                                                                                                                // 182
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/minimongo/objectid.js                                                                               //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
// Is this selector just shorthand for lookup by _id?                                                           // 1
LocalCollection._selectorIsId = function (selector) {                                                           // 2
  return (typeof selector === "string") ||                                                                      // 3
    (typeof selector === "number") ||                                                                           // 4
    selector instanceof MongoID.ObjectID;                                                                       // 5
};                                                                                                              // 6
                                                                                                                // 7
// Is the selector just lookup by _id (shorthand or not)?                                                       // 8
LocalCollection._selectorIsIdPerhapsAsObject = function (selector) {                                            // 9
  return LocalCollection._selectorIsId(selector) ||                                                             // 10
    (selector && typeof selector === "object" &&                                                                // 11
     selector._id && LocalCollection._selectorIsId(selector._id) &&                                             // 12
     _.size(selector) === 1);                                                                                   // 13
};                                                                                                              // 14
                                                                                                                // 15
// If this is a selector which explicitly constrains the match by ID to a finite                                // 16
// number of documents, returns a list of their IDs.  Otherwise returns                                         // 17
// null. Note that the selector may have other restrictions so it may not even                                  // 18
// match those document!  We care about $in and $and since those are generated                                  // 19
// access-controlled update and remove.                                                                         // 20
LocalCollection._idsMatchedBySelector = function (selector) {                                                   // 21
  // Is the selector just an ID?                                                                                // 22
  if (LocalCollection._selectorIsId(selector))                                                                  // 23
    return [selector];                                                                                          // 24
  if (!selector)                                                                                                // 25
    return null;                                                                                                // 26
                                                                                                                // 27
  // Do we have an _id clause?                                                                                  // 28
  if (_.has(selector, '_id')) {                                                                                 // 29
    // Is the _id clause just an ID?                                                                            // 30
    if (LocalCollection._selectorIsId(selector._id))                                                            // 31
      return [selector._id];                                                                                    // 32
    // Is the _id clause {_id: {$in: ["x", "y", "z"]}}?                                                         // 33
    if (selector._id && selector._id.$in                                                                        // 34
        && _.isArray(selector._id.$in)                                                                          // 35
        && !_.isEmpty(selector._id.$in)                                                                         // 36
        && _.all(selector._id.$in, LocalCollection._selectorIsId)) {                                            // 37
      return selector._id.$in;                                                                                  // 38
    }                                                                                                           // 39
    return null;                                                                                                // 40
  }                                                                                                             // 41
                                                                                                                // 42
  // If this is a top-level $and, and any of the clauses constrain their                                        // 43
  // documents, then the whole selector is constrained by any one clause's                                      // 44
  // constraint. (Well, by their intersection, but that seems unlikely.)                                        // 45
  if (selector.$and && _.isArray(selector.$and)) {                                                              // 46
    for (var i = 0; i < selector.$and.length; ++i) {                                                            // 47
      var subIds = LocalCollection._idsMatchedBySelector(selector.$and[i]);                                     // 48
      if (subIds)                                                                                               // 49
        return subIds;                                                                                          // 50
    }                                                                                                           // 51
  }                                                                                                             // 52
                                                                                                                // 53
  return null;                                                                                                  // 54
};                                                                                                              // 55
                                                                                                                // 56
                                                                                                                // 57
                                                                                                                // 58
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package.minimongo = {}, {
  LocalCollection: LocalCollection,
  Minimongo: Minimongo,
  MinimongoTest: MinimongoTest
});

})();

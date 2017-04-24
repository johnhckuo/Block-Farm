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
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var EJSON = Package.ejson.EJSON;

/* Package-scope variables */
var ReactiveDict;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                             //
// packages/reactive-dict/packages/reactive-dict.js                                            //
//                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                               //
(function () {                                                                                 // 1
                                                                                               // 2
//////////////////////////////////////////////////////////////////////////////////////////     // 3
//                                                                                      //     // 4
// packages/reactive-dict/reactive-dict.js                                              //     // 5
//                                                                                      //     // 6
//////////////////////////////////////////////////////////////////////////////////////////     // 7
                                                                                        //     // 8
// XXX come up with a serialization method which canonicalizes object key               // 1   // 9
// order, which would allow us to use objects as values for equals.                     // 2   // 10
var stringify = function (value) {                                                      // 3   // 11
  if (value === undefined)                                                              // 4   // 12
    return 'undefined';                                                                 // 5   // 13
  return EJSON.stringify(value);                                                        // 6   // 14
};                                                                                      // 7   // 15
var parse = function (serialized) {                                                     // 8   // 16
  if (serialized === undefined || serialized === 'undefined')                           // 9   // 17
    return undefined;                                                                   // 10  // 18
  return EJSON.parse(serialized);                                                       // 11  // 19
};                                                                                      // 12  // 20
                                                                                        // 13  // 21
// XXX COMPAT WITH 0.9.1 : accept migrationData instead of dictName                     // 14  // 22
ReactiveDict = function (dictName) {                                                    // 15  // 23
  // this.keys: key -> value                                                            // 16  // 24
  if (dictName) {                                                                       // 17  // 25
    if (typeof dictName === 'string') {                                                 // 18  // 26
      // the normal case, argument is a string name.                                    // 19  // 27
      // _registerDictForMigrate will throw an error on duplicate name.                 // 20  // 28
      ReactiveDict._registerDictForMigrate(dictName, this);                             // 21  // 29
      this.keys = ReactiveDict._loadMigratedDict(dictName) || {};                       // 22  // 30
    } else if (typeof dictName === 'object') {                                          // 23  // 31
      // back-compat case: dictName is actually migrationData                           // 24  // 32
      this.keys = dictName;                                                             // 25  // 33
    } else {                                                                            // 26  // 34
      throw new Error("Invalid ReactiveDict argument: " + dictName);                    // 27  // 35
    }                                                                                   // 28  // 36
  } else {                                                                              // 29  // 37
    // no name given; no migration will be performed                                    // 30  // 38
    this.keys = {};                                                                     // 31  // 39
  }                                                                                     // 32  // 40
                                                                                        // 33  // 41
  this.keyDeps = {}; // key -> Dependency                                               // 34  // 42
  this.keyValueDeps = {}; // key -> Dependency                                          // 35  // 43
};                                                                                      // 36  // 44
                                                                                        // 37  // 45
_.extend(ReactiveDict.prototype, {                                                      // 38  // 46
  set: function (key, value) {                                                          // 39  // 47
    var self = this;                                                                    // 40  // 48
                                                                                        // 41  // 49
    value = stringify(value);                                                           // 42  // 50
                                                                                        // 43  // 51
    var oldSerializedValue = 'undefined';                                               // 44  // 52
    if (_.has(self.keys, key)) oldSerializedValue = self.keys[key];                     // 45  // 53
    if (value === oldSerializedValue)                                                   // 46  // 54
      return;                                                                           // 47  // 55
    self.keys[key] = value;                                                             // 48  // 56
                                                                                        // 49  // 57
    var changed = function (v) {                                                        // 50  // 58
      v && v.changed();                                                                 // 51  // 59
    };                                                                                  // 52  // 60
                                                                                        // 53  // 61
    changed(self.keyDeps[key]);                                                         // 54  // 62
    if (self.keyValueDeps[key]) {                                                       // 55  // 63
      changed(self.keyValueDeps[key][oldSerializedValue]);                              // 56  // 64
      changed(self.keyValueDeps[key][value]);                                           // 57  // 65
    }                                                                                   // 58  // 66
  },                                                                                    // 59  // 67
                                                                                        // 60  // 68
  setDefault: function (key, value) {                                                   // 61  // 69
    var self = this;                                                                    // 62  // 70
    // for now, explicitly check for undefined, since there is no                       // 63  // 71
    // ReactiveDict.clear().  Later we might have a ReactiveDict.clear(), in which case // 64  // 72
    // we should check if it has the key.                                               // 65  // 73
    if (self.keys[key] === undefined) {                                                 // 66  // 74
      self.set(key, value);                                                             // 67  // 75
    }                                                                                   // 68  // 76
  },                                                                                    // 69  // 77
                                                                                        // 70  // 78
  get: function (key) {                                                                 // 71  // 79
    var self = this;                                                                    // 72  // 80
    self._ensureKey(key);                                                               // 73  // 81
    self.keyDeps[key].depend();                                                         // 74  // 82
    return parse(self.keys[key]);                                                       // 75  // 83
  },                                                                                    // 76  // 84
                                                                                        // 77  // 85
  equals: function (key, value) {                                                       // 78  // 86
    var self = this;                                                                    // 79  // 87
                                                                                        // 80  // 88
    // Mongo.ObjectID is in the 'mongo' package                                         // 81  // 89
    var ObjectID = null;                                                                // 82  // 90
    if (typeof Mongo !== 'undefined') {                                                 // 83  // 91
      ObjectID = Mongo.ObjectID;                                                        // 84  // 92
    }                                                                                   // 85  // 93
                                                                                        // 86  // 94
    // We don't allow objects (or arrays that might include objects) for                // 87  // 95
    // .equals, because JSON.stringify doesn't canonicalize object key                  // 88  // 96
    // order. (We can make equals have the right return value by parsing the            // 89  // 97
    // current value and using EJSON.equals, but we won't have a canonical              // 90  // 98
    // element of keyValueDeps[key] to store the dependency.) You can still use         // 91  // 99
    // "EJSON.equals(reactiveDict.get(key), value)".                                    // 92  // 100
    //                                                                                  // 93  // 101
    // XXX we could allow arrays as long as we recursively check that there             // 94  // 102
    // are no objects                                                                   // 95  // 103
    if (typeof value !== 'string' &&                                                    // 96  // 104
        typeof value !== 'number' &&                                                    // 97  // 105
        typeof value !== 'boolean' &&                                                   // 98  // 106
        typeof value !== 'undefined' &&                                                 // 99  // 107
        !(value instanceof Date) &&                                                     // 100
        !(ObjectID && value instanceof ObjectID) &&                                     // 101
        value !== null)                                                                 // 102
      throw new Error("ReactiveDict.equals: value must be scalar");                     // 103
    var serializedValue = stringify(value);                                             // 104
                                                                                        // 105
    if (Tracker.active) {                                                               // 106
      self._ensureKey(key);                                                             // 107
                                                                                        // 108
      if (! _.has(self.keyValueDeps[key], serializedValue))                             // 109
        self.keyValueDeps[key][serializedValue] = new Tracker.Dependency;               // 110
                                                                                        // 111
      var isNew = self.keyValueDeps[key][serializedValue].depend();                     // 112
      if (isNew) {                                                                      // 113
        Tracker.onInvalidate(function () {                                              // 114
          // clean up [key][serializedValue] if it's now empty, so we don't             // 115
          // use O(n) memory for n = values seen ever                                   // 116
          if (! self.keyValueDeps[key][serializedValue].hasDependents())                // 117
            delete self.keyValueDeps[key][serializedValue];                             // 118
        });                                                                             // 119
      }                                                                                 // 120
    }                                                                                   // 121
                                                                                        // 122
    var oldValue = undefined;                                                           // 123
    if (_.has(self.keys, key)) oldValue = parse(self.keys[key]);                        // 124
    return EJSON.equals(oldValue, value);                                               // 125
  },                                                                                    // 126
                                                                                        // 127
  _ensureKey: function (key) {                                                          // 128
    var self = this;                                                                    // 129
    if (!(key in self.keyDeps)) {                                                       // 130
      self.keyDeps[key] = new Tracker.Dependency;                                       // 131
      self.keyValueDeps[key] = {};                                                      // 132
    }                                                                                   // 133
  },                                                                                    // 134
                                                                                        // 135
  // Get a JSON value that can be passed to the constructor to                          // 136
  // create a new ReactiveDict with the same contents as this one                       // 137
  _getMigrationData: function () {                                                      // 138
    // XXX sanitize and make sure it's JSONible?                                        // 139
    return this.keys;                                                                   // 140
  }                                                                                     // 141
});                                                                                     // 142
                                                                                        // 143
//////////////////////////////////////////////////////////////////////////////////////////     // 152
                                                                                               // 153
}).call(this);                                                                                 // 154
                                                                                               // 155
                                                                                               // 156
                                                                                               // 157
                                                                                               // 158
                                                                                               // 159
                                                                                               // 160
(function () {                                                                                 // 161
                                                                                               // 162
//////////////////////////////////////////////////////////////////////////////////////////     // 163
//                                                                                      //     // 164
// packages/reactive-dict/migration.js                                                  //     // 165
//                                                                                      //     // 166
//////////////////////////////////////////////////////////////////////////////////////////     // 167
                                                                                        //     // 168
ReactiveDict._migratedDictData = {}; // name -> data                                    // 1   // 169
ReactiveDict._dictsToMigrate = {}; // name -> ReactiveDict                              // 2   // 170
                                                                                        // 3   // 171
ReactiveDict._loadMigratedDict = function (dictName) {                                  // 4   // 172
  if (_.has(ReactiveDict._migratedDictData, dictName))                                  // 5   // 173
    return ReactiveDict._migratedDictData[dictName];                                    // 6   // 174
                                                                                        // 7   // 175
  return null;                                                                          // 8   // 176
};                                                                                      // 9   // 177
                                                                                        // 10  // 178
ReactiveDict._registerDictForMigrate = function (dictName, dict) {                      // 11  // 179
  if (_.has(ReactiveDict._dictsToMigrate, dictName))                                    // 12  // 180
    throw new Error("Duplicate ReactiveDict name: " + dictName);                        // 13  // 181
                                                                                        // 14  // 182
  ReactiveDict._dictsToMigrate[dictName] = dict;                                        // 15  // 183
};                                                                                      // 16  // 184
                                                                                        // 17  // 185
if (Meteor.isClient && Package.reload) {                                                // 18  // 186
  // Put old migrated data into ReactiveDict._migratedDictData,                         // 19  // 187
  // where it can be accessed by ReactiveDict._loadMigratedDict.                        // 20  // 188
  var migrationData = Package.reload.Reload._migrationData('reactive-dict');            // 21  // 189
  if (migrationData && migrationData.dicts)                                             // 22  // 190
    ReactiveDict._migratedDictData = migrationData.dicts;                               // 23  // 191
                                                                                        // 24  // 192
  // On migration, assemble the data from all the dicts that have been                  // 25  // 193
  // registered.                                                                        // 26  // 194
  Package.reload.Reload._onMigrate('reactive-dict', function () {                       // 27  // 195
    var dictsToMigrate = ReactiveDict._dictsToMigrate;                                  // 28  // 196
    var dataToMigrate = {};                                                             // 29  // 197
                                                                                        // 30  // 198
    for (var dictName in dictsToMigrate)                                                // 31  // 199
      dataToMigrate[dictName] = dictsToMigrate[dictName]._getMigrationData();           // 32  // 200
                                                                                        // 33  // 201
    return [true, {dicts: dataToMigrate}];                                              // 34  // 202
  });                                                                                   // 35  // 203
}                                                                                       // 36  // 204
                                                                                        // 37  // 205
//////////////////////////////////////////////////////////////////////////////////////////     // 206
                                                                                               // 207
}).call(this);                                                                                 // 208
                                                                                               // 209
/////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['reactive-dict'] = {}, {
  ReactiveDict: ReactiveDict
});

})();

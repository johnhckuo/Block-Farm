var require = meteorInstall({"client":{"game.html":["./template.game.js",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/game.html                                                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.exports = require("./template.game.js");                                                                        // 1
                                                                                                                       // 2
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"template.game.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/template.game.js                                                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
                                                                                                                       // 1
Template.__checkName("gameIndex");                                                                                     // 2
Template["gameIndex"] = new Template("Template.gameIndex", (function() {                                               // 3
  var view = this;                                                                                                     // 4
  return HTML.DIV({                                                                                                    // 5
    class: "gameContainer"                                                                                             // 6
  }, "\n    ", Spacebars.include(view.lookupTemplate("statusList")), "\n    ", Spacebars.include(view.lookupTemplate("gamingArea")), "\n    ", Spacebars.include(view.lookupTemplate("shop")), "\n    ", Spacebars.include(view.lookupTemplate("mission")), "\n  ");
}));                                                                                                                   // 8
                                                                                                                       // 9
Template.__checkName("crop");                                                                                          // 10
Template["crop"] = new Template("Template.crop", (function() {                                                         // 11
  var view = this;                                                                                                     // 12
  return HTML.DIV({                                                                                                    // 13
    class: function() {                                                                                                // 14
      return Spacebars.mustache(view.lookup("name"));                                                                  // 15
    }                                                                                                                  // 16
  }, "\n        ", HTML.IMG({                                                                                          // 17
    src: function() {                                                                                                  // 18
      return Spacebars.mustache(view.lookup("img"));                                                                   // 19
    },                                                                                                                 // 20
    alt: ""                                                                                                            // 21
  }), "\n        ", HTML.DIV({                                                                                         // 22
    class: "cropContent"                                                                                               // 23
  }, "\n          ", Blaze.View("lookup:content", function() {                                                         // 24
    return Spacebars.mustache(view.lookup("content"));                                                                 // 25
  }), "\n        "), HTML.Raw('\n        <button class="btn btn-primary plantButton" data-pressed="false">Specify</button>\n    '));
}));                                                                                                                   // 27
                                                                                                                       // 28
Template.__checkName("land");                                                                                          // 29
Template["land"] = new Template("Template.land", (function() {                                                         // 30
  var view = this;                                                                                                     // 31
  return HTML.DIV({                                                                                                    // 32
    class: function() {                                                                                                // 33
      return Spacebars.mustache(view.lookup("name"));                                                                  // 34
    }                                                                                                                  // 35
  }, "\n        ", HTML.IMG({                                                                                          // 36
    src: function() {                                                                                                  // 37
      return Spacebars.mustache(view.lookup("img"));                                                                   // 38
    },                                                                                                                 // 39
    alt: ""                                                                                                            // 40
  }), "\n        ", HTML.DIV({                                                                                         // 41
    class: "landContent"                                                                                               // 42
  }, "\n          ", Blaze.View("lookup:content", function() {                                                         // 43
    return Spacebars.mustache(view.lookup("content"));                                                                 // 44
  }), "\n        "), HTML.Raw('\n        <button class="btn btn-primary placeButton" data-pressed="false">Specify</button>\n    '));
}));                                                                                                                   // 46
                                                                                                                       // 47
Template.__checkName("cropSummary");                                                                                   // 48
Template["cropSummary"] = new Template("Template.cropSummary", (function() {                                           // 49
  var view = this;                                                                                                     // 50
  return [ HTML.TD(HTML.IMG({                                                                                          // 51
    src: function() {                                                                                                  // 52
      return Spacebars.mustache(view.lookup("img"));                                                                   // 53
    },                                                                                                                 // 54
    alt: ""                                                                                                            // 55
  })), "\n    ", HTML.TD(Blaze.View("lookup:name", function() {                                                        // 56
    return Spacebars.mustache(view.lookup("name"));                                                                    // 57
  })), "\n    ", HTML.TD({                                                                                             // 58
    class: function() {                                                                                                // 59
      return Spacebars.mustache(view.lookup("id"));                                                                    // 60
    }                                                                                                                  // 61
  }, "\n    ") ];                                                                                                      // 62
}));                                                                                                                   // 63
                                                                                                                       // 64
Template.__checkName("statusList");                                                                                    // 65
Template["statusList"] = new Template("Template.statusList", (function() {                                             // 66
  var view = this;                                                                                                     // 67
  return HTML.DIV({                                                                                                    // 68
    class: "statusList"                                                                                                // 69
  }, "\n        ", Spacebars.include(view.lookupTemplate("characterList")), "\n        ", HTML.DIV({                   // 70
    class: "plantPanel statusPanel statusPanelShow",                                                                   // 71
    style: "z-index:1;"                                                                                                // 72
  }, "\n            ", HTML.Raw("<h2>Crop List</h2>"), "\n            ", HTML.Raw("<hr>"), "\n            ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("crops"));                                                                       // 74
  }, function() {                                                                                                      // 75
    return [ "\n                    ", Spacebars.include(view.lookupTemplate("crop")), "\n            " ];             // 76
  }), "\n            ", Spacebars.include(view.lookupTemplate("cropSelectingBtns")), "\n        "), "\n        ", HTML.DIV({
    class: "cropPanel statusPanel",                                                                                    // 78
    style: "z-index:-1;"                                                                                               // 79
  }, "\n            ", HTML.DIV({                                                                                      // 80
    class: "summaryBoard"                                                                                              // 81
  }, "\n                ", HTML.Raw("<h2>Current Crop Summary</h2>"), "\n\n                ", HTML.TABLE({             // 82
    id: "cropTable",                                                                                                   // 83
    class: ""                                                                                                          // 84
  }, "\n                  ", HTML.THEAD("\n                  "), "\n                  ", HTML.TBODY("\n                    ", HTML.TR("\n                      ", HTML.TH("#"), "\n                      ", HTML.TH("Img"), "\n                      ", HTML.TH("Name"), "\n                      ", HTML.TH("Time Left"), "\n\n                    "), "\n                    ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("cropsSummary"));                                                                // 86
  }, function() {                                                                                                      // 87
    return [ "\n                      ", HTML.TR("\n                        ", HTML.TH({                               // 88
      scope: "row"                                                                                                     // 89
    }, "#"), "\n                        ", Spacebars.include(view.lookupTemplate("cropSummary")), "\n                      "), "\n                    " ];
  }), "\n                  "), "\n                "), "\n            "), "\n            ", Spacebars.include(view.lookupTemplate("cropSelectingBtns")), "\n\n        "), "\n        ", HTML.DIV({
    class: "landPanel statusPanel",                                                                                    // 92
    style: "z-index:-1;"                                                                                               // 93
  }, "\n            ", HTML.Raw("<h2>Land List</h2>"), "\n            ", HTML.Raw("<hr>"), "\n            ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("lands"));                                                                       // 95
  }, function() {                                                                                                      // 96
    return [ "\n                    ", Spacebars.include(view.lookupTemplate("land")), "\n            " ];             // 97
  }), "\n            ", Spacebars.include(view.lookupTemplate("cropSelectingBtns")), "\n        "), "\n\n    ");       // 98
}));                                                                                                                   // 99
                                                                                                                       // 100
Template.__checkName("cropSelectingBtns");                                                                             // 101
Template["cropSelectingBtns"] = new Template("Template.cropSelectingBtns", (function() {                               // 102
  var view = this;                                                                                                     // 103
  return HTML.Raw('<div class="controlButtons">\n    <button type="button" class="btn btn-info crop2" name="button">Plant Crop</button>\n    <button type="button" class="btn btn-info crop3" name="button">Current Crop</button>\n    <button type="button" class="btn btn-info crop4" name="button">Land</button>\n\n  </div>');
}));                                                                                                                   // 105
                                                                                                                       // 106
Template.__checkName("logo");                                                                                          // 107
Template["logo"] = new Template("Template.logo", (function() {                                                         // 108
  var view = this;                                                                                                     // 109
  return HTML.Raw('<div class="logo">\n        <img src="/img/logo_bartering.png" alt="">\n    </div>');               // 110
}));                                                                                                                   // 111
                                                                                                                       // 112
Template.__checkName("characterList");                                                                                 // 113
Template["characterList"] = new Template("Template.characterList", (function() {                                       // 114
  var view = this;                                                                                                     // 115
  return HTML.DIV({                                                                                                    // 116
    class: "characterList"                                                                                             // 117
  }, HTML.Raw('\n        <div class="characterImg">\n            <img src="/img/game/farmer.svg" alt="">\n        </div>\n        '), HTML.DIV({
    class: "characterStatus"                                                                                           // 119
  }, "\n            ", HTML.DIV({                                                                                      // 120
    class: "userName"                                                                                                  // 121
  }, "\n              ", HTML.H3(Blaze.View("lookup:userName", function() {                                            // 122
    return Spacebars.mustache(view.lookup("userName"));                                                                // 123
  })), "\n            "), "\n            ", HTML.Raw('<div class="userExp">\n              <h4>EXP </h4>\n              <div class="expProgress">\n                  <div class="expProgressBar"></div>\n                  <div class="expText"></div>\n              </div>\n            </div>'), "\n            ", HTML.Raw('<div class="userSta">\n              <h4>STA </h4>\n              <div class="staProgress">\n                  <div class="staProgressBar"></div>\n                  <div class="staText"></div>\n              </div>\n            </div>'), "\n        "), "\n        ", HTML.DIV({
    class: "functionSwitch"                                                                                            // 125
  }, "\n              ", HTML.Raw('<button type="button" name="button" class="btn btn-primary shopOpen">Shop</button>'), "\n              ", HTML.BUTTON({
    type: "button",                                                                                                    // 127
    name: "button",                                                                                                    // 128
    class: "btn btn-primary characterSwitch"                                                                           // 129
  }, Blaze.View("lookup:characterType", function() {                                                                   // 130
    return Spacebars.mustache(view.lookup("characterType"));                                                           // 131
  })), "\n              ", HTML.Raw('<button type="button" name="button" class="btn btn-primary MissionOpen">Mission</button>'), "\n              ", HTML.Raw('<span class="musicSwitch">\n                  <img src="/img/game/speaker_off.svg" alt="">\n              </span>'), "\n\n        "), "\n    ");
}));                                                                                                                   // 133
                                                                                                                       // 134
Template.__checkName("gamingArea");                                                                                    // 135
Template["gamingArea"] = new Template("Template.gamingArea", (function() {                                             // 136
  var view = this;                                                                                                     // 137
  return HTML.DIV({                                                                                                    // 138
    class: "gamingArea"                                                                                                // 139
  }, HTML.Raw('\n        <div class="loading">\n          <img src="/img/game/loading.gif" alt="">\n        </div>\n        '), HTML.DIV({
    class: "canvas"                                                                                                    // 141
  }, "\n            ", Spacebars.include(view.lookupTemplate("logo")), "\n            ", HTML.Raw('<div class="animationObject">\n              <div class="animationImg"></div>\n              <div class="scoreObject"></div>\n            </div>'), "\n\n            ", HTML.Raw('<div class="levelUpObject">\n                <div class="levelUpAnimation"></div>\n                <div class="levelUpText"></div>\n            </div>'), "\n\n            ", HTML.Raw('<div class="surfaceObject">\n              <div class="cropObject">\n              </div>\n            </div>'), "\n            ", HTML.Raw('<div class="landObject">\n              <div class="farmObject">\n              </div>\n            </div>'), "\n\n            ", HTML.Raw('<div class="land">\n\n            </div>'), "\n\n        "), "\n\n    ");
}));                                                                                                                   // 143
                                                                                                                       // 144
Template.__checkName("shop");                                                                                          // 145
Template["shop"] = new Template("Template.shop", (function() {                                                         // 146
  var view = this;                                                                                                     // 147
  return HTML.Raw('<div class="property_shop">\n        <div class="shop_header">\n            <input type="button" id="btn_show_property" value="Ratings">\n            <input type="button" id="btn_property_tradeable" value="Tradable">\n            <input type="button" id="btn_shop_close" value="close">\n            <input type="button" id="btn_shop_add" value="add">\n        </div>\n        <div class="shop_content">\n\n        </div>\n    </div>');
}));                                                                                                                   // 149
                                                                                                                       // 150
Template.__checkName("mission");                                                                                       // 151
Template["mission"] = new Template("Template.mission", (function() {                                                   // 152
  var view = this;                                                                                                     // 153
  return HTML.Raw('<div class="mission_template">\n\n    </div>');                                                     // 154
}));                                                                                                                   // 155
                                                                                                                       // 156
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.html":["./template.index.js",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/index.html                                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.exports = require("./template.index.js");                                                                       // 1
                                                                                                                       // 2
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"template.index.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/template.index.js                                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
                                                                                                                       // 1
Template.__checkName("init");                                                                                          // 2
Template["init"] = new Template("Template.init", (function() {                                                         // 3
  var view = this;                                                                                                     // 4
  return "";                                                                                                           // 5
}));                                                                                                                   // 6
                                                                                                                       // 7
Template.__checkName("header");                                                                                        // 8
Template["header"] = new Template("Template.header", (function() {                                                     // 9
  var view = this;                                                                                                     // 10
  return HTML.DIV({                                                                                                    // 11
    class: "header flexbox"                                                                                            // 12
  }, "\n    ", HTML.UL({                                                                                               // 13
    class: "flexbox"                                                                                                   // 14
  }, "\n      ", HTML.Raw('<div><img src="/img/logo_bartering.png" alt=""></div>'), "\n      ", HTML.LI("Hi! ", Blaze.View("lookup:currentAccount", function() {
    return Spacebars.mustache(view.lookup("currentAccount"));                                                          // 16
  })), "\n      ", HTML.Raw('<li><a href="/">Home</a></li>'), "\n      ", HTML.Raw('<li><a href="/transaction">Transaction</a></li>'), "\n      ", HTML.Raw('<li><a href="/game">Game</a></li>'), "\n      ", HTML.Raw('<li><a href="/update">Update Data</a></li>'), "\n      ", HTML.Raw('<li><a href="/switch">Switch Stakeholder</a></li>'), "\n    "), "\n  ");
}));                                                                                                                   // 18
                                                                                                                       // 19
Template.__checkName("switchButton");                                                                                  // 20
Template["switchButton"] = new Template("Template.switchButton", (function() {                                         // 21
  var view = this;                                                                                                     // 22
  return HTML.BUTTON({                                                                                                 // 23
    type: "button",                                                                                                    // 24
    class: "btn btn-info stakeholderSwitch",                                                                           // 25
    name: "button",                                                                                                    // 26
    id: function() {                                                                                                   // 27
      return Spacebars.mustache(view.lookup("id"));                                                                    // 28
    }                                                                                                                  // 29
  }, "Switch");                                                                                                        // 30
}));                                                                                                                   // 31
                                                                                                                       // 32
Template.__checkName("matchingResult");                                                                                // 33
Template["matchingResult"] = new Template("Template.matchingResult", (function() {                                     // 34
  var view = this;                                                                                                     // 35
  return [ HTML.TD(Blaze.View("lookup:id", function() {                                                                // 36
    return Spacebars.mustache(view.lookup("id"));                                                                      // 37
  })), "\n  ", HTML.TD(Blaze.View("lookup:name", function() {                                                          // 38
    return Spacebars.mustache(view.lookup("name"));                                                                    // 39
  })), "\n  ", HTML.TD(Blaze.View("lookup:owner", function() {                                                         // 40
    return Spacebars.mustache(view.lookup("owner"));                                                                   // 41
  })), "\n  ", HTML.TD(Blaze.View("lookup:to", function() {                                                            // 42
    return Spacebars.mustache(view.lookup("to"));                                                                      // 43
  })), "\n  ", HTML.TD(Blaze.View("lookup:importance", function() {                                                    // 44
    return Spacebars.mustache(view.lookup("importance"));                                                              // 45
  })) ];                                                                                                               // 46
}));                                                                                                                   // 47
                                                                                                                       // 48
Template.__checkName("property");                                                                                      // 49
Template["property"] = new Template("Template.property", (function() {                                                 // 50
  var view = this;                                                                                                     // 51
  return [ HTML.TD(Blaze.View("lookup:name", function() {                                                              // 52
    return Spacebars.mustache(view.lookup("name"));                                                                    // 53
  })), "\n  ", HTML.TD(Blaze.View("lookup:count", function() {                                                         // 54
    return Spacebars.mustache(view.lookup("count"));                                                                   // 55
  })), "\n  ", HTML.TD(Blaze.View("lookup:unit", function() {                                                          // 56
    return Spacebars.mustache(view.lookup("unit"));                                                                    // 57
  })), "\n  ", HTML.TD(Blaze.View("lookup:minUnit", function() {                                                       // 58
    return Spacebars.mustache(view.lookup("minUnit"));                                                                 // 59
  })), "\n  ", HTML.TD(Blaze.View("lookup:owner", function() {                                                         // 60
    return Spacebars.mustache(view.lookup("owner"));                                                                   // 61
  })), "\n  ", HTML.TD(Blaze.View("lookup:extraData", function() {                                                     // 62
    return Spacebars.mustache(view.lookup("extraData"));                                                               // 63
  })) ];                                                                                                               // 64
}));                                                                                                                   // 65
                                                                                                                       // 66
Template.__checkName("currentRating");                                                                                 // 67
Template["currentRating"] = new Template("Template.currentRating", (function() {                                       // 68
  var view = this;                                                                                                     // 69
  return HTML.TD(HTML.INPUT({                                                                                          // 70
    type: "text",                                                                                                      // 71
    name: "",                                                                                                          // 72
    value: function() {                                                                                                // 73
      return Spacebars.mustache(view.lookup("currentRating"));                                                         // 74
    },                                                                                                                 // 75
    id: function() {                                                                                                   // 76
      return Spacebars.mustache(view.lookup("ratingId"));                                                              // 77
    }                                                                                                                  // 78
  }));                                                                                                                 // 79
}));                                                                                                                   // 80
                                                                                                                       // 81
Template.__checkName("stakeholder");                                                                                   // 82
Template["stakeholder"] = new Template("Template.stakeholder", (function() {                                           // 83
  var view = this;                                                                                                     // 84
  return [ HTML.TD(Blaze.View("lookup:name", function() {                                                              // 85
    return Spacebars.mustache(view.lookup("name"));                                                                    // 86
  })), "\n  ", HTML.TD(Blaze.View("lookup:threshold", function() {                                                     // 87
    return Spacebars.mustache(view.lookup("threshold"));                                                               // 88
  })), "\n  ", HTML.TD(Blaze.View("lookup:fund", function() {                                                          // 89
    return Spacebars.mustache(view.lookup("fund"));                                                                    // 90
  })), "\n  ", HTML.TD(Blaze.View("lookup:rate", function() {                                                          // 91
    return Spacebars.mustache(view.lookup("rate"));                                                                    // 92
  })), "\n  ", HTML.TD(Blaze.View("lookup:address", function() {                                                       // 93
    return Spacebars.mustache(view.lookup("address"));                                                                 // 94
  })), "\n  ", HTML.TD(Blaze.View("lookup:since", function() {                                                         // 95
    return Spacebars.mustache(view.lookup("since"));                                                                   // 96
  })), "\n  ", HTML.TD(Blaze.View("lookup:character", function() {                                                     // 97
    return Spacebars.mustache(view.lookup("character"));                                                               // 98
  })) ];                                                                                                               // 99
}));                                                                                                                   // 100
                                                                                                                       // 101
Template.__checkName("account");                                                                                       // 102
Template["account"] = new Template("Template.account", (function() {                                                   // 103
  var view = this;                                                                                                     // 104
  return [ HTML.TD(Blaze.View("lookup:id", function() {                                                                // 105
    return Spacebars.mustache(view.lookup("id"));                                                                      // 106
  })), "\n  ", HTML.TD(Blaze.View("lookup:address", function() {                                                       // 107
    return Spacebars.mustache(view.lookup("address"));                                                                 // 108
  })) ];                                                                                                               // 109
}));                                                                                                                   // 110
                                                                                                                       // 111
Template.__checkName("transaction");                                                                                   // 112
Template["transaction"] = new Template("Template.transaction", (function() {                                           // 113
  var view = this;                                                                                                     // 114
  return [ Spacebars.include(view.lookupTemplate("header")), HTML.Raw('\n  <div class="transaction" style="color:white;"></div>\n  <button class="press" style="position:relative; top:300px;">press</button>') ];
}));                                                                                                                   // 116
                                                                                                                       // 117
Template.__checkName("testtt");                                                                                        // 118
Template["testtt"] = new Template("Template.testtt", (function() {                                                     // 119
  var view = this;                                                                                                     // 120
  return "hehe";                                                                                                       // 121
}));                                                                                                                   // 122
                                                                                                                       // 123
Template.__checkName("manage");                                                                                        // 124
Template["manage"] = new Template("Template.manage", (function() {                                                     // 125
  var view = this;                                                                                                     // 126
  return [ Spacebars.include(view.lookupTemplate("header")), "\n  ", HTML.DIV({                                        // 127
    class: "manageContent flex"                                                                                        // 128
  }, "\n    ", HTML.TABLE({                                                                                            // 129
    id: "manageTable",                                                                                                 // 130
    class: "manage table table-hover"                                                                                  // 131
  }, "\n      ", HTML.H2("Stakeholders"), "\n      ", HTML.THEAD("\n      "), "\n      ", HTML.TBODY("\n        ", HTML.TR("\n          ", HTML.TH("#"), "\n          ", HTML.TH("Name"), "\n          ", HTML.TH("Threshold"), "\n          ", HTML.TH("Fund"), "\n          ", HTML.TH("Rate"), "\n          ", HTML.TH("Address"), "\n          ", HTML.TH("Since"), "\n          ", HTML.TH("Character"), "\n        "), "\n        ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("stakeholders"));                                                                // 133
  }, function() {                                                                                                      // 134
    return [ "\n          ", HTML.TR("\n            ", HTML.TH({                                                       // 135
      scope: "row"                                                                                                     // 136
    }, "#"), "\n            ", Spacebars.include(view.lookupTemplate("stakeholder")), "\n          "), "\n        " ];
  }), "\n      "), "\n    "), "\n\n    ", HTML.TABLE({                                                                 // 138
    id: "propertyTable",                                                                                               // 139
    class: "manage table table-hover"                                                                                  // 140
  }, "\n      ", HTML.H2("Properties"), "\n      ", HTML.THEAD("\n      "), "\n      ", HTML.TBODY("\n        ", HTML.TR("\n          ", HTML.TH("#"), "\n          ", HTML.TH("Name"), "\n          ", HTML.TH("Count"), "\n          ", HTML.TH("Unit"), "\n          ", HTML.TH("Min Unit"), "\n          ", HTML.TH("Onwer"), "\n          ", HTML.TH("Extra Data"), "\n        "), "\n        ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("properties"));                                                                  // 142
  }, function() {                                                                                                      // 143
    return [ "\n          ", HTML.TR("\n            ", HTML.TH({                                                       // 144
      scope: "row"                                                                                                     // 145
    }, "#"), "\n            ", Spacebars.include(view.lookupTemplate("property")), "\n          "), "\n        " ];    // 146
  }), "\n      "), "\n      ", HTML.BUTTON({                                                                           // 147
    type: "button",                                                                                                    // 148
    class: "btn btn-primary",                                                                                          // 149
    id: "matchMake",                                                                                                   // 150
    name: "button"                                                                                                     // 151
  }, "Match Making"), "\n    "), "\n  "), "\n\n    ", HTML.TABLE({                                                     // 152
    id: "matchingTable",                                                                                               // 153
    class: "table table-hover"                                                                                         // 154
  }, "\n      ", HTML.H2("Matching Result"), "\n      ", HTML.THEAD("\n      "), "\n      ", HTML.TBODY("\n        ", HTML.TR("\n          ", HTML.TH("ID"), "\n          ", HTML.TH("Name"), "\n          ", HTML.TH("Owner"), "\n          ", HTML.TH("Average Importance"), "\n        "), "\n        ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("matchingResults"));                                                             // 156
  }, function() {                                                                                                      // 157
    return [ "\n          ", HTML.TR("\n            ", HTML.TD(Blaze.View("lookup:id", function() {                    // 158
      return Spacebars.mustache(view.lookup("id"));                                                                    // 159
    })), "\n            ", HTML.TD(Blaze.View("lookup:name", function() {                                              // 160
      return Spacebars.mustache(view.lookup("name"));                                                                  // 161
    })), "\n            ", HTML.TD(Blaze.View("lookup:owner", function() {                                             // 162
      return Spacebars.mustache(view.lookup("owner"));                                                                 // 163
    })), "\n            ", HTML.TD(Blaze.View("lookup:importance", function() {                                        // 164
      return Spacebars.mustache(view.lookup("importance"));                                                            // 165
    })), "\n          "), "\n        " ];                                                                              // 166
  }), "\n      "), "\n    "), "\n\n  ", Spacebars.include(view.lookupTemplate("init")) ];                              // 167
}));                                                                                                                   // 168
                                                                                                                       // 169
Template.__checkName("switchStakeholder");                                                                             // 170
Template["switchStakeholder"] = new Template("Template.switchStakeholder", (function() {                               // 171
  var view = this;                                                                                                     // 172
  return [ Spacebars.include(view.lookupTemplate("init")), "\n\n  ", Spacebars.include(view.lookupTemplate("header")), "\n\n  ", HTML.DIV({
    class: "stakeholderList flex"                                                                                      // 174
  }, "\n    ", HTML.TABLE({                                                                                            // 175
    class: "stakeholderTable table table-hover"                                                                        // 176
  }, "\n      ", HTML.H2("Stakeholders"), "\n\n      ", HTML.THEAD("\n      "), "\n      ", HTML.TBODY("\n        ", HTML.TR("\n          ", HTML.TH("Name"), "\n          ", HTML.TH("Threshold"), "\n          ", HTML.TH("Fund"), "\n          ", HTML.TH("Rate"), "\n          ", HTML.TH("Address"), "\n          ", HTML.TH("Since"), "\n          ", HTML.TH("Character"), "\n        "), "\n        ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("stakeholders"));                                                                // 178
  }, function() {                                                                                                      // 179
    return [ "\n          ", HTML.TR("\n            ", Spacebars.include(view.lookupTemplate("stakeholder")), "\n          "), "\n        " ];
  }), "\n      "), "\n    "), "\n\n    ", HTML.TABLE({                                                                 // 181
    class: "web3AccountsTable table table-hover"                                                                       // 182
  }, "\n      ", HTML.H2("Web3.eth.accounts List"), "\n\n      ", HTML.THEAD("\n      "), "\n      ", HTML.TBODY("\n        ", HTML.TR("\n          ", HTML.TH("#"), "\n          ", HTML.TH("Address"), "\n        "), "\n        ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("web3Accounts"));                                                                // 184
  }, function() {                                                                                                      // 185
    return [ "\n          ", HTML.TR("\n            ", Spacebars.include(view.lookupTemplate("account")), "\n            ", Spacebars.include(view.lookupTemplate("switchButton")), "\n          "), "\n        " ];
  }), "\n      "), "\n    "), "\n  ") ];                                                                               // 187
}));                                                                                                                   // 188
                                                                                                                       // 189
Template.__checkName("updateData");                                                                                    // 190
Template["updateData"] = new Template("Template.updateData", (function() {                                             // 191
  var view = this;                                                                                                     // 192
  return [ Spacebars.include(view.lookupTemplate("init")), "\n\n  ", Spacebars.include(view.lookupTemplate("header")), "\n  ", HTML.DIV({
    class: "updateRating flex"                                                                                         // 194
  }, "\n    ", HTML.TABLE({                                                                                            // 195
    class: "updateRatingTable table table-hover"                                                                       // 196
  }, "\n      ", HTML.H2("Properties"), "\n      ", HTML.THEAD("\n      "), "\n      ", HTML.TBODY("\n        ", HTML.TR("\n          ", HTML.TH("#"), "\n          ", HTML.TH("Name"), "\n          ", HTML.TH("Count"), "\n          ", HTML.TH("Unit"), "\n          ", HTML.TH("Min Unit"), "\n          ", HTML.TH("Onwer"), "\n          ", HTML.TH("Extra Data"), "\n          ", HTML.TH("Rating"), "\n        "), "\n        ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("properties"));                                                                  // 198
  }, function() {                                                                                                      // 199
    return [ "\n          ", HTML.TR("\n            ", HTML.TH({                                                       // 200
      scope: "row"                                                                                                     // 201
    }, "#"), "\n            ", Spacebars.include(view.lookupTemplate("property")), "\n            ", Spacebars.include(view.lookupTemplate("currentRating")), "\n          "), "\n        " ];
  }), "\n      "), "\n      ", HTML.BUTTON({                                                                           // 203
    type: "button",                                                                                                    // 204
    class: "btn btn-primary",                                                                                          // 205
    id: "updateRating",                                                                                                // 206
    name: "button"                                                                                                     // 207
  }, "update"), "\n\n    "), "\n  ") ];                                                                                // 208
}));                                                                                                                   // 209
                                                                                                                       // 210
Template.__checkName("index");                                                                                         // 211
Template["index"] = new Template("Template.index", (function() {                                                       // 212
  var view = this;                                                                                                     // 213
  return [ Spacebars.include(view.lookupTemplate("header")), "\n  ", HTML.DIV({                                        // 214
    id: "fullpage"                                                                                                     // 215
  }, "\n      ", HTML.Raw('<div id="title" class="section">\n          <div class="titleContainer">\n            <h1>"A Blockchain-based <br>Bartering System"</h1>\n\n          </div>\n          <div class="titleImage">\n              <img src="/img/coverpic_bartering.png" alt="">\n          </div>\n          <div class="titleBar"></div>\n          <a href="#section2" data-title="" id="arrow-down">Get started</a>\n      </div>'), "\n\n      ", HTML.Raw('<div id="intro" class="layout section">\n\n\n        <div id="intro_head" class="flexbox">\n          <div class=""><h1>"WHAT is D3 Bartering System?"</h1></div>\n          <div class=""><h1>Introduction</h1></div>\n          <div class="underLine" id="underLine"></div>\n          <div>\n          <div class="videoBack" id="videoBack">\n          </div>\n          <div id="videoWord">\n            <h1>"VideoScript of Bartering"</h1>\n          </div>\n        </div>\n        </div>\n\n        <div id="intro_content">\n          <!--<h3>我是中文版。我是中文版。我是中文版。</h3>\n          <h3>我是中文版。我是中文版。</h3>-->\n          <h3>\n              We all have many white elephants at home, and also some\n              idle properties that can be transacted or donated to others.\n              Besides, we hope to acquire things we are craving for.\n              Thus, UtoBarterian, an auto-property bartering system can\n              help you exchange idle properties to what you desire for.\n          </h3>\n        </div>\n\n      </div>'), "\n      ", HTML.Raw('<div id="whyUs" class="layout section">\n        <div id="whyUs_head" class="flexbox">\n          <div class=""><h1>"WHY D3 Bartering System?"</h1></div>\n          <div class=""><h1>Motivation</h1></div>\n          <div class="underLine"></div>\n          <div>\n\n        </div>\n        </div>\n\n        <div id="whyUs_content">\n            <!--<h3>我們幸運地處在一個資源豐沛的世界，且資源的取得越來越容易；<br />\n                然而，在如此便利的環境下，<br />\n                資源分配不均與資源浪費的問題卻日趨嚴重… <br />\n                我們都期望一個更好的世界，沒有浪費，公平共享的和諧世界。<br />\n                Utobarterian期望透過符合使用者期待的自動化以物易物系統，<br />\n                創造出一個將世界所有資源之效用最大化的烏托邦社會。\n            </h3>-->\n          <h3>\n              The world is full of resources and constantly growing larger.\n                However, the allocating is more unevenly\n                and the wasted is getting worse…\n                We are all yearning for a better world,\n                an even, unwasted world.\n                An equality, prosperity and harmony world.\n                And also an Utopia.<br>\n            </h3>\n        </div>\n\n\n      </div>'), "\n\n      ", HTML.DIV({
    id: "tutorial",                                                                                                    // 217
    class: "layout section"                                                                                            // 218
  }, "\n\n          ", HTML.Raw('<div class="getStarted">\n            <!-- {{> hello}}\n            {{> info}} -->\n            <img src="/img/getStart.png" alt="">\n            <h1>"Get Started"</h1>\n          </div>'), "\n          ", HTML.DIV({
    id: "form",                                                                                                        // 220
    class: "flexbox flip-container"                                                                                    // 221
  }, "\n              ", HTML.DIV({                                                                                    // 222
    class: "flipper",                                                                                                  // 223
    id: "flipper"                                                                                                      // 224
  }, "\n                  ", HTML.DIV({                                                                                // 225
    class: "front flexbox"                                                                                             // 226
  }, "\n\n                    ", HTML.FORM({                                                                           // 227
    class: "navbar-form navbar-left",                                                                                  // 228
    role: "search",                                                                                                    // 229
    id: "stakeholderInfo"                                                                                              // 230
  }, "\n                        ", HTML.Raw("<h1>Register</h1>"), "\n                        ", HTML.Raw("<br>"), "\n                        ", HTML.Raw('<div class="formElement">\n                            <label for="stakeholder">Characters</label>\n                            <div class="btn-group" role="group" id="characters">\n                              <button type="button" class="btn btn-default chooseCharacters" id="guard" value="Guard">Guard</button>\n                              <button type="button" class="btn btn-default chooseCharacters" id="thief" value="Thief">Thief</button>\n                            </div>\n                        </div>'), "\n                        ", HTML.Raw("<br>"), "\n                        ", HTML.DIV({
    class: "formElement"                                                                                               // 232
  }, "\n                            ", HTML.Raw('<label for="address">Address</label>'), "\n                            ", HTML.DIV({
    class: "input-group"                                                                                               // 234
  }, "\n                              ", HTML.Raw('<span class="input-group-addon glyphicon glyphicon-globe"></span>'), "\n                              ", HTML.INPUT({
    type: "text",                                                                                                      // 236
    class: "form-control",                                                                                             // 237
    value: function() {                                                                                                // 238
      return Spacebars.mustache(view.lookup("currentAddress"));                                                        // 239
    }                                                                                                                  // 240
  }), "\n                            "), "\n                        "), "\n                        ", HTML.Raw("<br>"), "\n                        ", HTML.Raw('<div class="formElement">\n                            <label for="name">Name</label>\n                            <div class="input-group">\n                              <span class="input-group-addon glyphicon glyphicon-user" id="name"></span>\n                              <input type="text" class="form-control s_Name" placeholder="">\n                            </div>\n                        </div>'), "\n                        ", HTML.Raw("<br>"), "\n                        ", HTML.Raw('<div class="formElement">\n                            <label for="threshold">Threshold</label>\n                            <div class="input-group">\n                              <span class="input-group-addon glyphicon glyphicon-eth" id="basic-addon3">$</span>\n                              <input type="text" class="form-control s_Threshold" placeholder="USD dollars">\n                            </div>\n                        </div>'), "\n                        ", HTML.Raw("<br>"), "\n                        ", HTML.Raw('<div class="formElement">\n                            <label for="fund">Fund</label>\n                            <div class="input-group">\n                              <span class="input-group-addon glyphicon glyphicon-eth" id="basic-addon3">$</span>\n                              <input type="text" class="form-control s_Fund" placeholder="USD dollars">\n                            </div>\n                        </div>'), "\n                        ", HTML.Raw("<br>"), "\n                        ", HTML.Raw('<div class="formElement">\n                            <label for="rate">Rate</label>\n                            <div class="input-group">\n                              <span class="input-group-addon glyphicon glyphicon-eth" id="basic-addon3">$</span>\n                              <input type="text" class="form-control s_Rate" placeholder="">\n                            </div>\n                        </div>'), "\n                        ", HTML.Raw("<br>"), "\n                        ", HTML.Raw('<button type="submit" class="btn btn-success" id="next">Start Farming !</button>'), "\n                        ", HTML.Raw('<button type="button" class="btn btn-danger" id="test">TEST</button>'), "\n\n                    "), "\n                "), "\n                ", HTML.Raw('<div class="back flexbox">\n                    <div id="sellerInfo">\n                      <form class="navbar-form navbar-left" role="search">\n                          <h2>Add Property</h2>\n                          <br>\n                          <label for="name">Name</label>\n                          <div class="input-group">\n                            <span class="input-group-addon glyphicon glyphicon-globe"></span>\n                            <input type="text" class="form-control p_Name" placeholder="Property name">\n                          </div>\n                          <br>\n                          <label for="count">Property Count</label>\n                          <div class="input-group">\n                            <span class="input-group-addon glyphicon glyphicon-user" id="count"></span>\n                            <input type="text" class="form-control p_Count" placeholder="How many(much) are there?">\n                          </div>\n                          <br>\n                          <label for="count">Access Stakeholders</label>\n                          <div class="input-group">\n                            <span class="input-group-addon glyphicon glyphicon-user" id="count"></span>\n                            <input type="text" class="form-control p_AccessStakeholders" placeholder="Address">\n                          </div>\n                          <br>\n                          <label for="count">Unit</label>\n                          <div class="input-group">\n                            <span class="input-group-addon glyphicon glyphicon-user" id="count"></span>\n                            <input type="text" class="form-control p_Unit" placeholder="">\n                          </div>\n                          <br>\n                          <label for="count">Atomic Unit</label>\n                          <div class="input-group">\n                            <span class="input-group-addon glyphicon glyphicon-user" id="count"></span>\n                            <input type="text" class="form-control p_AtomicUnit" placeholder="Smallest unit">\n                          </div>\n                          <br>\n                          <label for="data">Additional Data</label>\n                          <div class="input-group">\n                            <span class="input-group-addon glyphicon glyphicon-eth" id="data"></span>\n                            <input type="text" class="form-control p_Data" placeholder="Further info">\n                          </div>\n                          <br>\n                          <label for="count">Rating</label>\n                          <div class="input-group">\n                            <span class="input-group-addon glyphicon glyphicon-user" id="count"></span>\n                            <input type="text" class="form-control p_Rating" placeholder="Your personal ratin">\n                          </div>\n                          <br>\n                          <div class="submitButtons flexbox">\n                            <button type="submit" class="btn btn-danger" id="previous">Back</button>\n                            <button type="button" class="btn btn-primary" id="submit">Register</button>\n                            <button type="button" class="btn btn-danger" id="test">TEST</button>\n\n                          </div>\n                      </form>\n                    </div>\n                    <div id="buyerInfo">\n                        <form class="navbar-form navbar-left" role="search">\n                            <h2>Current Bidding Query</h2>\n                            <br>\n                            <label for="bidId">Bidding ID</label>\n                            <div class="input-group">\n                              <span class="input-group-addon glyphicon glyphicon-globe"></span>\n                              <input type="text" class="form-control" placeholder="ID">\n                            </div>\n                            <br>\n                            <div class="submitButtons flexbox">\n                              <button type="submit" class="btn btn-danger" id="previous">Back</button>\n                              <button type="button" class="btn btn-primary" id="submit">Register</button>\n\n                            </div>\n                        </form>\n                    </div>\n\n                </div>'), "\n            "), "\n        "), "\n      "), "\n\n  ", HTML.Raw('<div id="aboutUs" class="flexbox layout section">\n    <div id="aboutUs_head" class="flexbox">\n      <div class=""><h1>"ABOUT US"</h1></div>\n      <div class=""><h1>團隊介紹</h1></div>\n      <div class="underLine" id="underLine"></div>\n    </div>\n\n    <div id="teamInfo" class="flexbox">\n      <div class="member flexbox memeberBox">\n        <div class="teamCircle"></div>\n        <div class="teamPic"><img src="/img/user-male-black-shape.png" width="15%" height="15%" alt=""></div>\n        <div class="memeberInfo">\n          <h1>Professor Yuan</h1>\n          <p>NCCU, MIS</p>\n          <p>Service Science Research Center</p>\n          <p>ssrc@nccu.edu.tw</p>\n        </div>\n      </div>\n      <div class="member flexbox memeberBox">\n        <div class="teamCircle"></div>\n        <div class="teamPic"><img src="/img/user-male-black-shape.png" width="15%" height="15%" alt=""></div>\n        <div class="memeberInfo">\n          <h1>Professor Yuan</h1>\n          <p>NCCU, MIS</p>\n          <p>Service Science Research Center</p>\n          <p>ssrc@nccu.edu.tw</p>\n        </div>\n      </div>\n    </div>\n  </div>'), "\n\n  ", HTML.Raw('<div id="footer" class="flexbox">\n    <div>\n      <ul class="flexbox">\n        <li class="footerLogo"><img src="/img/logo_final_skin.png" width="30%" height="30%" alt=""></li>\n        <li class="footerLogo2"><img src="/img/logo_bartering.png" width="30%" height="30%" alt=""></li>\n      </ul>\n    </div>\n    <div class="contact">\n      <ul class="flexbox">\n        <li class="footerInfo1">\n          <p>國立政治大學 資訊管理學系</p>\n          <p>服務科學研究中心</p>\n          <p>116 台北市文山區指南路二段64號</p>\n          <p>TEL:02-2939-3091</p>\n        </li>\n        <li><div class="footerLine"></div></li>\n        <li class="footerInfo2">\n          <p>National ChengChi University</p>\n          <p>Service Science Research Center</p>\n          <p>No.64, Sec. 2, Zhinan Rd., Wenshan Dist., Taipei City 116, Taiwan (R.O.C)</p>\n          <p>TEL:02-2939-3091</p>\n        </li>\n      </ul>\n    </div>\n    <div class="copyRight">\n      <h2>Copyright (c) 2017 Copyright Holder All Rights Reserved.</h2>\n    </div>\n  </div>'), "\n"), "\n\n  ", Spacebars.include(view.lookupTemplate("init")) ];
}));                                                                                                                   // 242
                                                                                                                       // 243
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"main.html":["./template.main.js",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/main.html                                                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.exports = require("./template.main.js");                                                                        // 1
                                                                                                                       // 2
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"template.main.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/template.main.js                                                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
                                                                                                                       // 1
Template.body.addContent((function() {                                                                                 // 2
  var view = this;                                                                                                     // 3
  return "";                                                                                                           // 4
}));                                                                                                                   // 5
Meteor.startup(Template.body.renderToDocument);                                                                        // 6
                                                                                                                       // 7
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"contract.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/lib/contract.js                                                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
if (typeof web3 === 'undefined') web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));            // 1
                                                                                                                       //
CongressAddr = "0x1724848603737d8ac22fbda244007207ad2db123";                                                           // 4
usingPropertyAddr = "0x87e71535dc59dca14cc35cdeaecd6817b4d40271";                                                      // 5
MainActivityAddr = "0xf6dcde9ee171a5146e1a325a8cf2af6ecbf4381d";                                                       // 6
ActivityInterfaceAddr = "0xe44153d1a1d6110c2d7ef472b34a1bcc45941ab6";                                                  // 7
StringUtilsAddr = "0x0b51355fe101a97195f15552b15c33a1b758f3e1";                                                        // 8
GameCoreAddr = "0xd22ce2123990d7d06494496bd04ba41655914b1c";                                                           // 9
CongressCode = "606060405260405160808062002a57833981016040528080519060200190919080519060200190919080519060200190919080519060200190919050505b5b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b620000a18484846200010f64010000000002620018d0176401000000009004565b60008173ffffffffffffffffffffffffffffffffffffffff16141515620001045780600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b5b50505050620001d6565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156200016d5760006000fd5b8260018190555081600281905550806003819055507fa439d3fa452be5e0e1e24a8145e715f4fd8b9c08c96a42fd82a855a85e5d57de60015460025460035460405180848152602001838152602001828152602001935050505060405180910390a15b5b505050565b61287180620001e66000396000f30060606040523615610168576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063013cf08b146101dc57806303b66f63146103065780630a98c24c1461032f57806310a42391146103635780631207af5c146103df5780631d6b8b7214610408578063237e949214610492578063400e3949146104f557806368dc61e01461051b57806369bd34361461054157806376f703d5146105675780638160f0b5146105a45780638da5cb5b146105ca5780638f4ffcb11461061c578063aa02a90f146106bd578063b1050da5146106e3578063bcb0c2d7146107bc578063bcca1fd3146107f2578063c985162914610824578063d3c0715b14610892578063df20356e14610914578063df9cd8cb1461093d578063e0d371cc14610978578063ec935ada146109c2578063eceb2945146109f4578063edbd1ce614610a97578063f2fde38b14610acb578063f46bba8d14610b01575b6101da5b7fa398b89ba344a0b23a0b9de53db298b2a1a868b396c1878b7e9dcbafecd49b133334604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a15b565b005b34156101e457fe5b6101fa6004808035906020019091905050610b32565b604051808a73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200189815260200180602001888152602001871515151581526020018615151515815260200185815260200184815260200183600019166000191681526020018281038252898181546001816001161561010002031660029004815260200191508054600181600116156101000203166002900480156102ef5780601f106102c4576101008083540402835291602001916102ef565b820191906000526020600020905b8154815290600101906020018083116102d257829003601f168201915b50509a505050505050505050505060405180910390f35b341561030e57fe5b61032d6004808035906020019091908035906020019091905050610bc9565b005b341561033757fe5b61034d6004808035906020019091905050610c4e565b6040518082815260200191505060405180910390f35b341561036b57fe5b6103816004808035906020019091905050610c7d565b604051808a600019166000191681526020018960001916600019168152602001888152602001878152602001868152602001858152602001848152602001838152602001828152602001995050505050505050505060405180910390f35b34156103e757fe5b6104066004808035906020019091908035906020019091905050610cdb565b005b341561041057fe5b6104266004808035906020019091905050610d09565b604051808881526020018781526020018681526020018581526020018473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200183815260200182815260200197505050505050505060405180910390f35b341561049a57fe5b6104f3600480803590602001909190803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091905050610d7b565b005b34156104fd57fe5b61050561107a565b6040518082815260200191505060405180910390f35b341561052357fe5b61052b611080565b6040518082815260200191505060405180910390f35b341561054957fe5b61055161108e565b6040518082815260200191505060405180910390f35b341561056f57fe5b61058e6004808035906020019091908035906020019091905050611094565b6040518082815260200191505060405180910390f35b34156105ac57fe5b6105b46110e0565b6040518082815260200191505060405180910390f35b34156105d257fe5b6105da6110e6565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561062457fe5b6106bb600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001909190803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190505061110c565b005b34156106c557fe5b6106cd611332565b6040518082815260200191505060405180910390f35b34156106eb57fe5b6107a6600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001909190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091905050611338565b6040518082815260200191505060405180910390f35b34156107c457fe5b6107f0600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190505061163a565b005b34156107fa57fe5b61082260048080359060200190919080359060200190919080359060200190919050506118d0565b005b341561082c57fe5b6108426004808035906020019091905050611996565b604051808860001916600019168152602001878152602001868152602001856000191660001916815260200184815260200183815260200182815260200197505050505050505060405180910390f35b341561089a57fe5b6108fe6004808035906020019091908035151590602001909190803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091905050611ac1565b6040518082815260200191505060405180910390f35b341561091c57fe5b61093b6004808035906020019091908035906020019091905050611d3d565b005b341561094557fe5b6109766004808035906020019091908035906020019091908035906020019091908035906020019091905050611d9d565b005b341561098057fe5b6109ac600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050611e1f565b6040518082815260200191505060405180910390f35b34156109ca57fe5b6109f26004808035906020019091908035906020019091908035906020019091905050611e37565b005b34156109fc57fe5b610a7d600480803590602001909190803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001909190803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091905050612125565b604051808215151515815260200191505060405180910390f35b3415610a9f57fe5b610ab56004808035906020019091905050612212565b6040518082815260200191505060405180910390f35b3415610ad357fe5b610aff600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050612241565b005b3415610b0957fe5b610b30600480803560001916906020019091908035600019169060200190919050506122e4565b005b600481815481101515610b4157fe5b90600052602060002090600a020160005b915090508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169080600101549080600201908060030154908060040160009054906101000a900460ff16908060040160019054906101000a900460ff16908060050154908060060154908060070154905089565b600882815481101515610bd857fe5b90600052602060002090600b020160005b5060090160008154809291906001019190505550600882815481101515610c0c57fe5b90600052602060002090600b020160005b50600a018054806001018281610c33919061242e565b916000526020600020900160005b83909190915055505b5050565b6000600782815481101515610c5f57fe5b906000526020600020906007020160005b506006015490505b919050565b600881815481101515610c8c57fe5b90600052602060002090600b020160005b915090508060000154908060010154908060020154908060030154908060040154908060050154908060060154908060070154908060090154905089565b80600883815481101515610ceb57fe5b90600052602060002090600b020160005b50600601819055505b5050565b600781815481101515610d1857fe5b906000526020600020906007020160005b915090508060000154908060010154908060020154908060030154908060040160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060050154908060060154905087565b6000600483815481101515610d8c57fe5b90600052602060002090600a020160005b5090508060030154421080610dc057508060040160009054906101000a900460ff165b80610eaa57508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16816001015483604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166c0100000000000000000000000002815260140183815260200182805190602001908083835b60208310610e6b5780518252602082019150602081019050602083039250610e48565b6001836020036101000a038019825116818451168082178552505050505050905001935050505060405180910390206000191681600701546000191614155b80610eba57506001548160050154105b15610ec55760006000fd5b60035481600601541315610fea5760018160040160006101000a81548160ff0219169083151502179055508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16670de0b6b3a76400008260010154028360405180828051906020019080838360008314610f77575b805182526020831115610f7757602082019150602081019050602083039250610f53565b505050905090810190601f168015610fa35780820380516001836020036101000a031916815260200191505b5091505060006040518083038185876185025a03f1925050501515610fc85760006000fd5b60018160040160016101000a81548160ff021916908315150217905550611008565b60008160040160016101000a81548160ff0219169083151502179055505b7fd220b7272a8b6d0d7d6bcdace67b936a8f175e6d5c1b3ee438b72256b32ab3af83826006015483600501548460040160019054906101000a900460ff16604051808581526020018481526020018381526020018215151515815260200194505050505060405180910390a15b505050565b60055481565b600060078054905090505b90565b60025481565b60006008838154811015156110a557fe5b90600052602060002090600b020160005b50600a01828154811015156110c757fe5b906000526020600020900160005b505490505b92915050565b60015481565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60008290508073ffffffffffffffffffffffffffffffffffffffff166323b872dd8630876000604051602001526040518463ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019350505050602060405180830381600087803b15156111ed57fe5b60325a03f115156111fa57fe5b5050506040518051905015156112105760006000fd5b7f0eeb71b8926d7ed8f47a2cedf6b9b204e2001344c7fa20c696c9f06ea7c413c685858585604051808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018481526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001806020018281038252838181518152602001915080519060200190808383600083146112ee575b8051825260208311156112ee576020820191506020810190506020830392506112ca565b505050905090810190601f16801561131a5780820380516001836020036101000a031916815260200191505b509550505050505060405180910390a15b5050505050565b60035481565b600060006000600660003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054141561138a5760006000fd5b6004805480919060010161139e919061245a565b91506004828154811015156113af57fe5b90600052602060002090600a020160005b509050858160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508481600101819055508381600201908051906020019061142792919061248c565b50858584604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166c0100000000000000000000000002815260140183815260200182805190602001908083835b602083106114a55780518252602082019150602081019050602083039250611482565b6001836020036101000a03801982511681845116808217855250505050505090500193505050506040518091039020816007018160001916905550603c600254024201816003018190555060008160040160006101000a81548160ff02191690831515021790555060008160040160016101000a81548160ff021916908315150217905550600081600501819055507f646fec02522b41e7125cfc859a64fd4f4cefd5dc3b6237ca0abe251ded1fa88182878787604051808581526020018473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001838152602001806020018281038252838181518152602001915080519060200190808383600083146115e6575b8051825260208311156115e6576020820191506020810190506020830392506115c2565b505050905090810190601f1680156116125780820380516001836020036101000a031916815260200191505b509550505050505060405180910390a1600182016005819055508191505b5b50949350505050565b6000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156116995760006000fd5b6000600660008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205414156116e75760006000fd5b600660008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490505b6001600780549050038110156118335760076001820181548110151561174c57fe5b906000526020600020906007020160005b5060078281548110151561176d57fe5b906000526020600020906007020160005b50600082015481600001556001820154816001015560028201548160020155600382015481600301556004820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168160040160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060058201548160050155600682015481600601559050505b808060010191505061172a565b600760016007805490500381548110151561184a57fe5b906000526020600020906007020160005b60008201600090556001820160009055600282016000905560038201600090556004820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff021916905560058201600090556006820160009055505060078054809190600190036118c9919061250c565b505b5b5050565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561192d5760006000fd5b8260018190555081600281905550806003819055507fa439d3fa452be5e0e1e24a8145e715f4fd8b9c08c96a42fd82a855a85e5d57de60015460025460035460405180848152602001838152602001828152602001935050505060405180910390a15b5b505050565b60006000600060006000600060006008888154811015156119b357fe5b90600052602060002090600b020160005b50600001546008898154811015156119d857fe5b90600052602060002090600b020160005b506002015460088a8154811015156119fd57fe5b90600052602060002090600b020160005b506003015460088b815481101515611a2257fe5b90600052602060002090600b020160005b506001015460088c815481101515611a4757fe5b90600052602060002090600b020160005b506004015460088d815481101515611a6c57fe5b90600052602060002090600b020160005b506005015460088e815481101515611a9157fe5b90600052602060002090600b020160005b506006015496509650965096509650965096505b919395979092949650565b600060006000600660003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541415611b135760006000fd5b600485815481101515611b2257fe5b90600052602060002090600a020160005b509050600115158160090160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1615151415611b975760006000fd5b60018160090160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690831515021790555080600501600081548092919060010191905055508315611c24578060060160008154809291906001019190505550611c3a565b8060060160008154809291906001900391905055505b7fc34f869b7ff431b034b7b9aea9822dac189a685e0b015c7d1be3add3f89128e88585338660405180858152602001841515151581526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200180602001828103825283818151815260200191508051906020019080838360008314611cf0575b805182526020831115611cf057602082019150602081019050602083039250611ccc565b505050905090810190601f168015611d1c5780820380516001836020036101000a031916815260200191505b509550505050505060405180910390a1806005015491505b5b509392505050565b80600883815481101515611d4d57fe5b90600052602060002090600b020160005b506002018190555080600883815481101515611d7657fe5b90600052602060002090600b020160005b50600301600082825401925050819055505b5050565b82600885815481101515611dad57fe5b90600052602060002090600b020160005b506004018190555081600885815481101515611dd657fe5b90600052602060002090600b020160005b506005018190555080600885815481101515611dff57fe5b90600052602060002090600b020160005b50600201819055505b50505050565b60066020528060005260406000206000915090505481565b6000600060003391506000600660008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054141561204657600780549050600660008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555060078054809190600101611ee5919061250c565b925085600784815481101515611ef757fe5b906000526020600020906007020160005b506000018190555084600784815481101515611f2057fe5b906000526020600020906007020160005b506001018190555082600784815481101515611f4957fe5b906000526020600020906007020160005b506002018190555083600784815481101515611f7257fe5b906000526020600020906007020160005b506003018190555033600784815481101515611f9b57fe5b906000526020600020906007020160005b5060040160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555042600784815481101515611ffe57fe5b906000526020600020906007020160005b5060050181905550600060078481548110151561202857fe5b906000526020600020906007020160005b50600601819055506120ac565b600660008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054925060078381548110151561209757fe5b906000526020600020906007020160005b5090505b7f27b022af4a8347100c7a041ce5ccf8e14d644ff05de696315196faae8cd50c9b826001604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001821515151581526020019250505060405180910390a15b505050505050565b6000600060048681548110151561213857fe5b90600052602060002090600a020160005b509050848484604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166c0100000000000000000000000002815260140183815260200182805190602001908083835b602083106121c957805182526020820191506020810190506020830392506121a6565b6001836020036101000a03801982511681845116808217855250505050505090500193505050506040518091039020600019168160070154600019161491505b50949350505050565b600060088281548110151561222357fe5b90600052602060002090600b020160005b506009015490505b919050565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561229e5760006000fd5b80600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b5b50565b6000600880548091906001016122fa919061253e565b90508260088281548110151561230c57fe5b90600052602060002090600b020160005b5060000181600019169055508160088281548110151561233957fe5b90600052602060002090600b020160005b506001018160001916905550600060088281548110151561236757fe5b90600052602060002090600b020160005b5060020181905550600060088281548110151561239157fe5b90600052602060002090600b020160005b506003018190555060036008828154811015156123bb57fe5b90600052602060002090600b020160005b506004018190555060006008828154811015156123e557fe5b90600052602060002090600b020160005b5060050181905550606460088281548110151561240f57fe5b90600052602060002090600b020160005b50600601819055505b505050565b815481835581811511612455578183600052602060002091820191016124549190612570565b5b505050565b81548183558181151161248757600a0281600a0283600052602060002091820191016124869190612595565b5b505050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106124cd57805160ff19168380011785556124fb565b828001600101855582156124fb579182015b828111156124fa5782518255916020019190600101906124df565b5b5090506125089190612570565b5090565b81548183558181151161253957600702816007028360005260206000209182019101612538919061264c565b5b505050565b81548183558181151161256b57600b0281600b02836000526020600020918201910161256a91906126c3565b5b505050565b61259291905b8082111561258e576000816000905550600101612576565b5090565b90565b61264991905b808211156126455760006000820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff021916905560018201600090556002820160006125e4919061274b565b60038201600090556004820160006101000a81549060ff02191690556004820160016101000a81549060ff021916905560058201600090556006820160009055600782016000905560088201600061263c9190612793565b50600a0161259b565b5090565b90565b6126c091905b808211156126bc57600060008201600090556001820160009055600282016000905560038201600090556004820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556005820160009055600682016000905550600701612652565b5090565b90565b61274891905b808211156127445760006000820160009055600182016000905560028201600090556003820160009055600482016000905560058201600090556006820160009055600782016000905560088201600061272391906127b8565b6009820160009055600a8201600061273b91906127b8565b50600b016126c9565b5090565b90565b50805460018160011615610100020316600290046000825580601f106127715750612790565b601f01602090049060005260206000209081019061278f9190612570565b5b50565b50805460008255600202906000526020600020908101906127b491906127da565b5b50565b50805460008255906000526020600020908101906127d69190612570565b5b50565b61284291905b8082111561283e5760006000820160006101000a81549060ff02191690556000820160016101000a81549073ffffffffffffffffffffffffffffffffffffffff0219169055600182016000612835919061274b565b506002016127e0565b5090565b905600a165627a7a7230582083ccf4f8de2b5ccc8c36b354010359ef03694ebaf1c67bac3a866d0b219f391e0029";
Congress = web3.eth.contract([{ "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "proposals", "outputs": [{ "name": "recipient", "type": "address" }, { "name": "amount", "type": "uint256" }, { "name": "description", "type": "string" }, { "name": "votingDeadline", "type": "uint256" }, { "name": "executed", "type": "bool" }, { "name": "proposalPassed", "type": "bool" }, { "name": "numberOfVotes", "type": "uint256" }, { "name": "currentResult", "type": "int256" }, { "name": "proposalHash", "type": "bytes32" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "p_Id", "type": "uint256" }], "name": "addProperty", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "s_Id", "type": "uint256" }], "name": "getStakeholder_Mission", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "stakeholdersGameData", "outputs": [{ "name": "name", "type": "bytes32" }, { "name": "character", "type": "bytes32" }, { "name": "exp", "type": "uint256" }, { "name": "totalExp", "type": "uint256" }, { "name": "landSize", "type": "uint256" }, { "name": "level", "type": "uint256" }, { "name": "stamina", "type": "uint256" }, { "name": "guardId", "type": "uint256" }, { "name": "propertyCount", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "u_Id", "type": "uint256" }, { "name": "sta", "type": "uint256" }], "name": "updateUserStamina", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "stakeholders", "outputs": [{ "name": "threshold", "type": "uint256" }, { "name": "fund", "type": "uint256" }, { "name": "id", "type": "uint256" }, { "name": "rate", "type": "uint256" }, { "name": "addr", "type": "address" }, { "name": "since", "type": "uint256" }, { "name": "farmerLevel", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "proposalNumber", "type": "uint256" }, { "name": "transactionBytecode", "type": "bytes" }], "name": "executeProposal", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "numProposals", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "getStakeholdersLength", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "debatingPeriodInMinutes", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "s_Id", "type": "uint256" }, { "name": "index", "type": "uint256" }], "name": "getPropertyId", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "minimumQuorum", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_value", "type": "uint256" }, { "name": "_token", "type": "address" }, { "name": "_extraData", "type": "bytes" }], "name": "receiveApproval", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "majorityMargin", "outputs": [{ "name": "", "type": "int256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "beneficiary", "type": "address" }, { "name": "etherAmount", "type": "uint256" }, { "name": "JobDescription", "type": "string" }, { "name": "transactionBytecode", "type": "bytes" }], "name": "newProposal", "outputs": [{ "name": "proposalID", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "targetStakeholder", "type": "address" }], "name": "removeStakeholder", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "minimumQuorumForProposals", "type": "uint256" }, { "name": "minutesForDebate", "type": "uint256" }, { "name": "marginOfVotesForMajority", "type": "int256" }], "name": "changeVotingRules", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "s_Id", "type": "uint256" }], "name": "getStakeholder", "outputs": [{ "name": "", "type": "bytes32" }, { "name": "", "type": "uint256" }, { "name": "", "type": "uint256" }, { "name": "", "type": "bytes32" }, { "name": "", "type": "uint256" }, { "name": "", "type": "uint256" }, { "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "proposalNumber", "type": "uint256" }, { "name": "supportsProposal", "type": "bool" }, { "name": "justificationText", "type": "string" }], "name": "vote", "outputs": [{ "name": "voteID", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "u_Id", "type": "uint256" }, { "name": "exp", "type": "uint256" }], "name": "updateUserExp", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "u_Id", "type": "uint256" }, { "name": "_landSize", "type": "uint256" }, { "name": "_level", "type": "uint256" }, { "name": "_exp", "type": "uint256" }], "name": "updateGameData", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "stakeholderId", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_threshold", "type": "uint256" }, { "name": "_fund", "type": "uint256" }, { "name": "_rate", "type": "uint256" }], "name": "addMember", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "proposalNumber", "type": "uint256" }, { "name": "beneficiary", "type": "address" }, { "name": "etherAmount", "type": "uint256" }, { "name": "transactionBytecode", "type": "bytes" }], "name": "checkProposalCode", "outputs": [{ "name": "codeChecksOut", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "s_Id", "type": "uint256" }], "name": "getStakeholderPropertyCount", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_name", "type": "bytes32" }, { "name": "_character", "type": "bytes32" }], "name": "initPlayerData", "outputs": [], "payable": false, "type": "function" }, { "inputs": [{ "name": "minimumQuorumForProposals", "type": "uint256" }, { "name": "minutesForDebate", "type": "uint256" }, { "name": "marginOfVotesForMajority", "type": "int256" }, { "name": "congressLeader", "type": "address" }], "payable": true, "type": "constructor" }, { "payable": true, "type": "fallback" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "proposalID", "type": "uint256" }, { "indexed": false, "name": "recipient", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }, { "indexed": false, "name": "description", "type": "string" }], "name": "ProposalAdded", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "proposalID", "type": "uint256" }, { "indexed": false, "name": "position", "type": "bool" }, { "indexed": false, "name": "voter", "type": "address" }, { "indexed": false, "name": "justification", "type": "string" }], "name": "Voted", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "proposalID", "type": "uint256" }, { "indexed": false, "name": "result", "type": "int256" }, { "indexed": false, "name": "quorum", "type": "uint256" }, { "indexed": false, "name": "active", "type": "bool" }], "name": "ProposalTallied", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "Stakeholder", "type": "address" }, { "indexed": false, "name": "isMember", "type": "bool" }], "name": "MembershipChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "minimumQuorum", "type": "uint256" }, { "indexed": false, "name": "debatingPeriodInMinutes", "type": "uint256" }, { "indexed": false, "name": "majorityMargin", "type": "int256" }], "name": "ChangeOfRules", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "", "type": "bytes32" }], "name": "addmember_test", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "", "type": "uint256" }], "name": "int_test", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "", "type": "uint256" }], "name": "int256_test", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "sender", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }], "name": "receivedEther", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "_from", "type": "address" }, { "indexed": false, "name": "_value", "type": "uint256" }, { "indexed": false, "name": "_token", "type": "address" }, { "indexed": false, "name": "_extraData", "type": "bytes" }], "name": "receivedTokens", "type": "event" }]);
CongressInstance = Congress.at(CongressAddr);                                                                          // 12
usingPropertyCode = "6060604052341561000c57fe5b604051602080613a9c833981016040528080519060200190919050505b80600660006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b505b6139bd806100df6000396000f300606060405236156101c0576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063149449d3146101c2578063160117b81461022257806317353dcd1461025657806332665ffb1461028a578063410cb3f81461031d578063458fea651461037657806351d2a3b2146103cf578063541f1d4f14610477578063614138d9146104b157806364969cf3146105035780636712f55f1461055e57806368dc61e0146105be5780636b59069a146105e45780636f006458146106565780637c04fc8f146106d057806385cd399f146107045780638acc1a8b146107725780638c8e6bc8146107a4578063991b4d6e146108105780639d0684dd14610839578063aa9f6c6714610ac0578063b1c4f0e814610ae9578063b597564514610b51578063bb7226af14610bb1578063bc43d06f14610c35578063c161f7bc14610c55578063c34eca9f14610c89578063cbd0950814610caf578063d0f2909514610cd8578063de2aad3614610db1578063e21789ae14610dee578063e584a8bd14610e5f578063eb29a01d14610ea4578063eef3921f14610f22578063f1607bf514610f42578063f4b41d4714610f68575bfe5b34156101ca57fe5b6101e06004808035906020019091905050611041565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561022a57fe5b6102406004808035906020019091905050611090565b6040518082815260200191505060405180910390f35b341561025e57fe5b6102746004808035906020019091905050611120565b6040518082815260200191505060405180910390f35b341561029257fe5b6102a8600480803590602001909190505061114f565b6040518087600019166000191681526020018681526020018581526020018481526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018260001916600019168152602001965050505050505060405180910390f35b341561032557fe5b61033b600480803590602001909190505061126f565b604051808560001916600019168152602001848152602001836000191660001916815260200182815260200194505050505060405180910390f35b341561037e57fe5b610394600480803590602001909190505061131b565b604051808581526020018460001916600019168152602001836000191660001916815260200182815260200194505050505060405180910390f35b34156103d757fe5b6103ed600480803590602001909190505061135b565b604051808a600019166000191681526020018981526020018881526020018781526020018681526020018573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018460001916600019168152602001838152602001828152602001995050505050505050505060405180910390f35b341561047f57fe5b6104af600480803560001916906020019091908035600019169060200190919080359060200190919050506113d9565b005b34156104b957fe5b6104c161144a565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561050b57fe5b61052a6004808035906020019091908035906020019091905050611475565b6040518084600019166000191681526020018381526020018260001916600019168152602001935050505060405180910390f35b341561056657fe5b61057c6004808035906020019091905050611514565b60405180866000191660001916815260200185815260200184815260200183600019166000191681526020018281526020019550505050505060405180910390f35b34156105c657fe5b6105ce6115eb565b6040518082815260200191505060405180910390f35b34156105ec57fe5b61064060048080356000191690602001909190803590602001909190803590602001909190803560001916906020019091908035906020019091908035906020019091908035906020019091905050611698565b6040518082815260200191505060405180910390f35b341561065e57fe5b6106ce60048080356000191690602001909190803590602001908201803590602001908080602002602001604051908101604052809392919081815260200183836020028082843782019150505050505091908035600019169060200190919080359060200190919050506119b5565b005b34156106d857fe5b6106ee6004808035906020019091905050611bd4565b6040518082815260200191505060405180910390f35b341561070c57fe5b6107226004808035906020019091905050611bf8565b604051808481526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001828152602001935050505060405180910390f35b341561077a57fe5b6107a26004808035906020019091908035906020019091908035906020019091905050611c9b565b005b34156107ac57fe5b61080e600480803590602001909190803590602001909190803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091905050611d76565b005b341561081857fe5b61083760048080359060200190919080359060200190919050506122bf565b005b341561084157fe5b6108576004808035906020019091905050612341565b604051808060200180602001806020018060200180602001806020018060200188810388528f8181518152602001915080519060200190602002808383600083146108c1575b8051825260208311156108c15760208201915060208101905060208303925061089d565b50505090500188810387528e818151815260200191508051906020019060200280838360008314610911575b805182526020831115610911576020820191506020810190506020830392506108ed565b50505090500188810386528d818151815260200191508051906020019060200280838360008314610961575b8051825260208311156109615760208201915060208101905060208303925061093d565b50505090500188810385528c8181518152602001915080519060200190602002808383600083146109b1575b8051825260208311156109b15760208201915060208101905060208303925061098d565b50505090500188810384528b818151815260200191508051906020019060200280838360008314610a01575b805182526020831115610a01576020820191506020810190506020830392506109dd565b50505090500188810383528a818151815260200191508051906020019060200280838360008314610a51575b805182526020831115610a5157602082019150602081019050602083039250610a2d565b505050905001888103825289818151815260200191508051906020019060200280838360008314610aa1575b805182526020831115610aa157602082019150602081019050602083039250610a7d565b5050509050019e50505050505050505050505050505060405180910390f35b3415610ac857fe5b610ae760048080359060200190919080359060200190919050506126a0565b005b3415610af157fe5b610b4f60048080359060200190919080356000191690602001909190803560001916906020019091908035600019169060200190919080356000191690602001909190803590602001909190803515159060200190919050506126ce565b005b3415610b5957fe5b610b6f60048080359060200190919050506128e2565b60405180866000191660001916815260200185815260200184815260200183600019166000191681526020018281526020019550505050505060405180910390f35b3415610bb957fe5b610bcf6004808035906020019091905050612928565b6040518086815260200185600019166000191681526020018473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018381526020018281526020019550505050505060405180910390f35b3415610c3d57fe5b610c536004808035906020019091905050612a43565b005b3415610c5d57fe5b610c736004808035906020019091905050612c32565b6040518082815260200191505060405180910390f35b3415610c9157fe5b610c99612d5b565b6040518082815260200191505060405180910390f35b3415610cb757fe5b610cd66004808035906020019091908035906020019091905050612d69565b005b3415610ce057fe5b610cf66004808035906020019091905050612dad565b604051808060200180602001838103835285818151815260200191508051906020019060200280838360008314610d4c575b805182526020831115610d4c57602082019150602081019050602083039250610d28565b505050905001838103825284818151815260200191508051906020019060200280838360008314610d9c575b805182526020831115610d9c57602082019150602081019050602083039250610d78565b50505090500194505050505060405180910390f35b3415610db957fe5b610dd86004808035906020019091908035906020019091905050612e97565b6040518082815260200191505060405180910390f35b3415610df657fe5b610e5d6004808035906020019091908035906020019091908035600019169060200190919080356000191690602001909190803560001916906020019091908035600019169060200190919080359060200190919080351515906020019091905050612f07565b005b3415610e6757fe5b610e866004808035906020019091908035906020019091905050613083565b60405180826000191660001916815260200191505060405180910390f35b3415610eac57fe5b610f20600480803590602001909190803590602001909190803590602001909190803590602001909190803590602001908201803590602001908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050919050506130cf565b005b3415610f2a57fe5b610f4060048080359060200190919050506133bc565b005b3415610f4a57fe5b610f526134e7565b6040518082815260200191505060405180910390f35b3415610f7057fe5b610f8660048080359060200190919050506134f5565b604051808060200180602001838103835285818151815260200191508051906020019060200280838360008314610fdc575b805182526020831115610fdc57602082019150602081019050602083039250610fb8565b50505090500183810382528481815181526020019150805190602001906020028083836000831461102c575b80518252602083111561102c57602082019150602081019050602083039250611008565b50505090500194505050505060405180910390f35b600060048281548110151561105257fe5b906000526020600020906009020160005b5060050160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690505b919050565b60007f8abc202c428b4ff626ba799f83938a413393019d1edc1556b59141eeced8afa76002838154811015156110c257fe5b906000526020600020906007020160005b50600201805490506040518082815260200191505060405180910390a16002828154811015156110ff57fe5b906000526020600020906007020160005b506002018054905090505b919050565b600060028281548110151561113157fe5b906000526020600020906007020160005b506001015490505b919050565b60006000600060006000600060048781548110151561116a57fe5b906000526020600020906009020160005b506000015460048881548110151561118f57fe5b906000526020600020906009020160005b50600201546004898154811015156111b457fe5b906000526020600020906009020160005b506003015460048a8154811015156111d957fe5b906000526020600020906009020160005b506004015460048b8154811015156111fe57fe5b906000526020600020906009020160005b5060050160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1660048c81548110151561124357fe5b906000526020600020906009020160005b50600601549550955095509550955095505b91939550919395565b600060006000600060018581548110151561128657fe5b906000526020600020906004020160005b50600101546001868154811015156112ab57fe5b906000526020600020906004020160005b50600001546001878154811015156112d057fe5b906000526020600020906004020160005b50600201546001888154811015156112f557fe5b906000526020600020906004020160005b506003015493509350935093505b9193509193565b60018181548110151561132a57fe5b906000526020600020906004020160005b915090508060000154908060010154908060020154908060030154905084565b60048181548110151561136a57fe5b906000526020600020906009020160005b915090508060000154908060010154908060020154908060030154908060040154908060050160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060060154908060070154908060080154905089565b60006000600180548091906001016113f191906135df565b915060018281548110151561140257fe5b906000526020600020906004020160005b50905084816001018160001916905550818160000181905550838160020181600019169055508281600301819055505b5050505050565b6000600660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690505b90565b60006000600060028581548110151561148a57fe5b906000526020600020906007020160005b50600001546002868154811015156114af57fe5b906000526020600020906007020160005b50600101546002878154811015156114d457fe5b906000526020600020906007020160005b50600401868154811015156114f657fe5b906000526020600020900160005b50549250925092505b9250925092565b6000600060006000600060028681548110151561152d57fe5b906000526020600020906007020160005b506000015460028781548110151561155257fe5b906000526020600020906007020160005b506001015460028881548110151561157757fe5b906000526020600020906007020160005b506003015460028981548110151561159c57fe5b906000526020600020906007020160005b506005015460028a8154811015156115c157fe5b906000526020600020906007020160005b5060060154945094509450945094505b91939590929450565b6000600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166368dc61e06000604051602001526040518163ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401809050602060405180830381600087803b151561167b57fe5b60325a03f1151561168857fe5b5050506040518051905090505b90565b6000600060006000600060019350600092505b6002805490508310156116fb576002838154811015156116c757fe5b906000526020600020906007020160005b50600101548714156116ed57600093506116fb565b5b82806001019350506116ab565b8315611759577f6e98a67d07b1236151193da1b1a71c35ff356fb2dfcb683e46f63b6abf4becef60405180807f50726f70657274792054797065204e6f7420466f756e64000000000000000000815250602001905060405180910390a15b6004805480919060010161176d9190613611565b9450600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663e0d371cc336000604051602001526040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001915050602060405180830381600087803b151561183157fe5b60325a03f1151561183e57fe5b505050604051805190509150600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166303b66f6383876040518363ffffffff167c01000000000000000000000000000000000000000000000000000000000281526004018083815260200182815260200192505050600060405180830381600087803b15156118df57fe5b60325a03f115156118ec57fe5b5050506004858154811015156118fe57fe5b906000526020600020906009020160005b5090508b8160000181600019169055508481600101819055508a8160030181905550428160020181905550898160040181905550338160050160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550888160060181600019169055508681600701819055508581600801819055505b50505050979650505050505050565b600060006000600060006000600280548091906001016119d59190613643565b9550600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166368dc61e06000604051602001526040518163ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401809050602060405180830381600087803b1515611a6557fe5b60325a03f11515611a7257fe5b505050604051805190509450600093505b84841015611ae657600286815481101515611a9a57fe5b906000526020600020906007020160005b506002018054806001018281611ac19190613675565b916000526020600020900160005b6000909190915055505b8380600101945050611a83565b600286815481101515611af557fe5b906000526020600020906007020160005b509250898360000181600019169055508583600101819055506000836003018190555088519150600090505b81811015611bb157600286815481101515611b4957fe5b906000526020600020906007020160005b506004018054806001018281611b7091906136a1565b916000526020600020900160005b8b84815181101515611b8c57fe5b90602001906020020151909190915090600019169055505b8080600101915050611b32565b878360050181600019169055508683600601819055505b50505050505050505050565b6000600560008381526020019081526020016000206000018054905090505b919050565b600060006000600484815481101515611c0d57fe5b906000526020600020906009020160005b5060070154600485815481101515611c3257fe5b906000526020600020906009020160005b5060050160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600486815481101515611c7757fe5b906000526020600020906009020160005b50600301549250925092505b9193909250565b3373ffffffffffffffffffffffffffffffffffffffff16600484815481101515611cc157fe5b906000526020600020906009020160005b5060050160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415611d6a5781600484815481101515611d2357fe5b906000526020600020906009020160005b506003018190555080600484815481101515611d4c57fe5b906000526020600020906009020160005b5060080181905550611d70565b60006000fd5b5b505050565b6000600060007fbe94f4bc9231183f4e52990fb4744cff4530314ce3425a3b0c4c281817b1955760405180905060405180910390a173__ballot.sol:StringUtils________________6346bdca9a856000604051602001526040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808060200180602001838103835284818151815260200191508051906020019080838360008314611e4d575b805182526020831115611e4d57602082019150602081019050602083039250611e29565b505050905090810190601f168015611e795780820380516001836020036101000a031916815260200191505b50838103825260068152602001807f7570646174650000000000000000000000000000000000000000000000000000815250602001935050505060206040518083038186803b1515611ec757fe5b60325a03f41515611ed457fe5b505050604051805190501561211457600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166368dc61e06000604051602001526040518163ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401809050602060405180830381600087803b1515611f7157fe5b60325a03f11515611f7e57fe5b505050604051805190509250600183039250600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663e0d371cc336000604051602001526040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001915050602060405180830381600087803b151561205257fe5b60325a03f1151561205f57fe5b5050506040518051905091508460028781548110151561207b57fe5b906000526020600020906007020160005b506002018381548110151561209d57fe5b906000526020600020900160005b50819055508285600185036002898154811015156120c557fe5b906000526020600020906007020160005b506003015402018115156120e657fe5b046002878154811015156120f657fe5b906000526020600020906007020160005b50600301819055506122b6565b73__ballot.sol:StringUtils________________6346bdca9a856000604051602001526040518263ffffffff167c01000000000000000000000000000000000000000000000000000000000281526004018080602001806020018381038352848181518152602001915080519060200190808383600083146121b6575b8051825260208311156121b657602082019150602081019050602083039250612192565b505050905090810190601f1680156121e25780820380516001836020036101000a031916815260200191505b50838103825260038152602001807f6e65770000000000000000000000000000000000000000000000000000000000815250602001935050505060206040518083038186803b151561223057fe5b60325a03f4151561223d57fe5b50505060405180519050156122b557600090505b858110156122b45760028181548110151561226857fe5b906000526020600020906007020160005b50600201805480600101828161228f9190613675565b916000526020600020900160005b6000909190915055505b8080600101915050612251565b5b5b5b505050505050565b6003600083815260200190815260200160002060000180548060010182816122e79190613675565b916000526020600020900160005b83909190915055506003600083815260200190815260200160002060010180548060010182816123259190613675565b916000526020600020900160005b6000909190915055505b5050565b6123496136cd565b6123516136e1565b6123596136e1565b6123616136e1565b6123696136e1565b6123716136cd565b6123796136f5565b60056000898152602001908152602001600020600001600560008a8152602001908152602001600020600101600560008b8152602001908152602001600020600201600560008c8152602001908152602001600020600301600560008d8152602001908152602001600020600401600560008e8152602001908152602001600020600501600560008f81526020019081526020016000206006018680548060200260200160405190810160405280929190818152602001828054801561245e57602002820191906000526020600020905b81548152602001906001019080831161244a575b50505050509650858054806020026020016040519081016040528092919081815260200182805480156124b457602002820191906000526020600020905b8154600019168152602001906001019080831161249c575b505050505095508480548060200260200160405190810160405280929190818152602001828054801561250a57602002820191906000526020600020905b815460001916815260200190600101908083116124f2575b505050505094508380548060200260200160405190810160405280929190818152602001828054801561256057602002820191906000526020600020905b81546000191681526020019060010190808311612548575b50505050509350828054806020026020016040519081016040528092919081815260200182805480156125b657602002820191906000526020600020905b8154600019168152602001906001019080831161259e575b505050505092508180548060200260200160405190810160405280929190818152602001828054801561260857602002820191906000526020600020905b8154815260200190600101908083116125f4575b505050505091508080548060200260200160405190810160405280929190818152602001828054801561267f57602002820191906000526020600020906000905b82829054906101000a900460ff161515815260200190600101906020826000010492830192600103820291508084116126495790505b5050505050905096509650965096509650965096505b919395979092949650565b806004838154811015156126b057fe5b906000526020600020906009020160005b50600301819055505b5050565b60006005600089815260200190815260200160002060000180548091906001016126f89190613709565b905080600560008a81526020019081526020016000206000018281548110151561271e57fe5b906000526020600020900160005b508190555060056000898152602001908152602001600020600101805480600101828161275991906136a1565b916000526020600020900160005b899091909150906000191690555060056000898152602001908152602001600020600201805480600101828161279d91906136a1565b916000526020600020900160005b88909190915090600019169055506005600089815260200190815260200160002060030180548060010182816127e191906136a1565b916000526020600020900160005b879091909150906000191690555060056000898152602001908152602001600020600401805480600101828161282591906136a1565b916000526020600020900160005b86909190915090600019169055506005600089815260200190815260200160002060050180548060010182816128699190613675565b916000526020600020900160005b85909190915055506005600089815260200190815260200160002060060180548060010182816128a79190613735565b91600052602060002090602091828204019190065b84909190916101000a81548160ff021916908315150217905550505b5050505050505050565b6002818154811015156128f157fe5b906000526020600020906007020160005b915090508060000154908060010154908060030154908060050154908060060154905085565b6000600060006000600060048681548110151561294157fe5b906000526020600020906009020160005b5060070154600260048881548110151561296857fe5b906000526020600020906009020160005b506007015481548110151561298a57fe5b906000526020600020906007020160005b50600001546004888154811015156129af57fe5b906000526020600020906009020160005b5060050160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166004898154811015156129f457fe5b906000526020600020906009020160005b506003015460048a815481101515612a1957fe5b906000526020600020906009020160005b5060080154945094509450945094505b91939590929450565b60006000612a4f6134e7565b1415612a5b5760006000fd5b600090505b600480549050811015612b8657600460018201815481101515612a7f57fe5b906000526020600020906009020160005b50600482815481101515612aa057fe5b906000526020600020906009020160005b5060008201548160000190600019169055600182015481600101556002820154816002015560038201548160030155600482015481600401556005820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168160050160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506006820154816006019060001916905560078201548160070155600882015481600801559050505b8080600101915050612a60565b6004600160048054905003815481101515612b9d57fe5b906000526020600020906009020160005b600082016000905560018201600090556002820160009055600382016000905560048201600090556005820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff021916905560068201600090556007820160009055600882016000905550506004805480919060019003612c2c9190613611565b505b5050565b60006000600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663e0d371cc336000604051602001526040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001915050602060405180830381600087803b1515612cf857fe5b60325a03f11515612d0557fe5b505050604051805190509050600283815481101515612d2057fe5b906000526020600020906007020160005b5060020181815481101515612d4257fe5b906000526020600020900160005b505491505b50919050565b600060028054905090505b90565b6003600083815260200190815260200160002060010181815481101515612d8c57fe5b906000526020600020900160005b81548092919060010191905055505b5050565b612db561376f565b612dbd61376f565b600060008481526020019081526020016000206002016000600085815260200190815260200160002060010181805480602002602001604051908101604052809291908181526020018280548015612e3457602002820191906000526020600020905b815481526020019060010190808311612e20575b5050505050915080805480602002602001604051908101604052809291908181526020018280548015612e8657602002820191906000526020600020905b815481526020019060010190808311612e72575b50505050509050915091505b915091565b60006002600484815481101515612eaa57fe5b906000526020600020906009020160005b5060070154815481101515612ecc57fe5b906000526020600020906007020160005b5060020182815481101515612eee57fe5b906000526020600020900160005b505490505b92915050565b85600560008a815260200190815260200160002060010188815481101515612f2b57fe5b906000526020600020900160005b50816000191690555084600560008a815260200190815260200160002060020188815481101515612f6657fe5b906000526020600020900160005b50816000191690555083600560008a815260200190815260200160002060030188815481101515612fa157fe5b906000526020600020900160005b50816000191690555082600560008a815260200190815260200160002060040188815481101515612fdc57fe5b906000526020600020900160005b50816000191690555081600560008a81526020019081526020016000206005018881548110151561301757fe5b906000526020600020900160005b508190555080600560008a81526020019081526020016000206006018881548110151561304e57fe5b90600052602060002090602091828204019190065b6101000a81548160ff0219169083151502179055505b5050505050505050565b600060028381548110151561309457fe5b906000526020600020906007020160005b50600401828154811015156130b657fe5b906000526020600020900160005b505490505b92915050565b73__ballot.sol:StringUtils________________6346bdca9a826000604051602001526040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808060200180602001838103835284818151815260200191508051906020019080838360008314613171575b8051825260208311156131715760208201915060208101905060208303925061314d565b505050905090810190601f16801561319d5780820380516001836020036101000a031916815260200191505b50838103825260048152602001807f6c616e6400000000000000000000000000000000000000000000000000000000815250602001935050505060206040518083038186803b15156131eb57fe5b60325a03f415156131f857fe5b50505060405180519050156132435781600060008781526020019081526020016000206002018581548110151561322b57fe5b906000526020600020900160005b50819055506133b4565b73__ballot.sol:StringUtils________________6346bdca9a826000604051602001526040518263ffffffff167c01000000000000000000000000000000000000000000000000000000000281526004018080602001806020018381038352848181518152602001915080519060200190808383600083146132e5575b8051825260208311156132e5576020820191506020810190506020830392506132c1565b505050905090810190601f1680156133115780820380516001836020036101000a031916815260200191505b50838103825260048152602001807f63726f7000000000000000000000000000000000000000000000000000000000815250602001935050505060206040518083038186803b151561335f57fe5b60325a03f4151561336c57fe5b50505060405180519050156133b35782600060008781526020019081526020016000206001018581548110151561339f57fe5b906000526020600020900160005b50819055505b5b5b5050505050565b60006000600083815260200190815260200160002060000180548091906001016133e69190613709565b90506000600083815260200190815260200160002060000180548060010182816134109190613675565b916000526020600020900160005b839091909150555060006000838152602001908152602001600020600201805480600101828161344e9190613783565b916000526020600020900160005b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff909190915055506000600083815260200190815260200160002060010180548060010182816134ac9190613783565b916000526020600020900160005b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff909190915055505b5050565b600060048054905090505b90565b6134fd6136cd565b6135056136cd565b60036000848152602001908152602001600020600001600360008581526020019081526020016000206001018180548060200260200160405190810160405280929190818152602001828054801561357c57602002820191906000526020600020905b815481526020019060010190808311613568575b50505050509150808054806020026020016040519081016040528092919081815260200182805480156135ce57602002820191906000526020600020905b8154815260200190600101908083116135ba575b50505050509050915091505b915091565b81548183558181151161360c5760040281600402836000526020600020918201910161360b91906137af565b5b505050565b81548183558181151161363e5760090281600902836000526020600020918201910161363d91906137ef565b5b505050565b8154818355818115116136705760070281600702836000526020600020918201910161366f9190613876565b5b505050565b81548183558181151161369c5781836000526020600020918201910161369b91906138de565b5b505050565b8154818355818115116136c8578183600052602060002091820191016136c79190613903565b5b505050565b602060405190810160405280600081525090565b602060405190810160405280600081525090565b602060405190810160405280600081525090565b8154818355818115116137305781836000526020600020918201910161372f91906138de565b5b505050565b81548183558181151161376a57601f016020900481601f0160209004836000526020600020918201910161376991906138de565b5b505050565b602060405190810160405280600081525090565b8154818355818115116137aa578183600052602060002091820191016137a99190613928565b5b505050565b6137ec91905b808211156137e85760006000820160009055600182016000905560028201600090556003820160009055506004016137b5565b5090565b90565b61387391905b8082111561386f576000600082016000905560018201600090556002820160009055600382016000905560048201600090556005820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff0219169055600682016000905560078201600090556008820160009055506009016137f5565b5090565b90565b6138db91905b808211156138d7576000600082016000905560018201600090556002820160006138a6919061394d565b60038201600090556004820160006138be919061396f565b600582016000905560068201600090555060070161387c565b5090565b90565b61390091905b808211156138fc5760008160009055506001016138e4565b5090565b90565b61392591905b80821115613921576000816000905550600101613909565b5090565b90565b61394a91905b8082111561394657600081600090555060010161392e565b5090565b90565b508054600082559060005260206000209081019061396b91906138de565b5b50565b508054600082559060005260206000209081019061398d9190613903565b5b505600a165627a7a7230582099b5a26a5ca3a9ff48b3448575868493bd815414a3c7cdc33269231638b802850029";
usingProperty = web3.eth.contract([{ "constant": true, "inputs": [{ "name": "p_Id", "type": "uint256" }], "name": "getPartialProperty", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "p_Id", "type": "uint256" }], "name": "getPropertyRatingLength", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "p_Id", "type": "uint256" }], "name": "getPropertyTypeId", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "p_Id", "type": "uint256" }], "name": "getProperty", "outputs": [{ "name": "", "type": "bytes32" }, { "name": "", "type": "uint256" }, { "name": "", "type": "uint256" }, { "name": "", "type": "uint256" }, { "name": "", "type": "address" }, { "name": "", "type": "bytes32" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "l_Id", "type": "uint256" }], "name": "getLandType", "outputs": [{ "name": "", "type": "bytes32" }, { "name": "", "type": "uint256" }, { "name": "", "type": "bytes32" }, { "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "landTypeList", "outputs": [{ "name": "id", "type": "uint256" }, { "name": "name", "type": "bytes32" }, { "name": "img", "type": "bytes32" }, { "name": "count", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "propertyList", "outputs": [{ "name": "name", "type": "bytes32" }, { "name": "id", "type": "uint256" }, { "name": "since", "type": "uint256" }, { "name": "propertyCount", "type": "uint256" }, { "name": "minUnit", "type": "uint256" }, { "name": "owner", "type": "address" }, { "name": "extraData", "type": "bytes32" }, { "name": "propertyType", "type": "uint256" }, { "name": "tradeable", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_name", "type": "bytes32" }, { "name": "_img", "type": "bytes32" }, { "name": "_count", "type": "uint256" }], "name": "addLandType", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "getCongressAddr", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "p_id", "type": "uint256" }, { "name": "cropStage", "type": "uint256" }], "name": "getPropertyType_forMission", "outputs": [{ "name": "", "type": "bytes32" }, { "name": "", "type": "uint256" }, { "name": "", "type": "bytes32" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "p_Id", "type": "uint256" }], "name": "getPropertyType", "outputs": [{ "name": "", "type": "bytes32" }, { "name": "", "type": "uint256" }, { "name": "", "type": "uint256" }, { "name": "", "type": "bytes32" }, { "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "getStakeholdersLength", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_name", "type": "bytes32" }, { "name": "_propertyCount", "type": "uint256" }, { "name": "_minUnit", "type": "uint256" }, { "name": "_extraData", "type": "bytes32" }, { "name": "_rating", "type": "uint256" }, { "name": "_type", "type": "uint256" }, { "name": "_tradeable", "type": "uint256" }], "name": "addProperty", "outputs": [{ "name": "_id", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_name", "type": "bytes32" }, { "name": "_img", "type": "bytes32[]" }, { "name": "_time", "type": "bytes32" }, { "name": "_harvestUnit", "type": "uint256" }], "name": "addPropertyType", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "u_Id", "type": "uint256" }], "name": "getCropListLength", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "p_Id", "type": "uint256" }], "name": "getProperty_MissionSubmit", "outputs": [{ "name": "", "type": "uint256" }, { "name": "", "type": "address" }, { "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_propertyCount", "type": "uint256" }, { "name": "_tradeable", "type": "uint256" }], "name": "updatePropertyCount", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "rate", "type": "uint256" }, { "name": "operation", "type": "string" }], "name": "updatePropertyTypeRating", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "u_Id", "type": "uint256" }, { "name": "p_Id", "type": "uint256" }], "name": "addUserPropertyType", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "u_Id", "type": "uint256" }], "name": "getCropList", "outputs": [{ "name": "", "type": "uint256[]" }, { "name": "", "type": "bytes32[]" }, { "name": "", "type": "bytes32[]" }, { "name": "", "type": "bytes32[]" }, { "name": "", "type": "bytes32[]" }, { "name": "", "type": "uint256[]" }, { "name": "", "type": "bool[]" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }, { "name": "_propertyCount", "type": "uint256" }], "name": "updatePropertyCount_MissionSubmit", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "u_Id", "type": "uint256" }, { "name": "_name", "type": "bytes32" }, { "name": "_img", "type": "bytes32" }, { "name": "_start", "type": "bytes32" }, { "name": "_end", "type": "bytes32" }, { "name": "_cropType", "type": "uint256" }, { "name": "_ripe", "type": "bool" }], "name": "addCropList", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "propertyTypeList", "outputs": [{ "name": "name", "type": "bytes32" }, { "name": "id", "type": "uint256" }, { "name": "averageRating", "type": "uint256" }, { "name": "time", "type": "bytes32" }, { "name": "harvestUnit", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "p_Id", "type": "uint256" }], "name": "getProperty_Shop", "outputs": [{ "name": "", "type": "uint256" }, { "name": "", "type": "bytes32" }, { "name": "", "type": "address" }, { "name": "", "type": "uint256" }, { "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "removeProperty", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "p_id", "type": "uint256" }], "name": "getPropertyTypeRating", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "getPropertyTypeLength", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "u_Id", "type": "uint256" }, { "name": "level", "type": "uint256" }], "name": "updateUserPropertyType", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "u_Id", "type": "uint256" }], "name": "getUserLandConfiguration", "outputs": [{ "name": "", "type": "int256[]" }, { "name": "", "type": "int256[]" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "p_Id", "type": "uint256" }, { "name": "s_Id", "type": "uint256" }], "name": "getPropertyRating", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "u_Id", "type": "uint256" }, { "name": "p_Id", "type": "uint256" }, { "name": "_name", "type": "bytes32" }, { "name": "_img", "type": "bytes32" }, { "name": "_start", "type": "bytes32" }, { "name": "_end", "type": "bytes32" }, { "name": "_cropType", "type": "uint256" }, { "name": "_ripe", "type": "bool" }], "name": "updateCropList", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "p_Id", "type": "uint256" }, { "name": "img_Id", "type": "uint256" }], "name": "getPropertyTypeImg", "outputs": [{ "name": "", "type": "bytes32" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "u_Id", "type": "uint256" }, { "name": "c_Id", "type": "uint256" }, { "name": "cropId", "type": "int256" }, { "name": "landId", "type": "int256" }, { "name": "operation", "type": "string" }], "name": "updateUserLandConfiguration", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "u_Id", "type": "uint256" }], "name": "addUserLandConfiguration", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "getPropertiesLength", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "u_Id", "type": "uint256" }], "name": "getUserPropertyType", "outputs": [{ "name": "", "type": "uint256[]" }, { "name": "", "type": "uint256[]" }], "payable": false, "type": "function" }, { "inputs": [{ "name": "_congressAddress", "type": "address" }], "payable": false, "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "", "type": "bytes32" }], "name": "propertyAdded", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "", "type": "bool" }], "name": "propertyTypeAdded", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "", "type": "uint256" }], "name": "propertyUpdated", "type": "event" }, { "anonymous": false, "inputs": [], "name": "updatedPropertiesCalled", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "", "type": "uint256" }], "name": "propertyNewed", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "", "type": "uint256" }], "name": "propertyInited", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "", "type": "uint256" }], "name": "propertyRatinglength_testing", "type": "event" }]);
usingPropertyInstance = usingProperty.at(usingPropertyAddr);                                                           // 15
MainActivityCode = "6060604052600360095534156200001257fe5b604051604080620020a3833981016040528080519060200190919080519060200190919050505b81600760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600860006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600660006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663ec935ada6000600060006040518463ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808481526020018381526020018281526020019350505050600060405180830381600087803b15156200022257fe5b60325a03f115156200023057fe5b5050506200029560007f4d6f64657261746f7200000000000000000000000000000000000000000000007f47756172640000000000000000000000000000000000000000000000000000006200029e6401000000000262000e9c176401000000009004565b5b50506200041b565b6000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663f46bba8d84846040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808360001916600019168152602001826000191660001916815260200192505050600060405180830381600087803b15156200034657fe5b60325a03f115156200035457fe5b505050600090505b60098110156200041457600660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663eef3921f856040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050600060405180830381600087803b1515620003f457fe5b60325a03f115156200040257fe5b5050505b80806001019150506200035c565b5b50505050565b611c78806200042b6000396000f300606060405236156100a2576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063077c83d6146100a45780630d09e9c7146100e057806319a8772314610114578063448514d5146101515780634768d4ef1461018b57806390ec5662146101bf578063a48e7f97146101ed578063bf7be69214610265578063d91a3c88146103b5578063f1607bf5146103de575bfe5b34156100ac57fe5b6100c26004808035906020019091905050610404565b60405180826000191660001916815260200191505060405180910390f35b34156100e857fe5b6100fe6004808035906020019091905050610a6e565b6040518082815260200191505060405180910390f35b341561011c57fe5b61013b6004808035906020019091908035906020019091905050610aa7565b6040518082815260200191505060405180910390f35b341561015957fe5b61018960048080359060200190919080356000191690602001909190803560001916906020019091905050610e9c565b005b341561019357fe5b6101a96004808035906020019091905050611013565b6040518082815260200191505060405180910390f35b34156101c757fe5b6101cf611041565b60405180826000191660001916815260200191505060405180910390f35b34156101f557fe5b61024b60048080359060200190919080359060200190820180359060200190808060200260200160405190810160405280939291908181526020018383602002808284378201915050505050509190505061156d565b604051808215151515815260200191505060405180910390f35b341561026d57fe5b6102fa600480803590602001908201803590602001908080602002602001604051908101604052809392919081815260200183836020028082843782019150505050505091908035906020019082018035906020019080806020026020016040519081016040528093929190818152602001838360200280828437820191505050505050919050506115ce565b604051808060200180602001838103835285818151815260200191508051906020019060200280838360008314610350575b8051825260208311156103505760208201915060208101905060208303925061032c565b5050509050018381038252848181518152602001915080519060200190602002808383600083146103a0575b8051825260208311156103a05760208201915060208101905060208303925061037c565b50505090500194505050505060405180910390f35b34156103bd57fe5b6103dc6004808035906020019091908035906020019091905050611748565b005b34156103e657fe5b6103ee611a88565b6040518082815260200191505060405180910390f35b60006000610410611b35565b610418611b49565b60006000600060006000600060006000600660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663f1607bf56000604051602001526040518163ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401809050602060405180830381600087803b15156104b657fe5b60325a03f115156104c357fe5b505050604051805190509a508a6040518059106104dd5750595b908082528060200260200182016040525b5099508a6040518059106104ff5750595b908082528060200260200182016040525b509850600097505b8a88101561073057600660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663149449d3896000604051604001526040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050604060405180830381600087803b15156105b657fe5b60325a03f115156105c357fe5b5050506040518051906020018051905096509650600660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663149449d38e6000604051604001526040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050604060405180830381600087803b151561066d57fe5b60325a03f1151561067a57fe5b50505060405180519060200180519050945094508c8814806106d557508473ffffffffffffffffffffffffffffffffffffffff168773ffffffffffffffffffffffffffffffffffffffff161480156106d457506004548814155b5b156106df57610723565b6106e98d89610aa7565b89898151811015156106f757fe5b9060200190602002018181525050878a8981518110151561071457fe5b90602001906020020181815250505b8780600101985050610518565b61073a898b6115ce565b809b50819a50505060009250600090505b8a81101561084e576107c48a8281518110151561076457fe5b9060200190602002015160008054806020026020016040519081016040528092919081815260200182805480156107ba57602002820191906000526020600020905b8154815260200190600101908083116107a6575b505050505061156d565b925082156107d45780915061084e565b821580156107e4575060018b0381145b15610840577f15263772101e2492477ebc827b016feaae825e0448fc62c6c090679efceacc6760405180905060405180910390a17f4661696c000000000000000000000000000000000000000000000000000000009b50610a5e565b5b808060010191505061074b565b600080548091906001016108629190611b5d565b50898281518110151561087157fe5b90602001906020020151600060026000815460010191905081905581548110151561089857fe5b906000526020600020900160005b5081905550600180548091906001016108bf9190611b89565b5088828151811015156108ce57fe5b9060200190602002015160016002548154811015156108e957fe5b906000526020600020900160005b50819055506004548a8381518110151561090d57fe5b906020019060200201511415610a3b577f8e4658573e812041d633f2131f90a61776b0ecc6dc545b7a5504c341e34000c560006001604051808060200180602001838103835285818154815260200191508054801561098b57602002820191906000526020600020905b815481526020019060010190808311610977575b505083810382528481815481526020019150805480156109ca57602002820191906000526020600020905b8154815260200190600101908083116109b6575b505094505050505060405180910390a17f29e99f07d14aa8d30a12fa0b0789b43183ba1bf6b4a72b95459a3e397cca10d76002546040518082815260200191505060405180910390a17f53756363657373000000000000000000000000000000000000000000000000009b50610a5e565b610a5b8a83815181101515610a4c57fe5b90602001906020020151610404565b505b5b5050505050505050505050919050565b60006000600060019150600090505b83811015610a99576002820291505b8080600101915050610a7d565b6064820292505b5050919050565b600060006000600060006000600660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663149449d3896000604051604001526040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050604060405180830381600087803b1515610b4957fe5b60325a03f11515610b5657fe5b5050506040518051906020018051905094509450600660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663de2aad3689600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663e0d371cc896000604051602001526040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001915050602060405180830381600087803b1515610c6b57fe5b60325a03f11515610c7857fe5b505050604051805190506000604051602001526040518363ffffffff167c01000000000000000000000000000000000000000000000000000000000281526004018083815260200182815260200192505050602060405180830381600087803b1515610ce057fe5b60325a03f11515610ced57fe5b505050604051805190509250600660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663de2aad3688600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663e0d371cc896000604051602001526040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001915050602060405180830381600087803b1515610dfa57fe5b60325a03f11515610e0757fe5b505050604051805190506000604051602001526040518363ffffffff167c01000000000000000000000000000000000000000000000000000000000281526004018083815260200182815260200192505050602060405180830381600087803b1515610e6f57fe5b60325a03f11515610e7c57fe5b50505060405180519050915082820390508095505b505050505092915050565b6000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663f46bba8d84846040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808360001916600019168152602001826000191660001916815260200192505050600060405180830381600087803b1515610f4357fe5b60325a03f11515610f5057fe5b505050600090505b600981101561100c57600660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663eef3921f856040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050600060405180830381600087803b1515610fee57fe5b60325a03f11515610ffb57fe5b5050505b8080600101915050610f58565b5b50505050565b600a8181548110151561102257fe5b906000526020600020906003020160005b915090508060000154905081565b6000600061104d611b49565b611055611b35565b61105d611b35565b60006000600060006000600660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663f1607bf56000604051602001526040518163ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401809050602060405180830381600087803b15156110f557fe5b60325a03f1151561110257fe5b5050506040518051905098508860405180591061111c5750595b908082528060200260200182016040525b5097508860405180591061113e5750595b908082528060200260200182016040525b509650886040518059106111605750595b908082528060200260200182016040525b50955060006000816111839190611b5d565b5060006001816111939190611b89565b50600094505b8885101561143457600660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663149449d3866000604051604001526040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050604060405180830381600087803b151561123757fe5b60325a03f1151561124457fe5b5050506040518051906020018051905093509350600660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663de2aad3686600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663e0d371cc886000604051602001526040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001915050602060405180830381600087803b151561135957fe5b60325a03f1151561136657fe5b505050604051805190506000604051602001526040518363ffffffff167c01000000000000000000000000000000000000000000000000000000000281526004018083815260200182815260200192505050602060405180830381600087803b15156113ce57fe5b60325a03f115156113db57fe5b50505060405180519050915081830390508088868151811015156113fb57fe5b906020019060200201818152505084878681518110151561141857fe5b90602001906020020181815250505b8480600101955050611199565b61143e88886115ce565b8097508199505050886040518059106114545750595b908082528060200260200182016040525b506003908051906020019061147b929190611bb5565b5085600081518110151561148b57fe5b906020019060200201516004819055507fe8caaaa4a0d5c9d15947ae3564cfdd394ffeaf5b1a87465c5a14104815beaec56004546040518082815260200191505060405180910390a16000600281905550600080548091906001016114f09190611b5d565b50600454600060025481548110151561150557fe5b906000526020600020900160005b50819055506001805480919060010161152c9190611b89565b506000600160025481548110151561154057fe5b906000526020600020900160005b508190555061155e600454610404565b99505b50505050505050505090565b60006000600090505b82518110156115c257828181518110151561158d57fe5b90602001906020020151841480156115a6575060008114155b156115b457600091506115c7565b5b8080600101915050611576565b600191505b5092915050565b6115d6611b49565b6115de611b35565b60006000600060006000600094505b8851851015611735578493506001850192505b885183101561165157888481518110151561161757fe5b90602001906020020151898481518110151561162f57fe5b906020019060200201511315611643578293505b5b8280600101935050611600565b888581518110151561165f57fe5b906020019060200201519150888481518110151561167957fe5b90602001906020020151898681518110151561169157fe5b90602001906020020181815250508189858151811015156116ae57fe5b906020019060200201818152505087858151811015156116ca57fe5b90602001906020020151905087848151811015156116e457fe5b9060200190602002015188868151811015156116fc57fe5b906020019060200201818152505080888581518110151561171957fe5b90602001906020020181815250505b84806001019550506115ed565b8888965096505b50505050509250929050565b600060006000600060006000600060006000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663c98516298c600060405160e001526040518263ffffffff167c01000000000000000000000000000000000000000000000000000000000281526004018082815260200191505060e060405180830381600087803b15156117f057fe5b60325a03f115156117fd57fe5b50505060405180519060200180519060200180519060200180519060200180519060200180519060200180519050985098509850985098509850985060018401935061184884610a6e565b91508187039750600060058581151561185d57fe5b0614156119c557600185019450600660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166317353dcd60095486028c016000604051602001526040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050602060405180830381600087803b151561190657fe5b60325a03f1151561191357fe5b505050604051805190509050600660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663991b4d6e8c836040518363ffffffff167c01000000000000000000000000000000000000000000000000000000000281526004018083815260200182815260200192505050600060405180830381600087803b15156119b457fe5b60325a03f115156119c157fe5b5050505b600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663df9cd8cb8c87878c6040518563ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180858152602001848152602001838152602001828152602001945050505050600060405180830381600087803b1515611a6a57fe5b60325a03f11515611a7757fe5b5050505b5050505050505050505050565b6000600660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663f1607bf56000604051602001526040518163ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401809050602060405180830381600087803b1515611b1857fe5b60325a03f11515611b2557fe5b5050506040518051905090505b90565b602060405190810160405280600081525090565b602060405190810160405280600081525090565b815481835581811511611b8457818360005260206000209182019101611b839190611c02565b5b505050565b815481835581811511611bb057818360005260206000209182019101611baf9190611c27565b5b505050565b828054828255906000526020600020908101928215611bf1579160200282015b82811115611bf0578251825591602001919060010190611bd5565b5b509050611bfe9190611c02565b5090565b611c2491905b80821115611c20576000816000905550600101611c08565b5090565b90565b611c4991905b80821115611c45576000816000905550600101611c2d565b5090565b905600a165627a7a72305820974494e8b9b00adf298595fbab8430403bf3f6c4f527a6568805682207df01000029";
MainActivity = web3.eth.contract([{ "constant": false, "inputs": [{ "name": "visitNode", "type": "uint256" }], "name": "findVisitNode", "outputs": [{ "name": "", "type": "bytes32" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "_level", "type": "uint256" }], "name": "levelCap", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "visitNode", "type": "uint256" }, { "name": "i", "type": "uint256" }], "name": "returnPriority", "outputs": [{ "name": "", "type": "int256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "s_Id", "type": "uint256" }, { "name": "_name", "type": "bytes32" }, { "name": "_character", "type": "bytes32" }], "name": "initGameData", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "matches", "outputs": [{ "name": "id", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "findOrigin", "outputs": [{ "name": "success", "type": "bytes32" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "elem", "type": "uint256" }, { "name": "data", "type": "uint256[]" }], "name": "checkExist", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "priorityList", "type": "int256[]" }, { "name": "visitList", "type": "uint256[]" }], "name": "sort", "outputs": [{ "name": "", "type": "int256[]" }, { "name": "", "type": "uint256[]" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "u_Id", "type": "uint256" }, { "name": "random", "type": "uint256" }], "name": "playerLevelUp", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "getPropertiesLength", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "inputs": [{ "name": "_congressAddress", "type": "address" }, { "name": "_propertyAddress", "type": "address" }], "payable": false, "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "id", "type": "uint256[]" }, { "indexed": false, "name": "priority", "type": "int256[]" }], "name": "matchSuccess", "type": "event" }, { "anonymous": false, "inputs": [], "name": "matchFail", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "", "type": "uint256" }], "name": "test", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "", "type": "uint256" }], "name": "returnOrigin", "type": "event" }]);
MainActivityInstance = MainActivity.at(MainActivityAddr);                                                              // 18
GameCoreCode = "60606040523461000057604051604080611190833981016040528080519060200190919080519060200190919050505b81600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b50505b6110068061018a6000396000f30060606040523615610097576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680631f3e87c61461009c578063244b19fe146100cd57806345d5432d146100ea578063a1247b571461010d578063bb4d011014610166578063c34eca9f14610195578063cc9dfedd146101b8578063d3fc80f914610208578063eb2b94b514610246575b610000565b34610000576100b76004808035906020019091905050610298565b6040518082815260200191505060405180910390f35b34610000576100e860048080359060200190919050506102c7565b005b34610000576100f76107c5565b6040518082815260200191505060405180910390f35b346100005761012860048080359060200190919050506107d3565b604051808681526020018560001916600019168152602001848152602001838152602001821515151581526020019550505050505060405180910390f35b34610000576101936004808035906020019091908035906020019091908035906020019091905050610823565b005b34610000576101a2610914565b6040518082815260200191505060405180910390f35b34610000576101dc60048080359060200190919080359060200190919050506109bb565b604051808481526020018360001916600019168152602001828152602001935050505060405180910390f35b34610000576102446004808035600019169060200190919080359060200190919080359060200190919080351515906020019091905050610b17565b005b34610000576102616004808035906020019091905050610e12565b6040518085600019166000191681526020018481526020018381526020018215151515815260200194505050505060405180910390f35b6000600082815481101561000057906000526020600020906008020160005b506006018054905090505b919050565b6000600060006000600060006000600060006000600060006102e88d610298565b9b50600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663f1607bf56000604051602001526040518163ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401809050602060405180830381600087803b156100005760325a03f11561000057505050604051805190509a50600099505b8b8a101561057d576103a28d8b6109bb565b985098509850600095505b8a86101561056f57600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166385cd399f876000604051606001526040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050606060405180830381600087803b156100005760325a03f11561000057505050604051805190602001805190602001805190509450945094503373ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff161480156104a857508885145b1561056157868303915060008210151561056057600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663aa9f6c6787846040518363ffffffff167c01000000000000000000000000000000000000000000000000000000000281526004018083815260200182815260200192505050600060405180830381600087803b156100005760325a03f1156100005750505061056f565b5b5b85806001019650506103ad565b5b89806001019a5050610390565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663e0d371cc336000604051602001526040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001915050602060405180830381600087803b156100005760325a03f115610000575050506040518051905090507fc84dabcf2f66674d288267aa8d2fc25e3d9efa76e3b2b54c8cfbb3d12bd4759660008e815481101561000057906000526020600020906008020160005b506004018281548110156100005790600052602060002090602091828204019190065b9054906101000a900460ff16604051808215151515815260200191505060405180910390a1600160008e815481101561000057906000526020600020906008020160005b506004018281548110156100005790600052602060002090602091828204019190065b6101000a81548160ff0219169083151502179055507fc84dabcf2f66674d288267aa8d2fc25e3d9efa76e3b2b54c8cfbb3d12bd4759660008e815481101561000057906000526020600020906008020160005b506004018281548110156100005790600052602060002090602091828204019190065b9054906101000a900460ff16604051808215151515815260200191505060405180910390a15b50505050505050505050505050565b600060008054905090505b90565b600081815481101561000057906000526020600020906008020160005b915090508060000154908060010154908060020154908060030154908060050160009054906101000a900460ff16905085565b6000600084815481101561000057906000526020600020906008020160005b5090508060060180548060010182818154818355818115116108905781836000526020600020918201910161088f91905b8082111561088b576000816000905550600101610873565b5090565b5b505050916000526020600020900160005b85909190915055508060070180548060010182818154818355818115116108f4578183600052602060002091820191016108f391905b808211156108ef5760008160009055506001016108d7565b5090565b5b505050916000526020600020900160005b84909190915055505b50505050565b6000600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663c34eca9f6000604051602001526040518163ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401809050602060405180830381600087803b156100005760325a03f115610000575050506040518051905090505b90565b6000600060006000600060006000600089815481101561000057906000526020600020906008020160005b509350600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166364969cf3856006018a815481101561000057906000526020600020900160005b505460036000604051606001526040518363ffffffff167c01000000000000000000000000000000000000000000000000000000000281526004018083815260200182815260200192505050606060405180830381600087803b156100005760325a03f11561000057505050604051805190602001805190602001805190509250925092508360060188815481101561000057906000526020600020900160005b505483856007018a815481101561000057906000526020600020900160005b50549650965096505b505050509250925092565b6000600060006000600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166368dc61e06000604051602001526040518163ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401809050602060405180830381600087803b156100005760325a03f1156100005750505060405180519050935060008054809190600101815481835581811511610cf657600802816008028360005260206000209182019101610cf591905b80821115610cf1576000600082016000905560018201600090556002820160009055600382016000905560048201805460008255601f016020900490600052602060002090810190610c5c91905b80821115610c58576000816000905550600101610c40565b5090565b5b506005820160006101000a81549060ff02191690556006820180546000825590600052602060002090810190610cab91905b80821115610ca7576000816000905550600101610c8f565b5090565b5b506007820180546000825590600052602060002090810190610ce691905b80821115610ce2576000816000905550600101610cca565b5090565b5b5050600801610bf2565b5090565b5b5050509250600083815481101561000057906000526020600020906008020160005b509150600090505b83811015610dc357816004018054806001018281815481835581811511610d8157601f016020900481601f01602090048360005260206000209182019101610d8091905b80821115610d7c576000816000905550600101610d64565b5090565b5b50505091600052602060002090602091828204019190065b6000909190916101000a81548160ff021916908315150217905550505b8080600101915050610d20565b82826000018190555087826001018160001916905550868260020181905550858260030181905550848260050160006101000a81548160ff0219169083151502179055505b5050505050505050565b600060006000600060006000600087815481101561000057906000526020600020906008020160005b509150600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663e0d371cc336000604051602001526040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001915050602060405180830381600087803b156100005760325a03f11561000057505050604051805190509050600087815481101561000057906000526020600020906008020160005b5060050160009054906101000a900460ff1615610f9257816001015482600201548360030154846004018481548110156100005790600052602060002090602091828204019190065b9054906101000a900460ff169550955095509550610fd1565b60006103e760017f656d7074795f6d697373696f6e000000000000000000000000000000000000009291908292508191509550955095509550610fd1565b5b505091935091935600a165627a7a723058209e568e82c4419d093662af441e31a0cb49439dfb783a64bf0051f4dd2eb573890029";
GameCore = web3.eth.contract([{ "constant": true, "inputs": [{ "name": "mId", "type": "uint256" }], "name": "getMissionItemsLength", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "mId", "type": "uint256" }], "name": "submitMission", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "getMissionsLength", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "MissionList", "outputs": [{ "name": "id", "type": "uint256" }, { "name": "name", "type": "bytes32" }, { "name": "exp", "type": "uint256" }, { "name": "lvl_limitation", "type": "uint256" }, { "name": "missionStatus", "type": "bool" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "mId", "type": "uint256" }, { "name": "_cropId", "type": "uint256" }, { "name": "_quantity", "type": "uint256" }], "name": "addMissionItem", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "getPropertyTypeLength", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "mId", "type": "uint256" }, { "name": "itemId", "type": "uint256" }], "name": "getMissionItems", "outputs": [{ "name": "", "type": "uint256" }, { "name": "", "type": "bytes32" }, { "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_name", "type": "bytes32" }, { "name": "_exp", "type": "uint256" }, { "name": "_lvl_limitation", "type": "uint256" }, { "name": "_missionStatus", "type": "bool" }], "name": "addMission", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "mId", "type": "uint256" }], "name": "getMission", "outputs": [{ "name": "", "type": "bytes32" }, { "name": "", "type": "uint256" }, { "name": "", "type": "uint256" }, { "name": "", "type": "bool" }], "payable": false, "type": "function" }, { "inputs": [{ "name": "_congressAddress", "type": "address" }, { "name": "_usingPropertyInstanceAddress", "type": "address" }], "payable": false, "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "", "type": "bool" }], "name": "status", "type": "event" }]);
GameCoreInstance = GameCore.at(GameCoreAddr);                                                                          // 21
                                                                                                                       //
ActivityInterfaceCode = "6060604052341561000c57fe5b604051604080610a0a833981016040528080519060200190919080519060200190919050505b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555081600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b50505b61083c806101ce6000396000f30060606040526000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680631450c7d11461005c578063269a619d146100c3578063299ea05014610196578063d8dbeff8146101ce575bfe5b341561006457fe5b6100a26004808035906020019091908035600019169060200190919080359060200190919080359060200190919080359060200190919050506101f4565b60405180831515151581526020018281526020019250505060405180910390f35b34156100cb57fe5b6100e160048080359060200190919050506103d7565b604051808b81526020018a73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200189815260200188600019166000191681526020018781526020018681526020018581526020018481526020018381526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019a505050505050505050505060405180910390f35b341561019e57fe5b6101b460048080359060200190919050506104a5565b604051808215151515815260200191505060405180910390f35b34156101d657fe5b6101de610722565b6040518082815260200191505060405180910390f35b600060006005805480919060010161020c9190610730565b9050610140604051908101604052808281526020013373ffffffffffffffffffffffffffffffffffffffff16815260200188815260200187600019168152602001868152602001868152602001428152602001848152602001428152602001600073ffffffffffffffffffffffffffffffffffffffff1681525060058281548110151561029557fe5b90600052602060002090600a020160005b506000820151816000015560208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060408201518160020155606082015181600301906000191690556080820151816004015560a0820151816005015560c0820151816006015560e0820151816007015561010082015181600801556101208201518160090160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055509050507fc2c1af3ea88836d81cd60be9ffd4f35c8510b1c2ecbfad52c3d99de1f1f6bce16001604051808215151515815260200191505060405180910390a15b9550959350505050565b6000600060006000600060006000600060006000600060058c8154811015156103fc57fe5b90600052602060002090600a020160005b50905080600001548160010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1682600201548360030154846004015485600501548660060154876007015488600801548960090160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169a509a509a509a509a509a509a509a509a509a505b509193959799509193959799565b6000600060006104b3610722565b14156104be57610000565b600090505b60016005805490500381101561064d576005600182018154811015156104e557fe5b90600052602060002090600a020160005b5060058281548110151561050657fe5b90600052602060002090600a020160005b50600082015481600001556001820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600282015481600201556003820154816003019060001916905560048201548160040155600582015481600501556006820154816006015560078201548160070155600882015481600801556009820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168160090160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055509050505b80806001019150506104c3565b600560016005805490500381548110151561066457fe5b90600052602060002090600a020160005b60008201600090556001820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff021916905560028201600090556003820160009055600482016000905560058201600090556006820160009055600782016000905560088201600090556009820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690555050600580548091906001900361071a9190610730565b505b50919050565b600060058054905090505b90565b81548183558181151161075d57600a0281600a02836000526020600020918201910161075c9190610762565b5b505050565b61080d91905b8082111561080957600060008201600090556001820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff021916905560028201600090556003820160009055600482016000905560058201600090556006820160009055600782016000905560088201600090556009820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff021916905550600a01610768565b5090565b905600a165627a7a72305820cf55707abfeaa85acb87fa6e64b57b3d0c76b82113291966b1fc1d07d1d17d6a0029";
                                                                                                                       //
ActivityInterface = web3.eth.contract([{ "constant": false, "inputs": [{ "name": "_propertyId", "type": "uint256" }, { "name": "_name", "type": "bytes32" }, { "name": "_startingPrice", "type": "uint256" }, { "name": "_currentPrice", "type": "uint256" }, { "name": "_closeDate", "type": "uint256" }], "name": "addBidding", "outputs": [{ "name": "success", "type": "bool" }, { "name": "_id", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "queryBidding", "outputs": [{ "name": "", "type": "uint256" }, { "name": "", "type": "address" }, { "name": "", "type": "uint256" }, { "name": "", "type": "bytes32" }, { "name": "", "type": "uint256" }, { "name": "", "type": "uint256" }, { "name": "", "type": "uint256" }, { "name": "", "type": "uint256" }, { "name": "", "type": "uint256" }, { "name": "", "type": "address" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "removeBidding", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "getBiddingListLength", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "inputs": [{ "name": "_congressAddress", "type": "address" }, { "name": "_propertyAddress", "type": "address" }], "payable": false, "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "", "type": "bool" }], "name": "biddingAdded", "type": "event" }]);
ActivityInterfaceInstance = ActivityInterface.at(ActivityInterfaceAddr);                                               // 26
                                                                                                                       //
StringUtilsCode = "6060604052341561000c57fe5b5b6108a98061001c6000396000f30060606040526000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680633a96fdd71461005157806346bdca9a146100fa5780638a0807b7146101a7575bfe5b6100e4600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091905050610250565b6040518082815260200191505060405180910390f35b61018d600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190505061051d565b604051808215151515815260200191505060405180910390f35b61023a600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091905050610535565b6040518082815260200191505060405180910390f35b600061025a610869565b610262610869565b6000600086935085925083519150818351101561027e57825191505b600090505b818110156104c357828181518110151561029957fe5b9060200101517f010000000000000000000000000000000000000000000000000000000000000090047f0100000000000000000000000000000000000000000000000000000000000000027effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916848281518110151561031457fe5b9060200101517f010000000000000000000000000000000000000000000000000000000000000090047f0100000000000000000000000000000000000000000000000000000000000000027effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff191610156103af577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff9450610513565b82818151811015156103bd57fe5b9060200101517f010000000000000000000000000000000000000000000000000000000000000090047f0100000000000000000000000000000000000000000000000000000000000000027effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916848281518110151561043857fe5b9060200101517f010000000000000000000000000000000000000000000000000000000000000090047f0100000000000000000000000000000000000000000000000000000000000000027effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff191611156104b45760019450610513565b5b5b8080600101915050610283565b8251845110156104f5577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff9450610513565b8251845111156105085760019450610513565b60009450610513565b5b5b5050505092915050565b6000600061052b8484610250565b1490505b92915050565b600061053f610869565b610547610869565b60006000869350859250600184511080610562575060018351105b8061056e575083518351115b1561059b577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff945061085f565b6fffffffffffffffffffffffffffffffff845111156105dc577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff945061085f565b60009150600090505b8351811015610835578260008151811015156105fd57fe5b9060200101517f010000000000000000000000000000000000000000000000000000000000000090047f0100000000000000000000000000000000000000000000000000000000000000027effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916848281518110151561067857fe5b9060200101517f010000000000000000000000000000000000000000000000000000000000000090047f0100000000000000000000000000000000000000000000000000000000000000027effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916141561082757600191505b82518210801561070257508351828201105b80156108035750828281518110151561071757fe5b9060200101517f010000000000000000000000000000000000000000000000000000000000000090047f0100000000000000000000000000000000000000000000000000000000000000027effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19168483830181518110151561079457fe5b9060200101517f010000000000000000000000000000000000000000000000000000000000000090047f0100000000000000000000000000000000000000000000000000000000000000027effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b156108155781806001019250506106f0565b82518214156108265780945061085f565b5b5b80806001019150506105e5565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff945061085f565b5b5b5050505092915050565b6020604051908101604052806000815250905600a165627a7a7230582032720090a16e9cc2d71070780b78ba51bfc73690bb629c2630b709c254a7cf510029";
                                                                                                                       //
StringUtils = web3.eth.contract([{ "constant": false, "inputs": [{ "name": "_a", "type": "string" }, { "name": "_b", "type": "string" }], "name": "compare", "outputs": [{ "name": "", "type": "int256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_a", "type": "string" }, { "name": "_b", "type": "string" }], "name": "equal", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_haystack", "type": "string" }, { "name": "_needle", "type": "string" }], "name": "indexOf", "outputs": [{ "name": "", "type": "int256" }], "payable": false, "type": "function" }]);
                                                                                                                       //
StringUtilsInstance = StringUtils.at(StringUtilsAddr);                                                                 // 32
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"init.js":["meteor/session",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/lib/init.js                                                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var Session;module.import('meteor/session',{"Session":function(v){Session=v}});                                        // 1
                                                                                                                       //
var currentAccount = 0;                                                                                                // 3
                                                                                                                       //
var cropTypeList = [{                                                                                                  // 5
    id: 0,                                                                                                             // 7
    name: "Carrot",                                                                                                    // 8
    img: ["carrot_seed", "carrot_grow", "carrot_harvest", "carrot"],                                                   // 9
    count: 0,                                                                                                          // 10
    time: "0.0.0.3"                                                                                                    // 11
                                                                                                                       //
}, {                                                                                                                   // 6
    id: 1,                                                                                                             // 15
    name: "Radish",                                                                                                    // 16
    img: ["radish_seed", "radish_grow", "radish_harvest", "radish"],                                                   // 17
    count: 0,                                                                                                          // 18
    time: "0.0.0.30"                                                                                                   // 19
                                                                                                                       //
}, {                                                                                                                   // 14
    id: 2,                                                                                                             // 23
    name: "Lettuce",                                                                                                   // 24
    img: ["lettuce_seed", "lettuce_grow", "lettuce_harvest", "lettuce"],                                               // 25
    count: 0,                                                                                                          // 26
    time: "0.0.10.0"                                                                                                   // 27
                                                                                                                       //
}, {                                                                                                                   // 22
    id: 3,                                                                                                             // 31
    name: "Cauliflower",                                                                                               // 32
    img: ["cauliflower_seed", "cauliflower_grow", "cauliflower_harvest", "cauliflower"],                               // 33
    count: 0,                                                                                                          // 34
    time: "0.0.0.10"                                                                                                   // 35
                                                                                                                       //
}];                                                                                                                    // 30
                                                                                                                       //
var landTypeList = [{                                                                                                  // 41
    id: 0,                                                                                                             // 43
    name: "Dirt",                                                                                                      // 44
    img: "land",                                                                                                       // 45
    count: 0                                                                                                           // 46
}, {                                                                                                                   // 42
    id: 1,                                                                                                             // 49
    name: "Water",                                                                                                     // 50
    img: "pond",                                                                                                       // 51
    count: 0                                                                                                           // 52
                                                                                                                       //
}];                                                                                                                    // 48
                                                                                                                       //
function init(event) {                                                                                                 // 59
    web3.eth.getAccounts(function (err, accs) {                                                                        // 60
        if (err != null) {                                                                                             // 61
            alert("There was an error fetching your accounts.");                                                       // 62
            return;                                                                                                    // 63
        }                                                                                                              // 64
                                                                                                                       //
        if (accs.length == 0) {                                                                                        // 66
            alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");               // 67
            return;                                                                                                    // 68
        }                                                                                                              // 69
                                                                                                                       //
        accounts = accs;                                                                                               // 71
        account = accounts[0];                                                                                         // 72
        //alert(account)                                                                                               // 73
    });                                                                                                                // 74
}                                                                                                                      // 75
                                                                                                                       //
function initGameConfig() {                                                                                            // 78
    for (var i = 0; i < cropTypeList.length; i++) {                                                                    // 79
        usingPropertyInstance.addPropertyType(cropTypeList[i].name, cropTypeList[i].img, cropTypeList[i].time, cropTypeList[i].count, { from: web3.eth.accounts[currentAccount], gas: 2000000 });
    }                                                                                                                  // 81
                                                                                                                       //
    for (var i = 0; i < landTypeList.length; i++) {                                                                    // 83
        usingPropertyInstance.addLandType(landTypeList[i].name, landTypeList[i].img, landTypeList[i].count, { from: web3.eth.accounts[currentAccount], gas: 2000000 });
    }                                                                                                                  // 86
    console.log("Init Complete");                                                                                      // 87
}                                                                                                                      // 89
                                                                                                                       //
window.onload = function () {                                                                                          // 91
    init();                                                                                                            // 92
    Session.set('currentAccount', currentAccount);                                                                     // 93
    //initGameConfig();                                                                                                // 94
};                                                                                                                     // 96
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"routes.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/lib/routes.js                                                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// index                                                                                                               // 1
                                                                                                                       //
Router.route('/', function () {                                                                                        // 3
  this.render('index');                                                                                                // 4
});                                                                                                                    // 5
                                                                                                                       //
Router.route('/manage', function () {                                                                                  // 8
  this.render('manage');                                                                                               // 9
});                                                                                                                    // 10
                                                                                                                       //
Router.route('/update', function () {                                                                                  // 12
  this.render('updateData');                                                                                           // 13
});                                                                                                                    // 14
                                                                                                                       //
Router.route('/switch', function () {                                                                                  // 16
  this.render('switchStakeholder');                                                                                    // 17
});                                                                                                                    // 18
                                                                                                                       //
Router.route('/aboutus', function () {                                                                                 // 20
  this.render('aboutUs');                                                                                              // 21
});                                                                                                                    // 22
                                                                                                                       //
Router.route('/transaction', function () {                                                                             // 24
  this.render('transaction');                                                                                          // 25
});                                                                                                                    // 26
                                                                                                                       //
//game                                                                                                                 // 29
                                                                                                                       //
Router.route('/game', function () {                                                                                    // 31
  this.render('gameIndex');                                                                                            // 32
});                                                                                                                    // 33
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"game.js":["meteor/tracker","meteor/session",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/game.js                                                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var Tracker;module.import('meteor/tracker',{"Tracker":function(v){Tracker=v}});var Session;module.import('meteor/session',{"Session":function(v){Session=v}});
                                                                                                                       // 2
                                                                                                                       //
var landSize = 3;                                                                                                      // 5
var blockSize = 150;                                                                                                   // 6
var landSrc = "/img/game/land.svg";                                                                                    // 7
                                                                                                                       //
var prefix = "/img/game/";                                                                                             // 9
var postfix = ".svg";                                                                                                  // 10
                                                                                                                       //
var currentCropId;                                                                                                     // 12
var plantMode = false;                                                                                                 // 13
var currentLandId;                                                                                                     // 14
var placeMode = false;                                                                                                 // 15
var currentCropLand;                                                                                                   // 16
var audio;                                                                                                             // 17
                                                                                                                       //
var s_Id;                                                                                                              // 19
                                                                                                                       //
var _dep = new Tracker.Dependency();                                                                                   // 22
var cursorX;                                                                                                           // 23
var cursorY;                                                                                                           // 24
                                                                                                                       //
var panelCounter = 2,                                                                                                  // 26
    panelCount = 3;                                                                                                    // 26
                                                                                                                       //
var cropList = [];                                                                                                     // 28
var harvestCropList = [];                                                                                              // 29
var landList = [];                                                                                                     // 30
                                                                                                                       //
var staminaList = { crop: 5, steal: 5 };                                                                               // 32
                                                                                                                       //
var currentUser = {};                                                                                                  // 34
                                                                                                                       //
var userLandConfiguration = [];                                                                                        // 37
                                                                                                                       //
var otherUserLandConfiguration = [];                                                                                   // 39
                                                                                                                       //
var otherUser = {                                                                                                      // 41
    id: 0,                                                                                                             // 43
    address: "0x0101010101",                                                                                           // 44
                                                                                                                       //
    name: "bill",                                                                                                      // 46
    exp: 0,                                                                                                            // 47
    totalExp: 0,                                                                                                       // 48
    type: "Thief",                                                                                                     // 49
    landSize: 5,                                                                                                       // 50
    level: 0,                                                                                                          // 51
    stamina: 100,                                                                                                      // 52
    guardId: null,                                                                                                     // 53
    thiefId: null                                                                                                      // 54
                                                                                                                       //
};                                                                                                                     // 42
                                                                                                                       //
var cropTypeList = [];                                                                                                 // 58
                                                                                                                       //
var landTypeList = [];                                                                                                 // 60
                                                                                                                       //
///////////////////////////                                                                                            // 63
//  prototype functions  //                                                                                            // 64
///////////////////////////                                                                                            // 65
                                                                                                                       //
Date.prototype.addTime = function (days, hours, minutes, seconds) {                                                    // 67
    //var dat = new Date(this.valueOf());                                                                              // 68
    var dat = new Date();                                                                                              // 69
                                                                                                                       //
    dat.setDate(dat.getDate() + days);                                                                                 // 71
    dat.setHours(dat.getHours() + hours);                                                                              // 72
    dat.setMinutes(dat.getMinutes() + minutes);                                                                        // 73
    dat.setSeconds(dat.getSeconds() + seconds);                                                                        // 74
                                                                                                                       //
    return dat;                                                                                                        // 76
};                                                                                                                     // 77
                                                                                                                       //
/////////////////                                                                                                      // 79
//  onCreated  //                                                                                                      // 80
/////////////////                                                                                                      // 81
                                                                                                                       //
Template.gameIndex.created = function () {                                                                             // 83
    currentAccount = Session.get('currentAccount');                                                                    // 84
                                                                                                                       //
    s_Id = CongressInstance.stakeholderId.call(web3.eth.accounts[currentAccount], { from: web3.eth.accounts[currentAccount] });
    s_Id = s_Id.c[0];                                                                                                  // 90
    getUserData(s_Id);                                                                                                 // 91
    getLandConfiguration(s_Id);                                                                                        // 92
    loadCropList(s_Id);                                                                                                // 93
                                                                                                                       //
    fetchGameInitConfig();                                                                                             // 95
    console.log(cropTypeList);                                                                                         // 96
    // Tracker.autorun(() => {                                                                                         // 97
    //   Meteor.subscribe('characterList', { userName: Session.get('userName') });                                     // 98
    // });                                                                                                             // 99
                                                                                                                       //
                                                                                                                       //
    // Template.registerHelper('characterList',function(input){                                                        // 103
    //     return Session.get("userName");                                                                             // 104
    // });                                                                                                             // 105
                                                                                                                       //
    loading(1);                                                                                                        // 107
                                                                                                                       //
    audio = new Audio('/music/background_music.mp3');                                                                  // 109
    //audio.play();                                                                                                    // 110
                                                                                                                       //
    // for (var i = 0 ; i < currentUser.landSize*currentUser.landSize ; i++){                                          // 112
    //     userLandConfiguration.push(                                                                                 // 113
    //       {                                                                                                         // 114
    //           id: i,                                                                                                // 115
    //           land: null,                                                                                           // 116
    //           crop:null                                                                                             // 117
    //       }                                                                                                         // 118
    //     );                                                                                                          // 119
    // }                                                                                                               // 120
    //                                                                                                                 // 121
    for (var i = 0; i < otherUser.landSize * otherUser.landSize; i++) {                                                // 122
        otherUserLandConfiguration.push({                                                                              // 123
            id: i,                                                                                                     // 125
            land: Math.floor(Math.random() * landTypeList.length),                                                     // 126
            crop: Math.floor(Math.random() * cropTypeList.length)                                                      // 127
                                                                                                                       //
        });                                                                                                            // 124
    }                                                                                                                  // 132
};                                                                                                                     // 136
                                                                                                                       //
//////////////////                                                                                                     // 138
//  onRendered  //                                                                                                     // 139
//////////////////                                                                                                     // 140
                                                                                                                       //
Template.gameIndex.rendered = function () {                                                                            // 142
    if (!this._rendered) {                                                                                             // 143
                                                                                                                       //
        updateUserExp(0);                                                                                              // 145
        updateStaminaBar(0);                                                                                           // 146
                                                                                                                       //
        initCropLand(currentAccount);                                                                                  // 148
                                                                                                                       //
        Session.set('userName', currentUser.name);                                                                     // 150
        Session.set('userExp', currentUser.exp);                                                                       // 151
        Session.set('userSta', currentUser.sta);                                                                       // 152
        Session.set('userCharacter', currentUser.type);                                                                // 153
                                                                                                                       //
        //farmObjectLoader();                                                                                          // 155
                                                                                                                       //
        setInterval(cropSummaryUpdate, 1000);                                                                          // 157
        setInterval(updateUserStamina, 1000 * 60);                                                                     // 158
                                                                                                                       //
        //initCropLand(otherUser, otherUserLandConfiguration);                                                         // 160
        console.log('gameArea render complete');                                                                       // 161
                                                                                                                       //
        loading(0);                                                                                                    // 163
    }                                                                                                                  // 164
};                                                                                                                     // 165
                                                                                                                       //
Template.shop.rendered = function () {                                                                                 // 167
    var stakeholder_length = CongressInstance.getStakeholdersLength.call({ from: web3.eth.accounts[currentAccount] });
    var select = $('<select>></select>');                                                                              // 169
    for (i = 0; i < stakeholder_length; i++) {                                                                         // 170
        var stakeholder_info = CongressInstance.getStakeholder.call(i, { from: web3.eth.accounts[currentAccount] });   // 171
        option = $('<option>', {                                                                                       // 172
            value: i,                                                                                                  // 173
            text: hex2a(stakeholder_info[0])                                                                           // 174
        });                                                                                                            // 172
        select.append(option);                                                                                         // 176
    }                                                                                                                  // 177
    select.on('change', function () {                                                                                  // 178
        currentAccount = $(this).val();                                                                                // 179
        set_propertyType_table();                                                                                      // 180
    });                                                                                                                // 181
    $('.shop_header').append(select);                                                                                  // 182
};                                                                                                                     // 183
                                                                                                                       //
///////////////                                                                                                        // 186
//  Helpers  //                                                                                                        // 187
///////////////                                                                                                        // 188
                                                                                                                       //
var activated_account = 2;                                                                                             // 190
var account_index;                                                                                                     // 191
property_log = [];                                                                                                     // 192
user_property = [];                                                                                                    // 193
property_database = [];                                                                                                // 194
display_field = [];                                                                                                    // 195
//for testing                                                                                                          // 196
//currentAccount = activated_account;                                                                                  // 197
//for testing                                                                                                          // 198
Template.shop.helpers({});                                                                                             // 199
                                                                                                                       //
Template.characterList.helpers({                                                                                       // 203
    userName: function () {                                                                                            // 204
        function userName() {                                                                                          // 204
            return Session.get('userName');                                                                            // 205
        }                                                                                                              // 206
                                                                                                                       //
        return userName;                                                                                               // 204
    }(),                                                                                                               // 204
    userExp: function () {                                                                                             // 207
        function userExp() {                                                                                           // 207
            return Session.get('userExp');                                                                             // 208
        }                                                                                                              // 209
                                                                                                                       //
        return userExp;                                                                                                // 207
    }(),                                                                                                               // 207
    characterType: function () {                                                                                       // 210
        function characterType() {                                                                                     // 210
            return Session.get('userCharacter');                                                                       // 211
        }                                                                                                              // 212
                                                                                                                       //
        return characterType;                                                                                          // 210
    }()                                                                                                                // 210
});                                                                                                                    // 203
                                                                                                                       //
Template.statusList.helpers({                                                                                          // 215
    crops: function () {                                                                                               // 216
        function crops() {                                                                                             // 216
                                                                                                                       //
            var cropsData = [];                                                                                        // 218
                                                                                                                       //
            for (var i = 0; i < cropTypeList.length; i++) {                                                            // 220
                var data = cropTypeList[i];                                                                            // 221
                                                                                                                       //
                //console.log(data);                                                                                   // 223
                cropsData.push({                                                                                       // 224
                    "name": "crop property" + data.id,                                                                 // 225
                    "img": prefix + data.img[3] + postfix,                                                             // 226
                    "content": data.name                                                                               // 227
                });                                                                                                    // 224
            }                                                                                                          // 229
            return cropsData;                                                                                          // 230
        }                                                                                                              // 231
                                                                                                                       //
        return crops;                                                                                                  // 216
    }(),                                                                                                               // 216
    cropsSummary: function () {                                                                                        // 232
        function cropsSummary() {                                                                                      // 232
            var cropsData = [];                                                                                        // 233
                                                                                                                       //
            for (var i = 0; i < cropList.length; i++) {                                                                // 235
                if (cropList[i].name == 0) {                                                                           // 236
                    continue;                                                                                          // 237
                }                                                                                                      // 238
                var data = cropList[i];                                                                                // 239
                                                                                                                       //
                //console.log(data);                                                                                   // 241
                cropsData.push({                                                                                       // 242
                    "id": "currentCrop" + data.id,                                                                     // 243
                    "name": data.name,                                                                                 // 244
                    "img": prefix + data.img + postfix,                                                                // 245
                    "timeLeft": null                                                                                   // 246
                });                                                                                                    // 242
            }                                                                                                          // 248
                                                                                                                       //
            _dep.depend();                                                                                             // 250
            return cropsData;                                                                                          // 251
        }                                                                                                              // 255
                                                                                                                       //
        return cropsSummary;                                                                                           // 232
    }(),                                                                                                               // 232
    lands: function () {                                                                                               // 256
        function lands() {                                                                                             // 256
                                                                                                                       //
            var landsData = [];                                                                                        // 258
                                                                                                                       //
            for (var i = 0; i < landTypeList.length; i++) {                                                            // 260
                var data = landTypeList[i];                                                                            // 261
                                                                                                                       //
                //console.log(data);                                                                                   // 263
                landsData.push({                                                                                       // 264
                    "name": "cropLand farmLand" + data.id,                                                             // 265
                    "img": prefix + data.img + postfix,                                                                // 266
                    "content": data.name                                                                               // 267
                });                                                                                                    // 264
            }                                                                                                          // 269
            return landsData;                                                                                          // 270
        }                                                                                                              // 271
                                                                                                                       //
        return lands;                                                                                                  // 256
    }()                                                                                                                // 256
});                                                                                                                    // 215
                                                                                                                       //
//////////////                                                                                                         // 275
//  Events  //                                                                                                         // 276
//////////////                                                                                                         // 277
                                                                                                                       //
Template.shop.events({                                                                                                 // 279
    'click #btn_show_property': function () {                                                                          // 280
        function clickBtn_show_property() {                                                                            // 280
            set_propertyType_table();                                                                                  // 281
        }                                                                                                              // 282
                                                                                                                       //
        return clickBtn_show_property;                                                                                 // 280
    }(),                                                                                                               // 280
    'click #btn_shop_close': function () {                                                                             // 283
        function clickBtn_shop_close() {                                                                               // 283
            $('.property_shop').css('display', 'none');                                                                // 284
        }                                                                                                              // 285
                                                                                                                       //
        return clickBtn_shop_close;                                                                                    // 283
    }(),                                                                                                               // 283
    'click #btn_shop_add': function () {                                                                               // 286
        function clickBtn_shop_add() {                                                                                 // 286
            CongressInstance.initPlayerData('John', 'Guard', { from: web3.eth.accounts[0], gas: 2000000 });            // 287
            CongressInstance.addMember(10, 1000, 1, { from: web3.eth.accounts[0], gas: 2000000 });                     // 288
            CongressInstance.initPlayerData('Bryant', 'Guard', { from: web3.eth.accounts[1], gas: 2000000 });          // 289
            CongressInstance.addMember(10, 1000, 1, { from: web3.eth.accounts[1], gas: 2000000 });                     // 290
            CongressInstance.initPlayerData('Claire', 'Thief', { from: web3.eth.accounts[2], gas: 2000000 });          // 291
            CongressInstance.addMember(10, 1000, 1, { from: web3.eth.accounts[2], gas: 2000000 });                     // 292
            CongressInstance.initPlayerData('Po-Wei', 'Thief', { from: web3.eth.accounts[3], gas: 2000000 });          // 293
            CongressInstance.addMember(10, 1000, 1, { from: web3.eth.accounts[3], gas: 2000000 });                     // 294
            CongressInstance.initPlayerData('Ping', 'Guard', { from: web3.eth.accounts[4], gas: 2000000 });            // 295
            CongressInstance.addMember(10, 1000, 1, { from: web3.eth.accounts[4], gas: 2000000 });                     // 296
            CongressInstance.initPlayerData('Chi', 'Thief', { from: web3.eth.accounts[5], gas: 2000000 });             // 297
            CongressInstance.addMember(10, 1000, 1, { from: web3.eth.accounts[5], gas: 2000000 });                     // 298
            CongressInstance.initPlayerData('Nina', 'Guard', { from: web3.eth.accounts[6], gas: 2000000 });            // 299
            CongressInstance.addMember(10, 1000, 1, { from: web3.eth.accounts[6], gas: 2000000 });                     // 300
            CongressInstance.initPlayerData('Jackie', 'Thief', { from: web3.eth.accounts[7], gas: 2000000 });          // 301
            CongressInstance.addMember(10, 1000, 1, { from: web3.eth.accounts[7], gas: 2000000 });                     // 302
            CongressInstance.initPlayerData('Charlie', 'Guard', { from: web3.eth.accounts[8], gas: 2000000 });         // 303
            CongressInstance.addMember(10, 1000, 1, { from: web3.eth.accounts[8], gas: 2000000 });                     // 304
                                                                                                                       //
            usingPropertyInstance.addPropertyType('Carrot', ["carrot_seed", "carrot_grow", "carrot_harvest", "carrot"], '0.0.0.10', 4, { from: web3.eth.accounts[currentAccount], gas: 2000000 });
            usingPropertyInstance.addPropertyType('Radish', ["radish_seed", "radish_grow", "radish_harvest", "radish"], '0.0.0.30', 4, { from: web3.eth.accounts[currentAccount], gas: 2000000 });
            usingPropertyInstance.addPropertyType('Lettuce', ["lettuce_seed", "lettucet_grow", "lettuce_harvest", "lettuce"], '0.0.10.0', 4, { from: web3.eth.accounts[currentAccount], gas: 2000000 });
            usingPropertyInstance.addPropertyType('Cauliflower', ["cauliflower_seed", "cauliflower_grow", "cauliflower_harvest", "cauliflower"], '0.0.0.10', 4, { from: web3.eth.accounts[currentAccount], gas: 2000000 });
                                                                                                                       //
            usingPropertyInstance.addProperty('Carrot', 4, 1, '', 0, 0, 0, { from: web3.eth.accounts[0], gas: 2000000 });
            usingPropertyInstance.addProperty('Radish', 4, 1, '', 0, 1, 0, { from: web3.eth.accounts[0], gas: 2000000 });
            usingPropertyInstance.addProperty('Lettuce', 3, 1, '', 0, 2, 0, { from: web3.eth.accounts[0], gas: 2000000 });
            usingPropertyInstance.addProperty('Cauliflower', 3, 1, '', 0, 3, 0, { from: web3.eth.accounts[0], gas: 2000000 });
            usingPropertyInstance.addProperty('Carrot', 8, 1, '', 0, 0, 0, { from: web3.eth.accounts[1], gas: 2000000 });
            usingPropertyInstance.addProperty('Radish', 5, 1, '', 0, 1, 0, { from: web3.eth.accounts[1], gas: 2000000 });
            usingPropertyInstance.addProperty('Lettuce', 9, 1, '', 0, 2, 0, { from: web3.eth.accounts[1], gas: 2000000 });
            usingPropertyInstance.addProperty('Cauliflower', 10, 1, '', 0, 3, 0, { from: web3.eth.accounts[1], gas: 2000000 });
            usingPropertyInstance.addProperty('Carrot', 10, 1, '', 0, 0, 0, { from: web3.eth.accounts[2], gas: 2000000 });
            usingPropertyInstance.addProperty('Radish', 9, 1, '', 0, 1, 0, { from: web3.eth.accounts[2], gas: 2000000 });
            usingPropertyInstance.addProperty('Lettuce', 7, 1, '', 0, 2, 0, { from: web3.eth.accounts[2], gas: 2000000 });
            usingPropertyInstance.addProperty('Cauliflower', 6, 1, '', 0, 3, 0, { from: web3.eth.accounts[2], gas: 2000000 });
            usingPropertyInstance.addProperty('Carrot', 14, 1, '', 0, 0, 0, { from: web3.eth.accounts[3], gas: 2000000 });
            usingPropertyInstance.addProperty('Radish', 14, 1, '', 0, 1, 0, { from: web3.eth.accounts[3], gas: 2000000 });
            usingPropertyInstance.addProperty('Lettuce', 13, 1, '', 0, 2, 0, { from: web3.eth.accounts[3], gas: 2000000 });
            usingPropertyInstance.addProperty('Cauliflower', 13, 1, '', 0, 3, 0, { from: web3.eth.accounts[3], gas: 2000000 });
            usingPropertyInstance.addProperty('Carrot', 1, 1, '', 0, 0, 0, { from: web3.eth.accounts[4], gas: 2000000 });
            usingPropertyInstance.addProperty('Radish', 2, 1, '', 0, 1, 0, { from: web3.eth.accounts[4], gas: 2000000 });
            usingPropertyInstance.addProperty('Lettuce', 3, 1, '', 0, 2, 0, { from: web3.eth.accounts[4], gas: 2000000 });
            usingPropertyInstance.addProperty('Cauliflower', 4, 1, '', 0, 3, 0, { from: web3.eth.accounts[4], gas: 2000000 });
            //var id = usingPropertyInstance.gets_id.call({ from: web3.eth.accounts[currentAccount], gas: 2000000 });  // 333
            //alert(id);                                                                                               // 334
        }                                                                                                              // 335
                                                                                                                       //
        return clickBtn_shop_add;                                                                                      // 286
    }(),                                                                                                               // 286
    'click #btn_property_tradeable': function () {                                                                     // 336
        function clickBtn_property_tradeable() {                                                                       // 336
            set_property_table();                                                                                      // 337
        }                                                                                                              // 338
                                                                                                                       //
        return clickBtn_property_tradeable;                                                                            // 336
    }()                                                                                                                // 336
});                                                                                                                    // 279
                                                                                                                       //
Template.gameIndex.events({                                                                                            // 342
    'click .cropObject': function () {                                                                                 // 343
        function clickCropObject(event) {                                                                              // 343
            // var left = $(event.target).position().left;                                                             // 344
            // var top = $(event.target).position().top;                                                               // 345
            if (currentCropId != null && plantMode) {                                                                  // 346
                var _landId = currentCropLand.split("cropLand")[1];                                                    // 347
                                                                                                                       //
                if (userLandConfiguration[_landId].crop != -1) {                                                       // 350
                    alert("Don't plant twice !");                                                                      // 351
                    return;                                                                                            // 352
                } else if (userLandConfiguration[_landId].land == -1) {                                                // 353
                    alert("You need a land first !");                                                                  // 354
                    return;                                                                                            // 355
                } else if (currentUser.sta < staminaList["crop"]) {                                                    // 356
                    alert("not enough stamina");                                                                       // 357
                    return;                                                                                            // 358
                }                                                                                                      // 359
                                                                                                                       //
                cropTypeList[currentCropId].count++;                                                                   // 361
                updateStaminaBar(staminaList["crop"]);                                                                 // 362
                                                                                                                       //
                var styles = {                                                                                         // 364
                    'z-index': "2",                                                                                    // 365
                    'opacity': 1                                                                                       // 366
                };                                                                                                     // 364
                $(".cropObject").clone().attr("class", "croppedObject croppedObject" + cropList.length).appendTo(".surfaceObject").css(styles);
                                                                                                                       //
                //var start = Date.now();                                                                              // 370
                var start = new Date();                                                                                // 371
                var end = new Date();                                                                                  // 372
                                                                                                                       //
                var cropWaitingTime = cropTypeList[currentCropId].time.split(".");                                     // 374
                                                                                                                       //
                end = end.addTime(parseInt(cropWaitingTime[0]), parseInt(cropWaitingTime[1]), parseInt(cropWaitingTime[2]), parseInt(cropWaitingTime[3]));
                                                                                                                       //
                var _id = cropList.length;                                                                             // 378
                                                                                                                       //
                //userLandConfiguration[_landId].crop = cropTypeList[currentCropId].id;                                // 380
                userLandConfiguration[_landId].crop = _id;                                                             // 381
                usingPropertyInstance.updateUserLandConfiguration(s_Id, _landId, _id, 0, 'crop', { from: web3.eth.accounts[currentAccount], gas: 2000000 });
                                                                                                                       //
                usingPropertyInstance.addCropList(s_Id, cropTypeList[currentCropId].name, cropTypeList[currentCropId].img[3], start, end, parseInt(cropTypeList[currentCropId].id), 0, { from: web3.eth.accounts[currentAccount], gas: 2000000 });
                cropList.push({                                                                                        // 385
                    id: _id,                                                                                           // 386
                    name: cropTypeList[currentCropId].name,                                                            // 387
                    img: cropTypeList[currentCropId].img[3],                                                           // 388
                    start: start,                                                                                      // 389
                    end: end,                                                                                          // 390
                    type: cropTypeList[currentCropId].id,                                                              // 391
                    ripe: 0                                                                                            // 392
                });                                                                                                    // 385
                //console.log(cropList);                                                                               // 394
                _dep.changed();                                                                                        // 395
                                                                                                                       //
                console.log(userLandConfiguration);                                                                    // 397
                console.log(cropList);                                                                                 // 398
            } else {                                                                                                   // 400
                alert("Specify Crop first");                                                                           // 401
                return;                                                                                                // 402
            }                                                                                                          // 403
        }                                                                                                              // 407
                                                                                                                       //
        return clickCropObject;                                                                                        // 343
    }(),                                                                                                               // 343
    'click .farmObject': function () {                                                                                 // 408
        function clickFarmObject(event) {                                                                              // 408
            if (currentLandId != null && placeMode) {                                                                  // 409
                var _landId = currentCropLand.split("cropLand")[1];                                                    // 410
                                                                                                                       //
                if (userLandConfiguration[_landId].land != -1) {                                                       // 412
                    alert("Don't plant twice !");                                                                      // 413
                    return;                                                                                            // 414
                }                                                                                                      // 415
                landTypeList[currentLandId].count++;                                                                   // 416
                currentCropLand = currentCropLand.split(" ")[1];                                                       // 417
                $(".farmObject").children().clone().appendTo("." + currentCropLand).css({ opacity: 1 });               // 418
                $("." + currentCropLand).css({ "border-style": "none" });                                              // 419
                var _id = landList.length;                                                                             // 420
                userLandConfiguration[_landId].land = landTypeList[currentLandId].id;                                  // 421
                usingPropertyInstance.updateUserLandConfiguration(s_Id, _landId, -1, landTypeList[currentLandId].id, 'land', { from: web3.eth.accounts[currentAccount], gas: 2000000 });
                                                                                                                       //
                landList.push({                                                                                        // 424
                    id: _id,                                                                                           // 425
                    name: landTypeList[currentLandId].name,                                                            // 426
                    img: landTypeList[currentLandId].img                                                               // 427
                });                                                                                                    // 424
                                                                                                                       //
                console.log(userLandConfiguration);                                                                    // 430
                console.log(cropList);                                                                                 // 431
            } else {                                                                                                   // 432
                alert("Specify Land first");                                                                           // 433
                return;                                                                                                // 434
            }                                                                                                          // 435
        }                                                                                                              // 436
                                                                                                                       //
        return clickFarmObject;                                                                                        // 408
    }(),                                                                                                               // 408
    'click .croppedObject': function () {                                                                              // 437
        function clickCroppedObject(event) {                                                                           // 437
            // var left = $(event.target).position().left;                                                             // 438
            // var top = $(event.target).position().top;                                                               // 439
            var id, cropClass;                                                                                         // 440
            if (event.target.className == "") {                                                                        // 441
                cropClass = $(event.target).parent().prop('className').split(" ")[1];                                  // 442
                id = cropClass.split("croppedObject")[1];                                                              // 443
            } else {                                                                                                   // 444
                cropClass = event.target.className.split(" ")[1];                                                      // 445
                id = cropClass.split("croppedObject")[1];                                                              // 446
            }                                                                                                          // 448
            if (cropList[id].ripe) {                                                                                   // 449
                                                                                                                       //
                $(".animationImg").html("<img src = '" + prefix + cropTypeList[cropList[id].type].img[3] + postfix + "' />");
                //var exp = cropTypeList[cropList[id].type].exp;                                                       // 452
                                                                                                                       //
                var difference = elapsedTime(cropList[id].start, cropList[id].end);                                    // 454
                var exp = difference / (1000 * 30) * 20;                                                               // 455
                updateUserExp(exp);                                                                                    // 456
                $(".scoreObject").html("+" + exp + "XP");                                                              // 457
            } else {                                                                                                   // 458
                alert("Patience is a virtue <3");                                                                      // 459
                return;                                                                                                // 460
            }                                                                                                          // 461
                                                                                                                       //
            var landTop = $(".land").position().top;                                                                   // 463
            var landLeft = $(".land").position().left;                                                                 // 464
                                                                                                                       //
            var areaLeft = $(".gamingArea").position().left;                                                           // 466
                                                                                                                       //
            var divHeight = $(".farmObject").height() / 5;                                                             // 468
            var divWidth = $(".farmObject").width() / 4;                                                               // 469
                                                                                                                       //
            var temp = $(".animationObject").clone().attr("class", "animationTemp").appendTo(".canvas");               // 471
            temp.css({ display: "inline", top: cursorY - divHeight, left: cursorX - areaLeft + divWidth });            // 472
            temp.addClass("animationTempShow");                                                                        // 473
                                                                                                                       //
            setTimeout(function () {                                                                                   // 475
                temp.css({ opacity: 0, transform: "translateY(0px)" });                                                // 476
                setTimeout(function () {                                                                               // 477
                    temp.css({ display: "none" });                                                                     // 478
                    temp.remove();                                                                                     // 479
                }, 1000);                                                                                              // 480
            }, 1000);                                                                                                  // 481
                                                                                                                       //
            harvestCropList.push(cropList[id]);                                                                        // 483
                                                                                                                       //
            var configId;                                                                                              // 485
            for (var i = 0; i < userLandConfiguration.length; i++) {                                                   // 486
                if (userLandConfiguration[i].crop == id) {                                                             // 487
                    userLandConfiguration[i].crop = -1;                                                                // 488
                    configId = i;                                                                                      // 489
                }                                                                                                      // 490
            }                                                                                                          // 491
                                                                                                                       //
            usingPropertyInstance.updateUserLandConfiguration(s_Id, configId, -1, 0, 'crop', { from: web3.eth.accounts[currentAccount], gas: 2000000 });
                                                                                                                       //
            cropList[id].name = 0;                                                                                     // 495
            cropList[id].img = 0;                                                                                      // 496
            cropList[id].start = 0;                                                                                    // 497
            cropList[id].end = 0;                                                                                      // 498
            cropList[id].cropType = 0;                                                                                 // 499
            cropList[id].ripe = 0;                                                                                     // 500
                                                                                                                       //
            usingPropertyInstance.updateCropList(id, 0, 0, 0, 0, 0, 0, { from: web3.eth.accounts[currentAccount], gas: 2000000 });
                                                                                                                       //
            //cropList.splice(id, 1);                                                                                  // 504
            $("." + cropClass).remove();                                                                               // 505
        }                                                                                                              // 509
                                                                                                                       //
        return clickCroppedObject;                                                                                     // 437
    }()                                                                                                                // 437
});                                                                                                                    // 342
                                                                                                                       //
Template.crop.events({                                                                                                 // 513
    'click .crop button': function () {                                                                                // 514
        function clickCropButton(event) {                                                                              // 514
            var id = $(event.target).parent()[0].className.split("property")[1];                                       // 515
                                                                                                                       //
            if ($(event.target).data('pressed')) {                                                                     // 517
                $(event.target).css("background", "#337ab7");                                                          // 518
                $(event.target).css("border-color", "#337ab7");                                                        // 519
                $(event.target).text("Specify");                                                                       // 520
                $(event.target).data('pressed', false);                                                                // 521
                plantMode = false;                                                                                     // 522
                return;                                                                                                // 523
            }                                                                                                          // 524
                                                                                                                       //
            plantMode = true;                                                                                          // 526
                                                                                                                       //
            var btns = $(".crop").find("button");                                                                      // 528
                                                                                                                       //
            for (var i = 0; i < btns.length; i++) {                                                                    // 530
                if ($(btns[i]).data('pressed')) {                                                                      // 531
                    $(btns[i]).css("background", "#337ab7");                                                           // 532
                    $(btns[i]).css("border-color", "#337ab7");                                                         // 533
                    $(btns[i]).text("Specify");                                                                        // 534
                    $(btns[i]).data('pressed', false);                                                                 // 535
                }                                                                                                      // 536
            }                                                                                                          // 537
            $(event.target).data('pressed', true);                                                                     // 538
                                                                                                                       //
            $(".cropObject").html("<img src = '" + prefix + cropTypeList[id].img[0] + postfix + "' />");               // 540
            currentCropId = id;                                                                                        // 541
                                                                                                                       //
            $(".cropObject").css("display", "inline");                                                                 // 543
                                                                                                                       //
            $(event.target).css("background", "gray");                                                                 // 545
            $(event.target).css("border-color", "gray");                                                               // 546
            $(event.target).text("Done");                                                                              // 547
        }                                                                                                              // 549
                                                                                                                       //
        return clickCropButton;                                                                                        // 514
    }()                                                                                                                // 514
                                                                                                                       //
});                                                                                                                    // 513
                                                                                                                       //
Template.land.events({                                                                                                 // 553
    'click .cropLand button': function () {                                                                            // 554
        function clickCropLandButton(event) {                                                                          // 554
            var id = $(event.target).parent()[0].className.split("farmLand")[1];                                       // 555
            $(".farmObject").html("<img src = '" + prefix + landTypeList[id].img + postfix + "' />");                  // 556
            currentLandId = id;                                                                                        // 557
                                                                                                                       //
            placeMode = !placeMode;                                                                                    // 559
            if (placeMode) {                                                                                           // 560
                $(".farmObject").css("display", "inline");                                                             // 561
                                                                                                                       //
                $(event.target).css("background", "gray");                                                             // 563
                $(event.target).css("border-color", "gray");                                                           // 564
                $(event.target).text("Done");                                                                          // 565
            } else {                                                                                                   // 566
                $(".farmObject").css("display", "none");                                                               // 567
                                                                                                                       //
                $(event.target).css("background", "#337ab7");                                                          // 569
                $(event.target).css("border-color", "#337ab7");                                                        // 570
                $(event.target).text("Specify");                                                                       // 571
            }                                                                                                          // 573
        }                                                                                                              // 574
                                                                                                                       //
        return clickCropLandButton;                                                                                    // 554
    }()                                                                                                                // 554
                                                                                                                       //
});                                                                                                                    // 553
                                                                                                                       //
Template.gamingArea.events({                                                                                           // 578
    'mouseenter .land div': function () {                                                                              // 579
        function mouseenterLandDiv(event) {                                                                            // 579
            if (plantMode) {                                                                                           // 580
                currentCropLand = event.target.className;                                                              // 581
                var top = $(event.target)[0].getBoundingClientRect().top;                                              // 582
                var left = $(event.target)[0].getBoundingClientRect().left;                                            // 583
                                                                                                                       //
                var landTop = $(".land").position().top;                                                               // 585
                var landLeft = $(".land").position().left;                                                             // 586
                                                                                                                       //
                var areaLeft = $(".gamingArea").position().left;                                                       // 588
                                                                                                                       //
                var divHeight = $(".cropObject").height() / 5;                                                         // 590
                var divWidth = $(".cropObject").width() / 4;                                                           // 591
                // var divHeight =0;                                                                                   // 592
                // var divWidth = 0;                                                                                   // 593
                                                                                                                       //
                var styles = {                                                                                         // 595
                    top: top - divHeight,                                                                              // 596
                    left: left - areaLeft + divWidth,                                                                  // 597
                    width: "150px",                                                                                    // 598
                    height: "150px",                                                                                   // 599
                    position: "absolute",                                                                              // 600
                    opacity: 0.5,                                                                                      // 601
                    "z-index": 2                                                                                       // 602
                };                                                                                                     // 595
                                                                                                                       //
                $(".cropObject").css(styles);                                                                          // 605
            } else if (placeMode) {                                                                                    // 607
                currentCropLand = event.target.className;                                                              // 608
                var top = $(event.target)[0].getBoundingClientRect().top;                                              // 609
                var left = $(event.target)[0].getBoundingClientRect().left;                                            // 610
                                                                                                                       //
                var landTop = $(".land").position().top;                                                               // 612
                var landLeft = $(".land").position().left;                                                             // 613
                                                                                                                       //
                var areaLeft = $(".gamingArea").position().left;                                                       // 615
                                                                                                                       //
                var divHeight = $(".farmObject").height() / 5;                                                         // 617
                var divWidth = $(".farmObject").width() / 4;                                                           // 618
                // var divHeight =0;                                                                                   // 619
                // var divWidth = 0;                                                                                   // 620
                                                                                                                       //
                $(".farmObject").css({ top: top - divHeight, left: left - areaLeft + divWidth, width: "150px", height: "150px", position: "absolute", opacity: 0.5 });
            }                                                                                                          // 624
        }                                                                                                              // 626
                                                                                                                       //
        return mouseenterLandDiv;                                                                                      // 579
    }()                                                                                                                // 579
});                                                                                                                    // 578
                                                                                                                       //
Template.statusList.events({                                                                                           // 629
    'click .btn-info': function () {                                                                                   // 630
        function clickBtnInfo(e) {                                                                                     // 630
                                                                                                                       //
            var temp = panelCounter;                                                                                   // 632
            $(".statusPanel:nth-child(" + panelCounter + ")").removeClass("statusPanelShow");                          // 633
            $(".statusPanel:nth-child(" + temp + ")").css("z-index", -1);                                              // 634
                                                                                                                       //
            // setTimeout(function(){                                                                                  // 636
            //   $(".statusPanel:nth-child("+temp+")").css("z-index", -1);                                             // 637
            // },1000);                                                                                                // 638
                                                                                                                       //
            panelCounter = e.target.className.split("crop")[1];                                                        // 640
                                                                                                                       //
            $(".statusPanel:nth-child(" + panelCounter + ")").css("z-index", 1);                                       // 642
            $(".statusPanel:nth-child(" + panelCounter + ")").addClass("statusPanelShow");                             // 643
        }                                                                                                              // 650
                                                                                                                       //
        return clickBtnInfo;                                                                                           // 630
    }()                                                                                                                // 630
});                                                                                                                    // 629
                                                                                                                       //
Template.characterList.events({                                                                                        // 653
    'click .shopOpen': function () {                                                                                   // 654
        function clickShopOpen(e) {                                                                                    // 654
            $(".property_shop").css("display", "inline");                                                              // 655
        }                                                                                                              // 657
                                                                                                                       //
        return clickShopOpen;                                                                                          // 654
    }(),                                                                                                               // 654
                                                                                                                       //
    'click .characterSwitch': function () {                                                                            // 659
        function clickCharacterSwitch(event) {                                                                         // 659
                                                                                                                       //
            loading(1);                                                                                                // 661
            var s_Length = CongressInstance.getStakeholdersLength.call({ from: web3.eth.accounts[currentAccount] }).c[0];
                                                                                                                       //
            var visitNode = currentAccount;                                                                            // 664
            while (visitNode == currentAccount) {                                                                      // 665
                visitNode = Math.floor(s_Length * Math.random());                                                      // 666
            }                                                                                                          // 667
            console.log(visitNode);                                                                                    // 668
            console.log(s_Length);                                                                                     // 669
            if ($(event.target).html() == "Guard") {                                                                   // 670
                console.log(otherUserLandConfiguration);                                                               // 671
                                                                                                                       //
                initCropLand(visitNode);                                                                               // 673
                $(event.target).html("Home");                                                                          // 674
            } else if ($(event.target).html() == "Thief") {                                                            // 675
                initCropLand(visitNode);                                                                               // 676
                $(event.target).html("Home");                                                                          // 677
                $(event.target).parent().append("<button type='button' name='button' class='btn btn-primary nextHome'>Next</button>");
            } else if ($(event.target).html() == "Home") {                                                             // 680
                $(event.target).html(Session.get('userCharacter'));                                                    // 681
                initCropLand(currentAccount);                                                                          // 682
                $(event.target).parent().find(".nextHome").remove();                                                   // 683
            }                                                                                                          // 684
            loading(0);                                                                                                // 685
        }                                                                                                              // 686
                                                                                                                       //
        return clickCharacterSwitch;                                                                                   // 659
    }(),                                                                                                               // 659
    'click .nextHome': function () {                                                                                   // 687
        function clickNextHome(event) {                                                                                // 687
                                                                                                                       //
            // ===== wait for further testing                                                                          // 689
                                                                                                                       //
        }                                                                                                              // 691
                                                                                                                       //
        return clickNextHome;                                                                                          // 687
    }(),                                                                                                               // 687
    'click .musicSwitch': function () {                                                                                // 692
        function clickMusicSwitch(event) {                                                                             // 692
            if (!audio.paused) {                                                                                       // 693
                audio.pause();                                                                                         // 694
                $(".musicSwitch").find("img").attr("src", "/img/game/speaker_on.svg");                                 // 695
            } else {                                                                                                   // 696
                audio.play();                                                                                          // 697
                $(".musicSwitch").find("img").attr("src", "/img/game/speaker_off.svg");                                // 698
            }                                                                                                          // 700
        }                                                                                                              // 702
                                                                                                                       //
        return clickMusicSwitch;                                                                                       // 692
    }(),                                                                                                               // 692
                                                                                                                       //
    'click .MissionOpen': function () {                                                                                // 704
        function clickMissionOpen(event) {                                                                             // 704
            $(".mission_template").css("display", "inline");                                                           // 705
            mission_rending();                                                                                         // 706
        }                                                                                                              // 707
                                                                                                                       //
        return clickMissionOpen;                                                                                       // 704
    }()                                                                                                                // 704
});                                                                                                                    // 653
                                                                                                                       //
/////////////////////////                                                                                              // 713
//  Utility Functions  //                                                                                              // 714
/////////////////////////                                                                                              // 715
                                                                                                                       //
                                                                                                                       //
document.onmousemove = function (e) {                                                                                  // 718
    cursorX = e.pageX;                                                                                                 // 719
    cursorY = e.pageY;                                                                                                 // 720
};                                                                                                                     // 721
                                                                                                                       //
var loadCropList = function loadCropList(s_Id) {                                                                       // 723
    cropList = [];                                                                                                     // 724
    var data = usingPropertyInstance.getCropList(s_Id, { from: web3.eth.accounts[currentAccount] });                   // 725
    var length = usingPropertyInstance.getCropListLength(s_Id, { from: web3.eth.accounts[currentAccount] });           // 726
    for (var i = 0; i < length; i++) {                                                                                 // 727
        var start = web3.toUtf8(data[3][i]).split(".")[0] + "Z";                                                       // 728
        var end = web3.toUtf8(data[4][i]).split(".")[0] + "Z";                                                         // 729
                                                                                                                       //
        start = start.split("\"")[1];                                                                                  // 731
        end = end.split("\"")[1];                                                                                      // 732
                                                                                                                       //
        cropList.push({                                                                                                // 734
            id: data[0][i].c[0],                                                                                       // 735
            name: web3.toUtf8(data[1][i]),                                                                             // 736
            img: web3.toUtf8(data[2][i]),                                                                              // 737
            start: new Date(start),                                                                                    // 738
            end: new Date(end),                                                                                        // 739
            type: data[5][i].c[0],                                                                                     // 740
            ripe: data[6][i]                                                                                           // 741
        });                                                                                                            // 734
    }                                                                                                                  // 743
    console.log(cropList);                                                                                             // 744
};                                                                                                                     // 746
                                                                                                                       //
var getUserData = function getUserData(s_Id) {                                                                         // 748
                                                                                                                       //
    var data = CongressInstance.getStakeholder.call(s_Id, { from: web3.eth.accounts[currentAccount] });                // 750
                                                                                                                       //
    currentUser = {                                                                                                    // 752
        id: s_Id,                                                                                                      // 753
        address: web3.eth.accounts[currentAccount],                                                                    // 754
                                                                                                                       //
        name: web3.toUtf8(data[0]),                                                                                    // 756
        exp: data[1].c[0],                                                                                             // 757
        totalExp: data[2].c[0],                                                                                        // 758
        type: web3.toUtf8(data[3]),                                                                                    // 759
        landSize: data[4].c[0],                                                                                        // 760
        level: data[5].c[0],                                                                                           // 761
        sta: data[6].c[0],                                                                                             // 762
        guardId: null,                                                                                                 // 763
        thiefId: null                                                                                                  // 764
    };                                                                                                                 // 752
};                                                                                                                     // 767
                                                                                                                       //
var getLandConfiguration = function getLandConfiguration(s_Id) {                                                       // 769
    userLandConfiguration = [];                                                                                        // 770
    var data = usingPropertyInstance.getUserLandConfiguration.call(s_Id, { from: web3.eth.accounts[currentAccount] });
                                                                                                                       //
    var contractLandData = data[0];                                                                                    // 773
    var contractCropData = data[1];                                                                                    // 774
                                                                                                                       //
    var landSize = currentUser.landSize;                                                                               // 776
                                                                                                                       //
    for (var i = 0; i < landSize * landSize; i++) {                                                                    // 778
        if (contractLandData[i].s != -1) {                                                                             // 779
            contractLandData[i].s = contractLandData[i].c[0];                                                          // 780
        }                                                                                                              // 781
        if (contractCropData[i].s != -1) {                                                                             // 782
            contractCropData[i].s = contractCropData[i].c[0];                                                          // 783
        }                                                                                                              // 784
        userLandConfiguration.push({                                                                                   // 785
            id: i,                                                                                                     // 787
            land: contractLandData[i].s,                                                                               // 788
            crop: contractCropData[i].s                                                                                // 789
        });                                                                                                            // 786
    }                                                                                                                  // 792
                                                                                                                       //
    console.log(contractCropData);                                                                                     // 794
};                                                                                                                     // 797
                                                                                                                       //
var fetchGameInitConfig = function fetchGameInitConfig() {                                                             // 799
    var cropData = [];                                                                                                 // 800
    var landData = [];                                                                                                 // 801
                                                                                                                       //
    var flag = true;                                                                                                   // 803
    var i = 0;                                                                                                         // 804
    while (flag) {                                                                                                     // 805
        try {                                                                                                          // 806
            cropData.push(usingPropertyInstance.propertyTypeList(i));                                                  // 807
            i++;                                                                                                       // 808
        } catch (err) {                                                                                                // 809
            flag = false;                                                                                              // 811
        }                                                                                                              // 812
    }                                                                                                                  // 813
                                                                                                                       //
    flag = true;                                                                                                       // 815
    i = 0;                                                                                                             // 816
                                                                                                                       //
    while (flag) {                                                                                                     // 818
        try {                                                                                                          // 819
            landData.push(usingPropertyInstance.landTypeList(i));                                                      // 820
            i++;                                                                                                       // 821
        } catch (err) {                                                                                                // 822
            flag = false;                                                                                              // 824
        }                                                                                                              // 825
    }                                                                                                                  // 826
                                                                                                                       //
    // console.log(landData);                                                                                          // 828
    // console.log(cropData);                                                                                          // 829
    for (var i = 0; i < cropData.length; i++) {                                                                        // 830
        var tempImg = [];                                                                                              // 831
        for (var j = 0; j < 4; j++) {                                                                                  // 832
            var tempStr = web3.toUtf8(usingPropertyInstance.getPropertyTypeImg(i, j, { from: web3.eth.accounts[currentAccount] })).toString();
            tempImg.push(tempStr);                                                                                     // 834
            //tempImg.push(["carrot_seed", "carrot_grow", "carrot_harvest", "carrot"]);                                // 835
            //tempImg.push("carrot_grow");                                                                             // 836
        }                                                                                                              // 837
        cropTypeList.push({                                                                                            // 838
            name: web3.toUtf8(cropData[i][0]),                                                                         // 839
            id: cropData[i][1].c[0],                                                                                   // 840
            img: tempImg,                                                                                              // 841
            time: web3.toUtf8(cropData[i][3]),                                                                         // 842
            count: cropData[i][4].c[0]                                                                                 // 843
                                                                                                                       //
        });                                                                                                            // 838
    }                                                                                                                  // 846
    console.log(cropTypeList);                                                                                         // 847
                                                                                                                       //
    for (var i = 0; i < landData.length; i++) {                                                                        // 849
                                                                                                                       //
        landTypeList.push({                                                                                            // 851
            id: landData[i][0].c[0],                                                                                   // 852
            name: web3.toUtf8(landData[i][1]),                                                                         // 853
            img: web3.toUtf8(landData[i][2]),                                                                          // 854
            count: landData[i][3].c[0]                                                                                 // 855
                                                                                                                       //
        });                                                                                                            // 851
    }                                                                                                                  // 858
};                                                                                                                     // 860
                                                                                                                       //
var hex2a = function hex2a(hexx) {                                                                                     // 862
    var hex = hexx.toString(); //force conversion                                                                      // 863
    var str = '';                                                                                                      // 864
    for (var i = 0; i < hex.length; i += 2) {                                                                          // 865
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));                                                    // 866
    }return str;                                                                                                       // 865
};                                                                                                                     // 868
                                                                                                                       //
var loading = function loading(on) {                                                                                   // 870
    var opacity;                                                                                                       // 871
    $(".cropObject").css("display", "none");                                                                           // 872
    if (on) {                                                                                                          // 873
        $(".loading").css("display", "flex");                                                                          // 874
        opacity = 0.5;                                                                                                 // 875
    } else {                                                                                                           // 876
        setTimeout(function () {                                                                                       // 877
            $(".loading").css("display", "none");                                                                      // 878
        }, 1000);                                                                                                      // 879
        opacity = 0;                                                                                                   // 880
    }                                                                                                                  // 882
    $(".loading").css("opacity", opacity);                                                                             // 883
};                                                                                                                     // 886
                                                                                                                       //
var rerenderCropLand = function rerenderCropLand(id) {                                                                 // 888
    getUserData(id);                                                                                                   // 889
    getLandConfiguration(id);                                                                                          // 890
    loadCropList(currentUser);                                                                                         // 891
    initCropLand(currentAccount);                                                                                      // 892
};                                                                                                                     // 893
                                                                                                                       //
var initCropLand = function initCropLand(id) {                                                                         // 895
                                                                                                                       //
    $('.land').html("");                                                                                               // 897
    $(".surfaceObject").html("");                                                                                      // 898
    $(".surfaceObject").append("<div class='cropObject'></div>");                                                      // 899
                                                                                                                       //
    $('.land').css("width", blockSize * currentUser.landSize);                                                         // 901
    $('.land').css("height", blockSize * currentUser.landSize);                                                        // 902
                                                                                                                       //
    for (var i = 0; i < currentUser.landSize * currentUser.landSize; i++) {                                            // 904
        $('.land').append("<div class='farm cropLand" + i + "'></div>");                                               // 905
        if (userLandConfiguration[i].land == -1) {                                                                     // 906
            $('.cropLand' + i).css("border", '1px solid black');                                                       // 907
        }                                                                                                              // 908
        //$('.land').append("<div></div>");                                                                            // 909
    }                                                                                                                  // 910
                                                                                                                       //
    for (var i = 0; i < userLandConfiguration.length; i++) {                                                           // 912
                                                                                                                       //
        if (userLandConfiguration[i].land == -1) {                                                                     // 914
            continue;                                                                                                  // 915
        }                                                                                                              // 916
        $(".farmObject").html("<img src = '" + prefix + landTypeList[userLandConfiguration[i].land].img + postfix + "' />");
        $(".farmObject").children().clone().appendTo(".cropLand" + i).css({ opacity: 1 });                             // 918
                                                                                                                       //
        if (userLandConfiguration[i].crop == -1) {                                                                     // 921
            continue;                                                                                                  // 922
        }                                                                                                              // 923
                                                                                                                       //
        //currentCropLand = event.target.className;                                                                    // 925
        var top = $('.cropLand' + i)[0].getBoundingClientRect().top;                                                   // 926
        var left = $('.cropLand' + i)[0].getBoundingClientRect().left;                                                 // 927
                                                                                                                       //
        var landTop = $(".land").position().top;                                                                       // 929
        var landLeft = $(".land").position().left;                                                                     // 930
                                                                                                                       //
        var areaLeft = $(".gamingArea").position().left;                                                               // 932
                                                                                                                       //
        var divHeight = $(".cropObject").height() / 5;                                                                 // 934
        var divWidth = $(".cropObject").width() / 4;                                                                   // 935
        // var divHeight =0;                                                                                           // 936
        // var divWidth = 0;                                                                                           // 937
        var styles = {                                                                                                 // 938
            top: top - divHeight,                                                                                      // 939
            left: left - areaLeft + divWidth,                                                                          // 940
            width: "150px",                                                                                            // 941
            height: "150px",                                                                                           // 942
            position: "absolute",                                                                                      // 943
            opacity: 1,                                                                                                // 944
            "z-index": 2                                                                                               // 945
        };                                                                                                             // 938
                                                                                                                       //
        var index = userLandConfiguration[i].crop;                                                                     // 949
        if (index == -1) {                                                                                             // 950
            return;                                                                                                    // 951
        }                                                                                                              // 952
                                                                                                                       //
        var difference = elapsedTime(new Date(), cropList[index].end);                                                 // 954
        var originDifference = elapsedTime(cropList[index].start, cropList[index].end);                                // 955
                                                                                                                       //
        var percent = difference / originDifference;                                                                   // 957
        if (percent <= 0.6) {                                                                                          // 958
            $(".cropObject").html("<img src = '" + prefix + cropTypeList[cropList[index].type].img[1] + postfix + "' />");
        }                                                                                                              // 960
        if (percent <= 0) {                                                                                            // 961
            $(".cropObject").html("<img src = '" + prefix + cropTypeList[cropList[index].type].img[2] + postfix + "' />");
            //cropList[i].ripe = 1;                                                                                    // 963
        }                                                                                                              // 964
                                                                                                                       //
        //var diffData = (difference.getDate()-1)+" Days. "+(difference.getHours()-8)+' Hrs. '+difference.getMinutes()+' Mins. '+difference.getSeconds()+" Secs";
        //$(".currentCrop"+index).html(diffData);                                                                      // 967
                                                                                                                       //
                                                                                                                       //
        //$(".cropObject").html("<img src = '" + prefix+ cropTypeList[config[i].crop].img[0] + postfix +"' />");       // 970
        $(".cropObject").clone().attr("class", "croppedObject croppedObject" + index).appendTo(".surfaceObject").css(styles);
    }                                                                                                                  // 975
};                                                                                                                     // 976
                                                                                                                       //
var levelCap = function levelCap(n) {                                                                                  // 978
    var powerResult = 1;                                                                                               // 979
    for (var i = 0; i < n; i++) {                                                                                      // 980
        powerResult *= 2;                                                                                              // 981
    }                                                                                                                  // 982
    return powerResult * 100;                                                                                          // 983
};                                                                                                                     // 984
                                                                                                                       //
var staminaCap = function staminaCap(n) {                                                                              // 986
    return 100 + n * 10;                                                                                               // 987
};                                                                                                                     // 988
                                                                                                                       //
var updateStaminaBar = function updateStaminaBar(consumedSta) {                                                        // 990
    var staCap = staminaCap(currentUser.level);                                                                        // 991
                                                                                                                       //
    currentUser.sta -= consumedSta;                                                                                    // 993
    var percent = currentUser.sta / staCap * 100;                                                                      // 994
    $(".staProgressBar").css("width", percent + "%");                                                                  // 995
    $(".staText").text(currentUser.sta + "/" + staCap);                                                                // 996
};                                                                                                                     // 997
                                                                                                                       //
var updateUserStamina = function updateUserStamina() {                                                                 // 1000
    var staCap = staminaCap(currentUser.level);                                                                        // 1001
    if (currentUser.sta >= staCap) {                                                                                   // 1002
        return;                                                                                                        // 1003
    }                                                                                                                  // 1004
    currentUser.sta += 1;                                                                                              // 1005
    updateStaminaBar(0);                                                                                               // 1006
};                                                                                                                     // 1008
                                                                                                                       //
var updateUserExp = function updateUserExp(exp) {                                                                      // 1013
    currentUser.exp += parseInt(exp);                                                                                  // 1014
    currentUser.totalExp += currentUser.exp;                                                                           // 1015
    var lvlCap = levelCap(currentUser.level);                                                                          // 1016
    var percent = currentUser.exp / lvlCap * 100;                                                                      // 1017
    if (percent >= 100) {                                                                                              // 1018
        currentUser.level += 1;                                                                                        // 1019
        currentUser.exp = currentUser.exp - lvlCap;                                                                    // 1020
        $(".levelUpObject").attr("display", "inline");                                                                 // 1021
                                                                                                                       //
        MainActivityInstance.playerLevelUp(s_Id, Math.random() * 3 + 1, { from: web3.eth.accounts[currentAccount] });  // 1023
        rerenderCropLand(s_Id);                                                                                        // 1024
    }                                                                                                                  // 1026
    $(".expProgressBar").css("width", percent + "%");                                                                  // 1027
    $(".expText").text(currentUser.exp + "/" + lvlCap);                                                                // 1028
};                                                                                                                     // 1030
                                                                                                                       //
var cropSummaryUpdate = function cropSummaryUpdate() {                                                                 // 1032
    for (var i = 0; i < cropList.length; i++) {                                                                        // 1033
        if (cropList[i].name == 0 || cropList[i].ripe) {                                                               // 1034
            continue;                                                                                                  // 1035
        }                                                                                                              // 1036
        var difference = elapsedTime(new Date(), cropList[i].end);                                                     // 1037
        var originDifference = elapsedTime(cropList[i].start, cropList[i].end);                                        // 1038
        //var percentage = (1 - (difference / originDifference))*100;                                                  // 1039
        // console.log(percentage);                                                                                    // 1040
        // if (percentage > 100){                                                                                      // 1041
        //   continue;                                                                                                 // 1042
        // }                                                                                                           // 1043
        //$(".currentCrop"+i).css("width", percentage+"%");                                                            // 1044
        var percent = difference / originDifference;                                                                   // 1045
        if (percent <= 0.6) {                                                                                          // 1046
            $(".croppedObject" + cropList[i].id).find("img").attr("src", prefix + cropTypeList[cropList[i].type].img[1] + postfix);
        }                                                                                                              // 1048
        if (percent <= 0) {                                                                                            // 1049
            $(".croppedObject" + cropList[i].id).find("img").attr("src", prefix + cropTypeList[cropList[i].type].img[2] + postfix);
            cropList[i].ripe = 1;                                                                                      // 1051
            $(".currentCrop" + cropList[i].id).parent().remove();                                                      // 1052
            continue;                                                                                                  // 1053
        }                                                                                                              // 1054
                                                                                                                       //
        var diffData = difference.getDate() - 1 + " Days. " + (difference.getHours() - 8) + ' Hrs. ' + difference.getMinutes() + ' Mins. ' + difference.getSeconds() + " Secs";
        $(".currentCrop" + i).html(diffData);                                                                          // 1057
    }                                                                                                                  // 1058
};                                                                                                                     // 1059
                                                                                                                       //
var elapsedTime = function elapsedTime(start, end) {                                                                   // 1061
                                                                                                                       //
    //var elapsed = end.getTime() - start.getTime();                                                                   // 1063
                                                                                                                       //
    var elapsed = end - start; // time in milliseconds                                                                 // 1065
    var difference = new Date(elapsed);                                                                                // 1066
    //var diff_days = difference.getDate();                                                                            // 1067
                                                                                                                       //
    //var diff_hours = difference.getHours();                                                                          // 1069
    //var diff_mins = difference.getMinutes();                                                                         // 1070
    //var diff_secs = difference.getSeconds();                                                                         // 1071
                                                                                                                       //
    //return difference;                                                                                               // 1073
    return difference;                                                                                                 // 1074
};                                                                                                                     // 1076
                                                                                                                       //
// var farmObjectLoader = function(){                                                                                  // 1080
//     $('.land').css("width", blockSize*currentUser.landSize );                                                       // 1081
//     $('.land').css("height", blockSize*currentUser.landSize );                                                      // 1082
//                                                                                                                     // 1083
//     for (var i = 0 ; i < currentUser.landSize*currentUser.landSize; i++){                                           // 1084
//         $('.land').append("<div class='farm cropLand" + i + "' style='border:1px solid black; border-style:solid;'></div>");
//     }                                                                                                               // 1086
// }                                                                                                                   // 1087
                                                                                                                       //
                                                                                                                       //
/////////////////////////                                                                                              // 1090
//  Shop Functions  //                                                                                                 // 1091
/////////////////////////                                                                                              // 1092
                                                                                                                       //
get_user_property_setting = function get_user_property_setting() {                                                     // 1094
    user_property = [];                                                                                                // 1095
    var propertyLength = usingPropertyInstance.getPropertiesLength.call();                                             // 1096
    for (i = 0; i < propertyLength; i++) {                                                                             // 1097
        var property_data = usingPropertyInstance.getProperty_Shop(i, { from: web3.eth.accounts[currentAccount] });    // 1098
        if (web3.eth.accounts[currentAccount] == property_data[2]) {                                                   // 1099
            var data = { "id": i, "propertyType": property_data[0].c[0], "name": hex2a(property_data[1]), "propertyCount": property_data[3].c[0], "tradeable": property_data[4] };
            user_property.push(data);                                                                                  // 1101
        }                                                                                                              // 1102
    }                                                                                                                  // 1103
};                                                                                                                     // 1104
                                                                                                                       //
get_propertyType_setting = function get_propertyType_setting() {                                                       // 1106
    display_field = [];                                                                                                // 1107
    var propertyTypeLength = usingPropertyInstance.getPropertyTypeLength.call(0, { from: web3.eth.accounts[currentAccount] });
                                                                                                                       //
    for (i = 0; i < propertyTypeLength.c[0]; i++) {                                                                    // 1110
        var property_type = usingPropertyInstance.getPropertyType.call(i, currentAccount, { from: web3.eth.accounts[currentAccount] });
        var property_type_rating = usingPropertyInstance.getPropertyTypeRating.call(i, { from: web3.eth.accounts[currentAccount] });
        console.log(property_type_rating);                                                                             // 1113
                                                                                                                       //
        var data = { "name": hex2a(property_type[0]), "id": property_type[1].c[0], "rating": property_type_rating.c[0], "averageRating": property_type[2].c[0] };
        display_field.push(data);                                                                                      // 1116
    }                                                                                                                  // 1117
};                                                                                                                     // 1118
                                                                                                                       //
set_property_table = function set_property_table() {                                                                   // 1120
    get_user_property_setting();                                                                                       // 1121
    var table, tr, td, heart_path, heart_status;                                                                       // 1122
    heart_path = ['./img/heart-outline.png', './img/heart_filled.png'];                                                // 1123
                                                                                                                       //
    $('.shop_content').html('');                                                                                       // 1125
    table = $('<table></table>').attr('id', 'property_table').attr('class', 'property_shop_table');                    // 1126
    //header                                                                                                           // 1128
    tr = $('<tr></tr>');                                                                                               // 1129
    tr.append($('<th></th>'));                                                                                         // 1130
    tr.append($('<th></th>').text('Property'));                                                                        // 1131
    tr.append($('<th></th>').text('Stock'));                                                                           // 1132
    tr.append($('<th></th>').text('Tradable'));                                                                        // 1133
    table.append(tr);                                                                                                  // 1134
    //header                                                                                                           // 1135
    //content                                                                                                          // 1136
    for (i = 0; i < user_property.length; i++) {                                                                       // 1137
        tr = $('<tr></tr>');                                                                                           // 1138
        td = $('<td></td>');                                                                                           // 1139
        td.append($('<img></img>', {                                                                                   // 1140
            src: prefix + cropTypeList[user_property[i].propertyType].img[3] + postfix,                                // 1141
            style: 'width:50px; height:50px'                                                                           // 1142
        }));                                                                                                           // 1140
        tr.append(td);                                                                                                 // 1144
        td = $('<td></td>');                                                                                           // 1145
        td.text(user_property[i].name);                                                                                // 1146
        tr.append(td);                                                                                                 // 1147
        td = $('<td></td>');                                                                                           // 1148
        td.text(user_property[i].propertyCount);                                                                       // 1149
        tr.append(td);                                                                                                 // 1150
        td = $('<td></td>');                                                                                           // 1151
        td.append($('<input></input>', {                                                                               // 1152
            type: 'text',                                                                                              // 1154
            'class': 'shop_tradable_input',                                                                            // 1155
            id: 'tradable_input_' + user_property[i].id,                                                               // 1156
            value: user_property[i].tradeable                                                                          // 1157
        }).on('keydown', function (e) {                                                                                // 1153
            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 || e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true) || e.keyCode >= 35 && e.keyCode <= 40) {
                return;                                                                                                // 1163
            }                                                                                                          // 1164
            if ((e.shiftKey || e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {             // 1165
                e.preventDefault();                                                                                    // 1166
            }                                                                                                          // 1167
        }).on('change', function (e) {                                                                                 // 1168
            var _id = index_finder($(this).attr('id'), 'tradable_input_');                                             // 1170
            if (parseInt($(this).val(), 10) > parseInt($('#shop_stock_' + _id).val())) {                               // 1171
                $(this).val($('#shop_stock_' + _id).val());                                                            // 1172
            }                                                                                                          // 1173
            $('#shop_stock_' + _id)[0].parentNode.previousSibling.textContent = parseInt($('#shop_stock_' + _id).val(), 10) - parseInt($(this).val(), 10);
        }).on('click', function () {                                                                                   // 1175
            $(this).select();                                                                                          // 1177
        }));                                                                                                           // 1178
        td.append($('<input></input>', {                                                                               // 1180
            type: 'hidden',                                                                                            // 1181
            id: 'shop_stock_' + user_property[i].id,                                                                   // 1182
            value: parseInt(user_property[i].propertyCount, 10) + parseInt(user_property[i].tradeable, 10)             // 1183
        }));                                                                                                           // 1180
        tr.append(td);                                                                                                 // 1185
        table.append(tr);                                                                                              // 1186
    }                                                                                                                  // 1187
    //content                                                                                                          // 1188
    //control bar                                                                                                      // 1189
    tr = $('<tr></tr>');                                                                                               // 1190
    td = $('<td></td>').attr('colspan', 4).attr('style', 'textalign=cneter;');                                         // 1191
    td.append($('<input>').attr({                                                                                      // 1192
        type: 'button',                                                                                                // 1193
        id: 'btn_property_save',                                                                                       // 1194
        value: 'SAVE'                                                                                                  // 1195
    }).on('click', function () {                                                                                       // 1192
        save_tradable_setting();                                                                                       // 1197
    }));                                                                                                               // 1198
    td.append($('<input>').attr({                                                                                      // 1199
        type: 'button',                                                                                                // 1200
        id: 'btn_property_cancel',                                                                                     // 1201
        value: 'CANCEL'                                                                                                // 1202
    }).on('click', function () {                                                                                       // 1199
        alert('cancel');                                                                                               // 1204
    }));                                                                                                               // 1205
    tr.append(td);                                                                                                     // 1206
    table.append(tr);                                                                                                  // 1207
    //control bar                                                                                                      // 1208
    $('.shop_content').append(table);                                                                                  // 1209
};                                                                                                                     // 1210
                                                                                                                       //
index_finder = function index_finder(_source, _mask) {                                                                 // 1212
    var res = _source.substring(_mask.length, _source.length);                                                         // 1213
    return res;                                                                                                        // 1214
};                                                                                                                     // 1215
                                                                                                                       //
set_propertyType_table = function set_propertyType_table() {                                                           // 1217
                                                                                                                       //
    var table, tr, td, property_index;                                                                                 // 1219
                                                                                                                       //
    get_propertyType_setting();                                                                                        // 1221
    $('.shop_content').html('');                                                                                       // 1222
    table = $('<table></table>').attr('id', 'property_table').attr('class', 'property_shop_table');                    // 1223
    //header                                                                                                           // 1225
    tr = $('<tr></tr>');                                                                                               // 1226
    tr.append($('<th></th>').text('Property'));                                                                        // 1227
    tr.append($('<th></th>').text('Rating'));                                                                          // 1228
    tr.append($('<th></th>').text('AVG Rating'));                                                                      // 1229
    table.append(tr);                                                                                                  // 1230
    //header                                                                                                           // 1231
    //content                                                                                                          // 1232
    for (i = 0; i < display_field.length; i++) {                                                                       // 1233
        tr = $('<tr></tr>');                                                                                           // 1234
        tr.append($('<td></td>').text(display_field[i].name));                                                         // 1235
        //tr.append($('<td></td>').text(display_field[i].propertyCount));                                              // 1236
        td = $('<td></td>');                                                                                           // 1237
        td.append($('<input>', {                                                                                       // 1238
            type: 'range',                                                                                             // 1239
            value: display_field[i].rating,                                                                            // 1240
            max: 100,                                                                                                  // 1241
            min: 0,                                                                                                    // 1242
            step: 1,                                                                                                   // 1243
            id: 'rating' + i                                                                                           // 1244
        }).on('change', function () {                                                                                  // 1238
            $('label[for = ' + $(this).attr('id') + ']').html($(this).val());                                          // 1246
        }));                                                                                                           // 1247
        td.append($('<label>').attr('for', 'rating' + i).html(display_field[i].rating));                               // 1249
        tr.append(td);                                                                                                 // 1250
        tr.append($('<td></td>').text(display_field[i].averageRating));                                                // 1251
        table.append(tr);                                                                                              // 1252
    }                                                                                                                  // 1253
    //content                                                                                                          // 1254
    //control bar                                                                                                      // 1255
    tr = $('<tr></tr>');                                                                                               // 1256
    td = $('<td></td>').attr('colspan', 3);                                                                            // 1257
    td.append($('<input>').attr({                                                                                      // 1258
        type: 'button',                                                                                                // 1259
        id: 'btn_property_save',                                                                                       // 1260
        value: 'SAVE'                                                                                                  // 1261
    }).on('click', function () {                                                                                       // 1258
        save_rating_setting();                                                                                         // 1263
    }));                                                                                                               // 1264
    td.append($('<input>').attr({                                                                                      // 1265
        type: 'button',                                                                                                // 1266
        id: 'btn_property_cancel',                                                                                     // 1267
        value: 'CANCEL'                                                                                                // 1268
    }).on('click', function () {                                                                                       // 1265
        alert('cancel');                                                                                               // 1270
    }));                                                                                                               // 1271
    tr.append(td);                                                                                                     // 1272
    table.append(tr);                                                                                                  // 1273
    //control bar                                                                                                      // 1274
    $('.shop_content').append(table);                                                                                  // 1275
};                                                                                                                     // 1276
                                                                                                                       //
save_tradable_setting = function save_tradable_setting() {                                                             // 1278
    for (i = 0; i < $('.shop_tradable_input').length; i++) {                                                           // 1279
        var _id = index_finder($('.shop_tradable_input')[i].id, 'tradable_input_');                                    // 1280
        var _tradable = $('#tradable_input_' + _id).val();                                                             // 1281
        var _propertyCount = parseInt($('#shop_stock_' + _id).val(), 10) - parseInt(_tradable, 10);                    // 1282
        usingPropertyInstance.updatePropertyCount(_id, _propertyCount, _tradable, { from: web3.eth.accounts[currentAccount], gas: 200000 });
    }                                                                                                                  // 1284
};                                                                                                                     // 1285
                                                                                                                       //
save_rating_setting = function save_rating_setting() {                                                                 // 1287
    //for (i = 0; i < user_property.length; i++) {                                                                     // 1288
    //    user_property[i].rating = $('#rating' + i).val();                                                            // 1289
    //}                                                                                                                // 1290
    //property_log[account_index].property = user_property;                                                            // 1291
    //$('#json_temp').val(JSON.stringify(property_log));                                                               // 1292
    //averageRating_calculation();                                                                                     // 1293
    for (i = 0; i < display_field.length; i++) {                                                                       // 1294
        var _id = parseInt(display_field[i].id, 10);                                                                   // 1295
        var _rate = parseInt($('#rating' + i).val(), 10);                                                              // 1296
        usingPropertyInstance.updatePropertyTypeRating(_id, _rate, "update", { from: web3.eth.accounts[currentAccount], gas: 200000 });
    }                                                                                                                  // 1298
};                                                                                                                     // 1301
                                                                                                                       //
averageRating_calculation = function averageRating_calculation() {                                                     // 1303
    for (i = 0; i < property_database.length; i++) {                                                                   // 1304
        property_database[i].averageRating = 0;                                                                        // 1305
        delete property_database[i].rating;                                                                            // 1306
    }                                                                                                                  // 1307
                                                                                                                       //
    for (i = 0; i < property_log.length; i++) {                                                                        // 1309
        for (j = 0; j < property_log[i].property.length; j++) {                                                        // 1310
            for (k = 0; k < property_database.length; k++) {                                                           // 1311
                if (property_database[k].id == property_log[i].property[j].id) {                                       // 1312
                    property_database[k].averageRating = parseInt(property_database[k].averageRating, 10) + parseInt(property_log[i].property[j].rating, 10);
                    break;                                                                                             // 1314
                }                                                                                                      // 1315
            }                                                                                                          // 1316
        }                                                                                                              // 1317
    }                                                                                                                  // 1318
    for (i = 0; i < property_database.length; i++) {                                                                   // 1319
        n = parseInt(property_database[i].averageRating, 10) / property_log.length;                                    // 1320
        property_database[i].averageRating = n.toFixed(2);                                                             // 1321
    }                                                                                                                  // 1322
    $('#temp_property').val(JSON.stringify(property_database));                                                        // 1323
};                                                                                                                     // 1324
                                                                                                                       //
/////////////////////////                                                                                              // 1327
//  Mission Functions  //                                                                                              // 1328
/////////////////////////                                                                                              // 1329
var mission_list = [];                                                                                                 // 1330
                                                                                                                       //
get_mission_list = function get_mission_list() {                                                                       // 1332
    var item, result, _cropId, _cropName, _quantity, _missionId, _missionName, _exp, _lvl_limitation, _accountStatus;  // 1333
    var mission_count = GameCoreInstance.getMissionsLength.call({ from: web3.eth.accounts[currentAccount] });          // 1334
    mission_list = [];                                                                                                 // 1335
                                                                                                                       //
    for (i = 0; i < mission_count; i++) {                                                                              // 1337
        mission_source = GameCoreInstance.getMission.call(i, { from: web3.eth.accounts[currentAccount] });             // 1338
        item_length = GameCoreInstance.getMissionItemsLength.call(i, { from: web3.eth.accounts[currentAccount] });     // 1339
        mission = { id: i, name: $.trim(hex2a(mission_source[0])), exp: mission_source[1].c[0], lvl_limitation: mission_source[2].c[0], solved: mission_source[3], items: [] };
                                                                                                                       //
        if (mission.lvl_limitation === 999) {} else {                                                                  // 1342
            for (j = 0; j < item_length; j++) {                                                                        // 1344
                item_source = GameCoreInstance.getMissionItems.call(i, j, { from: web3.eth.accounts[currentAccount] });
                item = { crop_id: item_source[0].c[0], crop_name: hex2a(item_source[1]), quantity: item_source[2].c[0] };
                mission.items.push(item);                                                                              // 1347
            }                                                                                                          // 1348
            mission_list.push(mission);                                                                                // 1349
        }                                                                                                              // 1350
    }                                                                                                                  // 1351
};                                                                                                                     // 1352
mission_rending = function mission_rending() {                                                                         // 1353
                                                                                                                       //
    get_mission_list();                                                                                                // 1355
    $('.mission_template').html('');                                                                                   // 1356
    $('.mission_template').append($('<input></input>', {                                                               // 1357
        type: 'button',                                                                                                // 1358
        value: 'Close'                                                                                                 // 1359
    }).on('click', function () {                                                                                       // 1357
        $('.mission_template').css('display', 'none');                                                                 // 1361
    }));                                                                                                               // 1361
    $('.mission_template').append($('<input></input>', {                                                               // 1363
        type: 'button',                                                                                                // 1364
        value: 'add'                                                                                                   // 1365
    }).on('click', function () {                                                                                       // 1363
        GameCoreInstance.addMission('Mission1', 100, 0, true, { from: web3.eth.accounts[currentAccount], gas: 2000000 });
        GameCoreInstance.addMission('Mission2', 300, 4, true, { from: web3.eth.accounts[currentAccount], gas: 2000000 });
        GameCoreInstance.addMission('Mission3', 200, 2, false, { from: web3.eth.accounts[currentAccount], gas: 2000000 });
        GameCoreInstance.addMission('Mission4', 500, 3, true, { from: web3.eth.accounts[currentAccount], gas: 2000000 });
                                                                                                                       //
        //GameCoreInstance.addMission('Mission5', 567, 5, true,  { from: web3.eth.accounts[currentAccount], gas: 2000000 });
        //GameCoreInstance.addMission('Mission6', 600, 7, true,  { from: web3.eth.accounts[currentAccount], gas: 2000000 });
        //GameCoreInstance.addMission('Mission7', 700, 9, true,  { from: web3.eth.accounts[currentAccount], gas: 2000000 });
        //GameCoreInstance.addMission('Mission8', 880, 8, true,  { from: web3.eth.accounts[currentAccount], gas: 2000000 });
                                                                                                                       //
        GameCoreInstance.addMissionItem(0, 0, 3, true, { from: web3.eth.accounts[currentAccount], gas: 2000000 });     // 1378
        GameCoreInstance.addMissionItem(0, 1, 4, true, { from: web3.eth.accounts[currentAccount], gas: 2000000 });     // 1379
        GameCoreInstance.addMissionItem(1, 1, 5, true, { from: web3.eth.accounts[currentAccount], gas: 2000000 });     // 1380
        GameCoreInstance.addMissionItem(1, 3, 2, true, { from: web3.eth.accounts[currentAccount], gas: 2000000 });     // 1381
        GameCoreInstance.addMissionItem(2, 0, 3, true, { from: web3.eth.accounts[currentAccount], gas: 2000000 });     // 1382
        GameCoreInstance.addMissionItem(2, 1, 3, true, { from: web3.eth.accounts[currentAccount], gas: 2000000 });     // 1383
        GameCoreInstance.addMissionItem(2, 2, 3, true, { from: web3.eth.accounts[currentAccount], gas: 2000000 });     // 1384
        GameCoreInstance.addMissionItem(3, 0, 5, true, { from: web3.eth.accounts[currentAccount], gas: 2000000 });     // 1385
        GameCoreInstance.addMissionItem(3, 1, 5, true, { from: web3.eth.accounts[currentAccount], gas: 2000000 });     // 1386
        GameCoreInstance.addMissionItem(3, 2, 5, true, { from: web3.eth.accounts[currentAccount], gas: 2000000 });     // 1387
        GameCoreInstance.addMissionItem(3, 3, 5, true, { from: web3.eth.accounts[currentAccount], gas: 2000000 });     // 1388
    }));                                                                                                               // 1389
    var table, tr, td;                                                                                                 // 1391
    table = $('<table></table>');                                                                                      // 1392
    //header                                                                                                           // 1393
    tr = $('<tr></tr>');                                                                                               // 1394
    tr.append($('<th></th>').text('Mission'));                                                                         // 1395
    tr.append($('<th></th>').text('Requirement'));                                                                     // 1396
    tr.append($('<th></th>').text('Exp'));                                                                             // 1397
    tr.append($('<th></th>').text('Submit'));                                                                          // 1398
    table.append(tr);                                                                                                  // 1399
    //header                                                                                                           // 1400
    //content                                                                                                          // 1401
    for (i = 0; i < mission_list.length; i++) {                                                                        // 1402
        tr = $('<tr></tr>');                                                                                           // 1403
        td = $('<td></td>', {                                                                                          // 1404
            text: mission_list[i].name                                                                                 // 1405
        });                                                                                                            // 1404
        tr.append(td);                                                                                                 // 1407
        td = $('<td></td>');                                                                                           // 1408
        for (j = 0; j < mission_list[i].items.length; j++) {                                                           // 1409
            td.append($('<img></img>', {                                                                               // 1410
                src: prefix + cropTypeList[mission_list[i].items[j].crop_id].img[3] + postfix,                         // 1411
                alt: mission_list[i].items[j].crop_name                                                                // 1412
            }));                                                                                                       // 1410
            td.append($('<span></span>', {                                                                             // 1414
                text: ' X ' + mission_list[i].items[j].quantity                                                        // 1415
            }));                                                                                                       // 1414
        }                                                                                                              // 1417
        tr.append(td);                                                                                                 // 1418
        td = $('<td></td>', {                                                                                          // 1419
            text: mission_list[i].exp                                                                                  // 1420
        });                                                                                                            // 1419
        tr.append(td);                                                                                                 // 1422
        td = $('<td></td>');                                                                                           // 1423
        td.append($('<input></input>', {                                                                               // 1424
            type: 'hidden',                                                                                            // 1425
            id: 'mission_exp_' + mission_list[i].id,                                                                   // 1426
            value: mission_list[i].exp                                                                                 // 1427
        }));                                                                                                           // 1424
        td.append($('<input></input>', {                                                                               // 1429
            type: 'hidden',                                                                                            // 1430
            id: 'mission_id_' + mission_list[i].id                                                                     // 1431
        }));                                                                                                           // 1429
        if (!mission_list[i].solved) {                                                                                 // 1433
            td.append($('<input></input>', {                                                                           // 1434
                type: 'button',                                                                                        // 1435
                value: 'Submit',                                                                                       // 1436
                id: 'btn_mission_submit_' + mission_list[i].id                                                         // 1437
            }).on('click', function () {                                                                               // 1434
                var _id = index_finder($(this).prev('input').attr('id'), 'mission_id_');                               // 1440
                var mission_qualify = mission_qualify_check(_id);                                                      // 1441
                if (mission_qualify) {                                                                                 // 1442
                    mission_submit(_id);                                                                               // 1443
                }                                                                                                      // 1444
            }));                                                                                                       // 1445
        }                                                                                                              // 1447
        tr.append(td);                                                                                                 // 1448
        table.append(tr);                                                                                              // 1449
    }                                                                                                                  // 1450
    //content                                                                                                          // 1451
    $('.mission_template').append(table);                                                                              // 1452
    get_user_property_setting();                                                                                       // 1453
    get_mission_list();                                                                                                // 1454
    for (k = 0; k < mission_list.length; k++) {                                                                        // 1455
        mission_qualify_check(mission_list[k].id);                                                                     // 1456
    }                                                                                                                  // 1457
};                                                                                                                     // 1458
                                                                                                                       //
mission_submit = function mission_submit(_id) {                                                                        // 1460
    updateUserExp(parseInt($('#mission_exp_' + _id).val(), 10));                                                       // 1461
    GameCoreInstance.submitMission(_id, { from: web3.eth.accounts[currentAccount], gas: 2000000 });                    // 1462
    mission_rending();                                                                                                 // 1463
};                                                                                                                     // 1464
                                                                                                                       //
mission_qualify_check = function mission_qualify_check(_id) {                                                          // 1466
                                                                                                                       //
    var target_mission;                                                                                                // 1468
    for (i = 0; i < mission_list.length; i++) {                                                                        // 1469
        if (mission_list[i].id == _id) {                                                                               // 1470
            target_mission = mission_list[i];                                                                          // 1471
            break;                                                                                                     // 1472
        }                                                                                                              // 1473
    }                                                                                                                  // 1474
    var qualify = false;                                                                                               // 1475
    for (i = 0; i < target_mission.items.length; i++) {                                                                // 1476
        qualify = false;                                                                                               // 1477
        for (j = 0; j < user_property.length; j++) {                                                                   // 1478
            if (user_property[j].propertyType == target_mission.items[i].crop_id) {                                    // 1479
                if (parseInt(user_property[j].propertyCount, 10) >= parseInt(target_mission.items[i].quantity, 10)) {  // 1480
                    qualify = true;                                                                                    // 1481
                } else {                                                                                               // 1482
                    qualify = false;                                                                                   // 1484
                }                                                                                                      // 1485
                break;                                                                                                 // 1486
            }                                                                                                          // 1487
        }                                                                                                              // 1488
        if (!qualify) {                                                                                                // 1489
            break;                                                                                                     // 1490
        }                                                                                                              // 1491
    }                                                                                                                  // 1492
                                                                                                                       //
    if (qualify) {                                                                                                     // 1494
        $('#btn_mission_submit_' + _id).css('display', 'block');                                                       // 1495
        return true;                                                                                                   // 1496
    } else {                                                                                                           // 1497
        $('#btn_mission_submit_' + _id).css('display', 'none');                                                        // 1499
        return false;                                                                                                  // 1500
    }                                                                                                                  // 1501
};                                                                                                                     // 1502
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"graph.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/graph.js                                                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
function drawGraph(el) {                                                                                               // 1
                                                                                                                       //
    // Add and remove elements on the graph object                                                                     // 3
    this.addNode = function (id, name) {                                                                               // 4
        nodes.push({ "id": id, "name": name });                                                                        // 5
        update();                                                                                                      // 6
    };                                                                                                                 // 7
                                                                                                                       //
    this.removeNode = function (id) {                                                                                  // 9
        var i = 0;                                                                                                     // 10
        var n = findNode(id);                                                                                          // 11
        while (i < links.length) {                                                                                     // 12
            if (links[i]['source'] == n || links[i]['target'] == n) {                                                  // 13
                links.splice(i, 1);                                                                                    // 15
            } else i++;                                                                                                // 16
        }                                                                                                              // 18
        nodes.splice(findNodeIndex(id), 1);                                                                            // 19
        update();                                                                                                      // 20
    };                                                                                                                 // 21
                                                                                                                       //
    this.removeLink = function (source, target) {                                                                      // 23
        for (var i = 0; i < links.length; i++) {                                                                       // 24
            if (links[i].source.id == source && links[i].target.id == target) {                                        // 26
                links.splice(i, 1);                                                                                    // 28
                break;                                                                                                 // 29
            }                                                                                                          // 30
        }                                                                                                              // 31
        update();                                                                                                      // 32
    };                                                                                                                 // 33
                                                                                                                       //
    this.removeallLinks = function () {                                                                                // 35
        links.splice(0, links.length);                                                                                 // 36
        update();                                                                                                      // 37
    };                                                                                                                 // 38
                                                                                                                       //
    this.removeAllNodes = function () {                                                                                // 40
        nodes.splice(0, links.length);                                                                                 // 41
        update();                                                                                                      // 42
    };                                                                                                                 // 43
                                                                                                                       //
    this.modifyLink = function (source, target, weight) {                                                              // 45
        for (var i = 0; i < links.length; i++) {                                                                       // 46
            if (links[i].source == source && links[i].target == target) {                                              // 47
                links[i].weight = weight;                                                                              // 48
            }                                                                                                          // 49
        }                                                                                                              // 50
        update();                                                                                                      // 51
    };                                                                                                                 // 52
                                                                                                                       //
    this.addLink = function (name, source, target, weight) {                                                           // 54
        links.push({ "name": name, "source": findNode(source), "target": findNode(target), "weight": weight });        // 55
        update();                                                                                                      // 56
    };                                                                                                                 // 57
                                                                                                                       //
    var findNode = function findNode(id) {                                                                             // 59
        for (var i in meteorBabelHelpers.sanitizeForInObject(nodes)) {                                                 // 60
            if (nodes[i]["id"] === id) return nodes[i];                                                                // 61
        };                                                                                                             // 61
    };                                                                                                                 // 62
                                                                                                                       //
    var findNodeIndex = function findNodeIndex(id) {                                                                   // 64
        for (var i = 0; i < nodes.length; i++) {                                                                       // 65
            if (nodes[i].id == id) {                                                                                   // 66
                return i;                                                                                              // 67
            }                                                                                                          // 68
        };                                                                                                             // 69
    };                                                                                                                 // 70
                                                                                                                       //
    // set up the D3 visualisation in the specified element                                                            // 72
    var w = 500,                                                                                                       // 73
        h = 500;                                                                                                       // 73
    var vis = d3.select(".leftPanel").append("svg:svg").attr("width", w).attr("height", h).attr("id", "svg").attr("pointer-events", "all").attr("viewBox", "0 0 " + w + " " + h).attr("perserveAspectRatio", "xMinYMid").append('svg:g');
                                                                                                                       //
    var force = d3.layout.force().gravity(.05).distance(100).charge(-100);                                             // 85
                                                                                                                       //
    var nodes = force.nodes(),                                                                                         // 90
        links = force.links();                                                                                         // 90
                                                                                                                       //
    var update = function update() {                                                                                   // 93
        var link = vis.selectAll("line").data(links, function (d) {                                                    // 94
            return d.source.id + "-" + d.target.id;                                                                    // 96
        });                                                                                                            // 97
                                                                                                                       //
        link.enter().append("line").attr("id", function (d) {                                                          // 99
            return d.source.id + "-" + d.target.id;                                                                    // 100
        }).attr("class", "link").style("stroke-width", function (d) {                                                  // 100
            return Math.sqrt(d.weight);                                                                                // 102
        });                                                                                                            // 102
        link.append("title").text(function (d) {                                                                       // 103
            return d.name;                                                                                             // 105
        });                                                                                                            // 106
                                                                                                                       //
        link.append("svg:text").attr("class", "textClass").text(function (d) {                                         // 108
            return d.name;                                                                                             // 110
        });                                                                                                            // 110
        link.exit().remove();                                                                                          // 111
                                                                                                                       //
        var node = vis.selectAll("g.node").data(nodes, function (d) {                                                  // 113
            return d.id;                                                                                               // 115
        });                                                                                                            // 115
                                                                                                                       //
        var nodeEnter = node.enter().append("g").attr("class", "node").call(force.drag);                               // 117
                                                                                                                       //
        nodeEnter.append("svg:circle").attr("r", 16).attr("id", function (d) {                                         // 121
            return "Node;" + d.id;                                                                                     // 123
        }).attr("class", "nodeStrokeClass");                                                                           // 123
                                                                                                                       //
        nodeEnter.append("svg:text").attr("class", "textClass").text(function (d) {                                    // 126
            return d.name;                                                                                             // 128
        });                                                                                                            // 128
                                                                                                                       //
        node.exit().remove();                                                                                          // 130
        force.on("tick", function () {                                                                                 // 131
                                                                                                                       //
            node.attr("transform", function (d) {                                                                      // 133
                return "translate(" + d.x + "," + d.y + ")";                                                           // 133
            });                                                                                                        // 133
                                                                                                                       //
            link.attr("x1", function (d) {                                                                             // 135
                return d.source.x;                                                                                     // 135
            }).attr("y1", function (d) {                                                                               // 135
                return d.source.y;                                                                                     // 136
            }).attr("x2", function (d) {                                                                               // 136
                return d.target.x;                                                                                     // 137
            }).attr("y2", function (d) {                                                                               // 137
                return d.target.y;                                                                                     // 138
            });                                                                                                        // 138
        });                                                                                                            // 139
                                                                                                                       //
        // Restart the force layout.                                                                                   // 141
        force.gravity(.05).distance(50).linkDistance(150).size([w, h]).start();                                        // 142
    };                                                                                                                 // 148
                                                                                                                       //
    // Make it all go                                                                                                  // 151
    update();                                                                                                          // 152
}                                                                                                                      // 153
                                                                                                                       //
// (function(){                                                                                                        // 155
//     graph = new drawGraph(".transaction");                                                                          // 156
//     for (var i = 0 ; i < empowerment_stakeholders.length ; i++){                                                    // 157
//         graph.addNode(empowerment_stakeholders[i].id, empowerment_stakeholders[i].name);                            // 158
//     }                                                                                                               // 159
//     for (var j = 0 ; j < empowerment_links.length ; j++){                                                           // 160
//         graph.addLink("tx", empowerment_links[j].source.id, empowerment_links[j].target.id, empowerment_links[j].weight);
//     }                                                                                                               // 162
                                                                                                                       //
//     // fpr (var j = 0 ; j < empowerment_links.length ; j++){                                                        // 164
//     //     graph.addLink("tx", empowerment_links[j].source.id, empowerment_links[j].target.id, empowerment_links[j].weight);
//     // }                                                                                                            // 166
//                                                                                                                     // 167
// // graph.addNode('A');                                                                                              // 168
// // graph.addNode('B');                                                                                              // 169
// // graph.addNode('C');                                                                                              // 170
// // graph.addNode('D');                                                                                              // 171
// // graph.addLink('TX2', 'A','C',1);                                                                                 // 172
// // graph.addLink('TX3', 'B','C',10);                                                                                // 173
// })();                                                                                                               // 174
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"mainActivity.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/mainActivity.js                                                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var updateEmpowermentData = function updateEmpowermentData(type, prop) {                                               // 1
                                                                                                                       //
    if (type == "calculate") {                                                                                         // 3
        var newLink = [];                                                                                              // 4
        var visitedOwner = [];                                                                                         // 5
        var visitedPropertyName = [];                                                                                  // 6
                                                                                                                       //
        //get property owner and name                                                                                  // 8
        for (var i = 0; i < visitedProperty.length; i++) {                                                             // 9
                                                                                                                       //
            var flag = true;                                                                                           // 11
            for (var j = 0; j < empowerment_properties.length; j++) {                                                  // 12
                if (visitedProperty[i].id == empowerment_properties[j].id) {                                           // 13
                    visitedPropertyName.push(empowerment_properties[j].name);                                          // 14
                    visitedOwner.push(empowerment_properties[j].owner);                                                // 15
                    flag = false;                                                                                      // 16
                }                                                                                                      // 17
            }                                                                                                          // 18
            if (flag) {                                                                                                // 19
                console.log("An error has occured in finding property owner & name");                                  // 20
            }                                                                                                          // 21
        }                                                                                                              // 22
        console.log(visitedOwner);                                                                                     // 23
        console.log(visitedPropertyName);                                                                              // 24
                                                                                                                       //
        // console.log(visitedProperty);                                                                               // 26
        // console.log(visitedPropertyName);                                                                           // 27
        // console.log(visitedOwner);                                                                                  // 28
        // console.log(empowerment_properties);                                                                        // 29
                                                                                                                       //
        var originX, originY;                                                                                          // 31
        var sourceX, sourceY;                                                                                          // 32
                                                                                                                       //
        for (var i = 0; i < visitedProperty.length - 1; i++) {                                                         // 34
                                                                                                                       //
            var targetX = Math.floor(Math.random() * 100 + 200);                                                       // 36
            var targetY = Math.floor(Math.random() * 100 + 200);                                                       // 37
            if (i == 0) {                                                                                              // 38
                originX = Math.floor(Math.random() * 100 + 200);                                                       // 39
                originY = Math.floor(Math.random() * 100 + 200);                                                       // 40
                sourceX = originX;                                                                                     // 41
                sourceY = originY;                                                                                     // 42
            } else {                                                                                                   // 43
                sourceX = Math.floor(Math.random() * 100 + 200);                                                       // 44
                sourceY = Math.floor(Math.random() * 100 + 200);                                                       // 45
            }                                                                                                          // 46
                                                                                                                       //
            if (i == visitedProperty.length - 2) {                                                                     // 48
                targetX = originX;                                                                                     // 49
                targetY = originY;                                                                                     // 50
            }                                                                                                          // 51
            var interaction = {};                                                                                      // 52
                                                                                                                       //
            interaction.name = 'system matchmaking';                                                                   // 54
            interaction.give = visitedPropertyName[i];                                                                 // 55
            interaction.source_affect = 0;                                                                             // 56
            interaction.receive = "none";                                                                              // 57
            interaction.target_affect = 0;                                                                             // 58
            // var source = $(".d3Stakeholder"+visitedOwner[i]).attr("transform").split(/[()]/)[1];                    // 59
            // sourceX = source.split(",")[0];                                                                         // 60
            // sourceY = source.split(",")[1];                                                                         // 61
            // var target =$(".d3Stakeholder"+visitedOwner[i+1]).attr("transform").split(/[()]/)[1];                   // 62
            // targetX = target.split(",")[0];                                                                         // 63
            // targetY = target.split(",")[1];                                                                         // 64
                                                                                                                       //
            newLink.push({                                                                                             // 66
                'source': {                                                                                            // 67
                    "id": visitedOwner[i],                                                                             // 68
                    "index": visitedOwner[i],                                                                          // 69
                    "name": visitedPropertyName[i],                                                                    // 70
                    "x": sourceX,                                                                                      // 71
                    "y": sourceY,                                                                                      // 72
                    // "px":sourceX,                                                                                   // 73
                    // "py": sourceY,                                                                                  // 74
                    "weight": 1,                                                                                       // 75
                    "benefit": 0                                                                                       // 76
                },                                                                                                     // 67
                'target': {                                                                                            // 78
                    "id": visitedOwner[i + 1],                                                                         // 79
                    "index": visitedOwner[i + 1],                                                                      // 80
                    "name": visitedPropertyName[i + 1],                                                                // 81
                    "x": targetX,                                                                                      // 82
                    "y": targetY,                                                                                      // 83
                    // "px":targetX,                                                                                   // 84
                    // "py":targetY,                                                                                   // 85
                    "weight": 1,                                                                                       // 86
                    "benefit": 0                                                                                       // 87
                },                                                                                                     // 78
                "property_id": visitedProperty[i].id,                                                                  // 89
                'interaction': interaction,                                                                            // 90
                'weight': 0                                                                                            // 91
            });                                                                                                        // 66
            //console.log(newLink[i].source);                                                                          // 93
        }                                                                                                              // 95
        console.log(newLink);                                                                                          // 96
                                                                                                                       //
        for (var i = 0; i < newLink.length; i++) {                                                                     // 98
            var flag = true;                                                                                           // 99
            for (var j = 0; j < empowerment_links.length; j++) {                                                       // 100
                if (newLink[i].source.id == empowerment_links[j].source.id && newLink[i].target.id == empowerment_links[j].target.id) {
                    empowerment_links[j].weight = defaultLineWidth;                                                    // 102
                                                                                                                       //
                    empowerment_links[j].weight += lineWidthOffset;                                                    // 104
                    graph.modifyLink(empowerment_links[j].source.id, empowerment_links[j].target.id, empowerment_links[j].weight);
                    flag = false;                                                                                      // 106
                }                                                                                                      // 107
            }                                                                                                          // 108
            if (flag) {                                                                                                // 109
                empowerment_links.push(newLink[i]);                                                                    // 110
                empowerment_links[j].weight = defaultLineWidth;                                                        // 111
                empowerment_links[empowerment_links.length - 1].weight += lineWidthOffset;                             // 112
                graph.addLink("tx", newLink[i].source.id, newLink[i].target.id, empowerment_links[empowerment_links.length - 1].weight);
            }                                                                                                          // 115
        }                                                                                                              // 117
        console.log(empowerment_links);                                                                                // 118
                                                                                                                       //
        //empowerment_links = newLink;                                                                                 // 120
        //updateData(empowerment_stakeholders, empowerment_links, empowerment_properties);                             // 121
        //benefit_update();                                                                                            // 122
    }                                                                                                                  // 123
};                                                                                                                     // 125
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"main.js":["meteor/templating","meteor/reactive-var","meteor/session","./main.html","./index.html","./game.html","./graph.js","./mainActivity.js","./game.js",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/main.js                                                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var Template;module.import('meteor/templating',{"Template":function(v){Template=v}});var ReactiveVar;module.import('meteor/reactive-var',{"ReactiveVar":function(v){ReactiveVar=v}});var Session;module.import('meteor/session',{"Session":function(v){Session=v}});module.import('./main.html');module.import('./index.html');module.import('./game.html');module.import('./graph.js');module.import('./mainActivity.js');module.import('./game.js');
                                                                                                                       // 2
                                                                                                                       // 3
                                                                                                                       //
                                                                                                                       // 5
                                                                                                                       // 6
                                                                                                                       // 7
                                                                                                                       //
                                                                                                                       // 9
                                                                                                                       // 10
                                                                                                                       // 11
                                                                                                                       //
////////////////////                                                                                                   // 13
//                //                                                                                                   // 14
//     Init       //                                                                                                   // 15
//                //                                                                                                   // 16
////////////////////                                                                                                   // 17
                                                                                                                       //
var stakeholderLength;                                                                                                 // 19
var ownerAccount = 0;                                                                                                  // 20
var _currentAccount;                                                                                                   // 21
var renderChecked = false;                                                                                             // 22
Template.index.rendered = function () {                                                                                // 23
  if (!this._rendered && !renderChecked) {                                                                             // 24
    console.log('Template render complete');                                                                           // 25
    _currentAccount = Session.get('currentAccount');                                                                   // 26
    $('#fullpage').fullpage();                                                                                         // 27
    renderChecked = true;                                                                                              // 28
                                                                                                                       //
    // MainActivityInstance.matchSuccess().watch(function(error, result){                                              // 30
    //   if (!error)                                                                                                   // 31
    //     console.log(result.args);                                                                                   // 32
    // });                                                                                                             // 33
                                                                                                                       //
    // MainActivityInstance.test().watch(function(error, result2){                                                     // 35
    //   if (!error)                                                                                                   // 36
    //     console.log(result2.args);                                                                                  // 37
    // });                                                                                                             // 38
  }                                                                                                                    // 39
};                                                                                                                     // 40
                                                                                                                       //
////////////////////                                                                                                   // 42
//                //                                                                                                   // 43
//     Utility    //                                                                                                   // 44
//     Function   //                                                                                                   // 45
//                //                                                                                                   // 46
////////////////////                                                                                                   // 47
                                                                                                                       //
                                                                                                                       //
var hex2a = function hex2a(hexx) {                                                                                     // 51
  var hex = hexx.toString(); //force conversion                                                                        // 52
  var str = '';                                                                                                        // 53
  for (var i = 0; i < hex.length; i += 2) {                                                                            // 54
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));                                                        // 55
  }return str;                                                                                                         // 54
};                                                                                                                     // 57
                                                                                                                       //
////////////////////                                                                                                   // 59
//                //                                                                                                   // 60
//     Helpers    //                                                                                                   // 61
//                //                                                                                                   // 62
////////////////////                                                                                                   // 63
                                                                                                                       //
if (Meteor.isClient) {                                                                                                 // 65
  var matchResult = new Meteor.Collection(null);                                                                       // 66
                                                                                                                       //
  Template.updateData.helpers({                                                                                        // 69
    properties: function () {                                                                                          // 70
      function properties() {                                                                                          // 70
        var propertiesData = [];                                                                                       // 71
        var propertyLength = usingPropertyInstance.getPropertiesLength.call({ from: web3.eth.accounts[_currentAccount] }).c[0];
        for (var i = 0; i < propertyLength; i++) {                                                                     // 73
          var data = usingPropertyInstance.getProperty.call(i, { from: web3.eth.accounts[_currentAccount] });          // 74
                                                                                                                       //
          var Id = CongressInstance.stakeholderId.call(web3.eth.accounts[_currentAccount], { from: web3.eth.accounts[_currentAccount] }).c[0];
          var currentRating = usingPropertyInstance.getPropertyRating.call(i, Id, { from: web3.eth.accounts[_currentAccount] }).c[0];
                                                                                                                       //
          var ratingLength = usingPropertyInstance.getPropertyRatingLength.call(0, { from: web3.eth.accounts[_currentAccount] }).c[0];
                                                                                                                       //
          var s_Id = CongressInstance.stakeholderId.call(data[5], { from: web3.eth.accounts[_currentAccount] }).c[0];  // 81
          var owner = CongressInstance.getStakeholder.call(s_Id, { from: web3.eth.accounts[_currentAccount] });        // 82
          owner = hex2a(owner[0]);                                                                                     // 83
                                                                                                                       //
          console.log(ratingLength);                                                                                   // 85
          propertiesData.push({                                                                                        // 86
            "name": hex2a(data[0]),                                                                                    // 87
            "count": data[2],                                                                                          // 88
            "unit": hex2a(data[3]),                                                                                    // 89
            "minUnit": data[4],                                                                                        // 90
            "owner": owner,                                                                                            // 91
            "extraData": hex2a(data[6]),                                                                               // 92
            'currentRating': currentRating,                                                                            // 93
            'ratingId': 'property' + i                                                                                 // 94
          });                                                                                                          // 86
        }                                                                                                              // 96
        return propertiesData;                                                                                         // 97
      }                                                                                                                // 98
                                                                                                                       //
      return properties;                                                                                               // 70
    }()                                                                                                                // 70
  });                                                                                                                  // 69
                                                                                                                       //
  Template.switchStakeholder.helpers({                                                                                 // 101
                                                                                                                       //
    stakeholders: function () {                                                                                        // 103
      function stakeholders() {                                                                                        // 103
        var stakeholdersData = [];                                                                                     // 104
        var stakeholderLength = CongressInstance.getStakeholdersLength.call({ from: web3.eth.accounts[_currentAccount] }).c[0];
        for (var i = 0; i < stakeholderLength; i++) {                                                                  // 106
          var data = CongressInstance.getStakeholder.call(i, { from: web3.eth.accounts[_currentAccount] });            // 107
          //console.log(data);                                                                                         // 108
          stakeholdersData.push({                                                                                      // 109
            "name": hex2a(data[0]),                                                                                    // 110
            "threshold": data[1],                                                                                      // 111
            "fund": data[2],                                                                                           // 112
            "rate": data[3],                                                                                           // 113
            "address": data[4],                                                                                        // 114
            "since": data[5],                                                                                          // 115
            "character": hex2a(data[6]),                                                                               // 116
            "id": i                                                                                                    // 117
          });                                                                                                          // 109
        }                                                                                                              // 119
                                                                                                                       //
        return stakeholdersData;                                                                                       // 122
      }                                                                                                                // 124
                                                                                                                       //
      return stakeholders;                                                                                             // 103
    }(),                                                                                                               // 103
    web3Accounts: function () {                                                                                        // 125
      function web3Accounts() {                                                                                        // 125
        var web3AccountsData = [];                                                                                     // 126
                                                                                                                       //
        for (var j = 0; j < web3.eth.accounts.length; j++) {                                                           // 128
          web3AccountsData.push({                                                                                      // 129
            "id": j,                                                                                                   // 130
            "address": web3.eth.accounts[j]                                                                            // 131
          });                                                                                                          // 129
        }                                                                                                              // 133
        return web3AccountsData;                                                                                       // 134
      }                                                                                                                // 135
                                                                                                                       //
      return web3Accounts;                                                                                             // 125
    }()                                                                                                                // 125
  });                                                                                                                  // 101
                                                                                                                       //
  Template.manage.helpers({                                                                                            // 138
                                                                                                                       //
    stakeholders: function () {                                                                                        // 140
      function stakeholders() {                                                                                        // 140
        var stakeholdersData = [];                                                                                     // 141
        var stakeholderLength = CongressInstance.getStakeholdersLength.call({ from: web3.eth.accounts[_currentAccount] }).c[0];
        for (var i = 0; i < stakeholderLength; i++) {                                                                  // 143
          var data = CongressInstance.getStakeholder.call(i, { from: web3.eth.accounts[_currentAccount] });            // 144
          //console.log(data);                                                                                         // 145
          stakeholdersData.push({                                                                                      // 146
            "name": hex2a(data[0]),                                                                                    // 147
            "threshold": data[1],                                                                                      // 148
            "fund": data[2],                                                                                           // 149
            "rate": data[3],                                                                                           // 150
            "address": data[4],                                                                                        // 151
            "since": data[5],                                                                                          // 152
            "character": hex2a(data[6])                                                                                // 153
          });                                                                                                          // 146
        }                                                                                                              // 155
        return stakeholdersData;                                                                                       // 156
      }                                                                                                                // 158
                                                                                                                       //
      return stakeholders;                                                                                             // 140
    }(),                                                                                                               // 140
    properties: function () {                                                                                          // 159
      function properties() {                                                                                          // 159
        var propertiesData = [];                                                                                       // 160
        var propertyLength = usingPropertyInstance.getPropertiesLength.call({ from: web3.eth.accounts[_currentAccount] }).c[0];
        for (var i = 0; i < propertyLength; i++) {                                                                     // 162
          var data = usingPropertyInstance.getProperty.call(i, { from: web3.eth.accounts[_currentAccount] });          // 163
          //console.log(data);                                                                                         // 164
                                                                                                                       //
          var s_Id = CongressInstance.stakeholderId.call(data[5], { from: web3.eth.accounts[_currentAccount] }).c[0];  // 166
          var owner = CongressInstance.getStakeholder.call(s_Id, { from: web3.eth.accounts[_currentAccount] });        // 167
          owner = hex2a(owner[0]);                                                                                     // 168
                                                                                                                       //
          propertiesData.push({                                                                                        // 170
            "name": hex2a(data[0]),                                                                                    // 171
            "count": data[2],                                                                                          // 172
            "unit": hex2a(data[3]),                                                                                    // 173
            "minUnit": data[4],                                                                                        // 174
            "owner": owner,                                                                                            // 175
            "extraData": hex2a(data[6])                                                                                // 176
          });                                                                                                          // 170
        }                                                                                                              // 178
        return propertiesData;                                                                                         // 179
      }                                                                                                                // 180
                                                                                                                       //
      return properties;                                                                                               // 159
    }(),                                                                                                               // 159
    matchingResults: function () {                                                                                     // 181
      function matchingResults() {                                                                                     // 181
        return matchResult.find({});                                                                                   // 182
      }                                                                                                                // 184
                                                                                                                       //
      return matchingResults;                                                                                          // 181
    }()                                                                                                                // 181
  });                                                                                                                  // 138
                                                                                                                       //
  Template.index.helpers({                                                                                             // 188
                                                                                                                       //
    currentAddress: function () {                                                                                      // 190
      function currentAddress() {                                                                                      // 190
        return web3.eth.accounts[_currentAccount];                                                                     // 191
      }                                                                                                                // 192
                                                                                                                       //
      return currentAddress;                                                                                           // 190
    }(),                                                                                                               // 190
    currentAccount: function () {                                                                                      // 193
      function currentAccount() {                                                                                      // 193
        var Id = CongressInstance.stakeholderId.call(web3.eth.accounts[_currentAccount], { from: web3.eth.accounts[_currentAccount] }).c[0];
        var data = CongressInstance.getStakeholder.call(Id, { from: web3.eth.accounts[_currentAccount] });             // 195
        return hex2a(data[0]);                                                                                         // 196
      }                                                                                                                // 197
                                                                                                                       //
      return currentAccount;                                                                                           // 193
    }()                                                                                                                // 193
                                                                                                                       //
  });                                                                                                                  // 188
                                                                                                                       //
  Template.header.helpers({                                                                                            // 201
                                                                                                                       //
    currentAccount: function () {                                                                                      // 203
      function currentAccount() {                                                                                      // 203
        var Id = CongressInstance.stakeholderId.call(web3.eth.accounts[_currentAccount], { from: web3.eth.accounts[_currentAccount] }).c[0];
        var data = CongressInstance.getStakeholder.call(Id, { from: web3.eth.accounts[_currentAccount] });             // 205
        return hex2a(data[0]);                                                                                         // 206
      }                                                                                                                // 207
                                                                                                                       //
      return currentAccount;                                                                                           // 203
    }()                                                                                                                // 203
                                                                                                                       //
  });                                                                                                                  // 201
                                                                                                                       //
  ////////////////////                                                                                                 // 211
  //                //                                                                                                 // 212
  //     Event      //                                                                                                 // 213
  //                //                                                                                                 // 214
  ////////////////////                                                                                                 // 215
  Template.transaction.events({                                                                                        // 216
    'click .press': function () {                                                                                      // 217
      function clickPress(event) {                                                                                     // 217
        //console.log("fff");                                                                                          // 218
                                                                                                                       //
        console.log("=== Start Match Making ===");                                                                     // 220
                                                                                                                       //
        MainActivityInstance.matchSuccess().watch(function (error, result) {                                           // 222
          if (!error) {                                                                                                // 223
            //var length = result.args[""].length/2;                                                                   // 224
            var length = result.args[""].length;                                                                       // 225
            console.log(length);                                                                                       // 226
          }                                                                                                            // 228
        });                                                                                                            // 229
                                                                                                                       //
        var txs = MainActivityInstance.findOrigin({ from: web3.eth.accounts[ownerAccount], gas: 4500000 });            // 231
        console.log(txs);                                                                                              // 232
                                                                                                                       //
        Blaze.renderWithData(Template.testtt, {}, $('.hihi')[0]);                                                      // 235
        updateEmpowermentData('calculate', '');                                                                        // 236
        // graph = new drawGraph(".transaction");                                                                      // 237
      }                                                                                                                // 239
                                                                                                                       //
      return clickPress;                                                                                               // 217
    }()                                                                                                                // 217
  });                                                                                                                  // 216
                                                                                                                       //
  Template.switchStakeholder.events({                                                                                  // 242
    'click .stakeholderSwitch': function () {                                                                          // 243
      function clickStakeholderSwitch(event) {                                                                         // 243
        _currentAccount = event.target.id;                                                                             // 244
        alert("You've switched to Account" + _currentAccount);                                                         // 245
      }                                                                                                                // 246
                                                                                                                       //
      return clickStakeholderSwitch;                                                                                   // 243
    }()                                                                                                                // 243
  });                                                                                                                  // 242
                                                                                                                       //
  Template.updateData.events({                                                                                         // 249
    'click #updateRating': function () {                                                                               // 250
      function clickUpdateRating(event) {                                                                              // 250
        var propertyLength = usingPropertyInstance.getPropertiesLength.call({ from: web3.eth.accounts[_currentAccount] }).c[0];
        for (var i = 0; i < propertyLength; i++) {                                                                     // 252
          var rating = $("#property" + i).val();                                                                       // 253
          //console.log(rating);                                                                                       // 254
          var txs = usingPropertyInstance.updatePropertiesRating(i, rating, "update", { from: web3.eth.accounts[_currentAccount], gas: 800000 });
          console.log(txs);                                                                                            // 256
        }                                                                                                              // 257
      }                                                                                                                // 258
                                                                                                                       //
      return clickUpdateRating;                                                                                        // 250
    }()                                                                                                                // 250
  });                                                                                                                  // 249
                                                                                                                       //
  Template.manage.events({                                                                                             // 262
    'click #matchMake': function () {                                                                                  // 263
      function clickMatchMake(event) {                                                                                 // 263
        console.log("=== Start Match Making ===");                                                                     // 264
                                                                                                                       //
        MainActivityInstance.matchSuccess().watch(function (error, result) {                                           // 266
          if (!error) {                                                                                                // 267
            //var length = result.args[""].length/2;                                                                   // 268
            var length = result.args[""].length;                                                                       // 269
            for (var i = 0; i < length; i++) {                                                                         // 270
              var _id = result.args[""][i].c[0];                                                                       // 271
              var data = usingPropertyInstance.getProperty.call(_id, { from: web3.eth.accounts[_currentAccount] });    // 272
                                                                                                                       //
              var currentRating = usingPropertyInstance.getPartialProperty.call(_id, { from: web3.eth.accounts[_currentAccount] })[1].c[0];
                                                                                                                       //
              console.log(currentRating);                                                                              // 276
              var s_Id = CongressInstance.stakeholderId.call(data[5], { from: web3.eth.accounts[_currentAccount] }).c[0];
              var _owner = CongressInstance.getStakeholder.call(s_Id, { from: web3.eth.accounts[_currentAccount] });   // 278
              _owner = hex2a(_owner[0]);                                                                               // 279
                                                                                                                       //
              matchResult.insert({                                                                                     // 281
                id: _id,                                                                                               // 282
                name: hex2a(data[0]),                                                                                  // 283
                owner: _owner,                                                                                         // 284
                importance: currentRating                                                                              // 285
              });                                                                                                      // 281
            }                                                                                                          // 288
            var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;    // 289
            $(window).scrollTo(height, 1500);                                                                          // 292
          }                                                                                                            // 293
        });                                                                                                            // 294
                                                                                                                       //
        var txs = MainActivityInstance.findOrigin({ from: web3.eth.accounts[ownerAccount], gas: 4500000 });            // 296
        console.log(txs);                                                                                              // 297
      }                                                                                                                // 298
                                                                                                                       //
      return clickMatchMake;                                                                                           // 263
    }()                                                                                                                // 263
  });                                                                                                                  // 262
  Template.index.events({                                                                                              // 300
    'click #test': function () {                                                                                       // 301
      function clickTest(e) {                                                                                          // 301
        e.preventDefault();                                                                                            // 302
        var value = usingPropertyInstance.returnSHA.call("hi", { from: web3.eth.accounts[_currentAccount] });          // 303
        console.log("hi1" + value);                                                                                    // 304
                                                                                                                       //
        var value = usingPropertyInstance.returnSHA.call("hi", { from: web3.eth.accounts[_currentAccount] });          // 306
        console.log("hi2" + value);                                                                                    // 307
      }                                                                                                                // 308
                                                                                                                       //
      return clickTest;                                                                                                // 301
    }(),                                                                                                               // 301
    'click #arrow-down': function () {                                                                                 // 309
      function clickArrowDown(e) {                                                                                     // 309
        e.preventDefault();                                                                                            // 310
        var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;        // 311
        scrollDuration = 1000;                                                                                         // 314
        $(window).scrollTo(height, scrollDuration);                                                                    // 315
      }                                                                                                                // 316
                                                                                                                       //
      return clickArrowDown;                                                                                           // 309
    }(),                                                                                                               // 309
    'click .chooseCharacters': function () {                                                                           // 317
      function clickChooseCharacters(event, instance) {                                                                // 317
        document.getElementById("guard").setAttribute("class", "btn btn-default");                                     // 318
        document.getElementById("thief").setAttribute("class", "btn btn-default");                                     // 319
        event.target.className = "btn btn-info";                                                                       // 320
        character = event.target.value;                                                                                // 321
      }                                                                                                                // 322
                                                                                                                       //
      return clickChooseCharacters;                                                                                    // 317
    }(),                                                                                                               // 317
    'click #previous': function () {                                                                                   // 323
      function clickPrevious(event) {                                                                                  // 323
        event.preventDefault();                                                                                        // 324
        var temp = document.getElementById("flipper");                                                                 // 325
        temp.className = " flipper";                                                                                   // 326
      }                                                                                                                // 327
                                                                                                                       //
      return clickPrevious;                                                                                            // 323
    }(),                                                                                                               // 323
    'click #submit': function () {                                                                                     // 328
      function clickSubmit(event) {                                                                                    // 328
        event.preventDefault();                                                                                        // 329
        var name = $(".p_Name").val();                                                                                 // 330
        var count = parseInt($(".p_Count").val());                                                                     // 331
        var accessStakeholders = $(".p_AccessStakeholders").val();                                                     // 332
        var unit = $(".p_Unit").val();                                                                                 // 333
        var atomicUnit = parseInt($(".p_AtomicUnit").val());                                                           // 334
        var data = $(".p_Data").val();                                                                                 // 335
        var rating = parseInt($(".p_Rating").val());                                                                   // 336
        console.log(name, count, accessStakeholders, unit, atomicUnit, data, rating);                                  // 337
                                                                                                                       //
        var txs = usingPropertyInstance.addProperty(name, count, [web3.eth.accounts[0]], unit, atomicUnit, data, rating, { from: web3.eth.accounts[_currentAccount], gas: 800000 });
        console.log(txs);                                                                                              // 340
      }                                                                                                                // 342
                                                                                                                       //
      return clickSubmit;                                                                                              // 328
    }(),                                                                                                               // 328
    'click #next': function () {                                                                                       // 343
      function clickNext(event) {                                                                                      // 343
        event.preventDefault();                                                                                        // 344
        var name = $(".s_Name").val();                                                                                 // 345
        var threshold = parseInt($(".s_Threshold").val());                                                             // 346
        var fund = parseInt($(".s_Fund").val());                                                                       // 347
        var rate = parseInt($(".s_Rate").val());                                                                       // 348
                                                                                                                       //
        //alert(web3.eth.accounts[currentAccount]);                                                                    // 350
        var txs = CongressInstance.addMember(threshold, fund, rate, { from: web3.eth.accounts[_currentAccount], gas: 221468 });
        var s_Id = CongressInstance.stakeholderId.call(web3.eth.accounts[_currentAccount], { from: web3.eth.accounts[_currentAccount] });
        var txs = MainActivityInstance.initGameData(s_Id, name, character, { from: web3.eth.accounts[_currentAccount], gas: 2201468 });
                                                                                                                       //
        //console.log(txs);                                                                                            // 355
                                                                                                                       //
        var length = usingPropertyInstance.getPropertyTypeLength.call({ from: web3.eth.accounts[_currentAccount] }).c[0];
        console.log(length);                                                                                           // 358
        var tx = usingPropertyInstance.updatePropertyTypeRating(length, 0, "new", { from: web3.eth.accounts[_currentAccount], gas: 251468 });
                                                                                                                       //
        //console.log(name, threshold, fund, rate, character);                                                         // 361
                                                                                                                       //
        Router.go('game');                                                                                             // 363
        /*                                                                                                             // 364
                document.getElementById("buyerInfo").style.display = "inline";                                         //
                document.getElementById("sellerInfo").style.display = "inline";                                        //
                                                                                                                       //
                if (character == "seller"){                                                                            //
                    document.getElementById("buyerInfo").style.display = "none";                                       //
                }else{                                                                                                 //
                    document.getElementById("sellerInfo").style.display = "none";                                      //
                }                                                                                                      //
                                                                                                                       //
                var temp = document.getElementById("flipper");                                                         //
                temp.className += " flipperClicked";                                                                   //
        */                                                                                                             //
      }                                                                                                                // 377
                                                                                                                       //
      return clickNext;                                                                                                // 343
    }()                                                                                                                // 343
                                                                                                                       //
  });                                                                                                                  // 300
}                                                                                                                      // 381
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]}},{"extensions":[".js",".json",".html",".css"]});
require("./client/template.game.js");
require("./client/template.index.js");
require("./client/template.main.js");
require("./client/lib/contract.js");
require("./client/lib/init.js");
require("./client/lib/routes.js");
require("./client/game.js");
require("./client/graph.js");
require("./client/mainActivity.js");
require("./client/main.js");
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
var $ = Package.jquery.$;
var jQuery = Package.jquery.jQuery;

(function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/natestrauser_jquery-scrollto/packages/natestrauser_jquer //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/natestrauser:jquery-scrollto/lib/jquery.scrollTo/jquery.scrollTo.js                                      //
// This file is in bare mode and is not in its own closure.                                                          //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
/*!                                                                                                                  // 1
 * jQuery.ScrollTo                                                                                                   // 2
 * Copyright (c) 2007-2013 Ariel Flesler - aflesler<a>gmail<d>com | http://flesler.blogspot.com                      // 3
 * Dual licensed under MIT and GPL.                                                                                  // 4
 *                                                                                                                   // 5
 * @projectDescription Easy element scrolling using jQuery.                                                          // 6
 * http://flesler.blogspot.com/2007/10/jqueryscrollto.html                                                           // 7
 * @author Ariel Flesler                                                                                             // 8
 * @version 1.4.6                                                                                                    // 9
 *                                                                                                                   // 10
 * @id jQuery.scrollTo                                                                                               // 11
 * @id jQuery.fn.scrollTo                                                                                            // 12
 * @param {String, Number, DOMElement, jQuery, Object} target Where to scroll the matched elements.                  // 13
 *	  The different options for target are:                                                                           // 14
 *		- A number position (will be applied to all axes).                                                               // 15
 *		- A string position ('44', '100px', '+=90', etc ) will be applied to all axes                                    // 16
 *		- A jQuery/DOM element ( logically, child of the element to scroll )                                             // 17
 *		- A string selector, that will be relative to the element to scroll ( 'li:eq(2)', etc )                          // 18
 *		- A hash { top:x, left:y }, x and y can be any kind of number/string like above.                                 // 19
 *		- A percentage of the container's dimension/s, for example: 50% to go to the middle.                             // 20
 *		- The string 'max' for go-to-end.                                                                                // 21
 * @param {Number, Function} duration The OVERALL length of the animation, this argument can be the settings object instead.
 * @param {Object,Function} settings Optional set of settings or the onAfter callback.                               // 23
 *	 @option {String} axis Which axis must be scrolled, use 'x', 'y', 'xy' or 'yx'.                                   // 24
 *	 @option {Number, Function} duration The OVERALL length of the animation.                                         // 25
 *	 @option {String} easing The easing method for the animation.                                                     // 26
 *	 @option {Boolean} margin If true, the margin of the target element will be deducted from the final position.     // 27
 *	 @option {Object, Number} offset Add/deduct from the end position. One number for both axes or { top:x, left:y }. // 28
 *	 @option {Object, Number} over Add/deduct the height/width multiplied by 'over', can be { top:x, left:y } when using both axes.
 *	 @option {Boolean} queue If true, and both axis are given, the 2nd axis will only be animated after the first one ends.
 *	 @option {Function} onAfter Function to be called after the scrolling ends.                                       // 31
 *	 @option {Function} onAfterFirst If queuing is activated, this function will be called after the first scrolling ends.
 * @return {jQuery} Returns the same jQuery object, for chaining.                                                    // 33
 *                                                                                                                   // 34
 * @desc Scroll to a fixed position                                                                                  // 35
 * @example $('div').scrollTo( 340 );                                                                                // 36
 *                                                                                                                   // 37
 * @desc Scroll relatively to the actual position                                                                    // 38
 * @example $('div').scrollTo( '+=340px', { axis:'y' } );                                                            // 39
 *                                                                                                                   // 40
 * @desc Scroll using a selector (relative to the scrolled element)                                                  // 41
 * @example $('div').scrollTo( 'p.paragraph:eq(2)', 500, { easing:'swing', queue:true, axis:'xy' } );                // 42
 *                                                                                                                   // 43
 * @desc Scroll to a DOM element (same for jQuery object)                                                            // 44
 * @example var second_child = document.getElementById('container').firstChild.nextSibling;                          // 45
 *			$('#container').scrollTo( second_child, { duration:500, axis:'x', onAfter:function(){                           // 46
 *				alert('scrolled!!');																                                                                           // 47
 *			}});                                                                                                            // 48
 *                                                                                                                   // 49
 * @desc Scroll on both axes, to different values                                                                    // 50
 * @example $('div').scrollTo( { top: 300, left:'+=200' }, { axis:'xy', offset:-20 } );                              // 51
 */                                                                                                                  // 52
                                                                                                                     // 53
;(function( $ ){                                                                                                     // 54
	                                                                                                                    // 55
	var $scrollTo = $.scrollTo = function( target, duration, settings ){                                                // 56
		$(window).scrollTo( target, duration, settings );                                                                  // 57
	};                                                                                                                  // 58
                                                                                                                     // 59
	$scrollTo.defaults = {                                                                                              // 60
		axis:'xy',                                                                                                         // 61
		duration: parseFloat($.fn.jquery) >= 1.3 ? 0 : 1,                                                                  // 62
		limit:true                                                                                                         // 63
	};                                                                                                                  // 64
                                                                                                                     // 65
	// Returns the element that needs to be animated to scroll the window.                                              // 66
	// Kept for backwards compatibility (specially for localScroll & serialScroll)                                      // 67
	$scrollTo.window = function( scope ){                                                                               // 68
		return $(window)._scrollable();                                                                                    // 69
	};                                                                                                                  // 70
                                                                                                                     // 71
	// Hack, hack, hack :)                                                                                              // 72
	// Returns the real elements to scroll (supports window/iframes, documents and regular nodes)                       // 73
	$.fn._scrollable = function(){                                                                                      // 74
		return this.map(function(){                                                                                        // 75
			var elem = this,                                                                                                  // 76
				isWin = !elem.nodeName || $.inArray( elem.nodeName.toLowerCase(), ['iframe','#document','html','body'] ) != -1;  // 77
                                                                                                                     // 78
				if( !isWin )                                                                                                     // 79
					return elem;                                                                                                    // 80
                                                                                                                     // 81
			var doc = (elem.contentWindow || elem).document || elem.ownerDocument || elem;                                    // 82
			                                                                                                                  // 83
			return /webkit/i.test(navigator.userAgent) || doc.compatMode == 'BackCompat' ?                                    // 84
				doc.body :                                                                                                       // 85
				doc.documentElement;                                                                                             // 86
		});                                                                                                                // 87
	};                                                                                                                  // 88
                                                                                                                     // 89
	$.fn.scrollTo = function( target, duration, settings ){                                                             // 90
		if( typeof duration == 'object' ){                                                                                 // 91
			settings = duration;                                                                                              // 92
			duration = 0;                                                                                                     // 93
		}                                                                                                                  // 94
		if( typeof settings == 'function' )                                                                                // 95
			settings = { onAfter:settings };                                                                                  // 96
			                                                                                                                  // 97
		if( target == 'max' )                                                                                              // 98
			target = 9e9;                                                                                                     // 99
			                                                                                                                  // 100
		settings = $.extend( {}, $scrollTo.defaults, settings );                                                           // 101
		// Speed is still recognized for backwards compatibility                                                           // 102
		duration = duration || settings.duration;                                                                          // 103
		// Make sure the settings are given right                                                                          // 104
		settings.queue = settings.queue && settings.axis.length > 1;                                                       // 105
		                                                                                                                   // 106
		if( settings.queue )                                                                                               // 107
			// Let's keep the overall duration                                                                                // 108
			duration /= 2;                                                                                                    // 109
		settings.offset = both( settings.offset );                                                                         // 110
		settings.over = both( settings.over );                                                                             // 111
                                                                                                                     // 112
		return this._scrollable().each(function(){                                                                         // 113
			// Null target yields nothing, just like jQuery does                                                              // 114
			if (target == null) return;                                                                                       // 115
                                                                                                                     // 116
			var elem = this,                                                                                                  // 117
				$elem = $(elem),                                                                                                 // 118
				targ = target, toff, attr = {},                                                                                  // 119
				win = $elem.is('html,body');                                                                                     // 120
                                                                                                                     // 121
			switch( typeof targ ){                                                                                            // 122
				// A number will pass the regex                                                                                  // 123
				case 'number':                                                                                                   // 124
				case 'string':                                                                                                   // 125
					if( /^([+-]=?)?\d+(\.\d+)?(px|%)?$/.test(targ) ){                                                               // 126
						targ = both( targ );                                                                                           // 127
						// We are done                                                                                                 // 128
						break;                                                                                                         // 129
					}                                                                                                               // 130
					// Relative selector, no break!                                                                                 // 131
					targ = $(targ,this);                                                                                            // 132
					if (!targ.length) return;                                                                                       // 133
				case 'object':                                                                                                   // 134
					// DOMElement / jQuery                                                                                          // 135
					if( targ.is || targ.style )                                                                                     // 136
						// Get the real position of the target                                                                         // 137
						toff = (targ = $(targ)).offset();                                                                              // 138
			}                                                                                                                 // 139
			$.each( settings.axis.split(''), function( i, axis ){                                                             // 140
				var Pos	= axis == 'x' ? 'Left' : 'Top',                                                                          // 141
					pos = Pos.toLowerCase(),                                                                                        // 142
					key = 'scroll' + Pos,                                                                                           // 143
					old = elem[key],                                                                                                // 144
					max = $scrollTo.max(elem, axis);                                                                                // 145
                                                                                                                     // 146
				if( toff ){// jQuery / DOMElement                                                                                // 147
					attr[key] = toff[pos] + ( win ? 0 : old - $elem.offset()[pos] );                                                // 148
                                                                                                                     // 149
					// If it's a dom element, reduce the margin                                                                     // 150
					if( settings.margin ){                                                                                          // 151
						attr[key] -= parseInt(targ.css('margin'+Pos)) || 0;                                                            // 152
						attr[key] -= parseInt(targ.css('border'+Pos+'Width')) || 0;                                                    // 153
					}                                                                                                               // 154
					                                                                                                                // 155
					attr[key] += settings.offset[pos] || 0;                                                                         // 156
					                                                                                                                // 157
					if( settings.over[pos] )                                                                                        // 158
						// Scroll to a fraction of its width/height                                                                    // 159
						attr[key] += targ[axis=='x'?'width':'height']() * settings.over[pos];                                          // 160
				}else{                                                                                                           // 161
					var val = targ[pos];                                                                                            // 162
					// Handle percentage values                                                                                     // 163
					attr[key] = val.slice && val.slice(-1) == '%' ?                                                                 // 164
						parseFloat(val) / 100 * max                                                                                    // 165
						: val;                                                                                                         // 166
				}                                                                                                                // 167
                                                                                                                     // 168
				// Number or 'number'                                                                                            // 169
				if( settings.limit && /^\d+$/.test(attr[key]) )                                                                  // 170
					// Check the limits                                                                                             // 171
					attr[key] = attr[key] <= 0 ? 0 : Math.min( attr[key], max );                                                    // 172
                                                                                                                     // 173
				// Queueing axes                                                                                                 // 174
				if( !i && settings.queue ){                                                                                      // 175
					// Don't waste time animating, if there's no need.                                                              // 176
					if( old != attr[key] )                                                                                          // 177
						// Intermediate animation                                                                                      // 178
						animate( settings.onAfterFirst );                                                                              // 179
					// Don't animate this axis again in the next iteration.                                                         // 180
					delete attr[key];                                                                                               // 181
				}                                                                                                                // 182
			});                                                                                                               // 183
                                                                                                                     // 184
			animate( settings.onAfter );			                                                                                   // 185
                                                                                                                     // 186
			function animate( callback ){                                                                                     // 187
				$elem.animate( attr, duration, settings.easing, callback && function(){                                          // 188
					callback.call(this, targ, settings);                                                                            // 189
				});                                                                                                              // 190
			};                                                                                                                // 191
                                                                                                                     // 192
		}).end();                                                                                                          // 193
	};                                                                                                                  // 194
	                                                                                                                    // 195
	// Max scrolling position, works on quirks mode                                                                     // 196
	// It only fails (not too badly) on IE, quirks mode.                                                                // 197
	$scrollTo.max = function( elem, axis ){                                                                             // 198
		var Dim = axis == 'x' ? 'Width' : 'Height',                                                                        // 199
			scroll = 'scroll'+Dim;                                                                                            // 200
		                                                                                                                   // 201
		if( !$(elem).is('html,body') )                                                                                     // 202
			return elem[scroll] - $(elem)[Dim.toLowerCase()]();                                                               // 203
		                                                                                                                   // 204
		var size = 'client' + Dim,                                                                                         // 205
			html = elem.ownerDocument.documentElement,                                                                        // 206
			body = elem.ownerDocument.body;                                                                                   // 207
                                                                                                                     // 208
		return Math.max( html[scroll], body[scroll] )                                                                      // 209
			 - Math.min( html[size]  , body[size]   );                                                                        // 210
	};                                                                                                                  // 211
                                                                                                                     // 212
	function both( val ){                                                                                               // 213
		return typeof val == 'object' ? val : { top:val, left:val };                                                       // 214
	};                                                                                                                  // 215
                                                                                                                     // 216
})( jQuery );                                                                                                        // 217
                                                                     // 225
///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['natestrauser:jquery-scrollto'] = {};

})();

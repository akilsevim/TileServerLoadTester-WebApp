// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"node_modules/jquery/dist/jquery.js":[function(require,module,exports) {
var global = arguments[3];
var process = require("process");
var define;
/*!
 * jQuery JavaScript Library v3.3.1
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2018-01-20T17:24Z
 */
( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";

var arr = [];

var document = window.document;

var getProto = Object.getPrototypeOf;

var slice = arr.slice;

var concat = arr.concat;

var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var fnToString = hasOwn.toString;

var ObjectFunctionString = fnToString.call( Object );

var support = {};

var isFunction = function isFunction( obj ) {

      // Support: Chrome <=57, Firefox <=52
      // In some browsers, typeof returns "function" for HTML <object> elements
      // (i.e., `typeof document.createElement( "object" ) === "function"`).
      // We don't want to classify *any* DOM node as a function.
      return typeof obj === "function" && typeof obj.nodeType !== "number";
  };


var isWindow = function isWindow( obj ) {
		return obj != null && obj === obj.window;
	};




	var preservedScriptAttributes = {
		type: true,
		src: true,
		noModule: true
	};

	function DOMEval( code, doc, node ) {
		doc = doc || document;

		var i,
			script = doc.createElement( "script" );

		script.text = code;
		if ( node ) {
			for ( i in preservedScriptAttributes ) {
				if ( node[ i ] ) {
					script[ i ] = node[ i ];
				}
			}
		}
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}


function toType( obj ) {
	if ( obj == null ) {
		return obj + "";
	}

	// Support: Android <=2.3 only (functionish RegExp)
	return typeof obj === "object" || typeof obj === "function" ?
		class2type[ toString.call( obj ) ] || "object" :
		typeof obj;
}
/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module



var
	version = "3.3.1",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android <=4.0 only
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {

					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && Array.isArray( src ) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject( src ) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isPlainObject: function( obj ) {
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		proto = getProto( obj );

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},

	isEmptyObject: function( obj ) {

		/* eslint-disable no-unused-vars */
		// See https://github.com/eslint/eslint/issues/6125
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},

	// Evaluates a script in a global context
	globalEval: function( code ) {
		DOMEval( code );
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// Support: Android <=4.0 only
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	// Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = toType( obj );

	if ( isFunction( obj ) || isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.3.3
 * https://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-08-08
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// https://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	// CSS escapes
	// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// CSS string/identifier serialization
	// https://drafts.csswg.org/cssom/#common-serializing-idioms
	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
	fcssescape = function( ch, asCodePoint ) {
		if ( asCodePoint ) {

			// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
			if ( ch === "\0" ) {
				return "\uFFFD";
			}

			// Control characters and (dependent upon position) numbers get escaped as code points
			return ch.slice( 0, -1 ) + "\\" + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
		}

		// Other potentially-special ASCII characters get backslash-escaped
		return "\\" + ch;
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	},

	disabledAncestor = addCombinator(
		function( elem ) {
			return elem.disabled === true && ("form" in elem || "label" in elem);
		},
		{ dir: "parentNode", next: "legend" }
	);

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

				// ID selector
				if ( (m = match[1]) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( (elem = context.getElementById( m )) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && (elem = newContext.getElementById( m )) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( (m = match[3]) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!compilerCache[ selector + " " ] &&
				(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

				if ( nodeType !== 1 ) {
					newContext = context;
					newSelector = selector;

				// qSA looks outside Element context, which is not what we want
				// Thanks to Andrew Dupont for this workaround technique
				// Support: IE <=8
				// Exclude object elements
				} else if ( context.nodeName.toLowerCase() !== "object" ) {

					// Capture the context ID, setting it first if necessary
					if ( (nid = context.getAttribute( "id" )) ) {
						nid = nid.replace( rcssescape, fcssescape );
					} else {
						context.setAttribute( "id", (nid = expando) );
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[i] = "#" + nid + " " + toSelector( groups[i] );
					}
					newSelector = groups.join( "," );

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;
				}

				if ( newSelector ) {
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch ( qsaError ) {
					} finally {
						if ( nid === expando ) {
							context.removeAttribute( "id" );
						}
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) {
	var el = document.createElement("fieldset");

	try {
		return !!fn( el );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}
		// release memory in IE
		el = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			a.sourceIndex - b.sourceIndex;

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) {

	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// Only certain elements can match :enabled or :disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) {

			// Check for inherited disabledness on relevant non-disabled elements:
			// * listed form-associated elements in a disabled fieldset
			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
			// * option elements in a disabled optgroup
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
			// All such elements have a "form" property.
			if ( elem.parentNode && elem.disabled === false ) {

				// Option elements defer to a parent optgroup if present
				if ( "label" in elem ) {
					if ( "label" in elem.parentNode ) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// Support: IE 6 - 11
				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
				return elem.isDisabled === disabled ||

					// Where there is no isDisabled, check manually
					/* jshint -W018 */
					elem.isDisabled !== !disabled &&
						disabledAncestor( elem ) === disabled;
			}

			return elem.disabled === disabled;

		// Try to winnow out elements that can't be disabled before trusting the disabled property.
		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		// Remaining elements are neither :enabled nor :disabled
		return false;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9-11, Edge
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	if ( preferredDoc !== document &&
		(subWindow = document.defaultView) && subWindow.top !== subWindow ) {

		// Support: IE 11, Edge
		if ( subWindow.addEventListener ) {
			subWindow.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( subWindow.attachEvent ) {
			subWindow.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( el ) {
		el.className = "i";
		return !el.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( el ) {
		el.appendChild( document.createComment("") );
		return !el.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( el ) {
		docElem.appendChild( el ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	});

	// ID filter and find
	if ( support.getById ) {
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var elem = context.getElementById( id );
				return elem ? [ elem ] : [];
			}
		};
	} else {
		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};

		// Support: IE 6 - 7 only
		// getElementById is not reliable as a find shortcut
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var node, i, elems,
					elem = context.getElementById( id );

				if ( elem ) {

					// Verify the id attribute
					node = elem.getAttributeNode("id");
					if ( node && node.value === id ) {
						return [ elem ];
					}

					// Fall back on getElementsByName
					elems = context.getElementsByName( id );
					i = 0;
					while ( (elem = elems[i++]) ) {
						node = elem.getAttributeNode("id");
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See https://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( el ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// https://bugs.jquery.com/ticket/12359
			docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( el.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !el.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !el.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibling-combinator selector` fails
			if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( el ) {
			el.innerHTML = "<a href='' disabled='disabled'></a>" +
				"<select disabled='disabled'><option/></select>";

			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement("input");
			input.setAttribute( "type", "hidden" );
			el.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( el.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( el.querySelectorAll(":enabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: IE9-11+
			// IE's :disabled selector does not pick up the children of disabled fieldsets
			docElem.appendChild( el ).disabled = true;
			if ( el.querySelectorAll(":disabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			el.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( el ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( el, "*" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( el, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === document ? -1 :
				b === document ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		!compilerCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.escape = function( sel ) {
	return (sel + "").replace( rcssescape, fcssescape );
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || (node[ expando ] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								(outerCache[ node.uniqueID ] = {});

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {
							// Use previously-cached element index if available
							if ( useCache ) {
								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || (node[ expando ] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {
								// Use the same loop as above to seek `elem` from the start
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] || (node[ expando ] = {});

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												(outerCache[ node.uniqueID ] = {});

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": createDisabledPseudo( false ),
		"disabled": createDisabledPseudo( true ),

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
			return false;
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

						if ( skip && skip === elem.nodeName.toLowerCase() ) {
							elem = elem[ dir ] || elem;
						} else if ( (oldCache = uniqueCache[ key ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ key ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context === document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					if ( !context && elem.ownerDocument !== document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context || document, xml) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( el ) {
	// Should return 1, but returns 4 (following)
	return el.compareDocumentPosition( document.createElement("fieldset") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( el ) {
	el.innerHTML = "<a href='#'></a>";
	return el.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( el ) {
	el.innerHTML = "<input/>";
	el.firstChild.setAttribute( "value", "" );
	return el.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( el ) {
	return el.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;

// Deprecated
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;
jQuery.escapeSelector = Sizzle.escape;




var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;



function nodeName( elem, name ) {

  return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

};
var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) !== not;
		} );
	}

	// Single element
	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );
	}

	// Arraylike of elements (jQuery, arguments, Array)
	if ( typeof qualifier !== "string" ) {
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	// Filtered directly for both simple and complex selectors
	return jQuery.filter( qualifier, elements, not );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	if ( elems.length === 1 && elem.nodeType === 1 ) {
		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
	}

	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
		return elem.nodeType === 1;
	} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i, ret,
			len = this.length,
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		ret = this.pushStack( [] );

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					if ( elem ) {

						// Inject the element directly into the jQuery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== "string" && jQuery( selectors );

		// Positional selectors never match, since there's no _selection_ context
		if ( !rneedsContext.test( selectors ) ) {
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// Always skip document fragments
					if ( cur.nodeType < 11 && ( targets ?
						targets.index( cur ) > -1 :

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
        if ( nodeName( elem, "iframe" ) ) {
            return elem.contentDocument;
        }

        // Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
        // Treat the template element as a regular one in browsers that
        // don't support it.
        if ( nodeName( elem, "template" ) ) {
            elem = elem.content || elem;
        }

        return jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = locked || options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && toType( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


function Identity( v ) {
	return v;
}
function Thrower( ex ) {
	throw ex;
}

function adoptValue( value, resolve, reject, noValue ) {
	var method;

	try {

		// Check for promise aspect first to privilege synchronous behavior
		if ( value && isFunction( ( method = value.promise ) ) ) {
			method.call( value ).done( resolve ).fail( reject );

		// Other thenables
		} else if ( value && isFunction( ( method = value.then ) ) ) {
			method.call( value, resolve, reject );

		// Other non-thenables
		} else {

			// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
			// * false: [ value ].slice( 0 ) => resolve( value )
			// * true: [ value ].slice( 1 ) => resolve()
			resolve.apply( undefined, [ value ].slice( noValue ) );
		}

	// For Promises/A+, convert exceptions into rejections
	// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
	// Deferred#then to conditionally suppress rejection.
	} catch ( value ) {

		// Support: Android 4.0 only
		// Strict mode functions invoked without .call/.apply get global-object context
		reject.apply( undefined, [ value ] );
	}
}

jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				[ "notify", "progress", jQuery.Callbacks( "memory" ),
					jQuery.Callbacks( "memory" ), 2 ],
				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				"catch": function( fn ) {
					return promise.then( null, fn );
				},

				// Keep pipe for back-compat
				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;

					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {

							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
							var fn = isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},
				then: function( onFulfilled, onRejected, onProgress ) {
					var maxDepth = 0;
					function resolve( depth, deferred, handler, special ) {
						return function() {
							var that = this,
								args = arguments,
								mightThrow = function() {
									var returned, then;

									// Support: Promises/A+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// Ignore double-resolution attempts
									if ( depth < maxDepth ) {
										return;
									}

									returned = handler.apply( that, args );

									// Support: Promises/A+ section 2.3.1
									// https://promisesaplus.com/#point-48
									if ( returned === deferred.promise() ) {
										throw new TypeError( "Thenable self-resolution" );
									}

									// Support: Promises/A+ sections 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// Retrieve `then` only once
									then = returned &&

										// Support: Promises/A+ section 2.3.4
										// https://promisesaplus.com/#point-64
										// Only check objects and functions for thenability
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;

									// Handle a returned thenable
									if ( isFunction( then ) ) {

										// Special processors (notify) just wait for resolution
										if ( special ) {
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special )
											);

										// Normal processors (resolve) also hook into progress
										} else {

											// ...and disregard older resolution values
											maxDepth++;

											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special ),
												resolve( maxDepth, deferred, Identity,
													deferred.notifyWith )
											);
										}

									// Handle all other returned values
									} else {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if ( handler !== Identity ) {
											that = undefined;
											args = [ returned ];
										}

										// Process the value(s)
										// Default process is resolve
										( special || deferred.resolveWith )( that, args );
									}
								},

								// Only normal processors (resolve) catch and reject exceptions
								process = special ?
									mightThrow :
									function() {
										try {
											mightThrow();
										} catch ( e ) {

											if ( jQuery.Deferred.exceptionHook ) {
												jQuery.Deferred.exceptionHook( e,
													process.stackTrace );
											}

											// Support: Promises/A+ section 2.3.3.3.4.1
											// https://promisesaplus.com/#point-61
											// Ignore post-resolution exceptions
											if ( depth + 1 >= maxDepth ) {

												// Only substitute handlers pass on context
												// and multiple values (non-spec behavior)
												if ( handler !== Thrower ) {
													that = undefined;
													args = [ e ];
												}

												deferred.rejectWith( that, args );
											}
										}
									};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if ( depth ) {
								process();
							} else {

								// Call an optional hook to record the stack, in case of exception
								// since it's otherwise lost when execution goes async
								if ( jQuery.Deferred.getStackHook ) {
									process.stackTrace = jQuery.Deferred.getStackHook();
								}
								window.setTimeout( process );
							}
						};
					}

					return jQuery.Deferred( function( newDefer ) {

						// progress_handlers.add( ... )
						tuples[ 0 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onProgress ) ?
									onProgress :
									Identity,
								newDefer.notifyWith
							)
						);

						// fulfilled_handlers.add( ... )
						tuples[ 1 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onFulfilled ) ?
									onFulfilled :
									Identity
							)
						);

						// rejected_handlers.add( ... )
						tuples[ 2 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onRejected ) ?
									onRejected :
									Thrower
							)
						);
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 5 ];

			// promise.progress = list.add
			// promise.done = list.add
			// promise.fail = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(
					function() {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[ 3 - i ][ 2 ].disable,

					// rejected_handlers.disable
					// fulfilled_handlers.disable
					tuples[ 3 - i ][ 3 ].disable,

					// progress_callbacks.lock
					tuples[ 0 ][ 2 ].lock,

					// progress_handlers.lock
					tuples[ 0 ][ 3 ].lock
				);
			}

			// progress_handlers.fire
			// fulfilled_handlers.fire
			// rejected_handlers.fire
			list.add( tuple[ 3 ].fire );

			// deferred.notify = function() { deferred.notifyWith(...) }
			// deferred.resolve = function() { deferred.resolveWith(...) }
			// deferred.reject = function() { deferred.rejectWith(...) }
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
				return this;
			};

			// deferred.notifyWith = list.fireWith
			// deferred.resolveWith = list.fireWith
			// deferred.rejectWith = list.fireWith
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( singleValue ) {
		var

			// count of uncompleted subordinates
			remaining = arguments.length,

			// count of unprocessed arguments
			i = remaining,

			// subordinate fulfillment data
			resolveContexts = Array( i ),
			resolveValues = slice.call( arguments ),

			// the master Deferred
			master = jQuery.Deferred(),

			// subordinate callback factory
			updateFunc = function( i ) {
				return function( value ) {
					resolveContexts[ i ] = this;
					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( !( --remaining ) ) {
						master.resolveWith( resolveContexts, resolveValues );
					}
				};
			};

		// Single- and empty arguments are adopted like Promise.resolve
		if ( remaining <= 1 ) {
			adoptValue( singleValue, master.done( updateFunc( i ) ).resolve, master.reject,
				!remaining );

			// Use .then() to unwrap secondary thenables (cf. gh-3000)
			if ( master.state() === "pending" ||
				isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

				return master.then();
			}
		}

		// Multiple arguments are aggregated like Promise.all array elements
		while ( i-- ) {
			adoptValue( resolveValues[ i ], updateFunc( i ), master.reject );
		}

		return master.promise();
	}
} );


// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

jQuery.Deferred.exceptionHook = function( error, stack ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
	}
};




jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};




// The deferred used on DOM ready
var readyList = jQuery.Deferred();

jQuery.fn.ready = function( fn ) {

	readyList
		.then( fn )

		// Wrap jQuery.readyException in a function so that the lookup
		// happens at the time of error handling instead of callback
		// registration.
		.catch( function( error ) {
			jQuery.readyException( error );
		} );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );
	}
} );

jQuery.ready.then = readyList.then;

// The ready event handler and self cleanup method
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon
if ( document.readyState === "complete" ||
	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

	// Handle it asynchronously to allow scripts the opportunity to delay ready
	window.setTimeout( jQuery.ready );

} else {

	// Use the handy event callback
	document.addEventListener( "DOMContentLoaded", completed );

	// A fallback to window.onload, that will always work
	window.addEventListener( "load", completed );
}




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( toType( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
					value :
					value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	if ( chainable ) {
		return elems;
	}

	// Gets
	if ( bulk ) {
		return fn.call( elems );
	}

	return len ? fn( elems[ 0 ], key ) : emptyGet;
};


// Matches dashed string for camelizing
var rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g;

// Used by camelCase as callback to replace()
function fcamelCase( all, letter ) {
	return letter.toUpperCase();
}

// Convert dashed to camelCase; used by the css and data modules
// Support: IE <=9 - 11, Edge 12 - 15
// Microsoft forgot to hump their vendor prefix (#9572)
function camelCase( string ) {
	return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
}
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	cache: function( owner ) {

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		// Always use camelCase key (gh-2257)
		if ( typeof data === "string" ) {
			cache[ camelCase( data ) ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ camelCase( prop ) ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :

			// Always use camelCase key (gh-2257)
			owner[ this.expando ] && owner[ this.expando ][ camelCase( key ) ];
	},
	access: function( owner, key, value ) {

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			return this.get( owner, key );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key !== undefined ) {

			// Support array or space separated string of keys
			if ( Array.isArray( key ) ) {

				// If key is an array of keys...
				// We always set camelCase keys, so remove that.
				key = key.map( camelCase );
			} else {
				key = camelCase( key );

				// If a key with the spaces exists, use it.
				// Otherwise, create an array by matching non-whitespace
				key = key in cache ?
					[ key ] :
					( key.match( rnothtmlwhite ) || [] );
			}

			i = key.length;

			while ( i-- ) {
				delete cache[ key[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <=35 - 45
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function getData( data ) {
	if ( data === "true" ) {
		return true;
	}

	if ( data === "false" ) {
		return false;
	}

	if ( data === "null" ) {
		return null;
	}

	// Only convert to a number if it doesn't change the string
	if ( data === +data + "" ) {
		return +data;
	}

	if ( rbrace.test( data ) ) {
		return JSON.parse( data );
	}

	return data;
}

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = getData( data );
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE 11 only
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// The key will always be camelCased in Data
				data = dataUser.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each( function() {

				// We always store the camelCased key
				dataUser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || Array.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHiddenWithinTree = function( elem, el ) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;

		// Inline style trumps all
		return elem.style.display === "none" ||
			elem.style.display === "" &&

			// Otherwise, check computed style
			// Support: Firefox <=43 - 45
			// Disconnected elements can have computed display: none, so first confirm that elem is
			// in the document.
			jQuery.contains( elem.ownerDocument, elem ) &&

			jQuery.css( elem, "display" ) === "none";
	};

var swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};




function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted, scale,
		maxIterations = 20,
		currentValue = tween ?
			function() {
				return tween.cur();
			} :
			function() {
				return jQuery.css( elem, prop, "" );
			},
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Support: Firefox <=54
		// Halve the iteration target value to prevent interference from CSS upper bounds (gh-2144)
		initial = initial / 2;

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		while ( maxIterations-- ) {

			// Evaluate and update our best guess (doubling guesses that zero out).
			// Finish if the scale equals or crosses 1 (making the old*new product non-positive).
			jQuery.style( elem, prop, initialInUnit + unit );
			if ( ( 1 - scale ) * ( 1 - ( scale = currentValue() / initial || 0.5 ) ) <= 0 ) {
				maxIterations = 0;
			}
			initialInUnit = initialInUnit / scale;

		}

		initialInUnit = initialInUnit * 2;
		jQuery.style( elem, prop, initialInUnit + unit );

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


var defaultDisplayMap = {};

function getDefaultDisplay( elem ) {
	var temp,
		doc = elem.ownerDocument,
		nodeName = elem.nodeName,
		display = defaultDisplayMap[ nodeName ];

	if ( display ) {
		return display;
	}

	temp = doc.body.appendChild( doc.createElement( nodeName ) );
	display = jQuery.css( temp, "display" );

	temp.parentNode.removeChild( temp );

	if ( display === "none" ) {
		display = "block";
	}
	defaultDisplayMap[ nodeName ] = display;

	return display;
}

function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;

	// Determine new display value for elements that need to change
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		display = elem.style.display;
		if ( show ) {

			// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
			// check is required in this first loop unless we have a nonempty display value (either
			// inline or about-to-be-restored)
			if ( display === "none" ) {
				values[ index ] = dataPriv.get( elem, "display" ) || null;
				if ( !values[ index ] ) {
					elem.style.display = "";
				}
			}
			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
				values[ index ] = getDefaultDisplay( elem );
			}
		} else {
			if ( display !== "none" ) {
				values[ index ] = "none";

				// Remember what we're overwriting
				dataPriv.set( elem, "display", display );
			}
		}
	}

	// Set the display of the elements in a second loop to avoid constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
		}
	}

	return elements;
}

jQuery.fn.extend( {
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHiddenWithinTree( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]+)/i );

var rscriptType = ( /^$|^module$|\/(?:java|ecma)script/i );



// We have to close these tags to support XHTML (#13200)
var wrapMap = {

	// Support: IE <=9 only
	option: [ 1, "<select multiple='multiple'>", "</select>" ],

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

// Support: IE <=9 only
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;


function getAll( context, tag ) {

	// Support: IE <=9 - 11 only
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	var ret;

	if ( typeof context.getElementsByTagName !== "undefined" ) {
		ret = context.getElementsByTagName( tag || "*" );

	} else if ( typeof context.querySelectorAll !== "undefined" ) {
		ret = context.querySelectorAll( tag || "*" );

	} else {
		ret = [];
	}

	if ( tag === undefined || tag && nodeName( context, tag ) ) {
		return jQuery.merge( [ context ], ret );
	}

	return ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, contains, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( toType( elem ) === "object" ) {

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (#12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		contains = jQuery.contains( elem.ownerDocument, elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( contains ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0 - 4.3 only
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Android <=4.1 only
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE <=11 only
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
} )();
var documentElement = document.documentElement;



var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE <=9 only
// See #13393 for more info
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Ensure that invalid selectors throw exceptions at attach time
		// Evaluate against documentElement in case elem is a non-element node (e.g., document)
		if ( selector ) {
			jQuery.find.matchesSelector( documentElement, selector );
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = {};
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( nativeEvent ) {

		// Make a writable jQuery.Event from the native event object
		var event = jQuery.event.fix( nativeEvent );

		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),
			handlers = ( dataPriv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;

		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}

		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or 2) have namespace(s)
				// a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, handleObj, sel, matchedHandlers, matchedSelectors,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		if ( delegateCount &&

			// Support: IE <=9
			// Black-hole SVG <use> instance trees (trac-13180)
			cur.nodeType &&

			// Support: Firefox <=42
			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
			!( event.type === "click" && event.button >= 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
					matchedHandlers = [];
					matchedSelectors = {};
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matchedSelectors[ sel ] === undefined ) {
							matchedSelectors[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matchedSelectors[ sel ] ) {
							matchedHandlers.push( handleObj );
						}
					}
					if ( matchedHandlers.length ) {
						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		cur = this;
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	addProp: function( name, hook ) {
		Object.defineProperty( jQuery.Event.prototype, name, {
			enumerable: true,
			configurable: true,

			get: isFunction( hook ) ?
				function() {
					if ( this.originalEvent ) {
							return hook( this.originalEvent );
					}
				} :
				function() {
					if ( this.originalEvent ) {
							return this.originalEvent[ name ];
					}
				},

			set: function( value ) {
				Object.defineProperty( this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value
				} );
			}
		} );
	},

	fix: function( originalEvent ) {
		return originalEvent[ jQuery.expando ] ?
			originalEvent :
			new jQuery.Event( originalEvent );
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {

			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {

			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( this.type === "checkbox" && this.click && nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android <=2.3 only
				src.returnValue === false ?
			returnTrue :
			returnFalse;

		// Create target properties
		// Support: Safari <=6 - 7 only
		// Target should not be a text node (#504, #13143)
		this.target = ( src.target && src.target.nodeType === 3 ) ?
			src.target.parentNode :
			src.target;

		this.currentTarget = src.currentTarget;
		this.relatedTarget = src.relatedTarget;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || Date.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Includes all common event props including KeyEvent and MouseEvent specific props
jQuery.each( {
	altKey: true,
	bubbles: true,
	cancelable: true,
	changedTouches: true,
	ctrlKey: true,
	detail: true,
	eventPhase: true,
	metaKey: true,
	pageX: true,
	pageY: true,
	shiftKey: true,
	view: true,
	"char": true,
	charCode: true,
	key: true,
	keyCode: true,
	button: true,
	buttons: true,
	clientX: true,
	clientY: true,
	offsetX: true,
	offsetY: true,
	pointerId: true,
	pointerType: true,
	screenX: true,
	screenY: true,
	targetTouches: true,
	toElement: true,
	touches: true,

	which: function( event ) {
		var button = event.button;

		// Add which for key events
		if ( event.which == null && rkeyEvent.test( event.type ) ) {
			return event.charCode != null ? event.charCode : event.keyCode;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		if ( !event.which && button !== undefined && rmouseEvent.test( event.type ) ) {
			if ( button & 1 ) {
				return 1;
			}

			if ( button & 2 ) {
				return 3;
			}

			if ( button & 4 ) {
				return 2;
			}

			return 0;
		}

		return event.which;
	}
}, jQuery.event.addProp );

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var

	/* eslint-disable max-len */

	// See https://github.com/eslint/eslint/issues/3229
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,

	/* eslint-enable */

	// Support: IE <=10 - 11, Edge 12 - 13 only
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

// Prefer a tbody over its parent table for containing new rows
function manipulationTarget( elem, content ) {
	if ( nodeName( elem, "table" ) &&
		nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

		return jQuery( elem ).children( "tbody" )[ 0 ] || elem;
	}

	return elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	if ( ( elem.type || "" ).slice( 0, 5 ) === "true/" ) {
		elem.type = elem.type.slice( 5 );
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.access( src );
		pdataCur = dataPriv.set( dest, pdataOld );
		events = pdataOld.events;

		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = concat.apply( [], args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		valueIsFunction = isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( valueIsFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( valueIsFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android <=4.0 only, PhantomJS 1 only
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src && ( node.type || "" ).toLowerCase()  !== "module" ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl ) {
								jQuery._evalUrl( node.src );
							}
						} else {
							DOMEval( node.textContent.replace( rcleanScript, "" ), doc, node );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html.replace( rxhtmlTag, "<$1></$2>" );
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {
	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: Android <=4.0 only, PhantomJS 1 only
			// .get() because push.apply(_, arraylike) throws on ancient WebKit
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );
var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {

		// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};

var rboxStyle = new RegExp( cssExpand.join( "|" ), "i" );



( function() {

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {

		// This is a singleton, we need to execute it only once
		if ( !div ) {
			return;
		}

		container.style.cssText = "position:absolute;left:-11111px;width:60px;" +
			"margin-top:1px;padding:0;border:0";
		div.style.cssText =
			"position:relative;display:block;box-sizing:border-box;overflow:scroll;" +
			"margin:auto;border:1px;padding:1px;" +
			"width:60%;top:1%";
		documentElement.appendChild( container ).appendChild( div );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";

		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
		reliableMarginLeftVal = roundPixelMeasures( divStyle.marginLeft ) === 12;

		// Support: Android 4.0 - 4.3 only, Safari <=9.1 - 10.1, iOS <=7.0 - 9.3
		// Some styles come back with percentage values, even though they shouldn't
		div.style.right = "60%";
		pixelBoxStylesVal = roundPixelMeasures( divStyle.right ) === 36;

		// Support: IE 9 - 11 only
		// Detect misreporting of content dimensions for box-sizing:border-box elements
		boxSizingReliableVal = roundPixelMeasures( divStyle.width ) === 36;

		// Support: IE 9 only
		// Detect overflow:scroll screwiness (gh-3699)
		div.style.position = "absolute";
		scrollboxSizeVal = div.offsetWidth === 36 || "absolute";

		documentElement.removeChild( container );

		// Nullify the div so it wouldn't be stored in the memory and
		// it will also be a sign that checks already performed
		div = null;
	}

	function roundPixelMeasures( measure ) {
		return Math.round( parseFloat( measure ) );
	}

	var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal,
		reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE <=9 - 11 only
	// Style of cloned element affects source element cloned (#8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	jQuery.extend( support, {
		boxSizingReliable: function() {
			computeStyleTests();
			return boxSizingReliableVal;
		},
		pixelBoxStyles: function() {
			computeStyleTests();
			return pixelBoxStylesVal;
		},
		pixelPosition: function() {
			computeStyleTests();
			return pixelPositionVal;
		},
		reliableMarginLeft: function() {
			computeStyleTests();
			return reliableMarginLeftVal;
		},
		scrollboxSize: function() {
			computeStyleTests();
			return scrollboxSizeVal;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,

		// Support: Firefox 51+
		// Retrieving style before computed somehow
		// fixes an issue with getting wrong values
		// on detached elements
		style = elem.style;

	computed = computed || getStyles( elem );

	// getPropertyValue is needed for:
	//   .css('filter') (IE 9 only, #12537)
	//   .css('--customProperty) (#3144)
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];

		if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// https://drafts.csswg.org/cssom/#resolved-values
		if ( !support.pixelBoxStyles() && rnumnonpx.test( ret ) && rboxStyle.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE <=9 - 11 only
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rcustomProp = /^--/,
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style;

// Return a css property mapped to a potentially vendor prefixed property
function vendorPropName( name ) {

	// Shortcut for names that are not vendor prefixed
	if ( name in emptyStyle ) {
		return name;
	}

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

// Return a property mapped along what jQuery.cssProps suggests or to
// a vendor prefixed property.
function finalPropName( name ) {
	var ret = jQuery.cssProps[ name ];
	if ( !ret ) {
		ret = jQuery.cssProps[ name ] = vendorPropName( name ) || name;
	}
	return ret;
}

function setPositiveNumber( elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function boxModelAdjustment( elem, dimension, box, isBorderBox, styles, computedVal ) {
	var i = dimension === "width" ? 1 : 0,
		extra = 0,
		delta = 0;

	// Adjustment may not be necessary
	if ( box === ( isBorderBox ? "border" : "content" ) ) {
		return 0;
	}

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin
		if ( box === "margin" ) {
			delta += jQuery.css( elem, box + cssExpand[ i ], true, styles );
		}

		// If we get here with a content-box, we're seeking "padding" or "border" or "margin"
		if ( !isBorderBox ) {

			// Add padding
			delta += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// For "border" or "margin", add border
			if ( box !== "padding" ) {
				delta += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );

			// But still keep track of it otherwise
			} else {
				extra += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}

		// If we get here with a border-box (content + padding + border), we're seeking "content" or
		// "padding" or "margin"
		} else {

			// For "content", subtract padding
			if ( box === "content" ) {
				delta -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// For "content" or "padding", subtract border
			if ( box !== "margin" ) {
				delta -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	// Account for positive content-box scroll gutter when requested by providing computedVal
	if ( !isBorderBox && computedVal >= 0 ) {

		// offsetWidth/offsetHeight is a rounded sum of content, padding, scroll gutter, and border
		// Assuming integer scroll gutter, subtract the rest and round down
		delta += Math.max( 0, Math.ceil(
			elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
			computedVal -
			delta -
			extra -
			0.5
		) );
	}

	return delta;
}

function getWidthOrHeight( elem, dimension, extra ) {

	// Start with computed style
	var styles = getStyles( elem ),
		val = curCSS( elem, dimension, styles ),
		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
		valueIsBorderBox = isBorderBox;

	// Support: Firefox <=54
	// Return a confounding non-pixel value or feign ignorance, as appropriate.
	if ( rnumnonpx.test( val ) ) {
		if ( !extra ) {
			return val;
		}
		val = "auto";
	}

	// Check for style in case a browser which returns unreliable values
	// for getComputedStyle silently falls back to the reliable elem.style
	valueIsBorderBox = valueIsBorderBox &&
		( support.boxSizingReliable() || val === elem.style[ dimension ] );

	// Fall back to offsetWidth/offsetHeight when value is "auto"
	// This happens for inline elements with no explicit setting (gh-3571)
	// Support: Android <=4.1 - 4.3 only
	// Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
	if ( val === "auto" ||
		!parseFloat( val ) && jQuery.css( elem, "display", false, styles ) === "inline" ) {

		val = elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ];

		// offsetWidth/offsetHeight provide border-box values
		valueIsBorderBox = true;
	}

	// Normalize "" and auto
	val = parseFloat( val ) || 0;

	// Adjust for the element's box model
	return ( val +
		boxModelAdjustment(
			elem,
			dimension,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles,

			// Provide the current computed size to request scroll gutter calculation (gh-3589)
			val
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name ),
			style = elem.style;

		// Make sure that we're working with the right name. We don't
		// want to query the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (#7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			if ( type === "number" ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				if ( isCustomProp ) {
					style.setProperty( name, value );
				} else {
					style[ name ] = value;
				}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name );

		// Make sure that we're working with the right name. We don't
		// want to modify the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}

		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( i, dimension ) {
	jQuery.cssHooks[ dimension ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

					// Support: Safari 8+
					// Table columns in Safari have non-zero offsetWidth & zero
					// getBoundingClientRect().width unless display is changed.
					// Support: IE <=11 only
					// Running getBoundingClientRect on a disconnected node
					// in IE throws an error.
					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, dimension, extra );
						} ) :
						getWidthOrHeight( elem, dimension, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = getStyles( elem ),
				isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
				subtract = extra && boxModelAdjustment(
					elem,
					dimension,
					extra,
					isBorderBox,
					styles
				);

			// Account for unreliable border-box dimensions by comparing offset* to computed and
			// faking a content-box to get border and padding (gh-3699)
			if ( isBorderBox && support.scrollboxSize() === styles.position ) {
				subtract -= Math.ceil(
					elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
					parseFloat( styles[ dimension ] ) -
					boxModelAdjustment( elem, dimension, "border", false, styles ) -
					0.5
				);
			}

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ dimension ] = value;
				value = jQuery.css( elem, dimension );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
				) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( prefix !== "margin" ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( Array.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 &&
				( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
					jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9 only
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, inProgress,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

function schedule() {
	if ( inProgress ) {
		if ( document.hidden === false && window.requestAnimationFrame ) {
			window.requestAnimationFrame( schedule );
		} else {
			window.setTimeout( schedule, jQuery.fx.interval );
		}

		jQuery.fx.tick();
	}
}

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = Date.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
		isBox = "width" in props || "height" in props,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHiddenWithinTree( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );

	// Queue-skipping animations hijack the fx hooks
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// Ensure the complete handler is called before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Detect show/hide animations
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.test( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// Pretend to be hidden if this is a "show" and
				// there is still data from a stopped show/hide
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;

				// Ignore all other no-op show/hide data
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	// Bail out if this is a no-op like .hide().hide()
	propTween = !jQuery.isEmptyObject( props );
	if ( !propTween && jQuery.isEmptyObject( orig ) ) {
		return;
	}

	// Restrict "overflow" and "display" styles during box animations
	if ( isBox && elem.nodeType === 1 ) {

		// Support: IE <=9 - 11, Edge 12 - 15
		// Record all 3 overflow attributes because IE does not infer the shorthand
		// from identically-valued overflowX and overflowY and Edge just mirrors
		// the overflowX value there.
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Identify a display type, preferring old show/hide data over the CSS cascade
		restoreDisplay = dataShow && dataShow.display;
		if ( restoreDisplay == null ) {
			restoreDisplay = dataPriv.get( elem, "display" );
		}
		display = jQuery.css( elem, "display" );
		if ( display === "none" ) {
			if ( restoreDisplay ) {
				display = restoreDisplay;
			} else {

				// Get nonempty value(s) by temporarily forcing visibility
				showHide( [ elem ], true );
				restoreDisplay = elem.style.display || restoreDisplay;
				display = jQuery.css( elem, "display" );
				showHide( [ elem ] );
			}
		}

		// Animate inline elements as inline-block
		if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
			if ( jQuery.css( elem, "float" ) === "none" ) {

				// Restore the original display value at the end of pure show/hide animations
				if ( !propTween ) {
					anim.done( function() {
						style.display = restoreDisplay;
					} );
					if ( restoreDisplay == null ) {
						display = style.display;
						restoreDisplay = display === "none" ? "" : display;
					}
				}
				style.display = "inline-block";
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// Implement show/hide animations
	propTween = false;
	for ( prop in orig ) {

		// General show/hide setup for this element animation
		if ( !propTween ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
			}

			// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}

			// Show elements before animating them
			if ( hidden ) {
				showHide( [ elem ], true );
			}

			/* eslint-disable no-loop-func */

			anim.done( function() {

			/* eslint-enable no-loop-func */

				// The final step of a "hide" animation is actually hiding the element
				if ( !hidden ) {
					showHide( [ elem ] );
				}
				dataPriv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
		}

		// Per-property setup
		propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
		if ( !( prop in dataShow ) ) {
			dataShow[ prop ] = propTween.start;
			if ( hidden ) {
				propTween.end = propTween.start;
				propTween.start = 0;
			}
		}
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( Array.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3 only
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			// If there's more to do, yield
			if ( percent < 1 && length ) {
				return remaining;
			}

			// If this was an empty animation, synthesize a final progress notification
			if ( !length ) {
				deferred.notifyWith( elem, [ animation, 1, 0 ] );
			}

			// Resolve the animation and report its conclusion
			deferred.resolveWith( elem, [ animation ] );
			return false;
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					result.stop.bind( result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	// Attach callbacks from options
	animation
		.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	return animation;
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnothtmlwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !isFunction( easing ) && easing
	};

	// Go to the end state if fx are off
	if ( jQuery.fx.off ) {
		opt.duration = 0;

	} else {
		if ( typeof opt.duration !== "number" ) {
			if ( opt.duration in jQuery.fx.speeds ) {
				opt.duration = jQuery.fx.speeds[ opt.duration ];

			} else {
				opt.duration = jQuery.fx.speeds._default;
			}
		}
	}

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = Date.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Run the timer and safely remove it when done (allowing for external removal)
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	jQuery.fx.start();
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( inProgress ) {
		return;
	}

	inProgress = true;
	schedule();
};

jQuery.fx.stop = function() {
	inProgress = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: Android <=4.3 only
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE <=11 only
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: IE <=11 only
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// Attribute hooks are determined by the lowercase version
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name,
			i = 0,

			// Attribute names can contain non-HTML whitespace characters
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrNames = value && value.match( rnothtmlwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle,
			lowercaseName = name.toLowerCase();

		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ lowercaseName ];
			attrHandle[ lowercaseName ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				lowercaseName :
				null;
			attrHandle[ lowercaseName ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// Support: IE <=9 - 11 only
				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				if ( tabindex ) {
					return parseInt( tabindex, 10 );
				}

				if (
					rfocusable.test( elem.nodeName ) ||
					rclickable.test( elem.nodeName ) &&
					elem.href
				) {
					return 0;
				}

				return -1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




	// Strip and collapse whitespace according to HTML spec
	// https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace
	function stripAndCollapse( value ) {
		var tokens = value.match( rnothtmlwhite ) || [];
		return tokens.join( " " );
	}


function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

function classesToArray( value ) {
	if ( Array.isArray( value ) ) {
		return value;
	}
	if ( typeof value === "string" ) {
		return value.match( rnothtmlwhite ) || [];
	}
	return [];
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		classes = classesToArray( value );

		if ( classes.length ) {
			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		classes = classesToArray( value );

		if ( classes.length ) {
			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isValidValue = type === "string" || Array.isArray( value );

		if ( typeof stateVal === "boolean" && isValidValue ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( isValidValue ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = classesToArray( value );

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
						"" :
						dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
					return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, valueIsFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				// Handle most common string cases
				if ( typeof ret === "string" ) {
					return ret.replace( rreturn, "" );
				}

				// Handle cases where value is null/undef or number
				return ret == null ? "" : ret;
			}

			return;
		}

		valueIsFunction = isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( valueIsFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( Array.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE <=10 - 11 only
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripAndCollapse( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option, i,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one",
					values = one ? null : [],
					max = one ? index + 1 : options.length;

				if ( index < 0 ) {
					i = max;

				} else {
					i = one ? index : 0;
				}

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Support: IE <=9 only
					// IE8-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							!option.disabled &&
							( !option.parentNode.disabled ||
								!nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					/* eslint-disable no-cond-assign */

					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}

					/* eslint-enable no-cond-assign */
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( Array.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion


support.focusin = "onfocusin" in window;


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	stopPropagationCallback = function( e ) {
		e.stopPropagation();
	};

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special, lastElement,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = lastElement = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {
			lastElement = cur;
			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( dataPriv.get( cur, "events" ) || {} )[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && isFunction( elem[ type ] ) && !isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;

					if ( event.isPropagationStopped() ) {
						lastElement.addEventListener( type, stopPropagationCallback );
					}

					elem[ type ]();

					if ( event.isPropagationStopped() ) {
						lastElement.removeEventListener( type, stopPropagationCallback );
					}

					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


// Support: Firefox <=44
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					dataPriv.remove( doc, fix );

				} else {
					dataPriv.access( doc, fix, attaches );
				}
			}
		};
	} );
}
var location = window.location;

var nonce = Date.now();

var rquery = ( /\?/ );



// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE 9 - 11 only
	// IE throws on parseFromString with invalid input.
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undefined;
	}

	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( Array.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && toType( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, valueOrFunction ) {

			// If value is a function, invoke it and use its return value
			var value = isFunction( valueOrFunction ) ?
				valueOrFunction() :
				valueOrFunction;

			s[ s.length ] = encodeURIComponent( key ) + "=" +
				encodeURIComponent( value == null ? "" : value );
		};

	// If an array was passed in, assume that it is an array of form elements.
	if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} )
		.filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function( i, elem ) {
			var val = jQuery( this ).val();

			if ( val == null ) {
				return null;
			}

			if ( Array.isArray( val ) ) {
				return jQuery.map( val, function( val ) {
					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
				} );
			}

			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


var
	r20 = /%20/g,
	rhash = /#.*$/,
	rantiCache = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	originAnchor = document.createElement( "a" );
	originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

		if ( isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",

		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": JSON.parse,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,

			// URL without anti-cache param
			cacheURL,

			// Response headers
			responseHeadersString,
			responseHeaders,

			// timeout handle
			timeoutTimer,

			// Url cleanup var
			urlAnchor,

			// Request state (becomes false upon send and true upon completion)
			completed,

			// To know if global events are to be dispatched
			fireGlobals,

			// Loop variable
			i,

			// uncached part of the url
			uncached,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( completed ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return completed ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( completed == null ) {
						name = requestHeadersNames[ name.toLowerCase() ] =
							requestHeadersNames[ name.toLowerCase() ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( completed == null ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( completed ) {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						} else {

							// Lazy-add the new callbacks in a way that preserves old ones
							for ( code in map ) {
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR );

		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || location.href ) + "" )
			.replace( rprotocol, location.protocol + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// Support: IE <=8 - 11, Edge 12 - 15
			// IE throws exception on accessing the href property if url is malformed,
			// e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE <=8 - 11 only
				// Anchor's host property isn't correctly set when s.url is relative
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( completed ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		// Remove hash to simplify url manipulation
		cacheURL = s.url.replace( rhash, "" );

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// Remember the hash so we can put it back
			uncached = s.url.slice( cacheURL.length );

			// If data is available and should be processed, append data to url
			if ( s.data && ( s.processData || typeof s.data === "string" ) ) {
				cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add or update anti-cache param if needed
			if ( s.cache === false ) {
				cacheURL = cacheURL.replace( rantiCache, "$1" );
				uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce++ ) + uncached;
			}

			// Put hash and anti-cache on the URL that will be requested (gh-1732)
			s.url = cacheURL + uncached;

		// Change '%20' to '+' if this is encoded form body content (gh-2658)
		} else if ( s.data && s.processData &&
			( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
			s.data = s.data.replace( r20, "+" );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		completeDeferred.add( s.complete );
		jqXHR.done( s.success );
		jqXHR.fail( s.error );

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( completed ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				completed = false;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Rethrow post-completion exceptions
				if ( completed ) {
					throw e;
				}

				// Propagate others as results
				done( -1, e );
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Ignore repeat invocations
			if ( completed ) {
				return;
			}

			completed = true;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		if ( isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );


jQuery._evalUrl = function( url ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,
		"throws": true
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( this[ 0 ] ) {
			if ( isFunction( html ) ) {
				html = html.call( this[ 0 ] );
			}

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var htmlIsFunction = isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( htmlIsFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function( selector ) {
		this.parent( selector ).not( "body" ).each( function() {
			jQuery( this ).replaceWith( this.childNodes );
		} );
		return this;
	}
} );


jQuery.expr.pseudos.hidden = function( elem ) {
	return !jQuery.expr.pseudos.visible( elem );
};
jQuery.expr.pseudos.visible = function( elem ) {
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};




jQuery.ajaxSettings.xhr = function() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE <=9 only
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.ontimeout =
									xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {

								// Support: IE <=9 only
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// File: protocol always yields status 0; see #8605, #14207
										xhr.status,
										xhr.statusText
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE <=9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				errorCallback = xhr.onerror = xhr.ontimeout = callback( "error" );

				// Support: IE 9 only
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorCallback;
				} else {
					xhr.onreadystatechange = function() {

						// Check readyState before timeout as it changes
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							window.setTimeout( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				callback = callback( "abort" );

				try {

					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
jQuery.ajaxPrefilter( function( s ) {
	if ( s.crossDomain ) {
		s.contents.script = false;
	}
} );

// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" ).prop( {
					charset: s.scriptCharset,
					src: s.url
				} ).on(
					"load error",
					callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// Force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// Save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// Support: Safari 8 only
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createHTMLDocument = ( function() {
	var body = document.implementation.createHTMLDocument( "" ).body;
	body.innerHTML = "<form></form><form></form>";
	return body.childNodes.length === 2;
} )();


// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" ) {
		return [];
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	var base, parsed, scripts;

	if ( !context ) {

		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		if ( support.createHTMLDocument ) {
			context = document.implementation.createHTMLDocument( "" );

			// Set the base href for the created document
			// so any parsed elements with URLs
			// are based on the document's URL (gh-2965)
			base = context.createElement( "base" );
			base.href = document.location.href;
			context.head.appendChild( base );
		} else {
			context = document;
		}
	}

	parsed = rsingleTag.exec( data );
	scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = stripAndCollapse( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




// Attach a bunch of functions for handling common AJAX events
jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.expr.pseudos.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {

	// offset() relates an element's border box to the document origin
	offset: function( options ) {

		// Preserve chaining for setter
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var rect, win,
			elem = this[ 0 ];

		if ( !elem ) {
			return;
		}

		// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
		// Support: IE <=11 only
		// Running getBoundingClientRect on a
		// disconnected node in IE throws an error
		if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}

		// Get document-relative position by adding viewport scroll to viewport-relative gBCR
		rect = elem.getBoundingClientRect();
		win = elem.ownerDocument.defaultView;
		return {
			top: rect.top + win.pageYOffset,
			left: rect.left + win.pageXOffset
		};
	},

	// position() relates an element's margin box to its offset parent's padding box
	// This corresponds to the behavior of CSS absolute positioning
	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset, doc,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// position:fixed elements are offset from the viewport, which itself always has zero offset
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume position:fixed implies availability of getBoundingClientRect
			offset = elem.getBoundingClientRect();

		} else {
			offset = this.offset();

			// Account for the *real* offset parent, which can be the document or its root element
			// when a statically positioned element is identified
			doc = elem.ownerDocument;
			offsetParent = elem.offsetParent || doc.documentElement;
			while ( offsetParent &&
				( offsetParent === doc.body || offsetParent === doc.documentElement ) &&
				jQuery.css( offsetParent, "position" ) === "static" ) {

				offsetParent = offsetParent.parentNode;
			}
			if ( offsetParent && offsetParent !== elem && offsetParent.nodeType === 1 ) {

				// Incorporate borders into its offset, since they are outside its content origin
				parentOffset = jQuery( offsetParent ).offset();
				parentOffset.top += jQuery.css( offsetParent, "borderTopWidth", true );
				parentOffset.left += jQuery.css( offsetParent, "borderLeftWidth", true );
			}
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {

			// Coalesce documents and windows
			var win;
			if ( isWindow( elem ) ) {
				win = elem;
			} else if ( elem.nodeType === 9 ) {
				win = elem.defaultView;
			}

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
		function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( isWindow( elem ) ) {

					// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
					return funcName.indexOf( "outer" ) === 0 ?
						elem[ "inner" + name ] :
						elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );


jQuery.each( ( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
	function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
} );

jQuery.fn.extend( {
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );




jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	}
} );

// Bind a function to a context, optionally partially applying any
// arguments.
// jQuery.proxy is deprecated to promote standards (specifically Function#bind)
// However, it is not slated for removal any time soon
jQuery.proxy = function( fn, context ) {
	var tmp, args, proxy;

	if ( typeof context === "string" ) {
		tmp = fn[ context ];
		context = fn;
		fn = tmp;
	}

	// Quick check to determine if target is callable, in the spec
	// this throws a TypeError, but we will just return undefined.
	if ( !isFunction( fn ) ) {
		return undefined;
	}

	// Simulated bind
	args = slice.call( arguments, 2 );
	proxy = function() {
		return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
	};

	// Set the guid of unique handler to the same of original handler, so it can be removed
	proxy.guid = fn.guid = fn.guid || jQuery.guid++;

	return proxy;
};

jQuery.holdReady = function( hold ) {
	if ( hold ) {
		jQuery.readyWait++;
	} else {
		jQuery.ready( true );
	}
};
jQuery.isArray = Array.isArray;
jQuery.parseJSON = JSON.parse;
jQuery.nodeName = nodeName;
jQuery.isFunction = isFunction;
jQuery.isWindow = isWindow;
jQuery.camelCase = camelCase;
jQuery.type = toType;

jQuery.now = Date.now;

jQuery.isNumeric = function( obj ) {

	// As of jQuery 3.0, isNumeric is limited to
	// strings and numbers (primitives or objects)
	// that can be coerced to finite numbers (gh-2662)
	var type = jQuery.type( obj );
	return ( type === "number" || type === "string" ) &&

		// parseFloat NaNs numeric-cast false positives ("")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		!isNaN( obj - parseFloat( obj ) );
};




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	} );
}




var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( !noGlobal ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;
} );

},{"process":"node_modules/process/browser.js"}],"non-empty-tiles_9.json":[function(require,module,exports) {
module.exports = [1, 4, 6, 5, 7, 16, 20, 24, 28, 17, 21, 25, 29, 18, 22, 26, 30, 65, 73, 81, 97, 105, 113, 121, 66, 74, 82, 90, 98, 106, 114, 122, 67, 75, 83, 91, 99, 107, 115, 123, 68, 76, 84, 92, 100, 108, 116, 124, 69, 85, 93, 125, 322, 338, 386, 259, 291, 339, 387, 403, 419, 435, 467, 483, 499, 260, 276, 292, 308, 340, 356, 372, 388, 404, 420, 436, 452, 468, 484, 500, 261, 293, 309, 325, 341, 373, 389, 405, 421, 437, 453, 469, 485, 501, 262, 294, 310, 326, 342, 358, 374, 390, 406, 422, 438, 454, 470, 486, 263, 279, 295, 311, 327, 343, 359, 375, 391, 407, 423, 439, 455, 471, 487, 264, 280, 312, 328, 344, 360, 376, 392, 408, 424, 456, 472, 488, 504, 297, 313, 329, 345, 361, 377, 393, 409, 425, 473, 489, 505, 266, 330, 346, 362, 490, 506, 1316, 1572, 1349, 1382, 1606, 1862, 1063, 1159, 1383, 1575, 1607, 1639, 1671, 1703, 1767, 1927, 1991, 1032, 1096, 1128, 1160, 1192, 1224, 1256, 1384, 1416, 1448, 1480, 1512, 1544, 1576, 1608, 1640, 1672, 1704, 1736, 1800, 1832, 1864, 1896, 1928, 1960, 1992, 2024, 1097, 1129, 1161, 1193, 1225, 1257, 1385, 1417, 1513, 1545, 1577, 1609, 1641, 1673, 1705, 1737, 1769, 1801, 1833, 1865, 1897, 1929, 1961, 1993, 1066, 1162, 1194, 1226, 1258, 1290, 1322, 1354, 1386, 1514, 1546, 1578, 1610, 1642, 1674, 1706, 1738, 1770, 1802, 1834, 1866, 1898, 1930, 1962, 1994, 1163, 1195, 1227, 1259, 1291, 1323, 1355, 1387, 1515, 1547, 1579, 1611, 1643, 1675, 1707, 1739, 1771, 1803, 1835, 1867, 1899, 1931, 1164, 1196, 1228, 1260, 1292, 1324, 1356, 1452, 1484, 1516, 1548, 1580, 1612, 1644, 1676, 1708, 1740, 1772, 1804, 1836, 1868, 1900, 1932, 1069, 1197, 1229, 1261, 1293, 1325, 1485, 1517, 1549, 1581, 1613, 1645, 1677, 1709, 1741, 1773, 1805, 1837, 1869, 1901, 1070, 1102, 1198, 1230, 1262, 1294, 1326, 1358, 1454, 1486, 1518, 1550, 1582, 1614, 1646, 1678, 1710, 1742, 1774, 1806, 1838, 1870, 1902, 1934, 1295, 1327, 1359, 1391, 1487, 1519, 1551, 1583, 1615, 1647, 1679, 1743, 1775, 1807, 1839, 1871, 1903, 1136, 1264, 1296, 1328, 1360, 1392, 1424, 1456, 1552, 1584, 1616, 1648, 1680, 1808, 1840, 1872, 1904, 1936, 1968, 2000, 2032, 1041, 1105, 1329, 1361, 1393, 1425, 1457, 1521, 1585, 1617, 1649, 1681, 1713, 1873, 1905, 1937, 1969, 2001, 2033, 1170, 1234, 1330, 1362, 1394, 1426, 1586, 1618, 1650, 1682, 1874, 1906, 1938, 1970, 2002, 1331, 1363, 1395, 1491, 1587, 1619, 1875, 1907, 1939, 1971, 2035, 1044, 1332, 1364, 1940, 1972, 2004, 2036, 1333, 1365, 1429, 6280, 5321, 5451, 5516, 5517, 6413, 7437, 5518, 6286, 6350, 6414, 6478, 6542, 6798, 7118, 7950, 4303, 4623, 5519, 6287, 6351, 6415, 6479, 6543, 6735, 6863, 7119, 7759, 8015, 4176, 5520, 5584, 5712, 5840, 5904, 5968, 6288, 6352, 6416, 6480, 6544, 6608, 6672, 6736, 6800, 6928, 6992, 7248, 7376, 7504, 7760, 7824, 8144, 4433, 4561, 4625, 4753, 4817, 4881, 5073, 5521, 5585, 5841, 5905, 5969, 6033, 6225, 6289, 6353, 6417, 6481, 6545, 6609, 6673, 6737, 6801, 6865, 6993, 7441, 7505, 7633, 7825, 8017, 4434, 4562, 4626, 4690, 4754, 4818, 4882, 5586, 5650, 6098, 6162, 6226, 6290, 6354, 6418, 6482, 6546, 6610, 6674, 6738, 6802, 6866, 6930, 6994, 7058, 7122, 7186, 7442, 7570, 7762, 7826, 7954, 4563, 4755, 4819, 4883, 5011, 5075, 6035, 6099, 6163, 6227, 6291, 6355, 6419, 6483, 6547, 6611, 6675, 6739, 6803, 6867, 6931, 6995, 7059, 7123, 7187, 7251, 7315, 7379, 7443, 7571, 7955, 4244, 4308, 4628, 4692, 4756, 4820, 4884, 4948, 5012, 5204, 5396, 5460, 6036, 6100, 6164, 6228, 6292, 6356, 6420, 6484, 6548, 6612, 6676, 6740, 6804, 6868, 6932, 6996, 7060, 7124, 7188, 7252, 7316, 7380, 7444, 7508, 7572, 7764, 7956, 8020, 4693, 4757, 4821, 4885, 4949, 5013, 5077, 5141, 5205, 5269, 5333, 5397, 5461, 5525, 6037, 6101, 6165, 6229, 6293, 6357, 6421, 6485, 6549, 6613, 6677, 6741, 6805, 6869, 6933, 6997, 7061, 7125, 7189, 7317, 7381, 7445, 7509, 7573, 7637, 7701, 7765, 7893, 4694, 4758, 4822, 4886, 4950, 5014, 5078, 5142, 5206, 5270, 5334, 5398, 5462, 5526, 6102, 6166, 6230, 6294, 6358, 6422, 6486, 6550, 6614, 6678, 6742, 6806, 6870, 6934, 6998, 7062, 7126, 7318, 7382, 7638, 7702, 7766, 4695, 4759, 4823, 4887, 4951, 5015, 5079, 5143, 5207, 5271, 5335, 5399, 5463, 6039, 6103, 6167, 6231, 6295, 6359, 6423, 6487, 6551, 6615, 6679, 6743, 6807, 6871, 6935, 6999, 7063, 7127, 7255, 7511, 7575, 7639, 7703, 7767, 4696, 4760, 4824, 4888, 4952, 5016, 5080, 5144, 5208, 5272, 5336, 5784, 5848, 6040, 6104, 6168, 6232, 6296, 6360, 6424, 6488, 6552, 6616, 6680, 6744, 6808, 6872, 6936, 7000, 7320, 7384, 7448, 7512, 7576, 7704, 7768, 4761, 4825, 4889, 4953, 5017, 5081, 5145, 5209, 5273, 5401, 5913, 5977, 6041, 6105, 6169, 6233, 6297, 6361, 6425, 6489, 6553, 6617, 6681, 6745, 6809, 6937, 7001, 7065, 7193, 7321, 7385, 7449, 7513, 7577, 7641, 7705, 7769, 4826, 4890, 4954, 5018, 5082, 5146, 5210, 5914, 5978, 6042, 6106, 6170, 6362, 6426, 6490, 6554, 6682, 6746, 6810, 6874, 6938, 7002, 7130, 7194, 7258, 7322, 7450, 7514, 7642, 4315, 4891, 4955, 5019, 5211, 5275, 5979, 6171, 6235, 6299, 6491, 6555, 6619, 6683, 6747, 6811, 6875, 6939, 7003, 7067, 7131, 7195, 7259, 7323, 7451, 7515, 7579, 4316, 4380, 4828, 4956, 5020, 5084, 5148, 5212, 5276, 5340, 5404, 5468, 5852, 5916, 5980, 6108, 6172, 6492, 6556, 6620, 6748, 6812, 6940, 7004, 7068, 7132, 7196, 7260, 7324, 7516, 5021, 5085, 5149, 5213, 5277, 5341, 5469, 5853, 5917, 5981, 6045, 6109, 6173, 6237, 6301, 6365, 6493, 6557, 6621, 6685, 7005, 7069, 7261, 7325, 7389, 7517, 7581, 7773, 5150, 5214, 5278, 5342, 5406, 5470, 5534, 5982, 6046, 6110, 6174, 6238, 6302, 6366, 6430, 6494, 6558, 6622, 6686, 7006, 7070, 7198, 7262, 7326, 7390, 7454, 7518, 7582, 7646, 5215, 5279, 5343, 5471, 5535, 6047, 6111, 6239, 6303, 6495, 6559, 6623, 7007, 7199, 7263, 7327, 7391, 7455, 7519, 7583, 5088, 5152, 5216, 5280, 5344, 5408, 5472, 5536, 5600, 5664, 5728, 5792, 6240, 6304, 6368, 6496, 6560, 6624, 6752, 7264, 7328, 7392, 7456, 7520, 7584, 7648, 7712, 7904, 8160, 4577, 5217, 5281, 5345, 5409, 5473, 5537, 5601, 5665, 5729, 6305, 6369, 6433, 6497, 6561, 7329, 7393, 7457, 7521, 7585, 7649, 7777, 7841, 8033, 4130, 4194, 5282, 5346, 5410, 5474, 5538, 5602, 5666, 5730, 6050, 6306, 6434, 6498, 6562, 6690, 7586, 7650, 7714, 7778, 4131, 4195, 4451, 5347, 5411, 5475, 5539, 5603, 5667, 5731, 5795, 6307, 6371, 6435, 6499, 6563, 6627, 6691, 6755, 6819, 6883, 7459, 7523, 7587, 7651, 7715, 7779, 7843, 8035, 8163, 4644, 5348, 5412, 5476, 5540, 5604, 5668, 6308, 6372, 6436, 6500, 6564, 6628, 6692, 7524, 7652, 7716, 7780, 7844, 7908, 8036, 4901, 5349, 5413, 5477, 5541, 5605, 6373, 6437, 6501, 7461, 7525, 7589, 7653, 7717, 7781, 7845, 7909, 7973, 5350, 5414, 5478, 5542, 6374, 6438, 7462, 7526, 7654, 7718, 7782, 7846, 7910, 8102, 8166, 5287, 5351, 5415, 5479, 5991, 7719, 7783, 7847, 8103, 8167, 4136, 5288, 5352, 5416, 7784, 7848, 8040, 8104, 8168, 5353, 5417, 8041, 8105, 5354, 5482, 5355, 5739, 25233, 21395, 21911, 22041, 22042, 22170, 29722, 22043, 22171, 25627, 25372, 25500, 25628, 25884, 26012, 22173, 25245, 25373, 25501, 25757, 25885, 26013, 26141, 27165, 28573, 31901, 18462, 22046, 25118, 25246, 25374, 25502, 25630, 26014, 26142, 26910, 27038, 31134, 32158, 17183, 22047, 22175, 25119, 25247, 25375, 25503, 25631, 25759, 25887, 26015, 26271, 26911, 27423, 27551, 28447, 22176, 22816, 22944, 23456, 23584, 23712, 23840, 25120, 25248, 25376, 25504, 25632, 25760, 25888, 26144, 26528, 26912, 27168, 27296, 27808, 28064, 29600, 31008, 31392, 16673, 22177, 22305, 23457, 23585, 23841, 23969, 25121, 25249, 25377, 25505, 25633, 25761, 25889, 26145, 26401, 26657, 26913, 27041, 27169, 28065, 29089, 30113, 31009, 32673, 18210, 18338, 22178, 23458, 23586, 23714, 23842, 24866, 24994, 25122, 25250, 25378, 25506, 25634, 25762, 25890, 26146, 26274, 26402, 26530, 26786, 26914, 27042, 27170, 27554, 27938, 28066, 29858, 29986, 30114, 17699, 18339, 18467, 18979, 19363, 19491, 20387, 22307, 24227, 24867, 24995, 25123, 25251, 25379, 25507, 25635, 25763, 25891, 26019, 26147, 26275, 26403, 26531, 26659, 26787, 26915, 27043, 27427, 27555, 27939, 29859, 30499, 31395, 32163, 17700, 18212, 18340, 19236, 22308, 22436, 24484, 24740, 24868, 24996, 25124, 25252, 25380, 25508, 25636, 25764, 25892, 26020, 26148, 26276, 26404, 26532, 26660, 26788, 27044, 27172, 27428, 27684, 27812, 27940, 28068, 28196, 28580, 28708, 29732, 29860, 30372, 17701, 18341, 18469, 18725, 18853, 18981, 19493, 19621, 22437, 22565, 24357, 24485, 24741, 24869, 24997, 25125, 25253, 25381, 25509, 25637, 25765, 25893, 26021, 26149, 26277, 26405, 26533, 26661, 26789, 26917, 27045, 27173, 27301, 27429, 27557, 28709, 30245, 31013, 31397, 31781, 20262, 24230, 24358, 24486, 24742, 24870, 24998, 25126, 25254, 25382, 25510, 25638, 25766, 25894, 26022, 26150, 26278, 26406, 26534, 26662, 26790, 26918, 27046, 27174, 27302, 27430, 27558, 27686, 27814, 28326, 28454, 28710, 28838, 28966, 29094, 29222, 29734, 30246, 30374, 18343, 18983, 19111, 19239, 19495, 20007, 20135, 20263, 20391, 24231, 24359, 24487, 24871, 24999, 25127, 25255, 25383, 25511, 25639, 25767, 25895, 26023, 26151, 26279, 26407, 26535, 26663, 26791, 26919, 27047, 27175, 27303, 27431, 27559, 27687, 27815, 27943, 28071, 28327, 28455, 28583, 28711, 28839, 28967, 29095, 29223, 29351, 29479, 30247, 31783, 31911, 17192, 18600, 18728, 18856, 19112, 19240, 19368, 19496, 19624, 19880, 20008, 20136, 21544, 24104, 24232, 24360, 24488, 24872, 25000, 25128, 25256, 25384, 25512, 25640, 25768, 25896, 26024, 26152, 26280, 26408, 26536, 26664, 26792, 26920, 27048, 27176, 27304, 27432, 27560, 27688, 27816, 27944, 28072, 28200, 28328, 28456, 28584, 28712, 28840, 29096, 29224, 29352, 29480, 30248, 31784, 32168, 16937, 18473, 18601, 18729, 18857, 18985, 19241, 19369, 19497, 19625, 19753, 19881, 20009, 20905, 21545, 21673, 21801, 24105, 24233, 24361, 24489, 24617, 24745, 24873, 25001, 25129, 25257, 25385, 25513, 25641, 25769, 25897, 26025, 26153, 26281, 26409, 26537, 26665, 26793, 26921, 27049, 27177, 27305, 27433, 27561, 27689, 27817, 27945, 28073, 28201, 28329, 28457, 28585, 28713, 28841, 29225, 29353, 29481, 29609, 29865, 30121, 30249, 31017, 31785, 18858, 18986, 19114, 19242, 19370, 19498, 19626, 19754, 19882, 20010, 20138, 20266, 20906, 21930, 22058, 24106, 24234, 24362, 24490, 24618, 24746, 24874, 25002, 25130, 25258, 25386, 25514, 25642, 25770, 25898, 26026, 26154, 26282, 26410, 26538, 26666, 26794, 26922, 27050, 27178, 27306, 27434, 27562, 27690, 27818, 27946, 28074, 28202, 28330, 28458, 28586, 28842, 29226, 29354, 29482, 29610, 29738, 29866, 29994, 30378, 30634, 30762, 31018, 31658, 18859, 18987, 19115, 19243, 19371, 19499, 19627, 19755, 19883, 20011, 20139, 20267, 20395, 20523, 20651, 20779, 20907, 21035, 21163, 21291, 21419, 21547, 21675, 21803, 21931, 22059, 24235, 24363, 24491, 24619, 24747, 24875, 25003, 25131, 25259, 25387, 25515, 25643, 25771, 25899, 26027, 26155, 26283, 26411, 26539, 26667, 26795, 27051, 27179, 27307, 27435, 27563, 27691, 27819, 27947, 28075, 28203, 28331, 28459, 28587, 28715, 29355, 29483, 29739, 29867, 29995, 30379, 30507, 30763, 30891, 31019, 18860, 18988, 19116, 19244, 19372, 19500, 19628, 19756, 19884, 20012, 20140, 20268, 20396, 20524, 20652, 20780, 20908, 21036, 21164, 21292, 21420, 21548, 21676, 21804, 21932, 22060, 22188, 24364, 24492, 24620, 24748, 24876, 25004, 25132, 25260, 25388, 25516, 25644, 25772, 25900, 26028, 26156, 26284, 26412, 26540, 26668, 26924, 27052, 27180, 27308, 27436, 27564, 27692, 28076, 28204, 28332, 29356, 29484, 29612, 30508, 30636, 30764, 31020, 18861, 18989, 19117, 19245, 19373, 19501, 19629, 19757, 19885, 20013, 20141, 20269, 20397, 20525, 20653, 20781, 20909, 21037, 21165, 21293, 21421, 21549, 21677, 21805, 22061, 22189, 24493, 24621, 24749, 24877, 25005, 25133, 25261, 25389, 25517, 25645, 25773, 25901, 26029, 26157, 26285, 26413, 26541, 26669, 26797, 27053, 27181, 27309, 27437, 27949, 28205, 28461, 30637, 31021, 18862, 18990, 19118, 19246, 19374, 19502, 19630, 19758, 19886, 20014, 20142, 20270, 20398, 20526, 20654, 20782, 20910, 21038, 21166, 21294, 21422, 21550, 21678, 21806, 24110, 24238, 24366, 24494, 24622, 24750, 24878, 25006, 25134, 25262, 25390, 25518, 25646, 25774, 25902, 26030, 26158, 26286, 26414, 26542, 26670, 26798, 26926, 27182, 27566, 27694, 27822, 27950, 28078, 28206, 28462, 30254, 30382, 30510, 30638, 30766, 31022, 31150, 18863, 18991, 19119, 19247, 19375, 19503, 19631, 19759, 19887, 20015, 20143, 20271, 20399, 20527, 20655, 20783, 20911, 21039, 21167, 21295, 21423, 24111, 24239, 24367, 24495, 24623, 24751, 24879, 25007, 25135, 25263, 25391, 25519, 25647, 25775, 25903, 26031, 26159, 26287, 26415, 26543, 26671, 26799, 27311, 27439, 27695, 27823, 27951, 28079, 29103, 30127, 30383, 30511, 30639, 30895, 31023, 18864, 18992, 19120, 19248, 19376, 19504, 19632, 19760, 19888, 20016, 20144, 20272, 20400, 20528, 20656, 20784, 20912, 21040, 21168, 21296, 23088, 23344, 24112, 24240, 24368, 24496, 24624, 24752, 24880, 25008, 25136, 25264, 25392, 25520, 25648, 25776, 25904, 26032, 26160, 26288, 26416, 26544, 26672, 26800, 27056, 27440, 27568, 27696, 27824, 27952, 28080, 29360, 29488, 29872, 30128, 30256, 30384, 30896, 31024, 18993, 19121, 19249, 19377, 19505, 19633, 19761, 19889, 20017, 20145, 20273, 20401, 20529, 20657, 20785, 20913, 21041, 21169, 23217, 23345, 23473, 24113, 24241, 24369, 24497, 24625, 24753, 24881, 25009, 25137, 25265, 25521, 25649, 25777, 25905, 26033, 26161, 26289, 26417, 26545, 26673, 26801, 26929, 27057, 27185, 27313, 27569, 27697, 27825, 28081, 30257, 30385, 30769, 30897, 31025, 18994, 19122, 19250, 19378, 19506, 19634, 19762, 19890, 20018, 20146, 20274, 20402, 20530, 20658, 20786, 20914, 21042, 21170, 24242, 24370, 24498, 24626, 24754, 24882, 25010, 25138, 25266, 25522, 25650, 25778, 25906, 26034, 26162, 26290, 26418, 26546, 26674, 26802, 26930, 27058, 27186, 27314, 27698, 27826, 27954, 28210, 28850, 29490, 30002, 30386, 30514, 30642, 30770, 30898, 31026, 19123, 19251, 19379, 19507, 19635, 19763, 19891, 20019, 20147, 20275, 20403, 20531, 20659, 20787, 20915, 21043, 21555, 21683, 23731, 23859, 24115, 24243, 24371, 24499, 24627, 24755, 24883, 25011, 25139, 25267, 25523, 25651, 26163, 26291, 26547, 26675, 26803, 26931, 27059, 27187, 27315, 27827, 27955, 28083, 28211, 29235, 29491, 29747, 29875, 30003, 30515, 30643, 30771, 19252, 19380, 19508, 19636, 19764, 19892, 20020, 20148, 20276, 20404, 20532, 20660, 20788, 20916, 24116, 24244, 24372, 24500, 24756, 25524, 25908, 26036, 26164, 26804, 26932, 27060, 27188, 27316, 27572, 27828, 27956, 28084, 28724, 29236, 29748, 29876, 30004, 30132, 30516, 19381, 19509, 19637, 19765, 19893, 20021, 20149, 20277, 20789, 20917, 23733, 23861, 23989, 24117, 24245, 24629, 25781, 25909, 26037, 26165, 26677, 26805, 27061, 27189, 27317, 27701, 27829, 28085, 28469, 28597, 28981, 29877, 30005, 30133, 19510, 19638, 19766, 19894, 20022, 20150, 20790, 20918, 21046, 23990, 24630, 25014, 25142, 26038, 26550, 26678, 26806, 26934, 27062, 27318, 27574, 27702, 27830, 28214, 28342, 28726, 28854, 29238, 30006, 30134, 30390, 17335, 19511, 19767, 19895, 20023, 20151, 20791, 20919, 21047, 23863, 24759, 26039, 26295, 26423, 26935, 27063, 27191, 27319, 27703, 27831, 27959, 28599, 28727, 28983, 29751, 29879, 30007, 30135, 30263, 17336, 17464, 19768, 19896, 20024, 20152, 20408, 20536, 20664, 20792, 20920, 21048, 21176, 21304, 21432, 23736, 23992, 25912, 26296, 26424, 27192, 27832, 27960, 28216, 28472, 28856, 29112, 29240, 29368, 30008, 30136, 19385, 19769, 19897, 20025, 20153, 20281, 20409, 20537, 20921, 21049, 21177, 21305, 21433, 21561, 21689, 21817, 23481, 23865, 24377, 24633, 27065, 27833, 27961, 28089, 28217, 28345, 28985, 29113, 29241, 29369, 30009, 30137, 20154, 20282, 20410, 20538, 20666, 20794, 21818, 23482, 23738, 23866, 23994, 24122, 24634, 24890, 26042, 26170, 26298, 26426, 26554, 26810, 27962, 28090, 28218, 28986, 29114, 29242, 29498, 30010, 30138, 31162, 20539, 20667, 20795, 21179, 21307, 21435, 21819, 23867, 23995, 24251, 24507, 24635, 24763, 24891, 25019, 25275, 25531, 26299, 26427, 26555, 26683, 27963, 28091, 28219, 29115, 29243, 29371, 29499, 30011, 30139, 30267, 31163, 20668, 20796, 20924, 21052, 21180, 21308, 21436, 21564, 21692, 21820, 23996, 24124, 24380, 24636, 24892, 25148, 25276, 25404, 26044, 26300, 26428, 26556, 26684, 28092, 28220, 29116, 29372, 29500, 29884, 30012, 30140, 30268, 20797, 20925, 21053, 21181, 21309, 21437, 21565, 21693, 21949, 22077, 23997, 24125, 24253, 24381, 24509, 24637, 24765, 24893, 25789, 26685, 28093, 28221, 28349, 28861, 28989, 29117, 29245, 29885, 30141, 30269, 30653, 21054, 21182, 21310, 21438, 21822, 22078, 22206, 24254, 24382, 24510, 25022, 25150, 26046, 26430, 27966, 28862, 28990, 29118, 29246, 29758, 29886, 30014, 20927, 21055, 21183, 21311, 21823, 22207, 24895, 25023, 26047, 26175, 28991, 29247, 29375, 29503, 29631, 30271, 30399, 20416, 20544, 20928, 21056, 21184, 21568, 21696, 21952, 22080, 22208, 22336, 22464, 22592, 25024, 25920, 26048, 26176, 26304, 26560, 29120, 29248, 29376, 29504, 29632, 29888, 30272, 30656, 30912, 32576, 20929, 21057, 21185, 21441, 21569, 21697, 21825, 21953, 22081, 22209, 22337, 22465, 22593, 22721, 22849, 22977, 23105, 25153, 25281, 25409, 25921, 26305, 26433, 27073, 29249, 29377, 29761, 30017, 30145, 31553, 20930, 21058, 21186, 21314, 21698, 22338, 22466, 22594, 22722, 22850, 22978, 25538, 25922, 26178, 26306, 29378, 29506, 29634, 29762, 29890, 30018, 30146, 30658, 31170, 31298, 18243, 21059, 21187, 21443, 21571, 21699, 21955, 22083, 22211, 22339, 22467, 22595, 22723, 22851, 22979, 25155, 25283, 25795, 26179, 29763, 29891, 30019, 30147, 30275, 31043, 31299, 32195, 16580, 16708, 21060, 21188, 21316, 21444, 21700, 21828, 21956, 22084, 22340, 22468, 22596, 22724, 22852, 25156, 25284, 25796, 25924, 26180, 26692, 26820, 30532, 30788, 16581, 16709, 21189, 21317, 21445, 21573, 21701, 21829, 21957, 22085, 22213, 22341, 22469, 22597, 22725, 22853, 24261, 25925, 26181, 26693, 26821, 30277, 30661, 31173, 16710, 17734, 21318, 21446, 21574, 21702, 21830, 21958, 22086, 22214, 22342, 22470, 22598, 22726, 22854, 25286, 25414, 25798, 25926, 26054, 26182, 26694, 26822, 30150, 30278, 30406, 30534, 31046, 31174, 31302, 32198, 32710, 16583, 16711, 21447, 21575, 21703, 21959, 22087, 22215, 22343, 22471, 22599, 22727, 23239, 25287, 25415, 25671, 25927, 26567, 26695, 26823, 27079, 27207, 27463, 29767, 29895, 30023, 30407, 30663, 30791, 30919, 31047, 31175, 31303, 31431, 32071, 32199, 21320, 21448, 21576, 21704, 21832, 21960, 22088, 22216, 22344, 22472, 22600, 22728, 25288, 25416, 25800, 25928, 26184, 26568, 26824, 30024, 30152, 30536, 30664, 30920, 31048, 31176, 31304, 31432, 32200, 18633, 21321, 21449, 21577, 21705, 21833, 21961, 22089, 22217, 22345, 22473, 25289, 25417, 25673, 25801, 25929, 26057, 26697, 30665, 30921, 31177, 31305, 31433, 31561, 19658, 21322, 21450, 21578, 21706, 21834, 21962, 22090, 22218, 22346, 25418, 25546, 25674, 25802, 25930, 26058, 29770, 29898, 30410, 30666, 30922, 31178, 31306, 31434, 31562, 21323, 21451, 21579, 21707, 21835, 21963, 22091, 22219, 22347, 25419, 25547, 25675, 25803, 25931, 26059, 29771, 29899, 30027, 30155, 30667, 30795, 31051, 31179, 31307, 31435, 31563, 31819, 21324, 21452, 21580, 21708, 21836, 21964, 22092, 22220, 25420, 25548, 25676, 25804, 29772, 29900, 30028, 30156, 30668, 30796, 30924, 31052, 31180, 31308, 31436, 31564, 21325, 21453, 21581, 21709, 21837, 21965, 22093, 25421, 29901, 30797, 30925, 31053, 31181, 31309, 31437, 32461, 32589, 21198, 21326, 21454, 21710, 21838, 21966, 24014, 30926, 31054, 31182, 31310, 31438, 32590, 32718, 21199, 21327, 21455, 21583, 21711, 31183, 31311, 32463, 32591, 32719, 21200, 21328, 21456, 21584, 31184, 31312, 32336, 32464, 32592, 16593, 21201, 21329, 21585, 31313, 32209, 32337, 32465, 21330, 21458, 21586, 32210, 32338, 21331, 21459, 21587, 21332, 21460, 21333, 21461, 21973, 21334, 21462, 21463, 22999, 101155, 85542, 87854, 88115, 88116, 88629, 119093, 88374, 88375, 88887, 102455, 102200, 102712, 101689, 101945, 103481, 103737, 103993, 88890, 101178, 101434, 101690, 101946, 102970, 103738, 104250, 104506, 104762, 114234, 88635, 100923, 101179, 101435, 104251, 108859, 127547, 73788, 88380, 100668, 100924, 101180, 101436, 101692, 102204, 102460, 103996, 104252, 100669, 100925, 101949, 102461, 104253, 104509, 107837, 108093, 124477, 128573, 100414, 100670, 100926, 101182, 101950, 102462, 102974, 103486, 103742, 103998, 104254, 105022, 107838, 109886, 113982, 68671, 88383, 88639, 100671, 101183, 101439, 102975, 103231, 103487, 107839, 110399, 94016, 94784, 95040, 95296, 100416, 101184, 103488, 106304, 107840, 108608, 109120, 112448, 118592, 124224, 88641, 91457, 91713, 93761, 94017, 94273, 94785, 95041, 95553, 100417, 100673, 101697, 102209, 102465, 102721, 102977, 103489, 104513, 106305, 107841, 111425, 125761, 88642, 94018, 95554, 95810, 100930, 101442, 101698, 101954, 102210, 102722, 102978, 103234, 103490, 104514, 106562, 107842, 108098, 108610, 112450, 66627, 88899, 89155, 94019, 94275, 100419, 101187, 101699, 101955, 102723, 102979, 103235, 103491, 103747, 104515, 104771, 105539, 105795, 108355, 116547, 120387, 124227, 130627, 72772, 73540, 94020, 94276, 94532, 94788, 95300, 99908, 100164, 100420, 100932, 101188, 101700, 101956, 102468, 102724, 102980, 103492, 103748, 104516, 105284, 105540, 108100, 108612, 110148, 110404, 111940, 112196, 119620, 120132, 120388, 88901, 94533, 94789, 99653, 99909, 100165, 100421, 100677, 100933, 101189, 101445, 101701, 102213, 102469, 102725, 102981, 103237, 103493, 103749, 104517, 105541, 106053, 107077, 107845, 108101, 111941, 119877, 70982, 73286, 77382, 78150, 81478, 99398, 99654, 99910, 100422, 100934, 101190, 101446, 102214, 102470, 102726, 102982, 103238, 103750, 104006, 104262, 104774, 105542, 106310, 107334, 107590, 108358, 110150, 119622, 121926, 125766, 128582, 73799, 76103, 89159, 96839, 97095, 99399, 99655, 99911, 100679, 100935, 101191, 101447, 102215, 102471, 102727, 102983, 103239, 103495, 103751, 104007, 104263, 104519, 104775, 105031, 105799, 106055, 106311, 106567, 106823, 107079, 107335, 107591, 107847, 108103, 109895, 110151, 111687, 111943, 121927, 70984, 73032, 73544, 89416, 89928, 99400, 99656, 100168, 100680, 100936, 101192, 101448, 102216, 102472, 102728, 102984, 103240, 103496, 103752, 104008, 104264, 104520, 104776, 105032, 105288, 105544, 105800, 106056, 106312, 106568, 106824, 107080, 108104, 109640, 109896, 110920, 111432, 111688, 111944, 112200, 112968, 114504, 121672, 73289, 73545, 77129, 89673, 89929, 98121, 99145, 99401, 99657, 100169, 100425, 100681, 100937, 101193, 101449, 101961, 102217, 102473, 102729, 102985, 103241, 103497, 103753, 104265, 104521, 104777, 105545, 105801, 106569, 106825, 107081, 108105, 108617, 111433, 112457, 114761, 119113, 119369, 121417, 70730, 73546, 73802, 74826, 75850, 77898, 78410, 89930, 90186, 97866, 98122, 99146, 99658, 99914, 100170, 100426, 100682, 100938, 101194, 101450, 101706, 101962, 102218, 102474, 102730, 102986, 103242, 103498, 103754, 104010, 104266, 104522, 105034, 105546, 105802, 106058, 106826, 107850, 108362, 108618, 109130, 109386, 110154, 114762, 125770, 75595, 97611, 97867, 99147, 99403, 99915, 100171, 100427, 100683, 100939, 101195, 101451, 101707, 102219, 102475, 102731, 102987, 103243, 103499, 103755, 104011, 104267, 104523, 104779, 105035, 105291, 105547, 106315, 106827, 107083, 107595, 107851, 108363, 108619, 108875, 109387, 109643, 121163, 124235, 127307, 81228, 97100, 97356, 97612, 99148, 99404, 99660, 99916, 100172, 100428, 100684, 100940, 101196, 101452, 102220, 102476, 102732, 102988, 103244, 103500, 103756, 104012, 104268, 104524, 104780, 105036, 105292, 105548, 105804, 106060, 106316, 106572, 106828, 107084, 107340, 107596, 107852, 108108, 108364, 108620, 108876, 109132, 109388, 109644, 110668, 113228, 113484, 113740, 115020, 115532, 116044, 116556, 121164, 121420, 96845, 97101, 97357, 97613, 97869, 99661, 99917, 100173, 100429, 100685, 100941, 101197, 101453, 101709, 102221, 102477, 102733, 102989, 103245, 103501, 103757, 104013, 104269, 104525, 104781, 105037, 105293, 105549, 105805, 106061, 106573, 106829, 107085, 107341, 107853, 108109, 108365, 108621, 108877, 109133, 109389, 109645, 109901, 110157, 110413, 110669, 110925, 111437, 113229, 113741, 114765, 115021, 115277, 116045, 117069, 119117, 73550, 77902, 79950, 81486, 96846, 97102, 97358, 97614, 97870, 99662, 99918, 100174, 100430, 100686, 100942, 101198, 101454, 101710, 102222, 102478, 102734, 102990, 103246, 103502, 103758, 104014, 104270, 104526, 104782, 105038, 105294, 105550, 105806, 106062, 106318, 106574, 106830, 107086, 107342, 107598, 107854, 108110, 108366, 108622, 108878, 109134, 109390, 109646, 109902, 110158, 110414, 110670, 111182, 111438, 111694, 111950, 112206, 113486, 113742, 113998, 115278, 115534, 115790, 116046, 117070, 117326, 117838, 120910, 76111, 76367, 76879, 80207, 80719, 80975, 97103, 97359, 97615, 97871, 99663, 99919, 100175, 100431, 100687, 100943, 101199, 101967, 102223, 102479, 102735, 102991, 103247, 103503, 103759, 104015, 104271, 104527, 104783, 105039, 105295, 105551, 105807, 106063, 106319, 106575, 106831, 107087, 107343, 107599, 107855, 108111, 108367, 108623, 108879, 109135, 109391, 109647, 109903, 110159, 110415, 110671, 110927, 111183, 111439, 111695, 111951, 112207, 113487, 113743, 113999, 114255, 114511, 114767, 115023, 115279, 115535, 115791, 116047, 116303, 116815, 117071, 117583, 127055, 127311, 127567, 68944, 74320, 75088, 76368, 76624, 76880, 77392, 79952, 80464, 96848, 97104, 97360, 97616, 97872, 99664, 99920, 100176, 100432, 100688, 100944, 101968, 102224, 102480, 102736, 102992, 103248, 103504, 103760, 104272, 104528, 104784, 105040, 105296, 105552, 105808, 106064, 106320, 106576, 106832, 107088, 107344, 107600, 107856, 108368, 108624, 108880, 109136, 109392, 109648, 109904, 110160, 110416, 110672, 110928, 111184, 111440, 111696, 111952, 112208, 112464, 112720, 112976, 113232, 113488, 113744, 114000, 114256, 114512, 114768, 115024, 115280, 115536, 116304, 116560, 117072, 117840, 120912, 128592, 74833, 75345, 75601, 77393, 77649, 77905, 78161, 78417, 79697, 79953, 80465, 86097, 96337, 96593, 96849, 97105, 97361, 97617, 97873, 98129, 99665, 99921, 100177, 100433, 100689, 101201, 101457, 101713, 101969, 102225, 102481, 102737, 102993, 103249, 103505, 103761, 104017, 104273, 104529, 104785, 105041, 105297, 105553, 105809, 106065, 106321, 106577, 106833, 107089, 107345, 107601, 107857, 108113, 108369, 108625, 108881, 109137, 109393, 109649, 109905, 110161, 110673, 110929, 111185, 111441, 111697, 111953, 112209, 112465, 112721, 112977, 113233, 113489, 113745, 114001, 114513, 114769, 115025, 116817, 117329, 127057, 67922, 74066, 74322, 74834, 75346, 75602, 75858, 76114, 77138, 77394, 77650, 77906, 78162, 78418, 78674, 78930, 79186, 79442, 79698, 79954, 83794, 86610, 87378, 96338, 96594, 96850, 97106, 97362, 97618, 97874, 98130, 98386, 99154, 99410, 99666, 99922, 100178, 100434, 100690, 100946, 101202, 101458, 101714, 101970, 102226, 102482, 102738, 102994, 103250, 103506, 103762, 104018, 104274, 104530, 104786, 105042, 105298, 105554, 105810, 106066, 106322, 106578, 106834, 107090, 107346, 107602, 107858, 108114, 108370, 108626, 108882, 109138, 109394, 109650, 109906, 110674, 110930, 111186, 111442, 111698, 111954, 112210, 112466, 112722, 112978, 113234, 113490, 113746, 114002, 114258, 114514, 114770, 115026, 115282, 116818, 117074, 117586, 120658, 121170, 74323, 75859, 76115, 76883, 77395, 77651, 78163, 78419, 78675, 78931, 79187, 79443, 79699, 79955, 80211, 86099, 87379, 96339, 96595, 96851, 97107, 97363, 97619, 97875, 98131, 98387, 98643, 99155, 99411, 99667, 99923, 100179, 100435, 100691, 100947, 101203, 101459, 101715, 101971, 102227, 102483, 102739, 102995, 103251, 103507, 103763, 104019, 104275, 104531, 104787, 105043, 105299, 105555, 105811, 106067, 106323, 106579, 106835, 107091, 107347, 107603, 107859, 108115, 108371, 108627, 108883, 109139, 109395, 109651, 109907, 110163, 110419, 110675, 110931, 111187, 111443, 111699, 111955, 112211, 112467, 112723, 112979, 113235, 113491, 113747, 114259, 114515, 114771, 115027, 117075, 117331, 117587, 117843, 118611, 119635, 123987, 124243, 127059, 75348, 77140, 77396, 77652, 78164, 78420, 78676, 78932, 79188, 79444, 79700, 79956, 80212, 80468, 87892, 88148, 96340, 96596, 96852, 97108, 97364, 97620, 97876, 98132, 98388, 98644, 98900, 99156, 99412, 99668, 99924, 100180, 100436, 100692, 100948, 101204, 101460, 101716, 101972, 102228, 102484, 102740, 102996, 103252, 103508, 103764, 104020, 104276, 104532, 104788, 105044, 105300, 105556, 105812, 106068, 106324, 106580, 106836, 107092, 107348, 107604, 107860, 108116, 108372, 108628, 108884, 109140, 109396, 109652, 109908, 110164, 110420, 110676, 110932, 111188, 111444, 111956, 112212, 112724, 112980, 113236, 113492, 113748, 114004, 114260, 115284, 115540, 116820, 117076, 117332, 117844, 118100, 118356, 118612, 118868, 119124, 119380, 119636, 122964, 76117, 76373, 77141, 77397, 77653, 77909, 78165, 78421, 78677, 78933, 79189, 79445, 79701, 79957, 80213, 80469, 80725, 81237, 83541, 87893, 96597, 97365, 97621, 97877, 98133, 98389, 98645, 98901, 99157, 99413, 99669, 99925, 100181, 100437, 100693, 100949, 101205, 101461, 101717, 101973, 102229, 102485, 102741, 102997, 103253, 103509, 103765, 104021, 104277, 104533, 104789, 105045, 105301, 105557, 105813, 106069, 106325, 106581, 106837, 107093, 107349, 107605, 107861, 108117, 108373, 108629, 108885, 109141, 109397, 110421, 110677, 110933, 111189, 111445, 111701, 112725, 112981, 113237, 113493, 113749, 114005, 115285, 115541, 117333, 117589, 117845, 118101, 118357, 118613, 118869, 119125, 119381, 119637, 119893, 120149, 121685, 122709, 122965, 123221, 124245, 126805, 76118, 76374, 76630, 77398, 77654, 77910, 78166, 78422, 78678, 78934, 79190, 79446, 79702, 79958, 80214, 80470, 80726, 80982, 81238, 81494, 84822, 86102, 87126, 97110, 97366, 97622, 97878, 98134, 98390, 98646, 98902, 99158, 99414, 99670, 99926, 100182, 100438, 100694, 100950, 101206, 101462, 101718, 101974, 102230, 102486, 102742, 102998, 103254, 103510, 103766, 104022, 104278, 104534, 104790, 105046, 105302, 105558, 105814, 106070, 106326, 106582, 106838, 107094, 108374, 108630, 108886, 109142, 110166, 110422, 110934, 111190, 111446, 111702, 112470, 112726, 112982, 113238, 113750, 114006, 114262, 115030, 117334, 117846, 118870, 119382, 119638, 119894, 121430, 121686, 121942, 123222, 123478, 124246, 75607, 75863, 76119, 76375, 76631, 76887, 77143, 77399, 77655, 77911, 78167, 78423, 78679, 78935, 79191, 79447, 79703, 79959, 80215, 80471, 80727, 80983, 81239, 81495, 82263, 82519, 82775, 83031, 83287, 83543, 84311, 85079, 85847, 86103, 86359, 86615, 87639, 88151, 88407, 97879, 98135, 98391, 98647, 98903, 99159, 99415, 99671, 99927, 100183, 100439, 100695, 100951, 101207, 101463, 101719, 101975, 102231, 102487, 102743, 102999, 103255, 103511, 103767, 104023, 104279, 104535, 104791, 105047, 105303, 105559, 105815, 106071, 106327, 106583, 106839, 107351, 108119, 108631, 109911, 110423, 111447, 111703, 111959, 112215, 113495, 114007, 114263, 114519, 119639, 121687, 121943, 123223, 123735, 124247, 75608, 75864, 76120, 76376, 76632, 76888, 77144, 77400, 77656, 77912, 78168, 78424, 78680, 78936, 79192, 79448, 79704, 79960, 80216, 80472, 80728, 81240, 81496, 82008, 82264, 82520, 83288, 83544, 83800, 84056, 84312, 84568, 85080, 85336, 85592, 85848, 86104, 86360, 86616, 87640, 87896, 88408, 88664, 97368, 97624, 97880, 98136, 98392, 98648, 98904, 99160, 99416, 99672, 99928, 100184, 100440, 100696, 100952, 101208, 101464, 101720, 101976, 102232, 102488, 102744, 103000, 103256, 103512, 103768, 104024, 104280, 104536, 104792, 105048, 105304, 105560, 105816, 106072, 106328, 106584, 106840, 108888, 109144, 109656, 110424, 112984, 118360, 122456, 122712, 122968, 75609, 75865, 76121, 76377, 76633, 76889, 77145, 77401, 77913, 78169, 78425, 78681, 78937, 79193, 79705, 79961, 80217, 80473, 80729, 80985, 81241, 81497, 81753, 82009, 82265, 82777, 83033, 83289, 83545, 83801, 85081, 85337, 85593, 85849, 86105, 86361, 86617, 87385, 87641, 87897, 88153, 88409, 88665, 97369, 97625, 97881, 98137, 98393, 98649, 98905, 99161, 99417, 99673, 99929, 100185, 100441, 100697, 100953, 101209, 101465, 101721, 101977, 102233, 102489, 102745, 103001, 103257, 103513, 103769, 104025, 104281, 104537, 104793, 105049, 105305, 105561, 105817, 106073, 106329, 106585, 106841, 107609, 107865, 108121, 108633, 109145, 109401, 109657, 110681, 112473, 112985, 113241, 113497, 117593, 117849, 122201, 122713, 122969, 124249, 75610, 75866, 76122, 76378, 76634, 76890, 77146, 77402, 77658, 77914, 78170, 78426, 78682, 78938, 79450, 79706, 79962, 80218, 80474, 80730, 80986, 81242, 81498, 81754, 82010, 82266, 82522, 82778, 83034, 83290, 83546, 83802, 84058, 84314, 84570, 84826, 85082, 85338, 85594, 85850, 86106, 86362, 86618, 86874, 87130, 87386, 88154, 88410, 88666, 97882, 98138, 98394, 98650, 98906, 99162, 99418, 99674, 99930, 100186, 100442, 100698, 100954, 101210, 101466, 101722, 101978, 102234, 102490, 102746, 103002, 103258, 103514, 103770, 104026, 104282, 104538, 104794, 105050, 105306, 105562, 105818, 106074, 106330, 106586, 106842, 107098, 107354, 108634, 109402, 111962, 123994, 124250, 75611, 75867, 76123, 76379, 76635, 76891, 77659, 77915, 78171, 78427, 78683, 79195, 80219, 80475, 80731, 80987, 81243, 81499, 81755, 82011, 82267, 82523, 82779, 83035, 83291, 83547, 83803, 84059, 84315, 84571, 84827, 85083, 85339, 85595, 85851, 86107, 86363, 86619, 86875, 87131, 87387, 98139, 98395, 98651, 98907, 99163, 99419, 99675, 99931, 100187, 100443, 100699, 100955, 101211, 101467, 101723, 101979, 102235, 102491, 102747, 103003, 103259, 103515, 103771, 104283, 104539, 104795, 105051, 105307, 105563, 105819, 106075, 106331, 106587, 106843, 107099, 108379, 109403, 109659, 109915, 111707, 112987, 113755, 122459, 122715, 123995, 75612, 75868, 76124, 76380, 76636, 76892, 77148, 77660, 78172, 78428, 78684, 78940, 79196, 79452, 79708, 80476, 80732, 80988, 81244, 81500, 81756, 82012, 82268, 82524, 82780, 83036, 83292, 83548, 83804, 84060, 84316, 84572, 84828, 85084, 85340, 85596, 85852, 86108, 86364, 86620, 86876, 87132, 98140, 98396, 98652, 98908, 99164, 99420, 99676, 99932, 100188, 100444, 100700, 100956, 101212, 101468, 101724, 101980, 102236, 102492, 102748, 103004, 103260, 103516, 104284, 104540, 104796, 105052, 105308, 105564, 105820, 106076, 106332, 106588, 106844, 107356, 107868, 110172, 110940, 111708, 112220, 112476, 112732, 113756, 122204, 122460, 122972, 123996, 75613, 75869, 76125, 76637, 76893, 77149, 77405, 77917, 78685, 78941, 79453, 79709, 80221, 80477, 80733, 80989, 81245, 81501, 81757, 82013, 82269, 82525, 82781, 83037, 83293, 83549, 83805, 84061, 84317, 84573, 84829, 85085, 85341, 85597, 86109, 86365, 96605, 96861, 97117, 97373, 97629, 97885, 98141, 98397, 98653, 98909, 99165, 99421, 99677, 99933, 100189, 100445, 100701, 100957, 101213, 101469, 101725, 101981, 102237, 102493, 102749, 103005, 103261, 103517, 105309, 105565, 105821, 106077, 106333, 106589, 106845, 107613, 108893, 110685, 110941, 111197, 111709, 111965, 112221, 112477, 112733, 121181, 121693, 122205, 122461, 122717, 123997, 124253, 124509, 124765, 75870, 76126, 76382, 77406, 78174, 78430, 78942, 79198, 79710, 80222, 80478, 80734, 80990, 81246, 81502, 81758, 82014, 82270, 82526, 82782, 83038, 83294, 83550, 83806, 84062, 84318, 84574, 84830, 85086, 85342, 85598, 96606, 96862, 97118, 97374, 97630, 97886, 98142, 98398, 98654, 98910, 99422, 99934, 100190, 100446, 100702, 100958, 101214, 101470, 101726, 101982, 102238, 102494, 102750, 103006, 103262, 104798, 105822, 106078, 106334, 106590, 106846, 107102, 109150, 109662, 109918, 110686, 110942, 111198, 111454, 111710, 111966, 112222, 112478, 121950, 122206, 122462, 123742, 123998, 124254, 75615, 75871, 76127, 76383, 76895, 77407, 77919, 78175, 78431, 78687, 78943, 79199, 79455, 79711, 79967, 80223, 80479, 80735, 80991, 81247, 81503, 81759, 82015, 82271, 82527, 82783, 83039, 83295, 83551, 83807, 84063, 84319, 84575, 84831, 85087, 85343, 85599, 96607, 96863, 97119, 97375, 97631, 97887, 98143, 98399, 98655, 98911, 99679, 99935, 100447, 100703, 100959, 101215, 101471, 101727, 101983, 102239, 102495, 102751, 103007, 103263, 103519, 103775, 104031, 104287, 104543, 104799, 105055, 105567, 105823, 106079, 106335, 106591, 106847, 107103, 109151, 109407, 109919, 110687, 110943, 111199, 111455, 111711, 111967, 116575, 120415, 120671, 121695, 121951, 123743, 123999, 75616, 75872, 76128, 76384, 77152, 77664, 77920, 78176, 78688, 78944, 79200, 79456, 79712, 79968, 80224, 80480, 80736, 80992, 81248, 81504, 81760, 82016, 82272, 82528, 82784, 83040, 83296, 83552, 83808, 84064, 84320, 84576, 84832, 85088, 96608, 96864, 97120, 97376, 97632, 97888, 98144, 98400, 98912, 99680, 99936, 100704, 100960, 101216, 101472, 101728, 101984, 102240, 102496, 102752, 103008, 103264, 103520, 103776, 104032, 104288, 104544, 104800, 105056, 105312, 105568, 105824, 106080, 106336, 106592, 106848, 107104, 107360, 109920, 110176, 110432, 110688, 110944, 111200, 111456, 111712, 117600, 120928, 121440, 121696, 123744, 124000, 75617, 75873, 76129, 76385, 77409, 77921, 78177, 78689, 78945, 79201, 79457, 79713, 79969, 80225, 80481, 80737, 80993, 81249, 81505, 81761, 82017, 82273, 82529, 82785, 83041, 83297, 83553, 83809, 84065, 84321, 84577, 84833, 92513, 93281, 96609, 96865, 97121, 97377, 97633, 97889, 98145, 98401, 98657, 98913, 99169, 99681, 99937, 101217, 101473, 101729, 101985, 102241, 102497, 102753, 103009, 103265, 103521, 103777, 104033, 104289, 104545, 104801, 105057, 105313, 105569, 105825, 106081, 106337, 106593, 106849, 107105, 107361, 108129, 109665, 109921, 110177, 110433, 110689, 112225, 117601, 117857, 119393, 120417, 121185, 121441, 123745, 124001, 75874, 76130, 76386, 77410, 77666, 77922, 78178, 78434, 78690, 78946, 79202, 79458, 79714, 79970, 80226, 80482, 80738, 80994, 81250, 81506, 81762, 82018, 82274, 82530, 82786, 83042, 83298, 83554, 83810, 84066, 84322, 84578, 93026, 93282, 93538, 93794, 96610, 96866, 97122, 97378, 97634, 97890, 98146, 98402, 98658, 100450, 100706, 100962, 101218, 101986, 102242, 102498, 102754, 103010, 103266, 103522, 103778, 104034, 104290, 104546, 104802, 105058, 105314, 105570, 105826, 106082, 106338, 106594, 106850, 107106, 108898, 110178, 110434, 110690, 110946, 112226, 120930, 121186, 121442, 121698, 123746, 124002, 75875, 76131, 76387, 76643, 76899, 77411, 77667, 77923, 78435, 78691, 78947, 79203, 79459, 79715, 79971, 80227, 80483, 80739, 80995, 81251, 81507, 81763, 82019, 82275, 82531, 82787, 83043, 83299, 83555, 83811, 84067, 84323, 93539, 96611, 96867, 97123, 97379, 97635, 97891, 98147, 98659, 98915, 99171, 99427, 99683, 99939, 100195, 100451, 100707, 100963, 101987, 102243, 102499, 102755, 103011, 103267, 103523, 103779, 104035, 104291, 104547, 104803, 105059, 105315, 105571, 105827, 106083, 106339, 106851, 107107, 107363, 107619, 108131, 108387, 108643, 108899, 109155, 109411, 110435, 111203, 121443, 123235, 123491, 123747, 124003, 76132, 76388, 76644, 76900, 77156, 77412, 77924, 78180, 78436, 78692, 78948, 79204, 79460, 79716, 79972, 80228, 80484, 80740, 80996, 81252, 81508, 81764, 82020, 82276, 82532, 82788, 83044, 83300, 83556, 83812, 84068, 84324, 84580, 97124, 97380, 97636, 98148, 98404, 98660, 98916, 99172, 99428, 99684, 99940, 100196, 100708, 100964, 102244, 102500, 102756, 103268, 103524, 103780, 104036, 104292, 104548, 104804, 105060, 105316, 105572, 106084, 106340, 106596, 106852, 107108, 107364, 107620, 107876, 108132, 108388, 108900, 109156, 109412, 112740, 115556, 121444, 121700, 122980, 123236, 123492, 123748, 124004, 76389, 76645, 76901, 77413, 77669, 77925, 78181, 78437, 78693, 78949, 79205, 79461, 79717, 79973, 80229, 80485, 80741, 80997, 81253, 81509, 81765, 82021, 82277, 82533, 82789, 83045, 83301, 83557, 83813, 84069, 84325, 97125, 97381, 97637, 97893, 98149, 98405, 98661, 98917, 99173, 99429, 99685, 99941, 100197, 102501, 102757, 103013, 104293, 104549, 104805, 105061, 105317, 105573, 105829, 106085, 106341, 106597, 106853, 107109, 107621, 107877, 108901, 109157, 109413, 110949, 111205, 111461, 111717, 118117, 119909, 121445, 121701, 122213, 122469, 122725, 122981, 123237, 123493, 123749, 76646, 76902, 77158, 77414, 77670, 77926, 78182, 78438, 78694, 78950, 79462, 79718, 79974, 80230, 80486, 80742, 80998, 81254, 81510, 81766, 82022, 82278, 82534, 82790, 83046, 83302, 83558, 83814, 84070, 96614, 96870, 97126, 97382, 97638, 97894, 98150, 98406, 98918, 99430, 99686, 99942, 100198, 104806, 105062, 106342, 106854, 107366, 107622, 108134, 108390, 108646, 108902, 109158, 111206, 111462, 112486, 118118, 119910, 121958, 122214, 122470, 122726, 122982, 76903, 77159, 77415, 77671, 78183, 78439, 78695, 78951, 79207, 79463, 79719, 79975, 80231, 80487, 80743, 80999, 81255, 81511, 81767, 82023, 82279, 82535, 82791, 83047, 83303, 83559, 83815, 86375, 86631, 95079, 95335, 96615, 96871, 97127, 97383, 98151, 98407, 98919, 99175, 100199, 100455, 100711, 100967, 101991, 102247, 102503, 102759, 104551, 104807, 105063, 107367, 107623, 107879, 109159, 111207, 111463, 111719, 111975, 112231, 112743, 116839, 118887, 119143, 119399, 119655, 119911, 120167, 121959, 122215, 122471, 77160, 77416, 77672, 78184, 78440, 78696, 78952, 79208, 79720, 79976, 80232, 80488, 80744, 81000, 81256, 81512, 81768, 82024, 82280, 82536, 82792, 83048, 83304, 83560, 96616, 96872, 97128, 97384, 97896, 99176, 101992, 103528, 103784, 104040, 104552, 104808, 107112, 107368, 107624, 107880, 108136, 108392, 108648, 109416, 110184, 111208, 111464, 111720, 111976, 115048, 116840, 119656, 119912, 120168, 120424, 121960, 122216, 77161, 77929, 78185, 78441, 78697, 78953, 79465, 79977, 80233, 80489, 80745, 81001, 81257, 81513, 81769, 82025, 82281, 82537, 82793, 83049, 83305, 83561, 96617, 97129, 98921, 101993, 103785, 104041, 104297, 104553, 107113, 107625, 107881, 108649, 110441, 111209, 111465, 111721, 111977, 112233, 119145, 120169, 120425, 77930, 78186, 78442, 78698, 78954, 79978, 80234, 80490, 80746, 81002, 83050, 83306, 83562, 95082, 95338, 95594, 95850, 96362, 96618, 96874, 98410, 103018, 103786, 104042, 104554, 104810, 106602, 107114, 108138, 108650, 108906, 109418, 111210, 112234, 114282, 119914, 120170, 120426, 77419, 78187, 78443, 79211, 79723, 79979, 80235, 80491, 83307, 83563, 95083, 95339, 95595, 95851, 98667, 103787, 104043, 104555, 108395, 108651, 109419, 110699, 113771, 115819, 119659, 120427, 77932, 78188, 78444, 78956, 79212, 79468, 79724, 79980, 80236, 80492, 83308, 83564, 83820, 84076, 84332, 96108, 98412, 99948, 100716, 104044, 106348, 107372, 107628, 108396, 109164, 113004, 115564, 116844, 119916, 120172, 121452, 121708, 77933, 78445, 78701, 78957, 79213, 79469, 79981, 80237, 80493, 83309, 83565, 84077, 84333, 104301, 106605, 106861, 107373, 107629, 108397, 110445, 110701, 110957, 111213, 113261, 115053, 116845, 117101, 120173, 120429, 78190, 78958, 79214, 79470, 79982, 80238, 95342, 104302, 105326, 105582, 107886, 108142, 108398, 108654, 108910, 110958, 114286, 114542, 114798, 116078, 119662, 119918, 120174, 120430, 120686, 120942, 69231, 78191, 78959, 79215, 79471, 79727, 79983, 80239, 80495, 83055, 83311, 83567, 83823, 84079, 95599, 99183, 105327, 109167, 111471, 111983, 114287, 114799, 115823, 116079, 118895, 119151, 120175, 120431, 69232, 69488, 69744, 70000, 79216, 79472, 79728, 79984, 80240, 80496, 81776, 82032, 82288, 83312, 83824, 84080, 84336, 84592, 85360, 95088, 105328, 105584, 111216, 111472, 112752, 115568, 117616, 120176, 70001, 79217, 79473, 79729, 79985, 80241, 80497, 80753, 81777, 82033, 82289, 82545, 83569, 84081, 84337, 84593, 84849, 85105, 85361, 85617, 95857, 96113, 103793, 108913, 111729, 111985, 114033, 116337, 117105, 120433, 77426, 79218, 79474, 79730, 79986, 80242, 80498, 80754, 81010, 81266, 81522, 81778, 82290, 83570, 84082, 84338, 84850, 85106, 85362, 85618, 86130, 86386, 86898, 95346, 98418, 98674, 111474, 111730, 116338, 117106, 120178, 120434, 79731, 79987, 80499, 80755, 81011, 81267, 81523, 81779, 82035, 82291, 84339, 85363, 86131, 86387, 86899, 87155, 93811, 94067, 95603, 97651, 108147, 112243, 112499, 112755, 113011, 113523, 115827, 117107, 117363, 120179, 120435, 120691, 80500, 80756, 81012, 81268, 81524, 81780, 82036, 82292, 82548, 87156, 93812, 94068, 95348, 95604, 95860, 104308, 104820, 105332, 106356, 111732, 113012, 116084, 116852, 117876, 118132, 120180, 120436, 124788, 81525, 81781, 82037, 82293, 82549, 83061, 87157, 93813, 94069, 95093, 95349, 95605, 96117, 96629, 98421, 99445, 104309, 105333, 105589, 106101, 106357, 107125, 111989, 112501, 116341, 116597, 116853, 117877, 118133, 120181, 120437, 120693, 124789, 82038, 82294, 82550, 82806, 83062, 87158, 87414, 95350, 95606, 95862, 96886, 97142, 98166, 98678, 98934, 99702, 102262, 106358, 106614, 111990, 112246, 112502, 112758, 113014, 116598, 116854, 117878, 118134, 120182, 120438, 120694, 120950, 124534, 82551, 82807, 83063, 84855, 85111, 85623, 85879, 87159, 95351, 96887, 97911, 98167, 98935, 99959, 100215, 100983, 105079, 105335, 105847, 106103, 111991, 112247, 112503, 112759, 116343, 117367, 117879, 118135, 120183, 120439, 120695, 120951, 121207, 82552, 82808, 83064, 84600, 84856, 85112, 85368, 85624, 85880, 86136, 86392, 86648, 86904, 87160, 96120, 96632, 97656, 98424, 99704, 100984, 106104, 106616, 112248, 112504, 113016, 117368, 117624, 117880, 119928, 120184, 120440, 120696, 120952, 121208, 82809, 83065, 83321, 83577, 83833, 84345, 84601, 84857, 85113, 85369, 85625, 85881, 86137, 86393, 86649, 86905, 95865, 96121, 96377, 98425, 100729, 101753, 104057, 105337, 105849, 106361, 112249, 112761, 113017, 116345, 117625, 119673, 119929, 120441, 120697, 120953, 121209, 83322, 83578, 83834, 84346, 84602, 84858, 85114, 85370, 85626, 86138, 86650, 86906, 95866, 96634, 98426, 103290, 112250, 112506, 112762, 113018, 113274, 116090, 116346, 120442, 120698, 120954, 121210, 122746, 84603, 84859, 85115, 85627, 85883, 86139, 87675, 87931, 88187, 88443, 96379, 96891, 97403, 97659, 98171, 98427, 98683, 98939, 99451, 106875, 112763, 113019, 115579, 116603, 116859, 119419, 119675, 120443, 120955, 121211, 84348, 84604, 84860, 85116, 85372, 85628, 88188, 88444, 88700, 96892, 97148, 97660, 98172, 104060, 115580, 115836, 116092, 116604, 119164, 119420, 120188, 84349, 84605, 84861, 85117, 85885, 87165, 88701, 88957, 99965, 100477, 105853, 111741, 115837, 116093, 116349, 116605, 116861, 118909, 119421, 84094, 84350, 84606, 84862, 85118, 87166, 88958, 99710, 116094, 116862, 117118, 118398, 118654, 120958, 121214, 83839, 84095, 84351, 84607, 85375, 88959, 99455, 99967, 104319, 104575, 104831, 116863, 117119, 117375, 118143, 118399, 120959, 121471, 121727, 81792, 82048, 83584, 83840, 84096, 84352, 84608, 86400, 86912, 88704, 88960, 89216, 89472, 89728, 89984, 100224, 104832, 105088, 106112, 116608, 116864, 118144, 119680, 122752, 83585, 83841, 84097, 86145, 87937, 88193, 88449, 88705, 89217, 89473, 90241, 90497, 103553, 103809, 104065, 116609, 117633, 118657, 119425, 121217, 123777, 130433, 83586, 83842, 84098, 84866, 85634, 85890, 86402, 86914, 87170, 87426, 87682, 88194, 88706, 89218, 89730, 89986, 90242, 90754, 91010, 91266, 92290, 100994, 101250, 101506, 103554, 105090, 105602, 116866, 117378, 117634, 119170, 120194, 83587, 83843, 85635, 87427, 89475, 89731, 90243, 90499, 91011, 91267, 91523, 91779, 100483, 100995, 101251, 105347, 108419, 117379, 119939, 120195, 120451, 120707, 126083, 83844, 84100, 84356, 89220, 89732, 90244, 90500, 90756, 91012, 91268, 91524, 91780, 92036, 102276, 103556, 104836, 105348, 117636, 117892, 118148, 118404, 120196, 120708, 122500, 124804, 125060, 83845, 84101, 84613, 85125, 85381, 86917, 89477, 89733, 89989, 90245, 90757, 91013, 91269, 91525, 91781, 92037, 104837, 117893, 118149, 118405, 118661, 118917, 119173, 119429, 119941, 120709, 125061, 72838, 73094, 84102, 84358, 85638, 85894, 86662, 87942, 90502, 90758, 91014, 91270, 91526, 91782, 100742, 101254, 104582, 104838, 119174, 119430, 119686, 119942, 120198, 120454, 120966, 121222, 125062, 73095, 84103, 84359, 84615, 85895, 86151, 86407, 86919, 88199, 88455, 88967, 89479, 89735, 89991, 90503, 90759, 91015, 91271, 91527, 91783, 100743, 103303, 104583, 120199, 120711, 120967, 124295, 128647, 84360, 84616, 86920, 87176, 87688, 88200, 89480, 89736, 89992, 90248, 90760, 91016, 91272, 91528, 100744, 101256, 103304, 107400, 122248, 123272, 66185, 66953, 84361, 84617, 84873, 85129, 85385, 85641, 87433, 87689, 87945, 88201, 89225, 89481, 89737, 90249, 90505, 90761, 91017, 91273, 100745, 101257, 103561, 104585, 106633, 107145, 122249, 66954, 84618, 84874, 85130, 85386, 85642, 85898, 86410, 87434, 87690, 87946, 88458, 88714, 88970, 89226, 89482, 89738, 89994, 90250, 90506, 90762, 91018, 91274, 104586, 107146, 107402, 122506, 66443, 66699, 84875, 85131, 85387, 85643, 85899, 86923, 87179, 87691, 87947, 88203, 88459, 88971, 89227, 89483, 89739, 89995, 90251, 90507, 90763, 91019, 91275, 97163, 103563, 104587, 104843, 106635, 106891, 121227, 124811, 71052, 85388, 85644, 85900, 86156, 86412, 86668, 86924, 87180, 88460, 88716, 88972, 89228, 89484, 89740, 89996, 90252, 90508, 90764, 91020, 91276, 101260, 101772, 103052, 104076, 104844, 107404, 120460, 120716, 124044, 124812, 128908, 130700, 66701, 85645, 85901, 86157, 86413, 86669, 87693, 88461, 88973, 89229, 89485, 89741, 89997, 90253, 90509, 90765, 91021, 101517, 103821, 106893, 107405, 120461, 120973, 121229, 121485, 121997, 125069, 66446, 66702, 85646, 85902, 86158, 86414, 86670, 86926, 88206, 88462, 88974, 89230, 89486, 89742, 89998, 90254, 90510, 90766, 91022, 93070, 101262, 101518, 103566, 103822, 106382, 106894, 108686, 108942, 109966, 121486, 121742, 122766, 124814, 125070, 125326, 128142, 128398, 66447, 85647, 85903, 86159, 86415, 86671, 87951, 88207, 88463, 88719, 88975, 89231, 89487, 89743, 89999, 90255, 90511, 90767, 91023, 101007, 101263, 102799, 106895, 107151, 108431, 119183, 119695, 119951, 123023, 123791, 124047, 124303, 125327, 125583, 128143, 128399, 128655, 85392, 85648, 85904, 86160, 86416, 86672, 87184, 87440, 87696, 87952, 88208, 88464, 88720, 88976, 89232, 89488, 89744, 90000, 90256, 90512, 90768, 101008, 101264, 101520, 101776, 103824, 107152, 120720, 122256, 123792, 124304, 125072, 125328, 125584, 125840, 128656, 128912, 85393, 86161, 86417, 86673, 87441, 87953, 88209, 88465, 88721, 88977, 89233, 89489, 89745, 90001, 101521, 101777, 103057, 103569, 103825, 104593, 104849, 106385, 120209, 122513, 122769, 124561, 124817, 125073, 125329, 125585, 125841, 74642, 85394, 85650, 86162, 86418, 86674, 86930, 87186, 87442, 87698, 87954, 88210, 88466, 88722, 88978, 89234, 89490, 89746, 101522, 102546, 103058, 103314, 103570, 103826, 104082, 106898, 122770, 123794, 125586, 125842, 126098, 85395, 85651, 85907, 86163, 86419, 86931, 87187, 87443, 87699, 87955, 88211, 88467, 88723, 88979, 89235, 89491, 101011, 101267, 101523, 102803, 103059, 103315, 103571, 103827, 104083, 104339, 122515, 123795, 124563, 124819, 125075, 125331, 125587, 125843, 126099, 78484, 85396, 85652, 85908, 86164, 86420, 86676, 86932, 87188, 87444, 87700, 87956, 88212, 88468, 88724, 88980, 89236, 89492, 102548, 102804, 103060, 103316, 103572, 103828, 104084, 124820, 125076, 125332, 125844, 126100, 126356, 85397, 85909, 86165, 86421, 86677, 86933, 87189, 87445, 87701, 87957, 88213, 88469, 88725, 88981, 89237, 89493, 101525, 102037, 102293, 102549, 102805, 103061, 103317, 103573, 103829, 104085, 119189, 119445, 121493, 122773, 123541, 125333, 125589, 125845, 126101, 126357, 85398, 86166, 86422, 86678, 86934, 87190, 87446, 87702, 87958, 88214, 88470, 88726, 88982, 89238, 101526, 102038, 102294, 102550, 102806, 103062, 103318, 103574, 103830, 104086, 119190, 120470, 124822, 125334, 125590, 125846, 126102, 85399, 85911, 86167, 86423, 86679, 86935, 87191, 87447, 87703, 88215, 88471, 88727, 88983, 101783, 102039, 102295, 102551, 102807, 103063, 103319, 103575, 103831, 119447, 119703, 119959, 120471, 122519, 123287, 124311, 124823, 125335, 125591, 125847, 126103, 127383, 85400, 85656, 85912, 86168, 86424, 86680, 86936, 87192, 87448, 87704, 87960, 88216, 88472, 88728, 101528, 101784, 102040, 102296, 102552, 102808, 103064, 103320, 119448, 119704, 119960, 122776, 123032, 123288, 123544, 124056, 124568, 125080, 125336, 125592, 125848, 126104, 85145, 85401, 85657, 85913, 86169, 86425, 86681, 86937, 87193, 87449, 87705, 87961, 88217, 88473, 101529, 101785, 102041, 102297, 102553, 102809, 103065, 119193, 119449, 119705, 120473, 123033, 123289, 123545, 123801, 124057, 124313, 124825, 125081, 125337, 125593, 125849, 85146, 85402, 85914, 86426, 86682, 86938, 87194, 87450, 87706, 87962, 88218, 88474, 101786, 119706, 123034, 123290, 123546, 123802, 124058, 124314, 124570, 124826, 125082, 125338, 125594, 125850, 129946, 85147, 85403, 85659, 86427, 86683, 86939, 87195, 87451, 87707, 87963, 123291, 123547, 123803, 124059, 124315, 124571, 124827, 125083, 125339, 125595, 129947, 130203, 84892, 85148, 85404, 85660, 86684, 86940, 87196, 87452, 87708, 87964, 96156, 123804, 124060, 124316, 124572, 124828, 125084, 125340, 125596, 130204, 130460, 84893, 85149, 85405, 85917, 86685, 86941, 87197, 87453, 87709, 87965, 124061, 124317, 124573, 124829, 125085, 125341, 130205, 130461, 130717, 84894, 85150, 85406, 85662, 85918, 86174, 86430, 86942, 124830, 129950, 130206, 130462, 130718, 84895, 85151, 85407, 85919, 86431, 86943, 124575, 124831, 125343, 129695, 130207, 130463, 84896, 85152, 85408, 85664, 85920, 86432, 124832, 125088, 125344, 129440, 129696, 129952, 130208, 84897, 85153, 85409, 85921, 86177, 86433, 124833, 125089, 125345, 129441, 129697, 129953, 66210, 84898, 85154, 85410, 86434, 125090, 125346, 129442, 129698, 85411, 86435, 128931, 129187, 129443, 85156, 85412, 85668, 85924, 86180, 128932, 129188, 129444, 85157, 85413, 85669, 85925, 86181, 128933, 129189, 85158, 86182, 86438, 85671, 85416, 85928, 85673, 85929, 85162, 85163, 85675, 87723, 85420, 85677, 85933, 85934, 91822, 404550, 342604, 351325, 352358, 352873, 476266, 354411, 353901, 355438, 353903, 410223, 411248, 409201, 406642, 408178, 408179, 414323, 414835, 416371, 405620, 406132, 406644, 407156, 407668, 415348, 355957, 404597, 405621, 406133, 411765, 417397, 418421, 418933, 457333, 404086, 404598, 416886, 417398, 510582, 354423, 354935, 403575, 404087, 405111, 405623, 416887, 435319, 403576, 404088, 404600, 405112, 405624, 406648, 409208, 416376, 295545, 353913, 403065, 403577, 404601, 410233, 417401, 402554, 404090, 410234, 416890, 417402, 514170, 402555, 407675, 417403, 417915, 431739, 432251, 498299, 402044, 412284, 415356, 416892, 417404, 419964, 439420, 439932, 456316, 403069, 403581, 404605, 408189, 410237, 413821, 416381, 416893, 431229, 274558, 353918, 354430, 405118, 405630, 406142, 411774, 413822, 431230, 403071, 411775, 412799, 441471, 381056, 381568, 414336, 431232, 436864, 497280, 375937, 379521, 380545, 402049, 405121, 413825, 414337, 425089, 434305, 434817, 436865, 450177, 474241, 354434, 365698, 366210, 366722, 375938, 377474, 379010, 380034, 382082, 402050, 402562, 409730, 410754, 411266, 412290, 417922, 425090, 431234, 502914, 354435, 365699, 375427, 376963, 379011, 407171, 409219, 411267, 411779, 413827, 417923, 446083, 382596, 383108, 404100, 407172, 408196, 408708, 411780, 431748, 434820, 354949, 375941, 376453, 382085, 382597, 383109, 405637, 407685, 408197, 408709, 411269, 411781, 412293, 413317, 414341, 418437, 426629, 432261, 449669, 375942, 376966, 405126, 406662, 408198, 410758, 411782, 412294, 412806, 413830, 415366, 418438, 422022, 422534, 423046, 433798, 481926, 497286, 522374, 266887, 355463, 356487, 376967, 377479, 402055, 405127, 407687, 408199, 410759, 411271, 411783, 413319, 418951, 422535, 423047, 423559, 466055, 291464, 376456, 376968, 377480, 377992, 381064, 403592, 407176, 407688, 408200, 410248, 410760, 411272, 412296, 414344, 414856, 421000, 434824, 440456, 481416, 294025, 377481, 377993, 378505, 379529, 400009, 400521, 401545, 404105, 404617, 407177, 407689, 408201, 409737, 410249, 410761, 411273, 411785, 412297, 414345, 417929, 421001, 422537, 432265, 432777, 434313, 441481, 447625, 448649, 478857, 480393, 481417, 481929, 378506, 379018, 398986, 399498, 400010, 400522, 401034, 402058, 402570, 403082, 403594, 404106, 406666, 408714, 409226, 409738, 410250, 414858, 428682, 431754, 432266, 448138, 479370, 355979, 398475, 398987, 399499, 403595, 404619, 405643, 406155, 406667, 408715, 409227, 409739, 410251, 410763, 411787, 412299, 412811, 413323, 413835, 417931, 422539, 424075, 428683, 293516, 326284, 397452, 397964, 398476, 398988, 399500, 402060, 403596, 404108, 405132, 406156, 408716, 409228, 409740, 410764, 411276, 412300, 412812, 413324, 414860, 415372, 415884, 416908, 422540, 430220, 430732, 433292, 433804, 478860, 283789, 309901, 312461, 397453, 402061, 403597, 404621, 405133, 405645, 408717, 409229, 409741, 410253, 410765, 411277, 411789, 412813, 413325, 418957, 422029, 425613, 429709, 430221, 440973, 478861, 487565, 502925, 514189, 357006, 387726, 388238, 397966, 398478, 400014, 403086, 403598, 405646, 409230, 410254, 410766, 411278, 411790, 412302, 413326, 414350, 414862, 415374, 417934, 418958, 423566, 424078, 424590, 425614, 426126, 428174, 428686, 429198, 429710, 431246, 432782, 440462, 440974, 447630, 488078, 295055, 304783, 397967, 400015, 404623, 405647, 408719, 409231, 409743, 410255, 411279, 411791, 412815, 413327, 413839, 414351, 414863, 415375, 415887, 417423, 417935, 418447, 419983, 426127, 426639, 427151, 429711, 430223, 430735, 431247, 431759, 432271, 439951, 440463, 446607, 448143, 488079, 291984, 397456, 397968, 401040, 404112, 404624, 405136, 405648, 408720, 409232, 409744, 410256, 410768, 411280, 411792, 412304, 412816, 413328, 413840, 414352, 414864, 415888, 416400, 417424, 418448, 421520, 423568, 426640, 427152, 427664, 428176, 432784, 439440, 439952, 446608, 486544, 487056, 283793, 294545, 358033, 360081, 397969, 398481, 400529, 403089, 403601, 404113, 408721, 409233, 409745, 410257, 410769, 411281, 411793, 412305, 412817, 413329, 413841, 414353, 414865, 416913, 417425, 417937, 418449, 418961, 419473, 419985, 422545, 423057, 423569, 424081, 424593, 425617, 426641, 427153, 428177, 432273, 438929, 443537, 445585, 446097, 446609, 447633, 448657, 449169, 451729, 458385, 293010, 293522, 294546, 308882, 358546, 359570, 360082, 392338, 396946, 397970, 401042, 401554, 404114, 404626, 405138, 405650, 408722, 409746, 410258, 411282, 411794, 412306, 412818, 413330, 413842, 414354, 414866, 415378, 417426, 417938, 418450, 418962, 419474, 423570, 426642, 427154, 427666, 428690, 432274, 434322, 446098, 449682, 476818, 477330, 360083, 392339, 396947, 397459, 397971, 398483, 400531, 402579, 403603, 404627, 405139, 406163, 407699, 409235, 409747, 410259, 410771, 411283, 411795, 412307, 412819, 413843, 414355, 414867, 415379, 417427, 417939, 422547, 423571, 426131, 427155, 428179, 428691, 434323, 434835, 449683, 458899, 486035, 295060, 299156, 299668, 303252, 311444, 360084, 360596, 361108, 391828, 392340, 396948, 400532, 401044, 401556, 402580, 403092, 404116, 404628, 405140, 405652, 406164, 406676, 407700, 409236, 410260, 410772, 411284, 411796, 413332, 414356, 414868, 415380, 415892, 416404, 416916, 417940, 420500, 424084, 427156, 431764, 433812, 436884, 440468, 458900, 502932, 282773, 294549, 314005, 396949, 398485, 398997, 399509, 400021, 400533, 401045, 401557, 402069, 402581, 403605, 404117, 405141, 405653, 406165, 406677, 407189, 408725, 409749, 411285, 411797, 412309, 413845, 414357, 414869, 415381, 415893, 416405, 416917, 417429, 417941, 422037, 422549, 423061, 431253, 434325, 436885, 437397, 440981, 502933, 503445, 391830, 396438, 396950, 399510, 400022, 400534, 401046, 401558, 402070, 402582, 403094, 403606, 404118, 404630, 405142, 405654, 406166, 406678, 410774, 411286, 411798, 412310, 412822, 413334, 413846, 414358, 414870, 415382, 415894, 416406, 416918, 417942, 418454, 419478, 419990, 420502, 421014, 421526, 422038, 422550, 425110, 425622, 428182, 430742, 431254, 434326, 434838, 437910, 438422, 484502, 497302, 302231, 390807, 391319, 396951, 397463, 400023, 400535, 401047, 401559, 402071, 402583, 403607, 404119, 404631, 405143, 405655, 406167, 406679, 409239, 409751, 410263, 411287, 411799, 412311, 412823, 413335, 414871, 415383, 415895, 416407, 416919, 417431, 417943, 418455, 418967, 419479, 419991, 420503, 421015, 422039, 427159, 428183, 430231, 431255, 433303, 434327, 434839, 435351, 437399, 437911, 484503, 485015, 509591, 324760, 388760, 389272, 389784, 390296, 390808, 396952, 397464, 399512, 401048, 401560, 402072, 402584, 403096, 403608, 404120, 404632, 405144, 405656, 406168, 409752, 410776, 411288, 411800, 412312, 412824, 413336, 413848, 414872, 415384, 415896, 416920, 417432, 417944, 418968, 419480, 419992, 421528, 422040, 422552, 423576, 424088, 424600, 428184, 428696, 429208, 429720, 431256, 432280, 432792, 433304, 433816, 435352, 435864, 436376, 436888, 437912, 438936, 454808, 459928, 466584, 484504, 485528, 388249, 388761, 389273, 390297, 390809, 397465, 397977, 398489, 399001, 399513, 401049, 401561, 402073, 402585, 403097, 404121, 404633, 405145, 409241, 409753, 410777, 411289, 411801, 412313, 412825, 413849, 414361, 414873, 415385, 415897, 416921, 417433, 417945, 418969, 419481, 419993, 420505, 421017, 421529, 422041, 422553, 423065, 423577, 424089, 424601, 425113, 425625, 426137, 427673, 428185, 428697, 430233, 430745, 431257, 431769, 432281, 432793, 433305, 433817, 434329, 434841, 435353, 435865, 436377, 436889, 438937, 443033, 453273, 453785, 460441, 461977, 464025, 388250, 388762, 389274, 389786, 390298, 390810, 398490, 401050, 401562, 402074, 402586, 403098, 403610, 404122, 404634, 405146, 406682, 407194, 409242, 409754, 410778, 411290, 411802, 412314, 412826, 413338, 413850, 414362, 414874, 415386, 415898, 416410, 416922, 417434, 417946, 418458, 418970, 419482, 419994, 420506, 421018, 421530, 422042, 422554, 423066, 423578, 426138, 427162, 428186, 429722, 431258, 431770, 432282, 433306, 433818, 434330, 435354, 435866, 436890, 437402, 437914, 438426, 438938, 439962, 440474, 441498, 442522, 443546, 453274, 454810, 460442, 460954, 468122, 476314, 387739, 388251, 388763, 389275, 389787, 390299, 390811, 391323, 391835, 400027, 400539, 401051, 401563, 402075, 402587, 403099, 403611, 404123, 404635, 405147, 406171, 406683, 408731, 409243, 409755, 410779, 411291, 411803, 412315, 413339, 413851, 414363, 414875, 416923, 417435, 417947, 418459, 418971, 420507, 421019, 421531, 422043, 422555, 423067, 423579, 424091, 427163, 427675, 428187, 428699, 429211, 431259, 431771, 432795, 433819, 434843, 436379, 436891, 437403, 437915, 438427, 439451, 439963, 440475, 440987, 441499, 442011, 445595, 446107, 458907, 459931, 460443, 460955, 464027, 294556, 325788, 387740, 388764, 389276, 389788, 390300, 390812, 391324, 391836, 399004, 399516, 400028, 400540, 401052, 402076, 403100, 403612, 404124, 404636, 406172, 406684, 408732, 409244, 409756, 410268, 410780, 411292, 411804, 412316, 412828, 413340, 413852, 414364, 414876, 415900, 416924, 417436, 417948, 418460, 418972, 419996, 420508, 421020, 421532, 422044, 422556, 423068, 423580, 424092, 424604, 425116, 425628, 426140, 428188, 428700, 429724, 430236, 431260, 431772, 432284, 433308, 434332, 434844, 435356, 436380, 436892, 437404, 437916, 438428, 438940, 439452, 440476, 440988, 442524, 446108, 446620, 448156, 455836, 456348, 460956, 462492, 464028, 471196, 311965, 319645, 388765, 389277, 389789, 390301, 390813, 391325, 399005, 399517, 400029, 400541, 401565, 402077, 402589, 403101, 403613, 404125, 405149, 406173, 408733, 409245, 409757, 410269, 410781, 411293, 412317, 412829, 413341, 413853, 414365, 414877, 416413, 416925, 417437, 418973, 419485, 419997, 420509, 421021, 421533, 422045, 422557, 423069, 423581, 424093, 424605, 425117, 425629, 426141, 427677, 428189, 428701, 429213, 429725, 430237, 431773, 432285, 432797, 433821, 434333, 434845, 435357, 435869, 436381, 436893, 437405, 437917, 438429, 438941, 439965, 440477, 440989, 441501, 442013, 442525, 444573, 446621, 447133, 447645, 448157, 448669, 449181, 454301, 454813, 455325, 460957, 462493, 463005, 464029, 468637, 469149, 483997, 304798, 305310, 305822, 307870, 323230, 324254, 388254, 388766, 389278, 389790, 390302, 390814, 391326, 399006, 399518, 400030, 400542, 401054, 402078, 402590, 403102, 403614, 404126, 404638, 408222, 408734, 409246, 409758, 410270, 410782, 411294, 411806, 412830, 413342, 413854, 414366, 414878, 415390, 415902, 416414, 416926, 417950, 418462, 418974, 419486, 419998, 420510, 421022, 421534, 422046, 422558, 423070, 423582, 424094, 424606, 425118, 425630, 426654, 427166, 428190, 428702, 429214, 429726, 430238, 430750, 431262, 431774, 432286, 432798, 433310, 433822, 434846, 435358, 435870, 436382, 436894, 437406, 437918, 438430, 438942, 439454, 439966, 440478, 440990, 441502, 442526, 443550, 444062, 445598, 446110, 446622, 447134, 447646, 448158, 454302, 454814, 455326, 456350, 456862, 458910, 459422, 460446, 460958, 461470, 462494, 463006, 467102, 468638, 470686, 509598, 510110, 304287, 305311, 305823, 307359, 307871, 321183, 388255, 388767, 389279, 389791, 390303, 390815, 391327, 391839, 399007, 399519, 400031, 400543, 401055, 401567, 402079, 402591, 403103, 403615, 404639, 408223, 408735, 409247, 409759, 410271, 410783, 411295, 411807, 412319, 412831, 413343, 413855, 414879, 415391, 415903, 416927, 417439, 417951, 418975, 419487, 419999, 420511, 421023, 421535, 422047, 422559, 423071, 423583, 424095, 424607, 425119, 425631, 426143, 426655, 427167, 427679, 428191, 428703, 429215, 429727, 430239, 430751, 431263, 431775, 432287, 432799, 433311, 435359, 436895, 437407, 438943, 439455, 439967, 440479, 440991, 442527, 443039, 443551, 444063, 444575, 445087, 445599, 447135, 447647, 449183, 454303, 454815, 455327, 455839, 458399, 458911, 460447, 460959, 461471, 461983, 462495, 463007, 464031, 464543, 465567, 467103, 508575, 305312, 305824, 307872, 321696, 388256, 388768, 389280, 389792, 390304, 390816, 391328, 391840, 399008, 399520, 400032, 400544, 401056, 401568, 402080, 402592, 403104, 403616, 408736, 409248, 409760, 410272, 410784, 411296, 411808, 412320, 412832, 413344, 413856, 414368, 414880, 415392, 416928, 417952, 418464, 418976, 419488, 420000, 420512, 421024, 421536, 422048, 422560, 423584, 424096, 424608, 425120, 425632, 426144, 426656, 427168, 427680, 428192, 428704, 429216, 429728, 430752, 431264, 431776, 433312, 435360, 436896, 437408, 437920, 438432, 438944, 439968, 440480, 440992, 441504, 442016, 442528, 443040, 443552, 444064, 444576, 445088, 445600, 446112, 446624, 447136, 447648, 448160, 448672, 449184, 450208, 453792, 454304, 454816, 455840, 457376, 457888, 458400, 458912, 459936, 461472, 461984, 462496, 465056, 276129, 297121, 300193, 306337, 306849, 307361, 309409, 319649, 387233, 387745, 388257, 388769, 389793, 390305, 390817, 391329, 391841, 399009, 399521, 400033, 400545, 401057, 401569, 402081, 402593, 403617, 404129, 408225, 408737, 409249, 409761, 410273, 410785, 411297, 411809, 412321, 412833, 413345, 414369, 414881, 415393, 416929, 417441, 417953, 418465, 418977, 419489, 420001, 420513, 421025, 421537, 422049, 423073, 423585, 424609, 425121, 425633, 426145, 426657, 427681, 428193, 428705, 429217, 429729, 430241, 430753, 431265, 431777, 433313, 433825, 434849, 435361, 435873, 436385, 436897, 437409, 437921, 438433, 438945, 440481, 440993, 441505, 442529, 444577, 445089, 445601, 446113, 446625, 447137, 447649, 448161, 448673, 449185, 450209, 450721, 451745, 452257, 452769, 453281, 453793, 454305, 454817, 455329, 455841, 456353, 458401, 458913, 459425, 459937, 460449, 461985, 462497, 466593, 468641, 471713, 484001, 514209, 301218, 310434, 310946, 311970, 319138, 320162, 321698, 344226, 386722, 387234, 387746, 388258, 388770, 389282, 389794, 390306, 390818, 391330, 391842, 392354, 399010, 399522, 400034, 400546, 401058, 401570, 402082, 402594, 405154, 405666, 406178, 406690, 407714, 408226, 408738, 409250, 409762, 410274, 410786, 411298, 411810, 412322, 412834, 413346, 413858, 414370, 414882, 415394, 415906, 416418, 417442, 417954, 418466, 418978, 419490, 420002, 420514, 421026, 421538, 422050, 422562, 423074, 423586, 424098, 424610, 425122, 425634, 426146, 426658, 427170, 427682, 428194, 428706, 429218, 429730, 430242, 430754, 431266, 431778, 432290, 433314, 433826, 434338, 435362, 435874, 436386, 436898, 437410, 437922, 443554, 444066, 444578, 445090, 445602, 446114, 446626, 447138, 447650, 448162, 448674, 449186, 450210, 450722, 452258, 452770, 453282, 453794, 454306, 454818, 455330, 455842, 456354, 457890, 458402, 458914, 459426, 469154, 469666, 508578, 299683, 301731, 302755, 309923, 310435, 310947, 311971, 312995, 313507, 385699, 386211, 386723, 387235, 387747, 388259, 388771, 389795, 390307, 390819, 391331, 391843, 392355, 392867, 399011, 399523, 400035, 400547, 401059, 402083, 402595, 403107, 404643, 405155, 405667, 406179, 406691, 407203, 407715, 408227, 408739, 409251, 409763, 410275, 410787, 411299, 411811, 412323, 412835, 413347, 413859, 414371, 414883, 415395, 415907, 417955, 418467, 418979, 419491, 420003, 420515, 421027, 421539, 422051, 422563, 423075, 423587, 424099, 424611, 425123, 425635, 426147, 426659, 427171, 427683, 428195, 428707, 429219, 429731, 430243, 431267, 431779, 432291, 433315, 433827, 434339, 434851, 435875, 436387, 436899, 437411, 437923, 438435, 438947, 439459, 439971, 440483, 443043, 443555, 444579, 445091, 445603, 446115, 446627, 447139, 447651, 449187, 449699, 450211, 450723, 451235, 451747, 452259, 452771, 453283, 453795, 454307, 454819, 455843, 456355, 458403, 458915, 459427, 459939, 467107, 272036, 296612, 299684, 301732, 302244, 302756, 303780, 304804, 309924, 310436, 310948, 311972, 312484, 312996, 314020, 315044, 318628, 319140, 319652, 335524, 385700, 386212, 386724, 387236, 387748, 388260, 388772, 389796, 390820, 391332, 391844, 392356, 392868, 398500, 399012, 399524, 400036, 400548, 401060, 401572, 402084, 402596, 403108, 403620, 404132, 404644, 405156, 405668, 406180, 406692, 407204, 407716, 408228, 408740, 409252, 409764, 410276, 410788, 411300, 411812, 412324, 412836, 413348, 413860, 414372, 414884, 415396, 415908, 416420, 416932, 417444, 417956, 418468, 418980, 420004, 420516, 421028, 421540, 422052, 422564, 423076, 423588, 424100, 424612, 425124, 425636, 426148, 426660, 427172, 427684, 428196, 428708, 429220, 429732, 430244, 431268, 431780, 432292, 432804, 433316, 434340, 434852, 435876, 436388, 436900, 437412, 437924, 438436, 438948, 439972, 442532, 443044, 444068, 445092, 445604, 446116, 446628, 447140, 447652, 448164, 449188, 449700, 450212, 450724, 451236, 452260, 452772, 453284, 453796, 454308, 454820, 456356, 456868, 458404, 458916, 459428, 459940, 460452, 460964, 468132, 470180, 470692, 482468, 297125, 308389, 309925, 310437, 310949, 311461, 312485, 312997, 313509, 314021, 315045, 316069, 316581, 317093, 317605, 346277, 349349, 385701, 386213, 386725, 387237, 387749, 388261, 388773, 389797, 390309, 390821, 391333, 391845, 392357, 392869, 393381, 396965, 397477, 397989, 398501, 399013, 399525, 400037, 400549, 401061, 401573, 402085, 402597, 403109, 403621, 404133, 404645, 405157, 405669, 406181, 406693, 407205, 407717, 408229, 408741, 409253, 409765, 410277, 410789, 411301, 411813, 412325, 412837, 413349, 413861, 414373, 414885, 415397, 415909, 416421, 416933, 417445, 417957, 418469, 418981, 419493, 420005, 420517, 421029, 421541, 422053, 422565, 423077, 423589, 424101, 424613, 425637, 426149, 426661, 427173, 427685, 428197, 428709, 429221, 429733, 430245, 431269, 431781, 432293, 432805, 433829, 434341, 435365, 435877, 436389, 436901, 437413, 437925, 438437, 438949, 439461, 443045, 443557, 444581, 445093, 445605, 446629, 447141, 447653, 448165, 449189, 449701, 450213, 450725, 451237, 453797, 454309, 454821, 455333, 456357, 457381, 458405, 458917, 459429, 459941, 460453, 460965, 467621, 468133, 468645, 470181, 484517, 297126, 303782, 304806, 309926, 310438, 310950, 312998, 313510, 314022, 314534, 315046, 315558, 316070, 316582, 317094, 317606, 320678, 344230, 349350, 385702, 386214, 386726, 387238, 387750, 388262, 388774, 389798, 390310, 390822, 391334, 391846, 392358, 392870, 393382, 393894, 396454, 396966, 397478, 397990, 398502, 399014, 399526, 400038, 400550, 401062, 401574, 402086, 402598, 403110, 403622, 404134, 404646, 405158, 405670, 406182, 406694, 407206, 407718, 408230, 408742, 409254, 409766, 410278, 410790, 411302, 411814, 412326, 412838, 413350, 413862, 414374, 414886, 415398, 415910, 417446, 417958, 418470, 418982, 419494, 420518, 421030, 421542, 422054, 422566, 423590, 424102, 424614, 425126, 425638, 426150, 426662, 427174, 427686, 428198, 428710, 429222, 429734, 430246, 430758, 431270, 431782, 432294, 433830, 435878, 436390, 436902, 437414, 438950, 439462, 440486, 440998, 442022, 442534, 443046, 443558, 444070, 444582, 445094, 445606, 448166, 448678, 450214, 450726, 453286, 453798, 454310, 454822, 455334, 456870, 457382, 458406, 458918, 459430, 459942, 460454, 468134, 469158, 471206, 495782, 497318, 508582, 307367, 309927, 310439, 310951, 312999, 313511, 314535, 315559, 316071, 316583, 317095, 317607, 318119, 318631, 319655, 344231, 386215, 386727, 387239, 387751, 388263, 388775, 389799, 390311, 390823, 391335, 391847, 392359, 392871, 393383, 393895, 394407, 396455, 396967, 397479, 397991, 398503, 399015, 399527, 400039, 400551, 401063, 401575, 402087, 402599, 403111, 403623, 404135, 404647, 405159, 405671, 406183, 406695, 407207, 407719, 408231, 408743, 409255, 409767, 410279, 410791, 411303, 411815, 412327, 412839, 413351, 413863, 414375, 414887, 415399, 415911, 416423, 416935, 417447, 417959, 418471, 419495, 420519, 421031, 421543, 422055, 422567, 423079, 423591, 424103, 424615, 425127, 425639, 426151, 426663, 427175, 427687, 428199, 428711, 429223, 429735, 430759, 431271, 431783, 432295, 432807, 433319, 433831, 434343, 435367, 435879, 436903, 437415, 438439, 438951, 440999, 441511, 442023, 442535, 443047, 443559, 444071, 444583, 445095, 446119, 446631, 450215, 450727, 451239, 451751, 452263, 453287, 453799, 455335, 456871, 457383, 458407, 468647, 469671, 470695, 474279, 478375, 508583, 301736, 308392, 309928, 310440, 310952, 313000, 313512, 315048, 315560, 316072, 316584, 317096, 317608, 318120, 318632, 319144, 319656, 352424, 385704, 386216, 386728, 387240, 387752, 388264, 389800, 390312, 390824, 391336, 391848, 392360, 392872, 393384, 393896, 394408, 395944, 396456, 396968, 397480, 397992, 398504, 399016, 399528, 400040, 400552, 401064, 401576, 402088, 402600, 403112, 403624, 404136, 404648, 405160, 405672, 406184, 406696, 407208, 407720, 408232, 408744, 409256, 409768, 410280, 410792, 411304, 411816, 412328, 412840, 413352, 413864, 414376, 414888, 415400, 415912, 416424, 416936, 417448, 417960, 418472, 418984, 419496, 420520, 421032, 421544, 422056, 422568, 423080, 423592, 424104, 424616, 425128, 425640, 426152, 426664, 427176, 427688, 428200, 428712, 429736, 430248, 430760, 431272, 431784, 432296, 432808, 433320, 434344, 435368, 435880, 436904, 437928, 438440, 439464, 439976, 441000, 441512, 442024, 442536, 443048, 443560, 444072, 444584, 445096, 445608, 449192, 450728, 451240, 452264, 452776, 453288, 453800, 454824, 455336, 455848, 456360, 460968, 461480, 468648, 469160, 472744, 475816, 477352, 477864, 478376, 478888, 309929, 310441, 313001, 314025, 315049, 316073, 316585, 317609, 318121, 318633, 319145, 319657, 320169, 320681, 321193, 321705, 351913, 385705, 386217, 386729, 387241, 387753, 389289, 389801, 390313, 390825, 391337, 391849, 392361, 392873, 393385, 393897, 395945, 396457, 396969, 397481, 397993, 398505, 399017, 399529, 400041, 400553, 401065, 401577, 402089, 402601, 403113, 403625, 404137, 404649, 405161, 405673, 406185, 406697, 407209, 407721, 408233, 408745, 409257, 409769, 410281, 410793, 411305, 411817, 412329, 412841, 413353, 413865, 414377, 414889, 415401, 415913, 416937, 417449, 417961, 418473, 418985, 419497, 420009, 420521, 421033, 421545, 422057, 422569, 423081, 424105, 424617, 425129, 425641, 426153, 426665, 427177, 427689, 428201, 428713, 429225, 429737, 430249, 430761, 431273, 431785, 432297, 432809, 433321, 433833, 434345, 435881, 436905, 437417, 438441, 439465, 439977, 440489, 441001, 441513, 442025, 442537, 443049, 443561, 444073, 444585, 445097, 445609, 446121, 447657, 448169, 449193, 451241, 451753, 452265, 452777, 453289, 454825, 455337, 455849, 456873, 461993, 467625, 468137, 468649, 469161, 469673, 471209, 471721, 473257, 474793, 475305, 475817, 476329, 476841, 477353, 477865, 478377, 492201, 309930, 310442, 310954, 313514, 314026, 314538, 315050, 315562, 316074, 316586, 317098, 318122, 318634, 319146, 319658, 320170, 320682, 321194, 321706, 334506, 351402, 351914, 386218, 386730, 389802, 390314, 390826, 391338, 391850, 392362, 392874, 393386, 393898, 394410, 395434, 395946, 396458, 396970, 397482, 397994, 398506, 399018, 399530, 400042, 400554, 401066, 401578, 402090, 402602, 403114, 403626, 404138, 404650, 405162, 405674, 406186, 406698, 407210, 407722, 408234, 408746, 409258, 409770, 410282, 410794, 411306, 411818, 412330, 412842, 413354, 413866, 414378, 414890, 415402, 415914, 416426, 416938, 417450, 417962, 418474, 418986, 419498, 420010, 420522, 421034, 421546, 422058, 422570, 423082, 423594, 424106, 424618, 425130, 425642, 426154, 426666, 427178, 427690, 428202, 428714, 429226, 429738, 430250, 430762, 431274, 431786, 432298, 432810, 433834, 434346, 434858, 435370, 435882, 436906, 437418, 437930, 442026, 442538, 443050, 444074, 444586, 445098, 445610, 446122, 452266, 452778, 453290, 453802, 454826, 455338, 455850, 461482, 462506, 469162, 471210, 471722, 472234, 472746, 473258, 473770, 475818, 476842, 477354, 477866, 479914, 480426, 486570, 491690, 492714, 507050, 304299, 304811, 305835, 308907, 309931, 310443, 311979, 313003, 313515, 314027, 315563, 316075, 317099, 317611, 318123, 318635, 319147, 319659, 320171, 320683, 321195, 321707, 322219, 322731, 324779, 389803, 390315, 390827, 391339, 391851, 392363, 392875, 393387, 393899, 394411, 394923, 395435, 395947, 396459, 396971, 397483, 397995, 398507, 399019, 399531, 400043, 400555, 401067, 401579, 402091, 402603, 403115, 403627, 404139, 404651, 405163, 405675, 406187, 406699, 407211, 407723, 408235, 408747, 409259, 409771, 410283, 410795, 411307, 411819, 412331, 412843, 413355, 414379, 414891, 415403, 415915, 416427, 416939, 417451, 417963, 418475, 418987, 419499, 420011, 420523, 421035, 421547, 422059, 422571, 423083, 423595, 424107, 424619, 425131, 425643, 426155, 426667, 427179, 427691, 428203, 428715, 429227, 429739, 430251, 430763, 432811, 433323, 433835, 434347, 435883, 436395, 436907, 437419, 441515, 443051, 443563, 444075, 444587, 445099, 445611, 446123, 446635, 450731, 452267, 452779, 453291, 454827, 455339, 455851, 462507, 470699, 472235, 474283, 475819, 476331, 476843, 477355, 477867, 478891, 479403, 479915, 487083, 491179, 496811, 304300, 304812, 305324, 305836, 306348, 309932, 310444, 311468, 313516, 314028, 314540, 315052, 315564, 316076, 316588, 317100, 317612, 318124, 318636, 319148, 319660, 320172, 320684, 321196, 321708, 322220, 322732, 323244, 325292, 389292, 389804, 390316, 390828, 391340, 391852, 392364, 394412, 394924, 395436, 395948, 396460, 396972, 397484, 397996, 398508, 399020, 399532, 400044, 400556, 401068, 401580, 402092, 402604, 403116, 403628, 404140, 404652, 405164, 405676, 406188, 406700, 407212, 407724, 408236, 408748, 409260, 409772, 410284, 410796, 411308, 411820, 412332, 412844, 413356, 413868, 414380, 414892, 415404, 415916, 416428, 416940, 417452, 417964, 418476, 418988, 419500, 420012, 420524, 421036, 421548, 422060, 422572, 423084, 423596, 424108, 424620, 425644, 426156, 427180, 427692, 434860, 435372, 436396, 441004, 443564, 444076, 444588, 445100, 446124, 450220, 451244, 451756, 452268, 452780, 453292, 455340, 455852, 469676, 471724, 475820, 477356, 477868, 478892, 479404, 479916, 486060, 487084, 492716, 493228, 493740, 304813, 305325, 306349, 310957, 312493, 313005, 313517, 314029, 314541, 315053, 315565, 316589, 317101, 317613, 318637, 319149, 319661, 320173, 320685, 321197, 321709, 322221, 322733, 323245, 324269, 325293, 325805, 326317, 339117, 344237, 344749, 348333, 388269, 388781, 389293, 389805, 393389, 393901, 394413, 394925, 395437, 395949, 396461, 396973, 397485, 397997, 398509, 399021, 399533, 400045, 400557, 401069, 401581, 402093, 402605, 403117, 403629, 404141, 404653, 405165, 405677, 406189, 406701, 407213, 407725, 408237, 408749, 409261, 409773, 410285, 410797, 411309, 411821, 412333, 412845, 413357, 413869, 414381, 414893, 415405, 415917, 416429, 416941, 417453, 417965, 418477, 418989, 419501, 420013, 420525, 421037, 421549, 422061, 422573, 423085, 423597, 424109, 424621, 425133, 425645, 426157, 427181, 428717, 433325, 433837, 434349, 434861, 435885, 440493, 441005, 442029, 444077, 445101, 446125, 446637, 452781, 453293, 455341, 455853, 457389, 460461, 475821, 478381, 478893, 486061, 487597, 492717, 493741, 494253, 497325, 302254, 303278, 305838, 307374, 307886, 308910, 309422, 309934, 310958, 313006, 313518, 314030, 314542, 315054, 315566, 316078, 316590, 317102, 318126, 319150, 319662, 320174, 320686, 321198, 321710, 322222, 322734, 323246, 323758, 324270, 325294, 326318, 329902, 331438, 331950, 332462, 332974, 344238, 346286, 350894, 391342, 391854, 392366, 393390, 393902, 394414, 394926, 395438, 395950, 396462, 396974, 397486, 397998, 398510, 399022, 399534, 400046, 400558, 401070, 401582, 402094, 402606, 403118, 403630, 404142, 404654, 405166, 405678, 406190, 406702, 407214, 407726, 408238, 408750, 409262, 409774, 410286, 410798, 411310, 411822, 412334, 412846, 413358, 413870, 414382, 414894, 415406, 415918, 416430, 416942, 417454, 417966, 418478, 418990, 419502, 420014, 420526, 421038, 421550, 422062, 422574, 423086, 423598, 424110, 424622, 425134, 425646, 426158, 427182, 429230, 434862, 439470, 441518, 446126, 446638, 448174, 448686, 454318, 456878, 457902, 458414, 478382, 486574, 487598, 488110, 492718, 496814, 497326, 302255, 302767, 303279, 303791, 304303, 304815, 305839, 306351, 306863, 307375, 307887, 308399, 308911, 309423, 311471, 313519, 314031, 314543, 315055, 315567, 316079, 317103, 317615, 318127, 319151, 319663, 320175, 320687, 321199, 321711, 322223, 322735, 323247, 323759, 328879, 330415, 331439, 331951, 333487, 333999, 334511, 337071, 340143, 343215, 343727, 344239, 344751, 345263, 345775, 350895, 352431, 353967, 391343, 391855, 392367, 392879, 393391, 393903, 394415, 394927, 395439, 395951, 396463, 396975, 397487, 397999, 398511, 399023, 399535, 400047, 400559, 401071, 401583, 402095, 402607, 403119, 403631, 404143, 404655, 405167, 405679, 406191, 406703, 407215, 407727, 408239, 408751, 409263, 409775, 410287, 410799, 411311, 411823, 412335, 412847, 413359, 413871, 414383, 414895, 415407, 415919, 416431, 416943, 417455, 417967, 418479, 418991, 419503, 420527, 421039, 421551, 422063, 422575, 423087, 423599, 425135, 425647, 426159, 427183, 432303, 434351, 447663, 448175, 449199, 455855, 492719, 495279, 497327, 302768, 303280, 303792, 304304, 305840, 306352, 306864, 307376, 307888, 308400, 308912, 309424, 310448, 310960, 311472, 311984, 312496, 313008, 313520, 314032, 315056, 315568, 316592, 317104, 318640, 320176, 320688, 321712, 322224, 322736, 323248, 325296, 326320, 327856, 328368, 328880, 329392, 329904, 330416, 334000, 334512, 336048, 336560, 338608, 340144, 340656, 341168, 342704, 343728, 344240, 346288, 350384, 351920, 353456, 353968, 354480, 389808, 390320, 390832, 391344, 391856, 392368, 392880, 393392, 393904, 394416, 394928, 395440, 395952, 396464, 396976, 397488, 398000, 398512, 399024, 399536, 400048, 400560, 401072, 401584, 402096, 402608, 403120, 403632, 404144, 404656, 405168, 405680, 406192, 406704, 407216, 407728, 408240, 408752, 409264, 409776, 410288, 410800, 411312, 411824, 412336, 412848, 413360, 413872, 414384, 414896, 415408, 415920, 416432, 416944, 417456, 417968, 418480, 418992, 419504, 420016, 420528, 421040, 421552, 422064, 422576, 423600, 424112, 424624, 425136, 425648, 426160, 426672, 427184, 435888, 436400, 438448, 442032, 451760, 452272, 473776, 489648, 491184, 491696, 303281, 303793, 304305, 304817, 305841, 307377, 307889, 308913, 309937, 310961, 311473, 311985, 312497, 313009, 314033, 314545, 315569, 316081, 316593, 317105, 317617, 318129, 319665, 321201, 321713, 322737, 323249, 327857, 328369, 332977, 334001, 334513, 335025, 335537, 336049, 336561, 337073, 340657, 341169, 341681, 342193, 342705, 343217, 343729, 344241, 344753, 345265, 345777, 346289, 350385, 353969, 354481, 389297, 389809, 390321, 390833, 391345, 391857, 392369, 392881, 393393, 393905, 394417, 394929, 395441, 395953, 396465, 396977, 397489, 398001, 398513, 399025, 399537, 400049, 400561, 401073, 401585, 402097, 402609, 403121, 403633, 404145, 404657, 405169, 405681, 406193, 406705, 407217, 407729, 408241, 408753, 409265, 409777, 410289, 410801, 411313, 411825, 412337, 412849, 413361, 413873, 414385, 414897, 415409, 415921, 416433, 416945, 417457, 417969, 418481, 418993, 419505, 420017, 420529, 421041, 421553, 422065, 422577, 423089, 423601, 424113, 424625, 425137, 425649, 426161, 426673, 436401, 489649, 491697, 492209, 302258, 302770, 303794, 304306, 305330, 305842, 306354, 306866, 307378, 307890, 308402, 308914, 309426, 309938, 311474, 311986, 312498, 313010, 313522, 314034, 314546, 316594, 317106, 319154, 320178, 320690, 323250, 324786, 325810, 326834, 327346, 331442, 332466, 332978, 333490, 334002, 334514, 335026, 335538, 340146, 340658, 341682, 342194, 342706, 343218, 344242, 344754, 345266, 345778, 346290, 349874, 350386, 352434, 352946, 353458, 353970, 354482, 354994, 389810, 390322, 390834, 391346, 391858, 392370, 392882, 393394, 393906, 394418, 394930, 395442, 395954, 396466, 396978, 397490, 398002, 398514, 399026, 399538, 400050, 400562, 401074, 401586, 402098, 402610, 403122, 403634, 404146, 404658, 405170, 405682, 406194, 406706, 407218, 407730, 408242, 408754, 409266, 409778, 410290, 410802, 411314, 411826, 412338, 412850, 413362, 413874, 414386, 414898, 415410, 415922, 416946, 417458, 417970, 418482, 418994, 419506, 420018, 420530, 421042, 421554, 422066, 422578, 423090, 423602, 424114, 424626, 425138, 425650, 426162, 426674, 427186, 427698, 430770, 431794, 434354, 436402, 437426, 442546, 450226, 451762, 453298, 453810, 470706, 471218, 488626, 491186, 491698, 303283, 303795, 304307, 304819, 305331, 305843, 306355, 306867, 307379, 307891, 308915, 309427, 309939, 311475, 311987, 312499, 313011, 313523, 314035, 315059, 316083, 318643, 319155, 319667, 320179, 320691, 321203, 322227, 322739, 323251, 324275, 325299, 325811, 328371, 328883, 333491, 335027, 335539, 340147, 341171, 341683, 342195, 342707, 343219, 343731, 344243, 345267, 345779, 351923, 352435, 352947, 353971, 354483, 354995, 390835, 391347, 391859, 392371, 392883, 393395, 393907, 394419, 394931, 395443, 395955, 396467, 396979, 397491, 398003, 398515, 399027, 399539, 400051, 400563, 401075, 401587, 402099, 402611, 403123, 403635, 404147, 404659, 405171, 405683, 406195, 406707, 407219, 407731, 408243, 408755, 409267, 409779, 410291, 410803, 411315, 411827, 412339, 412851, 413363, 413875, 414387, 414899, 415923, 416435, 416947, 417459, 417971, 418483, 418995, 419507, 420019, 420531, 421043, 421555, 422067, 422579, 423091, 423603, 424115, 424627, 425139, 425651, 426163, 426675, 427187, 427699, 430771, 432819, 437427, 438451, 451763, 452275, 452787, 497331, 302772, 303284, 303796, 304308, 305332, 306356, 306868, 307380, 307892, 308404, 309940, 310964, 311476, 313012, 313524, 314548, 318132, 318644, 319156, 319668, 320180, 320692, 322228, 322740, 323252, 323764, 324276, 324788, 325812, 326324, 326836, 327860, 328372, 328884, 329396, 330420, 331444, 331956, 334004, 334516, 338100, 339124, 340148, 340660, 341172, 341684, 342196, 343732, 344244, 345268, 345780, 346292, 346804, 348852, 349364, 352436, 352948, 353972, 354484, 391348, 391860, 392372, 392884, 393396, 393908, 394420, 394932, 395444, 395956, 396468, 396980, 397492, 398004, 398516, 399028, 399540, 400052, 400564, 401076, 401588, 402100, 402612, 403124, 403636, 404148, 404660, 405172, 405684, 406196, 406708, 407220, 407732, 408244, 408756, 409268, 409780, 410292, 410804, 411316, 411828, 412340, 412852, 413364, 413876, 414388, 414900, 415412, 415924, 416436, 416948, 417460, 417972, 418484, 418996, 419508, 420020, 420532, 421044, 421556, 422068, 422580, 423092, 423604, 424116, 424628, 425140, 425652, 426676, 428212, 428724, 429236, 437940, 447668, 496308, 496820, 497332, 302773, 303285, 303797, 304309, 305333, 305845, 306357, 306869, 307381, 307893, 310453, 310965, 311989, 313013, 313525, 314037, 314549, 315061, 315573, 318133, 318645, 321717, 322229, 322741, 323253, 323765, 324277, 325813, 326325, 326837, 327349, 327861, 328373, 328885, 329397, 329909, 330421, 330933, 331445, 331957, 332469, 332981, 333493, 334005, 334517, 335029, 335541, 336053, 336565, 337589, 338101, 338613, 339125, 339637, 340149, 340661, 341173, 341685, 342197, 343733, 344245, 344757, 345269, 345781, 346293, 346805, 347317, 347829, 348341, 348853, 349365, 391861, 392373, 392885, 393397, 393909, 394421, 394933, 395445, 395957, 396469, 396981, 397493, 398005, 398517, 399029, 399541, 400053, 400565, 401077, 401589, 402101, 402613, 403125, 403637, 404149, 404661, 405173, 405685, 406197, 406709, 407221, 407733, 408245, 408757, 409269, 409781, 410293, 410805, 411317, 411829, 412341, 412853, 413365, 413877, 414389, 414901, 415413, 416437, 416949, 417461, 417973, 418485, 418997, 420533, 421045, 421557, 422069, 422581, 423093, 423605, 424117, 424629, 425141, 425653, 426165, 426677, 427701, 428213, 428725, 434357, 437941, 303286, 303798, 304310, 304822, 305846, 306358, 306870, 310454, 310966, 311478, 311990, 312502, 313014, 313526, 314038, 314550, 315062, 317110, 321718, 322230, 322742, 323254, 323766, 324278, 324790, 325302, 325814, 326326, 326838, 327350, 327862, 328374, 328886, 329398, 329910, 330422, 330934, 331446, 331958, 332470, 332982, 333494, 334006, 334518, 335030, 335542, 336054, 336566, 337078, 337590, 338102, 338614, 339126, 339638, 340150, 340662, 341174, 341686, 343222, 343734, 344246, 344758, 345270, 345782, 346294, 346806, 347318, 347830, 348342, 348854, 349366, 392374, 392886, 393398, 393910, 394422, 394934, 395446, 395958, 396470, 396982, 397494, 398006, 398518, 399030, 399542, 400054, 400566, 401078, 401590, 402102, 402614, 403126, 403638, 404150, 404662, 405174, 405686, 406198, 406710, 407222, 407734, 408246, 408758, 409270, 409782, 410294, 410806, 411318, 411830, 412342, 412854, 413366, 413878, 414390, 414902, 415414, 416950, 417462, 417974, 418486, 421046, 421558, 422070, 422582, 423094, 423606, 424118, 424630, 425142, 425654, 427190, 427702, 428214, 437942, 438454, 451766, 454838, 490678, 491190, 302775, 303287, 303799, 304311, 304823, 305335, 305847, 306359, 307383, 307895, 310455, 310967, 311479, 313527, 314039, 315063, 316599, 321207, 321719, 323255, 324279, 324791, 325303, 325815, 326327, 326839, 327351, 327863, 328375, 328887, 329399, 329911, 330935, 331447, 331959, 334519, 335031, 335543, 336055, 336567, 337079, 337591, 338103, 338615, 339127, 339639, 340151, 340663, 341175, 341687, 342711, 344247, 344759, 345271, 345783, 346295, 346807, 347319, 347831, 348343, 348855, 392375, 392887, 393399, 393911, 394423, 394935, 395447, 395959, 396471, 396983, 397495, 398007, 398519, 399031, 399543, 400055, 400567, 401079, 401591, 402103, 402615, 403127, 403639, 404151, 404663, 405175, 405687, 406199, 406711, 407223, 407735, 408247, 408759, 409271, 409783, 410295, 410807, 411319, 411831, 412343, 412855, 413367, 413879, 414391, 414903, 416951, 417463, 417975, 418487, 418999, 419511, 420023, 420535, 421047, 421559, 422071, 422583, 423095, 423607, 424119, 424631, 425143, 426679, 427191, 427703, 433335, 439991, 446647, 490167, 490679, 496311, 302776, 303288, 303800, 304824, 305336, 307384, 310968, 312504, 315064, 317112, 322232, 323256, 323768, 324280, 324792, 325304, 325816, 326328, 326840, 327352, 327864, 328376, 328888, 329400, 329912, 330424, 330936, 331448, 331960, 332472, 334008, 334520, 335032, 335544, 336056, 336568, 337080, 337592, 338104, 338616, 339128, 339640, 340152, 340664, 341176, 341688, 342200, 342712, 343224, 344248, 344760, 345272, 345784, 346296, 346808, 347320, 347832, 348344, 392376, 392888, 393400, 393912, 394424, 394936, 395448, 395960, 396472, 396984, 397496, 398008, 398520, 399032, 399544, 400056, 400568, 401080, 401592, 402104, 403128, 403640, 404152, 404664, 405176, 405688, 406200, 406712, 407224, 407736, 408248, 408760, 409272, 409784, 410296, 410808, 411320, 411832, 412344, 412856, 413368, 413880, 414392, 417464, 417976, 418488, 419000, 420024, 420536, 421048, 421560, 422072, 422584, 423096, 423608, 424120, 424632, 425144, 425656, 427192, 441016, 443576, 447160, 449208, 489144, 489656, 496312, 303289, 303801, 304825, 306361, 307897, 308409, 313529, 314553, 316089, 317625, 319161, 321721, 322745, 323257, 323769, 324281, 324793, 325305, 325817, 326329, 326841, 327353, 327865, 328377, 328889, 329401, 330425, 330937, 331449, 331961, 333497, 334009, 334521, 335033, 335545, 336057, 336569, 337081, 337593, 338105, 338617, 339129, 339641, 340153, 340665, 341177, 341689, 342201, 342713, 343225, 344761, 345273, 345785, 346297, 346809, 392377, 392889, 393401, 393913, 394425, 394937, 395449, 395961, 396473, 396985, 397497, 398009, 398521, 399033, 399545, 400057, 400569, 401081, 401593, 402105, 403641, 404153, 404665, 405177, 405689, 406201, 406713, 407225, 407737, 408249, 408761, 409273, 409785, 410297, 410809, 411321, 411833, 412345, 412857, 413369, 413881, 417465, 417977, 421049, 421561, 422073, 422585, 423097, 423609, 424121, 424633, 425145, 425657, 426169, 429753, 431289, 449721, 451257, 454841, 488633, 489145, 489657, 490169, 491705, 496313, 302778, 303290, 303802, 306362, 307898, 308410, 309946, 311482, 311994, 314554, 315578, 317626, 318138, 318650, 319162, 320698, 321210, 321722, 322746, 323258, 323770, 324282, 324794, 325306, 325818, 326330, 326842, 327354, 327866, 328378, 328890, 329402, 330426, 330938, 331450, 331962, 332474, 333498, 334010, 334522, 335034, 335546, 336058, 336570, 337082, 338106, 339130, 339642, 340154, 340666, 341178, 341690, 342202, 342714, 344762, 345274, 345786, 387258, 387770, 388794, 391866, 392378, 392890, 393402, 393914, 394426, 394938, 395450, 395962, 396474, 396986, 397498, 398010, 398522, 399034, 400058, 400570, 401082, 401594, 402106, 402618, 403130, 404154, 404666, 405178, 405690, 406202, 406714, 407226, 407738, 408250, 408762, 409274, 409786, 410298, 410810, 411322, 411834, 412346, 412858, 413370, 413882, 421562, 422074, 422586, 423098, 423610, 424122, 424634, 425146, 425658, 427194, 427706, 430266, 435898, 443578, 444090, 444602, 446650, 447162, 449210, 450234, 484538, 489146, 496826, 497850, 302779, 303291, 304827, 311483, 314555, 317627, 321211, 322235, 322747, 323259, 324283, 324795, 325307, 325819, 326331, 326843, 327355, 327867, 328379, 328891, 329403, 330427, 330939, 331451, 331963, 332475, 332987, 333499, 334011, 334523, 335035, 335547, 336059, 336571, 337595, 338107, 338619, 339131, 339643, 340155, 340667, 341179, 341691, 345275, 345787, 386235, 386747, 387259, 387771, 388283, 388795, 389307, 389819, 390331, 390843, 391355, 391867, 392379, 392891, 393403, 393915, 394427, 394939, 395451, 395963, 396475, 396987, 397499, 398011, 400571, 401083, 401595, 402107, 402619, 403131, 404667, 405179, 405691, 406203, 406715, 407227, 407739, 408251, 408763, 409275, 409787, 410299, 410811, 411323, 411835, 412347, 412859, 413371, 413883, 422075, 422587, 423099, 423611, 424123, 424635, 425147, 425659, 426171, 426683, 427195, 442555, 443067, 444091, 444603, 447163, 447675, 448699, 449211, 450235, 450747, 486587, 489147, 489659, 490171, 490683, 495803, 496315, 497851, 499387, 304316, 309436, 313020, 315580, 316092, 317116, 320700, 322236, 322748, 323260, 323772, 324796, 325308, 325820, 326332, 326844, 327356, 327868, 328380, 328892, 329404, 330428, 330940, 331452, 331964, 332476, 332988, 333500, 334012, 334524, 335036, 335548, 336060, 336572, 337084, 337596, 338108, 338620, 339132, 339644, 340156, 340668, 341180, 341692, 386236, 386748, 387260, 387772, 388284, 388796, 389308, 389820, 390332, 390844, 391356, 391868, 392380, 392892, 393404, 393916, 394428, 394940, 395452, 397500, 399548, 400060, 400572, 401084, 401596, 402108, 402620, 403132, 404668, 405180, 405692, 406204, 406716, 407228, 407740, 408252, 408764, 409276, 409788, 410300, 410812, 411324, 411836, 412348, 412860, 413372, 423100, 423612, 424124, 424636, 425148, 425660, 427708, 436412, 443068, 444092, 445116, 446652, 447164, 447676, 448188, 488124, 488636, 489148, 489660, 490172, 495292, 495804, 496316, 497340, 303293, 303805, 304317, 305341, 309949, 312509, 313533, 316605, 317117, 318653, 322237, 323261, 324285, 324797, 325309, 325821, 326333, 326845, 327357, 327869, 328381, 328893, 329405, 330429, 330941, 331453, 331965, 332477, 332989, 333501, 334525, 335037, 336061, 336573, 337085, 337597, 338109, 338621, 339133, 339645, 340157, 340669, 341181, 341693, 342205, 386749, 387261, 387773, 388285, 388797, 389309, 389821, 390333, 390845, 391357, 391869, 392381, 392893, 393405, 393917, 394429, 394941, 395453, 399549, 400061, 401085, 401597, 402109, 402621, 403133, 403645, 404669, 406717, 407229, 407741, 408253, 408765, 409277, 409789, 410301, 410813, 411325, 411837, 412349, 412861, 413373, 419005, 423613, 424125, 424637, 425149, 425661, 426173, 427197, 427709, 428221, 436413, 436925, 438973, 439485, 443069, 443581, 444093, 445629, 446141, 448189, 448701, 450237, 495805, 302782, 303294, 303806, 304318, 304830, 305342, 305854, 307390, 311486, 311998, 312510, 313534, 315070, 315582, 316606, 317630, 318142, 318654, 320702, 321214, 321726, 322238, 322750, 323262, 323774, 324286, 324798, 325310, 325822, 326334, 326846, 327358, 327870, 328382, 328894, 329406, 329918, 330430, 330942, 331454, 331966, 332478, 332990, 333502, 334014, 334526, 335038, 335550, 336062, 337086, 337598, 338110, 338622, 339134, 339646, 340158, 340670, 341182, 341694, 342206, 386750, 387262, 387774, 388286, 388798, 389310, 389822, 390334, 390846, 391358, 391870, 392382, 392894, 393406, 393918, 394430, 394942, 395454, 399550, 400062, 402110, 402622, 403134, 403646, 404158, 404670, 407230, 407742, 408254, 408766, 409278, 409790, 410302, 410814, 411326, 411838, 412350, 412862, 413374, 416446, 417982, 418494, 419006, 423614, 424126, 424638, 425150, 425662, 426174, 426686, 427198, 428222, 436926, 437438, 439998, 443582, 444094, 444606, 446142, 446654, 447678, 483006, 486590, 487102, 487614, 495294, 495806, 302783, 303295, 304319, 304831, 305343, 305855, 309439, 311487, 311999, 312511, 313023, 315071, 316095, 316607, 317119, 317631, 318143, 318655, 319167, 319679, 320191, 320703, 321215, 321727, 322239, 322751, 323263, 323775, 324287, 324799, 325311, 325823, 326335, 326847, 327359, 327871, 328383, 328895, 329407, 329919, 330431, 330943, 331455, 331967, 332479, 332991, 333503, 334015, 334527, 335039, 335551, 336063, 336575, 337087, 337599, 338111, 338623, 339135, 339647, 340159, 340671, 341183, 341695, 342207, 386751, 387263, 387775, 388287, 388799, 389311, 389823, 390335, 390847, 391359, 391871, 392383, 392895, 393407, 393919, 394431, 394943, 399039, 399551, 400063, 402111, 402623, 403135, 403647, 404159, 404671, 405183, 405695, 407231, 407743, 408255, 408767, 409279, 409791, 410303, 410815, 411327, 411839, 412351, 412863, 413375, 413887, 414399, 415423, 415935, 416959, 417983, 418495, 419007, 419519, 420031, 420543, 422079, 423615, 424127, 424639, 425151, 425663, 426175, 426687, 427199, 428223, 428735, 436927, 437439, 437951, 442559, 443071, 443583, 444095, 445119, 445631, 446143, 448191, 466111, 481983, 487103, 495295, 302784, 303296, 303808, 304320, 305344, 308928, 310976, 311488, 312000, 315072, 316608, 317632, 318144, 318656, 319168, 319680, 320704, 321216, 321728, 322240, 322752, 323264, 324288, 324800, 325312, 325824, 326336, 326848, 327360, 327872, 328384, 328896, 329408, 329920, 330432, 330944, 331456, 331968, 332480, 332992, 333504, 334016, 334528, 335040, 335552, 336064, 336576, 337088, 337600, 338112, 338624, 339136, 339648, 340160, 340672, 386752, 387264, 387776, 388288, 388800, 389312, 389824, 390336, 390848, 391360, 391872, 392384, 392896, 393408, 393920, 399040, 399552, 400064, 403136, 403648, 404160, 404672, 405184, 405696, 406208, 407232, 407744, 408256, 408768, 409280, 409792, 410304, 410816, 411328, 411840, 412352, 412864, 413376, 413888, 414400, 414912, 415424, 415936, 416448, 416960, 417472, 417984, 418496, 419008, 419520, 420032, 420544, 421056, 421568, 422592, 423104, 423616, 424128, 424640, 425152, 425664, 426176, 426688, 427200, 427712, 428224, 428736, 429248, 429760, 441024, 441536, 443072, 443584, 444096, 444608, 445120, 445632, 446144, 484032, 487104, 495808, 302785, 303809, 304321, 304833, 305345, 311489, 312001, 312513, 313025, 314561, 315585, 316609, 317121, 317633, 318145, 319169, 320193, 320705, 321217, 321729, 322241, 322753, 323265, 323777, 324289, 324801, 325313, 325825, 326337, 326849, 327361, 327873, 328385, 328897, 329409, 329921, 330433, 330945, 331457, 331969, 332481, 332993, 333505, 334017, 334529, 335041, 335553, 336065, 336577, 337089, 337601, 338113, 338625, 339137, 386753, 387265, 387777, 388289, 388801, 389313, 389825, 390337, 390849, 391361, 391873, 392385, 392897, 393409, 395969, 399553, 400065, 404161, 404673, 405185, 405697, 406209, 406721, 407233, 407745, 408257, 408769, 409281, 409793, 410305, 410817, 411329, 411841, 412353, 412865, 413377, 413889, 414401, 414913, 415425, 415937, 416449, 416961, 417473, 417985, 418497, 419009, 419521, 420033, 420545, 421057, 421569, 422081, 422593, 423105, 423617, 424129, 424641, 425153, 425665, 426177, 426689, 427201, 427713, 428225, 428737, 429249, 429761, 440001, 440513, 441025, 441537, 442561, 443073, 443585, 444097, 444609, 445121, 445633, 446657, 470721, 484033, 486081, 495297, 302786, 303298, 303810, 304322, 304834, 305346, 305858, 311490, 312002, 312514, 314562, 315074, 315586, 316098, 316610, 317122, 317634, 318146, 318658, 319170, 320706, 321730, 322242, 322754, 323778, 324290, 324802, 325314, 325826, 326338, 326850, 327362, 327874, 328386, 328898, 329410, 329922, 330434, 330946, 331458, 331970, 332482, 332994, 333506, 334018, 334530, 335042, 335554, 336066, 336578, 337090, 337602, 338114, 338626, 339138, 370370, 386242, 386754, 387266, 387778, 388290, 388802, 389314, 389826, 390338, 390850, 391362, 391874, 392386, 392898, 394946, 395458, 396482, 399042, 399554, 400066, 404674, 405186, 405698, 406722, 407234, 407746, 408258, 408770, 409282, 409794, 411330, 411842, 412866, 413378, 413890, 414402, 414914, 415426, 415938, 416450, 416962, 417474, 417986, 418498, 419010, 419522, 420034, 420546, 421058, 421570, 422082, 422594, 423106, 423618, 424130, 424642, 425154, 425666, 426178, 426690, 427202, 428226, 428738, 429250, 432834, 440002, 440514, 441538, 442050, 442562, 448706, 470722, 471234, 477890, 484546, 485058, 486082, 495298, 495810, 302787, 303299, 303811, 304323, 304835, 305347, 305859, 309443, 311491, 312003, 312515, 315075, 315587, 316099, 316611, 317123, 317635, 318147, 318659, 319171, 320195, 320707, 322243, 322755, 323267, 323779, 324291, 324803, 325315, 325827, 326339, 326851, 327363, 327875, 328387, 328899, 329411, 329923, 330435, 330947, 331459, 331971, 332483, 332995, 333507, 334019, 334531, 335043, 335555, 336067, 336579, 337091, 337603, 338115, 338627, 372931, 386243, 386755, 387267, 387779, 388291, 388803, 389315, 389827, 390339, 390851, 391363, 391875, 392387, 392899, 393411, 393923, 394435, 395459, 399043, 399555, 400067, 404675, 405187, 405699, 407747, 408259, 408771, 409283, 409795, 410307, 412355, 412867, 413379, 413891, 414403, 414915, 415427, 415939, 416451, 416963, 417475, 417987, 418499, 419011, 419523, 420035, 420547, 421059, 421571, 422083, 422595, 423107, 423619, 424131, 424643, 425667, 426179, 426691, 427203, 428227, 428739, 429251, 438979, 439491, 440515, 441027, 441539, 481475, 481987, 484547, 485059, 485571, 486083, 495299, 495811, 496323, 303300, 303812, 304324, 304836, 305348, 305860, 312004, 312516, 313540, 314564, 316100, 316612, 317124, 318148, 320708, 322244, 323780, 324292, 324804, 325316, 325828, 326340, 326852, 327364, 327876, 328388, 328900, 329412, 329924, 330436, 330948, 331460, 331972, 332484, 332996, 333508, 334020, 334532, 335044, 335556, 336068, 336580, 337092, 337604, 338116, 338628, 372420, 372932, 373444, 386244, 386756, 387268, 387780, 388292, 388804, 389316, 389828, 390340, 390852, 391364, 391876, 392388, 392900, 393412, 394436, 403652, 404164, 404676, 405188, 408260, 408772, 409284, 409796, 410308, 410820, 412356, 412868, 413380, 413892, 414404, 414916, 415428, 415940, 416452, 416964, 417476, 417988, 418500, 419012, 419524, 420036, 420548, 421060, 421572, 422084, 422596, 423108, 423620, 424132, 424644, 425156, 427204, 427716, 428740, 441028, 441540, 442564, 443076, 443588, 449220, 485060, 485572, 486084, 486596, 495300, 495812, 496324, 303813, 304325, 304837, 305349, 305861, 309957, 310981, 311493, 312005, 314053, 316101, 317125, 317637, 318661, 319173, 319685, 320197, 320709, 321221, 321733, 322245, 322757, 323781, 324293, 325829, 326341, 326853, 327365, 327877, 328389, 328901, 329413, 329925, 330437, 330949, 331461, 331973, 332485, 332997, 333509, 334021, 334533, 335045, 335557, 336069, 336581, 337093, 337605, 338117, 374469, 374981, 386757, 387269, 387781, 388293, 388805, 389317, 389829, 390341, 390853, 391365, 391877, 392389, 392901, 402117, 402629, 403141, 403653, 404165, 404677, 405189, 408261, 408773, 409285, 409797, 410309, 410821, 411333, 412357, 412869, 413381, 413893, 414405, 414917, 415429, 415941, 416453, 416965, 417477, 417989, 418501, 419013, 419525, 420037, 420549, 421061, 421573, 422085, 422597, 423109, 423621, 425157, 425669, 426693, 428229, 435397, 435909, 484037, 485061, 485573, 486085, 494789, 495301, 495813, 303814, 304326, 305350, 305862, 306374, 306886, 310470, 310982, 311494, 313542, 314566, 315078, 315590, 316102, 316614, 317126, 322246, 322758, 323782, 324294, 324806, 325318, 325830, 326342, 327366, 327878, 328902, 329414, 330950, 331462, 331974, 332486, 333510, 334022, 334534, 335046, 335558, 336070, 336582, 337094, 337606, 374470, 386758, 387270, 387782, 388294, 388806, 389318, 389830, 390342, 390854, 391366, 391878, 392390, 400070, 400582, 402118, 402630, 403142, 403654, 404166, 408262, 408774, 409286, 409798, 410310, 411334, 411846, 412870, 413382, 413894, 414406, 414918, 415430, 415942, 416454, 416966, 417478, 417990, 418502, 419014, 419526, 420038, 420550, 421062, 421574, 422086, 422598, 423110, 423622, 424134, 425670, 427206, 429254, 429766, 433350, 434886, 435398, 436422, 437958, 442054, 445126, 485574, 494278, 494790, 495302, 495814, 304327, 304839, 305351, 305863, 306887, 307399, 307911, 309959, 310471, 310983, 312007, 314055, 314567, 316103, 317127, 317639, 318151, 318663, 319175, 319687, 320199, 320711, 321223, 321735, 322247, 322759, 323271, 323783, 324295, 324807, 325319, 326343, 326855, 327879, 328391, 328903, 329415, 329927, 330439, 330951, 331463, 331975, 332999, 333511, 334023, 334535, 335047, 335559, 336071, 336583, 337095, 337607, 386759, 387271, 387783, 388807, 389319, 389831, 390343, 390855, 391367, 391879, 394951, 395463, 395975, 396487, 396999, 397511, 398023, 398535, 399047, 399559, 400071, 400583, 401095, 401607, 402119, 403143, 403655, 404167, 408775, 409287, 409799, 410823, 411335, 411847, 412871, 413383, 413895, 414919, 415431, 415943, 416455, 416967, 417479, 418503, 419015, 419527, 420039, 420551, 421063, 421575, 422087, 422599, 423111, 423623, 424647, 428231, 429767, 430279, 432839, 433351, 434375, 434887, 436423, 436935, 442055, 485575, 492743, 493255, 493767, 494279, 494791, 495303, 495815, 304328, 304840, 305352, 305864, 306376, 306888, 307400, 307912, 309448, 311496, 314568, 315592, 316616, 317128, 318152, 318664, 319176, 319688, 320200, 320712, 321224, 321736, 322248, 322760, 323272, 323784, 324296, 324808, 326344, 326856, 327368, 327880, 328392, 328904, 329416, 329928, 330440, 330952, 331976, 332488, 333000, 333512, 334024, 334536, 335048, 335560, 336072, 336584, 337608, 388808, 389320, 389832, 393928, 394440, 394952, 395464, 395976, 396488, 397000, 397512, 398024, 398536, 399048, 399560, 400072, 400584, 401096, 403656, 409288, 409800, 413384, 413896, 414920, 415432, 416456, 417480, 419528, 420040, 420552, 422600, 424648, 425160, 428744, 429256, 431304, 431816, 432840, 433352, 435400, 435912, 436424, 436936, 437448, 450760, 462024, 485576, 486088, 492232, 492744, 494280, 494792, 495304, 304841, 305353, 306377, 306889, 307401, 307913, 308425, 309449, 312521, 314057, 315593, 316105, 318153, 318665, 319177, 319689, 320201, 320713, 321225, 321737, 322249, 322761, 323273, 323785, 324297, 326345, 326857, 327369, 327881, 328393, 328905, 329417, 329929, 330441, 330953, 331465, 331977, 332489, 333001, 333513, 334025, 334537, 335561, 336073, 336585, 337097, 337609, 338121, 388809, 389321, 390857, 392393, 392905, 393417, 393929, 394441, 394953, 395465, 395977, 396489, 397001, 397513, 398025, 398537, 399561, 400073, 400585, 401097, 402633, 403657, 410313, 410825, 412873, 413385, 417993, 419017, 420041, 421577, 426185, 426697, 427721, 430281, 430793, 431305, 431817, 435401, 436425, 436937, 485577, 486601, 493769, 494281, 494793, 495305, 495817, 305354, 305866, 306378, 306890, 307402, 309962, 310986, 311498, 312010, 312522, 313546, 314058, 314570, 315082, 315594, 316106, 316618, 317130, 318154, 319178, 319690, 320714, 321226, 321738, 322250, 322762, 323274, 323786, 324298, 325834, 326346, 327370, 327882, 328394, 328906, 329418, 329930, 330442, 330954, 331978, 333002, 333514, 334026, 334538, 335050, 335562, 336074, 336586, 337098, 388810, 390346, 390858, 391370, 391882, 392394, 392906, 393418, 393930, 394442, 394954, 395466, 396490, 397002, 398026, 398538, 399050, 399562, 400074, 400586, 401098, 410314, 410826, 411338, 411850, 412362, 416970, 417482, 417994, 420042, 422602, 424650, 426698, 427722, 428234, 428746, 431306, 435402, 435914, 436426, 437450, 479434, 486090, 487114, 491210, 491722, 492234, 492746, 493258, 493770, 494282, 494794, 495306, 305355, 305867, 306379, 306891, 307915, 309451, 311499, 315595, 317131, 318667, 319691, 320203, 320715, 321227, 321739, 322251, 322763, 323275, 323787, 324299, 324811, 325323, 325835, 326347, 327883, 328395, 329419, 329931, 330443, 330955, 331467, 331979, 332491, 333003, 333515, 335051, 335563, 336075, 337611, 389323, 389835, 390347, 390859, 391371, 391883, 392395, 392907, 394443, 394955, 395467, 397003, 397515, 399051, 399563, 400075, 400587, 401099, 416971, 417483, 419019, 419531, 420043, 421067, 423115, 425675, 426187, 427211, 428235, 428747, 430283, 435403, 435915, 436427, 437451, 443595, 444107, 444619, 445643, 446667, 472267, 486091, 489163, 489675, 490187, 490699, 491211, 491723, 492235, 492747, 493259, 493771, 306380, 306892, 307404, 307916, 308428, 310988, 313036, 313548, 314060, 314572, 315084, 317644, 318668, 319180, 319692, 320716, 321228, 321740, 322252, 322764, 323276, 323788, 324300, 325836, 326860, 327372, 328396, 328908, 329420, 329932, 330444, 330956, 331468, 331980, 332492, 333004, 333516, 334028, 334540, 335052, 335564, 336076, 388300, 388812, 389324, 389836, 390348, 390860, 391884, 393420, 395468, 399052, 399564, 400076, 400588, 401100, 419020, 419532, 420044, 425676, 427212, 429260, 430284, 432844, 433356, 434892, 435404, 435916, 444620, 445132, 445644, 446156, 449740, 472268, 472780, 479948, 488140, 488652, 489164, 489676, 490700, 491212, 491724, 306893, 307405, 307917, 308429, 309965, 310989, 311501, 312013, 312525, 314061, 314573, 315085, 316109, 318157, 318669, 319181, 319693, 320205, 320717, 321229, 321741, 322253, 322765, 323277, 323789, 324301, 324813, 325325, 325837, 326349, 327373, 328397, 329421, 329933, 330445, 330957, 331469, 331981, 332493, 333517, 334541, 335053, 335565, 386765, 387277, 387789, 389325, 389837, 392909, 393933, 395981, 398029, 399565, 400589, 401101, 419021, 419533, 425165, 425677, 429773, 435917, 436429, 445645, 446157, 479949, 488141, 489165, 490189, 492237, 307918, 308430, 308942, 309454, 309966, 313038, 313550, 314574, 315086, 316110, 318158, 318670, 319182, 319694, 320206, 320718, 321230, 321742, 322254, 322766, 323278, 323790, 324302, 324814, 325326, 325838, 326350, 327886, 328398, 328910, 329934, 330446, 330958, 331470, 332494, 333518, 335054, 380622, 381134, 387790, 388302, 388814, 389326, 389838, 392398, 392910, 393422, 395470, 395982, 396494, 400590, 402126, 402638, 403662, 409294, 418510, 419022, 419534, 420046, 430798, 431310, 436430, 436942, 444622, 445134, 467662, 475854, 478926, 479950, 480462, 487630, 488142, 488654, 490190, 307919, 309455, 310991, 313039, 313551, 315599, 317135, 318159, 318671, 319183, 319695, 320207, 320719, 321231, 321743, 322255, 322767, 323279, 323791, 324303, 324815, 326351, 326863, 327375, 330447, 330959, 331471, 331983, 333007, 334031, 334543, 345807, 346319, 386255, 386767, 387791, 388303, 389839, 392399, 395983, 397007, 400591, 402639, 404175, 407759, 410319, 410831, 418511, 419023, 419535, 420047, 429263, 430287, 430799, 445647, 446159, 447183, 448207, 448719, 451279, 476367, 477391, 479439, 479951, 480463, 480975, 488655, 308432, 309968, 310992, 312528, 313040, 313552, 314576, 315600, 318672, 319696, 320208, 320720, 321232, 321744, 322256, 322768, 323280, 323792, 324304, 324816, 325328, 325840, 327888, 328400, 328912, 329424, 329936, 331472, 331984, 333008, 386256, 387280, 391376, 397008, 416464, 418000, 418512, 419024, 419536, 428240, 429264, 430800, 432848, 441040, 444624, 446160, 446672, 447184, 447696, 459984, 467664, 478416, 479440, 480464, 480976, 481488, 488144, 488656, 309457, 310481, 313041, 313553, 314577, 316625, 319697, 320721, 321233, 321745, 322257, 322769, 323281, 323793, 324305, 324817, 325329, 325841, 326353, 326865, 327377, 327889, 328401, 328913, 329425, 329937, 330449, 330961, 331473, 331985, 332497, 334033, 387793, 388305, 389329, 389841, 407761, 414417, 414929, 415441, 415953, 416465, 418001, 418513, 419025, 428753, 429265, 431313, 433361, 434385, 437969, 444625, 446673, 447697, 448209, 480977, 481489, 482001, 308946, 311506, 313042, 314578, 315602, 317650, 320210, 321234, 321746, 322258, 322770, 323282, 323794, 324306, 324818, 326354, 326866, 327378, 327890, 328402, 328914, 329426, 329938, 330450, 331474, 331986, 332498, 333010, 333522, 334034, 395474, 407762, 415442, 415954, 416466, 418514, 428242, 428754, 430290, 430802, 434386, 434898, 442066, 444626, 445138, 445650, 448210, 449234, 476370, 480466, 312531, 313043, 313555, 315091, 320211, 320723, 321235, 321747, 322259, 322771, 323283, 323795, 324307, 324819, 325843, 326355, 326867, 327379, 327891, 331475, 332499, 333011, 333523, 334035, 386259, 386771, 388307, 415955, 416979, 418515, 430803, 431315, 431827, 434387, 444627, 447187, 448211, 449235, 481491, 482003, 312532, 313044, 313556, 314580, 319700, 320724, 321236, 321748, 322260, 322772, 323284, 323796, 332500, 333012, 333524, 334036, 383188, 385748, 386772, 387284, 411860, 415444, 415956, 419028, 428244, 434388, 437460, 444628, 449236, 479956, 480980, 482004, 311509, 312021, 312533, 313045, 313557, 315605, 316117, 319701, 320213, 321237, 321749, 322261, 322773, 323285, 333013, 333525, 334037, 334549, 380117, 381141, 381653, 382677, 383189, 386261, 393429, 418005, 426709, 432341, 434389, 435413, 449237, 457429, 309462, 312534, 313558, 319190, 319702, 321750, 322262, 333014, 333526, 334038, 334550, 380118, 380630, 381142, 381654, 382166, 382678, 415446, 433878, 434902, 437974, 443094, 455382, 481494, 312535, 313047, 313559, 314071, 316631, 320727, 333015, 334551, 383703, 394967, 415959, 418007, 437463, 455383, 463063, 478423, 313048, 313560, 314072, 316120, 316632, 319192, 320728, 321752, 322264, 333016, 333528, 334552, 335064, 336088, 337112, 384728, 393944, 399576, 402648, 416472, 429784, 433368, 452312, 486104, 486616, 312025, 313561, 316121, 316633, 317657, 319705, 320217, 320729, 321241, 321753, 322265, 334553, 335065, 425177, 429785, 430297, 436953, 462041, 467161, 479961, 480473, 485593, 486105, 486617, 314074, 314586, 316122, 317146, 317658, 318170, 319706, 320218, 320730, 321754, 334554, 416986, 426202, 429274, 430810, 433370, 433882, 443098, 444122, 444634, 452826, 459994, 481498, 482010, 311515, 314587, 315099, 315611, 316635, 317147, 318171, 320731, 321243, 321755, 333531, 336603, 337115, 427227, 442075, 467163, 468187, 480987, 481499, 482011, 313052, 317148, 317660, 416988, 421084, 422108, 431324, 431836, 432860, 433884, 434396, 434908, 457948, 458460, 478428, 479452, 480988, 481500, 482012, 482524, 483548, 313053, 315613, 317149, 317661, 318173, 319709, 321245, 381661, 421597, 434397, 435421, 435933, 444125, 457437, 458973, 459485, 464605, 479965, 480477, 480989, 481501, 313054, 315614, 318174, 318686, 320734, 321246, 321758, 331998, 332510, 333022, 333534, 334046, 334558, 397022, 446174, 448222, 457438, 458974, 463582, 464094, 475358, 475870, 480478, 480990, 481502, 276703, 317151, 318687, 319711, 320223, 321247, 321759, 331999, 332511, 334047, 334559, 335071, 335583, 336095, 382687, 421599, 436447, 456927, 457439, 475871, 476383, 480991, 277216, 278240, 316640, 318176, 318688, 319712, 320224, 322272, 328928, 333024, 335072, 335584, 336096, 336608, 341216, 421600, 422112, 422624, 480992, 278753, 279265, 279777, 316641, 317153, 317665, 318177, 318689, 319201, 319713, 320225, 321249, 321761, 327393, 327905, 328417, 328929, 329441, 336097, 336609, 337121, 337633, 338145, 338657, 380641, 422625, 444641, 446177, 450785, 462049, 470241, 470753, 279778, 316642, 317666, 318178, 318690, 319202, 319714, 320226, 320738, 321250, 322274, 327394, 327906, 328418, 328930, 329442, 329954, 336610, 337122, 337634, 338146, 338658, 339170, 383714, 384226, 415458, 435938, 482018, 280291, 317155, 317667, 318179, 318691, 319203, 319715, 320227, 320739, 321251, 321763, 322275, 322787, 327395, 328419, 334051, 337123, 338147, 340195, 340707, 341219, 341731, 342243, 342755, 446691, 448227, 455907, 465635, 468195, 316644, 317156, 317668, 318692, 319204, 320740, 321252, 321764, 322276, 322788, 323300, 326372, 334052, 340196, 340708, 341220, 341732, 342244, 342756, 446180, 465124, 465636, 309477, 318693, 320229, 320741, 321253, 321765, 322277, 322789, 323301, 323813, 324325, 324837, 325349, 326373, 326885, 328933, 336613, 337125, 337637, 339173, 339685, 340197, 340709, 341221, 341733, 342245, 342757, 344293, 344805, 345317, 345829, 347365, 381669, 393957, 394469, 447205, 468197, 480997, 481509, 482021, 318694, 321766, 322278, 323302, 323814, 324326, 325350, 326374, 328934, 337126, 341222, 344806, 345830, 347366, 450278, 452326, 453862, 468710, 480998, 481510, 482022, 320231, 321767, 322791, 323815, 324327, 325351, 325863, 327399, 327911, 328423, 328935, 347367, 347879, 348391, 375015, 375527, 376551, 382183, 390887, 432871, 449255, 451303, 451815, 463079, 469223, 480999, 481511, 482023, 482535, 323816, 324840, 325352, 325864, 328424, 328936, 348392, 348904, 375528, 376552, 381160, 381672, 382184, 382696, 383208, 425192, 446696, 464104, 467688, 471272, 471784, 480488, 481000, 481512, 482024, 322281, 322793, 323305, 325865, 326889, 327401, 328937, 329449, 329961, 330473, 348393, 381161, 381673, 382185, 383209, 383721, 417001, 419561, 421609, 425193, 446697, 447209, 451817, 472297, 480489, 481001, 481513, 499433, 325866, 326378, 326890, 327402, 327914, 328426, 328938, 329450, 329962, 348394, 348906, 375530, 376042, 376554, 380650, 381162, 381674, 382186, 386794, 421610, 424682, 480490, 481002, 481514, 482026, 499434, 326379, 326891, 327403, 327915, 328427, 329451, 329963, 332523, 348907, 380651, 381163, 381675, 384747, 393963, 397547, 417003, 422123, 425707, 428779, 447723, 448235, 449771, 465643, 466667, 467179, 471787, 472299, 472811, 481003, 481515, 482027, 482539, 327916, 328428, 328940, 329452, 329964, 330476, 332012, 348908, 349932, 381164, 381676, 382700, 383212, 388844, 394476, 394988, 396012, 398572, 409324, 425196, 448236, 449260, 449772, 451820, 466156, 466668, 467180, 472812, 480492, 481004, 481516, 482028, 482540, 483052, 483564, 498412, 329965, 330477, 330989, 332013, 332525, 349933, 381165, 381677, 387309, 388333, 392429, 398573, 425709, 426221, 447725, 448749, 449773, 450285, 451309, 451821, 466157, 466669, 467181, 467693, 471789, 472813, 481005, 481517, 482029, 483053, 483565, 484077, 329966, 330478, 330990, 332014, 332526, 342254, 342766, 343278, 348398, 381678, 387310, 391918, 392942, 395502, 399598, 404206, 421614, 447726, 448238, 449262, 471790, 472814, 480494, 481006, 481518, 482030, 483054, 483566, 484078, 484590, 330479, 330991, 339183, 339695, 340207, 340719, 342255, 342767, 348911, 381679, 392431, 392943, 400623, 420079, 423663, 424175, 424687, 448751, 449263, 449775, 450287, 451311, 465647, 469743, 471279, 471791, 472303, 482031, 482543, 483055, 483567, 484079, 484591, 330992, 331504, 338160, 338672, 339184, 339696, 340208, 341232, 344304, 344816, 346352, 346864, 347376, 348400, 348912, 384240, 386800, 390896, 398576, 424176, 448752, 449264, 450288, 469744, 470768, 471280, 471792, 480496, 482032, 482544, 483056, 483568, 484080, 484592, 330481, 330993, 331505, 332017, 332529, 338161, 338673, 339185, 339697, 340209, 342257, 342769, 343281, 343793, 344305, 344817, 345841, 346353, 346865, 347377, 348401, 348913, 393969, 403697, 426225, 448753, 449265, 451825, 469745, 470257, 470769, 471281, 479985, 482033, 482545, 483057, 483569, 484081, 484593, 330994, 331506, 332018, 332530, 333042, 333554, 335602, 337650, 338162, 338674, 339186, 339698, 341746, 343282, 345330, 345842, 346354, 347378, 383730, 385778, 393970, 403186, 406770, 416498, 423666, 425202, 448754, 449266, 451314, 465650, 470258, 479474, 481522, 482546, 483058, 483570, 484082, 484594, 485106, 332531, 333043, 334579, 335091, 335603, 338163, 338675, 339187, 339699, 340211, 340723, 341235, 341747, 342259, 343283, 344307, 346355, 347379, 383731, 384243, 385267, 385779, 421619, 449267, 451827, 452339, 470771, 478963, 482547, 484083, 484595, 333044, 334068, 334580, 335092, 337652, 338164, 338676, 339188, 339700, 340212, 340724, 341748, 344308, 346868, 347380, 347892, 383732, 386804, 449268, 449780, 451828, 452340, 452852, 464628, 465140, 482548, 483060, 483572, 484084, 484596, 485108, 338165, 338677, 339701, 340213, 340725, 341237, 341749, 342773, 386805, 393973, 413429, 451317, 451829, 452853, 482037, 482549, 483061, 483573, 484085, 484597, 485109, 490741, 338166, 339702, 340214, 340726, 350966, 385270, 385782, 389366, 390902, 392438, 393462, 394486, 394998, 395510, 396022, 397558, 427766, 451318, 452342, 466166, 467190, 482038, 484086, 484598, 485110, 338167, 339703, 340215, 340727, 342263, 343799, 344311, 351479, 352503, 353015, 354039, 385271, 385783, 387319, 390903, 392951, 393975, 394487, 451319, 451831, 462583, 466167, 467191, 467703, 477943, 478967, 481527, 484087, 484599, 338168, 338680, 339192, 339704, 340728, 353016, 354040, 354552, 355064, 387320, 388344, 390392, 392952, 462584, 463096, 464120, 466168, 466680, 476920, 477944, 480504, 337657, 338169, 338681, 339193, 339705, 340217, 341241, 342265, 355065, 415993, 466681, 476409, 476921, 337658, 338682, 339194, 339706, 343802, 354554, 355578, 399610, 400122, 401658, 423674, 446714, 463098, 463610, 465146, 466682, 477946, 337659, 338171, 339707, 340731, 348923, 401659, 464635, 465147, 466683, 467195, 467707, 475387, 336636, 337148, 337660, 338172, 339708, 340220, 348924, 356092, 464636, 467708, 468220, 474876, 337149, 338173, 356093, 398589, 467709, 468221, 468733, 473341, 484093, 484605, 335102, 335614, 336638, 337150, 337662, 338174, 338686, 341246, 418046, 467710, 468734, 469246, 473342, 484094, 486142, 335103, 336127, 336639, 337151, 338175, 356095, 398079, 400127, 417023, 417535, 418047, 419071, 467199, 472831, 486143, 486655, 487167, 327424, 334592, 335104, 335616, 336128, 337152, 338688, 345856, 356096, 400640, 419072, 419584, 420096, 424192, 472832, 478464, 478976, 327425, 327937, 334081, 334593, 335105, 335617, 336129, 347393, 355073, 356609, 358145, 358657, 359169, 359681, 420097, 466177, 467713, 490753, 334594, 335106, 335618, 336130, 336642, 352514, 354050, 355074, 357634, 358146, 414466, 414978, 415490, 416002, 416514, 466690, 470274, 477954, 485122, 334083, 334595, 335107, 335619, 336131, 344835, 352003, 352515, 353539, 357123, 360707, 361219, 361731, 362243, 414979, 470275, 470787, 474371, 477443, 495363, 521987, 334596, 335108, 335620, 336132, 342788, 343812, 345860, 348932, 349444, 350468, 350980, 355076, 358660, 360196, 360708, 362756, 363268, 363780, 364804, 405764, 414468, 420100, 420612, 469252, 469764, 470788, 334085, 334597, 335109, 335621, 339717, 347397, 353029, 357125, 360197, 363269, 363781, 364293, 364805, 365317, 369413, 404229, 404741, 422149, 467717, 476933, 480517, 334086, 334598, 335110, 335622, 342278, 349958, 357638, 359174, 361222, 363782, 364806, 365830, 401670, 404230, 404742, 433414, 469254, 482566, 504070, 334087, 334599, 335111, 335623, 357639, 358663, 359175, 362247, 363783, 364807, 365319, 365831, 366343, 366855, 367367, 402183, 421639, 469767, 480007, 480519, 482055, 482567, 335112, 336136, 336648, 357128, 361224, 362248, 362760, 364808, 365320, 365832, 366344, 366856, 367368, 367880, 409352, 414472, 419080, 470792, 471304, 480520, 481032, 482568, 489736, 498952, 335113, 336137, 337161, 337673, 358665, 359177, 361225, 361737, 363785, 364297, 364809, 365321, 365833, 366345, 366857, 367369, 367881, 419593, 421641, 470793, 471305, 471817, 472329, 473353, 473865, 500489, 335114, 335626, 336138, 336650, 340234, 341258, 347402, 358154, 358666, 359690, 360202, 360714, 362762, 363274, 364298, 364810, 365322, 365834, 366346, 366858, 367370, 367882, 471818, 472842, 473354, 473866, 474378, 474890, 475402, 499978, 335627, 336139, 336651, 338699, 340235, 341771, 364299, 364811, 365323, 365835, 366347, 366859, 367883, 419083, 472843, 473355, 473867, 474379, 474891, 475403, 475915, 476427, 477451, 477963, 479499, 480011, 482571, 291084, 336140, 336652, 342796, 343308, 346892, 362252, 364812, 365324, 366348, 366860, 367372, 402700, 403212, 418572, 419084, 476940, 477452, 477964, 478476, 478988, 479500, 480012, 480524, 481548, 484108, 484620, 485132, 499980, 292109, 336141, 336653, 337677, 343821, 352013, 362765, 363277, 363789, 364813, 365325, 365837, 366349, 366861, 367373, 405261, 418573, 480013, 480525, 481037, 483597, 484109, 500493, 292110, 336654, 337166, 337678, 343822, 344334, 352526, 356110, 357646, 362254, 363790, 365326, 365838, 366350, 366862, 418574, 480526, 483086, 483598, 336655, 337167, 337679, 338191, 343311, 345359, 345871, 347919, 352527, 353039, 353551, 357647, 358159, 358671, 360207, 362255, 363279, 363791, 364815, 365327, 365839, 366351, 403215, 412943, 496911, 514319, 337168, 337680, 338192, 347920, 348432, 357648, 358672, 359184, 362768, 363280, 363792, 364304, 364816, 365840, 405264, 413456, 337169, 337681, 338193, 338705, 350993, 353041, 357649, 360209, 360721, 362769, 363793, 364817, 365329, 403217, 429329, 488721, 492817, 337682, 338194, 338706, 339218, 340242, 342802, 349458, 357138, 359186, 361234, 361746, 362258, 362770, 363282, 363794, 364306, 364818, 365330, 403218, 404754, 413970, 418066, 426258, 488722, 264979, 268051, 337683, 338195, 339219, 339731, 340243, 340755, 341267, 350483, 352019, 353043, 357139, 357651, 358163, 358675, 359187, 360723, 361235, 362771, 363283, 363795, 364307, 428307, 268052, 338196, 338708, 339220, 339732, 340244, 340756, 341268, 342292, 342804, 343828, 351508, 352020, 354068, 354580, 355092, 356628, 357140, 357652, 358164, 358676, 359188, 359700, 361236, 361748, 362260, 362772, 363284, 363796, 364308, 418068, 429844, 489748, 338709, 339221, 339733, 340757, 341781, 342805, 343317, 345877, 349461, 350485, 351509, 352021, 356117, 356629, 357141, 357653, 358165, 361237, 362261, 362773, 363285, 363797, 364309, 364821, 428309, 428821, 490261, 265494, 266518, 339734, 340246, 340758, 341270, 341782, 342294, 347414, 350486, 350998, 352022, 352534, 353046, 353558, 355606, 356118, 356630, 357142, 357654, 358166, 358678, 359190, 360726, 361750, 362262, 362774, 363286, 364310, 364822, 388886, 413974, 418582, 419094, 426774, 427286, 498966, 340759, 341271, 342807, 343319, 343831, 347927, 348951, 350487, 350999, 352023, 353047, 353559, 354071, 355607, 356119, 356631, 357143, 357655, 358167, 358679, 359191, 359703, 360727, 361239, 361751, 363287, 363799, 364311, 364823, 418583, 485143, 498967, 341784, 342296, 342808, 343320, 343832, 344344, 344856, 345368, 346392, 346904, 347416, 355096, 355608, 356120, 356632, 357144, 357656, 358168, 358680, 359192, 360216, 361240, 363288, 363800, 419096, 429336, 482584, 498968, 499480, 284441, 341273, 341785, 342297, 342809, 343321, 343833, 344345, 344857, 345369, 345881, 346393, 346905, 347417, 348953, 353561, 354585, 355097, 356121, 356633, 357145, 357657, 358169, 358681, 359705, 360729, 361241, 361753, 362265, 363801, 364313, 364825, 404761, 406809, 411929, 416025, 482073, 495897, 498969, 499481, 515865, 522521, 266522, 342298, 342810, 343322, 343834, 344346, 344858, 345370, 345882, 346394, 346906, 353562, 354074, 356122, 356634, 357146, 357658, 358170, 358682, 359194, 360218, 361242, 361754, 362266, 362778, 363290, 363802, 364314, 415002, 429338, 483610, 486170, 488218, 266523, 343323, 343835, 344347, 344859, 345371, 345883, 346395, 350491, 351003, 355611, 356123, 356635, 357147, 357659, 358171, 358683, 359195, 360219, 360731, 361243, 361755, 362779, 363291, 363803, 364315, 406299, 427803, 482075, 484635, 485147, 499995, 266012, 266524, 342300, 343324, 343836, 344348, 344860, 345372, 345884, 346396, 346908, 347420, 353564, 354076, 356124, 356636, 357660, 358172, 359196, 359708, 360220, 360732, 361244, 361756, 362268, 362780, 363292, 363804, 364316, 406300, 415004, 425756, 427292, 439580, 490780, 500508, 266013, 342301, 342813, 343325, 344349, 344861, 345373, 345885, 346397, 346909, 347421, 353053, 353565, 355613, 356125, 356637, 357149, 357661, 358173, 358685, 359197, 359709, 360221, 360733, 361245, 361757, 362269, 362781, 363293, 363805, 371997, 404765, 405277, 405789, 413981, 415005, 415517, 425757, 434973, 435485, 486173, 486685, 499485, 499997, 501021, 501533, 512797, 513309, 265502, 266014, 343326, 343838, 344350, 344862, 345374, 345886, 346398, 346910, 352030, 353054, 355614, 356126, 356638, 357150, 357662, 358174, 358686, 359198, 359710, 360222, 360734, 361246, 361758, 362270, 362782, 363294, 363806, 410910, 428318, 433438, 433950, 478494, 479518, 491806, 494878, 495390, 495902, 496414, 497438, 501534, 502046, 512798, 513310, 513822, 514846, 266015, 342815, 343839, 344351, 344863, 345375, 345887, 346399, 346911, 352543, 353055, 353567, 354591, 355103, 355615, 356127, 356639, 357151, 357663, 358175, 358687, 359199, 359711, 360223, 360735, 361247, 361759, 362271, 362783, 363295, 404255, 404767, 427295, 433439, 433951, 476959, 478495, 494879, 496927, 501023, 501535, 502047, 513311, 513823, 514335, 342304, 342816, 343328, 344864, 345376, 345888, 346400, 346912, 349472, 351008, 351520, 352032, 352544, 353056, 353568, 354080, 354592, 355104, 355616, 356128, 356640, 357152, 357664, 358176, 358688, 359200, 359712, 360224, 360736, 361248, 361760, 362272, 362784, 403744, 405792, 406816, 428320, 489248, 497440, 501024, 502048, 514336, 514848, 341793, 342817, 343841, 344865, 345377, 345889, 346401, 348449, 351521, 352033, 352545, 353057, 353569, 354081, 354593, 355105, 355617, 356129, 356641, 357153, 357665, 358177, 358689, 359201, 359713, 360225, 360737, 361249, 361761, 362273, 362785, 403745, 404769, 405793, 415009, 428321, 482593, 494881, 500513, 501025, 503073, 515361, 341794, 344866, 345378, 345890, 346402, 349474, 351522, 353058, 354082, 354594, 355106, 355618, 356130, 356642, 357154, 357666, 358178, 358690, 359202, 359714, 360226, 405794, 406818, 414498, 415010, 418594, 419106, 425250, 425762, 480546, 490786, 498466, 498978, 500002, 501026, 501538, 502050, 502562, 503074, 503586, 344867, 345379, 345891, 346403, 349475, 351523, 352035, 352547, 353059, 353571, 354083, 354595, 355107, 355619, 356131, 356643, 357155, 357667, 358179, 358691, 359203, 359715, 406307, 407331, 411939, 412451, 413987, 414499, 415011, 489763, 501027, 502563, 503075, 503587, 298276, 344356, 344868, 345380, 345892, 346404, 348964, 349476, 351524, 352036, 352548, 353060, 353572, 354084, 354596, 355108, 355620, 356132, 356644, 357156, 357668, 358180, 358692, 406308, 410404, 411940, 412452, 412964, 413988, 414500, 415012, 415524, 427300, 490788, 495396, 502564, 503076, 504100, 341797, 342309, 344357, 344869, 345381, 345893, 346405, 346917, 347429, 349989, 351013, 351525, 352037, 352549, 353061, 353573, 354085, 354597, 355109, 355621, 356133, 356645, 357157, 357669, 358181, 411941, 412453, 412965, 413477, 413989, 414501, 415525, 416037, 416549, 502565, 503077, 503589, 504101, 504613, 341798, 342310, 344358, 345382, 345894, 348454, 348966, 349478, 350502, 351014, 351526, 352038, 352550, 353062, 353574, 354086, 354598, 355110, 356646, 357158, 357670, 405286, 411430, 411942, 412454, 412966, 413478, 413990, 414502, 415014, 416038, 416550, 417062, 494886, 499494, 500006, 500518, 501542, 503590, 504102, 504614, 343847, 344359, 344871, 345383, 345895, 347431, 348967, 349479, 349991, 350503, 351015, 351527, 352039, 352551, 353063, 353575, 354087, 354599, 355111, 355623, 356135, 356647, 357159, 357671, 404263, 405287, 405799, 406311, 411431, 411943, 412455, 412967, 413479, 413991, 414503, 415015, 415527, 490279, 498471, 501031, 502567, 503079, 503591, 504103, 504615, 313640, 341800, 343848, 344360, 344872, 345384, 345896, 346408, 347944, 348456, 348968, 349480, 349992, 350504, 351016, 351528, 352040, 352552, 353064, 353576, 354088, 354600, 355112, 355624, 356136, 356648, 357160, 357672, 358184, 410408, 411944, 412456, 412968, 413480, 413992, 414504, 415016, 415528, 416040, 504104, 504616, 505128, 342313, 343849, 344361, 344873, 345385, 345897, 346409, 346921, 347433, 348457, 348969, 349993, 350505, 351017, 352553, 353065, 353577, 354089, 354601, 355113, 355625, 356137, 356649, 357161, 357673, 358185, 409897, 410409, 411433, 411945, 412457, 412969, 413481, 413993, 414505, 415017, 415529, 499497, 500521, 501545, 503593, 504105, 504617, 505129, 341290, 341802, 343850, 344362, 344874, 345386, 345898, 346410, 346922, 347434, 347946, 348458, 349994, 350506, 352554, 353066, 353578, 354090, 354602, 355114, 355626, 356138, 356650, 357162, 357674, 405802, 408362, 408874, 409386, 409898, 410410, 410922, 411434, 411946, 412458, 412970, 413482, 413994, 414506, 415018, 416042, 476970, 494378, 502570, 503082, 503594, 504106, 504618, 505130, 341291, 341803, 343339, 343851, 344363, 345387, 345899, 346923, 347947, 348459, 349483, 349995, 352043, 353579, 354091, 354603, 355115, 355627, 356139, 356651, 357163, 408875, 409387, 409899, 410411, 411435, 411947, 412459, 412971, 413483, 413995, 414507, 415019, 415531, 416043, 477995, 485675, 491307, 501547, 502571, 503083, 503595, 504107, 504619, 505131, 341292, 341804, 344364, 346412, 346924, 349484, 349996, 351020, 351532, 353580, 354092, 354604, 355116, 355628, 356140, 356652, 406316, 409900, 411436, 411948, 412460, 412972, 413484, 413996, 414508, 415020, 415532, 416044, 499500, 501036, 501548, 503084, 503596, 504620, 341293, 344365, 344877, 345389, 345901, 346413, 346925, 347949, 348461, 349485, 349997, 351021, 351533, 352045, 353069, 353581, 354093, 355117, 355629, 356141, 408365, 409389, 409901, 410413, 410925, 411437, 411949, 412461, 412973, 413485, 414509, 476973, 481581, 498989, 501549, 502573, 503085, 503597, 504109, 504621, 341294, 341806, 344366, 344878, 345390, 345902, 346414, 346926, 347438, 347950, 348462, 348974, 349486, 349998, 351022, 352558, 353070, 353582, 354094, 354606, 355118, 356142, 408366, 409390, 410414, 410926, 411438, 411950, 412462, 412974, 413486, 413998, 414510, 415534, 479534, 481582, 492846, 497454, 501550, 502062, 503086, 503598, 504622, 341295, 341807, 343343, 344879, 345903, 346415, 346927, 347439, 347951, 348463, 348975, 349487, 350511, 351023, 352559, 353071, 353583, 354607, 355119, 355631, 406831, 407343, 407855, 408879, 409391, 409903, 410927, 411439, 411951, 412463, 412975, 413999, 477487, 477999, 478511, 479535, 490287, 499503, 501039, 502063, 502575, 503599, 504111, 504623, 509231, 341296, 343856, 345392, 345904, 346416, 346928, 347440, 347952, 348464, 348976, 349488, 350512, 351024, 351536, 352048, 353072, 353584, 355120, 406832, 407344, 408368, 409904, 410416, 410928, 411952, 412464, 412976, 477488, 478000, 478512, 479024, 490800, 491312, 493360, 493872, 496432, 501552, 502064, 502576, 503088, 503600, 504112, 341297, 341809, 342321, 342833, 343345, 344881, 345393, 345905, 346417, 346929, 347441, 347953, 348465, 348977, 349489, 350513, 351025, 352049, 352561, 353073, 354097, 354609, 406321, 406833, 407345, 408881, 409393, 409905, 410929, 411441, 411953, 412465, 412977, 413489, 477489, 478001, 478513, 479537, 490801, 491313, 491825, 493361, 493873, 494385, 498481, 500529, 501041, 501553, 502065, 502577, 503601, 504113, 341298, 341810, 343346, 343858, 344882, 345394, 345906, 346418, 346930, 347442, 347954, 348466, 348978, 349490, 351026, 351538, 352050, 352562, 353074, 353586, 354098, 406322, 406834, 407346, 407858, 408370, 408882, 409394, 409906, 410418, 410930, 411954, 412466, 477490, 478002, 479026, 491826, 492338, 492850, 493874, 494386, 498994, 500018, 500530, 501042, 501554, 502066, 502578, 503090, 503602, 340787, 341299, 341811, 342835, 344883, 346419, 346931, 347443, 347955, 348467, 348979, 349491, 350003, 350515, 351027, 351539, 352563, 353587, 354099, 406835, 407347, 407859, 408371, 408883, 409395, 409907, 410419, 411443, 411955, 476979, 477491, 478003, 482099, 492339, 492851, 493363, 493875, 494387, 494899, 495411, 495923, 496435, 496947, 499507, 500019, 500531, 501043, 501555, 502579, 503091, 503603, 340788, 341300, 341812, 343348, 343860, 345396, 346420, 346932, 347444, 347956, 348468, 348980, 349492, 350004, 350516, 351028, 351540, 352052, 352564, 353076, 353588, 407348, 479028, 491828, 492340, 493364, 493876, 494388, 494900, 495412, 496948, 497460, 497972, 498996, 499508, 500020, 500532, 501044, 501556, 502068, 502580, 503092, 519476, 340789, 341301, 343861, 345397, 345909, 346421, 346933, 347445, 347957, 348469, 348981, 349493, 350005, 350517, 351029, 351541, 352565, 353077, 479029, 493365, 493877, 494389, 494901, 495413, 495925, 496437, 496949, 497461, 497973, 499509, 500021, 500533, 501045, 501557, 502069, 502581, 503093, 519477, 519989, 340790, 341302, 342838, 345910, 346422, 346934, 347446, 347958, 348470, 348982, 350006, 351030, 493366, 493878, 494390, 496438, 496950, 497462, 497974, 498486, 498998, 499510, 500022, 500534, 501046, 502070, 502582, 519478, 519990, 340279, 340791, 341303, 345399, 346423, 346935, 347447, 347959, 348471, 348983, 349495, 350007, 351031, 352055, 495415, 495927, 496439, 496951, 497463, 497975, 498487, 498999, 499511, 500023, 500535, 501047, 502071, 502583, 519991, 520503, 339768, 340280, 340792, 341304, 346424, 346936, 347448, 347960, 348472, 349496, 350520, 351032, 351544, 352056, 384312, 495416, 495928, 496440, 496952, 497464, 497976, 498488, 499000, 499512, 500536, 501560, 502072, 502584, 520504, 521016, 521528, 339769, 340281, 340793, 341305, 341817, 342329, 342841, 346937, 347449, 347961, 348473, 348985, 349497, 350009, 351545, 495417, 495929, 496441, 496953, 497465, 497977, 498489, 499001, 499513, 500537, 501049, 501561, 502073, 520505, 521017, 521529, 339770, 340282, 340794, 343866, 346938, 347450, 347962, 348474, 350522, 351034, 351546, 495930, 496442, 496954, 497466, 497978, 498490, 499002, 499514, 500026, 500538, 501050, 501562, 520506, 521018, 521530, 522042, 522554, 523066, 339771, 340283, 340795, 341307, 343867, 347963, 348475, 348987, 349499, 350523, 496443, 496955, 497467, 497979, 498491, 499003, 499515, 500027, 520507, 521019, 521531, 523067, 339772, 340284, 340796, 341308, 342332, 342844, 343356, 343868, 344380, 345404, 347452, 347964, 499516, 519996, 520508, 521020, 521532, 522556, 339773, 340285, 340797, 342333, 342845, 343357, 345405, 347453, 519997, 520509, 521021, 521533, 522045, 339774, 340286, 340798, 341310, 347454, 497982, 501054, 520510, 521022, 521534, 522046, 339775, 340287, 341311, 343871, 345919, 347455, 498495, 499007, 501055, 518975, 520511, 521023, 339776, 340288, 341312, 341824, 342848, 343360, 499520, 500032, 500544, 501056, 519488, 520000, 520512, 521024, 339265, 339777, 340289, 341313, 345409, 499009, 500033, 500545, 501057, 517953, 518465, 518977, 520001, 339778, 340290, 341314, 343362, 344386, 499010, 500546, 501058, 517954, 518978, 339267, 339779, 340291, 341315, 345923, 500035, 500547, 501059, 517955, 518979, 519491, 339780, 340804, 341316, 341828, 345412, 345924, 500548, 501060, 518468, 518980, 265029, 339781, 341829, 517957, 518469, 518981, 341318, 517958, 345415, 515911, 516423, 516935, 517447, 517959, 340296, 340808, 341320, 515912, 516424, 516936, 517448, 517960, 340809, 341321, 342345, 343881, 344393, 515401, 515913, 516425, 516937, 517449, 340298, 340810, 341322, 342858, 343882, 515402, 515914, 516426, 516938, 340299, 343883, 344395, 515915, 340300, 344396, 345421, 342351, 343888, 341329, 342866, 343378, 340821, 340310, 342870, 350550, 351062, 341849, 342874, 343899, 366940, 343389, 343901];
},{}],"node_modules/bloomfilter/bloomfilter.js":[function(require,module,exports) {
(function(exports) {
  exports.BloomFilter = BloomFilter;
  exports.fnv_1a = fnv_1a;

  var typedArrays = typeof ArrayBuffer !== "undefined";

  // Creates a new bloom filter.  If *m* is an array-like object, with a length
  // property, then the bloom filter is loaded with data from the array, where
  // each element is a 32-bit integer.  Otherwise, *m* should specify the
  // number of bits.  Note that *m* is rounded up to the nearest multiple of
  // 32.  *k* specifies the number of hashing functions.
  function BloomFilter(m, k) {
    var a;
    if (typeof m !== "number") a = m, m = a.length * 32;

    var n = Math.ceil(m / 32),
        i = -1;
    this.m = m = n * 32;
    this.k = k;

    if (typedArrays) {
      var kbytes = 1 << Math.ceil(Math.log(Math.ceil(Math.log(m) / Math.LN2 / 8)) / Math.LN2),
          array = kbytes === 1 ? Uint8Array : kbytes === 2 ? Uint16Array : Uint32Array,
          kbuffer = new ArrayBuffer(kbytes * k),
          buckets = this.buckets = new Int32Array(n);
      if (a) while (++i < n) buckets[i] = a[i];
      this._locations = new array(kbuffer);
    } else {
      var buckets = this.buckets = [];
      if (a) while (++i < n) buckets[i] = a[i];
      else while (++i < n) buckets[i] = 0;
      this._locations = [];
    }
  }

  // See http://willwhim.wpengine.com/2011/09/03/producing-n-hash-functions-by-hashing-only-once/
  BloomFilter.prototype.locations = function(v) {
    var k = this.k,
        m = this.m,
        r = this._locations,
        a = fnv_1a(v),
        b = fnv_1a(v, 1576284489), // The seed value is chosen randomly
        x = a % m;
    for (var i = 0; i < k; ++i) {
      r[i] = x < 0 ? (x + m) : x;
      x = (x + b) % m;
    }
    return r;
  };

  BloomFilter.prototype.add = function(v) {
    var l = this.locations(v + ""),
        k = this.k,
        buckets = this.buckets;
    for (var i = 0; i < k; ++i) buckets[Math.floor(l[i] / 32)] |= 1 << (l[i] % 32);
  };

  BloomFilter.prototype.test = function(v) {
    var l = this.locations(v + ""),
        k = this.k,
        buckets = this.buckets;
    for (var i = 0; i < k; ++i) {
      var b = l[i];
      if ((buckets[Math.floor(b / 32)] & (1 << (b % 32))) === 0) {
        return false;
      }
    }
    return true;
  };

  // Estimated cardinality.
  BloomFilter.prototype.size = function() {
    var buckets = this.buckets,
        bits = 0;
    for (var i = 0, n = buckets.length; i < n; ++i) bits += popcnt(buckets[i]);
    return -this.m * Math.log(1 - bits / this.m) / this.k;
  };

  // http://graphics.stanford.edu/~seander/bithacks.html#CountBitsSetParallel
  function popcnt(v) {
    v -= (v >> 1) & 0x55555555;
    v = (v & 0x33333333) + ((v >> 2) & 0x33333333);
    return ((v + (v >> 4) & 0xf0f0f0f) * 0x1010101) >> 24;
  }

  // Fowler/Noll/Vo hashing.
  // Nonstandard variation: this function optionally takes a seed value that is incorporated
  // into the offset basis. According to http://www.isthe.com/chongo/tech/comp/fnv/index.html
  // "almost any offset_basis will serve so long as it is non-zero".
  function fnv_1a(v, seed) {
    var a = 2166136261 ^ (seed || 0);
    for (var i = 0, n = v.length; i < n; ++i) {
      var c = v.charCodeAt(i),
          d = c & 0xff00;
      if (d) a = fnv_multiply(a ^ d >> 8);
      a = fnv_multiply(a ^ c & 0xff);
    }
    return fnv_mix(a);
  }

  // a * 16777619 mod 2**32
  function fnv_multiply(a) {
    return a + (a << 1) + (a << 4) + (a << 7) + (a << 8) + (a << 24);
  }

  // See https://web.archive.org/web/20131019013225/http://home.comcast.net/~bretm/hash/6.html
  function fnv_mix(a) {
    a += a << 13;
    a ^= a >>> 7;
    a += a << 3;
    a ^= a >>> 17;
    a += a << 5;
    return a & 0xffffffff;
  }
})(typeof exports !== "undefined" ? exports : this);

},{}],"index.js":[function(require,module,exports) {
"use strict";

var _jquery = _interopRequireDefault(require("jquery"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
$("#test").append("<h1>Test Mest</h1>");


$.getJSON("/Users/akilsevim/Downloads/requests.json", function(json) {
    console.log("TEst");
    console.log(json); // this will show the info it in firebug console
});

$.ajax("/Users/akilsevim/Downloads/requests.json", function(json) {
    console.log("TEst");
    console.log(json); // this will show the info it in firebug console
});*/
var indexJson = require('./non-empty-tiles_9.json');

var bloomLimit = 9;

var bloomfilter = require("bloomfilter");

var bloom = new bloomfilter.BloomFilter(512 * 256, // number of bits to allocate.
16 // number of hash functions.
);

_jquery.default.each(indexJson, function (i, val) {
  bloom.add(indexJson[i]);
});

var TileRequests = {};
var maxTime = 0;
var totalTileRequests = 0;

function handleFileSelect(evt) {
  var files = evt.target.files; // FileList object
  // files is a FileList of File objects. List some properties.

  var output = [];

  for (var i = 0, f; f = files[i]; i++) {
    output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ', f.size, ' bytes, last modified: ', f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a', '</li>');
    var reader = new FileReader(); // Closure to capture the file information.

    reader.onload = function (theFile) {
      return function (e) {
        //console.log(JSON.parse(e.target.result));
        var theJson = JSON.parse(e.target.result);

        _jquery.default.each(theJson, function (i, val) {
          if (i > maxTime) maxTime = i;

          if (!TileRequests.hasOwnProperty(i)) {
            TileRequests[i] = [];
          }

          TileRequests[i].push(val);
        }); //requestsJson[theFile.name] = JSON.parse(e.target.result);*/

      };
    }(f); // Read in the image file as a data URL.


    reader.readAsText(f);

    reader.onloadend = function () {
      _jquery.default.each(TileRequests, function (i, val) {
        _jquery.default.each(val, function () {
          totalTileRequests++;
        });
      });

      (0, _jquery.default)("#requestCounter").html(totalTileRequests + " requests loaded. <br/>");
    };
  }

  document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
}

document.getElementById('files').addEventListener('change', handleFileSelect, false);
var tileURL;
var intervalV;
var multiplier = 1;
var boomIt = false;
(0, _jquery.default)("#start").click(function () {
  if ((0, _jquery.default)("#bloom").prop("checked")) boomIt = true;
  tileURL = (0, _jquery.default)("#serverURL").val();
  multiplier = (0, _jquery.default)("#multiplier").val();
  intervalV = setInterval(sendRequest, 1);
  (0, _jquery.default)("#requestCounter").prepend("Started. <br/>");
});
var sec = 0;
var requestCounter = 0;
var finishTimes = [];

function encode(z, x, y) {
  return 1 << 2 * z | x << z | y;
}

function sendRequest() {
  sec++;
  if (!TileRequests.hasOwnProperty(sec)) return; //$("#requestCounter").prepend("<b>"+sec+"</b><br/>");

  _jquery.default.each(TileRequests[sec], function (i, val) {
    for (var i = 0; i < multiplier; i++) {
      //const start = new Date().getTime();

      /*if(boomIt) {
          if(bloom.test(encode(val.z,val.x,val.y))) {
              requestCounter++;
              var df = new Date();
              const finish = df.getTime();
              finishTimes[requestCounter] = finish - start;
          }
      }*/
      _jquery.default.ajax({
        url: tileURL + "tile-" + val.z + "-" + val.x + "-" + val.y + ".png?u=" + requestCounter
      }).done(function () {//var df = new Date();
        //const finish = df.getTime();
        //requestCounter++;
        //finishTimes.push(finish - start);
        //$("#requestCounter").prepend("<i>tile-" + val.z + "-" + val.x + "-" + val.y + ".png</i><br/>");
      });
    }
  });

  if (maxTime == sec) {
    (0, _jquery.default)("#requestCounter").prepend("Finished. MaxTime: " + maxTime + "." + requestCounter + "requests has been made. <br/>");
    /*
    var over = 0;
    var count = 0;
    $.each(finishTimes,function (i,val) {
        var style = 'blue';
        count++;
        if(val >= 500) {
            over++;
            style = 'red';
        }
       $("#requestsOutput").append("<div><b>"+i+":</b><i class='"+style+"'>"+val+"</i></div>");
    });
    $("#requestsOutput").prepend("Total:"+count+"<br>");
    $("#requestsOutput").prepend("Over:"+over);*/

    clearInterval(intervalV);
    console.log(TileRequests);
  }
}
},{"jquery":"node_modules/jquery/dist/jquery.js","./non-empty-tiles_9.json":"non-empty-tiles_9.json","bloomfilter":"node_modules/bloomfilter/bloomfilter.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "51451" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/Tester.e31bb0bc.map
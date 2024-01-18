/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/eventemitter3/index.js":
/*!*********************************************!*\
  !*** ./node_modules/eventemitter3/index.js ***!
  \*********************************************/
/***/ ((module) => {



var has = Object.prototype.hasOwnProperty
  , prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @private
 */
function Events() {}

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
  Events.prototype = Object.create(null);

  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) prefix = false;
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */
function addListener(emitter, event, fn, context, once) {
  if (typeof fn !== 'function') {
    throw new TypeError('The listener must be a function');
  }

  var listener = new EE(fn, context || emitter, once)
    , evt = prefix ? prefix + event : event;

  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
  else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
  else emitter._events[evt] = [emitter._events[evt], listener];

  return emitter;
}

/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt The Event name.
 * @private
 */
function clearEvent(emitter, evt) {
  if (--emitter._eventsCount === 0) emitter._events = new Events();
  else delete emitter._events[evt];
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
 */
function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var names = []
    , events
    , name;

  if (this._eventsCount === 0) return names;

  for (name in (events = this._events)) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Array} The registered listeners.
 * @public
 */
EventEmitter.prototype.listeners = function listeners(event) {
  var evt = prefix ? prefix + event : event
    , handlers = this._events[evt];

  if (!handlers) return [];
  if (handlers.fn) return [handlers.fn];

  for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
    ee[i] = handlers[i].fn;
  }

  return ee;
};

/**
 * Return the number of listeners listening to a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Number} The number of listeners.
 * @public
 */
EventEmitter.prototype.listenerCount = function listenerCount(event) {
  var evt = prefix ? prefix + event : event
    , listeners = this._events[evt];

  if (!listeners) return 0;
  if (listeners.fn) return 1;
  return listeners.length;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  return addListener(this, event, fn, context, false);
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  return addListener(this, event, fn, context, true);
};

/**
 * Remove the listeners of a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return this;
  if (!fn) {
    clearEvent(this, evt);
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (
      listeners.fn === fn &&
      (!once || listeners.once) &&
      (!context || listeners.context === context)
    ) {
      clearEvent(this, evt);
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
        listeners[i].fn !== fn ||
        (once && !listeners[i].once) ||
        (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
    else clearEvent(this, evt);
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) clearEvent(this, evt);
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;

//
// Expose the module.
//
if (true) {
  module.exports = EventEmitter;
}


/***/ }),

/***/ "./src/shared/lib.ts":
/*!***************************!*\
  !*** ./src/shared/lib.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   anyMetaKey: () => (/* binding */ anyMetaKey),
/* harmony export */   eventInInput: () => (/* binding */ eventInInput),
/* harmony export */   frame: () => (/* binding */ frame),
/* harmony export */   injectScript: () => (/* binding */ injectScript),
/* harmony export */   isNumber: () => (/* binding */ isNumber),
/* harmony export */   normalizeTicker: () => (/* binding */ normalizeTicker),
/* harmony export */   roundPrice: () => (/* binding */ roundPrice),
/* harmony export */   waitFor: () => (/* binding */ waitFor)
/* harmony export */ });
function isNumber(val) {
    return typeof val === 'number' && !Number.isNaN(val);
}
function injectScript(file_path, tag) {
    const node = document.getElementsByTagName(tag)[0];
    const script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', file_path);
    node.appendChild(script);
}
const frame = () => new Promise((res) => setTimeout(res, 40));
function anyMetaKey(e) {
    return e.metaKey || e.ctrlKey || e.shiftKey;
}
function eventInInput({ target }) {
    return ['input', 'textarea'].includes(target?.tagName?.toLowerCase() || '');
}
function normalizeTicker(value) {
    if (value.endsWith('f') && value.length === 7) {
        return value.slice(0, -1).toUpperCase();
    }
    if (value.startsWith('#')) {
        return value.slice(1).toUpperCase();
    }
    return value.toUpperCase();
}
function roundPrice(price, precision = 2) {
    return Math.round(price * Math.pow(10, precision)) / Math.pow(10, precision);
}
async function waitFor(fn, timeout = 5000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
        const call = fn();
        if (call) {
            return call;
        }
        await new Promise((resolve) => setTimeout(resolve, 200));
    }
    return false;
}


/***/ }),

/***/ "./src/shared/log.ts":
/*!***************************!*\
  !*** ./src/shared/log.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   log: () => (/* binding */ log)
/* harmony export */ });
const log = (...msg) => {
    console.log('%c — WF-Utilities — ', 'background-color: #3776c9; color: #fff', ...msg);
};


/***/ }),

/***/ "./src/shared/loop.ts":
/*!****************************!*\
  !*** ./src/shared/loop.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   loop: () => (/* binding */ loop)
/* harmony export */ });
/* harmony import */ var eventemitter3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! eventemitter3 */ "./node_modules/eventemitter3/index.mjs");
/* harmony import */ var _log__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./log */ "./src/shared/log.ts");


class Loop extends eventemitter3__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "isRunning", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "i", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "tick", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                if (!this.isRunning) {
                    return;
                }
                this.emit('tick');
                if (this.i % 10 === 0) {
                    this.emit('tick10');
                }
                if (this.i % 20 === 0) {
                    this.emit('tick20');
                }
                if (this.i % 60 === 0) {
                    this.emit('tick60');
                }
                this.i++;
                if (this.i > 100000) {
                    this.i = 0;
                }
                setTimeout(this.tick, 16);
            }
        });
    }
    start() {
        (0,_log__WEBPACK_IMPORTED_MODULE_1__.log)('loop has started');
        this.isRunning = true;
        this.tick();
    }
    stop() {
        this.isRunning = false;
    }
}
const loop = new Loop();


/***/ }),

/***/ "./src/shared/messages.ts":
/*!********************************!*\
  !*** ./src/shared/messages.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   onMessage: () => (/* binding */ onMessage),
/* harmony export */   sendMessage: () => (/* binding */ sendMessage)
/* harmony export */ });
function sendMessage(type, message) {
    chrome.runtime.sendMessage({
        id: 'WF_UTILITIES_EVENT',
        type,
        data: message,
    });
}
function onMessage(type, cb) {
    chrome.runtime.onMessage.addListener((message) => {
        // console.log('message', message);
        if (message?.id === 'WF_UTILITIES_EVENT' && message?.type === type) {
            cb(message.data);
        }
    });
}


/***/ }),

/***/ "./src/tradingview/crosshair.ts":
/*!**************************************!*\
  !*** ./src/tradingview/crosshair.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getCrosshairPrice: () => (/* binding */ getCrosshairPrice),
/* harmony export */   initCrosshair: () => (/* binding */ initCrosshair)
/* harmony export */ });
/* harmony import */ var _shared_lib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shared/lib */ "./src/shared/lib.ts");

let price = null;
function getCrosshairPrice() {
    return price;
}
function initCrosshair() {
    const scriptSrc = chrome.runtime.getURL('static/static.js');
    (0,_shared_lib__WEBPACK_IMPORTED_MODULE_0__.injectScript)(scriptSrc, 'body');
    window.addEventListener('message', (e) => {
        if (e?.data?.type === 'wf__crosshair_price') {
            price = Math.round(e.data.price * 1000) / 1000;
        }
    });
}


/***/ }),

/***/ "./src/tradingview/orders.service.ts":
/*!*******************************************!*\
  !*** ./src/tradingview/orders.service.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   setOrders: () => (/* binding */ setOrders)
/* harmony export */ });
/* harmony import */ var _shared_messages__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shared/messages */ "./src/shared/messages.ts");
/* harmony import */ var _ticker_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ticker.service */ "./src/tradingview/ticker.service.ts");


const root = document.createElement('div');
root.setAttribute('style', `
  position: fixed;
  display: flex;
  align-items: center;
  gap: 10px;
  top: 2px;
  left: 1040px;
  width: 200px;
  padding: 5px;
  height: 34px;
  z-index: 9999;
  border-radius: 4px;
  background: #f3f3f3;
  line-height: 1;
  box-sizing: border-box;
`);
document.body.appendChild(root);
let orders = [];
function setOrders(data) {
    root.innerHTML = '';
    root.style.opacity = '0';
    orders = data || [];
    if (!orders.length) {
        return;
    }
    const ticker = (0,_ticker_service__WEBPACK_IMPORTED_MODULE_1__.currentTicker)();
    const ordersWithSameTicker = orders.filter((o) => {
        // TODO: FB <-> META
        return o.symbol.toUpperCase() === ticker.toUpperCase();
    });
    if (!ordersWithSameTicker.length) {
        return;
    }
    root.style.opacity = '1';
    profitElement(ordersWithSameTicker.reduce((acc, o) => acc + o.profit, 0));
    positionSide(ordersWithSameTicker[0].type);
    closeButton(ticker);
}
function profitElement(totalProfit) {
    const profitEl = document.createElement('div');
    const sign = totalProfit < 0 ? '' : totalProfit > 0 ? '+' : '';
    const profitFormatted = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(totalProfit);
    profitEl.innerHTML = `${sign}${profitFormatted}$`;
    if (totalProfit > 0) {
        profitEl.style.color = '#0b71f3';
    }
    else if (totalProfit < 0) {
        profitEl.style.color = '#E0484C';
    }
    else {
        profitEl.style.color = '#777';
    }
    root.appendChild(profitEl);
}
function positionSide(ticker) {
    const el = document.createElement('div');
    el.innerHTML = ticker;
    root.appendChild(el);
}
function closeButton(ticker) {
    const closeEl = document.createElement('button');
    closeEl.type = 'button';
    closeEl.setAttribute('style', `display: block;
    padding: 5px 7px;
    border: 0;
    background: #f45959;
    color: #fff;
    border-radius: 4px;
    line-height: 1;
    box-sizing: border-box;
    margin-left: auto;
    cursor: pointer;
    `);
    closeEl.innerHTML = 'Close';
    closeEl.addEventListener('click', () => (0,_shared_messages__WEBPACK_IMPORTED_MODULE_0__.sendMessage)('close-by-ticker', ticker));
    root.appendChild(closeEl);
}


/***/ }),

/***/ "./src/tradingview/ticker.service.ts":
/*!*******************************************!*\
  !*** ./src/tradingview/ticker.service.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   currentTicker: () => (/* binding */ currentTicker),
/* harmony export */   tickerEvents: () => (/* binding */ tickerEvents),
/* harmony export */   watchTicker: () => (/* binding */ watchTicker)
/* harmony export */ });
/* harmony import */ var _shared_loop__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shared/loop */ "./src/shared/loop.ts");
/* harmony import */ var _shared_messages__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shared/messages */ "./src/shared/messages.ts");


function currentTicker() {
    return document.querySelector('#header-toolbar-symbol-search .js-button-text')?.innerText || '';
}
let lastTicker = '';
function watchTicker(cb) {
    _shared_loop__WEBPACK_IMPORTED_MODULE_0__.loop.on('tick10', () => {
        const current = currentTicker();
        if (current && lastTicker !== current) {
            cb();
            lastTicker = current;
        }
    });
}
function tickerEvents() {
    window.addEventListener('focus', () => {
        (0,_shared_messages__WEBPACK_IMPORTED_MODULE_1__.sendMessage)('ticker', currentTicker());
    });
    window.addEventListener('load', () => {
        (0,_shared_messages__WEBPACK_IMPORTED_MODULE_1__.sendMessage)('ticker', currentTicker());
    });
}


/***/ }),

/***/ "./node_modules/eventemitter3/index.mjs":
/*!**********************************************!*\
  !*** ./node_modules/eventemitter3/index.mjs ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EventEmitter: () => (/* reexport default export from named module */ _index_js__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.js */ "./node_modules/eventemitter3/index.js");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_index_js__WEBPACK_IMPORTED_MODULE_0__);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************************!*\
  !*** ./src/tradingview-entry.ts ***!
  \**********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _shared_log__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shared/log */ "./src/shared/log.ts");
/* harmony import */ var _shared_loop__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./shared/loop */ "./src/shared/loop.ts");
/* harmony import */ var _shared_messages__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./shared/messages */ "./src/shared/messages.ts");
/* harmony import */ var _tradingview_crosshair__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./tradingview/crosshair */ "./src/tradingview/crosshair.ts");
/* harmony import */ var _tradingview_orders_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./tradingview/orders.service */ "./src/tradingview/orders.service.ts");
/* harmony import */ var _tradingview_ticker_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./tradingview/ticker.service */ "./src/tradingview/ticker.service.ts");






window.addEventListener('load', () => {
    _shared_loop__WEBPACK_IMPORTED_MODULE_1__.loop.start();
    (0,_tradingview_crosshair__WEBPACK_IMPORTED_MODULE_3__.initCrosshair)();
    (0,_tradingview_ticker_service__WEBPACK_IMPORTED_MODULE_5__.tickerEvents)();
    (0,_tradingview_ticker_service__WEBPACK_IMPORTED_MODULE_5__.watchTicker)(() => {
        (0,_shared_messages__WEBPACK_IMPORTED_MODULE_2__.sendMessage)('ticker', (0,_tradingview_ticker_service__WEBPACK_IMPORTED_MODULE_5__.currentTicker)());
    });
    document.addEventListener('keyup', (e) => {
        if (e.code === 'KeyD' && e.ctrlKey) {
            (0,_shared_log__WEBPACK_IMPORTED_MODULE_0__.log)('Send order', (0,_tradingview_crosshair__WEBPACK_IMPORTED_MODULE_3__.getCrosshairPrice)(), (0,_tradingview_ticker_service__WEBPACK_IMPORTED_MODULE_5__.currentTicker)());
            (0,_shared_messages__WEBPACK_IMPORTED_MODULE_2__.sendMessage)('order', { price: (0,_tradingview_crosshair__WEBPACK_IMPORTED_MODULE_3__.getCrosshairPrice)(), ticker: (0,_tradingview_ticker_service__WEBPACK_IMPORTED_MODULE_5__.currentTicker)() });
        }
    });
    (0,_shared_messages__WEBPACK_IMPORTED_MODULE_2__.onMessage)('orders', (orders) => (0,_tradingview_orders_service__WEBPACK_IMPORTED_MODULE_4__.setOrders)(orders));
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTm1DO0FBQ0U7QUFDc0I7QUFDZ0I7QUFDbEI7QUFDK0I7QUFDeEY7QUFDQSxJQUFJLDhDQUFJO0FBQ1IsSUFBSSxxRUFBYTtBQUNqQixJQUFJLHlFQUFZO0FBQ2hCLElBQUksd0VBQVc7QUFDZixRQUFRLDZEQUFXLFdBQVcsMEVBQWE7QUFDM0MsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZLGdEQUFHLGVBQWUseUVBQWlCLElBQUksMEVBQWE7QUFDaEUsWUFBWSw2REFBVyxZQUFZLE9BQU8seUVBQWlCLFlBQVksMEVBQWEsSUFBSTtBQUN4RjtBQUNBLEtBQUs7QUFDTCxJQUFJLDJEQUFTLHVCQUF1QixzRUFBUztBQUM3QyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd2YtdXRpbGl0aWVzLy4vbm9kZV9tb2R1bGVzL2V2ZW50ZW1pdHRlcjMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vd2YtdXRpbGl0aWVzLy4vc3JjL3NoYXJlZC9saWIudHMiLCJ3ZWJwYWNrOi8vd2YtdXRpbGl0aWVzLy4vc3JjL3NoYXJlZC9sb2cudHMiLCJ3ZWJwYWNrOi8vd2YtdXRpbGl0aWVzLy4vc3JjL3NoYXJlZC9sb29wLnRzIiwid2VicGFjazovL3dmLXV0aWxpdGllcy8uL3NyYy9zaGFyZWQvbWVzc2FnZXMudHMiLCJ3ZWJwYWNrOi8vd2YtdXRpbGl0aWVzLy4vc3JjL3RyYWRpbmd2aWV3L2Nyb3NzaGFpci50cyIsIndlYnBhY2s6Ly93Zi11dGlsaXRpZXMvLi9zcmMvdHJhZGluZ3ZpZXcvb3JkZXJzLnNlcnZpY2UudHMiLCJ3ZWJwYWNrOi8vd2YtdXRpbGl0aWVzLy4vc3JjL3RyYWRpbmd2aWV3L3RpY2tlci5zZXJ2aWNlLnRzIiwid2VicGFjazovL3dmLXV0aWxpdGllcy8uL25vZGVfbW9kdWxlcy9ldmVudGVtaXR0ZXIzL2luZGV4Lm1qcyIsIndlYnBhY2s6Ly93Zi11dGlsaXRpZXMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vd2YtdXRpbGl0aWVzL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly93Zi11dGlsaXRpZXMvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly93Zi11dGlsaXRpZXMvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly93Zi11dGlsaXRpZXMvLi9zcmMvdHJhZGluZ3ZpZXctZW50cnkudHMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaGFzID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eVxuICAsIHByZWZpeCA9ICd+JztcblxuLyoqXG4gKiBDb25zdHJ1Y3RvciB0byBjcmVhdGUgYSBzdG9yYWdlIGZvciBvdXIgYEVFYCBvYmplY3RzLlxuICogQW4gYEV2ZW50c2AgaW5zdGFuY2UgaXMgYSBwbGFpbiBvYmplY3Qgd2hvc2UgcHJvcGVydGllcyBhcmUgZXZlbnQgbmFtZXMuXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBFdmVudHMoKSB7fVxuXG4vL1xuLy8gV2UgdHJ5IHRvIG5vdCBpbmhlcml0IGZyb20gYE9iamVjdC5wcm90b3R5cGVgLiBJbiBzb21lIGVuZ2luZXMgY3JlYXRpbmcgYW5cbi8vIGluc3RhbmNlIGluIHRoaXMgd2F5IGlzIGZhc3RlciB0aGFuIGNhbGxpbmcgYE9iamVjdC5jcmVhdGUobnVsbClgIGRpcmVjdGx5LlxuLy8gSWYgYE9iamVjdC5jcmVhdGUobnVsbClgIGlzIG5vdCBzdXBwb3J0ZWQgd2UgcHJlZml4IHRoZSBldmVudCBuYW1lcyB3aXRoIGFcbi8vIGNoYXJhY3RlciB0byBtYWtlIHN1cmUgdGhhdCB0aGUgYnVpbHQtaW4gb2JqZWN0IHByb3BlcnRpZXMgYXJlIG5vdFxuLy8gb3ZlcnJpZGRlbiBvciB1c2VkIGFzIGFuIGF0dGFjayB2ZWN0b3IuXG4vL1xuaWYgKE9iamVjdC5jcmVhdGUpIHtcbiAgRXZlbnRzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgLy9cbiAgLy8gVGhpcyBoYWNrIGlzIG5lZWRlZCBiZWNhdXNlIHRoZSBgX19wcm90b19fYCBwcm9wZXJ0eSBpcyBzdGlsbCBpbmhlcml0ZWQgaW5cbiAgLy8gc29tZSBvbGQgYnJvd3NlcnMgbGlrZSBBbmRyb2lkIDQsIGlQaG9uZSA1LjEsIE9wZXJhIDExIGFuZCBTYWZhcmkgNS5cbiAgLy9cbiAgaWYgKCFuZXcgRXZlbnRzKCkuX19wcm90b19fKSBwcmVmaXggPSBmYWxzZTtcbn1cblxuLyoqXG4gKiBSZXByZXNlbnRhdGlvbiBvZiBhIHNpbmdsZSBldmVudCBsaXN0ZW5lci5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgbGlzdGVuZXIgZnVuY3Rpb24uXG4gKiBAcGFyYW0geyp9IGNvbnRleHQgVGhlIGNvbnRleHQgdG8gaW52b2tlIHRoZSBsaXN0ZW5lciB3aXRoLlxuICogQHBhcmFtIHtCb29sZWFufSBbb25jZT1mYWxzZV0gU3BlY2lmeSBpZiB0aGUgbGlzdGVuZXIgaXMgYSBvbmUtdGltZSBsaXN0ZW5lci5cbiAqIEBjb25zdHJ1Y3RvclxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gRUUoZm4sIGNvbnRleHQsIG9uY2UpIHtcbiAgdGhpcy5mbiA9IGZuO1xuICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICB0aGlzLm9uY2UgPSBvbmNlIHx8IGZhbHNlO1xufVxuXG4vKipcbiAqIEFkZCBhIGxpc3RlbmVyIGZvciBhIGdpdmVuIGV2ZW50LlxuICpcbiAqIEBwYXJhbSB7RXZlbnRFbWl0dGVyfSBlbWl0dGVyIFJlZmVyZW5jZSB0byB0aGUgYEV2ZW50RW1pdHRlcmAgaW5zdGFuY2UuXG4gKiBAcGFyYW0geyhTdHJpbmd8U3ltYm9sKX0gZXZlbnQgVGhlIGV2ZW50IG5hbWUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgbGlzdGVuZXIgZnVuY3Rpb24uXG4gKiBAcGFyYW0geyp9IGNvbnRleHQgVGhlIGNvbnRleHQgdG8gaW52b2tlIHRoZSBsaXN0ZW5lciB3aXRoLlxuICogQHBhcmFtIHtCb29sZWFufSBvbmNlIFNwZWNpZnkgaWYgdGhlIGxpc3RlbmVyIGlzIGEgb25lLXRpbWUgbGlzdGVuZXIuXG4gKiBAcmV0dXJucyB7RXZlbnRFbWl0dGVyfVxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gYWRkTGlzdGVuZXIoZW1pdHRlciwgZXZlbnQsIGZuLCBjb250ZXh0LCBvbmNlKSB7XG4gIGlmICh0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG4gIH1cblxuICB2YXIgbGlzdGVuZXIgPSBuZXcgRUUoZm4sIGNvbnRleHQgfHwgZW1pdHRlciwgb25jZSlcbiAgICAsIGV2dCA9IHByZWZpeCA/IHByZWZpeCArIGV2ZW50IDogZXZlbnQ7XG5cbiAgaWYgKCFlbWl0dGVyLl9ldmVudHNbZXZ0XSkgZW1pdHRlci5fZXZlbnRzW2V2dF0gPSBsaXN0ZW5lciwgZW1pdHRlci5fZXZlbnRzQ291bnQrKztcbiAgZWxzZSBpZiAoIWVtaXR0ZXIuX2V2ZW50c1tldnRdLmZuKSBlbWl0dGVyLl9ldmVudHNbZXZ0XS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZSBlbWl0dGVyLl9ldmVudHNbZXZ0XSA9IFtlbWl0dGVyLl9ldmVudHNbZXZ0XSwgbGlzdGVuZXJdO1xuXG4gIHJldHVybiBlbWl0dGVyO1xufVxuXG4vKipcbiAqIENsZWFyIGV2ZW50IGJ5IG5hbWUuXG4gKlxuICogQHBhcmFtIHtFdmVudEVtaXR0ZXJ9IGVtaXR0ZXIgUmVmZXJlbmNlIHRvIHRoZSBgRXZlbnRFbWl0dGVyYCBpbnN0YW5jZS5cbiAqIEBwYXJhbSB7KFN0cmluZ3xTeW1ib2wpfSBldnQgVGhlIEV2ZW50IG5hbWUuXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBjbGVhckV2ZW50KGVtaXR0ZXIsIGV2dCkge1xuICBpZiAoLS1lbWl0dGVyLl9ldmVudHNDb3VudCA9PT0gMCkgZW1pdHRlci5fZXZlbnRzID0gbmV3IEV2ZW50cygpO1xuICBlbHNlIGRlbGV0ZSBlbWl0dGVyLl9ldmVudHNbZXZ0XTtcbn1cblxuLyoqXG4gKiBNaW5pbWFsIGBFdmVudEVtaXR0ZXJgIGludGVyZmFjZSB0aGF0IGlzIG1vbGRlZCBhZ2FpbnN0IHRoZSBOb2RlLmpzXG4gKiBgRXZlbnRFbWl0dGVyYCBpbnRlcmZhY2UuXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcHVibGljXG4gKi9cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gbmV3IEV2ZW50cygpO1xuICB0aGlzLl9ldmVudHNDb3VudCA9IDA7XG59XG5cbi8qKlxuICogUmV0dXJuIGFuIGFycmF5IGxpc3RpbmcgdGhlIGV2ZW50cyBmb3Igd2hpY2ggdGhlIGVtaXR0ZXIgaGFzIHJlZ2lzdGVyZWRcbiAqIGxpc3RlbmVycy5cbiAqXG4gKiBAcmV0dXJucyB7QXJyYXl9XG4gKiBAcHVibGljXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZXZlbnROYW1lcyA9IGZ1bmN0aW9uIGV2ZW50TmFtZXMoKSB7XG4gIHZhciBuYW1lcyA9IFtdXG4gICAgLCBldmVudHNcbiAgICAsIG5hbWU7XG5cbiAgaWYgKHRoaXMuX2V2ZW50c0NvdW50ID09PSAwKSByZXR1cm4gbmFtZXM7XG5cbiAgZm9yIChuYW1lIGluIChldmVudHMgPSB0aGlzLl9ldmVudHMpKSB7XG4gICAgaWYgKGhhcy5jYWxsKGV2ZW50cywgbmFtZSkpIG5hbWVzLnB1c2gocHJlZml4ID8gbmFtZS5zbGljZSgxKSA6IG5hbWUpO1xuICB9XG5cbiAgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcbiAgICByZXR1cm4gbmFtZXMuY29uY2F0KE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZXZlbnRzKSk7XG4gIH1cblxuICByZXR1cm4gbmFtZXM7XG59O1xuXG4vKipcbiAqIFJldHVybiB0aGUgbGlzdGVuZXJzIHJlZ2lzdGVyZWQgZm9yIGEgZ2l2ZW4gZXZlbnQuXG4gKlxuICogQHBhcmFtIHsoU3RyaW5nfFN5bWJvbCl9IGV2ZW50IFRoZSBldmVudCBuYW1lLlxuICogQHJldHVybnMge0FycmF5fSBUaGUgcmVnaXN0ZXJlZCBsaXN0ZW5lcnMuXG4gKiBAcHVibGljXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24gbGlzdGVuZXJzKGV2ZW50KSB7XG4gIHZhciBldnQgPSBwcmVmaXggPyBwcmVmaXggKyBldmVudCA6IGV2ZW50XG4gICAgLCBoYW5kbGVycyA9IHRoaXMuX2V2ZW50c1tldnRdO1xuXG4gIGlmICghaGFuZGxlcnMpIHJldHVybiBbXTtcbiAgaWYgKGhhbmRsZXJzLmZuKSByZXR1cm4gW2hhbmRsZXJzLmZuXTtcblxuICBmb3IgKHZhciBpID0gMCwgbCA9IGhhbmRsZXJzLmxlbmd0aCwgZWUgPSBuZXcgQXJyYXkobCk7IGkgPCBsOyBpKyspIHtcbiAgICBlZVtpXSA9IGhhbmRsZXJzW2ldLmZuO1xuICB9XG5cbiAgcmV0dXJuIGVlO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gdGhlIG51bWJlciBvZiBsaXN0ZW5lcnMgbGlzdGVuaW5nIHRvIGEgZ2l2ZW4gZXZlbnQuXG4gKlxuICogQHBhcmFtIHsoU3RyaW5nfFN5bWJvbCl9IGV2ZW50IFRoZSBldmVudCBuYW1lLlxuICogQHJldHVybnMge051bWJlcn0gVGhlIG51bWJlciBvZiBsaXN0ZW5lcnMuXG4gKiBAcHVibGljXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uIGxpc3RlbmVyQ291bnQoZXZlbnQpIHtcbiAgdmFyIGV2dCA9IHByZWZpeCA/IHByZWZpeCArIGV2ZW50IDogZXZlbnRcbiAgICAsIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1tldnRdO1xuXG4gIGlmICghbGlzdGVuZXJzKSByZXR1cm4gMDtcbiAgaWYgKGxpc3RlbmVycy5mbikgcmV0dXJuIDE7XG4gIHJldHVybiBsaXN0ZW5lcnMubGVuZ3RoO1xufTtcblxuLyoqXG4gKiBDYWxscyBlYWNoIG9mIHRoZSBsaXN0ZW5lcnMgcmVnaXN0ZXJlZCBmb3IgYSBnaXZlbiBldmVudC5cbiAqXG4gKiBAcGFyYW0geyhTdHJpbmd8U3ltYm9sKX0gZXZlbnQgVGhlIGV2ZW50IG5hbWUuXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn0gYHRydWVgIGlmIHRoZSBldmVudCBoYWQgbGlzdGVuZXJzLCBlbHNlIGBmYWxzZWAuXG4gKiBAcHVibGljXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uIGVtaXQoZXZlbnQsIGExLCBhMiwgYTMsIGE0LCBhNSkge1xuICB2YXIgZXZ0ID0gcHJlZml4ID8gcHJlZml4ICsgZXZlbnQgOiBldmVudDtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1tldnRdKSByZXR1cm4gZmFsc2U7XG5cbiAgdmFyIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1tldnRdXG4gICAgLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoXG4gICAgLCBhcmdzXG4gICAgLCBpO1xuXG4gIGlmIChsaXN0ZW5lcnMuZm4pIHtcbiAgICBpZiAobGlzdGVuZXJzLm9uY2UpIHRoaXMucmVtb3ZlTGlzdGVuZXIoZXZlbnQsIGxpc3RlbmVycy5mbiwgdW5kZWZpbmVkLCB0cnVlKTtcblxuICAgIHN3aXRjaCAobGVuKSB7XG4gICAgICBjYXNlIDE6IHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCksIHRydWU7XG4gICAgICBjYXNlIDI6IHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCwgYTEpLCB0cnVlO1xuICAgICAgY2FzZSAzOiByZXR1cm4gbGlzdGVuZXJzLmZuLmNhbGwobGlzdGVuZXJzLmNvbnRleHQsIGExLCBhMiksIHRydWU7XG4gICAgICBjYXNlIDQ6IHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCwgYTEsIGEyLCBhMyksIHRydWU7XG4gICAgICBjYXNlIDU6IHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCwgYTEsIGEyLCBhMywgYTQpLCB0cnVlO1xuICAgICAgY2FzZSA2OiByZXR1cm4gbGlzdGVuZXJzLmZuLmNhbGwobGlzdGVuZXJzLmNvbnRleHQsIGExLCBhMiwgYTMsIGE0LCBhNSksIHRydWU7XG4gICAgfVxuXG4gICAgZm9yIChpID0gMSwgYXJncyA9IG5ldyBBcnJheShsZW4gLTEpOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgIH1cblxuICAgIGxpc3RlbmVycy5mbi5hcHBseShsaXN0ZW5lcnMuY29udGV4dCwgYXJncyk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGxlbmd0aCA9IGxpc3RlbmVycy5sZW5ndGhcbiAgICAgICwgajtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGxpc3RlbmVyc1tpXS5vbmNlKSB0aGlzLnJlbW92ZUxpc3RlbmVyKGV2ZW50LCBsaXN0ZW5lcnNbaV0uZm4sIHVuZGVmaW5lZCwgdHJ1ZSk7XG5cbiAgICAgIHN3aXRjaCAobGVuKSB7XG4gICAgICAgIGNhc2UgMTogbGlzdGVuZXJzW2ldLmZuLmNhbGwobGlzdGVuZXJzW2ldLmNvbnRleHQpOyBicmVhaztcbiAgICAgICAgY2FzZSAyOiBsaXN0ZW5lcnNbaV0uZm4uY2FsbChsaXN0ZW5lcnNbaV0uY29udGV4dCwgYTEpOyBicmVhaztcbiAgICAgICAgY2FzZSAzOiBsaXN0ZW5lcnNbaV0uZm4uY2FsbChsaXN0ZW5lcnNbaV0uY29udGV4dCwgYTEsIGEyKTsgYnJlYWs7XG4gICAgICAgIGNhc2UgNDogbGlzdGVuZXJzW2ldLmZuLmNhbGwobGlzdGVuZXJzW2ldLmNvbnRleHQsIGExLCBhMiwgYTMpOyBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBpZiAoIWFyZ3MpIGZvciAoaiA9IDEsIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0xKTsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgICAgICBhcmdzW2ogLSAxXSA9IGFyZ3VtZW50c1tqXTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBsaXN0ZW5lcnNbaV0uZm4uYXBwbHkobGlzdGVuZXJzW2ldLmNvbnRleHQsIGFyZ3MpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuLyoqXG4gKiBBZGQgYSBsaXN0ZW5lciBmb3IgYSBnaXZlbiBldmVudC5cbiAqXG4gKiBAcGFyYW0geyhTdHJpbmd8U3ltYm9sKX0gZXZlbnQgVGhlIGV2ZW50IG5hbWUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgbGlzdGVuZXIgZnVuY3Rpb24uXG4gKiBAcGFyYW0geyp9IFtjb250ZXh0PXRoaXNdIFRoZSBjb250ZXh0IHRvIGludm9rZSB0aGUgbGlzdGVuZXIgd2l0aC5cbiAqIEByZXR1cm5zIHtFdmVudEVtaXR0ZXJ9IGB0aGlzYC5cbiAqIEBwdWJsaWNcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uIG9uKGV2ZW50LCBmbiwgY29udGV4dCkge1xuICByZXR1cm4gYWRkTGlzdGVuZXIodGhpcywgZXZlbnQsIGZuLCBjb250ZXh0LCBmYWxzZSk7XG59O1xuXG4vKipcbiAqIEFkZCBhIG9uZS10aW1lIGxpc3RlbmVyIGZvciBhIGdpdmVuIGV2ZW50LlxuICpcbiAqIEBwYXJhbSB7KFN0cmluZ3xTeW1ib2wpfSBldmVudCBUaGUgZXZlbnQgbmFtZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBsaXN0ZW5lciBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7Kn0gW2NvbnRleHQ9dGhpc10gVGhlIGNvbnRleHQgdG8gaW52b2tlIHRoZSBsaXN0ZW5lciB3aXRoLlxuICogQHJldHVybnMge0V2ZW50RW1pdHRlcn0gYHRoaXNgLlxuICogQHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbiBvbmNlKGV2ZW50LCBmbiwgY29udGV4dCkge1xuICByZXR1cm4gYWRkTGlzdGVuZXIodGhpcywgZXZlbnQsIGZuLCBjb250ZXh0LCB0cnVlKTtcbn07XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBsaXN0ZW5lcnMgb2YgYSBnaXZlbiBldmVudC5cbiAqXG4gKiBAcGFyYW0geyhTdHJpbmd8U3ltYm9sKX0gZXZlbnQgVGhlIGV2ZW50IG5hbWUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBPbmx5IHJlbW92ZSB0aGUgbGlzdGVuZXJzIHRoYXQgbWF0Y2ggdGhpcyBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7Kn0gY29udGV4dCBPbmx5IHJlbW92ZSB0aGUgbGlzdGVuZXJzIHRoYXQgaGF2ZSB0aGlzIGNvbnRleHQuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IG9uY2UgT25seSByZW1vdmUgb25lLXRpbWUgbGlzdGVuZXJzLlxuICogQHJldHVybnMge0V2ZW50RW1pdHRlcn0gYHRoaXNgLlxuICogQHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24gcmVtb3ZlTGlzdGVuZXIoZXZlbnQsIGZuLCBjb250ZXh0LCBvbmNlKSB7XG4gIHZhciBldnQgPSBwcmVmaXggPyBwcmVmaXggKyBldmVudCA6IGV2ZW50O1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW2V2dF0pIHJldHVybiB0aGlzO1xuICBpZiAoIWZuKSB7XG4gICAgY2xlYXJFdmVudCh0aGlzLCBldnQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgdmFyIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1tldnRdO1xuXG4gIGlmIChsaXN0ZW5lcnMuZm4pIHtcbiAgICBpZiAoXG4gICAgICBsaXN0ZW5lcnMuZm4gPT09IGZuICYmXG4gICAgICAoIW9uY2UgfHwgbGlzdGVuZXJzLm9uY2UpICYmXG4gICAgICAoIWNvbnRleHQgfHwgbGlzdGVuZXJzLmNvbnRleHQgPT09IGNvbnRleHQpXG4gICAgKSB7XG4gICAgICBjbGVhckV2ZW50KHRoaXMsIGV2dCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGZvciAodmFyIGkgPSAwLCBldmVudHMgPSBbXSwgbGVuZ3RoID0gbGlzdGVuZXJzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoXG4gICAgICAgIGxpc3RlbmVyc1tpXS5mbiAhPT0gZm4gfHxcbiAgICAgICAgKG9uY2UgJiYgIWxpc3RlbmVyc1tpXS5vbmNlKSB8fFxuICAgICAgICAoY29udGV4dCAmJiBsaXN0ZW5lcnNbaV0uY29udGV4dCAhPT0gY29udGV4dClcbiAgICAgICkge1xuICAgICAgICBldmVudHMucHVzaChsaXN0ZW5lcnNbaV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vXG4gICAgLy8gUmVzZXQgdGhlIGFycmF5LCBvciByZW1vdmUgaXQgY29tcGxldGVseSBpZiB3ZSBoYXZlIG5vIG1vcmUgbGlzdGVuZXJzLlxuICAgIC8vXG4gICAgaWYgKGV2ZW50cy5sZW5ndGgpIHRoaXMuX2V2ZW50c1tldnRdID0gZXZlbnRzLmxlbmd0aCA9PT0gMSA/IGV2ZW50c1swXSA6IGV2ZW50cztcbiAgICBlbHNlIGNsZWFyRXZlbnQodGhpcywgZXZ0KTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgYWxsIGxpc3RlbmVycywgb3IgdGhvc2Ugb2YgdGhlIHNwZWNpZmllZCBldmVudC5cbiAqXG4gKiBAcGFyYW0geyhTdHJpbmd8U3ltYm9sKX0gW2V2ZW50XSBUaGUgZXZlbnQgbmFtZS5cbiAqIEByZXR1cm5zIHtFdmVudEVtaXR0ZXJ9IGB0aGlzYC5cbiAqIEBwdWJsaWNcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbiByZW1vdmVBbGxMaXN0ZW5lcnMoZXZlbnQpIHtcbiAgdmFyIGV2dDtcblxuICBpZiAoZXZlbnQpIHtcbiAgICBldnQgPSBwcmVmaXggPyBwcmVmaXggKyBldmVudCA6IGV2ZW50O1xuICAgIGlmICh0aGlzLl9ldmVudHNbZXZ0XSkgY2xlYXJFdmVudCh0aGlzLCBldnQpO1xuICB9IGVsc2Uge1xuICAgIHRoaXMuX2V2ZW50cyA9IG5ldyBFdmVudHMoKTtcbiAgICB0aGlzLl9ldmVudHNDb3VudCA9IDA7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vXG4vLyBBbGlhcyBtZXRob2RzIG5hbWVzIGJlY2F1c2UgcGVvcGxlIHJvbGwgbGlrZSB0aGF0LlxuLy9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub2ZmID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lcjtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uO1xuXG4vL1xuLy8gRXhwb3NlIHRoZSBwcmVmaXguXG4vL1xuRXZlbnRFbWl0dGVyLnByZWZpeGVkID0gcHJlZml4O1xuXG4vL1xuLy8gQWxsb3cgYEV2ZW50RW1pdHRlcmAgdG8gYmUgaW1wb3J0ZWQgYXMgbW9kdWxlIG5hbWVzcGFjZS5cbi8vXG5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuXG4vL1xuLy8gRXhwb3NlIHRoZSBtb2R1bGUuXG4vL1xuaWYgKCd1bmRlZmluZWQnICE9PSB0eXBlb2YgbW9kdWxlKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGlzTnVtYmVyKHZhbCkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsID09PSAnbnVtYmVyJyAmJiAhTnVtYmVyLmlzTmFOKHZhbCk7XG59XG5leHBvcnQgZnVuY3Rpb24gaW5qZWN0U2NyaXB0KGZpbGVfcGF0aCwgdGFnKSB7XG4gICAgY29uc3Qgbm9kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKHRhZylbMF07XG4gICAgY29uc3Qgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgc2NyaXB0LnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0L2phdmFzY3JpcHQnKTtcbiAgICBzY3JpcHQuc2V0QXR0cmlidXRlKCdzcmMnLCBmaWxlX3BhdGgpO1xuICAgIG5vZGUuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbn1cbmV4cG9ydCBjb25zdCBmcmFtZSA9ICgpID0+IG5ldyBQcm9taXNlKChyZXMpID0+IHNldFRpbWVvdXQocmVzLCA0MCkpO1xuZXhwb3J0IGZ1bmN0aW9uIGFueU1ldGFLZXkoZSkge1xuICAgIHJldHVybiBlLm1ldGFLZXkgfHwgZS5jdHJsS2V5IHx8IGUuc2hpZnRLZXk7XG59XG5leHBvcnQgZnVuY3Rpb24gZXZlbnRJbklucHV0KHsgdGFyZ2V0IH0pIHtcbiAgICByZXR1cm4gWydpbnB1dCcsICd0ZXh0YXJlYSddLmluY2x1ZGVzKHRhcmdldD8udGFnTmFtZT8udG9Mb3dlckNhc2UoKSB8fCAnJyk7XG59XG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplVGlja2VyKHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlLmVuZHNXaXRoKCdmJykgJiYgdmFsdWUubGVuZ3RoID09PSA3KSB7XG4gICAgICAgIHJldHVybiB2YWx1ZS5zbGljZSgwLCAtMSkudG9VcHBlckNhc2UoKTtcbiAgICB9XG4gICAgaWYgKHZhbHVlLnN0YXJ0c1dpdGgoJyMnKSkge1xuICAgICAgICByZXR1cm4gdmFsdWUuc2xpY2UoMSkudG9VcHBlckNhc2UoKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlLnRvVXBwZXJDYXNlKCk7XG59XG5leHBvcnQgZnVuY3Rpb24gcm91bmRQcmljZShwcmljZSwgcHJlY2lzaW9uID0gMikge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKHByaWNlICogTWF0aC5wb3coMTAsIHByZWNpc2lvbikpIC8gTWF0aC5wb3coMTAsIHByZWNpc2lvbik7XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2FpdEZvcihmbiwgdGltZW91dCA9IDUwMDApIHtcbiAgICBjb25zdCBzdGFydCA9IERhdGUubm93KCk7XG4gICAgd2hpbGUgKERhdGUubm93KCkgLSBzdGFydCA8IHRpbWVvdXQpIHtcbiAgICAgICAgY29uc3QgY2FsbCA9IGZuKCk7XG4gICAgICAgIGlmIChjYWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FsbDtcbiAgICAgICAgfVxuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAyMDApKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuIiwiZXhwb3J0IGNvbnN0IGxvZyA9ICguLi5tc2cpID0+IHtcbiAgICBjb25zb2xlLmxvZygnJWMg4oCUIFdGLVV0aWxpdGllcyDigJQgJywgJ2JhY2tncm91bmQtY29sb3I6ICMzNzc2Yzk7IGNvbG9yOiAjZmZmJywgLi4ubXNnKTtcbn07XG4iLCJpbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJ2V2ZW50ZW1pdHRlcjMnO1xuaW1wb3J0IHsgbG9nIH0gZnJvbSAnLi9sb2cnO1xuY2xhc3MgTG9vcCBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImlzUnVubmluZ1wiLCB7XG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgICAgICB2YWx1ZTogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImlcIiwge1xuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgdmFsdWU6IDBcbiAgICAgICAgfSk7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcInRpY2tcIiwge1xuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgdmFsdWU6ICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaXNSdW5uaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KCd0aWNrJyk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaSAlIDEwID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgndGljazEwJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmkgJSAyMCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ3RpY2syMCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pICUgNjAgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KCd0aWNrNjAnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5pKys7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaSA+IDEwMDAwMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmkgPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KHRoaXMudGljaywgMTYpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgc3RhcnQoKSB7XG4gICAgICAgIGxvZygnbG9vcCBoYXMgc3RhcnRlZCcpO1xuICAgICAgICB0aGlzLmlzUnVubmluZyA9IHRydWU7XG4gICAgICAgIHRoaXMudGljaygpO1xuICAgIH1cbiAgICBzdG9wKCkge1xuICAgICAgICB0aGlzLmlzUnVubmluZyA9IGZhbHNlO1xuICAgIH1cbn1cbmV4cG9ydCBjb25zdCBsb29wID0gbmV3IExvb3AoKTtcbiIsImV4cG9ydCBmdW5jdGlvbiBzZW5kTWVzc2FnZSh0eXBlLCBtZXNzYWdlKSB7XG4gICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe1xuICAgICAgICBpZDogJ1dGX1VUSUxJVElFU19FVkVOVCcsXG4gICAgICAgIHR5cGUsXG4gICAgICAgIGRhdGE6IG1lc3NhZ2UsXG4gICAgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gb25NZXNzYWdlKHR5cGUsIGNiKSB7XG4gICAgY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKChtZXNzYWdlKSA9PiB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdtZXNzYWdlJywgbWVzc2FnZSk7XG4gICAgICAgIGlmIChtZXNzYWdlPy5pZCA9PT0gJ1dGX1VUSUxJVElFU19FVkVOVCcgJiYgbWVzc2FnZT8udHlwZSA9PT0gdHlwZSkge1xuICAgICAgICAgICAgY2IobWVzc2FnZS5kYXRhKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuIiwiaW1wb3J0IHsgaW5qZWN0U2NyaXB0IH0gZnJvbSAnLi4vc2hhcmVkL2xpYic7XG5sZXQgcHJpY2UgPSBudWxsO1xuZXhwb3J0IGZ1bmN0aW9uIGdldENyb3NzaGFpclByaWNlKCkge1xuICAgIHJldHVybiBwcmljZTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpbml0Q3Jvc3NoYWlyKCkge1xuICAgIGNvbnN0IHNjcmlwdFNyYyA9IGNocm9tZS5ydW50aW1lLmdldFVSTCgnc3RhdGljL3N0YXRpYy5qcycpO1xuICAgIGluamVjdFNjcmlwdChzY3JpcHRTcmMsICdib2R5Jyk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCAoZSkgPT4ge1xuICAgICAgICBpZiAoZT8uZGF0YT8udHlwZSA9PT0gJ3dmX19jcm9zc2hhaXJfcHJpY2UnKSB7XG4gICAgICAgICAgICBwcmljZSA9IE1hdGgucm91bmQoZS5kYXRhLnByaWNlICogMTAwMCkgLyAxMDAwO1xuICAgICAgICB9XG4gICAgfSk7XG59XG4iLCJpbXBvcnQgeyBzZW5kTWVzc2FnZSB9IGZyb20gJy4uL3NoYXJlZC9tZXNzYWdlcyc7XG5pbXBvcnQgeyBjdXJyZW50VGlja2VyIH0gZnJvbSAnLi90aWNrZXIuc2VydmljZSc7XG5jb25zdCByb290ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5yb290LnNldEF0dHJpYnV0ZSgnc3R5bGUnLCBgXG4gIHBvc2l0aW9uOiBmaXhlZDtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgZ2FwOiAxMHB4O1xuICB0b3A6IDJweDtcbiAgbGVmdDogMTA0MHB4O1xuICB3aWR0aDogMjAwcHg7XG4gIHBhZGRpbmc6IDVweDtcbiAgaGVpZ2h0OiAzNHB4O1xuICB6LWluZGV4OiA5OTk5O1xuICBib3JkZXItcmFkaXVzOiA0cHg7XG4gIGJhY2tncm91bmQ6ICNmM2YzZjM7XG4gIGxpbmUtaGVpZ2h0OiAxO1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuYCk7XG5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHJvb3QpO1xubGV0IG9yZGVycyA9IFtdO1xuZXhwb3J0IGZ1bmN0aW9uIHNldE9yZGVycyhkYXRhKSB7XG4gICAgcm9vdC5pbm5lckhUTUwgPSAnJztcbiAgICByb290LnN0eWxlLm9wYWNpdHkgPSAnMCc7XG4gICAgb3JkZXJzID0gZGF0YSB8fCBbXTtcbiAgICBpZiAoIW9yZGVycy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCB0aWNrZXIgPSBjdXJyZW50VGlja2VyKCk7XG4gICAgY29uc3Qgb3JkZXJzV2l0aFNhbWVUaWNrZXIgPSBvcmRlcnMuZmlsdGVyKChvKSA9PiB7XG4gICAgICAgIC8vIFRPRE86IEZCIDwtPiBNRVRBXG4gICAgICAgIHJldHVybiBvLnN5bWJvbC50b1VwcGVyQ2FzZSgpID09PSB0aWNrZXIudG9VcHBlckNhc2UoKTtcbiAgICB9KTtcbiAgICBpZiAoIW9yZGVyc1dpdGhTYW1lVGlja2VyLmxlbmd0aCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHJvb3Quc3R5bGUub3BhY2l0eSA9ICcxJztcbiAgICBwcm9maXRFbGVtZW50KG9yZGVyc1dpdGhTYW1lVGlja2VyLnJlZHVjZSgoYWNjLCBvKSA9PiBhY2MgKyBvLnByb2ZpdCwgMCkpO1xuICAgIHBvc2l0aW9uU2lkZShvcmRlcnNXaXRoU2FtZVRpY2tlclswXS50eXBlKTtcbiAgICBjbG9zZUJ1dHRvbih0aWNrZXIpO1xufVxuZnVuY3Rpb24gcHJvZml0RWxlbWVudCh0b3RhbFByb2ZpdCkge1xuICAgIGNvbnN0IHByb2ZpdEVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29uc3Qgc2lnbiA9IHRvdGFsUHJvZml0IDwgMCA/ICcnIDogdG90YWxQcm9maXQgPiAwID8gJysnIDogJyc7XG4gICAgY29uc3QgcHJvZml0Rm9ybWF0dGVkID0gbmV3IEludGwuTnVtYmVyRm9ybWF0KCdlbi1VUycsIHsgbWluaW11bUZyYWN0aW9uRGlnaXRzOiAyIH0pLmZvcm1hdCh0b3RhbFByb2ZpdCk7XG4gICAgcHJvZml0RWwuaW5uZXJIVE1MID0gYCR7c2lnbn0ke3Byb2ZpdEZvcm1hdHRlZH0kYDtcbiAgICBpZiAodG90YWxQcm9maXQgPiAwKSB7XG4gICAgICAgIHByb2ZpdEVsLnN0eWxlLmNvbG9yID0gJyMwYjcxZjMnO1xuICAgIH1cbiAgICBlbHNlIGlmICh0b3RhbFByb2ZpdCA8IDApIHtcbiAgICAgICAgcHJvZml0RWwuc3R5bGUuY29sb3IgPSAnI0UwNDg0Qyc7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBwcm9maXRFbC5zdHlsZS5jb2xvciA9ICcjNzc3JztcbiAgICB9XG4gICAgcm9vdC5hcHBlbmRDaGlsZChwcm9maXRFbCk7XG59XG5mdW5jdGlvbiBwb3NpdGlvblNpZGUodGlja2VyKSB7XG4gICAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBlbC5pbm5lckhUTUwgPSB0aWNrZXI7XG4gICAgcm9vdC5hcHBlbmRDaGlsZChlbCk7XG59XG5mdW5jdGlvbiBjbG9zZUJ1dHRvbih0aWNrZXIpIHtcbiAgICBjb25zdCBjbG9zZUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgY2xvc2VFbC50eXBlID0gJ2J1dHRvbic7XG4gICAgY2xvc2VFbC5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgYGRpc3BsYXk6IGJsb2NrO1xuICAgIHBhZGRpbmc6IDVweCA3cHg7XG4gICAgYm9yZGVyOiAwO1xuICAgIGJhY2tncm91bmQ6ICNmNDU5NTk7XG4gICAgY29sb3I6ICNmZmY7XG4gICAgYm9yZGVyLXJhZGl1czogNHB4O1xuICAgIGxpbmUtaGVpZ2h0OiAxO1xuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgbWFyZ2luLWxlZnQ6IGF1dG87XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIGApO1xuICAgIGNsb3NlRWwuaW5uZXJIVE1MID0gJ0Nsb3NlJztcbiAgICBjbG9zZUVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gc2VuZE1lc3NhZ2UoJ2Nsb3NlLWJ5LXRpY2tlcicsIHRpY2tlcikpO1xuICAgIHJvb3QuYXBwZW5kQ2hpbGQoY2xvc2VFbCk7XG59XG4iLCJpbXBvcnQgeyBsb29wIH0gZnJvbSAnLi4vc2hhcmVkL2xvb3AnO1xuaW1wb3J0IHsgc2VuZE1lc3NhZ2UgfSBmcm9tICcuLi9zaGFyZWQvbWVzc2FnZXMnO1xuZXhwb3J0IGZ1bmN0aW9uIGN1cnJlbnRUaWNrZXIoKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNoZWFkZXItdG9vbGJhci1zeW1ib2wtc2VhcmNoIC5qcy1idXR0b24tdGV4dCcpPy5pbm5lclRleHQgfHwgJyc7XG59XG5sZXQgbGFzdFRpY2tlciA9ICcnO1xuZXhwb3J0IGZ1bmN0aW9uIHdhdGNoVGlja2VyKGNiKSB7XG4gICAgbG9vcC5vbigndGljazEwJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBjdXJyZW50ID0gY3VycmVudFRpY2tlcigpO1xuICAgICAgICBpZiAoY3VycmVudCAmJiBsYXN0VGlja2VyICE9PSBjdXJyZW50KSB7XG4gICAgICAgICAgICBjYigpO1xuICAgICAgICAgICAgbGFzdFRpY2tlciA9IGN1cnJlbnQ7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiB0aWNrZXJFdmVudHMoKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgKCkgPT4ge1xuICAgICAgICBzZW5kTWVzc2FnZSgndGlja2VyJywgY3VycmVudFRpY2tlcigpKTtcbiAgICB9KTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcbiAgICAgICAgc2VuZE1lc3NhZ2UoJ3RpY2tlcicsIGN1cnJlbnRUaWNrZXIoKSk7XG4gICAgfSk7XG59XG4iLCJpbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJy4vaW5kZXguanMnXG5cbmV4cG9ydCB7IEV2ZW50RW1pdHRlciB9XG5leHBvcnQgZGVmYXVsdCBFdmVudEVtaXR0ZXJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgbG9nIH0gZnJvbSAnLi9zaGFyZWQvbG9nJztcbmltcG9ydCB7IGxvb3AgfSBmcm9tICcuL3NoYXJlZC9sb29wJztcbmltcG9ydCB7IG9uTWVzc2FnZSwgc2VuZE1lc3NhZ2UgfSBmcm9tICcuL3NoYXJlZC9tZXNzYWdlcyc7XG5pbXBvcnQgeyBnZXRDcm9zc2hhaXJQcmljZSwgaW5pdENyb3NzaGFpciB9IGZyb20gJy4vdHJhZGluZ3ZpZXcvY3Jvc3NoYWlyJztcbmltcG9ydCB7IHNldE9yZGVycyB9IGZyb20gJy4vdHJhZGluZ3ZpZXcvb3JkZXJzLnNlcnZpY2UnO1xuaW1wb3J0IHsgY3VycmVudFRpY2tlciwgdGlja2VyRXZlbnRzLCB3YXRjaFRpY2tlciB9IGZyb20gJy4vdHJhZGluZ3ZpZXcvdGlja2VyLnNlcnZpY2UnO1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XG4gICAgbG9vcC5zdGFydCgpO1xuICAgIGluaXRDcm9zc2hhaXIoKTtcbiAgICB0aWNrZXJFdmVudHMoKTtcbiAgICB3YXRjaFRpY2tlcigoKSA9PiB7XG4gICAgICAgIHNlbmRNZXNzYWdlKCd0aWNrZXInLCBjdXJyZW50VGlja2VyKCkpO1xuICAgIH0pO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgKGUpID0+IHtcbiAgICAgICAgaWYgKGUuY29kZSA9PT0gJ0tleUQnICYmIGUuY3RybEtleSkge1xuICAgICAgICAgICAgbG9nKCdTZW5kIG9yZGVyJywgZ2V0Q3Jvc3NoYWlyUHJpY2UoKSwgY3VycmVudFRpY2tlcigpKTtcbiAgICAgICAgICAgIHNlbmRNZXNzYWdlKCdvcmRlcicsIHsgcHJpY2U6IGdldENyb3NzaGFpclByaWNlKCksIHRpY2tlcjogY3VycmVudFRpY2tlcigpIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgb25NZXNzYWdlKCdvcmRlcnMnLCAob3JkZXJzKSA9PiBzZXRPcmRlcnMob3JkZXJzKSk7XG59KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==
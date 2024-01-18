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

/***/ "./src/config.ts":
/*!***********************!*\
  !*** ./src/config.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   config: () => (/* binding */ config),
/* harmony export */   getConfig: () => (/* binding */ getConfig),
/* harmony export */   saveConfig: () => (/* binding */ saveConfig)
/* harmony export */ });
/* harmony import */ var _shared_log__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shared/log */ "./src/shared/log.ts");

const DEFAULT_CONFIG = {
    maxLoss: 1, // in $
    leverage: 200,
};
// @ts-ignore
const config = { ...DEFAULT_CONFIG };
async function getConfig() {
    const storageData = await chrome.storage.local.get('WF_CONFIG');
    if (Object.keys(storageData?.WF_CONFIG || {}).length) {
        Object.entries(storageData.WF_CONFIG).forEach(([k, v]) => {
            // @ts-ignore
            config[k] = v;
        });
    }
    (0,_shared_log__WEBPACK_IMPORTED_MODULE_0__.log)('Config', config);
    return config;
}
async function saveConfig(data) {
    await chrome.storage.local.set({ ['WF_CONFIG']: JSON.parse(JSON.stringify(data)) });
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

/***/ "./src/shared/math.ts":
/*!****************************!*\
  !*** ./src/shared/math.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   calculatePositionSize: () => (/* binding */ calculatePositionSize)
/* harmony export */ });
/**
 * https://etpinvest.ru/position-size-calculator/
 * z = r / (l * (s - o));
 */
const roundLots = (value) => Math.floor(value * 100) / 100;
function calculatePositionSize(params) {
    const rawValue = params.maxLoss / (params.leverage * (params.closePrice - params.openPrice));
    return roundLots(Math.abs(rawValue));
}
// console.log(
//   calculatePositionSize({
//     openPrice: 25.92,
//     closePrice: 25.8,
//     maxLoss: 1,
//     leverage: 100,
//   }),
// );


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

/***/ "./src/shared/sound.ts":
/*!*****************************!*\
  !*** ./src/shared/sound.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   errorOrderSound: () => (/* binding */ errorOrderSound),
/* harmony export */   successOrderSound: () => (/* binding */ successOrderSound)
/* harmony export */ });
function successOrderSound() {
    const audio = new Audio(chrome.runtime.getURL('static/order-success.mp3'));
    audio.play();
}
function errorOrderSound() {
    const audio = new Audio(chrome.runtime.getURL('static/order-error.mp3'));
    audio.play();
}


/***/ }),

/***/ "./src/wforex/event.service.ts":
/*!*************************************!*\
  !*** ./src/wforex/event.service.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   cannotCloseOrder: () => (/* binding */ cannotCloseOrder),
/* harmony export */   onOrderClose: () => (/* binding */ onOrderClose)
/* harmony export */ });
/* harmony import */ var _shared_log__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shared/log */ "./src/shared/log.ts");

function onOrderClose(order) {
    (0,_shared_log__WEBPACK_IMPORTED_MODULE_0__.log)(`Closing: ${order.symbol}, loss: ${order.profit}`);
}
function cannotCloseOrder(order) {
    (0,_shared_log__WEBPACK_IMPORTED_MODULE_0__.log)(`Cannot close order: ${order.symbol}, loss: ${order.profit}`);
}


/***/ }),

/***/ "./src/wforex/lib/orders.ts":
/*!**********************************!*\
  !*** ./src/wforex/lib/orders.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getOrders: () => (/* binding */ getOrders)
/* harmony export */ });
/* harmony import */ var _shared_lib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shared/lib */ "./src/shared/lib.ts");
/* harmony import */ var _event_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../event.service */ "./src/wforex/event.service.ts");


function getHeaderColumns() {
    const headerRow = document.querySelector('.bot-panel .table .tbody .tr:first-child');
    const columns = {};
    [...(headerRow?.children || [])].forEach((column, index) => {
        const columnTitle = (column.getAttribute('title') || '').toLowerCase().replaceAll(' ', '_');
        if (columnTitle) {
            columns[columnTitle] = index;
        }
    });
    return columns;
}
function getOrders() {
    const columns = getHeaderColumns();
    const ordersElements = document.querySelectorAll('.bot-panel .table .tbody > div[data-id]');
    if (!Object.keys(columns).length || !ordersElements.length) {
        return [];
    }
    const data = [];
    ordersElements.forEach((order) => {
        const children = [...order.children];
        const closeElement = order.querySelector('.td button.close[title*="Close"]');
        const item = {};
        Object.entries(columns).forEach(([column, index]) => {
            // @ts-ignore
            item[column] = normalizeColumnValue(column, children[index].innerText.trim());
        });
        item.orderElement = order;
        item.close = () => {
            const time = parseInt(order.getAttribute('data-wf-closing') || '', 10);
            if (Number.isNaN(time) || Date.now() - time >= 300) {
                closeElement.click();
                order.setAttribute('data-wf-closing', `${Date.now()}`);
                const attempt = order.hasAttribute('data-wf-closing-attempt')
                    ? parseInt(order.getAttribute('data-wf-closing-attempt') || '', 10)
                    : 1;
                order.setAttribute('data-wf-closing-attempt', `${attempt + 1}`);
                if (attempt > 5) {
                    (0,_event_service__WEBPACK_IMPORTED_MODULE_1__.cannotCloseOrder)(item);
                    return false;
                }
                return true;
            }
            return false;
        };
        data.push(item);
    });
    return data;
}
function normalizeColumnValue(column, value) {
    if (column === 'symbol') {
        return (0,_shared_lib__WEBPACK_IMPORTED_MODULE_0__.normalizeTicker)(value);
    }
    if (column === 'time') {
        const date = new Date(`${new Date().getFullYear()}.${value}`);
        date.setHours(date.getHours() + 1);
        return date.toISOString();
    }
    if (column === 'type') {
        return value.toUpperCase();
    }
    if (['ticket', 'volume', 'open_price', 'stop_loss', 'take_profit', 'close_price', 'swap', 'profit'].includes(column)) {
        return value === '' ? null : parseFloat(value);
    }
    return value;
}


/***/ }),

/***/ "./src/wforex/loss-protector.ts":
/*!**************************************!*\
  !*** ./src/wforex/loss-protector.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   startLossProtection: () => (/* binding */ startLossProtection),
/* harmony export */   stopLossProtection: () => (/* binding */ stopLossProtection)
/* harmony export */ });
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config */ "./src/config.ts");
/* harmony import */ var _shared_log__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shared/log */ "./src/shared/log.ts");
/* harmony import */ var _shared_loop__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shared/loop */ "./src/shared/loop.ts");
/* harmony import */ var _shared_messages__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../shared/messages */ "./src/shared/messages.ts");
/* harmony import */ var _event_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./event.service */ "./src/wforex/event.service.ts");
/* harmony import */ var _lib_orders__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./lib/orders */ "./src/wforex/lib/orders.ts");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lodash-es */ "./node_modules/lodash-es/throttle.js");







const sendOrders = (0,lodash_es__WEBPACK_IMPORTED_MODULE_6__["default"])((data) => {
    (0,_shared_messages__WEBPACK_IMPORTED_MODULE_3__.sendMessage)('orders', data);
}, 250);
function onTick() {
    const orders = (0,_lib_orders__WEBPACK_IMPORTED_MODULE_5__.getOrders)();
    sendOrders(orders);
    orders.forEach((order) => {
        if (order.profit <= _config__WEBPACK_IMPORTED_MODULE_0__.config.maxLoss * -1) {
            if (order.close()) {
                (0,_event_service__WEBPACK_IMPORTED_MODULE_4__.onOrderClose)(order);
            }
        }
    });
}
function onTick20() {
    (0,_lib_orders__WEBPACK_IMPORTED_MODULE_5__.getOrders)().forEach((order) => {
        if (order.orderElement?.hasAttribute('data-manual-closed')) {
            if (order.close()) {
                (0,_event_service__WEBPACK_IMPORTED_MODULE_4__.onOrderClose)(order);
            }
        }
    });
}
function startLossProtection() {
    (0,_shared_log__WEBPACK_IMPORTED_MODULE_1__.log)('Start loss protection');
    _shared_loop__WEBPACK_IMPORTED_MODULE_2__.loop.on('tick', onTick);
    _shared_loop__WEBPACK_IMPORTED_MODULE_2__.loop.on('tick20', onTick20);
}
function stopLossProtection() {
    (0,_shared_log__WEBPACK_IMPORTED_MODULE_1__.log)('Stop loss protection');
    _shared_loop__WEBPACK_IMPORTED_MODULE_2__.loop.off('tick', onTick);
    _shared_loop__WEBPACK_IMPORTED_MODULE_2__.loop.off('tick20', onTick20);
}


/***/ }),

/***/ "./src/wforex/order.service.ts":
/*!*************************************!*\
  !*** ./src/wforex/order.service.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   closeOrderByTicker: () => (/* binding */ closeOrderByTicker),
/* harmony export */   createOrder: () => (/* binding */ createOrder)
/* harmony export */ });
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config */ "./src/config.ts");
/* harmony import */ var _shared_lib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shared/lib */ "./src/shared/lib.ts");
/* harmony import */ var _shared_log__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shared/log */ "./src/shared/log.ts");
/* harmony import */ var _shared_math__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../shared/math */ "./src/shared/math.ts");
/* harmony import */ var _lib_orders__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./lib/orders */ "./src/wforex/lib/orders.ts");
/* harmony import */ var _ticker_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ticker.service */ "./src/wforex/ticker.service.ts");
/* harmony import */ var _ui_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./ui.service */ "./src/wforex/ui.service.ts");







async function createOrder(data) {
    if ((0,_ticker_service__WEBPACK_IMPORTED_MODULE_5__.currentTicker)() !== data.ticker) {
        (0,_shared_log__WEBPACK_IMPORTED_MODULE_2__.log)(`Wrong ticker, changing to ${data.ticker}`);
        (0,_ticker_service__WEBPACK_IMPORTED_MODULE_5__.setTicker)(data.ticker);
        await (0,_shared_lib__WEBPACK_IMPORTED_MODULE_1__.frame)();
    }
    if ((0,_ticker_service__WEBPACK_IMPORTED_MODULE_5__.currentTicker)() !== data.ticker) {
        throw new Error('Cannot change ticker');
    }
    const { ask, bid, precision } = (0,_ticker_service__WEBPACK_IMPORTED_MODULE_5__.currentTickerAskBid)();
    if (data.price >= bid && data.price <= ask) {
        throw new Error('Too close!');
    }
    const side = data.price < bid ? 'BUY' : 'SELL';
    const openPrice = side === 'BUY' ? ask : bid;
    const accurateVolume = (0,_shared_math__WEBPACK_IMPORTED_MODULE_3__.calculatePositionSize)({
        openPrice,
        closePrice: data.price,
        leverage: _config__WEBPACK_IMPORTED_MODULE_0__.config.leverage,
        maxLoss: _config__WEBPACK_IMPORTED_MODULE_0__.config.maxLoss,
    });
    const openVolume = Math.max(0.01, accurateVolume);
    let minSl = side === 'BUY' ? bid - 0.21 : ask + 0.21;
    if (side === 'BUY' && minSl > data.price) {
        minSl = data.price;
    }
    else if (side === 'SELL' && minSl < data.price) {
        minSl = data.price;
    }
    (0,_ui_service__WEBPACK_IMPORTED_MODULE_6__.setVolume)(openVolume);
    (0,_ui_service__WEBPACK_IMPORTED_MODULE_6__.setStopLoss)(minSl);
    (0,_ui_service__WEBPACK_IMPORTED_MODULE_6__.setComment)(`SL=${(0,_shared_lib__WEBPACK_IMPORTED_MODULE_1__.roundPrice)(data.price, precision)}`);
    await (0,_shared_lib__WEBPACK_IMPORTED_MODULE_1__.frame)();
    (0,_ui_service__WEBPACK_IMPORTED_MODULE_6__.clickOnOpenOrder)(side);
    const statusMessage = await (0,_shared_lib__WEBPACK_IMPORTED_MODULE_1__.waitFor)(_ui_service__WEBPACK_IMPORTED_MODULE_6__.getStatusMessage, 3000);
    if (statusMessage !== 'done') {
        throw new Error(statusMessage);
    }
    (0,_shared_log__WEBPACK_IMPORTED_MODULE_2__.log)(`Open: ${side}, Price: ${openPrice}, S/L: ${(0,_shared_lib__WEBPACK_IMPORTED_MODULE_1__.roundPrice)(data.price, precision)}, Volume: ${openVolume}`);
}
function closeOrderByTicker(ticker) {
    const orders = (0,_lib_orders__WEBPACK_IMPORTED_MODULE_4__.getOrders)();
    orders.forEach((order) => {
        if (order.symbol === ticker) {
            order.orderElement?.setAttribute('data-manual-closed', 'true');
        }
    });
}


/***/ }),

/***/ "./src/wforex/ticker.service.ts":
/*!**************************************!*\
  !*** ./src/wforex/ticker.service.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   currentTicker: () => (/* binding */ currentTicker),
/* harmony export */   currentTickerAskBid: () => (/* binding */ currentTickerAskBid),
/* harmony export */   setTicker: () => (/* binding */ setTicker)
/* harmony export */ });
/* harmony import */ var _shared_lib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shared/lib */ "./src/shared/lib.ts");
/* harmony import */ var _shared_log__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shared/log */ "./src/shared/log.ts");
/* harmony import */ var _shared_sound__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shared/sound */ "./src/shared/sound.ts");



const activeTickerRow = `.market-watch > table > tbody > tr.active[title]`;
const TICKERS_MAP = { META: 'FB' };
function currentTicker() {
    const title = document.querySelector(activeTickerRow)?.getAttribute('title') || '';
    return (0,_shared_lib__WEBPACK_IMPORTED_MODULE_0__.normalizeTicker)(title);
}
function currentTickerAskBid() {
    const row = document.querySelector(activeTickerRow);
    if (!row) {
        throw new Error('Cannot find active ticker info');
    }
    // @ts-ignore
    const prices = [...row.querySelectorAll('.value.price')].map((i) => parseFloat(i.innerText));
    let precision = 2;
    try {
        // @ts-ignore
        precision = row.querySelector('.value.price').innerText.split('.')[1].length;
    }
    catch (e) {
        //
    }
    return {
        bid: prices[0],
        ask: prices[1],
        precision,
    };
}
function setTicker(ticker) {
    (0,_shared_log__WEBPACK_IMPORTED_MODULE_1__.log)(`Set ticker ${ticker}`);
    if (TICKERS_MAP[ticker]) {
        ticker = TICKERS_MAP[ticker];
    }
    const selectors = [
        `.market-watch > table > tbody > tr[title="${ticker}"]`,
        `.market-watch > table > tbody > tr[title="#${ticker}"]`,
    ];
    for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
            element.click();
            return;
        }
    }
}


/***/ }),

/***/ "./src/wforex/ui.service.ts":
/*!**********************************!*\
  !*** ./src/wforex/ui.service.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   autoOpenTradesSection: () => (/* binding */ autoOpenTradesSection),
/* harmony export */   clickOnOpenOrder: () => (/* binding */ clickOnOpenOrder),
/* harmony export */   closeStatusMessage: () => (/* binding */ closeStatusMessage),
/* harmony export */   getStatusMessage: () => (/* binding */ getStatusMessage),
/* harmony export */   keepOrderPanelOpen: () => (/* binding */ keepOrderPanelOpen),
/* harmony export */   keyboardShortcuts: () => (/* binding */ keyboardShortcuts),
/* harmony export */   setComment: () => (/* binding */ setComment),
/* harmony export */   setStopLoss: () => (/* binding */ setStopLoss),
/* harmony export */   setVolume: () => (/* binding */ setVolume),
/* harmony export */   waitForAppReady: () => (/* binding */ waitForAppReady)
/* harmony export */ });
/* harmony import */ var _shared_lib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shared/lib */ "./src/shared/lib.ts");
/* harmony import */ var _shared_loop__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shared/loop */ "./src/shared/loop.ts");


function keepOrderPanelOpen() {
    _shared_loop__WEBPACK_IMPORTED_MODULE_1__.loop.on('tick', () => {
        document.querySelector('.top-bar .group div[title*="Show Trade Form" i]')?.click();
    });
}
function closeStatusMessage() {
    document.querySelector('.left-panel .status .footer .trade-button')?.click();
}
function autoOpenTradesSection() {
    _shared_loop__WEBPACK_IMPORTED_MODULE_1__.loop.on('tick', () => {
        document.querySelector('.left-panel .icon-button[title="Trade"]:not(.checked)')?.click();
    });
}
function waitForAppReady() {
    return new Promise((resolve) => {
        function loop() {
            const markets = !!document.querySelector('.market-watch');
            const chart = !!document.querySelector('.chart canvas');
            const leftPanel = !!document.querySelector('.left-panel .layout');
            const checks = [markets, chart, leftPanel];
            if (checks.every((i) => i)) {
                return setTimeout(resolve, 1000);
            }
            requestAnimationFrame(loop);
        }
        loop();
        setTimeout(resolve, 4000);
    });
}
function keyboardShortcuts() {
    document.addEventListener('keyup', (e) => {
        if (e.code.includes('Digit') && !(0,_shared_lib__WEBPACK_IMPORTED_MODULE_0__.anyMetaKey)(e) && !(0,_shared_lib__WEBPACK_IMPORTED_MODULE_0__.eventInInput)(e)) {
            const key = parseInt(e.code.slice(-1), 10);
            const timeFrameRoot = document.querySelector('.top-bar .group:nth-child(3) .list-view');
            // @ts-ignore
            timeFrameRoot?.children[key - 1]?.click();
        }
    });
    document.addEventListener('keyup', (e) => {
        if (e.code === 'KeyR' && !(0,_shared_lib__WEBPACK_IMPORTED_MODULE_0__.anyMetaKey)(e) && !(0,_shared_lib__WEBPACK_IMPORTED_MODULE_0__.eventInInput)(e)) {
            document
                .querySelector('button[title*="reset chart" i]')
                ?.dispatchEvent(new Event('mousedown'));
        }
    });
}
function setStopLoss(val) {
    changeInput('.left-panel .sl label.input input', val, 'Stop loss input not found');
}
function setVolume(val) {
    changeInput('.left-panel .volume label.input input', val, 'Volume input not found');
}
function setComment(val) {
    changeInput('.left-panel .comment .value input', val, 'Comment input not found');
}
function clickOnOpenOrder(side) {
    const buttons = document.querySelectorAll('.left-panel .content .footer-row .trade-button');
    for (const button of buttons) {
        const texts = { BUY: 'buy by', SELL: 'sell by' };
        const text = texts[side];
        if (button.innerText.toLowerCase().includes(text)) {
            button.click();
            return;
        }
    }
    throw new Error('Cannot click on buy/sell buttons!');
}
function getStatusMessage() {
    const status = document.querySelector('.left-panel .wrap .status');
    // @ts-ignore
    return (status?.children[1].innerText || '').toLowerCase();
}
function changeInput(selector, value, text) {
    const input = document.querySelector(selector);
    if (!input) {
        throw new Error(text);
    }
    input.value = `${value}`;
    input.dispatchEvent(new Event('blur'));
    input.dispatchEvent(new Event('change'));
    input.dispatchEvent(new Event('input'));
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


/***/ }),

/***/ "./node_modules/lodash-es/_Symbol.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash-es/_Symbol.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _root_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_root.js */ "./node_modules/lodash-es/_root.js");


/** Built-in value references. */
var Symbol = _root_js__WEBPACK_IMPORTED_MODULE_0__["default"].Symbol;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Symbol);


/***/ }),

/***/ "./node_modules/lodash-es/_baseGetTag.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_baseGetTag.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_Symbol.js */ "./node_modules/lodash-es/_Symbol.js");
/* harmony import */ var _getRawTag_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_getRawTag.js */ "./node_modules/lodash-es/_getRawTag.js");
/* harmony import */ var _objectToString_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_objectToString.js */ "./node_modules/lodash-es/_objectToString.js");




/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = _Symbol_js__WEBPACK_IMPORTED_MODULE_0__["default"] ? _Symbol_js__WEBPACK_IMPORTED_MODULE_0__["default"].toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? (0,_getRawTag_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value)
    : (0,_objectToString_js__WEBPACK_IMPORTED_MODULE_2__["default"])(value);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseGetTag);


/***/ }),

/***/ "./node_modules/lodash-es/_baseTrim.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/_baseTrim.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _trimmedEndIndex_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_trimmedEndIndex.js */ "./node_modules/lodash-es/_trimmedEndIndex.js");


/** Used to match leading whitespace. */
var reTrimStart = /^\s+/;

/**
 * The base implementation of `_.trim`.
 *
 * @private
 * @param {string} string The string to trim.
 * @returns {string} Returns the trimmed string.
 */
function baseTrim(string) {
  return string
    ? string.slice(0, (0,_trimmedEndIndex_js__WEBPACK_IMPORTED_MODULE_0__["default"])(string) + 1).replace(reTrimStart, '')
    : string;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseTrim);


/***/ }),

/***/ "./node_modules/lodash-es/_freeGlobal.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_freeGlobal.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (freeGlobal);


/***/ }),

/***/ "./node_modules/lodash-es/_getRawTag.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash-es/_getRawTag.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_Symbol.js */ "./node_modules/lodash-es/_Symbol.js");


/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = _Symbol_js__WEBPACK_IMPORTED_MODULE_0__["default"] ? _Symbol_js__WEBPACK_IMPORTED_MODULE_0__["default"].toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getRawTag);


/***/ }),

/***/ "./node_modules/lodash-es/_objectToString.js":
/*!***************************************************!*\
  !*** ./node_modules/lodash-es/_objectToString.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (objectToString);


/***/ }),

/***/ "./node_modules/lodash-es/_root.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash-es/_root.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _freeGlobal_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_freeGlobal.js */ "./node_modules/lodash-es/_freeGlobal.js");


/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = _freeGlobal_js__WEBPACK_IMPORTED_MODULE_0__["default"] || freeSelf || Function('return this')();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (root);


/***/ }),

/***/ "./node_modules/lodash-es/_trimmedEndIndex.js":
/*!****************************************************!*\
  !*** ./node_modules/lodash-es/_trimmedEndIndex.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/** Used to match a single whitespace character. */
var reWhitespace = /\s/;

/**
 * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
 * character of `string`.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {number} Returns the index of the last non-whitespace character.
 */
function trimmedEndIndex(string) {
  var index = string.length;

  while (index-- && reWhitespace.test(string.charAt(index))) {}
  return index;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (trimmedEndIndex);


/***/ }),

/***/ "./node_modules/lodash-es/debounce.js":
/*!********************************************!*\
  !*** ./node_modules/lodash-es/debounce.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isObject.js */ "./node_modules/lodash-es/isObject.js");
/* harmony import */ var _now_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./now.js */ "./node_modules/lodash-es/now.js");
/* harmony import */ var _toNumber_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toNumber.js */ "./node_modules/lodash-es/toNumber.js");




/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = (0,_toNumber_js__WEBPACK_IMPORTED_MODULE_0__["default"])(wait) || 0;
  if ((0,_isObject_js__WEBPACK_IMPORTED_MODULE_1__["default"])(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax((0,_toNumber_js__WEBPACK_IMPORTED_MODULE_0__["default"])(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        timeWaiting = wait - timeSinceLastCall;

    return maxing
      ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = (0,_now_js__WEBPACK_IMPORTED_MODULE_2__["default"])();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge((0,_now_js__WEBPACK_IMPORTED_MODULE_2__["default"])());
  }

  function debounced() {
    var time = (0,_now_js__WEBPACK_IMPORTED_MODULE_2__["default"])(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (debounce);


/***/ }),

/***/ "./node_modules/lodash-es/isObject.js":
/*!********************************************!*\
  !*** ./node_modules/lodash-es/isObject.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isObject);


/***/ }),

/***/ "./node_modules/lodash-es/isObjectLike.js":
/*!************************************************!*\
  !*** ./node_modules/lodash-es/isObjectLike.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isObjectLike);


/***/ }),

/***/ "./node_modules/lodash-es/isSymbol.js":
/*!********************************************!*\
  !*** ./node_modules/lodash-es/isSymbol.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _baseGetTag_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseGetTag.js */ "./node_modules/lodash-es/_baseGetTag.js");
/* harmony import */ var _isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isObjectLike.js */ "./node_modules/lodash-es/isObjectLike.js");



/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    ((0,_isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value) && (0,_baseGetTag_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value) == symbolTag);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isSymbol);


/***/ }),

/***/ "./node_modules/lodash-es/now.js":
/*!***************************************!*\
  !*** ./node_modules/lodash-es/now.js ***!
  \***************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _root_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_root.js */ "./node_modules/lodash-es/_root.js");


/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return _root_js__WEBPACK_IMPORTED_MODULE_0__["default"].Date.now();
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (now);


/***/ }),

/***/ "./node_modules/lodash-es/throttle.js":
/*!********************************************!*\
  !*** ./node_modules/lodash-es/throttle.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _debounce_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./debounce.js */ "./node_modules/lodash-es/debounce.js");
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isObject.js */ "./node_modules/lodash-es/isObject.js");



/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if ((0,_isObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return (0,_debounce_js__WEBPACK_IMPORTED_MODULE_1__["default"])(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (throttle);


/***/ }),

/***/ "./node_modules/lodash-es/toNumber.js":
/*!********************************************!*\
  !*** ./node_modules/lodash-es/toNumber.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _baseTrim_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_baseTrim.js */ "./node_modules/lodash-es/_baseTrim.js");
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isObject.js */ "./node_modules/lodash-es/isObject.js");
/* harmony import */ var _isSymbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isSymbol.js */ "./node_modules/lodash-es/isSymbol.js");




/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if ((0,_isSymbol_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value)) {
    return NAN;
  }
  if ((0,_isObject_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = (0,_isObject_js__WEBPACK_IMPORTED_MODULE_1__["default"])(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = (0,_baseTrim_js__WEBPACK_IMPORTED_MODULE_2__["default"])(value);
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (toNumber);


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
/*!*****************************!*\
  !*** ./src/wforex-entry.ts ***!
  \*****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config */ "./src/config.ts");
/* harmony import */ var _shared_log__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./shared/log */ "./src/shared/log.ts");
/* harmony import */ var _shared_loop__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./shared/loop */ "./src/shared/loop.ts");
/* harmony import */ var _shared_messages__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./shared/messages */ "./src/shared/messages.ts");
/* harmony import */ var _shared_sound__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./shared/sound */ "./src/shared/sound.ts");
/* harmony import */ var _wforex_loss_protector__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./wforex/loss-protector */ "./src/wforex/loss-protector.ts");
/* harmony import */ var _wforex_order_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./wforex/order.service */ "./src/wforex/order.service.ts");
/* harmony import */ var _wforex_ticker_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./wforex/ticker.service */ "./src/wforex/ticker.service.ts");
/* harmony import */ var _wforex_ui_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./wforex/ui.service */ "./src/wforex/ui.service.ts");









async function main() {
    await (0,_config__WEBPACK_IMPORTED_MODULE_0__.getConfig)();
    _shared_loop__WEBPACK_IMPORTED_MODULE_2__.loop.start();
    (0,_wforex_ui_service__WEBPACK_IMPORTED_MODULE_8__.keepOrderPanelOpen)();
    (0,_wforex_ui_service__WEBPACK_IMPORTED_MODULE_8__.autoOpenTradesSection)();
    //
    await (0,_wforex_ui_service__WEBPACK_IMPORTED_MODULE_8__.waitForAppReady)();
    // -
    (0,_shared_log__WEBPACK_IMPORTED_MODULE_1__.log)('App is ready');
    (0,_wforex_ui_service__WEBPACK_IMPORTED_MODULE_8__.keyboardShortcuts)();
    (0,_wforex_loss_protector__WEBPACK_IMPORTED_MODULE_5__.startLossProtection)();
    (0,_shared_messages__WEBPACK_IMPORTED_MODULE_3__.onMessage)('ticker', _wforex_ticker_service__WEBPACK_IMPORTED_MODULE_7__.setTicker);
    (0,_shared_messages__WEBPACK_IMPORTED_MODULE_3__.onMessage)('order', async (msg) => {
        (0,_wforex_order_service__WEBPACK_IMPORTED_MODULE_6__.createOrder)(msg)
            .then(() => {
            (0,_shared_sound__WEBPACK_IMPORTED_MODULE_4__.successOrderSound)();
        })
            .catch((e) => {
            (0,_shared_sound__WEBPACK_IMPORTED_MODULE_4__.errorOrderSound)();
            (0,_shared_log__WEBPACK_IMPORTED_MODULE_1__.log)(e.message);
        })
            .finally(() => {
            (0,_wforex_ui_service__WEBPACK_IMPORTED_MODULE_8__.closeStatusMessage)();
        });
    });
    (0,_shared_messages__WEBPACK_IMPORTED_MODULE_3__.onMessage)('close-by-ticker', _wforex_order_service__WEBPACK_IMPORTED_MODULE_6__.closeOrderByTicker);
}
main().catch(console.error);

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFlO0FBQ3pCO0FBQ0EsSUFBSSxnREFBRztBQUNQLElBQUkscUVBQWlCO0FBQ3JCLElBQUksMkVBQW1CO0FBQ3ZCLElBQUksMkRBQVMsV0FBVyw2REFBUztBQUNqQyxJQUFJLDJEQUFTO0FBQ2IsUUFBUSxrRUFBVztBQUNuQjtBQUNBLFlBQVksZ0VBQWlCO0FBQzdCLFNBQVM7QUFDVDtBQUNBLFlBQVksOERBQWU7QUFDM0IsWUFBWSxnREFBRztBQUNmLFNBQVM7QUFDVDtBQUNBLFlBQVksc0VBQWtCO0FBQzlCLFNBQVM7QUFDVCxLQUFLO0FBQ0wsSUFBSSwyREFBUyxvQkFBb0IscUVBQWtCO0FBQ25EO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93Zi11dGlsaXRpZXMvLi9ub2RlX21vZHVsZXMvZXZlbnRlbWl0dGVyMy9pbmRleC5qcyIsIndlYnBhY2s6Ly93Zi11dGlsaXRpZXMvLi9zcmMvY29uZmlnLnRzIiwid2VicGFjazovL3dmLXV0aWxpdGllcy8uL3NyYy9zaGFyZWQvbGliLnRzIiwid2VicGFjazovL3dmLXV0aWxpdGllcy8uL3NyYy9zaGFyZWQvbG9nLnRzIiwid2VicGFjazovL3dmLXV0aWxpdGllcy8uL3NyYy9zaGFyZWQvbG9vcC50cyIsIndlYnBhY2s6Ly93Zi11dGlsaXRpZXMvLi9zcmMvc2hhcmVkL21hdGgudHMiLCJ3ZWJwYWNrOi8vd2YtdXRpbGl0aWVzLy4vc3JjL3NoYXJlZC9tZXNzYWdlcy50cyIsIndlYnBhY2s6Ly93Zi11dGlsaXRpZXMvLi9zcmMvc2hhcmVkL3NvdW5kLnRzIiwid2VicGFjazovL3dmLXV0aWxpdGllcy8uL3NyYy93Zm9yZXgvZXZlbnQuc2VydmljZS50cyIsIndlYnBhY2s6Ly93Zi11dGlsaXRpZXMvLi9zcmMvd2ZvcmV4L2xpYi9vcmRlcnMudHMiLCJ3ZWJwYWNrOi8vd2YtdXRpbGl0aWVzLy4vc3JjL3dmb3JleC9sb3NzLXByb3RlY3Rvci50cyIsIndlYnBhY2s6Ly93Zi11dGlsaXRpZXMvLi9zcmMvd2ZvcmV4L29yZGVyLnNlcnZpY2UudHMiLCJ3ZWJwYWNrOi8vd2YtdXRpbGl0aWVzLy4vc3JjL3dmb3JleC90aWNrZXIuc2VydmljZS50cyIsIndlYnBhY2s6Ly93Zi11dGlsaXRpZXMvLi9zcmMvd2ZvcmV4L3VpLnNlcnZpY2UudHMiLCJ3ZWJwYWNrOi8vd2YtdXRpbGl0aWVzLy4vbm9kZV9tb2R1bGVzL2V2ZW50ZW1pdHRlcjMvaW5kZXgubWpzIiwid2VicGFjazovL3dmLXV0aWxpdGllcy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX1N5bWJvbC5qcyIsIndlYnBhY2s6Ly93Zi11dGlsaXRpZXMvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL19iYXNlR2V0VGFnLmpzIiwid2VicGFjazovL3dmLXV0aWxpdGllcy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2Jhc2VUcmltLmpzIiwid2VicGFjazovL3dmLXV0aWxpdGllcy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX2ZyZWVHbG9iYWwuanMiLCJ3ZWJwYWNrOi8vd2YtdXRpbGl0aWVzLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fZ2V0UmF3VGFnLmpzIiwid2VicGFjazovL3dmLXV0aWxpdGllcy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX29iamVjdFRvU3RyaW5nLmpzIiwid2VicGFjazovL3dmLXV0aWxpdGllcy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvX3Jvb3QuanMiLCJ3ZWJwYWNrOi8vd2YtdXRpbGl0aWVzLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9fdHJpbW1lZEVuZEluZGV4LmpzIiwid2VicGFjazovL3dmLXV0aWxpdGllcy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvZGVib3VuY2UuanMiLCJ3ZWJwYWNrOi8vd2YtdXRpbGl0aWVzLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy9pc09iamVjdC5qcyIsIndlYnBhY2s6Ly93Zi11dGlsaXRpZXMvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL2lzT2JqZWN0TGlrZS5qcyIsIndlYnBhY2s6Ly93Zi11dGlsaXRpZXMvLi9ub2RlX21vZHVsZXMvbG9kYXNoLWVzL2lzU3ltYm9sLmpzIiwid2VicGFjazovL3dmLXV0aWxpdGllcy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvbm93LmpzIiwid2VicGFjazovL3dmLXV0aWxpdGllcy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gtZXMvdGhyb3R0bGUuanMiLCJ3ZWJwYWNrOi8vd2YtdXRpbGl0aWVzLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC1lcy90b051bWJlci5qcyIsIndlYnBhY2s6Ly93Zi11dGlsaXRpZXMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vd2YtdXRpbGl0aWVzL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly93Zi11dGlsaXRpZXMvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly93Zi11dGlsaXRpZXMvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly93Zi11dGlsaXRpZXMvLi9zcmMvd2ZvcmV4LWVudHJ5LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIGhhcyA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHlcbiAgLCBwcmVmaXggPSAnfic7XG5cbi8qKlxuICogQ29uc3RydWN0b3IgdG8gY3JlYXRlIGEgc3RvcmFnZSBmb3Igb3VyIGBFRWAgb2JqZWN0cy5cbiAqIEFuIGBFdmVudHNgIGluc3RhbmNlIGlzIGEgcGxhaW4gb2JqZWN0IHdob3NlIHByb3BlcnRpZXMgYXJlIGV2ZW50IG5hbWVzLlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gRXZlbnRzKCkge31cblxuLy9cbi8vIFdlIHRyeSB0byBub3QgaW5oZXJpdCBmcm9tIGBPYmplY3QucHJvdG90eXBlYC4gSW4gc29tZSBlbmdpbmVzIGNyZWF0aW5nIGFuXG4vLyBpbnN0YW5jZSBpbiB0aGlzIHdheSBpcyBmYXN0ZXIgdGhhbiBjYWxsaW5nIGBPYmplY3QuY3JlYXRlKG51bGwpYCBkaXJlY3RseS5cbi8vIElmIGBPYmplY3QuY3JlYXRlKG51bGwpYCBpcyBub3Qgc3VwcG9ydGVkIHdlIHByZWZpeCB0aGUgZXZlbnQgbmFtZXMgd2l0aCBhXG4vLyBjaGFyYWN0ZXIgdG8gbWFrZSBzdXJlIHRoYXQgdGhlIGJ1aWx0LWluIG9iamVjdCBwcm9wZXJ0aWVzIGFyZSBub3Rcbi8vIG92ZXJyaWRkZW4gb3IgdXNlZCBhcyBhbiBhdHRhY2sgdmVjdG9yLlxuLy9cbmlmIChPYmplY3QuY3JlYXRlKSB7XG4gIEV2ZW50cy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4gIC8vXG4gIC8vIFRoaXMgaGFjayBpcyBuZWVkZWQgYmVjYXVzZSB0aGUgYF9fcHJvdG9fX2AgcHJvcGVydHkgaXMgc3RpbGwgaW5oZXJpdGVkIGluXG4gIC8vIHNvbWUgb2xkIGJyb3dzZXJzIGxpa2UgQW5kcm9pZCA0LCBpUGhvbmUgNS4xLCBPcGVyYSAxMSBhbmQgU2FmYXJpIDUuXG4gIC8vXG4gIGlmICghbmV3IEV2ZW50cygpLl9fcHJvdG9fXykgcHJlZml4ID0gZmFsc2U7XG59XG5cbi8qKlxuICogUmVwcmVzZW50YXRpb24gb2YgYSBzaW5nbGUgZXZlbnQgbGlzdGVuZXIuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGxpc3RlbmVyIGZ1bmN0aW9uLlxuICogQHBhcmFtIHsqfSBjb250ZXh0IFRoZSBjb250ZXh0IHRvIGludm9rZSB0aGUgbGlzdGVuZXIgd2l0aC5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29uY2U9ZmFsc2VdIFNwZWNpZnkgaWYgdGhlIGxpc3RlbmVyIGlzIGEgb25lLXRpbWUgbGlzdGVuZXIuXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIEVFKGZuLCBjb250ZXh0LCBvbmNlKSB7XG4gIHRoaXMuZm4gPSBmbjtcbiAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgdGhpcy5vbmNlID0gb25jZSB8fCBmYWxzZTtcbn1cblxuLyoqXG4gKiBBZGQgYSBsaXN0ZW5lciBmb3IgYSBnaXZlbiBldmVudC5cbiAqXG4gKiBAcGFyYW0ge0V2ZW50RW1pdHRlcn0gZW1pdHRlciBSZWZlcmVuY2UgdG8gdGhlIGBFdmVudEVtaXR0ZXJgIGluc3RhbmNlLlxuICogQHBhcmFtIHsoU3RyaW5nfFN5bWJvbCl9IGV2ZW50IFRoZSBldmVudCBuYW1lLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGxpc3RlbmVyIGZ1bmN0aW9uLlxuICogQHBhcmFtIHsqfSBjb250ZXh0IFRoZSBjb250ZXh0IHRvIGludm9rZSB0aGUgbGlzdGVuZXIgd2l0aC5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gb25jZSBTcGVjaWZ5IGlmIHRoZSBsaXN0ZW5lciBpcyBhIG9uZS10aW1lIGxpc3RlbmVyLlxuICogQHJldHVybnMge0V2ZW50RW1pdHRlcn1cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGFkZExpc3RlbmVyKGVtaXR0ZXIsIGV2ZW50LCBmbiwgY29udGV4dCwgb25jZSkge1xuICBpZiAodHlwZW9mIGZuICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIGxpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuICB9XG5cbiAgdmFyIGxpc3RlbmVyID0gbmV3IEVFKGZuLCBjb250ZXh0IHx8IGVtaXR0ZXIsIG9uY2UpXG4gICAgLCBldnQgPSBwcmVmaXggPyBwcmVmaXggKyBldmVudCA6IGV2ZW50O1xuXG4gIGlmICghZW1pdHRlci5fZXZlbnRzW2V2dF0pIGVtaXR0ZXIuX2V2ZW50c1tldnRdID0gbGlzdGVuZXIsIGVtaXR0ZXIuX2V2ZW50c0NvdW50Kys7XG4gIGVsc2UgaWYgKCFlbWl0dGVyLl9ldmVudHNbZXZ0XS5mbikgZW1pdHRlci5fZXZlbnRzW2V2dF0ucHVzaChsaXN0ZW5lcik7XG4gIGVsc2UgZW1pdHRlci5fZXZlbnRzW2V2dF0gPSBbZW1pdHRlci5fZXZlbnRzW2V2dF0sIGxpc3RlbmVyXTtcblxuICByZXR1cm4gZW1pdHRlcjtcbn1cblxuLyoqXG4gKiBDbGVhciBldmVudCBieSBuYW1lLlxuICpcbiAqIEBwYXJhbSB7RXZlbnRFbWl0dGVyfSBlbWl0dGVyIFJlZmVyZW5jZSB0byB0aGUgYEV2ZW50RW1pdHRlcmAgaW5zdGFuY2UuXG4gKiBAcGFyYW0geyhTdHJpbmd8U3ltYm9sKX0gZXZ0IFRoZSBFdmVudCBuYW1lLlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gY2xlYXJFdmVudChlbWl0dGVyLCBldnQpIHtcbiAgaWYgKC0tZW1pdHRlci5fZXZlbnRzQ291bnQgPT09IDApIGVtaXR0ZXIuX2V2ZW50cyA9IG5ldyBFdmVudHMoKTtcbiAgZWxzZSBkZWxldGUgZW1pdHRlci5fZXZlbnRzW2V2dF07XG59XG5cbi8qKlxuICogTWluaW1hbCBgRXZlbnRFbWl0dGVyYCBpbnRlcmZhY2UgdGhhdCBpcyBtb2xkZWQgYWdhaW5zdCB0aGUgTm9kZS5qc1xuICogYEV2ZW50RW1pdHRlcmAgaW50ZXJmYWNlLlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQHB1YmxpY1xuICovXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIHRoaXMuX2V2ZW50cyA9IG5ldyBFdmVudHMoKTtcbiAgdGhpcy5fZXZlbnRzQ291bnQgPSAwO1xufVxuXG4vKipcbiAqIFJldHVybiBhbiBhcnJheSBsaXN0aW5nIHRoZSBldmVudHMgZm9yIHdoaWNoIHRoZSBlbWl0dGVyIGhhcyByZWdpc3RlcmVkXG4gKiBsaXN0ZW5lcnMuXG4gKlxuICogQHJldHVybnMge0FycmF5fVxuICogQHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmV2ZW50TmFtZXMgPSBmdW5jdGlvbiBldmVudE5hbWVzKCkge1xuICB2YXIgbmFtZXMgPSBbXVxuICAgICwgZXZlbnRzXG4gICAgLCBuYW1lO1xuXG4gIGlmICh0aGlzLl9ldmVudHNDb3VudCA9PT0gMCkgcmV0dXJuIG5hbWVzO1xuXG4gIGZvciAobmFtZSBpbiAoZXZlbnRzID0gdGhpcy5fZXZlbnRzKSkge1xuICAgIGlmIChoYXMuY2FsbChldmVudHMsIG5hbWUpKSBuYW1lcy5wdXNoKHByZWZpeCA/IG5hbWUuc2xpY2UoMSkgOiBuYW1lKTtcbiAgfVxuXG4gIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG4gICAgcmV0dXJuIG5hbWVzLmNvbmNhdChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKGV2ZW50cykpO1xuICB9XG5cbiAgcmV0dXJuIG5hbWVzO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gdGhlIGxpc3RlbmVycyByZWdpc3RlcmVkIGZvciBhIGdpdmVuIGV2ZW50LlxuICpcbiAqIEBwYXJhbSB7KFN0cmluZ3xTeW1ib2wpfSBldmVudCBUaGUgZXZlbnQgbmFtZS5cbiAqIEByZXR1cm5zIHtBcnJheX0gVGhlIHJlZ2lzdGVyZWQgbGlzdGVuZXJzLlxuICogQHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uIGxpc3RlbmVycyhldmVudCkge1xuICB2YXIgZXZ0ID0gcHJlZml4ID8gcHJlZml4ICsgZXZlbnQgOiBldmVudFxuICAgICwgaGFuZGxlcnMgPSB0aGlzLl9ldmVudHNbZXZ0XTtcblxuICBpZiAoIWhhbmRsZXJzKSByZXR1cm4gW107XG4gIGlmIChoYW5kbGVycy5mbikgcmV0dXJuIFtoYW5kbGVycy5mbl07XG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBoYW5kbGVycy5sZW5ndGgsIGVlID0gbmV3IEFycmF5KGwpOyBpIDwgbDsgaSsrKSB7XG4gICAgZWVbaV0gPSBoYW5kbGVyc1tpXS5mbjtcbiAgfVxuXG4gIHJldHVybiBlZTtcbn07XG5cbi8qKlxuICogUmV0dXJuIHRoZSBudW1iZXIgb2YgbGlzdGVuZXJzIGxpc3RlbmluZyB0byBhIGdpdmVuIGV2ZW50LlxuICpcbiAqIEBwYXJhbSB7KFN0cmluZ3xTeW1ib2wpfSBldmVudCBUaGUgZXZlbnQgbmFtZS5cbiAqIEByZXR1cm5zIHtOdW1iZXJ9IFRoZSBudW1iZXIgb2YgbGlzdGVuZXJzLlxuICogQHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbiBsaXN0ZW5lckNvdW50KGV2ZW50KSB7XG4gIHZhciBldnQgPSBwcmVmaXggPyBwcmVmaXggKyBldmVudCA6IGV2ZW50XG4gICAgLCBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbZXZ0XTtcblxuICBpZiAoIWxpc3RlbmVycykgcmV0dXJuIDA7XG4gIGlmIChsaXN0ZW5lcnMuZm4pIHJldHVybiAxO1xuICByZXR1cm4gbGlzdGVuZXJzLmxlbmd0aDtcbn07XG5cbi8qKlxuICogQ2FsbHMgZWFjaCBvZiB0aGUgbGlzdGVuZXJzIHJlZ2lzdGVyZWQgZm9yIGEgZ2l2ZW4gZXZlbnQuXG4gKlxuICogQHBhcmFtIHsoU3RyaW5nfFN5bWJvbCl9IGV2ZW50IFRoZSBldmVudCBuYW1lLlxuICogQHJldHVybnMge0Jvb2xlYW59IGB0cnVlYCBpZiB0aGUgZXZlbnQgaGFkIGxpc3RlbmVycywgZWxzZSBgZmFsc2VgLlxuICogQHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbiBlbWl0KGV2ZW50LCBhMSwgYTIsIGEzLCBhNCwgYTUpIHtcbiAgdmFyIGV2dCA9IHByZWZpeCA/IHByZWZpeCArIGV2ZW50IDogZXZlbnQ7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbZXZ0XSkgcmV0dXJuIGZhbHNlO1xuXG4gIHZhciBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbZXZ0XVxuICAgICwgbGVuID0gYXJndW1lbnRzLmxlbmd0aFxuICAgICwgYXJnc1xuICAgICwgaTtcblxuICBpZiAobGlzdGVuZXJzLmZuKSB7XG4gICAgaWYgKGxpc3RlbmVycy5vbmNlKSB0aGlzLnJlbW92ZUxpc3RlbmVyKGV2ZW50LCBsaXN0ZW5lcnMuZm4sIHVuZGVmaW5lZCwgdHJ1ZSk7XG5cbiAgICBzd2l0Y2ggKGxlbikge1xuICAgICAgY2FzZSAxOiByZXR1cm4gbGlzdGVuZXJzLmZuLmNhbGwobGlzdGVuZXJzLmNvbnRleHQpLCB0cnVlO1xuICAgICAgY2FzZSAyOiByZXR1cm4gbGlzdGVuZXJzLmZuLmNhbGwobGlzdGVuZXJzLmNvbnRleHQsIGExKSwgdHJ1ZTtcbiAgICAgIGNhc2UgMzogcmV0dXJuIGxpc3RlbmVycy5mbi5jYWxsKGxpc3RlbmVycy5jb250ZXh0LCBhMSwgYTIpLCB0cnVlO1xuICAgICAgY2FzZSA0OiByZXR1cm4gbGlzdGVuZXJzLmZuLmNhbGwobGlzdGVuZXJzLmNvbnRleHQsIGExLCBhMiwgYTMpLCB0cnVlO1xuICAgICAgY2FzZSA1OiByZXR1cm4gbGlzdGVuZXJzLmZuLmNhbGwobGlzdGVuZXJzLmNvbnRleHQsIGExLCBhMiwgYTMsIGE0KSwgdHJ1ZTtcbiAgICAgIGNhc2UgNjogcmV0dXJuIGxpc3RlbmVycy5mbi5jYWxsKGxpc3RlbmVycy5jb250ZXh0LCBhMSwgYTIsIGEzLCBhNCwgYTUpLCB0cnVlO1xuICAgIH1cblxuICAgIGZvciAoaSA9IDEsIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0xKTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICB9XG5cbiAgICBsaXN0ZW5lcnMuZm4uYXBwbHkobGlzdGVuZXJzLmNvbnRleHQsIGFyZ3MpO1xuICB9IGVsc2Uge1xuICAgIHZhciBsZW5ndGggPSBsaXN0ZW5lcnMubGVuZ3RoXG4gICAgICAsIGo7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChsaXN0ZW5lcnNbaV0ub25jZSkgdGhpcy5yZW1vdmVMaXN0ZW5lcihldmVudCwgbGlzdGVuZXJzW2ldLmZuLCB1bmRlZmluZWQsIHRydWUpO1xuXG4gICAgICBzd2l0Y2ggKGxlbikge1xuICAgICAgICBjYXNlIDE6IGxpc3RlbmVyc1tpXS5mbi5jYWxsKGxpc3RlbmVyc1tpXS5jb250ZXh0KTsgYnJlYWs7XG4gICAgICAgIGNhc2UgMjogbGlzdGVuZXJzW2ldLmZuLmNhbGwobGlzdGVuZXJzW2ldLmNvbnRleHQsIGExKTsgYnJlYWs7XG4gICAgICAgIGNhc2UgMzogbGlzdGVuZXJzW2ldLmZuLmNhbGwobGlzdGVuZXJzW2ldLmNvbnRleHQsIGExLCBhMik7IGJyZWFrO1xuICAgICAgICBjYXNlIDQ6IGxpc3RlbmVyc1tpXS5mbi5jYWxsKGxpc3RlbmVyc1tpXS5jb250ZXh0LCBhMSwgYTIsIGEzKTsgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgaWYgKCFhcmdzKSBmb3IgKGogPSAxLCBhcmdzID0gbmV3IEFycmF5KGxlbiAtMSk7IGogPCBsZW47IGorKykge1xuICAgICAgICAgICAgYXJnc1tqIC0gMV0gPSBhcmd1bWVudHNbal07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbGlzdGVuZXJzW2ldLmZuLmFwcGx5KGxpc3RlbmVyc1tpXS5jb250ZXh0LCBhcmdzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbi8qKlxuICogQWRkIGEgbGlzdGVuZXIgZm9yIGEgZ2l2ZW4gZXZlbnQuXG4gKlxuICogQHBhcmFtIHsoU3RyaW5nfFN5bWJvbCl9IGV2ZW50IFRoZSBldmVudCBuYW1lLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGxpc3RlbmVyIGZ1bmN0aW9uLlxuICogQHBhcmFtIHsqfSBbY29udGV4dD10aGlzXSBUaGUgY29udGV4dCB0byBpbnZva2UgdGhlIGxpc3RlbmVyIHdpdGguXG4gKiBAcmV0dXJucyB7RXZlbnRFbWl0dGVyfSBgdGhpc2AuXG4gKiBAcHVibGljXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBmdW5jdGlvbiBvbihldmVudCwgZm4sIGNvbnRleHQpIHtcbiAgcmV0dXJuIGFkZExpc3RlbmVyKHRoaXMsIGV2ZW50LCBmbiwgY29udGV4dCwgZmFsc2UpO1xufTtcblxuLyoqXG4gKiBBZGQgYSBvbmUtdGltZSBsaXN0ZW5lciBmb3IgYSBnaXZlbiBldmVudC5cbiAqXG4gKiBAcGFyYW0geyhTdHJpbmd8U3ltYm9sKX0gZXZlbnQgVGhlIGV2ZW50IG5hbWUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgbGlzdGVuZXIgZnVuY3Rpb24uXG4gKiBAcGFyYW0geyp9IFtjb250ZXh0PXRoaXNdIFRoZSBjb250ZXh0IHRvIGludm9rZSB0aGUgbGlzdGVuZXIgd2l0aC5cbiAqIEByZXR1cm5zIHtFdmVudEVtaXR0ZXJ9IGB0aGlzYC5cbiAqIEBwdWJsaWNcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24gb25jZShldmVudCwgZm4sIGNvbnRleHQpIHtcbiAgcmV0dXJuIGFkZExpc3RlbmVyKHRoaXMsIGV2ZW50LCBmbiwgY29udGV4dCwgdHJ1ZSk7XG59O1xuXG4vKipcbiAqIFJlbW92ZSB0aGUgbGlzdGVuZXJzIG9mIGEgZ2l2ZW4gZXZlbnQuXG4gKlxuICogQHBhcmFtIHsoU3RyaW5nfFN5bWJvbCl9IGV2ZW50IFRoZSBldmVudCBuYW1lLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gT25seSByZW1vdmUgdGhlIGxpc3RlbmVycyB0aGF0IG1hdGNoIHRoaXMgZnVuY3Rpb24uXG4gKiBAcGFyYW0geyp9IGNvbnRleHQgT25seSByZW1vdmUgdGhlIGxpc3RlbmVycyB0aGF0IGhhdmUgdGhpcyBjb250ZXh0LlxuICogQHBhcmFtIHtCb29sZWFufSBvbmNlIE9ubHkgcmVtb3ZlIG9uZS10aW1lIGxpc3RlbmVycy5cbiAqIEByZXR1cm5zIHtFdmVudEVtaXR0ZXJ9IGB0aGlzYC5cbiAqIEBwdWJsaWNcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uIHJlbW92ZUxpc3RlbmVyKGV2ZW50LCBmbiwgY29udGV4dCwgb25jZSkge1xuICB2YXIgZXZ0ID0gcHJlZml4ID8gcHJlZml4ICsgZXZlbnQgOiBldmVudDtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1tldnRdKSByZXR1cm4gdGhpcztcbiAgaWYgKCFmbikge1xuICAgIGNsZWFyRXZlbnQodGhpcywgZXZ0KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHZhciBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbZXZ0XTtcblxuICBpZiAobGlzdGVuZXJzLmZuKSB7XG4gICAgaWYgKFxuICAgICAgbGlzdGVuZXJzLmZuID09PSBmbiAmJlxuICAgICAgKCFvbmNlIHx8IGxpc3RlbmVycy5vbmNlKSAmJlxuICAgICAgKCFjb250ZXh0IHx8IGxpc3RlbmVycy5jb250ZXh0ID09PSBjb250ZXh0KVxuICAgICkge1xuICAgICAgY2xlYXJFdmVudCh0aGlzLCBldnQpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBmb3IgKHZhciBpID0gMCwgZXZlbnRzID0gW10sIGxlbmd0aCA9IGxpc3RlbmVycy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKFxuICAgICAgICBsaXN0ZW5lcnNbaV0uZm4gIT09IGZuIHx8XG4gICAgICAgIChvbmNlICYmICFsaXN0ZW5lcnNbaV0ub25jZSkgfHxcbiAgICAgICAgKGNvbnRleHQgJiYgbGlzdGVuZXJzW2ldLmNvbnRleHQgIT09IGNvbnRleHQpXG4gICAgICApIHtcbiAgICAgICAgZXZlbnRzLnB1c2gobGlzdGVuZXJzW2ldKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvL1xuICAgIC8vIFJlc2V0IHRoZSBhcnJheSwgb3IgcmVtb3ZlIGl0IGNvbXBsZXRlbHkgaWYgd2UgaGF2ZSBubyBtb3JlIGxpc3RlbmVycy5cbiAgICAvL1xuICAgIGlmIChldmVudHMubGVuZ3RoKSB0aGlzLl9ldmVudHNbZXZ0XSA9IGV2ZW50cy5sZW5ndGggPT09IDEgPyBldmVudHNbMF0gOiBldmVudHM7XG4gICAgZWxzZSBjbGVhckV2ZW50KHRoaXMsIGV2dCk7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmVtb3ZlIGFsbCBsaXN0ZW5lcnMsIG9yIHRob3NlIG9mIHRoZSBzcGVjaWZpZWQgZXZlbnQuXG4gKlxuICogQHBhcmFtIHsoU3RyaW5nfFN5bWJvbCl9IFtldmVudF0gVGhlIGV2ZW50IG5hbWUuXG4gKiBAcmV0dXJucyB7RXZlbnRFbWl0dGVyfSBgdGhpc2AuXG4gKiBAcHVibGljXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24gcmVtb3ZlQWxsTGlzdGVuZXJzKGV2ZW50KSB7XG4gIHZhciBldnQ7XG5cbiAgaWYgKGV2ZW50KSB7XG4gICAgZXZ0ID0gcHJlZml4ID8gcHJlZml4ICsgZXZlbnQgOiBldmVudDtcbiAgICBpZiAodGhpcy5fZXZlbnRzW2V2dF0pIGNsZWFyRXZlbnQodGhpcywgZXZ0KTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLl9ldmVudHMgPSBuZXcgRXZlbnRzKCk7XG4gICAgdGhpcy5fZXZlbnRzQ291bnQgPSAwO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vL1xuLy8gQWxpYXMgbWV0aG9kcyBuYW1lcyBiZWNhdXNlIHBlb3BsZSByb2xsIGxpa2UgdGhhdC5cbi8vXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9mZiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXI7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbjtcblxuLy9cbi8vIEV4cG9zZSB0aGUgcHJlZml4LlxuLy9cbkV2ZW50RW1pdHRlci5wcmVmaXhlZCA9IHByZWZpeDtcblxuLy9cbi8vIEFsbG93IGBFdmVudEVtaXR0ZXJgIHRvIGJlIGltcG9ydGVkIGFzIG1vZHVsZSBuYW1lc3BhY2UuXG4vL1xuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuLy9cbi8vIEV4cG9zZSB0aGUgbW9kdWxlLlxuLy9cbmlmICgndW5kZWZpbmVkJyAhPT0gdHlwZW9mIG1vZHVsZSkge1xuICBtb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcbn1cbiIsImltcG9ydCB7IGxvZyB9IGZyb20gJy4vc2hhcmVkL2xvZyc7XG5jb25zdCBERUZBVUxUX0NPTkZJRyA9IHtcbiAgICBtYXhMb3NzOiAxLCAvLyBpbiAkXG4gICAgbGV2ZXJhZ2U6IDIwMCxcbn07XG4vLyBAdHMtaWdub3JlXG5leHBvcnQgY29uc3QgY29uZmlnID0geyAuLi5ERUZBVUxUX0NPTkZJRyB9O1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldENvbmZpZygpIHtcbiAgICBjb25zdCBzdG9yYWdlRGF0YSA9IGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldCgnV0ZfQ09ORklHJyk7XG4gICAgaWYgKE9iamVjdC5rZXlzKHN0b3JhZ2VEYXRhPy5XRl9DT05GSUcgfHwge30pLmxlbmd0aCkge1xuICAgICAgICBPYmplY3QuZW50cmllcyhzdG9yYWdlRGF0YS5XRl9DT05GSUcpLmZvckVhY2goKFtrLCB2XSkgPT4ge1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgY29uZmlnW2tdID0gdjtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGxvZygnQ29uZmlnJywgY29uZmlnKTtcbiAgICByZXR1cm4gY29uZmlnO1xufVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNhdmVDb25maWcoZGF0YSkge1xuICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IFsnV0ZfQ09ORklHJ106IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZGF0YSkpIH0pO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGlzTnVtYmVyKHZhbCkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsID09PSAnbnVtYmVyJyAmJiAhTnVtYmVyLmlzTmFOKHZhbCk7XG59XG5leHBvcnQgZnVuY3Rpb24gaW5qZWN0U2NyaXB0KGZpbGVfcGF0aCwgdGFnKSB7XG4gICAgY29uc3Qgbm9kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKHRhZylbMF07XG4gICAgY29uc3Qgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgc2NyaXB0LnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0L2phdmFzY3JpcHQnKTtcbiAgICBzY3JpcHQuc2V0QXR0cmlidXRlKCdzcmMnLCBmaWxlX3BhdGgpO1xuICAgIG5vZGUuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbn1cbmV4cG9ydCBjb25zdCBmcmFtZSA9ICgpID0+IG5ldyBQcm9taXNlKChyZXMpID0+IHNldFRpbWVvdXQocmVzLCA0MCkpO1xuZXhwb3J0IGZ1bmN0aW9uIGFueU1ldGFLZXkoZSkge1xuICAgIHJldHVybiBlLm1ldGFLZXkgfHwgZS5jdHJsS2V5IHx8IGUuc2hpZnRLZXk7XG59XG5leHBvcnQgZnVuY3Rpb24gZXZlbnRJbklucHV0KHsgdGFyZ2V0IH0pIHtcbiAgICByZXR1cm4gWydpbnB1dCcsICd0ZXh0YXJlYSddLmluY2x1ZGVzKHRhcmdldD8udGFnTmFtZT8udG9Mb3dlckNhc2UoKSB8fCAnJyk7XG59XG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplVGlja2VyKHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlLmVuZHNXaXRoKCdmJykgJiYgdmFsdWUubGVuZ3RoID09PSA3KSB7XG4gICAgICAgIHJldHVybiB2YWx1ZS5zbGljZSgwLCAtMSkudG9VcHBlckNhc2UoKTtcbiAgICB9XG4gICAgaWYgKHZhbHVlLnN0YXJ0c1dpdGgoJyMnKSkge1xuICAgICAgICByZXR1cm4gdmFsdWUuc2xpY2UoMSkudG9VcHBlckNhc2UoKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlLnRvVXBwZXJDYXNlKCk7XG59XG5leHBvcnQgZnVuY3Rpb24gcm91bmRQcmljZShwcmljZSwgcHJlY2lzaW9uID0gMikge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKHByaWNlICogTWF0aC5wb3coMTAsIHByZWNpc2lvbikpIC8gTWF0aC5wb3coMTAsIHByZWNpc2lvbik7XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2FpdEZvcihmbiwgdGltZW91dCA9IDUwMDApIHtcbiAgICBjb25zdCBzdGFydCA9IERhdGUubm93KCk7XG4gICAgd2hpbGUgKERhdGUubm93KCkgLSBzdGFydCA8IHRpbWVvdXQpIHtcbiAgICAgICAgY29uc3QgY2FsbCA9IGZuKCk7XG4gICAgICAgIGlmIChjYWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FsbDtcbiAgICAgICAgfVxuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAyMDApKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuIiwiZXhwb3J0IGNvbnN0IGxvZyA9ICguLi5tc2cpID0+IHtcbiAgICBjb25zb2xlLmxvZygnJWMg4oCUIFdGLVV0aWxpdGllcyDigJQgJywgJ2JhY2tncm91bmQtY29sb3I6ICMzNzc2Yzk7IGNvbG9yOiAjZmZmJywgLi4ubXNnKTtcbn07XG4iLCJpbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJ2V2ZW50ZW1pdHRlcjMnO1xuaW1wb3J0IHsgbG9nIH0gZnJvbSAnLi9sb2cnO1xuY2xhc3MgTG9vcCBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImlzUnVubmluZ1wiLCB7XG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgICAgICB2YWx1ZTogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImlcIiwge1xuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgdmFsdWU6IDBcbiAgICAgICAgfSk7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcInRpY2tcIiwge1xuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgdmFsdWU6ICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaXNSdW5uaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KCd0aWNrJyk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaSAlIDEwID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgndGljazEwJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmkgJSAyMCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ3RpY2syMCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pICUgNjAgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KCd0aWNrNjAnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5pKys7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaSA+IDEwMDAwMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmkgPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KHRoaXMudGljaywgMTYpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgc3RhcnQoKSB7XG4gICAgICAgIGxvZygnbG9vcCBoYXMgc3RhcnRlZCcpO1xuICAgICAgICB0aGlzLmlzUnVubmluZyA9IHRydWU7XG4gICAgICAgIHRoaXMudGljaygpO1xuICAgIH1cbiAgICBzdG9wKCkge1xuICAgICAgICB0aGlzLmlzUnVubmluZyA9IGZhbHNlO1xuICAgIH1cbn1cbmV4cG9ydCBjb25zdCBsb29wID0gbmV3IExvb3AoKTtcbiIsIi8qKlxuICogaHR0cHM6Ly9ldHBpbnZlc3QucnUvcG9zaXRpb24tc2l6ZS1jYWxjdWxhdG9yL1xuICogeiA9IHIgLyAobCAqIChzIC0gbykpO1xuICovXG5jb25zdCByb3VuZExvdHMgPSAodmFsdWUpID0+IE1hdGguZmxvb3IodmFsdWUgKiAxMDApIC8gMTAwO1xuZXhwb3J0IGZ1bmN0aW9uIGNhbGN1bGF0ZVBvc2l0aW9uU2l6ZShwYXJhbXMpIHtcbiAgICBjb25zdCByYXdWYWx1ZSA9IHBhcmFtcy5tYXhMb3NzIC8gKHBhcmFtcy5sZXZlcmFnZSAqIChwYXJhbXMuY2xvc2VQcmljZSAtIHBhcmFtcy5vcGVuUHJpY2UpKTtcbiAgICByZXR1cm4gcm91bmRMb3RzKE1hdGguYWJzKHJhd1ZhbHVlKSk7XG59XG4vLyBjb25zb2xlLmxvZyhcbi8vICAgY2FsY3VsYXRlUG9zaXRpb25TaXplKHtcbi8vICAgICBvcGVuUHJpY2U6IDI1LjkyLFxuLy8gICAgIGNsb3NlUHJpY2U6IDI1LjgsXG4vLyAgICAgbWF4TG9zczogMSxcbi8vICAgICBsZXZlcmFnZTogMTAwLFxuLy8gICB9KSxcbi8vICk7XG4iLCJleHBvcnQgZnVuY3Rpb24gc2VuZE1lc3NhZ2UodHlwZSwgbWVzc2FnZSkge1xuICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHtcbiAgICAgICAgaWQ6ICdXRl9VVElMSVRJRVNfRVZFTlQnLFxuICAgICAgICB0eXBlLFxuICAgICAgICBkYXRhOiBtZXNzYWdlLFxuICAgIH0pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIG9uTWVzc2FnZSh0eXBlLCBjYikge1xuICAgIGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigobWVzc2FnZSkgPT4ge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnbWVzc2FnZScsIG1lc3NhZ2UpO1xuICAgICAgICBpZiAobWVzc2FnZT8uaWQgPT09ICdXRl9VVElMSVRJRVNfRVZFTlQnICYmIG1lc3NhZ2U/LnR5cGUgPT09IHR5cGUpIHtcbiAgICAgICAgICAgIGNiKG1lc3NhZ2UuZGF0YSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBzdWNjZXNzT3JkZXJTb3VuZCgpIHtcbiAgICBjb25zdCBhdWRpbyA9IG5ldyBBdWRpbyhjaHJvbWUucnVudGltZS5nZXRVUkwoJ3N0YXRpYy9vcmRlci1zdWNjZXNzLm1wMycpKTtcbiAgICBhdWRpby5wbGF5KCk7XG59XG5leHBvcnQgZnVuY3Rpb24gZXJyb3JPcmRlclNvdW5kKCkge1xuICAgIGNvbnN0IGF1ZGlvID0gbmV3IEF1ZGlvKGNocm9tZS5ydW50aW1lLmdldFVSTCgnc3RhdGljL29yZGVyLWVycm9yLm1wMycpKTtcbiAgICBhdWRpby5wbGF5KCk7XG59XG4iLCJpbXBvcnQgeyBsb2cgfSBmcm9tICcuLi9zaGFyZWQvbG9nJztcbmV4cG9ydCBmdW5jdGlvbiBvbk9yZGVyQ2xvc2Uob3JkZXIpIHtcbiAgICBsb2coYENsb3Npbmc6ICR7b3JkZXIuc3ltYm9sfSwgbG9zczogJHtvcmRlci5wcm9maXR9YCk7XG59XG5leHBvcnQgZnVuY3Rpb24gY2Fubm90Q2xvc2VPcmRlcihvcmRlcikge1xuICAgIGxvZyhgQ2Fubm90IGNsb3NlIG9yZGVyOiAke29yZGVyLnN5bWJvbH0sIGxvc3M6ICR7b3JkZXIucHJvZml0fWApO1xufVxuIiwiaW1wb3J0IHsgbm9ybWFsaXplVGlja2VyIH0gZnJvbSAnLi4vLi4vc2hhcmVkL2xpYic7XG5pbXBvcnQgeyBjYW5ub3RDbG9zZU9yZGVyIH0gZnJvbSAnLi4vZXZlbnQuc2VydmljZSc7XG5mdW5jdGlvbiBnZXRIZWFkZXJDb2x1bW5zKCkge1xuICAgIGNvbnN0IGhlYWRlclJvdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ib3QtcGFuZWwgLnRhYmxlIC50Ym9keSAudHI6Zmlyc3QtY2hpbGQnKTtcbiAgICBjb25zdCBjb2x1bW5zID0ge307XG4gICAgWy4uLihoZWFkZXJSb3c/LmNoaWxkcmVuIHx8IFtdKV0uZm9yRWFjaCgoY29sdW1uLCBpbmRleCkgPT4ge1xuICAgICAgICBjb25zdCBjb2x1bW5UaXRsZSA9IChjb2x1bW4uZ2V0QXR0cmlidXRlKCd0aXRsZScpIHx8ICcnKS50b0xvd2VyQ2FzZSgpLnJlcGxhY2VBbGwoJyAnLCAnXycpO1xuICAgICAgICBpZiAoY29sdW1uVGl0bGUpIHtcbiAgICAgICAgICAgIGNvbHVtbnNbY29sdW1uVGl0bGVdID0gaW5kZXg7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gY29sdW1ucztcbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRPcmRlcnMoKSB7XG4gICAgY29uc3QgY29sdW1ucyA9IGdldEhlYWRlckNvbHVtbnMoKTtcbiAgICBjb25zdCBvcmRlcnNFbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ib3QtcGFuZWwgLnRhYmxlIC50Ym9keSA+IGRpdltkYXRhLWlkXScpO1xuICAgIGlmICghT2JqZWN0LmtleXMoY29sdW1ucykubGVuZ3RoIHx8ICFvcmRlcnNFbGVtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBjb25zdCBkYXRhID0gW107XG4gICAgb3JkZXJzRWxlbWVudHMuZm9yRWFjaCgob3JkZXIpID0+IHtcbiAgICAgICAgY29uc3QgY2hpbGRyZW4gPSBbLi4ub3JkZXIuY2hpbGRyZW5dO1xuICAgICAgICBjb25zdCBjbG9zZUVsZW1lbnQgPSBvcmRlci5xdWVyeVNlbGVjdG9yKCcudGQgYnV0dG9uLmNsb3NlW3RpdGxlKj1cIkNsb3NlXCJdJyk7XG4gICAgICAgIGNvbnN0IGl0ZW0gPSB7fTtcbiAgICAgICAgT2JqZWN0LmVudHJpZXMoY29sdW1ucykuZm9yRWFjaCgoW2NvbHVtbiwgaW5kZXhdKSA9PiB7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICBpdGVtW2NvbHVtbl0gPSBub3JtYWxpemVDb2x1bW5WYWx1ZShjb2x1bW4sIGNoaWxkcmVuW2luZGV4XS5pbm5lclRleHQudHJpbSgpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGl0ZW0ub3JkZXJFbGVtZW50ID0gb3JkZXI7XG4gICAgICAgIGl0ZW0uY2xvc2UgPSAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0aW1lID0gcGFyc2VJbnQob3JkZXIuZ2V0QXR0cmlidXRlKCdkYXRhLXdmLWNsb3NpbmcnKSB8fCAnJywgMTApO1xuICAgICAgICAgICAgaWYgKE51bWJlci5pc05hTih0aW1lKSB8fCBEYXRlLm5vdygpIC0gdGltZSA+PSAzMDApIHtcbiAgICAgICAgICAgICAgICBjbG9zZUVsZW1lbnQuY2xpY2soKTtcbiAgICAgICAgICAgICAgICBvcmRlci5zZXRBdHRyaWJ1dGUoJ2RhdGEtd2YtY2xvc2luZycsIGAke0RhdGUubm93KCl9YCk7XG4gICAgICAgICAgICAgICAgY29uc3QgYXR0ZW1wdCA9IG9yZGVyLmhhc0F0dHJpYnV0ZSgnZGF0YS13Zi1jbG9zaW5nLWF0dGVtcHQnKVxuICAgICAgICAgICAgICAgICAgICA/IHBhcnNlSW50KG9yZGVyLmdldEF0dHJpYnV0ZSgnZGF0YS13Zi1jbG9zaW5nLWF0dGVtcHQnKSB8fCAnJywgMTApXG4gICAgICAgICAgICAgICAgICAgIDogMTtcbiAgICAgICAgICAgICAgICBvcmRlci5zZXRBdHRyaWJ1dGUoJ2RhdGEtd2YtY2xvc2luZy1hdHRlbXB0JywgYCR7YXR0ZW1wdCArIDF9YCk7XG4gICAgICAgICAgICAgICAgaWYgKGF0dGVtcHQgPiA1KSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbm5vdENsb3NlT3JkZXIoaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG4gICAgICAgIGRhdGEucHVzaChpdGVtKTtcbiAgICB9KTtcbiAgICByZXR1cm4gZGF0YTtcbn1cbmZ1bmN0aW9uIG5vcm1hbGl6ZUNvbHVtblZhbHVlKGNvbHVtbiwgdmFsdWUpIHtcbiAgICBpZiAoY29sdW1uID09PSAnc3ltYm9sJykge1xuICAgICAgICByZXR1cm4gbm9ybWFsaXplVGlja2VyKHZhbHVlKTtcbiAgICB9XG4gICAgaWYgKGNvbHVtbiA9PT0gJ3RpbWUnKSB7XG4gICAgICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZShgJHtuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCl9LiR7dmFsdWV9YCk7XG4gICAgICAgIGRhdGUuc2V0SG91cnMoZGF0ZS5nZXRIb3VycygpICsgMSk7XG4gICAgICAgIHJldHVybiBkYXRlLnRvSVNPU3RyaW5nKCk7XG4gICAgfVxuICAgIGlmIChjb2x1bW4gPT09ICd0eXBlJykge1xuICAgICAgICByZXR1cm4gdmFsdWUudG9VcHBlckNhc2UoKTtcbiAgICB9XG4gICAgaWYgKFsndGlja2V0JywgJ3ZvbHVtZScsICdvcGVuX3ByaWNlJywgJ3N0b3BfbG9zcycsICd0YWtlX3Byb2ZpdCcsICdjbG9zZV9wcmljZScsICdzd2FwJywgJ3Byb2ZpdCddLmluY2x1ZGVzKGNvbHVtbikpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlID09PSAnJyA/IG51bGwgOiBwYXJzZUZsb2F0KHZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlO1xufVxuIiwiaW1wb3J0IHsgY29uZmlnIH0gZnJvbSAnLi4vY29uZmlnJztcbmltcG9ydCB7IGxvZyB9IGZyb20gJy4uL3NoYXJlZC9sb2cnO1xuaW1wb3J0IHsgbG9vcCB9IGZyb20gJy4uL3NoYXJlZC9sb29wJztcbmltcG9ydCB7IHNlbmRNZXNzYWdlIH0gZnJvbSAnLi4vc2hhcmVkL21lc3NhZ2VzJztcbmltcG9ydCB7IG9uT3JkZXJDbG9zZSB9IGZyb20gJy4vZXZlbnQuc2VydmljZSc7XG5pbXBvcnQgeyBnZXRPcmRlcnMgfSBmcm9tICcuL2xpYi9vcmRlcnMnO1xuaW1wb3J0IHsgdGhyb3R0bGUgfSBmcm9tICdsb2Rhc2gtZXMnO1xuY29uc3Qgc2VuZE9yZGVycyA9IHRocm90dGxlKChkYXRhKSA9PiB7XG4gICAgc2VuZE1lc3NhZ2UoJ29yZGVycycsIGRhdGEpO1xufSwgMjUwKTtcbmZ1bmN0aW9uIG9uVGljaygpIHtcbiAgICBjb25zdCBvcmRlcnMgPSBnZXRPcmRlcnMoKTtcbiAgICBzZW5kT3JkZXJzKG9yZGVycyk7XG4gICAgb3JkZXJzLmZvckVhY2goKG9yZGVyKSA9PiB7XG4gICAgICAgIGlmIChvcmRlci5wcm9maXQgPD0gY29uZmlnLm1heExvc3MgKiAtMSkge1xuICAgICAgICAgICAgaWYgKG9yZGVyLmNsb3NlKCkpIHtcbiAgICAgICAgICAgICAgICBvbk9yZGVyQ2xvc2Uob3JkZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59XG5mdW5jdGlvbiBvblRpY2syMCgpIHtcbiAgICBnZXRPcmRlcnMoKS5mb3JFYWNoKChvcmRlcikgPT4ge1xuICAgICAgICBpZiAob3JkZXIub3JkZXJFbGVtZW50Py5oYXNBdHRyaWJ1dGUoJ2RhdGEtbWFudWFsLWNsb3NlZCcpKSB7XG4gICAgICAgICAgICBpZiAob3JkZXIuY2xvc2UoKSkge1xuICAgICAgICAgICAgICAgIG9uT3JkZXJDbG9zZShvcmRlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBzdGFydExvc3NQcm90ZWN0aW9uKCkge1xuICAgIGxvZygnU3RhcnQgbG9zcyBwcm90ZWN0aW9uJyk7XG4gICAgbG9vcC5vbigndGljaycsIG9uVGljayk7XG4gICAgbG9vcC5vbigndGljazIwJywgb25UaWNrMjApO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHN0b3BMb3NzUHJvdGVjdGlvbigpIHtcbiAgICBsb2coJ1N0b3AgbG9zcyBwcm90ZWN0aW9uJyk7XG4gICAgbG9vcC5vZmYoJ3RpY2snLCBvblRpY2spO1xuICAgIGxvb3Aub2ZmKCd0aWNrMjAnLCBvblRpY2syMCk7XG59XG4iLCJpbXBvcnQgeyBjb25maWcgfSBmcm9tICcuLi9jb25maWcnO1xuaW1wb3J0IHsgZnJhbWUsIHJvdW5kUHJpY2UsIHdhaXRGb3IgfSBmcm9tICcuLi9zaGFyZWQvbGliJztcbmltcG9ydCB7IGxvZyB9IGZyb20gJy4uL3NoYXJlZC9sb2cnO1xuaW1wb3J0IHsgY2FsY3VsYXRlUG9zaXRpb25TaXplIH0gZnJvbSAnLi4vc2hhcmVkL21hdGgnO1xuaW1wb3J0IHsgZ2V0T3JkZXJzIH0gZnJvbSAnLi9saWIvb3JkZXJzJztcbmltcG9ydCB7IGN1cnJlbnRUaWNrZXIsIGN1cnJlbnRUaWNrZXJBc2tCaWQsIHNldFRpY2tlciB9IGZyb20gJy4vdGlja2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgY2xpY2tPbk9wZW5PcmRlciwgZ2V0U3RhdHVzTWVzc2FnZSwgc2V0Q29tbWVudCwgc2V0U3RvcExvc3MsIHNldFZvbHVtZSB9IGZyb20gJy4vdWkuc2VydmljZSc7XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlT3JkZXIoZGF0YSkge1xuICAgIGlmIChjdXJyZW50VGlja2VyKCkgIT09IGRhdGEudGlja2VyKSB7XG4gICAgICAgIGxvZyhgV3JvbmcgdGlja2VyLCBjaGFuZ2luZyB0byAke2RhdGEudGlja2VyfWApO1xuICAgICAgICBzZXRUaWNrZXIoZGF0YS50aWNrZXIpO1xuICAgICAgICBhd2FpdCBmcmFtZSgpO1xuICAgIH1cbiAgICBpZiAoY3VycmVudFRpY2tlcigpICE9PSBkYXRhLnRpY2tlcikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBjaGFuZ2UgdGlja2VyJyk7XG4gICAgfVxuICAgIGNvbnN0IHsgYXNrLCBiaWQsIHByZWNpc2lvbiB9ID0gY3VycmVudFRpY2tlckFza0JpZCgpO1xuICAgIGlmIChkYXRhLnByaWNlID49IGJpZCAmJiBkYXRhLnByaWNlIDw9IGFzaykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RvbyBjbG9zZSEnKTtcbiAgICB9XG4gICAgY29uc3Qgc2lkZSA9IGRhdGEucHJpY2UgPCBiaWQgPyAnQlVZJyA6ICdTRUxMJztcbiAgICBjb25zdCBvcGVuUHJpY2UgPSBzaWRlID09PSAnQlVZJyA/IGFzayA6IGJpZDtcbiAgICBjb25zdCBhY2N1cmF0ZVZvbHVtZSA9IGNhbGN1bGF0ZVBvc2l0aW9uU2l6ZSh7XG4gICAgICAgIG9wZW5QcmljZSxcbiAgICAgICAgY2xvc2VQcmljZTogZGF0YS5wcmljZSxcbiAgICAgICAgbGV2ZXJhZ2U6IGNvbmZpZy5sZXZlcmFnZSxcbiAgICAgICAgbWF4TG9zczogY29uZmlnLm1heExvc3MsXG4gICAgfSk7XG4gICAgY29uc3Qgb3BlblZvbHVtZSA9IE1hdGgubWF4KDAuMDEsIGFjY3VyYXRlVm9sdW1lKTtcbiAgICBsZXQgbWluU2wgPSBzaWRlID09PSAnQlVZJyA/IGJpZCAtIDAuMjEgOiBhc2sgKyAwLjIxO1xuICAgIGlmIChzaWRlID09PSAnQlVZJyAmJiBtaW5TbCA+IGRhdGEucHJpY2UpIHtcbiAgICAgICAgbWluU2wgPSBkYXRhLnByaWNlO1xuICAgIH1cbiAgICBlbHNlIGlmIChzaWRlID09PSAnU0VMTCcgJiYgbWluU2wgPCBkYXRhLnByaWNlKSB7XG4gICAgICAgIG1pblNsID0gZGF0YS5wcmljZTtcbiAgICB9XG4gICAgc2V0Vm9sdW1lKG9wZW5Wb2x1bWUpO1xuICAgIHNldFN0b3BMb3NzKG1pblNsKTtcbiAgICBzZXRDb21tZW50KGBTTD0ke3JvdW5kUHJpY2UoZGF0YS5wcmljZSwgcHJlY2lzaW9uKX1gKTtcbiAgICBhd2FpdCBmcmFtZSgpO1xuICAgIGNsaWNrT25PcGVuT3JkZXIoc2lkZSk7XG4gICAgY29uc3Qgc3RhdHVzTWVzc2FnZSA9IGF3YWl0IHdhaXRGb3IoZ2V0U3RhdHVzTWVzc2FnZSwgMzAwMCk7XG4gICAgaWYgKHN0YXR1c01lc3NhZ2UgIT09ICdkb25lJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3Ioc3RhdHVzTWVzc2FnZSk7XG4gICAgfVxuICAgIGxvZyhgT3BlbjogJHtzaWRlfSwgUHJpY2U6ICR7b3BlblByaWNlfSwgUy9MOiAke3JvdW5kUHJpY2UoZGF0YS5wcmljZSwgcHJlY2lzaW9uKX0sIFZvbHVtZTogJHtvcGVuVm9sdW1lfWApO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNsb3NlT3JkZXJCeVRpY2tlcih0aWNrZXIpIHtcbiAgICBjb25zdCBvcmRlcnMgPSBnZXRPcmRlcnMoKTtcbiAgICBvcmRlcnMuZm9yRWFjaCgob3JkZXIpID0+IHtcbiAgICAgICAgaWYgKG9yZGVyLnN5bWJvbCA9PT0gdGlja2VyKSB7XG4gICAgICAgICAgICBvcmRlci5vcmRlckVsZW1lbnQ/LnNldEF0dHJpYnV0ZSgnZGF0YS1tYW51YWwtY2xvc2VkJywgJ3RydWUnKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuIiwiaW1wb3J0IHsgbm9ybWFsaXplVGlja2VyIH0gZnJvbSAnLi4vc2hhcmVkL2xpYic7XG5pbXBvcnQgeyBsb2cgfSBmcm9tICcuLi9zaGFyZWQvbG9nJztcbmltcG9ydCB7IGVycm9yT3JkZXJTb3VuZCB9IGZyb20gJy4uL3NoYXJlZC9zb3VuZCc7XG5jb25zdCBhY3RpdmVUaWNrZXJSb3cgPSBgLm1hcmtldC13YXRjaCA+IHRhYmxlID4gdGJvZHkgPiB0ci5hY3RpdmVbdGl0bGVdYDtcbmNvbnN0IFRJQ0tFUlNfTUFQID0geyBNRVRBOiAnRkInIH07XG5leHBvcnQgZnVuY3Rpb24gY3VycmVudFRpY2tlcigpIHtcbiAgICBjb25zdCB0aXRsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYWN0aXZlVGlja2VyUm93KT8uZ2V0QXR0cmlidXRlKCd0aXRsZScpIHx8ICcnO1xuICAgIHJldHVybiBub3JtYWxpemVUaWNrZXIodGl0bGUpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGN1cnJlbnRUaWNrZXJBc2tCaWQoKSB7XG4gICAgY29uc3Qgcm93ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihhY3RpdmVUaWNrZXJSb3cpO1xuICAgIGlmICghcm93KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGZpbmQgYWN0aXZlIHRpY2tlciBpbmZvJyk7XG4gICAgfVxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBjb25zdCBwcmljZXMgPSBbLi4ucm93LnF1ZXJ5U2VsZWN0b3JBbGwoJy52YWx1ZS5wcmljZScpXS5tYXAoKGkpID0+IHBhcnNlRmxvYXQoaS5pbm5lclRleHQpKTtcbiAgICBsZXQgcHJlY2lzaW9uID0gMjtcbiAgICB0cnkge1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHByZWNpc2lvbiA9IHJvdy5xdWVyeVNlbGVjdG9yKCcudmFsdWUucHJpY2UnKS5pbm5lclRleHQuc3BsaXQoJy4nKVsxXS5sZW5ndGg7XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIC8vXG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIGJpZDogcHJpY2VzWzBdLFxuICAgICAgICBhc2s6IHByaWNlc1sxXSxcbiAgICAgICAgcHJlY2lzaW9uLFxuICAgIH07XG59XG5leHBvcnQgZnVuY3Rpb24gc2V0VGlja2VyKHRpY2tlcikge1xuICAgIGxvZyhgU2V0IHRpY2tlciAke3RpY2tlcn1gKTtcbiAgICBpZiAoVElDS0VSU19NQVBbdGlja2VyXSkge1xuICAgICAgICB0aWNrZXIgPSBUSUNLRVJTX01BUFt0aWNrZXJdO1xuICAgIH1cbiAgICBjb25zdCBzZWxlY3RvcnMgPSBbXG4gICAgICAgIGAubWFya2V0LXdhdGNoID4gdGFibGUgPiB0Ym9keSA+IHRyW3RpdGxlPVwiJHt0aWNrZXJ9XCJdYCxcbiAgICAgICAgYC5tYXJrZXQtd2F0Y2ggPiB0YWJsZSA+IHRib2R5ID4gdHJbdGl0bGU9XCIjJHt0aWNrZXJ9XCJdYCxcbiAgICBdO1xuICAgIGZvciAoY29uc3Qgc2VsZWN0b3Igb2Ygc2VsZWN0b3JzKSB7XG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuY2xpY2soKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7IGFueU1ldGFLZXksIGV2ZW50SW5JbnB1dCB9IGZyb20gJy4uL3NoYXJlZC9saWInO1xuaW1wb3J0IHsgbG9vcCB9IGZyb20gJy4uL3NoYXJlZC9sb29wJztcbmV4cG9ydCBmdW5jdGlvbiBrZWVwT3JkZXJQYW5lbE9wZW4oKSB7XG4gICAgbG9vcC5vbigndGljaycsICgpID0+IHtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRvcC1iYXIgLmdyb3VwIGRpdlt0aXRsZSo9XCJTaG93IFRyYWRlIEZvcm1cIiBpXScpPy5jbGljaygpO1xuICAgIH0pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNsb3NlU3RhdHVzTWVzc2FnZSgpIHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubGVmdC1wYW5lbCAuc3RhdHVzIC5mb290ZXIgLnRyYWRlLWJ1dHRvbicpPy5jbGljaygpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGF1dG9PcGVuVHJhZGVzU2VjdGlvbigpIHtcbiAgICBsb29wLm9uKCd0aWNrJywgKCkgPT4ge1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubGVmdC1wYW5lbCAuaWNvbi1idXR0b25bdGl0bGU9XCJUcmFkZVwiXTpub3QoLmNoZWNrZWQpJyk/LmNsaWNrKCk7XG4gICAgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gd2FpdEZvckFwcFJlYWR5KCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICBmdW5jdGlvbiBsb29wKCkge1xuICAgICAgICAgICAgY29uc3QgbWFya2V0cyA9ICEhZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1hcmtldC13YXRjaCcpO1xuICAgICAgICAgICAgY29uc3QgY2hhcnQgPSAhIWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jaGFydCBjYW52YXMnKTtcbiAgICAgICAgICAgIGNvbnN0IGxlZnRQYW5lbCA9ICEhZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxlZnQtcGFuZWwgLmxheW91dCcpO1xuICAgICAgICAgICAgY29uc3QgY2hlY2tzID0gW21hcmtldHMsIGNoYXJ0LCBsZWZ0UGFuZWxdO1xuICAgICAgICAgICAgaWYgKGNoZWNrcy5ldmVyeSgoaSkgPT4gaSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShsb29wKTtcbiAgICAgICAgfVxuICAgICAgICBsb29wKCk7XG4gICAgICAgIHNldFRpbWVvdXQocmVzb2x2ZSwgNDAwMCk7XG4gICAgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24ga2V5Ym9hcmRTaG9ydGN1dHMoKSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCAoZSkgPT4ge1xuICAgICAgICBpZiAoZS5jb2RlLmluY2x1ZGVzKCdEaWdpdCcpICYmICFhbnlNZXRhS2V5KGUpICYmICFldmVudEluSW5wdXQoZSkpIHtcbiAgICAgICAgICAgIGNvbnN0IGtleSA9IHBhcnNlSW50KGUuY29kZS5zbGljZSgtMSksIDEwKTtcbiAgICAgICAgICAgIGNvbnN0IHRpbWVGcmFtZVJvb3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudG9wLWJhciAuZ3JvdXA6bnRoLWNoaWxkKDMpIC5saXN0LXZpZXcnKTtcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIHRpbWVGcmFtZVJvb3Q/LmNoaWxkcmVuW2tleSAtIDFdPy5jbGljaygpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCAoZSkgPT4ge1xuICAgICAgICBpZiAoZS5jb2RlID09PSAnS2V5UicgJiYgIWFueU1ldGFLZXkoZSkgJiYgIWV2ZW50SW5JbnB1dChlKSkge1xuICAgICAgICAgICAgZG9jdW1lbnRcbiAgICAgICAgICAgICAgICAucXVlcnlTZWxlY3RvcignYnV0dG9uW3RpdGxlKj1cInJlc2V0IGNoYXJ0XCIgaV0nKVxuICAgICAgICAgICAgICAgID8uZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ21vdXNlZG93bicpKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHNldFN0b3BMb3NzKHZhbCkge1xuICAgIGNoYW5nZUlucHV0KCcubGVmdC1wYW5lbCAuc2wgbGFiZWwuaW5wdXQgaW5wdXQnLCB2YWwsICdTdG9wIGxvc3MgaW5wdXQgbm90IGZvdW5kJyk7XG59XG5leHBvcnQgZnVuY3Rpb24gc2V0Vm9sdW1lKHZhbCkge1xuICAgIGNoYW5nZUlucHV0KCcubGVmdC1wYW5lbCAudm9sdW1lIGxhYmVsLmlucHV0IGlucHV0JywgdmFsLCAnVm9sdW1lIGlucHV0IG5vdCBmb3VuZCcpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHNldENvbW1lbnQodmFsKSB7XG4gICAgY2hhbmdlSW5wdXQoJy5sZWZ0LXBhbmVsIC5jb21tZW50IC52YWx1ZSBpbnB1dCcsIHZhbCwgJ0NvbW1lbnQgaW5wdXQgbm90IGZvdW5kJyk7XG59XG5leHBvcnQgZnVuY3Rpb24gY2xpY2tPbk9wZW5PcmRlcihzaWRlKSB7XG4gICAgY29uc3QgYnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5sZWZ0LXBhbmVsIC5jb250ZW50IC5mb290ZXItcm93IC50cmFkZS1idXR0b24nKTtcbiAgICBmb3IgKGNvbnN0IGJ1dHRvbiBvZiBidXR0b25zKSB7XG4gICAgICAgIGNvbnN0IHRleHRzID0geyBCVVk6ICdidXkgYnknLCBTRUxMOiAnc2VsbCBieScgfTtcbiAgICAgICAgY29uc3QgdGV4dCA9IHRleHRzW3NpZGVdO1xuICAgICAgICBpZiAoYnV0dG9uLmlubmVyVGV4dC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHRleHQpKSB7XG4gICAgICAgICAgICBidXR0b24uY2xpY2soKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBjbGljayBvbiBidXkvc2VsbCBidXR0b25zIScpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdldFN0YXR1c01lc3NhZ2UoKSB7XG4gICAgY29uc3Qgc3RhdHVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxlZnQtcGFuZWwgLndyYXAgLnN0YXR1cycpO1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICByZXR1cm4gKHN0YXR1cz8uY2hpbGRyZW5bMV0uaW5uZXJUZXh0IHx8ICcnKS50b0xvd2VyQ2FzZSgpO1xufVxuZnVuY3Rpb24gY2hhbmdlSW5wdXQoc2VsZWN0b3IsIHZhbHVlLCB0ZXh0KSB7XG4gICAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICBpZiAoIWlucHV0KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcih0ZXh0KTtcbiAgICB9XG4gICAgaW5wdXQudmFsdWUgPSBgJHt2YWx1ZX1gO1xuICAgIGlucHV0LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdibHVyJykpO1xuICAgIGlucHV0LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdjaGFuZ2UnKSk7XG4gICAgaW5wdXQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2lucHV0JykpO1xufVxuIiwiaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICcuL2luZGV4LmpzJ1xuXG5leHBvcnQgeyBFdmVudEVtaXR0ZXIgfVxuZXhwb3J0IGRlZmF1bHQgRXZlbnRFbWl0dGVyXG4iLCJpbXBvcnQgcm9vdCBmcm9tICcuL19yb290LmpzJztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgU3ltYm9sID0gcm9vdC5TeW1ib2w7XG5cbmV4cG9ydCBkZWZhdWx0IFN5bWJvbDtcbiIsImltcG9ydCBTeW1ib2wgZnJvbSAnLi9fU3ltYm9sLmpzJztcbmltcG9ydCBnZXRSYXdUYWcgZnJvbSAnLi9fZ2V0UmF3VGFnLmpzJztcbmltcG9ydCBvYmplY3RUb1N0cmluZyBmcm9tICcuL19vYmplY3RUb1N0cmluZy5qcyc7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBudWxsVGFnID0gJ1tvYmplY3QgTnVsbF0nLFxuICAgIHVuZGVmaW5lZFRhZyA9ICdbb2JqZWN0IFVuZGVmaW5lZF0nO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1Ub1N0cmluZ1RhZyA9IFN5bWJvbCA/IFN5bWJvbC50b1N0cmluZ1RhZyA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgZ2V0VGFnYCB3aXRob3V0IGZhbGxiYWNrcyBmb3IgYnVnZ3kgZW52aXJvbm1lbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGJhc2VHZXRUYWcodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZFRhZyA6IG51bGxUYWc7XG4gIH1cbiAgcmV0dXJuIChzeW1Ub1N0cmluZ1RhZyAmJiBzeW1Ub1N0cmluZ1RhZyBpbiBPYmplY3QodmFsdWUpKVxuICAgID8gZ2V0UmF3VGFnKHZhbHVlKVxuICAgIDogb2JqZWN0VG9TdHJpbmcodmFsdWUpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBiYXNlR2V0VGFnO1xuIiwiaW1wb3J0IHRyaW1tZWRFbmRJbmRleCBmcm9tICcuL190cmltbWVkRW5kSW5kZXguanMnO1xuXG4vKiogVXNlZCB0byBtYXRjaCBsZWFkaW5nIHdoaXRlc3BhY2UuICovXG52YXIgcmVUcmltU3RhcnQgPSAvXlxccysvO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnRyaW1gLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIFRoZSBzdHJpbmcgdG8gdHJpbS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHRyaW1tZWQgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBiYXNlVHJpbShzdHJpbmcpIHtcbiAgcmV0dXJuIHN0cmluZ1xuICAgID8gc3RyaW5nLnNsaWNlKDAsIHRyaW1tZWRFbmRJbmRleChzdHJpbmcpICsgMSkucmVwbGFjZShyZVRyaW1TdGFydCwgJycpXG4gICAgOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGJhc2VUcmltO1xuIiwiLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBnbG9iYWxgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlR2xvYmFsID0gdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwgJiYgZ2xvYmFsLk9iamVjdCA9PT0gT2JqZWN0ICYmIGdsb2JhbDtcblxuZXhwb3J0IGRlZmF1bHQgZnJlZUdsb2JhbDtcbiIsImltcG9ydCBTeW1ib2wgZnJvbSAnLi9fU3ltYm9sLmpzJztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG5hdGl2ZU9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHN5bVRvU3RyaW5nVGFnID0gU3ltYm9sID8gU3ltYm9sLnRvU3RyaW5nVGFnIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUdldFRhZ2Agd2hpY2ggaWdub3JlcyBgU3ltYm9sLnRvU3RyaW5nVGFnYCB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgcmF3IGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGdldFJhd1RhZyh2YWx1ZSkge1xuICB2YXIgaXNPd24gPSBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBzeW1Ub1N0cmluZ1RhZyksXG4gICAgICB0YWcgPSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG5cbiAgdHJ5IHtcbiAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB1bmRlZmluZWQ7XG4gICAgdmFyIHVubWFza2VkID0gdHJ1ZTtcbiAgfSBjYXRjaCAoZSkge31cblxuICB2YXIgcmVzdWx0ID0gbmF0aXZlT2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIGlmICh1bm1hc2tlZCkge1xuICAgIGlmIChpc093bikge1xuICAgICAgdmFsdWVbc3ltVG9TdHJpbmdUYWddID0gdGFnO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgdmFsdWVbc3ltVG9TdHJpbmdUYWddO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZXRSYXdUYWc7XG4iLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgbmF0aXZlT2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nIHVzaW5nIGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgb2JqZWN0VG9TdHJpbmc7XG4iLCJpbXBvcnQgZnJlZUdsb2JhbCBmcm9tICcuL19mcmVlR2xvYmFsLmpzJztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBzZWxmYC4gKi9cbnZhciBmcmVlU2VsZiA9IHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYgJiYgc2VsZi5PYmplY3QgPT09IE9iamVjdCAmJiBzZWxmO1xuXG4vKiogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdC4gKi9cbnZhciByb290ID0gZnJlZUdsb2JhbCB8fCBmcmVlU2VsZiB8fCBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXG5leHBvcnQgZGVmYXVsdCByb290O1xuIiwiLyoqIFVzZWQgdG8gbWF0Y2ggYSBzaW5nbGUgd2hpdGVzcGFjZSBjaGFyYWN0ZXIuICovXG52YXIgcmVXaGl0ZXNwYWNlID0gL1xccy87XG5cbi8qKlxuICogVXNlZCBieSBgXy50cmltYCBhbmQgYF8udHJpbUVuZGAgdG8gZ2V0IHRoZSBpbmRleCBvZiB0aGUgbGFzdCBub24td2hpdGVzcGFjZVxuICogY2hhcmFjdGVyIG9mIGBzdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIFRoZSBzdHJpbmcgdG8gaW5zcGVjdC5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBsYXN0IG5vbi13aGl0ZXNwYWNlIGNoYXJhY3Rlci5cbiAqL1xuZnVuY3Rpb24gdHJpbW1lZEVuZEluZGV4KHN0cmluZykge1xuICB2YXIgaW5kZXggPSBzdHJpbmcubGVuZ3RoO1xuXG4gIHdoaWxlIChpbmRleC0tICYmIHJlV2hpdGVzcGFjZS50ZXN0KHN0cmluZy5jaGFyQXQoaW5kZXgpKSkge31cbiAgcmV0dXJuIGluZGV4O1xufVxuXG5leHBvcnQgZGVmYXVsdCB0cmltbWVkRW5kSW5kZXg7XG4iLCJpbXBvcnQgaXNPYmplY3QgZnJvbSAnLi9pc09iamVjdC5qcyc7XG5pbXBvcnQgbm93IGZyb20gJy4vbm93LmpzJztcbmltcG9ydCB0b051bWJlciBmcm9tICcuL3RvTnVtYmVyLmpzJztcblxuLyoqIEVycm9yIG1lc3NhZ2UgY29uc3RhbnRzLiAqL1xudmFyIEZVTkNfRVJST1JfVEVYVCA9ICdFeHBlY3RlZCBhIGZ1bmN0aW9uJztcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU1heCA9IE1hdGgubWF4LFxuICAgIG5hdGl2ZU1pbiA9IE1hdGgubWluO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBkZWJvdW5jZWQgZnVuY3Rpb24gdGhhdCBkZWxheXMgaW52b2tpbmcgYGZ1bmNgIHVudGlsIGFmdGVyIGB3YWl0YFxuICogbWlsbGlzZWNvbmRzIGhhdmUgZWxhcHNlZCBzaW5jZSB0aGUgbGFzdCB0aW1lIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gd2FzXG4gKiBpbnZva2VkLiBUaGUgZGVib3VuY2VkIGZ1bmN0aW9uIGNvbWVzIHdpdGggYSBgY2FuY2VsYCBtZXRob2QgdG8gY2FuY2VsXG4gKiBkZWxheWVkIGBmdW5jYCBpbnZvY2F0aW9ucyBhbmQgYSBgZmx1c2hgIG1ldGhvZCB0byBpbW1lZGlhdGVseSBpbnZva2UgdGhlbS5cbiAqIFByb3ZpZGUgYG9wdGlvbnNgIHRvIGluZGljYXRlIHdoZXRoZXIgYGZ1bmNgIHNob3VsZCBiZSBpbnZva2VkIG9uIHRoZVxuICogbGVhZGluZyBhbmQvb3IgdHJhaWxpbmcgZWRnZSBvZiB0aGUgYHdhaXRgIHRpbWVvdXQuIFRoZSBgZnVuY2AgaXMgaW52b2tlZFxuICogd2l0aCB0aGUgbGFzdCBhcmd1bWVudHMgcHJvdmlkZWQgdG8gdGhlIGRlYm91bmNlZCBmdW5jdGlvbi4gU3Vic2VxdWVudFxuICogY2FsbHMgdG8gdGhlIGRlYm91bmNlZCBmdW5jdGlvbiByZXR1cm4gdGhlIHJlc3VsdCBvZiB0aGUgbGFzdCBgZnVuY2BcbiAqIGludm9jYXRpb24uXG4gKlxuICogKipOb3RlOioqIElmIGBsZWFkaW5nYCBhbmQgYHRyYWlsaW5nYCBvcHRpb25zIGFyZSBgdHJ1ZWAsIGBmdW5jYCBpc1xuICogaW52b2tlZCBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dCBvbmx5IGlmIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb25cbiAqIGlzIGludm9rZWQgbW9yZSB0aGFuIG9uY2UgZHVyaW5nIHRoZSBgd2FpdGAgdGltZW91dC5cbiAqXG4gKiBJZiBgd2FpdGAgaXMgYDBgIGFuZCBgbGVhZGluZ2AgaXMgYGZhbHNlYCwgYGZ1bmNgIGludm9jYXRpb24gaXMgZGVmZXJyZWRcbiAqIHVudGlsIHRvIHRoZSBuZXh0IHRpY2ssIHNpbWlsYXIgdG8gYHNldFRpbWVvdXRgIHdpdGggYSB0aW1lb3V0IG9mIGAwYC5cbiAqXG4gKiBTZWUgW0RhdmlkIENvcmJhY2hvJ3MgYXJ0aWNsZV0oaHR0cHM6Ly9jc3MtdHJpY2tzLmNvbS9kZWJvdW5jaW5nLXRocm90dGxpbmctZXhwbGFpbmVkLWV4YW1wbGVzLylcbiAqIGZvciBkZXRhaWxzIG92ZXIgdGhlIGRpZmZlcmVuY2VzIGJldHdlZW4gYF8uZGVib3VuY2VgIGFuZCBgXy50aHJvdHRsZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBkZWJvdW5jZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbd2FpdD0wXSBUaGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0byBkZWxheS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gVGhlIG9wdGlvbnMgb2JqZWN0LlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5sZWFkaW5nPWZhbHNlXVxuICogIFNwZWNpZnkgaW52b2tpbmcgb24gdGhlIGxlYWRpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5tYXhXYWl0XVxuICogIFRoZSBtYXhpbXVtIHRpbWUgYGZ1bmNgIGlzIGFsbG93ZWQgdG8gYmUgZGVsYXllZCBiZWZvcmUgaXQncyBpbnZva2VkLlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy50cmFpbGluZz10cnVlXVxuICogIFNwZWNpZnkgaW52b2tpbmcgb24gdGhlIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBkZWJvdW5jZWQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIC8vIEF2b2lkIGNvc3RseSBjYWxjdWxhdGlvbnMgd2hpbGUgdGhlIHdpbmRvdyBzaXplIGlzIGluIGZsdXguXG4gKiBqUXVlcnkod2luZG93KS5vbigncmVzaXplJywgXy5kZWJvdW5jZShjYWxjdWxhdGVMYXlvdXQsIDE1MCkpO1xuICpcbiAqIC8vIEludm9rZSBgc2VuZE1haWxgIHdoZW4gY2xpY2tlZCwgZGVib3VuY2luZyBzdWJzZXF1ZW50IGNhbGxzLlxuICogalF1ZXJ5KGVsZW1lbnQpLm9uKCdjbGljaycsIF8uZGVib3VuY2Uoc2VuZE1haWwsIDMwMCwge1xuICogICAnbGVhZGluZyc6IHRydWUsXG4gKiAgICd0cmFpbGluZyc6IGZhbHNlXG4gKiB9KSk7XG4gKlxuICogLy8gRW5zdXJlIGBiYXRjaExvZ2AgaXMgaW52b2tlZCBvbmNlIGFmdGVyIDEgc2Vjb25kIG9mIGRlYm91bmNlZCBjYWxscy5cbiAqIHZhciBkZWJvdW5jZWQgPSBfLmRlYm91bmNlKGJhdGNoTG9nLCAyNTAsIHsgJ21heFdhaXQnOiAxMDAwIH0pO1xuICogdmFyIHNvdXJjZSA9IG5ldyBFdmVudFNvdXJjZSgnL3N0cmVhbScpO1xuICogalF1ZXJ5KHNvdXJjZSkub24oJ21lc3NhZ2UnLCBkZWJvdW5jZWQpO1xuICpcbiAqIC8vIENhbmNlbCB0aGUgdHJhaWxpbmcgZGVib3VuY2VkIGludm9jYXRpb24uXG4gKiBqUXVlcnkod2luZG93KS5vbigncG9wc3RhdGUnLCBkZWJvdW5jZWQuY2FuY2VsKTtcbiAqL1xuZnVuY3Rpb24gZGVib3VuY2UoZnVuYywgd2FpdCwgb3B0aW9ucykge1xuICB2YXIgbGFzdEFyZ3MsXG4gICAgICBsYXN0VGhpcyxcbiAgICAgIG1heFdhaXQsXG4gICAgICByZXN1bHQsXG4gICAgICB0aW1lcklkLFxuICAgICAgbGFzdENhbGxUaW1lLFxuICAgICAgbGFzdEludm9rZVRpbWUgPSAwLFxuICAgICAgbGVhZGluZyA9IGZhbHNlLFxuICAgICAgbWF4aW5nID0gZmFsc2UsXG4gICAgICB0cmFpbGluZyA9IHRydWU7XG5cbiAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgd2FpdCA9IHRvTnVtYmVyKHdhaXQpIHx8IDA7XG4gIGlmIChpc09iamVjdChvcHRpb25zKSkge1xuICAgIGxlYWRpbmcgPSAhIW9wdGlvbnMubGVhZGluZztcbiAgICBtYXhpbmcgPSAnbWF4V2FpdCcgaW4gb3B0aW9ucztcbiAgICBtYXhXYWl0ID0gbWF4aW5nID8gbmF0aXZlTWF4KHRvTnVtYmVyKG9wdGlvbnMubWF4V2FpdCkgfHwgMCwgd2FpdCkgOiBtYXhXYWl0O1xuICAgIHRyYWlsaW5nID0gJ3RyYWlsaW5nJyBpbiBvcHRpb25zID8gISFvcHRpb25zLnRyYWlsaW5nIDogdHJhaWxpbmc7XG4gIH1cblxuICBmdW5jdGlvbiBpbnZva2VGdW5jKHRpbWUpIHtcbiAgICB2YXIgYXJncyA9IGxhc3RBcmdzLFxuICAgICAgICB0aGlzQXJnID0gbGFzdFRoaXM7XG5cbiAgICBsYXN0QXJncyA9IGxhc3RUaGlzID0gdW5kZWZpbmVkO1xuICAgIGxhc3RJbnZva2VUaW1lID0gdGltZTtcbiAgICByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBsZWFkaW5nRWRnZSh0aW1lKSB7XG4gICAgLy8gUmVzZXQgYW55IGBtYXhXYWl0YCB0aW1lci5cbiAgICBsYXN0SW52b2tlVGltZSA9IHRpbWU7XG4gICAgLy8gU3RhcnQgdGhlIHRpbWVyIGZvciB0aGUgdHJhaWxpbmcgZWRnZS5cbiAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHdhaXQpO1xuICAgIC8vIEludm9rZSB0aGUgbGVhZGluZyBlZGdlLlxuICAgIHJldHVybiBsZWFkaW5nID8gaW52b2tlRnVuYyh0aW1lKSA6IHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbWFpbmluZ1dhaXQodGltZSkge1xuICAgIHZhciB0aW1lU2luY2VMYXN0Q2FsbCA9IHRpbWUgLSBsYXN0Q2FsbFRpbWUsXG4gICAgICAgIHRpbWVTaW5jZUxhc3RJbnZva2UgPSB0aW1lIC0gbGFzdEludm9rZVRpbWUsXG4gICAgICAgIHRpbWVXYWl0aW5nID0gd2FpdCAtIHRpbWVTaW5jZUxhc3RDYWxsO1xuXG4gICAgcmV0dXJuIG1heGluZ1xuICAgICAgPyBuYXRpdmVNaW4odGltZVdhaXRpbmcsIG1heFdhaXQgLSB0aW1lU2luY2VMYXN0SW52b2tlKVxuICAgICAgOiB0aW1lV2FpdGluZztcbiAgfVxuXG4gIGZ1bmN0aW9uIHNob3VsZEludm9rZSh0aW1lKSB7XG4gICAgdmFyIHRpbWVTaW5jZUxhc3RDYWxsID0gdGltZSAtIGxhc3RDYWxsVGltZSxcbiAgICAgICAgdGltZVNpbmNlTGFzdEludm9rZSA9IHRpbWUgLSBsYXN0SW52b2tlVGltZTtcblxuICAgIC8vIEVpdGhlciB0aGlzIGlzIHRoZSBmaXJzdCBjYWxsLCBhY3Rpdml0eSBoYXMgc3RvcHBlZCBhbmQgd2UncmUgYXQgdGhlXG4gICAgLy8gdHJhaWxpbmcgZWRnZSwgdGhlIHN5c3RlbSB0aW1lIGhhcyBnb25lIGJhY2t3YXJkcyBhbmQgd2UncmUgdHJlYXRpbmdcbiAgICAvLyBpdCBhcyB0aGUgdHJhaWxpbmcgZWRnZSwgb3Igd2UndmUgaGl0IHRoZSBgbWF4V2FpdGAgbGltaXQuXG4gICAgcmV0dXJuIChsYXN0Q2FsbFRpbWUgPT09IHVuZGVmaW5lZCB8fCAodGltZVNpbmNlTGFzdENhbGwgPj0gd2FpdCkgfHxcbiAgICAgICh0aW1lU2luY2VMYXN0Q2FsbCA8IDApIHx8IChtYXhpbmcgJiYgdGltZVNpbmNlTGFzdEludm9rZSA+PSBtYXhXYWl0KSk7XG4gIH1cblxuICBmdW5jdGlvbiB0aW1lckV4cGlyZWQoKSB7XG4gICAgdmFyIHRpbWUgPSBub3coKTtcbiAgICBpZiAoc2hvdWxkSW52b2tlKHRpbWUpKSB7XG4gICAgICByZXR1cm4gdHJhaWxpbmdFZGdlKHRpbWUpO1xuICAgIH1cbiAgICAvLyBSZXN0YXJ0IHRoZSB0aW1lci5cbiAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHJlbWFpbmluZ1dhaXQodGltZSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gdHJhaWxpbmdFZGdlKHRpbWUpIHtcbiAgICB0aW1lcklkID0gdW5kZWZpbmVkO1xuXG4gICAgLy8gT25seSBpbnZva2UgaWYgd2UgaGF2ZSBgbGFzdEFyZ3NgIHdoaWNoIG1lYW5zIGBmdW5jYCBoYXMgYmVlblxuICAgIC8vIGRlYm91bmNlZCBhdCBsZWFzdCBvbmNlLlxuICAgIGlmICh0cmFpbGluZyAmJiBsYXN0QXJncykge1xuICAgICAgcmV0dXJuIGludm9rZUZ1bmModGltZSk7XG4gICAgfVxuICAgIGxhc3RBcmdzID0gbGFzdFRoaXMgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNhbmNlbCgpIHtcbiAgICBpZiAodGltZXJJZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZXJJZCk7XG4gICAgfVxuICAgIGxhc3RJbnZva2VUaW1lID0gMDtcbiAgICBsYXN0QXJncyA9IGxhc3RDYWxsVGltZSA9IGxhc3RUaGlzID0gdGltZXJJZCA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIHJldHVybiB0aW1lcklkID09PSB1bmRlZmluZWQgPyByZXN1bHQgOiB0cmFpbGluZ0VkZ2Uobm93KCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVib3VuY2VkKCkge1xuICAgIHZhciB0aW1lID0gbm93KCksXG4gICAgICAgIGlzSW52b2tpbmcgPSBzaG91bGRJbnZva2UodGltZSk7XG5cbiAgICBsYXN0QXJncyA9IGFyZ3VtZW50cztcbiAgICBsYXN0VGhpcyA9IHRoaXM7XG4gICAgbGFzdENhbGxUaW1lID0gdGltZTtcblxuICAgIGlmIChpc0ludm9raW5nKSB7XG4gICAgICBpZiAodGltZXJJZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBsZWFkaW5nRWRnZShsYXN0Q2FsbFRpbWUpO1xuICAgICAgfVxuICAgICAgaWYgKG1heGluZykge1xuICAgICAgICAvLyBIYW5kbGUgaW52b2NhdGlvbnMgaW4gYSB0aWdodCBsb29wLlxuICAgICAgICBjbGVhclRpbWVvdXQodGltZXJJZCk7XG4gICAgICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgICAgIHJldHVybiBpbnZva2VGdW5jKGxhc3RDYWxsVGltZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aW1lcklkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgZGVib3VuY2VkLmNhbmNlbCA9IGNhbmNlbDtcbiAgZGVib3VuY2VkLmZsdXNoID0gZmx1c2g7XG4gIHJldHVybiBkZWJvdW5jZWQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGRlYm91bmNlO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGVcbiAqIFtsYW5ndWFnZSB0eXBlXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtZWNtYXNjcmlwdC1sYW5ndWFnZS10eXBlcylcbiAqIG9mIGBPYmplY3RgLiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoXy5ub29wKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGlzT2JqZWN0O1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS4gQSB2YWx1ZSBpcyBvYmplY3QtbGlrZSBpZiBpdCdzIG5vdCBgbnVsbGBcbiAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgXCJvYmplY3RcIi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZSh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGlzT2JqZWN0TGlrZTtcbiIsImltcG9ydCBiYXNlR2V0VGFnIGZyb20gJy4vX2Jhc2VHZXRUYWcuanMnO1xuaW1wb3J0IGlzT2JqZWN0TGlrZSBmcm9tICcuL2lzT2JqZWN0TGlrZS5qcyc7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYFN5bWJvbGAgcHJpbWl0aXZlIG9yIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHN5bWJvbCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzU3ltYm9sKFN5bWJvbC5pdGVyYXRvcik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1N5bWJvbCgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N5bWJvbCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdzeW1ib2wnIHx8XG4gICAgKGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgYmFzZUdldFRhZyh2YWx1ZSkgPT0gc3ltYm9sVGFnKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaXNTeW1ib2w7XG4iLCJpbXBvcnQgcm9vdCBmcm9tICcuL19yb290LmpzJztcblxuLyoqXG4gKiBHZXRzIHRoZSB0aW1lc3RhbXAgb2YgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdGhhdCBoYXZlIGVsYXBzZWQgc2luY2VcbiAqIHRoZSBVbml4IGVwb2NoICgxIEphbnVhcnkgMTk3MCAwMDowMDowMCBVVEMpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMi40LjBcbiAqIEBjYXRlZ29yeSBEYXRlXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSB0aW1lc3RhbXAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZGVmZXIoZnVuY3Rpb24oc3RhbXApIHtcbiAqICAgY29uc29sZS5sb2coXy5ub3coKSAtIHN0YW1wKTtcbiAqIH0sIF8ubm93KCkpO1xuICogLy8gPT4gTG9ncyB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBpdCB0b29rIGZvciB0aGUgZGVmZXJyZWQgaW52b2NhdGlvbi5cbiAqL1xudmFyIG5vdyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gcm9vdC5EYXRlLm5vdygpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgbm93O1xuIiwiaW1wb3J0IGRlYm91bmNlIGZyb20gJy4vZGVib3VuY2UuanMnO1xuaW1wb3J0IGlzT2JqZWN0IGZyb20gJy4vaXNPYmplY3QuanMnO1xuXG4vKiogRXJyb3IgbWVzc2FnZSBjb25zdGFudHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKipcbiAqIENyZWF0ZXMgYSB0aHJvdHRsZWQgZnVuY3Rpb24gdGhhdCBvbmx5IGludm9rZXMgYGZ1bmNgIGF0IG1vc3Qgb25jZSBwZXJcbiAqIGV2ZXJ5IGB3YWl0YCBtaWxsaXNlY29uZHMuIFRoZSB0aHJvdHRsZWQgZnVuY3Rpb24gY29tZXMgd2l0aCBhIGBjYW5jZWxgXG4gKiBtZXRob2QgdG8gY2FuY2VsIGRlbGF5ZWQgYGZ1bmNgIGludm9jYXRpb25zIGFuZCBhIGBmbHVzaGAgbWV0aG9kIHRvXG4gKiBpbW1lZGlhdGVseSBpbnZva2UgdGhlbS4gUHJvdmlkZSBgb3B0aW9uc2AgdG8gaW5kaWNhdGUgd2hldGhlciBgZnVuY2BcbiAqIHNob3VsZCBiZSBpbnZva2VkIG9uIHRoZSBsZWFkaW5nIGFuZC9vciB0cmFpbGluZyBlZGdlIG9mIHRoZSBgd2FpdGBcbiAqIHRpbWVvdXQuIFRoZSBgZnVuY2AgaXMgaW52b2tlZCB3aXRoIHRoZSBsYXN0IGFyZ3VtZW50cyBwcm92aWRlZCB0byB0aGVcbiAqIHRocm90dGxlZCBmdW5jdGlvbi4gU3Vic2VxdWVudCBjYWxscyB0byB0aGUgdGhyb3R0bGVkIGZ1bmN0aW9uIHJldHVybiB0aGVcbiAqIHJlc3VsdCBvZiB0aGUgbGFzdCBgZnVuY2AgaW52b2NhdGlvbi5cbiAqXG4gKiAqKk5vdGU6KiogSWYgYGxlYWRpbmdgIGFuZCBgdHJhaWxpbmdgIG9wdGlvbnMgYXJlIGB0cnVlYCwgYGZ1bmNgIGlzXG4gKiBpbnZva2VkIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0IG9ubHkgaWYgdGhlIHRocm90dGxlZCBmdW5jdGlvblxuICogaXMgaW52b2tlZCBtb3JlIHRoYW4gb25jZSBkdXJpbmcgdGhlIGB3YWl0YCB0aW1lb3V0LlxuICpcbiAqIElmIGB3YWl0YCBpcyBgMGAgYW5kIGBsZWFkaW5nYCBpcyBgZmFsc2VgLCBgZnVuY2AgaW52b2NhdGlvbiBpcyBkZWZlcnJlZFxuICogdW50aWwgdG8gdGhlIG5leHQgdGljaywgc2ltaWxhciB0byBgc2V0VGltZW91dGAgd2l0aCBhIHRpbWVvdXQgb2YgYDBgLlxuICpcbiAqIFNlZSBbRGF2aWQgQ29yYmFjaG8ncyBhcnRpY2xlXShodHRwczovL2Nzcy10cmlja3MuY29tL2RlYm91bmNpbmctdGhyb3R0bGluZy1leHBsYWluZWQtZXhhbXBsZXMvKVxuICogZm9yIGRldGFpbHMgb3ZlciB0aGUgZGlmZmVyZW5jZXMgYmV0d2VlbiBgXy50aHJvdHRsZWAgYW5kIGBfLmRlYm91bmNlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHRocm90dGxlLlxuICogQHBhcmFtIHtudW1iZXJ9IFt3YWl0PTBdIFRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIHRocm90dGxlIGludm9jYXRpb25zIHRvLlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBUaGUgb3B0aW9ucyBvYmplY3QuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmxlYWRpbmc9dHJ1ZV1cbiAqICBTcGVjaWZ5IGludm9raW5nIG9uIHRoZSBsZWFkaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnRyYWlsaW5nPXRydWVdXG4gKiAgU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHRocm90dGxlZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogLy8gQXZvaWQgZXhjZXNzaXZlbHkgdXBkYXRpbmcgdGhlIHBvc2l0aW9uIHdoaWxlIHNjcm9sbGluZy5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdzY3JvbGwnLCBfLnRocm90dGxlKHVwZGF0ZVBvc2l0aW9uLCAxMDApKTtcbiAqXG4gKiAvLyBJbnZva2UgYHJlbmV3VG9rZW5gIHdoZW4gdGhlIGNsaWNrIGV2ZW50IGlzIGZpcmVkLCBidXQgbm90IG1vcmUgdGhhbiBvbmNlIGV2ZXJ5IDUgbWludXRlcy5cbiAqIHZhciB0aHJvdHRsZWQgPSBfLnRocm90dGxlKHJlbmV3VG9rZW4sIDMwMDAwMCwgeyAndHJhaWxpbmcnOiBmYWxzZSB9KTtcbiAqIGpRdWVyeShlbGVtZW50KS5vbignY2xpY2snLCB0aHJvdHRsZWQpO1xuICpcbiAqIC8vIENhbmNlbCB0aGUgdHJhaWxpbmcgdGhyb3R0bGVkIGludm9jYXRpb24uXG4gKiBqUXVlcnkod2luZG93KS5vbigncG9wc3RhdGUnLCB0aHJvdHRsZWQuY2FuY2VsKTtcbiAqL1xuZnVuY3Rpb24gdGhyb3R0bGUoZnVuYywgd2FpdCwgb3B0aW9ucykge1xuICB2YXIgbGVhZGluZyA9IHRydWUsXG4gICAgICB0cmFpbGluZyA9IHRydWU7XG5cbiAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgaWYgKGlzT2JqZWN0KG9wdGlvbnMpKSB7XG4gICAgbGVhZGluZyA9ICdsZWFkaW5nJyBpbiBvcHRpb25zID8gISFvcHRpb25zLmxlYWRpbmcgOiBsZWFkaW5nO1xuICAgIHRyYWlsaW5nID0gJ3RyYWlsaW5nJyBpbiBvcHRpb25zID8gISFvcHRpb25zLnRyYWlsaW5nIDogdHJhaWxpbmc7XG4gIH1cbiAgcmV0dXJuIGRlYm91bmNlKGZ1bmMsIHdhaXQsIHtcbiAgICAnbGVhZGluZyc6IGxlYWRpbmcsXG4gICAgJ21heFdhaXQnOiB3YWl0LFxuICAgICd0cmFpbGluZyc6IHRyYWlsaW5nXG4gIH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCB0aHJvdHRsZTtcbiIsImltcG9ydCBiYXNlVHJpbSBmcm9tICcuL19iYXNlVHJpbS5qcyc7XG5pbXBvcnQgaXNPYmplY3QgZnJvbSAnLi9pc09iamVjdC5qcyc7XG5pbXBvcnQgaXNTeW1ib2wgZnJvbSAnLi9pc1N5bWJvbC5qcyc7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE5BTiA9IDAgLyAwO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgYmFkIHNpZ25lZCBoZXhhZGVjaW1hbCBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNCYWRIZXggPSAvXlstK10weFswLTlhLWZdKyQvaTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGJpbmFyeSBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNCaW5hcnkgPSAvXjBiWzAxXSskL2k7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBvY3RhbCBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNPY3RhbCA9IC9eMG9bMC03XSskL2k7XG5cbi8qKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB3aXRob3V0IGEgZGVwZW5kZW5jeSBvbiBgcm9vdGAuICovXG52YXIgZnJlZVBhcnNlSW50ID0gcGFyc2VJbnQ7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIG51bWJlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIG51bWJlci5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50b051bWJlcigzLjIpO1xuICogLy8gPT4gMy4yXG4gKlxuICogXy50b051bWJlcihOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IDVlLTMyNFxuICpcbiAqIF8udG9OdW1iZXIoSW5maW5pdHkpO1xuICogLy8gPT4gSW5maW5pdHlcbiAqXG4gKiBfLnRvTnVtYmVyKCczLjInKTtcbiAqIC8vID0+IDMuMlxuICovXG5mdW5jdGlvbiB0b051bWJlcih2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlID09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGlmIChpc1N5bWJvbCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gTkFOO1xuICB9XG4gIGlmIChpc09iamVjdCh2YWx1ZSkpIHtcbiAgICB2YXIgb3RoZXIgPSB0eXBlb2YgdmFsdWUudmFsdWVPZiA9PSAnZnVuY3Rpb24nID8gdmFsdWUudmFsdWVPZigpIDogdmFsdWU7XG4gICAgdmFsdWUgPSBpc09iamVjdChvdGhlcikgPyAob3RoZXIgKyAnJykgOiBvdGhlcjtcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSAwID8gdmFsdWUgOiArdmFsdWU7XG4gIH1cbiAgdmFsdWUgPSBiYXNlVHJpbSh2YWx1ZSk7XG4gIHZhciBpc0JpbmFyeSA9IHJlSXNCaW5hcnkudGVzdCh2YWx1ZSk7XG4gIHJldHVybiAoaXNCaW5hcnkgfHwgcmVJc09jdGFsLnRlc3QodmFsdWUpKVxuICAgID8gZnJlZVBhcnNlSW50KHZhbHVlLnNsaWNlKDIpLCBpc0JpbmFyeSA/IDIgOiA4KVxuICAgIDogKHJlSXNCYWRIZXgudGVzdCh2YWx1ZSkgPyBOQU4gOiArdmFsdWUpO1xufVxuXG5leHBvcnQgZGVmYXVsdCB0b051bWJlcjtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgZ2V0Q29uZmlnIH0gZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHsgbG9nIH0gZnJvbSAnLi9zaGFyZWQvbG9nJztcbmltcG9ydCB7IGxvb3AgfSBmcm9tICcuL3NoYXJlZC9sb29wJztcbmltcG9ydCB7IG9uTWVzc2FnZSB9IGZyb20gJy4vc2hhcmVkL21lc3NhZ2VzJztcbmltcG9ydCB7IGVycm9yT3JkZXJTb3VuZCwgc3VjY2Vzc09yZGVyU291bmQgfSBmcm9tICcuL3NoYXJlZC9zb3VuZCc7XG5pbXBvcnQgeyBzdGFydExvc3NQcm90ZWN0aW9uIH0gZnJvbSAnLi93Zm9yZXgvbG9zcy1wcm90ZWN0b3InO1xuaW1wb3J0IHsgY2xvc2VPcmRlckJ5VGlja2VyLCBjcmVhdGVPcmRlciB9IGZyb20gJy4vd2ZvcmV4L29yZGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgc2V0VGlja2VyIH0gZnJvbSAnLi93Zm9yZXgvdGlja2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgYXV0b09wZW5UcmFkZXNTZWN0aW9uLCBjbG9zZVN0YXR1c01lc3NhZ2UsIGtlZXBPcmRlclBhbmVsT3Blbiwga2V5Ym9hcmRTaG9ydGN1dHMsIHdhaXRGb3JBcHBSZWFkeSwgfSBmcm9tICcuL3dmb3JleC91aS5zZXJ2aWNlJztcbmFzeW5jIGZ1bmN0aW9uIG1haW4oKSB7XG4gICAgYXdhaXQgZ2V0Q29uZmlnKCk7XG4gICAgbG9vcC5zdGFydCgpO1xuICAgIGtlZXBPcmRlclBhbmVsT3BlbigpO1xuICAgIGF1dG9PcGVuVHJhZGVzU2VjdGlvbigpO1xuICAgIC8vXG4gICAgYXdhaXQgd2FpdEZvckFwcFJlYWR5KCk7XG4gICAgLy8gLVxuICAgIGxvZygnQXBwIGlzIHJlYWR5Jyk7XG4gICAga2V5Ym9hcmRTaG9ydGN1dHMoKTtcbiAgICBzdGFydExvc3NQcm90ZWN0aW9uKCk7XG4gICAgb25NZXNzYWdlKCd0aWNrZXInLCBzZXRUaWNrZXIpO1xuICAgIG9uTWVzc2FnZSgnb3JkZXInLCBhc3luYyAobXNnKSA9PiB7XG4gICAgICAgIGNyZWF0ZU9yZGVyKG1zZylcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHN1Y2Nlc3NPcmRlclNvdW5kKCk7XG4gICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goKGUpID0+IHtcbiAgICAgICAgICAgIGVycm9yT3JkZXJTb3VuZCgpO1xuICAgICAgICAgICAgbG9nKGUubWVzc2FnZSk7XG4gICAgICAgIH0pXG4gICAgICAgICAgICAuZmluYWxseSgoKSA9PiB7XG4gICAgICAgICAgICBjbG9zZVN0YXR1c01lc3NhZ2UoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgb25NZXNzYWdlKCdjbG9zZS1ieS10aWNrZXInLCBjbG9zZU9yZGVyQnlUaWNrZXIpO1xufVxubWFpbigpLmNhdGNoKGNvbnNvbGUuZXJyb3IpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9
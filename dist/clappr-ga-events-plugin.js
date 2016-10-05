(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("clappr"));
	else if(typeof define === 'function' && define.amd)
		define(["clappr"], factory);
	else if(typeof exports === 'object')
		exports["ClapprGaEventsPlugin"] = factory(require("clappr"));
	else
		root["ClapprGaEventsPlugin"] = factory(root["Clappr"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _clappr = __webpack_require__(1);

	var _gaTracking = __webpack_require__(2);

	var _gaTracking2 = _interopRequireDefault(_gaTracking);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // Clappr player is Copyright 2014 Globo.com Player authors. All rights reserved.

	var GaEventsPlugin = function (_CorePlugin) {
	  _inherits(GaEventsPlugin, _CorePlugin);

	  _createClass(GaEventsPlugin, [{
	    key: 'name',
	    get: function get() {
	      return 'ga_events';
	    }
	  }]);

	  function GaEventsPlugin(core) {
	    _classCallCheck(this, GaEventsPlugin);

	    var _this = _possibleConstructorReturn(this, (GaEventsPlugin.__proto__ || Object.getPrototypeOf(GaEventsPlugin)).call(this, core));

	    _this._volumeTimer = null;
	    _this._doSendPlay = true;
	    _this.readPluginConfig(_this.options.gaEventsPlugin);
	    (0, _gaTracking2.default)(_this._gaCfg.name, _this._gaCfg.debug, _this._gaCfg.trace);
	    _this._ga('create', _this._trackingId, _this._createFieldsObject);
	    return _this;
	  }

	  _createClass(GaEventsPlugin, [{
	    key: 'bindEvents',
	    value: function bindEvents() {
	      var _this2 = this;

	      this.listenTo(this.core.mediaControl, _clappr.Events.MEDIACONTROL_CONTAINERCHANGED, this.containerChanged);
	      this._container = this.core.getCurrentContainer();
	      if (this._container) {
	        // Set resolved source as eventLabel if not defined in plugin configuration
	        if (!this._label) {
	          this._label = this._container.options.src;
	        }
	        this.listenTo(this._container, _clappr.Events.CONTAINER_TIMEUPDATE, this.onTimeUpdate);
	        this.listenTo(this._container, _clappr.Events.CONTAINER_PLAY, this.onPlay);
	        this.listenTo(this._container, _clappr.Events.CONTAINER_SEEK, function (event) {
	          return _this2.onSeek(event);
	        });
	        this.listenTo(this._container, _clappr.Events.CONTAINER_PAUSE, this.onPause);
	        this.listenTo(this._container, _clappr.Events.CONTAINER_STOP, this.onStop);
	        this.listenTo(this._container, _clappr.Events.CONTAINER_ENDED, this.onEnded);
	        this._hasEvent('ready') && this.listenTo(this._container, _clappr.Events.CONTAINER_READY, this.onReady);
	        this._hasEvent('buffering') && this.listenTo(this._container, _clappr.Events.CONTAINER_STATE_BUFFERING, this.onBuffering);
	        this._hasEvent('bufferfull') && this.listenTo(this._container, _clappr.Events.CONTAINER_STATE_BUFFERFULL, this.onBufferFull);
	        this._hasEvent('loadedmetadata') && this.listenTo(this._container, _clappr.Events.CONTAINER_LOADEDMETADATA, this.onLoadedMetadata);
	        this._hasEvent('volume') && this.listenTo(this._container, _clappr.Events.CONTAINER_VOLUME, function (event) {
	          return _this2.onVolumeChanged(event);
	        });
	        this._hasEvent('fullscreen') && this.listenTo(this._container, _clappr.Events.CONTAINER_FULL_SCREEN, this.onFullscreen);
	        this._hasEvent('playbackstate') && this.listenTo(this._container, _clappr.Events.CONTAINER_PLAYBACKSTATE, this.onPlaybackChanged);
	        this._hasEvent('highdefinitionupdate') && this.listenTo(this._container, _clappr.Events.CONTAINER_HIGHDEFINITIONUPDATE, this.onHD);
	        this._hasEvent('playbackdvrstatechanged') && this.listenTo(this._container, _clappr.Events.CONTAINER_PLAYBACKDVRSTATECHANGED, this.onDVR);
	        this._hasEvent('error') && this.listenTo(this._container, _clappr.Events.CONTAINER_ERROR, this.onError);
	      }
	    }
	  }, {
	    key: 'getExternalInterface',
	    value: function getExternalInterface() {
	      // Expose player method only if tracker name is available
	      if (this._trackerName) {
	        return {
	          gaEventsTracker: this.gaTracker
	        };
	      }

	      return {};
	    }
	  }, {
	    key: 'containerChanged',
	    value: function containerChanged() {
	      this.stopListening();
	      this.bindEvents();
	    }
	  }, {
	    key: 'gaTracker',
	    value: function gaTracker() {
	      return this._ga.getByName && this._ga.getByName(this._trackerName);
	    }
	  }, {
	    key: 'gaEvent',
	    value: function gaEvent(category, action, label, value) {
	      this._ga(this._send, 'event', category, action, label, value);
	    }
	  }, {
	    key: 'gaException',
	    value: function gaException(desc) {
	      var isFatal = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

	      this._ga(this._send, 'exception', {
	        'exDescription': desc,
	        'exFatal': isFatal
	      });
	    }
	  }, {
	    key: 'readPluginConfig',
	    value: function readPluginConfig(cfg) {
	      if (!cfg) {
	        throw new Error(this.name + ' plugin config is missing');
	      }
	      if (!cfg.trackingId) {
	        throw new Error(this.name + ' plugin "trackingId" required config parameter is missing');
	      }

	      this._gaCfg = cfg.gaCfg || { name: 'ga', debug: false, trace: false };
	      this._trackingId = cfg.trackingId;
	      this._createFieldsObject = cfg.createFieldsObject;
	      this._trackerName = this._createFieldsObject && this._createFieldsObject.name;
	      this._send = this._trackerName ? this._trackerName + '.send' : 'send';
	      this._category = cfg.eventCategory || 'Video';
	      this._label = cfg.eventLabel; // Otherwise filled in bindEvents()
	      this._setValue = cfg.eventValueAuto === true;
	      this._events = _clappr.$.isArray(cfg.eventToTrack) && cfg.eventToTrack || this._defaultEvents;
	      this._eventMap = _clappr.$.isPlainObject(cfg.eventMapping) && cfg.eventMapping || this._defaultEventMap;
	      this._gaPlayOnce = cfg.sendPlayOnce === true;
	      this._gaEx = cfg.sendExceptions === true;
	      this._gaExDesc = cfg.sendExceptionsMsg === true;

	      // Add 'error' to tracked events if GA exceptions are enabled
	      if (this._gaEx && !this._hasEvent('error')) this._events.push('error');

	      this._gaPercent = _clappr.$.isArray(cfg.progressPercent) && cfg.progressPercent || [];
	      this._gaPercentCat = cfg.progressPercentCategory || this._category;
	      this._gaPercentAct = _clappr.$.isFunction(cfg.progressPercentAction) && cfg.progressPercentAction || function (i) {
	        return 'progress_' + i + 'p';
	      };
	      this._processGaPercent = this._gaPercent.length > 0;
	      this._gaSeconds = _clappr.$.isArray(cfg.progressSeconds) && cfg.progressSeconds || [];
	      this._gaSecondsCat = cfg.progressSecondsCategory || this._category;
	      this._gaSecondsAct = _clappr.$.isFunction(cfg.progressSecondsAction) && cfg.progressSecondsAction || function (i) {
	        return 'progress_' + i + 's';
	      };
	      this._gaSecondsTimerStarted = false;
	      this._processGaSeconds = this._gaSeconds.length > 0;
	    }
	  }, {
	    key: '_hasEvent',
	    value: function _hasEvent(e) {
	      return this._events.indexOf(e) !== -1;
	    }
	  }, {
	    key: '_action',
	    value: function _action(e) {
	      return this._eventMap[e];
	    }
	  }, {
	    key: '_value',
	    value: function _value(v) {
	      if (this._setValue) return v; // else return undefined
	    }
	  }, {
	    key: 'trunc',
	    value: function trunc(v) {
	      return parseInt(v, 10);
	    }
	  }, {
	    key: 'onTimeUpdate',
	    value: function onTimeUpdate(o) {
	      this._position = o.current && this.trunc(o.current) || 0;

	      if (this.isLive || !this.isPlaying) return;

	      // Check for "seconds" progress event
	      this._processGaSeconds && this.processGaSeconds(this._position);

	      // Check for "percent" progress event
	      this._processGaPercent && this.processGaPercent(this._position);
	    }
	  }, {
	    key: 'processGaSeconds',
	    value: function processGaSeconds(pos) {
	      if (this._gaSecondsPrev !== pos && this._gaSeconds.indexOf(pos) !== -1) {
	        this._gaSecondsPrev = pos;
	        this.gaEvent(this._gaSecondsCat, this._gaSecondsAct(pos), this._label);
	      }
	    }
	  }, {
	    key: 'processGaPercent',
	    value: function processGaPercent(pos) {
	      var _this3 = this;

	      // FIXME: check if (duration > 0) ?
	      var percent = this.trunc(pos * 100 / this.duration);
	      _clappr.$.each(this._gaPercent, function (i, v) {
	        // Percentage value may never match expected value. To fix that, we compare to previous and current.
	        // This introduce a small approximation, but this function is called multiples time per seconds.
	        if (_this3._gaPercentPrev < v && percent >= v) {
	          _this3.gaEvent(_this3._gaPercentCat, _this3._gaPercentAct(v), _this3._label);

	          return false;
	        }
	      });
	      this._gaPercentPrev = percent;
	    }
	  }, {
	    key: 'onReady',
	    value: function onReady() {
	      this.gaEvent(this._category, this._action('ready'), this._label);
	    }
	  }, {
	    key: 'onBuffering',
	    value: function onBuffering() {
	      this.gaEvent(this._category, this._action('buffering'), this._label);
	    }
	  }, {
	    key: 'onBufferFull',
	    value: function onBufferFull() {
	      this.gaEvent(this._category, this._action('bufferfull'), this._label);
	    }
	  }, {
	    key: 'onLoadedMetadata',
	    value: function onLoadedMetadata(metadata) {
	      this.gaEvent(this._category, this._action('loadedmetadata'), this._label);
	    }
	  }, {
	    key: 'onPlay',
	    value: function onPlay() {
	      if (this._gaPlayOnce) {
	        if (!this._doSendPlay) return;
	        this._doSendPlay = false;
	      }
	      this.gaEvent(this._category, this._action('play'), this._label, this._value(this.position));

	      // Start "seconds" progress event timer (if LIVE playback type)
	      this.isLive && this._processGaSeconds && this._startGaSecondsTimer();
	    }
	  }, {
	    key: '_startGaSecondsTimer',
	    value: function _startGaSecondsTimer() {
	      var _this4 = this;

	      if (this._gaSecondsTimerStarted) return;

	      this._gaSecondsTimerStarted = true;
	      this._gaSecondsElapsed = 0;
	      this.processGaSeconds(this._gaSecondsElapsed);
	      this._gaSecondsTimerId = setInterval(function () {
	        _this4._gaSecondsElapsed++;
	        _this4.processGaSeconds(_this4._gaSecondsElapsed);
	      }, 1000);
	    }
	  }, {
	    key: '_stopGaSecondsTimer',
	    value: function _stopGaSecondsTimer() {
	      clearInterval(this._gaSecondsTimerId);
	      this._gaSecondsPrev = -1;
	      this._gaSecondsTimerStarted = false;
	    }
	  }, {
	    key: 'onSeek',
	    value: function onSeek(pos) {
	      this._hasEvent('seek') && this.gaEvent(this._category, this._action('seek'), this._label, this._value(this.trunc(pos)));
	      if (this._gaPlayOnce) this._doSendPlay = true;

	      // Adjust previous "percent" event value
	      if (!this.isLive && this._processGaPercent) {
	        this._gaPercentPrev = this.trunc(this.trunc(pos) * 100 / this.duration) - 1;
	      }

	      // Stop "seconds" progress event timer (if LIVE playback type)
	      this.isLive && this._processGaSeconds && this._stopGaSecondsTimer();
	    }
	  }, {
	    key: 'onPause',
	    value: function onPause() {
	      this._hasEvent('pause') && this.gaEvent(this._category, this._action('pause'), this._label, this._value(this.position));
	      if (this._gaPlayOnce) this._doSendPlay = true;

	      // Stop "seconds" progress event timer (if LIVE playback type)
	      this.isLive && this._processGaSeconds && this._stopGaSecondsTimer();
	    }
	  }, {
	    key: 'onStop',
	    value: function onStop() {
	      this._hasEvent('stop') && this.gaEvent(this._category, this._action('stop'), this._label, this._value(this.position));
	      if (this._gaPlayOnce) this._doSendPlay = true;

	      // Stop "seconds" progress event timer (if LIVE playback type)
	      this.isLive && this._processGaSeconds && this._stopGaSecondsTimer();
	    }
	  }, {
	    key: 'onEnded',
	    value: function onEnded() {
	      this._hasEvent('ended') && this.gaEvent(this._category, this._action('ended'), this._label, this._value(this.position));
	      if (this._gaPlayOnce) this._doSendPlay = true;

	      // Check for video ended progress events
	      this._processGaSeconds && this.processGaSeconds(this.duration);
	      this._processGaPercent && this.processGaPercent(this.duration);
	    }
	  }, {
	    key: 'onVolumeChanged',
	    value: function onVolumeChanged(e) {
	      var _this5 = this;

	      // Rate limit to avoid HTTP hammering
	      clearTimeout(this._volumeTimer);
	      this._volumeTimer = setTimeout(function () {
	        _this5.gaEvent(_this5._category, _this5._action('volume'), _this5._label, _this5._value(_this5.trunc(e)));
	      }, 400);
	    }
	  }, {
	    key: 'onFullscreen',
	    value: function onFullscreen() {
	      this.gaEvent(this._category, this._action('fullscreen'), this._label);
	    }
	  }, {
	    key: 'onPlaybackChanged',
	    value: function onPlaybackChanged(playbackState) {
	      this.gaEvent(this._category, this._action('playbackstate'), this._label);
	    }
	  }, {
	    key: 'onHD',
	    value: function onHD(isHD) {
	      this.gaEvent(this._category, this._action('highdefinitionupdate'), this._label);
	    }
	  }, {
	    key: 'onDVR',
	    value: function onDVR(dvrInUse) {
	      this.gaEvent(this._category, this._action('playbackdvrstatechanged'), this._label);
	    }
	  }, {
	    key: 'resolveErrMsg',
	    value: function resolveErrMsg(o) {
	      if (!this._gaExDesc) {
	        return 'error';
	      }

	      var msg = void 0;
	      if (typeof o.error === 'string') {
	        msg = o.error;
	      } else if (_clappr.$.isPlainObject(o.error) && o.error.message) {
	        msg = o.error.message;
	      } else {
	        // FIXME: find out a more elegant way
	        msg = 'Error: ' + o.error;
	      }

	      return msg;
	    }
	  }, {
	    key: 'onError',
	    value: function onError(errorObj) {
	      if (this._gaEx) {
	        this.gaException(this.resolveErrMsg(errorObj), true);
	      } else {
	        this.gaEvent(this._category, this._action('error'), this._label);
	      }
	    }
	  }, {
	    key: '_ga',
	    get: function get() {
	      return window[window.GoogleAnalyticsObject];
	    }
	  }, {
	    key: '_defaultEventMap',
	    get: function get() {
	      return {
	        'ready': 'ready',
	        'buffering': 'buffering',
	        'bufferfull': 'bufferfull',
	        'loadedmetadata': 'loadedmetadata',
	        'play': 'play',
	        'seek': 'seek',
	        'pause': 'pause',
	        'stop': 'stop',
	        'ended': 'ended',
	        'volume': 'volume',
	        'fullscreen': 'fullscreen',
	        'error': 'error',
	        'playbackstate': 'playbackstate',
	        'highdefinitionupdate': 'highdefinitionupdate',
	        'playbackdvrstatechanged': 'playbackdvrstatechanged'
	      };
	    }
	  }, {
	    key: '_defaultEvents',
	    get: function get() {
	      return ['play', 'seek', 'pause', 'stop', 'ended', 'volume'];
	    }
	  }, {
	    key: 'position',
	    get: function get() {
	      return this.isLive ? 0 : this._position;
	    }
	  }, {
	    key: 'duration',
	    get: function get() {
	      return this.isLive ? 0 : this._container && this._container.getDuration();
	    }
	  }, {
	    key: 'isLive',
	    get: function get() {
	      return this._container.getPlaybackType() === _clappr.Playback.LIVE;
	    }
	  }, {
	    key: 'isPlaying',
	    get: function get() {
	      return this._container.isPlaying();
	    }
	  }]);

	  return GaEventsPlugin;
	}(_clappr.CorePlugin);

	exports.default = GaEventsPlugin;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function () {
	  var name = arguments.length <= 0 || arguments[0] === undefined ? 'ga' : arguments[0];
	  var debug = arguments[1];
	  var trace = arguments[2];

	  // Preserve renaming support and minification
	  var win = window,
	      doc = document,
	      el = 'script';

	  // Ensure analytics.js is not already loaded
	  if (win[name]) return;

	  if (trace) {
	    win['ga_debug'] = { trace: true };
	  }

	  // Acts as a pointer to support renaming
	  win.GoogleAnalyticsObject = name;

	  // Creates an initial ga() function
	  // The queued commands will be executed once analytics.js loads
	  win[name] = function () {
	    win[name].q.push(arguments);
	  };
	  win[name].q = [];

	  // Sets the time (as an integer) this tag was executed
	  // Used for timing hits
	  win[name].l = 1 * new Date();

	  // Insert script element above the first script element in document
	  // (async + https)
	  var first = doc.getElementsByTagName(el)[0];
	  var script = doc.createElement(el);
	  script.src = 'https://www.google-analytics.com/analytics' + (debug ? '_debug.js' : '.js');
	  script.async = true;
	  first.parentNode.insertBefore(script, first);
	};

	module.exports = exports['default']; // Based on Google Analytics JavaScript Tracking Snippet
	// See original @ https://developers.google.com/analytics/devguides/collection/analyticsjs/tracking-snippet-reference

	/**
	 * Creates a temporary global ga object and lazy loads analytics.js.
	 * @function
	 * @param {string} Global name of analytics object. Defaults to 'ga'.
	 * @param {boolean} Set to true to load the debug version of the analytics.js library.
	 * @param {boolean} Set to true to enable trace debugging.
	 */

/***/ }
/******/ ])
});
;
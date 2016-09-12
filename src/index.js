// Clappr player is Copyright 2014 Globo.com Player authors. All rights reserved.

import {CorePlugin, Events, Playback, $} from 'clappr'
import gaTrackingSnippet from './ga-tracking'

export default class GaEventsPlugin extends CorePlugin {
  get name() { return 'ga_events' }

  constructor(core) {
    super(core)
    this._volumeTimer = null
    this._doSendPlay = true
    this.readPluginConfig(this.options.gaEventsPlugin)
    gaTrackingSnippet(this._gaCfg.name, this._gaCfg.debug, this._gaCfg.trace)
    this._ga('create', this._trackingId, this._createFieldsObject)
  }

  bindEvents() {
    this.listenTo(this.core.mediaControl, Events.MEDIACONTROL_CONTAINERCHANGED, this.containerChanged)
    this._container = this.core.getCurrentContainer()
    if (this._container) {
      // Set resolved source as eventLabel if not defined in plugin configuration
      if (!this._label) {
        this._label = this._container.options.src
      }
      this.listenTo(this._container, Events.CONTAINER_TIMEUPDATE, this.onTimeUpdate)
      this.listenTo(this._container, Events.CONTAINER_PLAY, this.onPlay)
      this.listenTo(this._container, Events.CONTAINER_SEEK, (event) => this.onSeek(event))
      this.listenTo(this._container, Events.CONTAINER_PAUSE, this.onPause)
      this.listenTo(this._container, Events.CONTAINER_STOP, this.onStop)
      this.listenTo(this._container, Events.CONTAINER_ENDED, this.onEnded)
      this._hasEvent('ready') && this.listenTo(this._container, Events.CONTAINER_READY, this.onReady)
      this._hasEvent('buffering') && this.listenTo(this._container, Events.CONTAINER_STATE_BUFFERING, this.onBuffering)
      this._hasEvent('bufferfull') && this.listenTo(this._container, Events.CONTAINER_STATE_BUFFERFULL, this.onBufferFull)
      this._hasEvent('loadedmetadata') && this.listenTo(this._container, Events.CONTAINER_LOADEDMETADATA, this.onLoadedMetadata)
      this._hasEvent('volume') && this.listenTo(this._container, Events.CONTAINER_VOLUME, (event) => this.onVolumeChanged(event))
      this._hasEvent('fullscreen') && this.listenTo(this._container, Events.CONTAINER_FULL_SCREEN, this.onFullscreen)
      this._hasEvent('playbackstate') && this.listenTo(this._container, Events.CONTAINER_PLAYBACKSTATE, this.onPlaybackChanged)
      this._hasEvent('highdefinitionupdate') && this.listenTo(this._container, Events.CONTAINER_HIGHDEFINITIONUPDATE, this.onHD)
      this._hasEvent('playbackdvrstatechanged') && this.listenTo(this._container, Events.CONTAINER_PLAYBACKDVRSTATECHANGED, this.onDVR)
      this._hasEvent('error') && this.listenTo(this._container, Events.CONTAINER_ERROR, this.onError)
    }
  }

  getExternalInterface() {
      // Expose player method only if tracker name is available
      if (this._trackerName) {
        return {
          gaEventsTracker: this.gaTracker
        }
      }

      return {}
  }

  containerChanged() {
    this.stopListening()
    this.bindEvents()
  }

  get _ga() {
    return window[window.GoogleAnalyticsObject]
  }

  gaTracker() {
    return this._ga.getByName && this._ga.getByName(this._trackerName)
  }

  gaEvent(category, action, label, value) {
    this._ga(this._send, 'event', category, action, label, value)
  }

  gaException(desc, isFatal=false) {
    this._ga(this._send, 'exception', {
      'exDescription': desc,
      'exFatal': isFatal
    })
  }

  readPluginConfig(cfg) {
    if (!cfg) {
      throw new Error(this.name + ' plugin config is missing')
    }
    if (!cfg.trackingId) {
      throw new Error(this.name + ' plugin "trackingId" required config parameter is missing')
    }

    this._gaCfg = cfg.gaCfg || { name: 'ga', debug: false, trace: false }
    this._trackingId = cfg.trackingId
    this._createFieldsObject = cfg.createFieldsObject
    this._trackerName = this._createFieldsObject && this._createFieldsObject.name
    this._send = this._trackerName ? this._trackerName + '.send' : 'send'
    this._category = cfg.eventCategory || 'Video'
    this._label = cfg.eventLabel // Otherwise filled in bindEvents()
    this._setValue = cfg.eventValueAuto === true
    this._events = $.isArray(cfg.eventToTrack) && cfg.eventToTrack || this._defaultEvents
    this._eventMap = $.isPlainObject(cfg.eventMapping) && cfg.eventMapping || this._defaultEventMap
    this._gaPlayOnce = cfg.sendPlayOnce === true
    this._gaEx = cfg.sendExceptions === true
    this._gaExDesc = cfg.sendExceptionsMsg === true

    // Add 'error' to tracked events if GA exceptions are enabled
    if (this._gaEx && !this._hasEvent('error')) this._events.push('error')
  }

  get _defaultEventMap() {
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
    }
  }

  get _defaultEvents() {
    return [
      'play',
      'seek',
      'pause',
      'stop',
      'ended',
      'volume'
    ]
  }

  _hasEvent(e) {
    return this._events.indexOf(e) !== -1
  }

  _action(e) {
    return this._eventMap[e]
  }

  _value(v) {
    if (this._setValue) return v
  }

  get position() {
    return this.isLive ? 0 : this._position
  }

  get isLive() {
    return this._container.getPlaybackType() === Playback.LIVE
  }

  get isPlaying() {
    return this._container.isPlaying()
  }

  trunc(v) {
    return parseInt(v, 10)
  }

  onTimeUpdate(o){
    this._position = o.current && this.trunc(o.current) || 0
  }

  onReady() {
    this.gaEvent(this._category, this._action('ready'), this._label)
  }

  onBuffering() {
    this.gaEvent(this._category, this._action('buffering'), this._label)
  }

  onBufferFull() {
    this.gaEvent(this._category, this._action('bufferfull'), this._label)
  }

  onLoadedMetadata(metadata) {
    this.gaEvent(this._category, this._action('loadedmetadata'), this._label)
  }

  onPlay() {
    if (this._gaPlayOnce) {
      if (!this._doSendPlay) return
      this._doSendPlay = false
    }
    this.gaEvent(this._category, this._action('play'), this._label, this._value(this.position))
  }

  onSeek(e) {
    this._hasEvent('seek') && this.gaEvent(this._category, this._action('seek'), this._label, this._value(this.trunc(e)))
    if (this._gaPlayOnce) this._doSendPlay = true
  }

  onPause() {
    this._hasEvent('pause') && this.gaEvent(this._category, this._action('pause'), this._label, this._value(this.position))
    if (this._gaPlayOnce) this._doSendPlay = true
  }

  onStop() {
    this._hasEvent('stop') && this.gaEvent(this._category, this._action('stop'), this._label, this._value(this.position))
    if (this._gaPlayOnce) this._doSendPlay = true
  }

  onEnded() {
    this._hasEvent('ended') && this.gaEvent(this._category, this._action('ended'), this._label, this._value(this.position))
    if (this._gaPlayOnce) this._doSendPlay = true
  }

  onVolumeChanged(e) {
    // Rate limit to avoid HTTP hammering
    clearTimeout(this._volumeTimer)
    this._volumeTimer = setTimeout(() => {
      this.gaEvent(this._category, this._action('volume'), this._label, this._value(this.trunc(e)))
    }, 400)
  }

  onFullscreen() {
    this.gaEvent(this._category, this._action('fullscreen'), this._label)
  }

  onPlaybackChanged(playbackState) {
    this.gaEvent(this._category, this._action('playbackstate'), this._label)
  }

  onHD(isHD) {
    this.gaEvent(this._category, this._action('highdefinitionupdate'), this._label)
  }

  onDVR(dvrInUse) {
    this.gaEvent(this._category, this._action('playbackdvrstatechanged'), this._label)
  }

  resolveErrMsg(o) {
    if (!this._gaExDesc) {
      return 'error'
    }

    let msg
    if (typeof o.error === 'string') {
      msg = o.error
    } else if ($.isPlainObject(o.error) && o.error.message) {
      msg = o.error.message
    } else {
      // FIXME: find out a more elegant way
      msg = 'Error: ' + o.error
    }

    return msg
  }

  onError(errorObj) {
    if (this._gaEx) {
      this.gaException(this.resolveErrMsg(errorObj), true)
    } else {
      this.gaEvent(this._category, this._action('error'), this._label)
    }
  }
}

# Clappr Google Analytics Events Tracking Plugin

[Google Analytics Event Tracking](https://developers.google.com/analytics/devguides/collection/analyticsjs/events) plugin for [Clappr](https://github.com/clappr/clappr) video player.

# Usage

Add both Clappr and the plugin scripts to your HTML:

```html
<head>
  <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/clappr@latest/dist/clappr.min.js"></script>
  <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/clappr-ga-events-plugin@latest/dist/clappr-ga-events-plugin.min.js"></script>
</head>
```

Then just add `ClapprGaEventsPlugin` into the list of core plugins of your player instance, and the options for the plugin go in the `gaEventsPlugin` property as shown below.

```javascript
var player = new Clappr.Player({
  source: "http://your.video/here.mp4",
  plugins: {
    core: [ClapprGaEventsPlugin],
  },
  gaEventsPlugin: {
    trackingId: 'UA-XXXX-Y',
  }
});
```

## trackingId

`trackingId` __required__ property is the Google Analytics [tracking ID / web property ID](https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#trackingId). The format is UA-XXXX-Y.

## createFieldsObject

`createFieldsObject` __optional__ property is the fields object set in the [create method](https://developers.google.com/analytics/devguides/collection/analyticsjs/command-queue-reference#create). Default value is `undefined` which create a default tracker with automatic cookie domain configuration. For more details, read the [Create Only Fields](https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#create) reference documentation.

```javascript
  /* [...] */
  gaEventsPlugin: {
    trackingId: 'UA-XXXX-Y',
    createFieldsObject: {
      name: 'MyTrackerName',
      cookieDomain: 'example.com',
    },
  }
  /* [...] */
```

## eventCategory

`eventCategory` __optional__ property is the [eventCategory](https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#eventCategory) set in the [send method](https://developers.google.com/analytics/devguides/collection/analyticsjs/command-queue-reference#send) ("event" hit type) used for [event tracking](https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#events). Default value is `Video`.

```javascript
  /* [...] */
  gaEventsPlugin: {
    trackingId: 'UA-XXXX-Y',
    eventCategory: 'MyCustomCategory',
  }
  /* [...] */
```

## eventLabel

`eventLabel` __optional__ property is the [eventLabel](https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#eventLabel) set in the [send method](https://developers.google.com/analytics/devguides/collection/analyticsjs/command-queue-reference#send) ("event" hit type) used for [event tracking](https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#events). Default value is the container playback resolved source value.

it's __strongly recommended__ to set this option. Using video source as event label may result into truncated value. Event label maximum length is 500 bytes.

```javascript
  /* [...] */
  gaEventsPlugin: {
    trackingId: 'UA-XXXX-Y',
    eventLabel: 'MyVideoTitle',
  }
  /* [...] */
```

## eventValueAuto

`eventValueAuto` __optional__ property is a boolean which indicate if [eventValue](https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#eventValue) is automatically set for some events. Default value is `false`. _(default behaviour is to left eventValue undefined)_

If this option is enabled, the eventValue is set to :

* player position value in seconds for `play`, `pause`, `stop` and `ended` events
* player "seek to" position value in seconds for `seek` event _(may be an unexpected value for LIVE playback with DVR)_
* player volume percent value for `volume` event
* 0 or 1 for `fullscreen`, `highdefinitionupdate`, and `playbackdvrstatechanged` events

If playback type is __LIVE__, the eventValue is set to elapsed duration since __play__ event in seconds. _(It use a Timer instead of referring to player position)_

```javascript
  /* [...] */
  gaEventsPlugin: {
    trackingId: 'UA-XXXX-Y',
    eventValueAuto: true,
  }
  /* [...] */
```

__Note:__ The event value is truncated using [parseInt()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt) function to convert to integer.

## eventValueAsLive

`eventValueAsLive` __optional__ property is a boolean which indicate if "on demand" playback is handled as __LIVE__ playback. Default value is `false`.

If this option and `eventValueAuto` are enabled, the eventValue is always set to elapsed duration since __play__ event in seconds.

For consistency, `play` event value is set to 0 _(same as LIVE playback)_ but `ended` event value is still set to position. _(ie: duration)_

This option may be usefull, for example, to track the playing time of "on demand" playback. _(stop & pause event values)_

This option does __NOT__ affect `progressSeconds`, `progressPercent` and `progressEachSeconds` behaviours.

```javascript
  /* [...] */
  gaEventsPlugin: {
    trackingId: 'UA-XXXX-Y',
    eventValueAuto: true,
    eventValueAsLive: true,
  }
  /* [...] */
```

__Note:__ This option is ignored if playback type is __LIVE__. _(eventValueAuto option default behaviour)_

## eventToTrack

`eventToTrack` __optional__ property is the player container event list to listen and to send to Google Analytics using [eventAction](https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#eventAction) tracking field. The default value is `['play', 'seek', 'pause', 'stop', 'ended', 'volume']`.

__Note:__ the list of available events is `['ready', 'buffering', 'bufferfull', 'loadedmetadata', 'play', 'seek', 'pause', 'stop', 'ended', 'volume', 'fullscreen', 'error', 'playbackstate', 'highdefinitionupdate', 'playbackdvrstatechanged']`. _This is not the complete Clappr container event list. If you think one or more event is needed, just open an issue or a pull request._

Keep in mind that Analytics limit is 200,000 hits per __user__ per day and 500 hits per __session__. For more details, read [Google Analytics Collection Limits and Quotas](https://developers.google.com/analytics/devguides/collection/analyticsjs/limits-quotas).

```javascript
  /* [...] */
  gaEventsPlugin: {
    trackingId: 'UA-XXXX-Y',
    eventToTrack: ['play', 'pause', 'stop'],
  }
  /* [...] */
```

## eventMapping

`eventMapping` __optional__ property is a plain Object used to set the [eventAction](https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#eventAction) value for each container event. Default values are event name list listed above. The value can also be a function _(argument value depends on event)_. Object can be partially filled _(merged with default values)_.

```javascript
  /* [...] */
  gaEventsPlugin: {
    trackingId: 'UA-XXXX-Y',
    eventMapping: {
      ready: 'MyReadyEventLabel', // default is 'ready'
      buffering: 'MyBufferingEventLabel', // default is 'buffering'
      bufferfull: 'MyBufferfullEventLabel', // default is 'bufferfull'
      loadedmetadata: 'MyLoadedmetadataEventLabel', // default is 'loadedmetadata'
      play: 'MyPlayEventLabel', // default is 'play'
      seek: 'MySeekEventLabel', // default is 'seek'
      pause: function(p) { return 'pause_at_'+p+'_seconds'; }, // default is 'pause'
      stop: 'MyStopEventLabel', // default is 'stop'
      ended: 'MyEndedEventLabel', // default is 'ended'
      volume: 'MyVolumeEventLabel', // default is 'volume'
      fullscreen: 'MyFullscreenEventLabel', // default is 'fullscreen'
      error: 'MyErrorEventLabel', // default is 'error'
      playbackstate: 'MyPlaybackstateEventLabel', // default is 'playbackstate'
      highdefinitionupdate: 'MyHighdefinitionupdateEventLabel', // default is 'highdefinitionupdate'
      playbackdvrstatechanged: 'MyPlaybackdvrstatechangedEventLabel', // default is 'playbackdvrstatechanged'
    },
  }
  /* [...] */
```

## sendPlayOnce

`sendPlayOnce` __optional__ property is a boolean which indicate if "play" events triggered as the result of "buffer full" during playback are __not__ send to Google Analytics. Default value is `false`. _(default behaviour is to send all "play" events)_

"play" event is trigger most of the cases after a "buffer full" event as the result either autoplay, user click play button or user clicked on seek bar.

But "play" event is also trigger after buffer full during playback (slow connection, etc...) resulting in sending additional "play" events to Google Analytics.

If this option is set to `true`, the "play" event is send only once after video is started, or after a seek. If video pause or stop, then play, the "play" event is send again.

```javascript
  /* [...] */
  gaEventsPlugin: {
    trackingId: 'UA-XXXX-Y',
    sendPlayOnce: true,
  }
  /* [...] */
```

## sendExceptions

`sendExceptions` __optional__ property is a boolean which indicate if container `error` events are send to Google Analytics using [Exception](https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#exception) ("exception" hit type). Default value is `false`. _(default behaviour, if "error" is tracked, is to use "send" hit type like other player events)_

If this option is set to `true`, the 'error' event is automatically added to events to track. (no need to specify 'error' in `eventToTrack` plugin option)

```javascript
  /* [...] */
  gaEventsPlugin: {
    trackingId: 'UA-XXXX-Y',
    sendExceptions: true,
  }
  /* [...] */
```

## sendExceptionsMsg

`sendExceptionsMsg` __optional__ property is a boolean which indicate if resolved error message is send as exception description. Default value is `false`. _(exception description value is "error")_

This option must be used with `sendExceptions`, otherwise is ignored.

__Note:__ this option is disabled by default because error messages may contains sensitive informations.

## progressPercent, progressPercentCategory & progressPercentAction

__Note:__ These options are __ignored__ if player container playback type is __LIVE__. _(duration is unknown)_

`progressPercent` __optional__ property is an Array of percentage values (must be integer), where each value is a video progress event to send to Google Analytics. Default value is `[]`.

`progressPercentCategory` __optional__ property is the [eventCategory](https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#eventCategory) set to send video progress event. Default value is `undefined`, which default to `eventCategory` plugin option value.

`progressPercentAction` __optional__ property is a Function which return the [eventAction](https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#eventAction) set to send video progress event. Default value is `function(i) { return 'progress_' + i + 'p' }`, where `i` argument is the video progress percentage value.

__Note:__ If user seek video past a progress event time range, then the "leaped" event is not send.

```javascript
  /* [...] */
  gaEventsPlugin: {
    trackingId: 'UA-XXXX-Y',
    progressPercent: [25,50,75],
    progressPercentCategory: 'Video percent', // default is 'Video'
    progressPercentAction: function(i) { return i + '%' },
  }
  /* [...] */
```

Event label value used for video progress events is the `eventLabel` plugin option value.

## progressSeconds, progressSecondsCategory & progressSecondsAction

These __optional__ properties are exactly the same as "progress percent" above, but instead is progress duration in seconds. _(except for LIVE, read explanations below)_

`progressSeconds` default value is `[]`.

`progressSecondsCategory` default value is `undefined`, which default to `eventCategory` plugin option value.

`progressSecondsAction` default value is `function(i) { return 'progress_' + i + 's' }`, where `i` argument is the video progress duration value.

If playback type is __LIVE__, then events are send according time elapsed since __play__ event. If video __pause__, __seek__ or __stop__, then events are send again after Nth seconds. _(It use a Timer instead of referring to player position)_

__Note:__ If user seek video past a progress event time range, then the "leaped" event is not send. _(seek is available only if video has DVR feature enabled)_

```javascript
  /* [...] */
  gaEventsPlugin: {
    trackingId: 'UA-XXXX-Y',
    progressSeconds: [10,20,30,40,50],
    progressSecondsCategory: 'Video progress', // default is 'Video'
    progressSecondsAction: function(i) { return i + ' seconds' },
  }
  /* [...] */
```

## progressEachSeconds, progressEachSecondsCategory & progressEachSecondsAction

These __optional__ properties are again exactly the same, but instead send progress event each __N__ seconds.

`progressEachSeconds` must be a positive integer, is the delay in seconds between two events.

`progressEachSecondsCategory` default value is `undefined`, which default to `eventCategory` plugin option value.

`progressEachSecondsAction` default value is `function(i) { return 'progress_' + i + 's' }`, where `i` argument is the video progress duration value.

If playback type is __LIVE__, then events are send according time elapsed since __play__ event. If video __pause__, __seek__ or __stop__, then events are send again each Nth seconds. _(It use a Timer instead of referring to player position)_

__Note:__ If user seek video past a progress event time range, then the "leaped" event is not send. _(seek is available only if video has DVR feature enabled)_

```javascript
  /* [...] */
  gaEventsPlugin: {
    trackingId: 'UA-XXXX-Y',
    progressEachSeconds: 10,
    progressEachSecondsCategory: 'Video progress', // default is 'Video'
    progressEachSecondsAction: function(i) { return i + ' seconds' },
  }
  /* [...] */
```

# External Interface

If tracker name is provided using the `createFieldsObject` plugin option, then `gaEventsTracker()` method is added to Clappr player instance. This method return the Google Analytics [tracker instance](https://developers.google.com/analytics/devguides/collection/analyticsjs/tracker-object-reference) associated to player.

```javascript
var player = new Clappr.Player({
  source: "http://your.video/here.mp4",
  plugins: {
    core: [ClapprGaEventsPlugin],
  },
  gaEventsPlugin: {
    trackingId: 'UA-XXXX-Y',
    createFieldsObject: {
      name: 'MyTrackerName'
    },
  }
});

var tracker = player.gaEventsTracker();
```

# Development

Install dependencies :

```shell
  yarn
```

Start HTTP dev server (http://0.0.0.0:8080) :

```shell
  npm start
```

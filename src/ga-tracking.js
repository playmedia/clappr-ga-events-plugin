// Based on Google Analytics JavaScript Tracking Snippet
// See original @ https://developers.google.com/analytics/devguides/collection/analyticsjs/tracking-snippet-reference

/**
 * Creates a temporary global ga object and lazy loads analytics.js.
 * @function
 * @param {string} Global name of analytics object. Defaults to 'ga'.
 * @param {boolean} Set to true to load the debug version of the analytics.js library.
 * @param {boolean} Set to true to enable trace debugging.
 */
export default function(name='ga', debug, trace) {
  // Preserve renaming support and minification
  let win = window, doc = document, el = 'script'

  // Ensure analytics.js is not already loaded
  if (win[name]) return

  if (trace) {
    win['ga_debug'] = {trace: true}
  }

  // Acts as a pointer to support renaming
  win.GoogleAnalyticsObject = name

  // Creates an initial ga() function
  // The queued commands will be executed once analytics.js loads
  win[name] = function() {
    win[name].q.push(arguments)
  }
  win[name].q = []

  // Sets the time (as an integer) this tag was executed
  // Used for timing hits
  win[name].l = 1 * new Date()

  // Insert script element above the first script element in document
  // (async + https)
  let first = doc.getElementsByTagName(el)[0]
  let script = doc.createElement(el)
  script.src = 'https://www.google-analytics.com/analytics' + (debug ? '_debug.js' : '.js')
  script.async = true
  first.parentNode.insertBefore(script, first)
}

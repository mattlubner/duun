# Duun

#  [![npm version](https://badge.fury.io/js/duun.svg)](http://badge.fury.io/js/duun) [![Build Status](https://travis-ci.org/mattlubner/duun.svg?branch=master)](https://travis-ci.org/mattlubner/duun)

    ``````````````````````````````````````````````````````````````````````````
    ``````````````````````````````````````````` ``````````````````````````````
    ``````````````````````````````````````.:,,,,.`````````````````````````````
    ``````````````````````````````````;+':,,,,,,,,,,.`````````````````````````
    `````````````````````````````.+++++:,,,,,,,,,,,,,,,.``````````````````````
    `````````````````````````:++++++++;::,,,,,,,,,,,,,,,,,,```````````````````
    `````````````````````:++++++++++++':,,,,,,,,,,,,,,,,,,,,,,.```````````````
    `````````````````.++++++++++++++++';,,,,,,,,,,,,,,,,,,,,,,,,,.````````````
    `````````````.++++++++++++++++++++'';,,,,,,,,,,,,,,,,,,,,,,,,,,,,.````````
    `````````.+++++++++++++++++++++++'''';:,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,.````
    `````:++++++++++++++++++++++++++++''''';:,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,`
    .++++++++++++++++++++++++++++++++++'''''';:,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
    ++++++++++++++++++++++++++++++++++++''''''';:,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
    +++++++++++++++++++++++++++++++++''''''''''';;;:,,,,,,,,,,,,,,,,,,,,,,,,,,
    +++++++++'+'+''+'+++'+''''+'''''++'''''''''';';;;:,,,,,,,,,,,,,,,,,,,,,,,,

Duun is an extensible sandbox written in JavaScript for decoupling application components from package dependencies. In essence, Duun provides syntactic sugar for aggregating dependency injection across an entire application.

Use a bundler like [Webpack](http://webpack.github.io) or [Browserify](http://browserify.org) to bring Duun to a browser near you!


## Description
In a nutshell, Duun lets you reduce boilerplate code through creation of a single object that proxies the functionality of numerous distinct components (primarily other packages or components). This is achieved by proxying specific methods of a package onto a Duun via `proxy()`, resulting in context-aware proxy methods on the Duun itself that pass on invocations to the original methods. The resulting Duun can than be passed around your application (and extended, as needed), obviating the need to hard-code `require()` calls with package names. This decouples your application from specific packages, resulting in behavioral-based dependencies, and promotes testing by coalescing dependency injection to a single location for your entire application.

## Installation
Use [`npm`](http://npmjs.com/) to install Duun:

```sh
# in a shell
npm install --save duun
```

## Usage
```js
//////////////
/// app.js ///
//////////////
'use strict';

// get some duun
var Duun = require( 'duun' );

// get some deps
var director = require( 'director' );
var ee = require( 'event-emitter' );
var moment = require( 'moment' );
var request = require( 'superagent' );
var rsvp = require( 'rsvp' );

// do some 'nits
var eventEmitter = ee( {} );
var router = new director.Router( {/* app routes */} );

// make a new Duun object which represents the common functionality that
// should be available to all application components (this is kind of like
// a voluntary sandbox)
var app = module.exports = exports = Duun.create( 'Roy' );

// proxy the event emitter methods on(), off(), once(), and emit() onto
// "app" as app.on(), app.off(), app.once(), and app.emit()
app.proxy( eventEmitter, [
  'on',
  'off',
  'once',
  'emit'
] );

// proxy the entire moment() function onto "app" as app.moment()
app.proxy( moment, {
  moment: moment
} );

// proxy the superagent methods get(), head(), del(), patch(), post(), and
// put() onto "app" as app.xhrGet(), app.xhrHead(), app.xhrDel(),
// app.xhrPatch(), app.xhrPost(), and app.xhrPut() -- be sure to pass
// superagent as the first parameter here, or Duun won't be able to preserve
// the context of the proxied methods ("this" is always set to the first
// parameter)!
app.proxy( request, {
  xhrGet: request.get,
  xhrHead: request.head,
  xhrDel: request.del,
  xhrPatch: request.patch,
  xhrPost: request.post,
  xhrPut: request.put
} );

// proxy the director methods dispatch(), setRoute(), and getRoute() onto
// "app" as app.reroute(), app.redirect(), and app.getCurrentRoute() -- note
// that router.dispatch() and app.reroute() have different signatures!
app.proxy( router, {
  reroute: function ( url ) {
    return router.dispatch( 'on', url );
  },
  redirect: router.setRoute,
  getCurrentRoute: router.getRoute
} );

// proxy the rsvp methods Promise(), all(), hash(), and defer() onto "app" as
// app.Promise(), app.all(), app.hash(), and app.defer() -- Duun can even
// proxy constructors without affecting their behavior!
app.proxy( rsvp, [ 'Promise', 'all', 'hash', 'defer' ] );

// by the way... duun has console-proxying methods built-in!
app.log( 'Hello, IT.' );// -> Roy: Hello, IT.
app.debug( 'Have you tried turning it off and on again?' );// -> Roy: Have you tried turning it off and on again?
app.warn( 'That\'d be trouser food!' );// -> Roy: That'd be trouser food!
app.error( 'Hey! What is Jen doing with the Internet?' );// -> Roy: Hey! What is Jen doing with the Internet?
app.consoleDisable();// disable logging
app.log( '[meekly] I\'m disabled.' );// -> (crickets...)
app.consoleEnable();// re-enable logging
app.log( '...you do know how a button works don\'t you?' );// -> Roy: ...you do know how a button works don't you?

// aside: you can get a "pure" Duun w/o these logger methods by requiring
// 'duun/duun' instead of just 'duun'

// you can of course just add ad-hoc functions directly to app...
app.context = function () {
  return this;
};

// and you can also proxy ad-hoc functions!
app.proxy( {
  isConcussed: false,
  concuss: function ( message ) {
    this.isConcussed = true;
    app.context().log( message || 'Hello, Moss speaking!' );
  }
} );
app.concuss();// -> Roy: Hello, Moss speaking!

```

```js
////////////////
/// stuff.js ///
////////////////
'use strict';

// you can "extend" a duun by creating a duun from another duun...
var sandbox = require( './app' ).create( 'Yo Dawg' );

// you still have access to all the stuff defined above...
sandbox.log( 'We heard you like sandboxes' );// -> Yo Dawg: We heard you like sandboxes
sandbox.concuss( 'So we put a sandbox in your sandbox...' );// -> Yo Dawg: So we put a sandbox in your sandbox...

// if you're feeling particularly ambitious, you can proxy things onto your sandbox object, without affecting the app object (even if it hides a method of the same name)!
sandbox.proxy( {
  isVeryConcussed: false,
  concuss: function ( message ) {
    this.isVeryConcussed = true;
    sandbox.log( message || 'So you can code while you code!' );
  }
} );
sandbox.concuss();// -> Yo Dawg: So you can code while you code!

```

### Alternative Cross-file Usage
Note that the `addInstance() / getInstance()` pattern is not recommended for use within packages intended to be used as dependencies, as there is the possibility of clashes between identically-named Duuns! In such packages, it is recommended to export the created Duun and use relative pathing to require it from other files. If that is undesireable, please fall back to the convention of naming your Duun the same as the package's publically-published name, as this name is both more likely to be unique and more easily predictable.

```js
//////////////////
/// app-alt.js ///
//////////////////
'use strict';

var Duun = require( 'duun' );

/*
 * You can save Duun instances by name for easier retrieval from other files
 * using Duun.addInstance() and Duun.getInstance()
 */

var app = Duun.create( 'unique_app_name' );
Duun.addInstance( app );

```

```js
////////////////////
/// stuff-alt.js ///
////////////////////
'use strict';

var Duun = require( 'duun' );

/*
 * You can now get 'app' by name via Duun.getInstance()
 */

var sandbox = Duun.getInstance( 'unique_app_name' ).create( 'sandbox_name' );

```

### Instance Store Usage
```js
/////////////////////////
/// instance-store.js ///
/////////////////////////
'use strict';

var Duun = require( 'duun' );
var app = Duun.create( 'unique_app_name' );

/*
 * Duun.addInstance() and Duun.getInstance() are also available on sub-duuns,
 * but will use separate object stores. They track objects using their 'name'
 * property, so you can pass any uniquely named object to these methods.
 */

var foo = { name: 'not_so_unique_name' };
app.addInstance( foo );
if ( foo === app.getInstance( 'not_so_unique_name' ) ) {
  // evaluates to true
  app.log( 'true' );
}

var bar = { name: 'not_so_unique_name' };
try {
  app.addInstance( bar );// throws an error
} catch ( err ) {
  app.error( 'caught error:', err );
}

```

### Constructor Usage
```js
//////////////////////
/// constructor.js ///
//////////////////////
'use strict';

var Duun = require( 'duun' );

/*
 * The constructor pattern can also be used with Duun, but not with sub-duuns.
 */

// this will work
var app = new Duun( 'unique_app_name' );

// this *WON'T* work
try {
  var sandbox = new app( 'unique_sandbox_name' );// throws an error
} catch ( err ) {
  app.error( 'caught error:', err );
}

```

## Plugins
Duun plugins are just your regular variety non-gmo objects, except they have a `.duun` property that itself has a `.methods` array, so you don't have to do anything annoying like manually define a list of methods to proxy!

Also, if a Duun plugin has a `.create()` method, Duun will invoke it with a `name` parameter and re-proxy the new instance whenever you extend a Duun! That's how the logger knows the name of its Duun owner.

Currently there are only two Duun plugins, which are both included with Duun out of the box: `duun/core/logger` and `duun/core/registry`. Require `duun/duun` directly to get a vanilla version of Duun without these plugins.


## Open Source
As always, your suggestions, inquiries, constructive criticism, feature requests and pull-requests are welcome! 😝

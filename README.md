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

Duun is an extensible sandbox written in Javascript for decoupling web application components.

Use a bundler like [Webpack](http://webpack.github.io) or [Browserify](http://browserify.org) to bring Duun to a browser near you!


## Description
In a nutshell, Duun lets you reduce boilerplate code through creation of a single object that proxies the functionality of numerous distinct components (such as modules, packages, libraries, etc). This is done by registering a component and it's methods with a Duun object via `duun.proxy()`, which creates context-aware proxy methods on the Duun object itself that pass on invocations to the original component methods.

## Installation
Use [`npm`](http://npmjs.com/) to install Duun:

```sh
# in a shell
npm install --save-dev duun
```

## Usage
```js
//////////////
/// app.js ///
//////////////

'use strict';

// get some deps
var director = require( 'director' );
var Duun = require( 'duun' );
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
var app = module.exports = Duun.create( 'Roy' );

// proxy the event emitter methods on(), off(), once(), and emit() onto
// "app" as app.on(), app.off(), app.once(), and app.emit()
app.proxy( eventEmitter, [ 'on', 'off', 'once', 'emit' ] );

// proxy the entire moment() function onto "app" as app.moment()
app.map( moment, { moment: moment } );

// proxy the superagent methods get(), head(), del(), patch(), post(), and
// put() onto "app" as app.xhrGet(), app.xhrHead(), app.xhrDel(), 
// app.xhrPatch(), app.xhrPost(), and app.xhrPut() -- be sure to pass 
// superagent as the first parameter here, or Duun won't be able to preserve 
// the context of the proxied methods ("this" is always set to the first 
// parameter)!
app.map( request, {
  'xhrGet': request.get,
  'xhrHead': request.head,
  'xhrDel': request.del,
  'xhrPatch': request.patch,
  'xhrPost': request.post,
  'xhrPut': request.put,
} );

// proxy the director methods dispatch(), setRoute(), and getRoute() onto 
// "app" as app.reroute(), app.redirect(), and app.getCurrentRoute() -- note 
// that router.dispatch() and app.reroute() take different arguments!
app.map( router, {
  reroute: function ( url ) { return router.dispatch( 'on', url ); },
  redirect: router.setRoute,
  getCurrentRoute: router.getRoute,
} );

// proxy the rsvp methods Promise(), all(), hash(), and defer() onto "app" as 
// app.Promise(), app.all(), app.hash(), and app.defer() -- Duun can even 
// proxy constructors without affecting their behavior!
app.map( rsvp, [ 'Promise', 'all', 'hash', 'defer' ] );

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

// you can also proxy ad-hoc functions!
var isConcussed = false;
app.proxy( {
  concuss: function ( message ) {
    isConcussed = true;
    app.log( message || 'Hello, Moss speaking!' );
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
var isVeryConcussed = false;
app.proxy( {
  concuss: function ( message ) {
    isVeryConcussed = true;
    app.log( message || 'So you can code while you code!' );
  }
} );
sandbox.concuss();// -> Yo Dawg: So you can code while you code!

```

## Plugins
Duun plugins are just your regular variety non-gmo objects, except they have a `.duun` property that itself has a `.methods` array, so you don't have to do anything annoying like manually define a list of methods to proxy!

Also, if a Duun plugin has a `.create()` method, Duun will invoke it with a `name` parameter and reregister the new instance whenever you extend a Duun! That's how the logger knows the name of its Duun object.

Currently, the only Duun plugin known to the world is `duun/logger`, which is automatically registered! But you know, no one said you can't make more…! ;P

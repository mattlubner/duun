# Duun

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

Duun is an extensible sandbox written in Javascript / CommonJS for decoupling web application components.


## Duun Basics
Duun is written in CommonJS, so be sure to use a bundler like [Webpack](http://webpack.github.io) or [Browserify](http://browserify.org) to get it into the browser! Although it will work just fine in a Node back-end as well.

_**In a shell:**_
```sh
$ npm install --save-dev duun
```

_**app/index.js:**_
```js
var duun = require( 'duun' ) // require the 'duun' module
  .create( 'app' ); // and name this 'duun' instance

// log(), debug(), warn(), and error() are all proxied to console,
// window.console, or nothing if those are both undefined

duun.log( 'hello world' );// prints 'app: hello world'

// this works even if the browser doesn't have console.debug())
duun.debug( 'hello world' );// prints 'app: hello world'

duun.consoleDisable();// disables all logging

// this will do nothing while console is disabled
duun.log( 'hello world' );// does nothing

// register an ad-hoc function with the sandbox
duun.register( {
    awww: function () {
      duun.log( 'yeah!!' );
    }
  } );

// now you can call duun.awww() from anywhere!

duun.awww();// prints 'app: yeah!!'

// require another file for demonstration purposes...
require( './awww' );
```

_**app/awww.js:**_
```js
var duun = require( 'duun' ) // require the 'duun' module
  .create( 'awwwModule' ); // and name this 'duun' instance

// this works so long as the awww function is registered before we got here
duun.awww();// prints 'awwwModule: yeah!!'

```


## 1:1 Shimming
Existing packages can be registered with duun by specifying which methods duun should proxy…

_**example/app.js:**_
```js
var duun = require( 'duun' )
  .create( 'example/app' );

var ee = require( 'event-emitter' );
var eventEmitter = ee( {} );

duun.register( 'emitter', eventEmitter, [
    'on',
    'off',
    'once',
    'emit'
  ] );

// now call duun.on(), duun.off(), duun.once(), and duun.emit() from anywhere!

duun.on( 'test', function ( payload ) {
    duun.log( 'test event received!' );
  } );

require( './module' );
```

_**example/module.js:**_
```js
var duun = require( 'duun' )
  .create( 'example/module' );

duun.emit( 'test' );// prints 'example/app: test event received!'
```


## Complex Shimming
Existing packages can also be registered with duun by specifying a map of duun method names -> plugin method names, or even by passing functions in directly…

_**example2/app.js:**_
```js
var duun = require( 'duun' )
  .create( 'example2/app' );

var director = require( 'director' );
var routes = require( './routes' );
var router = new director.Router(  );

duun.register( 'router', router, {
    reroute: function ( relativeUrl ) {
      // use an ad-hoc function to adapt differing signatures
      return router.dispatch( 'on', relativeUrl );
    },
    redirect: 'setRoute'
  } );

// now call duun.reroute() and duun.redirect() from anywhere!

router.configure( {
    notfound: function () {
      duun.reroute( '/404' );
    }
  } );

router.init( '/' );// prints 'example2/routes: real home route!'
duun.redirect( '/missing' );// prints 'example2/routes: route not found!'
```

_**example2/routes.js:**_
```js
var duun = require( 'duun' )
  .create( 'example2/routes' );

var routes = {
    '/': function () {
      // this works because .reroute() is registered with duun before director
      // is initialized and starts routing
      duun.redirect( '/landing' );
    },
    '/landing': function () {
      duun.log( 'real home route!' );
    },
    '/404': function () {
      duun.log( 'route not found!' );
    }
  };

module.exports = routes;
```


## Using Duun Plugins
Currently, the only Duun plugin available is `duun/logger`, which is already pre-bundled with Duun! But, since you made it this far and are thusly a curious one…

_**example3/app.js:**_
```js
// get a logger-less duun…
var duun = require( 'duun/duun' )
  .create( 'example3/app' );

// get a duun-less logger…
var logger = require( 'duun/logger' );

// duun/logger is a fancy-pants _duuned_ plugin, so not only does it tell
// duun which methods to proxy (via logger.duun()), it also gets duun to pass
// duun.name to its logger.create() factory (via logger.duuned()). Way rad!
duun.register( 'logger', logger );

// now call duun.log(), duun.debug(), duun.warn(), and duun.error() from
// anywhere… just like before, but… exactly the same, actually!
```


## Authoring Duun Plugins
_Perhaps I'll write some docs on writing Duun plugins in the near future, but for now, feel free to take a look at `logger.js`! :P_

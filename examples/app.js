'use strict';

// get some duun
var Duun = require( '../' );

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

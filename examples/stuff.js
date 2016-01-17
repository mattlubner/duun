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
    this.log( message || 'So you can code while you code!' );
  }
} );
sandbox.concuss();// -> Yo Dawg: So you can code while you code!

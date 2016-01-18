'use strict';

var Duun = require( '../' );

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

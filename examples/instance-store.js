'use strict';

var Duun = require( '../' );
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

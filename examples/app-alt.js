'use strict';

var Duun = require( '../' );

/*
 * You can save Duun instances by name for easier retrieval from other files
 * using Duun.addInstance() and Duun.getInstance()
 */

var app = Duun.create( 'unique_app_name' );
Duun.addInstance( app );

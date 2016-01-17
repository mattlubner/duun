'use strict';

var Duun = require( '../' );

/*
 * You can now get 'app' by name via Duun.getInstance()
 */

var sandbox = Duun.getInstance( 'unique_app_name' ).create( 'sandbox_name' );

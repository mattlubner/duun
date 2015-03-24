'use strict';

var duun = require( './duun' );
var logger = require( './logger' );

// pre-register built-in 'logger' plugin
duun.register( 'logger', logger );

module.exports = duun;

'use strict';

var Duun = module.exports = exports = require( './duun' );

var logger = require( './logger' );
Duun.registerCorePlugin( logger );

var Manager = require( './manager' );
Duun.registerCorePlugin( Manager );

delete Duun.registerCorePlugin;

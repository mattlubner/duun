'use strict';

var Duun = module.exports = exports = require( './duun' );

var logger = require( './logger' );
Duun.registerCorePlugin( logger );

delete Duun.registerCorePlugin;

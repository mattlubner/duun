'use strict';

var Duun = module.exports = exports = require( './duun' );

var Logger = require( './logger' );
Duun.registerCorePlugin( Logger );

var Manager = require( './manager' );
Duun.registerCorePlugin( Manager );

delete Duun.registerCorePlugin;

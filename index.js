'use strict';

var Duun = require( './duun' );

var Logger = require( './logger' );
Duun.registerCorePlugin( Logger );

var Manager = require( './manager' );
Duun.registerCorePlugin( Manager );

delete Duun.registerCorePlugin;

module.exports = Duun;

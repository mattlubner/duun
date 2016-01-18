'use strict';

var Duun = require( './duun' );
var Logger = require( './core/logger' );
var Manager = require( './core/manager' );
var proxy = require( './core/proxy' );

function AugmentedDuun() {
  Duun.apply( this, arguments );
}

AugmentedDuun.prototype = Object.create( Duun.prototype );
AugmentedDuun.prototype.constructor = AugmentedDuun;
AugmentedDuun.prototype.plugins = [
  Logger,
  Manager
];

AugmentedDuun.create = Duun.create;
AugmentedDuun.plugins = [];

// proxy.call( AugmentedDuun, Logger );
proxy.call( AugmentedDuun, Manager );

module.exports = AugmentedDuun;

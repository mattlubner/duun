'use strict';

var Duun = require( './duun' );
var Logger = require( './core/logger' );
var proxy = require( './core/proxy' );
var Registry = require( './core/registry' );

function AugmentedDuun() {
  Duun.apply( this, arguments );
}

AugmentedDuun.prototype = Object.create( Duun.prototype );
AugmentedDuun.prototype.constructor = AugmentedDuun;
AugmentedDuun.prototype.plugins = [
  Logger,
  Registry
];

AugmentedDuun.create = Duun.create;
AugmentedDuun.plugins = [];

proxy.call( AugmentedDuun, Registry );

module.exports = AugmentedDuun;

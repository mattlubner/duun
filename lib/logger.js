/* global console: true */
'use strict';

// duun prototypical object
var logger = {};


logger.duun = function () {
  // array of functions for duun to map to logger
  return [
    'log',
    'debug',
    'warn',
    'error',
    'consoleDisable',
    'consoleEnable'
  ];
};

logger.duuned = function () {
  // array of arguments for duun to pass to logger.create()
  return [
    'name'
  ];
};



function noop () {}

function proxyWrite ( outputFn ) {
  return function () {
    return this.write.call( this, outputFn, arguments );
  };
}



var console = console || {};
var log   = ( console.log   || noop );
var debug = ( console.debug || log );
var warn  = ( console.warn  || log );
var error = ( console.error || log );



logger.write = function ( outputFn, args ) {
  if ( 'string' === typeof args[ 0 ] ) {
    // first arg is a string, so simply prepend it with 'name: '
    args[ 0 ] = this.name + ': ' + args[ 0 ];// jshint ignore:line
  } else {
    // fallback that would break printf-style %s parsing of first arg
    args = Array.prototype.slice.call( args );
    args.unshift( this.name + ':' );// jshint ignore:line
  }
  return outputFn.apply( console || {}, args );
};

logger.consoleDisable = function () {
  logger.log   = noop;
  logger.debug = noop;
  logger.warn  = noop;
  logger.error = noop;
};

logger.consoleEnable = function () {
  logger.log   = proxyWrite( log );
  logger.debug = proxyWrite( debug );
  logger.warn  = proxyWrite( warn );
  logger.error = proxyWrite( error );
};

logger.consoleEnable();



logger.create = function ( name ) {
  return Object.create( logger, {
      name: { value: name }
    } );
};

module.exports = logger;

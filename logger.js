/* global console: true, window: true */
'use strict';



function noop () {}

function proxyWrite ( outputFn ) {
  return function () {
    return this.write.call( this, outputFn, arguments );
  };
}

// duun prototypical object
// NOTE: this is NOT a constructor; for module-level dependency injection!
function logger ( _console ) {
  // get a console
  if ( _console ) {
    logger.console = _console;
  } else if ( 'undefined' !== typeof window ) {
    logger.console = window.console || {};
  } else {
    logger.console = console || {};
  }
  // configure the console methods
  logger.consoleEnable();
  // return the module's export (which is logger)
  return logger;
}



Object.defineProperty( logger, 'duun', { value: {}, writable: true } );
Object.defineProperty( logger.duun, 'methods', { value: [
  'log',
  'debug',
  'warn',
  'error',
  'consoleDisable',
  'consoleEnable',
] } );



logger.write = function ( outputFn, args ) {
  if ( 'string' === typeof args[ 0 ] ) {
    // first arg is a string, so simply prepend it with 'name: '
    args[ 0 ] = this.name + ': ' + args[ 0 ];// jshint ignore:line
  } else {
    // fallback that would break printf-style %s parsing of first arg
    args = Array.prototype.slice.call( args );
    args.unshift( this.name + ':' );// jshint ignore:line
  }
  return outputFn.apply( logger.console, args );
};

logger.consoleDisable = function () {
  logger.log   = noop;
  logger.debug = noop;
  logger.warn  = noop;
  logger.error = noop;
};

logger.consoleEnable = function () {
  logger.log   = proxyWrite( logger.console.log   || noop );
  logger.debug = proxyWrite( logger.console.debug || noop );
  logger.warn  = proxyWrite( logger.console.warn  || noop );
  logger.error = proxyWrite( logger.console.error || noop );
};



logger.create = function ( name ) {
  return Object.create( logger, {
      name: { value: name },
      console: { value: undefined }
    } );
};



module.exports = logger();

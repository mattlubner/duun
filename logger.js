/* global console: true, window: true */
'use strict';

/**
 * The globally-detected console for this JavaScript environment.
 * @type {Object}
 */
var globalConsole = ( function () {
  if ( typeof window !== 'undefined' ) {
    return window.console || null;
  }
  return console || null;
} )();

/**
 * The currently-active console for this module.
 * @type {Object}
 */
var activeConsole = globalConsole;

/**
 * Noop
 * @void
 */
function noop() {}

/**
 * Write output using the passed output function.
 * @arg  {Function}  outputFn
 * @void
 */
function proxyWrite( outputFn ) {
  return function () {
    return this.write.call( this, outputFn, arguments );
  };
}

/**
 * Logger constructor
 * @arg  {String}  name
 * @constructor
 */
function Logger( name ) {
  Object.defineProperty( this, 'name', { value: name } );
}

/**
 * Logger factory function
 * @return  {Logger}
 */
Logger.prototype.create = Logger.create = function () {
  var instance = Object.create( this.prototype || this );
  Logger.apply( instance, arguments );
  return instance;
};

/**
 * Write output to the console using the given output function.
 * @arg  {Function}  outputFn
 * @arg  {Mixed}  args
 * @void
 */
Logger.prototype.write = function ( outputFn, args ) {
  if ( typeof args[ 0 ] === 'string' ) {
    // first arg is a string, so simply prepend it with 'name: '
    args[ 0 ] = this.name + ': ' + args[ 0 ];// jshint ignore:line
  } else {
    // fallback that would break printf-style %s parsing of first arg
    args = Array.prototype.slice.call( args );
    args.unshift( this.name + ':' );// jshint ignore:line
  }
  return outputFn.apply( activeConsole, args );
};

/**
 * Map output functions to noop.
 * @void
 */
Logger.prototype.consoleDisable = Logger.consoleDisable = function () {
  Logger.prototype.log = noop;
  Logger.prototype.warn = noop;
  Logger.prototype.error = noop;
  Logger.prototype.debug = noop;
};

/**
 * Map output functions to the active console's equivalent functions.
 * @void
 */
Logger.prototype.consoleEnable = Logger.consoleEnable = function () {
  Logger.prototype.log = proxyWrite( activeConsole.log || noop );
  Logger.prototype.warn = proxyWrite( activeConsole.warn || noop );
  Logger.prototype.error = proxyWrite( activeConsole.error || noop );
  Logger.prototype.debug = proxyWrite( activeConsole.debug || noop );
};

/**
 * Dependency-inject a console (for testing).
 * @arg  {Object}  console
 * @void
 */
Logger.inject = function ( dependencies ) {
  if ( dependencies.console ) {
    activeConsole = dependencies.console || globalConsole;
    if ( Logger.prototype.log === noop ) {
      Logger.consoleDisable();
    } else {
      Logger.consoleEnable();
    }
  }
};

/**
 * Duuned plugin methods.
 * @type {Array}
 */
Object.defineProperty( Logger.prototype, 'duun', {
  value: Object.create( null, {
    methods: {
      value: [
        'log',
        'debug',
        'warn',
        'error',
        'consoleDisable',
        'consoleEnable'
      ]
    }
  } )
} );

// Start module w/ enabled console
Logger.consoleEnable();

module.exports = Logger;

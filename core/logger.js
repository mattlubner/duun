/* global console: true, window: true */
'use strict';

/**
 * Get the globally-detected console for this JavaScript environment.
 * @returns {Object}
 */
function getGlobalConsole() {
  if ( typeof window !== 'undefined' ) {
    return window.console || null;
  }
  return console || null;
}

/**
 * Duuned plugin methods.
 * @type {Array}
 */
var duunPluginProperties = Object.create( null, {
  methods: { value: [
    'log',
    'debug',
    'warn',
    'error',
    'disableLogger',
    'enableLogger',
    'consoleDisable', // deprecated
    'consoleEnable'   // deprecated
  ] }
} );

/**
 * Write output to the console using the given output function.
 * @arg  {String}  methodName
 * @arg  {Mixed}  args
 * @void
 */
function output( methodName, args ) {
  if ( typeof args[ 0 ] === 'string' ) {
    // first arg is a string, so simply prepend it with 'name: '
    args[ 0 ] = this.name + ': ' + args[ 0 ];// jshint ignore:line
  } else {
    // fallback that would break printf-style %s parsing of first arg
    args = Array.prototype.slice.call( args );
    args.unshift( this.name + ':' );// jshint ignore:line
  }
  this.console[ methodName ].apply( this.console, args );
}

function log() {
  if ( ! this.isEnabled ) return;//eslint-disable-line curly
  this.output( 'log', arguments );
}

function debug() {
  if ( ! this.isEnabled ) return;//eslint-disable-line curly
  this.output( 'debug', arguments );
}

function warn() {
  if ( ! this.isEnabled ) return;//eslint-disable-line curly
  this.output( 'warn', arguments );
}

function error() {
  if ( ! this.isEnabled ) return;//eslint-disable-line curly
  this.output( 'error', arguments );
}

function disableLogger() {
  // this.isEnabled = false;
  Object.defineProperties( this, {
    isEnabled: { value: false, configurable: true }
  } );
}

function enableLogger() {
  delete this.isEnabled;
}

/**
 * Dependency-inject a console (for testing).
 * @arg  {Object}  deps
 * @void
 */
function inject( deps ) {
  if ( deps.console ) {
    this.console = deps.console;
  }
}

/**
 * reset dependency-injected dependencies.
 * @arg  {Object}  deps
 * @void
 */
function uninject( deps ) {
  if ( deps.console ) {
    this.console = getGlobalConsole();
  }
}

/**
 * Logger constructor
 * @arg  {String}  name
 * @constructor
 */
function Logger( name ) {
  // guard against new-less invocation
  if ( ! ( this instanceof Logger ) ) {
    return new Logger( name );
  }

  // children should inherit everything :P
  this.prototype = this;

  // define special properties
  Object.defineProperties( this, {
    name: { value: name }
  } );

  // simplify fn.call() usage (eg. in create() below)
  return this;
}

/**
 * Logger factory function
 * @arg  {String}  name
 * @return  {Logger}
 */
function createLogger( name ) {
  return Logger.call( Object.create( this.prototype ), name );
}

Object.defineProperties( Logger.prototype, {
  output: { value: output },

  log: { value: log, enumerable: true },
  create: { value: createLogger, enumerable: true },
  debug: { value: debug, enumerable: true },
  warn: { value: warn, enumerable: true },
  error: { value: error, enumerable: true },

  disableLogger: { value: disableLogger, enumerable: true },
  enableLogger: { value: enableLogger, enumerable: true },

  // deprecated
  consoleDisable: { value: disableLogger },
  consoleEnable: { value: enableLogger },

  inject: { value: inject, enumerable: true },
  uninject: { value: uninject, enumerable: true },

  isEnabled: { value: true },
  console: { value: getGlobalConsole(), writable: true },
  duun: { value: duunPluginProperties }
} );

Logger.inject = function () {
  inject.apply( Logger.prototype, arguments );
};

Logger.uninject = function () {
  uninject.apply( Logger.prototype, arguments );
};

Logger.create = createLogger;

module.exports = Logger;

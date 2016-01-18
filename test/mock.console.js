'use strict';

var sinon = require( 'sinon' );

exports.history = [];
exports.spies = {
  log: sinon.spy(),
  debug: sinon.spy(),
  warn: sinon.spy(),
  error: sinon.spy()
};
exports.logSpy = exports.spies.log;
exports.debugSpy = exports.spies.debug;
exports.warnSpy = exports.spies.warn;
exports.errorSpy = exports.spies.error;

exports.log = function () {
  this.history.push( Array.prototype.slice.call( arguments ) );
  this.spies.log();
};

exports.debug = function () {
  this.history.push( Array.prototype.slice.call( arguments ) );
  this.spies.debug();
};

exports.warn = function () {
  this.history.push( Array.prototype.slice.call( arguments ) );
  this.spies.warn();
};

exports.error = function () {
  this.history.push( Array.prototype.slice.call( arguments ) );
  this.spies.error();
};

exports.tail = function () {
  return this.history.slice( -1 ).pop();
};

exports.resetSpies = function () {
  this.spies.log.reset();
  this.spies.debug.reset();
  this.spies.warn.reset();
  this.spies.error.reset();
};

exports.resetSpies();

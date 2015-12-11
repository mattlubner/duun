'use strict';

var sinon = require( 'sinon' );

exports.history = [];
exports.logSpy = sinon.spy();
exports.debugSpy = sinon.spy();
exports.warnSpy = sinon.spy();
exports.errorSpy = sinon.spy();

exports.log = function () {
  this.history.push( Array.prototype.slice.call( arguments ) );
  this.logSpy();
};

exports.debug = function () {
  this.history.push( Array.prototype.slice.call( arguments ) );
  this.debugSpy();
};

exports.warn = function () {
  this.history.push( Array.prototype.slice.call( arguments ) );
  this.warnSpy();
};

exports.error = function () {
  this.history.push( Array.prototype.slice.call( arguments ) );
  this.errorSpy();
};

exports.tail = function () {
  return this.history.slice( -1 ).pop();
};

exports.resetSpies = function () {
  this.logSpy.reset();
  this.debugSpy.reset();
  this.warnSpy.reset();
  this.errorSpy.reset();
};

exports.resetSpies();

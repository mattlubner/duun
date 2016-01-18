/* global describe, it */
'use strict';


var chai = require( 'chai' );
var assert = chai.assert;
var mockConsole = require( './mock.console' );

var Logger = require( '../logger' );
var Duun = require( '../duun' );

Logger.inject( {
  console: mockConsole
} );


describe( 'logger', function () {

  it( 'should proxy all calls to the console while enabled', function () {
    [ 'log', 'debug', 'warn', 'error' ].forEach( function ( methodName ) {
      mockConsole.resetSpies();
      var aLogger = Logger.create( 'a logger' );
      aLogger[ methodName ]( 'a message to log' );
      assert( mockConsole.spies[ methodName ].calledOnce );
    } );
  } );

  it( 'should not proxy calls to the console while disabled', function () {
    [ 'log', 'debug', 'warn', 'error' ].forEach( function ( methodName ) {
      mockConsole.resetSpies();
      var aLogger = Logger.create( 'a logger' );
      aLogger.disableLogger();
      aLogger[ methodName ]( 'a message to log' );
      assert.equal( mockConsole.spies[ methodName ].callCount, 0 );
    } );
  } );

  it( 'should prepend logging output with its instance\'s name', function () {
    [ 'log', 'debug', 'warn', 'error' ].forEach( function ( methodName ) {
      var aLogger = Logger.create( 'a logger' );
      var anotherLogger = Logger.create( 'another logger' );
      aLogger[ methodName ]( 'a message to log' );
      var aLoggerOutput = mockConsole.tail();
      anotherLogger[ methodName ]( 'a message to log' );
      var anotherLoggerOutput = mockConsole.tail();
      assert.equal( 'a logger: a message to log', aLoggerOutput );
      assert.equal( 'another logger: a message to log', anotherLoggerOutput );
    } );
  } );

  describe( 'while duuned', function () {

    it( 'should create a new instance of duun/logger when a new duun is created', function () {
      var duun1 = Duun.create( 'a duun' );
      var logger1 = Logger.create( 'a logger' );
      duun1.register( logger1 );
      var duun2 = duun1.create( 'another duun' );
      logger1.log( '' );
      var aLoggerOutput = mockConsole.tail();
      duun2.log( '' );
      var aDuunOutput = mockConsole.tail();
      assert.notEqual( aLoggerOutput, aDuunOutput );
      assert.equal( 'a logger: ', aLoggerOutput );
      assert.equal( 'another duun: ', aDuunOutput );
    } );

  } );// end of 'while duuned' description

} );// end of 'logger' description

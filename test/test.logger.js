'use strict';


var assert = require( 'assert' );
var sinon = require( 'sinon' );


var mockConsole = {
  history: [],
  logSpy: sinon.spy(),
  log: function () {
    this.history.push( Array.prototype.slice.call( arguments ) );
    this.logSpy();
  },
  debugSpy: sinon.spy(),
  debug: function () {
    this.history.push( Array.prototype.slice.call( arguments ) );
    this.debugSpy();
  },
  warnSpy: sinon.spy(),
  warn: function () {
    this.history.push( Array.prototype.slice.call( arguments ) );
    this.warnSpy();
  },
  errorSpy: sinon.spy(),
  error: function () {
    this.history.push( Array.prototype.slice.call( arguments ) );
    this.errorSpy();
  },
  tail: function () {
    return this.history.slice( -1 ).pop();
  },
  resetSpies: function () {
    this.logSpy.reset();
    this.debugSpy.reset();
    this.warnSpy.reset();
    this.errorSpy.reset();
  }
};

mockConsole.resetSpies();


var logger = require( '../logger' )( mockConsole );
var Duun = require( '../duun' );


describe( 'logger', function () {


  describe( 'creation', function () {

    it( 'should prepend all log() calls with its instance\'s name', function () {
      logger.consoleEnable();
      var aLogger = logger.create( 'a logger' );
      var anotherLogger = logger.create( 'another logger' );
      aLogger.log( 'a message to log' );
      var aLoggerOutput = mockConsole.tail();
      anotherLogger.log( 'a message to log' );
      var anotherLoggerOutput = mockConsole.tail();
      assert.equal( 'a logger: a message to log', aLoggerOutput );
      assert.equal( 'another logger: a message to log', anotherLoggerOutput );
    } );

    it( 'should prepend all debug() calls with its instance\'s name', function () {
      logger.consoleEnable();
      var aLogger = logger.create( 'a logger' );
      var anotherLogger = logger.create( 'another logger' );
      aLogger.debug( 'a message to debug' );
      var aLoggerOutput = mockConsole.tail();
      anotherLogger.debug( 'a message to debug' );
      var anotherLoggerOutput = mockConsole.tail();
      assert.equal( 'a logger: a message to debug', aLoggerOutput );
      assert.equal( 'another logger: a message to debug', anotherLoggerOutput );
    } );

    it( 'should prepend all warn() calls with its instance\'s name', function () {
      logger.consoleEnable();
      var aLogger = logger.create( 'a logger' );
      var anotherLogger = logger.create( 'another logger' );
      aLogger.warn( 'a message to warn' );
      var aLoggerOutput = mockConsole.tail();
      anotherLogger.warn( 'a message to warn' );
      var anotherLoggerOutput = mockConsole.tail();
      assert.equal( 'a logger: a message to warn', aLoggerOutput );
      assert.equal( 'another logger: a message to warn', anotherLoggerOutput );
    } );

    it( 'should prepend all error() calls with its instance\'s name', function () {
      logger.consoleEnable();
      var aLogger = logger.create( 'a logger' );
      var anotherLogger = logger.create( 'another logger' );
      aLogger.error( 'a message to error' );
      var aLoggerOutput = mockConsole.tail();
      anotherLogger.error( 'a message to error' );
      var anotherLoggerOutput = mockConsole.tail();
      assert.equal( 'a logger: a message to error', aLoggerOutput );
      assert.equal( 'another logger: a message to error', anotherLoggerOutput );
    } );

  } );// end of 'creation' description


  describe( 'proxying', function () {


    describe( 'while enabled', function () {

      it( 'should proxy log() calls to the console', function () {
        logger.consoleEnable();
        mockConsole.resetSpies();
        var aLogger = logger.create( 'a logger' );
        aLogger.log( 'a message to log' );
        assert( mockConsole.logSpy.calledOnce );
      } );

      it( 'should proxy debug() calls to the console', function () {
        logger.consoleEnable();
        mockConsole.resetSpies();
        var aLogger = logger.create( 'a logger' );
        aLogger.debug( 'a message to debug' );
        assert( mockConsole.debugSpy.calledOnce );
      } );

      it( 'should proxy warn() calls to the console', function () {
        logger.consoleEnable();
        mockConsole.resetSpies();
        var aLogger = logger.create( 'a logger' );
        aLogger.warn( 'a message to warn' );
        assert( mockConsole.warnSpy.calledOnce );
      } );

      it( 'should proxy error() calls to the console', function () {
        logger.consoleEnable();
        mockConsole.resetSpies();
        var aLogger = logger.create( 'a logger' );
        aLogger.error( 'a message to error' );
        assert( mockConsole.errorSpy.calledOnce );
      } );

    } );// end of 'while enabled' description


    describe( 'while disabled', function () {

      it( 'should not proxy log() calls to the console', function () {
        logger.consoleDisable();
        mockConsole.resetSpies();
        var aLogger = logger.create( 'a logger' );
        aLogger.log( 'a message to log' );
        assert.equal( 0, mockConsole.logSpy.callCount );
      } );

      it( 'should not proxy debug() calls to the console', function () {
        logger.consoleDisable();
        mockConsole.resetSpies();
        var aLogger = logger.create( 'a logger' );
        aLogger.debug( 'a message to debug' );
        assert.equal( 0, mockConsole.debugSpy.callCount );
      } );

      it( 'should not proxy warn() calls to the console', function () {
        logger.consoleDisable();
        mockConsole.resetSpies();
        var aLogger = logger.create( 'a logger' );
        aLogger.warn( 'a message to warn' );
        assert.equal( 0, mockConsole.warnSpy.callCount );
      } );

      it( 'should not proxy error() calls to the console', function () {
        logger.consoleDisable();
        mockConsole.resetSpies();
        var aLogger = logger.create( 'a logger' );
        aLogger.error( 'a message to error' );
        assert.equal( 0, mockConsole.errorSpy.callCount );
      } );

    } );// end of 'while disabled' description


  } );// end of 'proxying' description


  describe( 'while duuned', function () {

    it( 'should create a new instance of duun/logger when a new duun is created', function () {
      var duun1 = Duun.create( 'a duun' );
      logger.consoleEnable();
      var logger1 = logger.create( 'a logger' );
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

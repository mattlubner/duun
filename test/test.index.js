/* global describe, it */
'use strict';


var chai = require( 'chai' );
var assert = chai.assert;


describe( 'index', function () {

  var Duun = require( '../duun' );
  var Index = require( '../index' );
  var Logger = require( '../logger' );
  var Manager = require( '../manager' );

  var mockConsole = require( './mock.console' );
  Logger.inject( {
    console: mockConsole
  } );

  // check if duun instance is properly initiated
  describe( 'duun', function () {
    it( 'should remain uninitialized', function () {
      // is Duun prototype, not actually a duun instance!
      assert.isFunction( Index );
      assert.notInstanceOf( Index, Duun );
      assert.isFunction( Index.create );
      assert.isUndefined( Index.proxy );
      assert.isUndefined( Index.register );
      assert.isUndefined( Index.registerCorePlugin );
    } );
  } );

  // check that logger is properly registered
  describe( 'logger', function () {
    it( 'should have all mapped functions', function () {
      Logger.duun.methods.forEach( function ( methodName ) {
        assert.property( Index, methodName );
        assert.isFunction( Index[ methodName ] );
      } );
    } );
    it( 'should proxy log() calls to the console while enabled', function () {
      mockConsole.resetSpies();
      var aLogger = Logger.create( 'a logger' );
      aLogger.log( 'a message to log' );
      assert( mockConsole.logSpy.calledOnce );
    } );
    it( 'should not proxy log() calls to the console while disabled', function () {
      mockConsole.resetSpies();
      Logger.consoleDisable();
      var aLogger = Logger.create( 'a logger' );
      aLogger.log( 'a message to log' );
      assert.equal( 0, mockConsole.logSpy.callCount );
      Logger.consoleEnable();
    } );
  } );

  // check that manager is properly registered
  describe( 'manager', function () {
    it( 'should have all mapped functions', function () {
      Manager.duun.methods.forEach( function ( methodName ) {
        assert.property( Index, methodName );
        assert.isFunction( Index[ methodName ] );
      } );
    } );
    it( 'should store and retrieve duun instances by name', function () {
      var duun1 = Index.create( 'a duuny duun' );
      Index.addInstance( duun1 );
      assert.equal( duun1, Index.getInstance( 'a duuny duun' ) );
      assert.deepEqual( duun1, Index.getInstance( 'a duuny duun' ) );
      var duun2 = Index.create( 'another super duuny duun' );
      assert.isDefined( duun2 );
      assert.isUndefined( Index.getInstance( 'another super duuny duun' ) );
    } );
  } );

} );

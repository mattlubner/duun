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

  var index = Index.create( 'global' );

  // check if duun instance is properly initiated
  describe( 'duun/index', function () {
    it( 'should export an augmented version of Duun' );
    it( 'should not alter the duun export after augmentation' );
    it.skip( 'should remain uninitialized', function () {
      // TODO: refactor as needed to support previous test cases
      // OLD: is a prototype, not an instance
      assert.isFunction( Index );
      assert.notInstanceOf( Index, Duun );
      assert.isFunction( Index.create );
      assert.isUndefined( Index.proxy );
      assert.isUndefined( Index.register );
      assert.isUndefined( Index.registerCorePlugin );
    } );
    it.skip( 'should retain create() factory function after initialization', function () {
      // TODO: refactor as needed to support previous test cases
      assert.isNotFunction( index );
      assert.instanceOf( index, Duun );
      assert.isFunction( index.create );
      assert.isDefined( index.proxy );
      assert.isDefined( index.register );
      assert.isUndefined( index.registerCorePlugin );
    } );
  } );

  // check that logger is properly registered
  describe( 'duun/logger', function () {
    it( 'should have all mapped functions', function () {
      Logger.prototype.duun.methods.forEach( function ( methodName ) {
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
  describe( 'duun/manager', function () {
    it( 'should have all mapped functions', function () {
      Manager.prototype.duun.methods.forEach( function ( methodName ) {
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

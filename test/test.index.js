/* global describe, it */
'use strict';


var chai = require( 'chai' );
var assert = chai.assert;


describe( 'index', function () {

  var Duun = require( '../duun' );
  var Index = require( '../index' );
  var Logger = require( '../core/logger' );
  var Manager = require( '../core/manager' );

  var mockConsole = require( './mock.console' );
  Logger.inject( {
    console: mockConsole
  } );

  var duun = Duun.create( 'global' );
  var index = Index.create( 'global' );

  // check if duun instance is properly initiated
  describe( 'duun/index', function () {
    it( 'should remain uninitialized', function () {
      assert.isFunction( Index );
      assert.notInstanceOf( Index, Duun );
      assert.isFunction( Index.create );
    } );
    it( 'should have augmented Duun functionality after initialization', function () {
      assert.instanceOf( index, Index );
      assert.instanceOf( index, Duun );
      assert.isFunction( index.create );
      assert.isFunction( index.proxy );
      assert.isFunction( index.register );
    } );
    it( 'should not alter the duun export after augmentation', function () {
      Logger.prototype.duun.methods.forEach( function ( methodName ) {
        assert.notProperty( Duun, methodName );
        assert.notProperty( duun, methodName );
      } );
      Manager.prototype.duun.methods.forEach( function ( methodName ) {
        assert.notProperty( Duun, methodName );
        assert.notProperty( duun, methodName );
      } );
    } );
    it( 'should not permit registration of plugins onto the exported, uninitialized Duun prototype', function () {
      assert.notProperty( Duun, 'proxy' );
      assert.notProperty( Duun, 'register' );
      assert.notProperty( Index, 'proxy' );
      assert.notProperty( Index, 'register' );
    } );
  } );

  // check that logger is properly registered
  describe( 'duun/logger', function () {
    it( 'should have plugin functionality mapped onto new instances', function () {
      Logger.prototype.duun.methods.forEach( function ( methodName ) {
        assert.property( index, methodName );
        assert.isFunction( index[ methodName ] );
      } );
    } );
    it( 'should proxy log() calls to the console while enabled', function () {
      mockConsole.resetSpies();
      index.log( 'a message to log' );
      assert( mockConsole.logSpy.calledOnce );
    } );
    it( 'should not proxy log() calls to the console while disabled', function () {
      mockConsole.resetSpies();
      index.disableLogger();
      index.log( 'a message to log' );
      assert.equal( mockConsole.logSpy.callCount, 0 );
      index.enableLogger();
    } );
  } );

  // check that manager is properly registered
  describe( 'duun/manager', function () {
    it( 'should have plugin functionality mapped onto library', function () {
      Manager.prototype.duun.methods.forEach( function ( methodName ) {
        assert.property( Index, methodName );
        assert.isFunction( Index[ methodName ] );
      } );
    } );
    it( 'should have plugin functionality mapped onto new instances', function () {
      Manager.prototype.duun.methods.forEach( function ( methodName ) {
        assert.property( index, methodName );
        assert.isFunction( index[ methodName ] );
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

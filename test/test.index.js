/* global describe, it */
'use strict';


var chai = require( 'chai' );
var assert = chai.assert;


describe( 'index', function () {

  var Duun = require( '../duun' );
  var Index = require( '../index' );
  var Logger = require( '../logger' );
  var Manager = require( '../manager' );

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
  } );

  // check that manager is properly registered
  describe( 'manager', function () {
    it( 'should have all mapped functions', function () {
      Manager.duun.methods.forEach( function ( methodName ) {
        assert.property( Index, methodName );
        assert.isFunction( Index[ methodName ] );
      } );
    } );
  } );

} );

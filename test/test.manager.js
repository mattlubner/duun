/* global describe, it */
'use strict';


var chai = require( 'chai' );
var assert = chai.assert;


describe( 'manager', function () {

  var Manager = require( '../manager' );

  describe( 'constructors', function () {
    it( 'should not be usable as a library', function () {
      assert.isFunction( Manager );
      assert.isNotFunction( Manager.addInstance );
      assert.isNotFunction( Manager.getInstance );
    } );
    it( 'should export a working constructor function', function () {
      assert.isFunction( Manager );
      var testman = new Manager( 'test' );
      assert.instanceOf( testman, Manager );
      assert.isFunction( testman.addInstance );
      assert.isFunction( testman.getInstance );
    } );
    it( 'should export a working instance factory function named .create()', function () {
      assert.isFunction( Manager.create );
      var testman = Manager.create( 'test' );
      assert.instanceOf( testman, Manager );
      assert.isFunction( testman.addInstance );
      assert.isFunction( testman.getInstance );
    } );
  } );

  describe( 'indexing', function () {
    it( 'should store and retrieve instances by their .name property', function () {
      var testman = new Manager( 'test' );
      function TestClass( name ) {
        this.name = name;
      }
      var foo1 = new TestClass( 'foo1' );
      assert.property( foo1, 'name' );
      testman.addInstance( foo1 );
      assert.equal( foo1, testman.getInstance( 'foo1' ) );
      assert.deepEqual( foo1, testman.getInstance( 'foo1' ) );
      var foo2 = new TestClass( 'foo2' );
      assert.property( foo2, 'name' );
      testman.addInstance( foo2 );
      assert.equal( foo2, testman.getInstance( 'foo2' ) );
      assert.deepEqual( foo2, testman.getInstance( 'foo2' ) );
      assert.notEqual( testman.getInstance( 'foo1' ), testman.getInstance( 'foo2' ) );
      assert.notDeepEqual( testman.getInstance( 'foo1' ), testman.getInstance( 'foo2' ) );
    } );
  } );

  describe( 'duun plugin', function () {
    it( 'should have all mapped functions', function () {
      var Index = require( '../' );
      Manager.prototype.duun.methods.forEach( function ( methodName ) {
        assert.property( Index, methodName );
        assert.isFunction( Index[ methodName ] );
      } );
    } );
  } );

} );

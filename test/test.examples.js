/* global describe, it */
'use strict';


var assert = require( 'assert' );


describe( 'readme', function () {

  describe( 'first example (app.js)', function () {
    it( 'should execute without throwing any exceptions', function () {
      assert.doesNotThrow( function () {
        require( '../examples/app.js' );
      } );
    } );
  } );

  describe( 'second example (stuff.js)', function () {
    it( 'should execute without throwing any exceptions', function () {
      assert.doesNotThrow( function () {
        require( '../examples/stuff.js' );
      } );
    } );
  } );

  describe( 'third example (app-alt.js)', function () {
    it( 'should execute without throwing any exceptions', function () {
      assert.doesNotThrow( function () {
        require( '../examples/app-alt.js' );
      } );
    } );
  } );

  describe( 'fourth example (stuff-alt.js)', function () {
    it( 'should execute without throwing any exceptions', function () {
      assert.doesNotThrow( function () {
        require( '../examples/stuff-alt.js' );
      } );
    } );
  } );

  describe( 'fifth example (instance-store.js)', function () {
    it( 'should execute without throwing any exceptions', function () {
      assert.doesNotThrow( function () {
        require( '../examples/instance-store.js' );
      } );
    } );
  } );

  describe( 'sixth example (constructor.js)', function () {
    it( 'should execute without throwing any exceptions', function () {
      assert.doesNotThrow( function () {
        require( '../examples/constructor.js' );
      } );
    } );
  } );

} );

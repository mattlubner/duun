/* global describe, it */
'use strict';


var assert = require( 'assert' );


describe( 'readme examples', function () {

  describe( 'first example', function () {
    it( 'should execute without throwing any exceptions', function () {
      assert.doesNotThrow( function () {
        require( '../examples/app.js' );
      } );
    } );
  } );

  describe( 'second example', function () {
    it( 'should execute without throwing any exceptions', function () {
      assert.doesNotThrow( function () {
        require( '../examples/stuff.js' );
      } );
    } );
  } );

  describe( 'third example', function () {
    it( 'should execute without throwing any exceptions', function () {
      assert.doesNotThrow( function () {
        require( '../examples/app-alt.js' );
      } );
    } );
  } );

  describe( 'fourth example', function () {
    it( 'should execute without throwing any exceptions', function () {
      assert.doesNotThrow( function () {
        require( '../examples/stuff-alt.js' );
      } );
    } );
  } );

  describe( 'fifth example', function () {
    it( 'should execute without throwing any exceptions', function () {
      assert.doesNotThrow( function () {
        require( '../examples/instance-store.js' );
      } );
    } );
  } );

  describe( 'sixth example', function () {
    it( 'should execute without throwing any exceptions', function () {
      assert.doesNotThrow( function () {
        require( '../examples/constructor.js' );
      } );
    } );
  } );

} );

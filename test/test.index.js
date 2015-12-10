'use strict';


var chai = require( 'chai' );
var assert = chai.assert;
var sinon = require( 'sinon' );

var Duun = require( '../duun' );
var Index = require( '../index' );
var Logger = require( '../logger' );

describe( 'index', function() {

  // check if duun instance is properly initiated
  describe( 'duun', function() {
    it( 'should be properly initialized', function() {
      // is a Duun
      assert.isObject( Index );
      assert.instanceOf( Index, Duun );

      // should be given a name
      assert.property( Index, 'name' );
      assert.isString( Index.name );

      // should have a register function
      assert.property( Index, 'register' );
      assert.isFunction( Index.register );
      assert.equal( Index.register, Duun.prototype.register );
    } );
  } );

  // check that logger is properly registered
  describe( 'logger', function() {
    it( 'should have all mapped functions', function() {
      var mappedFunctions = Logger.duun.methods;
      for( var i = 0;i < mappedFunctions.length;i++ ) {
        var funcName = mappedFunctions[ i ];
        assert.property( Index, funcName );
        assert.isFunction( Index[ funcName ] );
      }
    } );
  } );

} );
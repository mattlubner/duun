/* global describe, it */
'use strict';


var chai = require( 'chai' );
var assert = chai.assert;
var Duun = require( '../duun' );


//* Test Mocks ----------------------------------------------------------- *//


var name1 = 'a duun';
var name2 = 'another duun';
var name3 = 'yet another duun';

var rtnMap1 = {
  fn1: 'i am an ad-hoc function',
  fn2: 'i am also an ad-hoc function',
};
var fnMap1 = {
  fn1: function () { return rtnMap1.fn1; },
  fn2: function () { return rtnMap1.fn2; },
};
var mthdList1 = [
  'fn1',
  'fn2',
];

var rtnMap2 = {
  fn1: 'i am a fan of jumbalaya',
};
var fnMap2 = {
  prop1: 'i am a jumbalaya',
  fn1: function () { return rtnMap2.fn1; },
};

var rtnMap3 = {
  prop1: 'i am a fan of jumbalaya',
  fn1: this.prop1,// jshint ignore:line
  fn2: this.prop1,// jshint ignore:line
};
var fnMap3 = {
  prop1: rtnMap3.fn1,
  fn1: function () { return this.prop1; },
  fn2: function () { return this.fn1(); },
};
var mthdList3 = [
  'fn1',
  'fn2',
];

var rtnMap4 = {
  fn1: 'i am a fan of velociraptors',
  fn2: 'i am not a fan of velociraptors',
};
var fnMap4Prototype = {
  fn2: function () { return rtnMap4.fn2; },
};
var fnMap4 = Object.create( fnMap4Prototype );
fnMap4.fn1 = function () { return rtnMap4.fn1; };

var rtnMap5 = {
  prop1Before: 'shake and bake',
  prop1After: 'taladega nights',
};
var fnMap5 = {
  prop1: rtnMap5.prop1Before,
  Fn1: function () { this.prop1 = rtnMap5.prop1After; },
};

var rtnMap6 = {
  fn1: 'make me a sandwich',
  fn2: 'sudo make me a sandwich',
  fn3Wrong: 'sudo make me a sad panda',
};
var plugin6 = {
  duun: { methods: [ 'fn1', 'fn2' ] },
  fn1: function () { return rtnMap6.fn1; },
  fn2: function () { return rtnMap6.fn2; },
  fn3: function () { return rtnMap6.fn3Wrong; },
};

var plugin7 = {
  duun: { methods: [ 'fn1' ] },
  name: 'plugin7',
  create: function ( name ) {
    return Object.create( this, {
      name: { value: name, enumerable: true }
    } );
  },
  fn1: function () { return this.name; },
};


//* Test Helpers --------------------------------------------------------- *//


function assertObjectIsADuun( obj, name ) {
  // obj
  assert.isObject( obj );
  assert.instanceOf( obj, Duun );
  // obj.name
  assert.property( obj, 'name' );
  assert.isString( obj.name );
  assert.equal( obj.name, name );
  // obj.create
  assert.property( obj, 'create' );
  assert.isFunction( obj.create );
  assert.equal( obj.create, Duun.prototype.create );
  // obj.register
  assert.property( obj, 'register' );
  assert.isFunction( obj.register );
  assert.equal( obj.register, Duun.prototype.register );
}

function assertObjectHasMappedFunctions( obj, fnMap, rtnMap ) {
  for ( var funcName in fnMap ) {
    if ( ! fnMap.hasOwnProperty( funcName ) ) {
      continue;
    }
    if ( typeof fnMap[ funcName ] !== 'function' ) {
      continue;
    }
    assert.property( obj, funcName );
    assert.isFunction( obj[ funcName ] );
    assert.equal( obj[ funcName ](), rtnMap[ funcName ] );
  }
}

function assertObjectDoesNotHaveMappedFunctions( obj, fnMap ) {
  for ( var funcName in fnMap ) {
    if ( ! fnMap.hasOwnProperty( funcName ) ) {
      continue;
    }
    assert.notProperty( obj, funcName );
  }
}

function assertObjectHasAllListedMethods( obj, plugin, mthdList, rtnMap ) {
  mthdList.forEach( function ( mthdName ) {
    assert.property( obj, mthdName );
    assert.isFunction( obj[ mthdName ] );
    assert.equal( obj[ mthdName ](), rtnMap[ mthdName ] );
  } );
}

function assertObjectHasNoUnlistedMethods( obj, plugin, mthdList, rtnMap ) {
  for ( var mthdName in obj ) {// jshint ignore:line
    if ( typeof plugin[ mthdName ] !== 'function' ) {
      continue;
    }
    assert.include( mthdList, mthdName );
    assert.property( obj, mthdName );
    assert.isFunction( obj[ mthdName ] );
    assert.equal( obj[ mthdName ](), rtnMap[ mthdName ] );
  }
}


//* Test Cases ----------------------------------------------------------- *//


describe( 'Duun', function () {

  describe( '.create()', function () {
    // SYNTAX: duun.create( name )
    it( 'should create a new Duun object', function () {
      var obj1 = new Duun( name1 );
      assertObjectIsADuun( obj1, name1 );
    } );
    it( 'should still work when invoked on Duun instances', function () {
      var obj1 = Duun.create( name1 );
      var obj2 = obj1.create( name2 );
      assertObjectIsADuun( obj2, name2 );
      assert.isTrue( obj1.isPrototypeOf( obj2 ) );
      var obj3 = obj2.create( name3 );
      assertObjectIsADuun( obj3, name3 );
      assert.isTrue( obj2.isPrototypeOf( obj3 ) );
    } );
  } );// 'create()'

  describe( 'new', function () {
    // SYNTAX: new Duun( name )
    it( 'should work when the module is invoked as a constructor', function () {
      var obj1 = new Duun( name1 );
      assertObjectIsADuun( obj1, name1 );
    } );
    it( 'should fail if a Duun instance is invoked as a constructor', function () {
      var obj1 = new Duun( name1 );
      assert.throws( function () {
        var obj2 = new obj1( name2 );// jshint ignore:line
      } );

    } );
  } );// 'new'

  describe( 'instances', function () {
    it( 'should not be renameable', function () {
      var obj1 = Duun.create( name1 );
      assert.throws( function () {
        obj1.name = name2;
      }, Error );
    } );
    it( 'should not affect other Duun instances', function () {
      var obj1 = Duun.create( name1 );
      var obj2 = Duun.create( name2 );
      assert.notEqual( obj1, obj2 );
      assert.notEqual( obj1.name, obj2.name );
      assert.isFalse( obj1.isPrototypeOf( obj2 ) );
      assert.isFalse( obj2.isPrototypeOf( obj1 ) );
    } );
    it( 'should inherit properties from their parent Duun instance', function () {
      var obj1 = Duun.create( name1 );
      obj1.hello = 'world';
      assert.property( obj1, 'hello' );
      assert.isString( obj1.hello );
      assert.equal( obj1.hello, 'world' );
      var obj2 = obj1.create( name2 );
      assert.notEqual( obj1, obj2 );
      assert.notEqual( obj1.name, obj2.name );
      assert.isTrue( obj1.isPrototypeOf( obj2 ) );
      assert.property( obj2, 'hello' );
      assert.isString( obj2.hello );
      assert.equal( obj2.hello, 'world' );
    } );
  } );// 'instances'

  // SYNTAX: duun.register( fns ) where fns object maps fnName -> function
  describe( '.register( fnMap )', function () {
    var duun = Duun.create( 'global' );
    it( 'should map functions onto the given Duun', function () {
      var duun1 = duun.create( name1 );
      duun1.register( fnMap1 );
      assertObjectHasMappedFunctions( duun1, fnMap1, rtnMap1 );
    } );
    it( 'should ignore non-function properties of the passed map object', function () {
      var duun1 = duun.create( name1 );
      duun1.register( fnMap2 );
      assertObjectHasMappedFunctions( duun1, fnMap2, rtnMap2 );
    } );
    it( 'should preserve the context of mapped functions', function () {
      var duun1 = duun.create( name1 );
      duun1.register( fnMap3 );
      assertObjectHasMappedFunctions( duun1, fnMap3, rtnMap3 );
    } );
    it( 'should preserve the behavior of mapped constructors', function () {
      var duun1 = duun.create( name1 );
      duun1.register( fnMap5 );
      assert.property( duun1, 'Fn1' );
      assert.isFunction( duun1.Fn1 );
      assert.equal( fnMap5.prop1, rtnMap5.prop1Before );
      var artifact1 = new duun1.Fn1();
      assert.instanceOf( artifact1, fnMap5.Fn1 );
      assert.notInstanceOf( artifact1, duun1.Fn1 );
      assert.equal( artifact1.prop1, rtnMap5.prop1After );
    } );
    it( 'should not map functions onto other Duuns', function () {
      var duun1 = duun.create( name1 );
      duun1.register( fnMap1 );
      var duun2 = duun.create( name2 );
      assertObjectDoesNotHaveMappedFunctions( duun2, fnMap1 );
    } );
    it( 'should allow the same functions to be mapped independently onto different Duuns', function () {
      var duun1 = duun.create( name1 );
      duun1.register( fnMap1 );
      assertObjectHasMappedFunctions( duun1, fnMap1, rtnMap1 );
      var duun2 = duun.create( name1 );
      assertObjectDoesNotHaveMappedFunctions( duun2, fnMap1 );
      duun2.register( fnMap1 );
      assertObjectHasMappedFunctions( duun2, fnMap1, rtnMap1 );
    } );
    it( 'should make mapped functions available to new children Duuns', function () {
      var duun1 = duun.create( name1 );
      duun1.register( fnMap1 );
      var duun2 = duun1.create( name2 );
      assertObjectHasMappedFunctions( duun2, fnMap1, rtnMap1 );
    } );
    it( 'should make mapped functions available to new children of children Duuns', function () {
      var duun1 = duun.create( name1 );
      duun1.register( fnMap1 );
      var duun2 = duun1.create( name2 );
      var duun3 = duun2.create( name3 );
      assertObjectHasMappedFunctions( duun3, fnMap1, rtnMap1 );
    } );
    it( 'should make mewly-mapped functions available to existing children Duuns', function () {
      var duun1 = duun.create( name1 );
      var duun2 = duun1.create( name2 );
      duun1.register( fnMap1 );
      assertObjectHasMappedFunctions( duun2, fnMap1, rtnMap1 );
    } );
    it( 'should make mewly-mapped functions available to existing children of children Duuns', function () {
      var duun1 = duun.create( name1 );
      var duun2 = duun1.create( name2 );
      var duun3 = duun2.create( name2 );
      duun1.register( fnMap1 );
      assertObjectHasMappedFunctions( duun3, fnMap1, rtnMap1 );
    } );
    it( 'should prevent overriding of already-mapped functions', function () {
      var duun1 = duun.create( name1 );
      duun1.register( fnMap1 );
      assert.throws( function () {
        duun1.register( fnMap1 );
      }, Error );
    } );
    it( 'should allow overriding of functions mapped from a parent Duun', function () {
      var duun1 = duun.create( name1 );
      duun1.register( fnMap1 );
      var duun2 = duun1.create( name2 );
      assert.doesNotThrow( function () {
        duun2.register( fnMap1 );
      }, Error );
    } );
    it( 'should map prototype-inherited functions on the proxy function map', function () {
      var duun1 = duun.create( name1 );
      duun1.register( fnMap4 );
      assertObjectHasMappedFunctions( duun1, fnMap4, rtnMap4 );
      assertObjectHasMappedFunctions( duun1, fnMap4Prototype, rtnMap4 );
    } );
  } );// '.register( fnMap )'

  describe( '.proxy( fnMap )', function () {
    var duun = Duun.create( 'global' );
    it( 'should behave the same as .register( fnMap )', function () {
      var duun1 = duun.create( name1 );
      duun1.register( fnMap1 );
      assertObjectHasMappedFunctions( duun1, fnMap1, rtnMap1 );
    } );
  } );// '.register( fnMap )'

  describe( '.register( plugin, fnNames )', function () {
    var duun = Duun.create( 'global' );
    it( 'should map only listed methods from another object onto the given Duun', function () {
      var duun1 = duun.create( name1 );
      duun1.register( fnMap1, mthdList1 );
      assertObjectHasAllListedMethods( duun1, fnMap1, mthdList1, rtnMap1 );
      assertObjectHasNoUnlistedMethods( duun1, fnMap1, mthdList1, rtnMap1 );
    } );
    it( 'should preserve the context of the mapped methods', function () {
      var duun1 = duun.create( name1 );
      duun1.register( fnMap3, mthdList3 );
      assertObjectHasMappedFunctions( duun1, fnMap3, rtnMap3 );
    } );
    it( 'should prevent overriding of already-mapped methods', function () {
      var duun1 = duun.create( name1 );
      duun1.register( fnMap1, mthdList1 );
      assert.throws( function () {
        duun1.register( fnMap1, mthdList1 );
      }, Error );
    } );
  } );// '.register( plugin, fnNames )'

  describe( '.register( duunPlugin )', function () {
    var duun = Duun.create( 'global' );
    it( 'should map only Duun-designated methods onto the given Duun', function () {
      var duun1 = duun.create( name1 );
      duun1.register( plugin6 );
      assertObjectHasAllListedMethods( duun1, plugin6, plugin6.duun.methods, rtnMap6 );
      assertObjectHasNoUnlistedMethods( duun1, plugin6, plugin6.duun.methods, rtnMap6 );
    } );
  } );// '.register( duunPlugin )'

  describe( '.register( duunPlugin ).create()', function () {
    var duun = Duun.create( 'global' );
    it( 'should create new instances of registered Duun plugins', function () {
      var duun1 = duun.create( name1 );
      // duun1.register( plugin6 );
      duun1.register( plugin7 );
      assert.equal( duun1.name, duun1.fn1() );
      var duun2 = duun1.create( name2 );
      assert.equal( duun2.name, duun2.fn1() );
    } );
  } );// '.register( duunPlugin )'

} );

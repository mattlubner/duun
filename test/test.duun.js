'use strict';


var assert = require( 'assert' );
var duun = require( '../lib/duun' );


describe( 'duun', function () {


  describe( 'creation', function () {

    // SYNTAX: duun.create( name )
    it( 'should create a duun with it\'s own name', function () {
      var aDuun = duun.create( 'a duun' );
      assert.equal( 'a duun', aDuun.name );
      var anotherDuun = duun.create( 'another duun' );
      assert.equal( 'another duun', anotherDuun.name );
    } );

    it( 'should prevent itself from being renamed', function () {
      var aDuun = duun.create( 'a duun' );
      assert.equal( 'a duun', aDuun.name );
      assert.throws( function () {
        aDuun.name = 'another duun';
      }, Error );
    } );

    it( 'should create a new duun plugins store for each instance', function () {
      var aDuun = duun.create( 'a duun' );
      assert.strictEqual( 0, Object.keys( aDuun.plugins ).length );
      var anotherDuun = duun.create( 'another duun' );
      anotherDuun.plugins.aPlugin = {};
      assert.strictEqual( 0, Object.keys( aDuun.plugins ).length );
    } );

  } );// end of 'creation' description


  describe( 'plugin registration', function () {


    describe( 'of ad-hoc functions', function () {

      // SYNTAX: duun.register( fns ) where fns object maps fnName -> function
      it( 'should proxy duun function names to passed functions', function () {
        duun.register( {
          adHocFunction: function () {
            return 'i am an ad-hoc function';
          }
        } );
        var aDuun = duun.create( 'a duun' );
        assert.equal( 'i am an ad-hoc function', aDuun.adHocFunction() );
      } );

      it( 'should make them available across all duun instances', function () {
        var aDuun = duun.create( 'a duun' );
        aDuun.register( {
          anotherAdHocFunction: function () {
            return 'i am another ad-hoc function';
          }
        } );
        var anotherDuun = duun.create( 'another duun' );
        assert.equal( 'i am another ad-hoc function', anotherDuun.anotherAdHocFunction() );
      } );

      it( 'should prevent overriding of registered functions', function () {
        assert.throws( function () {
          duun.register( {
            adHocFunction: function () {
              return 'i am an ad-hoc function';
            }
          } );
        }, Error );
      } );

      it( 'should not preserve the invocation context of passed functions', function () {
        var adHocObject = {
          aProperty: 'some value',
          adHocFunction: function () {
            return this.aProperty;
          }
        };
        duun.register( {
          yetAnotherAdHocFunction: adHocObject.adHocFunction
        } );
        var aDuun = duun.create( 'a duun' );
        assert.notEqual( 'some value', aDuun.yetAnotherAdHocFunction() );
      } );

      it( 'should ignore prototype-inherited properties on the proxy function map', function () {
        var aPrototypeObject = {
          definitelyDoNotRegisterMe: function () {}
        };
        var aProxyFunctionMap = Object.create( aPrototypeObject );
        duun.register( aProxyFunctionMap );
        var aDuun = duun.create( 'a duun' );
        assert.throws( function () {
          aDuun.aProxyFunctionMap();
        }, Error );
      } );

    } );// end of 'of ad-hoc functions' description


    describe( 'of duun plugins', function () {

      // SYNTAX: duun.register( name, plugin ) where plugin.duun() lists
      // proxyFnNames
      it( 'should proxy duun plugin methods by name', function () {
        var aMockDuunPlugin = {
          duun: function () {
            return [
              'aDuunPluginMethod'
            ];
          },
          aProperty: 'some other value',
          aDuunPluginMethod: function () {
            return this.aProperty;
          }
        };
        duun.register( 'aMockDuunPlugin', aMockDuunPlugin );
        var aDuun = duun.create( 'a duun' );
        assert.equal( 'some other value', aDuun.aDuunPluginMethod() );
      } );

      // SYNTAX: duun.register( name, plugin ) where plugin.duun() maps
      // proxyFnName -> pluginFnName
      it( 'should proxy duun plugin method names to plugin methods', function () {
        var anotherMockDuunPlugin = {
          duun: function () {
            return {
              anotherDuunPluginMethod: 'aDuunPluginMethod'
            };
          },
          anotherProperty: 'some different value',
          aDuunPluginMethod: function () {
            return this.anotherProperty;
          }
        };
        duun.register( 'anotherMockDuunPlugin', anotherMockDuunPlugin );
        var aDuun = duun.create( 'a duun' );
        assert.equal( 'some different value', aDuun.anotherDuunPluginMethod() );
      } );

      it( 'should not allow plugins of the same name to override one-another', function () {
        assert.throws( function () {
          duun.register( 'anotherMockDuunPlugin', {} );
        }, Error );
      } );

      it( 'should create new instances of duuned plugins when a new duun is created', function () {
        var anotherMockDuunedPlugin = {
          duun: function () {
            return [
              'anotherMockDuunedFunction'
            ];
          },
          duuned: function () {
            return [];
          },
          create: function () {
            return Object.create( anotherMockDuunedPlugin, {
              random: { value: Math.random() }
            } );
          },
          anotherMockDuunedFunction: function () {
            return this.random;
          }
        };
        duun.register( 'anotherMockDuunedPlugin', anotherMockDuunedPlugin );
        var aDuun = duun.create( 'a duun' );
        var anotherDuun = duun.create( 'another duun' );
        assert.notEqual( aDuun.anotherMockDuunedFunction(), anotherDuun.anotherMockDuunedFunction() );
      } );

      it( 'should pass duuned properties to new instances of duuned plugins when a new duun is created', function () {
        var mockDuunedPlugin = {
          duun: function () {
            return [
              'aMockDuunedFunction'
            ];
          },
          duuned: function () {
            return [
              'name'
            ];
          },
          create: function ( name ) {
            return Object.create( mockDuunedPlugin, {
              name: { value: name }
            } );
          },
          aMockDuunedFunction: function () {
            return this.name;
          }
        };
        var aMockDuunedPlugin = mockDuunedPlugin.create( 'a mock duuned plugin' );
        assert.equal( 'a mock duuned plugin', aMockDuunedPlugin.aMockDuunedFunction() );
        duun.register( 'mockDuunedPlugin', mockDuunedPlugin );
        var aDuun = duun.create( 'a very special duun' );
        assert.equal( 'a very special duun', aDuun.aMockDuunedFunction() );
        var anotherDuun = duun.create( 'another very special duun' );
        assert.equal( 'another very special duun', anotherDuun.aMockDuunedFunction() );
      } );

    } );// end of 'of duun plugins' description


    describe( 'of shimmed plugins', function () {
      // SYNTAX: duun.register( name, plugin, fns ) where fns lists
      // proxyFnNames
      it( 'should proxy shimmed plugin methods by name', function () {
        var mockPlugin = {
          aMethod: function () {
            return 'some mock value';
          }
        };
        duun.register( 'mockPlugin', mockPlugin, [
            'aMethod'
          ] );
        var aDuun = duun.create( 'a duun' );
        assert.equal( 'some mock value', aDuun.aMethod() );
      } );

      // SYNTAX: duun.register( name, plugin, fns ) where fns maps
      // proxyFnName -> pluginFnName
      it( 'should proxy shimmed plugin method names to plugin methods', function () {
        var mockPlugin = {
          aMethod: function () {
            return 'some other mock value';
          }
        };
        duun.register( 'anotherMockPlugin', mockPlugin, {
          anotherMethod: 'aMethod'
        } );
        var aDuun = duun.create( 'a duun' );
        assert.equal( 'some other mock value', aDuun.anotherMethod() );
      } );

      // SYNTAX: duun.register( name, plugin, fns ) where fns maps
      // proxyFnName -> pluginFnName | adHocFnDef
      it( 'should proxy shimmed plugin method names to plugin methods and passed ad-hoc functions', function () {
        var mockPlugin = {
          aMethod: function () {
            return 'yet another mock value';
          }
        };
        duun.register( 'yetAnotherMockPlugin', mockPlugin, {
          yetAnotherMethod: 'aMethod',
          anAdHocFunction: function () {
            return 'yet another mock value again';
          }
        } );
        var aDuun = duun.create( 'a duun' );
        assert.equal( 'yet another mock value', aDuun.yetAnotherMethod() );
        assert.equal( 'yet another mock value again', aDuun.anAdHocFunction() );
      } );

    } );// end of 'of shimmed plugins' description


  } );// end of 'plugin registration' description


  describe( 'sandbox extension', function () {

    it( 'should not register a plugin globally', function () {
        var aDuun = duun.create( 'a duun' );
        var anotherDuun = duun.create( 'another duun' );
        aDuun.extend( {
          yetAnotherDifferentMethod: function () {
            return 'yet another different mock value';
          }
        } );
        assert.equal( 'yet another different mock value', aDuun.yetAnotherDifferentMethod() );
        assert.throws( function () {
          anotherDuun.yetAnotherDifferentMethod();
        }, Error );
    } );

  } );// end of 'sandbox extension' description


} );// end of 'duun' description

'use strict';



function Duun( name ) {
  Object.defineProperty( this, 'name', { value: name, enumerable: true } );
  var _numPlugins = 0;
  var _plugins = {};
  var plugin;
  if ( this.plugins && this.numPlugins ) {
    for ( _numPlugins = 0; _numPlugins < this.numPlugins; _numPlugins++ ) {
      plugin = this.plugins[ _numPlugins ].create( this.name );
      Object.defineProperty( _plugins, _numPlugins, { value: plugin } );
      this.register( plugin, plugin.duun.methods );
    }
  }
  Object.defineProperty( this, 'numPlugins', { value: _numPlugins, writable: true } );
  Object.defineProperty( this, 'plugins', { value: _plugins, writable: true } );
}

Object.defineProperty( Duun, 'numPlugins', { value: 0, writable: true } );
Object.defineProperty( Duun, 'plugins', { value: [], writable: true } );


// duun object factory
Duun.prototype.create = Duun.create = function () {
  var duun = Object.create( this.prototype || this );
  Duun.apply( duun, arguments );
  return duun;
};



// return a function which proxies the given method, intelligently passing
// either the plugin object or the newly-constructed object, depending on
// whether or not the returned function was invoked with the "new" keyword
function generateProxyMethod( duunObject, pluginObject, methodFunction ) {
  function ProxyMethod() {
    // was this function invoked with the "new" keyword?
    if ( this instanceof ProxyMethod ) {
      // replace the current context with the desired one!
      var _this = Object.create( methodFunction.prototype );
      methodFunction.apply( _this, arguments );
      return _this;

    } else {
      // preserve the plugin method's original context
      return methodFunction.apply( pluginObject, arguments );
    }
  }
  return ProxyMethod;
}



// proxies onto a given duun object a given (plugin) method by name or reference
function mapMethodOntoDuun( duunObject, pluginObject, methodName, methodFunction ) {
  if ( duunObject.hasOwnProperty( methodName ) ) {
    throw new Error( 'The method "' + methodName + '" has already been registered and cannot be overridden!' );
  }
  if ( typeof methodFunction !== 'function' ) {
    // silently skip any non-function properties! :P
    return;
  }
  duunObject[ methodName ] = generateProxyMethod( duunObject, pluginObject, methodFunction );
}



// map methods onto this duun object for later use
Duun.registerCorePlugin = Duun.prototype.proxy = Duun.prototype.register = function registerDuunMethods( pluginObject, proxyMap ) {
  if ( ! proxyMap && pluginObject.duun ) {
    // get designated Duun methods to map onto this Duun
    proxyMap = pluginObject.duun.methods;

    if ( typeof pluginObject.create === 'function' ) {
      pluginObject = pluginObject.create( this.name );
      Object.defineProperty( this.plugins, this.numPlugins++, { value: pluginObject } );
    }
  }

  if ( ! proxyMap ) {
    // map all methods of pluginObject, and also keep it around as
    // pluginObject to preserve the context of mapped methods
    proxyMap = pluginObject;
  }

  // for consistency, null out the plugin object if a falsy value was passed
  if ( ! pluginObject ) {
    pluginObject = null;
  }

  if ( typeof proxyMap !== 'object' ) {
    throw new Error( 'Duun could not find a valid map of plugin functions to proxy!' );
  }

  for ( var methodName in proxyMap ) {
    if ( proxyMap.constructor === Array ) {
      methodName = proxyMap[ methodName ];
      mapMethodOntoDuun( this, pluginObject, methodName, pluginObject[ methodName ] );

    } else {
      // NOTE: we intentionally want to iterate over inherited properties in
      // the proxy function map, b/c to skip them seems arbitrary / misleading
      mapMethodOntoDuun( this, pluginObject, methodName, proxyMap[ methodName ] );
    }
  }
};



module.exports = Duun;

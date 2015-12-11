/**
 * Duun provides a way to combine multiple dependencies into a single exposed
 * object, to ease management of dependencies (and their injection) across
 * large applications.
 */

'use strict';

/**
 * Generate a function which proxies the given method, intelligently passing
 * either the plugin object or the newly-constructed object, depending on
 * whether or not the returned function was invoked with the "new" keyword.
 * @arg  {Object}  pluginObject
 * @arg  {Function}  methodFunction
 * @return  {Function}
 */
function generateProxyMethod( pluginObject, methodFunction ) {
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

/**
 * Proxies onto a Duun a given (plugin) method, either by name or reference.
 * @arg  {Duun}  duunObject
 * @arg  {Object}  pluginObject
 * @arg  {String}  methodName
 * @arg  {Function}  methodFunction
 * @void
 */
function mapMethodOntoDuun( duunObject, pluginObject, methodName, methodFunction ) {
  if ( duunObject.hasOwnProperty( methodName ) ) {
    throw new Error( 'The method "' + methodName + '" has already been registered and cannot be overridden!' );
  }
  if ( typeof methodFunction !== 'function' ) {
    // silently skip any non-function properties! :P
    return;
  }
  duunObject[ methodName ] = generateProxyMethod( pluginObject, methodFunction );
}

/**
 * Duun constructor
 * @arg  {String}  name
 * @constructor
 */
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

/**
 * Number of registered core plugins
 * @type  {Number}
 */
Object.defineProperty( Duun.prototype, 'numPlugins', { value: 0, writable: true } );

/**
 * Registered core plugins
 * @type  {Array}
 */
Object.defineProperty( Duun.prototype, 'plugins', { value: [], writable: true } );

/**
 * Sub-Duun factory function
 * @arg  {String}  name
 * @return  {Duun}
 */
Duun.prototype.create = function ( name ) {
  var duun = Object.create( this );
  Duun.call( duun, name );
  return duun;
};

/**
 * Map methods onto this Duun object for later use.
 * @arg  {Object}  pluginObject
 * @arg  {Object}  [proxyMap]
 * @void
 */
Duun.prototype.proxy = Duun.prototype.register = function ( pluginObject, proxyMap ) {
  if ( ! pluginObject ) {
    throw new Error( 'At least one argument is required!' );
  }

  // check for 'duun' property on pluginObject when no proxyMap is passed
  if ( ! proxyMap ) {
    if ( pluginObject.duun ) {
      proxyMap = pluginObject.duun.methods;

    // check explicitly for 'duun' property on prototype, to support use of
    // Duun.registerCorePlugin()
    } else if ( pluginObject.prototype && pluginObject.prototype.duun ) {
      proxyMap = pluginObject.prototype.duun.methods;
    }

    // if duun.methods was found and pluginObject has a create() function,
    // invoke it!
    if ( proxyMap && typeof pluginObject.create === 'function' ) {
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

/**
 * Duun factory function
 * @arg  {String}  name
 * @return  {Duun}
 */
Duun.create = function ( name ) {
  return Duun.prototype.create.call( Duun.prototype, name );
};

/**
 * Map methods onto the top-level Duun prototype for later use.
 * @arg  {Object}  Plugin
 * @void
 */
Duun.registerCorePlugin = function ( Plugin ) {
  return Duun.prototype.proxy.call( Duun.prototype, Plugin );
};

module.exports = Duun;

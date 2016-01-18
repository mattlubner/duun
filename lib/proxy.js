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
 * Map methods onto this Duun object for later use.
 * @arg  {Object}  pluginObject
 * @arg  {Object}  [proxyMap]
 * @void
 */
function proxy( pluginObject, proxyMap ) {
  if ( ! pluginObject ) {
    throw new Error( 'At least one argument is required!' );
  }

  // check for 'duun' property on pluginObject when no proxyMap is passed
  if ( ! proxyMap ) {
    if ( pluginObject.duun ) {
      proxyMap = pluginObject.duun.methods;

    } else if ( pluginObject.prototype && pluginObject.prototype.duun ) {
      // support .duun property on prototype as well (eg. plugins as classes)
      proxyMap = pluginObject.prototype.duun.methods;
    }

    // if duun.methods was found and pluginObject has a create() function,
    // invoke it!
    if ( proxyMap && typeof pluginObject.create === 'function' ) {
      pluginObject = pluginObject.create( this.name );
      this.plugins.push( pluginObject );
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
}

module.exports = proxy;

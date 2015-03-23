'use strict';

// duun prototypical object
var duun = {};



// these registered plugin instances are shared across all duun instances
duun.plugins = {};

// these plugins get a separate instance created for each duun instance
duun.duunedPlugins = [];

// reduce code footprint for proxying plugin methods through duuns
function proxyFn ( pluginName, methodName ) {
  return function () {
    var plugin = this.plugins[ pluginName ] || duun.plugins[ pluginName ];
    return plugin[ methodName ].apply( plugin, arguments );
  };
}



// PRIVATE: map functions to all duuns (or override on a duun instance)
duun._map = function ( pluginName, fns ) {
  var methodName;
  var method;

  if ( 'object' !== typeof fns ) {
    return this;
  }

  for ( var fnKey in fns ) {
    if ( ! fns.hasOwnProperty( fnKey ) ) {
      // skip prototype-inherited properties
      continue;
    }

    // reset vars for each iteration
    methodName = undefined;
    method = undefined;

    if ( fns.constructor === Array ) {
      // fns is an array of methodNames, so fnKey is the array index
      methodName = fns[ fnKey ];
      method = proxyFn( pluginName, fns[ fnKey ] );

    } else if ( 'string' === typeof fnKey && 'string' === typeof fns[ fnKey ] ) {
      // this fns entry maps duun.methodName => plugin.methodName
      methodName = fnKey;
      method = proxyFn( pluginName, fns[ fnKey ] );

    } else if ( 'string' === typeof fnKey && 'function' === typeof fns[ fnKey ] ) {
      // this fns entry maps duun.methodName => function
      methodName = fnKey;
      method = fns[ fnKey ];
    }

    if ( 'undefined' !== typeof duun[ methodName ] && this === duun ) {
      // do not allow proxy function overriding of global duun plugins
      throw new Error( 'The function "' + methodName + '" has already been registered and cannot be overridden!' );
    }

    this[ methodName ] = method;
  }

  return this;
};

// add a plugin to duun of specified context (e.g., all or this)
duun._register = function ( context, name, plugin, fns ) {
  if ( 'object' === typeof name ) {
    // support ad-hoc sandbox extension (w/o a plugin object)
    context._map( undefined, name );
    return this;
  }

  if ( duun.plugins[ name ] ) {
    // disallow overwriting of registered plugins
    throw new Error( 'The plugin "' + name + '" has already been registered and cannot be overridden!' );
  }

  if ( plugin ) {
    // register 'plugin' as 'name'
    duun.plugins[ name ] = plugin;

    if ( plugin.duuned ) {
      // register 'plugin' as a duuned plugin
      duun.duunedPlugins.push( name );
    }
  }

  if ( ! fns ) {
    // get functions to map from duun to plugin
    fns = plugin.duun();
  }

  // map functions from duun to plugin
  context._map( name, fns );

  return this;
};



// add a plugin to all duuns
duun.register = function ( name, plugin, fns ) {
  return this._register( duun, name, plugin, fns );
};

// add a plugin to this duun
duun.extend = function ( name, plugin, fns ) {
  return this._register( this, name, plugin, fns );
};



// duun object factory
duun.create = function ( name ) {
  // create a new duun
  var newDuun = Object.create( duun, {
      name: { value: name },
      plugins: { writable: true, value: {} }
    } );

  // create new instances of duuned plugins
  for ( var pluginName in duun.duunedPlugins ) {

    if ( ! duun.duunedPlugins.hasOwnProperty( pluginName ) ) {
      // skip prototype-inherited properties
      continue;
    }

    var plugin = duun.plugins[ pluginName ];

    // build arguments to pass to duuned plugin's create() method
    var pluginArgs = [];
    var duunedProperties = plugin.duuned();
    for ( var pluginArg in duunedProperties ) {

      if ( ! duunedProperties.hasOwnProperty( pluginArg ) ) {
        // skip prototype-inherited properties
        continue;
      }

      // add the value of this property to plugin's create() args
      pluginArgs[ pluginArg ] = newDuun[ pluginArg ];
    }

    // create a new instance of this duuned plugin
    newDuun.plugins[ pluginName ] = plugin.create.apply( plugin, pluginArgs );
  }

  return newDuun;
};

// export prototype duun object
module.exports = duun;

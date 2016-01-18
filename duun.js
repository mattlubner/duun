/**
 * Duun provides a way to combine multiple dependencies into a single exposed
 * object, to ease management of dependencies (and their injection) across
 * large applications.
 */

'use strict';

var proxy = require( './lib/proxy' );

/**
 * Duun constructor
 * @arg  {String}  name
 * @constructor
 */
function Duun( name ) {
  // guard against new-less invocation
  if ( ! ( this instanceof Duun ) ) {
    return new Duun( name );
  }

  // children should inherit everything :P
  this.prototype = this;

  // save ref to super-object's plugins
  var superPlugins = this.plugins || [];

  // define special properties
  Object.defineProperties( this, {
    // permanent name of Duun instance
    name: { value: name, enumerable: true },

    // array of registered Duun plugins
    plugins: { value: [], writable: true }
  } );

  // proxy a set of functions onto a Duun instance
  this.proxy = proxy;

  // alias method to proxy
  this.register = proxy;

  // inherit plugins of super-object, but with fresh instances
  superPlugins.forEach( function ( plugin ) {
    // create fresh instance and push onto this.plugins
    this.proxy( plugin );
  }.bind( this ) );

  // simplify fn.call() usage (eg. in create() below)
  return this;
}

/**
 * Duun factory function
 * @arg  {String}  name
 * @return  {Duun}
 */
Duun.prototype.create = Duun.create = function ( name ) {
  return Duun.call( Object.create( this.prototype ), name );
};

module.exports = Duun;

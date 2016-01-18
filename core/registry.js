/**
 * Registry provides a way to create/retrieve objects by name.
 */

'use strict';

/**
 * Registry constructor
 * @arg  [String]  name
 * @constructor
 */
function Registry( name ) {
  Object.defineProperty( this, 'name', { value: name } );
  Object.defineProperty( this, 'instances', { value: Object.create( null ), writable: true } );
}

/**
 * Registry factory function
 * @return  {Registry}
 */
Registry.prototype.create = Registry.create = function () {
  var instance = Object.create( this.prototype || this );
  Registry.apply( instance, arguments );
  return instance;
};

/**
 * Add an instance to the object registry.
 * @arg  {Object}  instance
 * @void
 */
Registry.prototype.addInstance = function ( instance ) {
  if ( typeof instance !== 'object' ) {
    throw new Error( 'No instance was passed' );
  }
  if ( typeof instance.name !== 'string' ) {
    throw new Error( 'Instance has no name!' );
  }
  this.instances[ instance.name ] = instance;
};

/**
 * Get an instance from the object registry.
 * @arg  {String}  name
 * @return  {Object}
 */
Registry.prototype.getInstance = function ( name ) {
  if ( typeof name !== 'string' ) {
    throw new Error( 'No instance name provided!' );
  }
  return this.instances[ name ];
};

/**
 * Duuned plugin methods.
 * @type {Array}
 */
Object.defineProperty( Registry.prototype, 'duun', {
  value: Object.create( null, {
    methods: {
      value: [
        'addInstance',
        'getInstance'
      ]
    }
  } )
} );

module.exports = Registry;

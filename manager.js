/**
 * Instance indexer provides a way to create/retrieve class instances by name.
 */

'use strict';

/**
 * Manager constructor
 * @arg  [String]  name
 * @constructor
 */
function Manager( name ) {
  Object.defineProperty( this, 'name', { value: name } );
  Object.defineProperty( this, 'instances', { value: Object.create( null ), writable: true } );
}

/**
 * Manager factory function
 * @return  {Manager}
 */
Manager.prototype.create = Manager.create = function () {
  var instance = Object.create( this.prototype || this );
  Manager.apply( instance, arguments );
  return instance;
};

/**
 * Add an instance to the managed instance index.
 * @arg  {Object}  instance
 * @void
 */
Manager.prototype.addInstance = function ( instance ) {
  if ( typeof instance !== 'object' ) {
    throw new Error( 'No instance was passed' );
  }
  if ( typeof instance.name !== 'string' ) {
    throw new Error( 'Instance has no name!' );
  }
  this.instances[ instance.name ] = instance;
};

/**
 * Get an instance from the managed instance index.
 * @arg  {String}  name
 * @return  {Object}
 */
Manager.prototype.getInstance = function ( name ) {
  if ( typeof name !== 'string' ) {
    throw new Error( 'No instance name provided!' );
  }
  return this.instances[ name ];
};

/**
 * Duuned plugin methods.
 * @type {Array}
 */
Object.defineProperty( Manager, 'duun', {
  value: Object.create( null, {
    methods: {
      value: [
        'addInstance',
        'getInstance'
      ]
    }
  } )
} );

module.exports = Manager;

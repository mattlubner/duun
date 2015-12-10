'use strict';

/**
 * Instance Manager; Provides a way to create/retrieve class instances by
 * name.
 * @arg  [String]  name
 * @constructor
 */
function Manager( name ) {
  Object.defineProperty( this, 'name', { value: name } );
  Object.defineProperty( this, 'instances', { value: Object.create( null ), writable: true } );
}

Manager.prototype.create = Manager.create = function () {
  var instance = Object.create( this.prototype || this );
  Manager.apply( instance, arguments );
  return instance;
};

Manager.prototype.addInstance = function ( instance ) {
  if ( typeof instance !== 'object' ) {
    throw new Error( 'No instance was passed' );
  }
  if ( typeof instance.name !== 'string' ) {
    throw new Error( 'Instance has no name!' );
  }
  this.instances[ instance.name ] = instance;
};

Manager.prototype.getInstance = function ( name ) {
  if ( typeof name !== 'string' ) {
    throw new Error( 'No instance name provided!' );
  }
  return this.instances[ name ];
};

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

module.exports = exports = Manager;

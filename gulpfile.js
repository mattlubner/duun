'use strict';

var gulp = require( 'gulp' );
var ejs = require( 'gulp-ejs' );
var fs = require( 'fs' );
var rename = require( 'gulp-rename' );
var replace = require( 'gulp-replace' );

gulp.task( 'readme', function () {
  gulp.src( './README.md.ejs' )
  .pipe( ejs( {
    app: fs.readFileSync( './examples/app.js', 'utf8' ),
    stuff: fs.readFileSync( './examples/stuff.js', 'utf8' ),
    app_alt: fs.readFileSync( './examples/app-alt.js', 'utf8' ),
    stuff_alt: fs.readFileSync( './examples/stuff-alt.js', 'utf8' ),
    instance_store: fs.readFileSync( './examples/instance-store.js', 'utf8' ),
    constructor: fs.readFileSync( './examples/constructor.js', 'utf8' )
  } ) )
  .pipe( replace( 'require( \'../\' )', 'require( \'duun\' )' ) )
  .pipe( rename( './README.md' ) )
  .pipe( gulp.dest( './' ) );
} );

gulp.task( 'default', [ 'readme' ] );

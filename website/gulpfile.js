var concat = require('gulp-concat');
var del = require('del');
var Dgeni = require('dgeni');
var gulp = require('gulp');
var less = require('gulp-less');
var markdown = require('gulp-markdown');
var minifyCSS = require('gulp-minify-css');
var path = require('path');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var server = require('gulp-express');

gulp.task('run', function() {
  server.run(['server.js']);
});
